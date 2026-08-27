import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import * as THREE from '../src/public/worldloom/vendor/three.module.min.js';
import { BLOCK, BLOCKS } from '../src/public/worldloom/src/blocks.js';
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
import {
  PondEcologyField,
  pondFlyOffset,
} from '../src/public/worldloom/src/pond-ecology.js';
import {
  HangingLeavesField,
  hangingLeafCollisionPush,
  timeCorrectedDamping,
} from '../src/public/worldloom/src/hanging-leaves.js';
import { GroundLeafField } from '../src/public/worldloom/src/ground-leaves.js';
import { SummitCrossField } from '../src/public/worldloom/src/summit-crosses.js';

function meshSummary(root) {
  const meshes = [];
  root.traverse((node) => { if (node.isMesh) meshes.push(node); });
  return meshes;
}

const POND_DETAILS_URL = new URL(
  '../src/public/worldloom/assets/environment/pond-details.glb',
  import.meta.url,
);
const POND_ATLAS_URL = new URL(
  '../src/public/worldloom/assets/environment/pond-lily-atlas.png',
  import.meta.url,
);
const POND_GENERATOR_URL = new URL('../tools/generate_pond_assets.py', import.meta.url);
const HANGING_LEAVES_URL = new URL(
  '../src/public/worldloom/assets/environment/hanging-tree-leaves.glb',
  import.meta.url,
);
const HANGING_LEAVES_ATLAS_URL = new URL(
  '../src/public/worldloom/assets/environment/hanging-tree-leaves-atlas.png',
  import.meta.url,
);
const HANGING_LEAVES_GENERATOR_URL = new URL(
  '../tools/generate_hanging_leaves.py',
  import.meta.url,
);
const GROUND_LEAVES_URL = new URL(
  '../src/public/worldloom/assets/environment/ground-leaf-litter.glb',
  import.meta.url,
);
const GROUND_LEAVES_ATLAS_URL = new URL(
  '../src/public/worldloom/assets/environment/ground-leaf-litter-atlas.png',
  import.meta.url,
);
const FALLING_LEAF_PARTICLE_URL = new URL(
  '../src/public/worldloom/assets/environment/falling-leaf-particle.png',
  import.meta.url,
);
const GROUND_LEAVES_SOURCE_URL = new URL(
  '../tools/assets/ground-leaf-textures/gpt-ground-leaves-source.png',
  import.meta.url,
);
const GROUND_LEAVES_PROMPT_URL = new URL(
  '../tools/assets/ground-leaf-textures/PROMPT.md',
  import.meta.url,
);
const GROUND_LEAVES_GENERATOR_URL = new URL('../tools/generate_ground_leaves.py', import.meta.url);
const SUMMIT_CROSS_URL = new URL(
  '../src/public/worldloom/assets/environment/summit-cross.glb',
  import.meta.url,
);
const SUMMIT_CROSS_ATLAS_URL = new URL(
  '../src/public/worldloom/assets/environment/summit-cross-wood-atlas.png',
  import.meta.url,
);
const SUMMIT_CROSS_SOURCE_URL = new URL(
  '../tools/assets/summit-cross-textures/gpt-summit-cross-wood-source.png',
  import.meta.url,
);
const SUMMIT_CROSS_GENERATOR_URL = new URL('../tools/generate_summit_cross.py', import.meta.url);
const BIRD_ASSET_URL = new URL(
  '../src/public/worldloom/assets/birds/worldloom-birds.glb',
  import.meta.url,
);
const BIRD_ATLAS_URL = new URL(
  '../src/public/worldloom/assets/birds/worldloom-birds-atlas.png',
  import.meta.url,
);
const BIRD_SOURCE_URL = new URL(
  '../tools/assets/bird-textures/gpt-bird-breeds-source.png',
  import.meta.url,
);
const BIRD_PROMPT_URL = new URL('../tools/assets/bird-textures/PROMPTS.md', import.meta.url);
const BIRD_README_URL = new URL('../tools/assets/bird-textures/README.md', import.meta.url);
const BIRD_GENERATOR_URL = new URL('../tools/generate_bird_assets.py', import.meta.url);
const MOON_TEXTURE_URL = new URL(
  '../src/public/worldloom/assets/environment/realistic-moon.png',
  import.meta.url,
);
const MOON_SOURCE_URL = new URL(
  '../tools/assets/moon-textures/gpt-realistic-moon-source.png',
  import.meta.url,
);
const MOON_PROMPT_URL = new URL('../tools/assets/moon-textures/PROMPT.md', import.meta.url);
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

function embeddedBufferView(buffer, document, viewIndex) {
  const view = document.bufferViews?.[viewIndex];
  assert.ok(view, `GLB is missing bufferView ${viewIndex}`);
  const jsonLength = buffer.readUInt32LE(12);
  const binaryStart = 20 + jsonLength + 8;
  const start = binaryStart + (view.byteOffset || 0);
  return buffer.subarray(start, start + view.byteLength);
}

function pngMetadata(buffer) {
  assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'atlas must be PNG');
  assert.equal(buffer.subarray(12, 16).toString('ascii'), 'IHDR', 'atlas PNG must start with IHDR');
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    bitDepth: buffer[24],
    colorType: buffer[25],
  };
}

function paethPredictor(left, above, upperLeft) {
  const estimate = left + above - upperLeft;
  const leftDistance = Math.abs(estimate - left);
  const aboveDistance = Math.abs(estimate - above);
  const diagonalDistance = Math.abs(estimate - upperLeft);
  if (leftDistance <= aboveDistance && leftDistance <= diagonalDistance) return left;
  return aboveDistance <= diagonalDistance ? above : upperLeft;
}

function decodeRgbaPng(buffer) {
  const metadata = pngMetadata(buffer);
  assert.equal(metadata.bitDepth, 8, 'palette test requires an 8-bit PNG');
  assert.equal(metadata.colorType, 6, 'palette test requires an RGBA PNG');
  const idat = [];
  for (let offset = 8; offset + 12 <= buffer.length;) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    if (type === 'IDAT') idat.push(buffer.subarray(offset + 8, offset + 8 + length));
    offset += length + 12;
    if (type === 'IEND') break;
  }
  const packed = inflateSync(Buffer.concat(idat));
  const bytesPerPixel = 4;
  const stride = metadata.width * bytesPerPixel;
  assert.equal(packed.length, (stride + 1) * metadata.height);
  const pixels = Buffer.alloc(stride * metadata.height);
  let source = 0;
  for (let y = 0; y < metadata.height; y++) {
    const filter = packed[source++];
    const rowStart = y * stride;
    for (let x = 0; x < stride; x++) {
      const raw = packed[source++];
      const left = x >= bytesPerPixel ? pixels[rowStart + x - bytesPerPixel] : 0;
      const above = y > 0 ? pixels[rowStart + x - stride] : 0;
      const upperLeft = y > 0 && x >= bytesPerPixel
        ? pixels[rowStart + x - stride - bytesPerPixel]
        : 0;
      let reconstructed = raw;
      if (filter === 1) reconstructed += left;
      else if (filter === 2) reconstructed += above;
      else if (filter === 3) reconstructed += Math.floor((left + above) / 2);
      else if (filter === 4) reconstructed += paethPredictor(left, above, upperLeft);
      else assert.equal(filter, 0, `unsupported PNG row filter ${filter}`);
      pixels[rowStart + x] = reconstructed & 0xff;
    }
  }
  return { ...metadata, pixels };
}

function descendantNodeIndices(document, rootName) {
  const rootIndex = (document.nodes || []).findIndex((node) => node.name === rootName);
  assert.notEqual(rootIndex, -1, `generated GLB is missing ${rootName}`);
  const indices = [];
  const pending = [rootIndex];
  while (pending.length) {
    const index = pending.pop();
    indices.push(index);
    pending.push(...(document.nodes[index]?.children || []));
  }
  return indices;
}

