import * as THREE from '../vendor/three.module.min.js';
import { BLOCK, BLOCKS, HOTBAR_BLOCKS, createTextureAtlas, isLiquid, blockShapeHeight } from './blocks.js';
import { normalizeSeed } from './noise.js';
import {
  World,
  SEA_LEVEL,
  LEGACY_WORLD_GENERATOR_VERSION,
  WORLD_GENERATOR_VERSION,
} from './world.js';
import { InputController, PlayerController, fallDamageForImpact } from './player.js';
import { AudioSystem } from './audio.js';
import { Environment, BlockEffects } from './environment.js';
import { SaveStore, Inventory, DEFAULT_SETTINGS, GRAPHICS_PRESETS } from './save.js';
import {
  ITEM,
  OBJECTIVES,
  getItem,
  toolMultiplier,
  canHarvest,
  combatProfile,
  recipeRequirements,
  recipeStations,
  treeLogSpecies,
} from './data.js';
import { UI } from './ui.js';
import { CreatureSystem } from './creatures.js';
import { HeldItemView, createDroppedItemModel, disposeItemModel } from './viewmodel.js';
import { PlayerAvatar, WORLD_AVATAR_LAYER } from './player-avatar.js';
import { GraphicsPipeline } from './graphics.js';
import { SurvivalSystem } from './survival.js';
import { clampFogToMeshedTerrain } from './fog.js';

const canvas = document.getElementById('game');
const ui = new UI();
const saves = new SaveStore();
const audio = new AudioSystem();

let renderer;
let scene;
let camera;
let atlas;
let environment;
let effects;
let input;
let world = null;
let player = null;
let inventory = new Inventory();
let survival = new SurvivalSystem();
let creatures = null;
let heldItem = null;
let playerAvatar = null;
let graphicsPipeline = null;
let state = 'boot';
let mode = 'survival';
let settings = saves.loadSettings();
let flags = {};
let objectiveIndex = 0;
let worldCreatedAt = null;
let spawnPoint = new THREE.Vector3();
let miningTarget = '';
let miningProgress = 0;
let miningSoundTimer = 0;
let suppressMining = 0;
let saveTimer = 0;
let streamingTimer = 0;
let streamWorkFlip = false;
let streamingFogFar = null;
let hudTimer = 0;
let fps = 60;
let frameCounter = 0;
let fpsTime = 0;
let lastTime = performance.now();
let hasHeldPointer = false;
let initialClickHint = true;
let transitioning = false;
let hazardDamageTimer = 0;
let natureProbeTimer = 0;
let nearbyTreeLevel = 0;
let nearHeat = false;
let attackRecovery = 0;
let attackGesture = false;
let survivalDamage = 0;
let survivalDamageTimer = 0;
let survivalWarningTimer = 0;
let unbreakableToastTimer = 0;
let stationContext = null;
let worldWorkScheduled = false;
let worldWorkToken = 0;
let saveWarningShown = false;
let respawnInvulnerability = 0;
let droppedItems = [];
const MAX_DROPPED_ITEMS = 256;
const passiveGameplayInput = Object.freeze({
  consumeLook() {
    input?.consumeLook();
    return { x: 0, y: 0 };
  },
  isDown() { return false; },
});

const LEGACY_OBJECTIVE_IDS = Object.freeze([
  'gather', 'planks', 'tool', 'bench', 'copper', 'kiln', 'lumen', 'lightcore',
]);

function objectiveIndexFromSave(saveData) {
  const explicitId = String(saveData?.objectiveId || '');
  if (explicitId) {
    const found = OBJECTIVES.findIndex((objective) => objective.id === explicitId);
    if (found >= 0) return found;
  }
  const legacyIndex = Number.isInteger(saveData?.objectiveIndex) ? saveData.objectiveIndex : 0;
  if (legacyIndex >= LEGACY_OBJECTIVE_IDS.length) return OBJECTIVES.length;
  const legacyId = LEGACY_OBJECTIVE_IDS[Math.max(0, legacyIndex)] || LEGACY_OBJECTIVE_IDS[0];
  return Math.max(0, OBJECTIVES.findIndex((objective) => objective.id === legacyId));
}

function seedFromText(value) {
  const text = String(value ?? '').trim();
  if (/^-?\d+$/.test(text)) return normalizeSeed(Number(text));
  let hash = 2166136261;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return normalizeSeed(hash || Date.now());
}

function setState(next) {
  state = next;
  input.enabled = ['playing', 'paused', 'inventory'].includes(next);
  if (next !== 'playing') input.clear();
  heldItem?.setVisible(next === 'playing' && Boolean(input?.locked));
  audio.setPaused(!['playing', 'inventory'].includes(next));
}

function initRenderer() {
  ui.setLoading(0.06, 'Kindling the renderer…');
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
  } catch (error) {
    console.error(error);
    document.getElementById('unsupported')?.classList.remove('hidden');
    ui.elements.loading?.classList.add('hidden');
    return false;
  }

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0x6aaecf);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(settings.fov, 1, 0.045, 320);
  camera.layers.set(0);
  camera.rotation.order = 'YXZ';
  atlas = createTextureAtlas();
  atlas.texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 1);
  if (atlas.canvas?.toDataURL) {
    const atlasUrl = atlas.canvas.toDataURL('image/png');
    document.documentElement.style.setProperty('--worldloom-atlas', `url("${atlasUrl}")`);
  }
  environment = new Environment(scene, renderer);
  window.__worldloomPonds = environment.pondEcology;
  // World-avatar geometry is structurally absent from the gameplay and GTAO
  // camera, but remains part of the sun's shadow pass.
  environment.sunLight?.shadow?.camera?.layers.enable(WORLD_AVATAR_LAYER);
  environment.onLightning = ({ distance, intensity }) => audio.thunder(distance, intensity);
  window.__worldloomEnvironment = environment;
  effects = new BlockEffects(scene);
  scene.add(camera);
  heldItem = new HeldItemView(camera, atlas);
  graphicsPipeline = new GraphicsPipeline(renderer, scene, camera);
  window.__worldloomGraphics = graphicsPipeline;
  input = new InputController(canvas);
  bindInput();
  applySettings(settings);
  resize();
  window.addEventListener('resize', resize);
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    if (world) saveGame(false);
    if (state === 'playing') pauseGame();
    ui.toast('Graphics device was reset · your world has been saved', 'error', 5000);
  });
  canvas.addEventListener('webglcontextrestored', () => {
    ui.toast('Restoring the renderer…', 'normal', 1800);
    setTimeout(() => window.location.reload(), 350);
  });
  return true;
}

function bindInput() {
  canvas.addEventListener('click', async () => {
    if (state !== 'playing') return;
    await audio.unlock();
    input.requestLock();
  });

  input.onButtonDown = (button) => {
    if (state !== 'playing') return;
    if (button === 0 && creatures && player) {
      const selectedId = inventory.selectedSlot().id;
      const profile = combatProfile(selectedId);
      const attackOrigin = player.getEyePosition();
      const attackDirection = player.getLookDirection();
      if (!hasCreatureTarget(attackOrigin, attackDirection, profile.reach)) return;
      attackGesture = true;
      suppressMining = Number.POSITIVE_INFINITY;
      attackRecovery = Math.max(attackRecovery, creatures.playerAttackRecovery);
      if (attackRecovery > 0) return;
      if (!player.canSpendStamina(profile.staminaCost)) {
        attackRecovery = 0.24;
        ui.toast('Too exhausted to attack', 'normal', 700);
        return;
      }
      player.spendStamina(profile.staminaCost, Math.max(0.5, profile.recovery * 0.8));
      heldItem?.use(0.86);
      audio.combatSwing(Math.min(1.6, 0.65 + profile.damage * 0.18));
      const hit = creatures.attack(
        attackOrigin,
        attackDirection,
        profile.reach,
        profile.damage,
        profile.recovery,
      );
      attackRecovery = Math.max(profile.recovery, creatures.playerAttackRecovery);
      if (hit) {
        audio.combatImpact(Math.min(1.8, profile.damage * 0.55), hit.defeated);
        if (hit.defeated && hit.meat > 0 && mode !== 'builder') {
          flags.huntedGame = true;
          const dropped = spawnDroppedItem(
            { id: ITEM.RAW_MEAT, count: hit.meat },
            hit.position?.clone?.().add(new THREE.Vector3(0, 0.55, 0)),
            new THREE.Vector3(0, 2.2, 0),
            0.35,
          );
          const leftover = dropped ? 0 : inventory.add(ITEM.RAW_MEAT, hit.meat);
          ui.toast(
            leftover > 0
              ? `${hit.name} fell, but your pack and the ground are full`
              : `${hit.name} dropped ${hit.meat} raw steak${hit.meat === 1 ? '' : 's'}`,
            leftover > 0 ? 'error' : 'success',
            1600,
          );
          if (!dropped && leftover < hit.meat) refreshInventoryUI();
          checkObjectives();
        } else {
          ui.toast(hit.defeated ? `${hit.name} defeated` : `${hit.name} struck`, hit.defeated ? 'success' : 'normal', 900);
        }
      }
    }
    if (button === 2) useSelectedItem();
  };
  input.onButtonUp = (button) => {
    if (button === 0) {
      attackGesture = false;
      suppressMining = 0;
      resetMining();
    }
  };
  input.onKeyDown = (code, event) => {
    if (code === 'Escape') {
      if (state === 'inventory') {
        event.preventDefault();
        toggleInventory();
      } else if (state === 'paused') {
        event.preventDefault();
        resumeGame();
      }
      return;
    }
    if (code.startsWith('Digit') && state === 'playing') {
      const slot = Number(code.slice(5)) - 1;
      if (slot >= 0 && slot < 9) selectHotbar(slot);
      return;
    }
    if (code === 'KeyE' && (state === 'playing' || state === 'inventory')) {
      event.preventDefault();
      toggleInventory();
    } else if (code === 'KeyJ' && state === 'playing') {
      ui.toast(currentObjective(), 'normal', 3200);
    } else if (code === 'KeyF' && state === 'playing') {
      if (mode === 'builder') {
        player.flying = !player.flying;
        if (!player.flying && player.isColliding()) settleSpawnOrWorld(player.position);
        ui.toast(player.flying ? 'Flight enabled' : 'Flight disabled');
        audio.ui('click');
      } else {
        const hit = player.raycast(4.25);
        if (hit?.block?.id === BLOCK.BED) {
          trySleepAtBed(hit);
        } else if ([BLOCK.CAMP_BENCH, BLOCK.KILN, BLOCK.FURNACE, BLOCK.CHEST].includes(hit?.block?.id)) {
          openInventory(hit.block);
        }
      }
    } else if (code === 'F3') {
      event.preventDefault();
      settings.showDebug = !settings.showDebug;
      settings = saves.saveSettings(settings);
    }
  };

  document.addEventListener('pointerlockchange', () => {
    if (input.locked) {
      hasHeldPointer = true;
      initialClickHint = false;
      ui.hidePause();
    } else if (hasHeldPointer && state === 'playing' && !transitioning) {
      attackGesture = false;
      suppressMining = 0;
      resetMining();
      pauseGame();
    }
  });
  document.addEventListener('pointerlockerror', () => {
    if (state === 'playing') ui.toast('Mouse capture was blocked—click the world again to enter', 'error', 2600);
  });
}

