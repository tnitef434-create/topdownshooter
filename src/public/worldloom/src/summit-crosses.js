import * as THREE from '../vendor/three.module.min.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { BLOCKS } from './blocks.js';

const ASSET_URL = new URL('../assets/environment/summit-cross.glb', import.meta.url).href;
const DEFAULT_LOAD_TIMEOUT_MS = 8_000;
const MAX_CROSSES = 48;
const MIN_RADIUS = 48;
const MAX_RADIUS = 160;

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, Number(value) || 0));
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

function nearestWoodTexture(material) {
  const source = (Array.isArray(material) ? material : [material])
    .find((entry) => entry?.map?.isTexture)?.map;
  if (!source) throw new Error('Summit-cross wood mesh is missing its embedded GPT-image atlas');
  const texture = source.clone();
  texture.name = 'Runtime nearest summit-cross wood atlas';
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 1;
  texture.needsUpdate = true;
  return texture;
}

function bakedGeometry(root, node) {
  if (!root || !node?.isMesh || !node.geometry?.getAttribute?.('position')) {
    throw new Error(`Summit-cross mesh ${node?.name || 'unknown'} is missing geometry`);
  }
  root.updateWorldMatrix(true, true);
  node.updateWorldMatrix(true, false);
  const geometry = node.geometry.clone();
  const rootInverse = new THREE.Matrix4().copy(root.matrixWorld).invert();
  geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(rootInverse, node.matrixWorld));
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
  if (node.name === 'Summit_Cross_Wood' && !geometry.getAttribute('uv')) {
    geometry.dispose();
    throw new Error('Summit-cross wood mesh is missing authored UVs');
  }
  for (const name of Object.keys(geometry.attributes)) {
    if (!['position', 'normal', 'uv'].includes(name)) geometry.deleteAttribute(name);
  }
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function createRuntimeMeshes(gltf) {
  if (!gltf?.scene) throw new Error('Summit-cross glTF scene is missing');
  const root = gltf.scene.getObjectByName('Summit_Cross_Asset');
  if (!root) throw new Error('Summit-cross asset root is missing');
  const woodNode = root.getObjectByName('Summit_Cross_Wood');
  const ironNode = root.getObjectByName('Summit_Cross_Iron_Pegs');
  const woodGeometry = bakedGeometry(root, woodNode);
  const ironGeometry = bakedGeometry(root, ironNode);
  let woodMaterial = null;
  let ironMaterial = null;
  try {
    woodMaterial = new THREE.MeshStandardMaterial({
      name: 'GPT-textured hand-hewn summit-cross wood',
      map: nearestWoodTexture(woodNode.material),
      color: 0xffffff,
      roughness: 0.91,
      metalness: 0,
    });
    ironMaterial = new THREE.MeshStandardMaterial({
      name: 'Forged summit-cross pegs',
      color: 0x18130f,
      roughness: 0.78,
      metalness: 0.58,
    });
    const wood = new THREE.InstancedMesh(woodGeometry, woodMaterial, MAX_CROSSES);
    const iron = new THREE.InstancedMesh(ironGeometry, ironMaterial, MAX_CROSSES);
    for (const [mesh, role] of [[wood, 'wood'], [iron, 'iron_pegs']]) {
      mesh.name = `Blender summit crosses · ${role}`;
      mesh.count = 0;
      mesh.visible = false;
      mesh.frustumCulled = false;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.userData.assetRole = `mountain_summit_cross_${role}`;
      mesh.userData.drawBudget = 1;
    }
    return { wood, iron };
  } catch (error) {
    woodGeometry.dispose();
    ironGeometry.dispose();
    disposeMaterials([woodMaterial, ironMaterial]);
    throw error;
  }
}

function disposeRuntimeMeshes(meshes) {
  if (!meshes) return;
  for (const mesh of [meshes.wood, meshes.iron]) {
    mesh?.removeFromParent?.();
    mesh?.geometry?.dispose?.();
    disposeMaterials([mesh?.material]);
  }
}

