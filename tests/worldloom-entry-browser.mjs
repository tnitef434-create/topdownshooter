import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';

const base = process.env.HUB_TEST_URL || 'http://127.0.0.1:4186/';
const browser = await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader']});
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
  await page.setViewport({width:1440,height:1000});
  const errors=[]; page.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});
  await page.setRequestInterception(true);
  let holdModule;
  const moduleHeld = new Promise(resolve => { holdModule=resolve; });
  let blockModule=true;
  page.on('request', request => {
    const path=new URL(request.url()).pathname;
    if(blockModule && path==='/worldloom/src/main.js') {
      blockModule=false; holdModule(request); return;
    }
    request.continue();
  });
  await page.goto(base,{waitUntil:'domcontentloaded'});
  assert.equal(await page.$eval('#worldloom-transition',e=>e.hidden),true);
  let painted=false;
  await page.exposeFunction('reportLoaderPaint',()=>{painted=true;});
  await page.evaluate(()=>{
    new MutationObserver(()=>{
      const e=document.querySelector('#worldloom-transition');
      if(!e.hidden && getComputedStyle(e).display!=='none')window.reportLoaderPaint();
    }).observe(document.querySelector('#worldloom-transition'),{attributes:true,attributeFilter:['hidden']});
  });
  await page.focus('#enter-worldloom');
  await page.keyboard.press('Enter');
  const module = await moduleHeld;
  assert.equal(painted,true,'keyboard launch paints the U before navigation');
  await page.waitForSelector('#loading-screen');
  await page.waitForFunction(()=>document.querySelector('.u-loading__runner'));
  const before=await page.screenshot({path:'../../outputs/worldloom-loading.png'});
  await pause(1000);
  const after=await page.screenshot({path:'../../outputs/worldloom-loading-motion.png'});
  assert.notDeepEqual(before,after,'the U must visibly move while the game module is still loading');
  assert.equal(await page.$eval('#loading-screen',e=>getComputedStyle(e).backgroundColor),'rgb(9, 9, 9)');
  await module.continue();
  await page.waitForFunction(()=>document.querySelector('#loading-screen')?.classList.contains('hidden'),{timeout:90000});
  await page.screenshot({path:'../../outputs/worldloom-menu-readable.png'});
  await page.click('.world-invite summary');
  await page.type('#invite-code','1234');
  assert.equal(await page.$eval('#invite-code',e=>e.value),'1234');
  await page.screenshot({path:'../../outputs/worldloom-menu-invite.png'});
  await page.goBack({waitUntil:'domcontentloaded'});
  await page.waitForSelector('#enter-worldloom');
  assert.equal(await page.$eval('#worldloom-transition',e=>e.hidden),true,'Back must restore a usable hub');

  for (const width of [390,320]) {
    await page.setViewport({width,height:844});
    await page.goto(new URL('worldloom/',base).href,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('hidden'),{timeout:90000});
    await page.click('.world-invite summary');
    const bounds=await page.evaluate(()=>({width:innerWidth,scroll:document.querySelector('#main-menu').scrollWidth,input:document.querySelector('#invite-code').getBoundingClientRect().right}));
    assert.ok(bounds.scroll<=bounds.width && bounds.input<=bounds.width,'menu and open invite must fit narrow screens');
    await page.$eval('#new-world-button',e=>e.scrollIntoView({block:'center'}));
    assert.equal(await page.$eval('#new-world-button',e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),true,'primary action remains reachable');
    await page.screenshot({path:`../../outputs/worldloom-menu-${width}.png`});
  }

  const phone=await browser.newPage();
  await phone.setViewport({width:390,height:844});
  const phoneVideos=[];phone.on('request',r=>{if(r.url().endsWith('.mp4'))phoneVideos.push(r.url());});
  await phone.goto(base,{waitUntil:'domcontentloaded'});
  await phone.waitForFunction(()=>document.querySelector('#worldloom-film').currentTime>.1,{timeout:30000});
  assert.deepEqual(await phone.$eval('#worldloom-film',v=>[v.videoWidth,v.videoHeight,v.muted,v.loop]),[900,1000,true,true]);
  assert.ok(phoneVideos.length>0 && phoneVideos.every(url=>url.endsWith('worldloom-loop-mobile.mp4')),'phones only fetch the smaller gameplay encode');
  await phone.close();

  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  blockModule=true;
  let reducedModule;
  const reducedGate = new Promise(resolve=>{reducedModule=resolve;});
  holdModule=reducedModule;
  const reducedNavigation=page.goto(new URL('worldloom/',base).href,{waitUntil:'domcontentloaded'});
  const pending=await reducedGate;
  await page.waitForFunction(()=>document.querySelector('.u-loading__runner'));
  const reducedBefore=await page.screenshot();await pause(800);
  assert.deepEqual(await page.screenshot(),reducedBefore,'reduced motion keeps a still U');
  await pending.continue();
  await reducedNavigation;
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,navigationBeforeLoad:true,animatedU:true,reducedMotion:true,backNavigation:true,inviteAndMobile:true,mobileVideo:[900,1000]}));
} finally { await browser.close(); }
