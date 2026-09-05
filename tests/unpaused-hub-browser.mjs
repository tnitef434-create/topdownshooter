import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';

const base=process.env.HUB_TEST_URL||'http://127.0.0.1:4186/';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
const errors=[];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
try{
  const page=await browser.newPage();
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
  await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(e.message));
  const requests=[];
  page.on('request',r=>requests.push(new URL(r.url()).pathname));
  await page.goto(base,{waitUntil:'networkidle0'});
  assert.match(await page.title(),/^Unpaused/);
  try { await page.waitForFunction(()=>document.querySelector('video').currentTime>.1,{timeout:15000}); }
  catch(error){console.log(await page.$eval('video',v=>({hidden:document.hidden,src:v.currentSrc,ready:v.readyState,network:v.networkState,error:v.error?.message,paused:v.paused,muted:v.muted,reduce:matchMedia('(prefers-reduced-motion: reduce)').matches})));throw error;}
  const initial=await page.$eval('video',v=>({time:v.currentTime,muted:v.muted,loop:v.loop,duration:v.duration,width:v.videoWidth}));
  assert.ok(initial.muted&&initial.loop&&initial.width>600&&initial.duration>12);
  await wait(350);
  assert.ok(await page.$eval('video',(v,t)=>v.currentTime>t,initial.time),'the actual film must advance');
  assert.ok(!requests.some(p=>/worldloom\/src|worldloom\/vendor|socket.io/.test(p)),'game engines must not boot behind the hub');
  assert.equal(await page.$('#motion-toggle'),null,'the hub must not show video controls');
  await page.mouse.move(-10,-10);await wait(800);
  await page.screenshot({path:'../../outputs/unpaused-hub-desktop.png'});
  const layout=await page.evaluate(()=>{
    const a=document.querySelector('#enter-worldloom').getBoundingClientRect(),b=document.querySelector('#enter-tacticstrike').getBoundingClientRect();
    return {left:a.width,right:b.width,split:a.right===b.left,line:getComputedStyle(document.querySelector('#enter-worldloom')).borderRightWidth};
  });
  assert.ok(layout.split&&Math.abs(layout.left-layout.right)<1&&layout.line==='1px');
  await page.hover('#enter-worldloom');await wait(850);
  const hover=await page.evaluate(()=>({left:document.querySelector('#enter-worldloom').getBoundingClientRect().width,right:document.querySelector('#enter-tacticstrike').getBoundingClientRect().width}));
  assert.ok(hover.left>hover.right*1.5,'hover must expand the whole game panel');
  await page.screenshot({path:'../../outputs/unpaused-hub-hover.png'});
  await page.hover('#enter-tacticstrike');
  await page.waitForFunction(()=>document.querySelector('#enter-tacticstrike').clientWidth>document.querySelector('#enter-worldloom').clientWidth*1.5,{timeout:5000});
  assert.ok(await page.evaluate(()=>document.querySelector('#enter-tacticstrike').clientWidth>document.querySelector('#enter-worldloom').clientWidth*1.5));
  await page.mouse.move(-10,-10);
  await page.keyboard.press('Tab');
  await page.focus('#enter-worldloom');await wait(850);
  assert.ok(await page.$eval('#enter-worldloom',e=>e.matches(':focus-visible')&&e.clientWidth>innerWidth*.6),'keyboard focus must expand the game too');
  await page.$eval('#enter-worldloom',e=>e.blur());await wait(850);
  await page.setViewport({width:390,height:844});
  const mobile=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,bottom:document.querySelector('#enter-worldloom').getBoundingClientRect().bottom,top:document.querySelector('#enter-tacticstrike').getBoundingClientRect().top}));
  assert.equal(mobile.overflow,false);assert.equal(mobile.bottom,mobile.top);
  await page.screenshot({path:'../../outputs/unpaused-hub-mobile.png'});
  await page.setViewport({width:1440,height:900});
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.click('#enter-tacticstrike')]);
  await page.waitForSelector('#btn-deploy-main');
  assert.equal(await page.$('#btn-play-worldloom'),null);
  assert.equal(await page.$('#worldloom-frame'),null);
  assert.match(page.url(),/tacticstrike\//);
  await page.waitForFunction(()=>!document.querySelector('#startup-overlay'),{timeout:15000});
  if (await page.$('#news-modal.active')) await page.click('#btn-close-news');
  await page.waitForSelector('.hub-return',{visible:true,timeout:15000});
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.click('.hub-return')]);
  await page.waitForSelector('#enter-worldloom');
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.click('#enter-worldloom')]);
  await page.waitForFunction(()=>document.querySelector('#loading-screen')?.classList.contains('hidden'),{timeout:60000});
  assert.equal(await page.$('iframe'),null);
  assert.equal(await page.$eval('#main-menu',m=>m.classList.contains('hidden')),false);
  assert.match(await page.$eval('#title-button',b=>b.textContent),/return to all games/);
  await page.waitForFunction(()=>document.querySelector('#menu-film').currentTime>.1,{timeout:30000});
  const drone=await page.$eval('#menu-film',v=>({width:v.videoWidth,height:v.videoHeight,muted:v.muted,loop:v.loop}));
  assert.deepEqual(drone,{width:3840,height:2160,muted:true,loop:true});
  await page.screenshot({path:'../../outputs/worldloom-menu-drone.png'});
  await page.evaluate(()=>{localStorage.setItem('worldloom.settings.v1',JSON.stringify({viewDistance:3,graphicsQuality:'high'}));});
  await page.reload();await page.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('hidden'));
  await page.evaluate(()=>{document.querySelector('#seed-input').value='41';document.querySelector('#new-world-button').click();});
  await page.waitForFunction(()=>window.__worldloomPlayer&&!document.querySelector('#hud').classList.contains('hidden')&&document.querySelector('#loading-screen').classList.contains('hidden'),{timeout:180000});
  assert.equal(await page.$eval('#menu-film',v=>v.paused),true,'the menu film must stop decoding when gameplay starts');
  // Exercise real game damage callbacks, collision and save/return, not only a mocked player.
  await page.evaluate(()=>{
    const w=window.__worldloomWorld,p=window.__worldloomPlayer;
    for(let x=40;x<45;x++)for(let z=8;z<13;z++){
      w.setBlock(x,48,z,3);w.setBlock(x,49,z,9);
      for(let y=50;y<57;y++)w.setBlock(x,y,z,0);
    }
    p.health=1;p.flying=false;p.setPosition(42.5,55,10.5);p.velocity.set(0,-38,0);
  });
  await page.waitForFunction(()=>window.__worldloomPlayer.grounded&&window.__worldloomPlayer.inWater,{timeout:30000});
  const landing=await page.evaluate(()=>({health:window.__worldloomPlayer.health,y:window.__worldloomPlayer.position.y,impact:window.__worldloomPlayer.landingImpact}));
  assert.equal(landing.health,1,'a terminal-speed water landing must not damage the actual survival player');
  assert.ok(landing.y>=49&&landing.y<49.1);
  await page.evaluate(()=>{
    window.originalSetItem=Storage.prototype.setItem;
    Storage.prototype.setItem=function(k,v){if(k.startsWith('worldloom.save'))throw new DOMException('full','QuotaExceededError');return window.originalSetItem.call(this,k,v);};
    document.querySelector('#title-button').click();
  });
  await wait(250);assert.match(page.url(),/worldloom\//,'save failure must keep the world open');
  assert.match(await page.$eval('#toast-layer',e=>e.textContent),/Save failed/);
  await page.evaluate(()=>{Storage.prototype.setItem=window.originalSetItem;});
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.evaluate(()=>document.querySelector('#title-button').click())]);
  await page.waitForSelector('#enter-worldloom');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('worldloom.save.v1')));
  assert.ok(saved?.player?.position,'Save and leave must persist the world before navigating');
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.click('#enter-worldloom')]);
  await page.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('hidden'));
  assert.equal(await page.$eval('#continue-button',b=>b.disabled),false);

  const reduced=await browser.newPage();
  await reduced.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  const reducedRequests=[];reduced.on('request',r=>reducedRequests.push(r.url()));
  await reduced.goto(base,{waitUntil:'networkidle0'});
  await reduced.waitForFunction(()=>document.querySelector('video').currentTime>.1);
  assert.ok(reducedRequests.some(u=>u.endsWith('.mp4')),'the requested autoplay also works when Windows reduces UI motion');
  assert.equal(await reduced.$eval('video',v=>v.paused),false);
  assert.equal(await reduced.$eval('.games',e=>getComputedStyle(e).transitionDuration),'0s');
  await reduced.setViewport({width:1200,height:630});
  await reduced.mouse.move(-10,-10);
  await reduced.screenshot({path:'src/public/hub/unpaused-social.png',type:'png'});
  const iconPage=await browser.newPage();
  await iconPage.setViewport({width:180,height:180,deviceScaleFactor:1});
  await iconPage.goto(new URL('favicon.svg',base).href);
  await iconPage.screenshot({path:'src/public/hub/apple-touch-icon.png',type:'png'});
  await iconPage.close();

  const phoneMenu=await browser.newPage();await phoneMenu.setViewport({width:390,height:844});
  await phoneMenu.goto(new URL('worldloom/',base).href);
  await phoneMenu.waitForFunction(()=>document.querySelector('#menu-film').currentTime>.1,{timeout:30000});
  assert.equal(await phoneMenu.$eval('#menu-film',v=>v.videoWidth),1920,'phones should receive the HD encode');
  await phoneMenu.screenshot({path:'../../outputs/worldloom-menu-mobile.png'});
  await phoneMenu.close();

  const broken=await browser.newPage();await broken.setRequestInterception(true);
  await broken.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
  broken.on('request',r=>r.url().endsWith('.mp4')?r.abort():r.continue());
  await broken.goto(base,{waitUntil:'networkidle0'});
  await broken.waitForFunction(()=>document.querySelector('video').networkState===HTMLMediaElement.NETWORK_NO_SOURCE);
  assert.equal(await broken.$eval('.poster',p=>p.naturalWidth>0),true);
  await broken.goto(new URL('worldloom/',base).href);
  await broken.waitForFunction(()=>document.querySelector('#menu-film').error!==null,{timeout:30000});
  assert.equal(await broken.$eval('.menu-scenery img',p=>p.naturalWidth>0),true);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,video:initial.duration,desktop:layout,hover,mobile,drone,landing,saveReturn:true,autoplayWithReducedMotion:true,posterFallback:true}));
}finally{await browser.close();}
