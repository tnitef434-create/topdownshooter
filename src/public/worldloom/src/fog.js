import { normalizeViewDistance, cameraFarForViewDistance } from './streaming-config.js';

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, Number(value) || 0));
}

function smoothstep(value, minimum, maximum) {
  const amount = clamp((Number(value) - minimum) / Math.max(1e-6, maximum - minimum), 0, 1);
  return amount * amount * (3 - 2 * amount);
}

/**
 * Keeps storm/night/enclosure atmosphere, while placing dry daytime haze
 * beyond the camera. Streaming separately clamps this to completed terrain.
 */
export function atmosphericFogRange(viewDistance = 4, context = {}) {
  const distance = normalizeViewDistance(viewDistance);
  const rain = clamp(context.rainIntensity, 0, 1);
  const overcast = clamp(context.overcastAmount, 0, 1);
  const skyExposure = clamp(context.skyExposure ?? 1, 0, 1);
  const dayAmount = clamp(context.dayAmount ?? 1, 0, 1);
  const legacyNear = Math.max(12, distance * 10 - 8 - rain * 11);
  const legacyFar = distance * 16 + 34 - rain * Math.min(32, distance * 4);

  // The distant mesh is completed before spawn and extends beyond this view.
  const clearNear = cameraFarForViewDistance(distance) + 8;
  const clearFar = clearNear + 24;
  const storm = Math.max(
    smoothstep(rain, 0.01, 0.12),
    smoothstep(overcast, 0.08, 0.35),
  );
  const clarity = (context.submerged ? 0 : 1)
    * (1 - storm)
    * smoothstep(skyExposure, 0.62, 0.94)
    * smoothstep(dayAmount, 0.35, 0.78);
  return {
    near: legacyNear + (clearNear - legacyNear) * clarity,
    far: legacyFar + (clearFar - legacyFar) * clarity,
    clarity,
  };
}

/**
 * Clamps atmosphere to the last complete square of rendered chunks. Expansion
 * eases outward; contraction snaps inward, so a turn or boundary crossing can
 * never reveal the clear color behind unfinished terrain.
 */
export function clampFogToMeshedTerrain({
  atmosphericNear,
  atmosphericFar,
  safeTerrainFar,
  previousFar,
  deltaSeconds = 0,
  clarity = 0,
} = {}) {
  const atmosphereFar = Math.max(8, Number(atmosphericFar) || 8);
  const atmosphereNear = clamp(atmosphericNear, 5, atmosphereFar);
  const terrainFar = Number.isFinite(Number(safeTerrainFar))
    ? Math.max(8, Number(safeTerrainFar))
    : atmosphereFar;
  const targetFar = Math.min(atmosphereFar, terrainFar);
  const prior = Number.isFinite(previousFar) ? Number(previousFar) : null;
  let streamingFar = prior == null ? targetFar : prior;
  if (targetFar < streamingFar) streamingFar = targetFar;
  else {
    const dt = Math.max(0, Number(deltaSeconds) || 0);
    streamingFar += (targetFar - streamingFar) * (1 - Math.exp(-dt * 2.2));
  }
  const far = Math.min(atmosphereFar, terrainFar, Math.max(8, streamingFar));
  const legacyBand = Math.min(34, Math.max(8, far * 0.55));
  // When streaming temporarily pulls an otherwise clear horizon inward, keep
  // the fade close to that complete mesh boundary instead of washing out the
  // nearby world. Clarity zero deliberately reproduces the old band exactly.
  const clearBand = Math.min(16, Math.max(12, far * 0.32));
  const clearAmount = clamp(clarity, 0, 1);
  const fogBand = legacyBand + (clearBand - legacyBand) * clearAmount;
  return {
    near: Math.min(atmosphereNear, Math.max(5, far - fogBand)),
    far,
    streamingFar: far,
  };
}
