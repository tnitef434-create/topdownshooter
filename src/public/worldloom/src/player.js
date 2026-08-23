import * as THREE from '../vendor/three.module.min.js';
import { BLOCKS, isSolid, isLiquid, blockShapeHeight } from './blocks.js';

export const PLAYER = Object.freeze({
  width: 0.62,
  height: 1.78,
  eye: 1.58,
  reach: 6,
  walkSpeed: 4.65,
  sprintSpeed: 7.1,
  crouchSpeed: 2.3,
  jumpSpeed: 8.15,
  gravity: 23.5,
});

const EPSILON = 0.0001;

export const FALL_DAMAGE = Object.freeze({
  // A standing jump lands at roughly 8.2 m/s. This threshold leaves normal
  // jumps, one-block steps and short ledge drops comfortably damage-free.
  safeImpact: 13,
  energyScale: 340,
  maximum: 0.86,
});

export function fallDamageForImpact(impact, tuning = FALL_DAMAGE) {
  const speed = Math.max(0, Number(impact) || 0);
  const safeImpact = Math.max(0, Number(tuning?.safeImpact) || FALL_DAMAGE.safeImpact);
  if (speed <= safeImpact) return 0;
  // Impact energy grows with velocity squared. This gives a gentle warning on
  // medium falls, then makes genuinely long drops dangerous without an abrupt
  // damage cliff at the threshold.
  const energyScale = Math.max(1, Number(tuning?.energyScale) || FALL_DAMAGE.energyScale);
  const maximum = THREE.MathUtils.clamp(
    Number(tuning?.maximum) || FALL_DAMAGE.maximum,
    0,
    1,
  );
  return THREE.MathUtils.clamp(
    (speed * speed - safeImpact * safeImpact) / energyScale,
    0,
    maximum,
  );
}

function intersectsBlockShape(aabb, x, y, z, blockId) {
  if (!isSolid(blockId)) return false;
  const height = blockShapeHeight(blockId);
  return aabb.maxX > x + EPSILON && aabb.minX < x + 1 - EPSILON
    && aabb.maxY > y + EPSILON && aabb.minY < y + height - EPSILON
    && aabb.maxZ > z + EPSILON && aabb.minZ < z + 1 - EPSILON;
}

export class InputController {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.buttons = new Set();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.wheel = 0;
    this.locked = false;
    this.enabled = true;
    this.onButtonDown = null;
    this.onButtonUp = null;
    this.onKeyDown = null;
    this.maxMouseDelta = 1400;

    this._keyDown = (event) => {
      if (!this.enabled) return;
      const code = event.code;
      const target = event.target;
      const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
        || target instanceof HTMLSelectElement || target?.isContentEditable;
      if (isTyping && code !== 'Escape') return;
      if (['Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight'].includes(code)) {
        event.preventDefault();
      }
      const first = !this.keys.has(code);
      this.keys.add(code);
      if (first) this.onKeyDown?.(code, event);
    };
    this._keyUp = (event) => this.keys.delete(event.code);
    this._mouseMove = (event) => {
      if (!this.locked || !this.enabled) return;
      const dx = Number(event.movementX) || 0;
      const dy = Number(event.movementY) || 0;
      // Ignore only impossible cursor-warp events. Legitimate high-DPI flicks can
      // exceed 180px and must remain continuous through any number of full turns.
      if (Math.abs(dx) <= this.maxMouseDelta) this.mouseDX += dx;
      if (Math.abs(dy) <= this.maxMouseDelta) this.mouseDY += dy;
    };
    this._mouseDown = (event) => {
      if (!this.locked || !this.enabled) return;
      event.preventDefault();
      this.buttons.add(event.button);
      this.onButtonDown?.(event.button, event);
    };
    this._mouseUp = (event) => {
      this.buttons.delete(event.button);
      this.onButtonUp?.(event.button, event);
    };
    this._wheel = (event) => {
      if (!this.locked || !this.enabled) return;
      event.preventDefault();
      this.wheel += Math.sign(event.deltaY);
    };
    this._lockChange = () => {
      this.locked = document.pointerLockElement === canvas;
      if (!this.locked) this.clear();
    };
    this._blur = () => this.clear();
    this._context = (event) => event.preventDefault();