function createTestPondGltf(packScale = 1) {
  const scene = new THREE.Scene();
  const pack = new THREE.Group();
  pack.name = 'Pond_Detail_Asset_Pack';
  pack.scale.setScalar(packScale);
  scene.add(pack);
  const colors = [0x4a8b45, 0xb9d4d2, 0x211c17];
  const atlasTexture = new THREE.DataTexture(
    new Uint8Array([74, 139, 69, 255]),
    1,
    1,
    THREE.RGBAFormat,
  );
  atlasTexture.name = 'Fake embedded pond lily atlas';
  atlasTexture.colorSpace = THREE.SRGBColorSpace;
  atlasTexture.needsUpdate = true;
  ['Lily_Pad_Asset', 'Mist_Wisp_Asset', 'Fly_Swarm_Asset'].forEach((name, index) => {
    const root = new THREE.Group();
    root.name = name;
    const material = new THREE.MeshStandardMaterial({ color: colors[index] });
    if (index === 0) material.map = atlasTexture;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.1 + index * 0.05, 1),
      material,
    );
    root.add(mesh);
    pack.add(root);
  });
  scene.updateMatrixWorld(true);
  return { scene, animations: [], atlasTexture };
}

function createTestHangingLeafGltf(packScale = 1) {
  const scene = new THREE.Scene();
  const pack = new THREE.Group();
  pack.name = 'Hanging_Leaf_Asset_Pack';
  pack.scale.setScalar(packScale);
  scene.add(pack);
  const root = new THREE.Group();
  root.name = 'Hanging_Leaf_Asset';
  pack.add(root);
  const atlasTexture = new THREE.DataTexture(
    new Uint8Array([38, 122, 55, 255]),
    1,
    1,
    THREE.RGBAFormat,
  );
  atlasTexture.name = 'Fake embedded hanging-leaf atlas';
  atlasTexture.colorSpace = THREE.SRGBColorSpace;
  atlasTexture.needsUpdate = true;
  const material = new THREE.MeshStandardMaterial({
    map: atlasTexture,
    side: THREE.DoubleSide,
  });
  const geometry = new THREE.BoxGeometry(0.42, 0.5, 0.08);
  geometry.translate(0, -0.25, 0);
  const segment = new THREE.Mesh(geometry, material);
  segment.name = 'Hanging_Leaf_Segment';
  root.add(segment);
  scene.updateMatrixWorld(true);
  return { scene, animations: [], atlasTexture };
}

function createTestGroundLeafGltf() {
  const scene = new THREE.Scene();
  const root = new THREE.Group();
  root.name = 'Ground_Leaf_Litter_Asset';
  scene.add(root);
  const atlasTexture = new THREE.DataTexture(
    new Uint8Array([77, 125, 81, 255]),
    1,
    1,
    THREE.RGBAFormat,
  );
  atlasTexture.name = 'Fake embedded GPT ground-leaf atlas';
  atlasTexture.colorSpace = THREE.SRGBColorSpace;
  atlasTexture.needsUpdate = true;
  const patch = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshStandardMaterial({ map: atlasTexture, side: THREE.DoubleSide }),
  );
  patch.name = 'Ground_Leaf_Litter_Patch';
  patch.rotation.x = -Math.PI * 0.5;
  root.add(patch);
  scene.updateMatrixWorld(true);
  return { scene, animations: [], atlasTexture };
}

function createTestSummitCrossGltf() {
  const scene = new THREE.Scene();
  const root = new THREE.Group();
  root.name = 'Summit_Cross_Asset';
  scene.add(root);
  const atlasTexture = new THREE.DataTexture(
    new Uint8Array([91, 58, 29, 255]),
    1,
    1,
    THREE.RGBAFormat,
  );
  atlasTexture.name = 'Fake embedded GPT summit-cross wood atlas';
  atlasTexture.colorSpace = THREE.SRGBColorSpace;
  atlasTexture.needsUpdate = true;
  const wood = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 7, 0.38),
    new THREE.MeshStandardMaterial({ map: atlasTexture, roughness: 0.91 }),
  );
  wood.name = 'Summit_Cross_Wood';
  wood.position.y = 3.5;
  root.add(wood);
  const iron = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.15, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x18130f }),
  );
  iron.name = 'Summit_Cross_Iron_Pegs';
  iron.position.y = 5.12;
  root.add(iron);
  scene.updateMatrixWorld(true);
  return { scene, animations: [], atlasTexture };
}

test('Blender summit-cross GLB is a self-contained traditional Latin cross within web budgets', () => {
  const glb = readFileSync(SUMMIT_CROSS_URL);
  assert.ok(glb.length >= 8 * 1024, 'summit-cross GLB is suspiciously small or empty');
  assert.ok(glb.length <= 128 * 1024, `summit-cross GLB exceeds 128KB (${glb.length} bytes)`);
  const document = parseGlb(glb);
  assert.match(document.asset?.generator || '', /Blender I\/O/i,
    'summit cross must identify the Blender glTF exporter');
  assert.equal(document.buffers?.length, 1);
  assert.equal(document.buffers?.[0]?.uri, undefined,
    'summit cross cannot depend on an external geometry buffer');
  assert.ok(!(document.extensionsUsed || []).includes('KHR_draco_mesh_compression'));
  assert.doesNotMatch(JSON.stringify(document), /KHR_draco_mesh_compression/);

  const root = (document.nodes || []).find((node) => node.name === 'Summit_Cross_Asset');
  assert.ok(root, 'summit cross lost its stable runtime root');
  assert.equal(root.extras?.asset_role, 'mountain_summit_latin_cross');
  assert.equal(root.extras?.height_metres, 7);
  assert.equal(root.extras?.crossbeam_height_metres, 5.12);
  assert.equal(root.extras?.runtime_draw_budget, 2);
  assert.equal(root.extras?.gpt_texture_source, 'gpt-summit-cross-wood-source.png');
  assert.equal(root.extras?.triangle_count, 176);
  const descendantNames = new Set(descendantNodeIndices(document, 'Summit_Cross_Asset')
    .map((index) => document.nodes[index]?.name));
  assert.ok(descendantNames.has('Summit_Cross_Wood'));
  assert.ok(descendantNames.has('Summit_Cross_Iron_Pegs'));
  assert.equal(document.meshes?.length, 2, 'cross must stay within its two-draw material budget');
  const primitives = (document.meshes || []).flatMap((mesh) => mesh.primitives || []);
  assert.equal(primitives.length, 2);
  assert.ok(primitives.every((primitive) => Number.isInteger(primitive.attributes?.TEXCOORD_0)),
    'both authored materials must retain stable UV coordinates');
  const triangles = primitives.reduce((total, primitive) => {
    const accessor = document.accessors?.[primitive.indices]
      || document.accessors?.[primitive.attributes?.POSITION];
    return total + (accessor?.count || 0) / 3;
  }, 0);
  assert.equal(triangles, 176);
});

test('summit-cross GLB embeds the exact nearest-filtered GPT-derived pixel atlas', () => {
  const glb = readFileSync(SUMMIT_CROSS_URL);
  const document = parseGlb(glb);
  const atlas = readFileSync(SUMMIT_CROSS_ATLAS_URL);
  assert.deepEqual(pngMetadata(atlas), {
    width: 128,
    height: 64,
    bitDepth: 8,
    colorType: 6,
  });
  assert.equal(document.images?.length, 1);
  assert.equal(document.images[0]?.uri, undefined);
  assert.equal(document.images[0]?.mimeType, 'image/png');
  assert.deepEqual(embeddedBufferView(glb, document, document.images[0].bufferView), atlas,
    'embedded and separately served summit-cross atlases must be byte-identical');
  const material = document.materials?.find((entry) => entry.name === 'Summit_Cross_Hand_Hewn_Wood');
  assert.equal(material?.extras?.source_texture, 'gpt-summit-cross-wood-source.png');
  assert.equal(material?.pbrMetallicRoughness?.metallicFactor, 0);
  assert.ok(material?.pbrMetallicRoughness?.roughnessFactor >= 0.9);
  const texture = document.textures?.[material?.pbrMetallicRoughness?.baseColorTexture?.index];
  const sampler = document.samplers?.[texture?.sampler];
  assert.equal(sampler?.magFilter, 9728);
  assert.ok([9728, 9984].includes(sampler?.minFilter));
});

