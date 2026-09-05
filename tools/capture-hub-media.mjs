// Record native high-resolution gameplay for Unpaused in an isolated browser.
// Recorded movement runs through the real player controller and collision.
import puppeteer from 'puppeteer';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../../hub-capture-hq/', import.meta.url));
const width = 1800, height = 2000, fps = 30, frameCount = fps * 6;
await mkdir(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--enable-webgl', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error(e.message));
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('worldloom.settings.v1', JSON.stringify({viewDistance:5,graphicsQuality:'high',renderScale:1,weatherEffects:true,fov:74,reducedMotion:false}));
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (callback) => raf((now) => {
    if (window.manualCapture && callback.name === 'animate') window.captureAnimate = callback;
    else { if(callback.name==='animate')window.captureTime = now; callback(now); }
  });
});
try {
  await page.goto(new URL('worldloom/index.html',process.env.HUB_CAPTURE_URL||'http://127.0.0.1:4187/').href);
  await page.waitForFunction(() => document.querySelector('#loading-screen')?.classList.contains('hidden'), {timeout:120000});
  await page.evaluate(() => {document.querySelector('#seed-input').value='41';document.querySelector('input[value="builder"]').checked=true;document.querySelector('#new-world-button').click();});
  await page.waitForFunction(() => window.__worldloomPlayer && document.querySelector('#loading-screen').classList.contains('hidden') && !document.querySelector('#hud').classList.contains('hidden'), {timeout:180000});
  const scenes = await page.evaluate(() => {
    const w=window.__worldloomWorld,e=window.__worldloomEnvironment,p=window.__worldloomPlayer;
    p.flying=false;e.time=.34;e.cycleSeconds=1e12;p.headlampOn=false;
    // Keep the normal hand presentation when filming without pointer lock.
    const held=window.__worldloomHeldItem,show=held.setVisible.bind(held);
    held.setVisible=()=>show(true);
    const update=p.update.bind(p);
    p.update=(dt,input,settings)=>update(dt,window.gameplayCapture?{
      consumeLook:()=>({x:window.captureFrame>30?-.176:0,y:0}),
      isDown:(...codes)=>{
        if(window.captureFrame<25||window.captureFrame>=144)return false;
        if(codes.includes('KeyW'))return true;
        return codes.includes('Space')&&p.grounded&&p._collidesAt(p.position.clone().addScaledVector(p._forward,.8));
      },
    }:input,{...settings,speedMultiplier:.5});
    const pond=w.getPondsNear(0,0,450)[0];
    const scenes=[
      {name:'coast',center:[42,12],yaw:0,pitch:-.12},
      {name:'pond',center:[pond.centerX+10,pond.centerZ+14],yaw:.65,pitch:-.15},
      {name:'ridge',center:[0,12],yaw:-.45,pitch:-.12},
    ];
    for(const s of scenes){
      let best=null;
      for(let dz=-36;dz<=36;dz+=3)for(let dx=-36;dx<=36;dx+=3){
        const x=s.center[0]+dx,z=s.center[1]+dz,h=w.terrainHeight(x,z);
        if(h<34)continue;
        let valid=true,rough=0,prev=h;
        for(let i=0;i<11;i++){
          const px=x-Math.sin(s.yaw)*i,pz=z-Math.cos(s.yaw)*i,info=w._columnInfo(px,pz);
          if(info.height<34||info.caveMouth||Number.isFinite(info.pondWaterLevel)||Math.abs(info.height-prev)>1){valid=false;break;}
          rough+=Math.abs(info.height-prev);prev=info.height;
        }
        const score=Math.hypot(dx,dz)+rough*2;
        if(valid&&(!best||score<best.score))best={eye:[x+.5,h+1.03,z+.5],score};
      }
      if(!best)throw new Error(`No dry gameplay path for ${s.name}`);
      Object.assign(s,best);
    }
    return scenes;
  });
  await page.evaluate(({width,height})=>{
    const g=window.__worldloomGraphics;
    g.renderer.setPixelRatio(1);g.renderer.setSize(width,height,false);g.resize(width,height,1);
  },{width,height});
  await writeFile(`${out}/scenes.json`,JSON.stringify(scenes,null,2));
  for (const scene of scenes) {
    const only=process.argv.indexOf('--scene');
    if(only>=0&&process.argv[only+1]!==scene.name)continue;
    console.log(`Preparing ${scene.name}`,scene);
    await page.evaluate(s=>{
      const p=window.__worldloomPlayer;p.flying=true;p.setPosition(...s.eye);p.velocity.set(0,0,0);
      p.yaw=s.yaw;p.pitch=s.pitch;
    },scene);
    await page.waitForFunction(()=>window.__worldloomWorld.isNeighborhoodRendered(window.__worldloomPlayer.position.x,window.__worldloomPlayer.position.z,2)&&window.__worldloomEnvironment.scene.fog.far>55,{timeout:180000});
    await page.evaluate(()=>{window.__worldloomPlayer.flying=false;});
    await page.evaluate(()=>new Promise(r=>setTimeout(r,3000)));
    const scout=await page.evaluate(()=>{const g=window.__worldloomGraphics;g.render(.001);window.__worldloomHeldItem.render(g.renderer,window.__worldloomEnvironment.scene);g.renderer.getContext().finish();return g.renderer.domElement.toDataURL('image/jpeg',.92).split(',')[1];});
    await writeFile(`${out}/${scene.name}.jpg`,Buffer.from(scout,'base64'));
    if(process.argv.includes('--scout'))continue;
    await mkdir(`${out}/${scene.name}`,{recursive:true});
    await page.evaluate(()=>{window.manualCapture=true;});
    await page.waitForFunction(()=>window.captureAnimate);
    await page.evaluate(()=>{window.gameplayCapture=true;window.captureFrame=0;});
    for(let i=0;i<frameCount;i++){
      const data=await page.evaluate(({s,i})=>{
        window.captureFrame=i;
        window.captureTime+=1000/30;window.captureAnimate(window.captureTime);
        const g=window.__worldloomGraphics;g.renderer.getContext().finish();
        if(g.renderer.domElement.width!==1800||g.renderer.domElement.height!==2000)throw new Error('Capture must render at native 1800x2000');
        return g.renderer.domElement.toDataURL('image/jpeg',.97).split(',')[1];
      },{s:scene,i});
      await writeFile(`${out}/${scene.name}/${String(i).padStart(4,'0')}.jpg`,Buffer.from(data,'base64'));
      if(i%60===0)console.log(`${scene.name} ${i}/${frameCount} at ${width}x${height}`);
    }
    console.log('Gameplay end',await page.evaluate(()=>({position:window.__worldloomPlayer.position.toArray(),distance:window.__worldloomPlayer.distanceMoved,hand:window.__worldloomHeldItem.presentationVisible})));
    await page.evaluate(()=>{window.gameplayCapture=false;window.manualCapture=false;window.requestAnimationFrame(window.captureAnimate);});
  }
} finally { await browser.close(); }
