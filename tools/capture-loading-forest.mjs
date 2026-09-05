// A native 4K, locked-camera recording of Worldloom's own foliage simulation.
import puppeteer from 'puppeteer';
import {mkdir,writeFile} from 'node:fs/promises';
const out=new URL('../../loading-forest-capture/',import.meta.url);
await mkdir(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader']});
const page=await browser.newPage();
await page.setViewport({width:3840,height:2160,deviceScaleFactor:1});
page.on('pageerror',e=>console.error(e.message));
await page.evaluateOnNewDocument(()=>{
  localStorage.setItem('worldloom.settings.v1',JSON.stringify({viewDistance:4,graphicsQuality:'high',renderScale:1,weatherEffects:true,fov:58}));
  const raf=requestAnimationFrame.bind(window);
  window.requestAnimationFrame=callback=>raf(now=>{
    if(window.manualCapture&&callback.name==='animate')window.captureAnimate=callback;
    else{if(callback.name==='animate')window.captureTime=now;callback(now);}
  });
});
try{
  await page.goto(new URL('worldloom/',process.env.NITE_TEST_URL||'http://127.0.0.1:4187/').href);
  await page.waitForFunction(()=>document.querySelector('#loading-screen')?.classList.contains('hidden'),{timeout:120000});
  await page.evaluate(()=>{document.querySelector('#seed-input').value='41';document.querySelector('input[value="builder"]').checked=true;document.querySelector('#new-world-button').click();});
  await page.waitForFunction(()=>window.__worldloomPlayer&&!document.querySelector('#hud').classList.contains('hidden')&&document.querySelector('#loading-screen').classList.contains('hidden'),{timeout:240000});
  const trees=await page.evaluate(()=>{
    const p=window.__worldloomPlayer,e=window.__worldloomEnvironment,g=window.__worldloomGraphics;
    p.flying=true;p.headlampOn=false;e.time=.32;e.cycleSeconds=1e12;
    window.__worldloomHeldItem.render=()=>{};
    const creatures=window.__worldloomCreatures;
    creatures.creatures.forEach(pig=>{pig.root.visible=false;});
    creatures.update=()=>{};
    g.renderer.setPixelRatio(1);g.renderer.setSize(3840,2160,false);g.resize(3840,2160,1);
    return window.__worldloomWorld.getTreesNear(p.position.x,p.position.z,65).filter(t=>t.hasFallingLeaves&&!t.isPine).slice(0,8);
  });
  console.log('Forest trees',JSON.stringify(trees));
  const selected=Number(process.env.FOREST_TREE||0);
  for(let n=0;n<(process.argv.includes('--scout')?Math.min(5,trees.length):1);n++){
    const tree=trees[process.argv.includes('--scout')?n:selected];
    if(!tree)throw new Error('No falling-leaf trees at the capture location');
    const camera=await page.evaluate(t=>{
      const w=window.__worldloomWorld,p=window.__worldloomPlayer;
      const x=t.rootX+7,z=t.rootZ+10,y=t.crownY-4;
      p.setPosition(x,y,z);p.velocity.set(0,0,0);
      const dx=t.rootX-x,dy=t.crownY-1-y-1.58,dz=t.rootZ-z;
      p.yaw=Math.atan2(-dx,-dz);p.pitch=Math.atan2(dy,Math.hypot(dx,dz));
      return {position:[x,y,z],yaw:p.yaw,pitch:p.pitch};
    },tree);
    await page.waitForFunction(()=>window.__worldloomWorld.isNeighborhoodRendered(window.__worldloomPlayer.position.x,window.__worldloomPlayer.position.z,2),{timeout:180000});
    await new Promise(r=>setTimeout(r,10000));
    await page.evaluate(()=>{window.manualCapture=true;});
    await page.waitForFunction(()=>window.captureAnimate);
    // Let the real particles reach the lower canopy before the first frame.
    await page.evaluate(()=>{for(let i=0;i<600;i++){window.captureTime+=1000/30;window.captureAnimate(window.captureTime);}});
    const frames=process.argv.includes('--scout')?1:360;
    for(let i=0;i<frames;i++){
      const data=await page.evaluate(c=>{
        const p=window.__worldloomPlayer;p.setPosition(...c.position);p.velocity.set(0,0,0);p.yaw=c.yaw;p.pitch=c.pitch;
        window.captureTime+=1000/30;window.captureAnimate(window.captureTime);
        const renderer=window.__worldloomGraphics.renderer;renderer.getContext().finish();
        if(renderer.domElement.width!==3840||renderer.domElement.height!==2160)throw new Error('Expected native 4K');
        return renderer.domElement.toDataURL('image/jpeg',.96).split(',')[1];
      },camera);
      const name=process.argv.includes('--scout')?`scout-${n}.jpg`:`${String(i).padStart(4,'0')}.jpg`;
      await writeFile(new URL(name,out),Buffer.from(data,'base64'));
      if(i%60===0)console.log('Recorded',name);
    }
    await page.evaluate(()=>{window.manualCapture=false;requestAnimationFrame(window.captureAnimate);});
  }
}finally{await browser.close();}
