import puppeteer from 'puppeteer';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const out=fileURLToPath(new URL('../../hub-capture/',import.meta.url));
await mkdir(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
try{
  const p=await browser.newPage();await p.setViewport({width:1800,height:1600});
  p.on('pageerror',e=>console.error(e.message));
  await p.evaluateOnNewDocument(()=>{
    localStorage.setItem('tacticstrike_selected_map','manor');
    localStorage.setItem('tacticstrike_player_weapon','rifle');
    HTMLMediaElement.prototype.play=()=>Promise.reject(new DOMException('Capture is silent','NotAllowedError'));
  });
  await p.goto('http://127.0.0.1:4178/tacticstrike/');
  await p.waitForSelector('#btn-deploy-main');
  await p.evaluate(()=>{
    document.querySelectorAll('.modal-overlay.active').forEach(m=>m.classList.remove('active'));
    const mode=document.querySelector('.match-mode-input[value="2v2"]');mode.checked=true;mode.dispatchEvent(new Event('change',{bubbles:true}));
    document.querySelector('#btn-deploy-main').click();document.querySelector('#btn-practice-bot').click();
  });
  await p.waitForFunction(()=>window.gameEngine?.mode==='offline'&&window.gameEngine.players.length===4,{timeout:30000});
  await p.evaluate(()=>{
    const e=window.gameEngine;e.gameState='playing';e.roundStartTime=performance.now();
    e.players.forEach(p=>{p.takeDamage=()=>{};p.flashlightOn=true;});
  });
  await new Promise(r=>setTimeout(r,6500));
  const data=await p.evaluate(()=>{
    const e=window.gameEngine;
    e.settings.shadows=false;e.camera.x=e.map.width/2;e.camera.y=e.map.height/2;
    e.render();
    return {image:e.canvas.toDataURL('image/jpeg',.96).split(',')[1],players:e.players.map(p=>({x:p.x,y:p.y})),map:{width:e.map.width,height:e.map.height}};
  });
  await writeFile(`${out}/tacticstrike.jpg`,Buffer.from(data.image,'base64'));
  console.log(JSON.stringify({players:data.players,map:data.map}));
}finally{await browser.close();}
