import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
try {
 const page=await browser.newPage();await page.setViewport({width:1200,height:800});const errors=[];
 page.on('pageerror',e=>{errors.push(String(e));console.error(String(e));});page.on('console',m=>{if(m.type()==='error'&&/shader|WebGL|THREE/i.test(m.text()))errors.push(m.text());});
 await page.evaluateOnNewDocument(()=>localStorage.setItem('worldloom.settings.v1',JSON.stringify({viewDistance:3,graphicsQuality:'high',weatherEffects:true})));
 await page.goto('http://127.0.0.1:4178/worldloom/index.html');await page.waitForSelector('#new-world-button');
 await page.evaluate(()=>{document.querySelector('#seed-input').value='41';document.querySelector('#new-world-button').click();});
 await page.waitForFunction(()=>window.__worldloomPlayer&&!document.querySelector('#hud').classList.contains('hidden'),{timeout:120000});
 await page.evaluate(()=>{
  const p=window.__worldloomPlayer;p.flying=true;p.pitch=-.42;p.yaw=0;p.setPosition(36,34,0);
 });
 await page.waitForFunction(()=>window.__worldloomEnvironment.waterReflection.renders>0,{timeout:45000});
 const initial=await page.evaluate(()=>{
   const e=window.__worldloomEnvironment,w=window.__worldloomWorld;
   return {reflection:e.waterReflection.renders,valid:w.waterMaterial.userData.waterReflection.valid.value,waterChunks:[...w.chunks.values()].filter(c=>c.waterMesh?.visible).length,ao:window.__worldloomGraphics.aoEnabled};
 });
 assert.equal(initial.valid,1);assert.ok(initial.waterChunks>0);assert.equal(initial.ao,true);
 await page.screenshot({path:'../../outputs/worldloom-realistic-water.png'});
 await page.evaluate(()=>{window.__worldloomEnvironment.graphicsUniforms.time.value+=2.4;});
 await page.screenshot({path:'../../outputs/worldloom-water-ripples-later.png'});
 await page.evaluate(()=>{const p=window.__worldloomPlayer;p.pitch=-.12;p.setPosition(36,29.2,0);});
 await page.waitForFunction(()=>window.__worldloomWorld.waterMaterial.userData.waterReflection.valid.value===0,{timeout:15000});
 await page.screenshot({path:'../../outputs/worldloom-underwater.png'});
 const final=await page.evaluate(()=>{const e=window.__worldloomEnvironment;return {cameraVisible:window.__worldloomPlayer.camera.visible,waterVisible:[...window.__worldloomWorld.chunks.values()].some(c=>c.waterMesh?.visible),submerged:e.waterView.submerged,depth:e.waterView.depth,fogFar:e.scene.fog.far,skyVisible:e.atmosphere.visible};});
 assert.equal(final.cameraVisible,true);assert.equal(final.waterVisible,true);assert.equal(final.submerged,true);assert.ok(final.fogFar<24);assert.equal(final.skyVisible,false);
 await page.evaluate(()=>{const p=window.__worldloomPlayer;p.pitch=-.9;p.setPosition(36,33.1,0);});
 await page.waitForFunction(()=>!window.__worldloomEnvironment.waterView.submerged&&window.__worldloomEnvironment.atmosphere.visible);
 const entries=await page.evaluate(()=>window.__worldloomEnvironment.waterEffects.entries);
 await page.evaluate(()=>window.__worldloomPlayer.setPosition(36,32.65,0));
 await page.waitForFunction(n=>{const f=window.__worldloomEnvironment.waterEffects;return f.entries>n&&f.rings.some(r=>r.age>.18);},{timeout:15000},entries);
 const splash=await page.evaluate(()=>window.__worldloomEnvironment.waterEffects.getStats());
 assert.ok(splash.droplets>0&&splash.ripples>0);await page.screenshot({path:'../../outputs/worldloom-water-splash.png'});
 const pond=await page.evaluate(()=>{const w=window.__worldloomWorld,p=w.getPondsNear(0,0,450)[0];if(!p)return null;const player=window.__worldloomPlayer;player.pitch=-.6;player.setPosition(p.centerX,p.waterY+2.3,p.centerZ+4);return p;});
 assert.ok(pond,'seed 41 contains a pond for integration coverage');
 await page.waitForFunction(()=>window.__worldloomSeaLife.getStats().pondFish>=3,{timeout:60000});
 const pondLife=await page.evaluate(()=>window.__worldloomSeaLife.getStats());
 assert.equal(pondLife.plants,0);await page.screenshot({path:'../../outputs/worldloom-pond-fish.png'});
 assert.equal(errors.length,0,errors.join('\n'));
 console.log(JSON.stringify({passed:true,...initial,...final,splash,pondLife},null,2));
}finally{await browser.close();}
