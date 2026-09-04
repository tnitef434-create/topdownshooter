import * as THREE from '../vendor/three.module.min.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';
import { BLOCK } from './blocks.js';
import { attachMeadowWind, tallGrassFieldWeight } from './meadow-wind.js';

const ASSET_URL = new URL('../assets/environment/meadow-plants.glb', import.meta.url).href;
const DEFAULT_LOAD_TIMEOUT_MS = 8_000;
const CHUNK_SIZE = 16;
const CHUNK_LAYER = CHUNK_SIZE * CHUNK_SIZE;
const SCAN_RADIUS = 52;
const RESYNC_INTERVAL = 0.42;
const MAX_SUNFLOWERS = 240;
const MAX_SHORT_GRASS = 1200;
const MAX_TALL_GRASS = 3200;

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, Number(value) || 0));
}

function unitHash(x, y, z, salt = 0) {
  let value = Math.imul(Math.floor(x) ^ salt, 0x27d4eb2d)
    ^ Math.imul(Math.floor(y) ^ (salt >>> 1), 0x165667b1)
    ^ Math.imul(Math.floor(z) ^ (salt >>> 2), 0x85ebca6b);
  value ^= value >>> 15;
  value = Math.imul(value, 0x9e3779b1);
  value ^= value >>> 13;
  return (value >>> 0) / 4294967296;
}

function disposeMaterials(entries) {
  const materials = new Set(entries
    .flatMap((entry) => (Array.isArray(entry) ? entry : [entry]))
    .filter(Boolean));
  const textures = new Set();
  materials.forEach((material) => {
    Object.values(material).forEach((value) => {
      if (value?.isTexture) textures.add(value);
    });
  });
  textures.forEach((texture) => texture.dispose?.());
  materials.forEach((material) => material.dispose?.());
}

function disposeImportedScene(scene) {
  const materials = [];
  scene?.traverse?.((node) => {
    node.geometry?.dispose?.();
    if (node.material) materials.push(node.material);
  });
  disposeMaterials(materials);
}

function bakeGeometry(root, label) {
  if (!root) throw new Error(`${label} asset root is missing`);
  root.updateWorldMatrix(true, true);
  const rootInverse = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const parts = [];
  root.traverse((node) => {
    if (!node.isMesh || !node.geometry?.getAttribute?.('position')) return;
    const geometry = node.geometry.clone();
    geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(rootInverse, node.matrixWorld));
    if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
    if (!geometry.getAttribute('color')) {
      geometry.dispose();
      throw new Error(`${label} asset is missing its hard-pixel vertex colours`);
    }
    for (const name of Object.keys(geometry.attributes)) {
      if (!['position', 'normal', 'color'].includes(name)) geometry.deleteAttribute(name);
    }
    parts.push(geometry);
  });
  if (!parts.length) throw new Error(`${label} asset contains no mesh geometry`);
  const indexed = parts.every((geometry) => Boolean(geometry.index));
  const normalized = parts.map((geometry) => {
    if (indexed || !geometry.index) return geometry;
    const expanded = geometry.toNonIndexed();
    geometry.dispose();
    return expanded;
  });
  const merged = normalized.length === 1 ? normalized[0] : mergeGeometries(normalized, false);
  if (normalized.length > 1) normalized.forEach((geometry) => geometry.dispose());
  if (!merged) throw new Error(`${label} geometry could not be merged into one draw`);
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  return merged;
}

function createInstancedPlantMeshes(
  sunflowerGeometry,
  sunflowerMaterial,
  grassGeometry,
  grassMaterial,
  tallGeometry = null,
) {
  const sunflower = new THREE.InstancedMesh(
    sunflowerGeometry,
    sunflowerMaterial,
    MAX_SUNFLOWERS,
  );
  sunflower.name = 'Blender hard-pixel sunflowers';
  sunflower.count = 0;
  sunflower.visible = false;
  sunflower.castShadow = true;
  sunflower.receiveShadow = true;
  sunflower.frustumCulled = false;
  sunflower.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  sunflower.userData.assetRole = 'opaque_voxel_sunflower';

  const shortGrass = new THREE.InstancedMesh(
    grassGeometry,
    grassMaterial,
    MAX_SHORT_GRASS,
  );
  shortGrass.name = 'Blender hard-pixel short grass';
  shortGrass.count = 0;
  shortGrass.visible = false;
  shortGrass.castShadow = false;
  shortGrass.receiveShadow = true;
  shortGrass.frustumCulled = false;
  shortGrass.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  shortGrass.userData.assetRole = 'opaque_meadow_short_grass';
  const tallGrass = new THREE.InstancedMesh(tallGeometry || grassGeometry.clone().scale(1.4, 2, 1.4), grassMaterial.clone(), MAX_TALL_GRASS);
  tallGrass.name = 'Blender knee-high meadow grass';
  tallGrass.count = 0; tallGrass.visible = false; tallGrass.frustumCulled = false;
  tallGrass.receiveShadow = true;
  tallGrass.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  tallGrass.userData.assetRole = 'opaque_meadow_tall_grass';
  return { sunflower, shortGrass, tallGrass };
}

