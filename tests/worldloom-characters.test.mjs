import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from '../src/public/worldloom/vendor/three.module.min.js';
import { CreatureSystem } from '../src/public/worldloom/src/creatures.js';
import { PlayerAvatar, WORLD_AVATAR_LAYER } from '../src/public/worldloom/src/player-avatar.js';
import { HeldItemView } from '../src/public/worldloom/src/viewmodel.js';
import { BLOCK } from '../src/public/worldloom/src/blocks.js';
import { ITEM } from '../src/public/worldloom/src/data.js';

function fixture() {
  const changes=new Map(), edits=[];
  const world={seed:41,worldHeight:32,terrainHeight:()=>10,isPositionRendered:()=>true,
    getBlock:(x,y,z)=>changes.get(`${x},${y},${z}`) ?? (y<=10?BLOCK.TURF:BLOCK.AIR),
    setBlock:(x,y,z,id)=>{changes.set(`${x},${y},${z}`,id);edits.push({x,y,z,id});return true;}};
  const system=new CreatureSystem(null,world); system._spawnTimer=Infinity;
  const pig=system._makePig(.5,11,.5,0);
  const player={position:new THREE.Vector3(10,11,10)};
  return {system,pig,player,world,edits};
}

test('Blender skin keeps exact block proportions, six draws, and first-person shadow isolation',()=>{
  const scene=new THREE.Scene(),avatar=new PlayerAvatar(scene);
  const camera=new THREE.PerspectiveCamera();
  assert.equal(avatar.root.children.length,6);
  for(const mesh of avatar.root.children) {
    assert.equal(mesh.userData.authoredIn,'Blender');
    assert.equal(mesh.layers.test(camera.layers),false);
    assert.equal(mesh.castShadow,true);
    assert.ok(mesh.geometry.attributes.color.count>0);
  }
  camera.layers.enable(WORLD_AVATAR_LAYER);
  assert.ok(avatar.root.children.every(m=>m.layers.test(camera.layers)));
  const box=avatar.rightArm.geometry.boundingBox.getSize(new THREE.Vector3());
  assert.deepEqual(box.toArray(),[.25,.75,.25]);
  const player={position:new THREE.Vector3(),velocity:new THREE.Vector3(4,0,0),grounded:true};
  avatar.update(.05,player,{},{});
  assert.equal(avatar.leftLeg.rotation.x,-avatar.rightLeg.rotation.x);
  avatar.dispose(); assert.equal(scene.children.length,0);
});

test('hand stays continuous at mouse release, has no detached wrist, and settles at 30/60/120fps',()=>{
  for(const fps of [30,60,120]) {
    const held=new HeldItemView(new THREE.PerspectiveCamera(),null);
    held.setItem(0);held.setVisible(true);held.use();
    for(let i=0;i<fps/8;i++) held.update(1/fps,{mining:true});
    const before=held.root.position.clone();
    held.update(1/fps);
    assert.equal(held.actionHand.visible,true);
    assert.ok(before.distanceTo(held.root.position)<.06);
    for(let i=0;i<fps*2;i++) held.update(1/fps);
    assert.ok(held.root.position.distanceTo(held.restPosition)<.0001);
    assert.equal(held.actionHand.children.length,1);
    held.dispose();
  }
});

test('grazing plants feet, reaches ground with its snout, consumes grass once, then recovers',()=>{
  const {system,pig,player,edits}=fixture();
  system._setState(pig,'graze',4.8);
  for(let i=0;i<125;i++) system.update(1/60,player);
  assert.equal(pig.bites,1);
  assert.equal(edits.length,1);
  assert.equal(edits[0].id,BLOCK.LOAM);
  assert.ok(Math.abs(pig.lastBite.mouth[1]-11)<.2);
  assert.equal(pig.root.position.x,.5);assert.equal(pig.root.position.z,.5);
  assert.ok(pig.chewTime>0);
  for(let i=0;i<230;i++) system.update(1/60,player);
  assert.equal(edits.length,1);
  assert.ok(pig.parts.head.rotation.x>-.05,'head recovers after feeding');
  system.dispose();
});

test('pig removes a real grass tuft before turf and cannot graze stone',()=>{
  const {system,pig,player,world,edits}=fixture();
  world.setBlock(0,11,-1,BLOCK.SHORT_GRASS); edits.length=0;
  system._setState(pig,'graze',4.8);
  for(let i=0;i<125;i++) system.update(1/60,player);
  assert.equal(edits[0].id,BLOCK.AIR);
  assert.equal(edits[0].y,11);
  const mouth=system._mouth(pig);
  world.setBlock(Math.floor(mouth.x),10,Math.floor(mouth.z),BLOCK.STONE);
  assert.equal(system._bite(pig),false);
  system.dispose();
});

test('pigs freeze on unrendered ground, avoid water/cliffs, and stop cycling feet when blocked',()=>{
  const {system,pig,player,world}=fixture();
  world.isPositionRendered=()=>false;
  assert.equal(system._validSpawn(20,20,player.position),null);
  system.update(.05,player);assert.equal(pig.root.visible,false);
  assert.equal(pig.stateTime,0);
  world.isPositionRendered=()=>true;
  const original=world.getBlock;
  world.getBlock=(x,y,z)=>z<0&&y===11?BLOCK.WATER:original(x,y,z);
  assert.equal(system._canOccupy(.5,11,-.5),false);
  pig.state='walk';pig.stateDuration=100;pig.desiredSpeed=.7;
  for(let i=0;i<60;i++) system._move(pig,1/60,player);
  assert.ok(pig.root.position.z>=.5);
  assert.ok(pig.gaitBlend<.01);
  system.dispose();
});

