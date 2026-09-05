import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/public/worldloom/vendor/three.module.min.js';
import { BLOCK } from '../src/public/worldloom/src/blocks.js';
import { sampleWaterView,underwaterOptics } from '../src/public/worldloom/src/water-view.js';
import { WaterInteractionEffects } from '../src/public/worldloom/src/water-effects.js';

const water={worldHeight:64,getBlock:(x,y,z)=>y>=1&&y<=5&&x<3?BLOCK.WATER:BLOCK.AIR,
  getFluidSurfaceY:(x,y,z)=>x<3&&y>=1&&y<=5?Math.min(y+1,5.92):null};
test('camera water depth follows actual surfaces, including the air gap above a water voxel',()=>{
  assert.equal(sampleWaterView(water,{x:0,y:6,z:0}).submerged,false);
  assert.equal(sampleWaterView(water,{x:0,y:5.98,z:0}).submerged,false);
  const deep=sampleWaterView(water,{x:0,y:2,z:0});assert.equal(deep.surface,5.92);assert.equal(deep.depth,3.92);
  assert.equal(sampleWaterView(water,{x:4,y:2,z:0}).submerged,false);
  assert.equal(sampleWaterView(null,{x:0,y:2,z:0}).submerged,false);
});
test('underwater attenuates sunlight and red wavelengths with depth instead of daylight white fog',()=>{
  const shallow=underwaterOptics(.3),deep=underwaterOptics(12),night=underwaterOptics(.3,0);
  assert.ok(shallow.far<=24&&shallow.near<1);
  assert.ok(deep.direct<shallow.direct&&deep.ambient<shallow.ambient&&deep.far<shallow.far);
  assert.ok(deep.red<deep.green&&deep.green<deep.blue);
  assert.ok(night.fogBrightness<shallow.fogBrightness);
});
test('water entry emits one splash and expanding rings, then clears without splashing while idle',()=>{
  const effects=new WaterInteractionEffects(new THREE.Scene());effects.setWorld(water);
  effects.update(.1,new THREE.Vector3(0,6,0));
  effects.update(.1,new THREE.Vector3(0,5.7,0),{playerVelocity:{x:0,y:-3,z:0}});
  assert.equal(effects.entries,1);assert.ok(effects.drops.length>20);assert.ok(effects.rings.length>0);
  const ring=effects.rings[0],radius=ring.mesh.scale.x;
  effects.update(.1,new THREE.Vector3(0,5.6,0));assert.ok(ring.mesh.scale.x>radius);
  for(let i=0;i<40;i++)effects.update(.1,new THREE.Vector3(0,5.6,0));
  assert.equal(effects.entries,1);assert.equal(effects.rings.length,0);assert.equal(effects.drops.length,0);
  effects.setWorld(null);assert.equal(effects.mesh.visible,false);assert.ok(effects.ringPool.every(m=>!m.visible));effects.dispose();
});
test('swimming wakes stay bounded and ripples mask dry banks; loading underwater has no impact',()=>{
  const effects=new WaterInteractionEffects(new THREE.Scene());effects.setWorld(water);
  effects.update(.1,new THREE.Vector3(2.7,5.5,0));assert.equal(effects.entries,0);
  for(let i=0;i<120;i++)effects.update(.1,new THREE.Vector3(2.7,5.5,0),{playerVelocity:{x:1,y:0,z:0}});
  assert.ok(effects.rings.length>0&&effects.rings.length<=14);assert.equal(effects.drops.length,0);
  assert.ok(effects.rings.some(r=>r.mesh.geometry.attributes.wet.array.includes(0)));
  assert.ok(effects.rings.every(r=>r.mesh.material.depthWrite===false&&r.mesh.userData.skipAmbientOcclusion));effects.dispose();
});
