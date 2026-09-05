import * as THREE from '../vendor/three.module.min.js';
import { WATER_WAVES } from './water-nature-data.js';
export const MAX_WATER_IMPULSES=12;
export function createWaterMotionUniforms(){return {
  waterRippleTime:{value:0},waterRipples:{value:Array.from({length:MAX_WATER_IMPULSES},()=>new THREE.Vector4())},
  waterRippleLevels:{value:new Float32Array(MAX_WATER_IMPULSES)},
};}
export function waterDisplacement(x,z,time,impulses=[],level=0,motion=1){
  let h=0;
  for(const [dx,dz,k,amp,speed] of WATER_WAVES)h+=Math.sin((x*dx+z*dz)*k-time*speed)*amp*motion;
  for(const p of impulses){
    const age=time-p.born;if(age<0||age>4||Math.abs(level-p.surface)>.3)continue;
    const r=Math.hypot(x-p.x,z-p.z),q=r-age*1.55;
    h+=Math.sin(q*8)*Math.exp(-q*q/.64-age*.8)*.065*p.strength/(1+r*.35)*Math.min(1,age/.12);
  }
  return h;
}
export const WATER_MOTION_GLSL=`
uniform float waterRippleTime;
uniform vec4 waterRipples[${MAX_WATER_IMPULSES}];
uniform float waterRippleLevels[${MAX_WATER_IMPULSES}];
vec3 waterWaves(vec2 p,float time,float level){
  vec3 wave=vec3(0.);
  ${WATER_WAVES.map(([x,z,k,amp,speed])=>`{vec2 d=vec2(${x.toFixed(4)},${z.toFixed(4)});float phase=dot(p,d)*${k.toFixed(4)}-time*${speed.toFixed(4)};wave.xy+=d*cos(phase)*${(k*amp).toFixed(5)};wave.z+=sin(phase)*${amp.toFixed(5)};}`).join('\n')}
  for(int i=0;i<${MAX_WATER_IMPULSES};i++){
    vec4 impulse=waterRipples[i];float age=waterRippleTime-impulse.z;
    if(impulse.w<=0.||age<0.||age>4.||abs(level-waterRippleLevels[i])>.3)continue;
    vec2 delta=p-impulse.xy;float r=length(delta);float q=r-age*1.55;
    float envelope=exp(-q*q/.64-age*.8)*.065*impulse.w/(1.+r*.35)*min(1.,age/.12);
    wave.z+=sin(q*8.)*envelope;
    wave.xy+=delta/max(r,.001)*envelope*(8.*cos(q*8.)-sin(q*8.)*(2.*q/.64+.35/(1.+r*.35)));
  }
  return wave;
}`;
