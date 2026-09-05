import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const base=process.env.HUB_TEST_URL||'http://127.0.0.1:4187/';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Use a local preview.');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader']});
try{
  const page=await browser.newPage(),errors=[];
  await page.setViewport({width:1280,height:800});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&/WebGLProgram|Shader Error|VALIDATE_STATUS|GL_INVALID/.test(m.text()))errors.push(m.text());});
  await page.evaluateOnNewDocument(()=>localStorage.setItem('worldloom.settings.v1',JSON.stringify({viewDistance:2,graphicsQuality:'low',renderScale:.65,masterVolume:0,musicEnabled:false,weatherEffects:false})));
  await page.goto(new URL('worldloom/',base).href);
  await page.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('hidden'));
  await page.type('#seed-input','41');await page.click('label:has(input[value="builder"])');await page.click('#new-world-button');
  await page.waitForFunction(()=>window.__worldloomWorld&&document.querySelector('#loading-screen').classList.contains('hidden'),{timeout:180000});
  const initial=await page.evaluate(()=>{
    const w=window.__worldloomWorld,p=window.__worldloomPlayer,e=window.__worldloomEnvironment;
    return {stats:w.getStats(),safeDistance:w.getSafeTerrainDistance(p.position),cameraFar:p.camera.far,fogNear:e.scene.fog.near,clarity:e.fogClarity};
  });
  assert.ok(initial.stats.distantTerrain.ready,'the distant landscape is complete before entry');
  assert.ok(initial.safeDistance>initial.cameraFar&&initial.cameraFar>=704,'the camera stays inside the fully loaded horizon');
  assert.equal(initial.stats.queued,0,'initial generation finishes behind the loading screen');
  await page.screenshot({path:'../../outputs/worldloom-spawn-horizon.png'});
  // Look across that same initial footprint from above the canopy.
  await page.evaluate(()=>{const p=window.__worldloomPlayer;p.flying=true;p.position.y+=25;p.velocity.set(0,0,0);p.pitch=-.12;p.yaw=.8;});
  await page.waitForFunction(()=>window.__worldloomEnvironment.fogClarity>.999,{timeout:60000});
  const clear=await page.evaluate(()=>({near:window.__worldloomEnvironment.scene.fog.near,far:window.__worldloomPlayer.camera.far}));
  assert.ok(clear.near>clear.far,'clear weather has no fog inside the rendered view');
  await page.screenshot({path:'../../outputs/worldloom-clear-horizon.png'});
  assert.deepEqual(errors,[]);
  await writeFile('../../outputs/Worldloom-horizon-check.json',JSON.stringify({passed:true,initial,clear},null,2));
  console.log(JSON.stringify({passed:true,initialCameraFar:initial.cameraFar,safeDistance:initial.safeDistance,fogOutsideView:true}));
}finally{await browser.close();}
