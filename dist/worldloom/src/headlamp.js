import * as THREE from '../vendor/three.module.min.js';
import { HEADLAMP,HEADLAMP_OPTICS } from './cave-assets.js';
import { caveAssetGeometry } from './cave-plants.js';

export function createHeadlampModel(){
  const mesh=new THREE.Mesh(caveAssetGeometry(HEADLAMP),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.48,metalness:.25}));
  mesh.name='Blender wearable headlamp';mesh.userData.authoredIn='Blender';return mesh;
}

/** A permanent, shadowed light attached just above the camera's eyes. */
export class Headlamp {
  constructor(scene){
    const p=HEADLAMP_OPTICS;
    this.light=new THREE.SpotLight(0xfff2d9,0,p.distance,p.angle,p.penumbra,p.decay);
    this.light.name='Permanent headlamp';this.light.castShadow=true;
    this.light.shadow.mapSize.set(1024,1024);this.light.shadow.camera.near=.06;
    this.light.shadow.bias=-.00008;this.light.shadow.normalBias=.018;this.light.shadow.radius=2;
    this.light.target.name='Headlamp aim';scene?.add(this.light,this.light.target);this.enabled=false;
  }
  setQuality(profile={}){
    const size=profile.postProcessing===false?512:1024;
    if(this.light.shadow.mapSize.x!==size){this.light.shadow.map?.dispose();this.light.shadow.map=null;this.light.shadow.mapSize.set(size,size);}
  }
  update(position,direction,enabled){
    this.enabled=Boolean(enabled&&position&&direction);
    this.light.intensity=this.enabled?HEADLAMP_OPTICS.intensity:0;
    this.light.visible=this.enabled;
    if(!this.enabled)return;
    this.light.position.copy(position).addScaledVector(direction,.025);this.light.position.y+=.09;
    this.light.target.position.copy(position).addScaledVector(direction,12);this.light.target.updateMatrixWorld();
  }
  dispose(){this.light.removeFromParent();this.light.target.removeFromParent();this.light.dispose();}
}
