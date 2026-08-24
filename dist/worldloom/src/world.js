import * as THREE from '../vendor/three.module.min.js';
import { BLOCK, BLOCKS, isSolid, isTransparent, isLiquid } from './blocks.js';
import {
  hash2D,
  hash3D,
  valueNoise2D,
  valueNoise3D,
  fbm2D,
  ridgedFbm2D,
  domainWarp2D,
  smoothRange,
  normalizeSeed,
} from './noise.js';
import { createChunkGeometryJob } from './mesher.js';

export const CHUNK_SIZE = 16;
// Horizontal coordinates are intentionally not bounded: chunks stream around the
// player for as long as they travel. The taller vertical range gives macro terrain
// enough headroom for genuine mountain silhouettes without increasing chunk width.
export const WORLD_HEIGHT = 96;
export const SEA_LEVEL = 32;

const CHUNK_VOLUME = CHUNK_SIZE * CHUNK_SIZE * WORLD_HEIGHT;
const COLUMN_CACHE_LIMIT = 32_768;
const TREE_CELL_SIZE = 5;
const PLANT_CELL_SIZE = 3;
const CACTUS_CELL_SIZE = 7;
const CAVE_CELL_SIZE = 34;
const FISSURE_CELL_SIZE = 78;
const CAVE_NODE_CACHE_LIMIT = 4_096;
// Keep a modest amount of generated voxel data after a chunk leaves the view
// radius. Walking back across a recently visited boundary then only needs a new
// GPU mesh instead of repeating terrain, cave and decoration generation. At the
// tallest view distance this is still only a few megabytes of Uint8Array data.
const DORMANT_CHUNK_CACHE_LIMIT = 96;
const MAX_FLUID_LEVEL = 7;
const MAX_FLUID_QUEUE = 32_768;
const FLUID_DIRECTIONS = Object.freeze([
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
]);

