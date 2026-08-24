import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/public/worldloom/vendor/three.module.min.js';
import { Inventory, SaveStore, DEFAULT_SETTINGS } from '../src/public/worldloom/src/save.js';
import { SurvivalSystem } from '../src/public/worldloom/src/survival.js';
import { BLOCK, BLOCKS } from '../src/public/worldloom/src/blocks.js';
import { World } from '../src/public/worldloom/src/world.js';
import {
  BlockEffects,
  Environment,
  nearestPeriodicCloudCoordinate,
  outdoorBounceIntensity,
  skylightTransmission,
  weatherLightingState,
} from '../src/public/worldloom/src/environment.js';
import {
  PLAYER,
  PlayerController,
  fallDamageForImpact,
  raycastVoxels,
} from '../src/public/worldloom/src/player.js';
import {
  CREATURE_COMBAT,
  CreatureSystem,
  creatureCombatProfile,
} from '../src/public/worldloom/src/creatures.js';
import {
  ITEM,
  OBJECTIVES,
  RECIPES,
  combatProfile,
  canHarvest,
  getItem,
  recipeRequirements,
  recipeStations,
  treeLogSpecies,
} from '../src/public/worldloom/src/data.js';
import { HeldItemView } from '../src/public/worldloom/src/viewmodel.js';

function validSnapshot() {
  return {
    seed: 1234,
    mode: 'survival',
    player: {
      position: [0.5, 34, 0.5],
      velocity: [0, 0, 0],
      yaw: 0,
      pitch: 0,
      health: 1,
      stamina: 1,
    },
    inventory: { selected: 0, slots: Array.from({ length: 36 }, () => ({ id: 0, count: 0 })) },
    objectiveIndex: 0,
    flags: {},
    world: { version: 2, chunks: [], fluids: [] },
  };
}

test('inventory reports exact capacity and cloning is transactional', () => {
  const inventory = new Inventory();
  inventory.slots = Array.from({ length: 36 }, (_, index) => ({ id: index + 200, count: 99 }));
  inventory.slots[0] = { id: BLOCK.ASH_LOG, count: 99 };
  assert.equal(inventory.capacityFor(BLOCK.ASH_PLANKS), 0);
  assert.equal(inventory.canAdd(BLOCK.ASH_PLANKS, 4), false);

  const projection = inventory.clone();
  assert.equal(projection.remove(BLOCK.ASH_LOG, 1), true);
  assert.equal(projection.canAdd(BLOCK.ASH_PLANKS, 4), false);
  assert.equal(inventory.count(BLOCK.ASH_LOG), 99, 'the source inventory must remain untouched');
});

test('inventory stack movement, taking and empty-slot normalization never duplicate an item', () => {
  const inventory = new Inventory();
  assert.equal(inventory.add(BLOCK.ASH_LOG, 1), 0);
  assert.deepEqual(inventory.take(0), { id: BLOCK.ASH_LOG, count: 1 });
  assert.deepEqual(inventory.selectedSlot(), { id: 0, count: 0 });
  assert.equal(inventory.consume(0, 1), false, 'an emptied slot cannot be consumed again');

  inventory.load({ selected: 0, slots: [{ id: BLOCK.STONE, count: 0 }] });
  assert.deepEqual(inventory.slots[0], { id: 0, count: 0 }, 'zero-count ghost stacks are discarded');

  inventory.add(BLOCK.PINE_LOG, 7);
  inventory.move(0, 9);
  assert.equal(inventory.count(BLOCK.PINE_LOG), 7);
  assert.deepEqual(inventory.take(9, 3), { id: BLOCK.PINE_LOG, count: 3 });
  assert.equal(inventory.count(BLOCK.PINE_LOG), 4);
});

test('recipe display requirements and crafting transactions share one logical source', () => {
  assert.deepEqual(recipeRequirements({ ingredients: [
    { id: BLOCK.STONE, count: 2 },
    { id: BLOCK.STONE, count: 3 },
    { id: ITEM.STICK, count: 1 },
  ] }), [
    { id: BLOCK.STONE, count: 5 },
    { id: ITEM.STICK, count: 1 },
  ]);

  for (const recipe of RECIPES) {
    assert.notEqual(getItem(recipe.output.id).name, 'Unknown Relic', `${recipe.id} has a real output`);
    for (const requirement of recipeRequirements(recipe)) {
      assert.notEqual(getItem(requirement.id).name, 'Unknown Relic', `${recipe.id} has a real ingredient`);
    }
    for (const station of recipeStations(recipe)) assert.ok(BLOCKS[station]?.name, `${recipe.id} has a real station`);
  }
  assert.ok(RECIPES.some((recipe) => recipe.id === 'pine_planks'), 'pine has a direct route into wood progression');
  const pineInventory = new Inventory();
  pineInventory.add(BLOCK.PINE_LOG, 1);
  assert.equal(OBJECTIVES[0].test({ inventory: pineInventory, flags: {} }), true);
});

test('storage security errors never prevent boot and retain an in-memory save', () => {
  globalThis.localStorage = {
    getItem() { throw new DOMException('blocked', 'SecurityError'); },
    setItem() { throw new DOMException('blocked', 'SecurityError'); },
    removeItem() { throw new DOMException('blocked', 'SecurityError'); },
  };
  const store = new SaveStore();
  assert.deepEqual(store.loadSettings(), DEFAULT_SETTINGS);
  assert.equal(store.save(validSnapshot()), false, 'non-persistent memory fallback should be disclosed');
  assert.equal(store.load()?.seed, 1234, 'the current session still has a usable save');
});

test('clearing a save also clears its backup', () => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const store = new SaveStore();
  store.save(validSnapshot());
  store.save({ ...validSnapshot(), seed: 5678 });
  store.clear();
  assert.equal(store.load(), null);
});