function createPlantMeshes(gltf) {
  if (!gltf?.scene) throw new Error('Meadow-plant glTF scene is missing');
  gltf.scene.updateWorldMatrix(true, true);
  const sunflowerRoot = gltf.scene.getObjectByName('Sunflower_Asset');
  const grassRoot = gltf.scene.getObjectByName('Short_Grass_Asset');
  let sunflowerGeometry = null;
  let grassGeometry = null;
  let tallGeometry = null;
  try {
    sunflowerGeometry = bakeGeometry(sunflowerRoot, 'Sunflower');
    grassGeometry = bakeGeometry(grassRoot, 'Short grass');
    const tallRoot = gltf.scene.getObjectByName('Tall_Grass_Asset');
    if (tallRoot) tallGeometry = bakeGeometry(tallRoot, 'Tall grass');
  } catch (error) {
    sunflowerGeometry?.dispose?.();
    grassGeometry?.dispose?.();
    tallGeometry?.dispose?.();
    throw error;
  }

  const sunflowerMaterial = new THREE.MeshStandardMaterial({
    name: 'Hard-pixel vertex-colour sunflower material',
    vertexColors: true,
    roughness: 0.95,
    metalness: 0,
    transparent: false,
    alphaTest: 0,
    depthWrite: true,
    side: THREE.FrontSide,
    flatShading: true,
  });
  const grassMaterial = new THREE.MeshStandardMaterial({
    name: 'Hard-pixel vertex-colour short-grass material',
    vertexColors: true,
    roughness: 0.95,
    metalness: 0,
    transparent: false,
    alphaTest: 0,
    depthWrite: true,
    side: THREE.FrontSide,
    flatShading: true,
  });
  return createInstancedPlantMeshes(
    sunflowerGeometry,
    sunflowerMaterial,
    grassGeometry,
    grassMaterial,
    tallGeometry,
  );
}

function colouredVoxelBox(size, position, hex) {
  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  geometry.deleteAttribute('uv');
  geometry.translate(position.x, position.y, position.z);
  const colour = new THREE.Color(hex);
  const count = geometry.getAttribute('position').count;
  const colours = new Float32Array(count * 3);
  for (let index = 0; index < count; index++) {
    colours[index * 3] = colour.r;
    colours[index * 3 + 1] = colour.g;
    colours[index * 3 + 2] = colour.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colours, 3));
  return geometry;
}

function mergeVoxelGeometry(parts, label) {
  const merged = mergeGeometries(parts, false);
  parts.forEach((geometry) => geometry.dispose());
  if (!merged) throw new Error(`${label} fallback voxel geometry could not be created`);
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  return merged;
}

function fallbackSunflowerGeometry() {
  const grid = [
    '.....DHHHD......',
    '...DYYHHHYYD....',
    '..DYYDDDDDYYD...',
    '.DYYDBBBBBBDYY..',
    'DYYDBbbbbbbBDYYD',
    'DYYBbbSssSbbBYYD',
    'DYYBbsSSSSsbBYYD',
    'DYYBbsSSSSsbBYYD',
    '.DYYBbbSSbbBYYD.',
    '..DYYBBBBBYYD...',
    '....DYYgYYD.....',
    '..GG...gg...GG..',
    '.GllG..gg..GllG.',
    '..GllG.gg.GllG..',
    '....Gg.gg.gG....',
    '......gg........',
  ];
  const palette = {
    D: 0x8c4f09,
    Y: 0xefa60e,
    H: 0xffd42e,
    B: 0x2e1305,
    b: 0x632b09,
    S: 0x632b09,
    s: 0x2e1305,
    G: 0x134013,
    g: 0x266e1c,
    l: 0x579c2e,
  };
  const pixel = 0.0575;
  const depth = pixel * 0.62;
  const parts = [];
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      const character = grid[row][column];
      if (character === '.') continue;
      const horizontal = (column - grid[row].length / 2 + 0.5) * pixel;
      const vertical = (grid.length - row - 0.5) * pixel;
      parts.push(colouredVoxelBox(
        new THREE.Vector3(pixel, pixel, depth),
        new THREE.Vector3(horizontal, vertical, 0),
        palette[character],
      ));
      parts.push(colouredVoxelBox(
        new THREE.Vector3(depth, pixel, pixel),
        new THREE.Vector3(0, vertical, horizontal),
        palette[character],
      ));
    }
  }
  return mergeVoxelGeometry(parts, 'Sunflower');
}

