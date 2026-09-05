import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/public/worldloom/vendor/three.module.min.js';
import { BLOCK } from '../src/public/worldloom/src/blocks.js';
import { ITEM, getItem } from '../src/public/worldloom/src/data.js';
import { PlayerController } from '../src/public/worldloom/src/player.js';
import { SurvivalSystem, SURVIVAL_BALANCE } from '../src/public/worldloom/src/survival.js';
import { UI } from '../src/public/worldloom/src/ui.js';

function simulate(system, seconds, context = {}, dt = 0.05) {
  let damage = 0;
  let health = context.health ?? 1;
  for (let elapsed = 0; elapsed < seconds - 1e-8; elapsed += dt) {
    const tick = system.update(Math.min(dt, seconds - elapsed), { ...context, health });
    damage += tick.damage;
    health = Math.max(0, Math.min(1, health + tick.regeneration - tick.damage));
  }
  return { damage, health };
}

function near(actual, expected, message) {
  assert.ok(Math.abs(actual - expected) < 1e-8, `${message}: ${actual} vs ${expected}`);
}

test('standing idle preserves food; walking, swimming, mining and sprinting have distinct costs', () => {
  const make = () => new SurvivalSystem({ nourishment: 1, saturation: 0 });
  const idle = make(), walking = make(), sprinting = make(), swimming = make(), mining = make(), attacking = make();
  simulate(idle, 1200);
  assert.equal(idle.nourishment, 1, 'a whole idle day must not become a hunger penalty');
  simulate(walking, 120, { moving: 1 });
  simulate(sprinting, 120, { moving: 1, sprinting: true });
  simulate(swimming, 120, { moving: 1, inWater: true });
  simulate(mining, 120, { mining: true });
  simulate(attacking, 120, { attacking: true });
  assert.ok(walking.nourishment < 1);
  assert.ok(swimming.nourishment < walking.nourishment);
  assert.ok(sprinting.nourishment < swimming.nourishment);
  assert.ok(mining.nourishment < walking.nourishment);
  assert.ok(attacking.nourishment < walking.nourishment);
  const heldSprint = make();
  simulate(heldSprint, 120, { sprinting: true, moving: 0 });
  assert.equal(heldSprint.nourishment, 1, 'holding sprint without moving costs no food');
});

test('cooked food restores a lasting reserve before the visible food bar depletes', () => {
  const system = new SurvivalSystem({ nourishment: 0.4 });
  const meal = system.eat(getItem(ITEM.COOKED_MEAT), 0);
  near(system.nourishment, 0.88, 'cooked food restores 48%');
  near(system.saturation, 0.24, 'a cooked meal creates its advertised reserve');
  assert.equal(meal.sick, false, 'cooked food is always safe');
  assert.equal(meal.healing, 0, 'food cannot instantly heal through repeated combat clicks');
  simulate(system, 120, { moving: 1, sprinting: true });
  near(system.nourishment, 0.88, 'the reserve absorbs early exertion');
  assert.ok(system.saturation > 0 && system.saturation < 0.24);
  simulate(system, 180, { moving: 1, sprinting: true });
  near(system.saturation, 0, 'the reserve eventually runs out');
  assert.ok(system.nourishment < 0.88);
});

test('raw food risk is deterministic and loses its reserve when illness occurs', () => {
  const sick = new SurvivalSystem({ nourishment: 0.5 });
  const healthy = new SurvivalSystem({ nourishment: 0.5 });
  assert.equal(sick.eat(getItem(ITEM.RAW_MEAT), 0.149).sick, true);
  assert.equal(healthy.eat(getItem(ITEM.RAW_MEAT), 0.15).sick, false);
  assert.equal(sick.saturation, 0);
  assert.ok(healthy.saturation > 0);
  assert.ok(sick.nourishment > 0.5 && sick.nourishment < healthy.nourishment);
  near(healthy.nourishment, 0.62, 'safe raw meat restores 12%');
});

