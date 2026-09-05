import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
try{
  const page=await browser.newPage();await page.setViewport({width:1440,height:900});
  await page.evaluateOnNewDocument(()=>{
    window.flicks=0;
    const start=AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start=function(...args){window.flicks++;return start.apply(this,args);};
  });
  await page.goto(process.env.HUB_TEST_URL||'http://127.0.0.1:4187/');
  await page.waitForSelector('.games.motion-ready');
  await page.keyboard.press('Shift');await new Promise(r=>setTimeout(r,250));
  await page.mouse.move(200,450);await page.waitForFunction(()=>window.flicks===1);
  await page.mouse.move(250,480);await new Promise(r=>setTimeout(r,200));assert.equal(await page.evaluate(()=>window.flicks),1,'staying on a panel does not repeat the sound');
  await page.mouse.move(1300,450);await page.waitForFunction(()=>window.flicks===2);
  await new Promise(r=>setTimeout(r,150));await page.mouse.move(200,450);await page.waitForFunction(()=>window.flicks===3);
  console.log(JSON.stringify({passed:true,gestureUnlock:true,oneFlickPerPanel:true,bothDirections:true}));
}finally{await browser.close();}
