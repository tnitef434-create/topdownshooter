import * as THREE from '../vendor/three.module.min.js';
import { MIST_VOLUME_SIZE,MIST_VOLUME_BASE64 } from './water-nature-data.js';
import { createWaterCaptureUniforms } from './water-capture.js';

export function createPondMist(shared={}) {
  const bytes=Uint8Array.from(atob(MIST_VOLUME_BASE64),c=>c.charCodeAt(0));
  const noise=new THREE.Data3DTexture(bytes,MIST_VOLUME_SIZE,MIST_VOLUME_SIZE,MIST_VOLUME_SIZE);
  noise.format=THREE.RedFormat;noise.minFilter=noise.magFilter=THREE.LinearFilter;
  noise.wrapS=noise.wrapT=noise.wrapR=THREE.MirroredRepeatWrapping;noise.unpackAlignment=1;noise.needsUpdate=true;
  const uniforms={...createWaterCaptureUniforms(),...shared,...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
    mistNoise:{value:noise},mistTime:{value:0},mistDensity:{value:1},mistDay:{value:1},
    mistSun:{value:new THREE.Vector3(0,1,0)},mistSunColor:{value:new THREE.Color(1,.93,.8)}};
  const material=new THREE.ShaderMaterial({name:'Blender volume · low hanging pond fog',glslVersion:THREE.GLSL3,
    uniforms,transparent:true,depthWrite:false,depthTest:false,side:THREE.BackSide,fog:true,
    vertexShader:`varying vec3 vWorld;varying vec3 vOrigin;varying vec3 vSize;
      #include <fog_pars_vertex>
      void main(){mat4 transform=modelMatrix*instanceMatrix;vec4 world=transform*vec4(position,1.);
      vWorld=world.xyz;vOrigin=(transform*vec4(0.,0.,0.,1.)).xyz;
      vSize=vec3(length(transform[0].xyz),length(transform[1].xyz),length(transform[2].xyz));
      vec4 mvPosition=viewMatrix*world;gl_Position=projectionMatrix*mvPosition;
      #include <fog_vertex>
      }`,
    fragmentShader:`precision highp sampler3D;
      out vec4 fogOutput;
      #define gl_FragColor fogOutput
      uniform sampler3D mistNoise;uniform float mistTime;uniform float mistDensity;uniform float mistDay;
      uniform vec3 mistSun;uniform vec3 mistSunColor;
      uniform sampler2D waterSceneDepth;uniform float waterSceneValid;uniform vec2 waterSceneSize;
      uniform mat4 waterProjectionInverse;uniform mat4 waterCameraWorld;
      varying vec3 vWorld;varying vec3 vOrigin;varying vec3 vSize;
      #include <fog_pars_fragment>
      void main(){
        vec3 ray=normalize(vWorld-cameraPosition);vec3 local=cameraPosition-vOrigin;
        vec3 inv=1./mix(vec3(.00001),ray,step(vec3(.00001),abs(ray)));
        vec3 a=(vec3(-vSize.x,0.,-vSize.z)-local)*inv,b=(vSize-local)*inv;
        vec3 mn=min(a,b),mx=max(a,b);
        float start=max(0.,max(mn.x,max(mn.y,mn.z))),end=min(mx.x,min(mx.y,mx.z));
        if(waterSceneValid>.5){
          vec2 uv=gl_FragCoord.xy/waterSceneSize;float depth=texture(waterSceneDepth,uv).x;
          vec4 view=waterProjectionInverse*vec4(uv*2.-1.,depth*2.-1.,1.);
          vec3 solid=(waterCameraWorld*vec4(view.xyz/view.w,1.)).xyz;end=min(end,length(solid-cameraPosition));
        }
        if(end<=start)discard;
        float stepSize=(end-start)/20.,optical=0.;
        for(int i=0;i<20;i++){
          vec3 p=cameraPosition+ray*(start+(float(i)+.5)*stepSize)-vOrigin;
          float edge=1.-smoothstep(.55,1.,length(p.xz/vSize.xz));
          float h=clamp(p.y/vSize.y,0.,1.);float vertical=smoothstep(0.,.07,h)*exp(-h*3.8)*(1.-smoothstep(.65,1.,h));
          vec3 uv=p*vec3(.21,.55,.21)+vec3(-mistTime*.008,0.,mistTime*.003);
          float n=texture(mistNoise,uv).r*.72+texture(mistNoise,uv*2.1+vec3(mistTime*.004)).r*.28;
          optical+=smoothstep(.30,.72,n)*edge*vertical*stepSize;
        }
        float alpha=1.-exp(-optical*mistDensity*1.3);if(alpha<.001)discard;
        float forward=pow(max(dot(ray,normalize(mistSun)),0.),5.);
        vec3 color=mix(vec3(.50,.61,.64),mistSunColor*.92,.5+forward*.32)*(.16+.84*mistDay);
        gl_FragColor=vec4(color,alpha);
        #include <fog_fragment>
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
  const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(2,1,2).translate(0,.5,0),material,72);
  mesh.name='Low hanging volumetric pond fog';mesh.count=0;mesh.visible=false;mesh.frustumCulled=false;mesh.renderOrder=6;
  mesh.userData.skipAmbientOcclusion=true;mesh.userData.skipWaterCapture=true;mesh.userData.skipWaterReflection=true;mesh.raycast=()=>{};
  // Uniform textures are not standard material.map properties, so own disposal.
  material.addEventListener('dispose',()=>noise.dispose());
  return mesh;
}