function fallbackGrassGeometry() {
  const grid = [
    '...L....',
    '.G.l..L.',
    '.g.g..l.',
    'Gg.g.Gg.',
    'gg.g.gg.',
    '.ggglgg.',
    '..gggg..',
    '...dd...',
  ];
  const palette = {
    d: 0x0e300e,
    G: 0x164711,
    g: 0x216316,
    l: 0x38801f,
    L: 0x59992b,
  };
  const pixel = 0.048;
  const depth = pixel * 0.62;
  const parts = [];
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      const character = grid[row][column];
      if (character === '.') continue;
      const horizontal = (column - grid[row].length / 2 + 0.5) * pixel;
      const vertical = (grid.length - row - 0.5) * pixel;
      parts.push(colouredVoxelBox(
        new THREE.Vector3(pixel, pixel, depth),
        new THREE.Vector3(horizontal, vertical, 0),
        palette[character],
      ));
      parts.push(colouredVoxelBox(
        new THREE.Vector3(depth, pixel, pixel),
        new THREE.Vector3(0, vertical, horizontal),
        palette[character],
      ));
    }
  }
  return mergeVoxelGeometry(parts, 'Short grass');
}

function createFallbackPlantMeshes() {
  const sunflowerGeometry = fallbackSunflowerGeometry();
  const grassGeometry = fallbackGrassGeometry();
  const sunflowerMaterial = new THREE.MeshStandardMaterial({
    name: 'Hard-pixel fallback sunflower material',
    vertexColors: true,
    roughness: 0.95,
    metalness: 0,
    transparent: false,
    alphaTest: 0,
    depthWrite: true,
    flatShading: true,
  });
  const grassMaterial = new THREE.MeshStandardMaterial({
    name: 'Hard-pixel fallback short-grass material',
    vertexColors: true,
    roughness: 0.95,
    metalness: 0,
    transparent: false,
    alphaTest: 0,
    depthWrite: true,
    flatShading: true,
  });
  return createInstancedPlantMeshes(
    sunflowerGeometry,
    sunflowerMaterial,
    grassGeometry,
    grassMaterial,
  );
}

function disposeMeshes(meshes) {
  const valid = meshes.filter(Boolean);
  valid.forEach((mesh) => {
    mesh.removeFromParent?.();
    mesh.geometry?.dispose?.();
    mesh.customDepthMaterial?.dispose?.();
  });
  disposeMaterials(valid.map((mesh) => mesh.material));
}

export function meadowPlantScale(kind, roll) {
  const variation = clamp(roll, 0, 1);
  // The 0.92m authored sunflower remains within the one-block
  // interaction volume while retaining mild deterministic size variation.
  return kind === 'sunflower' ? 0.92 + variation * 0.08 : kind === 'tall' ? 0.82 + variation * 0.22 : 0.84 + variation * 0.32;
}

export function meadowPlantVisualOffset(kind, x, y, z, seed = 0) {
  const radiusLimit = kind === 'sunflower' ? 0.12 : 0.34;
  const angle = unitHash(x, y, z, seed ^ 0x3c6ef372) * Math.PI * 2;
  const radius = Math.sqrt(unitHash(x, y, z, seed ^ 0xbb67ae85)) * radiusLimit;
  return {
    x: Math.cos(angle) * radius,
    z: Math.sin(angle) * radius,
  };
}

