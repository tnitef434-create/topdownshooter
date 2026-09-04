import * as THREE from '../vendor/three.module.min.js';
import { characterMesh, characterMaterial, disposeCharacter } from './character-rig.js';

// World-space avatar geometry is never rendered by the layer-0 gameplay/GTAO
// camera. The sun shadow camera explicitly enables this layer in main.js.
export const WORLD_AVATAR_LAYER = 2;

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

export class PlayerAvatar {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.name = 'Wayfarer · Blender pixel skin';
    this.root.userData = { playerAvatar: true, meshBudget: 6, shadowCasterBudget: 6, authoredIn: 'Blender' };
    this.root.visible = false;
    scene.add(this.root);
    const mat = characterMaterial();
    for (const [key, name] of Object.entries({body:'torso',displayHead:'head',leftArm:'left_arm',rightArm:'right_arm',leftLeg:'left_leg',rightLeg:'right_leg'})) {
      this[key] = characterMesh('player_'+name, mat);
      this[key].layers.set(WORLD_AVATAR_LAYER);
      this.root.add(this[key]);
    }
    this.head = this.displayHead;
    this.time = 0; this.gaitBlend = 0; this.actionBlend = 0; this.crouch = 0;
  }
  setSelfVisible(visible) {
    // Layer isolation handles first-person visibility without disabling color/depth writes.
    this.selfVisible = Boolean(visible);
  }
  update(dt, player, motion = {}, options = {}) {
    if (!player?.position) { this.root.visible = false; return; }
    dt = THREE.MathUtils.clamp(dt, 0, .08);
    const speed = Math.hypot(player.velocity?.x || 0, player.velocity?.z || 0);
    const blend = 1-Math.exp(-dt*12);
    this.gaitBlend += ((player.grounded ? Math.min(1,speed/4.65) : 0)-this.gaitBlend)*blend;
    this.time += speed*dt*1.8;
    const scale = options.reducedMotion ? .18 : 1;
    const stride = Math.sin(this.time)*.62*this.gaitBlend*scale;
    this.actionBlend += ((options.action ? .65 : 0)-this.actionBlend)*blend;
    this.leftLeg.rotation.x = stride; this.rightLeg.rotation.x = -stride;
    this.leftArm.rotation.x = -stride*.8;
    this.rightArm.rotation.x = stride*.8-this.actionBlend*scale;
    this.crouch += ((motion.crouching ? -.16 : 0)-this.crouch)*blend;
    this.root.position.copy(player.position); this.root.position.y += this.crouch;
    this.root.rotation.y = player.yaw || 0;
    this.root.visible = true;
  }
  dispose() { disposeCharacter(this.root); this.root = null; this.scene = null; }
}
