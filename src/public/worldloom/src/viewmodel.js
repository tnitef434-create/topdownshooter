import * as THREE from '../vendor/three.module.min.js';
import { BLOCKS } from './blocks.js';
import { getItem } from './data.js';
import { characterMesh } from './character-rig.js';

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.72,
    metalness: options.metalness ?? 0.04,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
    transparent: Boolean(options.transparent),
    opacity: options.opacity ?? 1,
    vertexColors: Boolean(options.vertexColors),
    depthTest: false,
    depthWrite: false,
  });
}

function atlasMaterial(atlas, tile, tint = 0xffffff) {
  const columns = atlas?.columns || 5;
  const rows = atlas?.rows || 5;
  const column = tile % columns;
  const row = Math.floor(tile / columns);
  const map = atlas.texture.clone();
  map.repeat.set(1 / columns, 1 / rows);
  map.offset.set(column / columns, 1 - (row + 1) / rows);
  map.magFilter = THREE.NearestFilter;
  map.minFilter = THREE.NearestFilter;
  map.needsUpdate = true;
  const result = material(tint, { roughness: 0.84 });
  result.map = map;
  result.alphaTest = 0.08;
  result.needsUpdate = true;
  return result;
}

function finishModel(group) {
  group.traverse((node) => {
    if (!node.isMesh) return;
    node.renderOrder = 1000;
    node.frustumCulled = false;
  });
  return group;
}

function makeBlockModel(block, atlas) {
  const geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
  const sideA = atlasMaterial(atlas, block.tiles.side, block.tint || 0xffffff);
  const sideB = atlasMaterial(atlas, block.tiles.side, block.tint || 0xffffff);
  const top = atlasMaterial(atlas, block.tiles.top, block.tint || 0xffffff);
  const bottom = atlasMaterial(atlas, block.tiles.bottom, block.tint || 0xffffff);
  const front = atlasMaterial(atlas, block.tiles.side, block.tint || 0xffffff);
  const back = atlasMaterial(atlas, block.tiles.side, block.tint || 0xffffff);
  const mesh = new THREE.Mesh(geometry, [sideA, sideB, top, bottom, front, back]);
  mesh.rotation.set(0.08, -0.72, 0.03);
  return finishModel(mesh);
}

function box(parent, size, position, color, rotation = [0, 0, 0], options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material(color, options));
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
}

function cylinder(parent, radius, height, position, color, rotation = [0, 0, 0], options = {}) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.9, height, 8), material(color, options));
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
}

