import * as THREE from '../vendor/three.module.min.js';
import { BLOCK, BLOCKS, isSolid, isLiquid, blockShapeHeight } from './blocks.js';

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
const FOREST_FLOOR_COLLISION_QUERY_RADIUS = 3.25;
const FOREST_FLOOR_STEP_HEIGHT = 0.62;
const MAX_CONTINUOUS_POINTER_STEP = 240;
const MAX_STORED_YAW = Math.PI * 4096;

export function continuousPointerDelta(
  movement,
  currentScreenPosition = null,
  previousScreenPosition = null,
  viewportSpan = 0,
) {
  const delta = Number(movement);
  if (!Number.isFinite(delta) || delta === 0) return 0;

  const current = Number(currentScreenPosition);
  const previous = Number(previousScreenPosition);
  const span = Math.max(0, Number(viewportSpan) || 0);
  if (Number.isFinite(current) && Number.isFinite(previous) && span > 0) {
    const screenDelta = current - previous;
    const recenterThreshold = Math.max(MAX_CONTINUOUS_POINTER_STEP, span * 0.28);
    const movementMagnitude = Math.abs(delta);
    const screenMagnitude = Math.abs(screenDelta);
    const scaleRatio = screenMagnitude > 0 ? movementMagnitude / screenMagnitude : 0;
    // Some Windows/browser combinations expose the hidden cursor's jump from
    // a monitor edge back toward its lock anchor as movementX/Y. It is a single
    // screen-scale event, often adjusted by devicePixelRatio, rather than mouse
    // travel. Discard only that recognisable recenter signature.
    if (movementMagnitude >= recenterThreshold
      && screenMagnitude >= recenterThreshold
      && Math.sign(delta) === Math.sign(screenDelta)
      && scaleRatio >= 0.35
      && scaleRatio <= 2.85) return 0;
  }

  // Genuine fast turns arrive as many ordinary events. A single event above
  // this generous high-DPI ceiling is not observable physical travel and must
  // be discarded, not clamped into a still-visible camera jump.
  if (Math.abs(delta) > MAX_CONTINUOUS_POINTER_STEP) return 0;
  return delta;
}

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

