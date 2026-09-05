import * as THREE from '../vendor/three.module.min.js';
import { WATER_MOTION_GLSL, createWaterMotionUniforms } from './water-motion.js';
import { createWaterCaptureUniforms } from './water-capture.js';

let waterNormals;
function waterNormalTexture() {
  if (waterNormals) return waterNormals;
  const size=256,data=new Uint8Array(size*size*4),waves=[];
  // A periodic, irregular spectrum is generated once. Two rotated layers move
  // independently in the shader; mipmaps suppress distant ripple aliasing.
  for(let i=0;i<22;i++) {
    const x=(i*7%13)-6,z=(i*11%17)-8;
    if(!x&&!z)continue;
    waves.push({x,z,phase:i*2.399963,weight:1/Math.sqrt(x*x+z*z)});
  }
  for(let y=0;y<size;y++)for(let x=0;x<size;x++) {
    let dx=0,dz=0;
    for(const wave of waves) {
      const slope=Math.cos((x*wave.x+y*wave.z)/size*Math.PI*2+wave.phase)*wave.weight;
      dx+=slope*wave.x;dz+=slope*wave.z;
    }
    const index=(x+y*size)*4;
    data[index]=Math.round(127.5+Math.tanh(dx*.23)*127.5);
    data[index+1]=Math.round(127.5+Math.tanh(dz*.23)*127.5);
    data[index+2]=255;data[index+3]=255;
  }
  waterNormals=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);
  waterNormals.wrapS=waterNormals.wrapT=THREE.RepeatWrapping;
  waterNormals.magFilter=THREE.LinearFilter;waterNormals.minFilter=THREE.LinearMipmapLinearFilter;
  waterNormals.generateMipmaps=true;waterNormals.needsUpdate=true;
  return waterNormals;
}

export function waterOptics(depth, facing) {
  const cosine = THREE.MathUtils.clamp(Math.abs(facing),0,1);
  const fresnel = .02 + .98 * (1 - cosine) ** 5;
  const transmission = Math.exp(-Math.max(0,depth) * .22 / Math.max(.32,cosine));
  return { fresnel, transmission, opacity:1 - (1 - fresnel) * transmission };
}

