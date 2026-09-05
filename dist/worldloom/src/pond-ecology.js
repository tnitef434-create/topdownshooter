import * as THREE from '../vendor/three.module.min.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';
import { createPondMist } from './pond-mist.js';

const ASSET_URL = new URL('../assets/environment/pond-details.glb', import.meta.url).href;
const DEFAULT_LOAD_TIMEOUT_MS = 8_000;
const MAX_PADS = 144;
const MAX_MIST = 72;
const MAX_SWARMS = 24;
const FLIES_PER_SWARM = 5;

function unitHash(x, z, salt = 0) {
  let value = Math.imul(Math.floor(x) ^ salt, 0x27d4eb2d)
    ^ Math.imul(Math.floor(z) ^ (salt >>> 1), 0x165667b1);
  value ^= value >>> 15;
  value = Math.imul(value, 0x85ebca6b);
  value ^= value >>> 13;
  return (value >>> 0) / 4294967296;
}

export function pondFlyOffset(anchor, flyIndex, time, motion = 1, target = new THREE.Vector3()) {
  const index = Math.max(0, Math.floor(Number(flyIndex) || 0));
  const cellX = Number(anchor?.cellX ?? anchor?.x) || 0;
  const cellZ = Number(anchor?.cellZ ?? anchor?.z) || 0;
  const phase = (Number(anchor?.phase) || 0) + index * 2.3999632297;
  const motionScale = THREE.MathUtils.clamp(Number(motion) || 0, 0, 1);
  const speed = 5.2 + unitHash(cellX + index * 17, cellZ - index * 11, 0x9e3779b9) * 3.8;
  const clock = Math.max(0, Number(time) || 0) * speed * (0.58 + motionScale * 0.42) + phase;
  const reach = (0.13 + unitHash(cellX - index * 13, cellZ + index * 19, 0x85ebca6b) * 0.13)
    * (0.52 + motionScale * 0.48);
  // Layered, mismatched short loops read as quick course corrections without
  // requiring a winged mesh or nondeterministic random work every frame.
  const turnX = clock + Math.sin(clock * 1.73 + phase * 0.61) * 0.78;
  const turnZ = clock * 1.21 + Math.sin(clock * 2.17 - phase * 0.47) * 0.7;
  target.set(
    Math.sin(turnX) * reach + Math.sin(clock * 3.07 + phase) * 0.035 * motionScale,
    Math.sin(clock * 2.63 + phase * 0.37) * 0.052 * motionScale
      + Math.cos(clock * 0.79 - phase) * 0.018 * motionScale,
    Math.cos(turnZ) * reach * 0.82 + Math.sin(clock * 2.41 - phase) * 0.03 * motionScale,
  );
  return target;
}

