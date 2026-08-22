import { BLOCKS } from './blocks.js';
import { getItem, RECIPES } from './data.js';
import { GRAPHICS_PRESETS } from './save.js';
import { createItemArtwork } from './item-art.js';

const $ = (id) => document.getElementById(id);
const ICON_ATLAS_COLUMNS = 7;
const ICON_ATLAS_ROWS = 7;

function setTile(element, tile) {
  const index = Number(tile) || 0;
  const column = index % ICON_ATLAS_COLUMNS;
  const row = Math.floor(index / ICON_ATLAS_COLUMNS);
  element.style.setProperty('--tile-x', `${(column / (ICON_ATLAS_COLUMNS - 1)) * 100}%`);
  element.style.setProperty('--tile-y', `${(row / (ICON_ATLAS_ROWS - 1)) * 100}%`);
}

function itemIcon(item) {
  const icon = document.createElement('span');
  icon.className = 'item-icon';
  icon.style.setProperty('--item-color', item.color || '#98a3a0');
  icon.style.setProperty('--item-glow', item.emissive ? item.color || '#8fffe2' : 'transparent');
  const block = BLOCKS[item.id];
  if (block?.tiles) {
    icon.classList.add('item-icon--block');
    const cube = document.createElement('span');
    cube.className = 'item-cube';
    const front = document.createElement('span');
    const side = document.createElement('span');
    const top = document.createElement('span');
    front.className = 'item-cube__face item-cube__front';
    side.className = 'item-cube__face item-cube__side';
    top.className = 'item-cube__face item-cube__top';
    setTile(front, block.tiles.side);
    setTile(side, block.tiles.side);
    setTile(top, block.tiles.top);
    cube.append(front, side, top);
    icon.append(cube);
  } else {
    icon.classList.add(`item-icon--${item.category || 'material'}`);
    icon.append(createItemArtwork(item));
  }
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

function button(label, className = '') {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = className;
  element.textContent = label;
  return element;
}

export class UI {
  constructor() {
    this.elements = {
      canvas: $('game'),
      loading: $('loading-screen'),
      loadingBar: $('loading-bar'),
      loadingText: $('loading-text'),
      main: $('main-menu'),
      pause: $('pause-menu'),
      hud: $('hud'),
      inventory: $('inventory-panel'),
      inventoryGrid: $('inventory-grid'),
      craftList: $('craft-list'),
      recipeSearch: $('recipe-search'),
      settings: $('settings-panel'),
      credits: $('credits-panel'),
      hotbar: $('hotbar'),
      health: $('health-fill'),
      stamina: $('stamina-fill'),
      time: $('time-label'),
      objective: $('objective-text'),
      target: $('target-label'),
      toast: $('toast-layer'),
      damage: $('damage-vignette'),
      water: $('water-overlay'),
      debug: $('debug-panel'),
      continueButton: $('continue-button'),
    };
    this.inventory = null;
    this.recipeAvailability = null;
    this.inventorySelection = null;
    this.inventoryOpen = false;
    this.settingsOpen = false;
    this.creditsOpen = false;
    this.returnFocus = null;
    this.onInventoryMove = null;
    this.onSelectHotbar = null;
    this.onCraft = null;
    this.onInventoryClose = null;
    this.onResume = null;
    this.onNewWorld = null;
    this.onContinue = null;
    this.onSave = null;
    this.onTitle = null;
    this.onSettingsChanged = null;
    this._toastTimer = null;
    this._loadingHideTimer = null;
    this._bindStatic();
    this._bindDialogKeyboard();
  }

  _bindStatic() {
    $('new-world-button')?.addEventListener('click', () => {
      const seedValue = $('seed-input')?.value.trim() || `${Date.now()}`;
      const mode = document.querySelector('input[name="mode"]:checked')?.value || 'survival';
      this.onNewWorld?.(seedValue, mode);
    });
    this.elements.continueButton?.addEventListener('click', () => this.onContinue?.());
    $('resume-button')?.addEventListener('click', () => this.onResume?.());
    $('save-button')?.addEventListener('click', () => this.onSave?.());
    $('title-button')?.addEventListener('click', () => this.onTitle?.());
    $('inventory-close')?.addEventListener('click', () => {
      if (this.onInventoryClose) this.onInventoryClose();
      else this.setInventory(false);
    });
    $('settings-button')?.addEventListener('click', () => this.setSettings(true));
    $('pause-settings-button')?.addEventListener('click', () => this.setSettings(true));
    $('settings-close')?.addEventListener('click', () => this.setSettings(false));
    $('credits-button')?.addEventListener('click', () => this.setCredits(true));
    $('credits-close')?.addEventListener('click', () => this.setCredits(false));
    this.elements.recipeSearch?.addEventListener('input', () => this.renderRecipes());
    $('graphics-quality')?.addEventListener('change', () => {
      const preset = GRAPHICS_PRESETS[$('graphics-quality')?.value] || GRAPHICS_PRESETS.balanced;
      if ($('view-distance')) $('view-distance').value = `${preset.viewDistance}`;
      if ($('render-scale')) $('render-scale').value = `${preset.renderScale}`;
      this._updateSettingOutputs();
      this.onSettingsChanged?.(this.readSettings());
    });
    ['sensitivity', 'fov', 'view-distance', 'render-scale', 'volume', 'music-volume', 'ambience-volume', 'reduced-motion', 'music-enabled', 'weather-effects'].forEach((id) => {
      $(id)?.addEventListener('input', () => this.onSettingsChanged?.(this.readSettings()));
      $(id)?.addEventListener('change', () => this.onSettingsChanged?.(this.readSettings()));
    });
  }

  _bindDialogKeyboard() {
    document.addEventListener('keydown', (event) => {
      const openDialog = [...document.querySelectorAll('[role="dialog"]:not(.hidden)')].at(-1);
      if (!openDialog) return;
      if (event.key === 'Escape' && (this.settingsOpen || this.creditsOpen)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (this.settingsOpen) this.setSettings(false);
        else this.setCredits(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...openDialog.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hidden && element.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }, true);
  }

  setLoading(progress, message) {
    clearTimeout(this._loadingHideTimer);
    this._loadingHideTimer = null;
    this.elements.loading?.classList.remove('hidden', 'fade-out');
    if (this.elements.loadingBar) this.elements.loadingBar.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;
    this.elements.loading?.querySelector('[role="progressbar"]')?.setAttribute('aria-valuenow', `${Math.round(Math.max(0, Math.min(1, progress)) * 100)}`);
    if (this.elements.loadingText) this.elements.loadingText.textContent = message;
  }

  hideLoading() {
    clearTimeout(this._loadingHideTimer);
    this.elements.loading?.classList.add('fade-out');
    this._loadingHideTimer = setTimeout(() => {
      this.elements.loading?.classList.add('hidden');
      this._loadingHideTimer = null;
    }, 650);
  }

  setContinueAvailable(available) {
    if (this.elements.continueButton) {
      this.elements.continueButton.disabled = !available;
      this.elements.continueButton.title = available ? 'Continue your last world' : 'No saved world yet';
    }
  }

  showMain() {
    this.closePanels();
    this.elements.main?.classList.remove('hidden');
    this.elements.pause?.classList.add('hidden');
    this.elements.hud?.classList.add('hidden');
  }

  showGame() {
    this.elements.main?.classList.add('hidden');
    this.elements.pause?.classList.add('hidden');
    this.elements.hud?.classList.remove('hidden');
    this.closePanels();
  }

  showPause() {
    this.elements.pause?.classList.remove('hidden');
    this.elements.hud?.classList.add('soft-hidden');
    document.getElementById('resume-button')?.focus();
  }

  hidePause() {
    this.elements.pause?.classList.add('hidden');
    this.elements.hud?.classList.remove('soft-hidden');
  }

  closePanels() {
    this.inventoryOpen = false;
    this.settingsOpen = false;
    this.creditsOpen = false;
    this.inventorySelection = null;
    this.elements.inventory?.classList.add('hidden');
    this.elements.settings?.classList.add('hidden');
    this.elements.credits?.classList.add('hidden');
  }

  setInventory(open) {
    this.inventoryOpen = Boolean(open);
    if (!open) this.inventorySelection = null;
    this.elements.inventory?.classList.toggle('hidden', !open);
    if (open) {
      this.renderInventory();
      this.renderRecipes();
      document.getElementById('inventory-close')?.focus();
    }
  }

  setSettings(open) {
    if (open) this.returnFocus = document.activeElement;
    this.settingsOpen = Boolean(open);
    this.elements.settings?.classList.toggle('hidden', !open);
    if (open) document.getElementById('settings-close')?.focus();
    else {
      this.onSettingsChanged?.(this.readSettings());
      this.returnFocus?.focus?.();
      this.returnFocus = null;
    }
  }

  setCredits(open) {
    if (open) this.returnFocus = document.activeElement;
    this.creditsOpen = Boolean(open);
    this.elements.credits?.classList.toggle('hidden', !open);
    if (open) document.getElementById('credits-close')?.focus();
    else {
      this.returnFocus?.focus?.();
      this.returnFocus = null;
    }
  }

  applySettings(settings) {
    if ($('graphics-quality')) $('graphics-quality').value = settings.graphicsQuality || 'balanced';
    if ($('sensitivity')) $('sensitivity').value = Number(settings.sensitivity);
    if ($('fov')) $('fov').value = Number(settings.fov);
    if ($('view-distance')) $('view-distance').value = Number(settings.viewDistance);
    if ($('render-scale')) $('render-scale').value = Number(settings.renderScale);
    if ($('volume')) $('volume').value = Number(settings.volume);
    if ($('music-volume')) $('music-volume').value = Number(settings.musicVolume);
    if ($('ambience-volume')) $('ambience-volume').value = Number(settings.ambienceVolume);
    if ($('music-enabled')) $('music-enabled').checked = settings.musicEnabled !== false;
    if ($('weather-effects')) $('weather-effects').checked = settings.weatherEffects !== false;
    if ($('reduced-motion')) $('reduced-motion').checked = Boolean(settings.reducedMotion);
    this._updateSettingOutputs();
  }

  readSettings() {
    this._updateSettingOutputs();
    return {
      graphicsQuality: $('graphics-quality')?.value || 'balanced',
      sensitivity: Number($('sensitivity')?.value),
      fov: Number($('fov')?.value),
      viewDistance: Number($('view-distance')?.value),
      renderScale: Number($('render-scale')?.value),
      volume: Number($('volume')?.value),
      musicVolume: Number($('music-volume')?.value),
      ambienceVolume: Number($('ambience-volume')?.value),
      musicEnabled: Boolean($('music-enabled')?.checked),
      weatherEffects: Boolean($('weather-effects')?.checked),
      reducedMotion: Boolean($('reduced-motion')?.checked),
    };
  }

  _updateSettingOutputs() {
    const mappings = [
      ['sensitivity', 'sensitivity-value', (value) => `${Math.round(Number(value) / 0.000022)}%`],
      ['fov', 'fov-value', (value) => `${value}°`],
      ['view-distance', 'view-distance-value', (value) => `${value} chunks`],
      ['render-scale', 'render-scale-value', (value) => `${Math.round(Number(value) * 100)}%`],
      ['volume', 'volume-value', (value) => `${Math.round(Number(value) * 100)}%`],
      ['music-volume', 'music-volume-value', (value) => `${Math.round(Number(value) * 100)}%`],
      ['ambience-volume', 'ambience-volume-value', (value) => `${Math.round(Number(value) * 100)}%`],
    ];
    mappings.forEach(([input, output, format]) => {
      if ($(input) && $(output)) $(output).textContent = format($(input).value);
    });
  }

  bindInventory(inventory, availability) {
    this.inventory = inventory;
    this.recipeAvailability = availability;
    this.renderHotbar();
    if (this.inventoryOpen) {
      this.renderInventory();
      this.renderRecipes();
    }
  }

  renderHotbar() {
    const root = this.elements.hotbar;
    if (!root || !this.inventory) return;
    root.replaceChildren();
    for (let index = 0; index < 9; index++) {
      const slot = this.inventory.slots[index];
      const element = button('', `hotbar-slot${index === this.inventory.selected ? ' selected' : ''}`);
      element.setAttribute('aria-label', slot?.id ? `${index + 1}: ${getItem(slot.id).name}, ${slot.count}` : `${index + 1}: Empty`);
      const key = document.createElement('span');
      key.className = 'slot-key';
      key.textContent = `${index + 1}`;
      element.append(key);
      if (slot?.id) {
        const item = getItem(slot.id);
        element.append(itemIcon(item));
        const count = document.createElement('span');
        count.className = 'slot-count';
        count.textContent = slot.count > 1 ? `${slot.count}` : '';
        element.append(count);
        element.title = item.name;
      }
      element.addEventListener('click', () => this.onSelectHotbar?.(index));
      root.append(element);
    }
    const chosen = this.inventory.selectedSlot();
    root.dataset.itemName = chosen?.id ? getItem(chosen.id).name : 'Empty hand';
  }

  renderInventory() {
    const root = this.elements.inventoryGrid;
    if (!root || !this.inventory) return;
    root.replaceChildren();
    this.inventory.slots.forEach((slot, index) => {
      const element = button('', `inventory-slot${index === this.inventorySelection ? ' selected' : ''}`);
      element.dataset.index = `${index}`;
      element.setAttribute('aria-label', slot.id ? `${getItem(slot.id).name}, ${slot.count}` : `Empty slot ${index + 1}`);
      if (slot.id) {
        const item = getItem(slot.id);
        element.append(itemIcon(item));
        const count = document.createElement('span');
        count.className = 'slot-count';
        count.textContent = slot.count > 1 ? `${slot.count}` : '';
        element.append(count);
        const tooltip = document.createElement('span');
        tooltip.className = 'item-tooltip';
        const title = document.createElement('strong');
        title.textContent = item.name;
        const description = document.createElement('span');
        description.textContent = item.description || '';
        tooltip.append(title, description);
        element.append(tooltip);
      }
      element.addEventListener('click', () => {
        if (this.inventorySelection === null) {
          if (slot.id) this.inventorySelection = index;
        } else {
          this.onInventoryMove?.(this.inventorySelection, index);
          this.inventorySelection = null;
        }
        this.renderInventory();
        this.renderHotbar();
      });
      root.append(element);
    });
  }

  renderRecipes() {
    const root = this.elements.craftList;
    if (!root || !this.inventory) return;
    const query = (this.elements.recipeSearch?.value || '').trim().toLowerCase();
    root.replaceChildren();
    for (const recipe of RECIPES) {
      if (query && !`${recipe.name} ${recipe.description}`.toLowerCase().includes(query)) continue;
      const availability = this.recipeAvailability?.(recipe) || { craftable: false, reason: 'Unavailable' };
      const card = document.createElement('article');
      card.className = `recipe-card${availability.craftable ? ' craftable' : ''}`;
      const outputItem = getItem(recipe.output.id);
      const icon = itemIcon(outputItem);
      icon.classList.add('recipe-icon');
      const copy = document.createElement('div');
      copy.className = 'recipe-copy';
      const heading = document.createElement('h3');
      heading.textContent = `${recipe.name}${recipe.output.count > 1 ? ` ×${recipe.output.count}` : ''}`;
      const description = document.createElement('p');
      description.textContent = recipe.description;
      const ingredients = document.createElement('div');
      ingredients.className = 'recipe-ingredients';
      ingredients.textContent = recipe.ingredients.map(({ id, count }) => `${count} ${getItem(id).name}`).join(' · ');
      const requirement = document.createElement('small');
      requirement.textContent = availability.reason || (recipe.station ? `Near ${BLOCKS[recipe.station]?.name || 'workstation'}` : 'Craft in your pack');
      copy.append(heading, description, ingredients, requirement);
      const craft = button('Craft', 'craft-button');
      craft.disabled = !availability.craftable;
      craft.addEventListener('click', () => this.onCraft?.(recipe));
      card.append(icon, copy, craft);
      root.append(card);
    }
    if (!root.childElementCount) {
      const empty = document.createElement('p');
      empty.className = 'empty-recipes';
      empty.textContent = 'No recipes match that search.';
      root.append(empty);
    }
  }

  updateHUD({ health, stamina, time, objective, target, inWater, debug }) {
    if (this.elements.health) {
      const value = Math.round(health * 100);
      this.elements.health.style.width = `${value}%`;
      this.elements.health.parentElement?.setAttribute('aria-valuenow', `${value}`);
    }
    if (this.elements.stamina) {
      const value = Math.round(stamina * 100);
      this.elements.stamina.style.width = `${value}%`;
      this.elements.stamina.parentElement?.setAttribute('aria-valuenow', `${value}`);
    }
    if (this.elements.time) this.elements.time.textContent = time || '';
    if (this.elements.objective && objective) this.elements.objective.textContent = objective;
    if (this.elements.target) this.elements.target.textContent = target || '';
    this.elements.water?.classList.toggle('visible', Boolean(inWater));
    if (this.elements.debug) {
      this.elements.debug.textContent = debug || '';
      this.elements.debug.classList.toggle('hidden', !debug);
    }
  }

  damageFlash() {
    const element = this.elements.damage;
    if (!element) return;
    element.classList.remove('flash');
    void element.offsetWidth;
    element.classList.add('flash');
  }

  toast(message, tone = 'normal', duration = 2400) {
    const root = this.elements.toast;
    if (!root) return;
    clearTimeout(this._toastTimer);
    const toast = document.createElement('div');
    toast.className = `toast ${tone}`;
    toast.textContent = message;
    root.replaceChildren(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }
}
