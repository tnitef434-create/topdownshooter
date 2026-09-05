import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/public/worldloom/vendor/three.module.min.js';
import { BLOCK } from '../src/public/worldloom/src/blocks.js';
import { waterCornerOptics } from '../src/public/worldloom/src/mesher.js';
import { waterOptics, enhanceWaterMaterial, WaterReflection } from '../src/public/worldloom/src/water-surface.js';
import { WorldloomGTAOPass } from '../src/public/worldloom/src/graphics.js';
import { SandWindField } from '../src/public/worldloom/src/sand-wind.js';

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