function coloredGeometry(node, rootInverse, options = {}) {
  const preserveUv = Boolean(options.preserveUv);
  const useVertexColor = options.useVertexColor !== false;
  const geometry = node.geometry.clone();
  const transform = new THREE.Matrix4().multiplyMatrices(rootInverse, node.matrixWorld);
  geometry.applyMatrix4(transform);
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
  if (preserveUv && !geometry.getAttribute('uv')) {
    geometry.dispose();
    throw new Error(`Pond detail ${node.name || 'mesh'} is missing its authored atlas UVs`);
  }
  const retained = preserveUv ? ['position', 'normal', 'uv'] : ['position', 'normal'];
  for (const name of Object.keys(geometry.attributes)) {
    if (!retained.includes(name)) geometry.deleteAttribute(name);
  }
  if (!useVertexColor) return geometry;
  const count = geometry.getAttribute('position').count;
  const sourceMaterial = Array.isArray(node.material) ? node.material[0] : node.material;
  const color = sourceMaterial?.color?.isColor ? sourceMaterial.color : new THREE.Color(0xffffff);
  const colors = new Float32Array(count * 3);
  for (let index = 0; index < count; index++) {
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function bakeAssetGeometry(root, sceneRoot = root, options = {}) {
  if (!root) throw new Error('Pond detail asset root is missing');
  sceneRoot?.updateWorldMatrix?.(true, true);
  root.updateWorldMatrix(true, true);
  // Bake in glTF scene space. Inverting the named asset root itself also
  // cancelled the authored pack transform, so generator --scale had no effect.
  const sceneInverse = new THREE.Matrix4().copy(sceneRoot?.matrixWorld || root.matrixWorld).invert();
  const parts = [];
  root.traverse((node) => {
    if (node.isMesh && node.geometry?.getAttribute?.('position')) {
      parts.push(coloredGeometry(node, sceneInverse, options));
    }
  });
  if (!parts.length) throw new Error(`Pond detail ${root.name || 'asset'} contains no mesh`);
  const indexed = parts.every((geometry) => Boolean(geometry.index));
  const normalized = parts.map((geometry) => {
    if (indexed || !geometry.index) return geometry;
    const expanded = geometry.toNonIndexed();
    geometry.dispose();
    return expanded;
  });
  const merged = mergeGeometries(normalized, false);
  normalized.forEach((geometry) => geometry.dispose());
  if (!merged) throw new Error(`Pond detail ${root.name || 'asset'} could not be merged`);
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  return merged;
}

function disposeMaterials(entries) {
  const materials = new Set(entries.flatMap((entry) => (Array.isArray(entry) ? entry : [entry])).filter(Boolean));
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

function findImportedAtlas(root) {
  let atlas = null;
  root?.traverse?.((node) => {
    if (atlas || !node.isMesh) return;
    const entries = Array.isArray(node.material) ? node.material : [node.material];
    atlas = entries.find((material) => material?.map?.isTexture)?.map || null;
  });
  if (!atlas) throw new Error('Lily pad asset is missing its embedded texture atlas');
  const texture = atlas.clone();
  texture.name = 'Runtime nearest pond lily atlas';
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

function createInstancedMesh(geometry, material, capacity, name, renderOrder = 0) {
  const mesh = new THREE.InstancedMesh(geometry, material, capacity);
  mesh.name = name;
  mesh.count = 0;
  mesh.visible = false;
  mesh.castShadow = false;
  mesh.receiveShadow = name.includes('lily');
  mesh.frustumCulled = false;
  mesh.renderOrder = renderOrder;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  return mesh;
}

function createFlyPoints() {
  const geometry = new THREE.BufferGeometry();
  const position = new THREE.BufferAttribute(
    new Float32Array(MAX_SWARMS * FLIES_PER_SWARM * 3),
    3,
  );
  position.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', position);
  geometry.setDrawRange(0, 0);
  const material = new THREE.PointsMaterial({
    name: 'Tiny unlit pond fly dots',
    color: 0x12110f,
    size: 0.045,
    sizeAttenuation: true,
    transparent: false,
    depthTest: true,
    depthWrite: true,
    fog: true,
    toneMapped: true,
  });
  const points = new THREE.Points(geometry, material);
  points.name = 'Tiny unlit pond fly dots';
  points.count = 0;
  points.visible = false;
  points.castShadow = false;
  points.receiveShadow = false;
  points.frustumCulled = false;
  points.renderOrder = 5;
  points.userData.activePointCount = 0;
  points.userData.fliesPerSwarm = FLIES_PER_SWARM;
  points.userData.drawBudget = 1;
  points.userData.triangleBudget = 0;
  points.userData.representation = 'unlit-points';
  return points;
}

function disposeEcologyMeshes(meshes) {
  const materials = [];
  for (const mesh of meshes) {
    mesh?.removeFromParent?.();
    mesh?.geometry?.dispose?.();
    if (mesh?.material) materials.push(mesh.material);
  }
  disposeMaterials(materials);
}

function createEcologyMeshes(gltf,shared) {
  if (!gltf?.scene) throw new Error('Pond detail glTF scene is missing');
  const geometries = [];
  const materials = [];
  try {
    const lilyRoot = gltf.scene.getObjectByName('Lily_Pad_Asset');
    const lilyGeometry = bakeAssetGeometry(lilyRoot, gltf.scene, {
      preserveUv: true,
      useVertexColor: false,
    });
    geometries.push(lilyGeometry);
    const lilyAtlas = findImportedAtlas(lilyRoot);

    const lilyMaterial = new THREE.MeshStandardMaterial({
      name: 'Nearest atlas lily pad material',
      map: lilyAtlas,
      vertexColors: false,
      roughness: 0.92,
      metalness: 0,
      alphaTest: 0.5,
      transparent: false,
      depthWrite: true,
      side: THREE.DoubleSide,
    });
    materials.push(lilyMaterial);
    const mistMesh=createPondMist(shared||{});
    geometries.push(mistMesh.geometry);materials.push(mistMesh.material);
    const flyMesh = createFlyPoints();
    geometries.push(flyMesh.geometry);
    materials.push(flyMesh.material);

    return {
      padMesh: createInstancedMesh(lilyGeometry, lilyMaterial, MAX_PADS, 'Blender lily pads', 3),
      mistMesh,
      flyMesh,
    };
  } catch (error) {
    geometries.forEach((geometry) => geometry.dispose?.());
    disposeMaterials(materials);
    throw error;
  }
}

export class PondEcologyField {
  constructor(scene, graphicsUniforms = null, options = {}) {
    this.scene = scene;
    this.graphicsUniforms = graphicsUniforms;
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
    this.group.name = 'Blender pond ecology';
    scene?.add?.(this.group);
    this.profile = {
      pondDetailRadius: 48,
      pondPadCap: 56,
      pondPadsPerPond: 3,
      pondMistCap: 16,
      pondFlyCap: 8,
    };
    this.reducedMotion = false;
    this.ready = false;
    this.failed = false;
    this.error = null;
    this._loadPromise = null;
    this._loadGeneration = 0;
    this._cancelLoad = null;
    this._time = 0;
    this._syncTimer = 0;
    this._lastFocus = new THREE.Vector3(Number.POSITIVE_INFINITY, 0, Number.POSITIVE_INFINITY);
    this._dummy = new THREE.Object3D();
    this._flyOffset = new THREE.Vector3();
    this.padAnchors = [];
    this.mistAnchors = [];
    this.flyAnchors = [];
    this.padMesh = null;
    this.mistMesh = null;
    this.flyMesh = null;
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
    let cancelAttempt = null;
    let resolveAttempt = null;

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
        this.error = cause instanceof Error ? cause : new Error(String(cause || 'Unknown pond asset error'));
        console.warn('Worldloom pond details were skipped safely.', this.error);
      }
      finish();
    };
    cancelAttempt = () => finish();
    this._cancelLoad = cancelAttempt;
    timeoutId = setTimeout(() => {
      failCosmetically(new Error(`Pond detail asset timed out after ${this.loadTimeoutMs}ms`));
    }, this.loadTimeoutMs);

    Promise.resolve()
      .then(() => {
        if (settled || generation !== this._loadGeneration) return null;
        const loader = this.loaderFactory();
        if (!loader?.loadAsync) throw new Error('Pond detail loader is unavailable');
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
          meshes = createEcologyMeshes(gltf,this.graphicsUniforms);
        } catch (error) {
          disposeImportedScene(gltf.scene);
          failCosmetically(error);
          return;
        }
        disposeImportedScene(gltf.scene);
        if (settled || generation !== this._loadGeneration) {
          disposeEcologyMeshes(Object.values(meshes));
          return;
        }
        disposeEcologyMeshes([this.padMesh, this.mistMesh, this.flyMesh]);
        this.padMesh = meshes.padMesh;
        this.mistMesh = meshes.mistMesh;
        this.flyMesh = meshes.flyMesh;
        this.group.add(this.padMesh, this.mistMesh);
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
    this.world = world || null;
    this._syncTimer = 0;
    this._lastFocus.set(Number.POSITIVE_INFINITY, 0, Number.POSITIVE_INFINITY);
    if (!this.world) this._clearInstances();
  }

  setQuality(profile = {}, reducedMotion = false) {
    this.profile = { ...this.profile, ...profile };
    this.reducedMotion = Boolean(reducedMotion);
    this._syncTimer = 0;
  }

  _clearInstances() {
    this.padAnchors.length = 0;
    this.mistAnchors.length = 0;
    this.flyAnchors.length = 0;
    for (const mesh of [this.padMesh, this.mistMesh, this.flyMesh]) {
      if (!mesh) continue;
      mesh.count = 0;
      mesh.visible = false;
      if (mesh.instanceMatrix) mesh.instanceMatrix.needsUpdate = true;
      if (mesh.isPoints) {
        mesh.geometry.setDrawRange(0, 0);
        mesh.userData.activePointCount = 0;
        const position = mesh.geometry.getAttribute('position');
        if (position) position.needsUpdate = true;
      }
    }
  }

  _padAnchor(pond, index) {
    const angle = pond.phase + index * 2.3999632297
      + unitHash(pond.cellX, pond.cellZ, index ^ 0xa511e9b3) * 0.72;
    const distance = (0.16 + unitHash(pond.cellX, pond.cellZ, index ^ 0x63d83595) * 0.46)
      * Math.min(pond.radiusX, pond.radiusZ);
    const x = pond.centerX + Math.cos(angle) * distance;
    const z = pond.centerZ + Math.sin(angle) * distance;
    const waterSurface = this.world?.getFluidSurfaceY?.(Math.floor(x), pond.waterY, Math.floor(z));
    if (!Number.isFinite(waterSurface)) return null;
    return {
      x,
      y: waterSurface + 0.018,
      z,
      rotation: angle + unitHash(index, pond.cellX, 0x243f6a88) * Math.PI,
      scale: 0.76 + unitHash(index, pond.cellZ, 0x13198a2e) * 0.34,
      phase: pond.phase + index * 0.83,
    };
  }

  _sync(focus) {
    if (!this.ready || !this.world) return;
    const radius = Number(this.profile.pondDetailRadius) || 0;
    const padCap = Math.min(MAX_PADS, Math.max(0, Math.floor(this.profile.pondPadCap || 0)));
    const mistCap = Math.min(MAX_MIST, Math.max(0, Math.floor(this.profile.pondMistCap || 0)));
    const flyCap = 0; // All wildlife is now the custom meadow pig.
    const padsPerPond = Math.max(1, Math.floor(this.profile.pondPadsPerPond || 2));
    const ponds = this.world.getPondsNear?.(focus.x, focus.z, radius) || [];
    this.padAnchors.length = 0;
    this.mistAnchors.length = 0;
    this.flyAnchors.length = 0;
    for (const pond of ponds) {
      if (!this.world.isPositionReady?.(pond.centerX, pond.centerZ)) continue;
      const surface = this.world.getFluidSurfaceY?.(
        Math.floor(pond.centerX),
        pond.waterY,
        Math.floor(pond.centerZ),
      );
      if (!Number.isFinite(surface)) continue;
      for (let index = 0; index < padsPerPond && this.padAnchors.length < padCap; index++) {
        const anchor = this._padAnchor(pond, index);
        if (anchor) this.padAnchors.push(anchor);
      }
      if (this.mistAnchors.length < mistCap) {
        this.mistAnchors.push({
          x: pond.centerX,
          y: surface + 0.035,
          z: pond.centerZ,
          scale: Math.min(pond.radiusX, pond.radiusZ) * 0.96,
          phase: pond.phase,
        });
      }
      if (this.flyAnchors.length < flyCap) {
        const flyAngle = pond.phase
          + unitHash(pond.cellX, pond.cellZ, 0x3c6ef372) * Math.PI * 2;
        const flyDistance = Math.min(pond.radiusX, pond.radiusZ)
          * (0.08 + unitHash(pond.cellX, pond.cellZ, 0xbb67ae85) * 0.12);
        this.flyAnchors.push({
          x: pond.centerX + Math.cos(flyAngle) * flyDistance,
          y: surface + 0.36 + unitHash(pond.cellX, pond.cellZ, 0x510e527f) * 0.16,
          z: pond.centerZ + Math.sin(flyAngle) * flyDistance,
          cellX: pond.cellX,
          cellZ: pond.cellZ,
          phase: pond.phase,
        });
      }
      if (this.padAnchors.length >= padCap
        && this.mistAnchors.length >= mistCap
        && this.flyAnchors.length >= flyCap) break;
    }
    this._lastFocus.copy(focus);
    this._writeInstances(0, 1, 1);
  }

  _writeInstances(rainIntensity, dayAmount, skyExposure) {
    if (!this.ready) return;
    const motion = this.reducedMotion ? 0.28 : 1;
    this.padMesh.count = this.padAnchors.length;
    this.padMesh.visible = this.padMesh.count > 0;
    this.padAnchors.forEach((anchor, index) => {
      this._dummy.position.set(
        anchor.x,
        anchor.y + Math.sin(this._time * 1.05 + anchor.phase) * 0.012 * motion,
        anchor.z,
      );
      this._dummy.rotation.set(0, anchor.rotation + Math.sin(this._time * 0.24 + anchor.phase) * 0.018 * motion, 0);
      this._dummy.scale.setScalar(anchor.scale);
      this._dummy.updateMatrix();
      this.padMesh.setMatrixAt(index, this._dummy.matrix);
    });
    this.padMesh.instanceMatrix.needsUpdate = true;

    const mistVisibility = THREE.MathUtils.clamp((1 - rainIntensity * 1.8) * skyExposure, 0, 1);
    this.mistMesh.count = mistVisibility > 0.025 ? this.mistAnchors.length : 0;
    this.mistMesh.visible = this.mistMesh.count > 0;
    const mistUniforms=this.mistMesh.material.uniforms;
    mistUniforms.mistTime.value=this._time*motion;mistUniforms.mistDensity.value=mistVisibility;
    mistUniforms.mistDay.value=dayAmount;
    if(this.graphicsUniforms?.sunDirection)mistUniforms.mistSun.value.copy(this.graphicsUniforms.sunDirection.value);
    if(this.graphicsUniforms?.sunColor)mistUniforms.mistSunColor.value.copy(this.graphicsUniforms.sunColor.value);
    for (let index = 0; index < this.mistMesh.count; index++) {
      const anchor = this.mistAnchors[index];
      this._dummy.position.set(anchor.x, anchor.y, anchor.z);
      this._dummy.rotation.set(0, 0, 0);
      this._dummy.scale.set(anchor.scale, Math.min(1.05,Math.max(.6,anchor.scale*.16)), anchor.scale);
      this._dummy.updateMatrix();
      this.mistMesh.setMatrixAt(index, this._dummy.matrix);
    }
    this.mistMesh.instanceMatrix.needsUpdate = true;

    const flyVisibility = dayAmount > 0.42 && rainIntensity < 0.18 && skyExposure > 0.38;
    const flyLimit = this.reducedMotion ? Math.ceil(this.flyAnchors.length * 0.5) : this.flyAnchors.length;
    this.flyMesh.count = flyVisibility ? flyLimit : 0;
    const flyPosition = this.flyMesh.geometry.getAttribute('position');
    let flyPointCount = 0;
    for (let anchorIndex = 0; anchorIndex < this.flyMesh.count; anchorIndex++) {
      const anchor = this.flyAnchors[anchorIndex];
      for (let flyIndex = 0; flyIndex < FLIES_PER_SWARM; flyIndex++) {
        pondFlyOffset(anchor, flyIndex, this._time, motion, this._flyOffset);
        flyPosition.setXYZ(
          flyPointCount++,
          anchor.x + this._flyOffset.x,
          anchor.y + this._flyOffset.y,
          anchor.z + this._flyOffset.z,
        );
      }
    }
    this.flyMesh.geometry.setDrawRange(0, flyPointCount);
    this.flyMesh.userData.activePointCount = flyPointCount;
    this.flyMesh.visible = flyPointCount > 0;
    flyPosition.needsUpdate = true;
  }

  update(dt, focus, context = {}) {
    if (!this.ready || !this.world || !focus) return;
    this._time += Math.max(0, Number(dt) || 0);
    this._syncTimer -= dt;
    if (this._syncTimer <= 0 || this._lastFocus.distanceToSquared(focus) > 64) {
      this._syncTimer = 0.42;
      this._sync(focus);
    }
    this._writeInstances(
      THREE.MathUtils.clamp(Number(context.rainIntensity) || 0, 0, 1),
      THREE.MathUtils.clamp(Number(context.dayAmount) || 0, 0, 1),
      THREE.MathUtils.clamp(Number(context.skyExposure) || 0, 0, 1),
    );
  }

  getStats() {
    const triangleCount = (mesh) => {
      if (!mesh?.geometry) return 0;
      if (mesh.isPoints) return 0;
      const base = mesh.geometry.index
        ? mesh.geometry.index.count / 3
        : mesh.geometry.getAttribute('position').count / 3;
      return Math.round(base * mesh.count);
    };
    return {
      ready: this.ready,
      failed: this.failed,
      loading: Boolean(this._loadPromise),
      error: this.error ? String(this.error.message || this.error) : '',
      pads: this.padMesh?.count || 0,
      mist: this.mistMesh?.count || 0,
      flySwarms: this.flyMesh?.count || 0,
      flyDots: this.flyMesh?.userData?.activePointCount || 0,
      draws: [this.padMesh, this.mistMesh, this.flyMesh].filter((mesh) => mesh?.visible && mesh.count > 0).length,
      triangles: triangleCount(this.padMesh) + triangleCount(this.mistMesh) + triangleCount(this.flyMesh),
      assetUrl: this.assetUrl,
    };
  }

  dispose() {
    this._loadGeneration++;
    this._cancelLoad?.();
    this._cancelLoad = null;
    this._loadPromise = null;
    this._clearInstances();
    this.group?.removeFromParent?.();
    disposeEcologyMeshes([this.padMesh, this.mistMesh, this.flyMesh]);
    this.padMesh = null;
    this.mistMesh = null;
    this.flyMesh = null;
    this.world = null;
    this.ready = false;
    this.failed = false;
    this.error = null;
    this._time = 0;
    this._syncTimer = 0;
  }
}

export default PondEcologyField;
