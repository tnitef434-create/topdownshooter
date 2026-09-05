import * as THREE from '../vendor/three.module.min.js';
import { BLOCK } from './blocks.js';
import { SEA_LIFE_MESHES } from './sea-life-meshes.js';
import { hasPlantGround } from './plant-visibility.js';

const SPECIES = ['Silver_Dart', 'Amber_Bream', 'Reef_Wrasse'];
const MAX_PLANTS = 360, MAX_FISH = 36;
const TAU = Math.PI * 2;
const clamp = THREE.MathUtils.clamp;
const hash = (x, z, seed = 0) => {
  let n = Math.imul(x ^ seed, 0x45d9f3b) ^ Math.imul(z, 0x27d4eb2d);
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
};

// Habitat is tied to actual, visible submerged ground. Dirty terrain continues
// displaying its previous mesh; bites/edits never blink unrelated vegetation.
export function seagrassBed(world, x, z) {
  if (!world || !hasPlantGround(world, x, z)) return null;
  const bx = Math.floor(x), bz = Math.floor(z), base = world.terrainHeight(bx, bz);
  const sea = world.seaLevel ?? 32;
  if (!Number.isFinite(base) || base > sea - 2 || base < sea - 14) return null;
  for (let y = Math.min(base + 2, sea - 2); y >= base - 2; y--) {
    const id = world.getBlock(bx, y, bz);
    if (![BLOCK.SAND, BLOCK.LOAM, BLOCK.TURF].includes(id)) continue;
    let submerged = true;
    for (let wy = y + 1; wy <= sea; wy++) {
      if (world.getBlock(bx, wy, bz) !== BLOCK.WATER) { submerged = false; break; }
    }
    if (submerged) return { x, y: y + 1, z, surface: sea + .85 };
  }
  return null;
}

export function fishHasWater(world, position, radius = .23) {
  if (!world || !hasPlantGround(world, position.x, position.z)) return false;
  for (const [dx, dy, dz] of [[0,0,0], [radius,0,0], [-radius,0,0], [0,.13,0], [0,-.13,0], [0,0,radius], [0,0,-radius]]) {
    const x=Math.floor(position.x+dx), y=Math.floor(position.y+dy), z=Math.floor(position.z+dz);
    if (world.getBlock(x,y,z) !== BLOCK.WATER) return false;
    const surface=world.getFluidSurfaceY?.(x,y,z);
    if(surface!=null && position.y+dy>surface-.025) return false;
  }
  return true;
}

export function seaCurrent(x, z, time, motion = 1) {
  // A shared slow swell travels across the whole bed, plus smaller local eddies.
  return {
    x: (.12 * Math.sin(time * .78 - x * .15 - z * .11) + .045 * Math.sin(time * 1.41 + z * .39)) * motion,
    z: (.075 * Math.cos(time * .69 - x * .12 - z * .19) + .025 * Math.sin(time * 1.73 + x * .31)) * motion,
  };
}

function geometry(data) {
  const result = new THREE.BufferGeometry();
  for (const [name, size] of [['position',3], ['normal',3], ['color',3], ['motion',4]]) {
    result.setAttribute(name, new THREE.Float32BufferAttribute(data[name], size));
  }
  result.computeBoundingSphere();
  return result;
}

function instances(geometry, material, count, name, scene) {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.name = name;
  mesh.userData = { authoredIn: 'Blender', damageable: false, decorative: true };
  // These meshes never enter the combat registry or voxel inventory.
  mesh.raycast = () => {};
  mesh.count = 0; mesh.visible = false; mesh.frustumCulled = false;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene?.add(mesh);
  return mesh;
}

