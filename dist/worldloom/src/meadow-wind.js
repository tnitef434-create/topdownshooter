import * as THREE from '../vendor/three.module.min.js';

function hash(x,z,seed) {
  let n=Math.imul(x^seed,0x45d9f3b)^Math.imul(z,0x27d4eb2d);
  n=Math.imul(n^(n>>>16),0x45d9f3b);
  return ((n^(n>>>16))>>>0)/4294967296;
}

// Occasional, irregular fields rather than individual random tall tufts.
// Neighbour-cell evaluation keeps the field continuous across chunk borders.
export function tallGrassFieldWeight(x,z,seed=0) {
  const cell=48,cx=Math.floor(x/cell),cz=Math.floor(z/cell);
  let weight=0;
  for(let dz=-1;dz<=1;dz++) for(let dx=-1;dx<=1;dx++) {
    const gx=cx+dx,gz=cz+dz;
    if(hash(gx,gz,seed^1731)>.34) continue;
    const px=(gx+.2+.6*hash(gx,gz,seed^283))*cell;
    const pz=(gz+.2+.6*hash(gx,gz,seed^721))*cell;
    const radius=12+hash(gx,gz,seed^91)*8;
    const edge=Math.sin(x*.29+z*.17)*1.5+Math.sin(z*.41-x*.1)*.7;
    weight=Math.max(weight,Math.min(1,Math.max(0,(radius+edge-Math.hypot(x-px,z-pz))/4)));
  }
  return weight;
}

export function attachMeadowWind(mesh,uniforms,kind) {
  const flower=kind==='sunflower';
  const declarations=`
    uniform float meadowTime;
    uniform float meadowStrength;
    uniform vec3 meadowPlayer;
    vec3 meadowBend(vec3 p) {
      mat4 placement = modelMatrix;
      #ifdef USE_INSTANCING
        placement *= instanceMatrix;
      #endif
      vec3 root = (placement * vec4(0.,0.,0.,1.)).xyz;
      float h = max(0.,p.y);
      float phase = dot(root.xz,vec2(.47,.31));
      float swell = sin(dot(root.xz,vec2(.105,.074))-meadowTime*1.35);
      float gust = .5+.5*sin(dot(root.xz,vec2(.037,-.062))-meadowTime*.63);
      float ripple = sin(phase-meadowTime*3.6+p.y*2.1);
      float bend = (${flower?'.065':'.16'} + swell*${flower?'.045':'.10'} + gust*${flower?'.035':'.10'})*meadowStrength;
      vec2 wind = vec2(.91,.42)*bend + vec2(-.42,.91)*ripple*${flower?'.012':'.025'}*meadowStrength;
      vec2 away = root.xz-meadowPlayer.xz;
      float reach = 1.-smoothstep(.15,1.05,length(away));
      reach *= 1.-smoothstep(1.,2.,abs(root.y-meadowPlayer.y));
      wind += away/max(.1,length(away))*reach*${flower?'.035':'.22'};
      vec3 local = vec3(dot(placement[0].xz,wind)/max(.01,dot(placement[0].xyz,placement[0].xyz)),
        -dot(wind,wind)*.12,
        dot(placement[2].xz,wind)/max(.01,dot(placement[2].xyz,placement[2].xyz)));
      float twist=sin(phase+meadowTime*1.1)*${flower?'.13':'.045'}*h*h*meadowStrength;
      return local*h*h*${flower?'1.':'2.2'} + vec3(-p.z,0.,p.x)*twist;
    }
  `;
  const patch=(shader)=>{
    shader.uniforms.meadowTime=uniforms.time;
    shader.uniforms.meadowStrength=uniforms.strength;
    shader.uniforms.meadowPlayer=uniforms.player;
    shader.vertexShader=declarations+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\ntransformed += meadowBend(position);');
    shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',
      '#include <beginnormal_vertex>\nvec3 slope = (meadowBend(position+vec3(0.,.01,0.))-meadowBend(position))/.01;\nobjectNormal.y -= dot(objectNormal.xz,slope.xz);');
  };
  mesh.material.onBeforeCompile=patch;
  mesh.material.customProgramCacheKey=()=>`meadow-wind-v1-${kind}`;
  mesh.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking});
  mesh.customDepthMaterial.onBeforeCompile=patch;
  mesh.customDepthMaterial.customProgramCacheKey=()=>`meadow-depth-v1-${kind}`;
  mesh.userData.wind='rooted-world-space-gusts';
}
