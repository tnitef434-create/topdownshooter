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
import { discoveryPlacementForRegion,discoverySpawnRoll } from '../src/public/worldloom/src/land-discoveries.js';
import { discoveryLoot,claimDiscoveryLoot,transferDiscoveryLoot } from '../src/public/worldloom/src/discovery-loot.js';
import { DISCOVERY_ASSETS } from '../src/public/worldloom/src/discovery-assets.js';
import { createWorldStore } from '../worldStore.js';
import { installWorldServer } from '../worldServer.js';

test('exact 25% deterministic region policy on eligible land; wet/cave/cliff sites are rejected',()=>{
  const sample={height:40,pondId:null,caveMouth:false,riverStrength:0,rockiness:0};
  const flat={seed:64,discoveryVersion:1,seaLevel:32,worldHeight:96,_columnInfo:()=>sample,_isCave:()=>false};
  let spawned=0;const kinds=new Set();
  for(let z=-50;z<50;z++)for(let x=-50;x<50;x++){
    const d=discoveryPlacementForRegion(flat,x,z);
    assert.equal(Boolean(d),discoverySpawnRoll(64,x,z)<.25);
    if(d){spawned++;kinds.add(d.kind);assert.deepEqual(d,discoveryPlacementForRegion(flat,x,z));}
  }
  assert.ok(spawned>2400&&spawned<2600,`${spawned}/10000`);assert.equal(kinds.size,2);
  for(const patch of [{height:32},{pondId:'pond'},{caveMouth:true},{riverStrength:.7},{rockiness:.9}]){
    assert.equal(discoveryPlacementForRegion({...flat,_columnInfo:()=>({...sample,...patch})},-1,-1),null);
  }
  assert.equal(discoveryPlacementForRegion({...flat,_isCave:()=>true},-1,-1),null);
  assert.equal(discoveryPlacementForRegion({...flat,_columnInfo:(x,z)=>({...sample,height:40+Math.abs(x+z)%4})},-1,-1),null);
});

test('old terrain versions remain unchanged; new cross-chunk chests survive eviction, edits and save reload',()=>{
  for(const version of [1,2,3]){
    const legacy=new World(64,null,null,{generatorVersion:version});
    assert.equal(legacy.discoveryVersion,0);assert.deepEqual(legacy.getLandDiscoveriesNear(0,0,200),[]);legacy.dispose();
  }
  const w=new World(64,null,null,{generatorVersion:3,discoveryVersion:1}),d=w.getLandDiscoveryForRegion(1,-4);
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

test('local loot persists empty receipts and partial transfers without losing full-inventory items',()=>{
  const w=new World(64,null,null,{generatorVersion:3,discoveryVersion:1}),d=w.getLandDiscoveryForRegion(-1,-1);
  w.ensurePositionGenerated(d.chest.x,d.chest.z);
  const inv=new Inventory();inv.slots=Array.from({length:36},()=>({id:0,count:0}));
  const initial=claimDiscoveryLoot(w,inv,d.chest);assert.equal(initial.ok,true);assert.equal(initial.items.length,4);
  const before=inv.serialize();assert.equal(claimDiscoveryLoot(w,inv,d.chest).empty,true);assert.deepEqual(inv.serialize(),before);
  const ledger=JSON.parse(JSON.stringify(w.discoveryLoot));w._discoveryCache.clear();w.discoveryLoot=ledger;
  assert.equal(claimDiscoveryLoot(w,inv,d.chest).empty,true);
  const loot=discoveryLoot(w.seed,d),full={slots:[{id:BLOCK.STONE,count:99}]};
  assert.equal(transferDiscoveryLoot(full,loot).full,true);assert.deepEqual(transferDiscoveryLoot(full,loot).remaining,loot);
  const partial=transferDiscoveryLoot({slots:[{id:loot[0].id,count:98}]},loot);
  assert.equal(partial.items[0].count,1);assert.equal(partial.remaining[0].count,loot[0].count-1);assert.equal(partial.remaining.length,4);
  w.dispose();
});

test('two real sockets claim one chest atomically; server checks range, identity and persistent empty receipt',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'worldloom-loot-')),options={localFile:join(dir,'worlds.json')};
  const store=createWorldStore(options);await store.initialize();
  const users=[{id:randomUUID(),emailVerifiedAt:new Date().toISOString(),displayName:'Owner'},{id:randomUUID(),emailVerifiedAt:new Date().toISOString(),displayName:'Guest'}];
  const accounts={isReady:true,findSession:async id=>({userId:id,createdAt:new Date().toISOString(),expiresAt:Date.now()+86_400_000}),findUserById:async id=>users.find(u=>u.id===id)};
  const world=new World(64,null,null,{generatorVersion:3,discoveryVersion:1}),d=world.getLandDiscoveryForRegion(-1,-1),cell=d.chest;
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
    assert.equal((await request(sockets[0],'claim-loot',cell)).status,409);
    await new Promise(r=>setTimeout(r,220));
    for(const s of sockets)s.emit('pose',pose(personal.player.position));
    const results=await Promise.all(sockets.map(s=>request(s,'claim-loot',cell)));
    assert.equal(results.filter(r=>r.ok).length,1,JSON.stringify(results));assert.equal(results.filter(r=>r.empty).length,1);
    const reopened=createWorldStore(options);await reopened.initialize();const persisted=await reopened.get(saved.id);
    assert.deepEqual(persisted.discoveryLoot[d.key],[]);
    const total=Object.values(persisted.players).flatMap(p=>p.inventory.slots).reduce((sum,s)=>sum+s.count,0);
    assert.equal(total,discoveryLoot(64,d).reduce((sum,s)=>sum+s.count,0));
    await new Promise(r=>setTimeout(r,220));
    assert.equal((await request(sockets[0],'claim-loot',cell)).empty,true);
    await new Promise(r=>setTimeout(r,220));
    assert.equal((await request(sockets[0],'claim-loot',{...cell,x:cell.x+1})).status,409);
  }finally{for(const s of sockets)s.disconnect();service.close();await io.close();await new Promise(r=>server.close(r));world.dispose();await rm(dir,{recursive:true,force:true});}
});
