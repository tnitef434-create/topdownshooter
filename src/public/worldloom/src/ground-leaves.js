import * as THREE from '../vendor/three.module.min.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { BLOCK, BLOCKS } from './blocks.js';

const ASSET_URL = new URL('../assets/environment/ground-leaf-litter.glb', import.meta.url).href;
const DEFAULT_LOAD_TIMEOUT_MS = 8_000;
const MAX_PATCHES = 192;
const RESYNC_INTERVAL = 0.55;

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, Number(value) || 0));
}

export function groundLeafUnitHash(x, z, salt = 0) {
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

function nearestLeafTexture(material) {
  const source = (Array.isArray(material) ? material : [material])
    .find((entry) => entry?.map?.isTexture)?.map;
  if (!source) throw new Error('Ground-leaf mesh is missing its embedded GPT-image atlas');
  const texture = source.clone();
  texture.name = 'Runtime nearest GPT ground-leaf atlas';
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

function bakedPatchGeometry(root, patch) {
  if (!root || !patch?.isMesh || !patch.geometry?.getAttribute?.('position')) {
    throw new Error('Ground-leaf Blender patch is missing geometry');
  }
  root.updateWorldMatrix(true, true);
  patch.updateWorldMatrix(true, false);
  const geometry = patch.geometry.clone();
  const rootInverse = new THREE.Matrix4().copy(root.matrixWorld).invert();
  geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(rootInverse, patch.matrixWorld));
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
  if (!geometry.getAttribute('uv')) {
    geometry.dispose();
    throw new Error('Ground-leaf Blender patch is missing authored UVs');
  }
  for (const name of Object.keys(geometry.attributes)) {
    if (!['position', 'normal', 'uv'].includes(name)) geometry.deleteAttribute(name);
  }
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function createRuntimeMesh(gltf) {
  if (!gltf?.scene) throw new Error('Ground-leaf glTF scene is missing');
  const root = gltf.scene.getObjectByName('Ground_Leaf_Litter_Asset');
  const patch = root?.getObjectByName('Ground_Leaf_Litter_Patch');
  const geometry = bakedPatchGeometry(root, patch);
  let material = null;
  try {
    material = new THREE.MeshStandardMaterial({
      name: 'GPT-textured pixel ground leaves',
      map: nearestLeafTexture(patch.material),
      color: 0xffffff,
      roughness: 0.96,
      metalness: 0,
      alphaTest: 0.5,
      transparent: false,
      depthWrite: true,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, MAX_PATCHES);
    mesh.name = 'Blender ground leaves below falling-leaf trees';
    mesh.count = 0;
    mesh.visible = false;
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.userData.assetRole = 'falling_leaf_tree_ground_litter';
    mesh.userData.drawBudget = 1;
    return mesh;
  } catch (error) {
    geometry.dispose();
    disposeMaterials([material]);
    throw error;
  }
}

function disposeRuntimeMesh(mesh) {
  if (!mesh) return;
  mesh.removeFromParent?.();
  mesh.geometry?.dispose?.();
  disposeMaterials([mesh.material]);
}

export class GroundLeafField {
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
    this.group = new THREE.Group();
    this.group.name = 'GPT and Blender forest-floor leaves';
    scene?.add?.(this.group);
    this.world = null;
    this.ready = false;
    this.failed = false;
    this.error = null;
    this.mesh = null;
    this.patches = [];
    this.radius = 48;
    this.treeCap = 36;
    this.patchesPerTree = 2;
    this._loadPromise = null;
    this._loadGeneration = 0;
    this._cancelLoad = null;
    this._syncTimer = 0;
    this._lastFocus = new THREE.Vector3(Number.POSITIVE_INFINITY, 0, Number.POSITIVE_INFINITY);
    this._lastStreamRevision = -1;
    this._dummy = new THREE.Object3D();
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
    const promise = new Promise((resolve) => { resolveAttempt = resolve; });
    const finish = () => {
      if (settled) return;
      settled = true;
      if (timeoutId != null) clearTimeout(timeoutId);
      if (this._cancelLoad === cancelAttempt) this._cancelLoad = null;
      resolveAttempt(this);
    };
    const failCosmetically = (cause) => {
      if (settled) return;
      if (generation === this._loadGeneration) {
        this._loadGeneration++;
        this.ready = false;
        this.failed = true;
        this.error = cause instanceof Error ? cause : new Error(String(cause || 'Unknown ground-leaf asset error'));
        console.warn('Worldloom ground leaves were skipped safely.', this.error);
      }
      finish();
    };
    cancelAttempt = () => finish();
    this._cancelLoad = cancelAttempt;
    timeoutId = setTimeout(() => {
      failCosmetically(new Error(`Ground-leaf asset timed out after ${this.loadTimeoutMs}ms`));
    }, this.loadTimeoutMs);

    Promise.resolve()
      .then(() => {
        if (settled || generation !== this._loadGeneration) return null;
        const loader = this.loaderFactory();
        if (!loader?.loadAsync) throw new Error('Ground-leaf asset loader is unavailable');
        return loader.loadAsync(this.assetUrl);
      })
      .then((gltf) => {
        if (!gltf) return;
        if (settled || generation !== this._loadGeneration) {
          disposeImportedScene(gltf.scene);
          return;
        }
        let mesh = null;
        try {
          mesh = createRuntimeMesh(gltf);
        } catch (error) {
          disposeImportedScene(gltf.scene);
          failCosmetically(error);
          return;
        }
        disposeImportedScene(gltf.scene);
        if (settled || generation !== this._loadGeneration) {
          disposeRuntimeMesh(mesh);
          return;
        }
        disposeRuntimeMesh(this.mesh);
        this.mesh = mesh;
        this.group.add(mesh);
        this.ready = true;
        this.failed = false;
        this.error = null;
        this._syncTimer = 0;
        finish();
      })
      .catch(failCosmetically);

    this._loadPromise = promise;
    promise.finally(() => {
      if (this._loadPromise === promise) this._loadPromise = null;
    });
    return promise;
  }

  setWorld(world) {
    const nextWorld = world || null;
    if (this.world !== nextWorld) this._clear();
    this.world = nextWorld;
    this._syncTimer = 0;
    this._lastStreamRevision = -1;
    this._lastFocus.set(Number.POSITIVE_INFINITY, 0, Number.POSITIVE_INFINITY);
    if (!this.world) this._clear();
  }

  setQuality(profile = {}) {
    this.radius = clamp(profile.hangingLeafRadius || 48, 18, 96);
    this.treeCap = clamp(profile.hangingLeafTreeCap || 36, 8, 112);
    this.patchesPerTree = this.radius <= 28 ? 1 : 2;
    this._syncTimer = 0;
  }

  _clear() {
    this.patches.length = 0;
    if (!this.mesh) return;
    this.mesh.count = 0;
    this.mesh.visible = false;
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  _treeHasCanopy(tree) {
    if (!this.world?.isPositionReady?.(tree.rootX, tree.rootZ)) return false;
    const y = tree.crownY;
    return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => (
      this.world.getBlock?.(tree.rootX + dx, y, tree.rootZ + dz) === BLOCK.ASH_LEAVES
    ));
  }

  _patchForTree(tree, patchIndex) {
    const salt = (Number(this.world?.seed) || 0) ^ (patchIndex * 0x9e3779b9);
    const angle = groundLeafUnitHash(tree.rootX, tree.rootZ, salt ^ 0x51ed270b) * Math.PI * 2;
    const distance = 1.1 + groundLeafUnitHash(tree.rootX, tree.rootZ, salt ^ 0x27d4eb2d) * 1.65;
    const x = tree.rootX + 0.5 + Math.cos(angle) * distance;
    const z = tree.rootZ + 0.5 + Math.sin(angle) * distance;
    const cellX = Math.floor(x);
    const cellZ = Math.floor(z);
    if (!this.world.isPositionReady?.(cellX, cellZ)) return null;
    const surface = Number(this.world.terrainHeight?.(cellX, cellZ));
    if (!Number.isFinite(surface)) return null;
    const support = this.world.getBlock?.(cellX, surface, cellZ);
    const above = this.world.getBlock?.(cellX, surface + 1, cellZ);
    if (!BLOCKS[support]?.solid || BLOCKS[support]?.liquid) return null;
    if (BLOCKS[above]?.solid || BLOCKS[above]?.liquid) return null;
    return {
      key: `${tree.id}:${patchIndex}`,
      treeId: tree.id,
      x,
      y: surface + 1.018 + patchIndex * 0.004,
      z,
      rotation: groundLeafUnitHash(tree.rootX, tree.rootZ, salt ^ 0xa511e9b3) * Math.PI * 2,
      scale: 0.76 + groundLeafUnitHash(tree.rootX, tree.rootZ, salt ^ 0x7f4a7c15) * 0.34,
    };
  }

  _sync(focus) {
    if (!this.ready || !this.world || !focus) return false;
    const trees = (this.world.getTreesNear?.(focus.x, focus.z, this.radius) || [])
      .filter((tree) => tree.hasFallingLeaves && !tree.isPine && this._treeHasCanopy(tree))
      .slice(0, this.treeCap);
    const patches = [];
    for (const tree of trees) {
      for (let patchIndex = 0; patchIndex < this.patchesPerTree; patchIndex++) {
        if (patches.length >= MAX_PATCHES) break;
        const patch = this._patchForTree(tree, patchIndex);
        if (patch) patches.push(patch);
      }
    }
    this.patches = patches;
    this._lastFocus.copy(focus);
    this._lastStreamRevision = Number(this.world.streamRevision) || 0;
    return true;
  }

  _writeInstances() {
    if (!this.mesh) return;
    this.patches.forEach((patch, index) => {
      this._dummy.position.set(patch.x, patch.y, patch.z);
      this._dummy.rotation.set(0, patch.rotation, 0);
      this._dummy.scale.setScalar(patch.scale);
      this._dummy.updateMatrix();
      this.mesh.setMatrixAt(index, this._dummy.matrix);
    });
    this.mesh.count = this.patches.length;
    this.mesh.visible = this.patches.length > 0;
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  update(dt, focus) {
    if (!this.ready || !this.world || !focus) return;
    this._syncTimer -= Math.max(0, Number(dt) || 0);
    const streamChanged = (Number(this.world.streamRevision) || 0) !== this._lastStreamRevision;
    if (this._syncTimer <= 0 || streamChanged || this._lastFocus.distanceToSquared(focus) > 36) {
      this._syncTimer = RESYNC_INTERVAL;
      if (this._sync(focus)) this._writeInstances();
    }
  }

  getStats() {
    const baseTriangles = this.mesh?.geometry?.index
      ? this.mesh.geometry.index.count / 3
      : (this.mesh?.geometry?.getAttribute?.('position')?.count || 0) / 3;
    return {
      ready: this.ready,
      failed: this.failed,
      loading: Boolean(this._loadPromise),
      error: this.error ? String(this.error.message || this.error) : '',
      patches: this.patches.length,
      sourceTrees: new Set(this.patches.map((patch) => patch.treeId)).size,
      draws: this.patches.length > 0 ? 1 : 0,
      triangles: Math.round(baseTriangles * this.patches.length),
      assetUrl: this.assetUrl,
      gptTexture: Boolean(this.mesh?.material?.map),
      nearestTexture: this.mesh?.material?.map?.magFilter === THREE.NearestFilter,
    };
  }

  dispose() {
    this._loadGeneration++;
    this._cancelLoad?.();
    this._cancelLoad = null;
    this._loadPromise = null;
    this._clear();
    this.group.removeFromParent?.();
    disposeRuntimeMesh(this.mesh);
    this.mesh = null;
    this.world = null;
    this.ready = false;
  }
}
