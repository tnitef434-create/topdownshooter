import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
try {
  const page=await browser.newPage();await page.setViewport({width:1100,height:760});const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error'&&/shader|WebGL|THREE/i.test(m.text()))errors.push(m.text());});
  await page.evaluateOnNewDocument(()=>localStorage.setItem('worldloom.settings.v1',JSON.stringify({viewDistance:3,graphicsPreset:'low',weatherEffects:true})));
  await page.goto('http://127.0.0.1:4178/worldloom/index.html');
  await page.waitForSelector('#new-world-button');
  await page.evaluate(()=>{document.querySelector('#seed-input').value='41';document.querySelector('#new-world-button').click();});
  await page.waitForFunction(()=>window.__worldloomPlayer&&!document.querySelector('#hud').classList.contains('hidden'),{timeout:120000});
  const coast=await page.evaluate(()=>{
    const world=window.__worldloomWorld,player=window.__worldloomPlayer;let candidate=null;
    for(let radius=12;radius<=240&&!candidate;radius+=12)for(let i=0;i<32;i++){
      const a=i/32*Math.PI*2,x=Math.floor(player.position.x+Math.cos(a)*radius),z=Math.floor(player.position.z+Math.sin(a)*radius),y=world.terrainHeight(x,z);
      if(y<world.seaLevel-2&&y>world.seaLevel-10&&world.getBlock(x,world.seaLevel,z)===9){candidate={x,y,z};break;}
    }
    if(!candidate)throw Error('No sea found near test spawn');
    player.flying=true;player.setPosition(candidate.x,candidate.y+1.15,candidate.z);player.velocity.set(0,0,0);
    return candidate;
  });
  await page.waitForFunction(()=>window.__worldloomSeaLife?.getStats().fish>0,{timeout:60000});
  const result=await page.evaluate(()=>({sea:window.__worldloomSeaLife.getStats(),sand:window.__worldloomSandWind.getStats(),coast:window.__worldloomPlayer.position.toArray()}));
  await page.screenshot({path:'../../outputs/worldloom-sea-in-game.png'});
  assert.ok(result.sea.fish>0);assert.ok(result.sea.plants>0);assert.equal(errors.length,0,errors.join('\n'));
  console.log(JSON.stringify({passed:true,coast,...result},null,2));
}finally{await browser.close();}
