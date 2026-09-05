import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { World } from '../src/public/worldloom/src/world.js';
import { BLOCK } from '../src/public/worldloom/src/blocks.js';
import { CaveField } from '../src/public/worldloom/src/cave-generation.js';
import { WOODLAND_FERN,CAVE_FERN,CAVE_VINE,HEADLAMP } from '../src/public/worldloom/src/cave-assets.js';
import { Headlamp } from '../src/public/worldloom/src/headlamp.js';
import { PlayerController } from '../src/public/worldloom/src/player.js';
import * as THREE from '../src/public/worldloom/vendor/three.module.min.js';

test('new cave chunks are deterministic across generation order, seed and cache eviction',()=>{
 const hashes=[];
 for(const seed of [64,91234]){
  const a=new World(seed),b=new World(seed);
  const first=a.ensurePositionGenerated(32,64);
  b.ensurePositionGenerated(48,64);b.caveField.samples.clear();
  const second=b.ensurePositionGenerated(32,64);
  assert.deepEqual(first.blocks,second.blocks);
  hashes.push(createHash('sha256').update(first.blocks).digest('hex'));
  a.dispose();b.dispose();
 }
 assert.notEqual(hashes[0],hashes[1]);
});

test('organic cave fields have varied connected volumes rather than isolated noise holes',()=>{
 for(const seed of [64,91234,415]){
  const field=new CaveField(seed),size=40,cells=new Set();
  for(let z=0;z<size;z++)for(let y=0;y<24;y++)for(let x=0;x<size;x++)if(field.density(x,y+10,z)>0)cells.add(x+y*size+z*size*24);
  const fraction=cells.size/(size*size*24);assert.ok(fraction>.04&&fraction<.6,`seed ${seed} cave fraction ${fraction}`);
  const total=cells.size;let largest=0,components=0;
  while(cells.size){const initial=cells.values().next().value,queue=[initial];cells.delete(initial);
   for(let i=0;i<queue.length;i++){
    const k=queue[i],x=k%size,y=Math.floor(k/size)%24,z=Math.floor(k/(size*24));
    for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
     const nx=x+dx,ny=y+dy,nz=z+dz;if(nx<0||nx>=size||ny<0||ny>=24||nz<0||nz>=size)continue;
     const n=nx+ny*size+nz*size*24;if(cells.delete(n))queue.push(n);
    }
   }
   largest=Math.max(largest,queue.length);components++;
  }
  assert.ok(largest/total>.45,`seed ${seed}: largest connected passage ${largest}/${total}`);
  assert.ok(components<45,`seed ${seed}: excessive disconnected pockets ${components}`);
 }
});

test('new entrances descend gradually and vary in width, direction and elevation',()=>{
 const w=new World(64);const p=w.caveField.mouth(0,0,(x,z)=>w._macroTerrainAt(Math.floor(x),Math.floor(z)).height);
 assert.ok(p.length>=28);assert.ok(p[0].y-p.at(-1).y>12);
 const widths=new Set(p.map(p=>p.radius.toFixed(1)));assert.ok(widths.size>6);
 for(let i=1;i<p.length;i++){assert.ok(p[i-1].y-p[i].y<=.71);assert.ok(p[i-1].y>=p[i].y);}
 let open=0;for(let z=-4;z<=4;z++)for(let x=-4;x<=4;x++){
  const wx=Math.floor(p[0].x)+x,wz=Math.floor(p[0].z)+z,info=w._columnInfo(wx,wz);
  if(w._isCave(wx,info.height,wz,info.height,info))open++;
 }
 assert.ok(open>3&&open<70,`irregular mouth has ${open} open surface columns`);w.dispose();
});

test('cave aquifers have a flat water table and preserve bedrock and surface reservoirs',()=>{
 const w=new World(64);let water=0,dry=0;
 for(let z=48;z<96;z+=2)for(let x=0;x<64;x+=2){
  assert.equal(w.getBlock(x,0,z),BLOCK.BEDROCK);
  for(let y=5;y<=13;y++){
   const id=w.getBlock(x,y,z);if(id===BLOCK.WATER){water++;assert.ok(y<=12);}
   if(y===13&&id===BLOCK.AIR)dry++;
  }
 }
 assert.ok(water>30&&dry>10);
 const field=w.caveField;for(let y=26;y<=30;y++)assert.equal(field.isCave(12,y,17,30,{caveEntrances:[]}),false);
 for(let y=36;y<=40;y++)assert.equal(field.isCave(12,y,17,40,{pondWaterLevel:43,caveEntrances:[]}),false);
 w.dispose();
});

test('Blender ferns, cave vines and headlamp contain finite nondegenerate authored geometry',()=>{
 for(const data of [WOODLAND_FERN,CAVE_FERN,CAVE_VINE,HEADLAMP]){
  assert.ok(data.position.length>300);assert.equal(data.position.length,data.normal.length);assert.equal(data.color.length,data.position.length);
  assert.ok([...data.position,...data.normal,...data.color].every(Number.isFinite));
  for(let i=0;i<data.normal.length;i+=3)assert.ok(Math.hypot(...data.normal.slice(i,i+3))>.98);
 }
 assert.ok(Math.max(...CAVE_VINE.position.filter((_,i)=>i%3===1))<=0,'vine grows down from its ceiling root');
});

test('headlamp follows the eyes, toggles without inventory and retains its saved state',()=>{
 const scene=new THREE.Scene(),lamp=new Headlamp(scene),p=new THREE.Vector3(5,18,4),d=new THREE.Vector3(0,0,-1);
 lamp.update(p,d,true);assert.ok(lamp.light.intensity>20);assert.equal(lamp.light.castShadow,true);
 assert.ok(lamp.light.position.distanceTo(p)<.15);assert.ok(lamp.light.target.position.z<p.z-10);
 lamp.update(p,d,false);assert.equal(lamp.light.intensity,0);assert.equal(lamp.light.visible,false);
 lamp.dispose();
 const player=new PlayerController(new THREE.PerspectiveCamera(),null);player.headlampOn=false;
 const state=player.getState();player.headlampOn=true;player.loadState(state);assert.equal(player.headlampOn,false);
 delete state.headlampOn;player.loadState(state);assert.equal(player.headlampOn,true);
});
