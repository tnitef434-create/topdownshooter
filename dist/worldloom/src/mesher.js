import * as THREE from '../vendor/three.module.min.js';
import { BLOCK, BLOCKS, isSolid, isTransparent, isLiquid } from './blocks.js';

const AIR = Number.isInteger(BLOCK?.AIR) ? BLOCK.AIR : 0;
const DEFAULT_ATLAS_COLUMNS = 4;
const WATER_SURFACE_HEIGHT = 0.92;
const WATER_LEVEL_DROP = 0.085;
const AO_DARKENING = 0.14;

/**
 * Baked skylight falloff for terrain faces below the local skyline. The curve
 * stays readable around a mouth, then approaches black over a full tunnel run
 * instead of dropping from 100% to 34% at the first covered voxel.
 */
export function coverDepthSkylight(coverDepth) {
  const depth = Math.max(0, Number(coverDepth) || 0);
  // Exponential attenuation approximates repeated diffuse bounces: roughly
  // 88% at one covered block, 61% at four, 30% at ten, and 8% at twenty-eight.
  return THREE.MathUtils.clamp(0.055 + 0.945 * Math.exp(-depth / 7.5), 0.055, 1);
}

// Crossed vegetation shares the terrain falloff. Keeping this as an explicit
// geometry-path helper prevents plants from reintroducing the old one-block
// darkness jump while surrounding cube faces remain readable.
export function plantCoverSkylight(coverDepth) {
  return coverDepthSkylight(coverDepth);
}

// The corner order for every face is counter-clockwise when viewed from outside.
const FACES = Object.freeze([
  {
    name: 'east', normal: [1, 0, 0], shade: 0.95, tile: 'side',
    corners: [[1, 0, 1], [1, 0, 0], [1, 1, 0], [1, 1, 1]],
  },
  {
    name: 'west', normal: [-1, 0, 0], shade: 0.95, tile: 'side',
    corners: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]],
  },
  {
    name: 'top', normal: [0, 1, 0], shade: 1.0, tile: 'top',
    corners: [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]],
  },
  {
    name: 'bottom', normal: [0, -1, 0], shade: 0.72, tile: 'bottom',
    corners: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]],
  },
  {
    name: 'south', normal: [0, 0, 1], shade: 0.95, tile: 'side',
    corners: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]],
  },
  {
    name: 'north', normal: [0, 0, -1], shade: 0.95, tile: 'side',
    corners: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]],
  },
]);

function getDefinition(id) {
  return BLOCKS?.[id] ?? BLOCKS?.[String(id)] ?? null;
}

function readTile(definition, face) {
  if (!definition) return 0;
  const tiles = definition.tiles ?? definition.textures ?? null;
  let tile = tiles?.[face.tile]
    ?? tiles?.[face.name]
    ?? definition[face.tile]
    ?? definition[face.name]
    ?? definition.tile
    ?? definition.texture
    ?? 0;

  // A few registries use one-element arrays for a single atlas index.
  if (Array.isArray(tile) && tile.length === 1) tile = tile[0];
  return tile;
}

function scanMaximumTile() {
  let maximum = 0;
  const definitions = Array.isArray(BLOCKS) ? BLOCKS : Object.values(BLOCKS ?? {});
  for (const definition of definitions) {
    if (!definition) continue;
    for (const face of FACES) {
      const tile = readTile(definition, face);
      if (Number.isFinite(tile)) maximum = Math.max(maximum, Math.floor(tile));
      else if (tile && Number.isFinite(tile.index)) maximum = Math.max(maximum, Math.floor(tile.index));
    }
  }
  return maximum;
}

