import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/public/worldloom/vendor/three.module.min.js';
import { ITEM } from '../src/public/worldloom/src/data.js';
import {
  HeldItemView,
  createDroppedItemModel,
  disposeItemModel,
} from '../src/public/worldloom/src/viewmodel.js';
import {
  PlayerAvatar,
  WORLD_AVATAR_LAYER,
} from '../src/public/worldloom/src/player-avatar.js';

function meshSummary(root) {
  const meshes = [];
  root.traverse((node) => { if (node.isMesh) meshes.push(node); });
  return meshes;
}

test('raw and roasted meat preserve authored voxel detail in one draw mesh', () => {
  const raw = createDroppedItemModel(ITEM.RAW_MEAT, null);
  const cooked = createDroppedItemModel(ITEM.COOKED_MEAT, null);
  const rawMeshes = meshSummary(raw);
  const cookedMeshes = meshSummary(cooked);
  const rawModel = raw.getObjectByName('Pixel raw game steak');
  const cookedModel = cooked.getObjectByName('Pixel fire-roasted steak');

  assert.equal(rawMeshes.length, 1, 'each raw drop must remain a single draw mesh');
  assert.equal(cookedMeshes.length, 1, 'each cooked drop must remain a single draw mesh');
  assert.equal(rawModel?.userData.authoredVoxelParts, 21, 'raw steak lost stepped detail');
  assert.equal(cookedModel?.userData.authoredVoxelParts, 22, 'roasted steak lost sear detail');
  assert.equal(rawModel?.userData.drawMeshCount, 1);
  assert.equal(cookedModel?.userData.drawMeshCount, 1);
  assert.ok(rawModel?.userData.voxelPaletteSize >= 8, 'raw palette was flattened');
  assert.ok(cookedModel?.userData.voxelPaletteSize >= 8, 'cooked palette was flattened');
  assert.equal(rawMeshes[0].geometry.getAttribute('position').count, 21 * 36);
  assert.equal(cookedMeshes[0].geometry.getAttribute('position').count, 22 * 36);
  assert.equal(rawMeshes[0].geometry.getAttribute('color').count, 21 * 36);
  assert.equal(cookedMeshes[0].geometry.getAttribute('color').count, 22 * 36);
  assert.ok(rawMeshes[0].geometry.boundingSphere, 'merged raw geometry must remain cullable');
  assert.ok(cookedMeshes[0].geometry.boundingSphere, 'merged cooked geometry must remain cullable');
  assert.equal(rawModel?.userData.itemModel, 'pixel-bone-steak');
  assert.equal(rawModel?.userData.cooked, false);
  assert.equal(cookedModel?.userData.cooked, true);

  disposeItemModel(raw);
  disposeItemModel(cooked);
});

