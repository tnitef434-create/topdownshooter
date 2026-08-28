import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import * as THREE from '../src/public/worldloom/vendor/three.module.min.js';
import {
  Inventory,
  SaveStore,
  DEFAULT_SETTINGS,
  GRAPHICS_PRESETS,
} from '../src/public/worldloom/src/save.js';
import { SurvivalSystem } from '../src/public/worldloom/src/survival.js';
import { BLOCK, BLOCKS } from '../src/public/worldloom/src/blocks.js';
import {
  FOREST_FLOOR_CELL_SIZE,
  FOREST_FLOOR_INSECT_CHANCE,
  FOREST_FLOOR_KINDS,
  FOREST_FLOOR_MAX_TREE_DISTANCE,
  FOREST_FLOOR_MIN_FOREST_WEIGHT,
  FOREST_FLOOR_MIN_TREE_DISTANCE,
  FOREST_FLOOR_MUSHROOM_CHANCE,
  World,
  LEGACY_WORLD_GENERATOR_VERSION,
  MOUNTAIN_CROSS_SPAWN_CHANCE,
  WORLD_GENERATOR_VERSION,
  mountainCrossSpawnRoll,
} from '../src/public/worldloom/src/world.js';
import {
  BlockEffects,
  caveEntranceSkylight,
  daylightBalance,
  directionalSkyAccess,
  Environment,
  fallingLeafColumnBlocked,
  fallingLeafSupportY,
  nearestPeriodicCloudCoordinate,
  outdoorBounceIntensity,
  pinCelestialSpriteToFarPlane,
  sampleWeatherDuration,
  skylightTransmission,
  stepFallingLeafVertical,
  sunlightColorForElevation,
  WEATHER_DURATION_RANGES,
  WEATHER_FRONT_CHANCE,
  weatherFrontWillBuild,
  weatherLightingState,
} from '../src/public/worldloom/src/environment.js';
import {
  CAVE_LIGHTING_DEPTH_BLOCKS,
  caveLightingDepth,
  cavePostProcessAmount,
  projectLightToScreen,
  volumetricSunIntensity,
} from '../src/public/worldloom/src/graphics.js';
import {
  buildChunkGeometry,
  coverDepthSkylight,
  plantCoverSkylight,
} from '../src/public/worldloom/src/mesher.js';
import { VolumetricSunPass } from '../src/public/worldloom/src/volumetric-sun-pass.js';
import {
  InputController,
  PLAYER,
  PlayerController,
  continuousPointerDelta,
  fallDamageForImpact,
  raycastVoxels,
} from '../src/public/worldloom/src/player.js';
import {
  CREATURE_COMBAT,
  CreatureSystem,
  creatureCombatProfile,
} from '../src/public/worldloom/src/creatures.js';
import {
  BIRD_BREEDS,
  POND_BIRD_OCCUPANCY_CHANCE,
  BirdField,
  birdFlightPoint,
  birdFlightTangent,
  birdPondBank,
  birdPondHasResident,
  birdSpawnAllowed,
  birdSpawnPositionIsSafe,
  birdTerrainFlightApex,
  birdTreePerch,
  birdUnitHash,
  chooseBirdBreed,
} from '../src/public/worldloom/src/birds.js';
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
import {
  atmosphericFogRange,
  clampFogToMeshedTerrain,
} from '../src/public/worldloom/src/fog.js';
import {
  CHUNK_WORLD_SIZE,
  DETAIL_SUPPORT_CHUNKS,
  DISTANT_HORIZON_BUFFER_CHUNKS,
  MAX_DETAIL_DISTANCE,
  MAX_VIEW_DISTANCE,
  MIN_VIEW_DISTANCE,
  cameraFarForViewDistance,
  detailedStreamDistance,
  detailedViewDistance,
  distantHorizonRadius,
  normalizeViewDistance,
} from '../src/public/worldloom/src/streaming-config.js';
import { DistantTerrainHorizon } from '../src/public/worldloom/src/distant-terrain.js';

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

test('view-distance configuration keeps the visual horizon broad and voxel detail bounded', () => {
  assert.equal(MIN_VIEW_DISTANCE, 2);
  assert.equal(MAX_VIEW_DISTANCE, 20);
  assert.equal(MAX_DETAIL_DISTANCE, 8);
  assert.equal(DETAIL_SUPPORT_CHUNKS, 2);
  assert.equal(DISTANT_HORIZON_BUFFER_CHUNKS, 3);
  assert.equal(CHUNK_WORLD_SIZE, 16);

  assert.equal(normalizeViewDistance(undefined), 4);
  assert.equal(normalizeViewDistance(Number.NaN, 6), 6);
  assert.equal(normalizeViewDistance(-100), MIN_VIEW_DISTANCE);
  assert.equal(normalizeViewDistance('19.6'), MAX_VIEW_DISTANCE);
  assert.equal(normalizeViewDistance(10.49), 10);
  assert.equal(normalizeViewDistance(10.5), 11);
  assert.equal(normalizeViewDistance(9, 99), 9,
    'a valid requested distance must not inherit a malformed fallback');

  assert.equal(detailedViewDistance(MIN_VIEW_DISTANCE), MIN_VIEW_DISTANCE);
  assert.equal(detailedViewDistance(MAX_DETAIL_DISTANCE), MAX_DETAIL_DISTANCE);
  assert.equal(detailedViewDistance(MAX_VIEW_DISTANCE), MAX_DETAIL_DISTANCE);
  assert.equal(detailedStreamDistance(MIN_VIEW_DISTANCE), MIN_VIEW_DISTANCE + DETAIL_SUPPORT_CHUNKS);
  assert.equal(detailedStreamDistance(MAX_VIEW_DISTANCE), MAX_DETAIL_DISTANCE + DETAIL_SUPPORT_CHUNKS);

  const maximumHorizon = (MAX_VIEW_DISTANCE + DISTANT_HORIZON_BUFFER_CHUNKS) * CHUNK_WORLD_SIZE;
  assert.equal(distantHorizonRadius(MAX_VIEW_DISTANCE), maximumHorizon);
  assert.equal(cameraFarForViewDistance(MIN_VIEW_DISTANCE), 320,
    'low view distance should retain the established depth precision');
  assert.equal(cameraFarForViewDistance(MAX_VIEW_DISTANCE), maximumHorizon + 32);
  assert.ok(cameraFarForViewDistance(MAX_VIEW_DISTANCE) > distantHorizonRadius(MAX_VIEW_DISTANCE));
});

test('saved view distance clamps to 2–20 while graphics presets remain valid defaults', () => {
  const store = new SaveStore();
  const sanitize = (viewDistance) => store.sanitizeSettings({
    ...DEFAULT_SETTINGS,
    viewDistance,
  }).viewDistance;

  assert.equal(sanitize(-50), MIN_VIEW_DISTANCE);
  assert.equal(sanitize(1), MIN_VIEW_DISTANCE);
  assert.equal(sanitize(2), MIN_VIEW_DISTANCE);
  assert.equal(sanitize(19.6), MAX_VIEW_DISTANCE);
  assert.equal(sanitize(20), MAX_VIEW_DISTANCE);
  assert.equal(sanitize(500), MAX_VIEW_DISTANCE);
  assert.equal(sanitize('not-a-number'), DEFAULT_SETTINGS.viewDistance);

  for (const [name, preset] of Object.entries(GRAPHICS_PRESETS)) {
    assert.ok(Number.isInteger(preset.viewDistance), `${name} view distance must be an integer`);
    assert.ok(
      preset.viewDistance >= MIN_VIEW_DISTANCE && preset.viewDistance <= MAX_VIEW_DISTANCE,
      `${name} view distance ${preset.viewDistance} is outside the supported range`,
    );
  }
});

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

test('fresh saves use generator v2 while supported explicit versions round-trip unchanged', () => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const store = new SaveStore();
  assert.equal(store.save(validSnapshot()), true);
  assert.equal(store.load()?.generatorVersion, WORLD_GENERATOR_VERSION);

  assert.equal(store.save({
    ...validSnapshot(),
    seed: 4321,
    generatorVersion: LEGACY_WORLD_GENERATOR_VERSION,
  }), true);
  assert.equal(store.load()?.generatorVersion, LEGACY_WORLD_GENERATOR_VERSION);

  assert.equal(store.save({
    ...validSnapshot(),
    seed: 6789,
    generatorVersion: WORLD_GENERATOR_VERSION,
  }), true);
  assert.equal(store.load()?.generatorVersion, WORLD_GENERATOR_VERSION);
});

test('legacy saves without generator metadata normalize to v1 and remain v1 after autosave', () => {
  const values = new Map();
  const legacy = {
    ...validSnapshot(),
    seed: 64,
    schemaVersion: 1,
    registryVersion: 1,
  };
  values.set('worldloom.save.v1', JSON.stringify(legacy));
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };

  const store = new SaveStore();
  const loaded = store.load();
  assert.equal(loaded?.generatorVersion, LEGACY_WORLD_GENERATOR_VERSION);
  assert.equal(store.save(loaded), true);
  assert.equal(
    JSON.parse(values.get('worldloom.save.v1')).generatorVersion,
    LEGACY_WORLD_GENERATOR_VERSION,
    'autosave must not silently migrate deterministic terrain beneath legacy edits',
  );
});

test('unsupported explicit generator metadata is rejected before replacing a valid save', () => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const store = new SaveStore();
  const supported = {
    ...validSnapshot(),
    seed: 2468,
    generatorVersion: LEGACY_WORLD_GENERATOR_VERSION,
  };
  assert.equal(store.save(supported), true);
  const originalPrimary = values.get('worldloom.save.v1');
  for (const generatorVersion of [null, '1', WORLD_GENERATOR_VERSION + 1]) {
    assert.equal(store.save({ ...validSnapshot(), seed: 8642, generatorVersion }), false);
    assert.equal(values.get('worldloom.save.v1'), originalPrimary);
  }
  assert.equal(store.load()?.seed, 2468);

  const invalidPrimary = {
    ...validSnapshot(),
    seed: 9999,
    schemaVersion: 1,
    generatorVersion: WORLD_GENERATOR_VERSION + 1,
    registryVersion: 1,
  };
  values.set('worldloom.save.v1', JSON.stringify(invalidPrimary));
  values.set('worldloom.save.backup.v1', originalPrimary);
  const recovered = new SaveStore().load();
  assert.equal(recovered?.seed, 2468);
  assert.equal(recovered?.generatorVersion, LEGACY_WORLD_GENERATOR_VERSION);
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
  assert.equal(BLOCKS[BLOCK.SHORT_GRASS].renderMode, 'meadow-model');
  assert.equal(BLOCKS[BLOCK.WILDFLOWER].renderMode, 'meadow-model');
  world.dispose();
});

test('opaque Blender meadow plants emit no legacy terrain-atlas cross geometry', () => {
  const size = 2;
  const height = 2;
  const blocks = new Uint8Array(size * size * height);
  const indexAt = (x, y, z) => x + size * (z + size * y);
  blocks[indexAt(0, 1, 0)] = BLOCK.WILDFLOWER;
  blocks[indexAt(1, 1, 1)] = BLOCK.SHORT_GRASS;
  const world = {
    chunkSize: size,
    worldHeight: height,
    getBlock: (x, y, z) => (
      x >= 0 && x < size && y >= 0 && y < height && z >= 0 && z < size
        ? blocks[indexAt(x, y, z)]
        : BLOCK.AIR
    ),
  };
  const geometry = buildChunkGeometry(world, { cx: 0, cz: 0, blocks });
  assert.equal(geometry.faces, 0,
    'the terrain mesher still emitted crossed cards behind the opaque Blender plants');
  assert.equal(geometry.opaque?.getAttribute('position')?.count || 0, 0);
  geometry.opaque?.dispose?.();
  geometry.glass?.dispose?.();
  geometry.water?.dispose?.();
  geometry.glow?.dispose?.();
});