function bindUI() {
  ui.onNewWorld = (seedText, selectedMode) => startWorld({ seed: seedFromText(seedText || `${Date.now()}`), mode: selectedMode });
  ui.onContinue = () => {
    const data = saves.load();
    if (data) startWorld({ seed: data.seed, mode: data.mode || 'survival', saveData: data });
  };
  ui.onResume = resumeGame;
  ui.onSave = () => saveGame(true);
  ui.onTitle = () => leaveToTitle();
  ui.onInventoryMove = (from, to) => {
    inventory.move(from, to);
    refreshInventoryUI();
  };
  ui.onInventoryDrop = (from) => dropInventoryStack(from);
  ui.onSelectHotbar = selectHotbar;
  ui.onCraft = craftRecipe;
  ui.onInventoryClose = () => {
    if (state === 'inventory') toggleInventory();
  };
  ui.onSettingsChanged = (partial) => {
    settings = saves.saveSettings({ ...settings, ...partial });
    applySettings(settings);
    if (world && player) world.updateStreaming(player.position, settings.viewDistance, player.velocity);
  };
  ui.applySettings(settings);
  ui.setContinueAvailable(saves.hasSave());
}

function applySettings(next) {
  if (!renderer || !camera) return;
  camera.fov = Number(next.fov || DEFAULT_SETTINGS.fov);
  camera.updateProjectionMatrix();
  audio.setSettings(next);
  environment?.applyGraphicsSettings(next);
  graphicsPipeline?.applyProfile(GRAPHICS_PRESETS[next.graphicsQuality] || GRAPHICS_PRESETS.balanced);
  document.documentElement.classList.toggle('user-reduced-motion', Boolean(next.reducedMotion));
  resize();
}

function resize() {
  if (!renderer || !camera) return;
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  const pixelRatio = Math.min(2, Math.max(0.6, window.devicePixelRatio * (settings.renderScale || 1)));
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height, false);
  graphicsPipeline?.resize(width, height, pixelRatio);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

