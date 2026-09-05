import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/public/worldloom/vendor/three.module.min.js';
import { BLOCK } from '../src/public/worldloom/src/blocks.js';
import { waterCornerOptics } from '../src/public/worldloom/src/mesher.js';
import { waterOptics, enhanceWaterMaterial, WaterReflection } from '../src/public/worldloom/src/water-surface.js';
import { WorldloomGTAOPass } from '../src/public/worldloom/src/graphics.js';
import { SandWindField } from '../src/public/worldloom/src/sand-wind.js';
import { waterDisplacement } from '../src/public/worldloom/src/water-motion.js';
import { WaterSceneCapture } from '../src/public/worldloom/src/water-capture.js';
import { MushroomField } from '../src/public/worldloom/src/mushrooms.js';
import { MUSHROOM_MESH } from '../src/public/worldloom/src/water-nature-data.js';

test('water depth increases absorption and grazing angles increase reflection',()=>{
  const shallow=waterOptics(.8,1),deep=waterOptics(10,1),edge=waterOptics(.8,.05);
  assert.ok(shallow.opacity<.2);assert.ok(deep.opacity>.85);assert.ok(edge.fresnel>.7);
  assert.ok(edge.opacity>shallow.opacity);
});

test('water corner data follows actual bathymetry, agrees across chunks and damps bank waves',()=>{
  const world={getBlock:(x,y,z)=>y<=0?BLOCK.SAND:y<=6?BLOCK.WATER:BLOCK.AIR};
  const a=waterCornerOptics(world,16,6,8,new Map()),b=waterCornerOptics(world,16,6,8,new Map());
  assert.deepEqual(a,b);assert.equal(a[1],0);assert.equal(a[2],1);assert.ok(a[0]>5);
  world.getBlock=(x,y,z)=>x>=16?BLOCK.SAND:y<=4?BLOCK.SAND:y<=6?BLOCK.WATER:BLOCK.AIR;
  const edge=waterCornerOptics(world,16,6,8);assert.ok(edge[0]<2);assert.equal(edge[1],.5);assert.ok(edge[2]<.5);
});

test('water enhancement removes the pixel atlas and preserves transparent world-depth ordering',()=>{
  const material=new THREE.MeshStandardMaterial({map:new THREE.Texture(),normalMap:new THREE.Texture(),vertexColors:true});
  enhanceWaterMaterial(material,{});
  assert.equal(material.map,null);assert.equal(material.normalMap,null);assert.equal(material.vertexColors,false);
  assert.equal(material.depthWrite,false);assert.equal(material.transparent,true);assert.equal(material.alphaTest,0);
  material.dispose();
});

test('AO excludes water, dust and the hand, retains opaque scenery, and restores visibility',()=>{
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(),dust=new SandWindField(scene);
  dust.mesh.visible=true;
  const opaque=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial());scene.add(opaque);
  const water=new THREE.Mesh(new THREE.PlaneGeometry(),new THREE.MeshStandardMaterial({transparent:true,depthWrite:false}));scene.add(water);
  const oldDustCard=water.clone();oldDustCard.visible=true;scene.add(oldDustCard);
  const hand=opaque.clone();hand.renderOrder=1000;scene.add(hand);
  const hidden=opaque.clone();hidden.visible=false;scene.add(hidden);
  const pass=new WorldloomGTAOPass(scene,camera,32,32);
  pass._overrideVisibility();
  assert.equal(opaque.visible,true);for(const obj of [water,oldDustCard,dust.mesh,hand,hidden])assert.equal(obj.visible,false);
  pass._restoreVisibility();for(const obj of [water,oldDustCard,dust.mesh,hand])assert.equal(obj.visible,true);assert.equal(hidden.visible,false);
  pass.dispose();dust.dispose();opaque.geometry.dispose();opaque.material.dispose();water.geometry.dispose();water.material.dispose();
});