function normalizeName(value) {
  return String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function resolveBlock(names, fallback = 0) {
  for (const name of names) {
    if (Number.isInteger(BLOCK?.[name])) return BLOCK[name];
    const wanted = normalizeName(name);
    for (const [key, value] of Object.entries(BLOCK ?? {})) {
      if (normalizeName(key) === wanted && Number.isInteger(value)) return value;
    }
  }
  const definitions = Array.isArray(BLOCKS) ? BLOCKS : Object.values(BLOCKS ?? {});
  for (const definition of definitions) {
    if (!definition || !Number.isInteger(definition.id)) continue;
    const key = normalizeName(definition.key ?? definition.name ?? definition.label);
    if (names.some((name) => normalizeName(name) === key)) return definition.id;
  }
  return fallback;
}

const AIR = resolveBlock(['AIR'], 0);
const STONE = resolveBlock(['STONE'], AIR);
const DIRT = resolveBlock(['LOAM', 'DIRT', 'SOIL'], STONE);
const GRASS = resolveBlock(['GRASS', 'GRASS_BLOCK', 'TURF'], DIRT);
const SAND = resolveBlock(['SAND'], DIRT);
const WATER = resolveBlock(['WATER'], AIR);
const BEDROCK = resolveBlock(['BEDROCK'], STONE);
const LOG = resolveBlock(['ASH_LOG', 'LOG', 'WOOD', 'OAK_LOG', 'TRUNK'], STONE);
const LEAVES = resolveBlock(['ASH_LEAVES', 'LEAVES', 'LEAF', 'OAK_LEAVES'], GRASS);
const COAL_ORE = resolveBlock(['COALSTONE', 'COAL_ORE', 'COAL'], STONE);
const IRON_ORE = resolveBlock(['COPPER_ORE', 'IRON_ORE', 'IRON'], STONE);
const LUMEN_CRYSTAL = resolveBlock(['LUMEN_CRYSTAL'], STONE);
const BASALT = resolveBlock(['BASALT'], STONE);
const LAVA = resolveBlock(['LAVA'], AIR);
const FERN = resolveBlock(['FERN'], AIR);
const WILDFLOWER = resolveBlock(['WILDFLOWER'], AIR);
const CACTUS = resolveBlock(['CACTUS'], AIR);
const CAVE_MUSHROOM = resolveBlock(['CAVE_MUSHROOM', 'GLOW_MUSHROOM'], AIR);
const PINE_LOG = resolveBlock(['PINE_LOG'], LOG);
const PINE_NEEDLES = resolveBlock(['PINE_NEEDLES'], LEAVES);
const SHORT_GRASS = resolveBlock(['SHORT_GRASS'], AIR);

function floorDiv(value, divisor) {
  return Math.floor(value / divisor);
}

function localCoordinate(value, chunkCoordinate) {
  return value - chunkCoordinate * CHUNK_SIZE;
}

function localIndex(x, y, z) {
  return x + CHUNK_SIZE * (z + CHUNK_SIZE * y);
}

function chunkKey(cx, cz) {
  return `${cx},${cz}`;
}

function parseChunkKey(key) {
  const [cx, cz] = String(key).split(',').map(Number);
  return { cx, cz };
}

function voxelKey(x, y, z) {
  return `${x},${y},${z}`;
}

function parseVoxelKey(key) {
  const [x, y, z] = String(key).split(',').map(Number);
  return { x, y, z };
}

function decodeLocalIndex(index) {
  const y = Math.floor(index / (CHUNK_SIZE * CHUNK_SIZE));
  const withinLayer = index - y * CHUNK_SIZE * CHUNK_SIZE;
  const z = Math.floor(withinLayer / CHUNK_SIZE);
  const x = withinLayer - z * CHUNK_SIZE;
  return { x, y, z };
}

function pointSegment2D(px, pz, ax, az, bx, bz) {
  const abx = bx - ax;
  const abz = bz - az;
  const lengthSq = abx * abx + abz * abz;
  const t = lengthSq > 0
    ? THREE.MathUtils.clamp(((px - ax) * abx + (pz - az) * abz) / lengthSq, 0, 1)
    : 0;
  const closestX = ax + abx * t;
  const closestZ = az + abz * t;
  return { distance: Math.hypot(px - closestX, pz - closestZ), t };
}

function hashUnit(value) {
  if (!Number.isFinite(value)) return 0;
  if (value >= 0 && value <= 1) return value;
  const fractional = value - Math.floor(value);
  return fractional < 0 ? fractional + 1 : fractional;
}

function clampNoise(value) {
  // noise.js deliberately exposes normalized [0, 1] values. Terrain shaping is
  // clearer around a signed zero, so every coherent-noise sample crosses this
  // conversion boundary exactly once.
  return THREE.MathUtils.clamp(Number.isFinite(value) ? value * 2 - 1 : 0, -1, 1);
}

function trimCache(cache, limit) {
  if (cache.size < limit) return;
  const removeCount = Math.max(1, Math.floor(limit / 8));
  const keys = cache.keys();
  for (let index = 0; index < removeCount; index++) {
    const next = keys.next();
    if (next.done) break;
    cache.delete(next.value);
  }
}

function textureFromAtlas(atlas) {
  return atlas?.texture ?? atlas?.map ?? atlas ?? null;
}

function normalMapFromAtlas(atlas) {
  const source = atlas?.canvas ?? atlas?.texture?.image;
  if (!source?.width || !source?.height || typeof document === 'undefined') return null;
  try {
    const sourceContext = source.getContext?.('2d', { willReadFrequently: true });
    if (!sourceContext) return null;
    const width = source.width;
    const height = source.height;
    const tileSize = Math.max(1, Number(atlas?.tileSize || atlas?.texture?.userData?.tileSize) || 32);
    const sourcePixels = sourceContext.getImageData(0, 0, width, height);
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = width;
    outputCanvas.height = height;
    const outputContext = outputCanvas.getContext('2d');
    const outputPixels = outputContext.createImageData(width, height);
    const luminanceAt = (x, y) => {
      const offset = (y * width + x) * 4;
      const alpha = sourcePixels.data[offset + 3] / 255;
      return (sourcePixels.data[offset] * 0.2126
        + sourcePixels.data[offset + 1] * 0.7152
        + sourcePixels.data[offset + 2] * 0.0722) / 255 * alpha;
    };
    for (let y = 0; y < height; y++) {
      const tileTop = Math.floor(y / tileSize) * tileSize;
      const up = Math.max(tileTop, y - 1);
      const down = Math.min(tileTop + tileSize - 1, y + 1);
      for (let x = 0; x < width; x++) {
        const tileLeft = Math.floor(x / tileSize) * tileSize;
        const left = Math.max(tileLeft, x - 1);
        const right = Math.min(tileLeft + tileSize - 1, x + 1);
        const gradientX = (luminanceAt(right, y) - luminanceAt(left, y)) * 1.45;
        const gradientY = (luminanceAt(x, down) - luminanceAt(x, up)) * 1.45;
        const invLength = 1 / Math.hypot(gradientX, gradientY, 1);
        const offset = (y * width + x) * 4;
        outputPixels.data[offset] = Math.round((-gradientX * invLength * 0.5 + 0.5) * 255);
        outputPixels.data[offset + 1] = Math.round((gradientY * invLength * 0.5 + 0.5) * 255);
        outputPixels.data[offset + 2] = Math.round(invLength * 255);
        outputPixels.data[offset + 3] = 255;
      }
    }
    outputContext.putImageData(outputPixels, 0, 0);
    const normalMap = new THREE.CanvasTexture(outputCanvas);
    normalMap.name = 'Worldloom derived material normals';
    normalMap.wrapS = THREE.ClampToEdgeWrapping;
    normalMap.wrapT = THREE.ClampToEdgeWrapping;
    normalMap.magFilter = THREE.NearestFilter;
    normalMap.minFilter = THREE.NearestFilter;
    normalMap.generateMipmaps = false;
    normalMap.needsUpdate = true;
    return normalMap;
  } catch (error) {
    console.warn('Worldloom normal-map fallback:', error);
    return null;
  }
}

function createChunk(cx, cz) {
  const blocks = new Uint8Array(CHUNK_VOLUME);
  return {
    cx,
    cz,
    key: chunkKey(cx, cz),
    size: CHUNK_SIZE,
    height: WORLD_HEIGHT,
    blocks,
    data: blocks,
    generated: false,
    generationCursor: 0,
    generationPhase: 'base',
    dirty: true,
    meshDirty: true,
    revision: 0,
    opaqueMesh: null,
    glassMesh: null,
    waterMesh: null,
    glowMesh: null,
    meshJob: null,
    meshJobRevision: -1,
    faces: 0,
    triangles: 0,
    lastTouched: 0,
    wanted: true,
  };
}

export class World {
  constructor(seed, scene, atlas) {
    this.seed = normalizeSeed(seed ?? Date.now());
    this.scene = scene ?? null;
    this.atlas = atlas ?? null;
    this.chunkSize = CHUNK_SIZE;
    this.worldHeight = WORLD_HEIGHT;
    this.seaLevel = SEA_LEVEL;
    this.chunks = new Map();
    this.dormantChunks = new Map();
    // Map<"cx,cz", Map<localIndex, blockId>>. It remains valid after chunks unload.
    this.edits = new Map();
    this.generationQueue = [];
    this.queuedChunks = new Set();
    // The closest thirteen warmup chunks complete synchronously behind the
    // loading overlay. Main then finishes the outer support ring incrementally
    // so all nine chunks around spawn can be meshed without a visible void;
    // every later travel chunk also uses incremental slices.
    this._preloadChunksRemaining = 13;
    this.centerChunk = { cx: 0, cz: 0 };
    this.renderDistance = 5;
    this._streamTick = 0;
    this._columnCache = new Map();
    this._caveNodeCache = new Map();
    // Only player-created and simulated water needs metadata. Natural sea and
    // river blocks are implicit level-zero sources supplied by world generation.
    this.fluidLevels = new Map();
    this.fluidQueue = [];
    this.fluidQueueHead = 0;
    this.fluidQueued = new Set();
    this._noiseSeeds = {
      continent: (this.seed ^ 0x29a9f31d) >>> 0,
      detail: (this.seed ^ 0x7f4a7c15) >>> 0,
      ridge: (this.seed ^ 0x68bc21eb) >>> 0,
      warp: (this.seed ^ 0xe4b17a91) >>> 0,
      erosion: (this.seed ^ 0xb5297a4d) >>> 0,
      river: (this.seed ^ 0x1b56c4e9) >>> 0,
      temperature: (this.seed ^ 0x165667b1) >>> 0,
      moisture: (this.seed ^ 0x9e3779b9) >>> 0,
      cave: (this.seed ^ 0x51ed270b) >>> 0,
      caveDetail: (this.seed ^ 0x94d049bb) >>> 0,
      caveRoutes: (this.seed ^ 0x36d4c6ad) >>> 0,
      caveDepth: (this.seed ^ 0x8da6b343) >>> 0,
      caveEntrance: (this.seed ^ 0xa511e9b3) >>> 0,
      caveNodes: (this.seed ^ 0x71374491) >>> 0,
      caveEdges: (this.seed ^ 0xb5c0fbcf) >>> 0,
      caveChambers: (this.seed ^ 0xe9b5dba5) >>> 0,
      caveFissures: (this.seed ^ 0x3956c25b) >>> 0,
      ore: (this.seed ^ 0x27d4eb2f) >>> 0,
      trees: (this.seed ^ 0x85ebca6b) >>> 0,
      plants: (this.seed ^ 0x4b1d3f27) >>> 0,
      grassPatches: (this.seed ^ 0x6d703ef3) >>> 0,
      cavePools: (this.seed ^ 0x93c467e3) >>> 0,
    };

    const texture = textureFromAtlas(atlas);
    if (texture?.isTexture) {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestMipmapLinearFilter;
      texture.generateMipmaps = true;
      if ('colorSpace' in texture && THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
    this.detailNormalMap = normalMapFromAtlas(atlas);
    this.opaqueMaterial = new THREE.MeshStandardMaterial({
      map: texture?.isTexture ? texture : null,
      normalMap: this.detailNormalMap,
      normalScale: new THREE.Vector2(0.38, 0.38),
      vertexColors: true,
      roughness: 0.88,
      metalness: 0.015,
      alphaTest: 0.18,
      transparent: false,
      side: THREE.FrontSide,
    });
    this.opaqueMaterial.name = 'World terrain';
    this.glassMaterial = new THREE.MeshStandardMaterial({
      map: texture?.isTexture ? texture : null,
      normalMap: this.detailNormalMap,
      normalScale: new THREE.Vector2(0.22, 0.22),
      vertexColors: true,
      roughness: 0.28,
      metalness: 0.025,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
      alphaTest: 0.015,
      side: THREE.DoubleSide,
    });
    this.glassMaterial.name = 'World glass';
    this.waterMaterial = new THREE.MeshStandardMaterial({
      map: texture?.isTexture ? texture : null,
      normalMap: this.detailNormalMap,
      normalScale: new THREE.Vector2(0.3, 0.3),
      vertexColors: true,
      color: 0xa9d7f5,
      roughness: 0.16,
      metalness: 0.035,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
      alphaTest: 0.02,
      side: THREE.DoubleSide,
    });
    this.waterMaterial.name = 'World water';
    this.glowMaterial = new THREE.MeshBasicMaterial({
      map: texture?.isTexture ? texture : null,
      vertexColors: true,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
      alphaTest: 0.06,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    this.glowMaterial.name = 'World emissive details';

    this.stats = {
      loaded: 0,
      generated: 0,
      queued: 0,
      dirty: 0,
      faces: 0,
      triangles: 0,
      edits: 0,
      flowingWater: 0,
      fluidQueue: 0,
      generatedTotal: 0,
      rebuiltTotal: 0,
    };
    this._refreshStats();
  }

  _caveNode(cellX, cellZ) {
    const key = `${cellX},${cellZ}`;
    const cached = this._caveNodeCache.get(key);
    if (cached) return cached;
    const sample = (salt) => hashUnit(hash2D(cellX, cellZ, this._noiseSeeds.caveNodes ^ salt));
    const node = {
      x: (cellX + 0.14 + sample(0x243f6a88) * 0.72) * CAVE_CELL_SIZE,
      z: (cellZ + 0.14 + sample(0x85a308d3) * 0.72) * CAVE_CELL_SIZE,
      y: 7 + sample(0x13198a2e) * 27,
      radius: 1.65 + sample(0x03707344) * 2.05,
      verticalScale: 0.72 + sample(0xa4093822) * 0.78,
      chamber: sample(0x299f31d0) > 0.69,
      chamberX: 4.1 + sample(0x082efa98) * 5.2,
      chamberZ: 3.8 + sample(0xec4e6c89) * 5.5,
      chamberY: 2.8 + sample(0x452821e6) * 4.4,
      chamberAngle: sample(0x38d01377) * Math.PI,
      entrance: sample(0xbe5466cf) > 0.855,
      entranceAngle: sample(0x34e90c6c) * Math.PI * 2,
      entranceLength: 10 + sample(0xc0ac29b7) * 15,
      entranceRadius: 1.85 + sample(0xc97c50dd) * 1.55,
    };
    trimCache(this._caveNodeCache, CAVE_NODE_CACHE_LIMIT);
    this._caveNodeCache.set(key, node);
    return node;
  }

  _caveEdgeEnabled(cellX, cellZ, direction) {
    const roll = hashUnit(hash2D(
      cellX * 3 + direction,
      cellZ * 3 - direction,
      this._noiseSeeds.caveEdges ^ Math.imul(direction + 1, 0x9e3779b9),
    ));
    return roll > (direction === 2 ? 0.84 : 0.34);
  }

  _caveSegmentCandidate(x, z, start, end, segmentIndex, cellX, cellZ) {
    const dx = end.x - start.x;
    const dz = end.z - start.z;
    const length = Math.max(1, Math.hypot(dx, dz));
    const perpendicularX = -dz / length;
    const perpendicularZ = dx / length;
    const curveRoll = hashUnit(hash2D(
      cellX * 5 + segmentIndex,
      cellZ * 5 - segmentIndex,
      this._noiseSeeds.caveEdges ^ 0x3c6ef372,
    ));
    const verticalRoll = hashUnit(hash2D(
      cellX * 7 - segmentIndex,
      cellZ * 7 + segmentIndex,
      this._noiseSeeds.caveDepth ^ 0xbb67ae85,
    ));
    const bend = (curveRoll * 2 - 1) * Math.min(8.5, length * 0.24);
    const midpoint = {
      x: (start.x + end.x) * 0.5 + perpendicularX * bend,
      z: (start.z + end.z) * 0.5 + perpendicularZ * bend,
      y: (start.y + end.y) * 0.5 + (verticalRoll * 2 - 1) * 5.5,
      radius: (start.radius + end.radius) * 0.5 * (0.86 + curveRoll * 0.3),
      verticalScale: (start.verticalScale + end.verticalScale) * 0.5,
    };
    const halves = [
      [start, midpoint, 0, 0.5],
      [midpoint, end, 0.5, 1],
    ];
    let best = null;
    for (const [a, b, t0, t1] of halves) {
      const closest = pointSegment2D(x, z, a.x, a.z, b.x, b.z);
      const t = THREE.MathUtils.lerp(t0, t1, closest.t);
      const radius = THREE.MathUtils.lerp(a.radius, b.radius, closest.t)
        * (0.92 + Math.sin(t * Math.PI) * 0.18);
      if (closest.distance > radius + 1.4) continue;
      const candidate = {
        distance: closest.distance,
        centerY: THREE.MathUtils.lerp(a.y, b.y, closest.t),
        radius,
        verticalRadius: radius * THREE.MathUtils.lerp(a.verticalScale, b.verticalScale, closest.t),
      };
      if (!best || candidate.distance / candidate.radius < best.distance / best.radius) best = candidate;
    }
    return best;
  }

  _caveTopologyAt(x, z, surface) {
    const cellX = floorDiv(x, CAVE_CELL_SIZE);
    const cellZ = floorDiv(z, CAVE_CELL_SIZE);
    const tunnels = [];
    const chambers = [];
    const entrances = [];

    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        const sourceX = cellX + dx;
        const sourceZ = cellZ + dz;
        const node = this._caveNode(sourceX, sourceZ);
        const destinations = [
          this._caveNode(sourceX + 1, sourceZ),
          this._caveNode(sourceX, sourceZ + 1),
          this._caveNode(sourceX + 1, sourceZ + (hashUnit(hash2D(sourceX, sourceZ, this._noiseSeeds.caveEdges ^ 0x510e527f)) > 0.5 ? 1 : -1)),
        ];
        for (let direction = 0; direction < destinations.length; direction++) {
          if (!this._caveEdgeEnabled(sourceX, sourceZ, direction)) continue;
          const candidate = this._caveSegmentCandidate(
            x,
            z,
            node,
            destinations[direction],
            direction,
            sourceX,
            sourceZ,
          );
          if (candidate) tunnels.push(candidate);
        }

        if (node.chamber) {
          const cosine = Math.cos(node.chamberAngle);
          const sine = Math.sin(node.chamberAngle);
          const offsetX = x - node.x;
          const offsetZ = z - node.z;
          const localX = offsetX * cosine - offsetZ * sine;
          const localZ = offsetX * sine + offsetZ * cosine;
          const horizontal = (localX / node.chamberX) ** 2 + (localZ / node.chamberZ) ** 2;
          if (horizontal < 1.32) chambers.push({ horizontal, centerY: node.y, radiusY: node.chamberY });
        }

        if (node.entrance && surface > SEA_LEVEL + 2) {
          const mouthX = node.x + Math.cos(node.entranceAngle) * node.entranceLength;
          const mouthZ = node.z + Math.sin(node.entranceAngle) * node.entranceLength;
          const closest = pointSegment2D(x, z, node.x, node.z, mouthX, mouthZ);
          const radius = node.entranceRadius * (0.82 + closest.t * 0.32);
          if (closest.distance < radius + 1.1) {
            entrances.push({
              distance: closest.distance,
              radius,
              centerY: THREE.MathUtils.lerp(node.y, surface + 0.35, closest.t),
              verticalRadius: radius * (0.88 + closest.t * 0.34),
              mouth: closest.t > 0.77 && closest.distance < radius * 0.8,
            });
          }
        }
      }
    }

    tunnels.sort((a, b) => a.distance / a.radius - b.distance / b.radius);
    if (tunnels.length > 6) tunnels.length = 6;

    let fissure = null;
    const fissureCellX = floorDiv(x, FISSURE_CELL_SIZE);
    const fissureCellZ = floorDiv(z, FISSURE_CELL_SIZE);
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        const fx = fissureCellX + dx;
        const fz = fissureCellZ + dz;
        const roll = hashUnit(hash2D(fx, fz, this._noiseSeeds.caveFissures));
        if (roll < 0.77) continue;
        const centerX = (fx + 0.18 + hashUnit(hash2D(fx, fz, this._noiseSeeds.caveFissures ^ 0x9b05688c)) * 0.64) * FISSURE_CELL_SIZE;
        const centerZ = (fz + 0.18 + hashUnit(hash2D(fx, fz, this._noiseSeeds.caveFissures ^ 0x1f83d9ab)) * 0.64) * FISSURE_CELL_SIZE;
        const angle = hashUnit(hash2D(fx, fz, this._noiseSeeds.caveFissures ^ 0x5be0cd19)) * Math.PI;
        const halfLength = 17 + hashUnit(hash2D(fx, fz, this._noiseSeeds.caveFissures ^ 0x428a2f98)) * 24;
        const directionX = Math.cos(angle);
        const directionZ = Math.sin(angle);
        const closest = pointSegment2D(
          x,
          z,
          centerX - directionX * halfLength,
          centerZ - directionZ * halfLength,
          centerX + directionX * halfLength,
          centerZ + directionZ * halfLength,
        );
        const width = 1.05 + hashUnit(hash2D(fx, fz, this._noiseSeeds.caveFissures ^ 0xa54ff53a)) * 1.75;
        if (closest.distance > width + 1.25) continue;
        const open = hashUnit(hash2D(fx, fz, this._noiseSeeds.caveFissures ^ 0x71374491)) > 0.81;
        const candidate = {
          distance: closest.distance,
          width,
          floor: 5 + hashUnit(hash2D(fx, fz, this._noiseSeeds.caveFissures ^ 0xb5c0fbcf)) * 13,
          ceiling: surface - (open ? 0 : 3 + hashUnit(hash2D(fx, fz, this._noiseSeeds.caveFissures ^ 0xe9b5dba5)) * 5),
          open,
        };
        if (!fissure || candidate.distance / candidate.width < fissure.distance / fissure.width) fissure = candidate;
      }
    }

    const mouthStrength = Math.max(
      ...entrances.filter((entry) => entry.mouth).map((entry) => 1 - entry.distance / entry.radius),
      fissure?.open ? 1 - fissure.distance / fissure.width : 0,
      0,
    );
    return {
      tunnels,
      chambers,
      entrances,
      fissure,
      caveMouth: mouthStrength > 0.08,
      mouthStrength,
    };
  }

  _columnInfo(x, z) {
    x = Math.floor(x);
    z = Math.floor(z);
    const key = `${x},${z}`;
    const cached = this._columnCache.get(key);
    if (cached) return cached;

    // Domain warping is deliberately shared by the macro fields. That keeps
    // rivers, ranges and biome boundaries geographically related and eliminates
    // the square, axis-aligned look of raw value-noise terrain.
    const warped = domainWarp2D(x, z, this._noiseSeeds.warp, {
      amplitude: 46,
      frequency: 1 / 360,
      octaves: 2,
    });
    const wx = warped.x;
    const wz = warped.y;
    const continent = fbm2D(wx / 390, wz / 390, this._noiseSeeds.continent, {
      octaves: 5,
      lacunarity: 2.03,
      gain: 0.51,
    });
    const detail = clampNoise(fbm2D(wx / 54, wz / 54, this._noiseSeeds.detail, 4));
    const ridge = ridgedFbm2D(wx / 125, wz / 125, this._noiseSeeds.ridge, {
      octaves: 4,
      lacunarity: 2.08,
      gain: 0.52,
    });
    const erosion = fbm2D(wx / 275, wz / 275, this._noiseSeeds.erosion, 3);
    const temperatureBase = fbm2D(wx / 310, wz / 310, this._noiseSeeds.temperature, 3);
    const moisture = fbm2D(wx / 270, wz / 270, this._noiseSeeds.moisture, 3);

    const landness = smoothRange(0.405, 0.575, continent);
    const mountainRegion = smoothRange(0.505, 0.72, continent)
      * (1 - smoothRange(0.62, 0.9, erosion));
    const mountainShape = Math.pow(smoothRange(0.2, 0.78, ridge), 1.65);
    const oceanFloor = SEA_LEVEL - 16 + continent * 24 + detail * 1.4;
    const rollingLand = SEA_LEVEL + 4 + (continent - 0.48) * 27 + detail * 4.2;
    const mountainLift = mountainRegion * mountainShape * 42;
    const valleyCut = smoothRange(0.57, 0.86, erosion) * (2.5 + mountainRegion * 7);
    let rawHeight = THREE.MathUtils.lerp(oceanFloor, rollingLand, landness)
      + mountainLift - valleyCut;

    // Zero contours of a warped coherent field form long branching curves. A
    // soft falloff turns those curves into valleys, with their beds at sea level
    // so water naturally occupies the channel using the existing block rules.
    const riverDistance = Math.abs(clampNoise(fbm2D(
      wx / 175,
      wz / 175,
      this._noiseSeeds.river,
      { octaves: 3, lacunarity: 2.06, gain: 0.5 },
    )));
    const riverChannel = 1 - smoothRange(0.018, 0.092, riverDistance);
    const riverReach = landness * smoothRange(0.43, 0.59, continent)
      * (1 - mountainRegion * 0.62);
    const riverStrength = THREE.MathUtils.clamp(riverChannel * riverReach, 0, 1);
    const riverBed = SEA_LEVEL - 1 + detail * 0.35;
    rawHeight = THREE.MathUtils.lerp(rawHeight, riverBed, Math.pow(riverStrength, 1.45) * 0.97);

    // Elevation cools the climate continuously; the weights below are retained
    // even after selecting a public biome label so terrain/material transitions
    // can blend instead of stepping at a single climate threshold.
    const temperature = THREE.MathUtils.clamp(
      temperatureBase - Math.max(0, rawHeight - SEA_LEVEL - 18) / 145,
      0,
      1,
    );
    const aridity = temperature * 0.58 + (1 - moisture) * 0.7;
    const desertWeight = smoothRange(0.64, 0.88, aridity) * (1 - riverStrength * 0.82);
    const forestWeight = smoothRange(0.5, 0.73, moisture)
      * smoothRange(0.18, 0.52, temperature)
      * (1 - desertWeight);

    let biome = 'plains';
    if (desertWeight > 0.52) biome = 'desert';
    else if (forestWeight > 0.44) biome = 'forest';

    const soilVariation = fbm2D(wx / 46, wz / 46, this._noiseSeeds.detail ^ 0xf1357aea, 2);
    const surfaceSand = desertWeight > 0.42 + (soilVariation - 0.5) * 0.24;
    const rockiness = THREE.MathUtils.clamp(
      mountainRegion * mountainShape * 1.25
        + smoothRange(SEA_LEVEL + 27, WORLD_HEIGHT - 12, rawHeight) * 0.68,
      0,
      1,
    );
    const height = THREE.MathUtils.clamp(Math.round(rawHeight), 6, WORLD_HEIGHT - 7);

    // The underground is assembled from deterministic random feature cells.
    // Nodes are jittered independently per seed, connected with bowed tunnel
    // segments, and occasionally replaced by chambers, fissures or entrances.
    // Unlike a repeated contour formula, neighboring regions can therefore have
    // entirely different topology while a saved seed still recreates it exactly.
    const caveTopology = this._caveTopologyAt(x, z, height);
    const routeA = caveTopology.tunnels[0];
    const routeB = caveTopology.tunnels[1];
    const caveRouteA = routeA ? routeA.distance / routeA.radius : 2;
    const caveRouteB = routeB ? routeB.distance / routeB.radius : 2;
    const caveCenterA = routeA?.centerY ?? 12;
    const caveCenterB = routeB?.centerY ?? 22;
    const caveEntrance = caveTopology.mouthStrength;

    const info = {
      height,
      biome,
      temperature,
      moisture,
      desertWeight,
      forestWeight,
      riverStrength,
      rockiness,
      surfaceSand,
      caveRouteA,
      caveRouteB,
      caveCenterA,
      caveCenterB,
      caveEntrance,
      caveMouth: caveTopology.caveMouth,
      caveTunnels: caveTopology.tunnels,
      caveChambers: caveTopology.chambers,
      caveEntrances: caveTopology.entrances,
      caveFissure: caveTopology.fissure,
    };
    trimCache(this._columnCache, COLUMN_CACHE_LIMIT);
    this._columnCache.set(key, info);
    return info;
  }

  biomeAt(x, z) {
    return this._columnInfo(x, z).biome;
  }

  terrainHeight(x, z) {
    return this._columnInfo(x, z).height;
  }

  _isCave(x, y, z, surface, info = this._columnInfo(x, z)) {
    if (y <= 2 || y > surface) return false;
    const ceilingDepth = surface - y;
    const roughness = () => clampNoise(valueNoise3D(
      x / 6.5,
      y / 5.5,
      z / 6.5,
      this._noiseSeeds.caveDetail,
    ));

    // Sloped entrance capsules connect selected tunnel junctions to genuinely
    // separate surface mouths. Their cross-sections broaden near daylight and
    // inherit local terrain height, avoiding identical vertical shafts.
    for (const entrance of info.caveEntrances ?? []) {
      const horizontal = entrance.distance / entrance.radius;
      if (horizontal > 1.14) continue;
      const vertical = (y - entrance.centerY) / entrance.verticalRadius;
      const equation = horizontal * horizontal + vertical * vertical;
      if (equation < 1 + roughness() * 0.13) return true;
    }

    const fissure = info.caveFissure;
    if (fissure && y >= fissure.floor && y <= fissure.ceiling + (fissure.open ? 1 : 0)) {
      const jaggedWidth = fissure.width * (0.82 + valueNoise3D(
        x / 8,
        y / 13,
        z / 8,
        this._noiseSeeds.caveFissures ^ 0x6a09e667,
      ) * 0.38);
      if (fissure.distance < jaggedWidth) return true;
    }

    // Non-entrance caves retain a minimum roof thickness. Tunnel paths are
    // curved in plan and elevation, with seeded noise used only to roughen their
    // boundary rather than dictate one repeating global pattern.
    if (ceilingDepth < 3) return false;
    for (const tunnel of info.caveTunnels ?? []) {
      const centerY = Math.min(tunnel.centerY, surface - 4);
      const horizontal = tunnel.distance / tunnel.radius;
      if (horizontal > 1.14) continue;
      const verticalRadius = Math.max(1.25, tunnel.verticalRadius);
      const vertical = (y - centerY) / verticalRadius;
      const equation = horizontal * horizontal + vertical * vertical;
      if (equation < 1 + roughness() * 0.14) return true;
    }

    if (ceilingDepth < 5) return false;
    for (const chamber of info.caveChambers ?? []) {
      if (chamber.horizontal > 1.18) continue;
      const centerY = Math.min(chamber.centerY, surface - 5);
      const vertical = (y - centerY) / chamber.radiusY;
      const equation = chamber.horizontal + vertical * vertical;
      if (equation < 1 + roughness() * 0.18) return true;
    }
    return false;
  }

  _stoneOrOre(x, y, z) {
    const oreRoll = hashUnit(hash3D(x, y, z, this._noiseSeeds.ore));
    const veinNoise = clampNoise(valueNoise3D(x / 5, y / 5, z / 5, this._noiseSeeds.ore ^ 0x632be5ab));
    if (y < 18 && oreRoll < 0.0032 && veinNoise > 0.1) return LUMEN_CRYSTAL;
    if (y < 42 && oreRoll < 0.0105 && veinNoise > -0.08) return IRON_ORE;
    if (y < 66 && oreRoll > 0.976 && veinNoise > -0.2) return COAL_ORE;
    if (y < 10 && veinNoise < -0.4) return BASALT;
    return STONE;
  }

  _baseBlockWithInfo(x, y, z, info) {
    if (y < 0 || y >= WORLD_HEIGHT) return AIR;
    if (y === 0) return BEDROCK;
    const surface = info.height;
    if (y > surface) return y <= SEA_LEVEL ? WATER : AIR;
    if (this._isCave(x, y, z, surface, info)) {
      // Deep chambers collect coherent pools rather than isolated liquid voxels.
      // Lava owns the lowest pockets; water appears higher in broad chambers and
      // fissures, leaving most connecting tunnels dry and navigable.
      const poolField = fbm2D(x / 31, z / 31, this._noiseSeeds.cavePools, {
        octaves: 3, lacunarity: 2.03, gain: 0.52,
      });
      const hasBroadFloor = (info.caveChambers?.length || 0) > 0 || Boolean(info.caveFissure);
      const lavaLevel = 5 + Math.floor(poolField * 4);
      if (LAVA !== AIR && y <= lavaLevel && poolField > 0.53) return LAVA;
      const waterLevel = 10 + Math.floor(poolField * 9);
      if (WATER !== AIR && hasBroadFloor && y > lavaLevel && y <= waterLevel && poolField > 0.69) return WATER;
      return AIR;
    }

    const submerged = surface <= SEA_LEVEL;
    if (info.rockiness > 0.66 && !submerged && y >= surface - 1) {
      return y < 12 && info.rockiness > 0.84 ? BASALT : STONE;
    }
    if (info.surfaceSand || submerged || info.riverStrength > 0.44) {
      if (y >= surface - 4) return SAND;
      return this._stoneOrOre(x, y, z);
    }
    if (y === surface) return GRASS;
    if (y >= surface - 3) return DIRT;
    return this._stoneOrOre(x, y, z);
  }

  _baseBlockAt(x, y, z) {
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);
    return this._baseBlockWithInfo(x, y, z, this._columnInfo(x, z));
  }

  _editMap(cx, cz, create = false) {
    const key = chunkKey(cx, cz);
    let map = this.edits.get(key);
    if (!map && create) {
      map = new Map();
      this.edits.set(key, map);
    }
    return map ?? null;
  }

  getBlock(x, y, z) {
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);
    if (y < 0 || y >= WORLD_HEIGHT) return AIR;
    const cx = floorDiv(x, CHUNK_SIZE);
    const cz = floorDiv(z, CHUNK_SIZE);
    const lx = localCoordinate(x, cx);
    const lz = localCoordinate(z, cz);
    const index = localIndex(lx, y, lz);
    const edit = this._editMap(cx, cz)?.get(index);
    if (edit !== undefined) return edit;
    const chunk = this.chunks.get(chunkKey(cx, cz));
    if (chunk?.generated) return chunk.blocks[index];
    // Trees are intentionally omitted here. When the real neighboring chunk is
    // generated both sides are dirtied and rebuilt with its full decorations.
    return this._baseBlockAt(x, y, z);
  }

  setBlock(x, y, z, id, options = null) {
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);
    id = Math.floor(Number(id));
    // The foundation is a hard invariant. Old saves that managed to edit this
    // layer are filtered during load so players can never create a void shaft.
    if (y <= 0 || y >= WORLD_HEIGHT || !Number.isFinite(id) || id < 0 || id > 255) return false;
    if (this.getBlock(x, y, z) === id) return false;

    const cx = floorDiv(x, CHUNK_SIZE);
    const cz = floorDiv(z, CHUNK_SIZE);
    const lx = localCoordinate(x, cx);
    const lz = localCoordinate(z, cz);
    const index = localIndex(lx, y, lz);
    const editMap = this._editMap(cx, cz, true);
    const previousEdit = editMap.get(index);
    const generatedBase = this._baseBlockAt(x, y, z);
    // Canonicalize common reversions without erasing AIR edits that suppress a
    // deterministic tree or plant decoration after a chunk is regenerated.
    const revertsTerrain = generatedBase !== AIR && id === generatedBase;
    const retractsFlow = id === generatedBase && previousEdit === WATER;
    if (revertsTerrain || retractsFlow) {
      editMap.delete(index);
      if (!editMap.size) this.edits.delete(chunkKey(cx, cz));
    } else {
      editMap.set(index, id);
    }
    const chunk = this.chunks.get(chunkKey(cx, cz));
    if (chunk?.generated) {
      chunk.blocks[index] = id;
      this._markDirty(chunk);
    } else {
      // A rare out-of-range edit must never resurrect stale cached voxels when
      // the player returns. Dropping this one cache entry is cheaper and safer
      // than partially replaying decoration and fluid state here.
      this.dormantChunks.delete(chunkKey(cx, cz));
    }
    if (lx === 0) this._markDirty(this.chunks.get(chunkKey(cx - 1, cz)));
    if (lx === CHUNK_SIZE - 1) this._markDirty(this.chunks.get(chunkKey(cx + 1, cz)));
    if (lz === 0) this._markDirty(this.chunks.get(chunkKey(cx, cz - 1)));
    if (lz === CHUNK_SIZE - 1) this._markDirty(this.chunks.get(chunkKey(cx, cz + 1)));
    const fluidKey = voxelKey(x, y, z);
    if (id === WATER) {
      const requestedLevel = Number(options?.fluidLevel);
      const level = Number.isFinite(requestedLevel)
        ? THREE.MathUtils.clamp(Math.floor(requestedLevel), 0, MAX_FLUID_LEVEL)
        : 0;
      this.fluidLevels.set(fluidKey, level);
    } else {
      this.fluidLevels.delete(fluidKey);
    }
    this._scheduleFluidAround(x, y, z);
    if (!options?.skipStats) this._refreshStats();
    return true;
  }

  _fluidCellAvailable(x, y, z) {
    if (y < 0 || y >= WORLD_HEIGHT) return false;
    const cx = floorDiv(x, CHUNK_SIZE);
    const cz = floorDiv(z, CHUNK_SIZE);
    const chunk = this.chunks.get(chunkKey(cx, cz));
    return Boolean(chunk?.generated && chunk.wanted !== false);
  }

  _queueFluid(x, y, z) {
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);
    const pending = this.fluidQueue.length - this.fluidQueueHead;
    if (!this._fluidCellAvailable(x, y, z) || pending >= MAX_FLUID_QUEUE) return false;
    const key = voxelKey(x, y, z);
    if (this.fluidQueued.has(key)) return false;
    this.fluidQueued.add(key);
    this.fluidQueue.push(key);
    return true;
  }

  _scheduleFluidAround(x, y, z) {
    const scheduleIfWater = (px, py, pz) => {
      if (this.getBlock(px, py, pz) === WATER) this._queueFluid(px, py, pz);
    };
    scheduleIfWater(x, y, z);
    scheduleIfWater(x, y - 1, z);
    scheduleIfWater(x, y + 1, z);
    for (const [dx, dz] of FLUID_DIRECTIONS) scheduleIfWater(x + dx, y, z + dz);
  }

  _fluidLevelAt(x, y, z) {
    if (this.getBlock(x, y, z) !== WATER) return Infinity;
    return this.fluidLevels.get(voxelKey(x, y, z)) ?? 0;
  }

  isPositionReady(x, z) {
    const cx = floorDiv(Math.floor(x), CHUNK_SIZE);
    const cz = floorDiv(Math.floor(z), CHUNK_SIZE);
    const chunk = this.chunks.get(chunkKey(cx, cz));
    return Boolean(chunk?.generated && chunk.wanted !== false);
  }

  isPositionRendered(x, z) {
    const cx = floorDiv(Math.floor(x), CHUNK_SIZE);
    const cz = floorDiv(Math.floor(z), CHUNK_SIZE);
    return this.isChunkRendered(cx, cz);
  }

  hasVisibleTerrainAt(x, z) {
    const cx = floorDiv(Math.floor(x), CHUNK_SIZE);
    const cz = floorDiv(Math.floor(z), CHUNK_SIZE);
    const chunk = this.chunks.get(chunkKey(cx, cz));
    const positions = chunk?.opaqueMesh?.geometry?.getAttribute?.('position');
    return Boolean(
      chunk?.generated
      && chunk.wanted !== false
      && chunk.opaqueMesh?.visible
      && positions?.count > 0
    );
  }

  isChunkRendered(cx, cz) {
    const chunk = this.chunks.get(chunkKey(Math.floor(cx), Math.floor(cz)));
    const positions = chunk?.opaqueMesh?.geometry?.getAttribute?.('position');
    return Boolean(
      chunk?.generated
      && chunk.opaqueMesh?.visible
      && positions?.count > 0
      && !chunk.meshDirty
    );
  }

  isImmediateNeighborhoodRendered(x, z) {
    const cx = floorDiv(Math.floor(x), CHUNK_SIZE);
    const cz = floorDiv(Math.floor(z), CHUNK_SIZE);
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!this.isChunkRendered(cx + dx, cz + dz)) return false;
      }
    }
    return true;
  }

  getFluidLevel(x, y, z) {
    if (this.getBlock(x, y, z) !== WATER) return null;
    return this.fluidLevels.get(voxelKey(Math.floor(x), Math.floor(y), Math.floor(z))) ?? 0;
  }

  getFluidSurfaceY(x, y, z) {
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);
    if (this.getBlock(x, y, z) !== WATER) return null;
    if (this.getBlock(x, y + 1, z) === WATER) return y + 1;
    const level = THREE.MathUtils.clamp(this.fluidLevels.get(voxelKey(x, y, z)) ?? 0, 0, MAX_FLUID_LEVEL);
    return y + Math.max(0.3, 0.92 - level * 0.085);
  }

  _fluidHasSupport(x, y, z, level) {
    if (level <= 0) return true;
    if (this._fluidCellAvailable(x, y + 1, z) && this.getBlock(x, y + 1, z) === WATER) return true;
    for (const [dx, dz] of FLUID_DIRECTIONS) {
      if (!this._fluidCellAvailable(x + dx, y, z + dz)) continue;
      if (this._fluidLevelAt(x + dx, y, z + dz) < level) return true;
    }
    return false;
  }

  _flowInto(x, y, z, level) {
    if (!this._fluidCellAvailable(x, y, z)) return false;
    const id = this.getBlock(x, y, z);
    const boundedLevel = THREE.MathUtils.clamp(Math.floor(level), 1, MAX_FLUID_LEVEL);
    const definition = BLOCKS[id];
    const replaceable = id === AIR || (!definition?.solid && !definition?.liquid && !definition?.hazard);
    if (replaceable) {
      return this.setBlock(x, y, z, WATER, { fluidLevel: boundedLevel, skipStats: true });
    }
    if (id !== WATER) return false;
    const key = voxelKey(x, y, z);
    const currentLevel = this.fluidLevels.get(key);
    if (currentLevel === undefined || currentLevel <= boundedLevel) return false;
    this.fluidLevels.set(key, boundedLevel);
    // A flow level changes the rendered surface height even though the block id
    // stays WATER. Treat it as a normal voxel mutation so an in-flight mesh job
    // cannot publish stale geometry, including on chunk boundaries.
    const cx = floorDiv(x, CHUNK_SIZE);
    const cz = floorDiv(z, CHUNK_SIZE);
    const lx = localCoordinate(x, cx);
    const lz = localCoordinate(z, cz);
    this._markDirty(this.chunks.get(chunkKey(cx, cz)));
    if (lx === 0) this._markDirty(this.chunks.get(chunkKey(cx - 1, cz)));
    if (lx === CHUNK_SIZE - 1) this._markDirty(this.chunks.get(chunkKey(cx + 1, cz)));
    if (lz === 0) this._markDirty(this.chunks.get(chunkKey(cx, cz - 1)));
    if (lz === CHUNK_SIZE - 1) this._markDirty(this.chunks.get(chunkKey(cx, cz + 1)));
    // Water top vertices average a 2x2 footprint. At a double boundary, the
    // changed height therefore contributes to the diagonally touching chunk.
    const boundaryX = lx === 0 ? -1 : lx === CHUNK_SIZE - 1 ? 1 : 0;
    const boundaryZ = lz === 0 ? -1 : lz === CHUNK_SIZE - 1 ? 1 : 0;
    if (boundaryX && boundaryZ) {
      this._markDirty(this.chunks.get(chunkKey(cx + boundaryX, cz + boundaryZ)));
    }
    this._scheduleFluidAround(x, y, z);
    return true;
  }

  /**
   * Advance a bounded number of water cells. Sources flow downward before they
   * fan sideways, lateral strength expires after seven cells, and every write is
   * a normal persisted world edit. Missing chunks are hard boundaries: the
   * simulation never calls ensureChunk or expands the streaming radius.
   */
  updateFluids(maxSteps = 24) {
    const limit = THREE.MathUtils.clamp(Math.floor(Number(maxSteps) || 0), 0, 256);
    let processed = 0;
    let changed = 0;
    let cursor = this.fluidQueueHead;
    while (processed < limit && cursor < this.fluidQueue.length) {
      const key = this.fluidQueue[cursor++];
      this.fluidQueued.delete(key);
      processed++;
      const { x, y, z } = parseVoxelKey(key);
      if (!this._fluidCellAvailable(x, y, z) || this.getBlock(x, y, z) !== WATER) continue;
      const level = this.fluidLevels.get(key) ?? 0;

      if (level > 0 && !this._fluidHasSupport(x, y, z, level)) {
        if (this.setBlock(x, y, z, AIR, { skipStats: true })) changed++;
        continue;
      }

      // Falling water keeps enough pressure to descend an arbitrary vertical
      // drop, but starts at level one so its eventual floor spread stays finite.
      if (this._fluidCellAvailable(x, y - 1, z) && this.getBlock(x, y - 1, z) === AIR) {
        if (this._flowInto(x, y - 1, z, Math.max(1, level))) changed++;
        continue;
      }

      if (level >= MAX_FLUID_LEVEL) continue;
      const nextLevel = level + 1;
      const rotation = Math.floor(hashUnit(hash3D(x, y, z, this.seed ^ 0x1b56c4e9)) * 4);
      for (let index = 0; index < FLUID_DIRECTIONS.length; index++) {
        const [dx, dz] = FLUID_DIRECTIONS[(index + rotation) % FLUID_DIRECTIONS.length];
        if (this._flowInto(x + dx, y, z + dz, nextLevel)) changed++;
      }
    }
    this.fluidQueueHead = cursor;
    // Keep a queue head instead of splicing every frame. Compact only after a
    // meaningful prefix has drained, avoiding O(n) churn in large waterfalls.
    if (this.fluidQueueHead >= this.fluidQueue.length) {
      this.fluidQueue.length = 0;
      this.fluidQueueHead = 0;
    } else if (this.fluidQueueHead > 2_048 && this.fluidQueueHead * 2 > this.fluidQueue.length) {
      this.fluidQueue = this.fluidQueue.slice(this.fluidQueueHead);
      this.fluidQueueHead = 0;
    }
    if (changed) this._refreshStats();
    return { processed, changed, remaining: this.fluidQueue.length - this.fluidQueueHead };
  }

  _markDirty(chunk) {
    if (!chunk?.generated) return;
    chunk.meshJob?.disposePartial?.();
    chunk.meshJob = null;
    chunk.meshJobRevision = -1;
    chunk.dirty = true;
    chunk.meshDirty = true;
    chunk.revision++;
  }

  ensureChunk(cx, cz) {
    cx = Math.floor(cx);
    cz = Math.floor(cz);
    const key = chunkKey(cx, cz);
    let chunk = this.chunks.get(key);
    if (!chunk) {
      chunk = this.dormantChunks.get(key) ?? createChunk(cx, cz);
      this.dormantChunks.delete(key);
      this.chunks.set(key, chunk);
    }
    chunk.lastTouched = ++this._streamTick;
    if (!chunk.generated && !this.queuedChunks.has(key)) {
      this.queuedChunks.add(key);
      this.generationQueue.push(key);
    }
    return chunk;
  }

  /**
   * Synchronously materialize the decorated chunk at a world position. This is
   * reserved for rare correctness-critical teleports (spawn, beds and respawn):
   * unloaded getBlock() calls intentionally expose only base terrain and cannot
   * see a deterministic tree canopy that will return when streaming catches up.
   */
  ensurePositionGenerated(x, z) {
    const cx = floorDiv(Math.floor(Number(x) || 0), CHUNK_SIZE);
    const cz = floorDiv(Math.floor(Number(z) || 0), CHUNK_SIZE);
    const key = chunkKey(cx, cz);
    const chunk = this.ensureChunk(cx, cz);
    if (chunk.generated) return chunk;
    this.queuedChunks.delete(key);
    this.generationQueue = this.generationQueue.filter((queuedKey) => queuedKey !== key);
    this._generateChunk(chunk);
    this.stats.generatedTotal++;
    this._refreshStats();
    return chunk;
  }

  updateStreaming(position, renderDistance = this.renderDistance) {
    const px = Number(position?.x ?? position?.[0] ?? 0);
    const pz = Number(position?.z ?? position?.[2] ?? 0);
    const centerX = floorDiv(Number.isFinite(px) ? px : 0, CHUNK_SIZE);
    const centerZ = floorDiv(Number.isFinite(pz) ? pz : 0, CHUNK_SIZE);
    // View distance limits resident chunks, not world size. Generated coordinates
    // remain effectively unbounded, while this cap prevents a settings mistake
    // from scheduling an unbounded amount of work in one streaming update.
    const distance = THREE.MathUtils.clamp(Math.floor(Number(renderDistance) || 5), 2, 16);
    this.centerChunk = { cx: centerX, cz: centerZ };
    this.renderDistance = distance;

    const wanted = [];
    const wantedKeys = new Set();
    for (const chunk of this.chunks.values()) chunk.wanted = false;
    for (let dz = -distance; dz <= distance; dz++) {
      for (let dx = -distance; dx <= distance; dx++) {
        const cx = centerX + dx;
        const cz = centerZ + dz;
        const key = chunkKey(cx, cz);
        wantedKeys.add(key);
        wanted.push({ cx, cz, priority: dx * dx + dz * dz });
      }
    }
    wanted.sort((a, b) => a.priority - b.priority);
    for (const target of wanted) this.ensureChunk(target.cx, target.cz).wanted = true;

    const unloadDistance = distance + 1;
    for (const [key, chunk] of [...this.chunks]) {
      if (Math.abs(chunk.cx - centerX) > unloadDistance || Math.abs(chunk.cz - centerZ) > unloadDistance) {
        this._removeChunk(key, chunk);
      } else {
        if (chunk.opaqueMesh) chunk.opaqueMesh.visible = chunk.wanted;
        if (chunk.glassMesh) chunk.glassMesh.visible = chunk.wanted;
        if (chunk.waterMesh) chunk.waterMesh.visible = chunk.wanted;
        if (chunk.glowMesh) chunk.glowMesh.visible = chunk.wanted;
      }
    }
    this.generationQueue = this.generationQueue
      .filter((key) => this.chunks.has(key) && wantedKeys.has(key))
      .sort((a, b) => {
        const ca = this.chunks.get(a);
        const cb = this.chunks.get(b);
        const da = (ca.cx - centerX) ** 2 + (ca.cz - centerZ) ** 2;
        const db = (cb.cx - centerX) ** 2 + (cb.cz - centerZ) ** 2;
        return da - db;
      });
    this.queuedChunks = new Set(this.generationQueue);
    this.fluidQueue = this.fluidQueue.slice(this.fluidQueueHead).filter((key) => {
      const { x, y, z } = parseVoxelKey(key);
      return this._fluidCellAvailable(x, y, z);
    });
    this.fluidQueueHead = 0;
    this.fluidQueued = new Set(this.fluidQueue);
    this._refreshStats();
  }

  _writeGenerated(chunk, worldX, y, worldZ, id, replace = null) {
    if (y < 1 || y >= WORLD_HEIGHT) return;
    const cx = floorDiv(worldX, CHUNK_SIZE);
    const cz = floorDiv(worldZ, CHUNK_SIZE);
    if (cx !== chunk.cx || cz !== chunk.cz) return;
    const lx = localCoordinate(worldX, cx);
    const lz = localCoordinate(worldZ, cz);
    const index = localIndex(lx, y, lz);
    const current = chunk.blocks[index];
    if (replace && !replace(current)) return;
    chunk.blocks[index] = id;
  }

  _decorateTrees(chunk) {
    if (LOG === AIR || LEAVES === AIR) return;
    const minX = chunk.cx * CHUNK_SIZE - 2;
    const minZ = chunk.cz * CHUNK_SIZE - 2;
    const maxX = (chunk.cx + 1) * CHUNK_SIZE + 2;
    const maxZ = (chunk.cz + 1) * CHUNK_SIZE + 2;
    const minCellX = floorDiv(minX, TREE_CELL_SIZE);
    const minCellZ = floorDiv(minZ, TREE_CELL_SIZE);
    const maxCellX = floorDiv(maxX, TREE_CELL_SIZE);
    const maxCellZ = floorDiv(maxZ, TREE_CELL_SIZE);

    for (let cellZ = minCellZ; cellZ <= maxCellZ; cellZ++) {
      for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
        const offsetX = Math.floor(hashUnit(hash2D(cellX, cellZ, this._noiseSeeds.trees)) * TREE_CELL_SIZE);
        const offsetZ = Math.floor(hashUnit(hash2D(cellX, cellZ, this._noiseSeeds.trees ^ 0x4f1bbcdc)) * TREE_CELL_SIZE);
        const rootX = cellX * TREE_CELL_SIZE + offsetX;
        const rootZ = cellZ * TREE_CELL_SIZE + offsetZ;
        const info = this._columnInfo(rootX, rootZ);
        if (
          info.height <= SEA_LEVEL + 1
          || info.desertWeight > 0.58
          || info.riverStrength > 0.42
          || info.rockiness > 0.56
          || info.caveMouth
        ) continue;
        // Climate weights create gradual woodland edges rather than an abrupt
        // density jump at the public plains/forest biome label.
        const chance = THREE.MathUtils.clamp(0.1 + info.forestWeight * 0.74, 0.08, 0.82);
        if (hashUnit(hash2D(cellX, cellZ, this._noiseSeeds.trees ^ 0xc2b2ae35)) > chance) continue;
        const slope = Math.max(
          Math.abs(info.height - this.terrainHeight(rootX + 1, rootZ)),
          Math.abs(info.height - this.terrainHeight(rootX - 1, rootZ)),
          Math.abs(info.height - this.terrainHeight(rootX, rootZ + 1)),
          Math.abs(info.height - this.terrainHeight(rootX, rootZ - 1)),
        );
        if (slope > 2) continue;

        const speciesRoll = hashUnit(hash2D(rootX, rootZ, this._noiseSeeds.trees ^ 0x6a09e667));
        const pineClimate = THREE.MathUtils.clamp(
          (0.54 - info.temperature) * 1.6 + Math.max(0, info.height - SEA_LEVEL - 18) / 36,
          0,
          0.82,
        );
        const isPine = PINE_LOG !== AIR && PINE_NEEDLES !== AIR
          && speciesRoll < 0.2 + pineClimate * 0.72;
        const trunkBlock = isPine ? PINE_LOG : LOG;
        const leafBlock = isPine ? PINE_NEEDLES : LEAVES;
        const trunkHeight = (isPine ? 7 : 4) + Math.floor(
          hashUnit(hash2D(rootX, rootZ, this._noiseSeeds.trees ^ 0x27d4eb2d)) * (isPine ? 4 : 4),
        );
        const rootY = info.height + 1;
        for (let dy = 0; dy < trunkHeight; dy++) {
          this._writeGenerated(chunk, rootX, rootY + dy, rootZ, trunkBlock, (id) => (
            id === AIR || id === LEAVES || id === PINE_NEEDLES
          ));
        }
        if (isPine) {
          // Alternating, tapered bough layers produce a readable conifer profile
          // without resorting to an imported model or copyrighted texture.
          const canopyBottom = rootY + 2;
          const canopyTop = rootY + trunkHeight + 1;
          for (let canopyY = canopyBottom; canopyY <= canopyTop; canopyY++) {
            const fromTop = canopyTop - canopyY;
            const radius = canopyY === canopyTop ? 0 : Math.min(3, 1 + Math.floor(fromTop / 2));
            const layerInset = fromTop % 2 === 0 ? 0 : 0.58;
            for (let dz = -radius; dz <= radius; dz++) {
              for (let dx = -radius; dx <= radius; dx++) {
                const distance = Math.hypot(dx, dz);
                if (distance > radius + 0.12 - layerInset || (radius > 1 && distance < 0.7)) continue;
                this._writeGenerated(
                  chunk,
                  rootX + dx,
                  canopyY,
                  rootZ + dz,
                  leafBlock,
                  (id) => id === AIR || id === WATER || id === LEAVES || id === PINE_NEEDLES,
                );
              }
            }
          }
          this._writeGenerated(chunk, rootX, canopyTop, rootZ, leafBlock, (id) => id === AIR || id === leafBlock);
        } else {
          const crownY = rootY + trunkHeight - 1;
          for (let dy = -2; dy <= 2; dy++) {
            const radius = dy >= 2 ? 1 : dy <= -2 ? 1 : 2;
            for (let dz = -radius; dz <= radius; dz++) {
              for (let dx = -radius; dx <= radius; dx++) {
                if (Math.abs(dx) === radius && Math.abs(dz) === radius && dy !== 0) continue;
                this._writeGenerated(
                  chunk,
                  rootX + dx,
                  crownY + dy,
                  rootZ + dz,
                  leafBlock,
                  (id) => id === AIR || id === WATER || id === LEAVES || id === PINE_NEEDLES,
                );
              }
            }
          }
        }
        // Restore the visible trunk through the lower canopy.
        for (let dy = 0; dy < trunkHeight; dy++) {
          this._writeGenerated(chunk, rootX, rootY + dy, rootZ, trunkBlock, (id) => (
            id === AIR || id === LEAVES || id === PINE_NEEDLES || id === LOG || id === PINE_LOG
          ));
        }
      }
    }
  }

  _decorateSurfacePlants(chunk) {
    if (FERN === AIR && WILDFLOWER === AIR && CACTUS === AIR) return;
    const minX = chunk.cx * CHUNK_SIZE - 2;
    const minZ = chunk.cz * CHUNK_SIZE - 2;
    const maxX = (chunk.cx + 1) * CHUNK_SIZE + 2;
    const maxZ = (chunk.cz + 1) * CHUNK_SIZE + 2;

    const minPlantX = floorDiv(minX, PLANT_CELL_SIZE);
    const minPlantZ = floorDiv(minZ, PLANT_CELL_SIZE);
    const maxPlantX = floorDiv(maxX, PLANT_CELL_SIZE);
    const maxPlantZ = floorDiv(maxZ, PLANT_CELL_SIZE);
    for (let cellZ = minPlantZ; cellZ <= maxPlantZ; cellZ++) {
      for (let cellX = minPlantX; cellX <= maxPlantX; cellX++) {
        const roll = hashUnit(hash2D(cellX, cellZ, this._noiseSeeds.plants));
        if (roll < 0.68) continue;
        const rootX = cellX * PLANT_CELL_SIZE + Math.floor(hashUnit(hash2D(cellX, cellZ, this._noiseSeeds.plants ^ 0x9e3779b9)) * PLANT_CELL_SIZE);
        const rootZ = cellZ * PLANT_CELL_SIZE + Math.floor(hashUnit(hash2D(cellX, cellZ, this._noiseSeeds.plants ^ 0x85ebca6b)) * PLANT_CELL_SIZE);
        const info = this._columnInfo(rootX, rootZ);
        if (info.height <= SEA_LEVEL || info.surfaceSand || info.caveMouth || info.rockiness > 0.58) continue;
        const rootY = info.height + 1;
        const choice = info.biome === 'forest' || roll > 0.88 ? FERN : WILDFLOWER;
        if (choice === AIR) continue;
        this._writeGenerated(chunk, rootX, rootY, rootZ, choice, (id) => id === AIR);
      }
    }

    // Dense values of one low-frequency field create connected tufts spanning
    // several blocks, while the per-cell thinning keeps most meadow turf clear.
    // These are non-solid and non-selectable, so walking never catches on them.
    if (SHORT_GRASS !== AIR) {
      const originX = chunk.cx * CHUNK_SIZE;
      const originZ = chunk.cz * CHUNK_SIZE;
      for (let z = 0; z < CHUNK_SIZE; z++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
          const worldX = originX + x;
          const worldZ = originZ + z;
          const info = this._columnInfo(worldX, worldZ);
          if (info.surfaceSand || info.height <= SEA_LEVEL || info.caveMouth || info.rockiness > 0.62) continue;
          const patch = fbm2D(worldX / 11, worldZ / 11, this._noiseSeeds.grassPatches, {
            octaves: 2,
            lacunarity: 2.05,
            gain: 0.48,
          });
          const thinning = hashUnit(hash2D(worldX, worldZ, this._noiseSeeds.grassPatches ^ 0x9e3779b9));
          if (patch < 0.55 || thinning < 0.24) continue;
          const rootY = info.height + 1;
          this._writeGenerated(chunk, worldX, rootY, worldZ, SHORT_GRASS, (id) => id === AIR);
        }
      }
    }

    if (CACTUS === AIR) return;
    const minCactusX = floorDiv(minX, CACTUS_CELL_SIZE);
    const minCactusZ = floorDiv(minZ, CACTUS_CELL_SIZE);
    const maxCactusX = floorDiv(maxX, CACTUS_CELL_SIZE);
    const maxCactusZ = floorDiv(maxZ, CACTUS_CELL_SIZE);
    for (let cellZ = minCactusZ; cellZ <= maxCactusZ; cellZ++) {
      for (let cellX = minCactusX; cellX <= maxCactusX; cellX++) {
        const roll = hashUnit(hash2D(cellX, cellZ, this._noiseSeeds.plants ^ 0xc2b2ae35));
        if (roll < 0.58) continue;
        const rootX = cellX * CACTUS_CELL_SIZE + 1 + Math.floor(hashUnit(hash2D(cellX, cellZ, this._noiseSeeds.plants ^ 0x27d4eb2d)) * (CACTUS_CELL_SIZE - 2));
        const rootZ = cellZ * CACTUS_CELL_SIZE + 1 + Math.floor(hashUnit(hash2D(cellX, cellZ, this._noiseSeeds.plants ^ 0x165667b1)) * (CACTUS_CELL_SIZE - 2));
        const info = this._columnInfo(rootX, rootZ);
        if (info.biome !== 'desert' || !info.surfaceSand || info.height <= SEA_LEVEL || info.caveMouth) continue;
        const rootY = info.height + 1;
        const height = 2 + Math.floor(roll * 3);
        for (let dy = 0; dy < height; dy++) {
          this._writeGenerated(chunk, rootX, rootY + dy, rootZ, CACTUS, (id) => id === AIR);
        }
        if (height >= 3 && roll > 0.78) {
          const direction = roll > 0.89 ? 1 : -1;
          this._writeGenerated(chunk, rootX + direction, rootY + 1, rootZ, CACTUS, (id) => id === AIR);
          this._writeGenerated(chunk, rootX + direction, rootY + 2, rootZ, CACTUS, (id) => id === AIR);
        }
      }
    }
  }

  _decorateCaveLife(chunk) {
    if (CAVE_MUSHROOM === AIR) return;
    const originX = chunk.cx * CHUNK_SIZE;
    const originZ = chunk.cz * CHUNK_SIZE;
    for (let z = 0; z < CHUNK_SIZE; z++) {
      for (let x = 0; x < CHUNK_SIZE; x++) {
        const worldX = originX + x;
        const worldZ = originZ + z;
        for (let y = 4; y < 34; y++) {
          const floorId = chunk.blocks[localIndex(x, y, z)];
          const aboveIndex = localIndex(x, y + 1, z);
          if (!isSolid(floorId) || chunk.blocks[aboveIndex] !== AIR) continue;
          const roll = hashUnit(hash3D(worldX, y, worldZ, this._noiseSeeds.plants ^ 0x94d049bb));
          if (roll < 0.996) continue;
          chunk.blocks[aboveIndex] = CAVE_MUSHROOM;
        }
      }
    }
  }

  _activateEditedFluid(x, y, z) {
    if (this.getBlock(x, y, z) === WATER) {
      this._scheduleFluidAround(x, y, z);
      return;
    }
    for (const [dx, dz] of FLUID_DIRECTIONS) {
      if (this.getBlock(x + dx, y, z + dz) === WATER) this._queueFluid(x + dx, y, z + dz);
    }
    if (this.getBlock(x, y + 1, z) === WATER) this._queueFluid(x, y + 1, z);
  }

  _activateChunkFluids(chunk, ownEdits) {
    const scheduleEdit = (cx, cz, index) => {
      const local = decodeLocalIndex(index);
      this._activateEditedFluid(cx * CHUNK_SIZE + local.x, local.y, cz * CHUNK_SIZE + local.z);
    };
    if (ownEdits) {
      for (const index of ownEdits.keys()) scheduleEdit(chunk.cx, chunk.cz, index);
    }
    const neighbors = [
      [-1, 0, (local) => local.x === CHUNK_SIZE - 1],
      [1, 0, (local) => local.x === 0],
      [0, -1, (local) => local.z === CHUNK_SIZE - 1],
      [0, 1, (local) => local.z === 0],
    ];
    for (const [dx, dz, touchesBoundary] of neighbors) {
      const cx = chunk.cx + dx;
      const cz = chunk.cz + dz;
      const edits = this._editMap(cx, cz);
      if (!edits) continue;
      for (const index of edits.keys()) {
        if (touchesBoundary(decodeLocalIndex(index))) scheduleEdit(cx, cz, index);
      }
    }
  }

  _stepChunkGeneration(chunk, maxColumns = 32, maxMilliseconds = 4.5) {
    const originX = chunk.cx * CHUNK_SIZE;
    const originZ = chunk.cz * CHUNK_SIZE;
    const now = () => (
      typeof performance !== 'undefined' && typeof performance.now === 'function'
        ? performance.now()
        : Date.now()
    );
    const deadline = Number.isFinite(maxMilliseconds)
      ? now() + Math.max(0.5, maxMilliseconds)
      : Number.POSITIVE_INFINITY;

    if (chunk.generationPhase === 'base') {
      if (chunk.generationCursor === 0) chunk.blocks.fill(AIR);
      const columnLimit = Number.isFinite(maxColumns)
        ? Math.max(1, Math.floor(maxColumns))
        : Number.POSITIVE_INFINITY;
      let columns = 0;
      while (
        chunk.generationCursor < CHUNK_SIZE * CHUNK_SIZE
        && columns < columnLimit
        && now() < deadline
      ) {
        const cursor = chunk.generationCursor++;
        const x = cursor % CHUNK_SIZE;
        const z = Math.floor(cursor / CHUNK_SIZE);
        const worldX = originX + x;
        const worldZ = originZ + z;
        const info = this._columnInfo(worldX, worldZ);
        for (let y = 0; y < WORLD_HEIGHT; y++) {
          chunk.blocks[localIndex(x, y, z)] = this._baseBlockWithInfo(worldX, y, worldZ, info);
        }
        columns++;
      }
      if (chunk.generationCursor < CHUNK_SIZE * CHUNK_SIZE) return false;
      chunk.generationPhase = 'trees';
      if (now() >= deadline) return false;
    }

    if (chunk.generationPhase === 'trees') {
      this._decorateTrees(chunk);
      chunk.generationPhase = 'plants';
      if (now() >= deadline) return false;
    }
    if (chunk.generationPhase === 'plants') {
      this._decorateSurfacePlants(chunk);
      chunk.generationPhase = 'cave-life';
      if (now() >= deadline) return false;
    }
    if (chunk.generationPhase === 'cave-life') {
      this._decorateCaveLife(chunk);
      chunk.generationPhase = 'finalize';
      if (now() >= deadline) return false;
    }
    if (chunk.generationPhase === 'finalize') {
      const edits = this._editMap(chunk.cx, chunk.cz);
      if (edits) {
        for (const [index, id] of edits) {
          if (index >= 0 && index < CHUNK_VOLUME) chunk.blocks[index] = id;
        }
      }
      chunk.generated = true;
      chunk.generationPhase = 'complete';
      chunk.dirty = true;
      chunk.meshDirty = true;
      chunk.revision++;
      this._activateChunkFluids(chunk, edits);

      for (const [dx, dz] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        this._markDirty(this.chunks.get(chunkKey(chunk.cx + dx, chunk.cz + dz)));
      }
    }
    return chunk.generated;
  }

  _generateChunk(chunk) {
    chunk.generated = false;
    chunk.generationCursor = 0;
    chunk.generationPhase = 'base';
    while (!this._stepChunkGeneration(
      chunk,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
    )) {
      // Synchronous materialization is reserved for spawn/teleport correctness.
    }
  }

  processQueue(maxChunks = 1, maxMilliseconds = 2.4) {
    const limit = Math.max(0, Math.floor(maxChunks));
    let processed = 0;
    let slices = 0;
    while (processed < limit && slices < limit && this.generationQueue.length) {
      const key = this.generationQueue[0];
      const chunk = this.chunks.get(key);
      if (!chunk || chunk.generated) {
        this.generationQueue.shift();
        this.queuedChunks.delete(key);
        continue;
      }
      slices++;
      const warmingSpawn = this._preloadChunksRemaining > 0;
      const completed = warmingSpawn
        ? (this._generateChunk(chunk), true)
        : this._stepChunkGeneration(chunk, 128, maxMilliseconds);
      if (completed) {
        this.generationQueue.shift();
        this.queuedChunks.delete(key);
        processed++;
        this.stats.generatedTotal++;
        if (warmingSpawn) this._preloadChunksRemaining--;
      }
    }
    this._refreshStats();
    return processed;
  }

  _replaceMesh(chunk, property, geometry, material, name) {
    const previous = chunk[property];
    if (previous) {
      this.scene?.remove(previous);
      previous.geometry?.dispose();
      chunk[property] = null;
    }
    if (!geometry) return;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `${name} ${chunk.cx},${chunk.cz}`;
    mesh.position.set(chunk.cx * CHUNK_SIZE, 0, chunk.cz * CHUNK_SIZE);
    mesh.castShadow = property === 'opaqueMesh';
    mesh.receiveShadow = property !== 'glowMesh';
    mesh.frustumCulled = true;
    mesh.renderOrder = property === 'glowMesh' ? 3 : property === 'waterMesh' ? 2 : property === 'glassMesh' ? 1 : 0;
    mesh.visible = chunk.wanted !== false;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    chunk[property] = mesh;
    this.scene?.add(mesh);
  }

  _neighborsReadyForMesh(chunk) {
    for (const [dx, dz] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const neighbor = this.chunks.get(chunkKey(chunk.cx + dx, chunk.cz + dz));
      if (neighbor?.wanted && !neighbor.generated) return false;
    }
    return true;
  }

  rebuildDirty(maxChunks = 1, maxMilliseconds = 2.4) {
    const limit = Math.max(0, Math.floor(maxChunks));
    if (limit === 0) return 0;
    const { cx, cz } = this.centerChunk;
    const dirty = [...this.chunks.values()]
      .filter((chunk) => (
        chunk.generated
        && chunk.wanted !== false
        && chunk.meshDirty
        && this._neighborsReadyForMesh(chunk)
      ))
      .sort((a, b) => {
        const distanceA = (a.cx - cx) ** 2 + (a.cz - cz) ** 2;
        const distanceB = (b.cx - cx) ** 2 + (b.cz - cz) ** 2;
        if (distanceA !== distanceB) return distanceA - distanceB;
        // Continue an equally near partial job to avoid retaining several large
        // geometry writers, but never let an old far job outrank visible ground.
        if (Boolean(a.meshJob) !== Boolean(b.meshJob)) return a.meshJob ? -1 : 1;
        return a.lastTouched - b.lastTouched;
      });
    let rebuilt = 0;
    for (const chunk of dirty) {
      if (rebuilt >= limit) break;
      if (!chunk.meshJob || chunk.meshJobRevision !== chunk.revision) {
        chunk.meshJob?.disposePartial?.();
        chunk.meshJob = createChunkGeometryJob(this, chunk, this.atlas);
        chunk.meshJobRevision = chunk.revision;
      }
      const revision = chunk.meshJobRevision;
      const complete = chunk.meshJob.step({ maxVoxels: 8192, maxMilliseconds });
      if (revision !== chunk.revision || !this.chunks.has(chunk.key)) {
        chunk.meshJob.disposePartial?.();
        chunk.meshJob = null;
        chunk.meshJobRevision = -1;
        continue;
      }
      // Only one partial job advances per idle callback. Existing mesh geometry
      // remains visible until the replacement is fully assembled.
      if (!complete) break;
      const result = chunk.meshJob.result;
      chunk.meshJob = null;
      chunk.meshJobRevision = -1;
      this._replaceMesh(chunk, 'opaqueMesh', result.opaque, this.opaqueMaterial, 'Terrain');
      this._replaceMesh(chunk, 'glassMesh', result.glass, this.glassMaterial, 'Glass');
      this._replaceMesh(chunk, 'waterMesh', result.water, this.waterMaterial, 'Water');
      this._replaceMesh(chunk, 'glowMesh', result.glow, this.glowMaterial, 'Glow');
      chunk.faces = result.faces;
      chunk.triangles = result.triangles;
      chunk.dirty = false;
      chunk.meshDirty = false;
      rebuilt++;
      this.stats.rebuiltTotal++;
    }
    this._refreshStats();
    return rebuilt;
  }

  _removeChunk(key, chunk, keepGeneratedData = true) {
    chunk.meshJob?.disposePartial?.();
    chunk.meshJob = null;
    for (const mesh of [chunk.opaqueMesh, chunk.glassMesh, chunk.waterMesh, chunk.glowMesh]) {
      if (!mesh) continue;
      this.scene?.remove(mesh);
      mesh.geometry?.dispose();
    }
    chunk.opaqueMesh = null;
    chunk.glassMesh = null;
    chunk.waterMesh = null;
    chunk.glowMesh = null;
    chunk.faces = 0;
    chunk.triangles = 0;
    this.chunks.delete(key);
    this.queuedChunks.delete(key);
    this.generationQueue = this.generationQueue.filter((queuedKey) => queuedKey !== key);
    if (keepGeneratedData && chunk.generated) {
      chunk.wanted = false;
      chunk.dirty = true;
      chunk.meshDirty = true;
      // Refresh insertion order so Map doubles as a deterministic LRU queue.
      this.dormantChunks.delete(key);
      this.dormantChunks.set(key, chunk);
      while (this.dormantChunks.size > DORMANT_CHUNK_CACHE_LIMIT) {
        const oldest = this.dormantChunks.keys().next().value;
        if (oldest === undefined) break;
        this.dormantChunks.delete(oldest);
      }
    }
    for (const [dx, dz] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      this._markDirty(this.chunks.get(chunkKey(chunk.cx + dx, chunk.cz + dz)));
    }
  }

  findSpawn(maxRadius = 256) {
    const radiusLimit = Math.max(8, Math.floor(maxRadius));
    let fallback = new THREE.Vector3(0.5, this.terrainHeight(0, 0) + 1.02, 0.5);
    let dryFallback = null;
    for (let radius = 0; radius <= radiusLimit; radius += 2) {
      for (let z = -radius; z <= radius; z += 2) {
        for (let x = -radius; x <= radius; x += 2) {
          if (radius > 0 && Math.abs(x) !== radius && Math.abs(z) !== radius) continue;
          const info = this._columnInfo(x, z);
          if (info.height <= SEA_LEVEL + 1) continue;
          if (info.caveMouth) continue;
          const slope = Math.max(
            Math.abs(info.height - this.terrainHeight(x + 1, z)),
            Math.abs(info.height - this.terrainHeight(x - 1, z)),
            Math.abs(info.height - this.terrainHeight(x, z + 1)),
            Math.abs(info.height - this.terrainHeight(x, z - 1)),
          );
          if (slope <= 1) {
            const candidate = new THREE.Vector3(x + 0.5, info.height + 1.02, z + 0.5);
            if (info.biome !== 'desert') {
              const greenNeighbors = [
                [-10, 0], [10, 0], [0, -10], [0, 10],
                [-8, -8], [8, -8], [-8, 8], [8, 8],
              ].reduce((count, [dx, dz]) => count + (this.biomeAt(x + dx, z + dz) !== 'desert' ? 1 : 0), 0);
              if (greenNeighbors >= 7) return candidate;
            }
            if (!dryFallback) dryFallback = candidate;
          }
          fallback = new THREE.Vector3(x + 0.5, info.height + 1.02, z + 0.5);
        }
      }
    }
    return dryFallback || fallback;
  }

  serializeEdits() {
    const chunks = [];
    const sorted = [...this.edits.entries()].sort(([a], [b]) => a.localeCompare(b));
    for (const [key, edits] of sorted) {
      if (!edits.size) continue;
      const { cx, cz } = parseChunkKey(key);
      const blocks = [...edits.entries()]
        .filter(([index, id]) => Number.isInteger(index) && Number.isInteger(id))
        .sort((a, b) => a[0] - b[0]);
      chunks.push({ cx, cz, blocks });
    }
    const fluids = [...this.fluidLevels.entries()]
      .map(([key, level]) => {
        const { x, y, z } = parseVoxelKey(key);
        return [x, y, z, level];
      })
      .filter(([x, y, z, level]) => [x, y, z, level].every(Number.isInteger))
      .sort((a, b) => a[0] - b[0] || a[2] - b[2] || a[1] - b[1]);
    return { version: 2, seed: this.seed, chunks, fluids };
  }

  loadEdits(payload) {
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        return false;
      }
    }
    this.edits.clear();
    // Cached chunks contain a materialized copy of the previous edit set.
    // Importing/replacing a save invalidates those copies atomically.
    this.dormantChunks.clear();
    this.fluidLevels.clear();
    this.fluidQueue.length = 0;
    this.fluidQueueHead = 0;
    this.fluidQueued.clear();
    let source = payload?.chunks ?? payload ?? [];
    if (!Array.isArray(source) && typeof source === 'object') {
      source = Object.entries(source).map(([key, blocks]) => ({ ...parseChunkKey(key), blocks }));
    }
    if (!Array.isArray(source)) return false;

    for (const record of source) {
      let cx;
      let cz;
      let blocks;
      if (Array.isArray(record)) [cx, cz, blocks] = record;
      else ({ cx, cz, blocks = record?.edits ?? record?.data } = record ?? {});
      cx = Math.floor(Number(cx));
      cz = Math.floor(Number(cz));
      if (!Number.isFinite(cx) || !Number.isFinite(cz)) continue;
      if (!Array.isArray(blocks)) continue;
      const editMap = this._editMap(cx, cz, true);
      for (const entry of blocks) {
        const index = Math.floor(Number(Array.isArray(entry) ? entry[0] : entry?.index));
        const id = Math.floor(Number(Array.isArray(entry) ? entry[1] : entry?.id));
        if (index < 0 || index >= CHUNK_VOLUME || id < 0 || id > 255) continue;
        const local = decodeLocalIndex(index);
        if (local.y <= 0) continue;
        const worldX = cx * CHUNK_SIZE + local.x;
        const worldZ = cz * CHUNK_SIZE + local.z;
        const generatedBase = this._baseBlockAt(worldX, local.y, worldZ);
        if (generatedBase !== AIR && id === generatedBase) continue;
        editMap.set(index, id);
      }
      if (!editMap.size) this.edits.delete(chunkKey(cx, cz));
    }

    const fluidSource = Array.isArray(payload?.fluids) ? payload.fluids : [];
    for (const entry of fluidSource) {
      const x = Math.floor(Number(Array.isArray(entry) ? entry[0] : entry?.x));
      const y = Math.floor(Number(Array.isArray(entry) ? entry[1] : entry?.y));
      const z = Math.floor(Number(Array.isArray(entry) ? entry[2] : entry?.z));
      const level = Math.floor(Number(Array.isArray(entry) ? entry[3] : entry?.level));
      if (![x, y, z, level].every(Number.isFinite) || y < 0 || y >= WORLD_HEIGHT) continue;
      if (level < 0 || level > MAX_FLUID_LEVEL || this.getBlock(x, y, z) !== WATER) continue;
      this.fluidLevels.set(voxelKey(x, y, z), level);
    }

    // This also resets loaded chunks if imports happen while playing.
    for (const chunk of this.chunks.values()) {
      if (chunk.generated) this._generateChunk(chunk);
    }
    this._refreshStats();
    return true;
  }

  _refreshStats() {
    let generated = 0;
    let dirty = 0;
    let faces = 0;
    let triangles = 0;
    let editCount = 0;
    for (const chunk of this.chunks.values()) {
      if (chunk.generated) generated++;
      if (chunk.generated && chunk.wanted !== false && chunk.meshDirty) dirty++;
      faces += chunk.faces || 0;
      triangles += chunk.triangles || 0;
    }
    for (const edits of this.edits.values()) editCount += edits.size;
    this.stats.loaded = this.chunks.size;
    this.stats.generated = generated;
    this.stats.queued = this.generationQueue.length;
    this.stats.dirty = dirty;
    this.stats.faces = faces;
    this.stats.triangles = triangles;
    this.stats.edits = editCount;
    this.stats.flowingWater = this.fluidLevels.size;
    this.stats.fluidQueue = this.fluidQueue.length - this.fluidQueueHead;
  }

  getStats() {
    this._refreshStats();
    return { ...this.stats };
  }

  dispose() {
    for (const [key, chunk] of [...this.chunks]) this._removeChunk(key, chunk, false);
    this.dormantChunks.clear();
    this.generationQueue.length = 0;
    this.queuedChunks.clear();
    this.fluidQueue.length = 0;
    this.fluidQueueHead = 0;
    this.fluidQueued.clear();
    this.fluidLevels.clear();
    this.opaqueMaterial.dispose();
    this.glassMaterial.dispose();
    this.waterMaterial.dispose();
    this.glowMaterial.dispose();
    this.detailNormalMap?.dispose?.();
    this._columnCache.clear();
    this._caveNodeCache.clear();
    this._refreshStats();
  }
}

export default World;
