import puppeteer from 'puppeteer';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve,extname } from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('.');
const server=createServer(async(req,res)=>{try{const path=resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!path.startsWith(root))throw Error();res.setHeader('Content-Type',extname(path)==='.html'?'text/html':extname(path)==='.js'?'text/javascript':'application/octet-stream');res.end(await readFile(path));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try{
 browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
 const page=await browser.newPage();await page.setViewport({width:1200,height:800});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(`http://127.0.0.1:${server.address().port}/tests/worldloom-discovery-review.html`);await page.waitForFunction(()=>window.discoveryReady,{timeout:60000});
 const results=[];
 for(const kind of ['bell_shrine','quarry_rig']){
  const result=await page.evaluate(kind=>window.discoveryReview.show(kind),kind);assert.ok(result.meshes>0);assert.ok(result.triangles>1000);results.push(result);
  await page.screenshot({path:resolve('../../outputs',`worldloom-${kind}.png`)});
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,results}));
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