test('save round-trips an exact fractional player position and persistent loose items', () => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const snapshot = validSnapshot();
  snapshot.player.position = [18.2375, 41.0625, -9.8125];
  snapshot.player.velocity = [0.125, -0.25, 0.375];
  snapshot.droppedItems = [{
    id: ITEM.RAW_MEAT,
    count: 3,
    position: [19.1, 40.4, -8.9],
    velocity: [0.2, 0, -0.1],
  }];
  const store = new SaveStore();
  assert.equal(store.save(snapshot), true);
  const loaded = new SaveStore().load();
  assert.deepEqual(loaded.player.position, snapshot.player.position);
  assert.deepEqual(loaded.player.velocity, snapshot.player.velocity);
  assert.deepEqual(loaded.droppedItems, snapshot.droppedItems);
});

test('unsafe or impossible loose-item records invalidate a save', () => {
  const invalid = {
    ...validSnapshot(),
    schemaVersion: 1,
    droppedItems: [{ id: ITEM.RAW_MEAT, count: 0, position: [0, 30, 0] }],
  };
  globalThis.localStorage = {
    getItem: (key) => key.includes('backup') ? null : JSON.stringify(invalid),
    setItem() {},
    removeItem() {},
  };
  assert.equal(new SaveStore().load(), null);
});

test('a quota failure loads the newest in-memory snapshot instead of stale disk data', () => {
  const values = new Map();
  let failPrimary = false;
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      if (failPrimary && key === 'worldloom.save.v1') throw new DOMException('full', 'QuotaExceededError');
      values.set(key, value);
    },
    removeItem: (key) => values.delete(key),
  };
  const store = new SaveStore();
  assert.equal(store.save(validSnapshot()), true);
  failPrimary = true;
  assert.equal(store.save({ ...validSnapshot(), seed: 9876 }), false);
  assert.equal(store.load()?.seed, 9876);
});

test('a fresh session recovers the newest valid backup after repeated primary write failures', async () => {
  const values = new Map();
  let failPrimary = false;
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      if (failPrimary && key === 'worldloom.save.v1') throw new DOMException('full', 'QuotaExceededError');
      values.set(key, value);
    },
    removeItem: (key) => values.delete(key),
  };
  const store = new SaveStore();
  assert.equal(store.save({ ...validSnapshot(), seed: 1111 }), true);
  await new Promise((resolve) => setTimeout(resolve, 5));
  failPrimary = true;
  assert.equal(store.save({ ...validSnapshot(), seed: 2222 }), false);
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(store.save({ ...validSnapshot(), seed: 3333 }), false);
  assert.equal(new SaveStore().load()?.seed, 2222);
});

test('a corrupt primary can never overwrite the last valid backup', () => {
  const values = new Map();
  const backup = {
    ...validSnapshot(),
    seed: 2468,
    schemaVersion: 1,
    generatorVersion: 1,
    registryVersion: 1,
  };
  values.set('worldloom.save.v1', '{corrupt');
  values.set('worldloom.save.backup.v1', JSON.stringify(backup));
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      if (key === 'worldloom.save.v1') throw new DOMException('full', 'QuotaExceededError');
      values.set(key, value);
    },
    removeItem: (key) => values.delete(key),
  };
  assert.equal(new SaveStore().save({ ...validSnapshot(), seed: 8642 }), false);
  assert.equal(new SaveStore().load()?.seed, 2468);
});

test('malformed saves with unsafe objective or velocity values are rejected', () => {
  const invalid = { ...validSnapshot(), schemaVersion: 1, objectiveIndex: -1 };
  invalid.player = { ...invalid.player, velocity: [Number.MAX_VALUE, 0, 0] };
  globalThis.localStorage = {
    getItem: (key) => key.includes('backup') ? null : JSON.stringify(invalid),
    setItem() {},
    removeItem() {},
  };
  assert.equal(new SaveStore().load(), null);
});

test('unsafe player and respawn heights are rejected before world startup', () => {
  const invalid = {
    ...validSnapshot(),
    schemaVersion: 1,
    player: { ...validSnapshot().player, position: [0, 50_000_000, 0] },
    respawnPoint: [0, -50_000_000, 0],
  };
  globalThis.localStorage = {
    getItem: (key) => key.includes('backup') ? null : JSON.stringify(invalid),
    setItem() {},
    removeItem() {},
  };
  assert.equal(new SaveStore().load(), null);
});

test('survival tracks food, weather exposure, oxygen and a real sleep skip', () => {
  const survival = new SurvivalSystem({ nourishment: 0.5, wetness: 0, oxygen: 1, elapsedDays: 0 });
  for (let index = 0; index < 120; index++) {
    survival.update(0.05, { rainIntensity: 1, sheltered: false, dayAmount: 0.1, headUnderwater: true });
  }
  assert.ok(survival.wetness > 0.08);
  assert.ok(survival.oxygen < 0.55);
  const before = survival.elapsedDays;
  const morning = survival.sleep(0.8);
  assert.equal(morning, 0.255);
  assert.ok(survival.elapsedDays > before);
  assert.ok(survival.wetness < 0.02);
  const foodBeforeDeath = survival.nourishment;
  survival.respawn();
  assert.ok(survival.nourishment <= foodBeforeDeath, 'respawning must never create food');
});

test('the world floor is true bedrock and rejects every y=0 edit', () => {
  const world = new World(4421, null, null);
  assert.equal(world.getBlock(0, 0, 0), BLOCK.BEDROCK);
  assert.equal(world.setBlock(0, 0, 0, BLOCK.AIR), false);
  assert.equal(world.getBlock(0, 0, 0), BLOCK.BEDROCK);
  world.dispose();
});

test('natural cave mushrooms are non-emissive and no longer presented as glowing plants', () => {
  assert.equal(BLOCK.CAVE_MUSHROOM, BLOCK.GLOW_MUSHROOM, 'the legacy save id remains compatible');
  const mushroom = BLOCKS[BLOCK.CAVE_MUSHROOM];
  assert.equal(mushroom.emissive, 0);
  assert.doesNotMatch(`${mushroom.name} ${mushroom.description}`, /glow/i);
});

