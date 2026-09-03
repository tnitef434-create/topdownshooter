import * as THREE from '../vendor/three.module.min.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';
import { BLOCKS } from './blocks.js';

const ASSET_URL = new URL('../assets/environment/forest-floor.glb', import.meta.url).href;
const DEFAULT_LOAD_TIMEOUT_MS = 8_000;
const RESYNC_INTERVAL = 0.48;
const MAX_INSTANCES = 384;
const MAX_INSECT_ANCHORS = 32;
const INSECTS_PER_ANCHOR = 3;

export const FOREST_FLOOR_ROOTS = Object.freeze({
  fallen_log: 'Fallen_Log_Asset',
  stump: 'Mossy_Stump_Asset',
  exposed_roots: 'Exposed_Root_Asset',
  twigs: 'Twig_Cluster_Asset',
  pinecone: 'Pinecone_Asset',
  rocks: 'Rock_Cluster_Asset',
});

const KIND_ALIASES = Object.freeze({
  log: 'fallen_log',
  fallen_log: 'fallen_log',
  fallenlog: 'fallen_log',
  mossy_log: 'fallen_log',
  stump: 'stump',
  mossy_stump: 'stump',
  exposed_root: 'exposed_roots',
  exposed_roots: 'exposed_roots',
  root: 'exposed_roots',
  root_cluster: 'exposed_roots',
  twig: 'twigs',
  twigs: 'twigs',
  twig_cluster: 'twigs',
  pinecone: 'pinecone',
  pine_cone: 'pinecone',
  rock: 'rocks',
  rocks: 'rocks',
  rock_cluster: 'rocks',
});

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, Number(value) || 0));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function normalizeKind(kind) {
  return KIND_ALIASES[String(kind || '').trim().toLowerCase()] || null;
}