async function startWorld({ seed, mode: selectedMode, saveData = null }) {
  if (transitioning) return;
  transitioning = true;
  try {
  document.exitPointerLock?.();
  setState('loading');
  ui.setLoading(0.04, saveData ? 'Remembering the old paths…' : 'Finding a place for the first dawn…');
  ui.elements.main?.classList.add('hidden');
  ui.elements.pause?.classList.add('hidden');
  ui.elements.hud?.classList.add('hidden');
  await audio.unlock();

  creatures?.dispose();
  creatures = null;
  playerAvatar?.dispose();
  playerAvatar = null;
  clearDroppedItems();
  worldWorkToken++;
  worldWorkScheduled = false;
  environment.updateLocalLights(null, null);
  world?.dispose();
  const generatorVersion = saveData
    ? (saveData.generatorVersion ?? LEGACY_WORLD_GENERATOR_VERSION)
    : WORLD_GENERATOR_VERSION;
  // Generator selection must happen before edits are loaded: loadEdits removes
  // entries equal to deterministic base terrain, which differs between v1 and v2.
  world = new World(seed, scene, atlas, { generatorVersion });
  streamingFogFar = null;
  environment.enhanceWorldMaterials(world);
  environment.setWeatherContext(world);
  ui.setLoading(0.075, 'Growing lily ponds and waterside life…');
  await environment.preparePondEcology();
  mode = selectedMode === 'builder' ? 'builder' : 'survival';
  worldCreatedAt = saveData?.createdAt || new Date().toISOString();
  flags = { ...(saveData?.flags || {}) };
  objectiveIndex = objectiveIndexFromSave(saveData);
  survival = new SurvivalSystem(saveData?.survival);
  inventory = new Inventory();
  if (saveData) inventory.load(saveData.inventory);
  else if (mode === 'builder') {
    HOTBAR_BLOCKS.forEach((id, index) => { inventory.slots[index] = { id, count: 99 }; });
    inventory.slots[HOTBAR_BLOCKS.length] = { id: ITEM.COPPER_PICK, count: 1 };
    inventory.slots[HOTBAR_BLOCKS.length + 1] = { id: ITEM.ASH_HATCHET, count: 1 };
    inventory.slots[HOTBAR_BLOCKS.length + 2] = { id: ITEM.COPPER_SWORD, count: 1 };
  }
  if (saveData?.world) world.loadEdits(saveData.world);
  environment.time = Number.isFinite(saveData?.timeOfDay) ? saveData.timeOfDay : 0.31;

  player = new PlayerController(camera, world);
  playerAvatar = new PlayerAvatar(scene);
  window.__worldloomPlayerAvatar = playerAvatar;
  const defaultSpawn = world.findSpawn();
  spawnPoint.copy(defaultSpawn);
  if (Array.isArray(saveData?.respawnPoint)
    && saveData.respawnPoint.length === 3
    && saveData.respawnPoint.every(Number.isFinite)) {
    spawnPoint.fromArray(saveData.respawnPoint);
  }
  if (saveData?.player) player.loadState(saveData.player);
  else player.setPosition(spawnPoint.x, spawnPoint.y, spawnPoint.z);
  player.flying = mode === 'builder' ? Boolean(saveData?.player?.flying ?? true) : false;
  connectPlayerAudio();
  creatures = new CreatureSystem(scene, world);
  creatures.onPlayerDamage = (amount, sourcePosition, creature, combat) => damagePlayer(amount, sourcePosition, combat);

  world.updateStreaming(player.position, settings.viewDistance, player.velocity);
  // Prepare a compact seven-by-seven playable core plus its one-chunk generation
  // support ring. The fog clamp below never reveals farther terrain until each
  // complete mesh ring is ready, so repeat loads stay quick without sky voids.
  // The remaining buffered footprint continues through bounded idle slices.
  const preloadRenderedRadius = 3;
  const preloadSupportRadius = preloadRenderedRadius + 1;
  const preloadTarget = Math.min(
    world.generationQueue.length,
    (preloadSupportRadius * 2 + 1) ** 2,
  );
  let preloadGenerated = 0;
  let generationSlice = 0;
  let generationProgressMarker = '';
  let generationProgressAt = performance.now();
  while (preloadGenerated < preloadTarget) {
    preloadGenerated += world.processQueue(1, 7.5);
    generationSlice++;
    const headChunk = world.chunks.get(world.generationQueue[0]);
    const marker = `${preloadGenerated}:${world.generationQueue.length}:${headChunk?.key || ''}:${headChunk?.generationPhase || ''}:${headChunk?.generationCursor || 0}`;
    if (marker !== generationProgressMarker) {
      generationProgressMarker = marker;
      generationProgressAt = performance.now();
    } else if (performance.now() - generationProgressAt > 30_000) {
      throw new Error('Starting terrain generation stopped making progress.');
    }
    const progress = 0.1 + (preloadGenerated / Math.max(1, preloadTarget)) * 0.5;
    ui.setLoading(progress, preloadGenerated < 1 ? 'Raising the mountain chains…' : preloadGenerated < Math.min(12, preloadTarget) ? 'Carving rivers and caverns…' : 'Preparing the nearby wilds…');
    if (generationSlice % 6 === 0) await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  if (preloadGenerated < preloadTarget) {
    throw new Error('The starting terrain could not be generated safely.');
  }
  let meshSlice = 0;
  const preloadMeshTarget = (preloadRenderedRadius * 2 + 1) ** 2;
  let meshProgressMarker = '';
  let meshProgressAt = performance.now();
  while (!world.isNeighborhoodRendered(player.position.x, player.position.z, preloadRenderedRadius)) {
    world.rebuildDirty(1, 7.5);
    meshSlice++;
    const coverage = world.getStreamingCoverage();
    const partialChunk = [...world.chunks.values()].find((chunk) => chunk.meshJob);
    const marker = `${coverage.rendered}:${world.stats.rebuiltTotal}:${partialChunk?.key || ''}:${partialChunk?.meshJob?.voxelCursor || 0}:${partialChunk?.meshJob?.finishCursor || 0}`;
    if (marker !== meshProgressMarker) {
      meshProgressMarker = marker;
      meshProgressAt = performance.now();
    } else if (performance.now() - meshProgressAt > 30_000) {
      throw new Error('Starting terrain meshing stopped making progress.');
    }
    ui.setLoading(
      0.6 + Math.min(1, coverage.rendered / Math.max(1, preloadMeshTarget)) * 0.36,
      coverage.rendered < 9 ? 'Painting the nearby ground…' : 'Opening a safe horizon…',
    );
    if (meshSlice % 6 === 0) await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  if (!world.isNeighborhoodRendered(player.position.x, player.position.z, preloadRenderedRadius)) {
    throw new Error('The starting horizon could not be prepared safely.');
  }
  // Loading has just proven this complete radius. Open directly to that safe
  // boundary; only later background-grown rings use the gentle outward fade.
  streamingFogFar = world.getSafeTerrainDistance(player.position);
  // A valid saved position is already authoritative. Previous builds always
  // snapped it to a nearby block centre on Continue, which made a correctly
  // saved cave or home feel like a different location after every reload.
  if (!saveData?.player || !exactResumePositionIsSafe(player.position)) {
    settleSpawn(player.position, defaultSpawn);
  }
  loadDroppedItems(saveData?.droppedItems);
  refreshInventoryUI();
  checkObjectives(true);
  saveTimer = 0;
  streamingTimer = 0;
  hazardDamageTimer = 0;
  survivalDamage = 0;
  survivalDamageTimer = 0;
  survivalWarningTimer = 0;
  attackRecovery = 0;
  attackGesture = false;
  stationContext = null;
  natureProbeTimer = 0;
  nearbyTreeLevel = 0;
  nearHeat = false;
  hasHeldPointer = false;
  initialClickHint = true;
  setState('playing');
  ui.showGame();
  ui.hideLoading();
  ui.toast(mode === 'builder' ? 'Dreamweaver world ready · F toggles flight' : 'The wilds are awake · click the world to begin', 'success', 3600);
  scheduleWorldWork();
  } catch (error) {
    console.error('Worldloom could not start this world.', error);
    creatures?.dispose();
    creatures = null;
    playerAvatar?.dispose();
    playerAvatar = null;
    window.__worldloomPlayerAvatar = null;
    clearDroppedItems();
    world?.dispose();
    world = null;
    player = null;
    environment.updateLocalLights(null, null);
    environment.setWeatherContext(null);
    setState('menu');
    ui.hideLoading();
    ui.showMain();
    ui.toast('This world could not be opened safely. Your previous save is still available.', 'error', 5200);
    postToPortal('error', { message: 'World startup failed safely' });
  } finally {
    transitioning = false;
  }
}

function exactResumePositionIsSafe(position) {
  if (!player || !world || !position
    || ![position.x, position.y, position.z].every(Number.isFinite)
    || position.y < 0 || position.y >= world.worldHeight - 2) return false;
  world.ensurePositionGenerated(position.x, position.z);
  if (player.isCollidingAt(position)) return false;
  const x = Math.floor(position.x);
  const z = Math.floor(position.z);
  for (const offset of [0.08, 0.86, 1.68]) {
    if (BLOCKS[world.getBlock(x, Math.floor(position.y + offset), z)]?.hazard) return false;
  }
  return true;
}

function findSafeSpawnNear(origin, minRadius = 0, maxRadius = 5) {
  if (!player || !world || !origin) return null;
  const baseX = Math.floor(origin.x);
  const baseZ = Math.floor(origin.z);
  const baseSupportY = Math.floor(origin.y - 0.01);
  const verticalOffsets = [0];
  for (let offset = 1; offset <= 12; offset++) verticalOffsets.push(-offset, offset);
  for (let radius = minRadius; radius <= maxRadius; radius++) {
    for (let dz = -radius; dz <= radius; dz++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (radius > 0 && Math.max(Math.abs(dx), Math.abs(dz)) !== radius) continue;
        const x = baseX + dx;
        const z = baseZ + dz;
        // Validate against the complete deterministic chunk, including trees
        // and plants. Base-terrain queries alone can approve a head space that
        // becomes a canopy after a distant respawn streams the chunk back in.
        world.ensurePositionGenerated(x, z);
        for (const verticalOffset of verticalOffsets) {
          const supportY = baseSupportY + verticalOffset;
          if (supportY < 0 || supportY >= world.worldHeight - 2) continue;
          const supportId = world.getBlock(x, supportY, z);
          const support = BLOCKS[supportId];
          if (!support?.solid || support.liquid || support.hazard) continue;
          const feetY = supportY + blockShapeHeight(supportId) + 0.002;
          const candidate = new THREE.Vector3(x + 0.5, feetY, z + 0.5);
          const feetId = world.getBlock(x, Math.floor(feetY + 0.08), z);
          const headId = world.getBlock(x, Math.floor(feetY + 1.68), z);
          if (BLOCKS[feetId]?.hazard || BLOCKS[headId]?.hazard || isLiquid(feetId) || isLiquid(headId)) continue;
          if (!player.isCollidingAt(candidate)) return candidate;
        }
      }
    }
  }
  return null;
}

function settleSpawn(preferred = player?.position, fallback = null) {
  if (!player || !world) return false;
  const safe = findSafeSpawnNear(preferred, 0, 5)
    || (fallback ? findSafeSpawnNear(fallback, 0, 6) : null);
  if (!safe) return false;
  player.setPosition(safe.x, safe.y, safe.z);
  return true;
}

function settleSpawnOrWorld(preferred = player?.position) {
  if (!player || !world) return false;
  if (settleSpawn(preferred)) return true;
  // Terrain-wide spawn search is intentionally lazy: a valid bed or nearby
  // recovery point should never pay its expensive full-world scan on death.
  const fallback = world.findSpawn();
  if (settleSpawn(fallback)) return true;
  player.setPosition(fallback.x, fallback.y + 2, fallback.z);
  return false;
}

function connectPlayerAudio() {
  player.onStep = (blockId, strength) => audio.step(materialFor(blockId), strength);
  player.onLand = (impact = 0) => {
    audio.step('dirt', Math.min(1.4, 0.55 + impact * 0.025));
    const damage = mode === 'builder' ? 0 : fallDamageForImpact(impact);
    if (damage > 0) {
      damagePlayer(damage);
      ui.toast(`Hard landing · ${Math.round(damage * 100)} damage`, 'error', 1100);
    }
  };
  player.onSplash = () => audio.splash();
  player.onDamage = () => {
    ui.damageFlash();
    audio.playerHurt(0.8);
  };
  player.onVoid = () => respawnPlayer('The worldroot carried you back from the void');
}

function materialFor(blockId) {
  if ([BLOCK.TURF, BLOCK.ASH_LEAVES, BLOCK.PINE_NEEDLES, BLOCK.FERN, BLOCK.WILDFLOWER, BLOCK.SHORT_GRASS, BLOCK.CAVE_MUSHROOM].includes(blockId)) return 'grass';
  if (blockId === BLOCK.LOAM) return 'dirt';
  if (blockId === BLOCK.SAND) return 'sand';
  if (treeLogSpecies(blockId) || [BLOCK.ASH_PLANKS, BLOCK.CAMP_BENCH, BLOCK.CHEST, BLOCK.BED, BLOCK.CACTUS].includes(blockId)) return 'wood';
  if ([BLOCK.GLASS, BLOCK.WINDOW].includes(blockId)) return 'glass';
  if (blockId === BLOCK.WATER) return 'water';
  if ([BLOCK.LUMEN_CRYSTAL, BLOCK.TORCH, BLOCK.LAVA].includes(blockId)) return 'crystal';
  return 'stone';
}

function hasCreatureTarget(origin, direction, reach) {
  if (!creatures || !origin || !direction) return false;
  if (typeof creatures.hasAttackTarget === 'function') {
    return creatures.hasAttackTarget(origin, direction, reach);
  }
  const blockDistance = player?.raycast(reach)?.distance ?? reach;
  for (const creature of creatures.creatures || []) {
    if (creature.dead) continue;
    const to = new THREE.Vector3(
      creature.root.position.x - origin.x,
      creature.root.position.y + creature.centerHeight - origin.y,
      creature.root.position.z - origin.z,
    );
    const along = to.dot(direction);
    if (along < 0 || along > Math.min(reach, blockDistance + 0.04)) continue;
    const perpendicularSq = Math.max(0, to.lengthSq() - along * along);
    if (perpendicularSq <= creature.radius * creature.radius) return true;
  }
  return false;
}

function measureNearbyTrees() {
  if (!world || !player) return 0;
  const centerX = Math.floor(player.position.x);
  const centerZ = Math.floor(player.position.z);
  const radius = 10;
  let trunks = 0;
  for (let dz = -radius; dz <= radius; dz++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx * dx + dz * dz > radius * radius) continue;
      const x = centerX + dx;
      const z = centerZ + dz;
      const ground = world.terrainHeight(x, z);
      for (let y = ground + 1; y <= Math.min(world.worldHeight - 1, ground + 10); y++) {
        const trunkId = world.getBlock(x, y, z);
        const species = treeLogSpecies(trunkId);
        if (!species) continue;
        const canopyId = species === 'pine' ? BLOCK.PINE_NEEDLES : BLOCK.ASH_LEAVES;
        let canopy = false;
        for (let ly = y + 2; ly <= Math.min(world.worldHeight - 1, y + 7) && !canopy; ly++) {
          for (let lz = z - 2; lz <= z + 2 && !canopy; lz++) {
            for (let lx = x - 2; lx <= x + 2; lx++) {
              if (world.getBlock(lx, ly, lz) === canopyId) {
                canopy = true;
                break;
              }
            }
          }
        }
        if (canopy) trunks++;
        break;
      }
      if (trunks >= 4) return 1;
    }
  }
  return Math.min(1, trunks / 4);
}