test('highland pine and walk-through shortgrass form deterministic natural patches', () => {
  const world = new World(64, null, null);
  const chunk = world.ensurePositionGenerated(0, 0);
  const grassCount = chunk.blocks.reduce((count, id) => count + Number(id === BLOCK.SHORT_GRASS), 0);
  const pineCount = chunk.blocks.reduce((count, id) => (
    count + Number(id === BLOCK.PINE_LOG || id === BLOCK.PINE_NEEDLES)
  ), 0);
  assert.ok(grassCount > 8 && grassCount < 192, 'shortgrass should cluster without carpeting every block');
  assert.ok(pineCount > 20, 'the second tree species should be visibly represented');
  assert.equal(BLOCKS[BLOCK.SHORT_GRASS].solid, false, 'shortgrass must remain walk-through');
  world.dispose();
});

test('streamed generation and meshing advance progressively across frame-budgeted slices', () => {
  const world = new World(64, null, null);
  world._preloadChunksRemaining = 0;
  world.updateStreaming({ x: 0.5, z: 0.5 }, 2);
  const firstKey = world.generationQueue[0];
  const firstChunk = world.chunks.get(firstKey);
  assert.equal(world.processQueue(1), 0, 'one generation slice should not build a whole chunk');
  assert.equal(firstChunk.generated, false);
  assert.ok(firstChunk.generationCursor > 0, 'the first slice should retain measurable progress');

  let generationSlices = 1;
  while (!firstChunk.generated && generationSlices < 32) {
    world.processQueue(1);
    generationSlices++;
  }
  assert.equal(firstChunk.generated, true);
  assert.ok(generationSlices > 1, 'generation should remain progressive across bounded idle turns');

  for (const [dx, dz] of [[-16, 0], [16, 0], [0, -16], [0, 16]]) {
    world.ensurePositionGenerated(dx, dz);
  }
  assert.equal(world.rebuildDirty(1), 0, 'the first mesh slice should remain partial');
  assert.ok(firstChunk.meshJob, 'a partial mesh job should be retained between frames');
  let meshSlices = 1;
  let rebuilt = 0;
  while (!rebuilt && meshSlices < 96) {
    rebuilt = world.rebuildDirty(1);
    meshSlices++;
  }
  assert.equal(rebuilt, 1);
  assert.ok(meshSlices > 4, 'meshing should be spread over several idle turns');
  assert.equal(firstChunk.meshDirty, false);
  assert.equal(world.hasVisibleTerrainAt(0.5, 0.5), true);
  firstChunk.meshDirty = true;
  assert.equal(world.hasVisibleTerrainAt(0.5, 0.5), true, 'retained geometry stays visible during a rebuild');
  assert.equal(world.isPositionRendered(0.5, 0.5), false, 'full render readiness still waits for the rebuild');
  world.dispose();
});

test('generation finishing phases reuse the current idle budget instead of waiting four extra callbacks', () => {
  const world = new World(64, null, null);
  world._preloadChunksRemaining = 0;
  world.updateStreaming({ x: 0.5, z: 0.5 }, 2);
  const firstChunk = world.chunks.get(world.generationQueue[0]);

  assert.equal(world.processQueue(1, 1_000), 0, 'the 128-column cap keeps the first pass bounded');
  assert.equal(firstChunk.generationCursor, 128);
  assert.equal(world.processQueue(1, 1_000), 1, 'decorations and finalize should consume the remaining second-pass budget');
  assert.equal(firstChunk.generated, true);
  assert.equal(firstChunk.generationPhase, 'complete');
  world.dispose();
});

test('visible nearby mesh work outranks an older partial job at the far edge', () => {
  const world = new World(8472, null, null);
  world.updateStreaming({ x: 0.5, z: 0.5 }, 2);
  for (let z = -2; z <= 2; z++) {
    for (let x = -2; x <= 2; x++) world.ensurePositionGenerated(x * 16, z * 16);
  }
  const near = world.chunks.get('0,0');
  const far = world.chunks.get('2,2');
  let farAdvanced = false;
  far.meshJob = {
    step() { farAdvanced = true; return false; },
    disposePartial() {},
  };
  far.meshJobRevision = far.revision;

  world.rebuildDirty(1, 0.55);
  assert.equal(farAdvanced, false, 'a retained far job must not hide nearby terrain for another turn');
  assert.ok(near.meshJob, 'the center chunk should begin meshing first');
  world.dispose();
});

test('player edits publish ahead of background meshes and prioritize boundary neighbors', () => {
  const world = new World(8472, null, null);
  const edited = world.ensurePositionGenerated(0, 0);
  const west = world.ensurePositionGenerated(-1, 8);
  const background = world.ensurePositionGenerated(48, 48);

  const oldGeometry = new THREE.BufferGeometry();
  oldGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
    0, 0, 0,
    1, 0, 0,
    0, 1, 0,
  ], 3));
  world._replaceMesh(edited, 'opaqueMesh', oldGeometry, world.opaqueMaterial, 'Test terrain');
  edited.dirty = false;
  edited.meshDirty = false;
  edited.streamPriority = 100_000;

  let backgroundAdvanced = false;
  background.dirty = true;
  background.meshDirty = true;
  background.streamPriority = -100_000;
  background.meshJob = {
    step() { backgroundAdvanced = true; return false; },
    disposePartial() {},
  };
  background.meshJobRevision = background.revision;

  const editX = 8;
  const editZ = 8;
  const editY = world.terrainHeight(editX, editZ);
  assert.notEqual(world.getBlock(editX, editY, editZ), BLOCK.AIR);
  assert.equal(world.setBlock(editX, editY, editZ, BLOCK.AIR), true);
  assert.ok(edited.editMeshPriority > 0, 'a direct block edit must receive foreground mesh priority');

  const replacementGeometry = new THREE.BufferGeometry();
  replacementGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
    0, 0, 0,
    0, 0, 1,
    0, 1, 0,
    0, 0, 1,
    1, 1, 0,
    0, 1, 0,
  ], 3));
  let editedSteps = 0;
  edited.meshJob = {
    result: {
      opaque: replacementGeometry,
      glass: null,
      water: null,
      glow: null,
      faces: 1,
      triangles: 2,
    },
    step() { editedSteps++; return true; },
    disposePartial() {},
  };
  edited.meshJobRevision = edited.revision;

  assert.equal(world.rebuildEdited(0.5), 1, 'the pointer-turn rebuild should publish one ready edit');
  assert.equal(editedSteps, 1);
  assert.equal(backgroundAdvanced, false, 'even a nearer-sorted background job must not run before the edit');
  assert.notEqual(edited.opaqueMesh.geometry, oldGeometry, 'visible terrain geometry must be replaced immediately');
  assert.equal(edited.opaqueMesh.geometry.getAttribute('position').count, 6);
  assert.equal(edited.editMeshPriority, 0, 'published edits leave the foreground queue');

  // x=0 is the west edge of chunk 0,0. Both owners need an urgent rebuild,
  // while the directly edited chunk must retain the first queue position.
  const boundaryX = 0;
  const boundaryZ = 8;
  const boundaryY = world.terrainHeight(boundaryX, boundaryZ);
  assert.notEqual(world.getBlock(boundaryX, boundaryY, boundaryZ), BLOCK.AIR);
  assert.equal(world.setBlock(boundaryX, boundaryY, boundaryZ, BLOCK.AIR), true);
  assert.ok(edited.editMeshPriority > 0);
  assert.ok(west.editMeshPriority > 0, 'the adjoining boundary mesh must inherit edit priority');
  assert.ok(
    edited.editMeshPriority < west.editMeshPriority,
    'the directly edited chunk should publish before its seam neighbor',
  );
  world.dispose();
});

