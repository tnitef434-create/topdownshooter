import puppeteer from 'puppeteer';
import express from 'express';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { io as connect } from 'socket.io-client';

// Fully isolated fake-email service plus a source snapshot without Vite/HMR.
// Chrome's background throttling is intentionally left at browser defaults.
const startedAt=Date.now(),root=resolve('.'),runDir=resolve('work','multiplayer-recovery-'+startedAt);await mkdir(runDir,{recursive:true});
const outbox=resolve(runDir,'mail.jsonl'),worldFile=resolve(runDir,'worlds.json');
const freePort=async()=>{const s=createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const port=s.address().port;await new Promise(r=>s.close(r));return port;};
const apiPort=await freePort(),apiOrigin=`http://127.0.0.1:${apiPort}`;
const app=express();
app.get(['/account-client.js','/public/account-client.js'],async(_,res)=>{
 const source=await readFile(resolve(root,'src/public/account-client.js'),'utf8');
 res.type('js').send(source.replace('export function getBackendUrl() {',`export function getBackendUrl() { return ${JSON.stringify(apiOrigin)};`));
});
app.use(express.static(resolve(root,'src/public')));app.use(express.static(resolve(root,'src')));
const web=app.listen(0,'127.0.0.1');await new Promise(r=>web.once('listening',r));const base=`http://127.0.0.1:${web.address().port}`,friendBase=`http://localhost:${web.address().port}`;
const backend=spawn(process.execPath,['server.js'],{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,PORT:String(apiPort),NODE_ENV:'test',RENDER:'false',DATABASE_URL:'',RESEND_API_KEY:'',TEST_EMAIL_OUTBOX:outbox,LOCAL_ACCOUNT_DATABASE_FILE:resolve(runDir,'accounts.json'),LOCAL_WORLD_DATABASE_FILE:worldFile,ALLOWED_ORIGINS:`${base},${friendBase}`}});
let backendLog='';backend.stdout.on('data',d=>backendLog+=d);backend.stderr.on('data',d=>backendLog+=d);
const wait=ms=>new Promise(r=>setTimeout(r,ms));let browser;const errors=[],checks=[];const log=message=>{checks.push(message);console.log(message);};
const api=async(path,body,token,expected=200)=>{
 const response=await fetch(apiOrigin+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined});
 const data=await response.json();assert.equal(response.status,expected,`${path}: ${data.message||response.status}`);return data;
};
const serverSaved=async id=>JSON.parse(await readFile(worldFile,'utf8'))[id];
async function account(label){
 const email=`recovery-${label}-${randomUUID()}@example.invalid`,password=`PrivateTest-${randomUUID()}`;
 await api('/api/auth/register',{email,password},null,202);
 const record=(await readFile(outbox,'utf8')).trim().split('\n').map(JSON.parse).find(r=>r.to===email);
 const verify=new URLSearchParams(new URL(record.link).hash.slice(1)).get('verify');
 const session=await api('/api/auth/verify-email',{token:verify,password});
 session.user=(await api('/api/auth/friend-code',{},session.token)).user;
 return session;
}
async function ready(page){await page.bringToFront();await page.waitForFunction(()=>window.__worldloomShared?.ready&&window.__worldloomPlayer&&document.querySelector('#loading-screen').classList.contains('hidden'),{timeout:180000});}
async function poseAt(page,cell){
 await page.bringToFront();
 await page.evaluate(cell=>{
  const w=window.__worldloomWorld,p=window.__worldloomPlayer;
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)w.ensurePositionGenerated(cell.x+dx*16,cell.z+dz*16);
  p.flying=true;p.setPosition(cell.x+.5,cell.y+.08,cell.z+3);p.velocity.set(0,0,0);p.yaw=0;p.pitch=-.42;
  p._syncCamera(0,false,70,true);const s=window.__worldloomShared;
  s.socket.emit('pose',{position:p.position.toArray(),velocity:[0,0,0],yaw:p.yaw,pitch:p.pitch});
 },cell);
 await wait(180);
}
async function inventory(page){return page.evaluate(()=>window.__worldloomShared.getSnapshot().inventory);}
const itemTotal=slots=>slots.reduce((sum,s)=>sum+s.count,0);

