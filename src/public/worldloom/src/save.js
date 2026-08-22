const SAVE_KEY = 'worldloom.save.v1';
const BACKUP_KEY = 'worldloom.save.backup.v1';
const SETTINGS_KEY = 'worldloom.settings.v1';

export const GRAPHICS_PRESETS = Object.freeze({
  low: Object.freeze({
    label: 'Low',
    viewDistance: 2,
    renderScale: 0.65,
    shadows: false,
    shadowSize: 512,
    rainDensity: 0.28,
    cloudAmount: 0.28,
    atmosphereDetail: 0.45,
    localLights: 1,
    localShadowLights: 0,
    localShadowSize: 256,
    anisotropy: 1,
    postProcessing: false,
    ambientOcclusion: false,
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
    shadowSize: 1024,
    rainDensity: 0.58,
    cloudAmount: 0.58,
    atmosphereDetail: 0.72,
    localLights: 3,
    localShadowLights: 0,
    localShadowSize: 256,
    anisotropy: 2,
    postProcessing: true,
    ambientOcclusion: false,
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
    shadowSize: 2048,
    rainDensity: 1,
    cloudAmount: 1,
    atmosphereDetail: 1,
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
    shadowSize: 4096,
    rainDensity: 1.45,
    cloudAmount: 1.25,
    atmosphereDetail: 1.18,
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
  return data && data.schemaVersion === 1 && Number.isInteger(data.seed)
    && data.player && data.inventory && Array.isArray(data.inventory.slots);
}

export class SaveStore {
  constructor() {
    this.lastSavedAt = 0;
    this.saveError = null;
  }

  hasSave() {
    return Boolean(this.load());
  }

  load() {
    const primary = safeParse(localStorage.getItem(SAVE_KEY));
    if (validateSave(primary)) return primary;
    const backup = safeParse(localStorage.getItem(BACKUP_KEY));
    return validateSave(backup) ? backup : null;
  }

  save(snapshot) {
    const data = {
      ...snapshot,
      schemaVersion: 1,
      generatorVersion: 1,
      registryVersion: 1,
      updatedAt: new Date().toISOString(),
    };
    const encoded = JSON.stringify(data);
    try {
      const current = localStorage.getItem(SAVE_KEY);
      if (current) localStorage.setItem(BACKUP_KEY, current);
      localStorage.setItem(SAVE_KEY, encoded);
      this.lastSavedAt = Date.now();
      this.saveError = null;
      return true;
    } catch (error) {
      this.saveError = error;
      console.warn('Worldloom could not save this world.', error);
      return false;
    }
  }

  clear() {
    localStorage.removeItem(SAVE_KEY);
  }

  loadSettings() {
    const stored = safeParse(localStorage.getItem(SETTINGS_KEY));
    return this.sanitizeSettings({ ...DEFAULT_SETTINGS, ...(stored || {}) });
  }

  saveSettings(settings) {
    const clean = this.sanitizeSettings(settings);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(clean));
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
      viewDistance: Math.round(number(settings.viewDistance, DEFAULT_SETTINGS.viewDistance, 2, 9)),
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

  add(id, count = 1) {
    if (!id || count <= 0) return 0;
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
    const slot = this.slots[slotIndex];
    if (!slot?.id || slot.count < count) return false;
    slot.count -= count;
    if (slot.count <= 0) {
      slot.id = 0;
      slot.count = 0;
    }
    this.changed = true;
    return true;
  }

  selectedSlot() {
    return this.slots[this.selected] || this.slots[0];
  }

  move(from, to) {
    if (from === to || !this.slots[from] || !this.slots[to]) return;
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
  }

  serialize() {
    return { selected: this.selected, slots: this.slots.map((slot) => ({ id: slot.id, count: slot.count })) };
  }

  load(data) {
    if (!data || !Array.isArray(data.slots)) return;
    this.slots = Array.from({ length: this.slotCount }, (_, index) => {
      const slot = data.slots[index];
      return {
        id: Number.isInteger(slot?.id) ? slot.id : 0,
        count: Number.isInteger(slot?.count) ? Math.max(0, Math.min(99, slot.count)) : 0,
      };
    });
    this.selected = Number.isInteger(data.selected) ? Math.max(0, Math.min(8, data.selected)) : 0;
    this.changed = true;
  }
}
