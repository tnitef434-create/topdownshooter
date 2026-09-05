const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

export const SURVIVAL_BALANCE = Object.freeze({
  wellFed: 0.8,
  hungry: 0.3,
  critical: 0.08,
  maxSaturation: 0.3,
  recoveryDelay: 8,
  regenerationPerSecond: 0.008,
  foodPerHealth: 0.6,
  starvationPerSecond: 0.0125,
});

export const SURVIVAL_DEFAULTS = Object.freeze({
  nourishment: 0.9,
  saturation: 0.12,
  wetness: 0,
  oxygen: 1,
  elapsedDays: 0,
});

/**
 * Small, deterministic survival simulation kept separate from rendering and
 * input so saves can be migrated and the balance can be regression-tested.
 */
export class SurvivalSystem {
  constructor(data = null) {
    this.load(data);
  }

  load(data = null) {
    this.nourishment = clamp01(data?.nourishment ?? SURVIVAL_DEFAULTS.nourishment);
    // Existing saves keep their food exactly and start without an invented
    // reserve. New worlds have a small buffer while the player learns to hunt.
    this.saturation = Math.min(
      this.nourishment,
      SURVIVAL_BALANCE.maxSaturation,
      clamp01(data?.saturation ?? (data ? 0 : SURVIVAL_DEFAULTS.saturation)),
    );
    this.recoveryDelay = Math.min(SURVIVAL_BALANCE.recoveryDelay, Math.max(0, Number(data?.recoveryDelay) || 0));
    this.wetness = clamp01(data?.wetness ?? SURVIVAL_DEFAULTS.wetness);
    this.oxygen = clamp01(data?.oxygen ?? SURVIVAL_DEFAULTS.oxygen);
    const elapsed = Number(data?.elapsedDays);
    this.elapsedDays = Number.isFinite(elapsed) ? Math.max(0, Math.min(100000, elapsed)) : 0;
    return this;
  }

  serialize() {
    return {
      nourishment: this.nourishment,
      saturation: this.saturation,
      recoveryDelay: this.recoveryDelay,
      wetness: this.wetness,
      oxygen: this.oxygen,
      elapsedDays: this.elapsedDays,
    };
  }

  get dayNumber() {
    return 1 + Math.floor(this.elapsedDays);
  }

  getModifiers(builder = false) {
    if (builder) return { speedMultiplier: 1, sprintCostMultiplier: 1, staminaRecoveryMultiplier: 1, canSprint: true };
    // Being slightly below full should not silently slow every new player.
    const hungry = clamp01((SURVIVAL_BALANCE.hungry - this.nourishment) / SURVIVAL_BALANCE.hungry);
    const cold = this.wetness;
    return {
      speedMultiplier: Math.max(0.76, 1 - hungry * 0.12 - cold * 0.08),
      sprintCostMultiplier: 1 + hungry * 0.55 + cold * 0.42,
      staminaRecoveryMultiplier: Math.max(0.38, 1 - hungry * 0.48 - cold * 0.38),
      canSprint: this.nourishment > SURVIVAL_BALANCE.hungry,
    };
  }

  spendFood(amount) {
    amount = clamp01(amount);
    const reserveSpent = Math.min(this.saturation, amount);
    this.saturation -= reserveSpent;
    this.nourishment = Math.max(0, this.nourishment - (amount - reserveSpent));
  }

  noteDamage() {
    this.recoveryDelay = SURVIVAL_BALANCE.recoveryDelay;
  }

  healWhileFed(health, requested) {
    health = clamp01(health);
    if (health <= 0 || this.nourishment < SURVIVAL_BALANCE.wellFed) return 0;
    const foodForHealing = this.saturation + Math.max(0, this.nourishment - SURVIVAL_BALANCE.wellFed);
    const healing = Math.min(clamp01(requested), 1 - health, foodForHealing / SURVIVAL_BALANCE.foodPerHealth);
    this.spendFood(healing * SURVIVAL_BALANCE.foodPerHealth);
    return healing;
  }