test('recently unloaded chunks reuse their generated voxel data when revisited', () => {
  const world = new World(9127, null, null);
  const original = world.ensurePositionGenerated(0, 0);
  const originalBlocks = original.blocks;
  world.updateStreaming({ x: 0.5, z: 0.5 }, 2);
  world.updateStreaming({ x: 16 * 10 + 0.5, z: 0.5 }, 2);

  assert.equal(world.chunks.has('0,0'), false);
  assert.equal(world.dormantChunks.get('0,0'), original);
  world.updateStreaming({ x: 0.5, z: 0.5 }, 2);
  const restored = world.chunks.get('0,0');
  assert.equal(restored, original);
  assert.equal(restored.blocks, originalBlocks);
  assert.equal(restored.generated, true);
  assert.equal(world.generationQueue.includes('0,0'), false, 'a revisit should skip terrain generation entirely');
  world.dispose();
});

test('streaming prepares hidden horizon rings and favors the direction of travel', () => {
  const world = new World(7341, null, null);
  world.updateStreaming({ x: 0.5, z: 0.5 }, 4, { x: 0, z: -7.1 });
  assert.equal(world.renderDistance, 4);
  assert.equal(world.streamDistance, 6);
  assert.equal(world.chunks.size, 169, 'the 13×13 fog-covered footprint should be resident');
  assert.equal(world.generationQueue.length, 169);
  assert.ok(
    world.generationQueue.indexOf('0,-4') < world.generationQueue.indexOf('0,4'),
    'forward terrain should win over the rear cell in the same complete ring',
  );
  assert.ok(
    world.generationQueue.indexOf('2,0') < world.generationQueue.indexOf('0,-3'),
    'a nearer complete ring must still outrank forward bias in a farther ring',
  );
  world.dispose();
});

test('mature overgrown trees use ivy bark textures without protruding lower-trunk leaf blocks', () => {
  const world = new World(64, null, null);
  for (let cz = -2; cz <= 2; cz++) {
    for (let cx = -2; cx <= 2; cx++) world.ensurePositionGenerated(cx * 16, cz * 16);
  }
  const overgrownColumns = new Map();
  for (let z = -32; z < 48; z++) {
    for (let x = -32; x < 48; x++) {
      for (let y = 2; y < world.worldHeight - 3; y++) {
        const log = world.getBlock(x, y, z);
        if (log !== BLOCK.OVERGROWN_ASH_LOG && log !== BLOCK.OVERGROWN_PINE_LOG) continue;
        const key = `${x},${z}`;
        const previous = overgrownColumns.get(key);
        if (!previous || y < previous.y) overgrownColumns.set(key, { x, y, z, log });
      }
    }
  }
  assert.ok(overgrownColumns.size >= 4, 'textured overgrown trees should be obvious but deterministic');
  let lowerLeafContacts = 0;
  for (const { x, y, z, log } of overgrownColumns.values()) {
    const leaf = log === BLOCK.OVERGROWN_ASH_LOG ? BLOCK.ASH_LEAVES : BLOCK.PINE_NEEDLES;
    for (const lowerY of [y, y + 1]) {
      lowerLeafContacts += Number(
        [[1, 0], [-1, 0], [0, 1], [0, -1]]
          .some(([dx, dz]) => world.getBlock(x + dx, lowerY, z + dz) === leaf),
      );
    }
  }
  // A rare neighbouring canopy can naturally touch a sloped lower trunk, but
  // the old dedicated patch generator touched most selected trunks. Keep that
  // contact exceptional while the overgrowth itself lives in the bark atlas.
  assert.ok(lowerLeafContacts <= Math.floor(overgrownColumns.size * 0.25));
  assert.equal(BLOCKS[BLOCK.OVERGROWN_ASH_LOG].drop, BLOCK.ASH_LOG);
  assert.equal(BLOCKS[BLOCK.OVERGROWN_PINE_LOG].drop, BLOCK.PINE_LOG);
  assert.equal(treeLogSpecies(BLOCK.OVERGROWN_ASH_LOG), 'ash');
  assert.equal(treeLogSpecies(BLOCK.OVERGROWN_PINE_LOG), 'pine');
  assert.equal(canHarvest(0, BLOCK.OVERGROWN_ASH_LOG), true);
  assert.equal(canHarvest(0, BLOCK.OVERGROWN_PINE_LOG), true);
  assert.notEqual(BLOCKS[BLOCK.OVERGROWN_ASH_LOG].tiles.side, BLOCKS[BLOCK.ASH_LOG].tiles.side);
  assert.notEqual(BLOCKS[BLOCK.OVERGROWN_PINE_LOG].tiles.side, BLOCKS[BLOCK.PINE_LOG].tiles.side);
  world.dispose();
});

