import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/public/worldloom/vendor/three.module.min.js';
import { BLOCK } from '../src/public/worldloom/src/blocks.js';
import { MeadowPlantField } from '../src/public/worldloom/src/meadow-plants.js';
import { CreatureSystem } from '../src/public/worldloom/src/creatures.js';
import { selectStablePlants } from '../src/public/worldloom/src/plant-visibility.js';
import { sandGustAt, sandSurface, sandRibbonFits, SandWindField } from '../src/public/worldloom/src/sand-wind.js';

test('a real pig bite removes its tuft without hiding other plants while the chunk remeshes',()=>{
  const blocks=new Uint8Array(16*16*16),index=(x,y,z)=>x+16*z+256*y;
  for(let x=0;x<16;x++)for(let z=0;z<16;z++)blocks[index(x,10,z)]=BLOCK.TURF;
  blocks[index(8,11,7)]=BLOCK.SHORT_GRASS;blocks[index(4,11,4)]=BLOCK.SHORT_GRASS;blocks[index(5,11,4)]=BLOCK.WILDFLOWER;
  const chunk={cx:0,cz:0,key:'0,0',blocks,generated:true,wanted:true,revision:1,meshDirty:false};let visible=true;
  const world={seed:41,chunks:new Map([['0,0',chunk]]),terrainHeight:()=>10,worldHeight:16,
    isPositionRendered:()=>!chunk.meshDirty&&visible,hasVisibleTerrainAt:()=>visible,
    getBlock:(x,y,z)=>blocks[index(x,y,z)]??0,
    setBlock:(x,y,z,id)=>{blocks[index(x,y,z)]=id;chunk.revision++;chunk.meshDirty=true;return true;}};
  const plants=new MeadowPlantField(null);plants.setWorld(world);const focus=new THREE.Vector3(8,11,8);
  plants._collect(focus);const before=plants.grasses.map(p=>`${p.x},${p.z}`);assert.ok(before.includes('8,7'));
  const pigs=new CreatureSystem(null,world);pigs._spawnTimer=Infinity;const pig=pigs._makePig(8.5,11,8.5,0);
  pigs._setState(pig,'graze',4.8);const player={position:new THREE.Vector3(14,11,14)};
  for(let i=0;i<125;i++)pigs.update(1/60,player);
  assert.equal(pig.bites,1);assert.equal(chunk.meshDirty,true);
  for(let i=0;i<8;i++){
    plants._collect(focus);
    assert.equal(plants.sunflowers.length,1,'sunflower must survive the neighbouring bite');
    assert.equal(plants.grasses.length,before.length-1);
    assert.ok(plants.grasses.some(p=>p.x===4&&p.z===4));
  }
  chunk.meshDirty=false;plants._collect(focus);assert.equal(plants.sunflowers.length,1);
  visible=false;plants._collect(focus);assert.equal(plants.sunflowers.length,0,'actually unloaded terrain still hides plants');
  plants.dispose();pigs.dispose();
});

test('plant caps choose nearby plants across all chunks and resist boundary oscillation',()=>{
  const entries=[{x:40,y:1,z:0,distanceSq:1600},{x:1,y:1,z:0,distanceSq:1},{x:2,y:1,z:0,distanceSq:4}];
  assert.deepEqual(selectStablePlants(entries,[],2).map(p=>p.x),[1,2]);
  const resident={x:10,y:1,z:0,distanceSq:100},newcomer={x:11,y:1,z:0,distanceSq:99};
  assert.equal(selectStablePlants([newcomer,resident],[resident],1)[0],resident);
  newcomer.distanceSq=1;assert.equal(selectStablePlants([newcomer,resident],[resident],1)[0],newcomer);
});

test('sand gusts include long quiet periods and differ between regions and seeds',()=>{
  let calm=0,active=0,different=0;
  for(let t=0;t<600;t++){
    const a=sandGustAt(0,0,t,41),b=sandGustAt(64,0,t,41);
    assert.deepEqual(a,sandGustAt(0,0,t,41));
    if(a.strength===0)calm++;else active++;
    if(a.strength!==b.strength)different++;
  }
  assert.ok(calm>400&&active>20);assert.ok(different>20);
});

test('sand ribbons reject water, grass, ceilings, cliffs and unsupported footprint edges',()=>{
  let id=BLOCK.SAND,water=false,ceiling=false,edge=false;
  const world={hasVisibleTerrainAt:()=>true,terrainHeight:()=>0,getBlock:(x,y,z)=>y===0?(edge&&x>=1?BLOCK.AIR:id):y===1&&water?BLOCK.WATER:y===3&&ceiling?BLOCK.STONE:BLOCK.AIR};
  const p={x:0,z:0,y:1,angle:0,length:4,width:1};
  assert.equal(sandSurface(world,0,0),1);assert.equal(sandRibbonFits(world,p),true);
  water=true;assert.equal(sandRibbonFits(world,p),false);water=false;
  id=BLOCK.TURF;assert.equal(sandRibbonFits(world,p),false);id=BLOCK.SAND;
  ceiling=true;assert.equal(sandRibbonFits(world,p),false);ceiling=false;
  edge=true;assert.equal(sandRibbonFits(world,p),false);
});

test('sand field stays within its draw budget, fades in, shelters from rain and clears between worlds',()=>{
  const world={seed:41,hasVisibleTerrainAt:()=>true,terrainHeight:()=>0,getBlock:(x,y,z)=>y<=0?BLOCK.SAND:BLOCK.AIR};
  const field=new SandWindField(new THREE.Scene()),focus=new THREE.Vector3(0,1,0);
  field.setWorld(world);field.setQuality({atmosphereDetail:0});
  let peak=0;for(let t=0;t<200;t++)if(sandGustAt(0,0,t,41).strength>.8){peak=t;break;}
  field.time=peak;for(let i=0;i<80;i++)field.update(.05,focus,{dayAmount:1});
  assert.ok(field.particles.length>0);assert.ok(field.particles.length<=24);assert.equal(field.getStats().draws,1);
  assert.ok(field.mesh.geometry.attributes.driftOpacity.array.some(v=>v>0&&v<=1));
  assert.equal(field.mesh.material.depthWrite,false);
  assert.ok(field.particles.every(p=>sandRibbonFits(world,p)));
  field.update(.05,focus,{rainIntensity:1});assert.equal(field.mesh.visible,false);
  field.setWorld(null);assert.equal(field.mesh.count,0);assert.equal(field.anchors.length,0);
  field.dispose();
});