function makeToolModel(item, held = false) {
  const group = new THREE.Group();
  const handleColor = 0x8c5b37;
  if (item.tool === 'pickaxe') {
    const tier = /copper/i.test(item.name) ? 'copper' : /stone/i.test(item.name) ? 'stone' : 'crude';
    const mesh = characterMesh(`${held ? 'held' : 'tool'}_${tier}_pick`, material(0xffffff, { vertexColors: true, roughness: .9 }));
    mesh.castShadow = false;
    group.add(mesh);
    group.name = `Blender pixel ${tier} pickaxe`;
    group.userData.authoredIn = 'Blender';
    group.userData.heldAssembly = held;
    group.position.set(0, -.03, 0);
    group.rotation.set(-.32,-.18,-.12);
    group.scale.setScalar(held ? .8 : .6);
    return finishModel(group);
  } else if (item.tool === 'axe') {
    cylinder(group, 0.031, 0.5, [0.02, -0.07, 0], handleColor, [0, 0, -0.34], { roughness: 0.78 });
    box(group, [0.23, 0.17, 0.075], [-0.08, 0.15, 0], item.color, [0, 0, -0.15], { metalness: 0.22, roughness: 0.38 });
    box(group, [0.045, 0.18, 0.08], [-0.215, 0.17, 0], 0xe7d3ad, [0, 0, -0.12], { metalness: 0.28, roughness: 0.28 });
  } else if (item.tool === 'sword') {
    cylinder(group, 0.03, 0.23, [0, -0.29, 0], 0x67402f, [0, 0, 0], { roughness: 0.82 });
    box(group, [0.31, 0.045, 0.075], [0, -0.15, 0], 0xd4b05f, [0, 0, 0], { metalness: 0.68, roughness: 0.26 });
    box(group, [0.085, 0.58, 0.055], [0, 0.16, 0], 0xe99661, [0, 0, 0], { metalness: 0.64, roughness: 0.26, emissive: 0x4b1808, emissiveIntensity: 0.34 });
    box(group, [0.018, 0.49, 0.058], [0.022, 0.16, 0.03], 0xffe2c2, [0, 0, 0], { metalness: 0.7, roughness: 0.18, emissive: 0x5b2b16, emissiveIntensity: 0.22 });
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.052, 0.13, 4), material(0xe99661, { metalness: 0.64, roughness: 0.26, emissive: 0x4b1808, emissiveIntensity: 0.34 }));
    tip.position.set(0, 0.515, 0);
    tip.rotation.y = Math.PI * 0.25;
    group.add(tip);
    cylinder(group, 0.047, 0.075, [0, -0.44, 0], 0xd4b05f, [0, 0, 0], { metalness: 0.68, roughness: 0.26 });
  } else if (item.category === 'food') {
    const cooked = item.cooked === true || /roast|cook/i.test(item.name || '');
    const mesh = characterMesh(`${held ? 'held' : 'tool'}_${cooked ? 'cooked' : 'raw'}_meat`, material(0xffffff, {vertexColors:true,roughness:.94}));
    mesh.castShadow = false;
    group.add(mesh);
    group.name = cooked ? 'Blender roasted pixel porkchop' : 'Blender raw pixel porkchop';
    group.userData = {authoredIn:'Blender',heldAssembly:held,itemModel:'pixel-porkchop',cooked,drawMeshCount:1};
    group.rotation.set(-.32,-.18,-.12);
    group.scale.setScalar(.8);
    return finishModel(group);
  } else if (item.category === 'relic') {
    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.2, 1),
      material(item.color, { metalness: 0.18, roughness: 0.22, emissive: item.color, emissiveIntensity: 1.25 }),
    );
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.245, 0.022, 8, 24),
      material(0xd7fff8, { metalness: 0.72, roughness: 0.25, emissive: 0x59d9c5, emissiveIntensity: 0.4 }),
    );
    ring.rotation.x = Math.PI * 0.5;
    group.add(core, ring);
  } else if (/ingot/i.test(item.name || '')) {
    box(group, [0.38, 0.15, 0.23], [0, 0, 0], item.color, [0.1, -0.35, -0.08], { metalness: 0.78, roughness: 0.3 });
    box(group, [0.24, 0.012, 0.12], [-0.025, 0.082, -0.01], 0xffc29e, [0.1, -0.35, -0.08], { metalness: 0.5, roughness: 0.2 });
  } else {
    box(group, [0.075, 0.62, 0.075], [0, 0, 0], item.color || handleColor, [0, 0, -0.36]);
  }
  group.rotation.set(-0.1, -0.34, item.tool === 'sword' ? -0.62 : -0.18);
  group.scale.setScalar(item.tool === 'sword' ? 0.7 : 0.82);
  return finishModel(group);
}

function makeActionHand() {
  const group = new THREE.Group();
  const mesh = characterMesh('player_right_arm', material(0xffffff, { vertexColors: true, roughness: .94 }));
  // One unbroken 4x12x4 arm. The wrist is the origin and the sleeve extends offscreen.
  mesh.position.set(0, -.75, 0);
  mesh.rotation.z = Math.PI;
  mesh.castShadow = false;
  group.add(mesh);
  group.rotation.set(-.32, -.18, -.12);
  group.scale.setScalar(.8);
  group.userData = { playerSkin: 'wayfarer', authoredIn: 'Blender', drawMeshCount: 1 };
  return finishModel(group);
}

function makeGripArm() {
  const group = makeActionHand();
  group.position.set(.035,-.13,.035);
  group.rotation.set(-.16, -.1, -.12);
  group.visible = false;
  return group;
}

function disposeObject(root) {
  root?.traverse((node) => {
    if (!node.isMesh) return;
    node.geometry?.dispose?.();
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    materials.forEach((entry) => {
      entry?.map?.dispose?.();
      entry?.dispose?.();
    });
  });
}

/** A compact, depth-tested version of the first-person model for world drops. */
export function createDroppedItemModel(id, atlas) {
  const item = getItem(id);
  const block = BLOCKS[id];
  const model = block?.tiles ? makeBlockModel(block, atlas) : makeToolModel(item);
  const wrapper = new THREE.Group();
  wrapper.name = `Dropped ${item.name}`;
  wrapper.add(model);
  model.scale.multiplyScalar(block?.tiles ? 1.35 : 0.92);
  wrapper.traverse((node) => {
    if (!node.isMesh) return;
    node.renderOrder = 0;
    node.frustumCulled = true;
    node.castShadow = true;
    node.receiveShadow = true;
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const entry of materials) {
      if (!entry) continue;
      entry.depthTest = true;
      entry.depthWrite = !entry.transparent;
      entry.needsUpdate = true;
    }
  });
  return wrapper;
}