test('rain intensity is clamped to zero whenever the local sky has no storm clouds', () => {
  const environment = Object.create(Environment.prototype);
  Object.assign(environment, {
    weatherPhase: 'rain',
    weatherBuildAge: 20,
    weatherWorld: {},
    weatherEnabled: true,
    weatherTimer: 60,
    cloudCover: 1,
    cloudCoverTarget: 1,
    localCloudCount: 0,
    localCloudCoverage: 0,
    rainTarget: 1,
    rainIntensity: 0.9,
  });
  environment._updateWeather(0.1);
  assert.equal(environment.rainIntensity, 0);
});

function weatherHarness(phase, overrides = {}) {
  return Object.assign(Object.create(Environment.prototype), {
    weatherPhase: phase,
    weatherBuildAge: 20,
    weatherWorld: {},
    weatherEnabled: true,
    weatherTimer: 60,
    cloudCover: 1,
    cloudCoverTarget: 1,
    localCloudCount: 3,
    localCloudCoverage: 1,
    rainTarget: 0,
    rainIntensity: 0,
    overcastAmount: 0,
    stormIntensity: 0.8,
    pendingStormDuration: 90,
  }, overrides);
}

test('clear weather stays bright and blue even when ordinary clouds are numerous', () => {
  const environment = weatherHarness('clear');
  environment._updateWeather(0.25);
  const lighting = weatherLightingState(
    environment.weatherPhase,
    environment.overcastAmount,
    environment.rainIntensity,
  );
  assert.equal(environment.weatherPhase, 'clear');
  assert.equal(environment.rainIntensity, 0);
  assert.equal(environment.overcastAmount, 0);
  assert.equal(lighting.stormAmount, 0);
  assert.equal(lighting.sunVisibility, 1);
});

test('building cloud banks do not grey the sky or hide the sun before rain', () => {
  const environment = weatherHarness('building');
  environment._updateWeather(0.25);
  const lighting = weatherLightingState(
    environment.weatherPhase,
    environment.overcastAmount,
    environment.rainIntensity,
  );
  assert.equal(environment.weatherPhase, 'building');
  assert.equal(environment.rainIntensity, 0);
  assert.equal(environment.overcastAmount, 0);
  assert.equal(lighting.overcastTarget, 0);
  assert.equal(lighting.sunVisibility, 1);
});

test('rain starts the full grey deck and hides the sun in the same update', () => {
  const environment = weatherHarness('building', { weatherTimer: 0 });
  environment._updateWeather(0.1);
  const lighting = weatherLightingState(
    environment.weatherPhase,
    environment.overcastAmount,
    environment.rainIntensity,
  );
  assert.equal(environment.weatherPhase, 'rain');
  assert.ok(environment.rainIntensity > 0);
  assert.equal(environment.overcastAmount, 1);
  assert.equal(lighting.stormLocked, true);
  assert.equal(lighting.sunVisibility, 0);
});

test('clearing rain fades over several updates while the overcast deck stays locked', () => {
  const environment = weatherHarness('clearing', {
    rainTarget: 0,
    rainIntensity: 0.8,
    overcastAmount: 1,
  });
  environment._updateWeather(0.25);
  assert.ok(environment.rainIntensity > 0 && environment.rainIntensity < 0.8,
    'the first clearing update should visibly reduce rain without cutting it off');
  assert.equal(environment.weatherPhase, 'clearing');
  assert.equal(environment.overcastAmount, 1);
  assert.ok(environment.cloudCoverTarget >= 0.9);

  let elapsed = 0.25;
  while (environment.rainIntensity > 0 && elapsed < 8) {
    environment._updateWeather(0.25);
    elapsed += 0.25;
  }
  assert.equal(environment.rainIntensity, 0);
  assert.equal(environment.weatherPhase, 'clearing', 'the sky should clear before another weather cycle begins');
  assert.ok(environment.overcastAmount > 0 && environment.overcastAmount < 1,
    'the grey deck should begin a smooth fade only after the rain tail ends');
  assert.ok(elapsed >= 3.5 && elapsed <= 8, `rain fade completed at an implausible ${elapsed}s`);

  while (environment.weatherPhase === 'clearing' && elapsed < 25) {
    environment._updateWeather(0.25);
    elapsed += 0.25;
  }
  assert.equal(environment.weatherPhase, 'clear');
  assert.equal(environment.rainIntensity, 0);
  assert.equal(environment.overcastAmount, 0);
  assert.equal(weatherLightingState('clear', environment.overcastAmount, 0).sunVisibility, 1);
  assert.ok(environment.cloudCoverTarget <= 0.5, 'clouds may disperse only after the rain tail has ended');
});

test('cloud banks retain canonical world positions when the player moves', () => {
  const cloud = new THREE.Group();
  cloud.position.set(42, 82, -37);
  Object.assign(cloud.userData, {
    speed: 2,
    worldX: 42,
    worldZ: -37,
    centerOffsetX: 0,
    coverageRadius: 25,
    appearance: 1,
    targetVisible: true,
  });
  const environment = Object.assign(Object.create(Environment.prototype), {
    clouds: { children: [cloud] },
    cloudCover: 1,
    graphicsProfile: { cloudAmount: 1 },
    weatherPhase: 'clear',
    overcastAmount: 0,
  });

  environment._updateCloudField(2, { x: 0, z: 0 });
  assert.equal(cloud.userData.worldX, 46, 'wind should advance the canonical world coordinate');
  assert.equal(cloud.userData.worldZ, -37);
  const renderedAtOrigin = cloud.position.clone();

  environment._updateCloudField(0, { x: 20, z: 20 });
  assert.deepEqual(cloud.position.toArray(), renderedAtOrigin.toArray(),
    'ordinary player movement must not translate a cloud bank');
  assert.equal(cloud.userData.worldX, 46);
  assert.equal(cloud.userData.worldZ, -37);

  environment._updateCloudField(0, { x: 400, z: -400 });
  assert.equal(cloud.userData.worldX, 46, 'horizon tiling must not rewrite canonical X');
  assert.equal(cloud.userData.worldZ, -37, 'horizon tiling must not rewrite canonical Z');
  assert.ok(Math.abs(cloud.position.x - 400) <= 155);
  assert.ok(Math.abs(cloud.position.z + 400) <= 155);
  assert.equal(nearestPeriodicCloudCoordinate(46, 400, 310), cloud.position.x);
});

