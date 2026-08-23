const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

export const SURVIVAL_DEFAULTS = Object.freeze({
  nourishment: 0.9,
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
    this.wetness = clamp01(data?.wetness ?? SURVIVAL_DEFAULTS.wetness);
    this.oxygen = clamp01(data?.oxygen ?? SURVIVAL_DEFAULTS.oxygen);
    const elapsed = Number(data?.elapsedDays);
    this.elapsedDays = Number.isFinite(elapsed) ? Math.max(0, Math.min(100000, elapsed)) : 0;
    return this;
  }

  serialize() {
    return {
      nourishment: this.nourishment,
      wetness: this.wetness,
      oxygen: this.oxygen,
      elapsedDays: this.elapsedDays,
    };
  }

  get dayNumber() {
    return 1 + Math.floor(this.elapsedDays);
  }

  getModifiers() {
    const hungry = 1 - this.nourishment;
    const cold = this.wetness;
    return {
      speedMultiplier: Math.max(0.76, 1 - hungry * 0.12 - cold * 0.08),
      sprintCostMultiplier: 1 + hungry * 0.55 + cold * 0.42,
      staminaRecoveryMultiplier: Math.max(0.38, 1 - hungry * 0.48 - cold * 0.38),
    };
  }

  update(dt, context = {}) {
    dt = Math.max(0, Math.min(0.08, Number(dt) || 0));
    if (!dt) return { damage: 0, regeneration: 0, ...this.getModifiers() };
    const builder = Boolean(context.builder);
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
      this.oxygen = 1;
      this.wetness = Math.max(0, this.wetness - dt * 0.08);
      return { damage: 0, regeneration: 0, speedMultiplier: 1, sprintCostMultiplier: 1, staminaRecoveryMultiplier: 1 };
    }

    const activity = sprinting ? 1 : moving * 0.32;
    this.nourishment = Math.max(0, this.nourishment - dt * (0.0002 + activity * 0.00022));

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
    const starvationDamage = this.nourishment <= 0.001 ? dt * 0.028 : 0;
    const drowningDamage = this.oxygen <= 0.001 ? dt * 0.19 : 0;
    const exposureDamage = coldExposure ? dt * 0.006 : 0;
    const regeneration = this.nourishment > 0.72 && this.wetness < 0.55 && this.oxygen > 0.5
      ? dt * 0.0048
      : 0;

    return {
      damage: starvationDamage + drowningDamage + exposureDamage,
      regeneration,
      coldExposure,
      starving: this.nourishment <= 0.08,
      drowning: this.oxygen <= 0.12,
      ...this.getModifiers(),
    };
  }

  eat(item, riskRoll = Math.random()) {
    const nutrition = clamp01(item?.nutrition);
    const healing = clamp01(item?.food);
    const risk = clamp01(item?.foodRisk);
    const sick = risk > 0 && Number(riskRoll) < risk;
    this.nourishment = Math.min(1, this.nourishment + nutrition * (sick ? 0.45 : 1));
    return { healing: sick ? healing * 0.25 : healing, sick };
  }

  sleep(currentTime = 0.75) {
    const morning = 0.255;
    let skipped = (morning - Number(currentTime) + 1) % 1;
    if (skipped < 0.08) skipped += 1;
    this.elapsedDays += skipped;
    this.nourishment = Math.max(0.12, this.nourishment - 0.055);
    this.wetness *= 0.08;
    this.oxygen = 1;
    return morning;
  }

  respawn() {
    // Death restores breath but never creates food; respawning is not a shortcut
    // around hunting and cooking.
    this.nourishment = Math.max(0, this.nourishment - 0.08);
    this.wetness = 0;
    this.oxygen = 1;
  }
}
