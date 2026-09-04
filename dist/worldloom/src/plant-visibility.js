// meshDirty means that a replacement is queued, not that the existing ground
// disappeared. Grazing/mining must never blink an entire chunk's vegetation.
export function hasPlantGround(world, x, z) {
  if (world?.hasVisibleTerrainAt) return world.hasVisibleTerrainAt(x, z);
  if (world?.isPositionRendered) return world.isPositionRendered(x, z);
  if (world?.isPositionReady) return world.isPositionReady(x, z);
  return true;
}

const key = (p) => `${p.x},${p.y},${p.z}`;
export function selectStablePlants(entries, previous, limit) {
  const residents = new Set(previous.map(key));
  const score = (p) => Math.sqrt(p.distanceSq) - (residents.has(key(p)) ? 8 : 0);
  // Eight metres of hysteresis avoids trading plants back and forth at a cap.
  return entries.sort((a,b) => score(a)-score(b) || a.x-b.x || a.z-b.z || a.y-b.y).slice(0,limit);
}
