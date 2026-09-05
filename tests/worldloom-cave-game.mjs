import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
try{
 const page=await browser.newPage();await page.setViewport({width:1200,height:800});const errors=[];
 page.on('pageerror',e=>{errors.push(String(e));console.error(String(e));});page.on('console',m=>{if(m.type()==='error'&&/shader|WebGL|THREE/i.test(m.text())){errors.push(m.text());console.error(m.text());}});
 await page.goto('http://127.0.0.1:4180/tests/worldloom-cave-review.html');await page.click('#start');
 const frame=await (await page.$('#game')).contentFrame();
 await frame.waitForFunction(()=>window.__worldloomPlayer&&!document.querySelector('#hud').classList.contains('hidden')&&document.querySelector('#loading-screen').classList.contains('hidden'),{timeout:120000});
 await page.waitForFunction(()=>window.caveReviewReady,{timeout:120000});
 await page.click('#inside');
 try{await frame.waitForFunction(()=>window.__worldloomEnvironment.skyExposure<.08&&window.__worldloomWorld.isNeighborhoodRendered(42.6,63.6,1),{timeout:60000});}
 catch(error){console.log(await frame.evaluate(()=>({position:window.__worldloomPlayer.position.toArray(),sky:window.__worldloomEnvironment.skyExposure,chunks:[...window.__worldloomWorld.chunks.values()].filter(c=>c.cx>=1&&c.cx<=3&&c.cz>=2&&c.cz<=4).map(c=>[c.cx,c.cz,c.generated,c.meshDirty,c.opaqueMesh?.visible])})));throw error;}
 const data=await frame.evaluate(()=>{
  const e=window.__worldloomEnvironment,w=window.__worldloomWorld,p=window.__worldloomPlayer;
  return {version:w.generatorVersion,hemisphere:e.hemisphere.intensity,bounce:e.bounceLight.intensity,fog:e.scene.fog.color.getHexString(),light:p.headlampOn,cavePlants:e.cavePlants.fields.map(f=>f.mesh.count),pos:p.position.toArray()};
 });
 await page.screenshot({path:'../../outputs/worldloom-cave-interior.png'});
 await frame.evaluate(()=>{for(const type of ['keydown','keyup'])document.dispatchEvent(new KeyboardEvent(type,{code:'KeyF',bubbles:true}));});
 await frame.waitForFunction(()=>window.__worldloomEnvironment.headlamp.light.intensity===0);
 await page.screenshot({path:'../../outputs/worldloom-cave-lamp-off.png'});
 assert.equal(await frame.evaluate(()=>window.__worldloomPlayer.headlampOn),false);
 await page.click('#lamp');await frame.waitForFunction(()=>window.__worldloomEnvironment.headlamp.enabled);
 await page.click('#deep');
 await frame.waitForFunction(()=>window.__worldloomEnvironment.skyExposure<.08&&window.__worldloomEnvironment.scene.fog.far>25&&window.__worldloomPlayer.position.y<24,{timeout:60000});
 await page.screenshot({path:'../../outputs/worldloom-cave-pool.png'});
 await page.click('#fern');await frame.waitForFunction(()=>window.__worldloomEnvironment.skyExposure>.9&&window.__worldloomWorld.isNeighborhoodRendered(50,42,1),{timeout:45000});
 await page.screenshot({path:'../../outputs/worldloom-fern.png'});
 await page.click('#ores');await frame.waitForFunction(()=>!window.__worldloomWorld.chunks.get('2,4').meshDirty,{timeout:45000});
 await page.screenshot({path:'../../outputs/worldloom-ores.png'});
 assert.equal(data.version,3);assert.ok(data.cavePlants[1]>0&&data.cavePlants[2]>0);assert.ok(data.hemisphere>1);
 assert.equal(errors.length,0,errors.join('\n'));console.log(JSON.stringify({passed:true,...data}));
}finally{await browser.close();}
