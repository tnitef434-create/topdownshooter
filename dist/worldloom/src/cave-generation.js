import { hash2D, valueNoise2D, valueNoise3D } from './noise.js';

// Version 3: intersecting, domain-warped 3D noise fields. There is no graph of
// junctions or repeating tunnel section. Broad chambers merge into narrower
// passages at different elevations, leaving natural pillars and rock bridges.
export class CaveField {
  constructor(seed) { this.seed=seed;this.samples=new Map();this.mouths=new Map(); }
  densityAt(x,y,z) {
    const s=this.seed;
    const warp=valueNoise3D(x/43,y/37,z/43,s^0x1679)*12-6;
    const a=valueNoise3D((x+warp)/22,y/17,(z-warp)/22,s^0x3671)-.5;
    const b=valueNoise3D((x-warp)/27,y/23,(z+warp)/27,s^0x6429)-.5;
    const width=.067+valueNoise3D(x/54,y/38,z/54,s^0x4271)*.055;
    const passage=1-Math.sqrt((a/width)**2+(b/(width*1.2))**2);
    const chamber=(valueNoise3D((x+warp)/34,y/19,(z+warp)/34,s^0x9917)-.675)*8;
    return Math.max(passage,chamber);
  }
  lattice(x,y,z) {
    const key=`${x},${y},${z}`;
    let value=this.samples.get(key);
    if(value===undefined){
      value=this.densityAt(x*2,y*2,z*2);
      // Bounded, deterministic cache: eviction cannot change generation.
      if(this.samples.size>=160000)this.samples.clear();
      this.samples.set(key,value);
    }
    return value;
  }
  density(x,y,z) {
    const ix=Math.floor(x/2),iy=Math.floor(y/2),iz=Math.floor(z/2);
    const tx=x/2-ix,ty=y/2-iy,tz=z/2-iz;
    let value=0;
    for(let dz=0;dz<2;dz++)for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++) {
      const weight=(dx?tx:1-tx)*(dy?ty:1-ty)*(dz?tz:1-tz);
      if(weight)value+=this.lattice(ix+dx,iy+dy,iz+dz)*weight;
    }
    return value;
  }
  mouth(cx,cz,surfaceAt) {
    const key=`${cx},${cz}`;
    if(this.mouths.has(key))return this.mouths.get(key);
    const h=salt=>hash2D(cx,cz,this.seed^salt);
    const x=(cx+.2+h(123)*.6)*96,z=(cz+.2+h(456)*.6)*96;
    const surface=surfaceAt(x,z);
    let points=[];
    if(h(77)<.7&&surface>35){
      let px=x,pz=z,py=surface-.9,angle=h(908)*Math.PI*2;
      const count=28+Math.floor(h(618)*13);
      for(let i=0;i<count;i++){
        const t=i/(count-1);
        angle+=(valueNoise2D(i*.13,cx+cz,this.seed^997)-.5)*.37;
        // An uneven, gently descending mouth becomes a winding passage. Its
        // floor is independent of the terrain column being queried.
        const radius=2.4+h(21)*1.4+Math.sin(i*.43+h(23)*6)*.55;
        points.push({x:px,y:py,z:pz,radius,verticalRadius:radius*(.82+.15*Math.sin(i*.19))});
        px+=Math.cos(angle)*1.3;pz+=Math.sin(angle)*1.3;
        py=Math.max(7,py-(.5+.2*Math.sin(i*.27+h(31)*6)));
      }
    }
    if(this.mouths.size>2048)this.mouths.clear();
    this.mouths.set(key,points);return points;
  }
  column(x,z,surface,surfaceAt) {
    const entrances=[];const cx=Math.floor(x/96),cz=Math.floor(z/96);
    if(surface>33)for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){
      for(const p of this.mouth(cx+dx,cz+dz,surfaceAt)){
        const distance=Math.hypot(x-p.x,z-p.z);
        if(distance<p.radius+1)entrances.push({...p,distance,centerY:p.y});
      }
    }
    const caveMouth=entrances.some(p=>((surface-p.y)/p.verticalRadius)**2+(p.distance/p.radius)**2<1);
    return {tunnels:[],chambers:[],fissure:null,entrances,caveMouth,mouthStrength:caveMouth?1:0};
  }
  isCave(x,y,z,surface,info) {
    if(y<=2||y>surface)return false;
    // Seal sea floors and pond basins; a cave never drains a surface reservoir.
    if(surface<=33&&y>surface-5)return false;
    if(Number.isFinite(info.pondWaterLevel)&&y>surface-5)return false;
    for(const p of info.caveEntrances||[]){
      const q=(p.distance/p.radius)**2+((y-p.centerY)/p.verticalRadius)**2;
      if(q<1+Math.sin(x*.73+y*.59+z*.47)*.11)return true;
    }
    const roof=surface-y;
    if(roof<4)return false;
    const boundary=Math.max(0,(7-roof)/5)+Math.max(0,(6-y)/4);
    return this.density(x,y,z)>boundary;
  }
  liquid(y) {
    // A continuous water table has one level across chunk boundaries, and
    // cannot leave isolated water cubes on a steep cave wall.
    if(y<=12)return 'water';
    return null;
  }
}