test('an opaque player-built roof removes ambient sky exposure at any depth', () => {
  const environment = Object.create(Environment.prototype);
  Object.assign(environment, {
    weatherWorld: {
      worldHeight: 12,
      getBlock: (_x, y) => (y >= 4 ? BLOCK.STONE : BLOCK.AIR),
      terrainHeight: () => 2,
    },
    skyExposure: 1,
    skyExposureTarget: 1,
    skyExposureTimer: 0,
  });
  environment._updateSkyExposure(0.18, { x: 0.5, y: 2, z: 0.5 });
  assert.equal(environment.skyExposureTarget, 0);
  assert.ok(environment.skyExposure < 0.5, 'enclosure darkness should react quickly');
});

test('dense tree foliage provides shade without applying cave darkness', () => {
  assert.ok(skylightTransmission(BLOCK.ASH_LEAVES) > skylightTransmission(BLOCK.PINE_NEEDLES));
  assert.ok(skylightTransmission(BLOCK.PINE_NEEDLES) > 0.8);
  const environment = Object.create(Environment.prototype);
  Object.assign(environment, {
    weatherWorld: {
      worldHeight: 14,
      getBlock: (_x, y) => (y >= 4 && y <= 11 ? BLOCK.PINE_NEEDLES : BLOCK.AIR),
      terrainHeight: () => 2,
    },
    skyExposure: 1,
    skyExposureTarget: 1,
    skyExposureTimer: 0,
  });
  environment._updateSkyExposure(0.18, { x: 0.5, y: 2, z: 0.5 });
  assert.ok(environment.skyExposureTarget >= 0.45, 'a natural canopy must retain readable diffuse skylight');
  assert.ok(environment.skyExposureTarget < 0.7, 'dense pine boughs should still look visibly shaded');
  assert.ok(outdoorBounceIntensity(1, environment.skyExposureTarget, 0) >= 0.08,
    'daylight canopy shade must retain enough indirect light to read bark and leaf undersides');
  assert.ok(outdoorBounceIntensity(1, environment.skyExposureTarget, 1) >= 0.05,
    'rainy canopy shade must remain readable beneath the overcast deck');
  assert.ok(outdoorBounceIntensity(1, 0, 0) < 0.005,
    'a sealed surface shelter must not inherit outdoor bounce light');
});

test('selection effects never show the red placement cube without a placeable stack', () => {
  const effects = Object.create(BlockEffects.prototype);
  Object.assign(effects, {
    outline: {
      visible: false,
      position: new THREE.Vector3(),
      material: { opacity: 0 },
    },
    crack: {
      visible: false,
      position: new THREE.Vector3(),
      material: { opacity: 0 },
      scale: new THREE.Vector3(1, 1, 1),
    },
    preview: {
      visible: false,
      position: new THREE.Vector3(),
      material: { color: new THREE.Color(), opacity: 0 },
    },
    crackTexture: { offset: { x: 0 }, updateMatrix() {} },
    crackStage: -1,
    crackTarget: '',
    burst() {},
  });
  const hit = {
    block: { x: 1, y: 2, z: 3, id: BLOCK.SAND },
    adjacent: { x: 1, y: 3, z: 3 },
  };
  effects.setTarget(hit, 0, false, false);
  assert.equal(effects.preview.visible, false);
  assert.equal(effects.outline.visible, true, 'the normal target outline remains available');
  effects.setTarget(hit, 0, false, true);
  assert.equal(effects.preview.visible, false, 'invalid placement must not create a persistent red artifact');
  effects.setTarget(hit, 0, true, true);
  assert.equal(effects.preview.visible, true, 'an explicitly selected placeable stack may preview placement');
  effects.setTarget(null);
  assert.equal(effects.preview.visible, false);
});

test('a compact roof and four walls make a player-built shelter fully dark', () => {
  const environment = Object.create(Environment.prototype);
  Object.assign(environment, {
    weatherWorld: {
      worldHeight: 12,
      getBlock: (x, y, z) => {
        if (x === 0 && z === 0 && y === 4) return BLOCK.STONE;
        if (y === 2 && Math.abs(x) + Math.abs(z) === 1) return BLOCK.STONE;
        return BLOCK.AIR;
      },
      terrainHeight: () => 2,
    },
    skyExposure: 1,
    skyExposureTarget: 1,
    skyExposureTimer: 0,
  });
  environment._updateSkyExposure(0.18, { x: 0.5, y: 2, z: 0.5 });
  assert.equal(environment.skyExposureTarget, 0);
  assert.ok(environment.skyExposure < 0.5, 'a sealed one-block shelter should darken immediately');
});

test('fluid metadata exposes visibly different simulated levels', () => {
  const world = new World(991, null, null);
  assert.equal(world.setBlock(0, 45, 0, BLOCK.WATER, { fluidLevel: 6 }), true);
  assert.equal(world.getFluidLevel(0, 45, 0), 6);
  assert.ok(Math.abs(world.getFluidSurfaceY(0, 45, 0) - 45.41) < 0.001);
  assert.equal(world.setBlock(0, 45, 0, BLOCK.AIR), true);
  assert.equal(world.getFluidLevel(0, 45, 0), null);
  world.dispose();
});

test('strengthening an existing water flow invalidates its rendered chunk', () => {
  const world = new World(991, null, null);
  const chunk = world.ensurePositionGenerated(0, 0);
  const diagonal = world.ensurePositionGenerated(-1, -1);
  assert.equal(world.setBlock(-1, 45, -1, BLOCK.WATER, { fluidLevel: 6 }), true);
  assert.equal(world.setBlock(0, 45, 0, BLOCK.WATER, { fluidLevel: 6 }), true);
  chunk.meshDirty = false;
  chunk.dirty = false;
  diagonal.meshDirty = false;
  diagonal.dirty = false;
  const revision = chunk.revision;
  const diagonalRevision = diagonal.revision;
  assert.equal(world._flowInto(0, 45, 0, 2), true);
  assert.equal(world.getFluidLevel(0, 45, 0), 2);
  assert.equal(chunk.meshDirty, true);
  assert.ok(chunk.revision > revision, 'the stale water mesh revision must be invalidated');
  assert.equal(diagonal.meshDirty, true, 'a diagonally touching smoothed water mesh must be invalidated');
  assert.ok(diagonal.revision > diagonalRevision, 'the diagonal water mesh revision must advance');
  world.dispose();
});