export function disposeItemModel(root) {
  disposeObject(root);
}

export class HeldItemView {
  constructor(camera, atlas) {
    this.camera = camera;
    this.atlas = atlas;
    this.root = new THREE.Group();
    this.root.name = 'First-person held item';
    this.root.position.set(0.43, -0.43, -0.86);
    this.root.rotation.set(-0.1, -0.12, -0.08);
    this.root.visible = false;
    camera.add(this.root);
    this.actionHand = makeActionHand();
    this.root.add(this.actionHand);
    this.itemArm = makeGripArm();
    this.root.add(this.itemArm);
    this.itemId = null;
    this.model = null;
    this.presentationVisible = false;
    this.time = 0;
    this.actionStrength = 1;
    this.actionProgress = 1;
    this.walkBlend = 0;
    this.restPosition = new THREE.Vector3(0.43, -0.43, -0.86);
    this.targetPosition = new THREE.Vector3();
    this.restRotation = new THREE.Euler(-0.1, -0.12, -0.08, 'XYZ');
  }

  setItem(id) {
    id = Number(id) || 0;
    if (id === this.itemId) return;
    if (this.model) {
      this.root.remove(this.model);
      disposeObject(this.model);
    }
    this.itemId = id;
    const item = getItem(id);
    const block = BLOCKS[id];
    // Building blocks are intentionally not held in front of the camera: the
    // earlier permanent cube obscured cave detail and made every empty-hand
    // moment look like a placement preview. Tools, weapons, food and relics
    // retain a proper first-person model.
    this.model = id && !block?.tiles ? makeToolModel(item, true) : null;
    if (this.model) this.root.add(this.model);
    this.actionHand.visible = !this.model;
    this.itemArm.visible = Boolean(this.model && !this.model.userData.heldAssembly);
    this.root.visible = this.presentationVisible;
  }

  use(strength = 1) {
    if (this.actionProgress >= .85) this.actionProgress = 0;
    this.actionStrength = THREE.MathUtils.clamp(strength, .2, 1);
  }

  update(dt, { mining = false, moving = 0, reducedMotion = false } = {}) {
    dt = THREE.MathUtils.clamp(dt, 0, .08);
    this.time += dt;
    if (mining && this.actionProgress >= 1) { this.actionProgress = 0; this.actionStrength = 1; }
    this.actionProgress = Math.min(1, this.actionProgress + dt / (reducedMotion ? .65 : .46));
    // A complete eased stroke continues after mouse-up; no disappearing hand or snapped return.
    const t = this.actionProgress;
    const arc = Math.sin(Math.PI*t)**2 * (reducedMotion ? .22 : 1) * this.actionStrength;
    this.walkBlend += (Math.min(1,Math.max(0,moving)/5)-this.walkBlend)*(1-Math.exp(-dt*10));
    const bobX = Math.sin(this.time*8)*.009*this.walkBlend*(reducedMotion?.2:1);
    const bobY = Math.sin(this.time*16)*.006*this.walkBlend*(reducedMotion?.2:1);
    this.targetPosition.set(this.restPosition.x+bobX-arc*.14, this.restPosition.y+bobY+arc*.045, this.restPosition.z-arc*.2);
    const ease = 1-Math.exp(-dt*24);
    this.root.position.lerp(this.targetPosition,ease);
    this.root.rotation.x += (this.restRotation.x-arc*.4-this.root.rotation.x)*ease;
    this.root.rotation.y += (this.restRotation.y-arc*.16-this.root.rotation.y)*ease;
    this.root.rotation.z += (this.restRotation.z+arc*.12-this.root.rotation.z)*ease;
    if (this.model && getItem(this.itemId).category === 'relic') this.model.rotation.y += dt*1.4;
    this.actionHand.visible = !this.model;
    this.itemArm.visible = Boolean(this.model && !this.model.userData.heldAssembly);
    this.root.visible = this.presentationVisible;
  }

  setVisible(visible) {
    this.presentationVisible = Boolean(visible);
    this.root.visible = Boolean(this.presentationVisible && (this.model || this.actionHand.visible));
  }

  dispose() {
    if (this.model) disposeObject(this.model);
    disposeObject(this.actionHand);
    disposeObject(this.itemArm);
    this.camera.remove(this.root);
    this.model = null;
    this.actionHand = null;
    this.itemArm = null;
  }
}
