import { BLOCK } from './blocks.js';

// Sample actual liquid, including ponds and edited/flowing water. The camera can
// cross a surface while physics is paused, so do not rely on the old head flag.
export function sampleWaterView(world, position) {
  if (!world || !position) return { submerged:false, depth:0, surface:null };
  const x=Math.floor(position.x), z=Math.floor(position.z), y=Math.floor(position.y);
  if (world.getBlock(x,y,z)!==BLOCK.WATER) return { submerged:false, depth:0, surface:null };
  let top=y;
  const ceiling=Number.isFinite(world.worldHeight)?world.worldHeight:Math.max(256,y+64);
  while(top+1<ceiling && world.getBlock(x,top+1,z)===BLOCK.WATER) top++;
  const surface=world.getFluidSurfaceY?.(x,top,z) ?? top+.9;
  const depth=Math.max(0,surface-position.y);
  return {submerged:depth>.012,depth,surface};
}

export function underwaterOptics(depth=0, dayAmount=1) {
  const d=Math.max(0,Number(depth)||0), day=Math.max(0,Math.min(1,dayAmount));
  return {
    near:.45,
    far:Math.max(9,24*Math.exp(-d*.045)),
    // Red light disappears first; even shallow water has a cool, muted cast.
    red:Math.exp(-d*.18)*.57, green:Math.exp(-d*.055)*.88, blue:Math.exp(-d*.025),
    direct:.68*Math.exp(-d*.085), ambient:.70*Math.exp(-d*.055),
    fogBrightness:(.32+.68*day)*(.62+.38*Math.exp(-d*.075)),
    exposure:.84-.12*(1-Math.exp(-d*.09)),
  };
}
