import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import express from 'express';
import {createServer} from 'node:http';
import {spawn} from 'node:child_process';
import {mkdtemp, readFile, rm, mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {setTimeout as delay} from 'node:timers/promises';
import {randomUUID} from 'node:crypto';

// The real hub and account source modules talk to a private, disposable backend.
// Only its backend URL is substituted; no API response or account UI is mocked.
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const dataDir=await mkdtemp(join(tmpdir(),'unpaused-reset-browser-'));
const output=resolve(root,'work','account-reset-browser');await mkdir(output,{recursive:true});
const outbox=join(dataDir,'outbox.jsonl');
let browser,backend,web,backendError,backendOutput='';
const errors=[],apiRequests=[];
const freePort=async()=>{const probe=createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r));return port;};
const apiOrigin=`http://127.0.0.1:${await freePort()}`;
const app=express();
app.get(['/account-client.js','/public/account-client.js'],async(_,res)=>{
  const source=await readFile(join(root,'src/public/account-client.js'),'utf8');
  res.type('js').send(source.replace('export function getBackendUrl() {',`export function getBackendUrl() { return ${JSON.stringify(apiOrigin)};`));
});
app.use(express.static(join(root,'src/public')));
app.use(express.static(join(root,'src')));

const activeInputs=page=>page.$eval('#hub-account > .account-body > form',form=>[...form.querySelectorAll('input')].filter(input=>!input.disabled&&!input.closest('label').hidden).map(input=>input.name));
async function type(page,selector,value){await page.click(selector);await page.keyboard.down('Control');await page.keyboard.press('KeyA');await page.keyboard.up('Control');await page.keyboard.press('Backspace');await page.type(selector,value);}
async function submit(page,path,selector='#hub-account > .account-body > form [type="submit"]'){
  const response=page.waitForResponse(r=>r.url()===apiOrigin+path&&r.request().method()==='POST');
  await page.click(selector);return await response;
}
async function mail(kind,email){
  for(let i=0;i<150;i++){
    let records=[];try{records=(await readFile(outbox,'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse);}catch(e){if(e.code!=='ENOENT')throw e;}
    const found=records.find(m=>m.kind===kind&&m.to===email);if(found)return found;
    await delay(40);
  }
  throw new Error(`The private outbox did not receive a ${kind} email.`);
}
async function api(path,token,body){
  const response=await fetch(apiOrigin+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:body?JSON.stringify(body):undefined});
  return {status:response.status,data:await response.json()};
}
async function newPage(context){
  const page=await context.newPage();await page.setViewport({width:1440,height:1000});page.setDefaultTimeout(20000);
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(new URL(request.url()).origin===apiOrigin&&request.method()==='POST')apiRequests.push({path:new URL(request.url()).pathname,body:request.postData()?JSON.parse(request.postData()):null});});
  // A fixture cannot contact a production service, even if a source URL regresses.
  await page.setRequestInterception(true);
  page.on('request',request=>{const url=new URL(request.url());if(['http:','https:'].includes(url.protocol)&&!['127.0.0.1','localhost'].includes(url.hostname)){errors.push(`Unexpected external request to ${url.origin}`);request.abort();}else request.continue();});
  return page;
}

