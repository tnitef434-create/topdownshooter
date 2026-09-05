import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
import {createAccountStore} from '../accountStore.js';
import {createAccountMailer} from '../accountEmail.js';

const password={algorithm:'scrypt',salt:'initial-salt',hash:'initial-hash'};
const finalPassword={algorithm:'scrypt',salt:'owner-salt',hash:'owner-hash'};
const hash=value=>createHash('sha256').update(value).digest('hex');
const makeUser=(email=`${randomUUID()}@example.invalid`)=>({id:randomUUID(),email,displayName:'Player',password,credits:50,purchasedWeapons:['starter'],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});

for (const backend of ['local','postgresql']) test(`${backend}: verification, migrations, rate limits, and permanent unique friend codes`,async()=>{
  const dir=await mkdtemp(join(tmpdir(),'unpaused-accounts-'));
  const db=backend==='postgresql'?new PGlite():null;
  const sqlClient=db?async(strings,...values)=>{
    const query=strings.reduce((text,part,i)=>text+(i?`$${i}`:'')+part,'');
    return (await db.query(query,values)).rows;
  }:null;
  const options={localFile:join(dir,'accounts.json'),sqlClient};
  const store=createAccountStore(options);
  try {
    await store.initialize();assert.equal(store.isReady,true);
    await store.initialize();assert.equal(store.isReady,true,'migrations can run again');
    const user=await store.createUser(makeUser());
    await assert.rejects(store.generateFriendCode(user.id),{code:'EMAIL_VERIFICATION_REQUIRED'});
    const now=Date.now(), oldHash=hash('first-link'), currentHash=hash('second-link');
    assert.equal(await store.reserveEmailVerification(user.id,oldHash,now+1800000,now),true);
    assert.equal(await store.reserveEmailVerification(user.id,hash('rapid-retry'),now+1800000,now+1000),false);
    assert.equal(await store.reserveEmailVerification(user.id,currentHash,now+1800000,now+60001),true);
    assert.equal(await store.findEmailVerification(oldHash),null,'resend invalidates previous link');
    await store.createSession(hash('legacy-session'),user.id,now+100000);
    const consumed=await Promise.all([store.consumeEmailVerification(currentHash,finalPassword),store.consumeEmailVerification(currentHash,finalPassword)]);
    assert.equal(consumed.filter(Boolean).length,1,'link consumption is atomic');
    assert.equal(await store.findSession(hash('legacy-session')),null,'pre-verification sessions are revoked');
    const activated=await store.findUserById(user.id);
    assert.ok(activated.emailVerifiedAt);assert.deepEqual(activated.password,finalPassword);
    assert.equal(activated.credits,50);assert.deepEqual(activated.purchasedWeapons,['starter']);
    const generated=await Promise.all(Array.from({length:8},()=>store.generateFriendCode(user.id)));
    assert.match(generated[0].friendCode,/^\d{4}$/);
    assert.equal(new Set(generated.map(u=>u.friendCode)).size,1,'parallel generation never changes a code');
    const otherUsers=await Promise.all(Array.from({length:16},()=>store.createUser(makeUser())));
    await Promise.all(otherUsers.map(async(u,i)=>{const h=hash(`other-${i}`);await store.reserveEmailVerification(u.id,h,now+1800000);await store.consumeEmailVerification(h,finalPassword);}));
    const codes=await Promise.all(otherUsers.map(u=>store.generateFriendCode(u.id)));
    assert.equal(new Set([...generated,...codes].map(u=>u.friendCode)).size,17);
    const limited=await store.createUser(makeUser());
    for(let i=0;i<5;i++)assert.equal(await store.reserveEmailVerification(limited.id,hash(`limit-${i}`),now+1800000,now+i*61000),true);
    assert.equal(await store.reserveEmailVerification(limited.id,hash('sixth'),now+1800000,now+6*61000),false);
    assert.equal(await store.consumeEmailVerification(hash('limit-4'),finalPassword,now+1800001),null,'expired links cannot activate');
    assert.equal(await store.reserveEmailVerification(limited.id,hash('next-day'),now+86400000+1800000,now+86400001),true);
    if(db){
      const pending=await store.createUser(makeUser());
      const h=hash('last-user');await store.reserveEmailVerification(pending.id,h,now+1800000);await store.consumeEmailVerification(h,finalPassword);
      await db.exec(`INSERT INTO operative_accounts(id,email,display_name,password_algorithm,password_salt,password_hash,friend_code,email_verified_at)
        SELECT gen_random_uuid(),'fill-'||n||'@example.invalid','Player','scrypt','salt','hash',lpad(n::text,4,'0'),NOW()
        FROM generate_series(0,9999) AS n WHERE NOT EXISTS(SELECT 1 FROM operative_accounts WHERE friend_code=lpad(n::text,4,'0'))`);
      await assert.rejects(store.generateFriendCode(pending.id),{code:'FRIEND_CODES_UNAVAILABLE'});
      await assert.rejects(db.query('UPDATE operative_accounts SET friend_code=$1 WHERE id=$2',['12345',pending.id]),{code:'23514'});
    }else{
      const persisted=JSON.parse(await readFile(options.localFile,'utf8'));
      assert.equal(JSON.stringify(persisted).includes('second-link'),false,'raw verification tokens are never stored');
      const reopened=createAccountStore(options);await reopened.initialize();
      assert.equal((await reopened.generateFriendCode(user.id)).friendCode,generated[0].friendCode);
    }
  }finally{if(db)await db.close();await rm(dir,{recursive:true,force:true});}
});

test('mailer sends only through Resend and never allows the local test sink in production',async()=>{
  let request;
  const mailer=createAccountMailer({env:{RESEND_API_KEY:'test-key',ACCOUNT_SITE_URL:'https://unpaused.online'},fetchImpl:async(url,options)=>{request={url,options};return {ok:true};}});
  await mailer.sendVerification('owner@example.invalid','test-token');
  assert.equal(request.url,'https://api.resend.com/emails');
  const payload=JSON.parse(request.options.body);
  assert.equal(payload.from,'Unpaused <accounts@unpaused.online>');
  assert.match(payload.text,/#verify=test-token/);assert.deepEqual(payload.to,['owner@example.invalid']);
  assert.equal(createAccountMailer({env:{NODE_ENV:'production',TEST_EMAIL_OUTBOX:'ignored'}}).configured,false);
  assert.throws(()=>createAccountMailer({env:{NODE_ENV:'production',ACCOUNT_SITE_URL:'http://unpaused.online'}}));
  const failed=createAccountMailer({env:{RESEND_API_KEY:'secret'},fetchImpl:async()=>({ok:false,status:429})});
  await assert.rejects(failed.sendVerification('owner@example.invalid','token'),{code:'EMAIL_DELIVERY_FAILED'});
});