function hasNearbyHeatSource(radius = 5) {
  if (!world || !player) return false;
  const px = Math.floor(player.position.x);
  const py = Math.floor(player.position.y);
  const pz = Math.floor(player.position.z);
  const heatBlocks = new Set([BLOCK.TORCH, BLOCK.KILN, BLOCK.FURNACE, BLOCK.LAVA]);
  for (let y = Math.max(0, py - 4); y <= Math.min(world.worldHeight - 1, py + 4); y++) {
    for (let z = pz - radius; z <= pz + radius; z++) {
      for (let x = px - radius; x <= px + radius; x++) {
        if ((x - px) ** 2 + (z - pz) ** 2 > radius * radius) continue;
        if (heatBlocks.has(world.getBlock(x, y, z))) return true;
      }
    }
  }
  return false;
}

function selectHotbar(index) {
  inventory.selected = ((Number(index) % 9) + 9) % 9;
  inventory.changed = true;
  resetMining();
  refreshInventoryUI();
  const chosen = inventory.selectedSlot();
  ui.toast(chosen.id ? getItem(chosen.id).name : 'Empty hand', 'normal', 800);
  audio.ui('click');
}

function refreshInventoryUI() {
  ui.bindInventory(inventory, recipeAvailability);
  heldItem?.setItem(inventory.selectedSlot().id);
  inventory.changed = false;
}

function dropInventoryStack(slotIndex) {
  if (!inventory || !player || !world) return false;
  const before = inventory.serialize();
  const stack = inventory.take(slotIndex);
  if (!stack) return false;
  // Give an explicitly discarded stack enough owner grace to land visibly;
  // otherwise a short throw can be collected again before the player sees it.
  if (!spawnDroppedItem(stack, null, null, 1.35)) {
    inventory.load(before);
    ui.toast('There are too many loose items nearby', 'error', 1500);
    refreshInventoryUI();
    return false;
  }
  audio.itemDrop();
  ui.toast(`Dropped ${stack.count > 1 ? `${stack.count} ` : ''}${getItem(stack.id).name}`, 'normal', 1000);
  refreshInventoryUI();
  saveTimer = Math.max(saveTimer, 55);
  return true;
}

function spawnDroppedItem(stack, position = null, velocity = null, pickupDelay = 0.8) {
  if (!scene || !world || !player) return false;
  const id = Math.floor(Number(stack?.id));
  const rawCount = Math.floor(Number(stack?.count));
  if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(rawCount) || rawCount <= 0) return false;
  const count = Math.min(99, rawCount);

  const look = player.getLookDirection(new THREE.Vector3());
  if (look.lengthSq() < 0.001) look.set(0, 0, -1);
  const horizontalLook = new THREE.Vector3(look.x, 0, look.z);
  if (horizontalLook.lengthSq() < 0.001) horizontalLook.set(0, 0, -1);
  else horizontalLook.normalize();
  let dropPosition;
  if (position?.isVector3) {
    dropPosition = position.clone();
  } else {
    const base = new THREE.Vector3(player.position.x, player.position.y + 1.02, player.position.z);
    // Looking into a wall or steeply into the floor used to create the item
    // inside an opaque voxel, making a successful inventory transaction appear
    // to produce nothing. Choose the furthest clear, rendered release point.
    dropPosition = base.clone();
    for (const distance of [0.95, 0.68, 0.38, 0]) {
      const candidate = base.clone().addScaledVector(horizontalLook, distance);
      const candidateId = world.getBlock(
        Math.floor(candidate.x),
        Math.floor(candidate.y),
        Math.floor(candidate.z),
      );
      const visibleGround = !world.hasVisibleTerrainAt || world.hasVisibleTerrainAt(candidate.x, candidate.z);
      if (!BLOCKS[candidateId]?.solid && visibleGround) {
        dropPosition = candidate;
        break;
      }
    }
  }
  const dropVelocity = velocity?.isVector3
    ? velocity.clone()
    : horizontalLook.multiplyScalar(1.95).add(new THREE.Vector3(0, 1.65 + Math.max(-0.3, look.y) * 0.55, 0));
  const merge = pickupDelay < 1 && droppedItems.find((candidate) => candidate.id === id
    && candidate.count + count <= 99
    && candidate.root.position.distanceToSquared(dropPosition) <= 4);
  if (merge) {
    merge.count += count;
    merge.velocity.lerp(dropVelocity, 0.35);
    merge.pickupDelay = Math.max(merge.pickupDelay, Math.max(0.15, pickupDelay));
    merge.age = 0;
    merge.root.name = `Loose ${getItem(id).name} x${merge.count}`;
    return true;
  }
  if (droppedItems.length >= MAX_DROPPED_ITEMS) return false;
  let model;
  try {
    model = createDroppedItemModel(id, atlas);
  } catch (error) {
    console.warn('Could not create a dropped item model.', error);
    return false;
  }
  const root = new THREE.Group();
  root.name = `Loose ${getItem(id).name} x${count}`;
  root.position.copy(dropPosition);
  root.add(model);
  scene.add(root);
  droppedItems.push({ id, count, root, model, velocity: dropVelocity, age: 0, pickupDelay: Math.max(0.15, pickupDelay) });
  return true;
}

function removeDroppedItem(index) {
  const drop = droppedItems[index];
  if (!drop) return;
  scene?.remove(drop.root);
  disposeItemModel(drop.root);
  droppedItems.splice(index, 1);
}

function clearDroppedItems() {
  for (let index = droppedItems.length - 1; index >= 0; index--) removeDroppedItem(index);
  droppedItems = [];
}

function updateDroppedItems(dt) {
  if (!world || !player || !droppedItems.length) return;
  let inventoryUpdated = false;
  for (let index = droppedItems.length - 1; index >= 0; index--) {
    const drop = droppedItems[index];
    drop.age += dt;
    const position = drop.root.position;
    const cellX = Math.floor(position.x);
    const cellY = Math.floor(position.y);
    const cellZ = Math.floor(position.z);
    const inWater = world.getBlock(cellX, cellY, cellZ) === BLOCK.WATER;
    if (inWater) {
      drop.velocity.y += (1.15 - drop.velocity.y) * Math.min(1, dt * 3.4);
      drop.velocity.x *= Math.exp(-dt * 1.8);
      drop.velocity.z *= Math.exp(-dt * 1.8);
    } else {
      drop.velocity.y = Math.max(-18, drop.velocity.y - 15.5 * dt);
      drop.velocity.x *= Math.exp(-dt * 0.55);
      drop.velocity.z *= Math.exp(-dt * 0.55);
    }

    const radius = 0.16;
    const previousY = position.y;
    const blocksDropAt = (x, y, z) => {
      const blockY = Math.floor(y);
      const id = world.getBlock(Math.floor(x), blockY, Math.floor(z));
      if (!BLOCKS[id]?.solid) return false;
      return y - radius < blockY + blockShapeHeight(id) && y + radius > blockY;
    };
    const nextX = position.x + drop.velocity.x * dt;
    if (blocksDropAt(nextX, position.y, position.z)) drop.velocity.x *= -0.16;
    else position.x = nextX;
    const nextZ = position.z + drop.velocity.z * dt;
    if (blocksDropAt(position.x, position.y, nextZ)) drop.velocity.z *= -0.16;
    else position.z = nextZ;
    position.y += drop.velocity.y * dt;
    const supportY = Math.floor(position.y - radius);
    const supportId = world.getBlock(Math.floor(position.x), supportY, Math.floor(position.z));
    if (BLOCKS[supportId]?.solid) {
      const top = supportY + blockShapeHeight(supportId);
      if (position.y - radius < top && previousY >= top - 0.42) {
        position.y = top + radius;
        drop.velocity.y = Math.abs(drop.velocity.y) > 2 ? -drop.velocity.y * 0.16 : 0;
        drop.velocity.x *= Math.exp(-dt * 7);
        drop.velocity.z *= Math.exp(-dt * 7);
      }
    }
    drop.model.rotation.y += dt * (0.72 + (drop.id % 5) * 0.08);
    drop.model.position.y = Math.sin((drop.age + drop.id * 0.13) * 2.6) * 0.025;

    if (drop.age < drop.pickupDelay || position.distanceToSquared(player.position) > 3.4) continue;
    const leftover = inventory.add(drop.id, drop.count);
    const collected = drop.count - leftover;
    if (collected <= 0) continue;
    inventoryUpdated = true;
    drop.count = leftover;
    audio.pickup();
    if (leftover <= 0) removeDroppedItem(index);
  }
  if (inventoryUpdated) {
    refreshInventoryUI();
    checkObjectives();
    saveTimer = Math.max(saveTimer, 55);
  }
}