function atlasInfo(atlas) {
  const texture = atlas?.texture ?? atlas?.map ?? atlas ?? null;
  const userData = atlas?.userData ?? texture?.userData ?? {};
  const tileSize = Number(atlas?.tileSize ?? userData.tileSize) || 0;
  const imageWidth = Number(texture?.image?.width) || 0;
  const imageHeight = Number(texture?.image?.height) || 0;
  const inferredMax = scanMaximumTile();
  const inferredColumns = Math.max(DEFAULT_ATLAS_COLUMNS, Math.ceil(Math.sqrt(inferredMax + 1)));
  const columns = Math.max(1, Math.floor(
    atlas?.columns ?? atlas?.cols ?? atlas?.tilesX
      ?? userData.columns ?? userData.cols ?? userData.tilesX
      ?? (tileSize && imageWidth ? imageWidth / tileSize : inferredColumns),
  ));
  const rows = Math.max(1, Math.floor(
    atlas?.rows ?? atlas?.tilesY
      ?? userData.rows ?? userData.tilesY
      ?? (tileSize && imageHeight ? imageHeight / tileSize : Math.ceil((inferredMax + 1) / columns)),
  ));
  return {
    texture,
    columns,
    rows,
    insetU: imageWidth ? 0.55 / imageWidth : 0.00035,
    insetV: imageHeight ? 0.55 / imageHeight : 0.00035,
  };
}

function tileCoordinates(tile, atlas) {
  let column = 0;
  let row = 0;

  if (Number.isFinite(tile)) {
    const index = Math.max(0, Math.floor(tile));
    column = index % atlas.columns;
    row = Math.floor(index / atlas.columns);
  } else if (Array.isArray(tile)) {
    column = Number(tile[0]) || 0;
    row = Number(tile[1]) || 0;
  } else if (tile && typeof tile === 'object') {
    if (Number.isFinite(tile.index)) {
      const index = Math.max(0, Math.floor(tile.index));
      column = index % atlas.columns;
      row = Math.floor(index / atlas.columns);
    } else {
      column = Number(tile.column ?? tile.col ?? tile.x ?? tile.u) || 0;
      row = Number(tile.row ?? tile.y ?? tile.v) || 0;
    }
  }

  column = THREE.MathUtils.clamp(Math.floor(column), 0, atlas.columns - 1);
  row = THREE.MathUtils.clamp(Math.floor(row), 0, atlas.rows - 1);
  const u0 = column / atlas.columns + atlas.insetU;
  const u1 = (column + 1) / atlas.columns - atlas.insetU;
  // Atlas metadata conventionally counts rows from the top of the source image.
  const v0 = 1 - (row + 1) / atlas.rows + atlas.insetV;
  const v1 = 1 - row / atlas.rows - atlas.insetV;
  return [u0, v0, u1, v1];
}

function blockVariation(x, y, z, block) {
  // Stable, block-sized variation breaks up large flat walls without blurring
  // the deliberately crisp atlas art or requiring another texture lookup.
  let hash = Math.imul(x | 0, 0x1f123bb5) ^ Math.imul(y | 0, 0x5f356495)
    ^ Math.imul(z | 0, 0x6c8e9cf5) ^ Math.imul(block | 0, 0x27d4eb2d);
  hash = Math.imul(hash ^ (hash >>> 15), 0x85ebca6b);
  return 0.965 + ((hash >>> 0) / 4294967296) * 0.07;
}

function colorFor(definition, shade, y, worldHeight, x = 0, z = 0, block = 0) {
  const colorValue = definition?.tint ?? definition?.color ?? 0xffffff;
  const color = new THREE.Color();
  try {
    color.set(colorValue);
  } catch {
    color.set(0xffffff);
  }
  // A slight height lift keeps valleys readable without requiring a light map.
  const heightLight = 0.89 + THREE.MathUtils.clamp(y / Math.max(1, worldHeight), 0, 1) * 0.11;
  color.multiplyScalar(shade * heightLight * blockVariation(x, y, z, block));
  return color;
}

function createSkylineState(world, originX, originZ, size, height) {
  const width = size + 2;
  const values = new Int16Array(width * width);
  values.fill(-1);
  const total = width * width;
  let cursor = 0;
  const step = (maxColumns = total, deadline = Number.POSITIVE_INFINITY) => {
    let processed = 0;
    while (cursor < total && processed < maxColumns && performanceNow() < deadline) {
      const localX = cursor % width - 1;
      const localZ = Math.floor(cursor / width) - 1;
      const worldX = originX + localX;
      const worldZ = originZ + localZ;
      let top = -1;
      for (let y = height - 1; y >= 0; y--) {
        const id = world.getBlock(worldX, y, worldZ);
        if (isSolid(id) && !isLiquid(id) && !isTransparent(id)) {
          top = y;
          break;
        }
      }
      values[(localZ + 1) * width + localX + 1] = top;
      cursor++;
      processed++;
    }
    return cursor >= total;
  };
  const sample = (worldX, worldZ) => {
    const localX = THREE.MathUtils.clamp(Math.floor(worldX - originX) + 1, 0, width - 1);
    const localZ = THREE.MathUtils.clamp(Math.floor(worldZ - originZ) + 1, 0, width - 1);
    return values[localZ * width + localX];
  };
  return { step, sample, get complete() { return cursor >= total; } };
}