try{
  web=app.listen(0,'127.0.0.1');await new Promise(resolve=>web.once('listening',resolve));
  const base=`http://127.0.0.1:${web.address().port}`;
  backend=spawn(process.execPath,['server.js'],{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,PORT:new URL(apiOrigin).port,NODE_ENV:'test',RENDER:'false',DATABASE_URL:'',RESEND_API_KEY:'',GOOGLE_CLIENT_ID:'',ACCOUNT_SITE_URL:base,TEST_EMAIL_OUTBOX:outbox,LOCAL_ACCOUNT_DATABASE_FILE:join(dataDir,'accounts.json'),LOCAL_WORLD_DATABASE_FILE:join(dataDir,'worlds.json'),LOCAL_USERS_DATABASE_FILE:join(dataDir,'users.json'),ALLOWED_ORIGINS:base}});
  backend.on('error',error=>{backendError=error;});backend.stdout.on('data',data=>{backendOutput+=data;});backend.stderr.on('data',data=>{backendOutput+=data;});
  for(let i=0;;i++){
    if(backendError)throw backendError;
    if(backend.exitCode!==null)throw new Error(`Private backend exited: ${backendOutput}`);
    try{if((await fetch(apiOrigin+'/api/auth/status')).ok)break;}catch{}
    if(i>=100)throw new Error(`Private backend did not start: ${backendOutput}`);
    await delay(50);
  }
  browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
  const ownerContext=await browser.createBrowserContext(),resetContext=await browser.createBrowserContext();
  const owner=await newPage(ownerContext),reset=await newPage(resetContext);
  const email=`reset-browser-${randomUUID()}@example.invalid`,password=`Before-${randomUUID()}`,newPassword=`After-${randomUUID()}`;
  const username=`Reset_${randomUUID().slice(0,6)}`,worldName='My world survives a password reset';

  await owner.goto(base,{waitUntil:'networkidle0'});await owner.click('#open-account');await owner.waitForSelector('#hub-account[open]');
  await owner.click('#account-switch');assert.deepEqual(await activeInputs(owner),['email']);
  await type(owner,'[name="email"]',email);
  await owner.screenshot({path:join(output,'email-only-signup.png')});
  const registration=await submit(owner,'/api/auth/register');assert.equal(registration.status(),202);
  assert.deepEqual(JSON.parse(registration.request().postData()),{email},'The actual signup request contains only email');
  await owner.waitForFunction(()=>document.querySelector('#account-title').textContent==='CHECK YOUR INBOX');
  assert.deepEqual(await activeInputs(owner),[]);
  assert.equal(await owner.evaluate(()=>localStorage.getItem('tacticstrike_account_session')),null);

  const verification=await mail('verification',email);assert.equal(new URL(verification.link).origin,base);
  await owner.goto(verification.link,{waitUntil:'networkidle0'});await owner.waitForSelector('#hub-account[open]');
  assert.equal(new URL(owner.url()).hash,'','Verification proof is scrubbed from browser history');
  assert.deepEqual(await activeInputs(owner),['password','confirm']);
  await type(owner,'[name="password"]',password);await type(owner,'[name="confirm"]',password);
  assert.equal((await submit(owner,'/api/auth/verify-email')).status(),200);
  await owner.waitForFunction(()=>!document.querySelector('#account-profile').hidden);
  assert.equal(await owner.$eval('#account-username',element=>element.value),'');
  await type(owner,'#account-username',username);
  assert.equal((await submit(owner,'/api/auth/username','#account-username-form [type="submit"]')).status(),200);
  await owner.waitForFunction(()=>document.querySelector('#account-message').textContent.includes('Username saved'));
  assert.equal((await submit(owner,'/api/auth/friend-code','#account-generate-code')).status(),200);
  await owner.waitForFunction(()=>!document.querySelector('#account-friend-code').hidden);
  const original=await owner.evaluate(()=>({token:localStorage.getItem('tacticstrike_account_session'),user:JSON.parse(localStorage.getItem('tacticstrike_account_user'))}));
  assert.match(original.user.friendCode,/^\d{4}$/);
  // Add a real saved world as an auth fixture, then verify its real library UI.
  const created=await api('/api/worlds',original.token,{name:worldName,seed:64,mode:'survival'});assert.equal(created.status,201);
  await owner.click('#tab-worlds');await owner.waitForFunction(name=>document.querySelector('#world-list').textContent.includes(name),{},worldName);
  console.log('Real email-only signup, verification, username, friend code, and saved world established.');

  await reset.goto(base+'/?account=login',{waitUntil:'networkidle0'});await reset.waitForSelector('#hub-account[open]');
  await type(reset,'[name="email"]',email);await reset.click('#account-forgot');
  assert.deepEqual(await activeInputs(reset),['email']);
  assert.equal((await submit(reset,'/api/auth/password-reset/request')).status(),202);
  await reset.waitForFunction(()=>document.querySelector('#account-title').textContent==='CHECK YOUR INBOX');
  assert.match(await reset.$eval('#account-message',e=>e.textContent),/^If an active account/);
  const resetMail=await mail('password-reset',email);assert.equal(new URL(resetMail.link).origin,base);
  assert.equal((await api('/api/auth/me',original.token)).status,200,'Requesting a link does not revoke a session');
  await reset.goto(resetMail.link,{waitUntil:'networkidle0'});await reset.waitForSelector('#hub-account[open]');
  assert.equal(new URL(reset.url()).hash,'','Reset proof is scrubbed from browser history');
  assert.deepEqual(await activeInputs(reset),['password','confirm']);
  await type(reset,'[name="password"]',newPassword);await type(reset,'[name="confirm"]',newPassword);
  await reset.screenshot({path:join(output,'reset-password.png')});
  assert.equal((await submit(reset,'/api/auth/password-reset/confirm')).status(),200);
  await reset.waitForFunction(()=>document.querySelector('#account-message').textContent.includes('Password updated'));
  assert.equal(await reset.$eval('#account-title',e=>e.textContent),'WELCOME BACK');
  assert.equal(await reset.evaluate(()=>localStorage.getItem('tacticstrike_account_session')),null);
  assert.equal((await api('/api/auth/me',original.token)).status,401,'The old browser session is revoked by the backend');

  await type(reset,'[name="email"]',email);await type(reset,'[name="password"]',password);
  assert.equal((await submit(reset,'/api/auth/login')).status(),401);
  await reset.waitForFunction(()=>document.querySelector('#account-message').textContent.includes('Incorrect email'));
  assert.equal(await reset.$eval('#account-profile',e=>e.hidden),true);
  await type(reset,'[name="password"]',newPassword);
  assert.equal((await submit(reset,'/api/auth/login')).status(),200);
  await reset.waitForFunction(()=>!document.querySelector('#account-profile').hidden);
  const restored=await reset.evaluate(()=>({token:localStorage.getItem('tacticstrike_account_session'),user:JSON.parse(localStorage.getItem('tacticstrike_account_user'))}));
  for(const key of ['id','email','username','friendCode','credits','createdAt'])assert.equal(restored.user[key],original.user[key],`${key} survives reset`);
  assert.notEqual(restored.token,original.token);
  await reset.click('#tab-worlds');await reset.waitForFunction(name=>document.querySelector('#world-list').textContent.includes(name),{},worldName);
  const worlds=await api('/api/worlds',restored.token);assert.ok(worlds.data.worlds.some(world=>world.id===created.data.world.id&&world.owner));
  await reset.screenshot({path:join(output,'preserved-world.png')});
  // This browser context has not received a logout or storage event from reset.
  await owner.goto(base+'/?account=login',{waitUntil:'networkidle0'});
  await owner.waitForFunction(()=>localStorage.getItem('tacticstrike_account_session')===null&&document.querySelector('#account-profile').hidden);
  console.log('Forgot-password email, new password, old-password rejection, old-browser revocation, and preserved account/world passed.');
  assert.equal(apiRequests.filter(request=>request.path==='/api/auth/register').length,1);
  assert.equal(apiRequests.filter(request=>request.path==='/api/auth/password-reset/request').length,1);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,realBackend:true,currentSourceFrontend:true,emailOnlySignup:true,inboxVerification:true,usernameAfterVerification:true,forgotPassword:true,fragmentScrubbing:true,oldPasswordRejected:true,newPasswordAccepted:true,oldSessionRevoked:true,accountAndWorldPreserved:true,noProductionEmails:true,screenshots:output}));
}catch(error){
  if(browser)for(const page of await browser.pages()){
    try{console.log('Auth browser failure state',await page.evaluate(()=>({path:location.pathname,title:document.querySelector('#account-title')?.textContent,message:document.querySelector('#account-message')?.textContent,invalid:[...document.querySelectorAll('input:invalid')].map(e=>({name:e.name,reason:e.validationMessage}))})));}catch{}
  }
  throw error;
}finally{
  if(browser)await browser.close();
  if(backend&&backend.exitCode===null&&!backendError){const exited=new Promise(resolve=>backend.once('exit',resolve));backend.kill();await exited;}
  if(web)await new Promise(resolve=>{web.close(resolve);web.closeAllConnections();});
  await rm(dataDir,{recursive:true,force:true});
}
