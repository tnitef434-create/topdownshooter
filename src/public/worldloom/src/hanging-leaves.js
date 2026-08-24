import * as THREE from '../vendor/three.module.min.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';

const ASSET_URL = new URL('../assets/environment/hanging-tree-leaves.glb', import.meta.url).href;
const DEFAULT_LOAD_TIMEOUT_MS = 8_000;
const MAX_SEGMENTS = 768;
const DOWN = new THREE.Vector3(0, -1, 0);

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

export function timeCorrectedDamping(baseDamping, seconds) {
  return Math.pow(clamp(baseDamping, 0, 1), Math.max(0, Number(seconds) || 0) * 60);
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

function cloneNearestAtlas(root) {
  let atlas = null;
  root?.traverse?.((node) => {
    if (atlas || !node.isMesh) return;
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    atlas = materials.find((material) => material?.map?.isTexture)?.map || null;
  });
  if (!atlas) throw new Error('Hanging-leaf asset is missing its embedded foliage atlas');
  const texture = atlas.clone();
  texture.name = 'Runtime nearest hanging-leaf atlas';
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

function bakeSegmentGeometry(root, sceneRoot) {
  if (!root) throw new Error('Hanging-leaf asset root is missing');
  sceneRoot?.updateWorldMatrix?.(true, true);
  root.updateWorldMatrix(true, true);
  const sceneInverse = new THREE.Matrix4().copy(sceneRoot?.matrixWorld || root.matrixWorld).invert();
  const parts = [];
  root.traverse((node) => {
    if (!node.isMesh || !node.geometry?.getAttribute?.('position')) return;
    const geometry = node.geometry.clone();
    geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(sceneInverse, node.matrixWorld));
    if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
    if (!geometry.getAttribute('uv')) {
      geometry.dispose();
      throw new Error(`Hanging-leaf mesh ${node.name || 'unnamed'} is missing authored UVs`);
    }
    for (const name of Object.keys(geometry.attributes)) {
      if (!['position', 'normal', 'uv'].includes(name)) geometry.deleteAttribute(name);
    }
    parts.push(geometry);
  });
  if (!parts.length) throw new Error('Hanging-leaf asset contains no mesh geometry');
  const indexed = parts.every((geometry) => Boolean(geometry.index));
  const normalized = parts.map((geometry) => {
    if (indexed || !geometry.index) return geometry;
    const expanded = geometry.toNonIndexed();
    geometry.dispose();
    return expanded;
  });
  const merged = mergeGeometries(normalized, false);
  normalized.forEach((geometry) => geometry.dispose());
  if (!merged) throw new Error('Hanging-leaf geometry could not be merged into one draw');
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  return merged;
}

function createLeafMesh(gltf) {
  if (!gltf?.scene) throw new Error('Hanging-leaf glTF scene is missing');
  const root = gltf.scene.getObjectByName('Hanging_Leaf_Asset');
  const geometry = bakeSegmentGeometry(root, gltf.scene);
  let material = null;
  try {
    const texture = cloneNearestAtlas(root);
    material = new THREE.MeshStandardMaterial({
      name: 'Pixel hanging-leaf material',
      map: texture,
      roughness: 0.94,
      metalness: 0,
      alphaTest: 0.5,
      transparent: false,
      depthWrite: true,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, MAX_SEGMENTS);
    mesh.name = 'Interactive Blender hanging leaves';
    mesh.count = 0;
    mesh.visible = false;
    mesh.frustumCulled = false;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.userData.assetRole = 'interactive_hanging_tree_leaves';
    mesh.userData.drawBudget = 1;
    mesh.userData.authoredSegmentLength = Math.max(
      0.1,
      geometry.boundingBox.max.y - geometry.boundingBox.min.y,
    );
    return mesh;
  } catch (error) {
    geometry.dispose();
    disposeMaterials([material]);
    throw error;
  }
}

function disposeLeafMesh(mesh) {
  if (!mesh) return;
  mesh.removeFromParent?.();
  mesh.geometry?.dispose?.();
  disposeMaterials([mesh.material]);
}

/**
 * Return the horizontal displacement imparted by a player capsule to one
 * simulated chain point. Kept as a small pure helper so the interaction can be
 * regression-tested without WebGL or a loaded glTF.
 */
export function hangingLeafCollisionPush(
  point,
  playerPosition,
  playerVelocity,
  radius = 0.78,
  playerHeight = 1.78,
  target = new THREE.Vector3(),
) {
  target.set(0, 0, 0);
  if (!point || !playerPosition) return target;
  const feet = Number(playerPosition.y) || 0;
  const y = Number(point.y) || 0;
  if (y < feet + 0.08 || y > feet + Math.max(0.2, playerHeight)) return target;
  const dx = (Number(point.x) || 0) - (Number(playerPosition.x) || 0);
  const dz = (Number(point.z) || 0) - (Number(playerPosition.z) || 0);
  const safeRadius = Math.max(0.1, Number(radius) || 0.78);
  const distance = Math.hypot(dx, dz);
  if (distance >= safeRadius) return target;

  const velocityX = Number(playerVelocity?.x) || 0;
  const velocityZ = Number(playerVelocity?.z) || 0;
  const speed = Math.hypot(velocityX, velocityZ);
  let directionX = distance > 1e-5 ? dx / distance : 0;
  let directionZ = distance > 1e-5 ? dz / distance : 0;
  if (distance <= 1e-5) {
    directionX = speed > 1e-5 ? velocityX / speed : 1;
    directionZ = speed > 1e-5 ? velocityZ / speed : 0;
  }
  const penetration = 1 - distance / safeRadius;
  const forwardSpeed = Math.max(0, velocityX * directionX + velocityZ * directionZ);
  const outward = penetration * (0.07 + Math.min(8, forwardSpeed) * 0.018);
  target.set(
    directionX * outward + velocityX * penetration * 0.006,
    0,
    directionZ * outward + velocityZ * penetration * 0.006,
  );
  if (target.lengthSq() > 0.28 ** 2) target.setLength(0.28);
  return target;
}

export class HangingLeavesField {
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
    this.group.name = 'Blender hanging tree leaves';
    scene?.add?.(this.group);
    this.profile = {
      hangingLeafRadius: 48,
      hangingLeafTreeCap: 36,
      hangingLeafStrandsPerTree: 2,
      hangingLeafSegmentCap: 240,
      hangingLeafPhysicsRadius: 8,
    };
    this.reducedMotion = false;
    this.ready = false;
    this.failed = false;
    this.error = null;
    this.mesh = null;
    this.strands = [];
    this._loadPromise = null;
    this._loadGeneration = 0;
    this._cancelLoad = null;
    this._syncTimer = 0;
    this._time = 0;
    this._lastFocus = new THREE.Vector3(Number.POSITIVE_INFINITY, 0, Number.POSITIVE_INFINITY);
    this._dummy = new THREE.Object3D();
    this._direction = new THREE.Vector3();
    this._spin = new THREE.Quaternion();
    this._collisionPush = new THREE.Vector3();
    this._calculatedVelocity = new THREE.Vector3();
    this._previousFocus = new THREE.Vector3();
    this._hasPreviousFocus = false;
    this._interactionCount = 0;
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
        this.error = cause instanceof Error ? cause : new Error(String(cause || 'Unknown hanging-leaf asset error'));
        console.warn('Worldloom hanging leaves were skipped safely.', this.error);
      }
      finish();
    };
    cancelAttempt = () => finish();
    this._cancelLoad = cancelAttempt;
    timeoutId = setTimeout(() => {
      failCosmetically(new Error(`Hanging-leaf asset timed out after ${this.loadTimeoutMs}ms`));
    }, this.loadTimeoutMs);

    Promise.resolve()
      .then(() => {
        if (settled || generation !== this._loadGeneration) return null;
        const loader = this.loaderFactory();
        if (!loader?.loadAsync) throw new Error('Hanging-leaf asset loader is unavailable');
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
          mesh = createLeafMesh(gltf);
        } catch (error) {
          disposeImportedScene(gltf.scene);
          failCosmetically(error);
          return;
        }
        disposeImportedScene(gltf.scene);
        if (settled || generation !== this._loadGeneration) {
          disposeLeafMesh(mesh);
          return;
        }
        disposeLeafMesh(this.mesh);
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
    this._lastFocus.set(Number.POSITIVE_INFINITY, 0, Number.POSITIVE_INFINITY);
    this._hasPreviousFocus = false;
    if (!this.world) this._clear();
  }

  setQuality(profile = {}, reducedMotion = false) {
    this.profile = { ...this.profile, ...profile };
    this.reducedMotion = Boolean(reducedMotion);
    this._syncTimer = 0;
    if (this.mesh) this.mesh.castShadow = profile.shadows !== false;
  }

  _clear() {
    this.strands.length = 0;
    if (this.mesh) {
      this.mesh.count = 0;
      this.mesh.visible = false;
      this.mesh.instanceMatrix.needsUpdate = true;
    }
  }

  _treeStillPresent(tree) {
    if (!this.world?.isPositionReady?.(tree.rootX, tree.rootZ)) return false;
    const topTrunkY = tree.rootY + tree.trunkHeight - 1;
    return this.world.getBlock?.(tree.rootX, topTrunkY, tree.rootZ) === tree.trunkBlock;
  }

  _anchorForTree(tree, strandIndex) {
    const angle = unitHash(
      tree.rootX + strandIndex * 37,
      tree.rootZ - strandIndex * 19,
      0x9e3779b9,
    ) * Math.PI * 2;
    const baseRadius = tree.isPine ? 2.05 : 1.62;
    const radiusJitter = unitHash(tree.rootX - strandIndex * 11, tree.rootZ + strandIndex * 23, 0x85ebca6b);
    const radii = [baseRadius + radiusJitter * 0.28, baseRadius * 0.72, 0.82];
    const yCandidates = tree.isPine
      ? [tree.rootY + 3, tree.rootY + 4, tree.rootY + 2]
      : [tree.crownY - 1, tree.crownY, tree.crownY - 2];
    for (const blockY of yCandidates) {
      for (const radius of radii) {
        const x = tree.rootX + 0.5 + Math.cos(angle) * radius;
        const z = tree.rootZ + 0.5 + Math.sin(angle) * radius;
        if (this.world.getBlock?.(Math.floor(x), blockY, Math.floor(z)) !== tree.leafBlock) continue;
        return new THREE.Vector3(x, blockY + 0.015, z);
      }
    }
    return null;
  }

  _createStrand(tree, strandIndex, anchor) {
    const segmentRoll = unitHash(tree.rootX + strandIndex * 17, tree.rootZ, 0x3c6ef372);
    const segmentCount = (tree.isPine ? 2 : 3) + Math.floor(segmentRoll * 2);
    const segmentLength = 0.4 + unitHash(tree.rootX, tree.rootZ - strandIndex * 13, 0x510e527f) * 0.1;
    const key = `${tree.id}:${strandIndex}:${segmentCount}`;
    const points = [anchor.clone()];
    const previous = [anchor.clone()];
    for (let index = 1; index <= segmentCount; index++) {
      const point = anchor.clone().add(new THREE.Vector3(0, -segmentLength * index, 0));
      points.push(point);
      previous.push(point.clone());
    }
    return {
      key,
      treeId: tree.id,
      isPine: tree.isPine,
      anchorBlockX: Math.floor(anchor.x),
      anchorBlockY: Math.floor(anchor.y),
      anchorBlockZ: Math.floor(anchor.z),
      leafBlock: tree.leafBlock,
      trunkX: tree.rootX,
      trunkY: tree.rootY + tree.trunkHeight - 1,
      trunkZ: tree.rootZ,
      trunkBlock: tree.trunkBlock,
      anchor,
      points,
      previous,
      segmentCount,
      segmentLength,
      phase: unitHash(tree.rootX, tree.rootZ + strandIndex * 29, 0x243f6a88) * Math.PI * 2,
      twist: unitHash(tree.rootX - strandIndex * 31, tree.rootZ, 0xb7e15162) * Math.PI * 2,
      width: 0.84 + unitHash(tree.rootX, tree.rootZ, strandIndex ^ 0xa511e9b3) * 0.28,
    };
  }

  _strandStillAttached(strand) {
    if (!this.world?.isPositionReady?.(strand.anchorBlockX, strand.anchorBlockZ)
      || !this.world?.isPositionReady?.(strand.trunkX, strand.trunkZ)) return false;
    return this.world.getBlock?.(strand.anchorBlockX, strand.anchorBlockY, strand.anchorBlockZ) === strand.leafBlock
      && this.world.getBlock?.(strand.trunkX, strand.trunkY, strand.trunkZ) === strand.trunkBlock;
  }

  _pruneDetachedStrands() {
    if (!this.strands.length) return false;
    const attached = this.strands.filter((strand) => this._strandStillAttached(strand));
    if (attached.length === this.strands.length) return false;
    this.strands = attached;
    this._syncTimer = 0;
    return true;
  }

  _sync(focus) {
    if (!this.ready || !this.world || !focus) return false;
    const radius = clamp(this.profile.hangingLeafRadius, 0, 128);
    const treeCap = Math.max(0, Math.floor(this.profile.hangingLeafTreeCap || 0));
    const strandsPerTree = Math.max(0, Math.floor(this.profile.hangingLeafStrandsPerTree || 0));
    const segmentCap = Math.min(MAX_SEGMENTS, Math.max(0, Math.floor(this.profile.hangingLeafSegmentCap || 0)));
    const previousByKey = new Map(this.strands.map((strand) => [strand.key, strand]));
    const next = [];
    const trees = (this.world.getTreesNear?.(focus.x, focus.z, radius) || [])
      .filter((tree) => tree.hasHangingLeaves && this._treeStillPresent(tree))
      .slice(0, treeCap);
    let segments = 0;
    outer: for (const tree of trees) {
      for (let strandIndex = 0; strandIndex < strandsPerTree; strandIndex++) {
        const anchor = this._anchorForTree(tree, strandIndex);
        if (!anchor) continue;
        const fresh = this._createStrand(tree, strandIndex, anchor);
        if (segments + fresh.segmentCount > segmentCap) break outer;
        const strand = previousByKey.get(fresh.key) || fresh;
        strand.anchorBlockX = fresh.anchorBlockX;
        strand.anchorBlockY = fresh.anchorBlockY;
        strand.anchorBlockZ = fresh.anchorBlockZ;
        strand.leafBlock = fresh.leafBlock;
        strand.trunkX = fresh.trunkX;
        strand.trunkY = fresh.trunkY;
        strand.trunkZ = fresh.trunkZ;
        strand.trunkBlock = fresh.trunkBlock;
        strand.anchor.copy(anchor);
        strand.points[0].copy(anchor);
        strand.previous[0].copy(anchor);
        next.push(strand);
        segments += strand.segmentCount;
      }
    }
    this.strands = next;
    this._lastFocus.copy(focus);
    return true;
  }

  _resolvePlayerVelocity(dt, focus, suppliedVelocity) {
    if (suppliedVelocity && Number.isFinite(suppliedVelocity.x) && Number.isFinite(suppliedVelocity.z)) {
      this._calculatedVelocity.set(suppliedVelocity.x, Number(suppliedVelocity.y) || 0, suppliedVelocity.z);
    } else if (this._hasPreviousFocus && dt > 1e-5) {
      this._calculatedVelocity.copy(focus).sub(this._previousFocus).multiplyScalar(1 / dt);
      if (this._calculatedVelocity.lengthSq() > 12 ** 2) this._calculatedVelocity.setLength(12);
    } else {
      this._calculatedVelocity.set(0, 0, 0);
    }
    this._previousFocus.copy(focus);
    this._hasPreviousFocus = true;
    return this._calculatedVelocity;
  }

  _simulate(dt, focus, suppliedVelocity) {
    const elapsed = clamp(dt, 0, 0.05);
    if (elapsed <= 0 || !this.strands.length) return;
    const velocity = this._resolvePlayerVelocity(elapsed, focus, suppliedVelocity);
    const substeps = Math.max(1, Math.min(3, Math.ceil(elapsed / 0.018)));
    const step = elapsed / substeps;
    const physicsRadius = Math.max(2, Number(this.profile.hangingLeafPhysicsRadius) || 8);
    const physicsRadiusSq = physicsRadius * physicsRadius;
    const motion = this.reducedMotion ? 0.24 : 1;
    // Treat the authored damping values as a 60 Hz baseline. Exponential time
    // correction keeps the same decay at 30, 60 and high-refresh frame rates.
    const damping = timeCorrectedDamping(this.reducedMotion ? 0.78 : 0.88, step);
    this._interactionCount = 0;

    for (let substep = 0; substep < substeps; substep++) {
      for (const strand of this.strands) {
        strand.points[0].copy(strand.anchor);
        strand.previous[0].copy(strand.anchor);
        const nearPlayer = (
          (strand.anchor.x - focus.x) ** 2 + (strand.anchor.z - focus.z) ** 2
        ) <= physicsRadiusSq;
        for (let index = 1; index < strand.points.length; index++) {
          const point = strand.points[index];
          const previous = strand.previous[index];
          this._direction.copy(point).sub(previous).multiplyScalar(damping);
          previous.copy(point);
          point.add(this._direction);
          const heightWeight = index / strand.segmentCount;
          const wind = Math.sin(this._time * 1.75 + strand.phase + index * 0.57)
            + Math.sin(this._time * 0.81 + strand.phase * 0.7) * 0.42;
          point.x += wind * (0.42 + heightWeight * 0.36) * motion * step * step;
          point.z += Math.cos(this._time * 1.33 + strand.phase + index) * 0.34 * motion * step * step;
          point.y -= 4.2 * step * step;
          point.x += (strand.anchor.x - point.x) * 0.45 * step * step;
          point.z += (strand.anchor.z - point.z) * 0.45 * step * step;
          if (nearPlayer) {
            hangingLeafCollisionPush(point, focus, velocity, 0.82, 1.82, this._collisionPush);
            if (this._collisionPush.lengthSq() > 1e-7) {
              point.addScaledVector(this._collisionPush, Math.min(1, step * 60));
              this._interactionCount++;
            }
          }
        }

        // A short position-based chain solve keeps every segment connected while
        // leaving the lower points free to swing after a player brushes through.
        for (let pass = 0; pass < 3; pass++) {
          strand.points[0].copy(strand.anchor);
          for (let index = 1; index < strand.points.length; index++) {
            const parent = strand.points[index - 1];
            const point = strand.points[index];
            this._direction.copy(point).sub(parent);
            if (this._direction.lengthSq() < 1e-8) this._direction.set(0, -1, 0);
            this._direction.setLength(strand.segmentLength);
            point.copy(parent).add(this._direction);
          }
        }
      }
    }
  }

  _writeInstances() {
    if (!this.mesh) return;
    let instance = 0;
    for (const strand of this.strands) {
      for (let index = 0; index < strand.segmentCount && instance < MAX_SEGMENTS; index++) {
        const start = strand.points[index];
        const end = strand.points[index + 1];
        this._direction.copy(end).sub(start);
        const length = this._direction.length();
        if (length < 1e-5) continue;
        this._direction.multiplyScalar(1 / length);
        this._dummy.position.copy(start);
        this._dummy.quaternion.setFromUnitVectors(DOWN, this._direction);
        this._spin.setFromAxisAngle(DOWN, strand.twist + index * 1.37);
        this._dummy.quaternion.multiply(this._spin);
        const taper = 1 - index / Math.max(6, strand.segmentCount * 2.8);
        this._dummy.scale.set(
          strand.width * taper,
          length / Math.max(0.1, this.mesh.userData.authoredSegmentLength || 1),
          strand.width * taper,
        );
        this._dummy.updateMatrix();
        this.mesh.setMatrixAt(instance++, this._dummy.matrix);
      }
    }
    this.mesh.count = instance;
    this.mesh.visible = instance > 0;
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  update(dt, focus, context = {}) {
    if (!this.ready || !this.world || !focus) return;
    const elapsed = Math.max(0, Number(dt) || 0);
    this._time += elapsed;
    const pruned = this._pruneDetachedStrands();
    this._syncTimer -= elapsed;
    let synced = pruned;
    if (this._syncTimer <= 0 || this._lastFocus.distanceToSquared(focus) > 36) {
      this._syncTimer = 0.5;
      synced = this._sync(focus);
    }
    if (elapsed > 0) this._simulate(elapsed, focus, context.playerVelocity);
    if (synced || elapsed > 0) this._writeInstances();
  }

  getStats() {
    const geometry = this.mesh?.geometry;
    const baseTriangles = geometry
      ? (geometry.index ? geometry.index.count : geometry.getAttribute('position')?.count || 0) / 3
      : 0;
    return {
      ready: this.ready,
      failed: this.failed,
      loading: Boolean(this._loadPromise),
      error: this.error ? String(this.error.message || this.error) : '',
      trees: new Set(this.strands.map((strand) => strand.treeId)).size,
      strands: this.strands.length,
      segments: this.mesh?.count || 0,
      interactions: this._interactionCount,
      draws: this.mesh?.visible && this.mesh.count > 0 ? 1 : 0,
      triangles: Math.round(baseTriangles * (this.mesh?.count || 0)),
      assetUrl: this.assetUrl,
    };
  }

  dispose() {
    this._loadGeneration++;
    this._cancelLoad?.();
    this._cancelLoad = null;
    this._loadPromise = null;
    this._clear();
    this.group.removeFromParent?.();
    disposeLeafMesh(this.mesh);
    this.mesh = null;
    this.world = null;
    this.ready = false;
    this.failed = false;
    this.error = null;
    this._time = 0;
    this._syncTimer = 0;
  }
}

export default HangingLeavesField;
