import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
import {createAccountStore} from '../accountStore.js';
import {normalizeUsername,accountPlayerName} from '../accountUsername.js';
import {installShooterAccountIdentity} from '../shooterAccountIdentity.js';

test('usernames are bounded plain names and never expose legacy email prefixes',()=>{
  for(const value of [null,{},'aa','a'.repeat(16),'two words','<script>','åbc','abc\nxyz'])assert.throws(()=>normalizeUsername(value),{code:'INVALID_USERNAME'});
  assert.equal(normalizeUsername('  Moon_24  '),'Moon_24');
  assert.equal(accountPlayerName({displayName:'privateEmail',emailVerifiedAt:'today'}),'Guest');
  assert.equal(accountPlayerName({username:'Moon_24'}),'Guest');
  assert.equal(accountPlayerName({username:'Moon_24',emailVerifiedAt:'today'}),'Moon_24');
});

for(const backend of ['local','postgresql'])test(`${backend}: usernames persist, migrate existing users, and reject case-insensitive races`,async()=>{
  const dir=await mkdtemp(join(tmpdir(),'unpaused-username-')),db=backend==='postgresql'?new PGlite():null;
  const sqlClient=db?async(strings,...values)=>(await db.query(strings.reduce((s,v,i)=>s+(i?`$${i}`:'')+v,''),values)).rows:null;
  const options={localFile:join(dir,'accounts.json'),sqlClient},store=createAccountStore(options);
  const user=(name)=>({id:randomUUID(),email:`${randomUUID()}@example.invalid`,displayName:'legacyEmailPrefix',...(name?{username:name}:{}),password:{algorithm:'scrypt',salt:'test',hash:'test'},credits:0,purchasedWeapons:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
  try {
    await store.initialize();assert.equal(store.isReady,true);
    const legacy=await store.createUser(user()),other=await store.createUser(user('OtherPlayer'));
    await store.createSession('persistent-session',legacy.id);
    assert.equal(legacy.username,null);
    const chosen=await store.setUsername(legacy.id,'NewPlayer');assert.equal(chosen.username,'NewPlayer');
    await assert.rejects(store.setUsername(other.id,'newplayer'),{code:'USERNAME_TAKEN'});
    await assert.rejects(store.createUser(user('NEWPLAYER')),{code:'USERNAME_TAKEN'});
    await assert.rejects(store.setUsername(legacy.id,'a b'),{code:'INVALID_USERNAME'});
    const race=await Promise.allSettled([store.setUsername(legacy.id,'RaceName'),store.setUsername(other.id,'racename')]);
    assert.equal(race.filter(r=>r.status==='fulfilled').length,1);
    assert.equal(race.find(r=>r.status==='rejected').reason.code,'USERNAME_TAKEN');
    const reopened=createAccountStore(options);await reopened.initialize();await reopened.initialize();assert.equal(reopened.isReady,true);
    assert.equal((await reopened.findUserById(legacy.id)).username,'RaceName');
    assert.equal((await reopened.findSession('persistent-session')).userId,legacy.id,'changing name preserves sign-in');
  }finally{await db?.close();await rm(dir,{recursive:true,force:true});}
});

test('shooter identity overrides spoofed names, refreshes account names, and honors sign-out without reconnecting',async()=>{
  let connection,middleware,packetMiddleware;
  const io={use(fn){middleware=fn;},on(event,fn){connection=fn;}};
  let user={username:'Owner',emailVerifiedAt:'today'};
  installShooterAccountIdentity(io,{accounts:{findSession:async token=>token==='a'.repeat(43)?{userId:'id',expiresAt:null}:null,findUserById:async()=>user},hashToken:t=>t});
  const socket={handshake:{auth:{accountToken:'a'.repeat(43)}},data:{},emit(){},use(fn){packetMiddleware=fn;}};
  await new Promise((resolve,reject)=>middleware(socket,error=>error?reject(error):resolve()));connection(socket);
  const send=packet=>new Promise(resolve=>packetMiddleware(packet,()=>resolve(packet[1])));
  assert.equal((await send(['create-room',{playerName:'Impersonated'}])).playerName,'Owner');
  user.username='NewOwner';assert.equal((await send(['chat-message',{name:'Spoof'}])).name,'NewOwner');
  await send(['account-session',{token:null}]);
  assert.equal((await send(['join-room',{playerName:'Owner'}])).playerName,'Guest');
  await send(['account-session',{token:'b'.repeat(43)}]);
  assert.equal((await send(['change-name',{name:'Fake'}])).name,'Guest');
});