function performanceNow() {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
}

function occlusionAt(world, x, y, z) {
  const id = world.getBlock(x, y, z);
  if (id === AIR || id == null || isLiquid(id) || !isSolid(id)) return 0;
  // Leaves and glass soften a corner instead of creating an inky seam.
  return isTransparent(id) ? 0.3 : 1;
}

function cornerLight(world, worldX, y, worldZ, face, corner, skyline) {
  const normal = face.normal;
  const tangentAxes = [];
  for (let axis = 0; axis < 3; axis++) {
    if (normal[axis] === 0) tangentAxes.push(axis);
  }

  const base = [worldX + normal[0], y + normal[1], worldZ + normal[2]];
  const first = [...base];
  const second = [...base];
  const diagonal = [...base];
  const firstAxis = tangentAxes[0];
  const secondAxis = tangentAxes[1];
  const firstDirection = corner[firstAxis] === 0 ? -1 : 1;
  const secondDirection = corner[secondAxis] === 0 ? -1 : 1;
  first[firstAxis] += firstDirection;
  second[secondAxis] += secondDirection;
  diagonal[firstAxis] += firstDirection;
  diagonal[secondAxis] += secondDirection;

  const sideA = occlusionAt(world, first[0], first[1], first[2]);
  const sideB = occlusionAt(world, second[0], second[1], second[2]);
  const cornerOcclusion = occlusionAt(world, diagonal[0], diagonal[1], diagonal[2]);
  const occlusion = sideA > 0.75 && sideB > 0.75
    ? 3
    : Math.min(3, sideA + sideB + cornerOcclusion);
  const ambientOcclusion = 1 - occlusion * AO_DARKENING;

  const surfaceY = y + corner[1];
  // Side faces sample the outward column, so an open cliff remains sunlit even
  // when the solid column behind it rises far above the visible face.
  const coverX = worldX + (normal[0] === 0 ? corner[0] * 0.999 : normal[0]);
  const coverZ = worldZ + (normal[2] === 0 ? corner[2] * 0.999 : normal[2]);
  const coverY = skyline(coverX, coverZ);
  const coverDepth = Math.max(0, coverY - surfaceY);
  const caveShade = coverDepthSkylight(coverDepth);
  const skyFacing = normal[1] > 0 ? 1.025 : normal[1] < 0 ? 0.92 : 1;
  return THREE.MathUtils.clamp(ambientOcclusion * caveShade * skyFacing, 0.045, 1.025);
}

function glowColorFor(definition) {
  const color = new THREE.Color();
  color.set(definition?.emissive || definition?.color || 0xffffff);
  color.multiplyScalar(Math.min(2.2, 0.75 + Number(definition?.emissiveIntensity || 1) * 0.35));
  return color;
}

function faceIsVisible(block, neighbor) {
  if (neighbor === AIR || neighbor == null) return true;
  if (block === neighbor) return false;
  const blockLiquid = isLiquid(block);
  const neighborLiquid = isLiquid(neighbor);
  if (blockLiquid) {
    if (neighborLiquid) return false;
    // The neighboring transparent solid draws the shared glass/leaf boundary.
    // Avoiding a second coplanar water face prevents shimmer and z-fighting.
    return !isSolid(neighbor);
  }
  if (neighborLiquid) return true;
  return !isSolid(neighbor) || isTransparent(neighbor);
}

function fluidCellHeight(world, x, y, z) {
  if (!isLiquid(world.getBlock(x, y, z))) return null;
  if (isLiquid(world.getBlock(x, y + 1, z))) return 1;
  const level = Number(world.getFluidLevel?.(x, y, z));
  const normalizedLevel = Number.isFinite(level) ? THREE.MathUtils.clamp(level, 0, 7) : 0;
  return Math.max(0.3, WATER_SURFACE_HEIGHT - normalizedLevel * WATER_LEVEL_DROP);
}