function serializeDroppedItems() {
  return droppedItems.slice(0, MAX_DROPPED_ITEMS).map((drop) => ({
    id: drop.id,
    count: drop.count,
    position: drop.root.position.toArray(),
    velocity: drop.velocity.toArray(),
  }));
}

function loadDroppedItems(records) {
  if (!Array.isArray(records)) return;
  for (const record of records.slice(0, MAX_DROPPED_ITEMS)) {
    if (!Array.isArray(record?.position) || !record.position.every(Number.isFinite)) continue;
    const position = new THREE.Vector3().fromArray(record.position);
    const velocity = Array.isArray(record.velocity) && record.velocity.every(Number.isFinite)
      ? new THREE.Vector3().fromArray(record.velocity)
      : new THREE.Vector3();
    spawnDroppedItem({ id: record.id, count: record.count }, position, velocity, 0.35);
  }
}

function openInventory(station = null) {
  if (state !== 'playing') return;
  stationContext = station && Number.isInteger(station.id)
    ? { id: station.id, x: station.x, y: station.y, z: station.z }
    : null;
  document.exitPointerLock?.();
  setState('inventory');
  ui.setInventory(true);
  refreshInventoryUI();
  audio.ui('open');
}

function toggleInventory() {
  if (state === 'inventory') {
    ui.setInventory(false);
    stationContext = null;
    setState('playing');
    input.requestLock();
    audio.ui('close');
  } else openInventory(null);
}

function pauseGame() {
  if (state !== 'playing') return;
  setState('paused');
  ui.showPause();
  saveGame(false);
}

function resumeGame() {
  if (state !== 'paused') return;
  setState('playing');
  ui.hidePause();
  audio.unlock();
  input.requestLock();
}

function leaveToTitle() {
  if (!world) return;
  saveGame(false);
  transitioning = true;
  document.exitPointerLock?.();
  setState('menu');
  creatures?.dispose();
  creatures = null;
  playerAvatar?.dispose();
  playerAvatar = null;
  window.__worldloomPlayerAvatar = null;
  clearDroppedItems();
  environment.updateLocalLights(null, null);
  environment.setWeatherContext(null);
  world.dispose();
  worldWorkToken++;
  worldWorkScheduled = false;
  world = null;
  player = null;
  stationContext = null;
  nearbyTreeLevel = 0;
  natureProbeTimer = 0;
  effects.setTarget(null);
  ui.setContinueAvailable(saves.hasSave());
  ui.showMain();
  audio.ui('close');
  transitioning = false;
}

function saveSnapshot() {
  if (!world || !player) return null;
  return {
    seed: world.seed,
    generatorVersion: world.generatorVersion,
    mode,
    name: 'My Worldloom',
    createdAt: worldCreatedAt,
    timeOfDay: environment.time,
    player: player.getState(),
    respawnPoint: spawnPoint.toArray(),
    survival: survival.serialize(),
    inventory: inventory.serialize(),
    droppedItems: serializeDroppedItems(),
    flags,
    objectiveIndex,
    objectiveId: OBJECTIVES[objectiveIndex]?.id || 'complete',
    world: world.serializeEdits(),
  };
}

function saveGame(showToast = false) {
  const snapshot = saveSnapshot();
  if (!snapshot) return false;
  const success = saves.save(snapshot);
  if (showToast) ui.toast(success ? 'World safely woven into memory' : 'Save failed—browser storage may be full', success ? 'success' : 'error');
  if (!success && !showToast && !saveWarningShown) {
    saveWarningShown = true;
    ui.toast('Autosave is using temporary memory · browser storage is unavailable or full', 'error', 5200);
  }
  if (success) saveWarningShown = false;
  ui.setContinueAvailable(success || saves.hasSave());
  saveTimer = 0;
  return success;
}

function recipeAvailability(recipe) {
  if (!inventory || !player || !world) return { craftable: false, reason: 'No active world' };
  const requirements = recipeRequirements(recipe);
  const stations = recipeStations(recipe);
  const activeStation = stations.length ? findNearbyStation(stations) : null;
  const missing = requirements.filter(({ id, count }) => !inventory.has(id, count));
  const reasons = [];
  if (missing.length) {
    reasons.push(`Need ${missing.map(({ id, count }) => `${inventory.count(id)}/${count} ${getItem(id).name}`).join(', ')}`);
  }
  if (stations.length && !activeStation) {
    reasons.push(`Need nearby ${stations.map((id) => BLOCKS[id]?.name || 'workstation').join(' or ')}`);
  }
  if (!missing.length && !projectRecipe(recipe)) reasons.push('Make room for the crafted item');
  return {
    craftable: reasons.length === 0,
    reason: reasons.join(' · ') || (activeStation ? `Ready at ${BLOCKS[activeStation.id]?.name}` : 'Craft in your pack'),
    requirements,
    station: activeStation,
  };
}

function stationContextIsValid(stationId) {
  if (!stationContext || stationContext.id !== stationId || !world || !player) return false;
  if (world.getBlock(stationContext.x, stationContext.y, stationContext.z) !== stationId) return false;
  const distance = Math.hypot(
    player.position.x - (stationContext.x + 0.5),
    player.position.y + 0.9 - (stationContext.y + 0.5),
    player.position.z - (stationContext.z + 0.5),
  );
  return distance <= 4.25;
}

function findNearbyStation(stationIds, radius = 4.25) {
  if (!world || !player) return null;
  for (const id of stationIds) {
    if (stationContextIsValid(id)) return stationContext;
  }
  const allowed = new Set(stationIds);
  const centerX = Math.floor(player.position.x);
  const centerY = Math.floor(player.position.y + 0.8);
  const centerZ = Math.floor(player.position.z);
  const horizontal = Math.ceil(radius);
  for (let y = Math.max(1, centerY - 3); y <= Math.min(world.worldHeight - 1, centerY + 3); y++) {
    for (let z = centerZ - horizontal; z <= centerZ + horizontal; z++) {
      for (let x = centerX - horizontal; x <= centerX + horizontal; x++) {
        const id = world.getBlock(x, y, z);
        if (!allowed.has(id)) continue;
        const distance = Math.hypot(
          player.position.x - (x + 0.5),
          player.position.y + 0.9 - (y + 0.5),
          player.position.z - (z + 0.5),
        );
        if (distance <= radius) return { id, x, y, z };
      }
    }
  }
  return null;
}

function projectRecipe(recipe) {
  const projection = inventory.clone();
  for (const ingredient of recipeRequirements(recipe)) {
    if (!projection.remove(ingredient.id, ingredient.count)) return null;
  }
  return projection.add(recipe.output.id, recipe.output.count) === 0 ? projection : null;
}

function craftRecipe(recipe) {
  const availability = recipeAvailability(recipe);
  if (!availability.craftable) {
    ui.toast(availability.reason, 'error');
    audio.ui('error');
    return;
  }
  const projection = projectRecipe(recipe);
  if (!projection) {
    ui.toast('Craft cancelled · make room for the output', 'error');
    audio.ui('error');
    return;
  }
  inventory.load(projection.serialize());
  ui.toast(`Crafted ${recipe.output.count > 1 ? `${recipe.output.count} ` : ''}${getItem(recipe.output.id).name}`, 'success');
  if (recipe.output.id === ITEM.COOKED_MEAT) flags.cookedMeal = true;
  if (recipe.output.id === ITEM.LIGHTCORE) celebrateLightcore();
  audio.craft();
  refreshInventoryUI();
  checkObjectives();
  saveTimer = Math.max(saveTimer, 55);
}

function celebrateLightcore() {
  flags.completedJourney = true;
  environment.time = 0.31;
  audio.objective();
  ui.toast('The Lightcore awakens. The horizon remembers your name.', 'success', 6500);
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      if (!player) return;
      const p = player.position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 4, 1 + Math.random() * 3, (Math.random() - 0.5) * 4));
      effects.burst(p, BLOCK.LUMEN_CRYSTAL, 9);
    }, i * 180);
  }
  saveGame(false);
}

