// Shared wire format: no DOM or rendering dependencies.
export const validVector = (v, limit = 50_000_000) => Array.isArray(v) && v.length === 3 && v.every(n => Number.isFinite(n) && Math.abs(n) <= limit);
export const cellKey = (x,y,z) => `${x},${y},${z}`;
export function validCell(edit) {
  return edit && [edit.x,edit.y,edit.z,edit.id].every(Number.isInteger) && Math.abs(edit.x)<=50_000_000 && Math.abs(edit.z)<=50_000_000 && edit.y>0 && edit.y<96 && edit.id>=0 && edit.id<=255;
}
export function unpackEdits(payload) {
  const blocks = {}, fluids = {};
  for (const chunk of payload?.chunks || []) for (const [index,id] of chunk.blocks || []) {
    const x=chunk.cx*16+index%16, z=chunk.cz*16+Math.floor(index/16)%16, y=Math.floor(index/256);
    if(validCell({x,y,z,id})) blocks[cellKey(x,y,z)]=id;
  }
  for (const [x,y,z,level] of payload?.fluids || []) if(validCell({x,y,z,id:0}) && Number.isInteger(level)&&level>=0&&level<=7)fluids[cellKey(x,y,z)]=level;
  return { blocks, fluids };
}
export function packEdits(seed, blocks = {}, fluids = {}) {
  const chunks = new Map();
  for (const [key,id] of Object.entries(blocks)) {
    const [x,y,z] = key.split(',').map(Number), cx=Math.floor(x/16), cz=Math.floor(z/16), chunkKey=`${cx},${cz}`;
    if(!validCell({x,y,z,id}))continue;
    if(!chunks.has(chunkKey))chunks.set(chunkKey,{cx,cz,blocks:[]});
    chunks.get(chunkKey).blocks.push([y*256+(z-cz*16)*16+x-cx*16,id]);
  }
  return {version:2,seed,chunks:[...chunks.values()],fluids:Object.entries(fluids).map(([key,level])=>[...key.split(',').map(Number),level])};
}
export function personalSave(snapshot) {
  if (!snapshot || !validVector(snapshot.player?.position) || snapshot.player.position[1]<-256 || snapshot.player.position[1]>512) throw new Error('Invalid player position.');
  const slots=snapshot.inventory?.slots;
  if(!Array.isArray(slots)||slots.length>72||slots.some(s=>!Number.isInteger(s.id)||s.id<0||s.id>4096||!Number.isInteger(s.count)||s.count<0||s.count>99))throw new Error('Invalid inventory.');
  const result={};
  for(const key of ['player','inventory','survival','flags','objectiveIndex','objectiveId','respawnPoint'])if(snapshot[key]!==undefined)result[key]=structuredClone(snapshot[key]);
  if(JSON.stringify(result).length>500_000)throw new Error('Player save is too large.');
  return result;
}
export function worldSave(world, userId) {
  const personal=world.players[userId];
  return {schemaVersion:1,registryVersion:1,generatorVersion:world.generatorVersion,discoveryVersion:world.discoveryVersion||0,discoveryLoot:world.discoveryLoot||{},seed:world.seed,mode:world.mode,name:world.name,createdAt:world.createdAt,timeOfDay:world.timeOfDay??.31,world:packEdits(world.seed,world.blocks,world.fluids),...personal,droppedItems:[]};
}
