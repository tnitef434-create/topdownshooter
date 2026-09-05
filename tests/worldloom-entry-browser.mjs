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
  const worldMotion=await page.$eval('.u-loading__runner',e=>({duration:getComputedStyle(e).animationDuration,path:getComputedStyle(e).offsetPath}));
  assert.equal(await page.$eval('.loading-track',e=>getComputedStyle(e).display),'none');
  await page.evaluate(()=>new MutationObserver(()=>{if(document.querySelector('#loading-screen').classList.contains('hidden'))window.menuRevealTime=performance.now();}).observe(document.querySelector('#loading-screen'),{attributes:true}));
  await module.continue();
  await page.waitForFunction(()=>document.querySelector('#loading-screen')?.classList.contains('hidden'),{timeout:90000});
  assert.ok(await page.evaluate(()=>window.menuRevealTime>=4400),'the full U cycle is visible before revealing the menu');
  await page.screenshot({path:'../../outputs/worldloom-menu-readable.png'});
  await page.click('.world-invite summary');
  await page.waitForSelector('#hub-account[open] #invite-code',{visible:true});
  await page.type('#invite-code','1234');
  assert.equal(await page.$eval('#invite-code',e=>e.value),'1234');
  await page.screenshot({path:'../../outputs/worldloom-menu-invite.png'});
  await page.click('#account-close');
  await page.goBack({waitUntil:'domcontentloaded'});
  await page.waitForSelector('#enter-worldloom');
  assert.equal(await page.$eval('#worldloom-transition',e=>e.hidden),true,'Back must restore a usable hub');

  for (const width of [390,320]) {
    await page.setViewport({width,height:844});
    await page.goto(new URL('worldloom/',base).href,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('hidden'),{timeout:90000});
    await page.click('.world-invite summary');
    await page.waitForSelector('#hub-account[open] #invite-code',{visible:true});
    const bounds=await page.evaluate(()=>({width:innerWidth,scroll:document.querySelector('#main-menu').scrollWidth,input:document.querySelector('#invite-code').getBoundingClientRect().right}));
    assert.ok(bounds.scroll<=bounds.width && bounds.input<=bounds.width,'menu and open invite must fit narrow screens');
    await page.click('#account-close');
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
  assert.ok(phoneVideos.length>0 && phoneVideos.every(url=>url.endsWith('-loop-mobile.mp4')),'phones only fetch the smaller gameplay encodes');
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
  assert.notDeepEqual(await page.screenshot(),reducedBefore,'the requested loading U keeps moving with OS reduced motion enabled');
  await page.evaluate(()=>document.documentElement.classList.add('user-reduced-motion'));
  const settingsBefore=await page.screenshot();await pause(800);
  assert.notDeepEqual(await page.screenshot(),settingsBefore,'the in-game motion setting cannot freeze the menu U');
  await pending.continue();
  await reducedNavigation;
  await page.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('hidden'));

  // Both hub links must paint the same loader, and the shooter must animate
  // before its bundled module arrives (including reduced-motion settings).
  const shooter=await browser.newPage();
  await shooter.setViewport({width:1440,height:900});
  await shooter.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await shooter.setRequestInterception(true);
  let releaseShooter;
  const shooterHeld=new Promise(resolve=>{releaseShooter=resolve;});
  let blockShooter=true;
  shooter.on('request',request=>{
    const path=new URL(request.url()).pathname;
    if(blockShooter && (path==='/main.js'||/^\/assets\/tacticstrike-.*\.js$/.test(path))) {
      blockShooter=false;releaseShooter(request);return;
    }
    request.continue();
  });
  await shooter.goto(base,{waitUntil:'domcontentloaded'});
  let shooterPaint='';
  await shooter.exposeFunction('reportShooterPaint',name=>{shooterPaint=name;});
  await shooter.evaluate(()=>{
    const overlay=document.querySelector('#worldloom-transition');
    new MutationObserver(()=>{if(!overlay.hidden)window.reportShooterPaint(overlay.querySelector('.u-loading__title').textContent);}).observe(overlay,{attributes:true,attributeFilter:['hidden']});
  });
  await shooter.click('#enter-tacticstrike');
  const shooterModule=await shooterHeld;
  assert.equal(shooterPaint,'TacticStrike');
  await shooter.waitForSelector('#startup-overlay .u-loading__runner');
  assert.deepEqual(await shooter.$eval('.u-loading__runner',e=>({duration:getComputedStyle(e).animationDuration,path:getComputedStyle(e).offsetPath})),worldMotion,'both games use identical U movement');
  await shooter.evaluate(()=>new MutationObserver(()=>{if(!document.querySelector('#startup-overlay'))window.menuRevealTime=performance.now();}).observe(document.body,{childList:true}));
  const shot=await shooter.screenshot({path:'../../outputs/tacticstrike-u-loading.png'});await pause(900);
  assert.notDeepEqual(await shooter.screenshot({path:'../../outputs/tacticstrike-u-loading-motion.png'}),shot,'TacticStrike animates the same U during download');
  await shooterModule.continue();
  await shooter.waitForFunction(()=>!document.querySelector('#startup-overlay'),{timeout:15000});
  assert.ok(await shooter.evaluate(()=>window.menuRevealTime>=4400));
  assert.equal(await shooter.$eval('body',e=>e.classList.contains('is-starting')),false);
  await shooter.goBack({waitUntil:'domcontentloaded'});
  assert.equal(await shooter.$eval('#worldloom-transition',e=>e.hidden),true);
  await shooter.close();
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,navigationBeforeLoad:true,bothGameMenus:true,animatedWithReducedMotion:true,backNavigation:true,inviteAndMobile:true,mobileVideo:[900,1000]}));
} finally { await browser.close(); }