const plantData = SEA_LIFE_MESHES.Ribbon_Seagrass.position;
const tallest = Math.max(...plantData.filter((_, i) => i % 3 === 1));
const tips = [];
for (let i = 0; i < plantData.length; i += 3) if (Math.abs(plantData[i + 1] - tallest) < .00001) tips.push(new THREE.Vector3(...plantData.slice(i,i + 3)));
const tipLocal = tips.reduce((sum, tip) => sum.add(tip), new THREE.Vector3()).divideScalar(tips.length);
const tipWeight = (tipLocal.y / .93) ** 2;
export function seagrassTip(plant, target = new THREE.Vector3()) {
  return target.set(
    plant.x + tipLocal.x * plant.scale + plant.bend.x * tipWeight,
    plant.y + tipLocal.y * plant.scale,
    plant.z + tipLocal.z * plant.scale + plant.bend.z * tipWeight,
  );
}

export class SeaLifeField {
  constructor(scene) {
    this.world = null; this.time = 0; this.scanTimer = 0;
    this.plants = []; this.fish = []; this.patchLimit = 18; this.fishLimit = 30;
    this.pondHomes = [];
    this.reducedMotion = false; this.bites = 0;
    this.uniforms = { time: { value: 0 } };
    this.dummy = new THREE.Object3D();
    this.direction = new THREE.Vector3(); this.candidate = new THREE.Vector3();
    this.plantMesh = this._makePlants(scene);
    this.fishMeshes = SPECIES.map((name, index) => this._makeFish(name, index, scene));
  }

