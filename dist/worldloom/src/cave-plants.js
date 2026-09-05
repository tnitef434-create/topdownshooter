import * as THREE from '../vendor/three.module.min.js';
import { BLOCK } from './blocks.js';
import { WOODLAND_FERN,CAVE_FERN,CAVE_VINE } from './cave-assets.js';
import { hasPlantGround,selectStablePlants } from './plant-visibility.js';

export function caveAssetGeometry(data){
  const geometry=new THREE.BufferGeometry();
  for(const key of ['position','normal','color'])geometry.setAttribute(key,new THREE.Float32BufferAttribute(data[key],3));
  geometry.computeBoundingSphere();return geometry;
}

export class CavePlantField {
  constructor(scene){
    this.world=null;this.timer=0;this.time={value:0};this.strength={value:1};this.dummy=new THREE.Object3D();this.fields=[];
    for(const [id,data,limit] of [[BLOCK.FERN,WOODLAND_FERN,320],[BLOCK.CAVE_FERN,CAVE_FERN,220],[BLOCK.CAVE_VINE,CAVE_VINE,180]]){
      const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.86,side:THREE.DoubleSide});
      const mesh=new THREE.InstancedMesh(caveAssetGeometry(data),material,limit);
      const bend=`uniform float fernTime;uniform float fernStrength;
        vec3 fernBend(vec3 p){
          vec3 root=(modelMatrix*instanceMatrix*vec4(0.,0.,0.,1.)).xyz;
          float h=abs(p.y),w=h*h;
          float phase=dot(root.xz,vec2(.37,.29));
          float gust=sin(phase*.21-fernTime*.7);
          float breeze=(.55+gust*.3+sin(phase-fernTime*1.3)*.15)*${id===BLOCK.FERN?'.13':'.022'};
          return vec3(breeze*w,sin(fernTime*1.1+phase+p.x*9.)*w*.009,breeze*w*.37)*fernStrength;
        }`;
      const patch=shader=>{
        shader.uniforms.fernTime=this.time;shader.uniforms.fernStrength=this.strength;shader.vertexShader=bend+'\n'+shader.vertexShader;
        shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed+=fernBend(position);');
        shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nvec3 slope=(fernBend(position+vec3(0.,.01,0.))-fernBend(position))/.01;\nobjectNormal.y-=dot(objectNormal.xz,slope.xz);');
      };
      material.onBeforeCompile=patch;material.customProgramCacheKey=()=>`blender-fern-${id}-v1`;
      mesh.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});
      mesh.customDepthMaterial.onBeforeCompile=patch;mesh.customDepthMaterial.customProgramCacheKey=material.customProgramCacheKey;
      mesh.name=`Blender ${id===BLOCK.FERN?'woodland fern':id===BLOCK.CAVE_FERN?'cave fern':'hanging cave vine'}`;
      mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;mesh.count=0;mesh.visible=false;mesh.raycast=()=>{};
      scene?.add(mesh);this.fields.push({id,mesh,limit,activeLimit:limit,items:[]});
    }
  }
  setWorld(world){this.world=world;this.timer=0;for(const f of this.fields){f.items=[];f.mesh.count=0;f.mesh.visible=false;}}
  setQuality(profile={},reducedMotion=false){this.strength.value=reducedMotion?.2:1;for(const f of this.fields)f.activeLimit=Math.round(f.limit*(profile.postProcessing===false?.5:1));this.timer=0;}
  update(dt,focus){
    this.time.value+=Math.min(.1,Math.max(0,dt));if(!this.world||!focus)return;
    this.timer-=dt;if(this.timer>0)return;this.timer=.5;
    const size=this.world.chunkSize||16,layer=size*size,found=new Map(this.fields.map(f=>[f.id,[]]));
    for(const chunk of this.world.chunks?.values()||[]){
      const ox=chunk.cx*size,oz=chunk.cz*size;
      if(Math.hypot(ox+8-focus.x,oz+8-focus.z)>46)continue;
      const blocks=chunk.blocks||chunk.data;if(!blocks)continue;
      for(const f of this.fields)for(let i=blocks.indexOf(f.id);i>=0;i=blocks.indexOf(f.id,i+1)){
        const entries=found.get(f.id);
        const x=ox+i%size,y=Math.floor(i/layer),z=oz+Math.floor(i%layer/size);
        const distanceSq=(x+.5-focus.x)**2+(y-focus.y)**2+(z+.5-focus.z)**2;
        if(distanceSq<38**2&&hasPlantGround(this.world,x,z))entries.push({x,y,z,distanceSq});
      }
    }
    for(const f of this.fields){
      f.items=selectStablePlants(found.get(f.id),f.items,f.activeLimit);
      f.items.forEach((p,i)=>{
        this.dummy.position.set(p.x+.5,p.y+(f.id===BLOCK.CAVE_VINE?1:0),p.z+.5);
        this.dummy.rotation.set(0,Math.sin(p.x*13.1+p.z*7.3+p.y)*Math.PI,0);
        this.dummy.scale.setScalar(.86+Math.sin(p.x*17+p.z*31)**2*.2);this.dummy.updateMatrix();f.mesh.setMatrixAt(i,this.dummy.matrix);
      });
      f.mesh.count=f.items.length;f.mesh.visible=f.items.length>0;f.mesh.instanceMatrix.needsUpdate=true;
    }
  }
  dispose(){this.setWorld(null);for(const f of this.fields){f.mesh.removeFromParent();f.mesh.geometry.dispose();f.mesh.material.dispose();f.mesh.customDepthMaterial.dispose();}}
}
