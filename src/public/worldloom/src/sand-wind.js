import * as THREE from '../vendor/three.module.min.js';
import { BLOCK } from './blocks.js';
import { hasPlantGround } from './plant-visibility.js';
import { createSandParticles } from './sand-dust.js';

const CAP = 1800;
const REGION = 32;
const smooth = (x) => { x=Math.max(0,Math.min(1,x));return x*x*(3-2*x); };
function hash(x,z,seed) {
  let n=Math.imul(x^seed,0x45d9f3b)^Math.imul(z,0x27d4eb2d);
  n=Math.imul(n^(n>>>16),0x45d9f3b);
  return ((n^(n>>>16))>>>0)/4294967296;
}

// Broad regions have independent weather windows with long, completely calm
// intervals. A region may skip a whole window; neighbouring sand stays still.
export function sandGustAt(x,z,time,seed=0) {
  const cx=Math.floor(x/REGION),cz=Math.floor(z/REGION);
  const period=58+hash(cx,cz,seed^19)*32;
  const shifted=time+hash(cx,cz,seed^43)*period;
  const cycle=Math.floor(shifted/period),age=shifted-cycle*period;
  const duration=12+hash(cx,cz,seed^cycle^791)*8;
  const occurs=hash(cx,cz,seed^Math.imul(cycle+1,3191))<.56;
  const strength=occurs?smooth(age/3)*smooth((duration-age)/5):0;
  return {strength,angle:.32+(hash(cx,cz,seed^cycle^137)-.5)*.5};
}

export function sandSurface(world,x,z) {
  if (!hasPlantGround(world,x,z)) return null;
  const bx=Math.floor(x),bz=Math.floor(z),base=world?.terrainHeight?.(bx,bz);
  if (!Number.isFinite(base)) return null;
  for(let y=base+2;y>=base-2;y--) {
    if(world.getBlock?.(bx,y,bz)!==BLOCK.SAND) continue;
    // Avoid water, vegetation, structures and low ceilings above a sand bed.
    let clear=true;
    for(let dy=1;dy<=4;dy++)if(world.getBlock(bx,y+dy,bz)!==BLOCK.AIR){clear=false;break;}
    if(clear) return y+1;
  }
  return null;
}

export function sandRibbonFits(world,p) {
  const c=Math.cos(p.angle),s=Math.sin(p.angle);
  const steps=Math.ceil(p.length/.7);
  for(let i=0;i<=steps;i++)for(const side of [-.5,0,.5]) {
    const along=(i/steps-.5)*p.length,across=side*p.width;
    const y=sandSurface(world,p.x+c*along-s*across,p.z+s*along+c*across);
    if(y===null || Math.abs(y-p.y)>.05) return false;
  }
  return true;
}

