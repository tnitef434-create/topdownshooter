import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { io as connect } from 'socket.io-client';
import { World } from '../src/public/worldloom/src/world.js';
import { BLOCK } from '../src/public/worldloom/src/blocks.js';
import { Inventory } from '../src/public/worldloom/src/save.js';
import { discoveryPlacementForRegion,discoverySpawnRoll,DISCOVERY_SPAWN_CHANCE } from '../src/public/worldloom/src/land-discoveries.js';
import { discoveryLoot,inspectDiscoveryLoot,claimDiscoveryLoot,transferDiscoveryLoot } from '../src/public/worldloom/src/discovery-loot.js';
import { createDiscoveryVerifier,inspectSavedDiscoveryLoot,applyDiscoveryLootClaim } from '../worldDiscoveryLoot.js';
import { DISCOVERY_ASSETS } from '../src/public/worldloom/src/discovery-assets.js';
import { createWorldStore } from '../worldStore.js';
import { installWorldServer } from '../worldServer.js';

test('exact 7.5% combined deterministic region policy on eligible land; wet/cave/cliff sites are rejected',()=>{
  const sample={height:40,pondId:null,caveMouth:false,riverStrength:0,rockiness:0};
  const flat={seed:64,discoveryVersion:1,seaLevel:32,worldHeight:96,_columnInfo:()=>sample,_isCave:()=>false};
  let spawned=0;const kinds=new Set();
  for(let z=-50;z<50;z++)for(let x=-50;x<50;x++){
    const d=discoveryPlacementForRegion(flat,x,z);
    assert.equal(Boolean(d),discoverySpawnRoll(64,x,z)<.075);
    if(d){spawned++;kinds.add(d.kind);assert.deepEqual(d,discoveryPlacementForRegion(flat,x,z));}
  }
  assert.equal(DISCOVERY_SPAWN_CHANCE,.075);
  assert.ok(spawned>650&&spawned<850,`${spawned}/10000`);assert.equal(kinds.size,2);
  for(const patch of [{height:32},{pondId:'pond'},{caveMouth:true},{riverStrength:.7},{rockiness:.9}]){
    assert.equal(discoveryPlacementForRegion({...flat,_columnInfo:()=>({...sample,...patch})},1,-2),null);
  }
  assert.equal(discoveryPlacementForRegion({...flat,_isCave:()=>true},1,-2),null);
  assert.equal(discoveryPlacementForRegion({...flat,_columnInfo:(x,z)=>({...sample,height:40+Math.abs(x+z)%4})},1,-2),null);
});

test('old terrain versions remain unchanged; new cross-chunk chests survive eviction, edits and save reload',()=>{
  for(const version of [1,2,3]){
    const legacy=new World(64,null,null,{generatorVersion:version});
    assert.equal(legacy.discoveryVersion,0);assert.deepEqual(legacy.getLandDiscoveriesNear(0,0,200),[]);legacy.dispose();
  }
  const w=new World(64,null,null,{generatorVersion:3,discoveryVersion:1}),d=w.getLandDiscoveryForRegion(-4,-4);
  assert.equal(d.kind,'quarry_rig');
  const [x,y,z]=[d.chest.x,d.chest.y,d.chest.z];
  const chunk=w.ensurePositionGenerated(x,z),original=chunk.blocks.slice();
  assert.equal(w.getBlock(x,y,z),BLOCK.CHEST);assert.equal(w.getBlock(x,y-1,z),BLOCK.STONE_BRICK);
  w._removeChunk(chunk.key,chunk,false);w._discoveryCache.clear();
  assert.deepEqual(w.ensurePositionGenerated(x,z).blocks,original);
  w.setBlock(x,y,z,BLOCK.AIR);const edits=w.serializeEdits();
  const restored=new World(64,null,null,{generatorVersion:3,discoveryVersion:1});restored.loadEdits(edits);restored.ensurePositionGenerated(x,z);
  assert.equal(restored.getBlock(x,y,z),BLOCK.AIR);assert.equal(restored.getLandDiscoveryChest(x,y,z),null);
  w.dispose();restored.dispose();
});

