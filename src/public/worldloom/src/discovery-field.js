import * as THREE from '../vendor/three.module.min.js';
import { DISCOVERY_ASSETS } from './discovery-assets.js';

export function discoveryGeometry(kind) {
  const data=DISCOVERY_ASSETS[kind],geometry=new THREE.BufferGeometry();
  for(const name of ['position','normal','color'])geometry.setAttribute(name,new THREE.Float32BufferAttribute(data[name],3));
  geometry.computeBoundingSphere();return geometry;
}

export class LandDiscoveryField {
  constructor(scene){
    this.scene=scene;this.world=null;this.timer=0;this.meshes=new Map();
    this.geometries=new Map(Object.keys(DISCOVERY_ASSETS).map(kind=>[kind,discoveryGeometry(kind)]));
    this.material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.88});
  }
  setWorld(world){
    if(this.world)this.world.discoveryCollisionEnabled=false;
    for(const mesh of this.meshes.values())mesh.removeFromParent();this.meshes.clear();
    this.world=world;this.timer=0;if(world)world.discoveryCollisionEnabled=true;
  }
  update(dt,focus,viewDistance=4){
    if(!this.world||!focus)return;
    this.timer-=dt;if(this.timer>0)return;this.timer=.35;
    const visible=new Set();
    for(const d of this.world.getLandDiscoveriesNear(focus.x,focus.z,Math.min(128,viewDistance*16+12))){
      if(!this.world.landDiscoveryIsLive(d))continue;
      if([[-4,-4],[4,4],[-4,4],[4,-4]].some(([dx,dz])=>!this.world.isPositionRendered(d.x+dx,d.z+dz)))continue;
      visible.add(d.key);
      if(!this.meshes.has(d.key)){
        const mesh=new THREE.Mesh(this.geometries.get(d.kind),this.material);
        mesh.position.set(d.x+.5,d.y,d.z+.5);mesh.rotation.y=d.yaw;
        mesh.name=d.name;mesh.castShadow=true;mesh.receiveShadow=true;
        // Terrain/chest targeting stays with the voxel raycaster.
        mesh.raycast=()=>{};this.scene?.add(mesh);this.meshes.set(d.key,mesh);
      }
    }
    for(const [key,mesh]of this.meshes)if(!visible.has(key)){mesh.removeFromParent();this.meshes.delete(key);}
  }
  dispose(){this.setWorld(null);for(const geometry of this.geometries.values())geometry.dispose();this.material.dispose();}
}