test('falling leaves resolve real supports while ignoring canopy foliage', () => {
  const cells = new Map([
    ['0:8:0', BLOCK.STONE],
    ['1:10:0', BLOCK.ASH_LEAVES],
    ['1:2:0', BLOCK.TURF],
    ['2:5:0', BLOCK.WATER],
    ['3:5:0', BLOCK.BED],
    ['4:7:0', BLOCK.STONE],
    ['4:8:0', BLOCK.STONE],
  ]);
  const world = {
    worldHeight: 16,
    terrainHeight: () => 2,
    getBlock: (x, y, z) => cells.get(`${x}:${y}:${z}`) ?? BLOCK.AIR,
    getFluidSurfaceY: (x, y) => (x === 2 && y === 5 ? 5.62 : null),
  };
  assert.ok(Math.abs(fallingLeafSupportY(world, 0.2, 0.2, 12) - 9.025) < 1e-6,
    'an edited stone roof was not treated as the leaf support');
  assert.ok(Math.abs(fallingLeafSupportY(world, 1.2, 0.2, 12) - 3.025) < 1e-6,
    'canopy leaves must be skipped so airborne particles reach the ground');
  assert.ok(Math.abs(fallingLeafSupportY(world, 2.2, 0.2, 12) - 5.645) < 1e-6,
    'water must use its real partial fluid surface');
  assert.ok(Math.abs(fallingLeafSupportY(world, 3.2, 0.2, 12) - 5.485) < 1e-6,
    'slab-height authored floors must receive falling leaves');
  assert.equal(fallingLeafColumnBlocked(world, 4.2, 8.5, 0.2), true,
    'a leaf inside a stacked solid column was not rejected as a side collision');
  assert.equal(Number.isNaN(fallingLeafSupportY(world, 4.2, 0.2, 8.5)), true,
    'an internal face between stacked solids was incorrectly accepted as a floor');
  assert.equal(fallingLeafColumnBlocked(world, 1.2, 10.5, 0.2), false,
    'canopy foliage should not block a falling leaf horizontally');
});

test('slow falling leaves remain airborne beyond the old TTL and still land', () => {
  let y = 12;
  let flightAge = 0;
  let landed = false;
  for (let step = 0; step < 120; step++) {
    const result = stepFallingLeafVertical(y, -0.35, 3.025, 0.1, flightAge);
    y = result.y;
    flightAge = result.flightAge;
    landed = result.landed;
  }
  assert.equal(landed, false, 'the regression fixture should still be airborne after twelve seconds');
  assert.ok(y > 3.025, 'the leaf disappeared or snapped before crossing the floor');
  for (let step = 0; step < 200 && !landed; step++) {
    const result = stepFallingLeafVertical(y, -0.35, 3.025, 0.1, flightAge);
    y = result.y;
    flightAge = result.flightAge;
    landed = result.landed;
  }
  assert.equal(landed, true, 'the slow leaf never completed its descent');
  assert.ok(Math.abs(y - 3.025) < 1e-6, 'the leaf did not settle flush on its support');
});

test('tree descriptors are seed-stable, query-stable and sorted nearest first', () => {
  const center = { x: 18.25, z: -11.75 };
  const radius = 128;
  const firstWorld = new World(64, null, null);
  const secondWorld = new World(64, null, null);
  const differentWorld = new World(91234, null, null);
  const first = firstWorld.getTreesNear(center.x, center.z, radius);
  const repeated = firstWorld.getTreesNear(center.x, center.z, radius);
  const sameSeed = secondWorld.getTreesNear(center.x, center.z, radius);
  const differentSeed = differentWorld.getTreesNear(center.x, center.z, radius);

  assert.ok(first.length > 100, 'tree query fixture should cover a meaningful woodland sample');
  assert.deepEqual(repeated, first, 'repeating a query changed its descriptors or order');
  assert.deepEqual(sameSeed, first, 'the same seed produced different tree descriptors');
  assert.notDeepEqual(differentSeed, first, 'different seeds produced the same tree descriptors');
  assert.ok(first.every((tree) => Object.isFrozen(tree)));
  assert.ok(first.every((tree) => (
    Number.isInteger(tree.cellX)
    && Number.isInteger(tree.cellZ)
    && Number.isInteger(tree.rootX)
    && Number.isInteger(tree.rootY)
    && Number.isInteger(tree.rootZ)
    && Number.isInteger(tree.trunkHeight)
    && typeof tree.hasHangingLeaves === 'boolean'
  )));
  for (let index = 1; index < first.length; index++) {
    const previous = first[index - 1];
    const current = first[index];
    const previousDistance = Math.hypot(previous.rootX - center.x, previous.rootZ - center.z);
    const currentDistance = Math.hypot(current.rootX - center.x, current.rootZ - center.z);
    assert.ok(
      previousDistance < currentDistance
      || Math.abs(previousDistance - currentDistance) < 1e-12
        && previous.id.localeCompare(current.id) <= 0,
      `tree descriptor order changed between ${previous.id} and ${current.id}`,
    );
  }

  firstWorld.dispose();
  secondWorld.dispose();
  differentWorld.dispose();
});

test('forest-floor descriptors replay across query order and chunk streaming', () => {
  const center = { x: 18.25, z: -11.75 };
  const radius = 128;
  const firstWorld = new World(20260827, null, null);
  const replayWorld = new World(20260827, null, null);
  const differentWorld = new World(91234, null, null);
  const first = firstWorld.getForestFloorNear(center.x, center.z, radius);

  assert.ok(first.length > 30, 'forest-floor fixture should cover a useful descriptor sample');
  assert.equal(firstWorld.chunks.size, 0, 'a pure descriptor query must not stream voxel chunks');
  firstWorld.getForestFloorNear(-96, 144, 72);
  assert.deepEqual(firstWorld.getForestFloorNear(center.x, center.z, radius), first,
    'an interleaved query changed forest-floor descriptors or ordering');
  assert.deepEqual(replayWorld.getForestFloorNear(center.x, center.z, radius), first,
    'the same seed did not replay the same forest floor');
  assert.notDeepEqual(differentWorld.getForestFloorNear(center.x, center.z, radius), first,
    'a different seed reused the same forest floor');

  const inner = firstWorld.getForestFloorNear(center.x, center.z, 72);
  assert.deepEqual(inner, first.filter((descriptor) => (
    Math.hypot(descriptor.x - center.x, descriptor.z - center.z) <= 72
  )), 'overlapping focus queries disagreed about shared descriptor cells');

  for (const descriptor of [...first].reverse()) {
    firstWorld.ensurePositionGenerated(descriptor.x, descriptor.z);
  }
  assert.deepEqual(firstWorld.getForestFloorNear(center.x, center.z, radius), first,
    'materializing chunks changed pure forest-floor generation');
  assert.equal(new Set(first.map(({ key }) => key)).size, first.length,
    'forest-floor keys must be unique within a world query');
  for (let index = 1; index < first.length; index++) {
    const previous = first[index - 1];
    const current = first[index];
    const previousDistance = Math.hypot(previous.x - center.x, previous.z - center.z);
    const currentDistance = Math.hypot(current.x - center.x, current.z - center.z);
    assert.ok(
      previousDistance < currentDistance
      || Math.abs(previousDistance - currentDistance) < 1e-12
        && previous.key.localeCompare(current.key) <= 0,
      `forest-floor ordering changed between ${previous.key} and ${current.key}`,
    );
  }

  firstWorld.dispose();
  replayWorld.dispose();
  differentWorld.dispose();
});

test('forest-floor descriptors stay sparse, dry, forest-bound and clear of generated decor', () => {
  const world = new World(20260827, null, null);
  const radius = 192;
  const descriptors = world.getForestFloorNear(0, 0, radius);
  const theoreticalCells = Math.PI * radius * radius
    / (FOREST_FLOOR_CELL_SIZE * FOREST_FLOOR_CELL_SIZE);
  const density = descriptors.length / theoreticalCells;
  assert.ok(density > 0.005 && density < 0.06,
    `forest-floor distribution stopped being sparse and natural (${density})`);
  assert.ok(Object.isFrozen(FOREST_FLOOR_KINDS));

  let minimumSpacing = Number.POSITIVE_INFINITY;
  for (let index = 0; index < descriptors.length; index++) {
    const descriptor = descriptors[index];
    assert.equal(Object.isFrozen(descriptor), true);
    assert.match(descriptor.key, /^forest-floor:-?\d+,-?\d+$/);
    assert.ok(FOREST_FLOOR_KINDS.includes(descriptor.kind));
    assert.ok(Number.isFinite(descriptor.x) && Number.isFinite(descriptor.y)
      && Number.isFinite(descriptor.z));
    assert.ok(Number.isFinite(descriptor.yaw) && descriptor.yaw >= 0
      && descriptor.yaw < Math.PI * 2);
    assert.ok(Number.isFinite(descriptor.scale) && descriptor.scale > 0.7
      && descriptor.scale < 1.2);
    assert.ok(descriptor.wetnessSeed >= 0 && descriptor.wetnessSeed < 1);
    assert.equal(typeof descriptor.mushrooms, 'boolean');
    assert.equal(typeof descriptor.insects, 'boolean');

    const x = Math.floor(descriptor.x);
    const z = Math.floor(descriptor.z);
    const info = world._columnInfo(x, z);
    assert.equal(info.biome, 'forest');
    assert.ok(info.forestWeight >= FOREST_FLOOR_MIN_FOREST_WEIGHT);
    assert.equal(info.pondId, null);
    assert.equal(Number.isFinite(info.pondWaterLevel), false);
    assert.equal(info.surfaceSand, false);
    assert.equal(info.caveMouth, false);
    assert.equal(descriptor.y, info.height + 1);
    const support = world._baseBlockAt(x, info.height, z);
    assert.equal(BLOCKS[support]?.solid, true);
    assert.equal(BLOCKS[support]?.liquid, false);
    assert.equal(world._baseBlockAt(x, info.height + 1, z), BLOCK.AIR);
    assert.equal(world._generatedSurfaceDecorAt(x, z, info), false,
      `${descriptor.key} overlaps generated plant decor`);

    const trees = world.getTreesNear(x, z, FOREST_FLOOR_MAX_TREE_DISTANCE + 2);
    const anchor = trees.find((tree) => tree.id === descriptor.treeKey);
    assert.ok(anchor, `${descriptor.key} lost its living-tree anchor`);
    const anchorDistance = Math.hypot(anchor.rootX - x, anchor.rootZ - z);
    assert.ok(anchorDistance >= FOREST_FLOOR_MIN_TREE_DISTANCE
      && anchorDistance <= FOREST_FLOOR_MAX_TREE_DISTANCE,
    `${descriptor.key} is not naturally near its tree (${anchorDistance})`);
    assert.equal(world._forestFloorFootprintIsClear(
      x,
      z,
      descriptor.kind,
      trees,
      info.height,
    ), true, `${descriptor.key} footprint intersects water, a trunk, or generated decor`);

    for (let other = 0; other < index; other++) {
      minimumSpacing = Math.min(minimumSpacing, Math.hypot(
        descriptor.x - descriptors[other].x,
        descriptor.z - descriptors[other].z,
      ));
    }
  }
  assert.ok(minimumSpacing >= 4.5,
    `forest-floor descriptors clumped into collisions (${minimumSpacing})`);
  world.dispose();
});

test('forest-floor subtype ecology covers every kind with minority log life', () => {
  const seeds = [64, 65, 91234, 0x5f3759df, 0xa511e9b3, 1234, 777, 20260827];
  const descriptors = [];
  for (const seed of seeds) {
    const world = new World(seed, null, null);
    descriptors.push(...world.getForestFloorNear(0, 0, 192));
    world.dispose();
  }
  assert.deepEqual(
    [...new Set(descriptors.map(({ kind }) => kind))].sort(),
    [...FOREST_FLOOR_KINDS].sort(),
    'the deterministic population lost a requested forest-floor subtype',
  );

  const woody = descriptors.filter(({ kind }) => kind === 'fallen_log' || kind === 'stump');
  const nonWoody = descriptors.filter(({ kind }) => kind !== 'fallen_log' && kind !== 'stump');
  const mushroomCount = woody.filter(({ mushrooms }) => mushrooms).length;
  const insectCount = woody.filter(({ insects }) => insects).length;
  const mushroomRatio = mushroomCount / woody.length;
  const insectRatio = insectCount / woody.length;
  assert.ok(woody.length > 40, 'minority checks need a meaningful log and stump sample');
  assert.ok(mushroomCount > 0 && mushroomRatio < 0.5,
    `mushrooms must remain a minority of logs/stumps (${mushroomRatio})`);
  assert.ok(insectCount > 0 && insectRatio < mushroomRatio && insectRatio < 0.25,
    `insects must remain the smaller log/stump minority (${insectRatio})`);
  assert.ok(Math.abs(mushroomRatio - FOREST_FLOOR_MUSHROOM_CHANCE) < 0.12,
    `mushroom population drifted from its seeded chance (${mushroomRatio})`);
  assert.ok(Math.abs(insectRatio - FOREST_FLOOR_INSECT_CHANCE) < 0.08,
    `insect population drifted from its seeded chance (${insectRatio})`);
  assert.equal(nonWoody.some(({ mushrooms, insects }) => mushrooms || insects), false,
    'non-log decor cannot carry log mushrooms or insects');
});

