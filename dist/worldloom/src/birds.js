import * as THREE from '../vendor/three.module.min.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { clone as cloneSkeleton } from '../vendor/SkeletonUtils.js';
import { isLiquid, isSolid } from './blocks.js';

export const BIRD_ASSET_URL = new URL(
  '../assets/birds/worldloom-birds.glb',
  import.meta.url,
).href;
export const BIRD_ATLAS_URL = new URL(
  '../assets/birds/worldloom-birds-atlas.png',
  import.meta.url,
).href;

const DEFAULT_LOAD_TIMEOUT_MS = 8_000;
const MIN_SPAWN_RADIUS = 38;
const MAX_DESPAWN_RADIUS = 118;
const MIN_DESTINATION_DISTANCE = 12;
const MAX_FLIGHT_REPLANS = 4;
const TREE_ANCHOR_MULTIPLIER = 14;
const POND_ANCHOR_MULTIPLIER = 4;

const DEFAULT_PROFILE = Object.freeze({
  birdRadius: 56,
  birdCap: 2,
  birdShadowCap: 0,
  birdSpawnChance: 0.15,
});

export const BIRD_BREEDS = Object.freeze({
  ash_sparrow: Object.freeze({
    key: 'ash_sparrow',
    name: 'Ash Sparrow',
    rootName: 'Ash_Sparrow_Asset',
    targetLength: 0.46,
    flightSpeed: 8.2,
    pondPreference: 0.2,
  }),
  pond_azurefin: Object.freeze({
    key: 'pond_azurefin',
    name: 'Pond Azurefin',
    rootName: 'Pond_Azurefin_Asset',
    targetLength: 0.5,
    flightSpeed: 9.4,
    pondPreference: 0.68,
  }),
});

const BREED_LIST = Object.freeze(Object.values(BIRD_BREEDS));

const CLIP_CANDIDATES = Object.freeze({
  perched_tree: Object.freeze(['Perch_Idle', 'Perch', 'Idle']),
  pond_bank: Object.freeze(['Ground_Idle', 'Perch_Idle', 'Idle']),
  pond_peck: Object.freeze(['Pond_Peck', 'Peck', 'Ground_Idle', 'Idle']),
  takeoff: Object.freeze(['Takeoff', 'Fly', 'Flight']),
  cruise: Object.freeze(['Fly', 'Flight', 'Flap']),
  approach: Object.freeze(['Glide', 'Fly', 'Flight']),
  landing: Object.freeze(['Land', 'Landing', 'Perch_Idle', 'Idle']),
});

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function mix32(value) {
  let mixed = value >>> 0;
  mixed = Math.imul(mixed ^ (mixed >>> 16), 0x7feb352d);
  mixed = Math.imul(mixed ^ (mixed >>> 15), 0x846ca68b);
  return (mixed ^ (mixed >>> 16)) >>> 0;
}

export function birdUnitHash(seed, value = 0, salt = 0) {
  return mix32(
    (Number(seed) >>> 0)
      ^ Math.imul(Number(value) | 0, 0x9e3779b9)
      ^ (Number(salt) >>> 0),
  ) / 0x100000000;
}

function nextRandom(bird) {
  bird.randomState = (bird.randomState + 0x6d2b79f5) >>> 0;
  let value = bird.randomState;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 0x100000000;
}

function horizontalDistanceSquared(a, b) {
  const dx = Number(a?.x || 0) - Number(b?.x || 0);
  const dz = Number(a?.z || 0) - Number(b?.z || 0);
  return dx * dx + dz * dz;
}

function finiteVector(vector) {
  return vector
    && Number.isFinite(Number(vector.x))
    && Number.isFinite(Number(vector.y))
    && Number.isFinite(Number(vector.z));
}

function shortestAngle(from, to) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

