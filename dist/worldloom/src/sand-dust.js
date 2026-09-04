import * as THREE from '../vendor/three.module.min.js';

// Raised billows complement the Blender ground ribbons. Granular breakup and
// several independently advected noise scales avoid flat painted streaks.
export function createSandDust(capacity, time, scene) {
  const geometry = new THREE.PlaneGeometry(1,1);
  geometry.setAttribute('dustAlpha',new THREE.InstancedBufferAttribute(new Float32Array(capacity),1).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('dustSeed',new THREE.InstancedBufferAttribute(new Float32Array(capacity),1).setUsage(THREE.DynamicDrawUsage));
  const material = new THREE.MeshBasicMaterial({color:0xe5c58e,transparent:true,opacity:.78,depthWrite:false,side:THREE.DoubleSide,fog:true});
  material.onBeforeCompile = shader => {
    shader.uniforms.dustTime = time;
    shader.vertexShader = 'attribute float dustAlpha; attribute float dustSeed; varying float dustOpacity; varying float dustVariant; varying vec2 dustUv;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      dustOpacity = dustAlpha; dustVariant = dustSeed; dustUv = uv;
    `).replace('#include <project_vertex>',`
      vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(0.,0.,0.,1.);
      mvPosition.xy += position.xy * vec2(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz));
      gl_Position = projectionMatrix * mvPosition;
    `);
    shader.fragmentShader = `uniform float dustTime; varying float dustOpacity; varying float dustVariant; varying vec2 dustUv;
      float dh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float dn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(dh(i),dh(i+vec2(1,0)),f.x),mix(dh(i+vec2(0,1)),dh(i+1.),f.x),f.y);}
      float fbm(vec2 p){return dn(p)*.56+dn(p*2.13)*.28+dn(p*4.39)*.16;}
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec2 q = dustUv * 2. - 1.;
      vec2 flow = dustUv * vec2(4.5,3.) + vec2(-dustTime*.38 + dustVariant*61.,-dustTime*.17);
      float turbulent = fbm(flow + vec2(sin(flow.y + dustTime*.35)*.6,0.));
      float shape = 1. - smoothstep(.28,1.,length(q * vec2(.87,1.)) + (turbulent-.5)*.38);
      float body = smoothstep(.23,.75,turbulent);
      vec2 grains = dustUv * vec2(130.,60.) - vec2(dustTime*5.,dustTime*1.7);
      float speckle = smoothstep(.77,.94,dn(grains));
      diffuseColor.rgb *= mix(.70,1.18,turbulent) + speckle*.12;
      diffuseColor.a *= dustOpacity * shape * (.23 + body*.74 + speckle*.13);
      if(diffuseColor.a < .002) discard;
    `);
  };
  material.customProgramCacheKey = () => 'raised-granular-sand-billows-v1';
  const mesh = new THREE.InstancedMesh(geometry,material,capacity);
  mesh.name = 'Rolling airborne sand and fine dust'; mesh.count = 0; mesh.visible = false;
  mesh.renderOrder = 5; mesh.frustumCulled = false;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene?.add(mesh);
  return mesh;
}
