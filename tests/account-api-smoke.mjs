import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';

const base=process.env.ACCOUNT_TEST_API||'http://127.0.0.1:3000';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname)||!process.env.TEST_EMAIL_OUTBOX)throw new Error('Use only an isolated local test backend and outbox.');
const ip=`127.0.0.${20+Math.floor(Math.random()*200)}`;
async function request(path,body,token){
  const response=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json','X-Forwarded-For':ip,...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify(body||{})});
  return {status:response.status,data:await response.json().catch(()=>null)};
}
const email=`api-${randomUUID()}@example.invalid`,password=`initial-${randomUUID()}`,finalPassword=`owner-${randomUUID()}`;
const signup=await request('/api/auth/register',{email,password});
assert.equal(signup.status,202);assert.equal(signup.data.token,undefined);
const pending=await request('/api/auth/login',{email,password});
assert.equal(pending.status,202);assert.equal(pending.data.token,undefined);
assert.equal((await request('/api/auth/friend-code')).status,401);
assert.equal((await request('/api/credits/checkout',{packageId:'50'},'made-up-token')).status,401);
const mails=()=>readFile(process.env.TEST_EMAIL_OUTBOX,'utf8').then(s=>s.trim().split('\n').map(line=>JSON.parse(line)).filter(m=>m.to===email));
const records=await mails();assert.equal(records.length,1,'rapid resend is suppressed');
const token=new URLSearchParams(new URL(records[0].link).hash.slice(1)).get('verify');
assert.equal((await request('/api/auth/verify-email',{token:'x'.repeat(43),password:finalPassword})).status,400);
assert.equal((await request('/api/auth/verify-email',{token,password:'short'})).status,400);
// The inbox owner chooses the final password, defeating a pending signup made by someone else.
const verified=await request('/api/auth/verify-email',{token,password:finalPassword});
assert.equal(verified.status,200);assert.equal(verified.data.user.emailVerified,true);
assert.equal(verified.data.user.password,undefined);assert.equal(verified.data.user.friendCode,null);
assert.equal((await request('/api/auth/verify-email',{token,password:finalPassword})).status,400);
assert.equal((await request('/api/auth/login',{email,password})).status,401,'initial password is replaced by the inbox owner');
const login=await request('/api/auth/login',{email,password:finalPassword});assert.equal(login.status,200);
const codes=await Promise.all(Array.from({length:4},()=>request('/api/auth/friend-code',{},login.data.token)));
assert.ok(codes.every(r=>r.status===200));
assert.match(codes[0].data.user.friendCode,/^\d{4}$/);
assert.equal(new Set(codes.map(r=>r.data.user.friendCode)).size,1);
const duplicate=await request('/api/auth/register',{email,password:'different-password'});
assert.equal(duplicate.status,202);assert.equal(duplicate.data.message,signup.data.message);
assert.equal((await mails()).length,1,'active accounts never receive registration spam');
const me=await fetch(base+'/api/auth/me',{headers:{Authorization:`Bearer ${login.data.token}`}}).then(r=>r.json());
assert.equal(me.user.friendCode,codes[0].data.user.friendCode);
console.log(JSON.stringify({passed:true,inactiveBeforeVerification:true,ownerSetsPassword:true,singleUseLink:true,rateLimitedResend:true,codePermanent:true,unauthorizedBlocked:true,genericRegistrationResponse:true}));
