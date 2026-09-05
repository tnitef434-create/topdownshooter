import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
try{
 const page=await browser.newPage();await page.setViewport({width:1000,height:720});const errors=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error'&&/shader|WebGL|THREE/i.test(m.text()))errors.push(m.text());});
 await page.goto('http://127.0.0.1:4180/tests/worldloom-hand-review.html');await page.waitForFunction(()=>window.handReview);
 const result=await page.evaluate(()=>{
  const v=window.handReview,gl=v.renderer.getContext();
  const snap=()=>{v.render();const data=new Uint8Array(900*600*4);gl.readPixels(0,0,900,600,gl.RGBA,gl.UNSIGNED_BYTE,data);return data;};
  v.setHand(false);const world=snap();v.setHand(true);const hand=snap();
  const mask=[];for(let i=0;i<hand.length;i+=4)if(Math.abs(hand[i]-world[i])+Math.abs(hand[i+1]-world[i+1])+Math.abs(hand[i+2]-world[i+2])>30)mask.push(i);
  v.bars.visible=true;const grass=snap();let overdraw=0;
  for(const i of mask)if(Math.abs(grass[i]-hand[i])+Math.abs(grass[i+1]-hand[i+1])+Math.abs(grass[i+2]-hand[i+2])>12)overdraw++;
  v.wall.visible=true;v.setHand(false);const wallOnly=snap();v.setHand(true);const occluded=snap();let visible=0;
  for(const i of mask)if(Math.abs(occluded[i]-wallOnly[i])+Math.abs(occluded[i+1]-wallOnly[i+1])+Math.abs(occluded[i+2]-wallOnly[i+2])>12)visible++;
  v.wall.visible=false;v.bars.visible=false;v.setHand(false);v.setLight(false);const dark=snap();v.setLight(true);const light=snap();
  let lit=0;for(let i=0;i<dark.length;i+=4)if(light[i]+light[i+1]+light[i+2]>dark[i]+dark[i+1]+dark[i+2]+60)lit++;
  v.setHand(true);snap();return {handPixels:mask.length,grassOverdraw:overdraw,terrainLeak:visible,litPixels:lit};
 });
 assert.ok(result.handPixels>5000,JSON.stringify(result));assert.ok(result.grassOverdraw<30,JSON.stringify(result));assert.equal(result.terrainLeak,0,JSON.stringify(result));assert.ok(result.litPixels>10000,JSON.stringify(result));
 await page.screenshot({path:'../../outputs/worldloom-headlamp-depth-check.png'});
 await page.goto('http://127.0.0.1:4180/tests/worldloom-fern-review.html');await page.waitForFunction(()=>window.fernReview);
 const fern=await page.evaluate(()=>{
  const v=window.fernReview,gl=v.renderer.getContext();
  const snap=()=>{v.renderer.render(v.scene,v.camera);const d=new Uint8Array(1050*700*4);gl.readPixels(0,0,1050,700,gl.RGBA,gl.UNSIGNED_BYTE,d);return d;};
  const first=snap();v.field.fields[0].mesh.visible=false;const empty=snap();v.field.fields[0].mesh.visible=true;v.field.time.value+=2;const windy=snap();
  let pixels=0,moving=0;for(let i=0;i<first.length;i+=4){if(Math.abs(first[i]-empty[i])+Math.abs(first[i+1]-empty[i+1])+Math.abs(first[i+2]-empty[i+2])>20)pixels++;
    if(Math.abs(first[i]-windy[i])+Math.abs(first[i+1]-windy[i+1])+Math.abs(first[i+2]-windy[i+2])>20)moving++;}
  return {fernPixels:pixels,windPixels:moving};
 });
 assert.ok(fern.fernPixels>5000,JSON.stringify(fern));assert.ok(fern.windPixels>500,JSON.stringify(fern));
 await page.screenshot({path:'../../outputs/worldloom-blender-fern.png'});
 assert.equal(errors.length,0,errors.join('\n'));console.log(JSON.stringify({passed:true,...result,...fern}));
}finally{await browser.close();}