function trySleepAtBed(hit) {
  if (!player || !world || mode === 'builder') return;
  if (!player.grounded) {
    ui.toast('Stand safely beside the bed before sleeping', 'error', 1600);
    audio.ui('error');
    return;
  }
  const weather = environment.getWeatherState();
  if (!weather.sheltered) {
    ui.toast('This bed needs a roof before it is safe to sleep', 'error', 1800);
    audio.ui('error');
    return;
  }
  if (environment.dayAmount >= 0.38 && weather.intensity < 0.65) {
    ui.toast('You can sleep when night falls or a heavy storm arrives', 'normal', 1800);
    return;
  }
  if (creatures?.hasThreatNear(player.position, 9)) {
    ui.toast('You cannot rest while danger is nearby', 'error', 1600);
    audio.ui('error');
    return;
  }
  const lastSleepDay = Number(flags.lastSleepDay);
  if (Number.isFinite(lastSleepDay) && survival.elapsedDays - lastSleepDay < 0.22) {
    ui.toast('You are not tired enough to sleep again', 'normal', 1400);
    return;
  }
  const bedOrigin = new THREE.Vector3(hit.block.x + 0.5, hit.block.y, hit.block.z + 0.5);
  const safeBedSpawn = findSafeSpawnNear(bedOrigin, 1, 3);
  if (!safeBedSpawn) {
    ui.toast('Clear a safe, supported space beside the bed first', 'error', 1900);
    audio.ui('error');
    return;
  }
  spawnPoint.copy(safeBedSpawn);
  environment.time = survival.sleep(environment.time);
  flags.sleptInBed = true;
  flags.lastSleepDay = survival.elapsedDays;
  player.health = Math.min(1, player.health + 0.55);
  player.stamina = 1;
  audio.setMusicActive(true, 2.8);
  audio.objective();
  ui.toast('You wake at first light · respawn point bound', 'success', 2600);
  checkObjectives();
  saveGame(false);
}

function respawnPlayer(message = 'The weave carried you home') {
  if (!player || !world) return;
  player.health = 1;
  settleSpawnOrWorld(spawnPoint);
  survival.respawn();
  respawnInvulnerability = 2.5;
  hazardDamageTimer = 1.2;
  survivalDamage = 0;
  ui.damageFlash();
  ui.toast(message, 'success', 3800);
  saveTimer = Math.max(saveTimer, 55);
}

function placeSelectedBlock() {
  if (!player || !world || state !== 'playing') return;
  const hit = player.raycast();
  const slot = inventory.selectedSlot();
  const item = getItem(slot.id);
  const selectedIndex = inventory.selected;
  const placedId = slot.id;
  if (!hit || !placedId || slot.count <= 0 || !item.placeable) {
    audio.ui('error');
    return;
  }
  const { x, y, z } = hit.adjacent;
  const existing = world.getBlock(x, y, z);
  if (existing !== BLOCK.AIR && !isLiquid(existing)) {
    ui.toast('That space is already occupied', 'error', 900);
    audio.ui('error');
    return;
  }
  const supportProblem = placementProblem(placedId, x, y, z);
  if (supportProblem) {
    ui.toast(supportProblem, 'error', 1200);
    audio.ui('error');
    return;
  }
  if (BLOCKS[placedId]?.solid && player.intersectsBlock(x, y, z, placedId)) {
    ui.toast('You cannot place a block inside yourself', 'error', 1100);
    audio.ui('error');
    return;
  }
  // Consume first and keep a complete rollback snapshot. This makes placement
  // atomic: a malformed or stale zero-count slot can never place forever.
  const inventoryBefore = mode === 'builder' ? null : inventory.serialize();
  if (mode !== 'builder' && !inventory.consume(selectedIndex, 1)) {
    ui.toast('That stack is empty', 'error', 900);
    refreshInventoryUI();
    return;
  }
  if (world.setBlock(x, y, z, placedId)) {
    // Pointer actions happen between animation frames. Give the edited chunk a
    // bounded foreground publish attempt, then leave any slow-device remainder
    // and boundary-neighbor rebuilds at the head of the normal mesh worker.
    world.rebuildEdited(12);
    scheduleWorldWork();
    heldItem?.use(0.9);
    if (placedId === BLOCK.CAMP_BENCH) flags.placedBench = true;
    if (placedId === BLOCK.KILN) flags.placedKiln = true;
    if (placedId === BLOCK.FURNACE) flags.placedFurnace = true;
    if (placedId === BLOCK.BED) flags.placedBed = true;
    audio.material(materialFor(placedId), 'place', 0.9);
    effects.burst(new THREE.Vector3(x, y, z), placedId, 5);
    refreshInventoryUI();
    checkObjectives();
  } else if (inventoryBefore) {
    inventory.load(inventoryBefore);
    refreshInventoryUI();
  }
}

function placementProblem(blockId, x, y, z) {
  const below = world.getBlock(x, y - 1, z);
  const solidBelow = Boolean(BLOCKS[below]?.solid);
  if ([BLOCK.FERN, BLOCK.WILDFLOWER, BLOCK.GLOW_MUSHROOM, BLOCK.SHORT_GRASS].includes(blockId) && !solidBelow) {
    return 'Plants need solid ground';
  }
  if (blockId === BLOCK.CACTUS) {
    if (![BLOCK.SAND, BLOCK.CACTUS].includes(below)) return 'Cactus can only root in sand or another cactus';
    const blockedSide = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      .some(([dx, dz]) => BLOCKS[world.getBlock(x + dx, y, z + dz)]?.solid);
    if (blockedSide) return 'Cactus needs clear space on every side';
  }
  if ([BLOCK.BED, BLOCK.CHEST, BLOCK.CAMP_BENCH, BLOCK.KILN, BLOCK.FURNACE].includes(blockId) && !solidBelow) {
    return 'Furniture needs a solid foundation';
  }
  if (blockId === BLOCK.TORCH) {
    const supported = solidBelow || [[1, 0], [-1, 0], [0, 1], [0, -1]]
      .some(([dx, dz]) => BLOCKS[world.getBlock(x + dx, y, z + dz)]?.solid);
    if (!supported) return 'A torch must attach to a solid surface';
  }
  return '';
}

function useSelectedItem() {
  if (!inventory || !player || state !== 'playing') return;
  const slot = inventory.selectedSlot();
  const item = getItem(slot.id);
  if (item.food || item.nutrition) {
    if (player.health >= 0.995 && survival.nourishment >= 0.995) {
      ui.toast('You are already well fed and at full vitality', 'normal', 1100);
      return;
    }
    const result = survival.eat(item);
    player.health = Math.min(1, player.health + result.healing);
    if (mode !== 'builder') inventory.consume(inventory.selected, 1);
    heldItem?.use(0.55);
    audio.pickup();
    if (item.id === ITEM.COOKED_MEAT) flags.cookedMeal = true;
    if (result.sick) {
      damagePlayer(0.1);
      ui.toast('Raw meat made you ill', 'error', 1700);
    } else {
      ui.toast(`${item.name} restored nourishment`, 'success', 1400);
    }
    refreshInventoryUI();
    checkObjectives();
    return;
  }
  if (item.placeable) placeSelectedBlock();
  else ui.toast('That item has no secondary use', 'normal', 900);
}

function resetMining() {
  miningTarget = '';
  miningProgress = 0;
  miningSoundTimer = 0;
  audio.stopBreaking();
}

function updateMining(dt, hit) {
  suppressMining = Math.max(0, suppressMining - dt);
  if (!hit || !input.buttons.has(0) || attackGesture || suppressMining > 0) {
    resetMining();
    return false;
  }
  const { x, y, z, id } = hit.block;
  if (!id || id === BLOCK.WATER || id === BLOCK.LAVA) {
    resetMining();
    return false;
  }
  if (BLOCKS[id]?.unbreakable) {
    resetMining();
    if (unbreakableToastTimer <= 0) {
      unbreakableToastTimer = 2.2;
      ui.toast('Worldroot bedrock cannot be broken', 'normal', 1200);
    }
    return false;
  }
  const key = `${x},${y},${z}`;
  if (key !== miningTarget) {
    miningTarget = key;
    miningProgress = 0;
    miningSoundTimer = 0;
  }
  const selectedId = inventory.selectedSlot().id;
  const hardness = Math.max(0.08, BLOCKS[id]?.hardness || 0.4);
  const speed = mode === 'builder' ? 25 : toolMultiplier(selectedId, id);
  const material = materialFor(id);
  const recordedBreaking = audio.setBreaking(material);
  miningProgress += dt * speed / (hardness * 0.72 + 0.18);
  miningSoundTimer -= dt;
  if (!recordedBreaking && miningSoundTimer <= 0) {
    audio.material(material, 'hit', 0.55);
    miningSoundTimer = 0.22 + Math.random() * 0.08;
  }
  if (miningProgress >= 1) {
    audio.stopBreaking();
    const harvestable = mode === 'builder' || canHarvest(selectedId, id);
    const dropId = BLOCKS[id]?.drop;
    if (mode !== 'builder' && harvestable && dropId
      && droppedItems.length >= MAX_DROPPED_ITEMS && !inventory.canAdd(dropId, 1)) {
      ui.toast('Too many loose items nearby · pick something up first', 'error', 1700);
      resetMining();
      return false;
    }
    if (!world.setBlock(x, y, z, BLOCK.AIR)) {
      resetMining();
      return false;
    }
    world.rebuildEdited(12);
    scheduleWorldWork();
    if (mode !== 'builder' && harvestable && dropId) {
      const dropPosition = new THREE.Vector3(x + 0.5, y + 0.55, z + 0.5);
      const dropVelocity = new THREE.Vector3((Math.random() - 0.5) * 1.2, 2.1, (Math.random() - 0.5) * 1.2);
      if (!spawnDroppedItem({ id: dropId, count: 1 }, dropPosition, dropVelocity, 0.28)) {
        inventory.add(dropId, 1);
      }
    } else if (mode !== 'builder' && !harvestable) {
      ui.toast(`A stronger ${BLOCKS[id]?.tool || 'tool'} is needed to collect that`, 'error', 1500);
    }
    effects.burst(new THREE.Vector3(x, y, z), id, 14);
    if (!recordedBreaking) audio.material(material, 'break', 1);
    resetMining();
    refreshInventoryUI();
    checkObjectives();
    return true;
  }
  return false;
}