test('natural healing waits after damage, spends food, and stops at the well-fed boundary', () => {
  const system = new SurvivalSystem({ nourishment: 0.9, saturation: 0.12 });
  system.noteDamage();
  const foodBefore = system.nourishment + system.saturation;
  const duringDelay = simulate(system, 7.9, { health: 0.3 });
  assert.equal(duringDelay.health, 0.3);
  near(system.nourishment + system.saturation, foodBefore, 'a blocked heal must spend no food');
  const healed = simulate(system, 60, { health: duringDelay.health });
  assert.ok(healed.health > 0.3 && healed.health < 1);
  near(system.nourishment, SURVIVAL_BALANCE.wellFed, 'healing stops at 80% food');
  near(system.saturation, 0, 'healing uses the reserve first');
  near(foodBefore - system.nourishment - system.saturation, (healed.health - 0.3) * SURVIVAL_BALANCE.foodPerHealth, 'healing has an exact food tradeoff');
  const finished = simulate(system, 20, { health: healed.health });
  near(finished.health, healed.health, 'healing cannot continue without food');
});

test('full health never burns healing food and a final partial heal never overcharges', () => {
  const healthy = new SurvivalSystem({ nourishment: 1, saturation: 0.3 });
  simulate(healthy, 1200, { health: 1 });
  assert.equal(healthy.nourishment, 1);
  assert.equal(healthy.saturation, 0.3);
  const final = healthy.update(0.05, { health: 0.9999 });
  near(final.regeneration, 0.0001, 'the final heal is capped at missing health');
  near(healthy.saturation, 0.3 - 0.0001 * SURVIVAL_BALANCE.foodPerHealth, 'only delivered health is charged');
});

test('sprinting, fighting, wetness, low food and depleted oxygen prevent natural healing', () => {
  for (const context of [
    { sprinting: true, moving: 1 }, { attacking: true },
    { headUnderwater: true, oxygen: 0.2 }, { wetness: 0.8 }, { nourishment: 0.79 },
  ]) {
    const system = new SurvivalSystem({ nourishment: 1, saturation: 0.3, ...context });
    const result = system.update(0.05, { health: 0.5, ...context });
    assert.equal(result.regeneration, 0, JSON.stringify(context));
  }
});

test('hunger limits sprint only at low food while preserving ordinary walking and recovery', () => {
  const fed = new SurvivalSystem({ nourishment: 0.9 }).getModifiers();
  assert.equal(fed.speedMultiplier, 1);
  assert.equal(fed.staminaRecoveryMultiplier, 1);
  assert.equal(fed.canSprint, true);
  const hungry = new SurvivalSystem({ nourishment: 0.3 }).getModifiers();
  assert.equal(hungry.canSprint, false);
  assert.equal(hungry.speedMultiplier, 1, 'the sprint limit should not also impose a sudden walking slowdown');
  const empty = new SurvivalSystem({ nourishment: 0 }).getModifiers();
  assert.ok(empty.speedMultiplier >= 0.85, 'hungry players can still reach food');
  assert.ok(empty.staminaRecoveryMultiplier >= 0.5, 'hungry players can still hunt');

  const player = new PlayerController(new THREE.PerspectiveCamera(), { getBlock: () => BLOCK.AIR });
  player.flying = true;
  const input = { consumeLook: () => ({ x: 0, y: 0 }), isDown: (...keys) => keys.includes('KeyW') || keys.includes('ShiftLeft') };
  assert.equal(player.update(0.05, input, hungry).sprinting, false);
  assert.equal(player.update(0.05, input, fed).sprinting, true, 'eating enables sprint again');
});

test('starvation warns before zero, damages slowly at zero, and stops immediately after food', () => {
  const warned = new SurvivalSystem({ nourishment: 0.05 });
  const warning = warned.update(0.05);
  assert.equal(warning.starving, true);
  assert.equal(warning.damage, 0, 'the warning gives time to find food');
  const empty = new SurvivalSystem({ nourishment: 0 });
  const result = simulate(empty, 40);
  near(result.damage, 0.5, 'an empty bar takes 80 seconds to remove full health');
  empty.eat(getItem(ITEM.COOKED_MEAT));
  assert.equal(empty.update(0.05, { health: result.health }).damage, 0);
});

test('builder mode ignores hunger and hazards even when loading an empty survival state', () => {
  const system = new SurvivalSystem({ nourishment: 0, wetness: 1, oxygen: 0 });
  assert.equal(system.getModifiers(true).canSprint, true, 'builder sprint works before the first simulation tick');
  const result = system.update(0.05, { builder: true, moving: 1, sprinting: true, headUnderwater: true, dayAmount: 0, health: 0.5 });
  assert.equal(system.nourishment, 1);
  assert.equal(system.oxygen, 1);
  assert.equal(result.damage, 0);
  assert.equal(result.regeneration, 0);
  assert.equal(result.speedMultiplier, 1);
});

