import * as THREE from '../vendor/three.module.min.js';
import { BLOCK, isLiquid, isSolid, blockShapeHeight } from './blocks.js';
import { makePigRig, disposeCharacter } from './character-rig.js';

const clamp = THREE.MathUtils.clamp;
const smooth = t => { t = clamp(t, 0, 1); return t*t*(3-2*t); };
const angleDelta = (a,b) => Math.atan2(Math.sin(b-a), Math.cos(b-a));
const LEGS = ['front_left','front_right','back_left','back_right'];

/** One original species; no imported animals, night monsters or flying wildlife. */
export class CreatureSystem {
  constructor(scene, world) {
    this.scene = scene; this.world = world;
    this.creatures = []; this._time = 0; this._spawnTimer = .8;
    this._nextId = 1; this._playerAttackReadyAt = 0; this._disposed = false;
    this._seed = (Number(world?.seed) || 7391) >>> 0;
    this.assetErrors = new Map();
    this.onPlayerDamage = null;
  }
  get count() { return this.creatures.length; }
  get playerAttackRecovery() { return Math.max(0,this._playerAttackReadyAt-this._time); }
  hasThreatNear() { return false; }
  _random() { this._seed = (Math.imul(this._seed,1664525)+1013904223)>>>0; return this._seed/4294967296; }
  _hasVisibleTerrain(x,z) { return this.world?.hasVisibleTerrainAt?.(x,z) ?? this.world?.isPositionRendered?.(x,z) ?? true; }
  _groundHeight(x,z,referenceY=0) {
    if (!this.world) return referenceY;
    const base = Math.floor(this.world.terrainHeight?.(x,z) ?? referenceY-1);
    for (let y=Math.min((this.world.worldHeight||192)-2,base+3); y>=Math.max(0,base-8); y--) {
      const id=this.world.getBlock(Math.floor(x),y,Math.floor(z));
      if (isSolid(id) && !isSolid(this.world.getBlock(Math.floor(x),y+1,Math.floor(z)))) return y+blockShapeHeight(id);
    }
    return null;
  }
  _canOccupy(x,y,z) {
    if (!Number.isFinite(y)) return false;
    // Validate the full footprint against water, ledges and unpublished chunks.
    for (const dx of [-.34,.34]) for (const dz of [-.59,.59]) {
      if (!this._hasVisibleTerrain(x+dx,z+dz)) return false;
      const ground=this._groundHeight(x+dx,z+dz,y);
      if (ground===null || Math.abs(ground-y)>.55) return false;
      for (const h of [.05,.7]) {
        const id=this.world?.getBlock?.(Math.floor(x+dx),Math.floor(y+h),Math.floor(z+dz));
        if (isSolid(id)||isLiquid(id)) return false;
      }
    }
    return true;
  }
  _validSpawn(x,z,playerPosition) {
    if (this.world?.isPositionReady && !this.world.isPositionReady(x,z)) return null;
    const y=this._groundHeight(x,z,playerPosition.y);
    if (!this._canOccupy(x,y,z)) return null;
    if (this.world?.getBlock(Math.floor(x),Math.floor(y-.01),Math.floor(z))!==BLOCK.TURF) return null;
    if (this.creatures.some(c => Math.hypot(c.root.position.x-x,c.root.position.z-z)<3)) return null;
    return y;
  }
  _makePig(x,y,z,seed=0) {
    const rig=makePigRig(); rig.root.position.set(x,y,z);
    const pig={...rig,id:this._nextId++,type:'pig',name:'Meadow pig',health:5,maxHealth:5,
      centerHeight:.55,radius:.64,dead:false,state:'idle',stateTime:0,stateDuration:2,
      speed:0,desiredSpeed:0,heading:(seed%100)*.0628,targetHeading:(seed%100)*.0628,
      gait:0,gaitBlend:0,grazeBlend:0,bites:0,chewTime:0,hitTime:0,deathTime:0,
      ground:y,randomPhase:seed*.31,foodTarget:null,knockbackX:0,knockbackZ:0,flashTime:0};
    rig.root.rotation.y=pig.heading;
    this.scene?.add(rig.root); this.creatures.push(pig); return pig;
  }
  _setState(pig,state,duration) {
    pig.state=state; pig.stateTime=0; pig.stateDuration=duration;
    if (state==='graze') { pig.bites=0; pig.chewTime=0; }
  }
  _trySpawn(player) {
    if (this.count>=10) return;
    const p=player.position;
    for (let i=0;i<16;i++) {
      const a=this._random()*Math.PI*2,r=12+this._random()*28;
      const x=Math.floor(p.x+Math.cos(a)*r)+.5,z=Math.floor(p.z+Math.sin(a)*r)+.5;
      const y=this._validSpawn(x,z,p);
      if (y!==null) { this._makePig(x,y,z,this._nextId*37); return; }
    }
  }
  _mouth(pig) {
    pig.root.updateMatrixWorld(true);
    return pig.parts.snout.localToWorld(new THREE.Vector3(0,-.08,-.078));
  }
  _foodAtMouth(pig) {
    const mouth=this._mouth(pig),x=Math.floor(mouth.x),z=Math.floor(mouth.z);
    const ground=this._groundHeight(mouth.x,mouth.z,pig.ground);
    if (ground===null || Math.abs(ground-pig.ground)>.2) return null;
    const y=Math.floor(ground+.02),id=this.world?.getBlock?.(x,y,z);
    if (id===BLOCK.SHORT_GRASS) return {x,y,z,id,ground};
    const under=this.world?.getBlock?.(x,y-1,z);
    return under===BLOCK.TURF ? {x,y:y-1,z,id:under,ground} : null;
  }
  _bite(pig) {
    const food=this._foodAtMouth(pig),mouth=this._mouth(pig);
    if (!food || Math.abs(mouth.y-food.ground)>.2) return false;
    // Consume the actual tuft, or expose soil, through normal saved world edits.
    const changed=this.world.setBlock?.(food.x,food.y,food.z,food.id===BLOCK.SHORT_GRASS?BLOCK.AIR:BLOCK.LOAM,{skipStats:true});
    if (changed===false) return false;
    pig.bites++; pig.chewTime=1.6;
    pig.lastBite={...food,mouth:mouth.toArray(),time:this._time};
    return true;
  }
  _intent(pig,player) {
    if (pig.hitTime>0) {
      pig.targetHeading=Math.atan2(pig.root.position.x-player.position.x,pig.root.position.z-player.position.z)+Math.PI;
      if (pig.state!=='flee') this._setState(pig,'flee',3);
    }
    if (pig.state==='flee') {
      pig.desiredSpeed=1.8;
      if (pig.stateTime>pig.stateDuration) this._setState(pig,'idle',1.5);
      return;
    }
    if (pig.state==='graze') {
      pig.desiredSpeed=0;
      if (pig.stateTime>1.5 && pig.bites===0) {
        if (!this._bite(pig)) this._setState(pig,'idle',.8);
      }
      if (pig.stateTime>pig.stateDuration) this._setState(pig,'idle',1.2);
      return;
    }
    pig.desiredSpeed=pig.state==='walk'?.7:0;
    if (pig.stateTime<pig.stateDuration) return;
    if (pig.state==='walk' && this._foodAtMouth(pig)) {
      this._setState(pig,'graze',4.8); pig.desiredSpeed=0; return;
    }
    let target=null,best=Infinity;
    for (let dx=-4;dx<=4;dx++) for (let dz=-4;dz<=4;dz++) {
      const x=Math.floor(pig.root.position.x)+dx+.5,z=Math.floor(pig.root.position.z)+dz+.5;
      const y=this._groundHeight(x,z,pig.ground);
      if (y===null || !this._canOccupy(x,y,z)) continue;
      const turf=this.world?.getBlock?.(Math.floor(x),Math.floor(y-.01),Math.floor(z));
      const grass=this.world?.getBlock?.(Math.floor(x),Math.floor(y+.01),Math.floor(z));
      const score=dx*dx+dz*dz+(grass===BLOCK.SHORT_GRASS?0:8);
      if (turf===BLOCK.TURF && score<best && score>.2) { best=score; target={x,z}; }
    }
    pig.foodTarget=target;
    pig.targetHeading=target ? Math.atan2(pig.root.position.x-target.x,pig.root.position.z-target.z) : pig.heading+(this._random()-.5)*2.4;
    this._setState(pig,'walk',2+this._random()*3);
  }
  _move(pig,dt,player) {
    const turn=clamp(angleDelta(pig.heading,pig.targetHeading),-dt*1.8,dt*1.8);
    if (pig.state!=='graze') pig.heading+=turn;
    pig.root.rotation.y=pig.heading;
    let target=pig.desiredSpeed;
    if (Math.abs(angleDelta(pig.heading,pig.targetHeading))>.8) target*=.3;
    if (pig.state==='walk' && Math.hypot(pig.root.position.x-player.position.x,pig.root.position.z-player.position.z)<1.6) target=0;
    pig.speed+=(target-pig.speed)*(1-Math.exp(-dt*7));
    let distance=pig.speed*dt;
    if (pig.grazeBlend>.05) distance=0;
    // Short, damped horizontal recoil goes through the same footprint collision checks.
    const recoilX=pig.knockbackX*dt,recoilZ=pig.knockbackZ*dt;
    pig.knockbackX*=Math.exp(-dt*11);pig.knockbackZ*=Math.exp(-dt*11);
    const x=pig.root.position.x-Math.sin(pig.heading)*distance+recoilX;
    const z=pig.root.position.z-Math.cos(pig.heading)*distance+recoilZ;
    const y=this._groundHeight(x,z,pig.ground);
    const crowded=this.creatures.some(other=>other!==pig&&!other.dead&&Math.hypot(other.root.position.x-x,other.root.position.z-z)<1.15);
    if (y!==null && Math.abs(y-pig.ground)<.56 && this._canOccupy(x,y,z) && !crowded) {
      pig.root.position.x=x; pig.root.position.z=z; pig.ground=y;
    } else {
      distance=0; pig.speed=0;
      pig.targetHeading=pig.heading+(this._random()>.5?1:-1)*1.3;
      if (pig.state==='walk') pig.stateDuration=pig.stateTime+.6;
    }
    pig.root.position.y+=(pig.ground-pig.root.position.y)*(1-Math.exp(-dt*16));
    // Actual displacement drives the stride; blocked pigs do not walk in place.
    pig.gait+=distance/.72*Math.PI*2;
    pig.gaitBlend+=((distance>1e-5?Math.min(1,pig.speed/.7):0)-pig.gaitBlend)*(1-Math.exp(-dt*14));
  }
  _animate(pig,dt) {
    pig.flashTime=Math.max(0,pig.flashTime-dt);
    const flash=Math.min(1,pig.flashTime/.07);
    pig.material.color.setRGB(1,1-flash*.68,1-flash*.65);
    const target=pig.state==='graze'?smooth(pig.stateTime/1.1):0;
    pig.grazeBlend+=(target-pig.grazeBlend)*(1-Math.exp(-dt*10));
    const g=pig.grazeBlend;
    pig.parts.head.rotation.x=-.92*g;
    pig.parts.head.position.y=.6875-.12*g;
    pig.parts.head.rotation.y=Math.sin(this._time*.7+pig.randomPhase)*.06*(1-g);
    pig.chewTime=Math.max(0,pig.chewTime-dt);
    pig.parts.snout.rotation.x=pig.chewTime>0?Math.sin(this._time*17)*.035:0;
    pig.parts.snout.position.y=-.09375+(pig.chewTime>0?Math.sin(this._time*17)*.008:0);
    pig.parts.tail.rotation.z=Math.sin(this._time*1.8+pig.randomPhase)*.13;
    LEGS.forEach((name,i)=>{
      const phase=pig.gait+([0,Math.PI,Math.PI,0][i]);
      const leg=pig.parts[name],s=Math.sin(phase),blend=pig.gaitBlend*(1-g);
      leg.rotation.x=s*.42*blend;
      leg.position.y=.375*Math.cos(leg.rotation.x)+Math.abs(Math.sin(leg.rotation.x))*.125+Math.max(0,Math.cos(phase))*.035*blend;
    });
  }
  update(dt,player) {
    if (this._disposed||!player?.position) return;
    dt=clamp(Number(dt)||0,0,.08); this._time+=dt; this._spawnTimer-=dt;
    if (this._spawnTimer<=0) { this._spawnTimer=2; this._trySpawn(player); }
    for (const pig of [...this.creatures]) {
      if (pig.root.position.distanceToSquared(player.position)>96*96) { this._removeCreature(pig); continue; }
      pig.root.visible=this._hasVisibleTerrain(pig.root.position.x,pig.root.position.z);
      if (!pig.root.visible) continue;
      pig.stateTime+=dt; pig.hitTime=Math.max(0,pig.hitTime-dt);
      if (pig.dead) {
        pig.flashTime=Math.max(0,pig.flashTime-dt);
        const flash=Math.min(1,pig.flashTime/.07);
        pig.material.color.setRGB(1,1-flash*.68,1-flash*.65);
        pig.deathTime+=dt; pig.root.rotation.z=smooth(pig.deathTime/.6)*Math.PI/2;
        if (pig.deathTime>.85) this._removeCreature(pig);
        continue;
      }
      this._intent(pig,player); this._move(pig,dt,player); this._animate(pig,dt);
    }
  }
  _lineBlocked(origin,direction,distance) {
    for(let s=.15;s<distance;s+=.15) {
      const p=origin.clone().addScaledVector(direction,s),id=this.world?.getBlock?.(Math.floor(p.x),Math.floor(p.y),Math.floor(p.z));
      if(isSolid(id)&&p.y<=Math.floor(p.y)+blockShapeHeight(id)) return true;
    }
    return false;
  }
  _target(origin,direction,reach) {
    const ray=new THREE.Ray(origin,new THREE.Vector3().copy(direction).normalize());
    let target=null;
    for(const pig of this.creatures) {
      if(pig.dead||!pig.root.visible) continue;
      const point=ray.intersectSphere(new THREE.Sphere(pig.root.position.clone().add(new THREE.Vector3(0,.55,0)),pig.radius),new THREE.Vector3());
      if(!point) continue;
      const distance=origin.distanceTo(point);
      if(distance<=reach&&(!target||distance<target.distance)&&!this._lineBlocked(origin,ray.direction,distance)) target={pig,point,distance};
    }
    return target;
  }
  hasAttackTarget(origin,direction,reach=4) { return Boolean(this._target(origin,direction,clamp(reach,0,4.75))); }
  attack(origin,direction,reach=4,damage=1,recovery=.6) {
    if(this._disposed||this.playerAttackRecovery>0||!origin||!direction) return null;
    recovery=clamp(recovery??.6,.38,1.2); this._playerAttackReadyAt=this._time+recovery;
    const target=this._target(origin,direction,clamp(reach,0,4.75)); if(!target) return null;
    const pig=target.pig; pig.health=Math.max(0,pig.health-clamp(damage,.5,8)); pig.hitTime=1;
    const push=pig.root.position.clone().sub(origin);push.y=0;
    if(push.lengthSq()<.0001) push.set(direction.x,0,direction.z);
    push.normalize().multiplyScalar(2.6);
    pig.knockbackX=push.x;pig.knockbackZ=push.z;pig.flashTime=.2;
    pig.material.color.setRGB(1,.32,.35);
    pig.dead=pig.health===0;
    return {id:pig.id,type:'pig',name:pig.name,health:pig.health,maxHealth:pig.maxHealth,damage,killed:pig.dead,defeated:pig.dead,
      point:target.point,distance:target.distance,position:pig.root.position.clone(),creature:pig,recovery,meat:pig.dead?3:0};
  }
  _removeCreature(pig) { disposeCharacter(pig.root); this.creatures.splice(this.creatures.indexOf(pig),1); }
  dispose() { this._disposed=true; for(const pig of [...this.creatures]) this._removeCreature(pig); }
}
export default CreatureSystem;