function normalizedName(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

export function chooseBirdBreed(seed, habitat = 'tree') {
  const roll = birdUnitHash(seed, habitat === 'pond' ? 17 : 11, 0x85ebca6b);
  const azureChance = habitat === 'pond' ? 0.68 : 0.28;
  return roll < azureChance ? BIRD_BREEDS.pond_azurefin : BIRD_BREEDS.ash_sparrow;
}

export function birdSpawnAllowed(context = {}, profile = DEFAULT_PROFILE) {
  const cap = Math.max(0, Math.floor(Number(profile?.birdCap) || 0));
  if (cap <= 0 || context.active === false || context.submerged) return false;
  const dayAmount = clamp(Number(context.dayAmount ?? 1) || 0, 0, 1);
  const rainIntensity = clamp(Number(context.rainIntensity ?? 0) || 0, 0, 1);
  const skyExposure = clamp(Number(context.skyExposure ?? 1) || 0, 0, 1);
  return dayAmount >= 0.44 && rainIntensity < 0.18 && skyExposure > 0.42;
}

/**
 * Spawn safety shared by runtime and tests. Birds are admitted only in the
 * distant rear hemisphere, so a newly-created actor can never pop into view.
 */
export function birdSpawnPositionIsSafe(
  focus,
  forward,
  candidate,
  minimumRadius = MIN_SPAWN_RADIUS,
  maximumRadius = Number.POSITIVE_INFINITY,
) {
  if (!finiteVector(focus) || !finiteVector(forward) || !finiteVector(candidate)) return false;
  const dx = candidate.x - focus.x;
  const dz = candidate.z - focus.z;
  const distance = Math.hypot(dx, dz);
  if (distance < minimumRadius || distance > maximumRadius) return false;
  const forwardLength = Math.hypot(forward.x, forward.z);
  if (forwardLength < 1e-4 || distance < 1e-4) return false;
  const viewDot = (forward.x * dx + forward.z * dz) / (forwardLength * distance);
  return viewDot <= -0.1;
}

/** A deterministic raised flight curve, including a gentle lateral bow. */
export function birdFlightPoint(
  start,
  end,
  progress,
  apexY,
  lateralBend = 0,
  target = new THREE.Vector3(),
) {
  const t = clamp(Number(progress) || 0, 0, 1);
  const inverse = 1 - t;
  const dx = Number(end?.x || 0) - Number(start?.x || 0);
  const dz = Number(end?.z || 0) - Number(start?.z || 0);
  const horizontal = Math.max(1e-5, Math.hypot(dx, dz));
  const bow = Math.sin(t * Math.PI) * (Number(lateralBend) || 0);
  target.set(
    start.x * inverse + end.x * t - dz / horizontal * bow,
    inverse * inverse * start.y + 2 * inverse * t * apexY + t * t * end.y,
    start.z * inverse + end.z * t + dx / horizontal * bow,
  );
  return target;
}

export function birdFlightTangent(
  start,
  end,
  progress,
  apexY,
  lateralBend = 0,
  target = new THREE.Vector3(),
) {
  const t = clamp(Number(progress) || 0, 0, 1);
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const horizontal = Math.max(1e-5, Math.hypot(dx, dz));
  const bowDerivative = Math.cos(t * Math.PI) * Math.PI * (Number(lateralBend) || 0);
  target.set(
    dx - dz / horizontal * bowDerivative,
    2 * (1 - t) * (apexY - start.y) + 2 * t * (end.y - apexY),
    dz + dx / horizontal * bowDerivative,
  );
  if (target.lengthSq() < 1e-8) target.set(0, 0, 1);
  return target.normalize();
}

export function birdTerrainFlightApex(world, start, end, clearance = 4, samples = 10) {
  let apex = Math.max(Number(start?.y) || 0, Number(end?.y) || 0) + 2.2;
  const sampleCount = clamp(Math.floor(Number(samples) || 10), 2, 24);
  if (world?.terrainHeight) {
    for (let index = 1; index < sampleCount; index += 1) {
      const t = index / sampleCount;
      const x = THREE.MathUtils.lerp(start.x, end.x, t);
      const z = THREE.MathUtils.lerp(start.z, end.z, t);
      const terrain = Number(world.terrainHeight(x, z));
      if (Number.isFinite(terrain)) apex = Math.max(apex, terrain + 1 + clearance);
    }
  }
  const distanceLift = Math.min(7.5, Math.hypot(end.x - start.x, end.z - start.z) * 0.075);
  const worldCeiling = Math.max(8, Number(world?.worldHeight) || 96) - 2;
  return Math.min(worldCeiling, apex + distanceLift);
}

function positionReadyAndVisible(world, x, z) {
  if (!world) return false;
  if (world.isPositionReady && !world.isPositionReady(x, z)) return false;
  if (world.hasVisibleTerrainAt && !world.hasVisibleTerrainAt(x, z)) return false;
  if (!world.hasVisibleTerrainAt && world.isPositionRendered && !world.isPositionRendered(x, z)) return false;
  return true;
}

function openBirdSpace(world, x, y, z) {
  const lower = world?.getBlock?.(Math.floor(x), Math.floor(y), Math.floor(z));
  const upper = world?.getBlock?.(Math.floor(x), Math.floor(y + 0.42), Math.floor(z));
  return !isSolid(lower) && !isLiquid(lower) && !isSolid(upper) && !isLiquid(upper);
}

/** Resolve an actually-present leaf surface; deterministic descriptors alone are insufficient after edits. */
export function birdTreePerch(world, tree, seed = 0, target = new THREE.Vector3()) {
  if (!world || !tree || !positionReadyAndVisible(world, tree.rootX, tree.rootZ)) return null;
  const trunkTopY = Math.floor(tree.rootY + tree.trunkHeight - 1);
  if (world.getBlock?.(tree.rootX, trunkTopY, tree.rootZ) !== tree.trunkBlock) return null;

  const baseAngle = birdUnitHash(seed ^ tree.rootX, tree.rootZ, 0x27d4eb2d) * Math.PI * 2;
  const heights = [tree.crownY + 2, tree.crownY + 1, tree.crownY, tree.crownY - 1];
  const radii = [0, tree.isPine ? 1 : 1.35, tree.isPine ? 1.8 : 2];
  for (const y of heights) {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const radius = radii[Math.min(radii.length - 1, Math.floor(attempt / 3))];
      const angle = baseAngle + attempt * 2.3999632297;
      const x = Math.floor(tree.rootX + Math.cos(angle) * radius);
      const z = Math.floor(tree.rootZ + Math.sin(angle) * radius);
      if (!positionReadyAndVisible(world, x, z)) continue;
      if (world.getBlock?.(x, y, z) !== tree.leafBlock) continue;
      if (!openBirdSpace(world, x, y + 1.01, z)) continue;
      target.set(x + 0.5, y + 1.025, z + 0.5);
      return {
        id: `tree:${tree.id}`,
        habitat: 'tree',
        position: target,
        supportX: x,
        supportY: y,
        supportZ: z,
        supportBlock: tree.leafBlock,
        trunkX: tree.rootX,
        trunkY: trunkTopY,
        trunkZ: tree.rootZ,
        trunkBlock: tree.trunkBlock,
        descriptor: tree,
      };
    }
  }
  return null;
}

function pondSurfaceProbe(world, pond) {
  const candidates = [[0, 0]];
  for (let index = 0; index < 8; index += 1) {
    const angle = pond.rotation + index / 8 * Math.PI * 2;
    candidates.push([
      Math.cos(angle) * pond.radiusX * 0.28,
      Math.sin(angle) * pond.radiusZ * 0.28,
    ]);
  }
  for (const [offsetX, offsetZ] of candidates) {
    const x = Math.floor(pond.centerX + offsetX);
    const z = Math.floor(pond.centerZ + offsetZ);
    if (!positionReadyAndVisible(world, x, z)) continue;
    const surface = world.getFluidSurfaceY?.(x, pond.waterY, z);
    if (surface != null && Number.isFinite(Number(surface))) {
      return { x, y: pond.waterY, z, surface: Number(surface) };
    }
  }
  return null;
}

/** Find a dry, walkable bank position while proving that the pond still contains water. */
export function birdPondBank(world, pond, seed = 0, target = new THREE.Vector3()) {
  if (!world || !pond || !positionReadyAndVisible(world, pond.centerX, pond.centerZ)) return null;
  const waterProbe = pondSurfaceProbe(world, pond);
  if (!waterProbe) return null;
  const baseAngle = pond.rotation + birdUnitHash(seed ^ pond.cellX, pond.cellZ, 0x165667b1) * Math.PI * 2;
  for (let attempt = 0; attempt < 16; attempt += 1) {
    const angle = baseAngle + attempt * 2.3999632297;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const ellipseRadius = 1 / Math.sqrt(
      (cosine * cosine) / (pond.radiusX * pond.radiusX)
        + (sine * sine) / (pond.radiusZ * pond.radiusZ),
    );
    const distance = ellipseRadius + 0.9 + (attempt % 3) * 0.42;
    const x = Math.floor(pond.centerX + cosine * distance);
    const z = Math.floor(pond.centerZ + sine * distance);
    if (!positionReadyAndVisible(world, x, z)) continue;
    const terrain = Number(world.terrainHeight?.(x, z));
    if (!Number.isFinite(terrain)) continue;
    const groundY = Math.floor(terrain);
    const groundBlock = world.getBlock?.(x, groundY, z);
    if (!isSolid(groundBlock)) continue;
    if (!openBirdSpace(world, x, groundY + 1.01, z)) continue;
    const neighborSlope = Math.max(
      Math.abs(terrain - Number(world.terrainHeight?.(x + 1, z))),
      Math.abs(terrain - Number(world.terrainHeight?.(x - 1, z))),
      Math.abs(terrain - Number(world.terrainHeight?.(x, z + 1))),
      Math.abs(terrain - Number(world.terrainHeight?.(x, z - 1))),
    );
    if (!Number.isFinite(neighborSlope) || neighborSlope > 1.2) continue;
    target.set(x + 0.5, groundY + 1.025, z + 0.5);
    return {
      id: `pond:${pond.id}:${x},${z}`,
      habitat: 'pond',
      position: target,
      supportX: x,
      supportY: groundY,
      supportZ: z,
      supportBlock: groundBlock,
      waterProbe,
      descriptor: pond,
    };
  }
  return null;
}

