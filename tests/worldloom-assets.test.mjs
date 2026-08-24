import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
import { PondEcologyField } from '../src/public/worldloom/src/pond-ecology.js';

function meshSummary(root) {
  const meshes = [];
  root.traverse((node) => { if (node.isMesh) meshes.push(node); });
  return meshes;
}

const POND_DETAILS_URL = new URL(
  '../src/public/worldloom/assets/environment/pond-details.glb',
  import.meta.url,
);
const POND_GENERATOR_URL = new URL('../tools/generate_pond_assets.py', import.meta.url);
const GLB_MAGIC = 0x46546c67;
const GLB_JSON_CHUNK = 0x4e4f534a;
const GLB_BINARY_CHUNK = 0x004e4942;

function parseGlb(buffer) {
  assert.ok(buffer.length >= 20, 'GLB is too short to contain its header and JSON chunk');
  assert.equal(buffer.readUInt32LE(0), GLB_MAGIC, 'GLB magic must be glTF');
  assert.equal(buffer.readUInt32LE(4), 2, 'pond assets must use glTF 2.0');
  assert.equal(buffer.readUInt32LE(8), buffer.length, 'GLB declared length must match its bytes');
  const jsonLength = buffer.readUInt32LE(12);
  assert.equal(buffer.readUInt32LE(16), GLB_JSON_CHUNK, 'first GLB chunk must be JSON');
  assert.ok(jsonLength > 0 && 20 + jsonLength <= buffer.length, 'GLB JSON chunk length is invalid');
  const json = JSON.parse(buffer.subarray(20, 20 + jsonLength).toString('utf8').trim());
  const binaryHeader = 20 + jsonLength;
  assert.ok(binaryHeader + 8 <= buffer.length, 'GLB is missing its embedded binary chunk');
  const binaryLength = buffer.readUInt32LE(binaryHeader);
  assert.equal(buffer.readUInt32LE(binaryHeader + 4), GLB_BINARY_CHUNK, 'second GLB chunk must be BIN');
  assert.equal(binaryHeader + 8 + binaryLength, buffer.length, 'GLB binary chunk length is invalid');
  return json;
}

function createTestPondGltf(packScale = 1) {
  const scene = new THREE.Scene();
  const pack = new THREE.Group();
  pack.name = 'Pond_Detail_Asset_Pack';
  pack.scale.setScalar(packScale);
  scene.add(pack);
  const colors = [0x4a8b45, 0xb9d4d2, 0x211c17];
  ['Lily_Pad_Asset', 'Mist_Wisp_Asset', 'Fly_Swarm_Asset'].forEach((name, index) => {
    const root = new THREE.Group();
    root.name = name;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.1 + index * 0.05, 1),
      new THREE.MeshStandardMaterial({ color: colors[index] }),
    );
    root.add(mesh);
    pack.add(root);
  });
  scene.updateMatrixWorld(true);
  return { scene, animations: [] };
}

test('generated pond-detail GLB is valid, embedded, and kept within its web budget', () => {
  const glb = readFileSync(POND_DETAILS_URL);
  assert.ok(glb.length >= 16 * 1024, 'pond asset is suspiciously small or empty');
  assert.ok(glb.length <= 150 * 1024, `pond asset exceeds 150KB (${glb.length} bytes)`);
  const document = parseGlb(glb);
  assert.match(document.asset?.generator || '', /Blender I\/O/i, 'asset must identify Blender glTF export');
  assert.equal(document.buffers?.length, 1, 'GLB should use one embedded browser-friendly buffer');
  assert.equal(document.buffers?.[0]?.uri, undefined, 'GLB must not depend on an external binary file');
  assert.ok((document.meshes?.length || 0) >= 3, 'pond pack must contain nontrivial mesh detail');
  assert.ok((document.animations?.length || 0) >= 1, 'pond wildlife must retain its looping animation data');
});

test('pond asset pack exposes every stable root and contains no Draco dependency', () => {
  const document = parseGlb(readFileSync(POND_DETAILS_URL));
  const nodeNames = new Set((document.nodes || []).map((node) => node.name));
  for (const name of ['Lily_Pad_Asset', 'Mist_Wisp_Asset', 'Fly_Swarm_Asset']) {
    assert.ok(nodeNames.has(name), `generated GLB is missing ${name}`);
  }
  assert.ok(!(document.extensionsUsed || []).includes('KHR_draco_mesh_compression'),
    'GLB must load without a Draco decoder');
  assert.doesNotMatch(JSON.stringify(document), /KHR_draco_mesh_compression/,
    'no mesh primitive may retain a hidden Draco extension');
});