test('Wayfarer avatar stays richly authored within strict draw and shadow budgets', () => {
  const scene = new THREE.Scene();
  const avatar = new PlayerAvatar(scene);
  const player = {
    position: new THREE.Vector3(4.25, 17, -8.5),
    velocity: new THREE.Vector3(4.2, 0, 0),
    yaw: 1.17,
    grounded: true,
  };
  avatar.update(0.16, player, { moving: 1, crouching: false }, { action: true });

  const parts = [];
  avatar.root.traverse((node) => {
    if (node.userData?.playerAvatarPart) parts.push(node);
  });
  const shadowHead = avatar.root.getObjectByName('shadow-only head');
  const displayHead = avatar.root.getObjectByName('Wayfarer display head mesh');
  const meshes = meshSummary(avatar.root);
  const shadowCasters = meshes.filter((mesh) => mesh.castShadow);
  const gameplayCamera = new THREE.PerspectiveCamera(75, 1, 0.05, 100);
  const shadowCamera = new THREE.OrthographicCamera(-20, 20, 20, -20, 0.1, 100);
  shadowCamera.layers.enable(WORLD_AVATAR_LAYER);
  assert.equal(avatar.root.visible, true);
  assert.deepEqual(avatar.root.position.toArray(), player.position.toArray());
  assert.equal(avatar.root.rotation.y, player.yaw);
  assert.equal(avatar.root.userData.authoredVoxelParts, 34);
  assert.ok(parts.length >= 34, 'the skin should retain part-level authored metadata');
  assert.ok(meshes.length <= avatar.root.userData.meshBudget, 'avatar exceeded its seven-draw mesh budget');
  assert.ok(shadowCasters.length <= avatar.root.userData.shadowCasterBudget,
    'avatar exceeded its rationalized shadow-caster budget');
  assert.ok(meshes.every((mesh) => mesh.frustumCulled), 'avatar meshes must be frustum-cullable');
  assert.ok(meshes.every((mesh) => mesh.geometry.getAttribute('color')),
    'merged avatar segments must preserve their colour panels as vertex colours');
  assert.equal(WORLD_AVATAR_LAYER, 2);
  assert.ok(meshes.every((mesh) => !mesh.layers.test(gameplayCamera.layers)),
    'no world-avatar mesh may intersect the gameplay/GTAO camera layer');
  assert.ok(shadowCasters.every((mesh) => mesh.layers.test(shadowCamera.layers)),
    'every intended avatar caster must intersect the avatar-enabled sun shadow camera');
  assert.equal(shadowHead.castShadow, true);
  assert.equal(shadowHead.material.colorWrite, false);
  assert.equal(shadowHead.material.depthWrite, false);
  assert.equal(shadowHead.userData.playerAvatarPartCount, 3);
  assert.equal(displayHead.layers.test(gameplayCamera.layers), false,
    'the authored face must stay on the third-person preview layer');
  assert.equal(displayHead.material.colorWrite, true,
    'the third-person face must remain visually authored');
  assert.equal(shadowCasters.length, avatar.root.userData.shadowCasterBudget,
    'self-hiding must not remove avatar shadow semantics');
  assert.notEqual(avatar.leftLeg.rotation.x, avatar.rightLeg.rotation.x);
  assert.notEqual(avatar.leftArm.rotation.x, avatar.rightArm.rotation.x);

  avatar.setSelfVisible(true);
  const thirdPersonBody = meshes.filter((mesh) => mesh.userData.localAvatarVisual);
  assert.ok(thirdPersonBody.length >= 5);
  assert.ok(thirdPersonBody.every((mesh) => mesh.material.colorWrite && mesh.material.depthWrite),
    'a future third-person camera must be able to opt the body back in');
  avatar.setSelfVisible(false);
  assert.ok(thirdPersonBody.every((mesh) => !mesh.material.colorWrite && !mesh.material.depthWrite));

  avatar.dispose();
  assert.equal(scene.children.length, 0);
});

test('first-person Wayfarer arms keep their colour panels to one draw each', () => {
  const camera = new THREE.PerspectiveCamera(75, 1, 0.05, 100);
  const held = new HeldItemView(camera, null);
  const actionMeshes = meshSummary(held.actionHand);
  const gripMeshes = meshSummary(held.itemArm);
  assert.equal(actionMeshes.length, 1);
  assert.equal(gripMeshes.length, 1);
  assert.equal(held.actionHand.userData.authoredVoxelParts, 5);
  assert.equal(held.itemArm.userData.authoredVoxelParts, 4);
  assert.equal(actionMeshes[0].geometry.getAttribute('color').count, 5 * 36);
  assert.equal(gripMeshes[0].geometry.getAttribute('color').count, 4 * 36);
  const gameplayCamera = new THREE.PerspectiveCamera(75, 1, 0.05, 100);
  assert.ok(actionMeshes.every((mesh) => mesh.layers.test(gameplayCamera.layers)),
    'first-person hands must remain on the gameplay camera layer');
  assert.ok(gripMeshes.every((mesh) => mesh.layers.test(gameplayCamera.layers)),
    'held items and their grip arm must remain on the gameplay camera layer');
  assert.equal(actionMeshes[0].material.colorWrite, true,
    'self-hiding the world avatar must not remove the first-person hand');
  assert.equal(gripMeshes[0].material.colorWrite, true,
    'self-hiding the world avatar must not remove held items and their grip arm');
  held.dispose();
});