test('selection rays pass above partial-height furniture', () => {
  const world = {
    getBlock(x, y, z) {
      if (x === 0 && y === 0 && z === 0) return BLOCK.BED;
      if (x === 1 && y === 0 && z === 0) return BLOCK.STONE;
      return BLOCK.AIR;
    },
  };
  const hit = raycastVoxels(
    new THREE.Vector3(-0.5, 0.8, 0.5),
    new THREE.Vector3(1, 0, 0),
    4,
    world,
  );
  assert.equal(hit?.block?.id, BLOCK.STONE);
  assert.equal(hit?.block?.x, 1);
});

test('selection rays ignore water cells and reach solid blocks beyond them', () => {
  const submergedWorld = {
    getBlock(x, y, z) {
      if (y !== 0 || z !== 0) return BLOCK.AIR;
      if (x === 0 || x === 1) return BLOCK.WATER;
      if (x === 2) return BLOCK.STONE;
      return BLOCK.AIR;
    },
  };
  const submergedHit = raycastVoxels(
    new THREE.Vector3(0.5, 0.5, 0.5),
    new THREE.Vector3(1, 0, 0),
    5,
    submergedWorld,
  );
  assert.equal(submergedHit?.block?.id, BLOCK.STONE);
  assert.equal(submergedHit?.block?.x, 2);

  const shallowWorld = {
    getBlock(x, y, z) {
      if (y !== 0 || z !== 0) return BLOCK.AIR;
      if (x === 0) return BLOCK.WATER;
      if (x === 1) return BLOCK.STONE;
      return BLOCK.AIR;
    },
  };
  const shallowHit = raycastVoxels(
    new THREE.Vector3(-0.5, 0.8, 0.5),
    new THREE.Vector3(1, 0, 0),
    4,
    shallowWorld,
  );
  assert.equal(shallowHit?.block?.id, BLOCK.STONE);
});

test('short crossed plants use their rendered height for selection and collision bounds', () => {
  const shortPlant = Object.values(BLOCK).find((id) => BLOCKS[id]?.shape === 'cross-short');
  assert.ok(Number.isInteger(shortPlant), 'a short crossed plant block should exist');
  const world = {
    getBlock(x, y, z) {
      if (x === 0 && y === 0 && z === 0) return shortPlant;
      if (x === 1 && y === 0 && z === 0) return BLOCK.STONE;
      return BLOCK.AIR;
    },
  };
  const hit = raycastVoxels(
    new THREE.Vector3(-0.5, 0.7, 0.5),
    new THREE.Vector3(1, 0, 0),
    4,
    world,
  );
  assert.equal(hit?.block?.id, BLOCK.STONE);
});

test('partial-height furniture uses matching collision bounds', () => {
  const camera = new THREE.PerspectiveCamera(75, 1, 0.05, 100);
  const world = { getBlock: () => BLOCK.AIR };
  const player = new PlayerController(camera, world);
  player.setPosition(0.5, 0.47, 0.5);
  assert.equal(player.intersectsBlock(0, 0, 0, BLOCK.BED), false);
  assert.equal(player.intersectsBlock(0, 0, 0, BLOCK.STONE), true);
});

test('flying out of water clears liquid state and emits one entry splash', () => {
  let water = true;
  const camera = new THREE.PerspectiveCamera(75, 1, 0.05, 100);
  const world = { getBlock: () => water ? BLOCK.WATER : BLOCK.AIR };
  const player = new PlayerController(camera, world);
  const input = {
    consumeLook: () => ({ x: 0, y: 0 }),
    isDown: () => false,
  };
  let splashes = 0;
  player.onSplash = () => { splashes++; };
  player.flying = true;
  player.update(0.016, input, {});
  assert.equal(player.inWater, true);
  assert.equal(splashes, 1);
  water = false;
  player.update(0.016, input, {});
  assert.equal(player.inWater, false);
  assert.equal(player.headUnderwater, false);
  assert.equal(splashes, 1);
});

test('ordinary jumps and short drops are safe while long falls scale with impact energy', () => {
  assert.equal(fallDamageForImpact(PLAYER.jumpSpeed), 0, 'a normal jump must never hurt');
  assert.equal(fallDamageForImpact(12.9), 0, 'short ledge drops stay inside the safe envelope');
  const medium = fallDamageForImpact(15.2);
  const severe = fallDamageForImpact(19.4);
  assert.ok(medium > 0.1 && medium < 0.3, 'a meaningful drop should cause moderate damage');
  assert.ok(severe > medium * 2, 'long falls should become substantially more dangerous');
  assert.equal(fallDamageForImpact(100), 0.86, 'damage remains capped so one landing callback is stable');
});

test('attack stamina spending has a recovery pause and cannot overdraw', () => {
  const camera = new THREE.PerspectiveCamera(75, 1, 0.05, 100);
  const world = { getBlock: () => BLOCK.AIR };
  const player = new PlayerController(camera, world);
  const input = {
    consumeLook: () => ({ x: 0, y: 0 }),
    isDown: () => false,
  };
  player.flying = true;
  assert.equal(player.spendStamina(0.2, 0.5), true);
  assert.ok(Math.abs(player.stamina - 0.8) < 1e-9);
  for (let frame = 0; frame < 8; frame += 1) player.update(0.05, input, {});
  assert.ok(Math.abs(player.stamina - 0.8) < 1e-9, 'stamina must not refill during attack recovery');
  for (let frame = 0; frame < 8; frame += 1) player.update(0.05, input, {});
  assert.ok(player.stamina > 0.8, 'stamina recovers once the action pause expires');
  player.stamina = 0.04;
  assert.equal(player.spendStamina(0.08), false);
  assert.equal(player.stamina, 0.04, 'a rejected attack cost cannot create negative stamina');
});

test('combat profiles enforce weapon recovery and sensible reach', () => {
  const sword = combatProfile(ITEM.COPPER_SWORD);
  const hand = combatProfile(0);
  assert.ok(sword.damage > hand.damage);
  assert.ok(sword.recovery > 0.25);
  assert.ok(sword.reach <= 4.25);
});

