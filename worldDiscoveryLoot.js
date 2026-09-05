import { World } from './src/public/worldloom/src/world.js';
import { BLOCK } from './src/public/worldloom/src/blocks.js';
import { discoveryLoot, transferDiscoveryLoot } from './src/public/worldloom/src/discovery-loot.js';
import { DISCOVERY_REGION_SIZE } from './src/public/worldloom/src/land-discoveries.js';
import { worldError } from './worldStore.js';

export function createDiscoveryVerifier(saved) {
  return new World(saved.seed,null,null,{generatorVersion:saved.generatorVersion,discoveryVersion:saved.discoveryVersion||0});
}

export function applyDiscoveryLootClaim(saved,userId,pose,cell,verifier) {
  if(!cell||![cell.x,cell.y,cell.z].every(Number.isInteger)||Math.abs(cell.x)>50_000_000||Math.abs(cell.z)>50_000_000||cell.y<1||cell.y>95)throw worldError('Invalid chest.');
  const position=pose?.position;
  if(!Array.isArray(position)||Math.hypot(cell.x+.5-position[0],cell.y+.5-position[1],cell.z+.5-position[2])>5.25)throw worldError('Move closer to the chest.',409);
  const d=verifier.getLandDiscoveryForRegion(Math.floor(cell.x/DISCOVERY_REGION_SIZE),Math.floor(cell.z/DISCOVERY_REGION_SIZE));
  if(!d||d.chest.x!==cell.x||d.chest.y!==cell.y||d.chest.z!==cell.z)throw worldError('There is no discovery chest here.',409);
  const blockKey=`${cell.x},${cell.y},${cell.z}`;
  if(Object.hasOwn(saved.blocks,blockKey)&&saved.blocks[blockKey]!==BLOCK.CHEST)throw worldError('That chest has been removed.',409);
  const inventory=saved.players[userId]?.inventory;
  if(!inventory)throw worldError('Save your inventory before opening the chest.',409);
  saved.discoveryLoot ||= {};
  const stacks=Object.hasOwn(saved.discoveryLoot,d.key)?saved.discoveryLoot[d.key]:discoveryLoot(saved.seed,d);
  const result=transferDiscoveryLoot(inventory,stacks);
  // An empty receipt remains forever, including server restarts and retries.
  if(result.ok){saved.players[userId].inventory=result.inventory;saved.discoveryLoot[d.key]=result.remaining;}
  return {...result,key:d.key,name:d.name};
}