export function intersectsPlayerCollider(aabb, collider) {
  if (!aabb || !collider) return false;
  const centerX = Number(collider.x);
  const centerZ = Number(collider.z);
  const minY = Number(collider.minY);
  const maxY = Number(collider.maxY);
  const halfX = Math.max(0, Number(collider.halfX) || 0);
  const halfZ = Math.max(0, Number(collider.halfZ) || 0);
  if (![centerX, centerZ, minY, maxY].every(Number.isFinite)
    || halfX <= 0 || halfZ <= 0 || maxY <= minY) return false;
  if (aabb.maxY <= minY + EPSILON || aabb.minY >= maxY - EPSILON) return false;

  const playerCenterX = (aabb.minX + aabb.maxX) * 0.5;
  const playerCenterZ = (aabb.minZ + aabb.maxZ) * 0.5;
  const playerHalfX = (aabb.maxX - aabb.minX) * 0.5;
  const playerHalfZ = (aabb.maxZ - aabb.minZ) * 0.5;
  const deltaX = centerX - playerCenterX;
  const deltaZ = centerZ - playerCenterZ;
  const yaw = Number(collider.yaw) || 0;
  const cosine = Math.cos(yaw);
  const sine = Math.sin(yaw);
  const absCosine = Math.abs(cosine);
  const absSine = Math.abs(sine);

  // Four-axis separating-axis test between the player's world-aligned box and
  // the prop's yaw-rotated voxel core. Unlike a projected AABB, this preserves
  // free space around diagonal logs instead of adding invisible corner walls.
  if (Math.abs(deltaX) >= playerHalfX + halfX * absCosine + halfZ * absSine - EPSILON) return false;
  if (Math.abs(deltaZ) >= playerHalfZ + halfX * absSine + halfZ * absCosine - EPSILON) return false;
  const localDeltaX = deltaX * cosine - deltaZ * sine;
  const localDeltaZ = deltaX * sine + deltaZ * cosine;
  if (Math.abs(localDeltaX) >= halfX + playerHalfX * absCosine + playerHalfZ * absSine - EPSILON) return false;
  if (Math.abs(localDeltaZ) >= halfZ + playerHalfX * absSine + playerHalfZ * absCosine - EPSILON) return false;
  return true;
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
    this._lastScreenX = null;
    this._lastScreenY = null;
    this._pointerLockJustAcquired = false;

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
      const dx = Number(event.movementX) || 0;
      const dy = Number(event.movementY) || 0;
      const screenX = Number.isFinite(Number(event.screenX)) ? Number(event.screenX) : null;
      const screenY = Number.isFinite(Number(event.screenY)) ? Number(event.screenY) : null;
      const previousScreenX = this._lastScreenX;
      const previousScreenY = this._lastScreenY;
      this._lastScreenX = screenX;
      this._lastScreenY = screenY;
      if (!this.locked || !this.enabled) return;
      const firstLockedMovement = this._pointerLockJustAcquired;
      this._pointerLockJustAcquired = false;
      // Pointer-lock acquisition itself can recenter the hidden cursor before
      // a previous locked coordinate exists. Keep a normal first movement, but
      // never turn a large synthetic acquisition event into camera rotation.
      if (firstLockedMovement
        && (Math.abs(dx) > MAX_CONTINUOUS_POINTER_STEP
          || Math.abs(dy) > MAX_CONTINUOUS_POINTER_STEP)) return;
      const viewportWidth = Math.max(
        Number(window.innerWidth) || 0,
        Number(window.screen?.width) || 0,
        Number(this.canvas?.clientWidth) || 0,
      );
      const viewportHeight = Math.max(
        Number(window.innerHeight) || 0,
        Number(window.screen?.height) || 0,
        Number(this.canvas?.clientHeight) || 0,
      );
      this.mouseDX += continuousPointerDelta(dx, screenX, previousScreenX, viewportWidth);
      this.mouseDY += continuousPointerDelta(dy, screenY, previousScreenY, viewportHeight);
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
      const wasLocked = this.locked;
      this.locked = document.pointerLockElement === canvas;
      if (this.locked && !wasLocked) this._pointerLockJustAcquired = true;
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
    this.headlampOn = true;
    this._lastJumpTap = -Infinity;
    this._time = 0;
    this._wish = new THREE.Vector3();
    this._forward = new THREE.Vector3();
    this._right = new THREE.Vector3();
    this._lookEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    this._lastSafe = this.position.clone();
    this._activeExtraColliders = null;
    this._startedInsideExtraColliders = [];
    this._stepSupportAvailable = false;
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
    return this._feetAABBAt(this.position);
  }

  _feetAABBAt(position) {
    const half = PLAYER.width / 2;
    return {
      minX: position.x - half,
      maxX: position.x + half,
      minY: position.y,
      maxY: position.y + PLAYER.height,
      minZ: position.z - half,
      maxZ: position.z + half,
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
    // Yaw intentionally remains unwrapped. Sine, cosine and quaternions are
    // periodic already; changing the stored angle at a boundary creates a raw
    // discontinuity for saves, avatars and any future interpolation consumer.

    if (input.isDown('Space')) this.jumpBuffer = 0.12;
    else this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
    this.coyote = this.grounded ? 0.1 : Math.max(0, this.coyote - dt);

    const forwardInput = (input.isDown('KeyW') ? 1 : 0) - (input.isDown('KeyS') ? 1 : 0);
    const sideInput = (input.isDown('KeyD') ? 1 : 0) - (input.isDown('KeyA') ? 1 : 0);
    const crouching = input.isDown('ControlLeft', 'ControlRight');
    const wantsSprint = input.isDown('ShiftLeft', 'ShiftRight') && forwardInput > 0 && !crouching;
    const sprinting = wantsSprint && settings.canSprint !== false && this.stamina > 0.025 && !this.inWater;
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
    this.inWater = this._sampleLiquid() || this._waterContactSurface() !== null;
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

    // Collision substeps can enter water during this frame. Publish that
    // contact immediately so splash effects and underwater state don't lag.
    const enteredDuringMove = !this.inWater;
    this.inWater = this._sampleLiquid() || this._waterContactSurface() !== null;
    this.headUnderwater = this._sampleHeadLiquid();
    if (enteredDuringMove && this.inWater) this.onSplash?.();

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
    const stepDt = dt / steps;
    this.landingImpact = 0;
    this._stepSupportAvailable = this.grounded || this.wasGrounded || this.coyote > 0;
    this.grounded = false;
    this._activeExtraColliders = this._queryExtraColliders(this.position);
    try {
      for (let i = 0; i < steps; i++) {
        this._moveAxis('x', this.velocity.x * stepDt);
        this._moveAxis('z', this.velocity.z * stepDt);
        const surface = this.velocity.y < 0
          ? this._waterContactSurface(this.position.y + this.velocity.y * stepDt)
          : null;
        if (surface !== null) {
          // Sweep the feet through the actual fluid surface, including thin
          // flowing water. Cancel the falling momentum before floor collision,
          // then use the new swimming velocity for every remaining substep.
          if (this.position.y > surface) this._moveAxis('y', surface - this.position.y);
          this.velocity.y = Math.max(-2.4, this.velocity.y);
          this.landingImpact = 0;
        }
        this._moveAxis('y', this.velocity.y * stepDt);
      }
    } finally {
      this._activeExtraColliders = null;
      this._stepSupportAvailable = false;
    }
  }

  _moveAxis(axis, amount) {
    if (amount === 0) return;
    const previousAxis = this.position[axis];
    const colliders = this._activeExtraColliders || this._queryExtraColliders(this.position);
    const beforeAabb = this.feetAABB;
    const startedInside = this._startedInsideExtraColliders;
    startedInside.length = 0;
    for (const collider of colliders) {
      if (intersectsPlayerCollider(beforeAabb, collider)) startedInside.push(collider);
    }
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

    for (const collider of colliders) {
      if (startedInside.includes(collider) || !intersectsPlayerCollider(this.feetAABB, collider)) continue;
      if (axis === 'x' || axis === 'z') {
        if (this._tryStepOntoExtraCollider(collider, colliders)) continue;
        this.position[axis] = previousAxis;
        this.velocity[axis] = 0;
      } else if (amount > 0) {
        this.position.y = collider.minY - PLAYER.height - EPSILON;
        this.velocity.y = 0;
      } else {
        this.position.y = collider.maxY + EPSILON;
        this.grounded = true;
        this.landingImpact = Math.max(this.landingImpact, -this.velocity.y);
        this.velocity.y = 0;
      }
      break;
    }
  }

  _tryStepOntoExtraCollider(collider, colliders) {
    const rise = collider.maxY - this.position.y;
    if (collider.stepable !== true
      || (!this._stepSupportAvailable && !this.grounded)
      || this.velocity.y > 0.5
      || rise < -EPSILON
      || rise > FOREST_FLOOR_STEP_HEIGHT + EPSILON) return false;
    const candidate = this.position.clone();
    candidate.y = collider.maxY + EPSILON;
    if (this._collidesAt(candidate, colliders)) return false;
    this.position.y = candidate.y;
    this.velocity.y = Math.max(0, this.velocity.y);
    this.grounded = true;
    this._stepSupportAvailable = true;
    return true;
  }

  _queryExtraColliders(position) {
    const query = this.world?.getForestFloorCollidersNear;
    if (typeof query !== 'function' || !position) return [];
    const colliders = query.call(
      this.world,
      position.x,
      position.z,
      FOREST_FLOOR_COLLISION_QUERY_RADIUS,
    );
    return Array.isArray(colliders) ? colliders : [];
  }

  _collidesAt(position, extraColliders = null) {
    const a = this._feetAABBAt(position);
    for (let y = Math.floor(a.minY + EPSILON); y <= Math.floor(a.maxY - EPSILON); y++) {
      for (let z = Math.floor(a.minZ + EPSILON); z <= Math.floor(a.maxZ - EPSILON); z++) {
        for (let x = Math.floor(a.minX + EPSILON); x <= Math.floor(a.maxX - EPSILON); x++) {
          const id = this.world.getBlock(x, y, z);
          if (intersectsBlockShape(a, x, y, z, id)) return true;
        }
      }
    }
    const colliders = extraColliders || this._activeExtraColliders || this._queryExtraColliders(position);
    if (colliders.some((collider) => intersectsPlayerCollider(a, collider))) return true;
    return false;
  }

  _waterContactSurface(nextY = this.position.y) {
    const a = this.feetAABB;
    const low = Math.min(this.position.y, nextY);
    const high = Math.max(this.position.y, nextY) + 0.06;
    let contact = null;
    for (let y = Math.floor(high); y >= Math.floor(low); y--) {
      for (let z = Math.floor(a.minZ + EPSILON); z <= Math.floor(a.maxZ - EPSILON); z++) {
        for (let x = Math.floor(a.minX + EPSILON); x <= Math.floor(a.maxX - EPSILON); x++) {
          if (this.world.getBlock(x, y, z) !== BLOCK.WATER) continue;
          const surface = this.world.getFluidSurfaceY?.(x, y, z) ?? y + 0.92;
          if (low < surface && high > y) contact = Math.max(contact ?? -Infinity, surface);
        }
      }
    }
    return contact;
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
      headlampOn: this.headlampOn,
    };
  }

  loadState(state) {
    if (!state) return;
    if (Array.isArray(state.position) && state.position.every(Number.isFinite)) this.position.fromArray(state.position);
    if (Array.isArray(state.velocity) && state.velocity.every(Number.isFinite)) {
      this.velocity.fromArray(state.velocity).clampScalar(-40, 40);
    }
    this.yaw = Number.isFinite(state.yaw)
      ? (Math.abs(state.yaw) <= MAX_STORED_YAW ? state.yaw : state.yaw % (Math.PI * 2))
      : 0;
    this.pitch = Number.isFinite(state.pitch)
      ? THREE.MathUtils.clamp(state.pitch, -Math.PI * 0.495, Math.PI * 0.495)
      : 0;
    this.health = Number.isFinite(state.health) ? THREE.MathUtils.clamp(state.health, 0, 1) : 1;
    this.stamina = Number.isFinite(state.stamina) ? THREE.MathUtils.clamp(state.stamina, 0, 1) : 1;
    this.flying = Boolean(state.flying);
    this.headlampOn = state.headlampOn !== false;
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