test('eligible mountain sectors receive deterministic crosses on a one-in-four roll', () => {
  const center = { x: 0, z: 0 };
  const radius = 384;
  const firstWorld = new World(64, null, null);
  const secondWorld = new World(64, null, null);
  const differentWorld = new World(91234, null, null);
  const legacyWorld = new World(64, null, null, {
    generatorVersion: LEGACY_WORLD_GENERATOR_VERSION,
  });
  const first = firstWorld.getMountainCrossesNear(center.x, center.z, radius);

  assert.ok(first.length >= 3, 'the mountain fixture should expose several quarter-chance summit monuments');
  assert.deepEqual(firstWorld.getMountainCrossesNear(center.x, center.z, radius), first,
    'repeating the summit query changed its descriptors or order');
  assert.deepEqual(secondWorld.getMountainCrossesNear(center.x, center.z, radius), first,
    'the same seed produced different summit crosses');
  assert.notDeepEqual(differentWorld.getMountainCrossesNear(center.x, center.z, radius), first,
    'different seeds produced the same summit crosses');
  assert.deepEqual(legacyWorld.getMountainCrossesNear(center.x, center.z, radius), [],
    'legacy generator worlds must retain their original decoration bytes');
  assert.equal(new Set(first.map((cross) => cross.id)).size, first.length,
    'a mountain sector emitted more than one cross');
  assert.ok(first.every((cross) => (
    Object.isFrozen(cross)
    && Number.isInteger(cross.rootX)
    && Number.isInteger(cross.rootY)
    && Number.isInteger(cross.rootZ)
    && cross.rootY === cross.summitHeight + 1
    && cross.summitHeight >= firstWorld.seaLevel + 24
    && ['x', 'z'].includes(cross.axis)
    && cross.asset === 'summit-cross.glb'
    && cross.modelHeight === 7
    && cross.crossbeamHeight === 5.12
    && cross.spawnChance === MOUNTAIN_CROSS_SPAWN_CHANCE
    && cross.spawnRoll === mountainCrossSpawnRoll(cross.cellX, cross.cellZ, firstWorld.seed)
    && cross.spawnRoll < MOUNTAIN_CROSS_SPAWN_CHANCE
  )), 'summit descriptors must be immutable, elevated and structurally complete');
  for (const cross of first) {
    assert.equal(firstWorld.terrainHeight(cross.rootX, cross.rootZ), cross.summitHeight,
      `cross ${cross.id} drifted away from its terrain summit`);
  }

  firstWorld.dispose();
  secondWorld.dispose();
  differentWorld.dispose();
  legacyWorld.dispose();
});

test('mountain cross spawn rolls remain statistically locked to twenty-five percent', () => {
  let selected = 0;
  let sampled = 0;
  for (const seed of [64, 91234, 0x5f3759df, 0xa511e9b3]) {
    for (let cellZ = -32; cellZ < 32; cellZ++) {
      for (let cellX = -32; cellX < 32; cellX++) {
        sampled++;
        if (mountainCrossSpawnRoll(cellX, cellZ, seed) < MOUNTAIN_CROSS_SPAWN_CHANCE) selected++;
      }
    }
  }
  const ratio = selected / sampled;
  assert.ok(ratio >= 0.24 && ratio <= 0.26,
    `expected a deterministic 25% cross roll, received ${(ratio * 100).toFixed(2)}%`);
});

test('summit descriptors reserve open air for the Blender model instead of voxel plus signs', () => {
  const world = new World(64, null, null);
  const cross = world.getMountainCrossesNear(0, 0, 384)[0];
  assert.ok(cross, 'the fixture needs a generated summit cross');
  world.ensurePositionGenerated(cross.rootX, cross.rootZ);
  for (let dy = 0; dy < 5; dy++) {
    assert.equal(world.getBlock(cross.rootX, cross.rootY + dy, cross.rootZ), BLOCK.AIR,
      `old voxel upright leaked into the Blender model at height ${dy}`);
  }
  const oldArmY = cross.rootY + 3;
  for (const offset of [-1, 1]) {
    const x = cross.rootX + (cross.axis === 'x' ? offset : 0);
    const z = cross.rootZ + (cross.axis === 'z' ? offset : 0);
    world.ensurePositionGenerated(x, z);
    assert.equal(world.getBlock(x, oldArmY, z), BLOCK.AIR,
      'old voxel crossbeam leaked beneath the authored Blender cross');
  }
  world.dispose();
});

test('hanging-leaf metadata selects an independent quarter of accepted trees', () => {
  const world = new World(91234, null, null);
  const trees = world.getTreesNear(0, 0, 192);
  const selected = trees.filter((tree) => tree.hasHangingLeaves).length;
  const ratio = selected / trees.length;
  assert.ok(trees.length > 1_000, 'selection fixture should sample enough accepted trees');
  assert.ok(ratio >= 0.2 && ratio <= 0.3,
    `expected a deterministic quarter of trees, received ${(ratio * 100).toFixed(2)}%`);
  world.dispose();
});

test('falling-leaf metadata selects only ash trees for matching forest-floor litter', () => {
  const world = new World(91234, null, null);
  const trees = world.getTreesNear(0, 0, 192);
  const ash = trees.filter((tree) => !tree.isPine);
  const selected = ash.filter((tree) => tree.hasFallingLeaves);
  assert.ok(ash.length > 600, 'falling-leaf fixture should sample enough ash trees');
  assert.equal(trees.filter((tree) => tree.isPine && tree.hasFallingLeaves).length, 0,
    'pine trees must not receive broad ash-leaf particles or litter');
  const ratio = selected.length / ash.length;
  assert.ok(ratio >= 0.4 && ratio <= 0.52,
    `expected roughly 46% of ash trees to shed leaves, received ${(ratio * 100).toFixed(2)}%`);
  world.dispose();
});

test('tree descriptor refactor preserves fixed-seed decorated chunk bytes', () => {
  const fixtures = [
    { seed: 64, cx: 0, cz: 0, hash: 'cf4226f33b9feb5055fa7aa15994074221cb55be455d96da3bddae3e4c3745b3' },
    { seed: 64, cx: 3, cz: -2, hash: '2166c24e5a7e2360c6e840a827d4b8d6c00405ac093d9eb8475ab275eb2d8079' },
    { seed: 91234, cx: 1, cz: 1, hash: '1d61d21d969f2bcb67764016fd32b5ec34e9c18b2369649e6e0b2c6102a6053d' },
  ];
  for (const fixture of fixtures) {
    const world = new World(fixture.seed, null, null);
    const chunk = world.ensurePositionGenerated(fixture.cx * 16, fixture.cz * 16);
    const hash = createHash('sha256').update(chunk.blocks).digest('hex');
    assert.equal(hash, fixture.hash,
      `tree metadata changed generated bytes for ${fixture.seed}:${fixture.cx},${fixture.cz}`);
    world.dispose();
  }
});

function pondDescriptor(pond) {
  return {
    id: pond.id,
    cellX: pond.cellX,
    cellZ: pond.cellZ,
    centerX: pond.centerX,
    centerZ: pond.centerZ,
    radiusX: pond.radiusX,
    radiusZ: pond.radiusZ,
    rotation: pond.rotation,
    waterY: pond.waterY,
    phase: pond.phase,
  };
}

function pondFootprint(world, pond) {
  const reach = Math.ceil(Math.max(pond.radiusX, pond.radiusZ)) + 3;
  const columns = [];
  for (let z = Math.floor(pond.centerZ) - reach; z <= Math.ceil(pond.centerZ) + reach; z++) {
    for (let x = Math.floor(pond.centerX) - reach; x <= Math.ceil(pond.centerX) + reach; x++) {
      const info = world._columnInfo(x, z);
      if (info.pondId !== pond.id) continue;
      columns.push({ x, z, info });
    }
  }
  return {
    columns,
    water: columns.filter(({ info }) => Number.isFinite(info.pondWaterLevel)),
    rim: columns.filter(({ info }) => !Number.isFinite(info.pondWaterLevel)),
  };
}

test('generator v1 keeps legacy terrain pond-free and retains edits across Continue loads', () => {
  const fresh = new World(64, null, null);
  assert.equal(fresh.generatorVersion, WORLD_GENERATOR_VERSION);
  const pond = fresh.getPondsNear(0, 0, 96)[0];
  assert.ok(pond, 'the v2 fixture needs a pond where legacy terrain remains untouched');
  const x = Math.floor(pond.centerX);
  const z = Math.floor(pond.centerZ);
  const v2Info = fresh._columnInfo(x, z);
  assert.equal(v2Info.pondId, pond.id);

  const legacy = new World(64, null, null, {
    generatorVersion: LEGACY_WORLD_GENERATOR_VERSION,
  });
  assert.equal(legacy.generatorVersion, LEGACY_WORLD_GENERATOR_VERSION);
  assert.deepEqual(legacy.getPondsNear(0, 0, 256), []);
  const legacyInfo = legacy._columnInfo(x, z);
  assert.equal(legacyInfo.pondId, null);
  assert.equal(legacyInfo.height, legacyInfo.baseHeight);
  assert.notEqual(legacy.getBlock(x, pond.waterY, z), BLOCK.WATER);

  const editY = v2Info.height;
  const editBlock = fresh.getBlock(x, editY, z);
  assert.notEqual(legacy.getBlock(x, editY, z), editBlock,
    'the compatibility fixture needs generator-dependent deterministic terrain');
  legacy.ensurePositionGenerated(x, z);
  assert.equal(legacy.setBlock(x, editY, z, editBlock), true);
  const savedEdits = legacy.serializeEdits();
  assert.ok(savedEdits.chunks.length > 0);
  const continued = new World(64, null, null, {
    generatorVersion: LEGACY_WORLD_GENERATOR_VERSION,
  });
  continued.loadEdits(savedEdits);
  assert.equal(continued.getBlock(x, editY, z), editBlock);
  assert.ok(continued.serializeEdits().chunks.length > 0,
    'legacy edit canonicalization must use the v1 base generator selected before loading');

  const wronglyMigrated = new World(64, null, null, {
    generatorVersion: WORLD_GENERATOR_VERSION,
  });
  wronglyMigrated.loadEdits(savedEdits);
  assert.equal(wronglyMigrated.serializeEdits().chunks.length, 0,
    'control: relabeling this save as v2 would incorrectly discard the legacy surface edit');
  fresh.dispose();
  legacy.dispose();
  continued.dispose();
  wronglyMigrated.dispose();
});

function intendedPondWaterColumns(world, pond) {
  const reach = Math.ceil(Math.max(pond.radiusX, pond.radiusZ) * 1.08) + 2;
  const columns = [];
  for (let z = Math.floor(pond.centerZ) - reach; z <= Math.ceil(pond.centerZ) + reach; z++) {
    for (let x = Math.floor(pond.centerX) - reach; x <= Math.ceil(pond.centerX) + reach; x++) {
      const normalized = world._pondNormalizedAt(pond, x, z);
      if (normalized < 0.82) columns.push({ x, z, normalized });
    }
  }
  return columns;
}

