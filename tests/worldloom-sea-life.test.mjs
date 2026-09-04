import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/public/worldloom/vendor/three.module.min.js';
import { BLOCK } from '../src/public/worldloom/src/blocks.js';
import { SeaLifeField, seagrassBed, fishHasWater, seagrassTip, seaCurrent } from '../src/public/worldloom/src/sea-life.js';
import { SEA_LIFE_MESHES } from '../src/public/worldloom/src/sea-life-meshes.js';
import { CreatureSystem } from '../src/public/worldloom/src/creatures.js';
import { readFileSync } from 'node:fs';

function fixture() {
  const world = { seed:41, seaLevel:5, terrainHeight:()=>0, hasVisibleTerrainAt:()=>true,
    getBlock:(x,y,z)=>y<=0?BLOCK.SAND:y<=5?BLOCK.WATER:BLOCK.AIR };
  const field = new SeaLifeField(new THREE.Scene()); field.setWorld(world);
  field.patchLimit = 2; field.fishLimit = 4;
  const focus = new THREE.Vector3(0,4,0);
  field.update(1/60,focus);
  return {world,field,focus};
}

test('three original fish meshes stay small, have distinct silhouettes, eyes and animated fins',()=>{
  const names = Object.keys(SEA_LIFE_MESHES).filter(name=>name!=='Ribbon_Seagrass');
  assert.equal(names.length,3);
  const heights = new Set();
  for (const name of names) {
    const mesh = SEA_LIFE_MESHES[name], xs=mesh.position.filter((_,i)=>i%3===0), ys=mesh.position.filter((_,i)=>i%3===1);
    assert.ok(Math.max(...xs)-Math.min(...xs)<.45);
    heights.add((Math.max(...ys)-Math.min(...ys)).toFixed(3));
    assert.ok(mesh.motion.some((v,i)=>i%4===1&&v===1),'pectoral fin articulation');
    assert.ok(mesh.motion.some((v,i)=>i%4===3&&v===1),'feeding jaw articulation');
    assert.equal(mesh.motion.length/4,mesh.position.length/3);
    assert.ok(mesh.position.length/9<1500);
  }
  assert.equal(heights.size,3);
  const glb=readFileSync(new URL('../src/public/worldloom/assets/environment/sea-life.glb',import.meta.url));
  assert.equal(glb.readUInt32LE(0),0x46546c67);
  const document=JSON.parse(glb.subarray(20,20+glb.readUInt32LE(12)).toString());
  for(const name of [...names,'Ribbon_Seagrass'])assert.ok(document.nodes.some(n=>n.name===name));
  assert.ok(document.animations.length>=4,'editable export retains swimming and current animation');
});

test('seagrass requires a supported sea bed and at least two blocks of continuous water',()=>{
  const {world,field} = fixture();
  assert.ok(seagrassBed(world,0,0));
  const read=world.getBlock;
  world.getBlock=(x,y,z)=>y===2?BLOCK.STONE:read(x,y,z);assert.equal(seagrassBed(world,0,0),null);
  world.getBlock=(x,y,z)=>y===0?BLOCK.STONE:read(x,y,z);assert.equal(seagrassBed(world,0,0),null);
  world.getBlock=read;world.seaLevel=1;assert.equal(seagrassBed(world,0,0),null);
  world.seaLevel=5;world.hasVisibleTerrainAt=()=>false;assert.equal(seagrassBed(world,0,0),null);
  field.dispose();
});

test('fish remain in water, stay near their seagrass, naturally approach and feed, and cannot be attacked',()=>{
  const {world,field,focus}=fixture();
  assert.equal(field.fish.length,4);assert.ok(field.plants.length>=10);
  let travelled=0;
  for(let i=0;i<60*35;i++) {
    const before=field.fish[0]?.position.clone();field.update(1/60,focus);
    if(before)travelled+=before.distanceTo(field.fish[0].position);
    for(const fish of field.fish) {
      assert.ok(fishHasWater(world,fish.position));
      assert.ok(Math.hypot(fish.position.x-fish.home.x,fish.position.z-fish.home.z)<3.31);
      assert.equal(fish.damageable,false);assert.ok(field.plants.includes(fish.home));
    }
  }
  assert.ok(travelled>2,'fish must swim, not freeze at their spawn');
  assert.ok(field.bites>0,'fish must actually reach and feed from a moving leaf');
  const combat=new CreatureSystem(null,world);
  const fish=field.fish[0];const beforeCount=field.fish.length;
  assert.equal(combat.attack(fish.position.clone().add(new THREE.Vector3(0,0,1)),new THREE.Vector3(0,0,-1),4,100,.4),null);
  assert.equal(field.fish.length,beforeCount);
  for(const mesh of field.fishMeshes){const intersections=[];mesh.raycast({},intersections);assert.equal(intersections.length,0);}
  assert.ok(field.getStats().draws<=4);
  combat.dispose();field.dispose();
});

test('fish collision respects walls and habitat disappears when its water is drained',()=>{
  const {world,field,focus}=fixture();
  const original=world.getBlock;
  world.getBlock=(x,y,z)=>x===2?BLOCK.STONE:original(x,y,z);
  assert.equal(fishHasWater(world,new THREE.Vector3(1.9,2,0)),false);
  for(let i=0;i<120;i++)field.update(1/30,focus);
  assert.ok(field.fish.every(f=>fishHasWater(world,f.position)));
  world.getBlock=(x,y,z)=>y<=0?BLOCK.SAND:BLOCK.AIR;
  field.scanTimer=0;field.update(1/60,focus);
  assert.equal(field.plants.length,0);assert.equal(field.fish.length,0);
  field.dispose();
});

test('seagrass roots remain fixed while current and fish wakes flex the tips and settle',()=>{
  const {field,focus}=fixture();
  const plant=field.plants[0],root=[plant.x,plant.y,plant.z];
  const still=seagrassTip(plant).clone();
  for(let i=0;i<60;i++)field.update(1/60,focus);
  assert.ok(still.distanceTo(seagrassTip(plant))>.01);
  assert.deepEqual([plant.x,plant.y,plant.z],root);
  const fish=field.fish[0];fish.position.set(plant.x,plant.y+.7,plant.z);fish.velocity.set(.8,0,0);fish.speed=.8;
  field._updatePlants(1/60);assert.ok(plant.wake>.7);
  assert.ok(Number.isFinite(plant.bend.x)&&Math.abs(plant.bend.x)<=.38);
  const a=seaCurrent(5,7,10),b=seaCurrent(5,7,10,.35);assert.ok(Math.abs(b.x)<Math.abs(a.x));
  field.setWorld(null);assert.equal(field.plantMesh.count,0);assert.ok(field.fishMeshes.every(m=>m.count===0));
  field.dispose();
});
