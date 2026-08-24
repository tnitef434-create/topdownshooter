import * as THREE from '../vendor/three.module.min.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';

const ASSET_URL = new URL('../assets/environment/pond-details.glb', import.meta.url).href;
const DEFAULT_LOAD_TIMEOUT_MS = 8_000;
const MAX_PADS = 144;
const MAX_MIST = 72;
const MAX_SWARMS = 24;

function unitHash(x, z, salt = 0) {
  let value = Math.imul(Math.floor(x) ^ salt, 0x27d4eb2d)
    ^ Math.imul(Math.floor(z) ^ (salt >>> 1), 0x165667b1);
  value ^= value >>> 15;
  value = Math.imul(value, 0x85ebca6b);
  value ^= value >>> 13;
  return (value >>> 0) / 4294967296;
}

function coloredGeometry(node, rootInverse) {
  const geometry = node.geometry.clone();
  const transform = new THREE.Matrix4().multiplyMatrices(rootInverse, node.matrixWorld);
  geometry.applyMatrix4(transform);
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
  for (const name of Object.keys(geometry.attributes)) {
    if (!['position', 'normal'].includes(name)) geometry.deleteAttribute(name);
  }
  const count = geometry.getAttribute('position').count;
  const color = node.material?.color?.isColor ? node.material.color : new THREE.Color(0xffffff);
  const colors = new Float32Array(count * 3);
  for (let index = 0; index < count; index++) {
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function bakeAssetGeometry(root, sceneRoot = root) {
  if (!root) throw new Error('Pond detail asset root is missing');
  sceneRoot?.updateWorldMatrix?.(true, true);
  root.updateWorldMatrix(true, true);
  // Bake in glTF scene space. Inverting the named asset root itself also
  // cancelled the authored pack transform, so generator --scale had no effect.
  const sceneInverse = new THREE.Matrix4().copy(sceneRoot?.matrixWorld || root.matrixWorld).invert();
  const parts = [];
  root.traverse((node) => {
    if (node.isMesh && node.geometry?.getAttribute?.('position')) {
      parts.push(coloredGeometry(node, sceneInverse));
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

function disposeImportedScene(scene) {
  const materials = new Set();
  const textures = new Set();
  scene?.traverse?.((node) => {
    node.geometry?.dispose?.();
    const entries = Array.isArray(node.material) ? node.material : [node.material];
    entries.filter(Boolean).forEach((material) => materials.add(material));
  });
  materials.forEach((material) => {
    Object.values(material).forEach((value) => {
      if (value?.isTexture) textures.add(value);
    });
    material.dispose?.();
  });
  textures.forEach((texture) => texture.dispose?.());
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

function disposeEcologyMeshes(meshes) {
  for (const mesh of meshes) {
    mesh?.removeFromParent?.();
    mesh?.geometry?.dispose?.();
    mesh?.material?.dispose?.();
  }
}

function createEcologyMeshes(gltf) {
  if (!gltf?.scene) throw new Error('Pond detail glTF scene is missing');
  const geometries = [];
  const materials = [];
  try {
    const lilyRoot = gltf.scene.getObjectByName('Lily_Pad_Asset');
    const mistRoot = gltf.scene.getObjectByName('Mist_Wisp_Asset');
    const flyRoot = gltf.scene.getObjectByName('Fly_Swarm_Asset');
    const lilyGeometry = bakeAssetGeometry(lilyRoot, gltf.scene);
    geometries.push(lilyGeometry);
    const mistGeometry = bakeAssetGeometry(mistRoot, gltf.scene);
    geometries.push(mistGeometry);
    const flyGeometry = bakeAssetGeometry(flyRoot, gltf.scene);
    geometries.push(flyGeometry);

    const lilyMaterial = new THREE.MeshStandardMaterial({
      name: 'Blender lily pad material',
      vertexColors: true,
      roughness: 0.92,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    materials.push(lilyMaterial);
    const mistMaterial = new THREE.MeshBasicMaterial({
      name: 'Blender pond mist material',
      vertexColors: true,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
      fog: true,
      toneMapped: true,
    });
    materials.push(mistMaterial);
    const flyMaterial = new THREE.MeshStandardMaterial({
      name: 'Blender pond fly material',
      vertexColors: true,
      roughness: 0.82,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    materials.push(flyMaterial);

    return {
      padMesh: createInstancedMesh(lilyGeometry, lilyMaterial, MAX_PADS, 'Blender lily pads', 3),
      mistMesh: createInstancedMesh(mistGeometry, mistMaterial, MAX_MIST, 'Blender pond mist', 4),
      flyMesh: createInstancedMesh(flyGeometry, flyMaterial, MAX_SWARMS, 'Blender pond flies', 5),
    };
  } catch (error) {
    geometries.forEach((geometry) => geometry.dispose?.());
    materials.forEach((material) => material.dispose?.());
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
          meshes = createEcologyMeshes(gltf);
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
        this.group.add(this.padMesh, this.mistMesh, this.flyMesh);
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
      mesh.instanceMatrix.needsUpdate = true;
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
    const flyCap = Math.min(MAX_SWARMS, Math.max(0, Math.floor(this.profile.pondFlyCap || 0)));
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
          scale: Math.min(pond.radiusX, pond.radiusZ) * 0.56,
          phase: pond.phase,
        });
      }
      if (this.flyAnchors.length < flyCap) {
        this.flyAnchors.push({
          x: pond.centerX,
          y: surface + 0.88,
          z: pond.centerZ,
          scale: 0.82 + unitHash(pond.cellX, pond.cellZ, 0x9e3779b9) * 0.36,
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
    this.mistMesh.material.opacity = (0.055 + (1 - dayAmount) * 0.075) * mistVisibility;
    for (let index = 0; index < this.mistMesh.count; index++) {
      const anchor = this.mistAnchors[index];
      const drift = this._time * 0.075 * motion + anchor.phase;
      this._dummy.position.set(anchor.x, anchor.y, anchor.z);
      this._dummy.rotation.set(0, drift, 0);
      this._dummy.scale.set(anchor.scale, anchor.scale * 0.42, anchor.scale);
      this._dummy.updateMatrix();
      this.mistMesh.setMatrixAt(index, this._dummy.matrix);
    }
    this.mistMesh.instanceMatrix.needsUpdate = true;

    const flyVisibility = dayAmount > 0.42 && rainIntensity < 0.18 && skyExposure > 0.38;
    const flyLimit = this.reducedMotion ? Math.ceil(this.flyAnchors.length * 0.5) : this.flyAnchors.length;
    this.flyMesh.count = flyVisibility ? flyLimit : 0;
    this.flyMesh.visible = this.flyMesh.count > 0;
    for (let index = 0; index < this.flyMesh.count; index++) {
      const anchor = this.flyAnchors[index];
      const orbit = this._time * 0.54 * motion + anchor.phase;
      this._dummy.position.set(
        anchor.x + Math.cos(orbit) * 0.24 * motion,
        anchor.y + Math.sin(orbit * 1.9) * 0.12 * motion,
        anchor.z + Math.sin(orbit) * 0.2 * motion,
      );
      this._dummy.rotation.set(0, orbit + Math.PI * 0.5, 0);
      this._dummy.scale.setScalar(anchor.scale);
      this._dummy.updateMatrix();
      this.flyMesh.setMatrixAt(index, this._dummy.matrix);
    }
    this.flyMesh.instanceMatrix.needsUpdate = true;
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
