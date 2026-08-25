export const MIN_VIEW_DISTANCE = 2;
export const MAX_VIEW_DISTANCE = 20;

// Full voxel chunks carry caves, fluids, decorations, collision data and up to
// four GPU meshes. Keep that expensive simulation footprint conservative while
// the lightweight distant horizon carries the visual draw distance beyond it.
export const MAX_DETAIL_DISTANCE = 8;
export const DETAIL_SUPPORT_CHUNKS = 2;
export const DISTANT_HORIZON_BUFFER_CHUNKS = 3;
export const CHUNK_WORLD_SIZE = 16;

export function normalizeViewDistance(value, fallback = 4) {
  const numeric = Number(value);
  const fallbackValue = Number.isFinite(Number(fallback)) ? Math.round(Number(fallback)) : 4;
  const rounded = Number.isFinite(numeric) ? Math.round(numeric) : fallbackValue;
  return Math.max(MIN_VIEW_DISTANCE, Math.min(MAX_VIEW_DISTANCE, rounded));
}

export function detailedViewDistance(viewDistance) {
  return Math.min(MAX_DETAIL_DISTANCE, normalizeViewDistance(viewDistance));
}

export function detailedStreamDistance(viewDistance) {
  return detailedViewDistance(viewDistance) + DETAIL_SUPPORT_CHUNKS;
}

export function distantHorizonRadius(viewDistance) {
  return (normalizeViewDistance(viewDistance) + DISTANT_HORIZON_BUFFER_CHUNKS)
    * CHUNK_WORLD_SIZE;
}

export function cameraFarForViewDistance(viewDistance) {
  // Keep the camera comfortably behind both the clear-air fog plane and the
  // final horizon skirt. Lower settings retain the established 320m far plane.
  return Math.max(320, distantHorizonRadius(viewDistance) + 32);
}
