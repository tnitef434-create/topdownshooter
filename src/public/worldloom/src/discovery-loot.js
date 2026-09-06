import { hash2D } from './noise.js';
import { BLOCK } from './blocks.js';
import { ITEM } from './data.js';

export function isDiscoveryLootLedger(value) {
  return value && typeof value==='object' && !Array.isArray(value)
    && Object.entries(value).every(([key,stacks])=>/^land1:-?\d{1,7}:-?\d{1,7}$/.test(key)
      && Array.isArray(stacks)&&stacks.length<=8
      && stacks.every(s=>s&&Number.isInteger(s.id)&&s.id>0&&s.id<=4096&&Number.isInteger(s.count)&&s.count>0&&s.count<=99));
}

export function discoveryLoot(seed, descriptor) {
  const roll=salt=>hash2D(descriptor.regionX,descriptor.regionZ,seed^salt);
  // Select distinct items as well as quantities. Shrine caches lean toward
  // travel and light; quarry caches toward tools, ore and building supplies.
  const pools={
    bell_shrine:[
      [BLOCK.TORCH,4,8,5],[ITEM.COOKED_MEAT,2,4,5],[BLOCK.LUMEN_CRYSTAL,1,3,4],
      [ITEM.COPPER_INGOT,2,5,3],[ITEM.STICK,4,9,3],[BLOCK.ASH_PLANKS,6,12,2],
      [ITEM.ASH_HATCHET,1,1,2],[BLOCK.CAVE_MUSHROOM,2,5,2],[ITEM.LIGHTCORE,1,1,.55],
    ],
    quarry_rig:[
      [ITEM.STONE_PICK,1,1,5],[BLOCK.COALSTONE,5,10,5],[ITEM.COPPER_INGOT,3,7,4],
      [BLOCK.ASH_PLANKS,8,16,4],[BLOCK.IRON_ORE,2,5,3],[BLOCK.TORCH,3,6,3],
      [BLOCK.STONE_BRICK,5,12,3],[ITEM.COPPER_PICK,1,1,1],[BLOCK.DIAMOND_ORE,1,2,.4],
    ],
  };
  const pool=pools[descriptor.kind]?.slice();
  if(!pool)return [];
  const result=[],count=3+Math.floor(roll(0x79cf3)*3);
  for(let i=0;i<count;i++){
    let target=roll(0x17ab3^Math.imul(i+1,0x9e3779b9))*pool.reduce((sum,p)=>sum+p[3],0),index=0;
    while(index<pool.length-1&&target>=pool[index][3])target-=pool[index++][3];
    const [id,min,max]=pool.splice(index,1)[0];
    result.push({id,count:min+Math.floor(roll(0x3e7cd^Math.imul(i+1,0x85ebca6b))*(max-min+1))});
  }
  return result;
}

export const validDiscoveryLootItem = itemId => itemId===undefined||(Number.isInteger(itemId)&&itemId>0&&itemId<=4096);

// Pure inventory transaction shared by local play and the authoritative server.
// Remaining stacks stay in the chest. A persistent empty list is the receipt.
export function transferDiscoveryLoot(inventory, stacks, itemId) {
  const next=structuredClone(inventory),items=[],remaining=[];
  if(!validDiscoveryLootItem(itemId))return {ok:false,invalid:true,items,remaining:structuredClone(stacks),inventory:next};
  if(itemId!==undefined&&!stacks.some(stack=>stack.id===itemId))return {ok:false,stale:true,empty:stacks.length===0,items,remaining:structuredClone(stacks),inventory:next};
  if(!Array.isArray(next?.slots))return {ok:false,full:true,items,remaining:structuredClone(stacks),inventory};
  for(const stack of stacks){
    if(itemId!==undefined&&stack.id!==itemId){remaining.push({...stack});continue;}
    let rest=stack.count;
    for(const slot of next.slots)if(slot.id===stack.id&&slot.count<99){const amount=Math.min(rest,99-slot.count);slot.count+=amount;rest-=amount;if(!rest)break;}
    for(const slot of next.slots)if(rest&&!slot.id&&!slot.count){const amount=Math.min(rest,99);slot.id=stack.id;slot.count=amount;rest-=amount;}
    if(rest<stack.count)items.push({id:stack.id,count:stack.count-rest});
    if(rest)remaining.push({id:stack.id,count:rest});
  }
  return {ok:items.length>0,empty:stacks.length===0,full:stacks.length>0&&items.length===0,items,remaining,inventory:next};
}

export function inspectDiscoveryLoot(world, inventory, cell) {
  const discovery=world?.getLandDiscoveryChest?.(cell?.x,cell?.y,cell?.z);
  if(!discovery)return {ok:false,invalid:true,items:[]};
  const ledger=world.discoveryLoot||{};
  if(!isDiscoveryLootLedger(ledger))return {ok:false,invalid:true,items:[]};
  const stacks=Object.hasOwn(ledger,discovery.key)?ledger[discovery.key]:discoveryLoot(world.seed,discovery);
  return {ok:true,empty:stacks.length===0,items:[],key:discovery.key,name:discovery.name,remaining:structuredClone(stacks),inventory:inventory.serialize()};
}

export function claimDiscoveryLoot(world, inventory, cell, itemId) {
  const chest=inspectDiscoveryLoot(world,inventory,cell);
  if(!chest.ok)return chest;
  const result=transferDiscoveryLoot(chest.inventory,chest.remaining,itemId);
  if(result.ok){inventory.load(result.inventory);(world.discoveryLoot||={})[chest.key]=result.remaining;}
  return {...result,key:chest.key,name:chest.name};
}
