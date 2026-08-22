import * as THREE from '../vendor/three.module.min.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { clone as cloneSkeleton } from '../vendor/SkeletonUtils.js';
import { isLiquid, isSolid } from './blocks.js';

const MAX_CREATURES = 14;
const MIN_SPAWN_RADIUS = 38;
const MAX_SPAWN_RADIUS = 66;
const DESPAWN_DISTANCE_SQ = 96 * 96;
const PLAYER_DAMAGE_INTERVAL = 1.05;
const GRAVITY = 21;

const QUATERNIUS_SOURCE = 'https://quaternius.com/packs/ultimateanimatedanimals.html';

export const LICENSED_ANIMAL_ASSETS = Object.freeze({
  alpaca: Object.freeze({
    key: 'alpaca', name: 'Alpaca', file: 'alpaca.gltf', targetHeight: 1.62,
    source: QUATERNIUS_SOURCE, license: 'CC0-1.0',
  }),
  bull: Object.freeze({
    key: 'bull', name: 'Bull', file: 'bull.gltf', targetHeight: 1.48,
    source: QUATERNIUS_SOURCE, license: 'CC0-1.0',
  }),
  cow: Object.freeze({
    key: 'cow', name: 'Cow', file: 'cow.gltf', targetHeight: 1.42,
    source: QUATERNIUS_SOURCE, license: 'CC0-1.0',
  }),
  deer: Object.freeze({
    key: 'deer', name: 'Deer', file: 'deer.gltf', targetHeight: 1.58,
    source: QUATERNIUS_SOURCE, license: 'CC0-1.0',
  }),
  fox: Object.freeze({
    key: 'fox', name: 'Fox', file: 'fox.gltf', targetHeight: 0.78,
    source: QUATERNIUS_SOURCE, license: 'CC0-1.0',
  }),
  wolf: Object.freeze({
    key: 'wolf', name: 'Wolf', file: 'wolf.gltf', targetHeight: 0.98,
    source: QUATERNIUS_SOURCE, license: 'CC0-1.0',
  }),
});

const CREATURE_ASSET_POOLS = Object.freeze({
  dapple: Object.freeze(['deer', 'cow', 'fox']),
  bramblehog: Object.freeze(['bull']),
  dunetail: Object.freeze(['alpaca']),
  gloomling: Object.freeze(['wolf']),
});

const STATE_CLIP_CANDIDATES = Object.freeze({
  attack: Object.freeze(['Attack', 'Attack_Headbutt', 'Attack_Kick']),
  death: Object.freeze(['Death']),
  hit: Object.freeze(['Idle_HitReact1', 'Idle_HitReact2']),
  graze: Object.freeze(['Eating', 'Idle_Headlow', 'Idle_2_HeadLow']),
  root: Object.freeze(['Eating', 'Idle_Headlow', 'Idle_2_HeadLow']),
  peck: Object.freeze(['Eating', 'Idle_Headlow', 'Idle_2_HeadLow']),
  charge: Object.freeze(['Gallop', 'Walk']),
  chase: Object.freeze(['Gallop', 'Walk']),
  flee: Object.freeze(['Gallop', 'Walk']),
  sprint: Object.freeze(['Gallop', 'Walk']),
  dart: Object.freeze(['Gallop', 'Walk']),
  wander: Object.freeze(['Walk', 'Idle']),
  guard: Object.freeze(['Idle_2', 'Idle']),
  scan: Object.freeze(['Idle_2', 'Idle']),
  idle: Object.freeze(['Idle', 'Idle_2']),
});

export function licensedAnimalForCreature(type, seed = 0) {
  const pool = CREATURE_ASSET_POOLS[type];
  if (!pool?.length) return null;
  const index = Math.min(pool.length - 1, Math.floor(unitHash(seed, 37, 0xd1b54a35) * pool.length));
  return LICENSED_ANIMAL_ASSETS[pool[index]] ?? null;
}

export function animationCandidatesForState(state) {
  return STATE_CLIP_CANDIDATES[state] ?? STATE_CLIP_CANDIDATES.idle;
}