  _makePlants(scene) {
    const geo = geometry(SEA_LIFE_MESHES.Ribbon_Seagrass);
    geo.setAttribute('plantBend', new THREE.InstancedBufferAttribute(new Float32Array(MAX_PLANTS * 2),2).setUsage(THREE.DynamicDrawUsage));
    const material = new THREE.MeshStandardMaterial({ vertexColors:true, roughness:.85, side:THREE.DoubleSide });
    material.onBeforeCompile = shader => {
      shader.vertexShader = 'attribute vec2 plantBend;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        float rooted = pow(clamp(position.y / .93, 0., 1.), 2.);
        transformed.xz += plantBend * rooted;
      `).replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
        objectNormal.y -= dot(objectNormal.xz, plantBend) * 2. * max(position.y, 0.) / (.93 * .93);
        objectNormal = normalize(objectNormal);
      `);
    };
    material.customProgramCacheKey = () => 'rooted-seagrass-current-v1';
    return instances(geo,material,MAX_PLANTS,'Blender rooted ribbon seagrass',scene);
  }

  _makeFish(name, species, scene) {
    const geo = geometry(SEA_LIFE_MESHES[name]);
    geo.setAttribute('swim', new THREE.InstancedBufferAttribute(new Float32Array(MAX_FISH * 4),4).setUsage(THREE.DynamicDrawUsage));
    const material = new THREE.MeshStandardMaterial({ vertexColors:true, roughness:.48, metalness:.05, side:THREE.DoubleSide });
    material.onBeforeCompile = shader => {
      shader.uniforms.seaTime = this.uniforms.time;
      shader.vertexShader = 'attribute vec4 motion; attribute vec4 swim; uniform float seaTime;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        float rear = motion.x * motion.x;
        float wave = swim.x - motion.x * 2.8;
        transformed.z += sin(wave) * rear * swim.y;
        transformed.z += motion.y * motion.z * sin(swim.x * 1.7) * .008;
        transformed.y += motion.y * cos(swim.x * 1.7) * .007;
        transformed.y -= motion.w * swim.z * (.0025 + .0025 * sin(seaTime * 19.));
      `).replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
        float slope = swim.y * (2. * motion.x * sin(swim.x - motion.x * 2.8) - 2.8 * motion.x * motion.x * cos(swim.x - motion.x * 2.8)) / -.19;
        objectNormal.x -= objectNormal.z * slope;
        objectNormal = normalize(objectNormal);
      `);
    };
    material.customProgramCacheKey = () => 'speed-linked-fish-swim-v1';
    return instances(geo,material,MAX_FISH,`Blender protected ${name}`,scene);
  }

  setWorld(world) {
    if (this.world === world) return;
    this.world = world; this.time = 0; this.scanTimer = 0; this.bites = 0;
    this.plants = []; this.fish = []; this.pondHomes = [];
    for (const mesh of [this.plantMesh,...this.fishMeshes]) { mesh.count = 0; mesh.visible = false; }
  }

  setQuality(profile = {}, reducedMotion = false) {
    const detail = clamp(profile.atmosphereDetail ?? .7,0,1);
    this.patchLimit = Math.round(8 + detail * 16);
    this.fishLimit = Math.round(12 + detail * 24);
    this.reducedMotion = Boolean(reducedMotion);
    this.scanTimer = 0;
  }

  _scan(focus) {
    const seed = this.world.seed || 0, patches = [];
    const oldPlants = new Map(this.plants.map(p => [p.key,p]));
    const oldPatches = new Set(this.plants.map(p => p.patch));
    for (let cz = Math.floor(focus.z / 6) - 5; cz <= Math.floor(focus.z / 6) + 5; cz++) {
      for (let cx = Math.floor(focus.x / 6) - 5; cx <= Math.floor(focus.x / 6) + 5; cx++) {
        if (hash(cx,cz,seed ^ 113) > .56) continue;
        const x = cx * 6 + 1.5 + hash(cx,cz,seed ^ 219) * 3;
        const z = cz * 6 + 1.5 + hash(cx,cz,seed ^ 307) * 3;
        const distance = Math.hypot(x - focus.x,z - focus.z), key = `${cx},${cz}`;
        if (distance > 30 || !seagrassBed(this.world,x,z)) continue;
        patches.push({x,z,cx,cz,key,score:distance - (oldPatches.has(key) ? 5 : 0)});
      }
    }
    patches.sort((a,b) => a.score - b.score);
    const plants = [];
    for (const patch of patches.slice(0,this.patchLimit)) {
      for (let i = 0; i < 15; i++) {
        const angle = i * 2.399963, radius = .25 + Math.sqrt(i / 14) * 1.65;
        const x = patch.x + Math.cos(angle) * radius, z = patch.z + Math.sin(angle) * radius;
        const bed = seagrassBed(this.world,x,z);
        if (!bed) continue;
        const key = `${patch.key}:${i}`, old = oldPlants.get(key);
        plants.push(old && old.y === bed.y ? old : { ...bed, key, patch:patch.key,
          scale:.65 + hash(patch.cx + i,patch.cz,seed ^ 511) * .4,
          bend:{x:0,z:0}, bendVelocity:{x:0,z:0}, wake:0 });
      }
    }
    this.plants = plants.slice(0,MAX_PLANTS);
    // Ponds have their own open-water homes. They need no seagrass and never
    // enter the leaf-feeding state used by the ocean habitat.
    this.pondHomes=[];
    for(const pond of this.world.getPondsNear?.(focus.x,focus.z,30)||[]) {
      if(Math.hypot(pond.centerX-focus.x,pond.centerZ-focus.z)>30)continue;
      for(let i=0;i<3;i++) {
        const angle=i*TAU/3+(pond.phase||0);
        const x=pond.centerX+Math.cos(angle)*Math.min(1.6,pond.radiusX*.25);
        const z=pond.centerZ+Math.sin(angle)*Math.min(1.6,pond.radiusZ*.25);
        const y=pond.waterY+.38;
        if(!fishHasWater(this.world,{x,y,z}))continue;
        this.pondHomes.push({x,y,z,key:`pond:${pond.id}:${i}`,patch:`pond:${pond.id}`,habitat:'pond',
          surface:this.world.getFluidSurfaceY?.(Math.floor(x),pond.waterY,Math.floor(z))??pond.waterY+.9,
          species:i,phase:angle});
      }
    }
    const homes = new Map([...this.plants,...this.pondHomes].map(p => [p.key,p]));
    const residents=this.fish.filter(f => homes.has(f.home.key) && fishHasWater(this.world,f.position));
    this.fish=[...residents.filter(f=>f.home.habitat==='pond'),
      ...residents.filter(f=>f.home.habitat!=='pond').slice(0,Math.max(0,this.fishLimit-this.pondHomes.length))].slice(0,this.fishLimit);
    for (const fish of this.fish) fish.home = homes.get(fish.home.key);
    for(const home of this.pondHomes) {
      if(this.fish.length>=this.fishLimit||this.fish.some(f=>f.home.key===home.key))continue;
      const position=new THREE.Vector3(home.x,home.y,home.z),phase=home.phase;
      this.fish.push({home,position,velocity:new THREE.Vector3(),target:position.clone(),species:home.species,
        scale:.85,yaw:phase,pitch:0,phase,identityPhase:phase,speed:0,state:'roam',timer:2,age:0,
        cycle:0,feedAge:0,bites:0,damageable:false});
    }
    for (const patch of patches.slice(0,this.patchLimit)) {
      const patchPlants = this.plants.filter(p => p.patch === patch.key);
      if (patchPlants.length < 5) continue;
      const residents = this.fish.filter(f => f.home.patch === patch.key).length;
      for (let i = residents; i < 2 && this.fish.length < this.fishLimit; i++) {
        const home = patchPlants[Math.floor(hash(patch.cx + i,patch.cz,seed ^ 761) * patchPlants.length)];
        const position = new THREE.Vector3(home.x + .35,home.y + 1.1,home.z + .35);
        if (!fishHasWater(this.world,position)) continue;
        const phase = hash(patch.cx + i,patch.cz,seed ^ 997) * TAU;
        this.fish.push({ home, position, velocity:new THREE.Vector3(), target:position.clone(),
          species:Math.floor(hash(patch.cx + i,patch.cz,seed ^ 313) * 3), scale:.82 + hash(i,patch.cx,seed ^ 419) * .23,
          yaw:phase, pitch:0, phase, identityPhase:phase, speed:0, state:'roam', timer:1 + i, age:0,
          cycle:0, feedAge:0, bites:0, damageable:false });
      }
    }
  }

  _chooseTarget(fish) {
    const phase = fish.identityPhase + ++fish.cycle * 2.399963;
    for (let attempt = 0; attempt < 8; attempt++) {
      const angle = phase + attempt * .8, radius = 1 + (attempt % 3) * .45;
      this.candidate.set(fish.home.x + Math.cos(angle) * radius,
        fish.home.habitat==='pond' ? fish.home.y + .16*Math.sin(phase*1.7) : fish.home.y + .8 + .35 * Math.sin(phase * 1.7),fish.home.z + Math.sin(angle) * radius);
      if (fishHasWater(this.world,this.candidate)) { fish.target.copy(this.candidate); return; }
    }
    fish.target.copy(fish.position);
  }

  _updateFish(fish, dt, focus) {
    fish.age += dt; fish.timer -= dt;
    if (fish.timer <= 0) {
      if (fish.home.habitat==='pond') { fish.state='roam';fish.timer=4+fish.species;this._chooseTarget(fish); }
      else if (fish.state === 'feed') { fish.state = 'roam'; fish.timer = 6 + fish.species; this._chooseTarget(fish); }
      else if (fish.state === 'approach') { fish.state = 'roam'; fish.timer = 3; this._chooseTarget(fish); }
      else { fish.state = 'approach'; fish.timer = 12; }
    }
    const tip = fish.home.habitat==='pond' ? null : seagrassTip(fish.home, this.candidate);
    if (fish.state === 'approach' || fish.state === 'feed') {
      const approach = fish.identityPhase + fish.species * 1.2;
      // The nose, rather than the body centre, meets the moving leaf tip.
      fish.target.set(tip.x + Math.cos(approach) * .16,tip.y + .035,tip.z + Math.sin(approach) * .16);
      if (fish.state === 'approach' && fish.position.distanceTo(fish.target) < .12) {
        fish.state = 'feed'; fish.timer = 2.4; fish.feedAge = 0;
      }
    }
    const fear = fish.position.distanceTo(focus) < 1.5;
    if (fear && fish.state !== 'roam') { fish.state = 'roam'; fish.timer = 4; this._chooseTarget(fish); }
    let distance = fish.position.distanceTo(fish.target);
    if (fish.state === 'roam' && (distance < .22 || fish.age < dt * 1.5)) this._chooseTarget(fish);
    this.direction.subVectors(fish.target,fish.position);
    distance = this.direction.length();
    if (distance > .0001) this.direction.divideScalar(distance);
    if (fish.state === 'roam') {
      for (const other of this.fish) {
        if (other === fish) continue;
        const d2 = fish.position.distanceToSquared(other.position);
        if (d2 > .0001 && d2 < .5 ** 2) this.direction.addScaledVector(this.candidate.subVectors(fish.position,other.position),.09 / d2);
      }
      this.direction.normalize();
    }
    const desiredSpeed = fish.state === 'feed' ? Math.min(.14,distance * 3) : Math.min(fear ? .9 : .44 + fish.species * .055,distance * 1.8);
    const desiredYaw = fish.state === 'feed'
      ? Math.atan2(fish.position.z - tip.z,tip.x - fish.position.x)
      : Math.atan2(-this.direction.z,this.direction.x);
    const turn = Math.atan2(Math.sin(desiredYaw - fish.yaw),Math.cos(desiredYaw - fish.yaw));
    fish.yaw += clamp(turn,-dt * 2.8,dt * 2.8);
    const desiredPitch = Math.asin(clamp(this.direction.y,-.7,.7));
    fish.pitch += (desiredPitch - fish.pitch) * (1 - Math.exp(-dt * 5));
    const speedTarget = desiredSpeed * Math.max(.18,Math.cos(turn));
    fish.speed += (speedTarget - fish.speed) * (1 - Math.exp(-dt * 4));
    fish.velocity.set(Math.cos(fish.yaw) * Math.cos(fish.pitch),Math.sin(fish.pitch),-Math.sin(fish.yaw) * Math.cos(fish.pitch)).multiplyScalar(fish.speed);
    if (fish.state === 'feed') fish.velocity.copy(this.direction).multiplyScalar(desiredSpeed);
    this.candidate.copy(fish.position).addScaledVector(fish.velocity,dt);
    if (fishHasWater(this.world,this.candidate) && Math.hypot(this.candidate.x - fish.home.x,this.candidate.z - fish.home.z) < 3.3) {
      fish.position.copy(this.candidate);
    } else {
      fish.speed *= Math.exp(-dt * 12); fish.velocity.set(0,0,0);
      fish.state = 'roam'; fish.timer = 2; this._chooseTarget(fish);
    }
    if (fish.state === 'feed') {
      // Feeding only progresses while the mouth remains at the actual moving leaf.
      const tip = seagrassTip(fish.home,this.candidate);
      const mouth = this.direction.set(Math.cos(fish.yaw) * .15,0,-Math.sin(fish.yaw) * .15).add(fish.position);
      if (mouth.distanceTo(tip) < .22) {
        const previous = Math.floor(fish.feedAge / .48);
        fish.feedAge += dt;
        if (Math.floor(fish.feedAge / .48) > previous) { fish.bites++; this.bites++; }
      }
    }
    // Slow stabilising fins when hovering, faster tail beats during acceleration.
    fish.phase += dt * TAU * (.85 + fish.speed * 4.2);
  }

  _updatePlants(dt) {
    const bend = this.plantMesh.geometry.attributes.plantBend;
    for (let i = 0; i < this.plants.length; i++) {
      const p = this.plants[i], current = seaCurrent(p.x,p.z,this.time,this.reducedMotion ? .35 : 1);
      let tx = current.x, tz = current.z;
      p.wake = 0;
      for (const fish of this.fish) {
        const dx = p.x - fish.position.x, dz = p.z - fish.position.z;
        const d2 = dx * dx + dz * dz, vertical = fish.position.y - p.y;
        if (d2 > 1.2 ** 2 || vertical > 1.6 || vertical < 0) continue;
        const influence = Math.exp(-d2 * 3.5) * (this.reducedMotion ? .35 : 1);
        tx += fish.velocity.x * influence * .20;
        tz += fish.velocity.z * influence * .20;
        p.wake += fish.speed * influence;
        if (fish.state === 'feed' && fish.home === p && fish.feedAge > 0) {
          const tug = Math.sin(fish.feedAge * TAU / .48) * .038;
          tx += Math.cos(fish.yaw) * tug; tz -= Math.sin(fish.yaw) * tug;
        }
      }
      // Damped flexible stems respond to the wake and settle back into the swell.
      for (const [axis,target] of [['x',tx],['z',tz]]) {
        p.bendVelocity[axis] += ((target - p.bend[axis]) * 26 - p.bendVelocity[axis] * 8) * dt;
        p.bend[axis] = clamp(p.bend[axis] + p.bendVelocity[axis] * dt,-.38,.38);
      }
      this.dummy.position.set(p.x,p.y,p.z); this.dummy.rotation.set(0,0,0); this.dummy.scale.setScalar(p.scale); this.dummy.updateMatrix();
      this.plantMesh.setMatrixAt(i,this.dummy.matrix);
      bend.setXY(i,p.bend.x / p.scale,p.bend.z / p.scale);
    }
    bend.needsUpdate = true;
    this.plantMesh.count = this.plants.length; this.plantMesh.visible = this.plants.length > 0;
    this.plantMesh.instanceMatrix.needsUpdate = true;
  }

  _drawFish() {
    const counts = [0,0,0];
    for (const fish of this.fish) {
      const mesh = this.fishMeshes[fish.species], index = counts[fish.species]++;
      this.dummy.position.copy(fish.position);
      this.dummy.rotation.set(0,fish.yaw,fish.pitch,'YXZ');
      this.dummy.scale.setScalar(fish.scale); this.dummy.updateMatrix(); mesh.setMatrixAt(index,this.dummy.matrix);
      mesh.geometry.attributes.swim.setXYZW(index,fish.phase,(.006 + fish.speed * .036) * (this.reducedMotion ? .55 : 1),Number(fish.state === 'feed'),0);
    }
    for (let i = 0; i < 3; i++) {
      const mesh = this.fishMeshes[i];
      mesh.count = counts[i]; mesh.visible = counts[i] > 0;
      mesh.instanceMatrix.needsUpdate = true; mesh.geometry.attributes.swim.needsUpdate = true;
    }
  }

  update(dt, focus, context = {}) {
    if (!this.world || !focus || context.active === false) return;
    dt = clamp(Number(dt) || 0,0,.1);
    // Fixed maximum substep preserves steering/collision and flexible stems at low FPS.
    const steps = Math.max(1,Math.ceil(dt / (1 / 60))), step = dt / steps;
    this.scanTimer -= dt;
    if (this.scanTimer <= 0) { this._scan(focus); this.scanTimer = 2; }
    this.fish = this.fish.filter(f => fishHasWater(this.world,f.position));
    for (let i = 0; i < steps; i++) {
      this.time += step;
      for (const fish of this.fish) this._updateFish(fish,step,focus);
      this._updatePlants(step);
    }
    this.uniforms.time.value = this.time;
    this._drawFish();
  }

  getStats() {
    return { plants:this.plants.length, fish:this.fish.length, species:SPECIES.map((name,i) => ({name,count:this.fish.filter(f => f.species === i).length})),
      pondFish:this.fish.filter(f=>f.home.habitat==='pond').length,
      feeding:this.fish.filter(f => f.state === 'feed').length, bites:this.bites, draws:[this.plantMesh,...this.fishMeshes].filter(m => m.visible).length, damageable:false };
  }
  dispose() {
    this.setWorld(null);
    for (const mesh of [this.plantMesh,...this.fishMeshes]) { mesh.removeFromParent(); mesh.geometry.dispose(); mesh.material.dispose(); }
  }
}
