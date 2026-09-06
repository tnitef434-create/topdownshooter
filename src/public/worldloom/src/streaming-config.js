export const MIN_VIEW_DISTANCE = 2;
export const MAX_VIEW_DISTANCE = 8;

// Full voxel chunks carry caves, fluids, decorations, collision data and up to
// four GPU meshes. Every landscape surface is now a real voxel chunk, so saved
// proxy-era distances also clamp to the supported eight-chunk detail radius.
export const MAX_DETAIL_DISTANCE = 8;
export const DETAIL_SUPPORT_CHUNKS = 2;
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

export function cameraFarForViewDistance() {
  // Sky, sun and cloud geometry need the existing wide clip plane. Terrain
  // visibility is independently limited to completed, generated voxel chunks.
  return 704;
}