    window.addEventListener('keydown', this._keyDown, { passive: false });
    window.addEventListener('keyup', this._keyUp);
    window.addEventListener('mousemove', this._mouseMove);
    window.addEventListener('mousedown', this._mouseDown, { passive: false });
    window.addEventListener('mouseup', this._mouseUp);
    window.addEventListener('wheel', this._wheel, { passive: false });
    window.addEventListener('blur', this._blur);
    document.addEventListener('pointerlockchange', this._lockChange);
    canvas.addEventListener('contextmenu', this._context);
  }

  clear() {
    this.keys.clear();
    this.buttons.clear();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.wheel = 0;
  }

  consumeLook() {
    const look = { x: this.mouseDX, y: this.mouseDY };
    this.mouseDX = 0;
    this.mouseDY = 0;
    return look;
  }

  consumeWheel() {
    const wheel = this.wheel;
    this.wheel = 0;
    return wheel;
  }

  isDown(...codes) {
    return codes.some((code) => this.keys.has(code));
  }

  requestLock() {
    if (document.pointerLockElement !== this.canvas) this.canvas.requestPointerLock?.();
  }
}

export class PlayerController {
  constructor(camera, world) {
    this.camera = camera;
    this.world = world;
    this.position = new THREE.Vector3(0.5, 40, 0.5);
    this.velocity = new THREE.Vector3();
    this.yaw = 0;
    this.pitch = 0;
    this.grounded = false;
    this.inWater = false;
    this.headUnderwater = false;
    this.coyote = 0;
    this.jumpBuffer = 0;
    this.stamina = 1;
    this.staminaRecoveryDelay = 0;
    this.health = 1;
    this.bobTime = 0;
    this.bobBlend = 0;
    this.landingKick = 0;
    this.wasGrounded = false;
    this.landingImpact = 0;
    this.stepTimer = 0;
    this.distanceMoved = 0;
    this.onStep = null;
    this.onLand = null;
    this.onSplash = null;
    this.onDamage = null;
    this.onVoid = null;
    this.flying = false;
    this._lastJumpTap = -Infinity;
    this._time = 0;
    this._wish = new THREE.Vector3();
    this._forward = new THREE.Vector3();
    this._right = new THREE.Vector3();
    this._lookEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    this._lastSafe = this.position.clone();
    this._syncCamera(0, false, 75);
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z);
    this.velocity.set(0, 0, 0);
    this.grounded = false;
    this.wasGrounded = false;
    this.landingImpact = 0;
    this._lastSafe.copy(this.position);
    this._syncCamera(0, false, this.camera.fov || 75);
  }

  canSpendStamina(amount, reserve = 0) {
    const cost = THREE.MathUtils.clamp(Number(amount) || 0, 0, 1);
    const minimumReserve = THREE.MathUtils.clamp(Number(reserve) || 0, 0, 1);
    return this.stamina + EPSILON >= Math.min(1, cost + minimumReserve);
  }

  spendStamina(amount, recoveryDelay = 0.58) {
    const cost = THREE.MathUtils.clamp(Number(amount) || 0, 0, 1);
    if (cost <= 0) return true;
    if (!this.canSpendStamina(cost)) return false;
    this.stamina = Math.max(0, this.stamina - cost);
    this.staminaRecoveryDelay = Math.max(
      this.staminaRecoveryDelay,
      THREE.MathUtils.clamp(Number(recoveryDelay) || 0, 0, 3),
    );
    return true;
  }

  get feetAABB() {
    const half = PLAYER.width / 2;
    return {
      minX: this.position.x - half,
      maxX: this.position.x + half,
      minY: this.position.y,
      maxY: this.position.y + PLAYER.height,
      minZ: this.position.z - half,
      maxZ: this.position.z + half,
    };
  }

  intersectsBlock(x, y, z, blockId = this.world.getBlock(x, y, z)) {
    return intersectsBlockShape(this.feetAABB, x, y, z, blockId);
  }

  isColliding() {
    return this._collidesAt(this.position);
  }

  isCollidingAt(position) {
    return this._collidesAt(position);
  }

  update(dt, input, settings = {}) {
    dt = Math.min(dt, 0.05);
    this._time += dt;
    this.staminaRecoveryDelay = Math.max(0, this.staminaRecoveryDelay - dt);
    const sensitivity = Number(settings.sensitivity ?? 0.0022);
    const look = input.consumeLook();
    this.yaw -= look.x * sensitivity;
    this.pitch -= look.y * sensitivity * (settings.invertY ? -1 : 1);
    this.pitch = Math.max(-Math.PI * 0.495, Math.min(Math.PI * 0.495, this.pitch));
    // Keep long play sessions numerically stable without wrapping at ±180°.
    // The very high threshold means a normal 360° turn is always continuous.
    if (Math.abs(this.yaw) > Math.PI * 4096) this.yaw %= Math.PI * 2;

    if (input.isDown('Space')) this.jumpBuffer = 0.12;
    else this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
    this.coyote = this.grounded ? 0.1 : Math.max(0, this.coyote - dt);

    const forwardInput = (input.isDown('KeyW') ? 1 : 0) - (input.isDown('KeyS') ? 1 : 0);
    const sideInput = (input.isDown('KeyD') ? 1 : 0) - (input.isDown('KeyA') ? 1 : 0);
    const crouching = input.isDown('ControlLeft', 'ControlRight');
    const wantsSprint = input.isDown('ShiftLeft', 'ShiftRight') && forwardInput > 0 && !crouching;
    const sprinting = wantsSprint && this.stamina > 0.025 && !this.inWater;
    const speedMultiplier = THREE.MathUtils.clamp(Number(settings.speedMultiplier) || 1, 0.5, 1.25);
    const sprintCostMultiplier = THREE.MathUtils.clamp(Number(settings.sprintCostMultiplier) || 1, 0.5, 3);
    const staminaRecoveryMultiplier = THREE.MathUtils.clamp(Number(settings.staminaRecoveryMultiplier) || 1, 0.2, 2);
    const targetSpeed = (crouching ? PLAYER.crouchSpeed : sprinting ? PLAYER.sprintSpeed : PLAYER.walkSpeed)
      * speedMultiplier;

    this._forward.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    this._right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    this._wish.copy(this._forward).multiplyScalar(forwardInput).addScaledVector(this._right, sideInput);
    if (this._wish.lengthSq() > 1) this._wish.normalize();

    if (sprinting && this._wish.lengthSq() > 0.1) {
      this.stamina = Math.max(0, this.stamina - dt * 0.12 * sprintCostMultiplier);
      this.staminaRecoveryDelay = Math.max(this.staminaRecoveryDelay, 0.24);
    } else if (this.staminaRecoveryDelay <= 0) {
      this.stamina = Math.min(1, this.stamina + dt * (this.grounded ? 0.18 : 0.09) * staminaRecoveryMultiplier);
    }

    const wasInWater = this.inWater;
    this.inWater = this._sampleLiquid();
    this.headUnderwater = this._sampleHeadLiquid();
    if (!wasInWater && this.inWater) this.onSplash?.();

    if (this.flying) {
      const vertical = (input.isDown('Space') ? 1 : 0) - (crouching ? 1 : 0);
      const target = this._wish.multiplyScalar(sprinting ? 11 : 7);
      target.y = vertical * 7;
      this.velocity.lerp(target, 1 - Math.exp(-dt * 10));
      this.position.addScaledVector(this.velocity, dt);
      this.grounded = false;
    } else {
      const response = this.grounded ? 14 : 4.2;
      this.velocity.x += (this._wish.x * targetSpeed - this.velocity.x) * Math.min(1, response * dt);
      this.velocity.z += (this._wish.z * targetSpeed - this.velocity.z) * Math.min(1, response * dt);

      const waterExit = this.inWater && input.isDown('Space')
        ? this._findWaterExit(this._wish)
        : null;
      if (this.inWater) {
        this.velocity.y += (input.isDown('Space') ? (waterExit ? 15 : 9) : -2) * dt;
        this.velocity.y *= Math.exp(-dt * (waterExit ? 1.7 : 3.5));
        this.velocity.x *= Math.exp(-dt * (waterExit ? 0.42 : 1.5));
        this.velocity.z *= Math.exp(-dt * (waterExit ? 0.42 : 1.5));
      } else {
        this.velocity.y = Math.max(-38, this.velocity.y - PLAYER.gravity * dt);
      }

      if (this.jumpBuffer > 0 && (this.coyote > 0 || this.inWater)) {
        this.velocity.y = this.inWater ? (waterExit ? 7.35 : 5.6) : PLAYER.jumpSpeed;
        this.grounded = false;
        this.coyote = 0;
        this.jumpBuffer = 0;
      }

      const horizontalBefore = new THREE.Vector2(this.position.x, this.position.z);
      this._moveWithCollisions(dt);
      if (waterExit) this._clamberWaterExit(waterExit);
      const moved = horizontalBefore.distanceTo(new THREE.Vector2(this.position.x, this.position.z));
      this.distanceMoved += moved;
      if (this.grounded && moved > 0.001) {
        const interval = sprinting ? 1.65 : crouching ? 3.4 : 2.35;
        this.stepTimer += moved;
        if (this.stepTimer >= interval) {
          this.stepTimer %= interval;
          const under = this.world.getBlock(Math.floor(this.position.x), Math.floor(this.position.y - 0.1), Math.floor(this.position.z));
          this.onStep?.(under, sprinting ? 1.1 : 0.8);
        }
      }
    }

    if (!this.wasGrounded && this.grounded) {
      this.landingKick = Math.min(0.11, this.landingImpact * 0.007);
      this.onLand?.(this.landingImpact);
    }
    this.wasGrounded = this.grounded;
    if (this.grounded && !this._collidesAt(this.position)) this._lastSafe.copy(this.position);
    if (this.position.y < -16 || !Number.isFinite(this.position.x + this.position.y + this.position.z)) {
      if (typeof this.onVoid === 'function') this.onVoid();
      else {
        this.position.copy(this._lastSafe).add(new THREE.Vector3(0, 2, 0));
        this.velocity.set(0, 0, 0);
        this.health = Math.max(0.2, this.health - 0.2);
        this.onDamage?.(0.2);
      }
    }

    const moving = this.grounded && this._wish.lengthSq() > 0.08;
    this.bobBlend += ((moving ? 1 : 0) - this.bobBlend) * Math.min(1, dt * 9);
    this.bobTime += dt * (sprinting ? 11.8 : crouching ? 5.2 : 8.2);
    this.landingKick *= Math.exp(-dt * 12);
    this._syncCamera(dt, sprinting, Number(settings.fov ?? 75), settings.reducedMotion);
    return {
      sprinting,
      crouching,
      moving: Math.min(1, this._wish.length()),
      inWater: this.inWater,
      headUnderwater: this.headUnderwater,
    };
  }

  _moveWithCollisions(dt) {
    const maxComponent = Math.max(Math.abs(this.velocity.x * dt), Math.abs(this.velocity.y * dt), Math.abs(this.velocity.z * dt));
    const steps = Math.max(1, Math.ceil(maxComponent / 0.22));
    const sx = this.velocity.x * dt / steps;
    const sy = this.velocity.y * dt / steps;
    const sz = this.velocity.z * dt / steps;
    this.landingImpact = 0;
    this.grounded = false;
    for (let i = 0; i < steps; i++) {
      this._moveAxis('x', sx);
      this._moveAxis('z', sz);
      this._moveAxis('y', sy);
    }
  }

  _moveAxis(axis, amount) {
    if (amount === 0) return;
    this.position[axis] += amount;
    const half = PLAYER.width / 2;
    const a = this.feetAABB;
    const minX = Math.floor(a.minX + EPSILON);
    const maxX = Math.floor(a.maxX - EPSILON);
    const minY = Math.floor(a.minY + EPSILON);
    const maxY = Math.floor(a.maxY - EPSILON);
    const minZ = Math.floor(a.minZ + EPSILON);
    const maxZ = Math.floor(a.maxZ - EPSILON);
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        for (let x = minX; x <= maxX; x++) {
          const id = this.world.getBlock(x, y, z);
          if (!intersectsBlockShape(a, x, y, z, id)) continue;
          if (axis === 'x') {
            this.position.x = amount > 0 ? x - half - EPSILON : x + 1 + half + EPSILON;
            this.velocity.x = 0;
          } else if (axis === 'z') {
            this.position.z = amount > 0 ? z - half - EPSILON : z + 1 + half + EPSILON;
            this.velocity.z = 0;
          } else {
            if (amount > 0) {
              this.position.y = y - PLAYER.height - EPSILON;
            } else {
              this.position.y = y + blockShapeHeight(id) + EPSILON;
              this.grounded = true;
              this.landingImpact = Math.max(this.landingImpact, -this.velocity.y);
            }
            this.velocity.y = 0;
          }
        }
      }
    }
  }

  _collidesAt(position) {
    const previous = this.position;
    this.position = position;
    const a = this.feetAABB;
    this.position = previous;
    for (let y = Math.floor(a.minY + EPSILON); y <= Math.floor(a.maxY - EPSILON); y++) {
      for (let z = Math.floor(a.minZ + EPSILON); z <= Math.floor(a.maxZ - EPSILON); z++) {
        for (let x = Math.floor(a.minX + EPSILON); x <= Math.floor(a.maxX - EPSILON); x++) {
          const id = this.world.getBlock(x, y, z);
          if (intersectsBlockShape(a, x, y, z, id)) return true;
        }
      }
    }
    return false;
  }

  _sampleLiquid() {
    const x = Math.floor(this.position.x);
    const z = Math.floor(this.position.z);
    const sampleY = this.position.y + 0.65;
    const blockY = Math.floor(sampleY);
    const surface = this.world.getFluidSurfaceY?.(x, blockY, z);
    return surface == null
      ? isLiquid(this.world.getBlock(x, blockY, z))
      : sampleY < surface;
  }

  _sampleHeadLiquid() {
    const x = Math.floor(this.position.x);
    const z = Math.floor(this.position.z);
    const sampleY = this.position.y + PLAYER.eye + 0.08;
    const blockY = Math.floor(sampleY);
    const surface = this.world.getFluidSurfaceY?.(x, blockY, z);
    return surface == null
      ? isLiquid(this.world.getBlock(x, blockY, z))
      : sampleY < surface;
  }

  _findWaterExit(direction) {
    if (!direction || direction.lengthSq() < 0.04) return null;
    const forward = direction.clone().normalize();
    const probeDistance = PLAYER.width * 0.5 + 0.38;
    const blockX = Math.floor(this.position.x + forward.x * probeDistance);
    const blockZ = Math.floor(this.position.z + forward.z * probeDistance);
    const minY = Math.floor(this.position.y - 0.08);
    const maxY = Math.floor(this.position.y + 1.12);

    for (let y = maxY; y >= minY; y--) {
      if (!isSolid(this.world.getBlock(blockX, y, blockZ))) continue;
      const top = y + blockShapeHeight(this.world.getBlock(blockX, y, blockZ)) + EPSILON;
      const rise = top - this.position.y;
      if (rise < -0.15 || rise > 1.22) continue;
      const target = this.position.clone();
      target.x += forward.x * (PLAYER.width * 0.5 + 0.47);
      target.z += forward.z * (PLAYER.width * 0.5 + 0.47);
      target.y = top;
      if (this._collidesAt(target)) continue;
      return { target, top, forward };
    }
    return null;
  }

  _clamberWaterExit(exit) {
    // The stronger swim impulse does most of the visible motion. Once the
    // player's feet reach the lip, this short final mantle prevents the side
    // collision from zeroing forward speed and trapping them against the ledge.
    if (!exit || this.position.y < exit.top - 0.64) return false;
    const target = exit.target.clone();
    target.x = this.position.x + exit.forward.x * 0.34;
    target.z = this.position.z + exit.forward.z * 0.34;
    if (this._collidesAt(target)) return false;
    this.position.copy(target);
    this.velocity.x = exit.forward.x * Math.max(2.4, Math.abs(this.velocity.x));
    this.velocity.z = exit.forward.z * Math.max(2.4, Math.abs(this.velocity.z));
    this.velocity.y = Math.max(this.velocity.y, 2.4);
    this.inWater = false;
    return true;
  }

  _syncCamera(dt, sprinting, baseFov, reducedMotion = false) {
    const bobScale = reducedMotion ? 0 : this.bobBlend;
    const bobX = Math.sin(this.bobTime * 0.5) * 0.025 * bobScale;
    const bobY = Math.abs(Math.cos(this.bobTime)) * 0.038 * bobScale - this.landingKick * (reducedMotion ? 0 : 1);
    this.camera.position.set(this.position.x + bobX, this.position.y + PLAYER.eye + bobY, this.position.z);
    this._lookEuler.set(this.pitch, this.yaw, 0, 'YXZ');
    this.camera.quaternion.setFromEuler(this._lookEuler);
    const desiredFov = baseFov + (sprinting && !reducedMotion ? 6 : 0);
    this.camera.fov += (desiredFov - this.camera.fov) * Math.min(1, dt * 8 || 1);
    this.camera.updateProjectionMatrix();
  }

  getEyePosition(target = new THREE.Vector3()) {
    return target.set(this.position.x, this.position.y + PLAYER.eye, this.position.z);
  }

  getLookDirection(target = new THREE.Vector3()) {
    return this.camera.getWorldDirection(target).normalize();
  }

  raycast(maxDistance = PLAYER.reach) {
    const origin = this.getEyePosition(new THREE.Vector3());
    const direction = this.getLookDirection(new THREE.Vector3());
    return raycastVoxels(origin, direction, maxDistance, this.world);
  }

  getState() {
    return {
      position: this.position.toArray(),
      velocity: this.velocity.toArray(),
      yaw: this.yaw,
      pitch: this.pitch,
      health: this.health,
      stamina: this.stamina,
      flying: this.flying,
    };
  }

  loadState(state) {
    if (!state) return;
    if (Array.isArray(state.position) && state.position.every(Number.isFinite)) this.position.fromArray(state.position);
    if (Array.isArray(state.velocity) && state.velocity.every(Number.isFinite)) {
      this.velocity.fromArray(state.velocity).clampScalar(-40, 40);
    }
    this.yaw = Number.isFinite(state.yaw) ? state.yaw % (Math.PI * 2) : 0;
    this.pitch = Number.isFinite(state.pitch)
      ? THREE.MathUtils.clamp(state.pitch, -Math.PI * 0.495, Math.PI * 0.495)
      : 0;
    this.health = Number.isFinite(state.health) ? THREE.MathUtils.clamp(state.health, 0, 1) : 1;
    this.stamina = Number.isFinite(state.stamina) ? THREE.MathUtils.clamp(state.stamina, 0, 1) : 1;
    this.flying = Boolean(state.flying);
    this.staminaRecoveryDelay = 0;
    this.wasGrounded = false;
    this.landingImpact = 0;
    this._lastSafe.copy(this.position);
    this._syncCamera(0, false, this.camera.fov || 75);
  }
}

