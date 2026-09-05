import { BLOCKS } from './blocks.js';
import { getItem, RECIPES, recipeRequirements, recipeStations } from './data.js';
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
      death: $('death-screen'),
      deathReason: $('death-reason'),
      deathStatus: $('death-status'),
      respawnButton: $('respawn-button'),
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
      nourishment: $('nourishment-fill'),
      wetness: $('wetness-fill'),
      oxygen: $('oxygen-fill'),
      time: $('time-label'),
      timeText: $('time-text'),
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
    this.settingsParentWasPause = false;
    this.onInventoryMove = null;
    this.onInventoryDrop = null;
    this.onSelectHotbar = null;
    this.onCraft = null;
    this.onInventoryClose = null;
    this.onResume = null;
    this.onRespawn = null;
    this.onNewWorld = null;
    this.onContinue = null;
    this.onSave = null;
    this.onTitle = null;
    this.onSettingsChanged = null;
    this.inventoryPointer = null;
    this.inventoryDragGhost = null;
    this.suppressInventoryClickUntil = 0;
    this._toastTimer = null;
    this._loadingHideTimer = null;
    this._deathReadyTimer = null;
    this._bindStatic();
    this._bindDialogKeyboard();
  }

  _bindStatic() {
    const inventoryTip = document.querySelector('.inventory-tip');
    if (inventoryTip) inventoryTip.textContent = 'Drag stacks to move them · drag beyond the window to drop them into the world';
    const titleButton = $('title-button');
    if (titleButton) {
      titleButton.textContent = 'Save & return to Nite';
    }
    $('new-world-button')?.addEventListener('click', () => {
      const seedValue = $('seed-input')?.value.trim() || `${Date.now()}`;
      const mode = document.querySelector('input[name="mode"]:checked')?.value || 'survival';
      this.onNewWorld?.(seedValue, mode);
    });
    this.elements.continueButton?.addEventListener('click', () => this.onContinue?.());
    $('resume-button')?.addEventListener('click', () => this.onResume?.());
    this.elements.respawnButton?.addEventListener('click', () => this.onRespawn?.());
    $('save-button')?.addEventListener('click', () => this.onSave?.());
    titleButton?.addEventListener('click', () => this.onTitle?.());
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
      const focusable = [...openDialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [contenteditable="true"], [tabindex]:not([tabindex="-1"])')]
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
    this.hideDeath();
    this.closePanels();
    this.elements.main?.classList.remove('hidden');
    this.elements.pause?.classList.add('hidden');
    this.elements.hud?.classList.add('hidden');
    this.elements.hud?.classList.remove('soft-hidden');
  }

  showGame() {
    this.hideDeath();
    this.elements.main?.classList.add('hidden');
    this.elements.pause?.classList.add('hidden');
    this.elements.hud?.classList.remove('hidden');
    this.elements.hud?.classList.remove('soft-hidden');
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

  showDeath(reason = 'The wilds overcame you.') {
    clearTimeout(this._deathReadyTimer);
    this.closePanels();
    this.elements.pause?.classList.add('hidden');
    this.elements.hud?.classList.add('soft-hidden');
    if (this.elements.deathReason) this.elements.deathReason.textContent = reason;
    if (this.elements.deathStatus) this.elements.deathStatus.textContent = 'Reweaving a safe return…';
    if (this.elements.respawnButton) this.elements.respawnButton.disabled = true;
    this.elements.death?.classList.remove('hidden', 'is-respawning');
    this._deathReadyTimer = setTimeout(() => {
      if (this.elements.death?.classList.contains('hidden')) return;
      if (this.elements.deathStatus) this.elements.deathStatus.textContent = 'Your return point is ready.';
      if (this.elements.respawnButton) {
        this.elements.respawnButton.disabled = false;
        this.elements.respawnButton.focus();
      }
    }, 720);
  }

  beginRespawn() {
    clearTimeout(this._deathReadyTimer);
    if (this.elements.deathStatus) this.elements.deathStatus.textContent = 'Returning to the weave…';
    if (this.elements.respawnButton) this.elements.respawnButton.disabled = true;
    this.elements.death?.classList.add('is-respawning');
  }

  hideDeath() {
    clearTimeout(this._deathReadyTimer);
    this._deathReadyTimer = null;
    this.elements.death?.classList.add('hidden');
    this.elements.death?.classList.remove('is-respawning');
    this.elements.hud?.classList.remove('soft-hidden');
  }

  closePanels() {
    this._cancelInventoryPointer();
    this.inventoryOpen = false;
    this.settingsOpen = false;
    this.creditsOpen = false;
    this.inventorySelection = null;
    this.elements.inventory?.classList.add('hidden');
    this.elements.settings?.classList.add('hidden');
    this.elements.credits?.classList.add('hidden');
    this.elements.pause?.removeAttribute('aria-hidden');
    if (this.elements.pause) this.elements.pause.inert = false;
    this.settingsParentWasPause = false;
  }

  setInventory(open) {
    this.inventoryOpen = Boolean(open);
    if (!open) {
      this._cancelInventoryPointer();
      this.inventorySelection = null;
    }
    this.elements.inventory?.classList.toggle('hidden', !open);
    if (open) {
      this.renderInventory();
      this.renderRecipes();
      document.getElementById('inventory-close')?.focus();
    }
  }

  setSettings(open) {
    if (open) {
      this.returnFocus = document.activeElement;
      this.settingsParentWasPause = Boolean(this.elements.pause && !this.elements.pause.classList.contains('hidden'));
      if (this.settingsParentWasPause) {
        this.elements.pause.classList.add('hidden');
        this.elements.pause.setAttribute('aria-hidden', 'true');
        this.elements.pause.inert = true;
      }
    }
    this.settingsOpen = Boolean(open);
    this.elements.settings?.classList.toggle('hidden', !open);
    if (open) document.getElementById('settings-close')?.focus();
    else {
      if (this.settingsParentWasPause && this.elements.pause) {
        this.elements.pause.classList.remove('hidden');
        this.elements.pause.removeAttribute('aria-hidden');
        this.elements.pause.inert = false;
      }
      this.settingsParentWasPause = false;
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
      const control = $(input);
      const display = $(output);
      if (!control || !display) return;
      const formatted = format(control.value);
      display.textContent = formatted;
      control.setAttribute('aria-valuetext', formatted);
      const min = Number(control.min);
      const max = Number(control.max);
      const value = Number(control.value);
      const progress = Number.isFinite(min) && Number.isFinite(max) && max > min
        ? Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
        : 0;
      control.style.setProperty('--range-progress', `${progress}%`);
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
    const focusedIndex = root.contains(document.activeElement)
      ? Number(document.activeElement?.dataset?.index)
      : null;
    root.replaceChildren();
    for (let index = 0; index < 9; index++) {
      const raw = this.inventory.slots[index];
      const slot = raw?.count > 0 ? raw : null;
      const element = button('', `hotbar-slot${index === this.inventory.selected ? ' selected' : ''}`);
      element.dataset.index = `${index}`;
      element.setAttribute('aria-pressed', index === this.inventory.selected ? 'true' : 'false');
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
    if (Number.isInteger(focusedIndex)) root.querySelector(`[data-index="${focusedIndex}"]`)?.focus();
    const chosen = this.inventory.selectedSlot();
    root.dataset.itemName = chosen?.id ? getItem(chosen.id).name : 'Empty hand';
  }

  renderInventory() {
    const root = this.elements.inventoryGrid;
    if (!root || !this.inventory) return;
    const focusedIndex = root.contains(document.activeElement)
      ? Number(document.activeElement?.dataset?.index)
      : null;
    root.replaceChildren();
    this.inventory.slots.forEach((slot, index) => {
      const element = button('', `inventory-slot${index === this.inventorySelection ? ' selected' : ''}`);
      element.dataset.index = `${index}`;
      element.style.touchAction = 'none';
      element.setAttribute('aria-pressed', index === this.inventorySelection ? 'true' : 'false');
      element.setAttribute('aria-grabbed', index === this.inventorySelection ? 'true' : 'false');
      element.setAttribute('aria-label', slot.id ? `${getItem(slot.id).name}, ${slot.count}` : `Empty slot ${index + 1}`);
      if (slot.id && slot.count > 0) {
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
        if (performance.now() < this.suppressInventoryClickUntil) return;
        if (this.inventorySelection === null) {
          if (slot.id) this.inventorySelection = index;
        } else {
          this.onInventoryMove?.(this.inventorySelection, index);
          this.inventorySelection = null;
        }
        this.renderInventory();
        this.renderHotbar();
      });
      element.addEventListener('pointerdown', (event) => this._beginInventoryPointer(event, index));
      element.addEventListener('keydown', (event) => {
        if (!slot.id || !['Delete', 'Backspace'].includes(event.key)) return;
        event.preventDefault();
        this.onInventoryDrop?.(index);
        this.inventorySelection = null;
        this.renderInventory();
        this.renderHotbar();
      });
      root.append(element);
    });
    if (Number.isInteger(focusedIndex)) root.querySelector(`[data-index="${focusedIndex}"]`)?.focus();
  }

  _beginInventoryPointer(event, index) {
    if (event.button !== 0 || !this.inventory?.slots[index]?.id || this.inventoryPointer) return;
    const originElement = event.currentTarget;
    this.inventoryPointer = {
      pointerId: event.pointerId,
      index,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
      originElement,
    };
    const move = (moveEvent) => this._moveInventoryPointer(moveEvent);
    const finish = (upEvent) => this._finishInventoryPointer(upEvent, false);
    const cancel = (cancelEvent) => this._finishInventoryPointer(cancelEvent, true);
    this.inventoryPointer.move = move;
    this.inventoryPointer.finish = finish;
    this.inventoryPointer.cancel = cancel;
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', finish, { passive: false });
    window.addEventListener('pointercancel', cancel, { passive: false });
  }

  _showInventoryPointerSelection(index) {
    this.inventorySelection = index;
    for (const slot of this.elements.inventoryGrid?.children || []) {
      const selected = Number(slot.dataset?.index) === index;
      slot.classList.toggle('selected', selected);
      slot.setAttribute('aria-pressed', selected ? 'true' : 'false');
      slot.setAttribute('aria-grabbed', selected ? 'true' : 'false');
    }
  }

  _moveInventoryPointer(event) {
    const drag = this.inventoryPointer;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (!drag.dragging && distance < 7) return;
    event.preventDefault();
    if (!drag.dragging) {
      drag.dragging = true;
      try {
        drag.originElement?.setPointerCapture?.(drag.pointerId);
      } catch {
        // Window-level listeners still complete the transaction on browsers
        // that do not allow pointer capture for this input device.
      }
      this._showInventoryPointerSelection(drag.index);
      const stack = this.inventory.slots[drag.index];
      const ghost = document.createElement('div');
      ghost.className = 'inventory-slot inventory-drag-ghost';
      ghost.setAttribute('aria-hidden', 'true');
      Object.assign(ghost.style, {
        position: 'fixed',
        zIndex: '9999',
        width: '48px',
        height: '48px',
        pointerEvents: 'none',
        opacity: '0.9',
        transform: 'translate(-50%, -50%) scale(1.08)',
        boxShadow: '0 10px 28px rgba(0,0,0,.48)',
      });
      ghost.append(itemIcon(getItem(stack.id)));
      if (stack.count > 1) {
        const count = document.createElement('span');
        count.className = 'slot-count';
        count.textContent = `${stack.count}`;
        ghost.append(count);
      }
      document.body.append(ghost);
      this.inventoryDragGhost = ghost;
    }
    if (this.inventoryDragGhost) {
      this.inventoryDragGhost.style.left = `${event.clientX}px`;
      this.inventoryDragGhost.style.top = `${event.clientY}px`;
    }
    const hovered = document.elementFromPoint(event.clientX, event.clientY)?.closest?.('.inventory-slot');
    for (const slot of this.elements.inventoryGrid?.children || []) {
      slot.style.outline = slot === hovered ? '2px solid rgba(255,255,255,.9)' : '';
    }
  }

  _finishInventoryPointer(event, cancelled) {
    const drag = this.inventoryPointer;
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (drag.dragging) {
      event.preventDefault();
      this.suppressInventoryClickUntil = performance.now() + 350;
      if (!cancelled) {
        const target = document.elementFromPoint(event.clientX, event.clientY);
        const slotTarget = target?.closest?.('.inventory-slot');
        const targetIndex = Number(slotTarget?.dataset?.index);
        if (Number.isInteger(targetIndex) && targetIndex >= 0) {
          this.onInventoryMove?.(drag.index, targetIndex);
        } else if (!target?.closest?.('.inventory-window')) {
          this.onInventoryDrop?.(drag.index);
        }
      }
    }
    this._cancelInventoryPointer();
    this.inventorySelection = null;
    this.renderInventory();
    this.renderHotbar();
  }

  _cancelInventoryPointer() {
    const drag = this.inventoryPointer;
    if (drag) {
      try {
        if (drag.originElement?.hasPointerCapture?.(drag.pointerId)) {
          drag.originElement.releasePointerCapture(drag.pointerId);
        }
      } catch {
        // The originating slot may already have left the document while a
        // panel closes; the inventory snapshot remains untouched in that case.
      }
      window.removeEventListener('pointermove', drag.move);
      window.removeEventListener('pointerup', drag.finish);
      window.removeEventListener('pointercancel', drag.cancel);
    }
    this.inventoryPointer = null;
    this.inventoryDragGhost?.remove();
    this.inventoryDragGhost = null;
    for (const slot of this.elements.inventoryGrid?.children || []) slot.style.outline = '';
  }

  renderRecipes() {
    const root = this.elements.craftList;
    if (!root || !this.inventory) return;
    const query = (this.elements.recipeSearch?.value || '').trim().toLowerCase();
    const focusedRecipe = root.contains(document.activeElement)
      ? document.activeElement?.dataset?.recipeId
      : null;
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
      const requirements = recipeRequirements(recipe);
      ingredients.textContent = requirements.map(({ id, count }) => {
        const owned = this.inventory.count(id);
        return `${owned >= count ? '✓ ' : ''}${getItem(id).name} ${Math.min(owned, count)}/${count}`;
      }).join(' · ');
      const requirement = document.createElement('small');
      const stations = recipeStations(recipe);
      const stationLabel = stations.map((id) => BLOCKS[id]?.name || 'workstation').join(' or ');
      requirement.textContent = availability.reason || (stations.length ? `Near ${stationLabel}` : 'Craft in your pack');
      copy.append(heading, description, ingredients, requirement);
      const craft = button('Craft', 'craft-button');
      craft.dataset.recipeId = recipe.id;
      craft.disabled = !availability.craftable;
      craft.addEventListener('click', () => this.onCraft?.(recipe));
      card.append(icon, copy, craft);
      root.append(card);
    }
    if (focusedRecipe) root.querySelector(`[data-recipe-id="${CSS.escape(focusedRecipe)}"]`)?.focus();
    if (!root.childElementCount) {
      const empty = document.createElement('p');
      empty.className = 'empty-recipes';
      empty.textContent = 'No recipes match that search.';
      root.append(empty);
    }
  }

  updateHUD({ health, stamina, nourishment = 1, wetness = 0, oxygen = 1, time, objective, target, inWater, debug }) {
    const updateBar = (element, amount) => {
      if (!element) return;
      const value = Math.round(Math.max(0, Math.min(1, Number(amount) || 0)) * 100);
      element.style.width = `${value}%`;
      element.parentElement?.setAttribute('aria-valuenow', `${value}`);
    };
    updateBar(this.elements.health, health);
    updateBar(this.elements.stamina, stamina);
    updateBar(this.elements.nourishment, nourishment);
    updateBar(this.elements.wetness, wetness);
    updateBar(this.elements.oxygen, oxygen);
    this.elements.wetness?.closest('.status-row')?.classList.toggle('is-hidden', wetness < 0.025);
    this.elements.oxygen?.closest('.status-row')?.classList.toggle('is-hidden', oxygen > 0.995);
    if (this.elements.timeText) this.elements.timeText.textContent = time || '';
    if (this.elements.objective && objective) this.elements.objective.textContent = objective;
    if (this.elements.target) this.elements.target.textContent = target || '';
    this.elements.water?.classList.toggle('visible', Boolean(inWater));
    if (this.elements.debug) {
      this.elements.debug.textContent = debug || '';
      this.elements.debug.classList.toggle('hidden', !debug);
    }
  }

  damageFlash(strength = 0.16) {
    const element = this.elements.damage;
    if (!element) return;
    const amount = Math.max(0, Math.min(1, Number(strength) || 0));
    element.style.setProperty('--damage-strength', `${Math.min(1, 0.38 + Math.sqrt(amount) * 0.62)}`);
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
