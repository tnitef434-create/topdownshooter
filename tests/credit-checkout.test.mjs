import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID, createHash } from 'node:crypto';
import { createServer } from 'node:net';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { createAccountStore } from '../accountStore.js';
import { creditCheckoutAvailability, CREDIT_CHECKOUT_PAUSED_MESSAGE } from '../creditCheckout.js';

test('checkout stays closed unless the operator explicitly enables it',()=>{
  for(const setting of [undefined,'','false','0','1','yes','TRUE',' true ']){
    assert.deepEqual(creditCheckoutAvailability({CREDIT_CHECKOUT_ENABLED:setting}),{available:false,code:'CHECKOUT_PAUSED',message:CREDIT_CHECKOUT_PAUSED_MESSAGE});
  }
  assert.equal(creditCheckoutAvailability({CREDIT_CHECKOUT_ENABLED:'true'}).available,true);
});

async function localCheckoutServer(setting){
  const dir=await mkdtemp(join(tmpdir(),'unpaused-checkout-'));
  const localFile=join(dir,'accounts.json'),store=createAccountStore({localFile});
  await store.initialize();
  const now=new Date().toISOString(),user={id:randomUUID(),email:'owner@example.invalid',username:'CheckoutKeeper',displayName:'CheckoutKeeper',emailVerifiedAt:now,password:{algorithm:'scrypt',salt:'local-test',hash:'local-test'},credits:123,purchasedWeapons:['starter'],createdAt:now,updatedAt:now};
  await store.createUser(user);
  const token=randomUUID();await store.createSession(createHash('sha256').update(token).digest('hex'),user.id);
  const probe=createServer();await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve));
  const port=probe.address().port;await new Promise(resolve=>probe.close(resolve));
  const origin=`http://127.0.0.1:${port}`;
  const env={...process.env,PORT:String(port),NODE_ENV:'test',RENDER:'false',DATABASE_URL:'',RESEND_API_KEY:'',GOOGLE_CLIENT_ID:'',ADMIN_USERNAME:'checkout-test-admin',ADMIN_PASSWORD:'local-test-only-password',LOCAL_ACCOUNT_DATABASE_FILE:localFile,LOCAL_WORLD_DATABASE_FILE:join(dir,'worlds.json'),LOCAL_USERS_DATABASE_FILE:join(dir,'users.json'),REVOLUT_50_CREDIT_LINK:'https://example.invalid/checkout/50',REVOLUT_500_CREDIT_LINK:'https://example.invalid/checkout/500'};
  if(setting===undefined)delete env.CREDIT_CHECKOUT_ENABLED;else env.CREDIT_CHECKOUT_ENABLED=setting;
  const child=spawn(process.execPath,['server.js'],{cwd:dirname(dirname(fileURLToPath(import.meta.url))),windowsHide:true,stdio:['ignore','pipe','pipe'],env});
  let output='',spawnError;child.stdout.on('data',data=>{output+=data;});child.stderr.on('data',data=>{output+=data;});child.on('error',error=>{spawnError=error;});
  async function close(){if(child.exitCode===null&&!spawnError){const exited=new Promise(resolve=>child.once('exit',resolve));child.kill();await exited;}await rm(dir,{recursive:true,force:true});}
  async function request(path,body,session=token){
    const response=await fetch(origin+path,{method:body===undefined?'GET':'POST',headers:{...(body===undefined?{}:{'Content-Type':'application/json'}),...(session?{Authorization:`Bearer ${session}`}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
    return {status:response.status,cache:response.headers.get('cache-control'),data:await response.json().catch(()=>null)};
  }
  try{
    for(let i=0;i<100;i++){
      if(spawnError)throw spawnError;
      if(child.exitCode!==null)throw new Error(`Isolated checkout server exited: ${output}`);
      try{if((await fetch(origin+'/api/auth/status')).ok)return {request,close,localFile,user,token};}catch{}
      await delay(50);
    }
    throw new Error(`Isolated checkout server did not start: ${output}`);
  }catch(error){await close();throw error;}
}

for(const setting of [undefined,'false'])test(`HTTP: both credit packages are blocked with ${setting===undefined?'default':'explicit'} pause and balances remain intact`,async()=>{
  const fixture=await localCheckoutServer(setting);
  try{
    const status=await fixture.request('/api/credits/status',undefined,null);
    assert.equal(status.status,200);assert.equal(status.cache,'no-store');
    assert.equal(status.data.available,false);assert.equal(status.data.code,'CHECKOUT_PAUSED');
    assert.deepEqual((await fixture.request('/api/auth/status',undefined,null)).data.creditCheckout,status.data);
    const before=JSON.parse(await readFile(fixture.localFile,'utf8'));
    for(const packageId of ['50','500']){
      const result=await fixture.request('/api/credits/checkout',{packageId});
      assert.equal(result.status,503);assert.equal(result.cache,'no-store');
      assert.deepEqual(result.data,{error:'CHECKOUT_PAUSED',message:CREDIT_CHECKOUT_PAUSED_MESSAGE});
      assert.equal(result.data.checkoutUrl,undefined);assert.equal(result.data.intentId,undefined);
    }
    assert.deepEqual(JSON.parse(await readFile(fixture.localFile,'utf8')),before,'paused checkout performs no account or purchase-intent write');
    assert.equal((await fixture.request('/api/auth/me')).data.user.credits,123);
    assert.equal((await fixture.request('/api/credits/checkout',{packageId:'50'},null)).status,401,'authentication still protects checkout');
  }finally{await fixture.close();}
});

test('HTTP: paused payments retain manual receipt support, messages and authorized credit grants',async()=>{
  const fixture=await localCheckoutServer('false');
  try{
    const opened=await fixture.request('/api/purchase-support/cases',{orderNumber:'EXISTING-RECEIPT',packageId:'50',message:'Verify an earlier purchase.',proof:{name:'receipt.png',data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9r8AAAAASUVORK5CYII='}});
    assert.equal(opened.status,201);const id=opened.data.purchaseCase.id;
    assert.equal((await fixture.request('/api/purchase-support/cases')).data.cases.length,1);
    assert.equal((await fixture.request(`/api/purchase-support/cases/${id}/messages`,{message:'Please keep this existing receipt open.'})).status,201);
    const admin=await fixture.request('/api/admin/login',{username:'checkout-test-admin',password:'local-test-only-password'},null);
    assert.equal(admin.status,200);
    assert.equal((await fixture.request(`/api/admin/purchase-cases/${id}/decision`,{action:'grant',credits:50},admin.data.token)).status,200);
    assert.equal((await fixture.request('/api/auth/me')).data.user.credits,173);
    assert.equal((await fixture.request('/api/credits/status')).data.available,false,'manual support never re-enables checkout');
  }finally{await fixture.close();}
});

test('HTTP: explicit enablement restores both packages using fixture URLs without making a payment',async()=>{
  const fixture=await localCheckoutServer('true');
  try{
    assert.equal((await fixture.request('/api/credits/status',undefined,null)).data.available,true);
    for(const packageId of ['50','500']){
      const result=await fixture.request('/api/credits/checkout',{packageId});
      assert.equal(result.status,200);assert.equal(result.data.checkoutUrl,`https://example.invalid/checkout/${packageId}`);
      assert.match(result.data.intentId,/^[a-f0-9-]{36}$/i);
    }
    assert.equal((await fixture.request('/api/credits/checkout',{packageId:'constructor'})).status,400);
    const stored=JSON.parse(await readFile(fixture.localFile,'utf8'));
    assert.equal(Object.keys(stored.purchaseIntents).length,2);assert.equal(stored.users[fixture.user.id].credits,123);
  }finally{await fixture.close();}
});
