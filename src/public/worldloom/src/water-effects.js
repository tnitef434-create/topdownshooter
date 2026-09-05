import * as THREE from '../vendor/three.module.min.js';
import { BLOCK } from './blocks.js';
import { sampleWaterView } from './water-view.js';

const MAX_RINGS=14, MAX_DROPS=160;
export class WaterInteractionEffects {
  constructor(scene) {
    this.world=null;this.rings=[];this.drops=[];this.previous=null;this.wet=false;this.cooldown=0;this.wakeTimer=0;this.entries=0;
    this.ringPool=Array.from({length:MAX_RINGS},()=>{
      const geometry=new THREE.RingGeometry(.72,1,64,2);
      geometry.setAttribute('wet',new THREE.Float32BufferAttribute(new Float32Array(geometry.attributes.position.count).fill(1),1));
      const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,fog:true,
        uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{opacity:{value:0},light:{value:1},band:{value:.08}}]),
        vertexShader:`attribute float wet; varying vec2 ringUv; varying float waterMask;
          #include <fog_pars_vertex>
          void main(){ringUv=position.xy;waterMask=wet;vec4 mvPosition=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mvPosition;
          #include <fog_vertex>
          }`,
        fragmentShader:`uniform float opacity;uniform float light;uniform float band;varying vec2 ringUv;varying float waterMask;
          #include <fog_pars_fragment>
          void main(){float r=length(ringUv);float edge=exp(-pow((r-.87)/band,2.))*smoothstep(.72,.78,r)*(1.-smoothstep(.96,1.,r));
            float angle=atan(ringUv.y,ringUv.x);float broken=.7+.3*sin(angle*11.+r*28.);
            gl_FragColor=vec4(vec3(.66,.86,.89)*light,edge*opacity*waterMask*broken);
            #include <fog_fragment>
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`});
      const mesh=new THREE.Mesh(geometry,material);mesh.rotation.x=-Math.PI/2;mesh.visible=false;mesh.renderOrder=4;
      mesh.userData.skipAmbientOcclusion=true;mesh.raycast=()=>{};scene.add(mesh);return mesh;
    });
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(MAX_DROPS*3),3));
    geo.setAttribute('life',new THREE.Float32BufferAttribute(new Float32Array(MAX_DROPS),1));
    const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:true,
      uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{pixelHeight:{value:800},light:{value:1}}]),
      vertexShader:`attribute float life;varying float alpha;uniform float pixelHeight;
        #include <fog_pars_vertex>
        void main(){alpha=life;vec4 mvPosition=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mvPosition;
        gl_PointSize=clamp(.026*projectionMatrix[1][1]*pixelHeight*.5/max(.1,-mvPosition.z),1.,14.);
        #include <fog_vertex>
        }`,
      fragmentShader:`varying float alpha;uniform float light;
        #include <fog_pars_fragment>
        void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;
        gl_FragColor=vec4(vec3(.66,.85,.90)*light,(1.-smoothstep(.3,1.,r))*alpha*.8);
        #include <fog_fragment>
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        }`});
    this.mesh=new THREE.Points(geo,mat);this.mesh.visible=false;this.mesh.frustumCulled=false;this.mesh.renderOrder=5;
    this.mesh.userData.skipAmbientOcclusion=true;scene.add(this.mesh);
    const size=new THREE.Vector2();
    this.mesh.onBeforeRender=renderer=>{mat.uniforms.pixelHeight.value=renderer.getRenderTarget()?.height??renderer.getDrawingBufferSize(size).y;};
  }
  setWorld(world) {
    if(this.world===world)return;
    this.world=world;this.previous=null;this.wet=false;this.cooldown=0;this.wakeTimer=0;this.rings=[];this.drops=[];this.entries=0;
    this.ringPool.forEach(m=>m.visible=false);this.mesh.visible=false;this.mesh.geometry.setDrawRange(0,0);
  }
  ripple(x,z,surface,strength=1) {
    const mesh=this.ringPool.find(m=>!this.rings.some(r=>r.mesh===m));if(!mesh)return;
    this.rings.push({mesh,x,z,surface,age:0,life:2.5,strength});
  }
  splash(position,surface,impact=2) {
    if(!this.world||!Number.isFinite(surface))return;
    this.entries++;
    const power=THREE.MathUtils.clamp(impact/5,.35,1.5);
    this.ripple(position.x,position.z,surface,power);
    for(let i=0;i<28+Math.round(power*18)&&this.drops.length<MAX_DROPS;i++) {
      const angle=i*2.399963,random=(Math.sin(i*17.13+this.entries*1.7)+1)*.5;
      const speed=(.4+random*.7)*power;
      this.drops.push({x:position.x+Math.cos(angle)*.20,z:position.z+Math.sin(angle)*.20,y:surface+.03,
        vx:Math.cos(angle)*speed,vz:Math.sin(angle)*speed,vy:(1.1+random*1.8)*Math.sqrt(power),surface,age:0,life:1.25});
    }
  }
  update(dt,focus,context={}) {
    if(!this.world||!focus)return;
    if(context.active===false){this.previous=null;return;}
    dt=THREE.MathUtils.clamp(Number(dt)||0,0,.1);this.cooldown=Math.max(0,this.cooldown-dt);this.wakeTimer-=dt;
    const view=sampleWaterView(this.world,{x:focus.x,y:focus.y+.03,z:focus.z});
    const moved=this.previous?Math.hypot(focus.x-this.previous.x,focus.y-this.previous.y,focus.z-this.previous.z):0;
    // Loading/teleporting into a lake is not an impact. A real crossing uses the
    // pre-drag vertical speed, or position delta if the physics velocity changed.
    if(this.previous&&moved<4&&view.submerged&&!this.wet&&this.cooldown<=0) {
      this.splash(focus,view.surface,Math.max(1,-(context.playerVelocity?.y||0),(this.previous.y-focus.y)/Math.max(.01,dt)));
      this.cooldown=.55;this.wakeTimer=.35;
    }
    const speed=Math.hypot(context.playerVelocity?.x||0,context.playerVelocity?.z||0);
    if(view.submerged&&view.depth<1.9&&speed>.25&&this.wakeTimer<=0) {
      this.ripple(focus.x,focus.z,view.surface,.3+Math.min(.4,speed*.09));this.wakeTimer=.55;
    }
    this.previous={x:focus.x,y:focus.y,z:focus.z};this.wet=view.submerged;
    const light=.17+.83*THREE.MathUtils.clamp(context.dayAmount??1,0,1);
    this.rings=this.rings.filter(r=>{
      r.age+=dt;if(r.age>=r.life){r.mesh.visible=false;return false;}
      const radius=.18+r.age*(.70+.24*r.strength);
      r.mesh.position.set(r.x,r.surface+.068,r.z);r.mesh.scale.setScalar(radius);
      r.mesh.material.uniforms.opacity.value=(1-r.age/r.life)**1.6*Math.min(1,r.age/.12)*.58*r.strength;
      r.mesh.material.uniforms.light.value=light;r.mesh.visible=true;
      r.mesh.material.uniforms.band.value=Math.min(.08,.032/radius);
      const pos=r.mesh.geometry.attributes.position,wet=r.mesh.geometry.attributes.wet;
      for(let i=0;i<pos.count;i++) {
        const x=Math.floor(r.x+pos.getX(i)*radius),z=Math.floor(r.z-pos.getY(i)*radius),y=Math.floor(r.surface-.08);
        const surface=this.world.getFluidSurfaceY?.(x,y,z)??(this.world.getBlock(x,y,z)===BLOCK.WATER?y+.9:null);
        wet.setX(i,surface!==null&&Math.abs(surface-r.surface)<.16?1:0);
      }
      wet.needsUpdate=true;return true;
    });
    this.drops=this.drops.filter(p=>{
      p.age+=dt;p.vy-=5.8*dt;p.x+=p.vx*dt;p.z+=p.vz*dt;p.y+=p.vy*dt;
      return p.age<p.life&&p.y>p.surface;
    });
    const attributes=this.mesh.geometry.attributes;
    this.drops.forEach((p,i)=>{attributes.position.setXYZ(i,p.x,p.y,p.z);attributes.life.setX(i,Math.min(1,(p.life-p.age)*3));});
    attributes.position.needsUpdate=true;attributes.life.needsUpdate=true;
    this.mesh.material.uniforms.light.value=light;this.mesh.geometry.setDrawRange(0,this.drops.length);this.mesh.visible=this.drops.length>0;
  }
  getStats(){return {entries:this.entries,ripples:this.rings.length,droplets:this.drops.length};}
  dispose(){this.setWorld(null);for(const m of [...this.ringPool,this.mesh]){m.removeFromParent();m.geometry.dispose();m.material.dispose();}}
}
