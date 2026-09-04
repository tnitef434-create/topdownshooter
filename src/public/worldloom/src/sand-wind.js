import * as THREE from '../vendor/three.module.min.js';
import { BLOCK } from './blocks.js';
import { SAND_DRIFT_MESH } from './sand-drift-mesh.js';
import { hasPlantGround } from './plant-visibility.js';

const CAP = 72;
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
    this.anchors=[];this.particles=[];this.limit=48;this.enabled=true;this.reducedMotion=false;
    this.uniforms={time:{value:0}};this.dummy=new THREE.Object3D();
    const geometry=new THREE.BufferGeometry();
    for(const [name,size] of [['position',3],['normal',3],['uv',2]])geometry.setAttribute(name,new THREE.Float32BufferAttribute(SAND_DRIFT_MESH[name],size));
    geometry.setAttribute('driftOpacity',new THREE.InstancedBufferAttribute(new Float32Array(CAP),1).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('driftSeed',new THREE.InstancedBufferAttribute(new Float32Array(CAP),1).setUsage(THREE.DynamicDrawUsage));
    const material=new THREE.MeshBasicMaterial({color:0xd7bd8a,transparent:true,opacity:.3,depthWrite:false,side:THREE.DoubleSide,fog:true});
    material.onBeforeCompile=shader=>{
      shader.uniforms.sandTime=this.uniforms.time;
      shader.vertexShader='attribute float driftOpacity; attribute float driftSeed; varying float sandAlpha; varying float sandSeed; varying vec2 sandUv;\n'+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nsandAlpha=driftOpacity; sandSeed=driftSeed; sandUv=uv;');
      shader.fragmentShader=`uniform float sandTime; varying float sandAlpha; varying float sandSeed; varying vec2 sandUv;
        float sandHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float sandNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(sandHash(i),sandHash(i+vec2(1.,0.)),f.x),mix(sandHash(i+vec2(0.,1.)),sandHash(i+1.),f.x),f.y);}
        `+shader.fragmentShader;
      shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 flow=vec2(sandUv.x*7.-sandTime*.55+sandSeed*47.,sandUv.y*5.);
        float cloud=sandNoise(flow+vec2(0.,sin(flow.x*.7)*.5));
        float grain=sandNoise(sandUv*vec2(180.,55.)-vec2(sandTime*7.,0.));
        float edge=pow(max(0.,sin(sandUv.x*3.141593)),1.5)*pow(max(0.,sin(sandUv.y*3.141593)),2.);
        diffuseColor.a*=sandAlpha*edge*smoothstep(.25,.72,cloud)*mix(.45,1.,grain);
        if(diffuseColor.a<.001) discard;
      `);
    };
    material.customProgramCacheKey=()=> 'blender-sand-drift-v1';
    this.mesh=new THREE.InstancedMesh(geometry,material,CAP);
    this.mesh.name='Intermittent Blender windblown sand';this.mesh.userData.authoredIn='Blender';
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.mesh.frustumCulled=false;
    this.mesh.renderOrder=4;this.mesh.count=0;this.mesh.visible=false;scene?.add(this.mesh);
  }
  setWorld(world) {
    if(this.world===world)return;
    this.world=world;this.anchors=[];this.particles=[];this.time=0;this.scanTimer=0;this.emitTimer=0;
    this.mesh.count=0;this.mesh.visible=false;
  }
  setQuality(profile={},reducedMotion=false,enabled=true) {
    this.limit=Math.round(24+48*Math.max(0,Math.min(1,profile.atmosphereDetail??.7)));
    this.reducedMotion=Boolean(reducedMotion);this.enabled=enabled!==false;
    if(!this.enabled){this.particles=[];this.mesh.count=0;this.mesh.visible=false;}
  }
  _scan(focus) {
    const anchors=[],seed=this.world?.seed||0;
    for(let z=Math.floor(focus.z/4)*4-40;z<=focus.z+40;z+=4)for(let x=Math.floor(focus.x/4)*4-40;x<=focus.x+40;x+=4) {
      const distanceSq=(x-focus.x)**2+(z-focus.z)**2;
      if(distanceSq>40**2)continue;
      const y=sandSurface(this.world,x+.5,z+.5);if(y===null)continue;
      // Require a broad sand neighbourhood, so tiny isolated sand blocks never puff.
      let sandy=0;for(const dx of [-4,0,4])for(const dz of [-4,0,4])if(sandSurface(this.world,x+dx+.5,z+dz+.5)!==null)sandy++;
      if(sandy<7)continue;
      anchors.push({x:x+.5+hash(x,z,seed)*1.4,z:z+.5+hash(x,z,seed^171)*1.4,y,distanceSq});
    }
    this.anchors=anchors.sort((a,b)=>a.distanceSq-b.distanceSq);
  }
  update(dt,focus,context={}) {
    if(!this.world||!focus||!this.enabled||context.active===false)return;
    dt=Math.max(0,Math.min(.1,Number(dt)||0));this.time+=dt;this.uniforms.time.value=this.time;
    this.scanTimer-=dt;if(this.scanTimer<=0){this._scan(focus);this.scanTimer=2.5;}
    const weather=Math.max(0,1-(context.rainIntensity||0)*4)*Math.max(0,Math.min(1,context.skyExposure??1));
    this.emitTimer-=dt;
    if(this.emitTimer<=0&&weather>.15) {
      this.emitTimer=.22;
      for(let attempt=0;attempt<8&&this.anchors.length&&this.particles.length<this.limit;attempt++) {
        const serial=++this.serial,seed=this.world.seed||0;
        const a=this.anchors[Math.floor(hash(serial,3,seed)*this.anchors.length)];
        const gust=sandGustAt(a.x,a.z,this.time,seed);if(gust.strength<.1)continue;
        const p={...a,angle:gust.angle,length:2.8+hash(serial,5,seed)*2.4,width:.8+hash(serial,7,seed)*1.1,
          age:0,life:5+hash(serial,11,seed)*4,speed:(.4+hash(serial,13,seed)*.45)*(this.reducedMotion?.45:1),seed:hash(serial,17,seed),strength:gust.strength};
        if(sandRibbonFits(this.world,p))this.particles.push(p);
      }
    }
    this.particles=this.particles.filter(p=>{
      p.age+=dt;p.x+=Math.cos(p.angle)*p.speed*dt;p.z+=Math.sin(p.angle)*p.speed*dt;
      return p.age<p.life&&(p.x-focus.x)**2+(p.z-focus.z)**2<48**2&&sandRibbonFits(this.world,p);
    }).slice(0,this.limit);
    const alpha=this.mesh.geometry.attributes.driftOpacity,seeds=this.mesh.geometry.attributes.driftSeed;
    this.particles.forEach((p,i)=>{
      this.dummy.position.set(p.x,p.y+.025+Math.sin(p.age/p.life*Math.PI)*.04,p.z);
      this.dummy.rotation.set(0,-p.angle,0);this.dummy.scale.set(p.length,1,p.width);this.dummy.updateMatrix();this.mesh.setMatrixAt(i,this.dummy.matrix);
      alpha.setX(i,smooth(p.age/1.4)*smooth((p.life-p.age)/2)*p.strength*weather*(this.reducedMotion?.5:1));seeds.setX(i,p.seed);
    });
    this.mesh.material.color.set(0xd7bd8a).multiplyScalar(.14+.86*Math.max(0,Math.min(1,context.dayAmount??1)));
    this.mesh.count=this.particles.length;this.mesh.visible=this.mesh.count>0&&weather>.01;
    this.mesh.instanceMatrix.needsUpdate=true;alpha.needsUpdate=true;seeds.needsUpdate=true;
  }
  getStats(){return {anchors:this.anchors.length,drifts:this.mesh.count,draws:Number(this.mesh.visible),time:this.time,enabled:this.enabled};}
  dispose(){this.mesh.removeFromParent();this.mesh.geometry.dispose();this.mesh.material.dispose();this.world=null;this.particles=[];this.anchors=[];}
}
