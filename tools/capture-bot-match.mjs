// Private, silent recording of the real offline simulation: all four actors
// use the production bot AI, and the camera observes the whole arena.
import puppeteer from 'puppeteer';
import {mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const out=fileURLToPath(new URL('../../bot-match-capture/',import.meta.url));
await mkdir(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
try {
  const page=await browser.newPage();
  await page.setViewport({width:1800,height:2000,deviceScaleFactor:1});
  page.on('pageerror',e=>console.error(e.message));
  await page.evaluateOnNewDocument(()=>{
    localStorage.setItem('tacticstrike_selected_map','cyberlab');
    localStorage.setItem('tacticstrike_player_weapon','rifle');
    HTMLMediaElement.prototype.play=()=>Promise.reject(new DOMException('Silent capture','NotAllowedError'));
  });
  await page.goto(process.env.HUB_CAPTURE_URL||'http://127.0.0.1:4186/tacticstrike/');
  await page.waitForFunction(()=>!document.querySelector('#startup-overlay'));
  await page.evaluate(()=>{
    document.querySelectorAll('.modal-overlay.active').forEach(m=>m.classList.remove('active'));
    const mode=document.querySelector('.match-mode-input[value="2v2"]');mode.checked=true;mode.dispatchEvent(new Event('change',{bubbles:true}));
    document.querySelector('#btn-deploy-main').click();document.querySelector('#btn-practice-bot').click();
  });
  await page.waitForFunction(()=>window.gameEngine?.mode==='offline'&&window.gameEngine.players.length===4);
  await page.evaluate(()=>{
    const e=window.gameEngine;e.loop=()=>{};
    window.captureClock=performance.now();
    Object.defineProperty(performance,'now',{value:()=>window.captureClock});
    const epoch=Date.now()-window.captureClock;Date.now=()=>epoch+window.captureClock;
    e.players.forEach((p,i)=>{
      p.isBot=true;p.name=`${p.team===1?'ALPHA':'BRAVO'} ${i<2?'1':'2'}`;
      const update=p.update.bind(p);p.update=(keys,...args)=>keys?undefined:update(keys,...args);
      p.flashlightOn=true;
    });
    e.settings.shadows=false;
    Object.defineProperty(e,'zoom',{get:()=>1.22,set:()=>{},configurable:true});
    e.startRoundCycle();e.startRoundAction();
    window.matchCaptureStats=[];
  });
  for(let frame=0;frame<600;frame++) {
    const data=await page.evaluate(frame=>{
      const e=window.gameEngine;
      if(e.gameState!=='playing'){e.startRoundCycle();e.startRoundAction();}
      for(let tick=0;tick<2;tick++){window.captureClock+=1000/60;e.update(window.captureClock);}
      e.camera.x=e.map.width/2;e.camera.y=e.map.height/2;e.camera.shakeX=e.camera.shakeY=0;
      e.render();
      if(frame%30===0)window.matchCaptureStats.push({frame,bullets:e.bullets.filter(b=>b.active).length,players:e.players.map(p=>({bot:p.isBot,team:p.team,x:p.x,y:p.y,health:p.health}))});
      return e.canvas.toDataURL('image/jpeg',.95).split(',')[1];
    },frame);
    await writeFile(`${out}/${String(frame).padStart(4,'0')}.jpg`,Buffer.from(data,'base64'));
    if(frame%120===0)console.log(`Bots ${frame}/600`);
  }
  const stats=await page.evaluate(()=>window.matchCaptureStats);
  await writeFile(`${out}/match.json`,JSON.stringify(stats,null,2));
  if(!stats.every(s=>s.players.every(p=>p.bot))||!stats.some(s=>s.bullets>0))throw new Error('Capture must contain four fighting bots.');
  console.log('Recorded 20 seconds of overhead 2v2 bot gameplay.');
} finally {await browser.close();}