test('Blender exports are finite, distinct, grounded voxel meshes with matching collision volumes',()=>{
  for(const [kind,asset]of Object.entries(DISCOVERY_ASSETS)){
    assert.ok(asset.position.length>500*9);assert.equal(asset.normal.length,asset.position.length);assert.equal(asset.color.length,asset.position.length);
    assert.ok(asset.position.every(Number.isFinite));assert.ok(asset.colliders.length>20);
    const ys=asset.position.filter((_,i)=>i%3===1);assert.ok(Math.min(...ys)>=-.001,kind);assert.ok(Math.max(...ys)>4.4,kind);
    assert.ok(asset.colliders.every(b=>b.y-b.height/2>=-.001));
  }
  assert.notDeepEqual(DISCOVERY_ASSETS.bell_shrine.position,DISCOVERY_ASSETS.quarry_rig.position);
});

test('local chest inspection moves nothing; choosing one item preserves all other loot and persistent empty receipts',()=>{
  const w=new World(64,null,null,{generatorVersion:3,discoveryVersion:1}),d=w.getLandDiscoveryForRegion(1,-2);
  w.ensurePositionGenerated(d.chest.x,d.chest.z);
  const inv=new Inventory();inv.slots=Array.from({length:36},()=>({id:0,count:0}));
  const untouched=inv.serialize(),preview=inspectDiscoveryLoot(w,inv,d.chest),loot=discoveryLoot(w.seed,d);
  assert.equal(preview.ok,true);assert.deepEqual(preview.remaining,loot);
  assert.deepEqual(inv.serialize(),untouched);assert.deepEqual(w.discoveryLoot,{});
  preview.remaining[0].count=99;
  assert.deepEqual(inspectDiscoveryLoot(w,inv,d.chest).remaining,loot,'preview snapshots cannot change the chest');
  const selected=claimDiscoveryLoot(w,inv,d.chest,loot[1].id);
  assert.equal(selected.ok,true);assert.deepEqual(selected.items,[loot[1]]);
  assert.deepEqual(selected.remaining,loot.filter(s=>s.id!==loot[1].id));
  assert.equal(claimDiscoveryLoot(w,inv,d.chest,loot[1].id).stale,true,'a stale item identity cannot select the next row');
  const initial=claimDiscoveryLoot(w,inv,d.chest);assert.equal(initial.ok,true);assert.equal(initial.items.length,loot.length-1);
  const before=inv.serialize();assert.equal(claimDiscoveryLoot(w,inv,d.chest).empty,true);assert.deepEqual(inv.serialize(),before);
  const ledger=JSON.parse(JSON.stringify(w.discoveryLoot));w._discoveryCache.clear();w.discoveryLoot=ledger;
  assert.equal(claimDiscoveryLoot(w,inv,d.chest).empty,true);
  const full={slots:[{id:BLOCK.STONE,count:99}]};
  assert.equal(transferDiscoveryLoot(full,loot).full,true);assert.deepEqual(transferDiscoveryLoot(full,loot).remaining,loot);
  const large=loot.find(stack=>stack.count>1),partial=transferDiscoveryLoot({slots:[{id:large.id,count:98}]},loot);
  assert.equal(partial.items[0].count,1);assert.equal(partial.remaining.find(s=>s.id===large.id).count,large.count-1);assert.equal(partial.remaining.length,loot.length);
  w.dispose();
});

test('loot selects different item combinations per region and seed, remains deterministic and has no duplicate rows',()=>{
  for(const kind of ['bell_shrine','quarry_rig']){
    const combinations=new Set();
    for(let regionX=0;regionX<48;regionX++){
      const d={kind,regionX,regionZ:-3},loot=discoveryLoot(64,d);
      assert.deepEqual(loot,discoveryLoot(64,d));
      assert.ok(loot.length>=3&&loot.length<=5);
      assert.equal(new Set(loot.map(s=>s.id)).size,loot.length);
      assert.ok(loot.every(s=>s.id!==BLOCK.CHEST&&s.count>0&&s.count<=99));
      combinations.add(loot.map(s=>s.id).sort((a,b)=>a-b).join(','));
    }
    assert.ok(combinations.size>25,`${kind}: ${combinations.size} combinations`);
    const d={kind,regionX:1,regionZ:-2};assert.notDeepEqual(discoveryLoot(64,d),discoveryLoot(128,d));
  }
});

