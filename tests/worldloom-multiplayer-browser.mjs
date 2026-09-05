import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import { readFile,writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const base=process.env.HUB_TEST_URL||'http://127.0.0.1:4186';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Use an isolated local service for multiplayer QA.');
const outbox=process.env.TEST_EMAIL_OUTBOX;
if(!outbox)throw new Error('TEST_EMAIL_OUTBOX is required. No real emails are sent.');
const api=async(path,body,token)=>{
  const response=await fetch('http://127.0.0.1:3000'+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined});
  const result=await response.json();if(!response.ok)throw new Error(result.message||JSON.stringify(result));return result;
};
async function account(label){
  const email=`${label.toLowerCase()}-${randomUUID()}@example.invalid`,password=`Test-${randomUUID()}`;
  await api('/api/auth/register',{email,password});
  const record=(await readFile(outbox,'utf8')).trim().split('\n').map(JSON.parse).reverse().find(r=>r.to===email);
  const token=new URLSearchParams(new URL(record.link).hash.slice(1)).get('verify');
  const session=await api('/api/auth/verify-email',{token,password});session.user=(await api('/api/auth/friend-code',{},session.token)).user;return session;
}
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding','--enable-webgl','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
const errors=[];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
try{
  const owner=await account('Wayfarer'),friend=await account('Meadow');
  async function pageFor(session){
    const context=await browser.createBrowserContext(),page=await context.newPage();await page.setViewport({width:1280,height:800,deviceScaleFactor:1});page.setDefaultTimeout(60_000);
    page.on('pageerror',e=>errors.push(e.message));
    await page.evaluateOnNewDocument(s=>{
      localStorage.setItem('tacticstrike_account_session',s.token);localStorage.setItem('tacticstrike_account_user',JSON.stringify(s.user));
      localStorage.setItem('worldloom.settings.v1',JSON.stringify({viewDistance:2,graphicsQuality:'low',renderScale:.65,masterVolume:0,musicEnabled:false,weatherEffects:false}));
    },session);
    return page;
  }
  const a=await pageFor(owner),b=await pageFor(friend);
  await a.goto(base+'/worldloom/');await a.waitForSelector('#world-name',{visible:true});
  await a.type('#world-name','Our quiet valley');await a.type('#seed-input','2206');await a.click('label:has(input[value="builder"])');await a.click('.world-invite summary');await a.type('#invite-code',friend.user.friendCode);
  await a.click('#new-world-button');await a.waitForFunction(()=>new URLSearchParams(location.search).has('world'));
  const worldId=new URL(a.url()).searchParams.get('world');console.log('Created account world through the real menu.');
  await b.goto(base+'/?account=worlds');await b.waitForFunction(()=>document.querySelector('#received-invites .saved-world'));await b.click('#tab-invites');
  await b.screenshot({path:'../../outputs/unpaused-account-invites.png'});
  await b.click('#received-invites .world-play');await b.waitForFunction(()=>new URLSearchParams(location.search).has('world'));
  await Promise.all([a,b].map(p=>p.waitForFunction(()=>window.__worldloomShared?.ready&&window.__worldloomPlayer,{timeout:180_000})));
  console.log('Both independently authenticated browsers entered the same world.');
  await a.evaluate(()=>{const p=window.__worldloomPlayer;p.flying=true;p.velocity.set(0,0,0);});
  const pos=await a.evaluate(()=>{const p=window.__worldloomPlayer;p.position.y+=5;return p.position.toArray();});
  await b.evaluate(position=>{const p=window.__worldloomPlayer;p.setPosition(position[0],position[1],position[2]-3);p.flying=true;p.yaw=Math.PI;p.velocity.set(0,0,0);},pos);
  await a.evaluate(()=>{const p=window.__worldloomPlayer;p.yaw=0;p.pitch=0;});
  await wait(1300);
  assert.equal(await a.evaluate(()=>window.__worldloomShared.remotes.size),1);
  assert.equal(await b.evaluate(()=>window.__worldloomShared.remotes.size),1);
  const avatar=await a.evaluate(()=>{const remote=[...window.__worldloomShared.remotes.values()][0];return {name:remote.avatar.root.name,visible:remote.avatar.root.visible,layer:remote.avatar.body.layers.mask,tag:remote.label.visible,x:remote.actor.position.x,y:remote.actor.position.y};});
  assert.equal(avatar.layer,1);assert.equal(avatar.visible,true);assert.equal(avatar.tag,true);assert.match(avatar.name,/Blender/);
  await a.screenshot({path:'../../outputs/worldloom-two-players.png'});
  const cell=[Math.floor(pos[0])+2,Math.floor(pos[1]),Math.floor(pos[2])-2];
  assert.equal(await a.evaluate(([x,y,z])=>window.__worldloomWorld.setBlock(x,y,z,4),cell),true);await a.evaluate(()=>window.__worldloomShared.flush(true));
  await b.waitForFunction(([x,y,z])=>window.__worldloomWorld.getBlock(x,y,z)===4,{},cell);
  assert.equal(await b.evaluate(([x,y,z])=>window.__worldloomWorld.setBlock(x+1,y,z,7),cell),true);await b.evaluate(()=>window.__worldloomShared.flush(true));
  await a.waitForFunction(([x,y,z])=>window.__worldloomWorld.getBlock(x+1,y,z)===7,{},cell);
  await Promise.all([a,b].map(p=>p.evaluate(()=>window.__worldloomShared.flush(true))));
  console.log('Terrain edits synchronized in both directions and saved.');
  await a.evaluate(()=>window.__worldloomShared.socket.disconnect());await wait(200);
  await b.waitForFunction(()=>window.__worldloomShared.isLeader);
  await b.evaluate(([x,y,z])=>window.__worldloomWorld.setBlock(x+2,y,z,8),cell);await b.evaluate(()=>window.__worldloomShared.flush(true));
  await a.evaluate(()=>window.__worldloomShared.socket.connect());await a.waitForFunction(()=>window.__worldloomShared.ready,{timeout:180_000});
  assert.equal(await a.evaluate(([x,y,z])=>window.__worldloomWorld.getBlock(x+2,y,z),cell),8);
  console.log('Owner reconnected to the friend’s saved changes.');
  await Promise.all([a,b].map(p=>p.evaluate(()=>window.__worldloomShared.flush(true))));
  await a.goto(base+'/?account=worlds');await b.goto(base+'/?account=worlds');
  await a.waitForSelector('#world-list .saved-world');await b.waitForSelector('#world-list .saved-world');
  assert.equal(await b.$('#world-list .world-delete'),null,'guest cannot delete an owner’s world');
  await a.screenshot({path:'../../outputs/unpaused-account-worlds.png'});
  await a.setViewport({width:390,height:844});await a.screenshot({path:'../../outputs/unpaused-account-worlds-mobile.png'});
  assert.ok(await a.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);
  await writeFile('../../outputs/Worldloom-multiplayer-check.json',JSON.stringify({passed:true,checks:['two separate verified accounts','friend-code invitation from creation menu','received invites and join','visible Blender player rig and name tag','edits synchronized both ways','owner offline and guest continues','owner reconnect resynchronizes','account world library and mobile layout'],avatar},null,2));
  console.log('Multiplayer browser checks passed.');
}catch(error){console.error('Browser errors:',errors);throw error;}finally{await browser.close();}
