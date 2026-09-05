import puppeteer from 'puppeteer';
import { readFile } from 'node:fs/promises';
const mark=await readFile('src/public/hub/u-mark.svg','utf8');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
try{
  const page=await browser.newPage();
  for(const [name,width,height,size] of [['unpaused-social.png',1200,630,220],['unpaused-email-mark.png',256,256,184]]){
    await page.setViewport({width,height,deviceScaleFactor:1});
    await page.setContent(`<html><style>html,body{margin:0;background:#090909}body{height:100vh;display:grid;place-items:center}svg{width:${size}px;height:${size}px}</style><body>${mark}</body></html>`);
    await page.screenshot({path:`src/public/hub/${name}`});
  }
}finally{await browser.close();}
