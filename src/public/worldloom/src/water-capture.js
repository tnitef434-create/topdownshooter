import * as THREE from '../vendor/three.module.min.js';
export function createWaterCaptureUniforms(){return {
  waterSceneColor:{value:null},waterSceneDepth:{value:null},waterSceneValid:{value:0},
  waterSceneSize:{value:new THREE.Vector2(1,1)},waterProjectionInverse:{value:new THREE.Matrix4()},
  waterCameraWorld:{value:new THREE.Matrix4()},
};}

// One view-aligned colour/depth capture is shared by every water chunk and pond
// fog volume. All chunks sample the same image, avoiding per-object blend seams.
export class WaterSceneCapture {
  constructor(scene,renderer,shared){
    this.scene=scene;this.renderer=renderer;this.world=null;this.target=null;this.scale=.65;
    this.uniforms=createWaterCaptureUniforms();Object.assign(shared,this.uniforms);
    this.size=new THREE.Vector2();this.hidden=[];this.renders=0;
  }
  setWorld(world){this.world=world;this.uniforms.waterSceneValid.value=0;}
  setQuality(profile={}){this.scale=profile.postProcessing===false?.5:profile.atmosphereDetail>=1?.8:.65;}
  update(camera){
    const renderer=this.renderer,world=this.world,u=this.uniforms;
    if(!renderer||!world){u.waterSceneValid.value=0;return;}
    const wet=[...world.chunks.values()].some(c=>c.waterMesh?.visible);
    if(!wet){u.waterSceneValid.value=0;return;}
    renderer.getDrawingBufferSize(this.size);
    const width=Math.max(1,Math.round(this.size.x*this.scale)),height=Math.max(1,Math.round(this.size.y*this.scale));
    if(!this.target){
      this.target=new THREE.WebGLRenderTarget(width,height,{type:THREE.HalfFloatType,depthBuffer:true});
      this.target.depthTexture=new THREE.DepthTexture(width,height,THREE.UnsignedIntType);
    }
    if(this.target.width!==width||this.target.height!==height)this.target.setSize(width,height);
    this.hidden.length=0;
    this.scene.traverse(object=>{
      if(object.visible&&(object.material===world.waterMaterial||object.userData?.skipWaterCapture||object.renderOrder>=900)){
        this.hidden.push(object);object.visible=false;
      }
    });
    const previous=renderer.getRenderTarget(),tone=renderer.toneMapping,shadow=renderer.shadowMap.autoUpdate,xr=renderer.xr.enabled;
    try{
      renderer.xr.enabled=false;renderer.toneMapping=THREE.NoToneMapping;renderer.shadowMap.autoUpdate=false;
      renderer.setRenderTarget(this.target);renderer.clear();renderer.render(this.scene,camera);
      u.waterSceneColor.value=this.target.texture;u.waterSceneDepth.value=this.target.depthTexture;
      // Screen UV uses the final view size, not the lower-resolution capture.
      u.waterSceneSize.value.copy(this.size);u.waterProjectionInverse.value.copy(camera.projectionMatrixInverse);
      u.waterCameraWorld.value.copy(camera.matrixWorld);u.waterSceneValid.value=1;this.renders++;
    }finally{
      for(const object of this.hidden)object.visible=true;
      renderer.setRenderTarget(previous);renderer.toneMapping=tone;renderer.shadowMap.autoUpdate=shadow;renderer.xr.enabled=xr;
    }
  }
  dispose(){this.setWorld(null);this.target?.dispose();this.target=null;}
}