export function enhanceWaterMaterial(material, shared) {
  if (!material || material.userData.worldloomEnhanced) return;
  material.userData.worldloomEnhanced = true;
  shared = {...createWaterCaptureUniforms(),...createWaterMotionUniforms(),...shared};
  // Water has its own continuous surface: no block-atlas alpha, pixel normal
  // tiles or per-face terrain tint can leak into its optics.
  material.map = null; material.normalMap = null; material.vertexColors = false;
  material.color.set(0xffffff); material.opacity = 1; material.alphaTest = 0;
  material.roughness = .22; material.metalness = 0;
  material.transparent = true; material.depthWrite = false; material.dithering = true; material.forceSinglePass = true;
  const reflection = material.userData.waterReflection = {
    texture:{value:null}, matrix:{value:new THREE.Matrix4()}, valid:{value:0}, height:{value:0},
  };
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, {
      ...Object.fromEntries(Object.entries(shared).filter(([key])=>key.startsWith('water'))),
      waterTime:shared.time, waterDay:shared.dayAmount, waterMotion:shared.windStrength,
      waterSun:shared.sunDirection, waterSunColor:shared.sunColor, waterSunVisibility:shared.sunVisibility,
      waterSky:shared.waterSky, waterHorizon:shared.waterHorizon,
      waterReflection:reflection.texture, waterMirrorMatrix:reflection.matrix,
      waterMirrorValid:reflection.valid, waterMirrorHeight:reflection.height,
      waterNormals:{value:waterNormalTexture()},
    });
    shader.vertexShader = shader.vertexShader.replace('#include <common>',`#include <common>
      attribute vec3 waterData;
      uniform float waterTime; uniform float waterMotion; uniform mat4 waterMirrorMatrix;
      varying vec3 vWaterPosition; varying vec3 vWaterData; varying float vWaterTop;
      varying vec4 vWaterMirror; varying float vWaterBaseY;
      ${WATER_MOTION_GLSL}
    `).replace('#include <begin_vertex>',`#include <begin_vertex>
      vec3 baseWaterWorld = (modelMatrix * vec4(position,1.)).xyz;
      vWaterData = waterData;vWaterBaseY=baseWaterWorld.y;
      vWaterTop = step(.55,objectNormal.y);
      transformed.y += waterWaves(baseWaterWorld.xz,waterTime,baseWaterWorld.y).z * waterData.z * waterMotion;
      vWaterPosition = (modelMatrix * vec4(transformed,1.)).xyz;
      vWaterMirror = waterMirrorMatrix * vec4(baseWaterWorld,1.);
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>',`#include <common>
      uniform float waterTime; uniform float waterDay; uniform float waterMotion;
      uniform vec3 waterSun; uniform vec3 waterSunColor; uniform float waterSunVisibility;
      uniform vec3 waterSky; uniform vec3 waterHorizon;
      uniform sampler2D waterReflection; uniform float waterMirrorValid; uniform float waterMirrorHeight;
      uniform sampler2D waterNormals;
      uniform sampler2D waterSceneColor; uniform sampler2D waterSceneDepth; uniform float waterSceneValid;
      uniform vec2 waterSceneSize; uniform mat4 waterProjectionInverse;
      vec3 sceneViewPosition(vec2 uv){float d=texture2D(waterSceneDepth,uv).x;vec4 v=waterProjectionInverse*vec4(uv*2.-1.,d*2.-1.,1.);return v.xyz/v.w;}
      varying vec3 vWaterPosition; varying vec3 vWaterData; varying float vWaterTop;
      varying vec4 vWaterMirror; varying float vWaterBaseY;
      ${WATER_MOTION_GLSL}
      float wh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float wn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(wh(i),wh(i+vec2(1,0)),f.x),mix(wh(i+vec2(0,1)),wh(i+1.),f.x),f.y);}
    `).replace('#include <color_fragment>',`#include <color_fragment>
      float depthMix = 1. - exp(-vWaterData.x * .19);
      diffuseColor.rgb = mix(vec3(.035,.28,.25),vec3(.009,.075,.13),depthMix);
    `).replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
      vec2 waveUv=vWaterPosition.xz;
      vec2 n0=texture2D(waterNormals,waveUv*.064+waterTime*vec2(-.009,.005)).rg*2.-1.;
      vec2 n1=texture2D(waterNormals,mat2(.8,-.6,.6,.8)*waveUv*.103+waterTime*vec2(.006,.012)).rg*2.-1.;
      vec2 n2=texture2D(waterNormals,waveUv*.27+waterTime*vec2(-.017,-.008)).rg*2.-1.;
      vec3 waterWave=waterWaves(waveUv,waterTime,vWaterBaseY);
      waterWave.xy += (n0+n1*.57+n2*.18)*.10;
      waterWave.xy *= mix(1.,max(.25,vWaterData.z),vWaterTop);
      vec3 waterWorldNormal = normalize(vec3(-waterWave.x * waterMotion,1.,-waterWave.y * waterMotion));
      vec3 waterViewNormal = normalize(mat3(viewMatrix) * waterWorldNormal);
      normal = normalize(mix(normal,gl_FrontFacing ? waterViewNormal : -waterViewNormal,vWaterTop));
    `).replace('#include <opaque_fragment>',`
      vec3 waterEye = normalize(cameraPosition - vWaterPosition);
      float waterCosine = clamp(abs(dot(waterWorldNormal,waterEye)),0.,1.);
      float fresnel = .02 + .98 * pow(1. - waterCosine,5.);
      float belowSurface = step(cameraPosition.y + .04,vWaterPosition.y);
      float opticalDepth = mix(max(.25,vWaterData.x),max(.25,vWaterPosition.y-cameraPosition.y),belowSurface);
      float transmission = exp(-opticalDepth * .22 / max(.32,waterCosine));
      float surfaceAlpha = clamp(1. - (1. - fresnel) * transmission,.06,.985);
      vec3 reflectionDirection = reflect(-waterEye,waterWorldNormal);
      vec3 reflectionColor = mix(waterHorizon,waterSky,smoothstep(.02,.8,reflectionDirection.y));
      vec2 mirrorUv = vWaterMirror.xy / max(vWaterMirror.w,.001);
      mirrorUv += waterWave.xy * .017 / max(1.,length(cameraPosition-vWaterPosition)*.08);
      float mirrorEdge = smoothstep(0.,.04,mirrorUv.x) * smoothstep(0.,.04,mirrorUv.y)
        * smoothstep(0.,.04,1.-mirrorUv.x) * smoothstep(0.,.04,1.-mirrorUv.y);
      float mirrorPlane = 1. - smoothstep(.10,.25,abs(vWaterBaseY-waterMirrorHeight));
      if(waterMirrorValid > .5 && belowSurface < .5 && vWaterMirror.w > 0.) {
        reflectionColor = mix(reflectionColor,texture2D(waterReflection,clamp(mirrorUv,.001,.999)).rgb,mirrorEdge*mirrorPlane);
      }
      reflectionColor = mix(reflectionColor,vec3(.016,.12,.17)*(.12+waterDay*.88),belowSurface);
      vec3 halfway = normalize(normalize(waterSun)+waterEye);
      float glint = pow(max(dot(waterWorldNormal,halfway),0.),230.);
      glint *= waterSunVisibility * waterDay * (1.-belowSurface) * vWaterTop;
      vec3 scattered = outgoingLight * (1.-fresnel) * (1.-transmission);
      outgoingLight = (scattered + reflectionColor * fresnel + waterSunColor * glint * .32) / surfaceAlpha;
      // View-aligned refraction and actual seabed depth are shared by all chunks.
      // Blend the transmitted scene here so overlapping transparent chunk bounds
      // cannot turn one rectangular section into a solid cyan sheet.
      if(waterSceneValid>.5 && vWaterTop>.5){
        vec2 screenUv=gl_FragCoord.xy/waterSceneSize;
        vec3 waterView=(viewMatrix*vec4(vWaterPosition,1.)).xyz;
        vec3 bedView=sceneViewPosition(screenUv);
        float waterPath=clamp(length(bedView)-length(waterView),0.,24.);
        vec2 refractedUv=clamp(screenUv+waterWave.xy*min(.014,waterPath*.002)*waterMotion,.001,.999);
        vec3 bentBed=sceneViewPosition(refractedUv);
        if(-bentBed.z < -waterView.z+.04)refractedUv=screenUv;
        vec3 background=texture2D(waterSceneColor,refractedUv).rgb;
        vec3 absorption=exp(-vec3(.24,.075,.042)*waterPath);
        vec3 waterTint=vec3(.012,.14,.17)*(.16+.84*waterDay);
        vec3 transmitted=background*absorption+waterTint*(1.-absorption);
        outgoingLight=mix(transmitted,reflectionColor,fresnel)+waterSunColor*glint*.24;
        surfaceAlpha=1.;
      }
      float wash = wn(vWaterPosition.xz*3.8+vec2(waterTime*.21,-waterTime*.16));
      float foam = smoothstep(.18,.74,vWaterData.y) * smoothstep(.48,.78,wash)
        * (.58+.42*sin(waterTime*.9+vWaterPosition.x*.5+vWaterPosition.z*.4)) * vWaterTop * (1.-belowSurface);
      outgoingLight = mix(outgoingLight,waterSunColor*(.28+waterDay*.48),foam*.30);
      diffuseColor.a = max(surfaceAlpha,foam*.42);
      #include <opaque_fragment>
    `);
    material.userData.worldloomShader = shader;
  };
  material.customProgramCacheKey = () => 'worldloom-refractive-wave-water-v2';
  material.needsUpdate = true;
}