function assertPondIsClosedAndAtomic(world, pond, label) {
  const intended = intendedPondWaterColumns(world, pond);
  assert.ok(intended.length > 0, `${label} must contain intended source columns`);
  const waterKeys = new Set(intended.map(({ x, z }) => `${x},${z}`));
  const visited = new Set();
  const pending = [intended[0]];
  while (pending.length) {
    const column = pending.pop();
    const key = `${column.x},${column.z}`;
    if (visited.has(key)) continue;
    visited.add(key);
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const neighborKey = `${column.x + dx},${column.z + dz}`;
      if (!waterKeys.has(neighborKey) || visited.has(neighborKey)) continue;
      pending.push({ x: column.x + dx, z: column.z + dz });
    }
  }
  assert.equal(visited.size, intended.length, `${label} source footprint cannot fragment`);

  const checkedPerimeter = new Set();
  for (const { x, z, normalized } of intended) {
    const info = world._columnInfo(x, z);
    const macro = world._macroTerrainAt(x, z);
    const intendedBedY = pond.waterY - (normalized < 0.43 ? 2 : 1);
    assert.equal(info.pondId, pond.id, `${label} must apply every intended column atomically`);
    assert.equal(info.pondWaterLevel, pond.waterY);
    assert.equal(info.height, intendedBedY);
    assert.ok(macro.height >= pond.waterY, `${label} cannot float over low macro terrain`);
    assert.ok(BLOCKS[world.getBlock(x, intendedBedY, z)]?.solid,
      `${label} needs a solid bed at ${x},${intendedBedY},${z}`);

    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const bankX = x + dx;
      const bankZ = z + dz;
      const bankKey = `${bankX},${bankZ}`;
      if (waterKeys.has(bankKey) || checkedPerimeter.has(bankKey)) continue;
      checkedPerimeter.add(bankKey);
      assert.ok(world._macroTerrainAt(bankX, bankZ).height >= pond.waterY,
        `${label} four-neighbor perimeter cannot rely on raised terrain at ${bankKey}`);
      assert.ok(BLOCKS[world.getBlock(bankX, pond.waterY, bankZ)]?.solid,
        `${label} source must be closed by a solid four-neighbor bank at ${bankKey}`);
    }
  }
  assert.ok(checkedPerimeter.size > 0);
}

test('unsafe cave and low-rim pond repros are rejected as whole deterministic candidates', () => {
  const lowRim = new World(7, null, null, { generatorVersion: WORLD_GENERATOR_VERSION });
  assert.equal(lowRim._pondCandidateForCell(-1, 1), null,
    'seed 7 pond -1,1 previously exposed source water to low AIR at its perimeter');
  const caveBed = new World(65, null, null, { generatorVersion: WORLD_GENERATOR_VERSION });
  assert.equal(caveBed._pondCandidateForCell(2, 1), null,
    'seed 65 pond 2,1 previously carved its intended bed through a cave entrance');
  const fragmented = new World(143, null, null, { generatorVersion: WORLD_GENERATOR_VERSION });
  assert.equal(fragmented._pondCandidateForCell(-1, -1), null,
    'edge-noise islands must reject the whole feature instead of creating detached pools');
  lowRim.dispose();
  caveBed.dispose();
  fragmented.dispose();
});

test('accepted ponds remain connected, cave-safe and fully banked across a bounded seed sweep', () => {
  let checked = 0;
  for (let seed = 1; seed <= 48; seed++) {
    const world = new World(seed, null, null, { generatorVersion: WORLD_GENERATOR_VERSION });
    for (const pond of world.getPondsNear(0, 0, 112).slice(0, 2)) {
      assertPondIsClosedAndAtomic(world, pond, `seed ${seed} pond ${pond.id}`);
      checked++;
    }
    assert.equal(world.fluidLevels.size, 0, `seed ${seed} natural ponds cannot allocate flow metadata`);
    assert.equal(world.fluidQueue.length - world.fluidQueueHead, 0,
      `seed ${seed} natural ponds cannot enqueue simulation work`);
    assert.deepEqual(world.serializeEdits().chunks, []);
    assert.deepEqual(world.serializeEdits().fluids, []);
    world.dispose();
  }
  assert.ok(checked >= 20, 'the safety pass must retain a useful density of valid small ponds');
});

test('small-pond descriptors are deterministic for a seed and vary across seeds', () => {
  const first = new World(64, null, null);
  const replay = new World(64, null, null);
  const different = new World(65, null, null);
  const firstDescriptors = first.getPondsNear(0, 0, 96).map(pondDescriptor);
  const replayDescriptors = replay.getPondsNear(0, 0, 96).map(pondDescriptor);
  const differentDescriptors = different.getPondsNear(0, 0, 96).map(pondDescriptor);

  assert.ok(firstDescriptors.length > 0, 'the deterministic fixture must contain an inland pond');
  assert.deepEqual(replayDescriptors, firstDescriptors, 'the same seed must reproduce exact pond descriptors');
  assert.notDeepEqual(differentDescriptors, firstDescriptors, 'a different seed must not reuse the pond layout');
  assert.ok(firstDescriptors.every((pond) => (
    pond.waterY > first.seaLevel
    && pond.radiusX >= 4 && pond.radiusX < 8
    && pond.radiusZ >= 4 && pond.radiusZ < 8
  )), 'pond descriptors should remain small, shallow inland features');

  first.dispose();
  replay.dispose();
  different.dispose();
});

test('generated ponds preserve flat source water, solid beds and base-query agreement', () => {
  const world = new World(64, null, null);
  const pond = world.getPondsNear(0, 0, 96)[0];
  assert.ok(pond, 'the deterministic fixture must contain a nearby pond');
  const footprint = pondFootprint(world, pond);
  assert.ok(footprint.water.length >= 24 && footprint.water.length <= 192, 'the pond should stay compact');
  assert.ok(footprint.rim.length > 0, 'the source water must have an authored bank ring');
  assert.deepEqual(
    [...new Set(footprint.water.map(({ info }) => info.pondWaterLevel))],
    [pond.waterY],
    'every pond column must share one flat water level',
  );

  const waterKeys = new Set(footprint.water.map(({ x, z }) => `${x},${z}`));
  const checkedRim = new Set();
  const beforeGeneration = [];
  for (const { x, z, info } of footprint.columns) {
    const minimumY = Math.min(info.height, pond.waterY - 2);
    for (let y = minimumY; y <= pond.waterY; y++) {
      beforeGeneration.push([x, y, z, world.getBlock(x, y, z)]);
    }
  }
  for (const { x, z, info } of footprint.water) {
    assert.ok(BLOCKS[world.getBlock(x, info.height, z)]?.solid, 'pond water needs a solid voxel bed');
    assert.ok(pond.waterY - info.height >= 1 && pond.waterY - info.height <= 2,
      'small ponds should be one or two source blocks deep');
    for (let y = info.height + 1; y <= pond.waterY; y++) {
      assert.equal(world.getBlock(x, y, z), BLOCK.WATER, 'the carved bowl must contain only water');
    }
    assert.equal(world.getFluidLevel(x, pond.waterY, z), 0, 'natural pond water is a full source');
    assert.ok(Math.abs(world.getFluidSurfaceY(x, pond.waterY, z) - (pond.waterY + 0.92)) < 1e-9);

    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const neighborKey = `${x + dx},${z + dz}`;
      if (waterKeys.has(neighborKey) || checkedRim.has(neighborKey)) continue;
      checkedRim.add(neighborKey);
      assert.ok(
        BLOCKS[world.getBlock(x + dx, pond.waterY, z + dz)]?.solid,
        `pond source at ${x},${z} must be closed by a solid bank at ${neighborKey}`,
      );
    }
  }
  assert.ok(checkedRim.size > 0);
  assert.equal(world.fluidLevels.size, 0, 'natural sources must not allocate simulated-flow metadata');
  assert.equal(world.fluidQueue.length - world.fluidQueueHead, 0, 'natural sources must not start fluid work');
  assert.deepEqual(world.serializeEdits().chunks, []);
  assert.deepEqual(world.serializeEdits().fluids, []);

  // Materialize every chunk touched by the feature. The loaded voxel arrays
  // must agree with unloaded deterministic getBlock() queries exactly.
  for (const { x, z } of footprint.columns) world.ensurePositionGenerated(x, z);
  for (const [x, y, z, expected] of beforeGeneration) {
    assert.equal(world.getBlock(x, y, z), expected, `generated pond voxel diverged at ${x},${y},${z}`);
  }
  const forbiddenWaterGrowth = new Set([
    BLOCK.ASH_LOG,
    BLOCK.PINE_LOG,
    BLOCK.OVERGROWN_ASH_LOG,
    BLOCK.OVERGROWN_PINE_LOG,
    BLOCK.FERN,
    BLOCK.WILDFLOWER,
    BLOCK.SHORT_GRASS,
    BLOCK.CACTUS,
  ]);
  for (const { x, z, info } of footprint.water) {
    for (let y = info.height + 1; y <= pond.waterY; y++) {
      assert.equal(world.getBlock(x, y, z), BLOCK.WATER, 'decorations must never replace pond water');
    }
    assert.equal(
      forbiddenWaterGrowth.has(world.getBlock(x, pond.waterY + 1, z)),
      false,
      'trees and plants must not root immediately above pond water',
    );
  }
  assert.equal(world.fluidLevels.size, 0);
  assert.equal(world.fluidQueue.length - world.fluidQueueHead, 0);
  assert.deepEqual(world.serializeEdits().chunks, []);
  assert.deepEqual(world.serializeEdits().fluids, []);
  world.dispose();
});