test('stored old-rate chest contents and empty receipts retain their placement without rerolling',()=>{
  const world=new World(64,null,null,{generatorVersion:3,discoveryVersion:1});
  assert.equal(world.getLandDiscoveryForRegion(-1,-1),null);
  world.discoveryLoot={'land1:-1:-1':[{id:BLOCK.TORCH,count:2}]};world._discoveryCache.clear();
  const d=world.getLandDiscoveryForRegion(-1,-1);assert.ok(d);
  world.ensurePositionGenerated(d.chest.x,d.chest.z);
  const inv=new Inventory(),preview=inspectDiscoveryLoot(world,inv,d.chest);
  assert.deepEqual(preview.remaining,[{id:BLOCK.TORCH,count:2}]);
  assert.equal(claimDiscoveryLoot(world,inv,d.chest).ok,true);
  world._discoveryCache.clear();
  assert.deepEqual(world.getLandDiscoveryForRegion(-1,-1),d);
  assert.equal(inspectDiscoveryLoot(world,inv,d.chest).empty,true);
  const saved={seed:64,generatorVersion:3,discoveryVersion:1,discoveryLoot:world.discoveryLoot,blocks:{},players:{owner:{inventory:inv.serialize()}}};
  const verifier=createDiscoveryVerifier(saved);
  assert.equal(inspectSavedDiscoveryLoot(saved,'owner',{position:[d.chest.x,d.chest.y+1,d.chest.z]},d.chest,verifier).empty,true);
  verifier.dispose();world.dispose();
});

test('selected partial/full transfers and invalid selectors never discard or reroll saved contents',()=>{
  const stacks=[{id:BLOCK.TORCH,count:6},{id:BLOCK.COALSTONE,count:7},{id:BLOCK.IRON_ORE,count:3}];
  const inventory={slots:[{id:BLOCK.COALSTONE,count:98},{id:BLOCK.STONE,count:99}]};
  const partial=transferDiscoveryLoot(inventory,stacks,BLOCK.COALSTONE);
  assert.deepEqual(partial.items,[{id:BLOCK.COALSTONE,count:1}]);
  assert.deepEqual(partial.remaining,[stacks[0],{id:BLOCK.COALSTONE,count:6},stacks[2]]);
  assert.deepEqual(inventory.slots,[{id:BLOCK.COALSTONE,count:98},{id:BLOCK.STONE,count:99}]);
  assert.equal(transferDiscoveryLoot(partial.inventory,partial.remaining,BLOCK.COALSTONE).full,true);
  for(const itemId of [0,-1,1.2,'10',null,4097]){
    const rejected=transferDiscoveryLoot(inventory,stacks,itemId);assert.equal(rejected.invalid,true);assert.deepEqual(rejected.remaining,stacks);assert.deepEqual(rejected.inventory,inventory);
  }
  const world=new World(64,null,null,{generatorVersion:3,discoveryVersion:1}),d=world.getLandDiscoveryForRegion(1,-2);
  const saved={seed:64,generatorVersion:3,discoveryVersion:1,discoveryLoot:{[d.key]:stacks},blocks:{},players:{owner:{inventory}}};
  const pose={position:[d.chest.x,d.chest.y+1,d.chest.z]},before=structuredClone(saved);
  assert.equal(applyDiscoveryLootClaim(saved,'owner',pose,{...d.chest,itemId:BLOCK.TORCH},world).full,true);
  assert.deepEqual(saved,before);
  assert.throws(()=>applyDiscoveryLootClaim(saved,'owner',pose,{...d.chest,itemId:'10'},world),/Invalid chest item/);
  assert.throws(()=>inspectSavedDiscoveryLoot(saved,'owner',{position:[NaN,0,0]},d.chest,world),/Move closer/);
  saved.blocks[`${d.chest.x},${d.chest.y},${d.chest.z}`]=BLOCK.AIR;
  assert.throws(()=>inspectSavedDiscoveryLoot(saved,'owner',pose,d.chest,world),/removed/);world.dispose();
});

