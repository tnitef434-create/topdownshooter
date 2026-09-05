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
  if(descriptor.kind==='bell_shrine')return [
    {id:BLOCK.TORCH,count:4+Math.floor(roll(0x181ab)*5)},
    {id:ITEM.COOKED_MEAT,count:2+Math.floor(roll(0x219c3)*3)},
    {id:BLOCK.LUMEN_CRYSTAL,count:1+Math.floor(roll(0x331bb)*3)},
    {id:ITEM.COPPER_INGOT,count:2+Math.floor(roll(0x447fe)*4)},
  ];
  if(descriptor.kind==='quarry_rig')return [
    {id:ITEM.STONE_PICK,count:1},
    {id:BLOCK.COALSTONE,count:5+Math.floor(roll(0x511ce)*6)},
    {id:ITEM.COPPER_INGOT,count:3+Math.floor(roll(0x678da)*5)},
    {id:BLOCK.ASH_PLANKS,count:8+Math.floor(roll(0x72df1)*9)},
  ];
  return [];
}

// Pure inventory transaction shared by local play and the authoritative server.
// Remaining stacks stay in the chest. A persistent empty list is the receipt.
export function transferDiscoveryLoot(inventory, stacks) {
  const next=structuredClone(inventory),items=[],remaining=[];
  if(!Array.isArray(next?.slots))return {ok:false,full:true,items,remaining:structuredClone(stacks),inventory};
  for(const stack of stacks){
    let rest=stack.count;
    for(const slot of next.slots)if(slot.id===stack.id&&slot.count<99){const amount=Math.min(rest,99-slot.count);slot.count+=amount;rest-=amount;if(!rest)break;}
    for(const slot of next.slots)if(rest&&!slot.id&&!slot.count){const amount=Math.min(rest,99);slot.id=stack.id;slot.count=amount;rest-=amount;}
    if(rest<stack.count)items.push({id:stack.id,count:stack.count-rest});
    if(rest)remaining.push({id:stack.id,count:rest});
  }
  return {ok:items.length>0,empty:stacks.length===0,full:stacks.length>0&&items.length===0,items,remaining,inventory:next};
}

export function claimDiscoveryLoot(world, inventory, cell) {
  const discovery=world?.getLandDiscoveryChest?.(cell?.x,cell?.y,cell?.z);
  if(!discovery)return {ok:false,invalid:true,items:[]};
  world.discoveryLoot ||= {};
  if(!isDiscoveryLootLedger(world.discoveryLoot))return {ok:false,invalid:true,items:[]};
  const stacks=Object.hasOwn(world.discoveryLoot,discovery.key)?world.discoveryLoot[discovery.key]:discoveryLoot(world.seed,discovery);
  const result=transferDiscoveryLoot(inventory.serialize(),stacks);
  if(result.ok){inventory.load(result.inventory);world.discoveryLoot[discovery.key]=result.remaining;}
  return {...result,key:discovery.key,name:discovery.name};
}