test('empty-hand mining has a visible complete swing instead of a frozen half-cycle', () => {
  const camera = new THREE.Object3D();
  const held = new HeldItemView(camera, null);
  held.setItem(0);
  held.setVisible(true);
  held.update(0.08, { mining: true });
  assert.equal(held.actionHand.visible, true);
  assert.equal(held.root.visible, true);
  const firstArc = held.root.rotation.x;
  held.update(0.12, { mining: true });
  assert.notEqual(held.root.rotation.x, firstArc, 'the mining swing must keep progressing while held');
  held.update(0.05, { mining: false });
  assert.equal(held.actionHand.visible, false, 'the fallback hand must not become another permanent held block');
  held.dispose();
});

test('animals wait for visible ground and preserve their authored hit reaction', () => {
  let terrainVisible = false;
  const world = {
    worldHeight: 32,
    terrainHeight: () => 10,
    getBlock: (_x, y) => (y === 10 ? BLOCK.TURF : BLOCK.AIR),
    isPositionReady: () => true,
    isPositionRendered: () => terrainVisible,
  };
  const system = new CreatureSystem(null, world);
  assert.equal(system._validSpawn(0.5, 0.5, new THREE.Vector3(0.5, 11, 0.5)), null);
  terrainVisible = true;
  assert.equal(system._validSpawn(0.5, 0.5, new THREE.Vector3(0.5, 11, 0.5)), 11);

  const dapple = system._makeDapple(0.5, 11, 0.5, 17);
  dapple.state = 'hit';
  dapple.hitTime = 0.2;
  dapple.desiredSpeed = 1;
  system._updateDappleIntent(dapple, new THREE.Vector3(1, 11, 0.5), 1);
  assert.equal(dapple.state, 'hit');
  assert.equal(dapple.desiredSpeed, 0);

  const dunetail = system._makeDunetail(0.5, 11, 0.5, 21);
  dunetail.state = 'hit';
  dunetail.hitTime = 0.2;
  dunetail.desiredSpeed = 1;
  system._updateDunetailIntent(dunetail, new THREE.Vector3(1, 11, 0.5), 1);
  assert.equal(dunetail.state, 'hit');
  assert.equal(dunetail.desiredSpeed, 0);
  system.dispose();
});

test('creature combat is telegraphed, threatening, and player swings recover even after misses', () => {
  assert.ok(CREATURE_COMBAT.bramblehog.damage >= 0.2);
  assert.ok(CREATURE_COMBAT.gloomling.damage >= 0.16);
  assert.ok(creatureCombatProfile('bramblehog').windup >= 0.3);

  const world = { getBlock: () => BLOCK.AIR };
  const system = new CreatureSystem(null, world);
  const fallbackEye = system._resources.materials.gloomEye;
  assert.equal(fallbackEye.emissive.getHex(), 0, 'the night-creature fallback must not emit light');
  assert.equal(fallbackEye.emissiveIntensity, 0, 'the fallback eye cannot glow while an animal model loads or fails');
  assert.equal(fallbackEye.toneMapped, true, 'the fallback remains subject to natural scene lighting');
  const miss = system.attack(
    new THREE.Vector3(0, 0.8, 0),
    new THREE.Vector3(1, 0, 0),
    4,
    1.5,
    0.7,
  );
  assert.equal(miss, null);

  const root = new THREE.Group();
  root.position.set(2, 0, 0);
  const creature = {
    id: 99,
    type: 'gloomling',
    name: 'Wolf',
    root,
    centerHeight: 0.8,
    radius: 0.72,
    baseScale: 1,
    dead: false,
    health: 5,
    maxHealth: 5,
    hitTime: 0,
    deathTime: 0,
    knockbackX: 0,
    knockbackZ: 0,
    verticalVelocity: 0,
    state: 'idle',
    stateTime: 0,
    stateDuration: 1,
    targetHeading: 0,
    provoked: 0,
  };
  system.creatures.push(creature);
  assert.equal(system.attack(
    new THREE.Vector3(0, 0.8, 0),
    new THREE.Vector3(1, 0, 0),
    4,
    1.5,
    0.7,
  ), null, 'a miss still prevents an immediate follow-up hit');
  system._time = 0.71;
  const hit = system.attack(
    new THREE.Vector3(0, 0.8, 0),
    new THREE.Vector3(1, 0, 0),
    4,
    1.5,
    0.7,
  );
  assert.equal(hit?.id, 99);
  assert.equal(hit?.recovery, 0.7);
  assert.ok(creature.knockbackX > 0, 'a hit pushes the target away from the attacker');
  const healthAfterHit = creature.health;
  assert.equal(system.attack(
    new THREE.Vector3(0, 0.8, 0),
    new THREE.Vector3(1, 0, 0),
    4,
    1.5,
    0.7,
  ), null);
  assert.equal(creature.health, healthAfterHit, 'recovery prevents click-spam damage');
  assert.notEqual(system._typeForSpawn('forest', 0.2, 0.1), 'lumenwing');
  system.dispose();
});

test('critical spawn chunks regenerate their decorations before teleport validation', () => {
  const world = new World(64, null, null);
  const spawn = world.findSpawn();
  const headY = Math.floor(spawn.y + 1.68);
  assert.equal(world.getBlock(spawn.x, headY, spawn.z), BLOCK.AIR, 'unloaded queries expose base terrain');
  world.ensurePositionGenerated(spawn.x, spawn.z);
  const decoratedHead = world.getBlock(spawn.x, headY, spawn.z);
  assert.notEqual(decoratedHead, BLOCK.AIR, 'the deterministic canopy must be visible before validation');

  world.updateStreaming({ x: 1_000, z: 1_000 }, 2);
  assert.equal(world.getBlock(spawn.x, headY, spawn.z), BLOCK.AIR, 'the spawn chunk should be unloaded');
  world.ensurePositionGenerated(spawn.x, spawn.z);
  assert.equal(world.getBlock(spawn.x, headY, spawn.z), decoratedHead, 'regeneration must restore the same obstacle');
  world.dispose();
});
