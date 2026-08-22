const UINT32_RANGE = 0x100000000;
const GOLDEN_RATIO_32 = 0x9e3779b9;

function mix32(value) {
  let mixed = value >>> 0;
  mixed = Math.imul(mixed ^ (mixed >>> 16), 0x7feb352d);
  mixed = Math.imul(mixed ^ (mixed >>> 15), 0x846ca68b);
  return (mixed ^ (mixed >>> 16)) >>> 0;
}

function coordinate(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.trunc(numeric) | 0 : 0;
}

function lerp(a, b, amount) {
  return a + (b - a) * amount;
}

function clamp01(value) {
  return Math.min(1, Math.max(0, Number(value) || 0));
}

function parseFbmOptions(octavesOrOptions, lacunarity, gain) {
  const options =
    octavesOrOptions && typeof octavesOrOptions === 'object'
      ? octavesOrOptions
      : { octaves: octavesOrOptions, lacunarity, gain };

  const octaveValue = Number(options.octaves ?? 5);
  const lacunarityValue = Number(options.lacunarity ?? 2);
  const gainValue = Number(options.gain ?? options.persistence ?? 0.5);
  const frequencyValue = Number(options.frequency ?? 1);

  return {
    octaves: Math.max(1, Math.min(32, Number.isFinite(octaveValue) ? Math.trunc(octaveValue) : 5)),
    lacunarity:
      Number.isFinite(lacunarityValue) && lacunarityValue > 0 ? lacunarityValue : 2,
    gain: Number.isFinite(gainValue) && gainValue >= 0 ? gainValue : 0.5,
    frequency:
      Number.isFinite(frequencyValue) && frequencyValue > 0 ? frequencyValue : 1,
  };
}

/** Convert a numeric or bigint seed into an unsigned 32-bit integer. */
export function normalizeSeed(seed = 0) {
  if (typeof seed === 'bigint') {
    return Number(BigInt.asUintN(32, seed));
  }

  const numeric = Number(seed);
  return Number.isFinite(numeric) ? Math.trunc(numeric) >>> 0 : 0;
}

/** Return a deterministic float in [0, 1) for an integer 2D lattice point. */
export function hash2D(x, y, seed = 0) {
  const ix = coordinate(x);
  const iy = coordinate(y);
  let hash = mix32(normalizeSeed(seed) ^ GOLDEN_RATIO_32);
  hash = mix32(hash ^ Math.imul(ix, 0x85ebca6b));
  hash = mix32(hash ^ Math.imul(iy, 0xc2b2ae35));
  return hash / UINT32_RANGE;
}

/** Return a deterministic float in [0, 1) for an integer 3D lattice point. */
export function hash3D(x, y, z, seed = 0) {
  const ix = coordinate(x);
  const iy = coordinate(y);
  const iz = coordinate(z);
  let hash = mix32(normalizeSeed(seed) ^ GOLDEN_RATIO_32);
  hash = mix32(hash ^ Math.imul(ix, 0x85ebca6b));
  hash = mix32(hash ^ Math.imul(iy, 0xc2b2ae35));
  hash = mix32(hash ^ Math.imul(iz, 0x27d4eb2f));
  return hash / UINT32_RANGE;
}

/** Cubic interpolation curve, clamped to [0, 1]. */
export function smoothstep(value) {
  const amount = clamp01(value);
  return amount * amount * (3 - 2 * amount);
}

/** Quintic interpolation curve. Its flat derivatives reduce visible lattice seams. */
export function smootherstep(value) {
  const amount = clamp01(value);
  return amount * amount * amount * (amount * (amount * 6 - 15) + 10);
}

/** Smoothly map a value between arbitrary edges into [0, 1]. */
export function smoothRange(edge0, edge1, value) {
  const start = Number(edge0);
  const end = Number(edge1);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start === end) {
    return Number(value) >= end ? 1 : 0;
  }
  return smootherstep((Number(value) - start) / (end - start));
}

/** Smooth deterministic value noise in [0, 1]. */
export function valueNoise2D(x, y, seed = 0) {
  const px = Number.isFinite(Number(x)) ? Number(x) : 0;
  const py = Number.isFinite(Number(y)) ? Number(y) : 0;
  const x0 = Math.floor(px);
  const y0 = Math.floor(py);
  const tx = smoothstep(px - x0);
  const ty = smoothstep(py - y0);

  const lower = lerp(hash2D(x0, y0, seed), hash2D(x0 + 1, y0, seed), tx);
  const upper = lerp(hash2D(x0, y0 + 1, seed), hash2D(x0 + 1, y0 + 1, seed), tx);
  return lerp(lower, upper, ty);
}

/** Smooth deterministic value noise in [0, 1]. */
export function valueNoise3D(x, y, z, seed = 0) {
  const px = Number.isFinite(Number(x)) ? Number(x) : 0;
  const py = Number.isFinite(Number(y)) ? Number(y) : 0;
  const pz = Number.isFinite(Number(z)) ? Number(z) : 0;
  const x0 = Math.floor(px);
  const y0 = Math.floor(py);
  const z0 = Math.floor(pz);
  const tx = smoothstep(px - x0);
  const ty = smoothstep(py - y0);
  const tz = smoothstep(pz - z0);

  const z0y0 = lerp(hash3D(x0, y0, z0, seed), hash3D(x0 + 1, y0, z0, seed), tx);
  const z0y1 = lerp(
    hash3D(x0, y0 + 1, z0, seed),
    hash3D(x0 + 1, y0 + 1, z0, seed),
    tx,
  );
  const z1y0 = lerp(
    hash3D(x0, y0, z0 + 1, seed),
    hash3D(x0 + 1, y0, z0 + 1, seed),
    tx,
  );
  const z1y1 = lerp(
    hash3D(x0, y0 + 1, z0 + 1, seed),
    hash3D(x0 + 1, y0 + 1, z0 + 1, seed),
    tx,
  );

  return lerp(lerp(z0y0, z0y1, ty), lerp(z1y0, z1y1, ty), tz);
}

