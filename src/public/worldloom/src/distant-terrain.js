import * as THREE from '../vendor/three.module.min.js';
import {
  MAX_DETAIL_DISTANCE,
  distantHorizonRadius,
  normalizeViewDistance,
} from './streaming-config.js';

const CHUNK_SIZE = 16;
const NEAR_SAMPLE_STEP = 4;
const FAR_SAMPLE_STEP = 16;
const NEAR_BAND_RADIUS = 8 * CHUNK_SIZE;
const CORE_HOLE_CHUNKS = 3;
const SURFACE_OFFSET = 0.2;
const DEFAULT_ROWS_PER_PROCESS = 4;
const DEFAULT_PROCESS_MILLISECONDS = 2.5;

const BIOME_COLORS = Object.freeze({
  plains: new THREE.Color(0x6f9d49),
  forest: new THREE.Color(0x3f7040),
  desert: new THREE.Color(0xc8b274),
});
const ROCK_COLOR = new THREE.Color(0x777a70);
const WATER_COLOR = new THREE.Color(0x477f98);
const DEFAULT_BIOME_COLOR = BIOME_COLORS.plains;

function nowMilliseconds() {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp01(value) {
  return THREE.MathUtils.clamp(finiteNumber(value), 0, 1);
}

function coordinateNoise(x, z) {
  let value = Math.imul(Math.floor(x) | 0, 0x1f123bb5)
    ^ Math.imul(Math.floor(z) | 0, 0x5f356495)
    ^ 0x68bc21eb;
  value ^= value >>> 16;
  value = Math.imul(value, 0x7feb352d);
  value ^= value >>> 15;
  value = Math.imul(value, 0x846ca68b);
  value ^= value >>> 16;
  return (value >>> 0) / 0xffffffff;
}

function columnColor(info, height, x, z) {
  const biome = String(info?.biome || 'plains').toLowerCase();
  const source = BIOME_COLORS[biome] || DEFAULT_BIOME_COLOR;
  let r = source.r;
  let g = source.g;
  let b = source.b;

  // Keep transitions recognizable at the coarse sampling distance without
  // introducing a texture or a second feature-generation pass.
  if (biome !== 'desert') {
    const forestMix = clamp01(info?.forestWeight) * 0.28;
    r += (BIOME_COLORS.forest.r - r) * forestMix;
    g += (BIOME_COLORS.forest.g - g) * forestMix;
    b += (BIOME_COLORS.forest.b - b) * forestMix;
  }
  if (info?.surfaceSand || biome === 'desert') {
    const desertMix = biome === 'desert' ? 1 : clamp01(info?.desertWeight) * 0.7;
    r += (BIOME_COLORS.desert.r - r) * desertMix;
    g += (BIOME_COLORS.desert.g - g) * desertMix;
    b += (BIOME_COLORS.desert.b - b) * desertMix;
  }

  const elevationRock = THREE.MathUtils.smoothstep(finiteNumber(height), 52, 88) * 0.34;
  const rockMix = THREE.MathUtils.clamp(clamp01(info?.rockiness) * 0.48 + elevationRock, 0, 0.62);
  r += (ROCK_COLOR.r - r) * rockMix;
  g += (ROCK_COLOR.g - g) * rockMix;
  b += (ROCK_COLOR.b - b) * rockMix;

  const moisture = Number.isFinite(Number(info?.moisture)) ? clamp01(info.moisture) : 0.5;
  const variation = 0.94 + coordinateNoise(x, z) * 0.09 + (moisture - 0.5) * 0.035;
  return {
    r: THREE.MathUtils.clamp(r * variation, 0, 1),
    g: THREE.MathUtils.clamp(g * variation, 0, 1),
    b: THREE.MathUtils.clamp(b * variation, 0, 1),
  };
}

function makeRequestSpec(centerX, centerZ, viewDistance, detailDistance) {
  const chunkX = Math.floor(finiteNumber(centerX) / CHUNK_SIZE);
  const chunkZ = Math.floor(finiteNumber(centerZ) / CHUNK_SIZE);
  const viewChunks = normalizeViewDistance(viewDistance, 8);
  const detailChunks = THREE.MathUtils.clamp(
    Math.floor(finiteNumber(detailDistance, CORE_HOLE_CHUNKS)),
    1,
    Math.min(viewChunks, MAX_DETAIL_DISTANCE),
  );
  const centerWorldX = chunkX * CHUNK_SIZE;
  const centerWorldZ = chunkZ * CHUNK_SIZE;
  const outerRadius = distantHorizonRadius(viewChunks);
  // The first three detailed rings are guaranteed during startup. Keep the
  // hole fixed at that proven core and let later detailed chunks overlap this
  // surface from above; expanding the hole would expose an empty annulus while
  // the full voxel radius is still streaming.
  const innerChunks = CORE_HOLE_CHUNKS;
  const innerRadius = Math.min(
    outerRadius - NEAR_SAMPLE_STEP,
    innerChunks * CHUNK_SIZE,
  );
  return {
    key: `${chunkX},${chunkZ}|${viewChunks}|${detailChunks}`,
    chunkX,
    chunkZ,
    centerX: centerWorldX,
    centerZ: centerWorldZ,
    viewDistance: viewChunks,
    detailDistance: detailChunks,
    outerRadius,
    innerRadius,
  };
}

function createBand(outerRadius, innerRadius, sampleStep) {
  const cellsPerSide = Math.floor((outerRadius * 2) / sampleStep);
  const holeCellsPerSide = Math.floor((innerRadius * 2) / sampleStep);
  return {
    outerRadius,
    innerRadius,
    sampleStep,
    cellsPerSide,
    visibleCells: cellsPerSide * cellsPerSide - holeCellsPerSide * holeCellsPerSide,
    row: 0,
    column: 0,
    topSamples: new Array(cellsPerSide + 1),
    bottomSamples: new Array(cellsPerSide + 1),
  };
}

function createJob(spec) {
  const nearOuterRadius = Math.min(spec.outerRadius, NEAR_BAND_RADIUS);
  const bands = [createBand(nearOuterRadius, spec.innerRadius, NEAR_SAMPLE_STEP)];
  if (spec.outerRadius > nearOuterRadius) {
    bands.push(createBand(spec.outerRadius, nearOuterRadius, FAR_SAMPLE_STEP));
  }
  const visibleCells = bands.reduce((total, band) => total + band.visibleCells, 0);
  const vertexCapacity = visibleCells * 6;
  return {
    ...spec,
    bands,
    bandIndex: 0,
    visibleCells,
    positions: new Float32Array(vertexCapacity * 3),
    normals: new Float32Array(vertexCapacity * 3),
    colors: new Float32Array(vertexCapacity * 3),
    waterPositions: new Float32Array(vertexCapacity * 3),
    waterData: new Float32Array(vertexCapacity * 3),
    waterCursor: 0,
    vertexCursor: 0,
    sampledColumns: 0,
    startedAt: nowMilliseconds(),
  };
}

function triangleNormal(a, b, c) {
  const ux = b.x - a.x;
  const uy = b.y - a.y;
  const uz = b.z - a.z;
  const vx = c.x - a.x;
  const vy = c.y - a.y;
  const vz = c.z - a.z;
  let x = uy * vz - uz * vy;
  let y = uz * vx - ux * vz;
  let z = ux * vy - uy * vx;
  const length = Math.hypot(x, y, z);
  if (length <= 0.000001) return { x: 0, y: 1, z: 0 };
  x /= length;
  y /= length;
  z /= length;
  return { x, y, z };
}

function writeTriangle(job, a, b, c) {
  const normal = triangleNormal(a, b, c);
  for (const point of [a, b, c]) {
    const offset = job.vertexCursor * 3;
    job.positions[offset] = point.x;
    job.positions[offset + 1] = point.y;
    job.positions[offset + 2] = point.z;
    job.normals[offset] = normal.x;
    job.normals[offset + 1] = normal.y;
    job.normals[offset + 2] = normal.z;
    job.colors[offset] = point.r;
    job.colors[offset + 1] = point.g;
    job.colors[offset + 2] = point.b;
    job.vertexCursor++;
  }
}

function writeWaterTriangle(job, points) {
  const wet=points.filter(p=>Number.isFinite(p.waterLevel));
  if(!wet.length)return;
  const level=Math.max(...wet.map(p=>p.waterLevel));
  for(const p of points){
    const offset=job.waterCursor++*3, depth=Math.max(0,level-p.bedHeight);
    job.waterPositions.set([p.x,level+.92,p.z],offset);
    job.waterData.set([Math.max(.25,depth),0,Math.min(1,depth/3)],offset);
  }
}

/**
 * Incremental low-poly terrain beyond the detailed voxel core.
 *
 * Public lifecycle:
 *   request(x, z, visualChunks, detailedChunks)
 *   process(maxRows, maxMilliseconds)
 *   dispose()
 *
 * The published mesh stays in the scene while a replacement is assembled.
 */
export class DistantTerrainHorizon {
  constructor(scene, world, options = {}) {
    this.scene = scene || null;
    this.world = world || null;
    this.surfaceOffset = THREE.MathUtils.clamp(
      finiteNumber(options.surfaceOffset, SURFACE_OFFSET),
      0.05,
      0.45,
    );
    this.group = new THREE.Group();
    this.group.name = 'Worldloom distant terrain horizon';
    this.group.matrixAutoUpdate = true;
    this.scene?.add?.(this.group);

    this.material = new THREE.MeshStandardMaterial({
      name: 'Worldloom distant terrain',
      vertexColors: true,
      flatShading: true,
      roughness: 0.97,
      metalness: 0,
      side: THREE.FrontSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    this.waterCoverage=new THREE.DataTexture(new Uint8Array(32*32),32,32,THREE.RedFormat);
    this.waterCoverage.magFilter=this.waterCoverage.minFilter=THREE.NearestFilter;
    this.waterCoverage.needsUpdate=true;
    this.coverageOrigin=new THREE.Vector2();

    this._requested = null;
    this._pending = null;
    this._published = null;
    this._disposed = false;
    this._stats = {
      requests: 0,
      cacheHits: 0,
      cancelledBuilds: 0,
      publishedBuilds: 0,
      processedRows: 0,
      sampledColumns: 0,
      lastProcessMilliseconds: 0,
      lastBuildMilliseconds: 0,
    };
  }

  get mesh() {
    return this._published?.mesh || null;
  }

  get ready() {
    return !this._disposed
      && Boolean(this._published)
      && this._published.key === this._requested?.key
      && !this._pending;
  }

  get pending() {
    return Boolean(this._pending);
  }

  get pendingWork() {
    if (!this._pending) return 0;
    let remaining = 0;
    for (let index = this._pending.bandIndex; index < this._pending.bands.length; index++) {
      const band = this._pending.bands[index];
      if (index === this._pending.bandIndex) {
        const remainingRows = band.cellsPerSide - band.row - 1;
        remaining += Math.max(0, remainingRows) * band.cellsPerSide
          + Math.max(0, band.cellsPerSide - band.column);
      } else remaining += band.cellsPerSide * band.cellsPerSide;
    }
    return remaining;
  }

  get safeDistance() {
    if (!this._published) return 0;
    const focus = this._requested || this._published;
    const centerDrift = Math.max(
      Math.abs(focus.centerX - this._published.centerX),
      Math.abs(focus.centerZ - this._published.centerZ),
    );
    return Math.max(0, this._published.outerRadius - centerDrift - FAR_SAMPLE_STEP);
  }

  /**
   * Conservative radial coverage for a live player position. The distant
   * surface is only safe once detailed terrain reaches across its centre hole.
   */
  getSafeDistanceFor(x, z, detailedSafeDistance = 0) {
    if (!this._published) return 0;
    const worldX = finiteNumber(x, this._published.centerX);
    const worldZ = finiteNumber(z, this._published.centerZ);
    const drift = Math.max(
      Math.abs(worldX - this._published.centerX),
      Math.abs(worldZ - this._published.centerZ),
    );
    const detailedSafe = Math.max(0, finiteNumber(detailedSafeDistance));
    if (detailedSafe + NEAR_SAMPLE_STEP < this._published.innerRadius + drift) return 0;
    return Math.max(0, this._published.outerRadius - drift - FAR_SAMPLE_STEP);
  }

  get stats() {
    return {
      ...this._stats,
      ready: this.ready,
      pending: this.pending,
      pendingWork: this.pendingWork,
      safeDistance: this.safeDistance,
      requestedKey: this._requested?.key || null,
      publishedKey: this._published?.key || null,
      vertices: this._published?.vertices || 0,
      triangles: this._published?.triangles || 0,
      cells: this._published?.cells || 0,
      innerRadius: this._published?.innerRadius || 0,
      outerRadius: this._published?.outerRadius || 0,
      center: this._published
        ? [this._published.centerX, this._published.centerZ]
        : null,
    };
  }

  getStats() {
    return this.stats;
  }

  /**
   * Queue a horizon for a chunk-snapped center. Returns true only when that
   * exact request is already published and ready for rendering.
   */
  request(centerX, centerZ, viewDistance, detailDistance) {
    if (this._disposed) return false;
    const spec = makeRequestSpec(centerX, centerZ, viewDistance, detailDistance);
    this._stats.requests++;

    if (spec.key === this._requested?.key) {
      this._stats.cacheHits++;
      return this.ready;
    }

    this._requested = spec;
    if (spec.key === this._published?.key) {
      if (this._pending) this._stats.cancelledBuilds++;
      this._pending = null;
      this._stats.cacheHits++;
      return true;
    }

    if (this._pending) this._stats.cancelledBuilds++;
    this._pending = createJob(spec);
    return false;
  }

  clear() {
    if (this._disposed) return;
    this._requested = null;
    this._pending = null;
    if (this._published?.mesh) this.group.remove(this._published.mesh);
    this._published?.geometry?.dispose?.();
    this._published?.waterMesh?.removeFromParent();
    this._published?.waterGeometry?.dispose();
    this._published = null;
  }

  _columnSample(job, band, row, index) {
    const samples = row === 0 ? band.topSamples : band.bottomSamples;
    if (samples[index]) return samples[index];
    const localX = -band.outerRadius + index * band.sampleStep;
    const localZ = -band.outerRadius + (band.row + row) * band.sampleStep;
    const worldX = job.centerX + localX;
    const worldZ = job.centerZ + localZ;
    let info = null;
    if (typeof this.world?._columnInfo === 'function') {
      info = this.world._columnInfo(worldX, worldZ);
    }
    let height = Number(info?.height);
    if (!Number.isFinite(height) && typeof this.world?.terrainHeight === 'function') {
      height = Number(this.world.terrainHeight(worldX, worldZ));
    }
    if (!Number.isFinite(height)) height = 0;
    if (!info) {
      let biome = 'plains';
      if (typeof this.world?.biomeAt === 'function') biome = this.world.biomeAt(worldX, worldZ);
      info = { biome };
    }
    const seaLevel = finiteNumber(this.world?.seaLevel, 32);
    // Null means dry land, not a water surface at elevation zero.
    const pondLevel = info?.pondWaterLevel;
    const waterLevel = Number.isFinite(pondLevel)
      ? pondLevel
      : height < seaLevel
        ? seaLevel
        : null;
    const color = columnColor(info, height, worldX, worldZ);
    const sample = {
      x: localX,
      y: height + 1 - this.surfaceOffset,
      bedHeight: height,
      waterLevel,
      z: localZ,
      r: color.r,
      g: color.g,
      b: color.b,
    };
    samples[index] = sample;
    job.sampledColumns++;
    this._stats.sampledColumns++;
    return sample;
  }

  _processCell(job) {
    const band = job.bands[job.bandIndex];
    if (!band) return false;
    const localX = -band.outerRadius + band.column * band.sampleStep;
    const localZ = -band.outerRadius + band.row * band.sampleStep;
    const insideHole = localX >= -band.innerRadius
      && localX + band.sampleStep <= band.innerRadius
      && localZ >= -band.innerRadius
      && localZ + band.sampleStep <= band.innerRadius;

    if (!insideHole) {
      const a = this._columnSample(job, band, 0, band.column);
      const b = this._columnSample(job, band, 0, band.column + 1);
      const d = this._columnSample(job, band, 1, band.column);
      const c = this._columnSample(job, band, 1, band.column + 1);
      // Counter-clockwise in X/Z so even extremely steep facets face upward.
      writeTriangle(job, a, d, c);
      writeTriangle(job, a, c, b);
      writeWaterTriangle(job,[a,d,c]);
      writeWaterTriangle(job,[a,c,b]);
    }

    band.column++;
    if (band.column < band.cellsPerSide) return false;
    band.column = 0;
    band.row++;
    band.topSamples = band.bottomSamples;
    band.bottomSamples = new Array(band.cellsPerSide + 1);
    this._stats.processedRows++;
    if (band.row >= band.cellsPerSide) job.bandIndex++;
    return true;
  }

  _publish(job) {
    const usedValues = job.vertexCursor * 3;
    const positions = usedValues === job.positions.length
      ? job.positions
      : job.positions.slice(0, usedValues);
    const normals = usedValues === job.normals.length
      ? job.normals
      : job.normals.slice(0, usedValues);
    const colors = usedValues === job.colors.length
      ? job.colors
      : job.colors.slice(0, usedValues);
    const geometry = new THREE.BufferGeometry();
    geometry.name = `Distant terrain ${job.key}`;
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    geometry.userData.cells = job.visibleCells;
    geometry.userData.sampleSteps = job.bands.map((band) => band.sampleStep);

    const mesh = new THREE.Mesh(geometry, this.material);
    mesh.name = `Worldloom distant terrain ${job.chunkX},${job.chunkZ}`;
    mesh.position.set(job.centerX, 0, job.centerZ);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.frustumCulled = true;
    mesh.userData.distantTerrain = true;
    mesh.userData.requestKey = job.key;

    this.group.add(mesh);
    const waterGeometry=new THREE.BufferGeometry();
    waterGeometry.setAttribute('position',new THREE.BufferAttribute(job.waterPositions.slice(0,job.waterCursor*3),3));
    waterGeometry.setAttribute('waterData',new THREE.BufferAttribute(job.waterData.slice(0,job.waterCursor*3),3));
    const waterNormals=new Float32Array(job.waterCursor*3);
    for(let i=1;i<waterNormals.length;i+=3)waterNormals[i]=1;
    waterGeometry.setAttribute('normal',new THREE.BufferAttribute(waterNormals,3));
    waterGeometry.computeBoundingSphere();
    if(!this.waterMaterial){
      this.waterMaterial=this.world?.waterMaterial?.clone()||new THREE.MeshStandardMaterial({color:WATER_COLOR});
      this.waterMaterial.name='Distant moving water';
      this.waterMaterial.onBeforeCompile=shader=>{
        if(!this.world?.waterMaterial?.userData.worldloomEnhanced)return;
        this.world?.waterMaterial?.onBeforeCompile(shader);
        shader.uniforms.distantCoverage={value:this.waterCoverage};
        shader.uniforms.distantCoverageOrigin={value:this.coverageOrigin};
        shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
          uniform sampler2D distantCoverage;uniform vec2 distantCoverageOrigin;`)
          .replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>
            vec2 coverageCell=floor(vWaterPosition.xz/16.)-distantCoverageOrigin;
            if(all(greaterThanEqual(coverageCell,vec2(0.)))&&all(lessThan(coverageCell,vec2(32.)))&&texture2D(distantCoverage,(coverageCell+.5)/32.).r>.5)discard;`);
      };
      this.waterMaterial.customProgramCacheKey=()=> 'worldloom-distant-water-v1';
    }
    const waterMesh=new THREE.Mesh(waterGeometry,this.waterMaterial);
    waterMesh.name='Worldloom distant moving water';waterMesh.position.copy(mesh.position);
    waterMesh.userData.skipWaterCapture=true;waterMesh.userData.skipWaterReflection=true;
    waterMesh.renderOrder=2;
    this.group.add(waterMesh);
    this.updateWaterCoverage();
    const previous = this._published;
    this._published = {
      ...job,
      mesh,
      geometry,
      waterMesh,waterGeometry,
      vertices: job.vertexCursor,
      triangles: job.vertexCursor / 3,
      cells: job.vertexCursor / 6,
    };
    this._pending = null;
    if (previous?.mesh) {
      this.group.remove(previous.mesh);
      previous.geometry?.dispose?.();
      previous.waterMesh?.removeFromParent();previous.waterGeometry?.dispose();
    }
    this._stats.publishedBuilds++;
    this._stats.lastBuildMilliseconds = Math.max(0, nowMilliseconds() - job.startedAt);
  }

  updateWaterCoverage(){
    // Only the completed voxel surface owns nearby water. A small coverage
    // texture prevents double blending while strips of chunks arrive or leave.
    const chunks=[...(this.world?.chunks?.values()||[])];
    if(!chunks.length)return;
    const x=Math.min(...chunks.map(c=>c.cx)),z=Math.min(...chunks.map(c=>c.cz));
    const next=new Uint8Array(32*32);
    for(const c of chunks)if(c.generated&&c.opaqueMesh?.visible){
      const dx=c.cx-x,dz=c.cz-z;if(dx<32&&dz<32)next[dx+dz*32]=255;
    }
    const data=this.waterCoverage.image.data;
    if(this.coverageOrigin.x!==x||this.coverageOrigin.y!==z||next.some((v,i)=>v!==data[i])){
      this.coverageOrigin.set(x,z);data.set(next);this.waterCoverage.needsUpdate=true;
    }
  }

  /**
   * Advance at most `maxRows` grid rows and respect a soft wall-clock budget.
   * Work is checked after every four-block cell, so a slow terrain sampler
   * cannot turn a single call into a full synchronous horizon build.
   */
  process(maxRows = DEFAULT_ROWS_PER_PROCESS, maxMilliseconds = DEFAULT_PROCESS_MILLISECONDS) {
    if (this._disposed || !this._pending) return 0;
    const rowBudget = Number.isFinite(Number(maxRows))
      ? Math.max(0, Math.floor(Number(maxRows)))
      : Number.POSITIVE_INFINITY;
    const milliseconds = Number.isFinite(Number(maxMilliseconds))
      ? Math.max(0, Number(maxMilliseconds))
      : Number.POSITIVE_INFINITY;
    if (rowBudget <= 0 || milliseconds <= 0) return 0;

    const startedAt = nowMilliseconds();
    const deadline = Number.isFinite(milliseconds)
      ? startedAt + milliseconds
      : Number.POSITIVE_INFINITY;
    const job = this._pending;
    let rows = 0;
    let cells = 0;
    while (this._pending === job && job.bandIndex < job.bands.length && rows < rowBudget) {
      if (cells > 0 && nowMilliseconds() >= deadline) break;
      if (this._processCell(job)) rows++;
      cells++;
    }
    this._stats.lastProcessMilliseconds = Math.max(0, nowMilliseconds() - startedAt);
    if (this._pending === job && job.bandIndex >= job.bands.length) this._publish(job);
    return rows;
  }

  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this._pending = null;
    if (this._published?.mesh) this.group.remove(this._published.mesh);
    this._published?.geometry?.dispose?.();
    this._published?.waterMesh?.removeFromParent();this._published?.waterGeometry?.dispose();
    this._published = null;
    this.material?.dispose?.();
    this.waterMaterial?.dispose();this.waterCoverage.dispose();
    this.group.removeFromParent?.();
    this.scene = null;
    this.world = null;
  }
}