const CREATURE_CAPS = Object.freeze({
  dapple: 4,
  bramblehog: 3,
  dunetail: 4,
  lumenwing: 4,
  gloomling: 5,
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

function unitHash(seed, value, salt = 0) {
  return mix32((seed >>> 0) ^ Math.imul(value | 0, 0x9e3779b9) ^ salt) / 0x100000000;
}

function nextRandom(creature) {
  creature.randomState = (creature.randomState + 0x6d2b79f5) >>> 0;
  let value = creature.randomState;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 0x100000000;
}

function shortestAngle(from, to) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

function prepareMesh(mesh, castsShadow = true) {
  mesh.castShadow = castsShadow;
  mesh.receiveShadow = true;
  mesh.frustumCulled = true;
  return mesh;
}

function setState(creature, state, duration = 1) {
  if (creature.state === state) return;
  creature.state = state;
  creature.stateTime = 0;
  creature.stateDuration = duration;
  if (state === 'attack') creature.attackLanded = false;
  creature.assetAnimator?.play(state);
}

/** A lightweight manager for Worldloom's procedural ambient creatures. */
export class CreatureSystem {
  constructor(scene, world) {
    this.scene = scene ?? null;
    this.world = world ?? null;
    this.onPlayerDamage = null;
    this.creatures = [];
    this._time = 0;
    this._spawnTimer = 0.7;
    this._spawnSerial = 0;
    this._nextId = 1;
    this._lastPlayerDamage = -Infinity;
    this._disposed = false;
    this._geometries = new Set();
    this._materials = new Set();
    this.assetErrors = new Map();
    this._animalAssets = new Map();
    this._animalAssetPromises = new Map();
    this._assetGeometries = new Set();
    this._assetMaterials = new Set();
    this._assetTextures = new Set();
    this._animalLoader = typeof window !== 'undefined' && this.scene ? new GLTFLoader() : null;
    this._attackDirection = new THREE.Vector3();
    this._attackPoint = new THREE.Vector3();
    this._spawnForward = new THREE.Vector3();
    this._resources = this._createResources();
  }

  get count() {
    return this.creatures.length;
  }

  _geometry(geometry) {
    this._geometries.add(geometry);
    return geometry;
  }

  _material(parameters) {
    const material = new THREE.MeshStandardMaterial(parameters);
    this._materials.add(material);
    return material;
  }

  _basicMaterial(parameters) {
    const material = new THREE.MeshBasicMaterial(parameters);
    this._materials.add(material);
    return material;
  }

  _createResources() {
    const geometries = {
      dappleBody: this._geometry(new THREE.BoxGeometry(1.3, 0.68, 0.76)),
      dappleHead: this._geometry(new THREE.BoxGeometry(0.56, 0.52, 0.52)),
      dappleMuzzle: this._geometry(new THREE.BoxGeometry(0.38, 0.23, 0.3)),
      dappleLeg: this._geometry(new THREE.BoxGeometry(0.17, 0.56, 0.17)),
      dappleHoof: this._geometry(new THREE.BoxGeometry(0.2, 0.13, 0.27)),
      dappleEar: this._geometry(new THREE.ConeGeometry(0.12, 0.31, 3)),
      dappleTail: this._geometry(new THREE.ConeGeometry(0.12, 0.34, 4)),
      dapplePatch: this._geometry(new THREE.BoxGeometry(0.025, 0.24, 0.3)),
      eye: this._geometry(new THREE.BoxGeometry(0.095, 0.095, 0.035)),
      pupil: this._geometry(new THREE.BoxGeometry(0.04, 0.052, 0.012)),
      antler: this._geometry(new THREE.CylinderGeometry(0.035, 0.052, 0.38, 5)),
      brambleBody: this._geometry(new THREE.DodecahedronGeometry(0.72, 0)),
      brambleShell: this._geometry(new THREE.IcosahedronGeometry(0.73, 1)),
      brambleHead: this._geometry(new THREE.BoxGeometry(0.58, 0.45, 0.56)),
      brambleSnout: this._geometry(new THREE.BoxGeometry(0.42, 0.27, 0.36)),
      brambleLeg: this._geometry(new THREE.CylinderGeometry(0.105, 0.13, 0.47, 5)),
      brambleFoot: this._geometry(new THREE.BoxGeometry(0.23, 0.14, 0.31)),
      brambleTusk: this._geometry(new THREE.ConeGeometry(0.065, 0.31, 5)),
      brambleSpine: this._geometry(new THREE.ConeGeometry(0.1, 0.34, 5)),
      brambleTail: this._geometry(new THREE.ConeGeometry(0.085, 0.3, 5)),
      duneBody: this._geometry(new THREE.DodecahedronGeometry(0.55, 0)),
      duneNeck: this._geometry(new THREE.CylinderGeometry(0.13, 0.2, 0.72, 5)),
      duneHead: this._geometry(new THREE.DodecahedronGeometry(0.31, 0)),
      duneBeak: this._geometry(new THREE.ConeGeometry(0.14, 0.43, 4)),
      duneLeg: this._geometry(new THREE.CylinderGeometry(0.055, 0.075, 0.66, 5)),
      duneFoot: this._geometry(new THREE.BoxGeometry(0.16, 0.08, 0.38)),
      duneWing: this._geometry(new THREE.BoxGeometry(0.06, 0.46, 0.66)),
      duneTail: this._geometry(new THREE.ConeGeometry(0.13, 0.8, 4)),
      crest: this._geometry(new THREE.ConeGeometry(0.095, 0.3, 4)),
      lumenBody: this._geometry(new THREE.OctahedronGeometry(0.29, 1)),
      lumenHead: this._geometry(new THREE.SphereGeometry(0.19, 8, 6)),
      lumenWing: this._geometry(new THREE.BoxGeometry(0.66, 0.035, 0.45)),
      lumenTail: this._geometry(new THREE.ConeGeometry(0.11, 0.42, 6)),
      antenna: this._geometry(new THREE.CylinderGeometry(0.018, 0.026, 0.33, 5)),
      gloomBody: this._geometry(new THREE.OctahedronGeometry(0.67, 0)),
      gloomHead: this._geometry(new THREE.BoxGeometry(0.58, 0.47, 0.5)),
      gloomLeg: this._geometry(new THREE.ConeGeometry(0.14, 0.56, 4)),
      gloomHorn: this._geometry(new THREE.ConeGeometry(0.115, 0.37, 4)),
      gloomEye: this._geometry(new THREE.BoxGeometry(0.34, 0.075, 0.035)),
      gloomJaw: this._geometry(new THREE.BoxGeometry(0.38, 0.1, 0.25)),
      gloomPlate: this._geometry(new THREE.BoxGeometry(0.66, 0.12, 0.5)),
      gloomClaw: this._geometry(new THREE.ConeGeometry(0.055, 0.22, 4)),
    };

    const materials = {
      dappleHide: this._material({ color: 0xd6bd87, roughness: 0.92, metalness: 0, flatShading: true }),
      dappleCream: this._material({ color: 0xead9ae, roughness: 0.9, metalness: 0, flatShading: true }),
      dappleDark: this._material({ color: 0x5e4a3b, roughness: 1, metalness: 0, flatShading: true }),
      dapplePatch: this._material({ color: 0x91734f, roughness: 0.95, metalness: 0, flatShading: true }),
      eyeWhite: this._material({ color: 0xf1ead7, roughness: 0.72, metalness: 0, flatShading: true }),
      eyeDark: this._material({ color: 0x15191c, roughness: 0.55, metalness: 0, flatShading: true }),
      antler: this._material({ color: 0xcbb994, roughness: 0.9, metalness: 0, flatShading: true }),
      brambleHide: this._material({ color: 0x55483a, roughness: 0.98, metalness: 0, flatShading: true }),
      brambleMoss: this._material({ color: 0x4f7042, roughness: 1, metalness: 0, flatShading: true }),
      brambleMossLight: this._material({ color: 0x76955c, roughness: 1, metalness: 0, flatShading: true }),
      brambleTusk: this._material({ color: 0xe7d8aa, roughness: 0.72, metalness: 0, flatShading: true }),
      duneFeather: this._material({ color: 0xc97b45, roughness: 0.92, metalness: 0, flatShading: true }),
      duneLight: this._material({ color: 0xefd18a, roughness: 0.9, metalness: 0, flatShading: true }),
      duneDark: this._material({ color: 0x5d3a32, roughness: 0.94, metalness: 0, flatShading: true }),
      duneBeak: this._material({ color: 0xe6ad45, roughness: 0.74, metalness: 0.02, flatShading: true }),
      lumenHide: this._material({ color: 0x244a4e, roughness: 0.66, metalness: 0.04, flatShading: true }),
      lumenGlow: this._material({
        color: 0x8ffff0,
        emissive: 0x50ffe1,
        emissiveIntensity: 3.4,
        roughness: 0.24,
        metalness: 0,
        toneMapped: false,
      }),
      lumenWing: this._material({
        color: 0xa8f5e8,
        emissive: 0x256e68,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
        side: THREE.DoubleSide,
        roughness: 0.3,
        metalness: 0,
      }),
      gloomHide: this._material({ color: 0x24243b, roughness: 0.72, metalness: 0.08, flatShading: true }),
      gloomPlate: this._material({ color: 0x3c3659, roughness: 0.64, metalness: 0.12, flatShading: true }),
      gloomClaw: this._material({ color: 0x70698a, roughness: 0.7, metalness: 0.1, flatShading: true }),
      gloomEye: this._material({
        color: 0xa9fff0,
        emissive: 0x55ffe0,
        emissiveIntensity: 3,
        roughness: 0.25,
        metalness: 0,
        toneMapped: false,
      }),
      hit: this._basicMaterial({
        color: 0xff6652,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    };

    for (const material of Object.values(materials)) material.name = `Creature ${material.name || 'material'}`;
    return { geometries, materials };
  }

  _applyCoatVariation(node, definition) {
    const geometry = node.geometry;
    const position = geometry?.getAttribute?.('position');
    if (!position) return;
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    const coatMaterial = materials.some((material) => /^(main(?:_|$)|grey$)/i.test(material?.name || ''));
    if (!coatMaterial) return;
    if (geometry.getAttribute('color')) {
      for (const material of materials) if (material) material.vertexColors = true;
      return;
    }

    let seed = 0x811c9dc5;
    for (const character of definition.key) seed = Math.imul(seed ^ character.charCodeAt(0), 0x01000193);
    const colors = new Float32Array(position.count * 3);
    for (let index = 0; index < position.count; index += 1) {
      const x = position.getX(index);
      const y = position.getY(index);
      const z = position.getZ(index);
      const broad = Math.sin(x * 4.7 + z * 3.2 + seed * 1e-7) * 0.035;
      const fine = (unitHash(seed, index, 0x7f4a7c15) - 0.5) * 0.055;
      const lowerBody = clamp(y * 0.012, -0.025, 0.025);
      const shade = clamp(0.965 + broad + fine + lowerBody, 0.86, 1.055);
      colors[index * 3] = shade * 1.012;
      colors[index * 3 + 1] = shade;
      colors[index * 3 + 2] = shade * 0.984;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    for (const material of materials) if (material) material.vertexColors = true;
  }

  _loadAnimalAsset(definition) {
    if (!definition || !this._animalLoader) return Promise.resolve(null);
    if (this._animalAssets.has(definition.key)) {
      return Promise.resolve(this._animalAssets.get(definition.key));
    }
    if (this._animalAssetPromises.has(definition.key)) {
      return this._animalAssetPromises.get(definition.key);
    }

    const url = new URL(`../assets/animals/${definition.file}`, import.meta.url).href;
    const request = this._animalLoader.loadAsync(url).then((gltf) => {
      if (!gltf?.scene || !gltf.animations?.length) throw new Error('missing rig or animation clips');
      gltf.scene.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(gltf.scene);
      const size = bounds.getSize(new THREE.Vector3());
      if (bounds.isEmpty() || size.y <= 0.01) throw new Error('invalid animal bounds');
      if (this._disposed) {
        gltf.scene.traverse((node) => {
          node.geometry?.dispose?.();
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          for (const material of materials) material?.dispose?.();
        });
        return null;
      }

      gltf.scene.traverse((node) => {
        if (!node.isMesh) return;
        node.castShadow = true;
        node.receiveShadow = true;
        node.frustumCulled = true;
        this._applyCoatVariation(node, definition);
        if (node.geometry) this._assetGeometries.add(node.geometry);
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        for (const material of materials) {
          if (!material) continue;
          this._assetMaterials.add(material);
          if ('roughness' in material) material.roughness = Math.max(0.72, material.roughness ?? 0.85);
          if ('metalness' in material) material.metalness = Math.min(0.04, material.metalness ?? 0);
          for (const value of Object.values(material)) {
            if (value?.isTexture) this._assetTextures.add(value);
          }
        }
      });

      const asset = { definition, scene: gltf.scene, animations: gltf.animations, bounds, size };
      this._animalAssets.set(definition.key, asset);
      return asset;
    }).catch((error) => {
      this.assetErrors.set(definition.key, String(error?.message || error));
      return null;
    }).finally(() => {
      this._animalAssetPromises.delete(definition.key);
    });

    this._animalAssetPromises.set(definition.key, request);
    return request;
  }

  _makeAssetAnimator(scene, clips, initialState) {
    const mixer = new THREE.AnimationMixer(scene);
    const actions = new Map();
    const clipByName = new Map(clips.map((clip) => [clip.name.toLowerCase(), clip]));
    let currentAction = null;
    let currentClip = null;
    let currentState = '';

    const findClip = (state) => {
      const candidates = animationCandidatesForState(state);
      for (const candidate of candidates) {
        const exact = clipByName.get(candidate.toLowerCase());
        if (exact) return exact;
      }
      for (const candidate of candidates) {
        const lower = candidate.toLowerCase();
        const partial = clips.find((clip) => clip.name.toLowerCase().includes(lower));
        if (partial) return partial;
      }
      return clipByName.get('idle') ?? clips[0] ?? null;
    };

    const play = (state, immediate = false) => {
      const clip = findClip(state);
      if (!clip || (clip === currentClip && state === currentState)) return;
      const nextAction = actions.get(clip) ?? mixer.clipAction(clip);
      actions.set(clip, nextAction);
      const oneShot = state === 'attack' || state === 'hit' || state === 'death';
      nextAction.enabled = true;
      nextAction.clampWhenFinished = oneShot;
      nextAction.setLoop(oneShot ? THREE.LoopOnce : THREE.LoopRepeat, oneShot ? 1 : Infinity);
      nextAction.reset();
      nextAction.setEffectiveWeight(1);
      const oneShotWindow = state === 'attack' ? 0.64 : state === 'hit' ? 0.25 : null;
      nextAction.setEffectiveTimeScale(oneShotWindow
        ? clamp(clip.duration / oneShotWindow, 0.8, 3)
        : 1);
      if (currentAction && currentAction !== nextAction) {
        if (immediate) currentAction.stop();
        else currentAction.fadeOut(state === 'hit' ? 0.08 : 0.16);
      }
      if (!immediate) nextAction.fadeIn(state === 'hit' ? 0.06 : 0.16);
      nextAction.play();
      currentAction = nextAction;
      currentClip = clip;
      currentState = state;
    };

    const update = (dt, speed = 0) => {
      if (currentAction && ['wander', 'charge', 'chase', 'flee', 'sprint'].includes(currentState)) {
        const galloping = currentClip?.name.toLowerCase().includes('gallop');
        const referenceSpeed = galloping ? 2.5 : 0.9;
        currentAction.setEffectiveTimeScale(clamp(speed / referenceSpeed, 0.65, 1.65));
      }
      mixer.update(dt);
    };

    const animator = {
      mixer,
      play,
      update,
      get deathDuration() {
        return clamp(findClip('death')?.duration ?? 0.9, 0.9, 2.4);
      },
      dispose() {
        mixer.stopAllAction();
        mixer.uncacheRoot(scene);
        actions.clear();
      },
    };
    animator.play(initialState || 'idle', true);
    return animator;
  }

  _attachAnimalAsset(creature, asset) {
    if (!asset || this._disposed || creature.dead || !creature.root.parent) return;
    const animalScene = cloneSkeleton(asset.scene);
    const visual = new THREE.Group();
    visual.name = `${asset.definition.name} licensed animal visual`;
    animalScene.name = `${asset.definition.name} rig`;
    visual.add(animalScene);

    animalScene.traverse((node) => {
      if (!node.isMesh) return;
      node.castShadow = true;
      node.receiveShadow = true;
      node.frustumCulled = true;
    });

    const baseScale = Math.max(0.01, creature.baseScale || creature.root.scale.x || 1);
    const localScale = asset.definition.targetHeight / (asset.size.y * baseScale);
    visual.scale.setScalar(localScale);
    visual.position.y = -asset.bounds.min.y * localScale;
    creature.root.add(visual);
    creature.model.visible = false;
    creature.assetVisual = visual;
    creature.assetAnimator = this._makeAssetAnimator(animalScene, asset.animations, creature.state);
    creature.assetKey = asset.definition.key;
    creature.name = asset.definition.name;
    creature.root.name = `${asset.definition.name} ${creature.id}`;

    const worldDepth = asset.size.z * localScale * baseScale;
    creature.radius = Math.max(creature.radius, Math.min(1.4, worldDepth * 0.43));
    creature.centerHeight = asset.definition.targetHeight * 0.52;
  }

  _requestAnimalVisual(creature, seed) {
    const definition = licensedAnimalForCreature(creature.type, seed);
    if (!definition || !this._animalLoader) return;
    creature.requestedAssetKey = definition.key;
    this._loadAnimalAsset(definition).then((asset) => {
      if (!asset || this._disposed || creature.requestedAssetKey !== definition.key) return;
      if (!this.creatures.includes(creature) || creature.assetVisual) return;
      this._attachAnimalAsset(creature, asset);
    });
  }

  _makeDapple(x, y, z, seed) {
    const { geometries: geometry, materials: material } = this._resources;
    const root = new THREE.Group();
    const model = new THREE.Group();
    root.add(model);

    const body = prepareMesh(new THREE.Mesh(geometry.dappleBody, material.dappleHide));
    body.position.y = 0.88;
    model.add(body);

    const headPivot = new THREE.Group();
    headPivot.position.set(0, 0.92, 0.53);
    const head = prepareMesh(new THREE.Mesh(geometry.dappleHead, material.dappleCream));
    head.position.z = 0.17;
    headPivot.add(head);

    const muzzle = prepareMesh(new THREE.Mesh(geometry.dappleMuzzle, material.dappleHide));
    muzzle.position.set(0, -0.12, 0.48);
    headPivot.add(muzzle);

    for (const side of [-1, 1]) {
      const eye = prepareMesh(new THREE.Mesh(geometry.eye, material.eyeWhite), false);
      eye.position.set(side * 0.286, 0.08, 0.3);
      eye.rotation.y = side * 0.05;
      const pupil = prepareMesh(new THREE.Mesh(geometry.pupil, material.eyeDark), false);
      pupil.position.set(side * 0.003, 0, 0.023);
      eye.add(pupil);
      headPivot.add(eye);
    }
    model.add(headPivot);

    const ears = [];
    for (const side of [-1, 1]) {
      const ear = prepareMesh(new THREE.Mesh(geometry.dappleEar, material.dappleDark));
      ear.position.set(side * 0.23, 0.28, 0.13);
      ear.rotation.z = side * 0.92;
      headPivot.add(ear);
      ears.push(ear);

      const antler = prepareMesh(new THREE.Mesh(geometry.antler, material.antler));
      antler.position.set(side * 0.16, 0.43, 0.04);
      antler.rotation.z = side * -0.28;
      headPivot.add(antler);
    }

    const legs = [];
    for (const [legX, legZ] of [[-0.43, -0.25], [0.43, -0.25], [-0.43, 0.25], [0.43, 0.25]]) {
      const pivot = new THREE.Group();
      pivot.position.set(legX, 0.57, legZ);
      const leg = prepareMesh(new THREE.Mesh(geometry.dappleLeg, material.dappleDark));
      leg.position.y = -0.27;
      pivot.add(leg);
      const hoof = prepareMesh(new THREE.Mesh(geometry.dappleHoof, material.dappleDark));
      hoof.position.set(0, -0.56, 0.045);
      pivot.add(hoof);
      model.add(pivot);
      legs.push(pivot);
    }

    const tail = new THREE.Group();
    tail.position.set(0, 0.93, -0.43);
    const tailMesh = prepareMesh(new THREE.Mesh(geometry.dappleTail, material.dappleDark));
    tailMesh.position.y = -0.12;
    tailMesh.rotation.x = -0.95;
    tail.add(tailMesh);
    model.add(tail);

    for (const [side, patchY, patchZ, scale] of [[1, 0.98, 0.12, 1], [-1, 0.77, -0.14, 0.72]]) {
      const patch = prepareMesh(new THREE.Mesh(geometry.dapplePatch, material.dapplePatch), false);
      patch.position.set(side * 0.658, patchY, patchZ);
      patch.scale.set(1, scale, scale);
      model.add(patch);
    }

    const hitGlow = prepareMesh(new THREE.Mesh(geometry.dappleBody, material.hit), false);
    hitGlow.position.copy(body.position);
    hitGlow.scale.setScalar(1.06);
    hitGlow.visible = false;
    hitGlow.renderOrder = 4;
    model.add(hitGlow);

    const scale = 0.88 + unitHash(seed, 3, 0x87a219f1) * 0.17;
    root.position.set(x, y, z);
    root.scale.setScalar(scale);
    root.name = `Dapple ${this._nextId}`;
    this.scene?.add(root);

    return {
      id: this._nextId++,
      type: 'dapple',
      name: 'Dapple',
      root,
      model,
      parts: { body, headPivot, ears, legs, tail, hitGlow },
      radius: 0.83 * scale,
      centerHeight: 0.78 * scale,
      baseScale: scale,
      heading: unitHash(seed, 11, 0x2c9277b5) * Math.PI * 2,
      targetHeading: 0,
      desiredSpeed: 0,
      verticalVelocity: 0,
      knockbackX: 0,
      knockbackZ: 0,
      state: 'idle',
      stateTime: 0,
      stateDuration: 1.6,
      health: 3,
      maxHealth: 3,
      hitTime: 0,
      dead: false,
      deathTime: 0,
      age: 0,
      mismatchTime: 0,
      phase: unitHash(seed, 17, 0x51ed270b) * Math.PI * 2,
      randomState: mix32(seed ^ 0xa24baed5),
      attackCooldown: 0,
      attackLanded: false,
      provoked: 0,
      turnRate: 4.1,
      homeBiome: 'plains',
      activeMin: 0.3,
      activeMax: 1,
    };
  }

  _makeBramblehog(x, y, z, seed) {
    const { geometries: geometry, materials: material } = this._resources;
    const root = new THREE.Group();
    const model = new THREE.Group();
    root.add(model);

    const body = prepareMesh(new THREE.Mesh(geometry.brambleBody, material.brambleHide));
    body.position.y = 0.78;
    body.scale.set(1.1, 0.72, 1.28);
    model.add(body);

    const shell = prepareMesh(new THREE.Mesh(geometry.brambleShell, material.brambleMoss));
    shell.position.set(0, 0.97, -0.05);
    shell.scale.set(1.03, 0.49, 1.12);
    model.add(shell);

    const spines = [];
    for (const [sx, sy, sz, lean] of [
      [-0.38, 1.37, -0.2, -0.25], [0, 1.47, -0.12, 0], [0.38, 1.37, -0.2, 0.25],
      [-0.25, 1.32, 0.28, -0.18], [0.25, 1.32, 0.28, 0.18],
    ]) {
      const spine = prepareMesh(new THREE.Mesh(geometry.brambleSpine, material.brambleMossLight));
      spine.position.set(sx, sy, sz);
      spine.rotation.z = lean;
      model.add(spine);
      spines.push(spine);
    }

    const headPivot = new THREE.Group();
    headPivot.position.set(0, 0.81, 0.67);
    const head = prepareMesh(new THREE.Mesh(geometry.brambleHead, material.brambleHide));
    head.position.z = 0.12;
    headPivot.add(head);
    const snout = prepareMesh(new THREE.Mesh(geometry.brambleSnout, material.brambleMossLight));
    snout.position.set(0, -0.13, 0.47);
    headPivot.add(snout);
    for (const side of [-1, 1]) {
      const eye = prepareMesh(new THREE.Mesh(geometry.eye, material.eyeDark), false);
      eye.position.set(side * 0.298, 0.08, 0.29);
      headPivot.add(eye);
      const tusk = prepareMesh(new THREE.Mesh(geometry.brambleTusk, material.brambleTusk));
      tusk.position.set(side * 0.2, -0.26, 0.51);
      tusk.rotation.x = -0.55;
      tusk.rotation.z = side * 0.18;
      headPivot.add(tusk);
    }
    model.add(headPivot);

    const legs = [];
    for (const [legX, legZ] of [[-0.42, -0.3], [0.42, -0.3], [-0.42, 0.34], [0.42, 0.34]]) {
      const pivot = new THREE.Group();
      pivot.position.set(legX, 0.5, legZ);
      const leg = prepareMesh(new THREE.Mesh(geometry.brambleLeg, material.brambleHide));
      leg.position.y = -0.22;
      pivot.add(leg);
      const foot = prepareMesh(new THREE.Mesh(geometry.brambleFoot, material.dappleDark));
      foot.position.set(0, -0.48, 0.055);
      pivot.add(foot);
      model.add(pivot);
      legs.push(pivot);
    }

    const tail = new THREE.Group();
    tail.position.set(0, 0.91, -0.78);
    const tailMesh = prepareMesh(new THREE.Mesh(geometry.brambleTail, material.brambleMossLight));
    tailMesh.rotation.x = -0.9;
    tail.add(tailMesh);
    model.add(tail);

    const hitGlow = prepareMesh(new THREE.Mesh(geometry.brambleBody, material.hit), false);
    hitGlow.position.copy(body.position);
    hitGlow.scale.set(1.17, 0.78, 1.36);
    hitGlow.visible = false;
    hitGlow.renderOrder = 4;
    model.add(hitGlow);

    const scale = 0.88 + unitHash(seed, 7, 0x2f6e2b1) * 0.2;
    root.position.set(x, y, z);
    root.scale.setScalar(scale);
    root.name = `Bramblehog ${this._nextId}`;
    this.scene?.add(root);

    return {
      id: this._nextId++, type: 'bramblehog', name: 'Bramblehog', root, model,
      parts: { body, shell, spines, headPivot, legs, tail, hitGlow },
      radius: 0.95 * scale, centerHeight: 0.82 * scale, baseScale: scale,
      heading: unitHash(seed, 11, 0xf1695a1d) * Math.PI * 2, targetHeading: 0,
      desiredSpeed: 0, verticalVelocity: 0, knockbackX: 0, knockbackZ: 0,
      state: 'idle', stateTime: 0, stateDuration: 1.5, health: 6, maxHealth: 6,
      hitTime: 0, dead: false, deathTime: 0, age: 0, mismatchTime: 0,
      phase: unitHash(seed, 13, 0x487dbf21) * Math.PI * 2,
      randomState: mix32(seed ^ 0x51a3be81), attackCooldown: 0, attackLanded: false,
      provoked: 0, turnRate: 3.6, homeBiome: 'forest', activeMin: 0.22, activeMax: 1,
    };
  }

  _makeDunetail(x, y, z, seed) {
    const { geometries: geometry, materials: material } = this._resources;
    const root = new THREE.Group();
    const model = new THREE.Group();
    root.add(model);

    const body = prepareMesh(new THREE.Mesh(geometry.duneBody, material.duneFeather));
    body.position.y = 1.17;
    body.scale.set(0.82, 0.82, 1.18);
    model.add(body);

    const neckPivot = new THREE.Group();
    neckPivot.position.set(0, 1.37, 0.32);
    const neck = prepareMesh(new THREE.Mesh(geometry.duneNeck, material.duneLight));
    neck.position.set(0, 0.28, 0.08);
    neck.rotation.x = -0.25;
    neckPivot.add(neck);
    const head = prepareMesh(new THREE.Mesh(geometry.duneHead, material.duneFeather));
    head.position.set(0, 0.64, 0.22);
    neckPivot.add(head);
    const beak = prepareMesh(new THREE.Mesh(geometry.duneBeak, material.duneBeak));
    beak.position.set(0, 0.61, 0.55);
    beak.rotation.x = Math.PI / 2;
    neckPivot.add(beak);
    for (const side of [-1, 1]) {
      const eye = prepareMesh(new THREE.Mesh(geometry.eye, material.eyeWhite), false);
      eye.position.set(side * 0.245, 0.71, 0.34);
      const pupil = prepareMesh(new THREE.Mesh(geometry.pupil, material.eyeDark), false);
      pupil.position.z = 0.023;
      eye.add(pupil);
      neckPivot.add(eye);
      const crest = prepareMesh(new THREE.Mesh(geometry.crest, material.duneDark));
      crest.position.set(side * 0.09, 0.94, 0.15 - Math.abs(side) * 0.02);
      crest.rotation.z = side * 0.2;
      neckPivot.add(crest);
    }
    model.add(neckPivot);

    const wings = [];
    for (const side of [-1, 1]) {
      const pivot = new THREE.Group();
      pivot.position.set(side * 0.48, 1.2, 0);
      const wing = prepareMesh(new THREE.Mesh(geometry.duneWing, material.duneDark));
      wing.position.x = side * 0.05;
      pivot.add(wing);
      model.add(pivot);
      wings.push(pivot);
    }

    const legs = [];
    for (const side of [-1, 1]) {
      const pivot = new THREE.Group();
      pivot.position.set(side * 0.22, 0.86, -0.04);
      const leg = prepareMesh(new THREE.Mesh(geometry.duneLeg, material.duneDark));
      leg.position.y = -0.31;
      pivot.add(leg);
      const foot = prepareMesh(new THREE.Mesh(geometry.duneFoot, material.duneBeak));
      foot.position.set(0, -0.65, 0.12);
      pivot.add(foot);
      model.add(pivot);
      legs.push(pivot);
    }

    const tail = new THREE.Group();
    tail.position.set(0, 1.2, -0.48);
    for (const side of [-1, 0, 1]) {
      const feather = prepareMesh(new THREE.Mesh(geometry.duneTail, side === 0 ? material.duneFeather : material.duneDark));
      feather.position.set(side * 0.17, 0, -0.3 - Math.abs(side) * 0.04);
      feather.rotation.x = -Math.PI / 2;
      feather.rotation.z = side * 0.14;
      tail.add(feather);
    }
    model.add(tail);

    const hitGlow = prepareMesh(new THREE.Mesh(geometry.duneBody, material.hit), false);
    hitGlow.position.copy(body.position);
    hitGlow.scale.set(0.9, 0.9, 1.28);
    hitGlow.visible = false;
    hitGlow.renderOrder = 4;
    model.add(hitGlow);

    const scale = 0.9 + unitHash(seed, 5, 0xba627d13) * 0.18;
    root.position.set(x, y, z);
    root.scale.setScalar(scale);
    root.name = `Dunetail ${this._nextId}`;
    this.scene?.add(root);

    return {
      id: this._nextId++, type: 'dunetail', name: 'Dunetail', root, model,
      parts: { body, neckPivot, wings, legs, tail, hitGlow },
      radius: 0.78 * scale, centerHeight: 1.17 * scale, baseScale: scale,
      heading: unitHash(seed, 11, 0x65b4e21f) * Math.PI * 2, targetHeading: 0,
      desiredSpeed: 0, verticalVelocity: 0, knockbackX: 0, knockbackZ: 0,
      state: 'idle', stateTime: 0, stateDuration: 1.2, health: 3, maxHealth: 3,
      hitTime: 0, dead: false, deathTime: 0, age: 0, mismatchTime: 0,
      phase: unitHash(seed, 17, 0xd7a53c6d) * Math.PI * 2,
      randomState: mix32(seed ^ 0x845cd36b), attackCooldown: 0, attackLanded: false,
      provoked: 0, turnRate: 6.4, homeBiome: 'desert', activeMin: 0.4, activeMax: 1,
    };
  }

  _makeLumenwing(x, y, z, seed) {
    const { geometries: geometry, materials: material } = this._resources;
    const root = new THREE.Group();
    const model = new THREE.Group();
    root.add(model);

    const body = prepareMesh(new THREE.Mesh(geometry.lumenBody, material.lumenHide));
    body.scale.set(0.75, 1, 1.35);
    model.add(body);
    const abdomen = prepareMesh(new THREE.Mesh(geometry.lumenBody, material.lumenGlow), false);
    abdomen.position.z = -0.36;
    abdomen.scale.set(0.56, 0.66, 1.1);
    model.add(abdomen);
    const headPivot = new THREE.Group();
    headPivot.position.z = 0.37;
    const head = prepareMesh(new THREE.Mesh(geometry.lumenHead, material.lumenHide));
    headPivot.add(head);
    for (const side of [-1, 1]) {
      const eye = prepareMesh(new THREE.Mesh(geometry.eye, material.lumenGlow), false);
      eye.position.set(side * 0.14, 0.03, 0.16);
      eye.scale.set(0.7, 0.75, 0.7);
      headPivot.add(eye);
      const antenna = prepareMesh(new THREE.Mesh(geometry.antenna, material.lumenHide));
      antenna.position.set(side * 0.11, 0.2, 0.06);
      antenna.rotation.z = side * -0.45;
      antenna.rotation.x = 0.38;
      headPivot.add(antenna);
    }
    model.add(headPivot);

    const wings = [];
    for (const [side, back] of [[-1, 0], [1, 0], [-1, 1], [1, 1]]) {
      const pivot = new THREE.Group();
      pivot.position.set(side * 0.18, 0.02, back ? -0.2 : 0.13);
      const wing = prepareMesh(new THREE.Mesh(geometry.lumenWing, material.lumenWing), false);
      wing.position.x = side * 0.3;
      wing.scale.set(back ? 0.72 : 1, 1, back ? 0.72 : 1);
      pivot.add(wing);
      model.add(pivot);
      wings.push(pivot);
    }

    const tail = prepareMesh(new THREE.Mesh(geometry.lumenTail, material.lumenGlow), false);
    tail.position.set(0, 0, -0.72);
    tail.rotation.x = -Math.PI / 2;
    model.add(tail);

    const hitGlow = prepareMesh(new THREE.Mesh(geometry.lumenBody, material.hit), false);
    hitGlow.scale.set(0.84, 1.08, 1.45);
    hitGlow.visible = false;
    hitGlow.renderOrder = 4;
    model.add(hitGlow);

    const scale = 0.82 + unitHash(seed, 9, 0x90d4c2a5) * 0.23;
    root.position.set(x, y + 1.8 + unitHash(seed, 12) * 1.6, z);
    root.scale.setScalar(scale);
    root.name = `Lumenwing ${this._nextId}`;
    this.scene?.add(root);

    return {
      id: this._nextId++, type: 'lumenwing', name: 'Lumenwing', root, model,
      parts: { body, abdomen, headPivot, wings, tail, hitGlow },
      radius: 0.65 * scale, centerHeight: 0, baseScale: scale,
      heading: unitHash(seed, 14, 0x37bd1267) * Math.PI * 2, targetHeading: 0,
      desiredSpeed: 0, verticalVelocity: 0, knockbackX: 0, knockbackZ: 0,
      state: 'wander', stateTime: 0, stateDuration: 2, health: 2, maxHealth: 2,
      hitTime: 0, dead: false, deathTime: 0, age: 0, mismatchTime: 0,
      phase: unitHash(seed, 19, 0x6f12d44d) * Math.PI * 2,
      randomState: mix32(seed ^ 0xb42f1369), attackCooldown: 0, attackLanded: false,
      provoked: 0, turnRate: 5.8, homeBiome: 'forest', activeMin: 0.08, activeMax: 0.68,
      flying: true, hoverBase: root.position.y, hoverTarget: root.position.y,
    };
  }

  _makeGloomling(x, y, z, seed) {
    const { geometries: geometry, materials: material } = this._resources;
    const root = new THREE.Group();
    const model = new THREE.Group();
    root.add(model);

    const body = prepareMesh(new THREE.Mesh(geometry.gloomBody, material.gloomHide));
    body.position.y = 0.9;
    body.scale.set(1, 0.74, 0.82);
    model.add(body);

    const shoulderPlates = [];
    for (const side of [-1, 1]) {
      const plate = prepareMesh(new THREE.Mesh(geometry.gloomPlate, material.gloomPlate));
      plate.position.set(side * 0.43, 1.03, 0.02);
      plate.rotation.z = side * 0.48;
      plate.scale.set(0.72, 1, 0.72);
      model.add(plate);
      shoulderPlates.push(plate);
    }

    const headPivot = new THREE.Group();
    headPivot.position.set(0, 0.86, 0.5);
    const head = prepareMesh(new THREE.Mesh(geometry.gloomHead, material.gloomPlate));
    head.position.z = 0.13;
    headPivot.add(head);

    const eye = prepareMesh(new THREE.Mesh(geometry.gloomEye, material.gloomEye), false);
    eye.position.set(0, 0.06, 0.397);
    headPivot.add(eye);

    const jaw = prepareMesh(new THREE.Mesh(geometry.gloomJaw, material.gloomHide));
    jaw.position.set(0, -0.27, 0.23);
    headPivot.add(jaw);

    for (const side of [-1, 1]) {
      const horn = prepareMesh(new THREE.Mesh(geometry.gloomHorn, material.gloomClaw));
      horn.position.set(side * 0.23, 0.35, 0.03);
      horn.rotation.z = side * -0.34;
      headPivot.add(horn);
    }
    model.add(headPivot);

    const legs = [];
    for (const [legX, legZ] of [[-0.38, -0.25], [0.38, -0.25], [-0.38, 0.22], [0.38, 0.22]]) {
      const pivot = new THREE.Group();
      pivot.position.set(legX, 0.56, legZ);
      const leg = prepareMesh(new THREE.Mesh(geometry.gloomLeg, material.gloomClaw));
      leg.position.y = -0.27;
      pivot.add(leg);
      for (const side of [-1, 1]) {
        const claw = prepareMesh(new THREE.Mesh(geometry.gloomClaw, material.gloomClaw));
        claw.position.set(side * 0.07, -0.54, 0.12);
        claw.rotation.x = Math.PI / 2;
        pivot.add(claw);
      }
      model.add(pivot);
      legs.push(pivot);
    }

    const hitGlow = prepareMesh(new THREE.Mesh(geometry.gloomBody, material.hit), false);
    hitGlow.position.copy(body.position);
    hitGlow.scale.set(1.07, 0.8, 0.88);
    hitGlow.visible = false;
    hitGlow.renderOrder = 4;
    model.add(hitGlow);

    const scale = 0.88 + unitHash(seed, 5, 0x165667b1) * 0.16;
    root.position.set(x, y, z);
    root.scale.setScalar(scale);
    root.name = `Gloomling ${this._nextId}`;
    this.scene?.add(root);

    return {
      id: this._nextId++,
      type: 'gloomling',
      name: 'Gloomling',
      root,
      model,
      parts: { body, shoulderPlates, headPivot, eye, jaw, legs, hitGlow },
      radius: 0.78 * scale,
      centerHeight: 0.76 * scale,
      baseScale: scale,
      heading: unitHash(seed, 13, 0xc2b2ae35) * Math.PI * 2,
      targetHeading: 0,
      desiredSpeed: 0,
      verticalVelocity: 0,
      knockbackX: 0,
      knockbackZ: 0,
      state: 'idle',
      stateTime: 0,
      stateDuration: 1.2,
      health: 4,
      maxHealth: 4,
      hitTime: 0,
      dead: false,
      deathTime: 0,
      age: 0,
      mismatchTime: 0,
      phase: unitHash(seed, 19, 0x94d049bb) * Math.PI * 2,
      randomState: mix32(seed ^ 0x8cb92baa),
      attackCooldown: unitHash(seed, 23) * 0.6,
      attackLanded: false,
      provoked: 0,
      turnRate: 5.8,
      homeBiome: null,
      activeMin: 0,
      activeMax: 0.56,
    };
  }

  _groundHeight(x, z, referenceY) {
    if (!this.world) return Number.isFinite(referenceY) ? referenceY : 0;
    const worldHeight = Math.max(8, Number(this.world.worldHeight) || 64);
    let terrain = Number(this.world.terrainHeight?.(x, z));
    if (!Number.isFinite(terrain)) terrain = (Number(referenceY) || 1) - 1;
    const base = clamp(Math.floor(terrain), 0, worldHeight - 2);
    const top = Math.min(worldHeight - 2, base + 3);
    const bottom = Math.max(0, base - 7);
    const blockX = Math.floor(x);
    const blockZ = Math.floor(z);

    for (let y = top; y >= bottom; y -= 1) {
      if (!isSolid(this.world.getBlock?.(blockX, y, blockZ))) continue;
      const above = this.world.getBlock?.(blockX, y + 1, blockZ);
      if (!isSolid(above)) return y + 1;
    }
    return base + 1;
  }

  _canOccupy(x, ground, z) {
    if (!this.world || !Number.isFinite(ground)) return true;
    const blockX = Math.floor(x);
    const blockZ = Math.floor(z);
    const feet = Math.floor(ground + 0.05);
    const atFeet = this.world.getBlock?.(blockX, feet, blockZ);
    const atHead = this.world.getBlock?.(blockX, feet + 1, blockZ);
    return !isSolid(atFeet) && !isSolid(atHead) && !isLiquid(atFeet);
  }

  _canFlyAt(x, y, z) {
    if (!this.world) return true;
    const blockX = Math.floor(x);
    const blockY = Math.floor(y);
    const blockZ = Math.floor(z);
    return !isSolid(this.world.getBlock?.(blockX, blockY, blockZ))
      && !isSolid(this.world.getBlock?.(blockX, blockY + 1, blockZ))
      && !isLiquid(this.world.getBlock?.(blockX, blockY, blockZ));
  }

  _validSpawn(x, z, playerPosition) {
    const ground = this._groundHeight(x, z, playerPosition.y);
    const terrain = Number(this.world?.terrainHeight?.(x, z));
    if (Number.isFinite(terrain) && Math.abs(ground - (terrain + 1)) > 1.1) return null;
    if (!this._canOccupy(x, ground, z)) return null;

    const groundBlock = this.world?.getBlock?.(Math.floor(x), Math.floor(ground - 0.05), Math.floor(z));
    if (!isSolid(groundBlock)) return null;
    const waterAtFeet = this.world?.getBlock?.(Math.floor(x), Math.floor(ground + 0.05), Math.floor(z));
    if (isLiquid(waterAtFeet)) return null;

    if (this.world?.terrainHeight) {
      const h0 = Number(this.world.terrainHeight(x, z));
      const slope = Math.max(
        Math.abs(h0 - Number(this.world.terrainHeight(x + 1, z))),
        Math.abs(h0 - Number(this.world.terrainHeight(x - 1, z))),
        Math.abs(h0 - Number(this.world.terrainHeight(x, z + 1))),
        Math.abs(h0 - Number(this.world.terrainHeight(x, z - 1))),
      );
      if (!Number.isFinite(slope) || slope > 1.2) return null;
    }

    for (const creature of this.creatures) {
      const dx = creature.root.position.x - x;
      const dz = creature.root.position.z - z;
      if (dx * dx + dz * dz < 4.5 * 4.5) return null;
    }
    return ground;
  }

  _typeForSpawn(biome, daylight, roll) {
    const twilight = daylight > 0.18 && daylight < 0.68;
    if (daylight <= 0.36) {
      if (biome === 'forest' && roll < 0.46) return 'lumenwing';
      if (biome === 'plains' && roll < 0.18) return 'lumenwing';
      return 'gloomling';
    }
    if (twilight && biome === 'forest' && roll < 0.42) return 'lumenwing';
    if (biome === 'desert') return 'dunetail';
    if (biome === 'forest') return roll < 0.62 ? 'bramblehog' : 'dapple';
    return roll < 0.82 ? 'dapple' : 'dunetail';
  }

  _createCreature(type, x, ground, z, seed) {
    let creature;
    if (type === 'dapple') creature = this._makeDapple(x, ground, z, seed);
    else if (type === 'bramblehog') creature = this._makeBramblehog(x, ground, z, seed);
    else if (type === 'dunetail') creature = this._makeDunetail(x, ground, z, seed);
    else if (type === 'lumenwing') creature = this._makeLumenwing(x, ground, z, seed);
    else creature = this._makeGloomling(x, ground, z, seed);
    this._requestAnimalVisual(creature, seed);
    return creature;
  }

  _trySpawn(player, dayAmount) {
    if (this.creatures.length >= MAX_CREATURES) return;
    const playerPosition = player?.position ?? player?.camera?.position;
    if (!playerPosition) return;

    const daylight = clamp(Number(dayAmount) || 0, 0, 1);
    player.getLookDirection?.(this._spawnForward);
    this._spawnForward.y = 0;
    if (this._spawnForward.lengthSq() < 0.01) {
      this._spawnForward.set(-Math.sin(Number(player.yaw) || 0), 0, -Math.cos(Number(player.yaw) || 0));
    } else this._spawnForward.normalize();

    const worldSeed = Number(this.world?.seed) >>> 0;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const serial = ++this._spawnSerial;
      const seed = mix32(worldSeed ^ Math.imul(serial, 0x9e3779b9));
      const angle = unitHash(seed, 1, 0xa24baed5) * Math.PI * 2;
      const radius = MIN_SPAWN_RADIUS
        + unitHash(seed, 2, 0x9fb21c65) * (MAX_SPAWN_RADIUS - MIN_SPAWN_RADIUS);
      const x = Math.floor(playerPosition.x + Math.cos(angle) * radius) + 0.5;
      const z = Math.floor(playerPosition.z + Math.sin(angle) * radius) + 0.5;
      const dx = x - playerPosition.x;
      const dz = z - playerPosition.z;
      if (dx * dx + dz * dz < MIN_SPAWN_RADIUS * MIN_SPAWN_RADIUS) continue;
      const inverseDistance = 1 / Math.max(0.001, Math.hypot(dx, dz));
      const viewDot = this._spawnForward.x * dx * inverseDistance + this._spawnForward.z * dz * inverseDistance;
      // New animals enter from the distant rear hemisphere. They can later
      // wander into view, but never materialize beneath the player's crosshair.
      if (viewDot > -0.12) continue;
      const biome = this.world?.biomeAt?.(x, z) || 'plains';
      const type = this._typeForSpawn(biome, daylight, unitHash(seed, 8, 0xac2f91d3));
      const typeCount = this.creatures.reduce(
        (total, creature) => total + (creature.type === type ? 1 : 0), 0,
      );
      if (typeCount >= (CREATURE_CAPS[type] ?? 4)) continue;
      const ground = this._validSpawn(x, z, playerPosition);
      if (ground == null) continue;

      const creature = this._createCreature(type, x, ground, z, seed);
      creature.targetHeading = creature.heading;
      creature.spawnBiome = biome;
      this.creatures.push(creature);
      return;
    }
  }

  _removeCreature(creature) {
    creature.assetAnimator?.dispose();
    this.scene?.remove(creature.root);
    const index = this.creatures.indexOf(creature);
    if (index >= 0) this.creatures.splice(index, 1);
  }

  _chooseWander(creature) {
    creature.targetHeading = creature.heading + (nextRandom(creature) - 0.5) * Math.PI * 1.35;
    setState(creature, 'wander', 1.8 + nextRandom(creature) * 3.4);
  }

  _steerWithFlock(creature, cohesion = 0.16) {
    let centerX = 0;
    let centerZ = 0;
    let separationX = 0;
    let separationZ = 0;
    let nearby = 0;
    for (const other of this.creatures) {
      if (other === creature || other.dead || other.type !== creature.type) continue;
      const dx = other.root.position.x - creature.root.position.x;
      const dz = other.root.position.z - creature.root.position.z;
      const distanceSq = dx * dx + dz * dz;
      if (distanceSq > 11 * 11) continue;
      nearby += 1;
      centerX += other.root.position.x;
      centerZ += other.root.position.z;
      if (distanceSq < 2.4 * 2.4) {
        const inverse = 1 / Math.max(0.3, distanceSq);
        separationX -= dx * inverse;
        separationZ -= dz * inverse;
      }
    }
    if (!nearby) return;
    const towardX = centerX / nearby - creature.root.position.x;
    const towardZ = centerZ / nearby - creature.root.position.z;
    const steerX = towardX * cohesion + separationX * 1.35;
    const steerZ = towardZ * cohesion + separationZ * 1.35;
    if (steerX * steerX + steerZ * steerZ > 0.01) {
      const socialHeading = Math.atan2(steerX, steerZ);
      creature.targetHeading += shortestAngle(creature.targetHeading, socialHeading) * 0.24;
    }
  }

  _updateDappleIntent(creature, playerPosition, daylight) {
    const dx = playerPosition.x - creature.root.position.x;
    const dz = playerPosition.z - creature.root.position.z;
    const distanceSq = dx * dx + dz * dz;

    if (distanceSq < 5.2 * 5.2 || daylight < 0.34) {
      creature.targetHeading = Math.atan2(-dx, -dz) + (nextRandom(creature) - 0.5) * 0.35;
      creature.desiredSpeed = daylight < 0.34 ? 2.05 : 2.65;
      setState(creature, 'flee', 1.5);
      return;
    }

    if (creature.state === 'hit' && creature.hitTime > 0) {
      creature.desiredSpeed = 0;
      return;
    }

    if (creature.state === 'flee' && creature.stateTime < creature.stateDuration) {
      creature.desiredSpeed = 2.35;
      return;
    }

    if (creature.stateTime >= creature.stateDuration) {
      const choice = nextRandom(creature);
      if (choice < 0.36) setState(creature, 'graze', 2.2 + nextRandom(creature) * 4.2);
      else if (choice < 0.63) setState(creature, 'idle', 1.2 + nextRandom(creature) * 2.7);
      else this._chooseWander(creature);
    }
    creature.desiredSpeed = creature.state === 'wander' ? 0.78 : 0;
    if (creature.state === 'wander') this._steerWithFlock(creature, 0.14);
  }

  _updateBramblehogIntent(creature, player, playerPosition, daylight) {
    const dx = playerPosition.x - creature.root.position.x;
    const dz = playerPosition.z - creature.root.position.z;
    const dy = playerPosition.y - creature.root.position.y;
    const distance = Math.hypot(dx, dz);
    if (creature.state === 'hit' && creature.hitTime > 0) {
      creature.desiredSpeed = 0;
      return;
    }
    if (creature.state === 'attack') {
      creature.targetHeading = Math.atan2(dx, dz);
      creature.desiredSpeed = creature.stateTime < 0.24 ? 3.2 : 0;
      if (!creature.attackLanded && creature.stateTime >= 0.25) {
        creature.attackLanded = true;
        if (distance < 2.05 && Math.abs(dy) < 2.2) this._damagePlayer(player, creature);
      }
      if (creature.stateTime >= 0.72) {
        creature.attackCooldown = 1.4;
        setState(creature, 'guard', 0.8);
      }
      return;
    }

    if (creature.provoked > 0 && daylight >= 0.12) {
      creature.targetHeading = Math.atan2(dx, dz);
      if (distance < 1.72 && creature.attackCooldown <= 0) {
        setState(creature, 'attack', 0.72);
        creature.desiredSpeed = 0;
      } else {
        setState(creature, 'charge', 1);
        creature.desiredSpeed = distance > 2.2 ? 2.3 : 0.45;
      }
      return;
    }

    if (distance < 4.2) {
      creature.targetHeading = Math.atan2(dx, dz);
      creature.desiredSpeed = 0;
      setState(creature, 'guard', 1.1);
      return;
    }
    if (daylight < 0.18) {
      creature.targetHeading = Math.atan2(-dx, -dz);
      creature.desiredSpeed = 1.55;
      setState(creature, 'flee', 1.5);
      return;
    }
    if (creature.state === 'hit' && creature.hitTime > 0) {
      creature.desiredSpeed = 0;
      return;
    }
    if (creature.stateTime >= creature.stateDuration) {
      const choice = nextRandom(creature);
      if (choice < 0.48) setState(creature, 'root', 2.1 + nextRandom(creature) * 3.8);
      else if (choice < 0.68) setState(creature, 'idle', 1.2 + nextRandom(creature) * 2.2);
      else this._chooseWander(creature);
    }
    creature.desiredSpeed = creature.state === 'wander' ? 0.58 : 0;
    if (creature.state === 'wander') this._steerWithFlock(creature, 0.1);
  }

  _updateDunetailIntent(creature, playerPosition, daylight) {
    const dx = playerPosition.x - creature.root.position.x;
    const dz = playerPosition.z - creature.root.position.z;
    const distanceSq = dx * dx + dz * dz;
    if (distanceSq < 7.2 * 7.2 || daylight < 0.3 || creature.state === 'hit') {
      creature.targetHeading = Math.atan2(-dx, -dz) + (nextRandom(creature) - 0.5) * 0.22;
      creature.desiredSpeed = 3.65;
      setState(creature, 'sprint', 1.7);
      return;
    }
    if (creature.state === 'sprint' && creature.stateTime < creature.stateDuration) {
      creature.desiredSpeed = 3.3;
      return;
    }
    if (creature.stateTime >= creature.stateDuration) {
      const choice = nextRandom(creature);
      if (choice < 0.32) setState(creature, 'peck', 1.1 + nextRandom(creature) * 1.6);
      else if (choice < 0.6) setState(creature, 'scan', 1.4 + nextRandom(creature) * 2.3);
      else this._chooseWander(creature);
    }
    creature.desiredSpeed = creature.state === 'wander' ? 1.12 : 0;
    if (creature.state === 'wander') this._steerWithFlock(creature, 0.18);
  }

  _updateLumenwingIntent(creature, playerPosition, daylight) {
    const dx = playerPosition.x - creature.root.position.x;
    const dz = playerPosition.z - creature.root.position.z;
    const distanceSq = dx * dx + dz * dz;
    if (distanceSq < 3.4 * 3.4 || creature.state === 'hit') {
      creature.targetHeading = Math.atan2(-dx, -dz) + (nextRandom(creature) - 0.5) * 0.45;
      creature.desiredSpeed = 2.9;
      creature.hoverTarget = Math.max(creature.hoverTarget, playerPosition.y + 2.6);
      setState(creature, 'dart', 1.15);
      return;
    }
    if (creature.state === 'dart' && creature.stateTime < creature.stateDuration) {
      creature.desiredSpeed = 2.5;
      return;
    }
    if (creature.stateTime >= creature.stateDuration) {
      creature.targetHeading += (nextRandom(creature) - 0.5) * 2.3;
      creature.hoverTarget = this._groundHeight(
        creature.root.position.x, creature.root.position.z, creature.root.position.y,
      ) + 1.7 + nextRandom(creature) * 2.4;
      setState(creature, nextRandom(creature) < 0.24 ? 'hover' : 'wander', 1.2 + nextRandom(creature) * 2.8);
    }
    creature.desiredSpeed = creature.state === 'hover' ? 0.18 : 1.15;
    this._steerWithFlock(creature, 0.2);
    if (daylight > 0.74) creature.desiredSpeed = Math.max(creature.desiredSpeed, 1.8);
  }

  _damagePlayer(player, creature) {
    if (this._time - this._lastPlayerDamage < PLAYER_DAMAGE_INTERVAL) return false;
    this._lastPlayerDamage = this._time;
    const damage = creature.type === 'bramblehog' ? 0.16 : 0.12;

    if (typeof this.onPlayerDamage === 'function') {
      // The callback owns damage application so game modes can ignore or alter it.
      this.onPlayerDamage(damage, creature.root.position, creature);
    } else {
      if (Number.isFinite(player?.health)) player.health = Math.max(0, player.health - damage);
      player?.onDamage?.(damage, creature);

      const playerPosition = player?.position;
      const velocity = player?.velocity;
      if (playerPosition && velocity?.isVector3) {
        let dx = playerPosition.x - creature.root.position.x;
        let dz = playerPosition.z - creature.root.position.z;
        const length = Math.hypot(dx, dz) || 1;
        dx /= length;
        dz /= length;
        velocity.x += dx * 2.9;
        velocity.y = Math.max(velocity.y, 2.1);
        velocity.z += dz * 2.9;
      }
    }
    return true;
  }

  _updateGloomlingIntent(creature, player, playerPosition, daylight) {
    const dx = playerPosition.x - creature.root.position.x;
    const dz = playerPosition.z - creature.root.position.z;
    const dy = playerPosition.y - creature.root.position.y;
    const distanceSq = dx * dx + dz * dz;
    const distance = Math.sqrt(distanceSq);
    const nighttime = daylight <= 0.43;

    creature.attackCooldown = Math.max(0, creature.attackCooldown);
    if (!nighttime) {
      creature.targetHeading = Math.atan2(-dx, -dz);
      creature.desiredSpeed = 2.7;
      setState(creature, 'flee', 1.2);
      return;
    }

    if (creature.state === 'hit' && creature.hitTime > 0) {
      creature.desiredSpeed = 0;
      return;
    }

    if (creature.state === 'attack') {
      creature.desiredSpeed = 0;
      creature.targetHeading = Math.atan2(dx, dz);
      if (!creature.attackLanded && creature.stateTime >= 0.22) {
        creature.attackLanded = true;
        if (distance < 1.9 && Math.abs(dy) < 2.25) this._damagePlayer(player, creature);
      }
      if (creature.stateTime >= 0.62) {
        creature.attackCooldown = 1.08;
        setState(creature, 'chase', 0.5);
      }
      return;
    }

    if (distance < 1.62 && Math.abs(dy) < 2.25 && creature.attackCooldown <= 0) {
      setState(creature, 'attack', 0.62);
      creature.targetHeading = Math.atan2(dx, dz);
      creature.desiredSpeed = 0;
      return;
    }

    if (distanceSq < 18 * 18) {
      creature.targetHeading = Math.atan2(dx, dz);
      creature.desiredSpeed = distance < 2.2 ? 0.45 : 1.72;
      setState(creature, 'chase', 1);
      return;
    }

    if (creature.stateTime >= creature.stateDuration) {
      if (nextRandom(creature) < 0.38) setState(creature, 'idle', 0.8 + nextRandom(creature) * 1.8);
      else this._chooseWander(creature);
    }
    creature.desiredSpeed = creature.state === 'wander' ? 0.95 : 0;
  }

  _moveCreature(creature, dt) {
    const turnRate = creature.turnRate ?? (creature.type === 'gloomling' ? 5.5 : 3.6);
    const angleDelta = shortestAngle(creature.heading, creature.targetHeading);
    creature.heading += clamp(angleDelta, -turnRate * dt, turnRate * dt);

    let speed = creature.dead || creature.state === 'hit' ? 0 : creature.desiredSpeed;
    const moveX = Math.sin(creature.heading) * speed + creature.knockbackX;
    const moveZ = Math.cos(creature.heading) * speed + creature.knockbackZ;
    const nextX = creature.root.position.x + moveX * dt;
    const nextZ = creature.root.position.z + moveZ * dt;

    if (creature.flying) {
      const ground = this._groundHeight(nextX, nextZ, creature.root.position.y);
      const safeTarget = Math.max(ground + 1.25, creature.hoverTarget ?? ground + 2.3);
      const rise = clamp((safeTarget - creature.root.position.y) * 2.1, -2.1, 2.1);
      const nextY = creature.root.position.y + rise * dt;
      if (this._canFlyAt(nextX, nextY, nextZ)) {
        creature.root.position.set(nextX, nextY, nextZ);
      } else {
        creature.targetHeading += (nextRandom(creature) > 0.5 ? 1 : -1) * 1.4;
        creature.hoverTarget = Math.max(creature.root.position.y + 1.1, safeTarget);
      }
      const damping = Math.exp(-5.5 * dt);
      creature.knockbackX *= damping;
      creature.knockbackZ *= damping;
      creature.root.rotation.y = creature.heading;
      return speed;
    }

    const nextGround = this._groundHeight(nextX, nextZ, creature.root.position.y);
    const climb = nextGround - creature.root.position.y;

    if (this._canOccupy(nextX, nextGround, nextZ) && climb <= 1.06) {
      creature.root.position.x = nextX;
      creature.root.position.z = nextZ;
      if (climb > 0.02 && climb <= 1.06) {
        creature.root.position.y = nextGround;
        creature.verticalVelocity = 0;
      }
    } else {
      creature.targetHeading += (nextRandom(creature) > 0.5 ? 1 : -1) * (1.2 + nextRandom(creature));
      creature.knockbackX *= 0.25;
      creature.knockbackZ *= 0.25;
      speed = 0;
    }

    const ground = this._groundHeight(creature.root.position.x, creature.root.position.z, creature.root.position.y);
    if (creature.root.position.y > ground + 0.025 || creature.verticalVelocity > 0) {
      creature.verticalVelocity -= GRAVITY * dt;
      creature.root.position.y += creature.verticalVelocity * dt;
      if (creature.root.position.y <= ground) {
        creature.root.position.y = ground;
        creature.verticalVelocity = 0;
      }
    } else {
      creature.root.position.y = ground;
      creature.verticalVelocity = 0;
    }

    const knockbackDamping = Math.exp(-5.2 * dt);
    creature.knockbackX *= knockbackDamping;
    creature.knockbackZ *= knockbackDamping;
    creature.root.rotation.y = creature.heading;
    return speed;
  }

  _animateDapple(creature, speed) {
    const { body, headPivot, ears, legs, tail, hitGlow } = creature.parts;
    const moving = speed > 0.08;
    const pace = creature.state === 'flee' ? 10.5 : 6.2;
    const cycle = this._time * pace + creature.phase;
    const stride = moving ? Math.min(0.72, speed * 0.28) : 0;
    const breathe = Math.sin(this._time * 2.1 + creature.phase) * 0.018;
    body.position.y = 0.88 + breathe + (moving ? Math.abs(Math.sin(cycle)) * 0.025 : 0);
    body.rotation.z = moving ? Math.sin(cycle * 0.5) * 0.025 : 0;

    for (let index = 0; index < legs.length; index += 1) {
      const phase = index === 0 || index === 3 ? 0 : Math.PI;
      legs[index].rotation.x = Math.sin(cycle + phase) * stride;
    }

    const grazing = creature.state === 'graze' && creature.stateTime > 0.2;
    headPivot.rotation.x = grazing
      ? 0.68 + Math.sin(this._time * 1.4 + creature.phase) * 0.07
      : -0.04 + Math.sin(this._time * 2.7 + creature.phase) * 0.035;
    headPivot.rotation.z = creature.state === 'hit' ? Math.sin(this._time * 31) * 0.08 : 0;
    ears[0].rotation.y = Math.sin(this._time * 3.4 + creature.phase) * 0.16;
    ears[1].rotation.y = -ears[0].rotation.y;
    tail.rotation.z = Math.sin(this._time * (creature.state === 'flee' ? 12 : 4.8) + creature.phase) * 0.28;
    hitGlow.visible = creature.hitTime > 0 && Math.floor(creature.hitTime * 32) % 2 === 0;
  }

  _animateBramblehog(creature, speed) {
    const { body, shell, spines, headPivot, legs, tail, hitGlow } = creature.parts;
    const moving = speed > 0.08;
    const charging = creature.state === 'charge' || creature.state === 'attack';
    const cycle = this._time * (charging ? 11.5 : 5.3) + creature.phase;
    const stride = moving ? Math.min(charging ? 0.64 : 0.42, speed * 0.25) : 0;
    const stomp = moving ? Math.abs(Math.sin(cycle)) * (charging ? 0.065 : 0.028) : 0;
    body.position.y = 0.78 + stomp + Math.sin(this._time * 1.8 + creature.phase) * 0.012;
    shell.position.y = 0.97 + stomp * 0.8;
    shell.rotation.z = moving ? Math.sin(cycle * 0.5) * 0.03 : 0;
    for (let index = 0; index < legs.length; index += 1) {
      const phase = index === 0 || index === 3 ? 0 : Math.PI;
      legs[index].rotation.x = Math.sin(cycle + phase) * stride;
    }
    const rooting = creature.state === 'root';
    const guard = creature.state === 'guard';
    const attackPulse = creature.state === 'attack'
      ? Math.sin(clamp(creature.stateTime / 0.72, 0, 1) * Math.PI)
      : 0;
    headPivot.rotation.x = rooting
      ? 0.62 + Math.sin(this._time * 5.2 + creature.phase) * 0.12
      : guard ? -0.18 : charging ? 0.22 - attackPulse * 0.32 : 0;
    headPivot.position.z = 0.67 + attackPulse * 0.24;
    for (let index = 0; index < spines.length; index += 1) {
      spines[index].rotation.y = Math.sin(this._time * 1.7 + creature.phase + index) * 0.055;
      spines[index].scale.y = guard || charging ? 1.12 : 1;
    }
    tail.rotation.z = Math.sin(this._time * (guard ? 8 : 3.2) + creature.phase) * 0.22;
    hitGlow.visible = creature.hitTime > 0 && Math.floor(creature.hitTime * 34) % 2 === 0;
  }

  _animateDunetail(creature, speed) {
    const { body, neckPivot, wings, legs, tail, hitGlow } = creature.parts;
    const moving = speed > 0.08;
    const sprinting = creature.state === 'sprint';
    const pace = sprinting ? 15 : 8.2;
    const cycle = this._time * pace + creature.phase;
    const stride = moving ? Math.min(0.95, speed * 0.29) : 0;
    body.position.y = 1.17 + (moving ? Math.abs(Math.sin(cycle)) * (sprinting ? 0.11 : 0.05) : 0);
    body.rotation.x = sprinting ? -0.18 : 0;
    body.rotation.z = moving ? Math.sin(cycle * 0.5) * 0.045 : 0;
    legs[0].rotation.x = Math.sin(cycle) * stride;
    legs[1].rotation.x = Math.sin(cycle + Math.PI) * stride;
    const peck = creature.state === 'peck'
      ? Math.max(0, Math.sin(creature.stateTime * 8.5))
      : 0;
    const scan = creature.state === 'scan'
      ? Math.sin(this._time * 2.5 + creature.phase) * 0.35
      : 0;
    neckPivot.rotation.x = peck * 0.72 + (sprinting ? 0.2 : 0);
    neckPivot.rotation.y = scan;
    for (let index = 0; index < wings.length; index += 1) {
      const side = index === 0 ? -1 : 1;
      wings[index].rotation.z = side * (sprinting ? 0.34 + Math.sin(cycle * 1.35) * 0.23 : 0.08);
      wings[index].rotation.x = sprinting ? Math.sin(cycle) * 0.12 : 0;
    }
    tail.rotation.x = sprinting ? -0.2 + Math.sin(cycle) * 0.08 : Math.sin(this._time * 2 + creature.phase) * 0.05;
    tail.rotation.z = moving ? -Math.sin(cycle * 0.5) * 0.08 : 0;
    hitGlow.visible = creature.hitTime > 0 && Math.floor(creature.hitTime * 36) % 2 === 0;
  }

  _animateLumenwing(creature, speed) {
    const { body, abdomen, headPivot, wings, tail, hitGlow } = creature.parts;
    const darting = creature.state === 'dart';
    const cycle = this._time * (darting ? 31 : 22) + creature.phase;
    const flap = Math.sin(cycle) * (darting ? 0.74 : 0.56);
    for (let index = 0; index < wings.length; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const rear = index >= 2;
      wings[index].rotation.z = side * (0.14 + flap * (rear ? -0.82 : 1));
      wings[index].rotation.y = side * (rear ? -0.2 : 0.08);
    }
    body.position.y = Math.sin(this._time * 4.2 + creature.phase) * 0.035;
    abdomen.scale.set(0.56, 0.66, 1.1 + Math.sin(this._time * 3.4 + creature.phase) * 0.08);
    headPivot.rotation.y = Math.sin(this._time * 1.8 + creature.phase) * 0.22;
    headPivot.rotation.x = darting ? -0.18 : Math.sin(this._time * 2.2 + creature.phase) * 0.05;
    tail.rotation.z = Math.sin(this._time * 5.5 + creature.phase) * 0.18;
    creature.model.rotation.z = Math.sin(this._time * 1.6 + creature.phase) * 0.07;
    creature.model.rotation.x = speed > 1.8 ? -0.16 : 0;
    hitGlow.visible = creature.hitTime > 0 && Math.floor(creature.hitTime * 38) % 2 === 0;
  }

  _animateGloomling(creature, speed) {
    const { body, shoulderPlates, headPivot, eye, jaw, legs, hitGlow } = creature.parts;
    const moving = speed > 0.08;
    const pace = creature.state === 'chase' ? 11 : creature.state === 'flee' ? 12 : 7;
    const cycle = this._time * pace + creature.phase;
    const stride = moving ? Math.min(0.8, speed * 0.34) : 0;
    body.position.y = 0.9 + Math.sin(this._time * 3.8 + creature.phase) * 0.035;
    body.rotation.z = Math.sin(this._time * 2.5 + creature.phase) * 0.035;
    body.scale.set(1, 0.74 + Math.sin(this._time * 3 + creature.phase) * 0.018, 0.82);

    for (let index = 0; index < shoulderPlates.length; index += 1) {
      shoulderPlates[index].position.y = 1.03 + Math.sin(this._time * 3.1 + creature.phase + index) * 0.025;
    }

    for (let index = 0; index < legs.length; index += 1) {
      const phase = index === 0 || index === 3 ? 0 : Math.PI;
      legs[index].rotation.x = Math.sin(cycle + phase) * stride;
      legs[index].rotation.z = Math.sin(cycle * 0.5 + index) * 0.05;
    }

    const attackPulse = creature.state === 'attack' ? Math.sin(Math.min(1, creature.stateTime / 0.62) * Math.PI) : 0;
    headPivot.position.z = 0.5 + attackPulse * 0.28;
    headPivot.rotation.x = -attackPulse * 0.16;
    jaw.rotation.x = attackPulse * 0.65;
    eye.scale.x = 0.9 + Math.sin(this._time * 5 + creature.phase) * 0.1 + attackPulse * 0.3;
    hitGlow.visible = creature.hitTime > 0 && Math.floor(creature.hitTime * 34) % 2 === 0;
  }

  _animateDeath(creature, dt) {
    if (creature.assetAnimator) {
      creature.assetAnimator.update(dt, 0);
      creature.root.scale.setScalar(creature.baseScale);
      creature.root.rotation.z = 0;
      creature.model.position.y = 0;
      return;
    }
    const progress = clamp(creature.deathTime / 0.72, 0, 1);
    const scale = creature.baseScale * (1 - progress * 0.72);
    creature.root.scale.setScalar(Math.max(0.03, scale));
    creature.root.rotation.z = progress * 1.28;
    creature.model.position.y = -progress * 0.16;
    creature.parts.hitGlow.visible = progress < 0.3;
  }

  update(dt, player, dayAmount = 1) {
    if (this._disposed) return;
    dt = clamp(Number(dt) || 0, 0, 0.08);
    if (dt <= 0) return;
    this._time += dt;
    const daylight = clamp(Number(dayAmount) || 0, 0, 1);
    const playerPosition = player?.position ?? player?.camera?.position;
    if (!playerPosition) return;

    this._spawnTimer -= dt;
    if (this._spawnTimer <= 0) {
      const jitter = unitHash(Number(this.world?.seed) >>> 0, this._spawnSerial + 31, 0x632be5ab);
      this._spawnTimer = 1.25 + jitter * 1.65;
      this._trySpawn(player, daylight);
    }

    for (let index = this.creatures.length - 1; index >= 0; index -= 1) {
      const creature = this.creatures[index];
      creature.age += dt;
      creature.stateTime += dt;
      creature.hitTime = Math.max(0, creature.hitTime - dt);
      creature.attackCooldown = Math.max(0, creature.attackCooldown - dt);
      creature.provoked = Math.max(0, (creature.provoked || 0) - dt);
      const dx = creature.root.position.x - playerPosition.x;
      const dz = creature.root.position.z - playerPosition.z;
      const distanceSq = dx * dx + dz * dz;

      if (creature.dead) {
        creature.deathTime += dt;
        this._animateDeath(creature, dt);
        const deathDuration = creature.assetAnimator?.deathDuration ?? 0.72;
        if (creature.deathTime >= deathDuration) this._removeCreature(creature);
        continue;
      }

      const compatibleTime = daylight >= (creature.activeMin ?? 0)
        && daylight <= (creature.activeMax ?? 1);
      creature.mismatchTime = compatibleTime ? 0 : creature.mismatchTime + dt;
      if (distanceSq > DESPAWN_DISTANCE_SQ
        || (creature.mismatchTime > 10 && distanceSq > 21 * 21)
        || (creature.age > 240 && distanceSq > 32 * 32)) {
        this._removeCreature(creature);
        continue;
      }

      if (creature.type === 'dapple') this._updateDappleIntent(creature, playerPosition, daylight);
      else if (creature.type === 'bramblehog') {
        this._updateBramblehogIntent(creature, player, playerPosition, daylight);
      } else if (creature.type === 'dunetail') {
        this._updateDunetailIntent(creature, playerPosition, daylight);
      } else if (creature.type === 'lumenwing') {
        this._updateLumenwingIntent(creature, playerPosition, daylight);
      } else this._updateGloomlingIntent(creature, player, playerPosition, daylight);

      if (creature.state === 'hit' && creature.hitTime <= 0) {
        if (creature.type === 'bramblehog') setState(creature, 'charge', 1.2);
        else if (creature.type === 'gloomling') setState(creature, daylight <= 0.43 ? 'chase' : 'flee', 1.2);
        else setState(creature, creature.type === 'lumenwing' ? 'dart' : 'flee', 1.8);
      }

      const speed = this._moveCreature(creature, dt);
      if (creature.assetAnimator) creature.assetAnimator.update(dt, speed);
      else if (creature.type === 'dapple') this._animateDapple(creature, speed);
      else if (creature.type === 'bramblehog') this._animateBramblehog(creature, speed);
      else if (creature.type === 'dunetail') this._animateDunetail(creature, speed);
      else if (creature.type === 'lumenwing') this._animateLumenwing(creature, speed);
      else this._animateGloomling(creature, speed);
    }
  }

  _lineBlocked(origin, direction, distance) {
    if (!this.world?.getBlock || distance <= 0.35) return false;
    for (let step = 0.32; step < distance - 0.2; step += 0.34) {
      const x = Math.floor(origin.x + direction.x * step);
      const y = Math.floor(origin.y + direction.y * step);
      const z = Math.floor(origin.z + direction.z * step);
      if (isSolid(this.world.getBlock(x, y, z))) return true;
    }
    return false;
  }

  attack(origin, direction, reach = 4, damage = 1) {
    if (this._disposed || !origin || !direction) return null;
    const maxReach = clamp(Number(reach) || 0, 0, 12);
    if (maxReach <= 0) return null;
    this._attackDirection.set(Number(direction.x) || 0, Number(direction.y) || 0, Number(direction.z) || 0);
    if (this._attackDirection.lengthSq() < 1e-8) return null;
    this._attackDirection.normalize();

    let nearest = null;
    let nearestDistance = maxReach + 1;
    for (const creature of this.creatures) {
      if (creature.dead) continue;
      const centerX = creature.root.position.x;
      const centerY = creature.root.position.y + creature.centerHeight;
      const centerZ = creature.root.position.z;
      const toX = centerX - Number(origin.x || 0);
      const toY = centerY - Number(origin.y || 0);
      const toZ = centerZ - Number(origin.z || 0);
      const along = toX * this._attackDirection.x
        + toY * this._attackDirection.y
        + toZ * this._attackDirection.z;
      if (along < 0 || along > maxReach) continue;
      const distanceSq = toX * toX + toY * toY + toZ * toZ;
      const perpendicularSq = Math.max(0, distanceSq - along * along);
      const radiusSq = creature.radius * creature.radius;
      if (perpendicularSq > radiusSq) continue;
      const entry = Math.max(0, along - Math.sqrt(radiusSq - perpendicularSq));
      if (entry >= nearestDistance || this._lineBlocked(origin, this._attackDirection, entry)) continue;
      nearest = creature;
      nearestDistance = entry;
    }

    if (!nearest) return null;
    const appliedDamage = clamp(Number(damage) || 1, 0.5, 8);
    nearest.health -= appliedDamage;
    nearest.hitTime = 0.26;
    if (nearest.type === 'bramblehog') nearest.provoked = 9;
    nearest.knockbackX += this._attackDirection.x * 4.2;
    nearest.knockbackZ += this._attackDirection.z * 4.2;
    nearest.verticalVelocity = Math.max(nearest.verticalVelocity, 2.25);
    const killed = nearest.health <= 0;
    if (killed) {
      nearest.health = 0;
      nearest.dead = true;
      nearest.deathTime = 0;
      setState(nearest, 'death', 0.72);
    } else {
      setState(nearest, 'hit', 0.26);
      nearest.targetHeading = Math.atan2(-this._attackDirection.x, -this._attackDirection.z);
    }

    this._attackPoint
      .set(Number(origin.x) || 0, Number(origin.y) || 0, Number(origin.z) || 0)
      .addScaledVector(this._attackDirection, nearestDistance);
    return {
      id: nearest.id,
      type: nearest.type,
      name: nearest.name,
      damage: appliedDamage,
      health: nearest.health,
      maxHealth: nearest.maxHealth,
      killed,
      defeated: killed,
      distance: nearestDistance,
      point: this._attackPoint.clone(),
      position: nearest.root.position.clone(),
      creature: nearest,
      meat: killed && ['dapple', 'bramblehog', 'dunetail'].includes(nearest.type)
        ? (nearest.type === 'bramblehog' ? 4 : nearest.type === 'dapple' ? 3 : 2)
        : 0,
    };
  }

  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    for (const creature of this.creatures) {
      creature.assetAnimator?.dispose();
      this.scene?.remove(creature.root);
    }
    this.creatures.length = 0;
    for (const geometry of this._geometries) geometry.dispose();
    for (const material of this._materials) material.dispose();
    this._geometries.clear();
    this._materials.clear();
    for (const geometry of this._assetGeometries) geometry.dispose();
    for (const material of this._assetMaterials) material.dispose();
    for (const texture of this._assetTextures) texture.dispose();
    this._assetGeometries.clear();
    this._assetMaterials.clear();
    this._assetTextures.clear();
    this._animalAssets.clear();
    this._animalAssetPromises.clear();
    this._animalLoader = null;
    this.onPlayerDamage = null;
  }
}

export default CreatureSystem;