function currentObjective() {
  if (mode === 'builder') return 'Shape the horizon however you imagine it';
  if (objectiveIndex >= OBJECTIVES.length) return 'Journey complete · build, explore, and keep the light alive';
  return OBJECTIVES[objectiveIndex].text;
}

function checkObjectives(silent = false) {
  if (mode === 'builder') return;
  let advanced = false;
  while (objectiveIndex < OBJECTIVES.length && OBJECTIVES[objectiveIndex].test({ inventory, flags })) {
    objectiveIndex++;
    advanced = true;
  }
  if (advanced && !silent) {
    audio.objective();
    ui.toast(objectiveIndex >= OBJECTIVES.length ? 'Journey complete—the world is yours' : `New thread: ${currentObjective()}`, 'success', 3600);
  }
}

function placementIsValid(hit) {
  if (!hit || !inventory) return false;
  const slot = inventory.selectedSlot();
  const item = getItem(slot.id);
  if (!slot.id || slot.count <= 0 || !item.placeable) return false;
  const { x, y, z } = hit.adjacent;
  const existing = world.getBlock(x, y, z);
  return (existing === BLOCK.AIR || isLiquid(existing))
    && !placementProblem(slot.id, x, y, z)
    && (!BLOCKS[slot.id]?.solid || !player.intersectsBlock(x, y, z, slot.id));
}

function damagePlayer(amount, sourcePosition, combat = null) {
  if (!player || mode === 'builder' || respawnInvulnerability > 0) return;
  player.health = Math.max(0, player.health - amount);
  ui.damageFlash();
  audio.playerHurt(Math.min(1.8, 0.55 + Number(amount) * 3));
  if (sourcePosition) {
    const away = player.position.clone().sub(sourcePosition).setY(0).normalize();
    const knockback = Math.max(1.5, Math.min(7.5, Number(combat?.knockback) || 4.5));
    player.velocity.addScaledVector(away, knockback);
    player.velocity.y = Math.max(player.velocity.y, 2.5 + knockback * 0.18);
  }
  if (player.health <= 0) {
    respawnPlayer('The weave carried you back to your bound shelter');
  }
}

function scheduleWorldWork() {
  if (worldWorkScheduled || !world) return;
  const scheduledWorld = world;
  const token = worldWorkToken;
  worldWorkScheduled = true;
  const work = (deadline = null) => {
    worldWorkScheduled = false;
    if (!world || world !== scheduledWorld || token !== worldWorkToken) return;
    const timedOut = Boolean(deadline?.didTimeout);
    const startedAt = performance.now();
    const inputPendingAtStart = navigator.scheduling?.isInputPending?.() === true;
    const stagingRadiusTarget = Math.min(4, Math.max(2, Math.floor(settings.viewDistance || 4)));
    const stagingBoost = Boolean(
      state === 'playing'
      && initialClickHint
      && !input?.locked
      && !inputPendingAtStart
      && world.getRenderedRadius(player?.position, stagingRadiusTarget) < stagingRadiusTarget
    );
    // A normal idle period may use several small slices instead of wasting the
    // remainder after one call. A timeout or pending input gets a much smaller
    // cap, guaranteeing progress without turning mouse/keyboard work into a
    // long frame. Before the first pointer lock, the loading-stage streamer may
    // use a larger capped idle window to open the horizon while the player is
    // stationary; pending input or pointer lock disables it on the next task.
    const grantedIdleBudget = deadline && !timedOut
      ? Math.max(0, deadline.timeRemaining() - 0.75)
      : 0;
    const hardBudget = inputPendingAtStart
      ? 1.15
      : timedOut
        ? 2.4
        : deadline
          ? Math.min(stagingBoost ? 14 : 6.5, grantedIdleBudget)
          : 2.4;
    const passLimit = stagingBoost && !timedOut ? 14 : 6;
    let passes = 0;
    while (
      passes < passLimit
      && (world.generationQueue.length || world.stats.dirty > 0)
    ) {
      if (stagingBoost && input?.locked) break;
      if (passes > 0 && navigator.scheduling?.isInputPending?.() === true) break;
      const elapsed = performance.now() - startedAt;
      const wallRemaining = hardBudget - elapsed;
      const idleRemaining = deadline && !timedOut
        ? deadline.timeRemaining() - 0.75
        : wallRemaining;
      const sliceBudget = Math.min(stagingBoost ? 4.5 : 2.4, wallRemaining, idleRemaining);
      if (sliceBudget < 0.55) break;

      const renderedRadius = stagingBoost
        ? world.getRenderedRadius(player?.position, stagingRadiusTarget)
        : -1;
      const nextRenderedRadius = Math.min(stagingRadiusTarget, renderedRadius + 1);
      const nextSupportReady = stagingBoost && world.isNeighborhoodGenerated(
        player.position.x,
        player.position.z,
        nextRenderedRadius + 1,
      );
      if (stagingBoost && nextSupportReady) {
        // Finish the newly supported ring first: this increases the safe fog
        // distance immediately instead of meshing far chunks out of order.
        world.rebuildDirty(1, sliceBudget);
      } else if (stagingBoost && world.generationQueue.length) {
        world.processQueue(1, sliceBudget);
      } else {
        streamWorkFlip = !streamWorkFlip;
        if (streamWorkFlip && world.generationQueue.length) {
          world.processQueue(1, sliceBudget);
        } else if (world.stats.dirty > 0) {
          world.rebuildDirty(1, sliceBudget);
        } else if (world.generationQueue.length) {
          world.processQueue(1, sliceBudget);
        }
      }
      passes++;
    }
    if (world.generationQueue.length || world.stats.dirty > 0) scheduleWorldWork();
  };
  if (typeof window.requestIdleCallback === 'function') {
    // The timeout guarantees a very small bounded slice even on busy
    // high-refresh-rate render loops that expose no long idle window.
    const stagingRadiusTarget = Math.min(4, Math.max(2, Math.floor(settings.viewDistance || 4)));
    const staging = state === 'playing'
      && initialClickHint
      && !input?.locked
      && world.getRenderedRadius(player?.position, stagingRadiusTarget) < stagingRadiusTarget;
    window.requestIdleCallback(work, { timeout: staging ? 32 : 48 });
  } else {
    setTimeout(work, 16);
  }
}

