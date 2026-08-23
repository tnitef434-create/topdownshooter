import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/public/worldloom/vendor/three.module.min.js';
import { Inventory, SaveStore, DEFAULT_SETTINGS } from '../src/public/worldloom/src/save.js';
import { SurvivalSystem } from '../src/public/worldloom/src/survival.js';
import { BLOCK, BLOCKS } from '../src/public/worldloom/src/blocks.js';
import { World } from '../src/public/worldloom/src/world.js';
import { Environment } from '../src/public/worldloom/src/environment.js';
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
  getItem,
  recipeRequirements,
  recipeStations,
} from '../src/public/worldloom/src/data.js';

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
  assert.ok(generationSlices > 4, 'generation should be spread over several idle turns');

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
