import * as THREE from '../vendor/three.module.min.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';
import { BLOCK } from './blocks.js';

const ASSET_URL = new URL('../assets/environment/meadow-plants.glb', import.meta.url).href;
const DEFAULT_LOAD_TIMEOUT_MS = 8_000;
const CHUNK_SIZE = 16;
const CHUNK_LAYER = CHUNK_SIZE * CHUNK_SIZE;
const SCAN_RADIUS = 52;
const RESYNC_INTERVAL = 0.42;
const MAX_SUNFLOWERS = 240;
const MAX_SHORT_GRASS = 1200;

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

function embeddedAtlas(root) {
  let atlas = null;
  root?.traverse?.((node) => {
    if (atlas || !node.isMesh) return;
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    atlas = materials.find((material) => material?.map?.isTexture)?.map || null;
  });
  if (!atlas) throw new Error('Meadow-plant asset is missing its embedded GPT atlas');
  const texture = atlas.clone();
  texture.name = 'Runtime nearest GPT meadow-plant atlas';
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 1;
  texture.needsUpdate = true;
  return texture;
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
    for (const name of Object.keys(geometry.attributes)) {
      if (!['position', 'normal', 'uv'].includes(name)) geometry.deleteAttribute(name);
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
) {
  const sunflower = new THREE.InstancedMesh(
    sunflowerGeometry,
    sunflowerMaterial,
    MAX_SUNFLOWERS,
  );
  sunflower.name = 'Blender GPT sunflowers';
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
  shortGrass.name = 'Blender GPT short grass';
  shortGrass.count = 0;
  shortGrass.visible = false;
  shortGrass.castShadow = false;
  shortGrass.receiveShadow = true;
  shortGrass.frustumCulled = false;
  shortGrass.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  shortGrass.userData.assetRole = 'opaque_meadow_short_grass';
  return { sunflower, shortGrass };
}

function createPlantMeshes(gltf) {
  if (!gltf?.scene) throw new Error('Meadow-plant glTF scene is missing');
  gltf.scene.updateWorldMatrix(true, true);
  const sunflowerRoot = gltf.scene.getObjectByName('Sunflower_Asset');
  const grassRoot = gltf.scene.getObjectByName('Short_Grass_Asset');
  const texture = embeddedAtlas(gltf.scene);
  let sunflowerGeometry = null;
  let grassGeometry = null;
  try {
    sunflowerGeometry = bakeGeometry(sunflowerRoot, 'Sunflower');
    grassGeometry = bakeGeometry(grassRoot, 'Short grass');
  } catch (error) {
    texture.dispose();
    sunflowerGeometry?.dispose?.();
    grassGeometry?.dispose?.();
    throw error;
  }

  const sunflowerMaterial = new THREE.MeshStandardMaterial({
    name: 'Opaque GPT sunflower material',
    map: texture,
    roughness: 0.94,
    metalness: 0,
    transparent: false,
    alphaTest: 0,
    depthWrite: true,
    side: THREE.FrontSide,
    flatShading: true,
  });
  const grassMaterial = new THREE.MeshStandardMaterial({
    name: 'Opaque GPT short-grass material',
    map: texture,
    roughness: 0.96,
    metalness: 0,
    transparent: false,
    alphaTest: 0,
    depthWrite: true,
    side: THREE.DoubleSide,
    flatShading: true,
  });
  return createInstancedPlantMeshes(
    sunflowerGeometry,
    sunflowerMaterial,
    grassGeometry,
    grassMaterial,
  );
}

function createFallbackPlantMeshes() {
  const stem = new THREE.BoxGeometry(0.1, 0.66, 0.1);
  stem.translate(0, 0.33, 0);
  const bloom = new THREE.BoxGeometry(0.46, 0.38, 0.14);
  bloom.translate(0, 0.78, 0);
  const sunflowerGeometry = mergeGeometries([stem, bloom], false);
  stem.dispose();
  bloom.dispose();
  if (!sunflowerGeometry) throw new Error('Fallback sunflower geometry could not be created');
  sunflowerGeometry.computeBoundingBox();
  sunflowerGeometry.computeBoundingSphere();
  const grassGeometry = new THREE.ConeGeometry(0.3, 0.3, 5, 1, false);
  grassGeometry.translate(0, 0.15, 0);
  grassGeometry.computeBoundingBox();
  grassGeometry.computeBoundingSphere();
  const sunflowerMaterial = new THREE.MeshStandardMaterial({
    name: 'Opaque fallback sunflower material',
    color: 0xe9bd35,
    roughness: 0.96,
    metalness: 0,
    transparent: false,
    alphaTest: 0,
    depthWrite: true,
    flatShading: true,
  });
  const grassMaterial = new THREE.MeshStandardMaterial({
    name: 'Opaque fallback short-grass material',
    color: 0x477f2d,
    roughness: 0.98,
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
  });
  disposeMaterials(valid.map((mesh) => mesh.material));
}

export function meadowPlantScale(kind, roll) {
  const variation = clamp(roll, 0, 1);
  // The authored sunflower is 1.1m high. Its 0.90 maximum scale keeps every
  // visible petal inside the one-block interaction volume used for mining.
  return kind === 'sunflower' ? 0.78 + variation * 0.12 : 0.84 + variation * 0.32;
}

export function scanMeadowPlantChunk(chunk) {
  const sunflowers = [];
  const shortGrass = [];
  if (!chunk?.generated || !chunk.blocks) return { sunflowers, shortGrass };
  const originX = Number(chunk.cx) * CHUNK_SIZE;
  const originZ = Number(chunk.cz) * CHUNK_SIZE;
  for (let index = 0; index < chunk.blocks.length; index++) {
    const id = chunk.blocks[index];
    if (id !== BLOCK.WILDFLOWER && id !== BLOCK.SHORT_GRASS) continue;
    const y = Math.floor(index / CHUNK_LAYER);
    const withinLayer = index - y * CHUNK_LAYER;
    const z = Math.floor(withinLayer / CHUNK_SIZE);
    const x = withinLayer - z * CHUNK_SIZE;
    const entry = {
      x: originX + x,
      y,
      z: originZ + z,
    };
    (id === BLOCK.WILDFLOWER ? sunflowers : shortGrass).push(entry);
  }
  return { sunflowers, shortGrass };
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
    this.sunflowers = [];
    this.grasses = [];
    this.chunkCache = new Map();
    this._loadPromise = null;
    this._loadGeneration = 0;
    this._syncTimer = 0;
    this._dummy = new THREE.Object3D();
    this.sunflowerLimit = MAX_SUNFLOWERS;
    this.grassLimit = MAX_SHORT_GRASS;
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
        disposeMeshes([this.sunflower, this.shortGrass]);
        this.sunflower = meshes.sunflower;
        this.shortGrass = meshes.shortGrass;
        this.group.add(this.sunflower, this.shortGrass);
        this.ready = true;
        this.failed = false;
        this.error = null;
        return this;
      })
      .catch((error) => {
        if (generation === this._loadGeneration) {
          const fallback = createFallbackPlantMeshes();
          disposeMeshes([this.sunflower, this.shortGrass]);
          this.sunflower = fallback.sunflower;
          this.shortGrass = fallback.shortGrass;
          this.group.add(this.sunflower, this.shortGrass);
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

  setWorld(world) {
    if (this.world !== world) this._clear();
    this.world = world || null;
    this._syncTimer = 0;
  }

  setQuality(profile = {}) {
    const detail = clamp(profile.atmosphereDetail ?? 0.7, 0, 1);
    this.sunflowerLimit = Math.round(90 + detail * (MAX_SUNFLOWERS - 90));
    this.grassLimit = Math.round(420 + detail * (MAX_SHORT_GRASS - 420));
    this._syncTimer = 0;
  }

  _clear() {
    this.sunflowers.length = 0;
    this.grasses.length = 0;
    this.chunkCache.clear();
    for (const mesh of [this.sunflower, this.shortGrass]) {
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
    const scanned = scanMeadowPlantChunk(chunk);
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
    const grasses = [];
    const append = (target, entries, limit) => {
      for (const entry of entries) {
        if (target.length >= limit) break;
        const distanceSq = (entry.x + 0.5 - focus.x) ** 2 + (entry.z + 0.5 - focus.z) ** 2;
        if (distanceSq <= radiusSq) target.push({ ...entry, distanceSq });
      }
    };
    for (const chunk of chunks) {
      const plants = this._chunkPlants(chunk);
      append(sunflowers, plants.sunflowers, this.sunflowerLimit);
      append(grasses, plants.shortGrass, this.grassLimit);
      if (sunflowers.length >= this.sunflowerLimit && grasses.length >= this.grassLimit) break;
    }
    sunflowers.sort((a, b) => a.distanceSq - b.distanceSq);
    grasses.sort((a, b) => a.distanceSq - b.distanceSq);
    this.sunflowers = sunflowers.slice(0, this.sunflowerLimit);
    this.grasses = grasses.slice(0, this.grassLimit);
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
      const rotation = unitHash(entry.x, entry.y, entry.z, seed ^ 0x51ed270b) * Math.PI * 2;
      const roll = unitHash(entry.x, entry.y, entry.z, seed ^ 0x94d049bb);
      const scale = meadowPlantScale(kind, roll);
      this._dummy.position.set(entry.x + 0.5, entry.y, entry.z + 0.5);
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
    this._syncTimer -= Math.max(0, Number(dt) || 0);
    if (this._syncTimer > 0) return;
    this._syncTimer = RESYNC_INTERVAL;
    this._collect(focus);
    this._write(this.sunflower, this.sunflowers, 'sunflower');
    this._write(this.shortGrass, this.grasses, 'grass');
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
      draws: Number(sunflowerCount > 0) + Number(grassCount > 0),
      cachedChunks: this.chunkCache.size,
      assetUrl: this.assetUrl,
    };
  }

  dispose() {
    this._loadGeneration++;
    this._loadPromise = null;
    this._clear();
    this.group.removeFromParent?.();
    disposeMeshes([this.sunflower, this.shortGrass]);
    this.sunflower = null;
    this.shortGrass = null;
    this.world = null;
    this.ready = false;
    this.failed = false;
    this.error = null;
  }
}

export default MeadowPlantField;
