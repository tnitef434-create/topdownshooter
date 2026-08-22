import * as THREE from '../vendor/three.module.min.js';
import { BLOCK, BLOCKS, isSolid, isTransparent, isLiquid } from './blocks.js';

const AIR = Number.isInteger(BLOCK?.AIR) ? BLOCK.AIR : 0;
const DEFAULT_ATLAS_COLUMNS = 4;
const WATER_SURFACE_HEIGHT = 0.86;
const AO_DARKENING = 0.14;
const CAVE_DARKENING = 0.46;

// The corner order for every face is counter-clockwise when viewed from outside.
const FACES = Object.freeze([
  {
    name: 'east', normal: [1, 0, 0], shade: 0.82, tile: 'side',
    corners: [[1, 0, 1], [1, 0, 0], [1, 1, 0], [1, 1, 1]],
  },
  {
    name: 'west', normal: [-1, 0, 0], shade: 0.74, tile: 'side',
    corners: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]],
  },
  {
    name: 'top', normal: [0, 1, 0], shade: 1.0, tile: 'top',
    corners: [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]],
  },
  {
    name: 'bottom', normal: [0, -1, 0], shade: 0.52, tile: 'bottom',
    corners: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]],
  },
  {
    name: 'south', normal: [0, 0, 1], shade: 0.88, tile: 'side',
    corners: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]],
  },
  {
    name: 'north', normal: [0, 0, -1], shade: 0.68, tile: 'side',
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

function buildSkyline(world, originX, originZ, size, height) {
  const width = size + 2;
  const values = new Int16Array(width * width);
  values.fill(-1);
  for (let localZ = -1; localZ <= size; localZ++) {
    for (let localX = -1; localX <= size; localX++) {
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
    }
  }
  return (worldX, worldZ) => {
    const localX = THREE.MathUtils.clamp(Math.floor(worldX - originX) + 1, 0, width - 1);
    const localZ = THREE.MathUtils.clamp(Math.floor(worldZ - originZ) + 1, 0, width - 1);
    return values[localZ * width + localX];
  };
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
  const caveShade = 1 - THREE.MathUtils.smoothstep(coverDepth, 1, 14) * CAVE_DARKENING;
  const skyFacing = normal[1] > 0 ? 1.025 : normal[1] < 0 ? 0.92 : 1;
  return THREE.MathUtils.clamp(ambientOcclusion * caveShade * skyFacing, 0.42, 1.025);
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

class GeometryWriter {
  constructor() {
    this.positions = [];
    this.normals = [];
    this.uvs = [];
    this.colors = [];
    this.indices = [];
    this.faces = 0;
  }

  addFace(x, y, z, face, uv, color, lowerWaterTop, cornerLights = null) {
    const offset = this.positions.length / 3;
    for (let cornerIndex = 0; cornerIndex < 4; cornerIndex++) {
      const corner = face.corners[cornerIndex];
      const cornerY = lowerWaterTop && corner[1] === 1 ? WATER_SURFACE_HEIGHT : corner[1];
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
 * Builds culled-face geometry for a chunk. Positions are local to the chunk;
 * World positions the resulting meshes at (cx * size, 0, cz * size).
 */
export function buildChunkGeometry(world, chunk, atlas) {
  const size = Number(world?.chunkSize ?? chunk?.size ?? 16);
  const height = Number(world?.worldHeight ?? chunk?.height ?? 64);
  const blocks = chunk?.blocks ?? chunk?.data;
  if (!blocks) throw new TypeError('Chunk is missing its block buffer.');

  const atlasMeta = atlasInfo(atlas);
  const opaque = new GeometryWriter();
  const glass = new GeometryWriter();
  const water = new GeometryWriter();
  const glow = new GeometryWriter();
  const originX = chunk.cx * size;
  const originZ = chunk.cz * size;
  const skyline = buildSkyline(world, originX, originZ, size, height);

  for (let y = 0; y < height; y++) {
    for (let z = 0; z < size; z++) {
      for (let x = 0; x < size; x++) {
        const index = x + size * (z + size * y);
        const block = blocks[index];
        if (block === AIR) continue;
        const definition = getDefinition(block);
        const writer = isLiquid(block)
          ? water
          : definition?.transparent && Number(definition?.opacity) < 1
            ? glass
            : opaque;
        const worldX = originX + x;
        const worldZ = originZ + z;

        if (definition?.shape === 'cross' || definition?.shape === 'cross-short') {
          const uv = tileCoordinates(readTile(definition, FACES[4]), atlasMeta);
          const coverDepth = Math.max(0, skyline(worldX, worldZ) - y);
          const plantLight = 1 - THREE.MathUtils.smoothstep(coverDepth, 1, 10) * 0.38;
          const color = colorFor(definition, 0.92 * plantLight, y, height, worldX, worldZ, block);
          const plantHeight = definition.shape === 'cross-short' ? 0.54 : 1;
          const plantSpread = definition.shape === 'cross-short' ? 0.62 : 0.76;
          writer.addCross(x, y, z, uv, color, plantHeight, plantSpread);
          if (definition?.emissive && !isLiquid(block)) glow.addCross(x, y, z, uv, glowColorFor(definition), plantHeight, plantSpread);
          continue;
        }

        if (definition?.shape === 'slab' || definition?.shape === 'slab-high') {
          const slabHeight = definition.shape === 'slab-high' ? 0.78 : 0.46;
          for (const face of FACES) {
            const uv = tileCoordinates(readTile(definition, face), atlasMeta);
            const color = colorFor(definition, face.shade, y, height, worldX, worldZ, block);
            const points = face.corners.map((corner) => [
              x + corner[0],
              y + corner[1] * slabHeight,
              z + corner[2],
            ]);
            writer.addQuad(points, face.normal, uv, color);
            if (definition?.emissive) glow.addQuad(points, face.normal, uv, glowColorFor(definition));
          }
          continue;
        }

        for (const face of FACES) {
          if (y === 0 && face.normal[1] < 0) continue;
          const neighbor = world.getBlock(
            worldX + face.normal[0],
            y + face.normal[1],
            worldZ + face.normal[2],
          );
          if (!faceIsVisible(block, neighbor)) continue;
          const uv = tileCoordinates(readTile(definition, face), atlasMeta);
          const color = colorFor(definition, face.shade, y, height, worldX, worldZ, block);
          const cornerLights = face.corners.map((corner) => (
            cornerLight(world, worldX, y, worldZ, face, corner, skyline)
          ));
          const lowerWaterTop = isLiquid(block)
            && !isLiquid(world.getBlock(worldX, y + 1, worldZ));
          writer.addFace(x, y, z, face, uv, color, lowerWaterTop, cornerLights);
          if (definition?.emissive && !isLiquid(block)) glow.addFace(x, y, z, face, uv, glowColorFor(definition), false);
        }
      }
    }
  }

  const opaqueGeometry = opaque.finish();
  const glassGeometry = glass.finish();
  const waterGeometry = water.finish();
  const glowGeometry = glow.finish();
  return {
    opaque: opaqueGeometry,
    glass: glassGeometry,
    water: waterGeometry,
    glow: glowGeometry,
    opaqueGeometry,
    glassGeometry,
    waterGeometry,
    glowGeometry,
    opaqueFaces: opaque.faces,
    glassFaces: glass.faces,
    waterFaces: water.faces,
    glowFaces: glow.faces,
    faces: opaque.faces + glass.faces + water.faces,
    triangles: (opaque.faces + glass.faces + water.faces + glow.faces) * 2,
  };
}

export const meshChunk = buildChunkGeometry;
export default buildChunkGeometry;