test('breaking a generated pond bank activates a persisted flowing-water cell', () => {
  const world = new World(64, null, null);
  const pond = world.getPondsNear(0, 0, 96)[0];
  const footprint = pondFootprint(world, pond);
  for (const { x, z } of footprint.columns) world.ensurePositionGenerated(x, z);
  const waterKeys = new Set(footprint.water.map(({ x, z }) => `${x},${z}`));
  let bank = null;
  for (const { x, z } of footprint.water) {
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (waterKeys.has(`${x + dx},${z + dz}`)) continue;
      if (!BLOCKS[world.getBlock(x + dx, pond.waterY, z + dz)]?.solid) continue;
      bank = { x: x + dx, y: pond.waterY, z: z + dz };
      break;
    }
    if (bank) break;
  }
  assert.ok(bank, 'the pond fixture needs a breakable bank beside source water');
  world.ensurePositionGenerated(bank.x, bank.z);
  assert.deepEqual(world.serializeEdits().chunks, []);
  assert.deepEqual(world.serializeEdits().fluids, []);

  assert.equal(world.setBlock(bank.x, bank.y, bank.z, BLOCK.AIR), true);
  assert.ok(world.fluidQueue.length - world.fluidQueueHead > 0, 'opening the bank must wake a source cell');
  for (let pass = 0; pass < 8 && world.getBlock(bank.x, bank.y, bank.z) !== BLOCK.WATER; pass++) {
    world.updateFluids(32);
  }
  assert.equal(world.getBlock(bank.x, bank.y, bank.z), BLOCK.WATER, 'the source should flow into the opening');
  assert.ok(world.getFluidLevel(bank.x, bank.y, bank.z) > 0, 'new outflow must retain a finite flow level');
  const saved = world.serializeEdits();
  assert.ok(saved.chunks.length > 0, 'the opened bank must persist as a world edit');
  assert.ok(saved.fluids.some(([x, y, z]) => x === bank.x && y === bank.y && z === bank.z),
    'the simulated outflow level must be serialized');
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

test('maximum visual distance stages admission without exceeding the full-detail chunk budget', () => {
  const world = new World(7342, null, null);
  const position = { x: 0.5, z: 0.5 };
  const motion = { x: 6, z: -2 };
  const maximumActiveChunks = (detailedStreamDistance(MAX_VIEW_DISTANCE) * 2 + 1) ** 2;

  let update = world.updateStreaming(position, MAX_VIEW_DISTANCE, motion);
  const initialRevision = world.streamRevision;
  assert.deepEqual({
    visualDistance: update.visualDistance,
    detailDistance: update.detailDistance,
    streamDistance: update.streamDistance,
    maximumDetailDistance: update.maximumDetailDistance,
  }, {
    visualDistance: MAX_VIEW_DISTANCE,
    detailDistance: MAX_DETAIL_DISTANCE,
    streamDistance: MAX_DETAIL_DISTANCE + DETAIL_SUPPORT_CHUNKS,
    maximumDetailDistance: MAX_DETAIL_DISTANCE,
  });
  assert.equal(world.renderDistance, MAX_VIEW_DISTANCE);
  assert.equal(world.detailDistance, MAX_DETAIL_DISTANCE);
  assert.equal(world.streamDistance, MAX_DETAIL_DISTANCE + DETAIL_SUPPORT_CHUNKS);
  assert.equal(update.changed, true);
  assert.equal(update.admitted, 81, 'the first maximum-distance admission should remain bounded');
  assert.ok(update.pending > 0, 'the far detail rings should be staged over later streaming updates');
  assert.ok(world.chunks.size <= maximumActiveChunks);

  let calls = 1;
  while (update.pending > 0 && calls < 32) {
    update = world.updateStreaming(position, MAX_VIEW_DISTANCE, motion);
    calls++;
    assert.equal(update.changed, false, 'continued admission must reuse the cached streaming plan');
    assert.equal(world.streamRevision, initialRevision,
      'same-center updates must not rebuild the streaming plan');
    assert.ok(update.admitted <= 48, 'later admissions must retain their per-update allocation cap');
    assert.ok(world.chunks.size <= maximumActiveChunks,
      `active detail chunks exceeded ${maximumActiveChunks} during staged admission`);
  }

  assert.equal(update.pending, 0, 'repeated bounded updates should eventually admit the complete detail square');
  assert.equal(world.chunks.size, maximumActiveChunks);
  assert.equal(world.generationQueue.length, maximumActiveChunks);
  assert.ok(calls > 1 && calls < 32, `staged admission completed in an unexpected ${calls} calls`);
  world.dispose();
});

test('loading-stage streaming admits and fully generates the complete active footprint', () => {
  const world = new World(73420, null, null);
  const position = { x: 0.5, z: 0.5 };
  const maximumActiveChunks = (detailedStreamDistance(MAX_VIEW_DISTANCE) * 2 + 1) ** 2;
  const update = world.updateStreaming(
    position,
    MAX_VIEW_DISTANCE,
    { x: 0, z: 0 },
    { preloadAll: true },
  );

  assert.equal(update.pending, 0, 'loading must not leave planned chunks waiting for later admission');
  assert.equal(update.admitted, maximumActiveChunks);
  assert.equal(world.chunks.size, maximumActiveChunks);
  assert.equal(world.generationQueue.length, maximumActiveChunks);

  const completed = world.processQueue(2, 0.5, { completeChunks: true });
  assert.equal(completed, 2, 'loading mode must finish whole chunks instead of retaining sliced jobs');
  assert.equal(world.generationQueue.length, maximumActiveChunks - 2);
  assert.equal([...world.chunks.values()].filter((chunk) => chunk.generated).length, 2);
  world.dispose();
});

test('streaming plan revision changes only when its chunk-space signature changes', () => {
  const world = new World(7343, null, null);
  const motion = { x: 4.2, z: 0.4 };
  const maximumActiveChunks = (detailedStreamDistance(MAX_VIEW_DISTANCE) * 2 + 1) ** 2;
  const first = world.updateStreaming({ x: 0.5, z: 0.5 }, MAX_VIEW_DISTANCE, motion);
  const firstRevision = world.streamRevision;

  const sameChunk = world.updateStreaming({ x: 15.75, z: 8.25 }, MAX_VIEW_DISTANCE, motion);
  assert.equal(first.changed, true);
  assert.equal(sameChunk.changed, false);
  assert.equal(world.streamRevision, firstRevision,
    'sub-chunk movement with the same direction sector must reuse the plan');
  assert.ok(world.chunks.size <= maximumActiveChunks);

  const crossed = world.updateStreaming({ x: CHUNK_WORLD_SIZE + 0.5, z: 8.25 }, MAX_VIEW_DISTANCE, motion);
  assert.equal(crossed.changed, true);
  assert.equal(world.streamRevision, firstRevision + 1,
    'crossing a chunk boundary must publish exactly one new stream plan');
  assert.ok(world.chunks.size <= maximumActiveChunks,
    'a boundary crossing must evict stale chunks before admitting the new strip');
  assert.equal(world.renderDistance, MAX_VIEW_DISTANCE);
  assert.equal(world.detailDistance, MAX_DETAIL_DISTANCE);
  assert.equal(world.streamDistance, detailedStreamDistance(MAX_VIEW_DISTANCE));
  world.dispose();
});

test('distant terrain builds deterministically, incrementally, and swaps atomically', () => {
  const scene = new THREE.Scene();
  const terrain = {
    seaLevel: 32,
    _columnInfo(x, z) {
      const height = Math.round(31 + Math.sin(x / 41) * 6 + Math.cos(z / 53) * 4);
      return {
        height,
        biome: x < -40 ? 'forest' : x > 80 ? 'desert' : 'plains',
        moisture: 0.45 + Math.sin(z / 90) * 0.2,
        forestWeight: x < 0 ? 0.7 : 0.1,
        desertWeight: x > 50 ? 0.65 : 0.05,
        surfaceSand: x > 90,
        rockiness: Math.max(0, (height - 34) / 24),
        pondWaterLevel: Math.abs(x) < 8 && Math.abs(z) < 8 ? 34 : null,
      };
    },
  };
  const hashGeometry = (horizon) => {
    const hash = createHash('sha256');
    for (const name of ['position', 'normal', 'color']) {
      const array = horizon.mesh.geometry.getAttribute(name).array;
      hash.update(Buffer.from(array.buffer, array.byteOffset, array.byteLength));
    }
    return hash.digest('hex');
  };

  const first = new DistantTerrainHorizon(scene, terrain);
  assert.equal(first.request(0.5, 0.5, MAX_VIEW_DISTANCE, MAX_DETAIL_DISTANCE), false);
  const originalPending = first.pendingWork;
  first.process(1, Number.POSITIVE_INFINITY);
  assert.ok(first.pendingWork < originalPending && first.pending,
    'one row should advance without publishing the complete horizon');
  while (first.pending) first.process(16, Number.POSITIVE_INFINITY);
  assert.equal(first.ready, true);
  assert.equal(first.mesh.castShadow, false);
  assert.equal(first.mesh.receiveShadow, false);
  assert.equal(first.mesh.userData.distantTerrain, true);
  const firstStats = first.getStats();
  assert.equal(firstStats.outerRadius, distantHorizonRadius(MAX_VIEW_DISTANCE));
  assert.equal(firstStats.innerRadius, CHUNK_WORLD_SIZE * 3);
  assert.ok(firstStats.vertices > 0 && firstStats.vertices <= 210_000);
  assert.ok(firstStats.triangles > 0 && firstStats.triangles <= 70_000);
  for (const name of ['position', 'normal', 'color']) {
    const values = first.mesh.geometry.getAttribute(name).array;
    assert.ok(values.every(Number.isFinite), `${name} contains a non-finite distant-terrain value`);
  }
  assert.equal(first.getSafeDistanceFor(0.5, 0.5, 8), 0,
    'the visual horizon cannot bridge an unfinished detailed centre hole');
  assert.ok(first.getSafeDistanceFor(0.5, 0.5, 80) >= 350,
    'a complete detailed seam should unlock the twenty-chunk visual horizon');
  const firstHash = hashGeometry(first);

  const replay = new DistantTerrainHorizon(null, terrain);
  replay.request(0.5, 0.5, MAX_VIEW_DISTANCE, MAX_DETAIL_DISTANCE);
  replay.process(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  assert.equal(hashGeometry(replay), firstHash, 'the same world request must reproduce exact horizon buffers');
  assert.equal(first.request(15.75, 8.25, MAX_VIEW_DISTANCE, MAX_DETAIL_DISTANCE), true,
    'movement inside the snapped chunk must be a cache hit');

  const oldMesh = first.mesh;
  assert.equal(first.request(16.5, 8.25, MAX_VIEW_DISTANCE, MAX_DETAIL_DISTANCE), false);
  assert.equal(first.mesh, oldMesh, 'a replacement build must retain the published horizon');
  assert.equal(first.ready, false);
  first.process(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  assert.notEqual(first.mesh, oldMesh, 'the replacement must publish atomically after completion');
  assert.equal(first.ready, true);
  assert.deepEqual(first.getStats().center, [16, 0]);

  replay.dispose();
  first.dispose();
  assert.equal(scene.children.includes(first.group), false);
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

test('dry open daylight starts fog later without moving the opaque horizon', () => {
  const legacyNear = 4 * 10 - 8;
  const legacyFar = 4 * 16 + 34;
  const clear = atmosphericFogRange(4, {
    rainIntensity: 0,
    overcastAmount: 0,
    skyExposure: 1,
    dayAmount: 1,
    submerged: false,
  });
  assert.equal(clear.far, legacyFar, 'clear-air tuning must not expose terrain beyond the old horizon');
  assert.equal(clear.near, 58, 'balanced clear fog should retain a measured forty-metre blend band');
  const legacyOpacityAt64m = (64 - legacyNear) / (legacyFar - legacyNear);
  const clearOpacityAt64m = (64 - clear.near) / (clear.far - clear.near);
  assert.ok(clearOpacityAt64m <= legacyOpacityAt64m - 0.3,
    `clear-air haze was not materially reduced (${legacyOpacityAt64m} -> ${clearOpacityAt64m})`);
});

test('storm, cave, night and underwater contexts preserve established fog density', () => {
  const legacy = atmosphericFogRange(4, {
    rainIntensity: 0,
    overcastAmount: 0,
    skyExposure: 0,
    dayAmount: 1,
  });
  assert.deepEqual(legacy, { near: 32, far: 98, clarity: 0 });
  assert.equal(atmosphericFogRange(4, {
    rainIntensity: 0,
    overcastAmount: 0,
    skyExposure: 1,
    dayAmount: 1,
    submerged: true,
  }).near, 32);
  assert.equal(atmosphericFogRange(4, {
    rainIntensity: 0,
    overcastAmount: 0,
    skyExposure: 1,
    dayAmount: 0,
  }).near, 32);
  const storm = atmosphericFogRange(4, {
    rainIntensity: 0.8,
    overcastAmount: 1,
    skyExposure: 1,
    dayAmount: 1,
  });
  assert.equal(storm.near, 32 - 0.8 * 11);
  assert.equal(storm.far, 98 - 0.8 * 16);
  assert.equal(storm.clarity, 0);
});

test('fog clamp never reveals terrain beyond the complete meshed horizon', () => {
  const atmosphere = atmosphericFogRange(4, {
    rainIntensity: 0,
    overcastAmount: 0,
    skyExposure: 1,
    dayAmount: 1,
  });
  for (const safeTerrainFar of [8, 24, 50, 82, 98, 140]) {
    const clamped = clampFogToMeshedTerrain({
      atmosphericNear: atmosphere.near,
      atmosphericFar: atmosphere.far,
      safeTerrainFar,
      previousFar: 140,
      deltaSeconds: 1,
      clarity: atmosphere.clarity,
    });
    assert.ok(clamped.far <= Math.min(atmosphere.far, Math.max(8, safeTerrainFar)),
      `fog exposed the unmeshed horizon at safe distance ${safeTerrainFar}`);
    assert.ok(clamped.near < clamped.far);
  }
  const loading = clampFogToMeshedTerrain({
    atmosphericNear: atmosphere.near,
    atmosphericFar: atmosphere.far,
    safeTerrainFar: 50,
    previousFar: null,
    deltaSeconds: 0.016,
    clarity: atmosphere.clarity,
  });
  assert.equal(loading.far, 50);
  assert.equal(loading.streamingFar, 50);
  assert.ok(Math.abs(loading.near - 34) < 1e-9,
    `clear initial fog must begin materially later than the legacy 22.5m onset: ${loading.near}`);

  const legacyLoading = clampFogToMeshedTerrain({
    atmosphericNear: 32,
    atmosphericFar: 98,
    safeTerrainFar: 50,
    previousFar: null,
    deltaSeconds: 0.016,
    clarity: 0,
  });
  assert.ok(Math.abs(legacyLoading.near - 22.5) < 1e-9,
    'storm/cave/night/underwater clarity must retain the exact legacy safety band');
  assert.equal(legacyLoading.far, loading.far,
    'both clear and dense fog must become fully opaque before the same unmeshed horizon');
});

test('celestial sprites retain their projected size while testing terrain at far-plane depth', () => {
  const material = pinCelestialSpriteToFarPlane(new THREE.SpriteMaterial({
    depthTest: false,
    depthWrite: true,
  }));
  const shader = {
    vertexShader: 'void main() {\n\tgl_Position = projectionMatrix * mvPosition;\n}',
  };
  material.onBeforeCompile(shader, null);
  assert.equal(material.depthTest, true);
  assert.equal(material.depthWrite, false);
  assert.equal(material.depthFunc, THREE.LessEqualDepth);
  assert.equal(material.userData.worldloomCelestialFarDepth, true);
  assert.match(shader.vertexShader, /gl_Position\.z\s*=\s*gl_Position\.w/,
    'mountains must win the depth test without changing the sprite projection');
  assert.match(material.customProgramCacheKey(), /worldloom-celestial-depth-v1/);
});

test('weather windows span broad ranges and front opportunities can remain dry', () => {
  for (const [kind, [minimum, maximum]] of Object.entries(WEATHER_DURATION_RANGES)) {
    assert.equal(sampleWeatherDuration(kind, 0), minimum, `${kind} must include its minimum`);
    const upper = sampleWeatherDuration(kind, 1);
    assert.ok(upper < maximum && upper > maximum - 0.001,
      `${kind} must approach its maximum without leaving the range`);
  }
  assert.ok(WEATHER_DURATION_RANGES.initialClear[1] - WEATHER_DURATION_RANGES.initialClear[0] >= 300,
    'new worlds need a broad first-weather window rather than a disguised two-minute script');
  assert.equal(weatherFrontWillBuild(0), true);
  assert.equal(weatherFrontWillBuild(WEATHER_FRONT_CHANCE - 0.001), true);
  assert.equal(weatherFrontWillBuild(WEATHER_FRONT_CHANCE), false);
  assert.equal(weatherFrontWillBuild(0.99), false);
});

test('a clear weather opportunity can skip rain and schedule another varied dry spell', () => {
  const rolls = [0.94, 0.31, 0.73];
  const environment = weatherHarness('clear', {
    weatherTimer: 0,
    cloudCover: 0.34,
    cloudCoverTarget: 0.34,
    weatherRandom: () => rolls.shift() ?? 0.5,
  });
  environment._updateWeather(0.1);
  assert.equal(environment.weatherPhase, 'clear');
  assert.equal(environment.rainTarget, 0);
  assert.ok(environment.weatherTimer >= WEATHER_DURATION_RANGES.dryClear[0]);
  assert.ok(environment.weatherTimer <= WEATHER_DURATION_RANGES.dryClear[1]);
});

test('a successful weather opportunity samples independent buildup and storm durations', () => {
  const rolls = [0.08, 0.35, 0.67, 0.44, 0.81];
  const environment = weatherHarness('clear', {
    weatherTimer: 0,
    cloudCover: 0.34,
    cloudCoverTarget: 0.34,
    weatherRandom: () => rolls.shift() ?? 0.5,
  });
  environment._updateWeather(0.1);
  assert.equal(environment.weatherPhase, 'building');
  assert.ok(environment.weatherTimer >= WEATHER_DURATION_RANGES.building[0]);
  assert.ok(environment.weatherTimer <= WEATHER_DURATION_RANGES.building[1]);
  assert.ok(environment.pendingStormDuration >= WEATHER_DURATION_RANGES.rain[0]);
  assert.ok(environment.pendingStormDuration <= WEATHER_DURATION_RANGES.rain[1]);
  assert.equal(environment.rainTarget, 0, 'clouds must still gather before precipitation begins');
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

test('cave-mouth daylight fades with unobstructed distance instead of switching off at the roof', () => {
  const tunnelWorld = {
    worldHeight: 20,
    getBlock: (x, y) => (x >= 0 && y >= 7 ? BLOCK.STONE : BLOCK.AIR),
    terrainHeight: (x) => (x >= 0 ? 10 : 3),
  };
  const nearMouth = caveEntranceSkylight(tunnelWorld, { x: 0.5, y: 4, z: 0.5 });
  const deeper = caveEntranceSkylight(tunnelWorld, { x: 12.5, y: 4, z: 0.5 });
  const beyondDaylight = caveEntranceSkylight(tunnelWorld, { x: 18.5, y: 4, z: 0.5 });
  assert.ok(nearMouth > 0.72, 'a directly visible entrance should provide strong natural light');
  assert.ok(deeper > 0 && deeper < 0.09, 'direct skylight should fall off smoothly deeper in the tunnel');
  assert.equal(beyondDaylight, 0, 'natural cave light must stop beyond its bounded visible range');

  const sealedWorld = {
    worldHeight: 20,
    getBlock: (_x, y) => (y >= 7 ? BLOCK.STONE : BLOCK.AIR),
  };
  assert.equal(caveEntranceSkylight(sealedWorld, { x: 0.5, y: 4, z: 0.5 }), 0,
    'a solid ceiling cannot leak entrance light');

  const diagonalSeamWorld = {
    worldHeight: 20,
    getBlock: (x, y, z) => {
      if (x >= 1 && z >= 1) return BLOCK.AIR;
      if (x === 0 && z === 0 && (y === 4 || y === 5)) return BLOCK.AIR;
      if (y >= 4) return BLOCK.STONE;
      return BLOCK.AIR;
    },
  };
  assert.equal(caveEntranceSkylight(diagonalSeamWorld, { x: 0.5, y: 4, z: 0.5 }), 0,
    'conservative rays must not leak daylight between diagonal wall corners');

  const slopedEntranceWorld = {
    worldHeight: 24,
    terrainHeight: (x) => (x < 0 ? 3 : 18),
    getBlock: (x, y, z) => {
      if (z !== 0) return y >= 4 ? BLOCK.STONE : BLOCK.AIR;
      if (x < 0) return BLOCK.AIR;
      const floor = 3 + Math.floor(Math.max(0, 12 - x) * 0.72);
      return y >= floor && y <= floor + 3 ? BLOCK.AIR : BLOCK.STONE;
    },
  };
  assert.ok(caveEntranceSkylight(slopedEntranceWorld, { x: 12.5, y: 3, z: 0.5 }) > 0.01,
    'daylight should follow a directly visible rising natural cave mouth');

  const narrowPath = new Set();
  let previousX = 0;
  let previousZ = 0;
  for (let index = 0; index <= 96; index++) {
    const amount = index / 96;
    const x = Math.floor(0.5 + 13 * amount);
    const z = Math.floor(0.5 + 3 * amount);
    narrowPath.add(`${x},${z}`);
    narrowPath.add(`${x - 1},${z}`);
    narrowPath.add(`${x + 1},${z}`);
    narrowPath.add(`${x},${z - 1}`);
    narrowPath.add(`${x},${z + 1}`);
    if (x !== previousX && z !== previousZ) {
      narrowPath.add(`${x},${previousZ}`);
      narrowPath.add(`${previousX},${z}`);
    }
    previousX = x;
    previousZ = z;
  }
  const narrowMouthWorld = {
    worldHeight: 20,
    terrainHeight: (x, z) => (x === 13 && z === 3 ? 3 : 10),
    getBlock: (x, y, z) => {
      if (x === 13 && z === 3 && y >= 4) return BLOCK.AIR;
      if (narrowPath.has(`${x},${z}`) && (y === 4 || y === 5)) return BLOCK.AIR;
      return y >= 4 ? BLOCK.STONE : BLOCK.AIR;
    },
  };
  assert.ok(caveEntranceSkylight(narrowMouthWorld, { x: 0.5, y: 4, z: 0.5 }) > 0,
    'a narrow visible mouth between fixed compass angles must still admit daylight');

  const foliageMouthWorld = {
    worldHeight: 20,
    getBlock: (x, y) => {
      if (x >= 0 && y >= 7) return BLOCK.STONE;
      if (x < 0 && y >= 7 && y <= 12) return BLOCK.PINE_NEEDLES;
      return BLOCK.AIR;
    },
  };
  const foliageMouth = caveEntranceSkylight(foliageMouthWorld, { x: 0.5, y: 4, z: 0.5 });
  assert.ok(foliageMouth > 0.3 && foliageMouth < nearMouth,
    'foliage outside a cave mouth should attenuate daylight without becoming stone');

  let shaftOpen = true;
  const editedShaftWorld = {
    worldHeight: 20,
    terrainHeight: () => 10,
    getBlock: (x, y) => {
      if (y === 10) return x < 0 && shaftOpen ? BLOCK.AIR : BLOCK.STONE;
      if (x >= 0 && y >= 7 && y < 10) return BLOCK.STONE;
      return BLOCK.AIR;
    },
  };
  assert.ok(caveEntranceSkylight(editedShaftWorld, { x: 0.5, y: 4, z: 0.5 }) > 0.7,
    'mining a surface opening should restore cave daylight without regenerating terrain');
  shaftOpen = false;
  assert.equal(caveEntranceSkylight(editedShaftWorld, { x: 0.5, y: 4, z: 0.5 }), 0,
    'closing the same surface opening should remove its daylight immediately');

  let probeReads = 0;
  const tallCoveredWorld = {
    worldHeight: 96,
    terrainHeight: () => 90,
    getBlock: (_x, y) => {
      probeReads++;
      return y === 90 ? BLOCK.STONE : BLOCK.AIR;
    },
  };
  assert.equal(caveEntranceSkylight(tallCoveredWorld, { x: 0.5, y: 4, z: 0.5 }), 0);
  assert.ok(probeReads < 6_000,
    `the bounded cave probe exceeded its synchronous read budget (${probeReads})`);

  let roofProbeReads = 0;
  const playerRoofWorld = {
    worldHeight: 20,
    terrainHeight: () => 2,
    getBlock: (_x, y) => {
      roofProbeReads++;
      return y >= 4 ? BLOCK.STONE : BLOCK.AIR;
    },
  };
  assert.equal(caveEntranceSkylight(playerRoofWorld, { x: 0.5, y: 2, z: 0.5 }), 0);
  assert.ok(roofProbeReads < 5_000,
    `a player-built roof made the adaptive cave probe too expensive (${roofProbeReads})`);

  let shallowRoofReads = 0;
  const shallowNaturalRoofWorld = {
    worldHeight: 20,
    terrainHeight: () => 10,
    getBlock: (_x, y) => {
      shallowRoofReads++;
      return y >= 7 && y <= 10 ? BLOCK.STONE : BLOCK.AIR;
    },
  };
  assert.equal(caveEntranceSkylight(shallowNaturalRoofWorld, { x: 0.5, y: 4, z: 0.5 }), 0);
  assert.ok(shallowRoofReads < 5_000,
    `a shallow natural roof exceeded the adaptive probe budget (${shallowRoofReads})`);
});

test('covered voxel faces preserve mouth detail before reaching deep-cave black', () => {
  assert.equal(coverDepthSkylight(0), 1);
  assert.ok(coverDepthSkylight(1) > 0.84, 'the first covered block should remain readable');
  assert.ok(coverDepthSkylight(4) > 0.55 && coverDepthSkylight(4) < 0.68,
    'the cave mouth should retain a gradual natural-light transition');
  assert.ok(coverDepthSkylight(10) > 0.27 && coverDepthSkylight(10) < 0.38,
    'mid-cave faces need a gradual spatial falloff');
  assert.ok(coverDepthSkylight(28) < 0.09, 'far cave fronts should receive almost no natural skylight');
  assert.equal(plantCoverSkylight(0), 1);
  assert.equal(plantCoverSkylight(4), coverDepthSkylight(4),
    'crossed plants must use the same gradual cave-light falloff as terrain faces');
  assert.ok(plantCoverSkylight(1) > 0.84 && plantCoverSkylight(28) < 0.09,
    'plant geometry stays readable at mouths but darkens in deep caves');
  assert.ok(cavePostProcessAmount(0.18, 0) < 0.12,
    'terrain depth alone must not trigger an abrupt full-screen blackout');
  assert.ok(cavePostProcessAmount(0.9, 0) > 0.95,
    'deep enclosed caves retain the cinematic black floor');
  assert.ok(cavePostProcessAmount(0.65, 0.38) < 0.4,
    'a visible entrance suppresses most full-screen cave grading');
  assert.equal(CAVE_LIGHTING_DEPTH_BLOCKS, 28);
  const twelveBlockDepth = caveLightingDepth(40, 28.5);
  assert.ok(twelveBlockDepth > 0.44 && twelveBlockDepth < 0.46);
  assert.ok(cavePostProcessAmount(twelveBlockDepth, 0) < 0.5,
    'twelve blocks of cover must not max the full-screen cave grade');
  assert.equal(caveLightingDepth(40, 13), 1);
  assert.equal(cavePostProcessAmount(caveLightingDepth(40, 13), 0), 1,
    'natural light should be fully exhausted around twenty-eight blocks deep');
  assert.equal(GRAPHICS_PRESETS.balanced.softShadows, false);
  assert.equal(GRAPHICS_PRESETS.high.softShadows, true);
  assert.equal(GRAPHICS_PRESETS.ultra.softShadows, true);
  assert.equal(directionalSkyAccess(true, 0), 1,
    'shadowed modes keep world sunlight independent of the player probe');
  assert.equal(directionalSkyAccess(false, 0), 0,
    'low mode must suppress unshadowed sun in a deep enclosed cave');
  assert.ok(directionalSkyAccess(false, 0.5) > 0.75,
    'low mode retains most sunlight while a cave entrance is still visible');
});

test('sunlight tiers keep medium affordable while scaling warm shafts through cinematic mode', () => {
  assert.equal(GRAPHICS_PRESETS.low.godRayStrength, 0);
  assert.ok(GRAPHICS_PRESETS.balanced.godRayStrength > 0);
  assert.ok(GRAPHICS_PRESETS.high.godRayStrength > GRAPHICS_PRESETS.balanced.godRayStrength);
  assert.ok(GRAPHICS_PRESETS.ultra.godRayStrength > GRAPHICS_PRESETS.high.godRayStrength);
  assert.equal(GRAPHICS_PRESETS.balanced.ambientOcclusion, false,
    'medium shafts must not silently add the expensive GTAO pipeline');
  assert.equal(GRAPHICS_PRESETS.balanced.bloomStrength, 0,
    'medium keeps the multi-blur bloom pass out of its frame budget');
  assert.ok(GRAPHICS_PRESETS.balanced.godRayScale < GRAPHICS_PRESETS.high.godRayScale);
  assert.ok(GRAPHICS_PRESETS.high.godRayScale < GRAPHICS_PRESETS.ultra.godRayScale);
  for (const preset of [GRAPHICS_PRESETS.balanced, GRAPHICS_PRESETS.high, GRAPHICS_PRESETS.ultra]) {
    const tint = new THREE.Color(preset.godRayTint);
    assert.ok(tint.r > tint.g && tint.g > tint.b,
      `${preset.label} shafts must carry a genuinely warm optical tint`);
    assert.ok(preset.godRaySourceRadius < 0.4,
      `${preset.label} shaft source became a flat full-screen haze`);
  }

  const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 320);
  camera.position.set(0, 2, 0);
  camera.lookAt(0, 2, -10);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  const front = projectLightToScreen(camera, new THREE.Vector3(0, 2, -80));
  const behind = projectLightToScreen(camera, new THREE.Vector3(0, 2, 80));
  const farOffscreen = projectLightToScreen(camera, new THREE.Vector3(200, 2, -10));
  assert.ok(Math.abs(front.uv.x - 0.5) < 0.001 && Math.abs(front.uv.y - 0.5) < 0.001);
  assert.ok(front.facing > 0.99 && front.screenFade > 0.99);
  assert.ok(behind.facing < -0.99, 'a sun behind the camera must not create forward shafts');
  assert.equal(farOffscreen.screenFade, 0, 'far off-screen suns must not smear across the viewport');

  const clearEnvironment = {
    dayAmount: 1,
    rainAmount: 0,
    caveAmount: 0,
    skyExposure: 1,
    sunVisibility: 1,
  };
  const clearHigh = volumetricSunIntensity(GRAPHICS_PRESETS.high, clearEnvironment, front);
  const clearUltra = volumetricSunIntensity(GRAPHICS_PRESETS.ultra, clearEnvironment, front);
  const clearBalanced = volumetricSunIntensity(GRAPHICS_PRESETS.balanced, clearEnvironment, front);
  assert.ok(clearHigh > 0.1 && clearUltra > clearHigh);
  assert.ok(clearBalanced > 0 && clearBalanced < clearHigh);
  const goldenHigh = volumetricSunIntensity(
    GRAPHICS_PRESETS.high,
    { ...clearEnvironment, dayAmount: 0.44, sunElevation: 0.04 },
    front,
  );
  assert.ok(goldenHigh > clearHigh,
    'visible golden-hour shafts should not be weaker than noon shafts');
  const canopyHigh = volumetricSunIntensity(
    GRAPHICS_PRESETS.high,
    { ...clearEnvironment, skyExposure: 0.5, sunElevation: 0.3 },
    front,
  );
  assert.ok(canopyHigh > 0 && canopyHigh < goldenHigh,
    'partial canopy exposure should retain occlusion-rich shafts without matching open sky');
  assert.equal(volumetricSunIntensity(GRAPHICS_PRESETS.high, { ...clearEnvironment, rainAmount: 1 }, front), 0);
  assert.equal(volumetricSunIntensity(GRAPHICS_PRESETS.high, { ...clearEnvironment, caveAmount: 1 }, front), 0);
  assert.equal(volumetricSunIntensity(GRAPHICS_PRESETS.high, { ...clearEnvironment, skyExposure: 0 }, front), 0);
  assert.equal(volumetricSunIntensity(GRAPHICS_PRESETS.high, clearEnvironment, behind), 0);

  const pass = new VolumetricSunPass();
  pass.configure({ resolutionScale: GRAPHICS_PRESETS.high.godRayScale });
  pass.setSize(1000, 500);
  pass.setDepthTexture({ isDepthTexture: true });
  const diagnostics = pass.getDiagnostics();
  assert.equal(diagnostics.depthBound, true);
  assert.equal(diagnostics.maskSource, 'depth+beauty');
  assert.equal(diagnostics.width, 440);
  assert.equal(diagnostics.height, 220);
  assert.equal(diagnostics.samples, 24);
  assert.equal(diagnostics.sourceRadius, 0.42);
  pass.dispose();
});

test('clear daylight uses a warm key, restrained cool fill, and elevation-aware color temperature', () => {
  const horizon = sunlightColorForElevation(0);
  const low = sunlightColorForElevation(0.28);
  const noon = sunlightColorForElevation(1);
  assert.ok(horizon.r > horizon.g && horizon.g > horizon.b,
    'horizon sunlight must stay golden rather than grey-white');
  assert.ok((horizon.r / horizon.b) > (low.r / low.b));
  assert.ok((low.r / low.b) > (noon.r / noon.b),
    'sunlight should smoothly approach a warm-neutral noon temperature');

  const openDay = daylightBalance(1, 0.35, 1);
  const canopyDay = daylightBalance(1, 0.35, 0.46);
  assert.ok(openDay.goldenHour > 0.5);
  assert.ok(openDay.sunIntensity > (openDay.hemisphereIntensity + openDay.environmentIntensity) * 3,
    'clear daylight needs a materially dominant directional key');
  assert.ok(canopyDay.hemisphereIntensity > 0.3 && canopyDay.environmentIntensity > 0.14,
    'canopy fill must stay readable while open-sky cyan wash is reduced');
  assert.ok(outdoorBounceIntensity(1, 0.46, 0) > 0.09,
    'warm canopy bounce regressed below its readability floor');
});

test('an opaque player-built roof removes ambient sky exposure with gradual eye adaptation', () => {
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
  assert.ok(environment.skyExposure > 0.7 && environment.skyExposure < 1,
    'stepping under an ordinary roof should not cause a one-frame blackout');
  for (let index = 0; index < 24; index++) {
    environment._updateSkyExposure(0.18, { x: 0.5, y: 2, z: 0.5 });
  }
  assert.ok(environment.skyExposure < 0.01, 'a sustained fully covered position must still adapt to black');
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

test('selection effects never show an idle wireframe or red placement cube', () => {
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
  assert.equal(effects.outline.visible, false,
    'the idle target wireframe must stay hidden while the label identifies the block');
  effects.setTarget(hit, 0, false, true);
  assert.equal(effects.preview.visible, false, 'invalid placement must not create a persistent red artifact');
  effects.setTarget(hit, 0, true, true);
  assert.equal(effects.preview.visible, true, 'an explicitly selected placeable stack may preview placement');
  effects.setTarget(null);
  assert.equal(effects.preview.visible, false);
});

test('selection effects reserve cube overlays for active solid-block mining cracks', () => {
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

  [BLOCK.FERN, BLOCK.WILDFLOWER, BLOCK.GLOW_MUSHROOM, BLOCK.SHORT_GRASS, BLOCK.RED_FLOWER]
    .forEach((id, index) => {
      effects.setTarget({
        block: { x: index, y: 2, z: 3, id },
        adjacent: { x: index, y: 3, z: 3 },
      }, 0.55, false, false);
      assert.equal(effects.outline.visible, false, `${BLOCKS[id].name} received a full cube outline`);
      assert.equal(effects.crack.visible, false, `${BLOCKS[id].name} received a full cube crack overlay`);
    });

  effects.setTarget({
    block: { x: 9, y: 2, z: 3, id: BLOCK.SAND },
    adjacent: { x: 9, y: 3, z: 3 },
  }, 0.55, false, false);
  assert.equal(effects.outline.visible, false, 'solid blocks must not regain the idle wireframe');
  assert.equal(effects.crack.visible, true, 'solid blocks must retain their breaking cracks');
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

test('pointer-lock filtering rejects monitor recenter spikes without limiting cumulative 360 turns', () => {
  assert.equal(continuousPointerDelta(220, 640, 640, 1280), 220,
    'a large but plausible high-DPI event remains responsive');
  assert.equal(continuousPointerDelta(1366, 640, 640, 1366), 0,
    'a constant-screen-coordinate Windows edge spike must not rotate the camera');
  assert.equal(continuousPointerDelta(-639, 640, 1279, 1280), 0,
    'a pointer-lock recenter signature must be discarded');
  assert.equal(continuousPointerDelta(Number.POSITIVE_INFINITY), 0);
  const cumulativePixels = Array.from({ length: 16 }, () => (
    continuousPointerDelta(220, 640, 640, 1280)
  )).reduce((sum, value) => sum + value, 0);
  assert.ok(cumulativePixels * 0.0022 > Math.PI * 2,
    'many valid events must still accumulate beyond a complete turn');
});

test('pointer unlock clears pending look and a large acquisition event cannot snap the view', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const canvas = {
    clientWidth: 1280,
    clientHeight: 720,
    addEventListener() {},
  };
  try {
    globalThis.window = {
      innerWidth: 1280,
      innerHeight: 720,
      screen: { width: 1280, height: 720 },
      addEventListener() {},
    };
    globalThis.document = {
      pointerLockElement: null,
      addEventListener() {},
    };
    const input = new InputController(canvas);
    globalThis.document.pointerLockElement = canvas;
    input._lockChange();
    input._mouseMove({ movementX: 1366, movementY: 0, screenX: 640, screenY: 360 });
    assert.deepEqual(input.consumeLook(), { x: 0, y: 0 },
      'the synthetic first movement after pointer acquisition must be ignored');

    input._mouseMove({ movementX: 120, movementY: -35, screenX: 640, screenY: 360 });
    input.buttons.add(0);
    input.keys.add('KeyW');
    globalThis.document.pointerLockElement = null;
    input._lockChange();
    assert.equal(input.locked, false);
    assert.deepEqual(input.consumeLook(), { x: 0, y: 0 });
    assert.equal(input.buttons.size, 0);
    assert.equal(input.keys.size, 0);
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  }
});

test('first-person yaw stays continuous across repeated full turns and Continue state loads', () => {
  const camera = new THREE.PerspectiveCamera(75, 1, 0.05, 100);
  const world = { getBlock: () => BLOCK.AIR };
  const player = new PlayerController(camera, world);
  player.flying = true;
  const input = {
    consumeLook: () => ({ x: -200, y: 0 }),
    isDown: () => false,
  };
  const turnStep = 200 * 0.0022;
  let previousYaw = player.yaw;
  let previousDirection = player.getLookDirection(new THREE.Vector3());
  for (let frame = 0; frame < 40; frame++) {
    player.update(0.016, input, { sensitivity: 0.0022 });
    assert.ok(Math.abs((player.yaw - previousYaw) - turnStep) < 1e-10,
      `yaw changed discontinuously on frame ${frame}`);
    const direction = player.getLookDirection(new THREE.Vector3());
    assert.ok(Math.abs(direction.angleTo(previousDirection) - turnStep) < 1e-9,
      `camera snapped while crossing a turn boundary on frame ${frame}`);
    previousYaw = player.yaw;
    previousDirection = direction;
  }
  assert.ok(player.yaw > Math.PI * 2 * 2, 'the fixture must cross multiple complete turns');

  const state = player.getState();
  const restoredCamera = new THREE.PerspectiveCamera(75, 1, 0.05, 100);
  const restored = new PlayerController(restoredCamera, world);
  restored.loadState(state);
  assert.equal(restored.yaw, state.yaw, 'Continue must preserve an ordinary multi-turn yaw exactly');
  assert.ok(restored.getLookDirection(new THREE.Vector3()).angleTo(previousDirection) < 1e-7);

  const pitchInput = {
    consumeLook: () => ({ x: 0, y: 1_000_000 }),
    isDown: () => false,
  };
  restored.flying = true;
  restored.update(0.016, pitchInput, { sensitivity: 0.0022 });
  assert.equal(restored.pitch, -Math.PI * 0.495, 'the existing pitch limit remains unchanged');
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

test('bird admission, pond residency, and breed selection are deterministic and habitat-aware', () => {
  assert.deepEqual(Object.keys(BIRD_BREEDS).sort(), ['ash_sparrow', 'pond_azurefin']);
  assert.notEqual(BIRD_BREEDS.ash_sparrow.rootName, BIRD_BREEDS.pond_azurefin.rootName);

  const field = new BirdField(null);
  const chance = field.profile.birdSpawnChance;
  assert.ok(chance >= 0.2 && chance <= 0.3,
    `default bird admission should be noticeably increased, received ${(chance * 100).toFixed(1)}%`);
  const admissions = (seed) => Array.from({ length: 8_192 }, (_, serial) => (
    birdUnitHash(seed, serial, 0xa24baed5) < chance
  ));
  const first = admissions(0x51ed270b);
  assert.deepEqual(admissions(0x51ed270b), first, 'the same world sequence must replay exactly');
  assert.notDeepEqual(admissions(0x7f4a7c15), first, 'a different seed must not reuse the population sequence');
  const admittedRatio = first.filter(Boolean).length / first.length;
  assert.ok(Math.abs(admittedRatio - chance) < 0.025,
    `seeded rare admissions drifted away from the configured chance (${admittedRatio})`);
  field.dispose();

  assert.equal(POND_BIRD_OCCUPANCY_CHANCE, 0.5);
  const pondResidency = [];
  let changedWorldResidency = 0;
  for (let x = -64; x < 64; x++) {
    for (let z = -64; z < 64; z++) {
      const pond = { cellX: x, cellZ: z };
      const firstResident = birdPondHasResident(0x51ed270b, pond);
      assert.equal(birdPondHasResident(0x51ed270b, pond), firstResident,
        'the same world and pond must retain residency across reloads');
      pondResidency.push(firstResident);
      if (birdPondHasResident(0x7f4a7c15, pond) !== firstResident) changedWorldResidency++;
    }
  }
  const pondResidentRatio = pondResidency.filter(Boolean).length / pondResidency.length;
  assert.ok(Math.abs(pondResidentRatio - 0.5) < 0.02,
    `pond residency drifted away from 50% (${pondResidentRatio})`);
  assert.ok(changedWorldResidency > pondResidency.length * 0.35,
    'different worlds should materially change which ponds receive residents');
  assert.equal(birdPondHasResident(123, {}), false);
  assert.equal(birdPondHasResident(123, { cellX: 1 }), false);
  assert.equal([
    { cellX: -1, cellZ: -1 },
    { cellX: -1, cellZ: 0 },
  ].filter((pond) => birdPondHasResident(64, pond)).length, 1,
  'the browser fixture should retain one resident pond');

  const counts = {
    tree: { ash_sparrow: 0, pond_azurefin: 0 },
    pond: { ash_sparrow: 0, pond_azurefin: 0 },
  };
  for (let seed = 0; seed < 4_096; seed++) {
    for (const habitat of ['tree', 'pond']) {
      const firstChoice = chooseBirdBreed(seed, habitat);
      assert.equal(chooseBirdBreed(seed, habitat), firstChoice, 'breed choice must be a pure seeded decision');
      counts[habitat][firstChoice.key]++;
    }
  }
  const treeAzureShare = counts.tree.pond_azurefin / 4_096;
  const pondAzureShare = counts.pond.pond_azurefin / 4_096;
  assert.ok(treeAzureShare > 0.23 && treeAzureShare < 0.33,
    `tree breed split lost its woodland bias (${treeAzureShare})`);
  assert.ok(pondAzureShare > 0.63 && pondAzureShare < 0.73,
    `pond breed split lost its azurefin bias (${pondAzureShare})`);
  assert.ok(pondAzureShare > treeAzureShare + 0.3,
    'pond habitat should materially favor the pond-adapted breed');
});

test('bird spawning stays distant, behind the player, and limited to suitable weather', () => {
  const focus = new THREE.Vector3(0, 18, 0);
  const forward = new THREE.Vector3(0, 0, -1);
  assert.equal(birdSpawnPositionIsSafe(focus, forward, new THREE.Vector3(0, 22, 48), 38, 64), true);
  assert.equal(birdSpawnPositionIsSafe(focus, forward, new THREE.Vector3(0, 22, -48), 38, 64), false,
    'a bird cannot appear in front of the camera');
  assert.equal(birdSpawnPositionIsSafe(focus, forward, new THREE.Vector3(48, 22, 0), 38, 64), false,
    'the side plane is still visible and must not admit a spawn');
  assert.equal(birdSpawnPositionIsSafe(focus, forward, new THREE.Vector3(0, 22, 20), 38, 64), false,
    'nearby birds cannot pop into existence');
  assert.equal(birdSpawnPositionIsSafe(focus, forward, new THREE.Vector3(0, 22, 70), 38, 64), false,
    'spawn candidates beyond the active habitat radius are rejected');
  assert.equal(birdSpawnPositionIsSafe(focus, new THREE.Vector3(), new THREE.Vector3(0, 22, 48)), false);

  const profile = { birdCap: 4 };
  assert.equal(birdSpawnAllowed({ dayAmount: 0.8, rainIntensity: 0, skyExposure: 1 }, profile), true);
  assert.equal(birdSpawnAllowed({ dayAmount: 0.3, rainIntensity: 0, skyExposure: 1 }, profile), false);
  assert.equal(birdSpawnAllowed({ dayAmount: 0.8, rainIntensity: 0.4, skyExposure: 1 }, profile), false);
  assert.equal(birdSpawnAllowed({ dayAmount: 0.8, rainIntensity: 0, skyExposure: 0.2 }, profile), false);
  assert.equal(birdSpawnAllowed({ dayAmount: 0.8, submerged: true }, profile), false);
  assert.equal(birdSpawnAllowed({ dayAmount: 0.8 }, { birdCap: 0 }), false);
});

test('bird tree and pond anchors validate live support, dry space, and streamed terrain', () => {
  const tree = {
    id: '0,0',
    rootX: 0,
    rootY: 10,
    rootZ: 0,
    trunkHeight: 4,
    crownY: 14,
    isPine: false,
    trunkBlock: BLOCK.ASH_LOG,
    leafBlock: BLOCK.ASH_LEAVES,
  };
  let trunkPresent = true;
  let terrainVisible = true;
  const treeWorld = {
    isPositionReady: () => true,
    hasVisibleTerrainAt: () => terrainVisible,
    getBlock: (x, y, z) => {
      if (x === tree.rootX && y === 13 && z === tree.rootZ) {
        return trunkPresent ? tree.trunkBlock : BLOCK.AIR;
      }
      if (y === 16) return tree.leafBlock;
      return BLOCK.AIR;
    },
  };
  const perch = birdTreePerch(treeWorld, tree, 41);
  assert.ok(perch, 'an intact rendered canopy should expose a perch');
  assert.equal(perch.habitat, 'tree');
  assert.equal(treeWorld.getBlock(perch.supportX, perch.supportY, perch.supportZ), tree.leafBlock);
  assert.equal(treeWorld.getBlock(
    Math.floor(perch.position.x), Math.floor(perch.position.y), Math.floor(perch.position.z),
  ), BLOCK.AIR, 'the bird body needs open air above its supporting leaf');
  assert.deepEqual(birdTreePerch(treeWorld, tree, 41).position.toArray(), perch.position.toArray(),
    'tree anchor selection must replay for a seed');
  trunkPresent = false;
  assert.equal(birdTreePerch(treeWorld, tree, 41), null, 'a felled trunk invalidates its old perch');
  trunkPresent = true;
  terrainVisible = false;
  assert.equal(birdTreePerch(treeWorld, tree, 41), null, 'birds cannot perch on unrendered chunks');

  const pond = {
    id: '1,-2',
    cellX: 1,
    cellZ: -2,
    centerX: 0,
    centerZ: 0,
    radiusX: 5.4,
    radiusZ: 4.8,
    rotation: 0.27,
    waterY: 10,
  };
  const pondWorld = {
    isPositionReady: () => true,
    hasVisibleTerrainAt: () => true,
    terrainHeight: () => 10,
    getFluidSurfaceY: (x, _y, z) => (Math.hypot(x, z) < 4 ? 10.92 : null),
    getBlock: (x, y, z) => {
      if (y !== 10) return BLOCK.AIR;
      return Math.hypot(x, z) < 4 ? BLOCK.WATER : BLOCK.TURF;
    },
  };
  const bank = birdPondBank(pondWorld, pond, 77);
  assert.ok(bank, 'a live pond with a dry bank should expose a landing');
  assert.equal(bank.habitat, 'pond');
  assert.equal(bank.residentEligible, birdPondHasResident(77, pond));
  assert.equal(BLOCKS[bank.supportBlock]?.solid, true);
  assert.equal(BLOCKS[pondWorld.getBlock(
    Math.floor(bank.position.x), Math.floor(bank.position.y), Math.floor(bank.position.z),
  )]?.liquid, false, 'the landing body cannot occupy water');
  const normalizedDistance = Math.hypot(
    (bank.position.x - pond.centerX) / pond.radiusX,
    (bank.position.z - pond.centerZ) / pond.radiusZ,
  );
  assert.ok(normalizedDistance > 0.9 && normalizedDistance < 1.8,
    `pond landing escaped its nearby bank (${normalizedDistance})`);
  assert.deepEqual(birdPondBank(pondWorld, pond, 77).position.toArray(), bank.position.toArray());
  assert.equal(birdPondBank({ ...pondWorld, getFluidSurfaceY: () => null }, pond, 77), null,
    'a drained pond cannot retain a pond landing');
});

test('bird flight helpers replay finite curved paths and normalized headings', () => {
  const start = new THREE.Vector3(-8.5, 12.25, 3.5);
  const end = new THREE.Vector3(19.5, 14.75, -11.5);
  const terrainWorld = {
    worldHeight: 72,
    terrainHeight: (x) => (x > 2 && x < 12 ? 24 : 9),
  };
  const apex = birdTerrainFlightApex(terrainWorld, start, end, 4.2, 12);
  assert.ok(Number.isFinite(apex) && apex >= 29.2 && apex <= 70,
    `flight apex did not clear sampled high terrain (${apex})`);
  assert.equal(birdTerrainFlightApex(terrainWorld, start, end, 4.2, 12), apex);

  const path = [];
  for (let index = 0; index <= 120; index++) {
    const progress = index / 120;
    const point = birdFlightPoint(start, end, progress, apex, 2.4, new THREE.Vector3());
    const tangent = birdFlightTangent(start, end, progress, apex, 2.4, new THREE.Vector3());
    assert.ok(point.toArray().every(Number.isFinite), `non-finite flight point at ${progress}`);
    assert.ok(tangent.toArray().every(Number.isFinite), `non-finite flight tangent at ${progress}`);
    assert.ok(Math.abs(tangent.length() - 1) < 1e-9, `flight heading lost normalization at ${progress}`);
    assert.deepEqual(
      birdFlightPoint(start, end, progress, apex, 2.4, new THREE.Vector3()).toArray(),
      point.toArray(),
      'flight curve must replay exactly',
    );
    path.push(point);
  }
  assert.deepEqual(path[0].toArray(), start.toArray());
  assert.deepEqual(path.at(-1).toArray(), end.toArray());
  const linearMidpointY = (start.y + end.y) * 0.5;
  assert.ok(path[60].y > linearMidpointY + 6, 'flight must visibly arc above a straight interpolation');
  assert.ok(path.some((point) => Math.abs(point.x - THREE.MathUtils.lerp(start.x, end.x, 0.5)) > 0.1),
    'lateral bow was lost from the authored flight path');

  const fallback = birdFlightTangent(start, start, 0.5, start.y, 0, new THREE.Vector3());
  assert.deepEqual(fallback.toArray(), [0, 0, 1], 'a degenerate route still needs a finite forward direction');
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