export function scanMeadowPlantChunk(chunk, seed = 0) {
  const sunflowers = [];
  const shortGrass = [], tallGrass = [];
  if (!chunk?.generated || !chunk.blocks) return { sunflowers, shortGrass, tallGrass };
  const originX = Number(chunk.cx) * CHUNK_SIZE;
  const originZ = Number(chunk.cz) * CHUNK_SIZE;
  for (let index = 0; index < chunk.blocks.length; index++) {
    const id = chunk.blocks[index];
    if (id !== BLOCK.WILDFLOWER && id !== BLOCK.SHORT_GRASS && id !== BLOCK.TURF) continue;
    const y = Math.floor(index / CHUNK_LAYER);
    const withinLayer = index - y * CHUNK_LAYER;
    const z = Math.floor(withinLayer / CHUNK_SIZE);
    const x = withinLayer - z * CHUNK_SIZE;
    const entry = {
      x: originX + x,
      y,
      z: originZ + z,
    };
    if (id === BLOCK.TURF) {
      const above=chunk.blocks[index+CHUNK_LAYER];
      if (above !== BLOCK.AIR && above !== BLOCK.SHORT_GRASS) continue;
      const density = tallGrassFieldWeight(entry.x,entry.z,seed);
      if (density < .2) continue;
      // Exclude covered ground, pond surfaces and player-built ceilings.
      let clear=true;
      for(let dy=2;dy<=7;dy++) {
        const overhead=chunk.blocks[index+CHUNK_LAYER*dy];
        if(overhead!==undefined && overhead!==BLOCK.AIR) {clear=false;break;}
      }
      if(clear) tallGrass.push({...entry,y:y+1,density});
    } else if(id === BLOCK.WILDFLOWER) sunflowers.push(entry);
    else shortGrass.push(entry);
  }
  const tallCells = new Set(tallGrass.map(p=>`${p.x},${p.y},${p.z}`));
  return { sunflowers, shortGrass:shortGrass.filter(p=>!tallCells.has(`${p.x},${p.y},${p.z}`)), tallGrass };
}