test('only pigs spawn and combat keeps cooldown and terrain occlusion',()=>{
  const {system,pig,player}=fixture();
  system._trySpawn(player);
  assert.ok(system.creatures.every(c=>c.type==='pig'));
  const origin=new THREE.Vector3(.5,11.55,3),direction=new THREE.Vector3(0,0,-1);
  assert.equal(system.attack(origin,direction,4,1,.6).health,4);
  assert.equal(system.attack(origin,direction,4,1,.6),null);
  system._time=.7;
  assert.equal(system.attack(new THREE.Vector3(.5,9,3),direction,4,1,.6),null);
  assert.equal(system.hasThreatNear(player.position),false);
  system.dispose();
});

test('character GLB contains Blender meshes and playable walk/graze animations',()=>{
  const bytes=readFileSync(new URL('../src/public/worldloom/assets/characters/worldloom-characters.glb',import.meta.url));
  const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
  assert.match(json.asset.generator,/Blender/);
  assert.ok(json.animations.some(a=>/Walk/.test(a.name)));
  assert.ok(json.animations.some(a=>/Graze/.test(a.name)));
  assert.ok(json.nodes.some(n=>n.name==='pig_snout'));
  assert.ok(bytes.length<2_000_000);
});

test('damage gives only the struck pig a brief red flash and small collision-safe recoil',()=>{
  const {system,pig,player}=fixture();
  const other=system._makePig(4,11,4,5);
  const before=pig.root.position.clone();
  system.attack(new THREE.Vector3(.5,11.55,3),new THREE.Vector3(0,0,-1),4,1,.6);
  assert.ok(pig.material.color.g<.4);
  assert.equal(other.material.color.g,1,'each pig owns its hit material');
  // Isolate the short impact impulse from subsequent fleeing locomotion.
  pig.desiredSpeed=0;
  for(let i=0;i<24;i++){system._move(pig,1/60,player);system._animate(pig,1/60);}
  const distance=before.distanceTo(pig.root.position);
  assert.ok(distance>.15&&distance<.35,`recoil should be small, got ${distance}`);
  assert.ok(pig.root.position.z<before.z,'impact pushes away from the attacker');
  assert.equal(pig.material.color.g,1,'red tint clears in under a quarter second');
  system.dispose();
});

test('all pickaxe tiers use one matching Blender pixel mesh and remain attached throughout swings',()=>{
  const held=new HeldItemView(new THREE.PerspectiveCamera(),null);
  for(const id of [ITEM.CRUDE_PICK,ITEM.STONE_PICK,ITEM.COPPER_PICK]) {
    held.setItem(id);held.setVisible(true);
    assert.equal(held.model.userData.authoredIn,'Blender');
    assert.equal(held.model.userData.heldAssembly,true);
    assert.equal(held.model.children.length,1);
    assert.ok(held.model.children[0].geometry.attributes.color.count>100);
    const local=held.model.position.clone();
    held.use();for(let i=0;i<30;i++)held.update(1/60);
    assert.deepEqual(held.model.position.toArray(),local.toArray());
    assert.equal(held.model.parent,held.itemArm.parent);
    assert.equal(held.itemArm.visible,false,'the Blender assembly includes the only gripping arm');
  }
  held.dispose();
});

test('pig snout cannot enter walls, rotation validates the full body, and an obstructed spawn recovers',()=>{
  const {system,pig,player,world}=fixture();
  const original=world.getBlock;
  world.getBlock=(x,y,z)=>z<0&&y>=11?BLOCK.STONE:original(x,y,z);
  assert.equal(system._canOccupy(.5,11,.5,0),false,'snout intersects wall before torso does');
  system.update(1/60,player);
  assert.ok(pig.root.position.z>=1.05,'old overlapping pose is pushed into free space');
  for(let i=0;i<360;i++) {system.update(1/60,player);assert.ok(system._canOccupy(pig.root.position.x,pig.ground,pig.root.position.z,pig.heading));}
  world.getBlock=(x,y,z)=>x<0&&y>=11?BLOCK.STONE:original(x,y,z);
  assert.equal(system._canOccupy(.5,11,3,0),true);
  assert.equal(system._canOccupy(.5,11,3,Math.PI/2),false,'turning a long snout also needs clearance');
  pig.root.position.set(.5,11,3);pig.heading=0;pig.targetHeading=Math.PI/2;pig.desiredSpeed=0;
  for(let i=0;i<90;i++){system._move(pig,1/60,player);assert.ok(system._canOccupy(pig.root.position.x,11,pig.root.position.z,pig.heading));}
  system.dispose();
});

test('pig respects raised obstacles and Blender forest props, not just full voxel walls',()=>{
  const {system,world}=fixture();
  const original=world.getBlock;
  world.getBlock=(x,y,z)=>y===12?BLOCK.STONE:original(x,y,z);
  assert.equal(system._canOccupy(.5,11,.5,0),false,'ears must clear low ceilings');
  world.getBlock=original;
  world.getForestFloorCollidersNear=()=>[{x:.5,z:-.25,minY:11,maxY:11.8,halfX:.25,halfZ:.3,yaw:.4}];
  assert.equal(system._canOccupy(.5,11,.5,0),false,'snout cannot pass through a log or stump');
  system.dispose();
});
