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
  // A complete low-cost surface horizon lets clear air stay clear, even when
  // the selected quality keeps nearby cave/physics chunks conservative.
  return Math.max(768, (normalizeViewDistance(viewDistance) + DISTANT_HORIZON_BUFFER_CHUNKS)
    * CHUNK_WORLD_SIZE * 3);
}

export function cameraFarForViewDistance(viewDistance) {
  // Keep the far clip inside the fully drawn landscape, including drift to
  // the next chunk boundary while the next horizon is prepared.
  return distantHorizonRadius(viewDistance) - 64;
}
