import {
  LEGACY_WORLD_GENERATOR_VERSION,
  WORLD_GENERATOR_VERSION,
  isSupportedWorldGeneratorVersion,
} from './generator-version.js';
import { normalizeViewDistance } from './streaming-config.js';

const SAVE_KEY = 'worldloom.save.v1';
const BACKUP_KEY = 'worldloom.save.backup.v1';
const SETTINGS_KEY = 'worldloom.settings.v1';
const SCHEMA_VERSION = 1;
const REGISTRY_VERSION = 1;

export const GRAPHICS_PRESETS = Object.freeze({
  low: Object.freeze({
    label: 'Low',
    viewDistance: 2,
    renderScale: 0.65,
    shadows: false,
    softShadows: false,
    shadowSize: 512,
    rainDensity: 0.28,
    cloudAmount: 0.28,
    atmosphereDetail: 0.45,
    pondDetailRadius: 28,
    pondPadCap: 24,
    pondPadsPerPond: 2,
    pondMistCap: 0,
    pondFlyCap: 0,
    hangingLeafRadius: 24,
    hangingLeafTreeCap: 12,
    hangingLeafStrandsPerTree: 1,
    hangingLeafSegmentCap: 40,
    hangingLeafPhysicsRadius: 6,
    birdRadius: 40,
    birdCap: 1,
    birdShadowCap: 0,
    localLights: 1,
    localShadowLights: 0,
    localShadowSize: 256,
    anisotropy: 1,
    postProcessing: false,
    ambientOcclusion: false,
    godRayStrength: 0,
    bloomStrength: 0,
    cinematicStrength: 0,
    shadowExtent: 28,
    shadowRadius: 1,
  }),
  balanced: Object.freeze({
    label: 'Balanced',
    viewDistance: 4,
    renderScale: 0.85,
    shadows: true,
    softShadows: false,
    shadowSize: 1024,
    rainDensity: 0.58,
    cloudAmount: 0.58,
    atmosphereDetail: 0.72,
    pondDetailRadius: 48,
    pondPadCap: 56,
    pondPadsPerPond: 3,
    pondMistCap: 16,
    pondFlyCap: 8,
    hangingLeafRadius: 48,
    hangingLeafTreeCap: 36,
    hangingLeafStrandsPerTree: 2,
    hangingLeafSegmentCap: 240,
    hangingLeafPhysicsRadius: 8,
    birdRadius: 56,
    birdCap: 2,
    birdShadowCap: 0,
    localLights: 3,
    localShadowLights: 0,
    localShadowSize: 256,
    anisotropy: 2,
    postProcessing: true,
    ambientOcclusion: false,
    godRayStrength: 0,
    bloomStrength: 0,
    cinematicStrength: 0.38,
    sharpen: 0.1,
    saturation: 1.0,
    vignette: 0.07,
    filmGrain: 0.002,
    shadowExtent: 46,
    shadowRadius: 1.2,
  }),
  high: Object.freeze({
    label: 'High',
    viewDistance: 6,
    renderScale: 1,
    shadows: true,
    softShadows: true,
    shadowSize: 2048,
    rainDensity: 1,
    cloudAmount: 1,
    atmosphereDetail: 1,
    pondDetailRadius: 72,
    pondPadCap: 96,
    pondPadsPerPond: 5,
    pondMistCap: 36,
    pondFlyCap: 14,
    hangingLeafRadius: 72,
    hangingLeafTreeCap: 72,
    hangingLeafStrandsPerTree: 3,
    hangingLeafSegmentCap: 512,
    hangingLeafPhysicsRadius: 10,
    birdRadius: 72,
    birdCap: 4,
    birdShadowCap: 1,
    localLights: 5,
    localShadowLights: 1,
    localShadowSize: 512,
    anisotropy: 8,
    postProcessing: true,
    ambientOcclusion: true,
    aoScale: 0.52,
    aoSamples: 8,
    aoIntensity: 0.66,
    aoRadius: 0.38,
    godRayStrength: 0.115,
    godRayScale: 0.42,
    godRaySourceRadius: 0.42,
    godRayDensity: 0.88,
    godRayDecay: 0.954,
    godRayWeight: 0.044,
    godRayTint: '#ffe3a8',
    bloomStrength: 0.13,
    bloomRadius: 0.54,
    bloomThreshold: 0.9,
    cinematicStrength: 0.62,
    sharpen: 0.16,
    saturation: 1.012,
    vignette: 0.09,
    filmGrain: 0.004,
    shadowExtent: 72,
    shadowRadius: 1.45,
  }),
  ultra: Object.freeze({
    label: 'Ultra',
    viewDistance: 8,
    renderScale: 1.2,
    shadows: true,
    softShadows: true,
    shadowSize: 4096,
    rainDensity: 1.45,
    cloudAmount: 1.25,
    atmosphereDetail: 1.18,
    pondDetailRadius: 96,
    pondPadCap: 144,
    pondPadsPerPond: 6,
    pondMistCap: 72,
    pondFlyCap: 24,
    hangingLeafRadius: 96,
    hangingLeafTreeCap: 112,
    hangingLeafStrandsPerTree: 4,
    hangingLeafSegmentCap: 768,
    hangingLeafPhysicsRadius: 12,
    birdRadius: 88,
    birdCap: 6,
    birdShadowCap: 2,
    localLights: 8,
    localShadowLights: 2,
    localShadowSize: 1024,
    anisotropy: 16,
    postProcessing: true,
    ambientOcclusion: true,
    aoScale: 0.72,
    aoSamples: 12,
    aoIntensity: 0.74,
    aoRadius: 0.46,
    godRayStrength: 0.17,
    godRayScale: 0.5,
    godRaySourceRadius: 0.46,
    godRayDensity: 0.94,
    godRayDecay: 0.959,
    godRayWeight: 0.048,
    godRayTint: '#ffe6b3',
    bloomStrength: 0.19,
    bloomRadius: 0.64,
    bloomThreshold: 0.86,
    cinematicStrength: 0.78,
    sharpen: 0.2,
    saturation: 1.018,
    vignette: 0.105,
    filmGrain: 0.005,
    shadowExtent: 108,
    shadowRadius: 1.7,
  }),
});

