import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
const base=process.env.HUB_TEST_URL||'http://127.0.0.1:4187/';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Local preview required');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader']});
try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.evaluate(()=>document.querySelectorAll('video').forEach(v=>v.pause()));
  const result=await page.evaluate(async()=>{
    const THREE=await import('/worldloom/vendor/three.module.min.js');
    const {DistantTerrainHorizon}=await import('/worldloom/src/distant-terrain.js');
    const scene=new THREE.Scene(),renderer=new THREE.WebGLRenderer({antialias:false});renderer.setSize(32,32);
    const camera=new THREE.OrthographicCamera(-3,3,3,-3,.1,20),cx=37,cz=-24,x=cx*16+8,z=cz*16+8;
    camera.position.set(x,10,z);camera.up.set(0,0,-1);camera.lookAt(x,0,z);
    const current={cx,cz,generated:true,wanted:true,opaqueMesh:{visible:true}};
    const world={centerChunk:{cx,cz},chunks:new Map([['current',current],['dormant',{cx:-300,cz:-400,generated:true,wanted:false,opaqueMesh:{visible:false}}]])};
    const horizon=new DistantTerrainHorizon(scene,world);
    scene.add(new THREE.AmbientLight(0xffffff,3));
    const tile=new THREE.Mesh(new THREE.PlaneGeometry(8,8),new THREE.MeshBasicMaterial({color:0x1166ee}));tile.rotation.x=-Math.PI/2;tile.position.set(x,1,z);scene.add(tile);
    const wedge=new THREE.Mesh(new THREE.PlaneGeometry(8,8),horizon.material);wedge.rotation.x=-Math.PI/2;wedge.position.set(x,3,z);
    const colors=new Float32Array(wedge.geometry.attributes.position.count*3);for(let i=0;i<colors.length;i+=3){colors[i]=.6;colors[i+1]=.7;colors[i+2]=.1;}
    wedge.geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));scene.add(wedge);
    const pixels=()=>{renderer.render(scene,camera);const p=new Uint8Array(4);renderer.getContext().readPixels(16,16,1,1,renderer.getContext().RGBA,renderer.getContext().UNSIGNED_BYTE,p);return [...p];};
    horizon.updateWaterCoverage();const covered=pixels();
    current.wanted=false;current.opaqueMesh.visible=false;horizon.updateWaterCoverage();const horizonOnly=pixels();
    current.wanted=true;current.opaqueMesh.visible=true;horizon.updateWaterCoverage();const restored=pixels();
    const shaderErrors=renderer.info.programs.map(p=>p.diagnostics).filter(d=>d?.runnable===false);
    renderer.dispose();horizon.dispose();return {covered,horizonOnly,restored,shaderErrors};
  });
  assert.ok(result.covered[2]>result.covered[0]*2,'nearby voxel terrain must show through the hidden coarse wedge');
  assert.ok(result.horizonOnly[0]>result.horizonOnly[2]*2,'coarse terrain must return when the detailed chunk leaves');
  assert.deepEqual(result.restored,result.covered,'streaming back restores exact land ownership despite far dormant chunks');
  assert.deepEqual(result.shaderErrors,[]);assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,...result}));
}finally{await browser.close();}
