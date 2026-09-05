import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';

const base=process.env.HUB_TEST_URL||'http://127.0.0.1:4187/';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw new Error('Popup UI fixtures are local-only');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader']});
try {
  const page=await browser.newPage();
  const errors=[],writes=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.setViewport({width:1440,height:1000});
  const user={id:'popup-qa',email:'popup@example.invalid',emailVerified:true,friendCode:'0142',credits:0};
  await page.evaluateOnNewDocument(user=>{
    localStorage.setItem('tacticstrike_account_session','local-popup-ui-fixture');
    localStorage.setItem('tacticstrike_account_user',JSON.stringify(user));
  },user);
  await page.setRequestInterception(true);
  page.on('request',request=>{
    const url=new URL(request.url());
    if(url.hostname==='localhost'&&url.port==='3000'&&url.pathname.startsWith('/api/')){
      if(!['OPTIONS','GET'].includes(request.method()))writes.push(url.pathname);
      const headers={'Access-Control-Allow-Origin':new URL(base).origin,'Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'GET, POST, OPTIONS'};
      const data=url.pathname==='/api/auth/me'?{user}:{worlds:[],invites:[{id:'invite-fixture',name:'Friend’s island',ownerName:'River',owner:false}]};
      request.respond({status:request.method()==='OPTIONS'?204:200,headers,contentType:'application/json',body:request.method()==='OPTIONS'?'':JSON.stringify(data)});return;
    }
    request.continue();
  });
  const url=new URL('worldloom/',base).href;
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('hidden'),{timeout:60000});
  await page.type('#world-name','Keep my meadow');
  await page.type('#seed-input','same seed');
  await page.click('input[value="builder"]+span');
  await page.click('.world-invite summary');
  await page.waitForSelector('#hub-account[open] #invite-code',{visible:true});
  await page.waitForSelector('#received-invites .saved-world');
  assert.equal(page.url(),url,'the account opens without navigating out of Worldloom');
  assert.equal(await page.$('iframe'),null,'the panel must not embed the hub in a frame');
  assert.equal(await page.$eval('#hub-account',e=>getComputedStyle(e).backgroundColor),'rgb(9, 9, 9)');
  assert.equal(await page.$eval('#main-menu',e=>e.classList.contains('hidden')),false);
  await page.type('#invite-code','0427');
  await page.screenshot({path:'../../outputs/worldloom-account-popup.png'});
  await page.click('#account-context .account-primary');
  await page.waitForFunction(()=>!document.querySelector('#hub-account').open);
  assert.equal(await page.$eval('#hub-account',e=>e.open),false);
  assert.equal(await page.$eval('#invite-code',e=>e.value),'0427');
  assert.equal(await page.$eval('#world-name',e=>e.value),'Keep my meadow');
  assert.equal(await page.$eval('#seed-input',e=>e.value),'same seed');
  assert.equal(await page.$eval('input[name="mode"]:checked',e=>e.value),'builder');
  assert.deepEqual(writes,[],'choosing a friend code only edits the draft; it must not send an invite early');
  await page.click('#world-account-button');
  await page.waitForSelector('#hub-account[open]');
  assert.equal(await page.$eval('#tab-worlds',e=>e.getAttribute('aria-selected')),'true');
  assert.equal(await page.$eval('#account-context',e=>e.hidden),true);
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>!document.querySelector('#hub-account').open);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'world-account-button');
  await page.click('#world-account-button');
  await page.click('#world-library a[href="/worldloom/"]');
  await page.waitForFunction(()=>!document.querySelector('#hub-account').open);
  assert.equal(page.url(),url);
  assert.equal(await page.$eval('#hub-account',e=>e.open),false);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'world-name');
  await page.setViewport({width:390,height:844});
  await page.click('.world-invite summary');
  await page.waitForSelector('#hub-account[open]');
  assert.equal(await page.$eval('#invite-code',e=>e.value),'0427');
  assert.ok(await page.$eval('#hub-account',e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&e.scrollWidth<=e.clientWidth;}));
  await page.screenshot({path:'../../outputs/worldloom-account-popup-mobile.png'});
  await page.click('#account-close');
  assert.equal(await page.$eval('#invite-code',e=>e.value),'0427');
  assert.equal(page.url(),url);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,inPlaceAccount:true,receivedInvites:true,preservedDraft:true,noEarlyInvite:true,closeAndEscape:true,createWithoutReload:true,mobile:true}));
} finally {await browser.close();}