function fluidCornerHeights(world, x, y, z, face) {
  return face.corners.map((corner) => {
    if (corner[1] !== 1) return corner[1];
    let height = fluidCellHeight(world, x, y, z) ?? WATER_SURFACE_HEIGHT;
    const vertexX = x + corner[0];
    const vertexZ = z + corner[2];
    for (const sampleX of [vertexX - 1, vertexX]) {
      for (const sampleZ of [vertexZ - 1, vertexZ]) {
        const candidate = fluidCellHeight(world, sampleX, y, sampleZ);
        if (candidate != null) height = Math.max(height, candidate);
      }
    }
    return height;
  });
}

class GeometryWriter {
  constructor() {
    this.positions = [];
    this.normals = [];
    this.uvs = [];
    this.colors = [];
    this.indices = [];
    this.faces = 0;
  }

  addFace(x, y, z, face, uv, color, waterHeights = null, cornerLights = null) {
    const offset = this.positions.length / 3;
    for (let cornerIndex = 0; cornerIndex < 4; cornerIndex++) {
      const corner = face.corners[cornerIndex];
      const cornerY = waterHeights && corner[1] === 1 ? waterHeights[cornerIndex] : corner[1];
      const light = cornerLights?.[cornerIndex] ?? 1;
      this.positions.push(x + corner[0], y + cornerY, z + corner[2]);
      this.normals.push(face.normal[0], face.normal[1], face.normal[2]);
      this.colors.push(color.r * light, color.g * light, color.b * light);
    }
    this.uvs.push(
      uv[0], uv[1],
      uv[2], uv[1],
      uv[2], uv[3],
      uv[0], uv[3],
    );
    // Pick the diagonal that best follows the corner-light gradient. This avoids
    // the telltale bright/dark triangular split on ambient-occluded voxel faces.
    if (cornerLights && cornerLights[0] + cornerLights[2] > cornerLights[1] + cornerLights[3]) {
      this.indices.push(offset, offset + 1, offset + 3, offset + 1, offset + 2, offset + 3);
    } else {
      this.indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
    }
    this.faces++;
  }

  addQuad(points, normal, uv, color) {
    const offset = this.positions.length / 3;
    for (const point of points) {
      this.positions.push(point[0], point[1], point[2]);
      this.normals.push(normal[0], normal[1], normal[2]);
      this.colors.push(color.r, color.g, color.b);
    }
    this.uvs.push(
      uv[0], uv[1],
      uv[2], uv[1],
      uv[2], uv[3],
      uv[0], uv[3],
    );
    this.indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
    this.faces++;
  }

  addCross(x, y, z, uv, color, height = 1, spread = 0.76) {
    const inset = (1 - spread) * 0.5;
    const low = inset;
    const high = 1 - inset;
    const first = [
      [x + low, y, z + low], [x + high, y, z + high],
      [x + high, y + height, z + high], [x + low, y + height, z + low],
    ];
    const second = [
      [x + high, y, z + low], [x + low, y, z + high],
      [x + low, y + height, z + high], [x + high, y + height, z + low],
    ];
    this.addQuad(first, [-0.7071, 0, 0.7071], uv, color);
    this.addQuad([...first].reverse(), [0.7071, 0, -0.7071], uv, color);
    this.addQuad(second, [-0.7071, 0, -0.7071], uv, color);
    this.addQuad([...second].reverse(), [0.7071, 0, 0.7071], uv, color);
  }

  finish() {
    if (this.faces === 0) return null;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(this.normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(this.uvs, 2));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 3));
    geometry.setIndex(this.indices);
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    geometry.userData.faceCount = this.faces;
    return geometry;
  }
}

/**
 * Incremental chunk meshing job. Skyline analysis, voxel traversal, and buffer
 * creation are all split into small slices so streaming cannot monopolize a
 * render frame. `buildChunkGeometry` below remains the synchronous compatibility
 * wrapper used by tests and correctness-critical callers.
 */