test('sleep and respawn never create food or punish repeated deaths with more hunger', () => {
  const empty = new SurvivalSystem({ nourishment: 0, wetness: 1, oxygen: 0 });
  empty.sleep(0.8);
  assert.equal(empty.nourishment, 0, 'sleep must not create the former 12% food floor');
  assert.equal(empty.healWhileFed(0.2, 0.3), 0, 'sleep is not a free hunger-health loop');
  empty.respawn();
  assert.equal(empty.nourishment, 0);
  assert.equal(empty.oxygen, 1);
  const fed = new SurvivalSystem({ nourishment: 0.5, saturation: 0.1 });
  fed.respawn();
  assert.equal(fed.nourishment, 0.5, 'death keeps current food instead of charging another 8%');
  assert.equal(fed.saturation, 0, 'death cannot refill energy');
});

test('old saves migrate without a food change and new reserve/recovery state round-trips', () => {
  const old = new SurvivalSystem({ nourishment: 0.43, wetness: 0.25, oxygen: 0.8, elapsedDays: 4.6 });
  assert.equal(old.nourishment, 0.43);
  assert.equal(old.saturation, 0);
  old.eat(getItem(ITEM.COOKED_MEAT));
  old.noteDamage();
  old.update(0.05, { health: 0.5, moving: 1 });
  assert.deepEqual(new SurvivalSystem(old.serialize()).serialize(), old.serialize());
  const malformed = new SurvivalSystem({ nourishment: 0.1, saturation: 20, recoveryDelay: Infinity });
  assert.equal(malformed.saturation, 0.1, 'the reserve is bounded by current food');
  assert.equal(malformed.recoveryDelay, SURVIVAL_BALANCE.recoveryDelay);
});

test('food exertion and regeneration stay consistent across supported frame rates', () => {
  const results = [1 / 144, 1 / 60, 0.05].map((dt) => {
    const system = new SurvivalSystem({ nourishment: 1, saturation: 0.3 });
    const result = simulate(system, 30, { moving: 1, health: 0.5 }, dt);
    return { ...system.serialize(), health: result.health };
  });
  for (const result of results.slice(1)) {
    near(result.nourishment, results[0].nourishment, 'food is frame-rate independent');
    near(result.saturation, results[0].saturation, 'reserve is frame-rate independent');
    near(result.health, results[0].health, 'healing is frame-rate independent');
  }
});

test('damage feedback ignores zero damage and reduces intensity with the motion preference', () => {
  const originalDocument = globalThis.document;
  const originalMatchMedia = globalThis.matchMedia;
  const classes = new Set(), properties = new Map();
  let flashes = 0;
  const element = {
    style: { setProperty: (key, value) => properties.set(key, value) },
    classList: {
      add(value) { classes.add(value); if (value === 'flash') flashes++; },
      remove: value => classes.delete(value),
      toggle(value, enabled) { if (enabled) classes.add(value); else classes.delete(value); },
    },
    offsetWidth: 100,
  };
  const ui = { elements: { damage: element } };
  try {
    globalThis.document = { body: { classList: { contains: () => false } } };
    globalThis.matchMedia = () => ({ matches: false });
    for (const strength of [0, -0.2, NaN]) UI.prototype.damageFlash.call(ui, strength);
    assert.equal(flashes, 0, 'no visual hit should appear when no health was lost');
    UI.prototype.damageFlash.call(ui, 0.2, false);
    const regular = Number(properties.get('--damage-strength'));
    assert.equal(flashes, 1);
    UI.prototype.damageFlash.call(ui, 0.2, true);
    assert.ok(Number(properties.get('--damage-strength')) < regular);
    assert.ok(classes.has('is-reduced-motion'));
    assert.equal(flashes, 2, 'a second actual hit restarts the short edge cue');
  } finally {
    if (originalDocument === undefined) delete globalThis.document; else globalThis.document = originalDocument;
    if (originalMatchMedia === undefined) delete globalThis.matchMedia; else globalThis.matchMedia = originalMatchMedia;
  }
});
