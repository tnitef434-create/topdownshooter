import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import { mkdirSync,writeFileSync } from 'node:fs';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
try {
  const page=await browser.newPage();await page.setViewport({width:1200,height:800});const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error'&&/shader|WebGL|THREE/i.test(m.text()))errors.push(m.text());});
  await page.goto('http://127.0.0.1:4180/tests/worldloom-sea-life-render.html');await page.waitForFunction(()=>window.seaResult,{timeout:30000});
  const first=await page.evaluate(()=>window.advanceSea(0));
  assert.ok(first.fish>0&&first.plants>0);assert.equal(first.species.filter(s=>s.count>0).length,3);assert.ok(first.draws<=4);
  const later=await page.evaluate(()=>window.advanceSea(12));
  assert.ok(later.bites>0,'natural grazing did not occur');assert.notDeepEqual(first.positions,later.positions);assert.notDeepEqual(first.phases,later.phases);
  assert.equal(errors.length,0,errors.join('\n'));
  mkdirSync('../../outputs',{recursive:true});await page.screenshot({path:'../../outputs/worldloom-seagrass-habitat.png'});
  if(process.argv.includes('--video'))writeFileSync('../../outputs/worldloom-seagrass-habitat.webm',Buffer.from(await page.evaluate(()=>window.recordSea()),'base64'));
  await page.evaluate(()=>window.showSpecies());await page.screenshot({path:'../../outputs/worldloom-three-fish.png'});
  assert.equal(errors.length,0,errors.join('\n'));
  console.log(JSON.stringify({passed:true,...later,positions:undefined,phases:undefined},null,2));
}finally{await browser.close();}