function updateGame(dt) {
  if (!world || !player) return;
  respawnInvulnerability = Math.max(0, respawnInvulnerability - dt);
  attackRecovery = Math.max(0, attackRecovery - dt);
  if (creatures) attackRecovery = Math.max(attackRecovery, creatures.playerAttackRecovery);
  unbreakableToastTimer = Math.max(0, unbreakableToastTimer - dt);
  survivalWarningTimer = Math.max(0, survivalWarningTimer - dt);
  natureProbeTimer -= dt;
  if (natureProbeTimer <= 0) {
    natureProbeTimer = 0.65;
    nearbyTreeLevel = measureNearbyTrees();
    nearHeat = hasNearbyHeatSource();
  }
  const interactive = state === 'playing' && input.locked;
  const motion = player.update(
    dt,
    interactive ? input : passiveGameplayInput,
    { ...settings, ...survival.getModifiers() },
  );
  hazardDamageTimer = Math.max(0, hazardDamageTimer - dt);
  const bodyBlock = world.getBlock(
    Math.floor(player.position.x),
    Math.floor(player.position.y + 0.55),
    Math.floor(player.position.z),
  );
  if (bodyBlock === BLOCK.LAVA && hazardDamageTimer <= 0) {
    hazardDamageTimer = 0.62;
    damagePlayer(0.18);
    player.velocity.y = Math.max(player.velocity.y, 3.2);
    ui.toast('The lava burns!', 'error', 850);
  }
  if (interactive) {
    const wheel = input.consumeWheel();
    if (wheel) selectHotbar(inventory.selected + Math.sign(wheel));
    const hit = player.raycast();
    const blockChanged = updateMining(dt, hit);
    const selectedStack = inventory.selectedSlot();
    const placementPreviewEnabled = Boolean(
      selectedStack.id
      && selectedStack.count > 0
      && getItem(selectedStack.id).placeable,
    );
    effects.setTarget(
      blockChanged ? null : hit,
      miningProgress,
      placementIsValid(hit),
      placementPreviewEnabled,
    );
  } else {
    input.consumeWheel();
    resetMining();
    effects.setTarget(null);
  }
  creatures?.update(dt, player, environment.dayAmount);
  updateDroppedItems(dt);

  const surface = world.terrainHeight(player.position.x, player.position.z);
  const caveDepth = Math.max(0, Math.min(1, (surface + 1 - player.position.y) / 16));
  const weather = environment.getWeatherState();
  const survivalTick = survival.update(dt, {
    builder: mode === 'builder',
    dayAmount: environment.dayAmount,
    rainIntensity: weather.intensity,
    sheltered: weather.sheltered,
    caveDepth,
    inWater: player.inWater,
    headUnderwater: player.headUnderwater,
    nearHeat,
    moving: motion.moving,
    sprinting: motion.sprinting,
    cycleSeconds: environment.cycleSeconds,
  });
  survivalDamage += survivalTick.damage;
  survivalDamageTimer -= dt;
  if (survivalDamageTimer <= 0 && survivalDamage >= 0.012) {
    const applied = Math.min(0.16, survivalDamage);
    survivalDamage -= applied;
    survivalDamageTimer = 0.72;
    damagePlayer(applied);
  }
  if (survivalTick.regeneration > 0 && player.health < 1) {
    player.health = Math.min(1, player.health + survivalTick.regeneration);
  }
  if (survivalWarningTimer <= 0 && survivalTick.drowning) {
    survivalWarningTimer = 3.2;
    ui.toast('You are running out of breath!', 'error', 1300);
  } else if (survivalWarningTimer <= 0 && survivalTick.starving) {
    survivalWarningTimer = 8;
    ui.toast('Nourishment is critically low · cook some food', 'error', 1800);
  } else if (survivalWarningTimer <= 0 && survivalTick.coldExposure) {
    survivalWarningTimer = 8;
    ui.toast('You are soaked and freezing · find shelter or heat', 'error', 1900);
  }

  streamingTimer += dt;
  if (streamingTimer >= 0.28) {
    streamingTimer = 0;
    world.updateStreaming(player.position, settings.viewDistance, player.velocity);
    environment.updateLocalLights(world, player.position);
  }
  const fluidBudget = { low: 10, balanced: 18, high: 28, ultra: 40 }[settings.graphicsQuality] || 18;
  world.updateFluids(fluidBudget);
  scheduleWorldWork();
  effects.update(dt);
  heldItem?.setVisible(input.locked && state === 'playing');
  heldItem?.update(dt, {
    mining: input.locked && input.buttons.has(0) && Boolean(miningTarget),
    moving: Math.hypot(player.velocity.x, player.velocity.z),
    reducedMotion: Boolean(settings.reducedMotion),
  });
  playerAvatar?.update(dt, player, motion, {
    action: input.locked && (input.buttons.has(0) || attackGesture),
    reducedMotion: Boolean(settings.reducedMotion),
  });
  saveTimer += dt;
  if (saveTimer >= 60) saveGame(false);
}

function updateHUD() {
  if (!world || !player) return;
  const hit = input.locked ? player.raycast() : null;
  let target = initialClickHint && !input.locked ? 'Click the world to step inside' : '';
  if (hit && input.locked) {
    const block = BLOCKS[hit.block.id];
    if (miningProgress > 0) {
      target = `${block?.name || 'Unknown'} · ${Math.min(99, Math.floor(miningProgress * 100))}%`;
    } else if (hit.block.id === BLOCK.BED) {
      target = `${block.name} · F sleep / bind respawn`;
    } else if ([BLOCK.CAMP_BENCH, BLOCK.KILN, BLOCK.FURNACE, BLOCK.CHEST].includes(hit.block.id)) {
      target = `${block.name} · F interact`;
    } else if (block?.unbreakable) {
      target = `${block.name} · unbreakable foundation`;
    } else {
      target = `${block?.name || 'Unknown'} · LMB mine${placementIsValid(hit) ? ' · RMB place' : ''}`;
    }
  }
  const stats = world.getStats();
  const debug = settings.showDebug
    ? [
      `${fps.toFixed(0)} FPS · ${renderer.info.render.calls} draws · ${renderer.info.render.triangles.toLocaleString()} tris`,
      `XYZ ${player.position.x.toFixed(1)} / ${player.position.y.toFixed(1)} / ${player.position.z.toFixed(1)}`,
      `Chunks ${stats.generated}/${stats.loaded} · queue ${stats.queued} · dirty ${stats.dirty}`,
      `Seed ${world.seed} · ${world.biomeAt(player.position.x, player.position.z)} · ${creatures?.count || 0} creatures`,
      `Day ${survival.dayNumber} · food ${(survival.nourishment * 100).toFixed(0)}% · wet ${(survival.wetness * 100).toFixed(0)}% · air ${(survival.oxygen * 100).toFixed(0)}%`,
    ].join('\n')
    : '';
  ui.updateHUD({
    health: player.health,
    stamina: player.stamina,
    nourishment: survival.nourishment,
    wetness: survival.wetness,
    oxygen: survival.oxygen,
    time: `Day ${survival.dayNumber} · ${environment.getTimeLabel()}`,
    objective: currentObjective(),
    target,
    inWater: player.inWater,
    debug,
  });
  if (inventory.changed) refreshInventoryUI();
}

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
  lastTime = now;
  frameCounter++;
  fpsTime += dt;
  if (fpsTime >= 0.5) {
    fps += ((frameCounter / fpsTime) - fps) * 0.35;
    frameCounter = 0;
    fpsTime = 0;
  }

  const focus = player?.position || new THREE.Vector3(0, 24, 0);
  if (state === 'playing' || state === 'inventory') updateGame(dt);
  else if (state === 'menu') effects.update(dt);
  const environmentDt = state === 'playing' || state === 'inventory' ? dt : state === 'menu' ? dt * 0.12 : 0;
  environment.update(environmentDt, focus, settings.viewDistance, {
    submerged: Boolean(player?.headUnderwater),
  });
  if (scene?.fog && world && player) {
    const clampedFog = clampFogToMeshedTerrain({
      atmosphericNear: scene.fog.near,
      atmosphericFar: scene.fog.far,
      safeTerrainFar: world.getSafeTerrainDistance(player.position),
      previousFar: streamingFogFar,
      deltaSeconds: environmentDt,
      clarity: environment.fogClarity,
    });
    streamingFogFar = clampedFog.streamingFar;
    scene.fog.near = clampedFog.near;
    scene.fog.far = clampedFog.far;
  }
  const weather = environment.getWeatherState();
  const surface = world && player ? world.terrainHeight(player.position.x, player.position.z) : 0;
  const biome = world && player ? world.biomeAt(player.position.x, player.position.z) : 'plains';
  const caveDepth = world && player ? Math.max(0, Math.min(1, (surface + 1 - player.position.y) / 16)) : 0;
  audio.setEnvironment({
    dayAmount: environment.dayAmount,
    biome,
    caveDepth,
    inWater: Boolean(player?.inWater),
    inOcean: Boolean(player?.inWater || (world && player && surface <= SEA_LEVEL + 1)),
    nearTrees: nearbyTreeLevel,
    rainIntensity: weather.intensity,
    sheltered: weather.sheltered,
    active: !document.hidden && (state === 'playing' || state === 'inventory'),
  });
  graphicsPipeline?.setEnvironment({
    dayAmount: environment.dayAmount,
    rainAmount: weather.intensity,
    caveAmount: caveDepth,
  });
  hudTimer += dt;
  if (hudTimer >= 0.08) {
    hudTimer = 0;
    if (world && ['playing', 'paused', 'inventory'].includes(state)) updateHUD();
  }
  if (graphicsPipeline) graphicsPipeline.render(dt);
  else renderer.render(scene, camera);
}

function postToPortal(type, detail = {}) {
  if (window.parent === window) return;
  window.parent.postMessage({ source: 'worldloom', type, ...detail }, window.location.origin);
}

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin || event.source !== window.parent) return;
  const message = event.data;
  if (message?.source !== 'tacticstrike' || message.type !== 'request-save') return;
  const saved = world ? saveGame(false) : true;
  postToPortal('save-ack', { requestId: message.requestId, saved });
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && world) saveGame(false);
  audio.setPaused(document.hidden || !['playing', 'inventory'].includes(state));
});
window.addEventListener('beforeunload', () => {
  if (world) saveGame(false);
});

async function boot() {
  try {
    if (!initRenderer()) {
      postToPortal('error', { message: 'WebGL 2 or hardware acceleration is unavailable.' });
      return;
    }
    bindUI();
    ui.setLoading(0.72, 'Tuning the wind and water…');
    await new Promise((resolve) => requestAnimationFrame(resolve));
    setState('menu');
    ui.showMain();
    ui.hideLoading();
    postToPortal('ready', { version: 2 });
    requestAnimationFrame(animate);
  } catch (error) {
    console.error('Worldloom boot failed safely.', error);
    ui.elements.loading?.classList.add('hidden');
    document.getElementById('unsupported')?.classList.remove('hidden');
    postToPortal('error', { message: 'Worldloom could not initialize safely.' });
  }
}

boot();
