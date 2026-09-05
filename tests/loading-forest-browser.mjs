import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
const base=process.env.HUB_TEST_URL||'http://127.0.0.1:4187/';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Use a local preview.');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader']});
try {
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.setViewport({width:1920,height:1080});
  await page.evaluateOnNewDocument(()=>localStorage.setItem('worldloom.settings.v1',JSON.stringify({viewDistance:8,graphicsQuality:'balanced',renderScale:.7,volume:.7,ambienceVolume:.6,musicEnabled:false})));
  await page.goto(new URL('worldloom/',base).href);
  await page.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('hidden'),{timeout:120000});
  assert.equal(await page.$eval('#loading-film',v=>v.getAttribute('src')),null,'no chunk video download in the menu');
  assert.equal(await page.$eval('#loading-birds',a=>a.paused),true);
  await page.$eval('#seed-input',e=>e.value='41');
  await page.click('#new-world-button');
  await page.waitForFunction(()=>window.__worldloomPlayer&&document.querySelector('#loading-screen').classList.contains('hidden'),{timeout:240000});
  assert.equal(await page.$eval('#loading-screen',e=>e.dataset.phase),'world');
  assert.equal(await page.$eval('.u-loading__mark',e=>getComputedStyle(e).display),'none');
  assert.ok(await page.$eval('#loading-birds',a=>a.volume>0&&a.volume<.5));
  const playback=await page.$eval('#loading-film',v=>{const q=v.getVideoPlaybackQuality();return {width:v.videoWidth,frames:q.totalVideoFrames-q.droppedVideoFrames,time:v.currentTime};});
  console.log('Frames presented during chunk loading',playback);
  assert.equal(playback.width,3840);assert.ok(playback.frames>3,'video frames are presented during chunk work');
  assert.ok(await page.$eval('#loading-birds',a=>a.currentTime>.3),'original bird recording plays during loading');
  assert.equal(await page.$eval('#loading-film',v=>v.paused),true);
  assert.equal(await page.$eval('#loading-birds',v=>v.paused),true,'loading birds stop on spawn');
  // Reuse the controller in isolation to cover phones, muting and retries.
  let fail4k=false;
  await page.setRequestInterception(true);
  page.on('request',r=>{
    if(new URL(r.url()).pathname==='/worldloom/src/main.js')return r.respond({status:200,contentType:'application/javascript',body:'// Isolated loading-scene visual fixture.'});
    if(fail4k&&r.url().endsWith('forest-leaves-4k.mp4'))return r.abort('failed');
    r.continue();
  });
  await page.goto(new URL('worldloom/',base).href);await page.setViewport({width:390,height:844});
  await page.evaluate(async()=>{
    const {LoadingScene}=await import('/worldloom/src/loading-scene.js');window.testLoadingScene=new LoadingScene();
    window.testLoadingScene.setSettings({volume:0});window.testLoadingScene.setActive(true);
    const screen=document.querySelector('#loading-screen');screen.dataset.phase='world';screen.classList.remove('hidden','fade-out');
    screen.querySelector('.u-loading__title').textContent='Loading your world';
    document.querySelector('#loading-text').textContent='Growing the forest…';document.querySelector('#loading-bar').style.width='43%';
  });
  await page.waitForFunction(()=>document.querySelector('#loading-film').videoWidth===1920);
  assert.equal(await page.$eval('#loading-birds',a=>a.paused),true,'muted ambience stays silent');
  await page.screenshot({path:'../../outputs/worldloom-forest-loading-mobile.png'});
  assert.ok(await page.$eval('.u-loading__content',e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight;}));
  await page.setViewport({width:1920,height:1080});
  await page.evaluate(()=>{window.testLoadingScene.setActive(false);document.querySelector('#loading-film').removeAttribute('src');window.testLoadingScene.setActive(true);});
  await page.waitForFunction(()=>{const v=document.querySelector('#loading-film');return v.videoWidth===3840&&!v.paused&&v.currentTime>.5;});
  await page.screenshot({path:'../../outputs/worldloom-forest-loading-4k.png'});
  fail4k=true;
  await page.setCacheEnabled(false);
  await page.evaluate(()=>{window.testLoadingScene.setActive(false);const v=document.querySelector('#loading-film');v.removeAttribute('src');v.load();window.testLoadingScene.setActive(true);});
  await page.waitForFunction(()=>{const v=document.querySelector('#loading-film');return v.src.endsWith('forest-leaves-1080.mp4')&&v.videoWidth===1920&&!v.paused&&v.currentTime>.5;});
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,native4k:true,chunkPlayback:true,birdRecording:true,stopsOnSpawn:true,mobile1080:true,volumeRespected:true,failed4kFallsBack:true}));
}catch(error){for(const page of await browser.pages()){console.log('Loading failure',await page.evaluate(()=>({url:location.href,message:document.querySelector('#loading-text')?.textContent,phase:document.querySelector('#loading-screen')?.dataset.phase,hidden:document.querySelector('#loading-screen')?.className,video:[document.querySelector('#loading-film')?.src,document.querySelector('#loading-film')?.videoWidth,document.querySelector('#loading-film')?.paused,document.querySelector('#loading-film')?.currentTime],birds:[document.querySelector('#loading-birds')?.paused,document.querySelector('#loading-birds')?.currentTime]})));}throw error;}finally{await browser.close();}
