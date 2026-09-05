import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, dirname} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createHash, randomUUID, scryptSync} from 'node:crypto';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {setTimeout as delay} from 'node:timers/promises';
import {PGlite} from '@electric-sql/pglite';
import {createAccountStore} from '../accountStore.js';
import {createAccountMailer} from '../accountEmail.js';

const hash=value=>createHash('sha256').update(value).digest('hex');
const original={algorithm:'scrypt',salt:'initial',hash:'original'};
const replacement={algorithm:'scrypt',salt:'reset',hash:'replacement'};
const makeUser=()=>({id:randomUUID(),email:`${randomUUID()}@example.invalid`,username:'Keeper_'+randomUUID().slice(0,6),displayName:'Keeper',password:original,credits:70,purchasedWeapons:['starter','viper'],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});

for (const backend of ['local','postgresql']) test(`${backend}: reset is atomic, single-use, expiring, rate-limited, and preserves account identity`,async()=>{
  const dir=await mkdtemp(join(tmpdir(),'unpaused-reset-'));
  const db=backend==='postgresql'?new PGlite():null;
  const sqlClient=db?async(strings,...values)=>(await db.query(strings.reduce((q,s,i)=>q+(i?`$${i}`:'')+s,''),values)).rows:null;
  const options={localFile:join(dir,'accounts.json'),sqlClient};
  const store=createAccountStore(options),now=Date.now();
  try {
    await store.initialize();assert.equal(store.isReady,true);
    await store.initialize();assert.equal(store.isReady,true,'migration is repeatable');
    const pending=await store.createUser(makeUser());
    assert.equal(await store.reservePasswordReset(pending.id,hash('pending-reset'),now+1800000,now),false,'reset cannot activate a pending identity');
    const activation=hash('activation');
    await store.reserveEmailVerification(pending.id,activation,now+1800000,now);
    assert.equal(await store.consumePasswordReset(activation,replacement,now),null,'activation tokens cannot reset passwords');
    await store.consumeEmailVerification(activation,original,now);
    const before=structuredClone(await store.generateFriendCode(pending.id));
    const outsider=await store.createUser(makeUser());
    await store.createSession(hash('other-account'),outsider.id);
    await store.createSession(hash('first-session'),before.id);
    await store.createSession(hash('second-session'),before.id);
    const oldSession=db?(await db.query('SELECT * FROM operative_sessions WHERE token_hash=$1',[hash('first-session')])).rows[0]:JSON.parse(await readFile(options.localFile,'utf8')).sessions[hash('first-session')];
    assert.equal(await store.reservePasswordReset(before.id,hash('first-reset'),now+1800000,now),true);
    assert.equal(await store.reservePasswordReset(before.id,hash('too-fast'),now+1800000,now+59999),false);
    assert.equal(await store.reservePasswordReset(before.id,hash('current-reset'),now+1800000,now+60000),true);
    assert.equal(await store.findPasswordReset(hash('first-reset')),null,'resend invalidates the previous reset');
    assert.equal(await store.consumeEmailVerification(hash('current-reset'),replacement,now+60000),null,'reset tokens cannot activate accounts');
    const results=await Promise.all([store.consumePasswordReset(hash('current-reset'),replacement,now+60001),store.consumePasswordReset(hash('current-reset'),original,now+60001)]);
    assert.equal(results.filter(Boolean).length,1,'concurrent consumers have one winner');
    const after=await store.findUserById(before.id);
    for(const key of ['id','email','username','displayName','emailVerifiedAt','friendCode','credits','purchasedWeapons','createdAt'])assert.deepEqual(after[key],before[key],`${key} survives reset`);
    assert.deepEqual(after.password,replacement);
    assert.equal(await store.findSession(hash('first-session')),null);
    assert.equal(await store.findSession(hash('second-session')),null);
    assert.ok(await store.findSession(hash('other-account')),'other accounts stay signed in');
    assert.equal(await store.findPasswordReset(hash('current-reset')),null);
    assert.equal(await store.consumePasswordReset(hash('current-reset'),original,now+60002),null);
    assert.equal(await store.reservePasswordReset(before.id,hash('after-use-too-fast'),now+1800000,now+60002),false,'consumption does not erase the email limit');
    for(let i=2;i<5;i++)assert.equal(await store.reservePasswordReset(before.id,hash(`reset-${i}`),now+1800000,now+i*60000),true);
    assert.equal(await store.reservePasswordReset(before.id,hash('sixth'),now+1800000,now+300000),false,'daily cap persists after use');
    assert.equal(await store.consumePasswordReset(hash('reset-4'),original,now+1800000),null,'expiry is exclusive');
    assert.equal(await store.reservePasswordReset(before.id,hash('next-day'),now+86400000+1800000,now+86400000),true);
    const reopened=createAccountStore(options);await reopened.initialize();
    assert.deepEqual((await reopened.findUserById(before.id)).password,replacement);
    assert.equal(await reopened.findSession(hash('first-session')),null,'revocation survives restart');
    assert.ok(await reopened.findPasswordReset(hash('next-day')),'outstanding reset survives restart');
    assert.equal(await reopened.createSession(hash('stale-login'),before.id,null,original),false,'a password checked before reset cannot create a new session');
    assert.equal(await reopened.createSession(hash('current-login'),before.id,null,replacement),true);
    await reopened.setUsername(before.id,'NewKeeper');
    assert.ok(await reopened.findSession(hash('current-login')),'profile changes do not revoke a password session');
    // Model an INSERT whose database snapshot saw the old credential, but which
    // committed after the reset deleted existing sessions. It must be unusable.
    if(db){
      await db.query('INSERT INTO operative_sessions (token_hash,user_id,expires_at,persistent,credential_key) VALUES ($1,$2,$3,$4,$5)',[hash('late-session'),before.id,oldSession.expires_at,oldSession.persistent,oldSession.credential_key]);
      await db.query('UPDATE operative_accounts SET credits=credits+1,updated_at=NOW() WHERE id=$1',[before.id]);
    }else{
      const saved=JSON.parse(await readFile(options.localFile,'utf8'));
      saved.sessions[hash('late-session')]=oldSession;saved.users[before.id].credits++;
      await writeFile(options.localFile,JSON.stringify(saved));await reopened.initialize();
    }
    assert.equal(await reopened.findSession(hash('late-session')),null,'a late session with an old credential stamp is revoked too');
    assert.ok(await reopened.findSession(hash('current-login')),'credit changes do not revoke a current session');
    if(!db){
      const saved=await readFile(options.localFile,'utf8');
      assert.equal(saved.includes('current-reset'),false,'only reset token digests are stored');
    }
  }finally{if(db)await db.close();await rm(dir,{recursive:true,force:true});}
});

