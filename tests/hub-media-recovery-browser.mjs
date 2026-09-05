import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
const base=process.env.HUB_TEST_URL||'http://127.0.0.1:4187/';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Use a local preview.');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox'],ignoreDefaultArgs:['--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
try {
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.setViewport({width:1440,height:900});
  await page.goto(base);
  await page.waitForFunction(()=>[...document.querySelectorAll('.film')].every(v=>!v.paused&&v.currentTime>.3));
  await page.hover('#hub-news-trigger');
  await page.waitForFunction(()=>document.querySelector('#hub-news').matches(':popover-open'));
  assert.match(await page.$eval('#hub-news',e=>e.textContent),/The creation of Unpaused/);
  assert.equal(await page.$eval('#hub-news-trigger',e=>e.getAttribute('aria-expanded')),'true');
  await page.screenshot({path:'../../outputs/unpaused-whats-new.png'});
  await page.mouse.move(700,800);
  await page.waitForFunction(()=>!document.querySelector('#hub-news').matches(':popover-open'));
  await page.keyboard.press('Tab');
  await page.focus('#hub-news-trigger');
  await page.waitForFunction(()=>document.querySelector('#hub-news').matches(':popover-open'));
  await page.keyboard.press('Escape');
  assert.equal(await page.$eval('#hub-news',e=>e.matches(':popover-open')),false);
  // Exercise the native loop boundary rather than checking the loop attribute.
  await page.evaluate(()=>{for(const v of document.querySelectorAll('.film'))v.currentTime=v.duration-.2;});
  await page.waitForFunction(()=>[...document.querySelectorAll('.film')].every(v=>v.currentTime>.1&&v.currentTime<5&&!v.paused));
  await page.evaluate(()=>{for(const v of document.querySelectorAll('.film'))v.pause();});
  await page.waitForFunction(()=>[...document.querySelectorAll('.film')].every(v=>!v.paused),{timeout:5000});
  const other=await browser.newPage();await other.goto('about:blank');await other.bringToFront();
  await page.waitForFunction(()=>document.hidden&&[...document.querySelectorAll('.film')].every(v=>v.paused),{polling:100,timeout:5000});
  await delay(1200);await page.bringToFront();
  await page.waitForFunction(()=>!document.hidden&&[...document.querySelectorAll('.film')].every(v=>!v.paused),{timeout:5000});
  // Simulate a decoder that stops presenting frames while its clock advances.
  await page.evaluate(()=>{
    const v=document.querySelector('#worldloom-film');window.initialFilm=v.src;
    v.getVideoPlaybackQuality=()=>({totalVideoFrames:7,droppedVideoFrames:0});
  });
  await page.waitForFunction(()=>document.querySelector('#worldloom-film').src!==window.initialFilm,{timeout:15000});
  await page.evaluate(()=>{delete document.querySelector('#worldloom-film').getVideoPlaybackQuality;});
  await page.waitForFunction(()=>{const v=document.querySelector('#worldloom-film');return v.readyState>=3&&v.currentTime>.2&&!v.paused;});
  await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
  await page.reload();await page.waitForSelector('#hub-news-trigger');
  await page.tap('#hub-news-trigger');
  await page.waitForFunction(()=>document.querySelector('#hub-news').matches(':popover-open'));
  assert.ok(await page.$eval('#hub-news',e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}));
  await page.tap('#hub-news-trigger');
  await page.waitForFunction(()=>!document.querySelector('#hub-news').matches(':popover-open'));
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,hover:true,keyboard:true,touch:true,nativeLoops:true,pausedRecovery:true,realTabResume:true,decoderStallFallback:true}));
}finally{await browser.close();}
