import * as THREE from '../vendor/three.module.min.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';
import { BLOCK } from './blocks.js';

const ASSET_URL = new URL('../assets/environment/red-flower.glb', import.meta.url).href;
const DEFAULT_LOAD_TIMEOUT_MS = 8_000;
const MAX_FLOWERS = 150;
const SCAN_RADIUS = 40;
const SCAN_CELL = 2;
const SPAWN_CHANCE = 0.15;
const RESYNC_INTERVAL = 0.5;
const TARGET_HEIGHT = 1.05;

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, Number(value) || 0));
}

function unitHash(x, z, salt = 0) {
  let value = Math.imul(Math.floor(x) ^ salt, 0x27d4eb2d)
    ^ Math.imul(Math.floor(z) ^ (salt >>> 1), 0x165667b1);
  value ^= value >>> 15;
  value = Math.imul(value, 0x85ebca6b);
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

function bakeFlowerGeometry(root, sceneRoot) {
  if (!root) throw new Error('Red-flower asset root is missing');
  sceneRoot?.updateWorldMatrix?.(true, true);
  root.updateWorldMatrix(true, true);
  const sceneInverse = new THREE.Matrix4().copy(sceneRoot?.matrixWorld || root.matrixWorld).invert();
  const parts = [];
  root.traverse((node) => {
    if (!node.isMesh || !node.geometry?.getAttribute?.('position')) return;
    const geometry = node.geometry.clone();
    geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(sceneInverse, node.matrixWorld));
    if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
    if (!geometry.getAttribute('color')) {
      geometry.dispose();
      throw new Error(`Red-flower mesh ${node.name || 'unnamed'} is missing vertex colors`);
    }
    for (const name of Object.keys(geometry.attributes)) {
      if (!['position', 'normal', 'color'].includes(name)) geometry.deleteAttribute(name);
    }
    parts.push(geometry);
  });
  if (!parts.length) throw new Error('Red-flower asset contains no mesh geometry');
  const indexed = parts.every((geometry) => Boolean(geometry.index));
  const normalized = parts.map((geometry) => {
    if (indexed || !geometry.index) return geometry;
    const expanded = geometry.toNonIndexed();
    geometry.dispose();
    return expanded;
  });
  const merged = mergeGeometries(normalized, false);
  normalized.forEach((geometry) => geometry.dispose());
  if (!merged) throw new Error('Red-flower geometry could not be merged into one draw');
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  return merged;
}