test('reset mail uses the U theme, fragment token, and existing Resend delivery or isolated test outbox',async()=>{
  let sent;
  const mailer=createAccountMailer({env:{RESEND_API_KEY:'mock-key',ACCOUNT_SITE_URL:'https://unpaused.online'},fetchImpl:async(url,options)=>{sent={url,options};return {ok:true};}});
  await mailer.sendPasswordReset('owner@example.invalid','reset-proof');
  assert.equal(sent.url,'https://api.resend.com/emails');
  const payload=JSON.parse(sent.options.body);
  assert.equal(payload.subject,'Reset your Unpaused password');
  assert.match(payload.html,/unpaused-email-mark\.png/);
  assert.match(payload.html,/RESET PASSWORD/);
  const link=new URL(payload.text.match(/https:\/\/\S+/)[0]);
  assert.equal(link.search,'?account=reset');
  assert.equal(new URLSearchParams(link.hash.slice(1)).get('resetToken'),'reset-proof');
  assert.match(payload.text,/30 minutes/);
  assert.match(payload.text,/signs out your other sessions/);
  const dir=await mkdtemp(join(tmpdir(),'unpaused-reset-mail-'));
  try{
    const outbox=join(dir,'outbox.jsonl');
    const local=createAccountMailer({env:{NODE_ENV:'test',TEST_EMAIL_OUTBOX:outbox,ACCOUNT_SITE_URL:'http://127.0.0.1'},fetchImpl:()=>{throw new Error('Test outbox must not send mail');}});
    await local.sendPasswordReset('owner@example.invalid','local-proof');
    const mail=JSON.parse((await readFile(outbox,'utf8')).trim());
    assert.equal(mail.kind,'password-reset');assert.match(mail.link,/#resetToken=local-proof$/);
    const production=createAccountMailer({env:{NODE_ENV:'production',TEST_EMAIL_OUTBOX:outbox}});
    await assert.rejects(production.sendPasswordReset('owner@example.invalid','never-send'),{code:'EMAIL_UNAVAILABLE'});
    assert.equal((await readFile(outbox,'utf8')).trim().split('\n').length,1);
  }finally{await rm(dir,{recursive:true,force:true});}
});

async function localServer({instrumentLogin=false}={}) {
  const dir=await mkdtemp(join(tmpdir(),'unpaused-reset-api-'));
  const probe=createServer();await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve));
  const port=probe.address().port;await new Promise(resolve=>probe.close(resolve));
  const origin=`http://127.0.0.1:${port}`,outbox=join(dir,'outbox.jsonl');
  const gate=join(dir,'hold-login'),waiting=join(dir,'login-waiting'),release=join(dir,'release-login'),args=[];
  if(instrumentLogin){
    const preload=join(dir,'pause-login.mjs');
    // Pause only the test's armed old-password callback after real scrypt work.
    // The real server and reset handler continue running without any test hooks.
    await writeFile(preload,`import crypto from 'node:crypto';
import fs from 'node:fs';
const original=crypto.scrypt;
crypto.scrypt=function(password,...args){
  const callback=args.at(-1);
  args[args.length-1]=(...result)=>{
    let expected;try{expected=fs.readFileSync(${JSON.stringify(gate)},'utf8');}catch{}
    if(String(password)!==expected)return callback(...result);
    fs.writeFileSync(${JSON.stringify(waiting)},'waiting');
    const timer=setInterval(()=>{if(fs.existsSync(${JSON.stringify(release)})){clearInterval(timer);callback(...result);}},5);
  };
  return original.call(this,password,...args);
};`);
    args.push('--import',pathToFileURL(preload).href);
  }
  const child=spawn(process.execPath,[...args,'server.js'],{cwd:dirname(dirname(fileURLToPath(import.meta.url))),windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,PORT:String(port),NODE_ENV:'test',RENDER:'false',DATABASE_URL:'',RESEND_API_KEY:'',GOOGLE_CLIENT_ID:'',ACCOUNT_SITE_URL:origin,TEST_EMAIL_OUTBOX:outbox,LOCAL_ACCOUNT_DATABASE_FILE:join(dir,'accounts.json'),LOCAL_WORLD_DATABASE_FILE:join(dir,'worlds.json'),LOCAL_USERS_DATABASE_FILE:join(dir,'users.json')}});
  let output='',spawnError;
  child.stdout.on('data',data=>{output+=data;});child.stderr.on('data',data=>{output+=data;});child.on('error',error=>{spawnError=error;});
  async function close(){if(child.exitCode===null&&!spawnError){const exited=new Promise(resolve=>child.once('exit',resolve));child.kill();await exited;}await rm(dir,{recursive:true,force:true});}
  try{
    for(let i=0;i<100;i++){
      if(spawnError)throw spawnError;
      if(child.exitCode!==null)throw new Error(`Isolated account server exited: ${output}`);
      try{if((await fetch(origin+'/api/auth/status')).ok)return {origin,outbox,dir,gate,waiting,release,close};}catch{}
      await delay(50);
    }
    throw new Error(`Isolated account server did not start: ${output}`);
  }catch(error){await close();throw error;}
}

