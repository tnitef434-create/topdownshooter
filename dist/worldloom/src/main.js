import * as THREE from '../vendor/three.module.min.js';
import { BLOCK, BLOCKS, HOTBAR_BLOCKS, createTextureAtlas, isLiquid } from './blocks.js';
import { normalizeSeed } from './noise.js';
import { World, SEA_LEVEL } from './world.js';
import { InputController, PlayerController } from './player.js';
import { AudioSystem } from './audio.js';
import { Environment, BlockEffects } from './environment.js';
import { SaveStore, Inventory, DEFAULT_SETTINGS, GRAPHICS_PRESETS } from './save.js';
import { ITEM, OBJECTIVES, getItem, toolMultiplier, canHarvest, weaponDamage } from './data.js';
import { UI } from './ui.js';
import { CreatureSystem } from './creatures.js';
import { HeldItemView } from './viewmodel.js';
import { GraphicsPipeline } from './graphics.js';

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
let creatures = null;
let heldItem = null;
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
  camera.rotation.order = 'YXZ';
  atlas = createTextureAtlas();
  atlas.texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 1);
  if (atlas.canvas?.toDataURL) {
    const atlasUrl = atlas.canvas.toDataURL('image/png');
    document.documentElement.style.setProperty('--worldloom-atlas', `url("${atlasUrl}")`);
  }
  environment = new Environment(scene, renderer);
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
    if (button === 0) heldItem?.use(0.72);
    if (button === 0 && creatures && player) {
      const selectedId = inventory.selectedSlot().id;
      const hit = creatures.attack(player.getEyePosition(), player.getLookDirection(), 4.2, weaponDamage(selectedId));
      if (hit) {
        suppressMining = 0.23;
        audio.material('crystal', hit.defeated ? 'break' : 'hit', 0.8);
        if (hit.defeated && hit.meat > 0 && mode !== 'builder') {
          const leftover = inventory.add(ITEM.RAW_MEAT, hit.meat);
          const collected = hit.meat - leftover;
          ui.toast(collected > 0 ? `${hit.name} dropped ${collected} raw meat` : 'Your pack is full', collected > 0 ? 'success' : 'error', 1400);
          audio.pickup();
          refreshInventoryUI();
        } else {
          ui.toast(hit.defeated ? `${hit.name} defeated` : `${hit.name} struck`, hit.defeated ? 'success' : 'normal', 900);
        }
      }
    }
    if (button === 2) useSelectedItem();
  };
  input.onButtonUp = (button) => {
    if (button === 0) resetMining();
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
        ui.toast(player.flying ? 'Flight enabled' : 'Flight disabled');
        audio.ui('click');
      } else {
        const hit = player.raycast();
        if (hit?.block?.id === BLOCK.BED) {
          environment.time = 0.255;
          player.health = Math.min(1, player.health + 0.35);
          ui.toast('You rest until morning', 'success', 1800);
          audio.setMusicActive(true, 2.8);
        } else if ([BLOCK.CAMP_BENCH, BLOCK.KILN, BLOCK.FURNACE, BLOCK.CHEST].includes(hit?.block?.id)) {
          openInventory();
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
  ui.onSelectHotbar = selectHotbar;
  ui.onCraft = craftRecipe;
  ui.onInventoryClose = () => {
    if (state === 'inventory') toggleInventory();
  };
  ui.onSettingsChanged = (partial) => {
    settings = saves.saveSettings({ ...settings, ...partial });
    applySettings(settings);
    if (world && player) world.updateStreaming(player.position, settings.viewDistance);
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
  document.exitPointerLock?.();
  setState('loading');
  ui.setLoading(0.04, saveData ? 'Remembering the old paths…' : 'Finding a place for the first dawn…');
  ui.elements.main?.classList.add('hidden');
  ui.elements.pause?.classList.add('hidden');
  ui.elements.hud?.classList.add('hidden');
  await audio.unlock();

  creatures?.dispose();
  creatures = null;
  environment.updateLocalLights(null, null);
  world?.dispose();
  world = new World(seed, scene, atlas);
  environment.enhanceWorldMaterials(world);
  environment.setWeatherContext(world);
  mode = selectedMode === 'builder' ? 'builder' : 'survival';
  worldCreatedAt = saveData?.createdAt || new Date().toISOString();
  flags = { ...(saveData?.flags || {}) };
  objectiveIndex = Number.isInteger(saveData?.objectiveIndex) ? saveData.objectiveIndex : 0;
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
  spawnPoint.copy(world.findSpawn());
  if (saveData?.player) player.loadState(saveData.player);
  else player.setPosition(spawnPoint.x, spawnPoint.y, spawnPoint.z);
  player.flying = mode === 'builder' ? Boolean(saveData?.player?.flying ?? true) : false;
  connectPlayerAudio();
  creatures = new CreatureSystem(scene, world);
  creatures.onPlayerDamage = (amount, sourcePosition) => damagePlayer(amount, sourcePosition);

  world.updateStreaming(player.position, settings.viewDistance);
  const preloadCount = Math.min(13, world.generationQueue.length);
  for (let index = 0; index < preloadCount; index++) {
    world.processQueue(1);
    world.rebuildDirty(1);
    const progress = 0.12 + ((index + 1) / Math.max(1, preloadCount)) * 0.8;
    ui.setLoading(progress, index < 3 ? 'Raising the mountain chains…' : index < 8 ? 'Carving rivers and caverns…' : 'Painting the far horizon…');
    if (index % 2 === 0) await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  world.rebuildDirty(4);
  settleSpawn();
  refreshInventoryUI();
  checkObjectives(true);
  saveTimer = 0;
  streamingTimer = 0;
  hazardDamageTimer = 0;
  natureProbeTimer = 0;
  nearbyTreeLevel = 0;
  hasHeldPointer = false;
  initialClickHint = true;
  setState('playing');
  ui.showGame();
  ui.hideLoading();
  ui.toast(mode === 'builder' ? 'Dreamweaver world ready · F toggles flight' : 'The wilds are awake · click the world to begin', 'success', 3600);
  transitioning = false;
}

function settleSpawn() {
  if (!player || !world) return;
  let attempts = 0;
  while (attempts++ < 10) {
    const x = Math.floor(player.position.x);
    const z = Math.floor(player.position.z);
    const feet = Math.floor(player.position.y);
    const blocked = BLOCKS[world.getBlock(x, feet, z)]?.solid || BLOCKS[world.getBlock(x, feet + 1, z)]?.solid;
    if (!blocked) break;
    player.position.y += 1;
  }
  spawnPoint.copy(player.position);
  player.setPosition(player.position.x, player.position.y, player.position.z);
}

function connectPlayerAudio() {
  player.onStep = (blockId, strength) => audio.step(materialFor(blockId), strength);
  player.onLand = (impact = 0) => {
    audio.step('dirt', Math.min(1.4, 0.55 + impact * 0.025));
    if (impact > 11.5 && mode !== 'builder') {
      const damage = Math.min(0.82, Math.max(0.06, (impact - 10.5) / 32));
      damagePlayer(damage);
      ui.toast(`Hard landing · ${Math.round(damage * 100)} damage`, 'error', 1100);
    }
  };
  player.onSplash = () => audio.splash();
  player.onDamage = () => {
    ui.damageFlash();
    audio.ui('error');
  };
}

function materialFor(blockId) {
  if ([BLOCK.TURF, BLOCK.ASH_LEAVES, BLOCK.FERN, BLOCK.WILDFLOWER].includes(blockId)) return 'grass';
  if (blockId === BLOCK.LOAM) return 'dirt';
  if (blockId === BLOCK.SAND) return 'sand';
  if ([BLOCK.ASH_LOG, BLOCK.ASH_PLANKS, BLOCK.CAMP_BENCH, BLOCK.CHEST, BLOCK.BED, BLOCK.CACTUS].includes(blockId)) return 'wood';
  if ([BLOCK.GLASS, BLOCK.WINDOW].includes(blockId)) return 'glass';
  if (blockId === BLOCK.WATER) return 'water';
  if ([BLOCK.LUMEN_CRYSTAL, BLOCK.TORCH, BLOCK.GLOW_MUSHROOM, BLOCK.LAVA].includes(blockId)) return 'crystal';
  return 'stone';
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
        if (world.getBlock(x, y, z) !== BLOCK.ASH_LOG) continue;
        trunks++;
        break;
      }
      if (trunks >= 4) return 1;
    }
  }
  return Math.min(1, trunks / 4);
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

function openInventory() {
  if (state !== 'playing') return;
  document.exitPointerLock?.();
  setState('inventory');
  ui.setInventory(true);
  refreshInventoryUI();
  audio.ui('open');
}

function toggleInventory() {
  if (state === 'inventory') {
    ui.setInventory(false);
    setState('playing');
    input.requestLock();
    audio.ui('close');
  } else openInventory();
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
  environment.updateLocalLights(null, null);
  environment.setWeatherContext(null);
  world.dispose();
  world = null;
  player = null;
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
    mode,
    name: 'My Worldloom',
    createdAt: worldCreatedAt,
    timeOfDay: environment.time,
    player: player.getState(),
    inventory: inventory.serialize(),
    flags,
    objectiveIndex,
    world: world.serializeEdits(),
  };
}

