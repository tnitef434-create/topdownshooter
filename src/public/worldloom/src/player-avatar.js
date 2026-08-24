import * as THREE from '../vendor/three.module.min.js';

/**
 * Worldloom's original Wayfarer palette. It deliberately uses broad voxel-
 * adventure language without reproducing any existing game's skin artwork.
 */
export const WAYFARER_SKIN = Object.freeze({
  skin: 0xb97f5d,
  skinLight: 0xd29a72,
  skinShadow: 0x8d5a46,
  hair: 0x352b2a,
  hairLight: 0x56413a,
  tunic: 0x355c70,
  tunicLight: 0x4c7a8c,
  tunicShadow: 0x263f52,
  stitch: 0xb5d2c9,
  belt: 0x5a3b2e,
  buckle: 0xc69a57,
  trousers: 0x293846,
  trousersLight: 0x3e5260,
  boot: 0x2a211f,
  bootLight: 0x49342d,
  eye: 0x18242a,
  scarf: 0x9b4f3c,
});

/**
 * Merge independently coloured cuboids into one vertex-coloured geometry.
 * Each authored box keeps its own hard normals and transform, but all boxes in
 * an animated segment are submitted as a single draw call.
 */
export function createMergedVoxelGeometry(parts) {
  const positions = [];
  const normals = [];
  const colors = [];
  const palette = new Set();
  const color = new THREE.Color();
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3(1, 1, 1);
  let partCount = 0;

  for (const part of Array.isArray(parts) ? parts : []) {
    if (!Array.isArray(part?.size) || part.size.length !== 3) continue;
    const source = new THREE.BoxGeometry(...part.size).toNonIndexed();
    const sourcePosition = source.getAttribute('position');
    const sourceNormal = source.getAttribute('normal');
    position.fromArray(part.position || [0, 0, 0]);
    euler.fromArray([...(part.rotation || [0, 0, 0]), 'XYZ']);
    quaternion.setFromEuler(euler);
    matrix.compose(position, quaternion, scale);
    source.applyMatrix4(matrix);
    color.set(part.color ?? 0xffffff);
    palette.add(color.getHex());
    for (let index = 0; index < sourcePosition.count; index++) {
      positions.push(
        sourcePosition.getX(index),
        sourcePosition.getY(index),
        sourcePosition.getZ(index),
      );
      normals.push(
        sourceNormal.getX(index),
        sourceNormal.getY(index),
        sourceNormal.getZ(index),
      );
      colors.push(color.r, color.g, color.b);
    }
    source.dispose();
    partCount++;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.userData.voxelPartCount = partCount;
  geometry.userData.voxelPaletteSize = palette.size;
  return geometry;
}

function avatarMaterial({ invisible = false } = {}) {
  const result = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    vertexColors: true,
    roughness: 0.94,
    metalness: 0,
    flatShading: true,
  });
  if (invisible) {
    // The first-person camera occupies the head volume. Keeping this geometry
    // in the shadow pass completes the silhouette without drawing a cube around
    // the camera.
    result.colorWrite = false;
    result.depthWrite = false;
  }
  return result;
}

function avatarMesh(parent, name, parts, options = {}) {
  const geometry = createMergedVoxelGeometry(parts);
  const mesh = new THREE.Mesh(geometry, avatarMaterial(options));
  mesh.name = name;
  mesh.castShadow = options.castShadow ?? true;
  mesh.receiveShadow = false;
  mesh.frustumCulled = true;
  if (Number.isInteger(options.layer)) mesh.layers.set(options.layer);
  mesh.userData.playerAvatarParts = parts.map((part) => part.name).filter(Boolean);
  mesh.userData.playerAvatarPartCount = geometry.userData.voxelPartCount;
  mesh.userData.voxelPaletteSize = geometry.userData.voxelPaletteSize;
  // Lightweight, invisible metadata nodes preserve part-level inspection for
  // QA/accessibility tooling without restoring one renderable mesh per detail.
  for (const partName of mesh.userData.playerAvatarParts) {
    const marker = new THREE.Object3D();
    marker.name = `${partName} metadata`;
    marker.visible = false;
    marker.userData.playerAvatarPart = partName;
    mesh.add(marker);
  }
  parent.add(mesh);
  return mesh;
}

