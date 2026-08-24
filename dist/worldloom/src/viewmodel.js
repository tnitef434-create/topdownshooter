import * as THREE from '../vendor/three.module.min.js';
import { BLOCKS } from './blocks.js';
import { getItem } from './data.js';
import { WAYFARER_SKIN, createMergedVoxelGeometry } from './player-avatar.js';

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

function voxelPart(size, position, color, rotation = [0, 0, 0], name = '') {
  return { size, position, color, rotation, name };
}

function mergedVoxelMesh(parts, options = {}) {
  const geometry = createMergedVoxelGeometry(parts);
  const mesh = new THREE.Mesh(
    geometry,
    material(0xffffff, { ...options, vertexColors: true }),
  );
  mesh.userData.authoredVoxelParts = geometry.userData.voxelPartCount;
  mesh.userData.voxelPaletteSize = geometry.userData.voxelPaletteSize;
  return mesh;
}

function makePixelMeatModel(item) {
  const group = new THREE.Group();
  const cooked = item.cooked === true || /roast|cook/i.test(item.name || '');
  const palette = cooked
    ? {
      outline: 0x3b1b16, rind: 0x71301f, meat: 0xad542e, light: 0xd47a3d,
      fat: 0xe6a761, boneShade: 0x8d5b39, bone: 0xe7c78d, marrow: 0x744127,
      accent: 0x2b1713,
    }
    : {
      outline: 0x541f2b, rind: 0xa64c57, meat: 0xd45762, light: 0xf0837e,
      fat: 0xf4b7aa, boneShade: 0x9f665f, bone: 0xf3d3bb, marrow: 0xad5861,
      accent: 0xffc0ad,
    };
  const parts = [];

  // The overlapping stepped slabs create an irregular steak silhouette using
  // only cuboids. They are merged after authoring so 256 loose drops still cost
  // one draw call each instead of thousands.
  parts.push(
    voxelPart([0.42, 0.2, 0.13], [-0.025, 0, 0], palette.outline, [0, 0, 0], 'outline centre'),
    voxelPart([0.31, 0.29, 0.13], [-0.03, 0.005, 0], palette.outline, [0, 0, 0], 'outline crown'),
    voxelPart([0.16, 0.2, 0.13], [0.21, -0.012, 0], palette.outline, [0, 0, 0], 'outline right step'),
    voxelPart([0.13, 0.16, 0.13], [-0.245, -0.01, 0], palette.outline, [0, 0, 0], 'outline left step'),
    voxelPart([0.36, 0.17, 0.03], [-0.025, -0.002, 0.079], palette.rind, [0, 0, 0], 'rind'),
    voxelPart([0.25, 0.235, 0.03], [-0.035, 0.004, 0.079], palette.meat, [0, 0, 0], 'main cut'),
    voxelPart([0.105, 0.14, 0.03], [0.19, -0.018, 0.079], palette.meat, [0, 0, 0], 'right cut'),
    voxelPart([0.095, 0.1, 0.034], [-0.19, -0.038, 0.083], palette.light, [0, 0, 0], 'cut highlight'),
  );

  // Broken fat cap and square T-bone mirror the inventory silhouette.
  parts.push(
    voxelPart([0.19, 0.045, 0.04], [-0.12, 0.137, 0.088], palette.fat, [0, 0, 0], 'fat cap left'),
    voxelPart([0.12, 0.04, 0.04], [0.05, 0.13, 0.088], palette.fat, [0, 0, 0], 'fat cap right'),
    voxelPart([0.045, 0.13, 0.04], [-0.245, 0.035, 0.088], palette.fat, [0, 0, 0], 'fat cap edge'),
    voxelPart([0.12, 0.045, 0.042], [0.09, 0.04, 0.091], palette.boneShade, [0, 0, 0], 'bone shade top'),
    voxelPart([0.046, 0.16, 0.042], [0.11, -0.02, 0.091], palette.boneShade, [0, 0, 0], 'bone shade stem'),
    voxelPart([0.14, 0.05, 0.042], [0.11, -0.09, 0.091], palette.boneShade, [0, 0, 0], 'bone shade base'),
    voxelPart([0.076, 0.034, 0.047], [0.09, 0.04, 0.095], palette.bone, [0, 0, 0], 'bone top'),
    voxelPart([0.028, 0.115, 0.047], [0.11, -0.02, 0.095], palette.bone, [0, 0, 0], 'bone stem'),
    voxelPart([0.09, 0.032, 0.048], [0.11, -0.088, 0.096], palette.bone, [0, 0, 0], 'bone base'),
    voxelPart([0.017, 0.08, 0.052], [0.11, -0.02, 0.1], palette.marrow, [0, 0, 0], 'marrow'),
  );

  if (cooked) {
    for (let index = -1; index <= 1; index++) {
      parts.push(voxelPart(
        [0.025, 0.19, 0.018],
        [-0.105 + index * 0.075, -0.005, 0.112],
        palette.accent,
        [0, 0, -0.66],
        `sear mark ${index + 2}`,
      ));
    }
    parts.push(voxelPart([0.055, 0.026, 0.02], [-0.205, 0.065, 0.113], palette.light, [0, 0, 0], 'roast glint'));
  } else {
    parts.push(
      voxelPart([0.018, 0.15, 0.018], [-0.09, 0.002, 0.112], palette.accent, [0, 0, -0.54], 'marbling dark'),
      voxelPart([0.018, 0.12, 0.018], [-0.015, -0.025, 0.112], palette.fat, [0, 0, -0.54], 'marbling pale'),
      voxelPart([0.042, 0.026, 0.02], [-0.18, 0.07, 0.113], palette.accent, [0, 0, 0], 'moisture glint'),
    );
  }

  group.name = cooked ? 'Pixel fire-roasted steak' : 'Pixel raw game steak';
  group.userData.itemModel = 'pixel-bone-steak';
  group.userData.cooked = cooked;
  group.userData.authoredVoxelParts = parts.length;
  group.userData.voxelPaletteSize = new Set(parts.map((entry) => entry.color)).size;
  group.userData.drawMeshCount = 1;
  const mesh = mergedVoxelMesh(parts, { roughness: cooked ? 0.94 : 0.8 });
  mesh.name = `${group.name} merged voxel mesh`;
  mesh.userData.itemModel = 'pixel-bone-steak';
  group.add(mesh);
  return group;
}