  update(dt, context = {}) {
    dt = Math.max(0, Math.min(0.08, Number(dt) || 0));
    const builder = Boolean(context.builder);
    if (!dt) return { damage: 0, regeneration: 0, ...this.getModifiers(builder) };
    const dayAmount = clamp01(context.dayAmount ?? 1);
    const rain = clamp01(context.rainIntensity);
    const caveDepth = clamp01(context.caveDepth);
    const moving = clamp01(context.moving);
    const sprinting = Boolean(context.sprinting);
    const sheltered = Boolean(context.sheltered);
    const nearHeat = Boolean(context.nearHeat);
    const inWater = Boolean(context.inWater);
    const headUnderwater = Boolean(context.headUnderwater);
    const cycleSeconds = Math.max(60, Number(context.cycleSeconds) || 1200);

    this.elapsedDays += dt / cycleSeconds;

    if (builder) {
      this.nourishment = 1;
      this.saturation = SURVIVAL_BALANCE.maxSaturation;
      this.recoveryDelay = 0;
      this.oxygen = 1;
      this.wetness = Math.max(0, this.wetness - dt * 0.08);
      return { damage: 0, regeneration: 0, ...this.getModifiers(true) };
    }

    this.recoveryDelay = Math.max(0, this.recoveryDelay - dt);
    // Food pays for exertion, not standing still or reading the inventory.
    // A steak sustains roughly 30 minutes walking or 10 minutes sprinting
    // before healing costs, with its reserve consumed before the visible bar.
    const movementCost = moving * (inWater ? 0.0008 : sprinting ? 0.0012 : 0.0004);
    const miningCost = context.mining ? 0.0005 : 0;
    const fightingCost = context.attacking ? 0.0006 : 0;
    this.spendFood(dt * (movementCost + miningCost + fightingCost));

    if (inWater) this.wetness = Math.min(1, this.wetness + dt * 0.2);
    else if (rain > 0.01 && !sheltered && caveDepth < 0.08) {
      this.wetness = Math.min(1, this.wetness + dt * rain * 0.018);
    } else {
      const drying = nearHeat ? 0.065 : sheltered ? 0.013 : dayAmount > 0.62 ? 0.008 : 0.0035;
      this.wetness = Math.max(0, this.wetness - dt * drying);
    }

    if (headUnderwater) this.oxygen = Math.max(0, this.oxygen - dt / 11.5);
    else this.oxygen = Math.min(1, this.oxygen + dt / 3.2);

    const coldExposure = this.wetness > 0.78 && (dayAmount < 0.28 || caveDepth > 0.48) && !nearHeat;
    const starvationDamage = this.nourishment <= 0 ? dt * SURVIVAL_BALANCE.starvationPerSecond : 0;
    const drowningDamage = this.oxygen <= 0.001 ? dt * 0.19 : 0;
    const exposureDamage = coldExposure ? dt * 0.006 : 0;
    const damage = starvationDamage + drowningDamage + exposureDamage;
    const health = clamp01(context.health ?? 1);
    const canRegenerate = health > 0 && health < 1 && this.recoveryDelay <= 0 && damage === 0
      && !sprinting && !context.attacking && this.nourishment >= SURVIVAL_BALANCE.wellFed
      && this.wetness < 0.55 && this.oxygen > 0.5;
    // Never charge food for overhealing or heal beyond the well-fed reserve.
    const regeneration = canRegenerate
      ? this.healWhileFed(health, dt * SURVIVAL_BALANCE.regenerationPerSecond)
      : 0;

    return {
      damage,
      regeneration,
      coldExposure,
      starving: this.nourishment <= SURVIVAL_BALANCE.critical,
      hungry: this.nourishment <= SURVIVAL_BALANCE.hungry,
      drowning: this.oxygen <= 0.12,
      ...this.getModifiers(),
    };
  }

  eat(item, riskRoll = Math.random()) {
    const nutrition = clamp01(item?.nutrition);
    const healing = clamp01(item?.food);
    const risk = clamp01(item?.foodRisk);
    const sick = risk > 0 && Number(riskRoll) < risk;
    const before = this.nourishment;
    this.nourishment = Math.min(1, this.nourishment + nutrition * (sick ? 0.45 : 1));
    const saturation = clamp01(item?.saturation ?? nutrition * (risk ? 0.25 : 0.5));
    this.saturation = Math.min(this.nourishment, SURVIVAL_BALANCE.maxSaturation, this.saturation + saturation * (sick ? 0 : 1));
    return { healing: sick ? healing * 0.25 : healing, nourishment: this.nourishment - before, sick };
  }

  sleep(currentTime = 0.75) {
    const morning = 0.255;
    let skipped = (morning - Number(currentTime) + 1) % 1;
    if (skipped < 0.08) skipped += 1;
    this.elapsedDays += skipped;
    this.spendFood(0.055);
    this.recoveryDelay = 0;
    this.wetness *= 0.08;
    this.oxygen = 1;
    return morning;
  }

  respawn() {
    // Death restores breath but never creates food; respawning is not a shortcut
    // around hunting and cooking.
    this.saturation = 0;
    this.recoveryDelay = SURVIVAL_BALANCE.recoveryDelay;
    this.wetness = 0;
    this.oxygen = 1;
  }
}
