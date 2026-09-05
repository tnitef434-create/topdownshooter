import { hash2D } from './noise.js';

export const DISCOVERY_VERSION = 1;
export const DISCOVERY_REGION_SIZE = 80;
export const DISCOVERY_SPAWN_CHANCE = 0.25;
export const DISCOVERY_KINDS = Object.freeze(['bell_shrine', 'quarry_rig']);
export const DISCOVERY_NAMES = Object.freeze({bell_shrine:'Wayfarer Bell Shrine',quarry_rig:'Abandoned Quarry Rig'});
const SALT = 0x73ae129b;
export const discoverySpawnRoll = (seed, rx, rz) => hash2D(rx, rz, seed ^ SALT);

export function discoveryPlacementForRegion(world, rx, rz) {
  if (world.discoveryVersion !== DISCOVERY_VERSION || !Number.isInteger(rx) || !Number.isInteger(rz)) return null;
  // The roll is independent of terrain. A region is eligible if one of its six
  // seed-selected sites passes the dry, supported and flat footprint checks.
  if (discoverySpawnRoll(world.seed,rx,rz) >= DISCOVERY_SPAWN_CHANCE) return null;
  for(let attempt=0;attempt<6;attempt++) {
    const salt=world.seed^SALT^Math.imul(attempt+1,0x9e3779b9);
    const x=rx*DISCOVERY_REGION_SIZE+10+Math.floor(hash2D(rx,rz,salt^0x12ab)*60);
    const z=rz*DISCOVERY_REGION_SIZE+10+Math.floor(hash2D(rx,rz,salt^0x6b91)*60);
    const center=world._columnInfo(x,z);
    if(center.height<=world.seaLevel+2 || center.height>=world.worldHeight-9 || center.pondId || center.caveMouth || center.riverStrength>.25 || center.rockiness>.62)continue;
    let min=center.height,max=center.height,valid=true;
    // Inspect every support column, not only the four corners: even a one-cell
    // cave mouth or pond beneath a pillar makes the complete site ineligible.
    for(let dz=-4;dz<=4&&valid;dz++)for(let dx=-4;dx<=4&&valid;dx++) {
      const info=world._columnInfo(x+dx,z+dz); min=Math.min(min,info.height);max=Math.max(max,info.height);
      if(max-min>1 || info.height<=world.seaLevel+2 || info.pondId || info.caveMouth || info.riverStrength>.25 || info.rockiness>.62) {valid=false;break;}
      for(let depth=0;depth<3;depth++)if(world._isCave(x+dx,info.height-depth,z+dz,info.height,info)){valid=false;break;}
    }
    if(!valid)continue;
    const kind=DISCOVERY_KINDS[Math.floor(hash2D(rx,rz,world.seed^SALT^0x192b)*2)];
    const quarter=Math.floor(hash2D(rx,rz,world.seed^SALT^0x3bb7)*4);
    const [cx,cz]=rotateDiscoveryOffset(2,2,quarter);
    return Object.freeze({key:`land1:${rx}:${rz}`,kind,name:DISCOVERY_NAMES[kind],regionX:rx,regionZ:rz,x,y:max+1,z,quarter,yaw:quarter*Math.PI/2,radius:4,chest:Object.freeze({x:x+cx,y:max+1,z:z+cz})});
  }
  return null;
}

export function rotateDiscoveryOffset(x,z,quarter) {
  return [[x,z],[z,-x],[-x,-z],[-z,x]][quarter&3];
}