export class MeadowPlantField {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.assetUrl = String(options.assetUrl || ASSET_URL);
    const timeout = Number(options.loadTimeoutMs);
    this.loadTimeoutMs = Number.isFinite(timeout) && timeout > 0
      ? Math.max(10, timeout)
      : DEFAULT_LOAD_TIMEOUT_MS;
    this.loaderFactory = typeof options.loaderFactory === 'function'
      ? options.loaderFactory
      : () => new GLTFLoader();
    this.world = null;
    this.group = new THREE.Group();
    this.group.name = 'Opaque Blender meadow plants';
    scene?.add?.(this.group);
    this.ready = false;
    this.failed = false;
    this.error = null;
    this.sunflower = null;
    this.shortGrass = null;
    this.tallGrass = null;
    this.sunflowers = [];
    this.grasses = [];
    this.tallGrasses = [];
    this.windUniforms = { time:{value:0}, strength:{value:1}, player:{value:new THREE.Vector3(1e6,1e6,1e6)} };
    this.chunkCache = new Map();
    this._loadPromise = null;
    this._loadGeneration = 0;
    this._syncTimer = 0;
    this._dummy = new THREE.Object3D();
    this.sunflowerLimit = MAX_SUNFLOWERS;
    this.grassLimit = MAX_SHORT_GRASS;
    this.tallGrassLimit = MAX_TALL_GRASS;
  }

  prepare() {
    if (this.ready) return Promise.resolve(this);
    if (this._loadPromise) return this._loadPromise;
    if (!this.group.parent) this.scene?.add?.(this.group);
    this.failed = false;
    this.error = null;
    const generation = ++this._loadGeneration;
    const loader = this.loaderFactory();
    const loadPromise = Promise.resolve()
      .then(() => {
        if (!loader?.loadAsync) throw new Error('Meadow-plant asset loader is unavailable');
        let timeoutId = null;
        let raceSettled = false;
        const timeout = new Promise((_, reject) => {
          timeoutId = setTimeout(
            () => reject(new Error(`Meadow-plant asset timed out after ${this.loadTimeoutMs}ms`)),
            this.loadTimeoutMs,
          );
        });
        const observedLoad = Promise.resolve(loader.loadAsync(this.assetUrl)).then((gltf) => {
          if (raceSettled) {
            disposeImportedScene(gltf?.scene);
            return null;
          }
          return gltf;
        });
        return Promise.race([observedLoad, timeout])
          .finally(() => {
            raceSettled = true;
            clearTimeout(timeoutId);
          });
      })
      .then((gltf) => {
        if (generation !== this._loadGeneration) {
          disposeImportedScene(gltf?.scene);
          return this;
        }
        let meshes = null;
        try {
          meshes = createPlantMeshes(gltf);
        } catch (error) {
          disposeImportedScene(gltf?.scene);
          throw error;
        }
        disposeImportedScene(gltf.scene);
        disposeMeshes([this.sunflower, this.shortGrass, this.tallGrass]);
        this.sunflower = meshes.sunflower;
        this.shortGrass = meshes.shortGrass;
        this.tallGrass = meshes.tallGrass;
        this._installWind();
        this.ready = true;
        this.failed = false;
        this.error = null;
        return this;
      })
      .catch((error) => {
        if (generation === this._loadGeneration) {
          const fallback = createFallbackPlantMeshes();
          disposeMeshes([this.sunflower, this.shortGrass, this.tallGrass]);
          this.sunflower = fallback.sunflower;
          this.shortGrass = fallback.shortGrass;
          this.tallGrass = fallback.tallGrass;
          this._installWind();
          this.ready = true;
          this.failed = true;
          this.error = error instanceof Error ? error : new Error(String(error || 'Unknown meadow-plant asset error'));
          console.warn('Worldloom meadow plants fell back to opaque built-in geometry.', this.error);
        }
        return this;
      });
    this._loadPromise = loadPromise;
    loadPromise.finally(() => {
      if (this._loadPromise === loadPromise) this._loadPromise = null;
    });
    return this._loadPromise;
  }

  _installWind() {
    for(const [mesh,kind] of [[this.sunflower,'sunflower'],[this.shortGrass,'grass'],[this.tallGrass,'tall']]) {
      attachMeadowWind(mesh,this.windUniforms,kind);
      this.group.add(mesh);
    }
  }

  setWorld(world) {
    if (this.world !== world) this._clear();
    this.world = world || null;
    this._syncTimer = 0;
  }

  setQuality(profile = {}, reducedMotion = false) {
    this.windUniforms.strength.value = reducedMotion ? .15 : 1;
    const detail = clamp(profile.atmosphereDetail ?? 0.7, 0, 1);
    this.sunflowerLimit = Math.round(90 + detail * (MAX_SUNFLOWERS - 90));
    this.grassLimit = Math.round(420 + detail * (MAX_SHORT_GRASS - 420));
    this.tallGrassLimit = Math.round(900 + detail * (MAX_TALL_GRASS - 900));
    this._syncTimer = 0;
  }

  _clear() {
    this.sunflowers.length = 0;
    this.grasses.length = 0;
    this.tallGrasses.length = 0;
    this.chunkCache.clear();
    for (const mesh of [this.sunflower, this.shortGrass, this.tallGrass]) {
      if (!mesh) continue;
      mesh.count = 0;
      mesh.visible = false;
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  _chunkPlants(chunk) {
    const key = String(chunk.key || `${chunk.cx},${chunk.cz}`);
    const revision = Number(chunk.revision) || 0;
    const cached = this.chunkCache.get(key);
    if (cached?.revision === revision && cached.blocks === chunk.blocks) return cached;
    const scanned = scanMeadowPlantChunk(chunk, Number(this.world?.seed)||0);
    const next = { ...scanned, revision, blocks: chunk.blocks };
    this.chunkCache.set(key, next);
    return next;
  }

  _collect(focus) {
    if (!this.world?.chunks || !focus) return;
    const radiusSq = SCAN_RADIUS * SCAN_RADIUS;
    const chunkMargin = CHUNK_SIZE * Math.SQRT2;
    const chunkRadiusSq = (SCAN_RADIUS + chunkMargin) ** 2;
    const chunks = [...this.world.chunks.values()]
      .filter((chunk) => {
        if (!chunk?.generated || chunk.wanted === false) return false;
        const centerX = chunk.cx * CHUNK_SIZE + CHUNK_SIZE * 0.5;
        const centerZ = chunk.cz * CHUNK_SIZE + CHUNK_SIZE * 0.5;
        return (centerX - focus.x) ** 2 + (centerZ - focus.z) ** 2 <= chunkRadiusSq;
      })
      .sort((a, b) => {
        const ax = a.cx * CHUNK_SIZE + CHUNK_SIZE * 0.5 - focus.x;
        const az = a.cz * CHUNK_SIZE + CHUNK_SIZE * 0.5 - focus.z;
        const bx = b.cx * CHUNK_SIZE + CHUNK_SIZE * 0.5 - focus.x;
        const bz = b.cz * CHUNK_SIZE + CHUNK_SIZE * 0.5 - focus.z;
        return ax * ax + az * az - (bx * bx + bz * bz);
      });
    const sunflowers = [];
    const grasses = [], tallGrasses = [];
    const append = (target, entries, limit) => {
      for (const entry of entries) {
        if (target.length >= limit) break;
        if (this.world.isPositionRendered && !this.world.isPositionRendered(entry.x+.5,entry.z+.5)) continue;
        const distanceSq = (entry.x + 0.5 - focus.x) ** 2 + (entry.z + 0.5 - focus.z) ** 2;
        if (distanceSq <= radiusSq) target.push({ ...entry, distanceSq });
      }
    };
    for (const chunk of chunks) {
      const plants = this._chunkPlants(chunk);
      append(sunflowers, plants.sunflowers, this.sunflowerLimit);
      append(grasses, plants.shortGrass, this.grassLimit);
      append(tallGrasses, plants.tallGrass, Math.ceil(this.tallGrassLimit/3));
      if (sunflowers.length >= this.sunflowerLimit && grasses.length >= this.grassLimit && tallGrasses.length >= this.tallGrassLimit/3) break;
    }
    sunflowers.sort((a, b) => a.distanceSq - b.distanceSq);
    grasses.sort((a, b) => a.distanceSq - b.distanceSq);
    this.sunflowers = sunflowers.slice(0, this.sunflowerLimit);
    this.grasses = grasses.slice(0, this.grassLimit);
    tallGrasses.sort((a,b)=>a.distanceSq-b.distanceSq);
    this.tallGrasses = tallGrasses.flatMap(entry=>Array.from({length:1+Math.floor(entry.density*2)},(_,clump)=>({...entry,clump}))).slice(0,this.tallGrassLimit);
    const liveKeys = new Set(this.world.chunks.keys());
    for (const key of this.chunkCache.keys()) {
      if (!liveKeys.has(key)) this.chunkCache.delete(key);
    }
  }

  _write(mesh, entries, kind) {
    if (!mesh) return;
    const seed = Number(this.world?.seed) || 0;
    const count = Math.min(mesh.instanceMatrix.count, entries.length);
    for (let index = 0; index < count; index++) {
      const entry = entries[index];
      const variationSeed = seed ^ ((entry.clump||0)*29371);
      const rotation = unitHash(entry.x, entry.y, entry.z, variationSeed ^ 0x51ed270b) * Math.PI * 2;
      const roll = unitHash(entry.x, entry.y, entry.z, variationSeed ^ 0x94d049bb);
      const scale = meadowPlantScale(kind, roll);
      const offset = meadowPlantVisualOffset(kind, entry.x, entry.y, entry.z, variationSeed);
      this._dummy.position.set(entry.x + 0.5 + offset.x, entry.y, entry.z + 0.5 + offset.z);
      this._dummy.rotation.set(0, rotation, 0);
      this._dummy.scale.setScalar(scale);
      this._dummy.updateMatrix();
      mesh.setMatrixAt(index, this._dummy.matrix);
    }
    mesh.count = count;
    mesh.visible = count > 0;
    mesh.instanceMatrix.needsUpdate = true;
  }

  update(dt, focus) {
    if (!this.ready || !this.world || !focus) return;
    this.windUniforms.time.value += Math.max(0,Number(dt)||0);
    this.windUniforms.player.value.copy(focus);
    this._syncTimer -= Math.max(0, Number(dt) || 0);
    if (this._syncTimer > 0) return;
    this._syncTimer = RESYNC_INTERVAL;
    this._collect(focus);
    this._write(this.sunflower, this.sunflowers, 'sunflower');
    this._write(this.shortGrass, this.grasses, 'grass');
    this._write(this.tallGrass, this.tallGrasses, 'tall');
  }

  getStats() {
    const sunflowerCount = this.sunflower?.count || 0;
    const grassCount = this.shortGrass?.count || 0;
    return {
      ready: this.ready,
      failed: this.failed,
      loading: Boolean(this._loadPromise),
      error: this.error ? String(this.error.message || this.error) : '',
      sunflowers: sunflowerCount,
      shortGrass: grassCount,
      tallGrass: this.tallGrass?.count || 0,
      draws: Number(sunflowerCount > 0) + Number(grassCount > 0) + Number(this.tallGrass?.count > 0),
      cachedChunks: this.chunkCache.size,
      assetUrl: this.assetUrl,
    };
  }

  dispose() {
    this._loadGeneration++;
    this._loadPromise = null;
    this._clear();
    this.group.removeFromParent?.();
    disposeMeshes([this.sunflower, this.shortGrass, this.tallGrass]);
    this.sunflower = null;
    this.shortGrass = null;
    this.tallGrass = null;
    this.world = null;
    this.ready = false;
    this.failed = false;
    this.error = null;
  }
}

export default MeadowPlantField;