function stringHash(value) {
  let hash = 2166136261;
  const text = String(value || 'forest-floor');
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  hash ^= hash >>> 15;
  return (hash >>> 0) / 4294967296;
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

function bakeRootGeometry(root, label) {
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
      throw new Error(`${label} asset is missing hard-pixel vertex colours`);
    }
    for (const name of Object.keys(geometry.attributes)) {
      if (!['position', 'normal', 'color'].includes(name)) geometry.deleteAttribute(name);
    }
    parts.push(geometry);
  });
  if (!parts.length) throw new Error(`${label} asset contains no mesh geometry`);
  const allIndexed = parts.every((geometry) => Boolean(geometry.index));
  const normalized = parts.map((geometry) => {
    if (allIndexed || !geometry.index) return geometry;
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

function createInstanceMesh(geometry, material, kind) {
  const mesh = new THREE.InstancedMesh(geometry, material, MAX_INSTANCES);
  mesh.name = `Blender voxel forest floor ${kind}`;
  mesh.count = 0;
  mesh.visible = false;
  mesh.frustumCulled = false;
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.userData.assetRole = `living_forest_floor_${kind}`;
  return mesh;
}

function createInsectPoints() {
  const positions = new Float32Array(MAX_INSECT_ANCHORS * INSECTS_PER_ANCHOR * 3);
  const geometry = new THREE.BufferGeometry();
  const position = new THREE.BufferAttribute(positions, 3);
  position.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', position);
  geometry.setDrawRange(0, 0);
  const material = new THREE.PointsMaterial({
    name: 'Tiny crawling forest-floor insects',
    color: 0x15120e,
    size: 0.04,
    sizeAttenuation: true,
    transparent: false,
    opacity: 1,
    depthTest: true,
    depthWrite: true,
    fog: true,
    toneMapped: true,
  });
  const points = new THREE.Points(geometry, material);
  points.name = 'Batched crawling log insects';
  points.visible = false;
  points.frustumCulled = false;
  points.renderOrder = 1;
  points.userData.assetRole = 'tiny_crawling_log_insects';
  return points;
}

function createRuntimePack(gltf) {
  if (!gltf?.scene) throw new Error('Forest-floor glTF scene is missing');
  gltf.scene.updateWorldMatrix(true, true);
  const geometries = new Map();
  try {
    for (const [kind, rootName] of Object.entries(FOREST_FLOOR_ROOTS)) {
      geometries.set(kind, bakeRootGeometry(gltf.scene.getObjectByName(rootName), rootName));
    }
    geometries.set(
      'mushrooms',
      bakeRootGeometry(gltf.scene.getObjectByName('Mushroom_Log_Detail'), 'Mushroom_Log_Detail'),
    );
  } catch (error) {
    geometries.forEach((geometry) => geometry.dispose?.());
    throw error;
  }
  const material = new THREE.MeshStandardMaterial({
    name: 'Rain-reactive hard-pixel forest-floor material',
    color: 0xffffff,
    vertexColors: true,
    roughness: 0.96,
    metalness: 0,
    transparent: false,
    alphaTest: 0,
    depthWrite: true,
    side: THREE.FrontSide,
    flatShading: true,
  });
  const meshes = new Map();
  geometries.forEach((geometry, kind) => meshes.set(kind, createInstanceMesh(geometry, material, kind)));
  const topHeights = new Map();
  geometries.forEach((geometry, kind) => {
    geometry.computeBoundingBox();
    topHeights.set(kind, Number(geometry.boundingBox?.max?.y) || 0);
  });
  return {
    meshes,
    material,
    insects: createInsectPoints(),
    topHeights,
  };
}

function disposeRuntimePack(pack) {
  if (!pack) return;
  pack.meshes?.forEach?.((mesh) => {
    mesh.removeFromParent?.();
    mesh.geometry?.dispose?.();
  });
  pack.insects?.removeFromParent?.();
  pack.insects?.geometry?.dispose?.();
  pack.insects?.material?.dispose?.();
  pack.material?.dispose?.();
}

function descriptorFlag(entry, ...names) {
  return names.some((name) => entry?.[name] === true);
}

function forestFloorDescriptor(entry, index) {
  const kind = normalizeKind(entry?.kind || entry?.type || entry?.prop);
  const x = Number(entry?.x);
  const y = Number(entry?.y);
  const z = Number(entry?.z);
  if (!kind || !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return null;
  const scale = clamp(entry.scale == null ? 1 : entry.scale, 0.45, 1.8);
  const key = String(entry.key || entry.id || `${kind}:${x.toFixed(2)}:${z.toFixed(2)}:${index}`);
  const canHostDetails = kind === 'fallen_log' || kind === 'stump';
  return {
    ...entry,
    kind,
    key,
    x,
    y,
    z,
    yaw: Number(entry.yaw ?? entry.rotation) || 0,
    scale,
    wetnessSeed: clamp(entry.wetnessSeed ?? stringHash(`${key}:wet`), 0, 1),
    mushrooms: canHostDetails && descriptorFlag(entry, 'mushrooms', 'hasMushrooms', 'mushroom'),
    insects: canHostDetails && descriptorFlag(entry, 'insects', 'hasInsects', 'crawlingInsects'),
  };
}

/**
 * Fast, tightly bounded movement across a log surface. These are deliberately
 * points rather than miniature creatures: at gameplay distance they read like
 * the pond flies while remaining cheap and free of blurry sprites.
 */
export function forestInsectOffset(anchor, insectIndex, time, motion = 1, target = new THREE.Vector3()) {
  const seed = clamp(anchor?.wetnessSeed ?? stringHash(anchor?.key), 0, 1);
  const scale = clamp(anchor?.scale ?? 1, 0.45, 1.8);
  const yaw = Number(anchor?.yaw) || 0;
  const phase = Math.max(0, Number(time) || 0) * (5.2 + seed * 1.8) * clamp(motion, 0, 1)
    + insectIndex * 2.094 + seed * 8.71;
  const along = ((insectIndex - 1) * 0.105 + Math.sin(phase * 0.71) * 0.065) * scale;
  const across = Math.sin(phase) * 0.09 * scale;
  const localX = anchor.kind === 'stump' ? across : along;
  const localZ = anchor.kind === 'stump' ? along : across;
  // Match THREE's positive Y rotation exactly: local +X turns toward world -Z.
  const worldX = localX * Math.cos(yaw) + localZ * Math.sin(yaw);
  const worldZ = -localX * Math.sin(yaw) + localZ * Math.cos(yaw);
  // Authored tops are 0.508m (log) and 0.746m (stump). Keep the dots a
  // millimetre above those opaque surfaces so depth testing never buries them.
  const authoredTop = Number(anchor?.detailTop);
  const baseHeight = Number.isFinite(authoredTop) && authoredTop > 0
    ? authoredTop + 0.007
    : (anchor.kind === 'stump' ? 0.755 : 0.515);
  const y = (Number(anchor?.y) || 0) + (baseHeight + Math.abs(Math.cos(phase * 1.17)) * 0.018) * scale;
  return target.set(
    (Number(anchor?.x) || 0) + worldX,
    y,
    (Number(anchor?.z) || 0) + worldZ,
  );
}

export class ForestFloorField {
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
    this.group.name = 'Living voxel forest floor';
    scene?.add?.(this.group);
    this.world = null;
    this.pack = null;
    this.ready = false;
    this.failed = false;
    this.error = null;
    this.items = [];
    this.mushrooms = [];
    this.insectAnchors = [];
    this.radius = 48;
    this.instanceLimit = 144;
    this.insectAnchorLimit = 8;
    this.motion = 1;
    this.shadows = true;
    this.wetness = 0;
    this._loadPromise = null;
    this._loadGeneration = 0;
    this._cancelLoad = null;
    this._syncTimer = 0;
    this._lastStreamRevision = -1;
    this._lastEditRevision = -1;
    this._lastFocus = new THREE.Vector3(Number.POSITIVE_INFINITY, 0, Number.POSITIVE_INFINITY);
    this._dummy = new THREE.Object3D();
    this._point = new THREE.Vector3();
    this._elapsed = 0;
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
        this.error = cause instanceof Error ? cause : new Error(String(cause || 'Unknown forest-floor asset error'));
        this.world?.setForestFloorCollisionEnabled?.(false);
        console.warn('Worldloom living forest floor was skipped safely.', this.error);
      }
      finish();
    };
    cancelAttempt = () => finish();
    this._cancelLoad = cancelAttempt;
    timeoutId = setTimeout(
      () => failCosmetically(new Error(`Forest-floor asset timed out after ${this.loadTimeoutMs}ms`)),
      this.loadTimeoutMs,
    );
    Promise.resolve()
      .then(() => {
        if (settled || generation !== this._loadGeneration) return null;
        const loader = this.loaderFactory();
        if (!loader?.loadAsync) throw new Error('Forest-floor asset loader is unavailable');
        return loader.loadAsync(this.assetUrl);
      })
      .then((gltf) => {
        if (!gltf) return;
        if (settled || generation !== this._loadGeneration) {
          disposeImportedScene(gltf.scene);
          return;
        }
        let pack = null;
        try {
          pack = createRuntimePack(gltf);
        } catch (error) {
          disposeImportedScene(gltf.scene);
          failCosmetically(error);
          return;
        }
        disposeImportedScene(gltf.scene);
        if (settled || generation !== this._loadGeneration) {
          disposeRuntimePack(pack);
          return;
        }
        disposeRuntimePack(this.pack);
        this.pack = pack;
        pack.meshes.forEach((mesh) => this.group.add(mesh));
        this.group.add(pack.insects);
        this.ready = true;
        this.failed = false;
        this.error = null;
        this.world?.setForestFloorCollisionEnabled?.(true);
        this._applyShadowPolicy();
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
    if (this.world !== nextWorld) {
      this.world?.setForestFloorCollisionEnabled?.(false);
      this._clear();
    }
    this.world = nextWorld;
    this.world?.setForestFloorCollisionEnabled?.(this.ready);
    this._syncTimer = 0;
    this._lastStreamRevision = -1;
    this._lastEditRevision = -1;
    this._lastFocus.set(Number.POSITIVE_INFINITY, 0, Number.POSITIVE_INFINITY);
    if (!this.world) this._clear();
  }

  setQuality(profile = {}, reducedMotion = false) {
    this.radius = clamp(profile.forestFloorRadius ?? 48, 20, 112);
    this.instanceLimit = Math.round(clamp(profile.forestFloorCap ?? 144, 0, MAX_INSTANCES));
    this.insectAnchorLimit = Math.round(clamp(
      profile.forestInsectCap ?? 8,
      0,
      MAX_INSECT_ANCHORS,
    ));
    this.motion = reducedMotion ? 0.45 : 1;
    this.shadows = Boolean(profile.shadows);
    this._applyShadowPolicy();
    this._syncTimer = 0;
  }

  _applyShadowPolicy() {
    this.pack?.meshes?.forEach?.((mesh, kind) => {
      mesh.castShadow = this.shadows && ['fallen_log', 'stump', 'exposed_roots', 'rocks'].includes(kind);
      mesh.receiveShadow = true;
    });
  }

  _clear() {
    this.items.length = 0;
    this.mushrooms.length = 0;
    this.insectAnchors.length = 0;
    this.pack?.meshes?.forEach?.((mesh) => {
      mesh.count = 0;
      mesh.visible = false;
      mesh.instanceMatrix.needsUpdate = true;
    });
    if (this.pack?.insects) {
      this.pack.insects.visible = false;
      this.pack.insects.geometry.setDrawRange(0, 0);
    }
  }

  _descriptorsNear(focus) {
    const query = this.world?.describeForestFloorNear || this.world?.getForestFloorNear;
    if (typeof query !== 'function') return [];
    const raw = query.call(this.world, focus.x, focus.z, this.radius) || [];
    return raw
      .map(forestFloorDescriptor)
      .filter(Boolean)
      .filter((entry) => !this.world?.isPositionReady || this.world.isPositionReady(entry.x, entry.z))
      .filter((entry) => this._livePlacementClear(entry))
      .sort((a, b) => {
        const distanceA = (a.x - focus.x) ** 2 + (a.z - focus.z) ** 2;
        const distanceB = (b.x - focus.x) ** 2 + (b.z - focus.z) ** 2;
        return distanceA - distanceB || a.key.localeCompare(b.key);
      })
      .slice(0, this.instanceLimit);
  }

  _livePlacementClear(entry) {
    if (typeof this.world?.forestFloorPlacementIsLive === 'function') {
      return this.world.forestFloorPlacementIsLive(entry);
    }
    if (typeof this.world?.getBlock !== 'function') return true;
    const x = Math.floor(entry.x);
    const y = Math.floor(entry.y);
    const z = Math.floor(entry.z);
    const support = BLOCKS[this.world.getBlock(x, y - 1, z)];
    const occupied = BLOCKS[this.world.getBlock(x, y, z)];
    return Boolean(support?.solid && !support.liquid && !occupied?.solid && !occupied?.liquid);
  }

  _sync(focus) {
    if (!this.ready || !this.world || !focus) return false;
    this.items = this._descriptorsNear(focus).map((item) => ({
      ...item,
      detailTop: this.pack?.topHeights?.get(item.kind)
        || (item.kind === 'stump' ? 0.755 : 0.515),
    }));
    this.mushrooms = this.items.filter((item) => item.mushrooms);
    this.insectAnchors = this.items.filter((item) => item.insects).slice(0, this.insectAnchorLimit);
    this._lastFocus.copy(focus);
    this._lastStreamRevision = Number(this.world.streamRevision) || 0;
    this._lastEditRevision = Number(this.world.editRevision) || 0;
    return true;
  }

  _writeInstances() {
    if (!this.pack) return;
    const byKind = new Map(Object.keys(FOREST_FLOOR_ROOTS).map((kind) => [kind, []]));
    this.items.forEach((item) => byKind.get(item.kind)?.push(item));
    byKind.forEach((items, kind) => {
      const mesh = this.pack.meshes.get(kind);
      if (!mesh) return;
      items.forEach((item, index) => {
        this._dummy.position.set(item.x, item.y, item.z);
        this._dummy.rotation.set(0, item.yaw, 0);
        this._dummy.scale.setScalar(item.scale);
        this._dummy.updateMatrix();
        mesh.setMatrixAt(index, this._dummy.matrix);
      });
      mesh.count = items.length;
      mesh.visible = items.length > 0;
      mesh.instanceMatrix.needsUpdate = true;
    });

    const mushroomMesh = this.pack.meshes.get('mushrooms');
    this.mushrooms.forEach((item, index) => {
      const seed = stringHash(`${item.key}:mushrooms`);
      const along = (seed - 0.5) * (item.kind === 'stump' ? 0.24 : 0.72) * item.scale;
      this._dummy.position.set(
        item.x + Math.cos(item.yaw) * along,
        item.y + (item.detailTop + 0.007) * item.scale,
        item.z - Math.sin(item.yaw) * along,
      );
      this._dummy.rotation.set(0, item.yaw + (seed - 0.5) * 0.45, 0);
      this._dummy.scale.setScalar(item.scale * (0.82 + seed * 0.25));
      this._dummy.updateMatrix();
      mushroomMesh.setMatrixAt(index, this._dummy.matrix);
    });
    mushroomMesh.count = this.mushrooms.length;
    mushroomMesh.visible = this.mushrooms.length > 0;
    mushroomMesh.instanceMatrix.needsUpdate = true;
  }

  _writeInsects(context = {}) {
    const points = this.pack?.insects;
    if (!points) return;
    const active = this.insectAnchors.length > 0
      && this.insectAnchorLimit > 0
      && context.active !== false
      && Number(context.dayAmount ?? 1) > 0.34
      && Number(context.rainIntensity || 0) < 0.58
      && Number(context.skyExposure ?? 1) > 0.28
      && Number(context.caveAmount || 0) < 0.45;
    if (!active) {
      points.visible = false;
      points.geometry.setDrawRange(0, 0);
      return;
    }
    const position = points.geometry.getAttribute('position');
    let pointIndex = 0;
    this.insectAnchors.forEach((anchor) => {
      for (let insectIndex = 0; insectIndex < INSECTS_PER_ANCHOR; insectIndex++) {
        forestInsectOffset(anchor, insectIndex, this._elapsed, this.motion, this._point);
        position.setXYZ(pointIndex++, this._point.x, this._point.y, this._point.z);
      }
    });
    position.needsUpdate = true;
    points.geometry.setDrawRange(0, pointIndex);
    points.visible = pointIndex > 0;
  }

  _updateWetness(dt, rainIntensity) {
    const target = clamp(rainIntensity, 0, 1);
    const speed = target > this.wetness ? 1.75 : 0.23;
    this.wetness += (target - this.wetness) * (1 - Math.exp(-Math.max(0, dt) * speed));
    if (!this.pack?.material) return;
    this.pack.material.color.setRGB(
      lerp(1, 0.68, this.wetness),
      lerp(1, 0.72, this.wetness),
      lerp(1, 0.70, this.wetness),
    );
    this.pack.material.roughness = lerp(0.96, 0.74, this.wetness);
  }

  update(dt, focus, context = {}) {
    if (!this.ready || !this.world || !focus) return;
    const delta = Math.max(0, Number(dt) || 0);
    this._elapsed += delta;
    this._updateWetness(delta, context.rainIntensity || 0);
    this._syncTimer -= delta;
    const streamChanged = (Number(this.world.streamRevision) || 0) !== this._lastStreamRevision;
    const editsChanged = (Number(this.world.editRevision) || 0) !== this._lastEditRevision;
    if (this._syncTimer <= 0 || streamChanged || editsChanged
      || this._lastFocus.distanceToSquared(focus) > 36) {
      this._syncTimer = RESYNC_INTERVAL;
      if (this._sync(focus)) this._writeInstances();
    }
    this._writeInsects(context);
  }

  getStats() {
    const counts = {};
    Object.keys(FOREST_FLOOR_ROOTS).forEach((kind) => { counts[kind] = 0; });
    this.items.forEach((item) => { counts[item.kind] = (counts[item.kind] || 0) + 1; });
    let triangles = 0;
    this.pack?.meshes?.forEach?.((mesh) => {
      const base = mesh.geometry?.index
        ? mesh.geometry.index.count / 3
        : (mesh.geometry?.getAttribute?.('position')?.count || 0) / 3;
      triangles += base * mesh.count;
    });
    const visibleMeshDraws = this.pack
      ? [...this.pack.meshes.values()].filter((mesh) => mesh.visible && mesh.count > 0).length
      : 0;
    return {
      ready: this.ready,
      failed: this.failed,
      loading: Boolean(this._loadPromise),
      error: this.error ? String(this.error.message || this.error) : '',
      props: this.items.length,
      counts,
      mushrooms: this.mushrooms.length,
      insectAnchors: this.insectAnchors.length,
      insectDots: this.pack?.insects?.visible ? this.insectAnchors.length * INSECTS_PER_ANCHOR : 0,
      wetness: this.wetness,
      draws: visibleMeshDraws + (this.pack?.insects?.visible ? 1 : 0),
      triangles: Math.round(triangles),
      assetUrl: this.assetUrl,
      vertexColours: Boolean(this.pack?.material?.vertexColors),
      opaque: this.pack ? this.pack.material.transparent === false : false,
    };
  }

  dispose() {
    this.world?.setForestFloorCollisionEnabled?.(false);
    this._loadGeneration++;
    this._cancelLoad?.();
    this._cancelLoad = null;
    this._loadPromise = null;
    this._clear();
    this.group.removeFromParent?.();
    disposeRuntimePack(this.pack);
    this.pack = null;
    this.world = null;
    this.ready = false;
  }
}
