import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
try {
 const page=await browser.newPage();await page.setViewport({width:1000,height:700});const errors=[];
 page.on('pageerror',error=>errors.push(String(error)));page.on('console',msg=>{if(msg.type()==='error'&&/shader|WebGL|THREE/i.test(msg.text()))errors.push(msg.text());});
 await page.goto('http://127.0.0.1:4180/tests/worldloom-nature-render.html');await page.waitForFunction(()=>window.natureResult,{timeout:30000});
 const result=await page.evaluate(()=>window.natureResult);
 assert.equal(errors.length,0,errors.join('\n'));
 for(const item of result.water){assert.ok(item.covered>1000);assert.equal(item.changed,0,`water overpainted item ${item.id}`);}
 assert.ok(result.sand.drifts>0);assert.equal(result.sand.draws,1);
 mkdirSync('../../outputs',{recursive:true});await page.screenshot({path:'../../outputs/worldloom-sand-wind.png'});
 const later=await page.evaluate(()=>window.sandRender(2));assert.ok(later.time>result.sand.time);
 console.log(JSON.stringify({passed:true,...result,later},null,2));
}finally{await browser.close();}