/**
 * Normalized fractal Brownian motion in [0, 1]. The fourth argument may be an
 * octave count or an options object with octaves, lacunarity, gain and frequency.
 */
export function fbm2D(x, y, seed = 0, octavesOrOptions = 5, lacunarity = 2, gain = 0.5) {
  const options = parseFbmOptions(octavesOrOptions, lacunarity, gain);
  const baseSeed = normalizeSeed(seed);
  let frequency = options.frequency;
  let amplitude = 1;
  let sum = 0;
  let weight = 0;

  for (let octave = 0; octave < options.octaves; octave += 1) {
    const octaveSeed = (baseSeed + Math.imul(octave, GOLDEN_RATIO_32)) >>> 0;
    sum += valueNoise2D(x * frequency, y * frequency, octaveSeed) * amplitude;
    weight += amplitude;
    frequency *= options.lacunarity;
    amplitude *= options.gain;
  }

  return weight > 0 ? sum / weight : 0;
}

/**
 * Ridged multifractal noise in [0, 1]. Unlike plain fBm, this concentrates
 * energy into long crests, which is useful for mountain chains and escarpments.
 */
export function ridgedFbm2D(
  x,
  y,
  seed = 0,
  octavesOrOptions = 5,
  lacunarity = 2,
  gain = 0.5,
) {
  const options = parseFbmOptions(octavesOrOptions, lacunarity, gain);
  const baseSeed = normalizeSeed(seed);
  let frequency = options.frequency;
  let amplitude = 1;
  let sum = 0;
  let weight = 0;
  let previous = 1;

  for (let octave = 0; octave < options.octaves; octave += 1) {
    const octaveSeed = (baseSeed + Math.imul(octave, GOLDEN_RATIO_32)) >>> 0;
    let ridge = 1 - Math.abs(valueNoise2D(x * frequency, y * frequency, octaveSeed) * 2 - 1);
    ridge *= ridge;
    // Weight later octaves by the preceding ridge to keep ranges coherent
    // instead of covering every hillside in equally strong high-frequency noise.
    ridge *= 0.55 + previous * 0.45;
    sum += ridge * amplitude;
    weight += amplitude;
    previous = ridge;
    frequency *= options.lacunarity;
    amplitude *= options.gain;
  }

  return weight > 0 ? clamp01(sum / weight) : 0;
}

/**
 * Deterministically bend 2D coordinates with low-frequency fBm. Sampling
 * terrain fields through the returned coordinates avoids axis-aligned biome,
 * river and mountain boundaries while retaining exact seed reproducibility.
 */
export function domainWarp2D(x, y, seed = 0, options = {}) {
  const px = Number.isFinite(Number(x)) ? Number(x) : 0;
  const py = Number.isFinite(Number(y)) ? Number(y) : 0;
  const amplitudeValue = Number(options.amplitude ?? 32);
  const frequencyValue = Number(options.frequency ?? 1 / 256);
  const amplitude = Number.isFinite(amplitudeValue) ? amplitudeValue : 32;
  const frequency = Number.isFinite(frequencyValue) && frequencyValue > 0 ? frequencyValue : 1 / 256;
  const octaves = Math.max(1, Math.min(4, Math.trunc(Number(options.octaves ?? 2)) || 2));
  const baseSeed = normalizeSeed(seed);
  const noiseOptions = { octaves, lacunarity: 2.03, gain: 0.52 };
  const offsetX = (fbm2D(px * frequency + 17.31, py * frequency - 41.73, baseSeed, noiseOptions) * 2 - 1) * amplitude;
  const offsetY = (fbm2D(px * frequency - 29.17, py * frequency + 11.53, baseSeed ^ 0x9e3779b9, noiseOptions) * 2 - 1) * amplitude;
  return { x: px + offsetX, y: py + offsetY, offsetX, offsetY };
}

/**
 * Normalized 3D fractal Brownian motion in [0, 1]. The fifth argument may be
 * an octave count or an options object with octaves, lacunarity, gain and frequency.
 */
export function fbm3D(
  x,
  y,
  z,
  seed = 0,
  octavesOrOptions = 5,
  lacunarity = 2,
  gain = 0.5,
) {
  const options = parseFbmOptions(octavesOrOptions, lacunarity, gain);
  const baseSeed = normalizeSeed(seed);
  let frequency = options.frequency;
  let amplitude = 1;
  let sum = 0;
  let weight = 0;

  for (let octave = 0; octave < options.octaves; octave += 1) {
    const octaveSeed = (baseSeed + Math.imul(octave, GOLDEN_RATIO_32)) >>> 0;
    sum += valueNoise3D(x * frequency, y * frequency, z * frequency, octaveSeed) * amplitude;
    weight += amplitude;
    frequency *= options.lacunarity;
    amplitude *= options.gain;
  }

  return weight > 0 ? sum / weight : 0;
}

/** Create an independent deterministic pseudo-random number generator. */
export function seededRandom(seed = 0) {
  let state = normalizeSeed(seed);

  return function random() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / UINT32_RANGE;
  };
}