export class SummitCrossField {
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
    this.group.name = 'Blender mountain summit crosses';
    scene?.add?.(this.group);
    this.world = null;
    this.ready = false;
    this.failed = false;
    this.error = null;
    this.meshes = null;
    this.crosses = [];
    this.shadows = true;
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
        this.error = cause instanceof Error ? cause : new Error(String(cause || 'Unknown summit-cross asset error'));
        console.warn('Worldloom summit crosses were skipped safely.', this.error);
      }
      finish();
    };
    cancelAttempt = () => finish();
    this._cancelLoad = cancelAttempt;
    timeoutId = setTimeout(() => {
      failCosmetically(new Error(`Summit-cross asset timed out after ${this.loadTimeoutMs}ms`));
    }, this.loadTimeoutMs);

    Promise.resolve()
      .then(() => {
        if (settled || generation !== this._loadGeneration) return null;
        const loader = this.loaderFactory();
        if (!loader?.loadAsync) throw new Error('Summit-cross asset loader is unavailable');
        return loader.loadAsync(this.assetUrl);
      })
      .then((gltf) => {
        if (!gltf) return;
        if (settled || generation !== this._loadGeneration) {
          disposeImportedScene(gltf.scene);
          return;
        }
        let meshes = null;
        try {
          meshes = createRuntimeMeshes(gltf);
        } catch (error) {
          disposeImportedScene(gltf.scene);
          failCosmetically(error);
          return;
        }
        disposeImportedScene(gltf.scene);
        if (settled || generation !== this._loadGeneration) {
          disposeRuntimeMeshes(meshes);
          return;
        }
        disposeRuntimeMeshes(this.meshes);
        this.meshes = meshes;
        this.group.add(meshes.wood, meshes.iron);
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
    this.shadows = profile.shadows !== false;
    if (this.meshes) {
      this.meshes.wood.castShadow = this.shadows;
      this.meshes.iron.castShadow = this.shadows;
    }
  }

  _clear() {
    this.crosses.length = 0;
    if (!this.meshes) return;
    for (const mesh of [this.meshes.wood, this.meshes.iron]) {
      mesh.count = 0;
      mesh.visible = false;
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  _crossStillSupported(cross) {
    if (!this.world?.isPositionReady?.(cross.rootX, cross.rootZ)) return false;
    const support = this.world.getBlock?.(cross.rootX, cross.summitHeight, cross.rootZ);
    if (!BLOCKS[support]?.solid || BLOCKS[support]?.liquid) return false;
    const baseSpace = this.world.getBlock?.(cross.rootX, cross.rootY, cross.rootZ);
    return !BLOCKS[baseSpace]?.solid && !BLOCKS[baseSpace]?.liquid;
  }

  _sync(focus, viewDistance) {
    if (!this.ready || !this.world || !focus) return false;
    // Full terrain streams two support chunks beyond the detail radius. Keep
    // every visible cross inside that stable surface rather than floating over
    // the lightweight far-horizon proxy.
    const detailedChunks = Number.isFinite(Number(this.world.detailDistance))
      ? clamp(Number(this.world.detailDistance), 2, 8)
      : clamp(viewDistance, 2, 20);
    // Streaming uses a square chunk footprint, so include its corner distance
    // without scanning all the way to the much larger visual horizon proxy.
    const radius = clamp((detailedChunks + 2) * 16 * Math.SQRT2, MIN_RADIUS, MAX_RADIUS);
    this.crosses = (this.world.getMountainCrossesNear?.(focus.x, focus.z, radius) || [])
      .filter((cross) => this._crossStillSupported(cross))
      .slice(0, MAX_CROSSES);
    this._lastFocus.copy(focus);
    this._lastStreamRevision = Number(this.world.streamRevision) || 0;
    return true;
  }

  _writeInstances() {
    if (!this.meshes) return;
    for (let index = 0; index < this.crosses.length; index++) {
      const cross = this.crosses[index];
      this._dummy.position.set(cross.rootX + 0.5, cross.rootY - 0.18, cross.rootZ + 0.5);
      this._dummy.rotation.set(0, cross.axis === 'z' ? Math.PI * 0.5 : 0, 0);
      this._dummy.scale.setScalar(1);
      this._dummy.updateMatrix();
      this.meshes.wood.setMatrixAt(index, this._dummy.matrix);
      this.meshes.iron.setMatrixAt(index, this._dummy.matrix);
    }
    for (const mesh of [this.meshes.wood, this.meshes.iron]) {
      mesh.count = this.crosses.length;
      mesh.visible = this.crosses.length > 0;
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  update(dt, focus, viewDistance = 4) {
    if (!this.ready || !this.world || !focus) return;
    const elapsed = Math.max(0, Number(dt) || 0);
    this._syncTimer -= elapsed;
    const streamChanged = (Number(this.world.streamRevision) || 0) !== this._lastStreamRevision;
    if (this._syncTimer <= 0 || streamChanged || this._lastFocus.distanceToSquared(focus) > 64) {
      this._syncTimer = 0.45;
      if (this._sync(focus, viewDistance)) this._writeInstances();
    }
  }

  getStats() {
    const baseTriangles = [this.meshes?.wood, this.meshes?.iron].reduce((sum, mesh) => {
      if (!mesh?.geometry) return sum;
      return sum + (mesh.geometry.index
        ? mesh.geometry.index.count / 3
        : (mesh.geometry.getAttribute('position')?.count || 0) / 3);
    }, 0);
    return {
      ready: this.ready,
      failed: this.failed,
      loading: Boolean(this._loadPromise),
      error: this.error ? String(this.error.message || this.error) : '',
      crosses: this.crosses.length,
      draws: this.crosses.length > 0 ? 2 : 0,
      triangles: Math.round(baseTriangles * this.crosses.length),
      assetUrl: this.assetUrl,
      gptTexture: Boolean(this.meshes?.wood?.material?.map),
      nearestTexture: this.meshes?.wood?.material?.map?.magFilter === THREE.NearestFilter,
    };
  }

  dispose() {
    this._loadGeneration++;
    this._cancelLoad?.();
    this._cancelLoad = null;
    this._loadPromise = null;
    this._clear();
    this.group.removeFromParent?.();
    disposeRuntimeMeshes(this.meshes);
    this.meshes = null;
    this.world = null;
    this.ready = false;
  }
}

export default SummitCrossField;
