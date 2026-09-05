import * as THREE from '../vendor/three.module.min.js';

// Independent particles occupy the air volume; there is no ground ribbon or
// elongated card for the normal/depth pass to turn into a solid sand block.
export function createSandParticles(capacity, scene) {
  const geometry = new THREE.BufferGeometry();
  for (const [name,size] of [['position',3],['dustSize',1],['dustAlpha',1]]) {
    geometry.setAttribute(name,new THREE.BufferAttribute(new Float32Array(capacity*size),size).setUsage(THREE.DynamicDrawUsage));
  }
  geometry.setDrawRange(0,0);
  const material = new THREE.ShaderMaterial({
    uniforms:{...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),dustColor:{value:new THREE.Color(0xe6ca98)},pixelHeight:{value:800}},
    vertexShader:/* glsl */`
      attribute float dustSize; attribute float dustAlpha;
      uniform float pixelHeight; varying float particleAlpha;
      #include <fog_pars_vertex>
      void main(){
        vec4 mvPosition = modelViewMatrix * vec4(position,1.);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = clamp(dustSize * projectionMatrix[1][1] * pixelHeight * .5 / max(.1,-mvPosition.z),1.,96.);
        particleAlpha = dustAlpha;
        #include <fog_vertex>
      }
    `,
    fragmentShader:/* glsl */`
      uniform vec3 dustColor; varying float particleAlpha;
      #include <fog_pars_fragment>
      void main(){
        float radius = length(gl_PointCoord-.5)*2.;
        float feather = exp(-radius*radius*4.5) * (1.-smoothstep(.55,1.,radius));
        float alpha = particleAlpha * feather;
        if(alpha<.001)discard;
        gl_FragColor=vec4(dustColor,alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `,
    transparent:true,depthWrite:false,depthTest:true,fog:true,
  });
  const points = new THREE.Points(geometry,material);
  points.name='Dispersed windblown sand grains and soft dust';
  points.userData.skipAmbientOcclusion=true;points.frustumCulled=false;points.visible=false;points.renderOrder=5;
  const viewport=new THREE.Vector2();
  points.onBeforeRender=renderer=>{renderer.getDrawingBufferSize(viewport);material.uniforms.pixelHeight.value=renderer.getRenderTarget()?.height||viewport.y;};
  scene?.add(points);
  return points;
}