export const DEFAULT_SETTINGS = Object.freeze({
  sensitivity: 0.0022,
  fov: 75,
  viewDistance: 4,
  renderScale: 0.85,
  graphicsQuality: 'balanced',
  reducedMotion: false,
  invertY: false,
  volume: 0.72,
  musicVolume: 0.28,
  ambienceVolume: 0.68,
  musicEnabled: true,
  weatherEffects: true,
  showDebug: false,
});

function safeParse(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function validateSave(data) {
  if (!data || data.schemaVersion !== SCHEMA_VERSION || !Number.isInteger(data.seed)) return false;
  // Saves created before generator metadata existed are genuine v1 worlds.
  // Explicit values, including null and strings, must be supported integers so
  // corrupt or future terrain is never loaded under a different generator.
  const hasGeneratorVersion = Object.prototype.hasOwnProperty.call(data, 'generatorVersion');
  if (hasGeneratorVersion && !isSupportedWorldGeneratorVersion(data.generatorVersion)) return false;
  if (data.registryVersion != null && data.registryVersion !== REGISTRY_VERSION) return false;
  if (!data.player || !Array.isArray(data.player.position) || data.player.position.length !== 3) return false;
  if (!data.player.position.every((value, index) => Number.isFinite(value)
    && (index === 1 ? value >= -256 && value <= 512 : Math.abs(value) <= 50_000_000))) return false;
  if (data.player.velocity != null && (!Array.isArray(data.player.velocity)
    || data.player.velocity.length !== 3
    || !data.player.velocity.every((value) => Number.isFinite(value) && Math.abs(value) <= 100))) return false;
  if (data.objectiveIndex != null && (!Number.isInteger(data.objectiveIndex)
    || data.objectiveIndex < 0 || data.objectiveIndex > 64)) return false;
  if (data.respawnPoint != null && (!Array.isArray(data.respawnPoint)
    || data.respawnPoint.length !== 3
    || !data.respawnPoint.every((value, index) => Number.isFinite(value)
      && (index === 1 ? value >= 0 && value <= 512 : Math.abs(value) <= 50_000_000)))) return false;
  if (!data.inventory || !Array.isArray(data.inventory.slots) || data.inventory.slots.length > 72) return false;
  const inventoryValid = data.inventory.slots.every((slot) => slot && Number.isInteger(slot.id)
    && slot.id >= 0 && slot.id <= 4096 && Number.isInteger(slot.count)
    && slot.count >= 0 && slot.count <= 99
    && ((slot.id === 0 && slot.count === 0) || (slot.id > 0 && slot.count > 0)));
  if (!inventoryValid) return false;
  if (data.droppedItems == null) return true;
  if (!Array.isArray(data.droppedItems) || data.droppedItems.length > 256) return false;
  return data.droppedItems.every((drop) => drop && Number.isInteger(drop.id)
    && drop.id > 0 && drop.id <= 4096
    && Number.isInteger(drop.count) && drop.count > 0 && drop.count <= 99
    && Array.isArray(drop.position) && drop.position.length === 3
    && drop.position.every((value, index) => Number.isFinite(value)
      && (index === 1 ? value >= -256 && value <= 512 : Math.abs(value) <= 50_000_000))
    && (drop.velocity == null || (Array.isArray(drop.velocity) && drop.velocity.length === 3
      && drop.velocity.every((value) => Number.isFinite(value) && Math.abs(value) <= 40))));
}

export class SaveStore {
  constructor() {
    this.lastSavedAt = 0;
    this.saveError = null;
    this.memory = new Map();
    this.storageAvailable = true;
  }

  _get(key) {
    // An in-memory value is the newest write for this session. Prefer it over
    // readable-but-stale disk data after QuotaExceededError or privacy changes.
    if (this.memory.has(key)) return this.memory.get(key);
    try {
      const value = localStorage.getItem(key);
      this.storageAvailable = true;
      return value;
    } catch (error) {
      this.storageAvailable = false;
      this.saveError = error;
      return this.memory.get(key) ?? null;
    }
  }

  _set(key, value) {
    this.memory.set(key, value);
    try {
      localStorage.setItem(key, value);
      this.storageAvailable = true;
      return true;
    } catch (error) {
      this.storageAvailable = false;
      this.saveError = error;
      return false;
    }
  }

  _remove(key) {
    // Keep a tombstone so a failed remove cannot expose an older disk save.
    this.memory.set(key, null);
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      this.storageAvailable = false;
      this.saveError = error;
      return false;
    }
  }

  hasSave() {
    return Boolean(this.load());
  }

  load() {
    const rawPrimary = safeParse(this._get(SAVE_KEY));
    const rawBackup = safeParse(this._get(BACKUP_KEY));
    const primaryValid = validateSave(rawPrimary);
    const backupValid = validateSave(rawBackup);
    const primary = primaryValid ? {
      ...rawPrimary,
      generatorVersion: Object.prototype.hasOwnProperty.call(rawPrimary, 'generatorVersion')
        ? rawPrimary.generatorVersion
        : LEGACY_WORLD_GENERATOR_VERSION,
    } : null;
    const backup = backupValid ? {
      ...rawBackup,
      generatorVersion: Object.prototype.hasOwnProperty.call(rawBackup, 'generatorVersion')
        ? rawBackup.generatorVersion
        : LEGACY_WORLD_GENERATOR_VERSION,
    } : null;
    if (!primaryValid) return backupValid ? backup : null;
    if (!backupValid) return primary;

    // A failed primary write may still leave a newer, valid snapshot in the
    // backup slot. Prefer it only when both records carry comparable timestamps;
    // legacy records and ties retain the primary as the conservative default.
    const primaryTime = Date.parse(primary.updatedAt ?? '');
    const backupTime = Date.parse(backup.updatedAt ?? '');
    if (Number.isFinite(primaryTime) && Number.isFinite(backupTime) && backupTime > primaryTime) {
      return backup;
    }
    return primary;
  }

  save(snapshot) {
    const generatorVersion = snapshot
      && Object.prototype.hasOwnProperty.call(snapshot, 'generatorVersion')
      ? snapshot.generatorVersion
      : WORLD_GENERATOR_VERSION;
    const data = {
      ...snapshot,
      schemaVersion: SCHEMA_VERSION,
      generatorVersion,
      registryVersion: REGISTRY_VERSION,
      updatedAt: new Date().toISOString(),
    };
    if (!validateSave(data)) {
      this.saveError = new Error('Worldloom refused to save an unsupported or malformed world snapshot.');
      return false;
    }
    const encoded = JSON.stringify(data);
    try {
      const current = this._get(SAVE_KEY);
      // Never replace a known-good backup with a corrupt primary record.
      if (validateSave(safeParse(current))) this._set(BACKUP_KEY, current);
      const persisted = this._set(SAVE_KEY, encoded);
      this.lastSavedAt = Date.now();
      if (persisted) this.saveError = null;
      return persisted;
    } catch (error) {
      this.saveError = error;
      console.warn('Worldloom could not save this world.', error);
      return false;
    }
  }

  clear() {
    this._remove(SAVE_KEY);
    this._remove(BACKUP_KEY);
  }

  loadSettings() {
    const stored = safeParse(this._get(SETTINGS_KEY));
    return this.sanitizeSettings({ ...DEFAULT_SETTINGS, ...(stored || {}) });
  }

  saveSettings(settings) {
    const clean = this.sanitizeSettings(settings);
    try {
      this._set(SETTINGS_KEY, JSON.stringify(clean));
    } catch (error) {
      console.warn('Worldloom could not save settings.', error);
    }
    return clean;
  }

  sanitizeSettings(settings) {
    const number = (value, fallback, min, max) => Number.isFinite(Number(value))
      ? Math.max(min, Math.min(max, Number(value)))
      : fallback;
    const graphicsQuality = Object.hasOwn(GRAPHICS_PRESETS, settings.graphicsQuality)
      ? settings.graphicsQuality
      : DEFAULT_SETTINGS.graphicsQuality;
    return {
      sensitivity: number(settings.sensitivity, DEFAULT_SETTINGS.sensitivity, 0.0004, 0.006),
      fov: number(settings.fov, DEFAULT_SETTINGS.fov, 60, 100),
      viewDistance: normalizeViewDistance(settings.viewDistance, DEFAULT_SETTINGS.viewDistance),
      renderScale: number(settings.renderScale, DEFAULT_SETTINGS.renderScale, 0.6, 1.25),
      graphicsQuality,
      reducedMotion: Boolean(settings.reducedMotion),
      invertY: Boolean(settings.invertY),
      volume: number(settings.volume, DEFAULT_SETTINGS.volume, 0, 1),
      musicVolume: number(settings.musicVolume, DEFAULT_SETTINGS.musicVolume, 0, 1),
      ambienceVolume: number(settings.ambienceVolume, DEFAULT_SETTINGS.ambienceVolume, 0, 1),
      musicEnabled: settings.musicEnabled !== false,
      weatherEffects: settings.weatherEffects !== false,
      showDebug: Boolean(settings.showDebug),
    };
  }

  export(snapshot) {
    const blob = new Blob([JSON.stringify({ ...snapshot, schemaVersion: 1 }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `worldloom-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export class Inventory {
  constructor(slotCount = 36) {
    this.slotCount = slotCount;
    this.slots = Array.from({ length: slotCount }, () => ({ id: 0, count: 0 }));
    this.selected = 0;
    this.changed = true;
  }

  count(id) {
    return this.slots.reduce((sum, slot) => sum + (slot.id === id ? slot.count : 0), 0);
  }

  has(id, count = 1) {
    return this.count(id) >= count;
  }

  capacityFor(id) {
    if (!id) return 0;
    return this.slots.reduce((capacity, slot) => {
      if (!slot.id || slot.count <= 0) return capacity + 99;
      if (slot.id === id) return capacity + Math.max(0, 99 - slot.count);
      return capacity;
    }, 0);
  }

  canAdd(id, count = 1) {
    return this.capacityFor(id) >= Math.max(0, Number(count) || 0);
  }

  clone() {
    const copy = new Inventory(this.slotCount);
    copy.load(this.serialize());
    return copy;
  }

  add(id, count = 1) {
    id = Math.floor(Number(id));
    count = Math.floor(Number(count));
    if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(count) || count <= 0) return 0;
    let remaining = count;
    for (const slot of this.slots) {
      if (slot.id === id && slot.count < 99) {
        const added = Math.min(99 - slot.count, remaining);
        slot.count += added;
        remaining -= added;
        if (!remaining) break;
      }
    }
    for (const slot of this.slots) {
      if (!slot.id || slot.count <= 0) {
        const added = Math.min(99, remaining);
        slot.id = id;
        slot.count = added;
        remaining -= added;
        if (!remaining) break;
      }
    }
    this.changed = remaining !== count;
    return remaining;
  }

  remove(id, count = 1) {
    if (!id || count <= 0 || !this.has(id, count)) return false;
    let remaining = count;
    for (let i = this.slots.length - 1; i >= 0; i--) {
      const slot = this.slots[i];
      if (slot.id !== id) continue;
      const removed = Math.min(slot.count, remaining);
      slot.count -= removed;
      remaining -= removed;
      if (slot.count <= 0) {
        slot.id = 0;
        slot.count = 0;
      }
      if (!remaining) break;
    }
    this.changed = true;
    return true;
  }

  consume(slotIndex, count = 1) {
    slotIndex = Math.floor(Number(slotIndex));
    count = Math.floor(Number(count));
    const slot = this.slots[slotIndex];
    if (!slot?.id || !Number.isInteger(count) || count <= 0 || slot.count < count) return false;
    slot.count -= count;
    if (slot.count <= 0) {
      slot.id = 0;
      slot.count = 0;
    }
    this.changed = true;
    return true;
  }

  selectedSlot() {
    const slot = this.slots[this.selected] || this.slots[0];
    return slot?.id && slot.count > 0 ? slot : { id: 0, count: 0 };
  }

  move(from, to) {
    from = Math.floor(Number(from));
    to = Math.floor(Number(to));
    if (from === to || !this.slots[from] || !this.slots[to]) return false;
    const a = this.slots[from];
    const b = this.slots[to];
    if (a.id && a.id === b.id && b.count < 99) {
      const moved = Math.min(a.count, 99 - b.count);
      b.count += moved;
      a.count -= moved;
      if (!a.count) a.id = 0;
    } else {
      [this.slots[from], this.slots[to]] = [b, a];
    }
    this.changed = true;
    return true;
  }

  /** Remove an exact amount (or the whole stack) from one slot. */
  take(slotIndex, count = Infinity) {
    slotIndex = Math.floor(Number(slotIndex));
    const slot = this.slots[slotIndex];
    if (!slot?.id || slot.count <= 0) return null;
    const requested = Number.isFinite(Number(count))
      ? Math.max(1, Math.floor(Number(count)))
      : slot.count;
    const taken = Math.min(slot.count, requested);
    const stack = { id: slot.id, count: taken };
    slot.count -= taken;
    if (slot.count <= 0) {
      slot.id = 0;
      slot.count = 0;
    }
    this.changed = true;
    return stack;
  }

  serialize() {
    return { selected: this.selected, slots: this.slots.map((slot) => ({ id: slot.id, count: slot.count })) };
  }

  load(data) {
    if (!data || !Array.isArray(data.slots)) return;
    this.slots = Array.from({ length: this.slotCount }, (_, index) => {
      const slot = data.slots[index];
      const count = Number.isInteger(slot?.count) ? Math.max(0, Math.min(99, slot.count)) : 0;
      const id = Number.isInteger(slot?.id) && slot.id > 0 && count > 0 ? slot.id : 0;
      return {
        id,
        count: id ? count : 0,
      };
    });
    this.selected = Number.isInteger(data.selected) ? Math.max(0, Math.min(8, data.selected)) : 0;
    this.changed = true;
  }
}
