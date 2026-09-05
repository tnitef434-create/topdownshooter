import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID,createHash } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { io as connect } from 'socket.io-client';
import { createAccountStore } from '../accountStore.js';
import { createWorldStore } from '../worldStore.js';
import { installWorldServer } from '../worldServer.js';
import { packEdits,unpackEdits,personalSave } from '../src/public/worldloom/src/shared-world.js';

const hash=value=>createHash('sha256').update(value).digest('hex');
const baseInput={name:'Our valley',seed:42,mode:'builder',generatorVersion:3,ownerName:'Owner',guestId:null,accepted:false,players:{},blocks:{},fluids:{},drops:{},receipts:[]};
const personal={player:{position:[0,40,0],velocity:[0,0,0],yaw:0,pitch:0},inventory:{selected:0,slots:[{id:0,count:0},{id:0,count:0}]},flags:{},survival:{}};
async function fixture(postgres=false){
  const dir=await mkdtemp(join(tmpdir(),'worldloom-mp-')),db=postgres?new PGlite():null;
  const sqlClient=db?async(strings,...values)=>{let query=strings[0];for(let i=0;i<values.length;i++)query+=`$${i+1}`+strings[i+1];return(await db.query(query,values)).rows;}:null;
  const accounts=createAccountStore({sqlClient,localFile:join(dir,'accounts.json')});await accounts.initialize();
  const users=[];
  for(let i=0;i<3;i++){
    const id=randomUUID();await accounts.createUser({id,email:`${id}@example.invalid`,displayName:['Owner','Friend','Stranger'][i],password:{algorithm:'scrypt',salt:'salt',hash:'hash'},credits:0,purchasedWeapons:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
    const token=hash(id);await accounts.reserveEmailVerification(id,token,Date.now()+100_000);await accounts.consumeEmailVerification(token,{algorithm:'scrypt',salt:'salt',hash:'hash'});
    const user=await accounts.generateFriendCode(id);users.push(user);await accounts.createSession(hash(`session-${id}`),id,Date.now()+100_000);
  }
  const options={sqlClient,localFile:join(dir,'worlds.json')};const store=createWorldStore(options);await store.initialize();
  return {dir,db,accounts,users,store,options,async close(){if(db)await db.close();await rm(dir,{recursive:true,force:true});}};
}
for(const backend of ['local','postgresql'])test(`${backend}: ten-world quota, membership, restart persistence and optimistic revisions`,async()=>{
  const f=await fixture(backend==='postgresql');
  try{
    await f.store.initialize();
    const [owner,friend,stranger]=f.users;
    const outcomes=await Promise.allSettled(Array.from({length:14},()=>f.store.create(owner.id,{...baseInput,guestId:friend.id})));
    assert.equal(outcomes.filter(r=>r.status==='fulfilled').length,10);
    const w=outcomes.find(r=>r.status==='fulfilled').value;
    await assert.rejects(f.store.mutate(w.id,stranger.id,x=>{x.name='hijack';}),{status:404});
    await assert.rejects(f.store.mutate(w.id,friend.id,x=>{x.name='before accepting';}),{status:404});
    await f.store.mutate(w.id,friend.id,x=>{x.accepted=true;},{invited:true});
    await Promise.all(Array.from({length:8},(_,i)=>f.store.mutate(w.id,i%2?friend.id:owner.id,x=>{x.blocks[`${i},5,0`]=i;})));
    assert.equal(Object.keys((await f.store.get(w.id)).blocks).length,8);
    const reopened=createWorldStore(f.options);await reopened.initialize();assert.equal(Object.keys((await reopened.get(w.id)).blocks).length,8);
    if(f.db){await Promise.all([f.store.mutate(w.id,owner.id,x=>{x.blocks['20,5,0']=1;}),reopened.mutate(w.id,friend.id,x=>{x.blocks['21,5,0']=2;})]);assert.equal(Object.keys((await f.store.get(w.id)).blocks).length,10);}
    await assert.rejects(f.store.remove(w.id,friend.id),{status:404});await f.store.remove(w.id,owner.id);assert.equal(await f.store.get(w.id),null);
    await f.store.create(owner.id,baseInput);assert.equal((await f.store.list(owner.id)).length,10);
    await assert.rejects(f.store.mutate(w.id,owner.id,x=>x),{status:404});
  }finally{await f.close();}
});
test('edit format preserves negative chunk boundaries and independent inventories',()=>{
  const blocks={'-17,5,-1':4,'16,94,16':7,'0,1,0':0},fluids={'16,94,16':3};
  assert.deepEqual(unpackEdits(packEdits(42,blocks,fluids)),{blocks,fluids});
  const saved=personalSave({...personal,world:{chunks:['must not overwrite terrain']},seed:999});assert.equal(saved.world,undefined);assert.equal(saved.seed,undefined);
  assert.throws(()=>personalSave({...personal,inventory:{slots:[{id:1,count:-1}]}}));
});

test('two live clients: invites, ordered edits, idempotent retries, exclusive pickup and joining without the owner',async()=>{
  const f=await fixture();const app=express(),server=createServer(app),io=new Server(server);app.use(express.json());
  const authenticate=async(req,res,next)=>{const token=req.headers.authorization?.slice(7),session=token?await f.accounts.findSession(hash(token)):null;const user=session&&await f.accounts.findUserById(session.userId);if(!user)return res.status(401).json({message:'Sign in'});req.account=user;next();};
  const service=installWorldServer({app,io,store:f.store,accounts:f.accounts,authenticate,verified:(_,__,next)=>next(),hashToken:hash,rateLimit:(_,__,next)=>next()});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;
  const sockets=[];
  const api=async(user,path,body)=>{const res=await fetch(origin+path,{method:body?'POST':'GET',headers:{Authorization:`Bearer session-${user.id}`,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});return{status:res.status,data:await res.json()};};
  const request=(socket,event,data={})=>new Promise((resolve,reject)=>socket.timeout(3000).emit(event,data,(error,response)=>error?reject(error):resolve(response)));
  const client=async(user,worldId)=>{const socket=connect(origin+'/worldloom',{auth:{token:`session-${user.id}`,worldId},reconnection:false});sockets.push(socket);await new Promise((resolve,reject)=>{socket.on('connect',resolve);socket.on('connect_error',reject);});return socket;};
  const packet=extra=>({id:randomUUID(),edits:[],dropAdds:[],personal:structuredClone(personal),...extra});
  try{
    const [owner,friend,stranger]=f.users;
    const imported=await api(owner,'/api/worlds',{name:'Browser copy',seed:42,mode:'builder',importSave:{...personal,seed:42,world:packEdits(42,{'-1,5,0':7}),droppedItems:[{id:1,count:2,position:[0,40,0]}]}});
    assert.equal(imported.status,201);const importedWorld=await f.store.get(imported.data.world.id);assert.equal(importedWorld.blocks['-1,5,0'],7);assert.equal(Object.values(importedWorld.drops)[0].count,2);assert.deepEqual(importedWorld.players[owner.id].inventory,personal.inventory);
    const created=await api(owner,'/api/worlds',{name:'Shared valley',seed:42,mode:'builder',friendCode:friend.friendCode});assert.equal(created.status,201);const id=created.data.world.id;
    assert.equal((await api(friend,'/api/worlds')).data.invites.length,1);
    assert.equal((await api(stranger,`/api/worlds/${id}/join`,{})).status,404);
    await assert.rejects(client(stranger,id));
    assert.equal((await api(friend,`/api/worlds/${id}/join`,{})).status,200);
    const a=await client(owner,id),b=await client(friend,id);
    const snap=await request(a,'snapshot');assert.equal(snap.players.length,2);assert.equal(snap.leader,owner.id);
    const first=packet({edits:[{x:0,y:5,z:0,before:1,id:4}]});assert.equal((await request(a,'commit',first)).ok,true);
    assert.equal((await request(a,'commit',first)).ok,true,'retry does not mine or award twice');
    const conflict=await request(b,'commit',packet({edits:[{x:0,y:5,z:0,before:1,id:7}]}));assert.equal(conflict.error,true);
    await request(b,'commit',packet({personal:{...personal,player:{...personal.player,position:[1,40,0]}},edits:[{x:1,y:5,z:0,before:1,id:7}]}));
    const saved=await request(b,'snapshot');assert.equal(saved.blocks['0,5,0'],4);assert.equal(saved.blocks['1,5,0'],7);assert.deepEqual(saved.save.player.position,[1,40,0]);assert.deepEqual((await request(a,'snapshot')).save.player.position,[0,40,0]);
    const flower={x:10,y:6,z:10,before:0,id:33,simulation:true,decoration:true};
    assert.equal((await request(b,'commit',packet({edits:[flower]}))).ok,true,'guest can materialize deterministic flowers near their own location');
    assert.equal((await request(a,'commit',packet({edits:[flower]}))).ok,true,'matching deterministic decoration is idempotent');
    assert.equal((await request(b,'commit',packet({edits:[{x:11,y:6,z:10,before:0,id:9,simulation:true}]}))).error,true,'two clients cannot run competing fluid simulations');
    const key=randomUUID();await request(a,'commit',packet({dropAdds:[{key,id:1,count:3,position:[0,40,0],velocity:[0,0,0]}]}));
    const pose={position:[0,40,0],velocity:[0,0,0],yaw:0,pitch:0};a.emit('pose',pose);b.emit('pose',pose);
    const pickups=await Promise.all([request(a,'pickup',{key}),request(b,'pickup',{key})]);assert.equal(pickups.filter(p=>p.ok).length,1,'a loose stack can be claimed only once');
    a.disconnect();await new Promise(resolve=>setTimeout(resolve,30));assert.equal((await request(b,'snapshot')).leader,friend.id);
    await request(b,'commit',packet({edits:[{x:2,y:5,z:0,before:1,id:8}]}));b.disconnect();
    const alone=await client(friend,id);assert.equal((await request(alone,'snapshot')).blocks['2,5,0'],8,'guest can reopen while owner is offline');
    assert.equal((await api(friend,`/api/worlds/${id}/delete`,{})).status,404);
    assert.equal((await api(owner,`/api/worlds/${id}/delete`,{})).status,200);
    await assert.rejects(client(friend,id));
  }finally{for(const socket of sockets)socket.disconnect();service.close();await new Promise(resolve=>io.close(resolve));await f.close();}
});