function part(name, size, position, color, rotation = [0, 0, 0]) {
  return { name, size, position, color, rotation };
}

function limb(parent, side, x) {
  const pivot = new THREE.Group();
  pivot.name = `${side} arm pivot`;
  pivot.position.set(x, 1.37, 0.055);
  parent.add(pivot);
  avatarMesh(pivot, `${side} Wayfarer arm`, [
    part(`${side} tunic sleeve`, [0.22, 0.29, 0.25], [0, -0.145, 0], WAYFARER_SKIN.tunic),
    part(`${side} sleeve highlight`, [0.225, 0.075, 0.255], [0, -0.055, -0.006], WAYFARER_SKIN.tunicLight),
    part(`${side} forearm`, [0.205, 0.26, 0.235], [0, -0.415, 0], WAYFARER_SKIN.skin),
    part(`${side} hand`, [0.215, 0.16, 0.245], [0, -0.62, -0.004], WAYFARER_SKIN.skinLight),
    part(`${side} wrist pixels`, [0.219, 0.048, 0.249], [0, -0.51, -0.006], WAYFARER_SKIN.skinShadow),
  ]);
  return pivot;
}

function leg(parent, side, x) {
  const pivot = new THREE.Group();
  pivot.name = `${side} leg pivot`;
  pivot.position.set(x, 0.82, 0.07);
  parent.add(pivot);
  avatarMesh(pivot, `${side} Wayfarer leg`, [
    part(`${side} trouser leg`, [0.255, 0.55, 0.28], [0, -0.275, 0], WAYFARER_SKIN.trousers),
    part(`${side} trouser pixels`, [0.26, 0.12, 0.286], [0, -0.09, -0.004], WAYFARER_SKIN.trousersLight),
    part(`${side} boot`, [0.27, 0.22, 0.36], [0, -0.65, -0.055], WAYFARER_SKIN.boot),
    part(`${side} boot toe`, [0.275, 0.11, 0.385], [0, -0.63, -0.092], WAYFARER_SKIN.bootLight),
  ]);
  return pivot;
}

export class PlayerAvatar {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.name = 'Wayfarer voxel player';
    this.root.userData.playerAvatar = true;
    this.root.userData.authoredVoxelParts = 34;
    this.root.userData.meshBudget = 7;
    this.root.userData.shadowCasterBudget = 6;
    this.root.visible = false;
    scene.add(this.root);

    this.body = new THREE.Group();
    this.body.name = 'Wayfarer body';
    this.root.add(this.body);
    avatarMesh(this.body, 'Wayfarer body mesh', [
      part('tunic torso', [0.57, 0.64, 0.31], [0, 1.12, 0.07], WAYFARER_SKIN.tunic),
      part('tunic shoulder yoke', [0.58, 0.13, 0.32], [0, 1.365, 0.065], WAYFARER_SKIN.tunicLight),
      part('tunic centre stitch', [0.07, 0.39, 0.025], [0, 1.12, -0.098], WAYFARER_SKIN.stitch),
      part('leather belt', [0.59, 0.105, 0.325], [0, 0.845, 0.07], WAYFARER_SKIN.belt),
      part('square belt buckle', [0.12, 0.115, 0.035], [0, 0.845, -0.103], WAYFARER_SKIN.buckle),
      part('back trail panel', [0.28, 0.27, 0.045], [0, 0.73, 0.235], WAYFARER_SKIN.tunicShadow),
    ]);

    this.leftArm = limb(this.root, 'left', -0.405);
    this.rightArm = limb(this.root, 'right', 0.405);
    this.leftLeg = leg(this.root, 'left', -0.145);
    this.rightLeg = leg(this.root, 'right', 0.145);