export class ChunkGeometryJob {
  constructor(world, chunk, atlas) {
    this.world = world;
    this.chunk = chunk;
    this.size = Number(world?.chunkSize ?? chunk?.size ?? 16);
    this.height = Number(world?.worldHeight ?? chunk?.height ?? 64);
    this.blocks = chunk?.blocks ?? chunk?.data;
    if (!this.blocks) throw new TypeError('Chunk is missing its block buffer.');
    this.atlasMeta = atlasInfo(atlas);
    this.writers = {
      opaque: new GeometryWriter(),
      glass: new GeometryWriter(),
      water: new GeometryWriter(),
      glow: new GeometryWriter(),
    };
    this.originX = chunk.cx * this.size;
    this.originZ = chunk.cz * this.size;
    this.skylineState = createSkylineState(
      world,
      this.originX,
      this.originZ,
      this.size,
      this.height,
    );
    this.voxelCursor = 0;
    this.voxelTotal = this.size * this.size * this.height;
    this.finishCursor = 0;
    this.geometry = { opaque: null, glass: null, water: null, glow: null };
    this.complete = false;
    this.result = null;
  }

  _writeVoxel(index) {
    const layerSize = this.size * this.size;
    const y = Math.floor(index / layerSize);
    const withinLayer = index - y * layerSize;
    const z = Math.floor(withinLayer / this.size);
    const x = withinLayer - z * this.size;
    const block = this.blocks[index];
    if (block === AIR) return;
    const definition = getDefinition(block);
    const writer = isLiquid(block)
      ? this.writers.water
      : definition?.transparent && Number(definition?.opacity) < 1
        ? this.writers.glass
        : this.writers.opaque;
    const worldX = this.originX + x;
    const worldZ = this.originZ + z;
    const skyline = this.skylineState.sample;

    if (definition?.shape === 'prop' || definition?.renderMode === 'meadow-model') {
      // Rendered by a dedicated opaque Blender prop field, not atlas cutout quads.
      return;
    }

    if (['cross', 'cross-short', 'grass-tuft'].includes(definition?.shape)) {
      const uv = tileCoordinates(readTile(definition, FACES[4]), this.atlasMeta);
      const coverDepth = Math.max(0, skyline(worldX, worldZ) - y);
      const plantLight = plantCoverSkylight(coverDepth);
      const color = colorFor(definition, 0.92 * plantLight, y, this.height, worldX, worldZ, block);
      const plantHeight = definition.shape === 'grass-tuft' ? 0.3 : definition.shape === 'cross-short' ? 0.54 : 1;
      const plantSpread = definition.shape === 'grass-tuft' ? 0.9 : definition.shape === 'cross-short' ? 0.62 : 0.76;
      writer.addCross(x, y, z, uv, color, plantHeight, plantSpread);
      if (definition?.emissive && !isLiquid(block)) {
        this.writers.glow.addCross(x, y, z, uv, glowColorFor(definition), plantHeight, plantSpread);
      }
      return;
    }

    if (definition?.shape === 'slab' || definition?.shape === 'slab-high') {
      const slabHeight = definition.shape === 'slab-high' ? 0.78 : 0.46;
      for (const face of FACES) {
        const uv = tileCoordinates(readTile(definition, face), this.atlasMeta);
        const color = colorFor(definition, face.shade, y, this.height, worldX, worldZ, block);
        const points = face.corners.map((corner) => [
          x + corner[0],
          y + corner[1] * slabHeight,
          z + corner[2],
        ]);
        writer.addQuad(points, face.normal, uv, color);
        if (definition?.emissive) this.writers.glow.addQuad(points, face.normal, uv, glowColorFor(definition));
      }
      return;
    }

    for (const face of FACES) {
      if (y === 0 && face.normal[1] < 0) continue;
      const neighbor = this.world.getBlock(
        worldX + face.normal[0],
        y + face.normal[1],
        worldZ + face.normal[2],
      );
      if (!faceIsVisible(block, neighbor)) continue;
      const uv = tileCoordinates(readTile(definition, face), this.atlasMeta);
      const color = colorFor(definition, face.shade, y, this.height, worldX, worldZ, block);
      const cornerLights = face.corners.map((corner) => (
        cornerLight(this.world, worldX, y, worldZ, face, corner, skyline)
      ));
      const waterHeights = isLiquid(block) && !isLiquid(this.world.getBlock(worldX, y + 1, worldZ))
        ? fluidCornerHeights(this.world, worldX, y, worldZ, face)
        : null;
      writer.addFace(x, y, z, face, uv, color, waterHeights, cornerLights);
      if (definition?.emissive && !isLiquid(block)) {
        this.writers.glow.addFace(x, y, z, face, uv, glowColorFor(definition), false);
      }
    }
  }