export class SandWindField {
  constructor(scene) {
    this.world=null;this.time=0;this.scanTimer=0;this.emitTimer=0;this.serial=0;
    this.anchors=[];this.particles=[];this.limit=1200;this.enabled=true;this.reducedMotion=false;
    this.mesh=createSandParticles(CAP,scene);
  }
  setWorld(world) {
    if(this.world===world)return;
    this.world=world;this.anchors=[];this.particles=[];this.time=0;this.scanTimer=0;this.emitTimer=0;
    this.mesh.geometry.setDrawRange(0,0);this.mesh.visible=false;
  }
  setQuality(profile={},reducedMotion=false,enabled=true) {
    this.limit=Math.round(450+1350*Math.max(0,Math.min(1,profile.atmosphereDetail??.7)));
    this.reducedMotion=Boolean(reducedMotion);this.enabled=enabled!==false;
    if(!this.enabled){this.particles=[];this.mesh.geometry.setDrawRange(0,0);this.mesh.visible=false;}
  }
  _scan(focus) {
    const anchors=[];
    for(let z=Math.floor(focus.z/4)*4-36;z<=focus.z+36;z+=4)for(let x=Math.floor(focus.x/4)*4-36;x<=focus.x+36;x+=4) {
      const distanceSq=(x-focus.x)**2+(z-focus.z)**2;
      if(distanceSq>36**2)continue;
      const y=sandSurface(this.world,x+.5,z+.5);if(y===null)continue;
      let sandy=0;for(const dx of [-3,0,3])for(const dz of [-3,0,3])if(sandSurface(this.world,x+dx+.5,z+dz+.5)!==null)sandy++;
      if(sandy>=7)anchors.push({x:x+.5,z:z+.5,y,distanceSq});
    }
    this.anchors=anchors;
  }
  update(dt,focus,context={}) {
    if(!this.world||!focus||!this.enabled||context.active===false)return;
    dt=Math.max(0,Math.min(.1,Number(dt)||0));this.time+=dt;
    this.scanTimer-=dt;if(this.scanTimer<=0){this._scan(focus);this.scanTimer=2.5;}
    const weather=Math.max(0,1-(context.rainIntensity||0)*4)*Math.max(0,Math.min(1,context.skyExposure??1));
    this.emitTimer-=dt;
    if(this.emitTimer<=0&&weather>.15) {
      this.emitTimer=.065;
      const seed=this.world.seed||0;
      for(let attempt=0;attempt<54&&this.anchors.length&&this.particles.length<this.limit;attempt++) {
        const serial=++this.serial;
        const anchor=this.anchors[Math.floor(hash(serial,3,seed)*this.anchors.length)];
        const x=anchor.x+(hash(serial,5,seed)-.5)*5,z=anchor.z+(hash(serial,7,seed)-.5)*5;
        const gust=sandGustAt(x,z,this.time,seed);if(gust.strength<.12)continue;
        const ground=sandSurface(this.world,x,z);if(ground===null)continue;
        const soft=serial%3!==0,phase=hash(serial,11,seed)*Math.PI*2;
        this.particles.push({x,z,y:ground,ground,angle:gust.angle,phase,soft,age:0,
          life:4+hash(serial,13,seed)*5,height:.18+hash(serial,17,seed)*(soft?1.05:.55),
          speed:(.9+hash(serial,19,seed)*1.3)*(this.reducedMotion?.45:1),
          size:soft?1.1+hash(serial,23,seed)*1.1:.025+hash(serial,23,seed)*.050,
          opacity:soft?.28:.52,strength:gust.strength,check:0,bx:Math.floor(x),bz:Math.floor(z)});
      }
    }
    this.particles=this.particles.filter(p=>{
      p.age+=dt;
      const eddy=Math.sin(p.age*1.3+p.phase)*.24;
      p.x+=(Math.cos(p.angle)*p.speed-Math.sin(p.angle)*eddy)*dt;
      p.z+=(Math.sin(p.angle)*p.speed+Math.cos(p.angle)*eddy)*dt;
      p.y=p.ground+p.height+Math.sin(p.age*.9+p.phase)*Math.min(.075,p.height*.4);
      p.check-=dt;
      const bx=Math.floor(p.x),bz=Math.floor(p.z);
      if(p.check<=0||bx!==p.bx||bz!==p.bz) {
        const ground=sandSurface(this.world,p.x,p.z);p.check=.25;p.bx=bx;p.bz=bz;
        if(ground===null||Math.abs(ground-p.ground)>.1)return false;
      }
      return p.age<p.life&&(p.x-focus.x)**2+(p.z-focus.z)**2<42**2;
    }).slice(0,this.limit);
    const attributes=this.mesh.geometry.attributes;
    this.particles.forEach((p,i)=>{
      attributes.position.setXYZ(i,p.x,p.y,p.z);
      attributes.dustSize.setX(i,p.size*(p.soft?1+p.age/p.life*.7:1));
      attributes.dustAlpha.setX(i,p.opacity*smooth(p.age/.9)*smooth((p.life-p.age)/1.7)*p.strength*weather*(this.reducedMotion?.6:1));
    });
    this.mesh.material.uniforms.dustColor.value.set(0xe6ca98).multiplyScalar(.14+.86*Math.max(0,Math.min(1,context.dayAmount??1)));
    this.mesh.geometry.setDrawRange(0,this.particles.length);this.mesh.visible=this.particles.length>0&&weather>.01;
    for(const attribute of Object.values(attributes))attribute.needsUpdate=true;
  }
  getStats(){return {anchors:this.anchors.length,dustParticles:this.particles.length,grains:this.particles.filter(p=>!p.soft).length,draws:Number(this.mesh.visible),time:this.time,enabled:this.enabled};}
  dispose(){this.mesh.removeFromParent();this.mesh.geometry.dispose();this.mesh.material.dispose();this.world=null;this.particles=[];this.anchors=[];}
}