export function raycastVoxels(origin, direction, maxDistance, world) {
  let x = Math.floor(origin.x);
  let y = Math.floor(origin.y);
  let z = Math.floor(origin.z);
  const stepX = direction.x >= 0 ? 1 : -1;
  const stepY = direction.y >= 0 ? 1 : -1;
  const stepZ = direction.z >= 0 ? 1 : -1;
  const deltaX = direction.x === 0 ? Infinity : Math.abs(1 / direction.x);
  const deltaY = direction.y === 0 ? Infinity : Math.abs(1 / direction.y);
  const deltaZ = direction.z === 0 ? Infinity : Math.abs(1 / direction.z);
  let maxX = direction.x === 0 ? Infinity : ((stepX > 0 ? x + 1 - origin.x : origin.x - x) * deltaX);
  let maxY = direction.y === 0 ? Infinity : ((stepY > 0 ? y + 1 - origin.y : origin.y - y) * deltaY);
  let maxZ = direction.z === 0 ? Infinity : ((stepZ > 0 ? z + 1 - origin.z : origin.z - z) * deltaZ);
  let distance = 0;
  let previous = { x, y, z };
  let normal = { x: 0, y: 0, z: 0 };

  for (let iteration = 0; iteration < 256 && distance <= maxDistance; iteration++) {
    const block = world.getBlock(x, y, z);
    const def = BLOCKS[block];
    // Liquids are intentionally transparent to the interaction ray. Worldloom
    // has no bucket interaction, so selecting the cell containing the camera
    // would otherwise make mining from underwater impossible and shallow water
    // would behave like an invisible full-height wall.
    if (block && def && def.selectable !== false && !def.liquid
      && rayIntersectsShape(origin, direction, maxDistance, x, y, z, block)) {
      return {
        block: { x, y, z, id: block },
        adjacent: { ...previous },
        normal: { ...normal },
        distance,
      };
    }
    previous = { x, y, z };
    if (maxX <= maxY && maxX <= maxZ) {
      x += stepX;
      distance = maxX;
      maxX += deltaX;
      normal = { x: -stepX, y: 0, z: 0 };
    } else if (maxY <= maxZ) {
      y += stepY;
      distance = maxY;
      maxY += deltaY;
      normal = { x: 0, y: -stepY, z: 0 };
    } else {
      z += stepZ;
      distance = maxZ;
      maxZ += deltaZ;
      normal = { x: 0, y: 0, z: -stepZ };
    }
  }
  return null;
}

function rayIntersectsShape(origin, direction, maxDistance, x, y, z, blockId) {
  const bounds = [
    [origin.x, direction.x, x, x + 1],
    [origin.y, direction.y, y, y + blockShapeHeight(blockId)],
    [origin.z, direction.z, z, z + 1],
  ];
  let entry = 0;
  let exit = maxDistance;
  for (const [point, velocity, min, max] of bounds) {
    if (Math.abs(velocity) < 1e-9) {
      if (point < min || point > max) return false;
      continue;
    }
    const first = (min - point) / velocity;
    const second = (max - point) / velocity;
    entry = Math.max(entry, Math.min(first, second));
    exit = Math.min(exit, Math.max(first, second));
    if (exit + EPSILON < entry) return false;
  }
  return exit >= 0 && entry <= maxDistance;
}