test('Blender pond generator keeps deterministic roots and a safe uncompressed exporter contract', () => {
  const source = readFileSync(POND_GENERATOR_URL, 'utf8');
  for (const name of ['Lily_Pad_Asset', 'Mist_Wisp_Asset', 'Fly_Swarm_Asset']) {
    assert.match(source, new RegExp(`create_empty\\(\\"${name}\\"`),
      `generator must author the stable ${name} root`);
  }
  assert.match(source, /["']export_draco_mesh_compression_enable["']\s*:\s*False/,
    'generator must explicitly disable Draco compression');
  assert.doesNotMatch(source, /["']export_draco_mesh_compression_enable["']\s*:\s*True/,
    'generator must never require a Draco-capable browser');
  assert.match(source, /get_rna_type\(\)\.properties/,
    'generator must filter exporter options against the installed Blender RNA API');
  assert.match(source, /choices=\(["']AUTO["'],\s*["']GLB["'],\s*["']GLTF["']\)/,
    'generator CLI must retain explicit GLB and GLTF modes');
  assert.match(source, /if not 1 <= args\.flies <= 12:/,
    'every successful export must retain a non-empty Fly_Swarm_Asset');
  assert.match(source, /--flies must be between 1 and 12/,
    'invalid empty fly packs need a clear CLI error');
});

test('pond asset failures and stalls remain bounded cosmetic failures', async () => {
  const rejected = new PondEcologyField(new THREE.Scene(), null, {
    assetUrl: '/missing-pond-details.glb',
    loadTimeoutMs: 100,
    loaderFactory: () => ({ loadAsync: () => Promise.reject(new Error('404 pond asset')) }),
  });
  await assert.doesNotReject(() => rejected.prepare());
  assert.equal(rejected.ready, false);
  assert.equal(rejected.getStats().failed, true);
  assert.match(rejected.getStats().error, /404 pond asset/);
  assert.equal(rejected.getStats().loading, false);
  rejected.dispose();

  const stalled = new PondEcologyField(new THREE.Scene(), null, {
    loadTimeoutMs: 15,
    loaderFactory: () => ({ loadAsync: () => new Promise(() => {}) }),
  });
  await assert.doesNotReject(() => stalled.prepare());
  assert.equal(stalled.ready, false);
  assert.equal(stalled.getStats().failed, true);
  assert.match(stalled.getStats().error, /timed out after 15ms/);
  assert.equal(stalled.getStats().loading, false);
  stalled.dispose();
});

test('disposing an in-flight pond load permits a clean scaled reload and rejects late attachment', async () => {
  const scene = new THREE.Scene();
  const stale = createTestPondGltf();
  let staleGeometryDisposals = 0;
  stale.scene.traverse((node) => {
    node.geometry?.addEventListener?.('dispose', () => { staleGeometryDisposals++; });
  });
  const fresh = createTestPondGltf(2);
  let resolveStale = null;
  let attempts = 0;
  const field = new PondEcologyField(scene, null, {
    loadTimeoutMs: 200,
    loaderFactory: () => ({
      loadAsync: () => {
        attempts++;
        if (attempts === 1) return new Promise((resolve) => { resolveStale = resolve; });
        return Promise.resolve(fresh);
      },
    }),
  });

  const abandoned = field.prepare();
  await Promise.resolve();
  assert.equal(attempts, 1, 'the first asynchronous load must have started');
  field.dispose();
  await abandoned;
  assert.equal(field.ready, false);

  await field.prepare();
  assert.equal(field.ready, true);
  assert.equal(attempts, 2);
  assert.equal(field.group.parent, scene, 're-prepare must reattach a disposed ecology group');
  const activePad = field.padMesh;
  const padSize = activePad.geometry.boundingBox.getSize(new THREE.Vector3());
  assert.ok(Math.abs(padSize.x - 2) < 1e-6, 'authored pack --scale must survive runtime baking');

  resolveStale(stale);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(field.padMesh, activePad, 'a late stale load must not replace the active meshes');
  assert.ok(staleGeometryDisposals >= 3, 'late imported geometry must be disposed');
  field.dispose();
  assert.equal(scene.children.length, 0);
});

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