function saveGame(showToast = false) {
  const snapshot = saveSnapshot();
  if (!snapshot) return false;
  const success = saves.save(snapshot);
  if (showToast) ui.toast(success ? 'World safely woven into memory' : 'Save failed—browser storage may be full', success ? 'success' : 'error');
  ui.setContinueAvailable(success || saves.hasSave());
  saveTimer = 0;
  return success;
}

function recipeAvailability(recipe) {
  if (!inventory || !player || !world) return { craftable: false, reason: 'No active world' };
  if (recipe.station && !hasNearbyBlock(recipe.station, 5)) {
    return { craftable: false, reason: `Place a nearby ${BLOCKS[recipe.station]?.name || 'workstation'}` };
  }
  const missing = recipe.ingredients.filter(({ id, count }) => !inventory.has(id, count));
  if (missing.length) {
    return { craftable: false, reason: `Need ${missing.map(({ id, count }) => `${count} ${getItem(id).name}`).join(', ')}` };
  }
  return { craftable: true, reason: recipe.station ? `Near ${BLOCKS[recipe.station]?.name}` : 'Craft in your pack' };
}

function hasNearbyBlock(blockId, radius) {
  const px = Math.floor(player.position.x);
  const py = Math.floor(player.position.y);
  const pz = Math.floor(player.position.z);
  for (let y = py - 2; y <= py + 3; y++) {
    for (let z = pz - radius; z <= pz + radius; z++) {
      for (let x = px - radius; x <= px + radius; x++) {
        if (world.getBlock(x, y, z) === blockId) return true;
      }
    }
  }
  return false;
}

