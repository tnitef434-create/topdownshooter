import * as THREE from '../vendor/three.module.min.js';
import { BLOCK, isLiquid, isSolid, blockShapeHeight } from './blocks.js';
import { makePigRig, disposeCharacter } from './character-rig.js';

const clamp = THREE.MathUtils.clamp;
const smooth = t => { t = clamp(t, 0, 1); return t*t*(3-2*t); };
const angleDelta = (a,b) => Math.atan2(Math.sin(b-a), Math.cos(b-a));
const LEGS = ['front_left','front_right','back_left','back_right'];

function overlaps(a,b) {
  if(a.maxY<=b.minY+.001 || a.minY>=b.maxY-.001) return false;
  const axes=r=>[[Math.cos(r.yaw),-Math.sin(r.yaw)],[Math.sin(r.yaw),Math.cos(r.yaw)]];
  const aa=axes(a),bb=axes(b),dx=b.x-a.x,dz=b.z-a.z;
  for(const [x,z] of [...aa,...bb]) {
    const radius=r=>r.halfX*Math.abs(x*Math.cos(r.yaw)-z*Math.sin(r.yaw))+r.halfZ*Math.abs(x*Math.sin(r.yaw)+z*Math.cos(r.yaw));
    if(Math.abs(dx*x+dz*z)>=radius(a)+radius(b)-.001) return false;
  }
  return true;
}

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
  _canOccupy(x,y,z,heading=0) {
    if (!Number.isFinite(y)) return false;
    const s=Math.sin(heading),c=Math.cos(heading);
    // The rotated envelope includes the snout, ears and tail, not just the torso.
    const bounds={x:x-.16*s,z:z-.16*c,minY:y+.015,maxY:y+1.08,halfX:.36,halfZ:.9,yaw:heading};
    for (const dx of [-.22,.22]) for (const dz of [-.32,.32]) {
      const px=x+dx*c+dz*s,pz=z-dx*s+dz*c;
      if (!this._hasVisibleTerrain(px,pz)) return false;
      const ground=this._groundHeight(px,pz,y);
      if (ground===null || Math.abs(ground-y)>.55) return false;
    }
    for(let bx=Math.floor(x-1.3);bx<=Math.floor(x+1.3);bx++) for(let bz=Math.floor(z-1.3);bz<=Math.floor(z+1.3);bz++) {
      const column={x:bx+.5,z:bz+.5,minY:y,maxY:y+2,halfX:.5,halfZ:.5,yaw:0};
      if(!overlaps(bounds,column)) continue;
      if(!this._hasVisibleTerrain(bx+.5,bz+.5)) return false;
      for(let by=Math.floor(y+.015);by<=Math.floor(y+1.08);by++) {
        const id=this.world?.getBlock?.(bx,by,bz);
        if((isSolid(id)||isLiquid(id)) && overlaps(bounds,{...column,minY:by,maxY:by+blockShapeHeight(id)})) return false;
      }
    }
    for(const collider of this.world?.getForestFloorCollidersNear?.(x,z,1.5)||[]) {
      if(overlaps(bounds,{...collider,yaw:collider.yaw||0})) return false;
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
    const desiredHeading=(seed%100)*.0628;
    const heading=this._canOccupy(x,y,z,desiredHeading)?desiredHeading:0;
    const pig={...rig,id:this._nextId++,type:'pig',name:'Meadow pig',health:5,maxHealth:5,
      centerHeight:.55,radius:.64,dead:false,state:'idle',stateTime:0,stateDuration:2,
      speed:0,desiredSpeed:0,heading,targetHeading:heading,
      gait:0,gaitBlend:0,grazeBlend:0,bites:0,chewTime:0,hitTime:0,deathTime:0,
      ground:y,randomPhase:seed*.31,foodTarget:null,knockbackX:0,knockbackZ:0,flashTime:0,avoidTime:0,blockedTime:0};
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
      if(pig.avoidTime<=0) pig.targetHeading=Math.atan2(pig.root.position.x-player.position.x,pig.root.position.z-player.position.z)+Math.PI;
      if (pig.state!=='flee') this._setState(pig,'flee',4.5);
    }
    if (pig.state==='flee') {
      pig.desiredSpeed=3.6;
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
    const turnRate=pig.state==='flee'?4.8:1.8;
    const turn=clamp(angleDelta(pig.heading,pig.targetHeading),-dt*turnRate,dt*turnRate);
    // Turning itself can put the long snout into a wall, so validate rotation too.
    if (pig.state!=='graze' && this._canOccupy(pig.root.position.x,pig.ground,pig.root.position.z,pig.heading+turn)) pig.heading+=turn;
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
    if (y!==null && Math.abs(y-pig.ground)<.56 && this._canOccupy(x,y,z,pig.heading) && !crowded) {
      pig.root.position.x=x; pig.root.position.z=z; pig.ground=y;
      pig.blockedTime=0;
    } else {
      distance=0; pig.speed=0;
      pig.blockedTime+=dt;
      // Hold a chosen avoidance direction instead of changing it randomly every frame.
      if(pig.avoidTime<=0) {
        for(const offset of [.65,-.65,1.3,-1.3,Math.PI]) {
          const h=pig.heading+offset,px=pig.root.position.x-Math.sin(h)*.4,pz=pig.root.position.z-Math.cos(h)*.4;
          if(this._canOccupy(px,pig.ground,pz,h)) {pig.targetHeading=h;break;}
        }
        pig.avoidTime=.8;
      }
      const bx=pig.root.position.x+Math.sin(pig.heading)*dt*.65,bz=pig.root.position.z+Math.cos(pig.heading)*dt*.65;
      if(this._canOccupy(bx,pig.ground,bz,pig.heading)) {pig.root.position.x=bx;pig.root.position.z=bz;distance=-dt*.65;}
    }
    pig.avoidTime=Math.max(0,pig.avoidTime-dt);
    pig.root.position.y+=(pig.ground-pig.root.position.y)*(1-Math.exp(-dt*16));
    // Actual displacement drives the stride; blocked pigs do not walk in place.
    const stride=.72+.18*clamp((pig.speed-.7)/2.9,0,1);
    pig.gait+=distance/stride*Math.PI*2;
    pig.gaitBlend+=((Math.abs(distance)>1e-5?Math.min(1,Math.abs(distance)/dt/.7):0)-pig.gaitBlend)*(1-Math.exp(-dt*14));
  }

  _recover(pig) {
    if(this._canOccupy(pig.root.position.x,pig.ground,pig.root.position.z,pig.heading)) return true;
    // Repair newly placed blocks or older intersecting spawns at the nearest clear pose.
    for(let radius=.2;radius<=2.01;radius+=.2) for(let i=0;i<12;i++) {
      const angle=pig.heading+Math.PI+i*Math.PI/6;
      const x=pig.root.position.x-Math.sin(angle)*radius,z=pig.root.position.z-Math.cos(angle)*radius;
      const y=this._groundHeight(x,z,pig.ground);
      if(y!==null && Math.abs(y-pig.ground)<.56 && this._canOccupy(x,y,z,pig.heading)) {
        pig.root.position.set(x,y,z);pig.ground=y;pig.speed=0;pig.gaitBlend=0;
        this._setState(pig,'idle',.5);return true;
      }
    }
    return false;
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
      leg.rotation.x=s*(.42+.16*clamp((pig.speed-.7)/2.9,0,1))*blend;
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
      if(!pig.dead && !this._recover(pig)) {this._removeCreature(pig);continue;}
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
  networkState() {
    return this.creatures.map(p=>({id:p.id,position:p.root.position.toArray(),heading:p.heading,health:p.health,dead:p.dead,state:p.state,speed:p.speed,gait:p.gait,gaitBlend:p.gaitBlend,grazeBlend:p.grazeBlend,chewTime:p.chewTime,flashTime:p.flashTime,hitTime:p.hitTime,deathTime:p.deathTime,stateTime:p.stateTime,stateDuration:p.stateDuration}));
  }
  applyNetwork(records) {
    const ids=new Set(records.map(r=>r.id));
    for(const p of [...this.creatures])if(!ids.has(p.id))this._removeCreature(p);
    for(const record of records){
      if(!Array.isArray(record.position)||!record.position.every(Number.isFinite))continue;
      let pig=this.creatures.find(p=>p.id===record.id);
      if(!pig){pig=this._makePig(...record.position,record.id*37);pig.id=record.id;}
      this._nextId=Math.max(this._nextId,record.id+1);
      const position=record.position;Object.assign(pig,record);pig.networkTarget=new THREE.Vector3().fromArray(position);pig.ground=position[1];
    }
  }
  updateNetwork(dt) {
    this._time+=dt;
    for(const pig of this.creatures){
      if(pig.networkTarget)pig.root.position.lerp(pig.networkTarget,1-Math.exp(-dt*16));
      pig.root.rotation.y=pig.heading;pig.root.visible=this._hasVisibleTerrain(pig.root.position.x,pig.root.position.z);
      this._animate(pig,dt);pig.root.rotation.z=pig.dead?smooth(pig.deathTime/.6)*Math.PI/2:0;
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