    // The authored face lives on a camera-hidden layer for third-person/photo
    // views. The normal first-person camera renders layer 0 only.
    this.displayHead = new THREE.Group();
    this.displayHead.name = 'Wayfarer display head';
    this.displayHead.layers.set(2);
    this.root.add(this.displayHead);
    avatarMesh(this.displayHead, 'Wayfarer display head mesh', [
      part('Wayfarer head', [0.47, 0.47, 0.47], [0, 1.64, 0.055], WAYFARER_SKIN.skin),
      part('Wayfarer hair cap', [0.49, 0.18, 0.49], [0, 1.82, 0.055], WAYFARER_SKIN.hair),
      part('Wayfarer hair fringe', [0.49, 0.12, 0.06], [0, 1.705, -0.205], WAYFARER_SKIN.hairLight),
      part('Wayfarer left eye', [0.07, 0.065, 0.025], [-0.115, 1.66, -0.19], WAYFARER_SKIN.eye),
      part('Wayfarer right eye', [0.07, 0.065, 0.025], [0.115, 1.66, -0.19], WAYFARER_SKIN.eye),
      part('Wayfarer cheek pixel', [0.075, 0.045, 0.024], [-0.15, 1.565, -0.19], WAYFARER_SKIN.skinLight),
      part('Wayfarer scarf knot', [0.16, 0.095, 0.07], [0.12, 1.425, -0.13], WAYFARER_SKIN.scarf),
    ], { layer: 2, castShadow: false });

    // One merged, colour-silent caster replaces three separate invisible head
    // meshes while preserving their exact silhouette.
    this.head = avatarMesh(this.root, 'shadow-only head', [
      part('shadow head', [0.47, 0.47, 0.47], [0, 1.64, 0.055], WAYFARER_SKIN.skin),
      part('shadow hair cap', [0.49, 0.18, 0.49], [0, 1.82, 0.055], WAYFARER_SKIN.hair),
      part('shadow hair fringe', [0.49, 0.12, 0.06], [0, 1.705, -0.205], WAYFARER_SKIN.hairLight),
    ], { invisible: true });

    this.time = 0;
    this.gaitBlend = 0;
    this.actionBlend = 0;
    this.lastGrounded = true;
  }

  update(dt, player, motion = {}, options = {}) {
    if (!player?.position) {
      this.root.visible = false;
      return;
    }
    const reducedMotion = Boolean(options.reducedMotion);
    const grounded = Boolean(player.grounded);
    const horizontalSpeed = Math.hypot(Number(player.velocity?.x) || 0, Number(player.velocity?.z) || 0);
    const moving = grounded && horizontalSpeed > 0.12;
    const targetGait = moving ? Math.min(1, horizontalSpeed / 4.65) : 0;
    this.gaitBlend += (targetGait - this.gaitBlend) * Math.min(1, dt * 10);
    this.actionBlend += ((options.action ? 1 : 0) - this.actionBlend) * Math.min(1, dt * 14);
    this.time += dt * (3.4 + horizontalSpeed * 1.42);

    const motionScale = reducedMotion ? 0.18 : 1;
    const stride = Math.sin(this.time) * 0.78 * this.gaitBlend * motionScale;
    const airborne = grounded ? 0 : THREE.MathUtils.clamp(-(Number(player.velocity?.y) || 0) * 0.035, -0.24, 0.28);
    const action = this.actionBlend * Math.sin(this.time * 1.7 + Math.PI * 0.35) * motionScale;
    this.leftLeg.rotation.x = stride + airborne;
    this.rightLeg.rotation.x = -stride + airborne;
    this.leftArm.rotation.x = -stride * 0.72 + airborne * 0.45;
    this.rightArm.rotation.x = stride * 0.72 - action * 0.95 + airborne * 0.45;
    this.rightArm.rotation.z = -action * 0.22;
    this.leftArm.rotation.z = 0;

    const breathing = Math.sin(this.time * 0.32) * 0.006 * motionScale;
    const crouch = motion.crouching ? -0.16 : 0;
    const landing = !this.lastGrounded && grounded ? -0.055 * motionScale : 0;
    this.body.position.y += ((breathing + crouch + landing) - this.body.position.y) * Math.min(1, dt * 14);
    this.root.position.copy(player.position);
    this.root.rotation.y = Number.isFinite(player.yaw) ? player.yaw : 0;
    this.root.visible = true;
    this.lastGrounded = grounded;
  }

  dispose() {
    this.root.traverse((node) => {
      if (!node.isMesh) return;
      node.geometry?.dispose?.();
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach((entry) => entry?.dispose?.());
    });
    this.scene?.remove(this.root);
    this.root.clear();
    this.root = null;
    this.scene = null;
  }
}