// One shared planar reflection covers the nearest sea/pond elevation. Other
// elevations retain the sky fallback. No per-chunk render targets or recursion.
export class WaterReflection {
  constructor(scene,renderer) {
    this.scene=scene;this.renderer=renderer;this.world=null;this.material=null;
    this.camera=new THREE.PerspectiveCamera();this.target=null;
    this.enabled=true;this.size=384;this.interval=1/20;this.elapsed=Infinity;this.scanTime=0;this.height=null;this.renders=0;
    this.plane=new THREE.Plane();this.clip=new THREE.Vector4();this.q=new THREE.Vector4();
    this.up=new THREE.Vector3();this.look=new THREE.Vector3();this.position=new THREE.Vector3();this.hidden=[];
  }
  setWorld(world) {
    if(this.material?.userData.waterReflection)this.material.userData.waterReflection.valid.value=0;
    this.world=world;this.material=world?.waterMaterial||null;this.height=null;this.scanTime=0;this.elapsed=Infinity;
  }
  setQuality(profile={}) {
    this.enabled=profile.postProcessing!==false;
    this.size=profile.atmosphereDetail>=1?640:384;
    this.interval=profile.atmosphereDetail>=1?1/30:1/20;
    if(this.target && this.target.width!==this.size)this.target.setSize(this.size,this.size);
    if(!this.enabled&&this.material?.userData.waterReflection)this.material.userData.waterReflection.valid.value=0;
  }
  _findSurface(camera) {
    const world=this.world, p=camera.position;
    for(const r of [0,4,10,20,36])for(let i=0;i<(r?12:1);i++) {
      const a=i/12*Math.PI*2,x=Math.floor(p.x+Math.cos(a)*r),z=Math.floor(p.z+Math.sin(a)*r);
      if(!world.hasVisibleTerrainAt(x,z))continue;
      const info=world._columnInfo?.(x,z);
      const y=Number.isFinite(info?.pondWaterLevel)?info.pondWaterLevel:world.seaLevel;
      const surface=world.getFluidSurfaceY(x,y,z);
      if(surface!==null&&Number.isFinite(surface))return surface;
    }
    return null;
  }
  update(dt,camera) {
    const state=this.material?.userData.waterReflection;
    if(!state||!this.world||!this.renderer||!this.enabled){if(state)state.valid.value=0;return;}
    this.scanTime-=dt;this.elapsed+=dt;
    if(this.scanTime<=0){this.height=this._findSurface(camera);this.scanTime=.5;}
    if(this.height===null||camera.position.y<this.height+.12){state.valid.value=0;return;}
    if(this.elapsed<this.interval)return;
    this.elapsed=0;
    if(!this.target)this.target=new THREE.WebGLRenderTarget(this.size,this.size,{type:THREE.HalfFloatType,depthBuffer:true,stencilBuffer:false});
    camera.updateMatrixWorld(true);
    camera.getWorldPosition(this.position);camera.getWorldDirection(this.look);this.look.add(this.position);
    this.position.y=2*this.height-this.position.y;this.look.y=2*this.height-this.look.y;
    this.up.set(0,1,0).applyQuaternion(camera.quaternion);this.up.y*=-1;
    const mirror=this.camera;mirror.position.copy(this.position);mirror.up.copy(this.up);mirror.lookAt(this.look);
    mirror.near=camera.near;mirror.far=camera.far;mirror.layers.mask=camera.layers.mask;
    mirror.projectionMatrix.copy(camera.projectionMatrix);mirror.updateMatrixWorld(true);
    state.matrix.value.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1)
      .multiply(mirror.projectionMatrix).multiply(mirror.matrixWorldInverse);
    // Oblique near-plane clipping keeps seabed and submerged fish out of the reflection.
    this.plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0,1,0),new THREE.Vector3(0,this.height,0));
    this.plane.applyMatrix4(mirror.matrixWorldInverse);
    this.clip.set(this.plane.normal.x,this.plane.normal.y,this.plane.normal.z,this.plane.constant);
    const e=mirror.projectionMatrix.elements;
    this.q.set((Math.sign(this.clip.x)+e[8])/e[0],(Math.sign(this.clip.y)+e[9])/e[5],-1,(1+e[10])/e[14]);
    this.clip.multiplyScalar(2/this.clip.dot(this.q));
    e[2]=this.clip.x;e[6]=this.clip.y;e[10]=this.clip.z+1-.003;e[14]=this.clip.w;
    mirror.projectionMatrixInverse.copy(mirror.projectionMatrix).invert();
    this.hidden.length=0;
    this.scene.traverse(object=>{
      if(object.visible && (object===camera||object.material===this.material||object.userData?.skipWaterReflection||object.renderOrder>=900)) {
        object.visible=false;this.hidden.push(object);
      }
    });
    const renderer=this.renderer,previousTarget=renderer.getRenderTarget(),xr=renderer.xr.enabled;
    const shadows=renderer.shadowMap.autoUpdate,toneMapping=renderer.toneMapping;
    try {
      renderer.xr.enabled=false;renderer.shadowMap.autoUpdate=false;renderer.toneMapping=THREE.NoToneMapping;
      renderer.setRenderTarget(this.target);renderer.clear();renderer.render(this.scene,mirror);
      state.texture.value=this.target.texture;state.height.value=this.height;state.valid.value=1;this.renders++;
    } finally {
      for(const object of this.hidden)object.visible=true;
      renderer.xr.enabled=xr;renderer.shadowMap.autoUpdate=shadows;renderer.toneMapping=toneMapping;renderer.setRenderTarget(previousTarget);
    }
  }
  dispose(){this.setWorld(null);this.target?.dispose();this.target=null;}
}