function createFlowerMesh(gltf) {
  if (!gltf?.scene) throw new Error('Red-flower glTF scene is missing');
  const root = gltf.scene.getObjectByName('Red_Flower_Asset') || gltf.scene;
  const geometry = bakeFlowerGeometry(root, gltf.scene);
  const material = new THREE.MeshStandardMaterial({
    name: 'Voxel red-flower material',
    vertexColors: true,
    roughness: 0.95,
    metalness: 0,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, MAX_FLOWERS);
  mesh.name = 'Interactive Blender red flowers';
  mesh.count = 0;
  mesh.visible = false;
  mesh.frustumCulled = false;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.userData.assetRole = 'interactive_red_flowers';
  mesh.userData.authoredHeight = Math.max(
    0.1,
    geometry.boundingBox.max.y - geometry.boundingBox.min.y,
  );
  return mesh;
}

function disposeFlowerMesh(mesh) {
  if (!mesh) return;
  mesh.removeFromParent?.();
  mesh.geometry?.dispose?.();
  disposeMaterials([mesh.material]);
}

export class RedFlowerField {
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
    this.group.name = 'Blender red flowers';
    scene?.add?.(this.group);
    this.ready = false;
    this.failed = false;
    this.error = null;
    this.mesh = null;
    this.flowers = [];
    this._loadPromise = null;
    this._loadGeneration = 0;
    this._syncTimer = 0;
    this._dummy = new THREE.Object3D();
    this._spin = new THREE.Quaternion();
    this._up = new THREE.Vector3(0, 1, 0);
  }

  prepare() {
    if (this.ready) return Promise.resolve(this);
    if (this._loadPromise) return this._loadPromise;
    if (!this.group.parent) this.scene?.add?.(this.group);
    this.failed = false;
    this.error = null;
    const generation = ++this._loadGeneration;
    const loader = this.loaderFactory();
    this._loadPromise = Promise.resolve()
      .then(() => {
        if (!loader?.loadAsync) throw new Error('Red-flower asset loader is unavailable');
        return loader.loadAsync(this.assetUrl);
      })
      .then((gltf) => {
        if (generation !== this._loadGeneration) {
          disposeImportedScene(gltf?.scene);
          return this;
        }
        let mesh = null;
        try {
          mesh = createFlowerMesh(gltf);
        } catch (error) {
          disposeImportedScene(gltf?.scene);
          throw error;
        }
        disposeImportedScene(gltf.scene);
        disposeFlowerMesh(this.mesh);
        this.mesh = mesh;
        this.group.add(mesh);
        this.ready = true;
        this.failed = false;
        this.error = null;
        return this;
      })
      .catch((error) => {
        if (generation === this._loadGeneration) {
          this.ready = false;
          this.failed = true;
          this.error = error instanceof Error ? error : new Error(String(error || 'Unknown red-flower asset error'));
          console.warn('Worldloom red flowers were skipped safely.', this.error);
        }
        return this;
      })
      .finally(() => {
        if (this._loadPromise) this._loadPromise = null;
      });
    return this._loadPromise;
  }

  setWorld(world) {
    const nextWorld = world || null;
    if (this.world !== nextWorld) this._clear();
    this.world = nextWorld;
    this._syncTimer = 0;
    if (!this.world) this._clear();
  }

  _clear() {
    this.flowers.length = 0;
    if (this.mesh) {
      this.mesh.count = 0;
      this.mesh.visible = false;
      this.mesh.instanceMatrix.needsUpdate = true;
    }
  }

  _flowerStillValid(flower) {
    if (!this.world?.isPositionReady?.(flower.x, flower.z)) return false;
    return this.world.getBlock?.(flower.x, flower.y - 1, flower.z) === BLOCK.TURF
      && this.world.getBlock?.(flower.x, flower.y, flower.z) === BLOCK.AIR;
  }

  _sync(focus) {
    if (!this.ready || !this.world || !focus) return false;
    const radius = clamp(SCAN_RADIUS, 4, 96);
    const radiusSq = radius * radius;
    const cellCount = Math.ceil(radius / SCAN_CELL);
    const centerX = Math.floor(focus.x / SCAN_CELL);
    const centerZ = Math.floor(focus.z / SCAN_CELL);
    const previousByKey = new Map(this.flowers.map((flower) => [flower.key, flower]));
    const next = [];

    for (let dx = -cellCount; dx <= cellCount; dx++) {
      for (let dz = -cellCount; dz <= cellCount; dz++) {
        if (next.length >= MAX_FLOWERS) break;
        const cellX = centerX + dx;
        const cellZ = centerZ + dz;
        const roll = unitHash(cellX, cellZ, this.world.seed ?? 0);
        if (roll >= SPAWN_CHANCE) continue;
        const x = Math.floor(cellX * SCAN_CELL + unitHash(cellX, cellZ, 0x51ed) * SCAN_CELL);
        const z = Math.floor(cellZ * SCAN_CELL + unitHash(cellX, cellZ, 0x27d4) * SCAN_CELL);
        if ((x + 0.5 - focus.x) ** 2 + (z + 0.5 - focus.z) ** 2 > radiusSq) continue;
        if (!this.world.isPositionReady?.(x, z)) continue;
        const surface = this.world.terrainHeight?.(x, z);
        if (!Number.isFinite(surface)) continue;
        const key = `${x}:${surface}:${z}`;
        const cached = previousByKey.get(key);
        if (cached) {
          next.push(cached);
          continue;
        }
        const flower = {
          key,
          x,
          y: surface + 1,
          z,
          rotation: unitHash(x, z, 0xa511e9) * Math.PI * 2,
          scale: 0.9 + unitHash(x, z, 0x7f4ac3) * 0.32,
          tilt: (unitHash(x, z, 0x9e37) - 0.5) * 0.12,
        };
        if (!this._flowerStillValid(flower)) continue;
        next.push(flower);
      }
    }

    this.flowers = next;
    return true;
  }

  _writeInstances() {
    if (!this.mesh) return;
    const scaleBase = TARGET_HEIGHT / Math.max(0.1, this.mesh.userData.authoredHeight || 1);
    let instance = 0;
    for (const flower of this.flowers) {
      this._dummy.position.set(flower.x + 0.5, flower.y, flower.z + 0.5);
      this._dummy.rotation.set(flower.tilt, flower.rotation, 0);
      this._spin.setFromAxisAngle(this._up, 0);
      this._dummy.quaternion.multiply(this._spin);
      const scale = scaleBase * flower.scale;
      this._dummy.scale.set(scale, scale, scale);
      this._dummy.updateMatrix();
      this.mesh.setMatrixAt(instance, this._dummy.matrix);
      instance++;
    }
    this.mesh.count = instance;
    this.mesh.visible = instance > 0;
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  update(dt, focus) {
    if (!this.ready || !this.world || !focus) return;
    const elapsed = Math.max(0, Number(dt) || 0);
    const stillPlaced = this.flowers.length
      && this.flowers.every((flower) => this._flowerStillValid(flower));
    this._syncTimer -= elapsed;
    if (this._syncTimer <= 0 || !stillPlaced) {
      this._syncTimer = RESYNC_INTERVAL;
      this._sync(focus);
    }
    this._writeInstances();
  }

  getStats() {
    return {
      ready: this.ready,
      failed: this.failed,
      loading: Boolean(this._loadPromise),
      error: this.error ? String(this.error.message || this.error) : '',
      flowers: this.mesh?.count || 0,
      draws: this.mesh?.visible && this.mesh.count > 0 ? 1 : 0,
      assetUrl: this.assetUrl,
    };
  }

  dispose() {
    this._loadGeneration++;
    this._clear();
    this.group.removeFromParent?.();
    disposeFlowerMesh(this.mesh);
    this.mesh = null;
    this.world = null;
    this.ready = false;
    this.failed = false;
    this.error = null;
  }
}

export default RedFlowerField;
