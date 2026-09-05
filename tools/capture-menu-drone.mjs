// Native 3840x2160 game capture, in an isolated headless Chrome profile.
import puppeteer from 'puppeteer';
import { mkdir,writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const out=fileURLToPath(new URL('../../menu-drone-capture/',import.meta.url));
await mkdir(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader']});
const page=await browser.newPage();
await page.setViewport({width:3840,height:2160,deviceScaleFactor:1});
page.on('pageerror',e=>console.error(e.message));
await page.evaluateOnNewDocument(()=>{
  localStorage.setItem('worldloom.settings.v1',JSON.stringify({viewDistance:5,graphicsQuality:'high',renderScale:1,weatherEffects:true,fov:70}));
  const raf=window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame=callback=>raf(now=>{
    if(window.manualCapture&&callback.name==='animate')window.captureAnimate=callback;
    else{if(callback.name==='animate')window.captureTime=now;callback(now);}
  });
});
try{
  await page.goto(new URL('worldloom/index.html',process.env.NITE_TEST_URL||'http://127.0.0.1:4186/').href);
  await page.waitForFunction(()=>document.querySelector('#loading-screen')?.classList.contains('hidden'),{timeout:120000});
  await page.evaluate(()=>{document.querySelector('#seed-input').value='41';document.querySelector('input[value="builder"]').checked=true;document.querySelector('#new-world-button').click();});
  await page.waitForFunction(()=>window.__worldloomPlayer&&!document.querySelector('#hud').classList.contains('hidden')&&document.querySelector('#loading-screen').classList.contains('hidden'),{timeout:180000});
  await page.evaluate(()=>{
    const p=window.__worldloomPlayer,e=window.__worldloomEnvironment,g=window.__worldloomGraphics;
    p.flying=true;p.headlampOn=false;e.time=.34;e.cycleSeconds=1e12;
    window.__worldloomHeldItem.render=()=>{};
    g.renderer.setPixelRatio(1);g.renderer.setSize(3840,2160,false);g.resize(3840,2160,1);
  });
  const scenes=[
    {name:'pond',eye:[-5.5,46,272.5],target:[-13.5,39,261.5],travel:[-3,0,1.5]},
    {name:'coast',eye:[42,40,12],target:[20,32,-24],travel:[-4,.5,-3]},
    {name:'ridge',eye:[5,47,18],target:[-16,31,-17],travel:[-3,.7,-2]},
  ];
  for(const scene of scenes){
    const only=process.argv.indexOf('--scene');if(only>=0&&process.argv[only+1]!==scene.name)continue;
    console.log('Preparing 4K',scene.name);
    await page.evaluate(s=>{
      const p=window.__worldloomPlayer;p.setPosition(...s.eye);p.velocity.set(0,0,0);
      const dx=s.target[0]-s.eye[0],dy=s.target[1]-s.eye[1]-1.58,dz=s.target[2]-s.eye[2];
      p.yaw=Math.atan2(-dx,-dz);p.pitch=Math.atan2(dy,Math.hypot(dx,dz));
    },scene);
    await page.waitForFunction(()=>window.__worldloomWorld.isNeighborhoodRendered(window.__worldloomPlayer.position.x,window.__worldloomPlayer.position.z,2)&&window.__worldloomEnvironment.scene.fog.far>55,{timeout:180000});
    await new Promise(r=>setTimeout(r,2500));
    await mkdir(`${out}/${scene.name}`,{recursive:true});
    await page.evaluate(()=>{window.manualCapture=true;});
    await page.waitForFunction(()=>window.captureAnimate);
    for(let i=0;i<(process.argv.includes('--scout')?1:120);i++){
      const frame=await page.evaluate(({s,i})=>{
        const p=window.__worldloomPlayer,u=i/119;
        p.setPosition(...s.eye.map((v,k)=>v+s.travel[k]*u));
        const dx=s.target[0]-p.position.x,dy=s.target[1]-p.position.y-1.58,dz=s.target[2]-p.position.z;
        p.yaw=Math.atan2(-dx,-dz);p.pitch=Math.atan2(dy,Math.hypot(dx,dz));
        window.captureTime+=1000/24;window.captureAnimate(window.captureTime);
        const g=window.__worldloomGraphics;g.renderer.getContext().finish();
        return {data:g.renderer.domElement.toDataURL('image/jpeg',.92).split(',')[1],width:g.renderer.domElement.width,height:g.renderer.domElement.height};
      },{s:scene,i});
      if(frame.width!==3840||frame.height!==2160)throw new Error('Capture is not native 4K');
      await writeFile(`${out}/${scene.name}/${String(i).padStart(4,'0')}.jpg`,Buffer.from(frame.data,'base64'));
      if(i%40===0)console.log(`${scene.name} ${i}/120 at ${frame.width}x${frame.height}`);
    }
    await page.evaluate(()=>{window.manualCapture=false;window.requestAnimationFrame(window.captureAnimate);});
  }
}finally{await browser.close();}