test('HTTP: email-only signup and generic reset restore access, revoke sessions, and retain saved worlds',async()=>{
  const fixture=await localServer();let call=0;
  const post=async(path,body,token,ip=`192.0.2.${1+(call++%200)}`)=>{
    const response=await fetch(fixture.origin+path,{method:'POST',headers:{'Content-Type':'application/json','X-Forwarded-For':ip,...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify(body||{})});
    return {status:response.status,data:await response.json()};
  };
  const get=async(path,token)=>{const r=await fetch(fixture.origin+path,{headers:{Authorization:`Bearer ${token}`}});return {status:r.status,data:await r.json()};};
  const emails=async()=>{try{return (await readFile(fixture.outbox,'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse);}catch(e){if(e.code==='ENOENT')return [];throw e;}};
  const waitForMail=async(kind,email)=>{for(let i=0;i<100;i++){const found=(await emails()).find(m=>m.kind===kind&&m.to===email);if(found)return found;await delay(20);}throw new Error(`Missing test ${kind} email`);};
  try{
    const email='owner@example.invalid',pendingEmail='pending@example.invalid',oldPassword='owner-password-before',newPassword='owner-password-after';
    const registered=await post('/api/auth/register',{email});
    assert.equal(registered.status,202);assert.equal(registered.data.token,undefined);
    await post('/api/auth/register',{email:pendingEmail,password:'planted-password',username:'Squatted'});
    const disk=JSON.parse(await readFile(join(fixture.dir,'accounts.json'),'utf8'));
    const pending=disk.users[disk.emailIndex[pendingEmail]];
    assert.equal(pending.username,null,'unverified signup cannot claim a username');
    assert.notEqual(scryptSync('planted-password',pending.password.salt,64).toString('hex'),pending.password.hash,'client-supplied password is ignored');
    assert.equal((await post('/api/auth/login',{email:pendingEmail,password:'planted-password'})).status,401);
    const activation=await waitForMail('verification',email),verifyToken=new URLSearchParams(new URL(activation.link).hash.slice(1)).get('verify');
    const verified=await post('/api/auth/verify-email',{token:verifyToken,password:oldPassword});assert.equal(verified.status,200);
    const session=verified.data.token;
    await post('/api/auth/username',{username:'ResetKeeper'},session);
    const profile=await post('/api/auth/friend-code',{},session);assert.equal(profile.status,200);
    const world=await post('/api/worlds',{name:'Kept after reset',seed:64,mode:'survival'},session);assert.equal(world.status,201);
    const second=await post('/api/auth/login',{email,password:oldPassword});assert.equal(second.status,200);
    const known=await post('/api/auth/password-reset/request',{email});
    const unknown=await post('/api/auth/password-reset/request',{email:'missing@example.invalid'});
    const notVerified=await post('/api/auth/password-reset/request',{email:pendingEmail});
    const throttled=await post('/api/auth/password-reset/request',{email});
    for(const result of [known,unknown,notVerified,throttled])assert.deepEqual(result,known);
    assert.equal(known.status,202);
    const reset=await waitForMail('password-reset',email),token=new URLSearchParams(new URL(reset.link).hash.slice(1)).get('resetToken');
    await delay(60);
    assert.equal((await emails()).filter(m=>m.kind==='password-reset').length,1,'only an eligible account receives one reset email');
    const stored=await readFile(join(fixture.dir,'accounts.json'),'utf8');assert.equal(stored.includes(token),false,'reset token is hashed at rest');
    assert.equal((await post('/api/auth/password-reset/confirm',{token:verifyToken,password:newPassword})).status,400);
    assert.equal((await post('/api/auth/password-reset/confirm',{token,password:'short'})).status,400);
    assert.equal((await get('/api/auth/me',session)).status,200,'requesting a reset never signs out the account');
    const confirmed=await post('/api/auth/password-reset/confirm',{token,password:newPassword});assert.equal(confirmed.status,200);assert.equal(confirmed.data.token,undefined);
    assert.equal((await post('/api/auth/password-reset/confirm',{token,password:oldPassword})).status,400);
    for(const oldToken of [session,second.data.token])assert.equal((await get('/api/auth/me',oldToken)).status,401);
    assert.equal((await post('/api/auth/login',{email,password:oldPassword})).status,401);
    const restored=await post('/api/auth/login',{email,password:newPassword});assert.equal(restored.status,200);
    assert.equal(restored.data.user.id,profile.data.user.id);assert.equal(restored.data.user.username,'ResetKeeper');assert.equal(restored.data.user.friendCode,profile.data.user.friendCode);
    const worlds=await get('/api/worlds',restored.data.token);assert.equal(worlds.status,200);
    assert.ok(worlds.data.worlds.some(w=>w.id===world.data.world.id),'saved world ownership survives reset');
    const ip='198.51.100.40';
    for(let i=0;i<25;i++)assert.equal((await post('/api/auth/password-reset/request',{email:'unknown@example.invalid'},null,ip)).status,202);
    assert.equal((await post('/api/auth/password-reset/request',{email},null,ip)).status,429,'request limit is independent of account existence');
  }finally{await fixture.close();}
});

test('HTTP race: reset completes while old-password scrypt is pending and the old login cannot issue a session',async()=>{
  const fixture=await localServer({instrumentLogin:true});
  const post=async(path,body)=>{const r=await fetch(fixture.origin+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return {status:r.status,data:await r.json()};};
  const readMail=async kind=>{for(let i=0;i<100;i++){const records=(await readFile(fixture.outbox,'utf8')).trim().split('\n').map(JSON.parse),entry=records.find(m=>m.kind===kind);if(entry)return new URLSearchParams(new URL(entry.link).hash.slice(1)).get(kind==='verification'?'verify':'resetToken');await delay(20);}throw new Error(`Missing ${kind} test email`);};
  try{
    const email='race@example.invalid',password='password-before-race',nextPassword='password-after-race';
    assert.equal((await post('/api/auth/register',{email})).status,202);
    const verified=await post('/api/auth/verify-email',{token:await readMail('verification'),password});assert.equal(verified.status,200);
    assert.equal((await post('/api/auth/password-reset/request',{email})).status,202);
    const token=await readMail('password-reset');
    await writeFile(fixture.gate,password);
    const oldLogin=post('/api/auth/login',{email,password});oldLogin.catch(()=>{});
    let paused=false;
    for(let i=0;i<100;i++){try{await readFile(fixture.waiting);paused=true;break;}catch{}await delay(20);}
    assert.equal(paused,true,'the login has computed the old password hash and is awaiting its callback');
    assert.equal((await post('/api/auth/password-reset/confirm',{token,password:nextPassword})).status,200);
    await writeFile(fixture.release,'release');
    const rejected=await oldLogin;assert.equal(rejected.status,401);assert.equal(rejected.data.token,undefined,'no token can be issued from the pre-reset password');
    const oldSession=await fetch(fixture.origin+'/api/auth/me',{headers:{Authorization:`Bearer ${verified.data.token}`}});assert.equal(oldSession.status,401);
    const current=await post('/api/auth/login',{email,password:nextPassword});assert.equal(current.status,200);
    assert.equal(current.data.user.id,verified.data.user.id);
  }finally{await fixture.close();}
});
