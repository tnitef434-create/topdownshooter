import * as THREE from '../vendor/three.module.min.js';
import { BLOCK } from './blocks.js';
import { MUSHROOM_MESH } from './water-nature-data.js';
import { hasPlantGround,selectStablePlants } from './plant-visibility.js';

export class MushroomField {
  constructor(scene){
    const geometry=new THREE.BufferGeometry();
    for(const key of ['position','normal','color'])geometry.setAttribute(key,new THREE.Float32BufferAttribute(MUSHROOM_MESH[key],3));
    geometry.computeBoundingSphere();
    const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.88,transparent:false,depthWrite:true});
    this.mesh=new THREE.InstancedMesh(geometry,material,240);this.mesh.name='Blender solid button mushrooms';
    this.mesh.count=0;this.mesh.visible=false;this.mesh.castShadow=true;this.mesh.receiveShadow=true;this.mesh.frustumCulled=false;
    this.mesh.raycast=()=>{};scene?.add(this.mesh);this.world=null;this.items=[];this.timer=0;this.dummy=new THREE.Object3D();
  }
  setWorld(world){this.world=world;this.items=[];this.timer=0;this.mesh.count=0;this.mesh.visible=false;}
  update(dt,focus){
    if(!this.world||!focus)return;this.timer-=dt;if(this.timer>0)return;this.timer=.42;
    const found=[],size=this.world.chunkSize||16,layer=size*size;
    for(const chunk of this.world.chunks?.values()||[]){
      const ox=chunk.cx*size,oz=chunk.cz*size;
      if(Math.hypot(ox+size*.5-focus.x,oz+size*.5-focus.z)>38)continue;
      const blocks=chunk.blocks||chunk.data;if(!blocks)continue;
      for(let index=blocks.indexOf(BLOCK.GLOW_MUSHROOM);index>=0;index=blocks.indexOf(BLOCK.GLOW_MUSHROOM,index+1)){
        const y=Math.floor(index/layer),z=oz+Math.floor(index%layer/size),x=ox+index%size;
        const distanceSq=(x+.5-focus.x)**2+(z+.5-focus.z)**2+(y-focus.y)**2;
        if(distanceSq>32**2||!hasPlantGround(this.world,x,z))continue;
        found.push({x,y,z,distanceSq});
      }
    }
    this.items=selectStablePlants(found,this.items,240);
    this.items.forEach((p,i)=>{
      this.dummy.position.set(p.x+.5,p.y,p.z+.5);this.dummy.rotation.set(0,Math.sin(p.x*13.1+p.z*9.7+p.y)*Math.PI,0);this.dummy.scale.setScalar(1);
      this.dummy.updateMatrix();this.mesh.setMatrixAt(i,this.dummy.matrix);
    });
    this.mesh.count=this.items.length;this.mesh.visible=this.items.length>0;this.mesh.instanceMatrix.needsUpdate=true;
  }
  dispose(){this.setWorld(null);this.mesh.removeFromParent();this.mesh.geometry.dispose();this.mesh.material.dispose();}
}