test('Blender summit-cross generator preserves its GPT source and reproducible export contract', () => {
  const generator = readFileSync(SUMMIT_CROSS_GENERATOR_URL, 'utf8');
  const source = readFileSync(SUMMIT_CROSS_SOURCE_URL);
  assert.ok(source.length >= 256 * 1024, 'GPT-image wood source is missing or unexpectedly tiny');
  for (const name of ['Summit_Cross_Asset', 'Summit_Cross_Wood', 'Summit_Cross_Iron_Pegs']) {
    assert.match(generator, new RegExp(name));
  }
  assert.match(generator, /gpt-summit-cross-wood-source\.png/);
  assert.match(generator, /root\["height_metres"\]\s*=\s*7\.0/);
  assert.match(generator, /root\["crossbeam_height_metres"\]\s*=\s*5\.12/);
  assert.match(generator, /texture\.interpolation\s*=\s*["']Closest["']/);
  assert.match(generator, /["']export_draco_mesh_compression_enable["']\s*:\s*False/);
  assert.match(generator, /["']export_texcoords["']\s*:\s*True/);
});

test('summit-cross field instances the Blender model and removes unsupported monuments', async () => {
  const scene = new THREE.Scene();
  const field = new SummitCrossField(scene, {
    loaderFactory: () => ({ loadAsync: () => Promise.resolve(createTestSummitCrossGltf()) }),
  });
  await field.prepare();
  assert.equal(field.ready, true);
  assert.equal(field.meshes?.wood?.isInstancedMesh, true);
  assert.equal(field.meshes?.iron?.isInstancedMesh, true);
  assert.equal(field.meshes?.wood?.material?.map?.magFilter, THREE.NearestFilter);
  assert.equal(field.meshes?.wood?.material?.map?.minFilter, THREE.NearestFilter);
  const cross = Object.freeze({
    id: '0,0',
    rootX: 10,
    rootY: 71,
    rootZ: 12,
    summitHeight: 70,
    axis: 'x',
    asset: 'summit-cross.glb',
    modelHeight: 7,
    crossbeamHeight: 5.12,
  });
  let supported = true;
  let requestedRadius = 0;
  const world = {
    streamRevision: 1,
    detailDistance: 8,
    getMountainCrossesNear: (x, z, radius) => {
      requestedRadius = radius;
      return [cross];
    },
    isPositionReady: () => true,
    getBlock: (x, y, z) => (
      x === cross.rootX && y === cross.summitHeight && z === cross.rootZ && supported
        ? BLOCK.STONE
        : BLOCK.AIR
    ),
  };
  field.setWorld(world);
  field.setQuality({ shadows: true });
  field.update(0, new THREE.Vector3(10, 72, 12), 20);
  assert.equal(requestedRadius, 160,
    'maximum visual distance must not scan mountain props beyond the detailed stream radius');
  assert.deepEqual(field.getStats(), {
    ready: true,
    failed: false,
    loading: false,
    error: '',
    crosses: 1,
    draws: 2,
    triangles: 24,
    assetUrl: field.assetUrl,
    gptTexture: true,
    nearestTexture: true,
  });
  assert.ok([...field.meshes.wood.instanceMatrix.array].every(Number.isFinite));
  assert.ok([...field.meshes.iron.instanceMatrix.array].every(Number.isFinite));
  const matrix = new THREE.Matrix4();
  field.meshes.wood.getMatrixAt(0, matrix);
  const position = new THREE.Vector3().setFromMatrixPosition(matrix);
  assert.ok(position.distanceTo(new THREE.Vector3(10.5, 70.82, 12.5)) < 1e-6);

  supported = false;
  world.streamRevision++;
  field.update(0.5, new THREE.Vector3(10, 72, 12), 4);
  assert.equal(field.getStats().crosses, 0,
    'breaking or unloading mountain support must hide the decorative model');
  field.dispose();
  assert.equal(scene.children.length, 0);
});

test('summit-cross asset failures remain bounded cosmetic failures', async () => {
  const field = new SummitCrossField(new THREE.Scene(), {
    assetUrl: '/missing-summit-cross.glb',
    loadTimeoutMs: 100,
    loaderFactory: () => ({ loadAsync: () => Promise.reject(new Error('404 summit cross')) }),
  });
  await assert.doesNotReject(() => field.prepare());
  assert.equal(field.ready, false);
  assert.equal(field.getStats().failed, true);
  assert.match(field.getStats().error, /404 summit cross/);
  assert.equal(field.getStats().loading, false);
  field.dispose();
});

test('Blender bird GLB keeps two articulated breeds, named clips, and strict web budgets', () => {
  const glb = readFileSync(BIRD_ASSET_URL);
  assert.ok(glb.length >= 64 * 1024, 'animated bird GLB is suspiciously small or empty');
  assert.ok(glb.length <= 192 * 1024, `animated bird GLB exceeds 192KB (${glb.length} bytes)`);
  const document = parseGlb(glb);
  assert.equal(document.asset?.version, '2.0');
  assert.match(document.asset?.generator || '', /Blender I\/O/i,
    'bird asset must identify the Blender glTF exporter');
  assert.equal(document.buffers?.length, 1);
  assert.equal(document.buffers?.[0]?.uri, undefined,
    'bird GLB cannot depend on an external geometry buffer');
  assert.ok(!(document.extensionsUsed || []).includes('KHR_draco_mesh_compression'));
  assert.doesNotMatch(JSON.stringify(document), /KHR_draco_mesh_compression/,
    'no bird primitive may silently require a Draco decoder');

  const breedPrefixes = ['Ash_Sparrow', 'Pond_Azurefin'];
  const requiredParts = ['Body', 'Head', 'Tail', 'Wing_L', 'Wing_R', 'Leg_L', 'Leg_R'];
  let totalTriangles = 0;
  for (const prefix of breedPrefixes) {
    const rootName = `${prefix}_Asset`;
    const descendantIndices = descendantNodeIndices(document, rootName);
    const descendantNames = new Set(descendantIndices.map((index) => document.nodes[index]?.name));
    for (const part of requiredParts) {
      assert.ok(descendantNames.has(`${prefix}_${part}`), `${rootName} is missing articulated ${part}`);
    }
    const primitives = descendantIndices
      .map((index) => document.nodes[index])
      .filter((node) => Number.isInteger(node?.mesh))
      .flatMap((node) => document.meshes[node.mesh]?.primitives || []);
    assert.equal(primitives.length, 7,
      `${rootName} should retain one merged mesh for each animated body part`);
    assert.ok(primitives.every((primitive) => Number.isInteger(primitive.attributes?.TEXCOORD_0)),
      `${rootName} lost pixel-atlas UV coordinates`);
    assert.equal(new Set(primitives.map((primitive) => primitive.material)).size, 1,
      `${rootName} should share one bird atlas material`);
    const triangles = primitives.reduce((total, primitive) => {
      const accessor = document.accessors?.[primitive.indices]
        || document.accessors?.[primitive.attributes?.POSITION];
      return total + (accessor?.count || 0) / 3;
    }, 0);
    assert.ok(triangles > 200, `${rootName} contains too little authored geometry (${triangles} triangles)`);
    assert.ok(triangles <= 384, `${rootName} exceeded its 384-triangle budget (${triangles})`);
    totalTriangles += triangles;
  }
  assert.ok(totalTriangles <= 768, `two-breed pack exceeded 768 triangles (${totalTriangles})`);

  const clipSuffixes = [
    'Perch_Idle_Loop',
    'Flight_Loop',
    'Takeoff',
    'Landing',
    'Pond_Peck_Loop',
    'Ground_Idle_Loop',
  ];
  const expectedClipNames = breedPrefixes
    .flatMap((prefix) => clipSuffixes.map((suffix) => `${prefix}_${suffix}`))
    .sort();
  assert.deepEqual((document.animations || []).map((clip) => clip.name).sort(), expectedClipNames,
    'each breed must retain all six named behavior clips');
  for (const animation of document.animations || []) {
    const prefix = breedPrefixes.find((candidate) => animation.name.startsWith(candidate));
    assert.ok(prefix, `unexpected unscoped bird clip ${animation.name}`);
    const animatedNodes = new Set(animation.channels.map((channel) => (
      document.nodes?.[channel.target?.node]?.name
    )));
    for (const part of requiredParts) {
      assert.ok(animatedNodes.has(`${prefix}_${part}`), `${animation.name} does not animate ${part}`);
    }
    assert.equal(animation.channels.length, 21,
      `${animation.name} should contain position, rotation and scale channels for seven pivots`);
    const duration = Math.max(...animation.samplers.map((sampler) => (
      Number(document.accessors?.[sampler.input]?.max?.[0]) || 0
    )));
    assert.ok(duration >= 0.75 && duration <= 3,
      `${animation.name} has an implausible ${duration}s authored duration`);
  }
});

test('bird GLB embeds the exact nearest-filtered two-breed pixel atlas', () => {
  const glb = readFileSync(BIRD_ASSET_URL);
  const document = parseGlb(glb);
  const atlasBuffer = readFileSync(BIRD_ATLAS_URL);
  assert.ok(atlasBuffer.length >= 1024 && atlasBuffer.length <= 16 * 1024,
    `bird atlas escaped its compact web budget (${atlasBuffer.length} bytes)`);
  assert.deepEqual(pngMetadata(atlasBuffer), {
    width: 128,
    height: 64,
    bitDepth: 8,
    colorType: 6,
  }, 'production bird atlas must remain an exact 128x64 RGBA PNG');
  assert.equal(document.images?.length, 1, 'bird pack should embed exactly one atlas');
  const image = document.images[0];
  assert.equal(image.uri, undefined, 'bird GLB cannot make an extra atlas request');
  assert.equal(image.mimeType, 'image/png');
  assert.deepEqual(embeddedBufferView(glb, document, image.bufferView), atlasBuffer,
    'embedded and separately served bird atlases must be byte-identical');

  const material = document.materials?.find((candidate) => candidate.name === 'Worldloom_Bird_Pixel_Atlas');
  assert.ok(material, 'bird pack lost its stable atlas material');
  assert.equal(material.pbrMetallicRoughness?.metallicFactor, 0);
  assert.ok(material.pbrMetallicRoughness?.roughnessFactor >= 0.85);
  assert.equal(material.emissiveFactor, undefined, 'natural birds cannot carry emissive plumage');
  const texture = document.textures?.[
    material.pbrMetallicRoughness?.baseColorTexture?.index
  ];
  const sampler = document.samplers?.[texture?.sampler];
  assert.equal(sampler?.magFilter, 9728, 'bird atlas must use NEAREST magnification');
  assert.ok([9728, 9984].includes(sampler?.minFilter),
    `bird atlas minification introduced smoothing (${sampler?.minFilter})`);
  assert.equal(sampler?.wrapS, 33071);
  assert.equal(sampler?.wrapT, 33071);

  const decoded = decodeRgbaPng(atlasBuffer);
  const summaries = [];
  for (let half = 0; half < 2; half++) {
    const colors = new Set();
    const sums = [0, 0, 0];
    let opaque = 0;
    for (let y = 0; y < decoded.height; y++) {
      for (let x = half * 64; x < (half + 1) * 64; x++) {
        const offset = (y * decoded.width + x) * 4;
        assert.equal(decoded.pixels[offset + 3], 255, 'production atlas tiles must stay fully opaque');
        const rgb = decoded.pixels.subarray(offset, offset + 3);
        colors.add(rgb.toString('hex'));
        sums[0] += rgb[0];
        sums[1] += rgb[1];
        sums[2] += rgb[2];
        opaque++;
      }
    }
    assert.ok(colors.size >= 12, `breed half ${half} lost its readable pixel palette`);
    summaries.push(sums.map((sum) => sum / opaque));
  }
  assert.ok(summaries[0][0] > summaries[0][2] + 40,
    'Ash Sparrow half lost its warm chestnut color identity');
  assert.ok(summaries[1][1] > summaries[1][0] + 5 && summaries[1][2] > summaries[1][0] + 5,
    'Pond Azurefin half lost its cool blue/teal color identity');
});

test('bird generator preserves the GPT-image source and reproducible Blender pipeline', () => {
  const sourceBuffer = readFileSync(BIRD_SOURCE_URL);
  assert.ok(sourceBuffer.length >= 256 * 1024,
    'preserved GPT-image source is suspiciously small or replaced by the production atlas');
  assert.deepEqual(pngMetadata(sourceBuffer), {
    width: 1254,
    height: 1254,
    bitDepth: 8,
    colorType: 6,
  }, 'GPT-image production source must remain the original transparent RGBA sheet');
  const sourcePixels = decodeRgbaPng(sourceBuffer).pixels;
  let transparentPixels = 0;
  let opaquePixels = 0;
  for (let offset = 3; offset < sourcePixels.length; offset += 4) {
    if (sourcePixels[offset] === 0) transparentPixels++;
    if (sourcePixels[offset] >= 250) opaquePixels++;
  }
  assert.ok(transparentPixels > 100_000 && opaquePixels > 100_000,
    'GPT source must retain both transparent gutters and substantial bird artwork');

  const prompt = readFileSync(BIRD_PROMPT_URL, 'utf8');
  assert.match(prompt, /Tool:\s*built-in GPT Image generation/i);
  assert.match(prompt, /Exact prompt:/i);
  assert.match(prompt, /ash sparrow/i);
  assert.match(prompt, /pond azurefin/i);
  assert.match(prompt, /original designs, not copied/i);
  assert.match(prompt, /transparent background/i);

  const readme = readFileSync(BIRD_README_URL, 'utf8');
  assert.match(readme, /preserved 1254[×x]1254 transparent GPT Image\s+source/i);
  assert.match(readme, /deterministically samples each half/i);
  assert.match(readme, /Blender 5\.2\.0 LTS/i);
  assert.match(readme, /No downloaded model,\s*texture,\s*rig,\s*or animation is used/i);

  const generator = readFileSync(BIRD_GENERATOR_URL, 'utf8');
  assert.match(generator, /DEFAULT_SOURCE\s*=.*gpt-bird-breeds-source\.png/);
  assert.match(generator, /ATLAS_WIDTH\s*=\s*128/);
  assert.match(generator, /ATLAS_HEIGHT\s*=\s*64/);
  assert.match(generator, /source_color_buckets\(/,
    'atlas generation must still sample the preserved GPT-image pixels');
  assert.match(generator, /random\.Random\(seed\s*\^/,
    'texture variation must use the requested deterministic seed');
  assert.match(generator, /texture\.interpolation\s*=\s*["']Closest["']/);
  assert.match(generator, /["']export_draco_mesh_compression_enable["']\s*:\s*False/);
  assert.match(generator, /["']export_animations["']\s*:\s*True/);
  assert.match(generator, /["']export_animation_mode["']\s*:\s*["']NLA_TRACKS["']/);
  for (const authoredName of [
    'Ash_Sparrow_Asset',
    'Pond_Azurefin_Asset',
    'Perch_Idle_Loop',
    'Flight_Loop',
    'Takeoff',
    'Landing',
    'Pond_Peck_Loop',
    'Ground_Idle_Loop',
  ]) {
    assert.match(generator, new RegExp(authoredName), `generator lost authored contract ${authoredName}`);
  }
});

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

  const sourceAtlas = pngMetadata(readFileSync(POND_ATLAS_URL));
  assert.deepEqual(sourceAtlas, { width: 64, height: 64, bitDepth: 8, colorType: 6 },
    'source pond atlas must remain an exact 64x64 RGBA PNG');
  assert.equal(document.images?.length, 1, 'one pond atlas should be embedded in the GLB');
  const embeddedImage = document.images[0];
  assert.equal(embeddedImage.uri, undefined, 'pond GLB cannot depend on an external atlas request');
  assert.equal(embeddedImage.mimeType, 'image/png');
  assert.ok(Number.isInteger(embeddedImage.bufferView));
  assert.deepEqual(
    pngMetadata(embeddedBufferView(glb, document, embeddedImage.bufferView)),
    sourceAtlas,
    'embedded atlas metadata must exactly match the authored source PNG',
  );
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

  const lilyNodes = descendantNodeIndices(document, 'Lily_Pad_Asset')
    .map((index) => document.nodes[index]);
  const lilyPrimitives = lilyNodes
    .filter((node) => Number.isInteger(node.mesh))
    .flatMap((node) => document.meshes[node.mesh]?.primitives || []);
  assert.equal(lilyPrimitives.length, 2,
    'authored lily should contain only its stepped pad and crossed-flower meshes');
  assert.ok(lilyPrimitives.every((primitive) => Number.isInteger(primitive.attributes?.TEXCOORD_0)),
    'every lily primitive must preserve its authored atlas UVs');
  assert.equal(new Set(lilyPrimitives.map((primitive) => primitive.material)).size, 1,
    'pad and crossed flower should share one atlas material for runtime baking');
  assert.ok(lilyPrimitives.every((primitive) => Number.isInteger(
    document.materials?.[primitive.material]?.pbrMetallicRoughness?.baseColorTexture?.index,
  )), 'every lily primitive must reference the embedded atlas texture');
  const lilyMaterial = document.materials?.[lilyPrimitives[0].material];
  assert.equal(lilyMaterial?.alphaMode, 'MASK', 'authored flower planes must export as alpha cutouts');
  assert.equal(lilyMaterial?.alphaCutoff ?? 0.5, 0.5,
    'omitted glTF alphaCutoff must resolve to the specification default of 0.5');
  assert.equal(lilyMaterial?.doubleSided, true, 'both crossed planes must render from every view');
  const lilyTexture = document.textures?.[
    lilyMaterial?.pbrMetallicRoughness?.baseColorTexture?.index
  ];
  const lilySampler = document.samplers?.[lilyTexture?.sampler];
  assert.equal(lilySampler?.magFilter, 9728, 'embedded atlas must use glTF NEAREST magnification');
  assert.ok([9728, 9984].includes(lilySampler?.minFilter),
    'embedded atlas must use nearest-only minification before runtime disables mipmaps');
  const lilyTriangles = lilyPrimitives.reduce((total, primitive) => {
    const count = document.accessors?.[primitive.indices]?.count
      || document.accessors?.[primitive.attributes?.POSITION]?.count
      || 0;
    return total + count / 3;
  }, 0);
  assert.ok(lilyTriangles <= 128, `lily authored geometry exceeded its 128-triangle budget (${lilyTriangles})`);

  const flyNodes = descendantNodeIndices(document, 'Fly_Swarm_Asset')
    .map((index) => document.nodes[index]);
  assert.ok(flyNodes.every((node) => !Number.isInteger(node.mesh)),
    'GLB must not ship superseded fly body/wing geometry; runtime owns the one-draw dots');
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
  assert.match(source, /["']export_texcoords["']\s*:\s*True/,
    'generator must export authored atlas UV coordinates');
  assert.match(source, /texture\.interpolation\s*=\s*["']Closest["']/,
    'generator must preserve hard pixel edges in Blender');
  assert.match(source, /--atlas/,
    'generator CLI must accept the exact atlas path used for reproducible builds');
  assert.doesNotMatch(source, /create_box\(["']Flower_Petal_|create_low_poly_cylinder\(["']Flower_(?:Stem|Core)/,
    'lily flower must remain two atlas-cutout planes rather than cylinder/cuboid petals');
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
  let staleAtlasDisposals = 0;
  stale.atlasTexture.addEventListener('dispose', () => { staleAtlasDisposals++; });
  stale.scene.traverse((node) => {
    node.geometry?.addEventListener?.('dispose', () => { staleGeometryDisposals++; });
  });
  const fresh = createTestPondGltf(2);
  let importedAtlasDisposals = 0;
  fresh.atlasTexture.addEventListener('dispose', () => { importedAtlasDisposals++; });
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
  assert.equal(importedAtlasDisposals, 1,
    'runtime must release the imported atlas after cloning its owned texture');
  const activePad = field.padMesh;
  const runtimeAtlas = activePad.material.map;
  let runtimeAtlasDisposals = 0;
  runtimeAtlas.addEventListener('dispose', () => { runtimeAtlasDisposals++; });
  const padSize = activePad.geometry.boundingBox.getSize(new THREE.Vector3());
  assert.ok(Math.abs(padSize.x - 2) < 1e-6, 'authored pack --scale must survive runtime baking');

  resolveStale(stale);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(field.padMesh, activePad, 'a late stale load must not replace the active meshes');
  assert.ok(staleGeometryDisposals >= 3, 'late imported geometry must be disposed');
  assert.equal(staleAtlasDisposals, 1, 'late imported atlas texture must be disposed');
  field.dispose();
  assert.equal(runtimeAtlasDisposals, 1, 'field disposal must release its cloned runtime atlas');
  assert.equal(scene.children.length, 0);
});

test('pond lily runtime keeps pixel UVs and atlas filtering within one instanced draw', async () => {
  const scene = new THREE.Scene();
  const gltf = createTestPondGltf();
  const field = new PondEcologyField(scene, null, {
    loaderFactory: () => ({ loadAsync: () => Promise.resolve(gltf) }),
  });
  await field.prepare();

  const pad = field.padMesh;
  assert.equal(pad.isInstancedMesh, true, 'all authored lily parts must bake into one instanced draw');
  assert.ok(pad.geometry.getAttribute('uv'), 'runtime lily baking must preserve TEXCOORD_0');
  assert.equal(pad.geometry.getAttribute('color'), undefined,
    'atlas lily cannot retain the old vertex-colour override');
  assert.ok(pad.material.map?.isTexture, 'lily material must own a clone of the embedded atlas');
  assert.notEqual(pad.material.map, gltf.atlasTexture,
    'runtime material must not retain an imported texture disposed with the glTF scene');
  assert.equal(pad.material.map.colorSpace, THREE.SRGBColorSpace);
  assert.equal(pad.material.map.magFilter, THREE.NearestFilter);
  assert.equal(pad.material.map.minFilter, THREE.NearestFilter);
  assert.equal(pad.material.map.generateMipmaps, false);
  assert.equal(pad.material.alphaTest, 0.5);
  assert.equal(pad.material.transparent, false);
  assert.equal(pad.material.depthWrite, true);
  assert.equal(pad.material.side, THREE.DoubleSide);
  assert.equal(field.group.children.filter((child) => child === pad).length, 1,
    'exactly one lily instanced mesh may be attached');

  field.dispose();
  assert.equal(scene.children.length, 0);
});

test('pond flies are tiny unlit dots with deterministic fast short-loop motion', async () => {
  const scene = new THREE.Scene();
  const field = new PondEcologyField(scene, null, {
    loaderFactory: () => ({ loadAsync: () => Promise.resolve(createTestPondGltf()) }),
  });
  await field.prepare();
  field.setWorld({
    getPondsNear: () => [{
      id: '-1,-1',
      cellX: -1,
      cellZ: -1,
      centerX: -14.5,
      centerZ: -19.5,
      radiusX: 5.8,
      radiusZ: 6.1,
      waterY: 38,
      phase: 6,
    }],
    isPositionReady: () => true,
    getFluidSurfaceY: () => 38.92,
  });
  field.setQuality({
    pondDetailRadius: 48,
    pondPadCap: 0,
    pondMistCap: 0,
    pondFlyCap: 1,
  }, false);
  field.update(0.05, new THREE.Vector3(-14.5, 39, -19.5), {
    dayAmount: 1,
    rainIntensity: 0,
    skyExposure: 1,
  });

  const flies = field.flyMesh;
  assert.equal(flies.isPoints, true, 'runtime flies must be point dots, not the authored winged mesh');
  assert.equal(flies.material.isPointsMaterial, true);
  assert.equal('emissive' in flies.material, false, 'flies cannot carry emissive glow');
  assert.notEqual(flies.material.lights, true, 'fly dots cannot depend on scene lights');
  assert.ok(Math.max(flies.material.color.r, flies.material.color.g, flies.material.color.b) < 0.08,
    'fly dots must remain near-black');
  assert.ok(flies.material.size <= 0.05, 'flies must stay tiny even at close range');
  assert.equal(flies.children.length, 0, 'no hidden wing or body model may remain attached');
  assert.equal(flies.geometry.index, null);
  assert.equal(flies.geometry.getAttribute('normal'), undefined);
  assert.equal(flies.geometry.drawRange.count, 5);

  const stats = field.getStats();
  assert.deepEqual({
    swarms: stats.flySwarms,
    dots: stats.flyDots,
    draws: stats.draws,
    triangles: stats.triangles,
  }, {
    swarms: 1,
    dots: 5,
    draws: 1,
    triangles: 0,
  }, 'fly-only ecology must fit one draw and zero triangle work');
  assert.equal(flies.userData.drawBudget, 1);
  assert.equal(flies.userData.triangleBudget, 0);

  const position = flies.geometry.getAttribute('position');
  const firstFrame = Array.from(position.array.slice(0, stats.flyDots * 3));
  for (let index = 0; index < stats.flyDots; index++) {
    assert.ok(firstFrame[index * 3 + 1] > 38.92,
      'every fly must remain visibly above the pond water surface');
  }
  field.update(0.05, new THREE.Vector3(-14.5, 39, -19.5), {
    dayAmount: 1,
    rainIntensity: 0,
    skyExposure: 1,
  });
  assert.notDeepEqual(
    Array.from(position.array.slice(0, stats.flyDots * 3)),
    firstFrame,
    'flies need quick visible movement rather than a slow decorative orbit',
  );

  const anchor = field.flyAnchors[0];
  let previous = null;
  let previousVelocity = null;
  let pathLength = 0;
  let directionChanges = 0;
  let maximumRadius = 0;
  let maximumHeightOffset = 0;
  for (let sample = 0; sample <= 100; sample++) {
    const time = sample * 0.03;
    const point = pondFlyOffset(anchor, 2, time, 1, new THREE.Vector3());
    assert.deepEqual(
      pondFlyOffset(anchor, 2, time, 1, new THREE.Vector3()).toArray(),
      point.toArray(),
      'fly motion must replay deterministically',
    );
    maximumRadius = Math.max(maximumRadius, Math.hypot(point.x, point.z));
    maximumHeightOffset = Math.max(maximumHeightOffset, Math.abs(point.y));
    if (previous) {
      const velocity = point.clone().sub(previous);
      pathLength += velocity.length();
      if (previousVelocity
        && velocity.clone().normalize().dot(previousVelocity.clone().normalize()) < 0.7) {
        directionChanges++;
      }
      previousVelocity = velocity;
    }
    previous = point;
  }
  assert.ok(pathLength > 3, `flies moved too slowly (${pathLength.toFixed(2)}m path)`);
  assert.ok(directionChanges >= 8, `flies need erratic turns (${directionChanges} detected)`);
  assert.ok(maximumRadius < 0.32, `fly loops spread too far from pond anchor (${maximumRadius})`);
  assert.ok(maximumHeightOffset < 0.08, `fly loops bob too far vertically (${maximumHeightOffset})`);

  field.dispose();
  assert.equal(scene.children.length, 0);
});

test('Blender ground-leaf litter is a self-contained one-draw GPT-textured asset', () => {
  const glb = readFileSync(GROUND_LEAVES_URL);
  assert.ok(glb.length >= 4 * 1024, 'ground-leaf GLB is suspiciously small or empty');
  assert.ok(glb.length <= 128 * 1024, `ground-leaf GLB exceeds 128KB (${glb.length} bytes)`);
  const document = parseGlb(glb);
  assert.match(document.asset?.generator || '', /Blender I\/O/i);
  assert.ok(!(document.extensionsUsed || []).includes('KHR_draco_mesh_compression'));
  assert.equal(document.buffers?.length, 1);
  assert.equal(document.buffers?.[0]?.uri, undefined);
  const root = (document.nodes || []).find((node) => node.name === 'Ground_Leaf_Litter_Asset');
  assert.equal(root?.extras?.asset_role, 'falling_leaf_tree_ground_litter');
  assert.equal(root?.extras?.runtime_draw_budget, 1);
  assert.equal(root?.extras?.gpt_texture_source, 'gpt-ground-leaves-source.png');
  assert.equal(root?.extras?.matching_particle_texture, 'falling-leaf-particle.png');
  const leafNodes = descendantNodeIndices(document, 'Ground_Leaf_Litter_Asset')
    .map((index) => document.nodes[index]);
  const primitives = leafNodes
    .filter((node) => Number.isInteger(node.mesh))
    .flatMap((node) => document.meshes[node.mesh]?.primitives || []);
  assert.equal(primitives.length, 1, 'ground litter must remain one instanced draw');
  assert.ok(Number.isInteger(primitives[0].attributes?.TEXCOORD_0));
  const triangleAccessor = document.accessors?.[primitives[0].indices]
    || document.accessors?.[primitives[0].attributes?.POSITION];
  assert.equal((triangleAccessor?.count || 0) / 3, 20,
    'the Blender patch must retain its ten two-triangle leaves');

  const atlasBuffer = readFileSync(GROUND_LEAVES_ATLAS_URL);
  assert.deepEqual(pngMetadata(atlasBuffer), {
    width: 128, height: 128, bitDepth: 8, colorType: 6,
  });
  assert.equal(document.images?.length, 1);
  assert.deepEqual(
    embeddedBufferView(glb, document, document.images[0].bufferView),
    atlasBuffer,
    'the GLB must embed the exact reproducible GPT-derived atlas',
  );
  const material = document.materials?.[primitives[0].material];
  assert.equal(material?.doubleSided, true);
  const texture = document.textures?.[material?.pbrMetallicRoughness?.baseColorTexture?.index];
  const sampler = document.samplers?.[texture?.sampler];
  assert.equal(sampler?.magFilter, 9728);
  assert.ok([9728, 9984].includes(sampler?.minFilter));

  const particleBuffer = readFileSync(FALLING_LEAF_PARTICLE_URL);
  assert.deepEqual(pngMetadata(particleBuffer), {
    width: 32, height: 32, bitDepth: 8, colorType: 6,
  });
  const atlas = decodeRgbaPng(atlasBuffer);
  const particle = decodeRgbaPng(particleBuffer);
  let particleOpaque = 0;
  for (let y = 0; y < particle.height; y++) {
    for (let x = 0; x < particle.width; x++) {
      const particleOffset = (y * particle.width + x) * 4;
      // Blender image coordinates are bottom-up; tile zero occupies the
      // bottom-left atlas cell after PNG encoding.
      const atlasY = atlas.height - particle.height + y;
      const atlasOffset = (atlasY * atlas.width + x) * 4;
      assert.deepEqual(
        particle.pixels.subarray(particleOffset, particleOffset + 4),
        atlas.pixels.subarray(atlasOffset, atlasOffset + 4),
        'the airborne particle must be copied from the same ground-leaf atlas tile',
      );
      particleOpaque += Number(particle.pixels[particleOffset + 3] > 0);
    }
  }
  assert.ok(particleOpaque >= 32, 'falling-leaf particle lost its readable silhouette');
});

test('ground-leaf Blender generator preserves GPT provenance and hard pixel filtering', () => {
  assert.ok(readFileSync(GROUND_LEAVES_SOURCE_URL).length > 32 * 1024,
    'project-local GPT source is missing or suspiciously small');
  const prompt = readFileSync(GROUND_LEAVES_PROMPT_URL, 'utf8');
  assert.match(prompt, /built-in\s+GPT image tool/i);
  assert.match(prompt, /no halos; no outlines/i);
  const source = readFileSync(GROUND_LEAVES_GENERATOR_URL, 'utf8');
  assert.match(source, /Ground_Leaf_Litter_Asset/);
  assert.match(source, /gpt-ground-leaves-source\.png/);
  assert.match(source, /falling-leaf-particle\.png/);
  assert.match(source, /texture\.interpolation\s*=\s*["']Closest["']/);
  assert.match(source, /["']export_draco_mesh_compression_enable["']\s*:\s*False/);
});

test('ground leaves instance only below live deterministic falling-leaf trees', async () => {
  const scene = new THREE.Scene();
  const field = new GroundLeafField(scene, {
    loaderFactory: () => ({ loadAsync: () => Promise.resolve(createTestGroundLeafGltf()) }),
  });
  await field.prepare();
  assert.equal(field.ready, true);
  assert.equal(field.mesh?.isInstancedMesh, true);
  assert.equal(field.mesh.material.map.magFilter, THREE.NearestFilter);
  assert.equal(field.mesh.material.map.minFilter, THREE.NearestFilter);
  assert.equal(field.mesh.material.map.generateMipmaps, false);
  const tree = Object.freeze({
    id: 'falling-ash',
    rootX: 0,
    rootY: 4,
    rootZ: 0,
    crownY: 7,
    isPine: false,
    hasFallingLeaves: true,
  });
  let canopyPresent = true;
  const world = {
    seed: 64,
    streamRevision: 0,
    getTreesNear: () => [tree],
    isPositionReady: () => true,
    terrainHeight: () => 3,
    getBlock: (x, y, z) => {
      if (canopyPresent && y === tree.crownY
        && Math.abs(x - tree.rootX) + Math.abs(z - tree.rootZ) === 1) return BLOCK.ASH_LEAVES;
      if (y === 3) return BLOCK.TURF;
      return BLOCK.AIR;
    },
  };
  field.setWorld(world);
  field.setQuality({ hangingLeafRadius: 24, hangingLeafTreeCap: 1 });
  field.update(0, new THREE.Vector3(0.5, 4.2, 0.5));
  const initial = field.getStats();
  assert.equal(initial.sourceTrees, 1);
  assert.equal(initial.patches, 1);
  assert.equal(initial.draws, 1);
  assert.equal(initial.gptTexture, true);
  assert.equal(initial.nearestTexture, true);

  canopyPresent = false;
  world.streamRevision++;
  field.update(0, new THREE.Vector3(0.5, 4.2, 0.5));
  assert.equal(field.getStats().patches, 0,
    'removing the falling-leaf canopy must remove its floor litter on the next world revision');
  field.dispose();
  assert.equal(scene.children.length, 0);
});

test('Blender hanging-leaf GLB is self-contained, pixel-authored and compact', () => {
  const glb = readFileSync(HANGING_LEAVES_URL);
  assert.ok(glb.length >= 4 * 1024, 'hanging-leaf GLB is suspiciously small or empty');
  assert.ok(glb.length <= 128 * 1024, `hanging-leaf GLB exceeds 128KB (${glb.length} bytes)`);
  const document = parseGlb(glb);
  assert.match(document.asset?.generator || '', /Blender I\/O/i,
    'hanging-leaf asset must identify Blender glTF export');
  assert.ok(!(document.extensionsUsed || []).includes('KHR_draco_mesh_compression'),
    'hanging leaves must load without a Draco decoder');
  assert.equal(document.buffers?.length, 1);
  assert.equal(document.buffers?.[0]?.uri, undefined,
    'hanging-leaf GLB cannot depend on an external binary file');

  const nodeNames = new Set((document.nodes || []).map((node) => node.name));
  assert.ok(nodeNames.has('Hanging_Leaf_Asset'),
    'generated GLB is missing its stable top-pivot Hanging_Leaf_Asset root');
  const leafNodes = descendantNodeIndices(document, 'Hanging_Leaf_Asset')
    .map((index) => document.nodes[index]);
  const primitives = leafNodes
    .filter((node) => Number.isInteger(node.mesh))
    .flatMap((node) => document.meshes[node.mesh]?.primitives || []);
  assert.equal(primitives.length, 1,
    'the authored segment must stay one primitive for one-draw instancing');
  assert.ok(Number.isInteger(primitives[0].attributes?.TEXCOORD_0),
    'the authored segment must preserve its GPT-image atlas UVs');
  const triangleAccessor = document.accessors?.[primitives[0].indices]
    || document.accessors?.[primitives[0].attributes?.POSITION];
  assert.ok((triangleAccessor?.count || 0) / 3 <= 64,
    'one hanging-leaf segment exceeded its 64-triangle authored budget');

  const sourceAtlasBuffer = readFileSync(HANGING_LEAVES_ATLAS_URL);
  const sourceAtlas = pngMetadata(sourceAtlasBuffer);
  assert.deepEqual(sourceAtlas, { width: 64, height: 64, bitDepth: 8, colorType: 6 },
    'hanging-leaf atlas must remain an exact 64x64 RGBA PNG');
  assert.equal(document.images?.length, 1, 'exactly one atlas should be embedded');
  const embeddedImage = document.images[0];
  assert.equal(embeddedImage.uri, undefined, 'atlas must be embedded in the GLB');
  assert.equal(embeddedImage.mimeType, 'image/png');
  assert.deepEqual(
    pngMetadata(embeddedBufferView(glb, document, embeddedImage.bufferView)),
    sourceAtlas,
    'embedded foliage atlas metadata must match its reproducible source PNG',
  );
  const material = document.materials?.[primitives[0].material];
  assert.equal(material?.doubleSided, true);
  const texture = document.textures?.[material?.pbrMetallicRoughness?.baseColorTexture?.index];
  const sampler = document.samplers?.[texture?.sampler];
  assert.equal(sampler?.magFilter, 9728, 'authored foliage atlas must use nearest magnification');
  assert.ok([9728, 9984].includes(sampler?.minFilter),
    'authored foliage atlas must use nearest-only minification');

  const decoded = decodeRgbaPng(sourceAtlasBuffer);
  const histogram = new Map();
  for (let index = 0; index < decoded.pixels.length; index += 4) {
    if (decoded.pixels[index + 3] === 0) continue;
    const hex = decoded.pixels.subarray(index, index + 3).toString('hex');
    histogram.set(hex, (histogram.get(hex) || 0) + 1);
  }
  const expectedHistogram = new Map([
    ['345f47', 0.076],
    ['416e4c', 0.131],
    ['4d7d51', 0.576],
    ['6b9860', 0.128],
    ['82a969', 0.090],
  ]);
  assert.deepEqual([...histogram.keys()].sort(), [...expectedHistogram.keys()].sort(),
    'hanging foliage must contain only the exact Ashleaf canopy colors');
  const opaquePixels = [...histogram.values()].reduce((sum, count) => sum + count, 0);
  for (const [hex, expectedRatio] of expectedHistogram) {
    assert.ok(Math.abs(histogram.get(hex) / opaquePixels - expectedRatio) < 0.015,
      `Ashleaf palette ratio ${hex} drifted away from the canopy texture`);
  }
  assert.ok([...histogram.values()].every((count) => count % 16 === 0),
    'every logical texture pixel must remain a crisp 4x4 atlas block');
});

test('Blender hanging-leaf generator preserves the reproducible GPT texture pipeline', () => {
  const source = readFileSync(HANGING_LEAVES_GENERATOR_URL, 'utf8');
  assert.match(source, /Hanging_Leaf_Asset/);
  assert.match(source, /gpt-hanging-leaves-source-v2\.png/,
    'generator must retain the project-local GPT-image source');
  for (const color of ['0x4D', '0x7D', '0x51', '0x6B', '0x98', '0x60', '0x34', '0x5F', '0x47', '0x82', '0xA9', '0x69', '0x41', '0x6E', '0x4C']) {
    assert.match(source, new RegExp(color), `generator lost Ashleaf palette component ${color}`);
  }
  assert.match(source, /64/,
    'generator must explicitly build the compact pixel atlas');
  assert.match(source, /["']export_draco_mesh_compression_enable["']\s*:\s*False/,
    'generator must explicitly disable Draco compression');
  assert.match(source, /texture\.interpolation\s*=\s*["']Closest["']/,
    'Blender material must preserve hard pixel filtering');
});

test('hanging-leaf spring chains use one draw and react safely to the moving player', async () => {
  const scene = new THREE.Scene();
  const gltf = createTestHangingLeafGltf();
  const field = new HangingLeavesField(scene, null, {
    loaderFactory: () => ({ loadAsync: () => Promise.resolve(gltf) }),
  });
  await field.prepare();
  assert.equal(field.ready, true);
  assert.equal(field.mesh?.isInstancedMesh, true);
  assert.ok(field.mesh.geometry.getAttribute('uv'));
  assert.equal(field.mesh.material.map.magFilter, THREE.NearestFilter);
  assert.equal(field.mesh.material.map.minFilter, THREE.NearestFilter);
  assert.equal(field.mesh.material.map.generateMipmaps, false);
  assert.equal(field.mesh.material.side, THREE.DoubleSide);
  assert.equal(field.group.children.filter((child) => child === field.mesh).length, 1);

  const tree = Object.freeze({
    id: '0,0',
    rootX: 0,
    rootY: 4,
    rootZ: 0,
    crownY: 7,
    trunkHeight: 4,
    trunkBlock: 5,
    leafBlock: 6,
    isPine: false,
    hasHangingLeaves: true,
  });
  field.setWorld({
    getTreesNear: () => [tree],
    isPositionReady: () => true,
    getBlock: (x, y, z) => {
      if (x === tree.rootX && y === tree.rootY + tree.trunkHeight - 1 && z === tree.rootZ) {
        return tree.trunkBlock;
      }
      return y >= tree.crownY - 2 && y <= tree.crownY ? tree.leafBlock : 0;
    },
  });
  field.setQuality({
    shadows: true,
    hangingLeafRadius: 24,
    hangingLeafTreeCap: 1,
    hangingLeafStrandsPerTree: 1,
    hangingLeafSegmentCap: 8,
    hangingLeafPhysicsRadius: 8,
  }, false);
  field.update(0, new THREE.Vector3(0.5, 4.2, 0.5), {
    playerVelocity: new THREE.Vector3(),
  });
  const initial = field.getStats();
  assert.equal(initial.trees, 1);
  assert.equal(initial.strands, 1);
  assert.ok(initial.segments >= 3 && initial.segments <= 4);
  assert.equal(initial.draws, 1);
  assert.ok(initial.triangles > 0);
  const ashTint = new THREE.Color();
  field.mesh.getColorAt(0, ashTint);
  assert.equal(ashTint.getHex(), new THREE.Color(BLOCKS[BLOCK.ASH_LEAVES].tint).getHex(),
    'runtime foliage must receive the same neutral render tint as Ashleaf canopy blocks');
  const strand = field.strands[0];
  const initialTip = strand.points.at(-1).clone();
  const player = new THREE.Vector3(initialTip.x - 0.12, initialTip.y - 0.45, initialTip.z);
  let maximumInteractions = 0;
  for (let frame = 0; frame < 12; frame++) {
    field.update(1 / 60, player, { playerVelocity: new THREE.Vector3(4.5, 0, 0) });
    maximumInteractions = Math.max(maximumInteractions, field.getStats().interactions);
  }
  const movedTip = strand.points.at(-1);
  assert.ok(Math.hypot(movedTip.x - initialTip.x, movedTip.z - initialTip.z) > 0.025,
    'walking into the strand must produce visible persistent lateral motion');
  assert.ok(maximumInteractions > 0, 'player contact never reached the spring chain');
  for (let index = 1; index < strand.points.length; index++) {
    assert.ok(Math.abs(strand.points[index].distanceTo(strand.points[index - 1]) - strand.segmentLength) < 1e-5,
      'physics constraints allowed the authored segment chain to separate');
  }
  assert.ok([...field.mesh.instanceMatrix.array].every(Number.isFinite),
    'contact physics produced a non-finite instance transform');
  assert.equal(field.mesh.userData.drawBudget, 1);

  const directPush = hangingLeafCollisionPush(
    new THREE.Vector3(0.2, 1, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(4, 0, 0),
  );
  assert.ok(directPush.x > 0 && directPush.length() <= 0.280001,
    'collision impulse must follow travel direction and remain bounded');
  field.dispose();
  assert.equal(scene.children.length, 0);
});

test('hanging-leaf damping and attachment lifecycle stay stable across gameplay conditions', async () => {
  const baselineDecay = 0.88 ** 60;
  for (const refreshRate of [30, 60, 144]) {
    const perFrame = timeCorrectedDamping(0.88, 1 / refreshRate);
    assert.ok(Math.abs(perFrame ** refreshRate - baselineDecay) < 1e-12,
      `spring decay drifted at ${refreshRate} Hz`);
  }

  const scene = new THREE.Scene();
  const field = new HangingLeavesField(scene, null, {
    loaderFactory: () => ({ loadAsync: () => Promise.resolve(createTestHangingLeafGltf()) }),
  });
  await field.prepare();
  const tree = Object.freeze({
    id: 'attachment-tree',
    rootX: 0,
    rootY: 4,
    rootZ: 0,
    crownY: 7,
    trunkHeight: 4,
    trunkBlock: 5,
    leafBlock: 6,
    isPine: false,
    hasHangingLeaves: true,
  });
  let ready = true;
  let trunkPresent = true;
  let leavesPresent = true;
  const world = {
    getTreesNear: () => [tree],
    isPositionReady: () => ready,
    getBlock: (x, y, z) => {
      if (x === tree.rootX && y === tree.rootY + tree.trunkHeight - 1 && z === tree.rootZ) {
        return trunkPresent ? tree.trunkBlock : 0;
      }
      return leavesPresent && y >= tree.crownY - 2 && y <= tree.crownY ? tree.leafBlock : 0;
    },
  };
  field.setWorld(world);
  field.setQuality({
    hangingLeafRadius: 24,
    hangingLeafTreeCap: 1,
    hangingLeafStrandsPerTree: 1,
    hangingLeafSegmentCap: 8,
  });
  const focus = new THREE.Vector3(0.5, 4.2, 0.5);
  field.update(0, focus);
  assert.equal(field.getStats().strands, 1);

  leavesPresent = false;
  field.update(0, focus);
  assert.equal(field.getStats().strands, 0, 'breaking an anchor leaf must remove its strand immediately');
  assert.equal(field.mesh.count, 0);

  leavesPresent = true;
  field.setQuality({});
  field.update(0, focus);
  assert.equal(field.getStats().strands, 1);
  trunkPresent = false;
  field.update(0, focus);
  assert.equal(field.getStats().strands, 0, 'breaking the supporting trunk must remove its strands immediately');

  trunkPresent = true;
  field.setQuality({});
  field.update(0, focus);
  assert.equal(field.getStats().strands, 1);
  ready = false;
  field.update(0, focus);
  assert.equal(field.getStats().strands, 0, 'unloading the source chunk must hide its strands immediately');

  ready = true;
  field.setQuality({});
  field.update(0, focus);
  assert.equal(field.getStats().strands, 1);
  field.setWorld({
    getTreesNear: () => [],
    isPositionReady: () => true,
    getBlock: () => 0,
  });
  assert.equal(field.getStats().strands, 0, 'switching worlds must never retain old foliage');
  assert.equal(field.mesh.count, 0);
  field.dispose();
});

test('hanging-leaf asset failures remain bounded cosmetic failures', async () => {
  const field = new HangingLeavesField(new THREE.Scene(), null, {
    assetUrl: '/missing-hanging-leaves.glb',
    loadTimeoutMs: 100,
    loaderFactory: () => ({ loadAsync: () => Promise.reject(new Error('404 hanging leaves')) }),
  });
  await assert.doesNotReject(() => field.prepare());
  assert.equal(field.ready, false);
  assert.equal(field.getStats().failed, true);
  assert.match(field.getStats().error, /404 hanging leaves/);
  assert.equal(field.getStats().loading, false);
  field.dispose();
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

test('GPT moon texture is a detailed transparent runtime asset with preserved provenance', () => {
  const runtime = readFileSync(MOON_TEXTURE_URL);
  const source = readFileSync(MOON_SOURCE_URL);
  const prompt = readFileSync(MOON_PROMPT_URL, 'utf8');
  assert.deepEqual(pngMetadata(runtime), {
    width: 1024,
    height: 1024,
    bitDepth: 8,
    colorType: 6,
  });
  assert.deepEqual(pngMetadata(source), {
    width: 1254,
    height: 1254,
    bitDepth: 8,
    colorType: 6,
  });
  const decoded = decodeRgbaPng(runtime);
  const alphaAt = (x, y) => decoded.pixels[(y * decoded.width + x) * 4 + 3];
  assert.equal(alphaAt(0, 0), 0, 'the moon sprite must not carry an opaque square backdrop');
  assert.ok(alphaAt(512, 512) >= 248, 'the centre of the moon disc must remain opaque and detailed');
  assert.ok(runtime.length >= 500 * 1024, 'runtime texture is suspiciously small for a detailed 1024px moon');
  assert.match(prompt, /built-in GPT Image tool/);
  assert.match(prompt, /scientifically plausible crater\s+fields/);
  assert.match(prompt, /no\s+baked atmospheric glow/);
});