function disposeObjectResources(root, extraTexture = null) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set(extraTexture ? [extraTexture] : []);
  root?.traverse?.((node) => {
    if (node.geometry) geometries.add(node.geometry);
    const entries = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of entries) {
      if (!material) continue;
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  textures.forEach((texture) => texture.dispose?.());
  materials.forEach((material) => material.dispose?.());
  geometries.forEach((geometry) => geometry.dispose?.());
}

function configureAtlas(texture, anisotropy = 1) {
  if (!texture) throw new Error('Bird texture atlas is missing');
  texture.name = 'Worldloom bird nearest atlas';
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestMipmapNearestFilter;
  texture.generateMipmaps = true;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = Math.max(1, Math.floor(Number(anisotropy) || 1));
  texture.needsUpdate = true;
  return texture;
}

function geometryTriangleCount(root) {
  const geometries = new Set();
  root?.traverse?.((node) => { if (node.isMesh && node.geometry) geometries.add(node.geometry); });
  let triangles = 0;
  geometries.forEach((geometry) => {
    triangles += geometry.index
      ? geometry.index.count / 3
      : (geometry.getAttribute?.('position')?.count || 0) / 3;
  });
  return Math.round(triangles);
}

function meshDrawCount(root) {
  let draws = 0;
  root?.traverse?.((node) => { if (node.isMesh) draws++ });
  return draws;
}

function findMovablePart(root, words, side = '') {
  const candidates = [];
  root?.traverse?.((node) => {
    if (node === root) return;
    const name = normalizedName(node.name);
    if (!words.some((word) => name.includes(word))) return;
    let score = words.reduce((total, word) => total + (name.includes(word) ? 2 : 0), 0);
    if (side === 'left') score += /(?:left|wingl|legl|_l$|\.l$)/i.test(node.name) ? 6 : 0;
    if (side === 'right') score += /(?:right|wingr|legr|_r$|\.r$)/i.test(node.name) ? 6 : 0;
    if (!side || score >= 6) candidates.push({ node, score });
  });
  candidates.sort((a, b) => b.score - a.score || a.node.name.localeCompare(b.node.name));
  return candidates[0]?.node || null;
}

function captureTransform(node) {
  return node ? {
    position: node.position.clone(),
    rotation: node.rotation.clone(),
    scale: node.scale.clone(),
  } : null;
}

function captureMovableParts(model) {
  const parts = {
    body: findMovablePart(model, ['body', 'torso']),
    head: findMovablePart(model, ['head']),
    leftWing: findMovablePart(model, ['wing'], 'left'),
    rightWing: findMovablePart(model, ['wing'], 'right'),
    tail: findMovablePart(model, ['tail']),
    leftLeg: findMovablePart(model, ['leg', 'foot'], 'left'),
    rightLeg: findMovablePart(model, ['leg', 'foot'], 'right'),
  };
  return {
    ...parts,
    base: Object.fromEntries(
      Object.entries(parts).map(([key, node]) => [key, captureTransform(node)]),
    ),
    modelPosition: model.position.clone(),
  };
}

function clipMatchesBreed(clip, breed) {
  const clipName = normalizedName(clip?.name);
  const breedName = normalizedName(breed.rootName.replace(/_Asset$/i, ''));
  const otherNames = BREED_LIST
    .filter((candidate) => candidate !== breed)
    .map((candidate) => normalizedName(candidate.rootName.replace(/_Asset$/i, '')));
  return clipName.includes(breedName) || !otherNames.some((name) => clipName.includes(name));
}

function createClipAnimator(model, clips = []) {
  const mixer = new THREE.AnimationMixer(model);
  const compatible = clips.filter(Boolean);
  const actions = new Map();
  let currentAction = null;
  let currentClip = null;
  let currentState = '';
  let authored = false;

  const findClip = (state) => {
    const candidates = CLIP_CANDIDATES[state] || CLIP_CANDIDATES.cruise;
    for (const candidate of candidates) {
      const wanted = normalizedName(candidate);
      const exact = compatible.find((clip) => normalizedName(clip.name).endsWith(wanted));
      if (exact) return exact;
    }
    for (const candidate of candidates) {
      const wanted = normalizedName(candidate);
      const partial = compatible.find((clip) => normalizedName(clip.name).includes(wanted));
      if (partial) return partial;
    }
    return null;
  };

  const play = (state, immediate = false) => {
    const clip = findClip(state);
    authored = Boolean(clip);
    if (!clip) {
      if (currentAction) currentAction.fadeOut(0.12);
      currentAction = null;
      currentClip = null;
      currentState = state;
      return false;
    }
    if (clip === currentClip && state === currentState) return true;
    const action = actions.get(clip) || mixer.clipAction(clip);
    actions.set(clip, action);
    const oneShot = state === 'takeoff' || state === 'landing';
    action.enabled = true;
    action.clampWhenFinished = oneShot;
    action.setLoop(oneShot ? THREE.LoopOnce : THREE.LoopRepeat, oneShot ? 1 : Infinity);
    action.reset().setEffectiveWeight(1);
    if (oneShot) {
      const visibleWindow = state === 'takeoff' ? 0.42 : 0.4;
      action.setEffectiveTimeScale(clamp(clip.duration / visibleWindow, 0.75, 3.2));
    } else action.setEffectiveTimeScale(1);
    if (currentAction && currentAction !== action) {
      if (immediate) currentAction.stop();
      else currentAction.fadeOut(0.12);
    }
    if (!immediate) action.fadeIn(0.12);
    action.play();
    currentAction = action;
    currentClip = clip;
    currentState = state;
    return true;
  };

  return {
    mixer,
    play,
    update(dt, speed = 0) {
      if (currentAction && ['cruise', 'approach'].includes(currentState)) {
        currentAction.setEffectiveTimeScale(clamp(speed / 8.5, 0.72, 1.55));
      }
      mixer.update(dt);
    },
    get authored() { return authored; },
    dispose() {
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
      actions.clear();
    },
  };
}

export class BirdField {
  constructor(scene, options = {}) {
    this.scene = scene || null;
    this.assetUrl = String(options.assetUrl || BIRD_ASSET_URL);
    this.atlasUrl = String(options.atlasUrl || BIRD_ATLAS_URL);
    const timeout = Number(options.loadTimeoutMs);
    this.loadTimeoutMs = Number.isFinite(timeout) && timeout > 0
      ? Math.max(10, timeout)
      : DEFAULT_LOAD_TIMEOUT_MS;
    this.loaderFactory = typeof options.loaderFactory === 'function'
      ? options.loaderFactory
      : () => new GLTFLoader();
    this.textureLoaderFactory = typeof options.textureLoaderFactory === 'function'
      ? options.textureLoaderFactory
      : () => new THREE.TextureLoader();
    this.world = null;
    this.group = new THREE.Group();
    this.group.name = 'Worldloom ambient birds';
    this.scene?.add?.(this.group);
    this.profile = { ...DEFAULT_PROFILE };
    this.reducedMotion = false;
    this.ready = false;
    this.failed = false;
    this.error = null;
    this.birds = [];
    this.treeAnchors = [];
    this.pondAnchors = [];
    this.templates = new Map();
    this._assetScene = null;
    this._atlas = null;
    this._loadPromise = null;
    this._loadGeneration = 0;
    this._cancelLoad = null;
    this._time = 0;
    this._spawnTimer = 7.5;
    this._spawnSerial = 0;
    this._nextId = 1;
    this._anchorTimer = 0;
    this._shadowTimer = 0;
    this._lastAnchorFocus = new THREE.Vector3(Number.POSITIVE_INFINITY, 0, Number.POSITIVE_INFINITY);
    this._forward = new THREE.Vector3();
    this._flightPoint = new THREE.Vector3();
    this._flightTangent = new THREE.Vector3();
    this._stats = { spawned: 0, startled: 0, replans: 0 };
  }

  get count() {
    return this.birds.length;
  }

  prepare() {
    if (this.ready) return Promise.resolve(this);
    if (this._loadPromise) return this._loadPromise;
    if (!this.group.parent) this.scene?.add?.(this.group);
    this.failed = false;
    this.error = null;
    const generation = ++this._loadGeneration;
    let settled = false;
    let timeoutId = null;
    let resolveAttempt = null;
    let cancelAttempt = null;
    let pendingGltf = null;
    let pendingAtlas = null;
    const promise = new Promise((resolve) => { resolveAttempt = resolve; });
    const discardPending = () => {
      if (pendingGltf?.scene || pendingAtlas) {
        disposeObjectResources(pendingGltf?.scene, pendingAtlas);
      }
      pendingGltf = null;
      pendingAtlas = null;
    };
    const finish = () => {
      if (settled) return;
      settled = true;
      if (timeoutId != null) clearTimeout(timeoutId);
      if (this._cancelLoad === cancelAttempt) this._cancelLoad = null;
      resolveAttempt(this);
    };
    const failCosmetically = (cause) => {
      if (settled) return;
      discardPending();
      if (generation === this._loadGeneration) {
        this._loadGeneration++;
        this.ready = false;
        this.failed = true;
        this.error = cause instanceof Error ? cause : new Error(String(cause || 'Unknown bird asset error'));
        console.warn('Worldloom birds were skipped safely.', this.error);
      }
      finish();
    };
    cancelAttempt = () => {
      discardPending();
      finish();
    };
    this._cancelLoad = cancelAttempt;
    timeoutId = setTimeout(() => {
      failCosmetically(new Error(`Bird asset timed out after ${this.loadTimeoutMs}ms`));
    }, this.loadTimeoutMs);

    Promise.resolve()
      .then(() => {
        if (settled || generation !== this._loadGeneration) return null;
        const loader = this.loaderFactory();
        const textureLoader = this.textureLoaderFactory();
        if (!loader?.loadAsync || !textureLoader?.loadAsync) throw new Error('Bird asset loaders are unavailable');
        const modelPromise = Promise.resolve(loader.loadAsync(this.assetUrl)).then((gltf) => {
          if (settled || generation !== this._loadGeneration) {
            disposeObjectResources(gltf?.scene);
            return null;
          }
          pendingGltf = gltf;
          return gltf;
        });
        const atlasPromise = Promise.resolve(textureLoader.loadAsync(this.atlasUrl)).then((atlas) => {
          if (settled || generation !== this._loadGeneration) {
            atlas?.dispose?.();
            return null;
          }
          pendingAtlas = atlas;
          return atlas;
        });
        return Promise.all([modelPromise, atlasPromise]);
      })
      .then((loaded) => {
        if (!loaded) return;
        const [gltf, atlas] = loaded;
        if (!gltf || !atlas) return;
        if (settled || generation !== this._loadGeneration) {
          disposeObjectResources(gltf?.scene, atlas);
          pendingGltf = null;
          pendingAtlas = null;
          return;
        }
        try {
          this._adoptAsset(gltf, atlas);
        } catch (error) {
          disposeObjectResources(gltf?.scene, atlas);
          pendingGltf = null;
          pendingAtlas = null;
          failCosmetically(error);
          return;
        }
        pendingGltf = null;
        pendingAtlas = null;
        this.ready = true;
        this.failed = false;
        this.error = null;
        this._anchorTimer = 0;
        finish();
      })
      .catch(failCosmetically);

    this._loadPromise = promise;
    promise.finally(() => {
      if (this._loadPromise === promise) this._loadPromise = null;
    });
    return promise;
  }

  _adoptAsset(gltf, atlas) {
    if (!gltf?.scene) throw new Error('Bird glTF scene is missing');
    configureAtlas(atlas, this.profile.anisotropy);
    const templates = new Map();
    const replacedTextures = new Set();
    for (const breed of BREED_LIST) {
      const root = gltf.scene.getObjectByName(breed.rootName);
      if (!root) throw new Error(`Bird glTF is missing ${breed.rootName}`);
      root.updateWorldMatrix?.(true, true);
      root.traverse((node) => {
        if (!node.isMesh) return;
        node.frustumCulled = true;
        node.castShadow = false;
        node.receiveShadow = true;
        const entries = Array.isArray(node.material) ? node.material : [node.material];
        for (const material of entries) {
          if (!material) continue;
          if (material.map && material.map !== atlas) replacedTextures.add(material.map);
          material.map = atlas;
          if ('roughness' in material) material.roughness = Math.max(0.78, material.roughness ?? 0.9);
          if ('metalness' in material) material.metalness = Math.min(0.025, material.metalness ?? 0);
          material.transparent = false;
          material.alphaTest = Math.max(0.35, material.alphaTest || 0);
          material.needsUpdate = true;
        }
      });
      const bounds = new THREE.Box3().setFromObject(root);
      const size = bounds.getSize(new THREE.Vector3());
      const longest = Math.max(size.x, size.y, size.z);
      if (bounds.isEmpty() || longest <= 0.001) throw new Error(`${breed.name} has invalid model bounds`);
      const clips = (gltf.animations || []).filter((clip) => clipMatchesBreed(clip, breed));
      templates.set(breed.key, {
        breed,
        root,
        clips,
        scale: clamp(breed.targetLength / longest, 0.08, 8),
        triangles: geometryTriangleCount(root),
        draws: meshDrawCount(root),
      });
    }
    replacedTextures.forEach((texture) => texture.dispose?.());
    this._clearBirds();
    this._disposeAsset();
    this._assetScene = gltf.scene;
    this._atlas = atlas;
    this.templates = templates;
  }

  setWorld(world) {
    const next = world || null;
    if (this.world !== next) this._clearBirds();
    this.world = next;
    this.treeAnchors.length = 0;
    this.pondAnchors.length = 0;
    this._anchorTimer = 0;
    this._spawnTimer = 5 + birdUnitHash(Number(next?.seed) >>> 0, 3, 0xc2b2ae35) * 7;
    this._spawnSerial = 0;
    this._lastAnchorFocus.set(Number.POSITIVE_INFINITY, 0, Number.POSITIVE_INFINITY);
  }

  setQuality(profile = {}, reducedMotion = false) {
    this.profile = { ...this.profile, ...profile };
    this.profile.birdRadius = clamp(Number(this.profile.birdRadius) || DEFAULT_PROFILE.birdRadius, 24, 128);
    this.profile.birdCap = clamp(Math.floor(Number(this.profile.birdCap) || 0), 0, 12);
    this.profile.birdShadowCap = clamp(Math.floor(Number(this.profile.birdShadowCap) || 0), 0, 6);
    this.reducedMotion = Boolean(reducedMotion);
    if (this._atlas) configureAtlas(this._atlas, profile.anisotropy ?? this.profile.anisotropy);
    this._anchorTimer = 0;
    while (this.birds.length > this.profile.birdCap) this._removeBird(this.birds[this.birds.length - 1]);
    this._shadowTimer = 0;
  }

  _syncAnchors(focus) {
    if (!this.world || !focus) return;
    const radius = this.profile.birdRadius;
    const treeCap = Math.max(12, this.profile.birdCap * TREE_ANCHOR_MULTIPLIER);
    const pondCap = Math.max(4, this.profile.birdCap * POND_ANCHOR_MULTIPLIER);
    const seed = Number(this.world.seed) >>> 0;
    const trees = this.world.getTreesNear?.(focus.x, focus.z, radius) || [];
    const nextTrees = [];
    for (const tree of trees) {
      const anchor = birdTreePerch(this.world, tree, seed, new THREE.Vector3());
      if (anchor) nextTrees.push(anchor);
      if (nextTrees.length >= treeCap) break;
    }
    const ponds = this.world.getPondsNear?.(focus.x, focus.z, radius) || [];
    const nextPonds = [];
    for (const pond of ponds) {
      const anchor = birdPondBank(this.world, pond, seed, new THREE.Vector3());
      if (anchor) nextPonds.push(anchor);
      if (nextPonds.length >= pondCap) break;
    }
    this.treeAnchors = nextTrees;
    this.pondAnchors = nextPonds;
    this._lastAnchorFocus.copy(focus);
  }

  _anchorStillValid(anchor) {
    if (!anchor || !positionReadyAndVisible(this.world, anchor.position.x, anchor.position.z)) return false;
    if (this.world.getBlock?.(anchor.supportX, anchor.supportY, anchor.supportZ) !== anchor.supportBlock) return false;
    if (!openBirdSpace(this.world, anchor.position.x, anchor.position.y, anchor.position.z)) return false;
    if (anchor.habitat === 'tree') {
      return this.world.getBlock?.(anchor.trunkX, anchor.trunkY, anchor.trunkZ) === anchor.trunkBlock;
    }
    const probe = anchor.waterProbe;
    return this.world.getFluidSurfaceY?.(probe.x, probe.y, probe.z) != null;
  }

  _setState(bird, state) {
    if (bird.state === state) return;
    bird.state = state;
    bird.stateTime = 0;
    bird.animator?.play(state);
  }

  _createBird(breed, seed, position) {
    const template = this.templates.get(breed.key);
    if (!template) return null;
    const root = new THREE.Group();
    root.name = `${breed.name} ${this._nextId}`;
    root.rotation.order = 'YXZ';
    root.position.copy(position);
    const model = cloneSkeleton(template.root);
    model.name = `${breed.name} model`;
    model.visible = true;
    model.scale.multiplyScalar(template.scale);
    model.traverse((node) => {
      if (!node.isMesh) return;
      node.castShadow = false;
      node.receiveShadow = true;
      node.frustumCulled = true;
    });
    root.add(model);
    this.group.add(root);
    const heading = birdUnitHash(seed, 5, 0x94d049bb) * Math.PI * 2;
    root.rotation.y = heading;
    const bird = {
      id: this._nextId++,
      breed,
      root,
      model,
      parts: captureMovableParts(model),
      animator: createClipAnimator(model, template.clips),
      randomState: mix32(seed ^ 0x632be5ab),
      phase: birdUnitHash(seed, 9, 0x243f6a88) * Math.PI * 2,
      heading,
      bank: 0,
      pitch: 0,
      speed: breed.flightSpeed,
      state: '',
      stateTime: 0,
      age: 0,
      dwell: 0,
      anchor: null,
      route: null,
      anchorCheck: 0,
      behaviorTimer: 1.2 + birdUnitHash(seed, 15, 0x8cb92baa) * 2.4,
      exitAfterFlight: false,
      invisibleAge: 0,
    };
    return bird;
  }

  _beginFlight(bird, destination, options = {}) {
    if (!bird || !destination?.position) return false;
    const start = bird.root.position.clone();
    const end = destination.position.clone();
    const distance = Math.max(0.01, Math.hypot(end.x - start.x, end.z - start.z));
    const apex = birdTerrainFlightApex(this.world, start, end, 4.2, 10)
      + Math.max(0, Number(options.extraClearance) || 0);
    const bendSign = nextRandom(bird) > 0.5 ? 1 : -1;
    bird.route = {
      start,
      end,
      destination,
      elapsed: 0,
      duration: clamp(distance / bird.speed, 1.05, 8.5),
      apex,
      bend: bendSign * Math.min(4.2, distance * (0.055 + nextRandom(bird) * 0.055)),
      replans: Number(options.replans) || 0,
    };
    bird.anchor = null;
    bird.exitAfterFlight = Boolean(options.exitAfterFlight);
    this._setState(bird, 'takeoff');
    return true;
  }

  _destinationForBird(bird, focus, startled = false) {
    const candidates = [...this.treeAnchors, ...this.pondAnchors].filter((anchor) => {
      if (anchor.id === bird.anchor?.id || !this._anchorStillValid(anchor)) return false;
      const distanceSq = horizontalDistanceSquared(anchor.position, bird.root.position);
      if (distanceSq < MIN_DESTINATION_DISTANCE * MIN_DESTINATION_DISTANCE) return false;
      if (distanceSq > this.profile.birdRadius * this.profile.birdRadius) return false;
      return !startled || horizontalDistanceSquared(anchor.position, focus) > 18 * 18;
    });
    if (!candidates.length) return null;
    const preferPond = nextRandom(bird) < bird.breed.pondPreference;
    const preferred = candidates.filter((anchor) => anchor.habitat === (preferPond ? 'pond' : 'tree'));
    const pool = preferred.length ? preferred : candidates;
    return pool[Math.min(pool.length - 1, Math.floor(nextRandom(bird) * pool.length))];
  }

  _spawnAtAnchor(anchor, breed, seed, airborne = false, spawnSafety = null) {
    if (!anchor || !this._anchorStillValid(anchor) || this.birds.length >= this.profile.birdCap) return null;
    const bird = this._createBird(breed, seed, anchor.position);
    if (!bird) return null;
    bird.anchor = anchor;
    bird.dwell = anchor.habitat === 'pond'
      ? 2.5 + nextRandom(bird) * 5
      : 5 + nextRandom(bird) * 11;
    if (airborne) {
      const angle = nextRandom(bird) * Math.PI * 2;
      bird.root.position.set(
        anchor.position.x + Math.cos(angle) * (6 + nextRandom(bird) * 4),
        anchor.position.y + 3.5 + nextRandom(bird) * 2.5,
        anchor.position.z + Math.sin(angle) * (6 + nextRandom(bird) * 4),
      );
      // The selected perch is guaranteed to be behind the player, but a wide
      // airborne offset could otherwise cross the camera's side plane before
      // the first frame. Fall back to the safely hidden perch when that happens.
      const safeAirborneStart = !spawnSafety || birdSpawnPositionIsSafe(
        spawnSafety.focus,
        spawnSafety.forward,
        bird.root.position,
        MIN_SPAWN_RADIUS,
        spawnSafety.maximumRadius,
      );
      if (safeAirborneStart) this._beginFlight(bird, anchor);
      else {
        bird.root.position.copy(anchor.position);
        airborne = false;
      }
    }
    if (!airborne) {
      this._setState(bird, anchor.habitat === 'pond' ? 'pond_bank' : 'perched_tree');
    }
    this.birds.push(bird);
    this._stats.spawned++;
    return bird;
  }

  _trySpawn(focus, context) {
    if (!birdSpawnAllowed(context, this.profile) || this.birds.length >= this.profile.birdCap) return null;
    const serial = ++this._spawnSerial;
    const worldSeed = Number(this.world?.seed) >>> 0;
    const seed = mix32(worldSeed ^ Math.imul(serial, 0x9e3779b9));
    const chance = clamp(Number(this.profile.birdSpawnChance) || DEFAULT_PROFILE.birdSpawnChance, 0.01, 0.5);
    if (birdUnitHash(seed, 1, 0xa24baed5) >= chance) return null;
    const forward = context.playerForward || context.viewDirection || context.forward;
    const maximumRadius = this.profile.birdRadius + 8;
    const trees = this.treeAnchors.filter((anchor) => birdSpawnPositionIsSafe(
      focus, forward, anchor.position, MIN_SPAWN_RADIUS, maximumRadius,
    ));
    const ponds = this.pondAnchors.filter((anchor) => birdSpawnPositionIsSafe(
      focus, forward, anchor.position, MIN_SPAWN_RADIUS, maximumRadius,
    ));
    if (!trees.length && !ponds.length) return null;
    const usePond = ponds.length > 0 && (trees.length === 0 || birdUnitHash(seed, 3, 0x3c6ef372) < 0.28);
    const pool = usePond ? ponds : trees;
    const anchor = pool[Math.min(pool.length - 1, Math.floor(birdUnitHash(seed, 5, 0x510e527f) * pool.length))];
    const breed = chooseBirdBreed(seed, anchor.habitat);
    const airborne = birdUnitHash(seed, 7, 0xb7e15162) < (anchor.habitat === 'tree' ? 0.52 : 0.34);
    return this._spawnAtAnchor(anchor, breed, seed, airborne, {
      focus,
      forward,
      maximumRadius,
    });
  }

  _removeBird(bird) {
    if (!bird) return;
    bird.animator?.dispose();
    bird.root?.removeFromParent?.();
    const index = this.birds.indexOf(bird);
    if (index >= 0) this.birds.splice(index, 1);
  }

  _clearBirds() {
    for (const bird of this.birds) {
      bird.animator?.dispose();
      bird.root?.removeFromParent?.();
    }
    this.birds.length = 0;
  }

  _flightCellBlocked(position) {
    if (!this.world?.getBlock) return false;
    const x = Math.floor(position.x);
    const y = Math.floor(position.y);
    const z = Math.floor(position.z);
    return isSolid(this.world.getBlock(x, y, z))
      || isSolid(this.world.getBlock(x, y + 1, z));
  }

  _updateFlight(bird, dt, focus) {
    const route = bird.route;
    if (!route) return;
    route.elapsed += dt;
    const progress = clamp(route.elapsed / route.duration, 0, 1);
    birdFlightPoint(route.start, route.end, progress, route.apex, route.bend, this._flightPoint);
    if (!positionReadyAndVisible(this.world, this._flightPoint.x, this._flightPoint.z)) {
      route.elapsed = Math.max(0, route.elapsed - dt);
      bird.root.visible = false;
      bird.invisibleAge += dt;
      return;
    }
    bird.root.visible = true;
    bird.invisibleAge = 0;
    if (progress < 0.94 && this._flightCellBlocked(this._flightPoint)) {
      if (route.replans < MAX_FLIGHT_REPLANS) {
        this._stats.replans++;
        this._beginFlight(bird, route.destination, {
          replans: route.replans + 1,
          extraClearance: 2.5 + route.replans * 1.4,
          exitAfterFlight: bird.exitAfterFlight,
        });
      } else {
        const alternative = this._destinationForBird(bird, focus);
        if (alternative) this._beginFlight(bird, alternative);
        else this._removeBird(bird);
      }
      return;
    }
    bird.root.position.copy(this._flightPoint);
    birdFlightTangent(route.start, route.end, progress, route.apex, route.bend, this._flightTangent);
    const desiredHeading = Math.atan2(this._flightTangent.x, this._flightTangent.z);
    const turn = shortestAngle(bird.heading, desiredHeading);
    bird.heading += turn * (1 - Math.exp(-dt * 8.5));
    bird.bank += (clamp(-turn * 1.8, -0.48, 0.48) - bird.bank) * (1 - Math.exp(-dt * 6));
    const horizontal = Math.max(1e-4, Math.hypot(this._flightTangent.x, this._flightTangent.z));
    const desiredPitch = -Math.atan2(this._flightTangent.y, horizontal);
    bird.pitch += (clamp(desiredPitch, -0.5, 0.42) - bird.pitch) * (1 - Math.exp(-dt * 7));
    bird.root.rotation.set(bird.pitch, bird.heading, bird.bank);
    if (bird.state === 'takeoff' && bird.stateTime < 0.42) {
      // Let the authored/procedural launch complete before cross-fading into
      // ordinary flight, independent of the route's total length.
    } else if (progress < 0.78) this._setState(bird, 'cruise');
    else this._setState(bird, 'approach');

    if (progress < 1) return;
    if (bird.exitAfterFlight) {
      this._removeBird(bird);
      return;
    }
    if (!this._anchorStillValid(route.destination)) {
      const alternative = this._destinationForBird(bird, focus);
      if (alternative) this._beginFlight(bird, alternative);
      else this._removeBird(bird);
      return;
    }
    bird.anchor = route.destination;
    bird.root.position.copy(route.destination.position);
    bird.route = null;
    bird.bank = 0;
    bird.pitch = 0;
    bird.root.rotation.x = 0;
    bird.root.rotation.z = 0;
    bird.dwell = route.destination.habitat === 'pond'
      ? 2.5 + nextRandom(bird) * 5
      : 5 + nextRandom(bird) * 11;
    this._setState(bird, 'landing');
  }

  _startledTakeoff(bird, focus) {
    const destination = this._destinationForBird(bird, focus, true)
      || this._destinationForBird(bird, focus, false);
    if (destination) {
      this._stats.startled++;
      this._beginFlight(bird, destination, { extraClearance: 1.5 });
      return true;
    }
    const awayX = bird.root.position.x - focus.x;
    const awayZ = bird.root.position.z - focus.z;
    const length = Math.max(0.001, Math.hypot(awayX, awayZ));
    const end = new THREE.Vector3(
      bird.root.position.x + awayX / length * 30,
      bird.root.position.y + 8,
      bird.root.position.z + awayZ / length * 30,
    );
    if (positionReadyAndVisible(this.world, end.x, end.z)) {
      this._stats.startled++;
      this._beginFlight(bird, { id: 'air:exit', habitat: 'air', position: end }, {
        extraClearance: 2,
        exitAfterFlight: true,
      });
      return true;
    }
    return false;
  }

  _updateLanded(bird, dt, focus, context) {
    bird.root.visible = positionReadyAndVisible(this.world, bird.root.position.x, bird.root.position.z);
    if (!bird.root.visible) {
      bird.invisibleAge += dt;
      return;
    }
    bird.invisibleAge = 0;
    bird.anchorCheck -= dt;
    if (bird.anchorCheck <= 0) {
      bird.anchorCheck = 0.42;
      if (!this._anchorStillValid(bird.anchor)) {
        const destination = this._destinationForBird(bird, focus);
        if (destination) this._beginFlight(bird, destination, { extraClearance: 1 });
        else this._removeBird(bird);
        return;
      }
    }
    const startleRadius = bird.anchor?.habitat === 'pond' ? 9.2 : 7.6;
    if (horizontalDistanceSquared(bird.root.position, focus) < startleRadius * startleRadius) {
      this._startledTakeoff(bird, focus);
      return;
    }
    bird.dwell -= dt;
    bird.behaviorTimer -= dt;
    if (bird.state === 'pond_peck' && bird.stateTime >= 1.55) {
      bird.behaviorTimer = 1.4 + nextRandom(bird) * 3.2;
      this._setState(bird, 'pond_bank');
    } else if (bird.state === 'pond_bank' && bird.behaviorTimer <= 0 && bird.dwell > 1.8) {
      this._setState(bird, 'pond_peck');
    }
    const wetPond = bird.anchor?.habitat === 'pond' && Number(context.rainIntensity || 0) > 0.2;
    if (bird.dwell <= 0 || wetPond) {
      const destination = this._destinationForBird(bird, focus);
      if (destination) this._beginFlight(bird, destination, { extraClearance: wetPond ? 1.2 : 0 });
      else bird.dwell = 3 + nextRandom(bird) * 4;
    }
  }

  _animateProcedurally(bird, dt) {
    const flying = ['takeoff', 'cruise', 'approach'].includes(bird.state);
    const landed = bird.state === 'perched_tree'
      || bird.state === 'pond_bank'
      || bird.state === 'pond_peck'
      || bird.state === 'landing';
    // Authored clips establish the pose first. When no matching Blender clip
    // exists, the named-part fallback below owns the complete pose and cannot
    // be overwritten by a fading action from the preceding state.
    bird.animator?.update(dt, flying ? bird.speed : 0);
    if (!bird.animator?.authored) {
      const parts = bird.parts;
      const flapRate = bird.state === 'approach' ? 9.5 : bird.state === 'takeoff' ? 17 : 13.2;
      const motionScale = this.reducedMotion ? 0.58 : 1;
      const flap = Math.sin(this._time * flapRate + bird.phase) * motionScale;
      if (parts.leftWing && parts.base.leftWing) {
        parts.leftWing.rotation.copy(parts.base.leftWing.rotation);
        parts.leftWing.rotation.z += flying ? flap * 1.02 : 0.04;
        parts.leftWing.rotation.x += flying ? Math.cos(this._time * flapRate + bird.phase) * 0.12 : 0;
      }
      if (parts.rightWing && parts.base.rightWing) {
        parts.rightWing.rotation.copy(parts.base.rightWing.rotation);
        parts.rightWing.rotation.z -= flying ? flap * 1.02 : 0.04;
        parts.rightWing.rotation.x -= flying ? Math.cos(this._time * flapRate + bird.phase) * 0.12 : 0;
      }
      if (parts.head && parts.base.head) {
        parts.head.rotation.copy(parts.base.head.rotation);
        parts.head.rotation.y += landed
          ? Math.sin(this._time * 1.9 + bird.phase) * 0.42
          : Math.sin(this._time * 3.4 + bird.phase) * 0.08;
        const peck = bird.state === 'pond_peck'
          ? Math.max(0, Math.sin(bird.stateTime * 8.4))
          : 0;
        parts.head.rotation.x += peck * 0.68
          + (landed ? Math.max(0, Math.sin(this._time * 1.25 + bird.phase)) * 0.08 : 0);
      }
      if (parts.tail && parts.base.tail) {
        parts.tail.rotation.copy(parts.base.tail.rotation);
        parts.tail.rotation.x += flying ? -0.16 + Math.sin(this._time * 4 + bird.phase) * 0.06 : 0;
        parts.tail.rotation.y += flying ? bird.bank * -0.35 : 0;
      }
      for (const key of ['leftLeg', 'rightLeg']) {
        const part = parts[key];
        const base = parts.base[key];
        if (!part || !base) continue;
        part.rotation.copy(base.rotation);
        part.rotation.x += flying ? -0.62 : bird.state === 'landing' ? 0.22 : 0;
      }
      if (parts.body && parts.base.body) {
        parts.body.rotation.copy(parts.base.body.rotation);
        parts.body.rotation.x += flying ? Math.sin(this._time * flapRate * 2 + bird.phase) * 0.018 : 0;
        if (bird.state === 'pond_peck') parts.body.rotation.x += 0.07;
      }
    }
    const bob = landed ? Math.sin(this._time * 2.15 + bird.phase) * 0.012 : 0;
    bird.model.position.copy(bird.parts.modelPosition);
    bird.model.position.y += bob;
  }

  _updateShadows(focus) {
    const cap = this.profile.shadows === false ? 0 : this.profile.birdShadowCap;
    const nearest = [...this.birds]
      .filter((bird) => bird.root.visible)
      .sort((a, b) => horizontalDistanceSquared(a.root.position, focus)
        - horizontalDistanceSquared(b.root.position, focus));
    const shadowIds = new Set(nearest.slice(0, cap).map((bird) => bird.id));
    for (const bird of this.birds) {
      const castsShadow = shadowIds.has(bird.id);
      bird.model.traverse((node) => {
        if (node.isMesh) node.castShadow = castsShadow;
      });
    }
  }

  update(dt, focus, context = {}) {
    if (!this.ready || !this.world || !focus) return;
    const elapsed = clamp(Number(dt) || 0, 0, 0.06);
    if (elapsed <= 0) return;
    this._time += elapsed;
    const suppliedForward = context.playerForward || context.viewDirection || context.forward;
    if (finiteVector(suppliedForward)) this._forward.copy(suppliedForward);

    this._anchorTimer -= elapsed;
    if (this._anchorTimer <= 0 || this._lastAnchorFocus.distanceToSquared(focus) > 100) {
      this._anchorTimer = 1.25;
      this._syncAnchors(focus);
    }
    this._spawnTimer -= elapsed;
    if (this._spawnTimer <= 0) {
      const seed = Number(this.world.seed) >>> 0;
      this._spawnTimer = 4.2 + birdUnitHash(seed, this._spawnSerial + 29, 0x9fb21c65) * 3.8;
      this._trySpawn(focus, { ...context, playerForward: this._forward });
    }

    for (let index = this.birds.length - 1; index >= 0; index -= 1) {
      const bird = this.birds[index];
      bird.age += elapsed;
      bird.stateTime += elapsed;
      const distanceSq = horizontalDistanceSquared(bird.root.position, focus);
      const despawnRadius = Math.max(MAX_DESPAWN_RADIUS, this.profile.birdRadius + 30);
      if (distanceSq > despawnRadius * despawnRadius
        || bird.invisibleAge > 12
        || (bird.age > 260 && distanceSq > 42 * 42)) {
        this._removeBird(bird);
        continue;
      }

      if (bird.route) this._updateFlight(bird, elapsed, focus);
      else if (bird.state === 'landing') {
        if (bird.stateTime >= 0.42) {
          this._setState(bird, bird.anchor?.habitat === 'pond' ? 'pond_bank' : 'perched_tree');
        }
      } else this._updateLanded(bird, elapsed, focus, context);
      if (!this.birds.includes(bird)) continue;
      this._animateProcedurally(bird, elapsed);
    }

    this._shadowTimer -= elapsed;
    if (this._shadowTimer <= 0) {
      this._shadowTimer = 0.45;
      this._updateShadows(focus);
    }
  }

  /** Deterministic browser/test seam; bypasses rarity but never readiness or support validation. */
  debugSpawn(options = {}) {
    if (!this.ready || !this.world || this.birds.length >= this.profile.birdCap) return null;
    const habitat = options.habitat === 'pond' ? 'pond' : 'tree';
    const pool = habitat === 'pond' ? this.pondAnchors : this.treeAnchors;
    const anchor = pool.find((candidate) => this._anchorStillValid(candidate));
    if (!anchor) return null;
    const breed = BIRD_BREEDS[options.breed] || chooseBirdBreed(Number(this.world.seed) >>> 0, habitat);
    const seed = mix32((Number(this.world.seed) >>> 0) ^ 0x51ed270b ^ this._nextId);
    return this._spawnAtAnchor(anchor, breed, seed, Boolean(options.airborne));
  }

  debugSyncAnchors(focus) {
    this._syncAnchors(focus);
    return { trees: this.treeAnchors.length, ponds: this.pondAnchors.length };
  }

  getStats() {
    const breeds = Object.fromEntries(BREED_LIST.map((breed) => [breed.key, 0]));
    const states = {};
    let visible = 0;
    let shadowBirds = 0;
    let triangles = 0;
    let draws = 0;
    for (const bird of this.birds) {
      breeds[bird.breed.key] = (breeds[bird.breed.key] || 0) + 1;
      states[bird.state] = (states[bird.state] || 0) + 1;
      if (bird.root.visible) visible++;
      let casts = false;
      bird.model.traverse((node) => { if (node.isMesh && node.castShadow) casts = true; });
      if (casts) shadowBirds++;
      const template = this.templates.get(bird.breed.key);
      triangles += template?.triangles || 0;
      if (bird.root.visible) draws += template?.draws || 0;
    }
    return {
      ready: this.ready,
      failed: this.failed,
      loading: Boolean(this._loadPromise),
      error: this.error ? String(this.error.message || this.error) : '',
      count: this.birds.length,
      visible,
      breeds,
      states,
      treeAnchors: this.treeAnchors.length,
      pondAnchors: this.pondAnchors.length,
      shadowBirds,
      draws,
      triangles,
      spawned: this._stats.spawned,
      startled: this._stats.startled,
      replans: this._stats.replans,
      assetUrl: this.assetUrl,
      atlasUrl: this.atlasUrl,
      templateRoots: [...this.templates.values()].map((template) => template.breed.rootName),
    };
  }

  _disposeAsset() {
    if (this._assetScene || this._atlas) disposeObjectResources(this._assetScene, this._atlas);
    this._assetScene = null;
    this._atlas = null;
    this.templates = new Map();
  }

  dispose() {
    this._loadGeneration++;
    this._cancelLoad?.();
    this._cancelLoad = null;
    this._loadPromise = null;
    this._clearBirds();
    this._disposeAsset();
    this.group.removeFromParent?.();
    this.world = null;
    this.treeAnchors.length = 0;
    this.pondAnchors.length = 0;
    this.ready = false;
    this.failed = false;
    this.error = null;
    this._time = 0;
    this._anchorTimer = 0;
    this._spawnTimer = 0;
  }
}

export const BirdSystem = BirdField;
export default BirdField;