test('real socket inspections are read-only; item claims race atomically and persist across reload',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'worldloom-loot-')),options={localFile:join(dir,'worlds.json')};
  const store=createWorldStore(options);await store.initialize();
  const users=[{id:randomUUID(),emailVerifiedAt:new Date().toISOString(),displayName:'Owner'},{id:randomUUID(),emailVerifiedAt:new Date().toISOString(),displayName:'Guest'}];
  const revoked=new Set(),accounts={isReady:true,findSession:async id=>revoked.has(id)?null:({userId:id,createdAt:new Date().toISOString(),expiresAt:Date.now()+86_400_000}),findUserById:async id=>users.find(u=>u.id===id)};
  const world=new World(64,null,null,{generatorVersion:3,discoveryVersion:1}),d=world.getLandDiscoveryForRegion(1,-2),cell=d.chest,loot=discoveryLoot(64,d);
  const personal={player:{position:[cell.x+.5,cell.y+1,cell.z+2]},inventory:{selected:0,slots:Array.from({length:36},()=>({id:0,count:0}))}};
  const saved=await store.create(users[0].id,{name:'Loot test',seed:64,mode:'survival',generatorVersion:3,discoveryVersion:1,guestId:users[1].id,accepted:true,players:Object.fromEntries(users.map(u=>[u.id,structuredClone(personal)])),blocks:{},fluids:{},drops:{},receipts:[]});
  const app=express(),server=createServer(app),io=new Server(server),sockets=[];
  const service=installWorldServer({app,io,store,accounts,authenticate:(_,__,next)=>next(),verified:(_,__,next)=>next(),hashToken:x=>x,rateLimit:(_,__,next)=>next()});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const request=(socket,event,payload)=>new Promise((resolve,reject)=>socket.timeout(5000).emit(event,payload,(e,r)=>e?reject(e):resolve(r)));
  try{
    for(const u of users){const s=connect(`http://127.0.0.1:${server.address().port}/worldloom`,{auth:{token:u.id,worldId:saved.id},reconnection:false});sockets.push(s);await new Promise((resolve,reject)=>{s.on('connect',resolve);s.on('connect_error',reject);});}
    const pose=position=>({position,velocity:[0,0,0],yaw:0,pitch:0});
    sockets[0].emit('pose',pose([0,70,0]));
    assert.equal((await request(sockets[0],'inspect-loot',cell)).status,409);
    await new Promise(r=>setTimeout(r,110));
    for(const s of sockets)s.emit('pose',pose(personal.player.position));
    const inspected=await request(sockets[0],'inspect-loot',cell);
    assert.equal(inspected.ok,true);assert.deepEqual(inspected.remaining,loot);assert.deepEqual(inspected.inventory,personal.inventory);
    assert.deepEqual(await store.get(saved.id),saved,'opening a chest does not persist a revision, receipt, or inventory');
    const results=await Promise.all(sockets.map(s=>request(s,'claim-loot',{...cell,itemId:loot[1].id})));
    assert.equal(results.filter(r=>r.ok).length,1,JSON.stringify(results));assert.equal(results.filter(r=>r.stale).length,1);
    for(const r of results)assert.deepEqual(r.remaining,loot.filter(s=>s.id!==loot[1].id));
    let reopened=createWorldStore(options);await reopened.initialize();let persisted=await reopened.get(saved.id);
    assert.deepEqual(persisted.discoveryLoot[d.key],loot.filter(s=>s.id!==loot[1].id));
    assert.equal(Object.values(persisted.players).flatMap(p=>p.inventory.slots).reduce((sum,s)=>sum+s.count,0),loot[1].count);
    await new Promise(r=>setTimeout(r,220));
    assert.equal((await request(sockets[0],'claim-loot',{...cell,itemId:'17'})).status,400);
    await new Promise(r=>setTimeout(r,220));
    assert.equal((await request(sockets[0],'claim-loot',cell)).ok,true);
    reopened=createWorldStore(options);await reopened.initialize();persisted=await reopened.get(saved.id);
    assert.deepEqual(persisted.discoveryLoot[d.key],[]);
    const total=Object.values(persisted.players).flatMap(p=>p.inventory.slots).reduce((sum,s)=>sum+s.count,0);
    assert.equal(total,loot.reduce((sum,s)=>sum+s.count,0));
    await new Promise(r=>setTimeout(r,220));
    assert.equal((await request(sockets[0],'claim-loot',cell)).empty,true);
    await new Promise(r=>setTimeout(r,220));
    assert.equal((await request(sockets[0],'claim-loot',{...cell,x:cell.x+1})).status,409);
    revoked.add(users[1].id);
    assert.equal((await request(sockets[1],'inspect-loot',cell)).status,401);
    assert.equal((await request(sockets[1],'claim-loot',cell)).status,401);
  }finally{for(const s of sockets)s.disconnect();service.close();await io.close();await new Promise(r=>server.close(r));world.dispose();await rm(dir,{recursive:true,force:true});}
});