test('reflection quality disables the extra scene render on the performance tier',()=>{
  const reflection=new WaterReflection(new THREE.Scene(),null);
  const material=new THREE.MeshStandardMaterial();enhanceWaterMaterial(material,{});
  reflection.setWorld({waterMaterial:material});material.userData.waterReflection.valid.value=1;
  reflection.setQuality({postProcessing:false});assert.equal(material.userData.waterReflection.valid.value,0);
  assert.equal(reflection.target,null);reflection.dispose();material.dispose();
});

test('water waves move the surface and impact waves travel outward, decay and respect pond height',()=>{
  assert.ok(Math.abs(waterDisplacement(2,4,0)-waterDisplacement(2,4,1))>.025);
  const impulse={x:0,z:0,born:0,strength:1,surface:4.92};
  const delta=(r,t,level=4.92)=>waterDisplacement(r,0,t,[impulse],level)-waterDisplacement(r,0,t);
  assert.ok(Math.abs(delta(.62,.25))>.012);
  assert.ok(Math.abs(delta(2.17,1.25))>.008);
  assert.ok(Math.abs(delta(8,.25))<.00001);assert.equal(delta(.62,.25,10.92),0);assert.equal(delta(2,6),0);
});

test('shared scene capture excludes water, fog and hand and restores state after render failure',()=>{
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(),waterMaterial=new THREE.MeshStandardMaterial();
  const water=new THREE.Mesh(new THREE.PlaneGeometry(),waterMaterial),fog=water.clone(),hand=water.clone();
  fog.material=new THREE.MeshBasicMaterial();fog.userData.skipWaterCapture=true;hand.material=fog.material;hand.renderOrder=1000;
  const ground=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial());scene.add(water,fog,hand,ground);
  let current=null;const renderer={toneMapping:THREE.ACESFilmicToneMapping,shadowMap:{autoUpdate:true},xr:{enabled:true},
    getDrawingBufferSize:v=>v.set(800,600),getRenderTarget:()=>current,setRenderTarget:t=>current=t,clear(){},
    render(){assert.equal(water.visible,false);assert.equal(fog.visible,false);assert.equal(hand.visible,false);assert.equal(ground.visible,true);throw Error('test render failure');}};
  const capture=new WaterSceneCapture(scene,renderer,{});capture.setWorld({waterMaterial,chunks:new Map([['0',{waterMesh:water}]])});
  assert.throws(()=>capture.update(camera),/test render failure/);
  assert.ok(water.visible&&fog.visible&&hand.visible&&ground.visible);assert.equal(current,null);
  assert.equal(renderer.shadowMap.autoUpdate,true);assert.equal(renderer.xr.enabled,true);assert.equal(renderer.toneMapping,THREE.ACESFilmicToneMapping);
  capture.dispose();water.geometry.dispose();waterMaterial.dispose();fog.material.dispose();ground.geometry.dispose();ground.material.dispose();
});

test('Blender mushroom clusters have closed caps and stems and no transparent picture planes',()=>{
  const edges=new Map(),p=MUSHROOM_MESH.position;
  for(let i=0;i<p.length;i+=9){const a=[p.slice(i,i+3).join(','),p.slice(i+3,i+6).join(','),p.slice(i+6,i+9).join(',')];for(let j=0;j<3;j++){const key=[a[j],a[(j+1)%3]].sort().join(':');edges.set(key,(edges.get(key)||0)+1);}}
  assert.ok([...edges.values()].every(n=>n===2),'solid closed geometry has no card border');
  const scene=new THREE.Scene(),field=new MushroomField(scene),blocks=new Uint8Array(16*16*8);blocks[256+3]=BLOCK.GLOW_MUSHROOM;
  field.setWorld({chunkSize:16,chunks:new Map([['0',{cx:0,cz:0,blocks,meshDirty:true}]]),hasVisibleTerrainAt:()=>true});
  field.update(.5,new THREE.Vector3(3,2,0));assert.equal(field.mesh.count,1);assert.equal(field.mesh.material.map,null);assert.equal(field.mesh.material.transparent,false);
  blocks[256+3]=BLOCK.AIR;field.update(.5,new THREE.Vector3(3,2,0));assert.equal(field.mesh.count,0);field.dispose();
});