function makeToolModel(item) {
  const group = new THREE.Group();
  const handleColor = 0x8c5b37;
  if (item.tool === 'pickaxe') {
    cylinder(group, 0.031, 0.5, [0.02, -0.07, 0], handleColor, [0, 0, -0.38], { roughness: 0.78 });
    box(group, [0.34, 0.06, 0.075], [-0.08, 0.16, 0], item.color, [0, 0, -0.1], { metalness: /copper/i.test(item.name) ? 0.72 : 0.12, roughness: 0.35 });
    box(group, [0.09, 0.035, 0.082], [-0.255, 0.18, 0], 0xe9d5b1, [0, 0, -0.2], { metalness: 0.35, roughness: 0.28 });
    box(group, [0.075, 0.035, 0.08], [0.095, 0.145, 0], 0x4d5552, [0, 0, 0.22], { metalness: 0.45, roughness: 0.32 });
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
    group.add(makePixelMeatModel(item));
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
  // The action hand shares the full player's original Wayfarer skin instead of
  // presenting an unrelated generic sleeve in first person. All five colour
  // panels share one vertex-coloured draw call.
  const parts = [
    voxelPart([0.2, 0.42, 0.21], [0.02, -0.12, 0], WAYFARER_SKIN.tunic, [0, 0, -0.08], 'Wayfarer action sleeve'),
    voxelPart([0.207, 0.09, 0.217], [0.02, 0.08, 0], WAYFARER_SKIN.tunicLight, [0, 0, -0.08], 'Wayfarer stitched cuff'),
    voxelPart([0.215, 0.2, 0.225], [0.02, 0.205, 0], WAYFARER_SKIN.skin, [0, 0, -0.08], 'Wayfarer action hand'),
    voxelPart([0.17, 0.068, 0.18], [0.02, 0.31, 0.02], WAYFARER_SKIN.skinLight, [0, 0, -0.08], 'Wayfarer knuckle pixels'),
    voxelPart([0.045, 0.035, 0.024], [-0.035, 0.323, 0.115], WAYFARER_SKIN.skinShadow, [0, 0, -0.08], 'Wayfarer finger shadow'),
  ];
  const mesh = mergedVoxelMesh(parts, { roughness: 0.93 });
  mesh.name = 'Merged Wayfarer action hand';
  group.add(mesh);
  group.rotation.set(-0.08, -0.28, -0.24);
  group.scale.setScalar(0.86);
  group.visible = false;
  group.userData.playerSkin = 'wayfarer';
  group.userData.authoredVoxelParts = parts.length;
  group.userData.drawMeshCount = 1;
  return finishModel(group);
}

function makeGripArm() {
  const group = new THREE.Group();
  const parts = [
    voxelPart([0.21, 0.43, 0.22], [0.08, -0.19, 0.03], WAYFARER_SKIN.tunic, [0, 0, -0.05], 'Wayfarer held-item sleeve'),
    voxelPart([0.218, 0.095, 0.228], [0.07, 0.02, 0.03], WAYFARER_SKIN.tunicLight, [0, 0, -0.05], 'Wayfarer held-item cuff'),
    voxelPart([0.225, 0.19, 0.235], [0.055, 0.155, 0.035], WAYFARER_SKIN.skin, [0, 0, -0.07], 'Wayfarer gripping hand'),
    voxelPart([0.17, 0.055, 0.04], [0.055, 0.245, 0.15], WAYFARER_SKIN.skinLight, [0, 0, -0.07], 'Wayfarer gripping fingers'),
  ];
  const mesh = mergedVoxelMesh(parts, { roughness: 0.93 });
  mesh.name = 'Merged Wayfarer grip arm';
  group.add(mesh);
  group.position.set(0.08, -0.25, 0.08);
  group.rotation.set(-0.05, -0.2, -0.22);
  group.scale.setScalar(0.82);
  group.visible = false;
  group.userData.playerSkin = 'wayfarer';
  group.userData.authoredVoxelParts = parts.length;
  group.userData.drawMeshCount = 1;
  finishModel(group);
  group.traverse((node) => { if (node.isMesh) node.renderOrder = 1002; });
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
    this.wasMining = false;
    this.time = 0;
    this.swingTime = 0;
    this.useImpulse = 0;
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
    this.model = id && !block?.tiles ? makeToolModel(item) : null;
    if (this.model) this.root.add(this.model);
    this.actionHand.visible = false;
    this.itemArm.visible = Boolean(this.model);
    this.root.visible = Boolean(this.presentationVisible && this.model);
  }

  use(strength = 1) {
    this.useImpulse = Math.max(this.useImpulse, THREE.MathUtils.clamp(strength, 0.2, 1.4));
  }

  update(dt, { mining = false, moving = 0, reducedMotion = false } = {}) {
    this.time += dt;
    if (mining && !this.wasMining) this.swingTime = 0;
    if (mining) this.swingTime += dt * (reducedMotion ? 1.45 : 2.35);
    else this.swingTime = 0;
    this.wasMining = Boolean(mining);
    this.useImpulse = Math.max(0, this.useImpulse - dt * 4.8);
    const motionScale = reducedMotion ? 0.25 : 1;
    const walk = Math.min(1, Math.max(0, moving) / 5);
    const bobX = Math.sin(this.time * 8.6) * 0.012 * walk * motionScale;
    const bobY = Math.abs(Math.cos(this.time * 8.6)) * 0.014 * walk * motionScale;
    // Each mining cycle has a complete wind-up and return. The old clipped sine
    // spent half of every cycle motionless, which looked like a frozen/broken
    // animation and gave very slow blocks no useful rhythm.
    const miningCycle = this.swingTime - Math.floor(this.swingTime);
    const miningArc = mining ? Math.pow(Math.sin(miningCycle * Math.PI), 1.18) : 0;
    const useArc = Math.sin(this.useImpulse * Math.PI) * this.useImpulse;
    const arc = Math.max(miningArc, useArc) * motionScale;
    this.targetPosition.copy(this.restPosition).add(new THREE.Vector3(bobX - arc * 0.11, -bobY - arc * 0.13, arc * 0.08));
    this.root.position.lerp(this.targetPosition, 1 - Math.exp(-dt * 18));
    this.root.rotation.x += ((this.restRotation.x - arc * 0.82) - this.root.rotation.x) * Math.min(1, dt * 19);
    this.root.rotation.y += ((this.restRotation.y + arc * 0.38) - this.root.rotation.y) * Math.min(1, dt * 19);
    this.root.rotation.z += ((this.restRotation.z - arc * 0.34 + bobX) - this.root.rotation.z) * Math.min(1, dt * 19);
    if (this.model && this.itemId && getItem(this.itemId).category === 'relic') {
      this.model.rotation.y += dt * 1.4;
    }
    this.actionHand.visible = Boolean(!this.model && (mining || this.useImpulse > 0.015));
    this.itemArm.visible = Boolean(this.model);
    this.root.visible = Boolean(this.presentationVisible && (this.model || this.actionHand.visible));
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