function craftRecipe(recipe) {
  const availability = recipeAvailability(recipe);
  if (!availability.craftable) {
    ui.toast(availability.reason, 'error');
    audio.ui('error');
    return;
  }
  for (const ingredient of recipe.ingredients) inventory.remove(ingredient.id, ingredient.count);
  const leftover = inventory.add(recipe.output.id, recipe.output.count);
  if (leftover) ui.toast('Your pack is full; some craft was lost', 'error');
  else ui.toast(`Crafted ${recipe.output.count > 1 ? `${recipe.output.count} ` : ''}${getItem(recipe.output.id).name}`, 'success');
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

function placeSelectedBlock() {
  if (!player || !world || state !== 'playing') return;
  const hit = player.raycast();
  const slot = inventory.selectedSlot();
  const item = getItem(slot.id);
  if (!hit || !slot.id || !item.placeable) {
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
  if (BLOCKS[slot.id]?.solid && player.intersectsBlock(x, y, z)) {
    ui.toast('You cannot place a block inside yourself', 'error', 1100);
    audio.ui('error');
    return;
  }
  if (world.setBlock(x, y, z, slot.id)) {
    heldItem?.use(0.9);
    const placedId = slot.id;
    if (mode !== 'builder') inventory.consume(inventory.selected, 1);
    if (placedId === BLOCK.CAMP_BENCH) flags.placedBench = true;
    if (placedId === BLOCK.KILN) flags.placedKiln = true;
    if (placedId === BLOCK.FURNACE) flags.placedFurnace = true;
    audio.material(materialFor(placedId), 'place', 0.9);
    effects.burst(new THREE.Vector3(x, y, z), placedId, 5);
    refreshInventoryUI();
    checkObjectives();
  }
}

function useSelectedItem() {
  if (!inventory || !player || state !== 'playing') return;
  const slot = inventory.selectedSlot();
  const item = getItem(slot.id);
  if (item.food) {
    if (player.health >= 0.995) {
      ui.toast('You are already at full vitality', 'normal', 900);
      return;
    }
    player.health = Math.min(1, player.health + Number(item.food));
    if (mode !== 'builder') inventory.consume(inventory.selected, 1);
    heldItem?.use(0.55);
    audio.pickup();
    ui.toast(`${item.name} restored vitality`, 'success', 1200);
    refreshInventoryUI();
    return;
  }
  placeSelectedBlock();
}

function resetMining() {
  miningTarget = '';
  miningProgress = 0;
  miningSoundTimer = 0;
  audio.stopBreaking();
}

function updateMining(dt, hit) {
  suppressMining = Math.max(0, suppressMining - dt);
  if (!hit || !input.buttons.has(0) || suppressMining > 0) {
    resetMining();
    return;
  }
  const { x, y, z, id } = hit.block;
  if (!id || id === BLOCK.WATER || id === BLOCK.LAVA) {
    resetMining();
    return;
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
    world.setBlock(x, y, z, BLOCK.AIR);
    const harvestable = mode === 'builder' || canHarvest(selectedId, id);
    const dropId = BLOCKS[id]?.drop;
    if (mode !== 'builder' && harvestable && dropId) {
      const leftover = inventory.add(dropId, 1);
      if (leftover) ui.toast('Your pack is full', 'error');
      else audio.pickup();
    } else if (mode !== 'builder' && !harvestable) {
      ui.toast(`A stronger ${BLOCKS[id]?.tool || 'tool'} is needed to collect that`, 'error', 1500);
    }
    effects.burst(new THREE.Vector3(x, y, z), id, 14);
    if (!recordedBreaking) audio.material(material, 'break', 1);
    resetMining();
    refreshInventoryUI();
    checkObjectives();
  }
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
  if (!slot.id || !item.placeable) return false;
  const { x, y, z } = hit.adjacent;
  const existing = world.getBlock(x, y, z);
  return (existing === BLOCK.AIR || isLiquid(existing)) && (!BLOCKS[slot.id]?.solid || !player.intersectsBlock(x, y, z));
}

function damagePlayer(amount, sourcePosition) {
  if (!player || mode === 'builder') return;
  player.health = Math.max(0, player.health - amount);
  ui.damageFlash();
  audio.ui('error');
  if (sourcePosition) {
    const away = player.position.clone().sub(sourcePosition).setY(0).normalize();
    player.velocity.addScaledVector(away, 4.5);
    player.velocity.y = Math.max(player.velocity.y, 3.5);
  }
  if (player.health <= 0) {
    player.health = 1;
    player.setPosition(spawnPoint.x, spawnPoint.y + 0.2, spawnPoint.z);
    environment.time = 0.31;
    ui.toast('The weave carried you home at first light', 'success', 4200);
  }
}

function updateGame(dt) {
  if (!world || !player) return;
  natureProbeTimer -= dt;
  if (natureProbeTimer <= 0) {
    natureProbeTimer = 0.65;
    nearbyTreeLevel = measureNearbyTrees();
  }
  if (input.locked) {
    player.update(dt, input, settings);
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
    const wheel = input.consumeWheel();
    if (wheel) selectHotbar(inventory.selected + Math.sign(wheel));
    const hit = player.raycast();
    updateMining(dt, hit);
    effects.setTarget(input.buttons.has(0) ? hit : null, miningProgress, false);
    creatures?.update(dt, player, environment.dayAmount);
  } else {
    input.consumeLook();
    input.consumeWheel();
    resetMining();
    effects.setTarget(null);
  }

  streamingTimer += dt;
  if (streamingTimer >= 0.28) {
    streamingTimer = 0;
    world.updateStreaming(player.position, settings.viewDistance);
    environment.updateLocalLights(world, player.position);
  }
  const fluidBudget = { low: 10, balanced: 18, high: 28, ultra: 40 }[settings.graphicsQuality] || 18;
  world.updateFluids(fluidBudget);
  streamWorkFlip = !streamWorkFlip;
  if (streamWorkFlip && world.generationQueue.length) world.processQueue(1);
  else if (world.stats.dirty > 0) world.rebuildDirty(1);
  else if (world.generationQueue.length) world.processQueue(1);
  effects.update(dt);
  heldItem?.setVisible(input.locked && state === 'playing');
  heldItem?.update(dt, {
    mining: input.locked && input.buttons.has(0) && Boolean(miningTarget),
    moving: Math.hypot(player.velocity.x, player.velocity.z),
    reducedMotion: Boolean(settings.reducedMotion),
  });
  saveTimer += dt;
  if (saveTimer >= 60) saveGame(false);
  if (environment.dayAmount > 0.75 && player.health < 1) player.health = Math.min(1, player.health + dt * 0.006);
}

function updateHUD() {
  if (!world || !player) return;
  const hit = input.locked ? player.raycast() : null;
  let target = initialClickHint && !input.locked ? 'Click the world to step inside' : '';
  if (hit && input.locked && miningProgress > 0) {
    const block = BLOCKS[hit.block.id];
    const action = miningProgress > 0 ? ` · ${Math.min(99, Math.floor(miningProgress * 100))}%` : '';
    target = `${block?.name || 'Unknown'}${action}`;
  }
  const stats = world.getStats();
  const debug = settings.showDebug
    ? [
      `${fps.toFixed(0)} FPS · ${renderer.info.render.calls} draws · ${renderer.info.render.triangles.toLocaleString()} tris`,
      `XYZ ${player.position.x.toFixed(1)} / ${player.position.y.toFixed(1)} / ${player.position.z.toFixed(1)}`,
      `Chunks ${stats.generated}/${stats.loaded} · queue ${stats.queued} · dirty ${stats.dirty}`,
      `Seed ${world.seed} · ${world.biomeAt(player.position.x, player.position.z)} · ${creatures?.count || 0} creatures`,
    ].join('\n')
    : '';
  ui.updateHUD({
    health: player.health,
    stamina: player.stamina,
    time: environment.getTimeLabel(),
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
  if (state === 'playing') updateGame(dt);
  else if (state === 'menu') effects.update(dt);
  environment.update(state === 'playing' ? dt : dt * 0.12, focus, settings.viewDistance);
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
    active: state === 'playing' || state === 'inventory',
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

document.addEventListener('visibilitychange', () => {
  if (document.hidden && world) saveGame(false);
  audio.setPaused(document.hidden || !['playing', 'inventory'].includes(state));
});
window.addEventListener('beforeunload', () => {
  if (world) saveGame(false);
});

async function boot() {
  if (!initRenderer()) return;
  bindUI();
  ui.setLoading(0.72, 'Tuning the wind and water…');
  await new Promise((resolve) => requestAnimationFrame(resolve));
  setState('menu');
  ui.showMain();
  ui.hideLoading();
  requestAnimationFrame(animate);
}

boot();