try{
 for(let tries=0;;tries++){try{if((await fetch(apiOrigin+'/api/auth/status')).ok)break;}catch{}if(tries>80)throw Error('Fixture backend did not start.');await wait(100);}
 const owner=await account('owner'),friend=await account('friend'),stranger=await account('stranger');
 const worldId=(await api('/api/worlds',{name:'Recovery & cache field test',seed:64,mode:'survival',friendCode:friend.user.friendCode},owner.token,201)).world.id;
 await api(`/api/worlds/${worldId}/join`,{},stranger.token,404);
 const denied=connect(apiOrigin+'/worldloom',{auth:{token:stranger.token,worldId},reconnection:false});
 const deniedMessage=await new Promise(r=>denied.once('connect_error',e=>r(e.message)));denied.disconnect();assert.match(deniedMessage,/available/);
 log('Three separately verified fake-email accounts; nonmember rejected by both API and real socket.');
 browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,
  ignoreDefaultArgs:['--disable-background-timer-throttling','--disable-backgrounding-occluded-windows','--disable-renderer-backgrounding'],
  args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
 await writeFile(resolve(runDir,'browser-endpoint.txt'),browser.wsEndpoint());
 async function pageFor(session){
  const page=await browser.newPage();await page.setViewport({width:1120,height:740,deviceScaleFactor:1});page.setDefaultTimeout(45000);
  const waitForFunction=page.waitForFunction.bind(page);page.waitForFunction=(fn,options={},...args)=>waitForFunction(fn,{polling:100,...options},...args);
  page.on('pageerror',e=>errors.push(e.message));
  await page.evaluateOnNewDocument(s=>{localStorage.setItem('tacticstrike_account_session',s.token);localStorage.setItem('tacticstrike_account_user',JSON.stringify(s.user));localStorage.setItem('worldloom.settings.v1',JSON.stringify({viewDistance:2,graphicsQuality:'low',renderScale:.5,masterVolume:0,musicEnabled:false,weatherEffects:false,reducedMotion:true}));},session);
  return page;
 }
 const a=await pageFor(owner),b=await pageFor(friend);
 console.log('Loading friend menu.');await b.goto(friendBase+'/worldloom/');await b.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('hidden'));await b.click('#world-account-button');
 await b.waitForSelector('#received-invites .saved-world');await b.click('#tab-invites');await b.screenshot({path:resolve('../../outputs/worldloom-recovery-invite.png')});
 console.log('Joining from received invite.');await b.click('#received-invites .world-play');await ready(b);
 console.log('Loading owner world.');await a.bringToFront();await a.goto(base+`/worldloom/?world=${worldId}`);await ready(a);
 await a.evaluate(()=>{window.savedWorldIdentity=window.__worldloomWorld;window.savedPlayerIdentity=window.__worldloomPlayer;});
 log('Real received-invitation UI joined the shared world; both live clients finished loading.');
 const d=await a.evaluate(()=>window.__worldloomWorld.getLandDiscoveryForRegion(-1,-1));
 await poseAt(a,d.chest);await poseAt(b,{...d.chest,x:d.chest.x+2});
 await a.bringToFront();await wait(1000);
 assert.equal(await b.evaluate(()=>document.hidden),true,'bringToFront actually hides the other browser tab');
 await a.waitForFunction(()=>window.__worldloomShared.isLeader);
 assert.equal(await b.evaluate(()=>window.__worldloomShared.ready),true);
 await b.bringToFront();await b.waitForFunction(()=>window.__worldloomShared.isLeader);
 assert.equal(await a.evaluate(()=>document.hidden),true);
 await b.keyboard.press('Digit1');
 // Put an actual held model on the owner's selected slot, retaining all other inventory.
 await a.evaluate(()=>{const s=window.__worldloomShared,v=s.getSnapshot().inventory;v.slots[0]={id:104,count:1};s.onInventory(v);});
 await a.bringToFront();await a.keyboard.press('Digit1');
 await a.evaluate(()=>window.__worldloomShared.update(.1,window.__worldloomPlayer,{held:104}));
 await b.waitForFunction(()=>[...window.__worldloomShared.remotes.values()].some(r=>r.frames.some(p=>p.held===104)));
 await poseAt(b,{...d.chest,z:d.chest.z+3});
 await b.evaluate(()=>{const p=window.__worldloomPlayer;p.pitch=-.14;p._syncCamera(0,false,70,true);});
 await b.waitForFunction(()=>{const r=[...window.__worldloomShared.remotes.values()][0];return r?.heldId===104&&r.assembly&&r.avatar.root.visible;});
 await b.waitForFunction(()=>{const r=[...window.__worldloomShared.remotes.values()][0],p=window.__worldloomPlayer,v=r.actor.position.clone();p.camera.updateMatrixWorld(true);v.y+=1;v.project(p.camera);return Math.abs(v.x)<.9&&Math.abs(v.y)<.9&&v.z<1;});
 await b.screenshot({path:resolve('../../outputs/worldloom-recovery-held-tool.png')});
 log('Real hidden-tab visibility transfers simulation leadership; remote Blender avatar and held copper pick render.');
 const cell={x:d.x+6,y:d.y+3,z:d.z+6};
 await a.evaluate(c=>window.__worldloomWorld.setBlock(c.x,c.y,c.z,4),cell);await a.evaluate(()=>window.__worldloomShared.flush(true));
 await b.waitForFunction(c=>window.__worldloomWorld.getBlock(c.x,c.y,c.z)===4,{},cell);
 await b.evaluate(c=>window.__worldloomWorld.setBlock(c.x+1,c.y,c.z,7),cell);await b.evaluate(()=>window.__worldloomShared.flush(true));
 await a.waitForFunction(c=>window.__worldloomWorld.getBlock(c.x+1,c.y,c.z)===7,{},cell);
 const cdp=await a.createCDPSession();await cdp.send('Page.setWebLifecycleState',{state:'frozen'});
 await b.evaluate(c=>window.__worldloomWorld.setBlock(c.x+2,c.y,c.z,8),cell);await b.evaluate(()=>window.__worldloomShared.flush(true));
 await wait(1800);await cdp.send('Page.setWebLifecycleState',{state:'active'});await a.bringToFront();await ready(a);
 await a.waitForFunction(c=>window.__worldloomWorld.getBlock(c.x+2,c.y,c.z)===8,{},cell);
 assert.equal(await a.evaluate(()=>window.savedWorldIdentity===window.__worldloomWorld),true);
 log('Terrain edits sync both ways; a genuinely frozen browser renderer resumes friend edits in the same world object.');
 // A real R interaction collects exactly once and updates the other player's receipt.
 await poseAt(a,d.chest);await a.evaluate(()=>{const s=window.__worldloomShared,v=s.getSnapshot().inventory;v.slots=Array.from({length:36},()=>({id:0,count:0}));s.onInventory(v);});
 await a.evaluate(()=>window.__worldloomShared.flush(true));
 assert.equal(await a.evaluate(()=>window.__worldloomPlayer.raycast(4.25)?.block?.id),24,'R ray targets the actual chest');
 await a.keyboard.press('r');await a.waitForFunction(()=>document.querySelector('#toast-root')?.textContent?.includes('Copper')||document.querySelector('.toast')?.textContent?.includes('Copper'));
 await a.waitForFunction(key=>window.__worldloomWorld.discoveryLoot[key]?.length===0,{},d.key);
 await b.waitForFunction(key=>window.__worldloomWorld.discoveryLoot[key]?.length===0,{},d.key);
 const collected=await inventory(a);assert.ok(itemTotal(collected.slots)>5);await a.screenshot({path:resolve('../../outputs/worldloom-recovery-cache-loot.png')});
 await wait(250);await a.keyboard.press('r');await a.waitForFunction(()=>document.querySelector('.toast')?.textContent?.includes('empty'));
 assert.deepEqual(await inventory(a),collected);
 log('R opens the visible cache, transfers loot, informs the other client, and shows empty without duplicate inventory.');
 // Preserve a transaction whose commit is queued exactly as the owner goes offline.
 await a.evaluate(c=>{
  window.__worldloomWorld.setBlock(c.x+3,c.y,c.z,4);window.__worldloomShared.flush(true).catch(()=>{});
  window.__worldloomShared.socket.io.engine.close();
 },cell);await a.setOfflineMode(true);await a.waitForFunction(()=>!window.__worldloomShared.ready);
 const frozen=await a.evaluate(()=>({position:window.__worldloomPlayer.position.toArray(),time:window.__worldloomEnvironment.time}));
 await a.keyboard.down('w');await wait(2200);await a.keyboard.up('w');assert.deepEqual(await a.evaluate(()=>({position:window.__worldloomPlayer.position.toArray(),time:window.__worldloomEnvironment.time})),frozen);
 await b.bringToFront();await b.waitForFunction(()=>window.__worldloomShared.isLeader);
 await b.evaluate(c=>window.__worldloomWorld.setBlock(c.x+4,c.y,c.z,7),cell);await b.evaluate(()=>window.__worldloomShared.flush(true));
 await a.setOfflineMode(false);await a.bringToFront();await ready(a);
 await a.waitForFunction(c=>window.__worldloomWorld.getBlock(c.x+4,c.y,c.z)===7,{},cell);
 await b.waitForFunction(c=>window.__worldloomWorld.getBlock(c.x+3,c.y,c.z)===4,{},cell);
 assert.equal(await a.evaluate(()=>window.savedWorldIdentity===window.__worldloomWorld&&window.savedPlayerIdentity===window.__worldloomPlayer),true);
 log('Offline physics/daylight freeze; pending owner edits and continuing friend edits recover without scene recreation.');
 // Lose the claim ACK after the actual server transaction has persisted. The
 // normal socket request executes first; only its response is interrupted.
 const second=await a.evaluate(()=>window.__worldloomWorld.getLandDiscoveryForRegion(1,-1));await poseAt(a,second.chest);
 const before=await inventory(a);
 await a.evaluate(()=>{const s=window.__worldloomShared,v=s.getSnapshot().inventory;v.slots=Array.from({length:36},()=>({id:3,count:99}));s.onInventory(v);});
 await a.evaluate(()=>window.__worldloomShared.flush(true));await a.keyboard.press('r');
 await a.waitForFunction(()=>document.querySelector('.toast')?.textContent?.includes('pack is full'));
 assert.equal(itemTotal((await inventory(a)).slots),36*99);
 assert.equal(Object.hasOwn((await serverSaved(worldId)).discoveryLoot,second.key),false,'a full pack leaves the entire cache available');
 await a.evaluate(v=>window.__worldloomShared.onInventory(v),before);await a.evaluate(()=>window.__worldloomShared.flush(true));await wait(250);
 log('A real R interaction with a full inventory leaves every cache item available and displays the full-pack explanation.');
 await a.evaluate(cell=>{
  const s=window.__worldloomShared,request=s.request.bind(s);window.interceptedClaim=false;
  s.request=async(event,payload)=>{
   if(event!=='claim-loot'||window.interceptedClaim)return request(event,payload);
   window.interceptedClaim=true;const result=await request(event,payload);window.persistedClaimItems=result.items;
   try{await s.flush(true);window.pendingSaveBlocked=false;}catch{window.pendingSaveBlocked=true;}
   s.socket.disconnect();throw Object.assign(new Error('QA intentionally lost the claim acknowledgement'),{retryable:true});
  };
  s.claimLoot(cell).then(r=>window.claimOutcome=r).catch(e=>window.claimOutcome={error:e.message});
 },second.chest);
 await a.waitForFunction(()=>window.interceptedClaim&&window.claimOutcome&&window.__worldloomShared.ready,{timeout:90000});
 const recovered=await inventory(a),gained=await a.evaluate(()=>window.persistedClaimItems.reduce((sum,s)=>sum+s.count,0));
 assert.equal(await a.evaluate(()=>window.pendingSaveBlocked),true,'visibility/autosave cannot commit stale slots during a pending claim');
 assert.equal(itemTotal(recovered.slots)-itemTotal(before.slots),gained,'server claim inventory survives lost acknowledgement');
 assert.equal(await a.evaluate(()=>window.savedWorldIdentity===window.__worldloomWorld),true);
 assert.deepEqual((await serverSaved(worldId)).players[owner.user.id].inventory,recovered);
 assert.deepEqual((await serverSaved(worldId)).discoveryLoot[second.key],[]);
 await a.evaluate(()=>window.__worldloomShared.flush(true));await wait(4200);
 assert.deepEqual((await serverSaved(worldId)).players[owner.user.id].inventory,recovered,'later heartbeat cannot erase the recovered transaction');
 log('Persisted cache claim with intentionally lost ACK resnapshots authoritative inventory; no duplication or lost loot after heartbeat.');
 await a.evaluate(()=>window.__worldloomShared.flush(true));await b.evaluate(()=>window.__worldloomShared.flush(true));
 await a.keyboard.press('Escape');await a.waitForSelector('#title-button',{visible:true});await a.click('#title-button');await a.waitForFunction(()=>!new URLSearchParams(location.search).has('world'));
 await a.goto(base+`/worldloom/?world=${worldId}`);await ready(a);
 assert.deepEqual(await inventory(a),recovered);
 assert.deepEqual(await a.evaluate(key=>window.__worldloomWorld.discoveryLoot[key],second.key),[]);
 await a.waitForFunction(c=>window.__worldloomWorld.getBlock(c.x+4,c.y,c.z)===7,{},cell);
 log('Actual Save & leave UI followed by world rejoin preserves inventory, empty cache receipts, and both players’ terrain edits.');
 assert.deepEqual(errors,[]);
 await writeFile(resolve('../../outputs/Worldloom-multiplayer-recovery-check.json'),JSON.stringify({passed:true,elapsedMs:Date.now()-startedAt,checks,backgroundThrottling:'browser defaults; default disabling switches explicitly removed',screenshots:['worldloom-recovery-invite.png','worldloom-recovery-held-tool.png','worldloom-recovery-cache-loot.png']},null,2));
}catch(error){
 await writeFile(resolve(runDir,'failure.txt'),String(error.stack)+'\nBrowser errors: '+JSON.stringify(errors));
 if(browser){for(const [i,page]of(await browser.pages()).entries()){try{await page.screenshot({path:resolve(runDir,`failure-${i}.png`)});}catch{}}}
 console.error('Multiplayer private-browser check failed:',error.message,'Browser errors:',errors);throw error;
}finally{
 if(browser)await browser.close();backend.kill();await new Promise(r=>web.close(r));await writeFile(resolve(runDir,'backend.log'),backendLog);
}