  _finishNext() {
    const key = ['opaque', 'glass', 'water', 'glow'][this.finishCursor];
    if (!key) {
      const { opaque, glass, water, glow } = this.geometry;
      this.result = {
        opaque,
        glass,
        water,
        glow,
        opaqueGeometry: opaque,
        glassGeometry: glass,
        waterGeometry: water,
        glowGeometry: glow,
        opaqueFaces: this.writers.opaque.faces,
        glassFaces: this.writers.glass.faces,
        waterFaces: this.writers.water.faces,
        glowFaces: this.writers.glow.faces,
        faces: this.writers.opaque.faces + this.writers.glass.faces + this.writers.water.faces,
        triangles: (
          this.writers.opaque.faces + this.writers.glass.faces
          + this.writers.water.faces + this.writers.glow.faces
        ) * 2,
      };
      this.complete = true;
      return;
    }
    this.geometry[key] = this.writers[key].finish();
    if (key === 'water') this.geometry.water?.computeVertexNormals();
    this.finishCursor++;
  }

  step({ maxVoxels = 1536, maxMilliseconds = 4 } = {}) {
    if (this.complete) return true;
    const voxelBudget = Number.isFinite(maxVoxels)
      ? Math.max(1, Math.floor(maxVoxels))
      : Number.POSITIVE_INFINITY;
    const deadline = Number.isFinite(maxMilliseconds)
      ? performanceNow() + Math.max(0.5, maxMilliseconds)
      : Number.POSITIVE_INFINITY;

    if (!this.skylineState.complete) {
      const columnBudget = Number.isFinite(voxelBudget)
        ? Math.max(2, Math.floor(voxelBudget / Math.max(1, this.height)))
        : Number.POSITIVE_INFINITY;
      this.skylineState.step(columnBudget, deadline);
      if (!this.skylineState.complete || performanceNow() >= deadline) return false;
    }

    let processed = 0;
    while (
      this.voxelCursor < this.voxelTotal
      && processed < voxelBudget
      && performanceNow() < deadline
    ) {
      this._writeVoxel(this.voxelCursor++);
      processed++;
    }
    if (this.voxelCursor < this.voxelTotal || performanceNow() >= deadline) return false;

    // Typed-array allocation and GPU buffer setup are also distributed. Empty
    // material buckets are skipped in the same turn, while no more than one
    // non-empty geometry is allocated per idle slice.
    let finalizedNonEmpty = false;
    while (!this.complete && performanceNow() < deadline) {
      const nextKey = ['opaque', 'glass', 'water', 'glow'][this.finishCursor];
      if (finalizedNonEmpty && nextKey && this.writers[nextKey].faces > 0) break;
      const hadFaces = nextKey ? this.writers[nextKey].faces > 0 : false;
      this._finishNext();
      finalizedNonEmpty ||= hadFaces;
    }
    return this.complete;
  }

  disposePartial() {
    for (const geometry of Object.values(this.geometry)) geometry?.dispose?.();
    this.complete = true;
    this.result = null;
  }
}

export function createChunkGeometryJob(world, chunk, atlas) {
  return new ChunkGeometryJob(world, chunk, atlas);
}

/**
 * Synchronous compatibility wrapper. Runtime streaming uses the incremental job
 * through World.rebuildDirty(), while tests and explicit one-off calls retain the
 * original immediate return contract.
 */
export function buildChunkGeometry(world, chunk, atlas) {
  const job = createChunkGeometryJob(world, chunk, atlas);
  while (!job.step({ maxVoxels: Number.POSITIVE_INFINITY, maxMilliseconds: Number.POSITIVE_INFINITY })) {
    // The infinite budget completes every phase in a bounded number of passes.
  }
  return job.result;
}

export const meshChunk = buildChunkGeometry;
export default buildChunkGeometry;
