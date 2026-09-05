import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
try{
 const page=await browser.newPage();await page.setViewport({width:1100,height:740});const errors=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error'&&/shader|WebGL|THREE/i.test(m.text()))errors.push(m.text());});
 await page.goto('http://127.0.0.1:4180/tests/worldloom-surface-review.html');await page.waitForFunction(()=>window.surfaceReview,{timeout:30000});
 await page.click('#overhead');await page.click('#mist');
 const result=await page.evaluate(()=>{
  const r=window.surfaceReview,changed=(a,b)=>{let n=0;for(let i=0;i<a.length;i+=4)if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>8)n++;return n;};
  r.render(0);const baseline=r.pixels();r.render(.8);const moving=r.pixels();
  const before=r.pixels();r.effects.splash({x:0,z:0},2.92,4);r.effects.waveUniforms.waterRippleTime.value+=.55;r.render(0);
  r.effects.mesh.visible=false;for(const ring of r.effects.ringPool)ring.visible=false;
  const actualWave=r.pixels();
  // Changing transparent chunk order must not change its refraction colour.
  let order=2;for(const chunk of r.world.chunks.values())chunk.waterMesh.renderOrder=order++;
  const ordered=r.pixels();for(const chunk of r.world.chunks.values())chunk.waterMesh.renderOrder=10-chunk.waterMesh.renderOrder;
  const reversed=r.pixels();
  return {surfaceMotionPixels:changed(baseline,moving),impactWithoutSpritesPixels:changed(before,actualWave),chunkOrderPixels:changed(ordered,reversed),captureValid:r.capture.uniforms.waterSceneValid.value};
 });
 assert.ok(result.surfaceMotionPixels>500,JSON.stringify(result));assert.ok(result.impactWithoutSpritesPixels>40,JSON.stringify(result));
 assert.ok(result.chunkOrderPixels<20,JSON.stringify(result));assert.equal(result.captureValid,1);
 await page.screenshot({path:'../../outputs/worldloom-surface-waves.png'});
 await page.click('#bank');await page.click('#mist');await page.screenshot({path:'../../outputs/worldloom-hanging-pond-fog.png'});
 await page.click('#mushrooms');await page.screenshot({path:'../../outputs/worldloom-solid-mushrooms.png'});
 assert.equal(errors.length,0,errors.join('\n'));console.log(JSON.stringify({passed:true,...result},null,2));
}finally{await browser.close();}
