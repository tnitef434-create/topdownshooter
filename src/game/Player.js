import { CharacterRenderer } from './CharacterRenderer.js';

// ─── Rank System ──────────────────────────────────────────────────────────────
export const RANKS = [
  { id: 'recruit', label: 'RECRUIT',  minRP: 0,    maxRP: 999,  color: '#8a9bb5', icon: '▪' },
  { id: 'veteran', label: 'VETERAN',  minRP: 1000, maxRP: 3999, color: '#e8c84a', icon: '◆' },
  { id: 'elite',   label: 'ELITE',    minRP: 4000, maxRP: Infinity, color: '#ff6ef7', icon: '★' }
];
export const RP_WIN  =  80;   // RP gained on match win
export const RP_LOSS = -40;   // RP lost on match loss (negative)
// ─────────────────────────────────────────────────────────────────────────────

const WEAPON_DEFS = {
  pistol:  { name: 'Tactical 9mm',          damage: 22, fireRate: 300,  accuracy: 0.95, magSize: 12,  range: 400,  reloadTime: 1200, speedMultiplier: 1.0,  type: 'Semi-Auto',   recoil: 3,    bulletSpeed: 14 },
  rifle:   { name: 'Assault Rifle (M4A1)',   damage: 26, fireRate: 110,  accuracy: 0.88, magSize: 30,  range: 600,  reloadTime: 2200, speedMultiplier: 1.0,  type: 'Automatic',   recoil: 4.5,  bulletSpeed: 16 },
  shotgun: { name: 'Shotgun (Remington 870)',damage: 14, fireRate: 850,  accuracy: 0.65, magSize: 6,   range: 250,  reloadTime: 2800, speedMultiplier: 1.0,  type: 'Pump-Action', pellets: 7, recoil: 12,   bulletSpeed: 12 },
  sniper:  { name: 'Sniper Rifle (AWM)',     damage: 95, fireRate: 1500, accuracy: 0.99, magSize: 5,   range: 1200, reloadTime: 2800, speedMultiplier: 1.0,  type: 'Bolt-Action', recoil: 18,   bulletSpeed: 24 },
  smg:     { name: 'SMG (MP5)',              damage: 18, fireRate: 75,   accuracy: 0.82, magSize: 30,  range: 350,  reloadTime: 1500, speedMultiplier: 1.0,  type: 'Automatic',   recoil: 2.2,  bulletSpeed: 13 },
  lmg:     { name: 'LMG (M249)',             damage: 25, fireRate: 85,   accuracy: 0.75, magSize: 100, range: 550,  reloadTime: 4500, speedMultiplier: 1.0,  type: 'Automatic',   recoil: 6.0,  bulletSpeed: 15 },
  dmr:     { name: 'DMR (M14 EBR)',          damage: 45, fireRate: 400,  accuracy: 0.94, magSize: 20,  range: 800,  reloadTime: 2400, speedMultiplier: 1.0,  type: 'Semi-Auto',   recoil: 8.5,  bulletSpeed: 20 },
  knife:   { name: 'Tactical Knife',         damage: 55, fireRate: 350,  accuracy: 1.0,  magSize: 1,   range: 60,   reloadTime: 0,    speedMultiplier: 1.15, type: 'Melee',       recoil: 0,    bulletSpeed: 20 },
  // ─── Rank-Locked Weapons ───────────────────────────────────────────────────
  vector:  { name: 'Vector SMG',             damage: 14, fireRate: 48,   accuracy: 0.87, magSize: 33,  range: 320,  reloadTime: 1100, speedMultiplier: 1.02, type: 'Automatic',   recoil: 1.8,  bulletSpeed: 14 },
  famas:   { name: 'FAMAS Burst Carbine',    damage: 20, fireRate: 450,  accuracy: 0.93, magSize: 25,  range: 550,  reloadTime: 1800, speedMultiplier: 1.0,  type: 'Automatic',   pellets: 3, recoil: 3.5,  bulletSpeed: 17 },
  plasma:  { name: 'Plasma Rifle PL-45',     damage: 32, fireRate: 150,  accuracy: 0.92, magSize: 20,  range: 600,  reloadTime: 2000, speedMultiplier: 1.0,  type: 'Automatic',   recoil: 2.0,  bulletSpeed: 10 },
  railgun: { name: 'Railgun RG-X',           damage: 85, fireRate: 1400, accuracy: 0.99, magSize: 5,   range: 1200, reloadTime: 3500, speedMultiplier: 0.95, type: 'Automatic',   recoil: 22,   bulletSpeed: 32 }
};

const COLOR_THEMES = {
  cyan: { body: '#3ba39f', armor: '#16202c', helmet: '#66fcf1' },
  green: { body: '#39db14', armor: '#133d07', helmet: '#5eff39' },
  purple: { body: '#9d3bff', armor: '#20083c', helmet: '#c47aff' },
  orange: { body: '#ff7f3b', armor: '#3f1b07', helmet: '#ff9d7a' },
  yellow: { body: '#ffd700', armor: '#3a3000', helmet: '#ffea70' },
  red: { body: '#ff3c3c', armor: '#3a0707', helmet: '#ff7a7a' }
};

export class Player {
  constructor(id, x, y, name, weaponKey, colorThemeKey, isLocal = false, isBot = false) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 18;
    this.angle = 0;
    this.name = name;
    
    this.isLocal = isLocal;
    this.isBot = isBot;
    this.colorTheme = colorThemeKey || (isLocal ? 'cyan' : 'red');
    this.isTeammate = false;
    
    // Health & Combat stats
    this.health = 100;
    this.maxHealth = 100;
    this.score = 0;

    // Rank system
    this.rp   = isLocal ? (parseInt(localStorage.getItem('tacticstrike_rp') || '0')) : 0;
    this.rank = this._calcRank(this.rp);

    this.weaponKey = weaponKey;
    this.weapon = { ...WEAPON_DEFS[weaponKey] };
    
    // Inventory slots
    this.primaryWeaponKey = weaponKey;
    this.activeSlot = 1; // 1 = Primary, 2 = Knife
    this.primaryAmmoInMag = this.weapon.magSize;
    this.primaryReserveAmmo = this.weapon.magSize * 3;
    
    // Ammunition
    this.ammoInMag = this.weapon.magSize;
    this.reserveAmmo = this.weapon.magSize * 3; // 3 extra magazines
    this.maxReserveAmmo = this.weapon.magSize * 5;
    
    // Status Flags
    this.isReloading = false;
    this.reloadStartTime = 0;
    this.lastFiredTime = 0;
    
    // Movement configuration
    this.accel = 0.30;      // was 0.20 — snappier acceleration
    this.maxSpeed = 3.4;    // was 2.2 — noticeably faster default
    this.friction = 0.84;
    
    // Visual indicators
    this.muzzleFlash = 0; // opacity timer
    this.footstepTimer = 0;
    this.currentSpeed = 0; // tracked for walk animation
    this.flashGrenades = 1;
    this.flashAlpha = 0;
    this.throwFlashbangRequest = false;
    
    // AI Bot State (if isBot)
    this.botTargetX = x;
    this.botTargetY = y;
    this.botState = 'patrol'; // patrol, chase, search
    this.lastKnownPlayerPos = null;
    this.botReactTime = 0;
    this.botLastDecisionTime = 0;
    this.botShootDelay = 0;

    // Flashlight & strafing
    this.flashlightActive = true;
    this.botStrafeDir = Math.random() > 0.5 ? 1 : -1;
    this.botLastStrafeToggle = 0;

    // Dash trail effects & sync
    this.dashTrails = [];
    this.networkJustDashed = false;
  }

  // ─── Rank helpers ────────────────────────────────────────────────────────────
  _calcRank(rp) {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (rp >= RANKS[i].minRP) return RANKS[i];
    }
    return RANKS[0];
  }

  /** Call after win (delta=RP_WIN) or loss (delta=RP_LOSS). Persists for local player. */
  applyRankDelta(delta) {
    this.rp = Math.max(0, this.rp + delta);
    const newRank = this._calcRank(this.rp);
    const rankChanged = newRank.id !== this.rank.id;
    this.rank = newRank;
    if (this.isLocal) {
      try { localStorage.setItem('tacticstrike_rp', String(this.rp)); } catch(e) {}
    }
    return rankChanged;
  }
  // ─────────────────────────────────────────────────────────────────────────────

  changeWeapon(weaponKey) {
    this.weaponKey = weaponKey;
    this.weapon = { ...WEAPON_DEFS[weaponKey] };
    this.ammoInMag = this.weapon.magSize;
    this.reserveAmmo = this.weapon.magSize * 3;
    this.isReloading = false;
    
    if (weaponKey !== 'knife') {
      this.primaryWeaponKey = weaponKey;
      this.primaryAmmoInMag = this.ammoInMag;
      this.primaryReserveAmmo = this.reserveAmmo;
    }
  }

  switchSlot(slot) {
    if (slot === this.activeSlot) return;
    
    // Save current slot ammo state if switching from primary
    if (this.activeSlot === 1) {
      this.primaryAmmoInMag = this.ammoInMag;
      this.primaryReserveAmmo = this.reserveAmmo;
    }
    
    this.activeSlot = slot;
    
    if (slot === 1) {
      this.changeWeapon(this.primaryWeaponKey);
      this.ammoInMag = this.primaryAmmoInMag;
      this.reserveAmmo = this.primaryReserveAmmo;
    } else if (slot === 2) {
      this.changeWeapon('knife');
      this.ammoInMag = 1;
      this.reserveAmmo = Infinity;
    }
    
    if (this.isLocal && !this.isBot) {
      this.updateHUD();
      if (window.AppSocket) {
        window.AppSocket.emit('select-weapon', { weapon: this.weaponKey });
      }
    }
  }

  update(keys, mouse, map, soundEngine, currentTime, botTargetPlayer = null, localPlayerRef = null) {
    if (this.health <= 0) return;

    const isSabotage = window.gameEngine && window.gameEngine.matchMode === 'sabotage';
    const sabotageClampedDt = Math.max(1, Math.min(150, currentTime - (this.lastUpdateTime || currentTime)));
    
    if (isSabotage) {
      if (this.team === 1) {
        this.flashlightActive = false;
        this.weaponKey = 'none';
        if (this.isLocal && this.inVent) {
          this.vx = 0;
          this.vy = 0;
          this.lastUpdateTime = currentTime;
          this.health = Math.min(this.health, this.maxHealth);
          this.flashAlpha = Math.max(0, this.flashAlpha - sabotageClampedDt * 0.0005);
          return;
        }
      } else {
        this.flashlightActive = true;
      }
    }

    if (!this.lastUpdateTime) {
      this.lastUpdateTime = currentTime;
    }
    const dt = currentTime - this.lastUpdateTime;
    this.lastUpdateTime = currentTime;

    const now = Date.now();
    this.adrenalineActive = !!(this.adrenalineEndTime && (now < this.adrenalineEndTime));
    this.overdriveActive = !!(this.overdriveEndTime && (now < this.overdriveEndTime));
    this.updateBuffsHUD(now);

    // Normalize to 60 FPS (16.67 ms)
    // Avoid division by zero, cap dt between 1ms and 150ms to prevent huge jumps/warps
    const clampedDt = Math.max(1, Math.min(150, dt));
    const dtFactor = clampedDt / 16.67;

    // Check for ranked speed boost
    const isRanked = window.gameEngine && window.gameEngine.isRanked;
    const modeSpeedMult = isRanked ? 1.25 : 1.0;

    // --- 1. Movement logic ---
    if (this.isLocal && !this.isBot) {
      this.handleLocalInput(keys, mouse, soundEngine, currentTime, dtFactor);
      this.updateDashHUD(currentTime);

      // Hidden Dev Cheat: Aimbot and God Mode Health
      const cheatActive = window.gameEngine && window.gameEngine.devCheatActive;
      this.maxHealth = cheatActive ? 200 : 100;
      if (cheatActive) {
        if (this.health > 200) this.health = 200;
        
        // Find nearest living opponent/bot
        const opposingTeam = this.team === 1 ? 2 : 1;
        const targets = window.gameEngine.players.filter(p => p !== this && p.health > 0 && p.team === opposingTeam);
        if (targets.length > 0) {
          targets.sort((a, b) => Math.hypot(this.x - a.x, this.y - a.y) - Math.hypot(this.x - b.x, this.y - b.y));
          const target = targets[0];
          this.angle = Math.atan2(target.y - this.y, target.x - this.x);
        }
      } else {
        if (this.health > 100) this.health = 100;
      }
    } else if (this.isBot && botTargetPlayer) {
      this.handleBotAI(map, soundEngine, currentTime, botTargetPlayer, localPlayerRef, dtFactor);
    }

    // Apply speed multiplier based on carrying weapon weight and sprint speed mult
    const isSprinting = this.isLocal && keys && keys['shift'];
    const adrenalineSpeedMult = this.adrenalineActive ? 1.35 : 1.0;
    const speedMod = this.weapon.speedMultiplier * (isSprinting ? 1.75 : 1.0) * modeSpeedMult * adrenalineSpeedMult;
    let currentMaxSpeed = this.maxSpeed * speedMod;

    // Check if player is currently in a dash (lasts for 200ms)
    const dashDuration = 200;
    const isDashing = this.lastDashTime && (currentTime - this.lastDashTime) < dashDuration;
    if (isDashing) {
      currentMaxSpeed = 22;
      // Record trail position every 25ms
      if (!this.lastTrailSpawnTime || (currentTime - this.lastTrailSpawnTime) > 25) {
        if (!this.dashTrails) this.dashTrails = [];
        this.dashTrails.push({ x: this.x, y: this.y, angle: this.angle, time: currentTime });
        this.lastTrailSpawnTime = currentTime;
      }
    }

    // Clean up old dash trails
    if (this.dashTrails && this.dashTrails.length > 0) {
      this.dashTrails = this.dashTrails.filter(t => (currentTime - t.time) < 180);
    }

    // Apply physics friction normalized to delta time
    this.vx *= Math.pow(this.friction, dtFactor);
    this.vy *= Math.pow(this.friction, dtFactor);

    // Clamp speed
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > currentMaxSpeed) {
      this.vx = (this.vx / speed) * currentMaxSpeed;
      this.vy = (this.vy / speed) * currentMaxSpeed;
    }
    this.currentSpeed = speed; // track for walk animation

    // Collision detection against map walls & sliding response using delta time
    const nextX = this.x + this.vx * dtFactor;
    const nextY = this.y + this.vy * dtFactor;
    
    const collisionResponse = map.checkCircleCollision(nextX, nextY, this.radius);
    this.x = collisionResponse.x;
    this.y = collisionResponse.y;

    // Footstep Sound triggers
    if (Math.abs(this.vx) > 0.5 || Math.abs(this.vy) > 0.5) {
      this.footstepTimer += speed;
      if (this.footstepTimer > 120) {
        this.footstepTimer = 0;
        if (soundEngine) {
          // Play footstep sound (only if within close range of local player, or if it is local player)
          const distToLocal = localPlayerRef 
            ? Math.hypot(this.x - localPlayerRef.x, this.y - localPlayerRef.y) 
            : 0;
          if (this.isLocal || distToLocal < 450) {
            soundEngine.playFootstep();
          }
        }
      }
    }

    // --- 2. Combat / Gun State Machine ---
    if (this.isReloading) {
      const elapsed = currentTime - this.reloadStartTime;
      if (elapsed >= this.weapon.reloadTime) {
        // Complete reload
        const ammoNeeded = this.weapon.magSize - this.ammoInMag;
        const ammoTransfer = Math.min(ammoNeeded, this.reserveAmmo);
        
        this.ammoInMag += ammoTransfer;
        this.reserveAmmo -= ammoTransfer;
        this.isReloading = false;
        
        // Sync HUD if local
        if (this.isLocal && !this.isBot) {
          this.updateHUD();
        }
      }
    }

    // Muzzle flash decay
    if (this.muzzleFlash > 0) {
      this.muzzleFlash = Math.max(0, this.muzzleFlash - 0.15 * dtFactor);
    }

    // Flashbang opacity decay
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - 0.008 * dtFactor);
    }
  }

  handleLocalInput(keys, mouse, soundEngine, currentTime, dtFactor) {
    // Sprint check
    const isSprinting = keys && keys['shift'];
    const sprintSpeedMult = isSprinting ? 1.75 : 1.0;   // was 1.35
    const sprintAccelMult = isSprinting ? 1.75 : 1.0;   // was 1.35

    const isRanked = window.gameEngine && window.gameEngine.isRanked;
    let modeAccelMult = isRanked ? 1.25 : 1.0;
    if (this.adrenalineActive) {
      modeAccelMult *= 1.35;
    }
    const currentAccel = this.accel * modeAccelMult;

    // WASD movement inputs
    let ax = 0;
    let ay = 0;
    if (keys['w'] || keys['arrowup']) ay -= currentAccel * sprintAccelMult;
    if (keys['s'] || keys['arrowdown']) ay += currentAccel * sprintAccelMult;
    if (keys['a'] || keys['arrowleft']) ax -= currentAccel * sprintAccelMult;
    if (keys['d'] || keys['arrowright']) ax += currentAccel * sprintAccelMult;

    // Normalize diagonal acceleration
    if (ax !== 0 && ay !== 0) {
      ax *= 0.7071;
      ay *= 0.7071;
    }

    this.vx += ax * dtFactor;
    this.vy += ay * dtFactor;

    // Point angle towards mouse cursor
    // Mouse coords are screen-space relative to player offset
    this.angle = mouse.angle;

    // Spacebar dash forward (10s cooldown)
    const dashCooldown = 10000;
    if (keys && keys[' '] && (!this.lastDashTime || (currentTime - this.lastDashTime) > dashCooldown)) {
      this.lastDashTime = currentTime;
      this.justDashed = true;
      this.networkJustDashed = true;

      const dashSpeed = 22;
      this.vx = Math.cos(this.angle) * dashSpeed;
      this.vy = Math.sin(this.angle) * dashSpeed;

      if (soundEngine) {
        try {
          soundEngine.playDashSound(0);
        } catch(e) {}
      }
    }

    // Reload trigger (R key)
    if ((keys['r'] || keys['R']) && !this.isReloading && this.ammoInMag < this.weapon.magSize && this.reserveAmmo > 0) {
      this.startReload(soundEngine, currentTime);
    }
  }

  startReload(soundEngine, currentTime) {
    this.isReloading = true;
    this.reloadStartTime = currentTime;
    if (soundEngine) {
      soundEngine.playReload(this.weaponKey);
    }
    
    // Sync HUD reload wheel
    if (this.isLocal && !this.isBot) {
      const indicator = document.getElementById('reload-indicator');
      if (indicator) {
        indicator.style.display = 'flex';
        // Set timeout to hide it when done
        setTimeout(() => {
          if (indicator) indicator.style.display = 'none';
        }, this.weapon.reloadTime);
      }
    }
  }

  // Shoot weapon. Returns shootData if successful, or null
  shoot(currentTime, soundEngine, distance = 0) {
    if (this.health <= 0 || this.isReloading) return null;
    if (window.gameEngine && window.gameEngine.matchMode === 'sabotage' && this.team === 1) {
      return null;
    }

    // Fire cooldown check
    const cheatActive = window.gameEngine && window.gameEngine.devCheatActive && this.isLocal;
    const hasOverdrive = this.overdriveEndTime && (currentTime < this.overdriveEndTime) || this.overdriveActive;
    const fireRateMod = hasOverdrive ? 0.5 : 1.0;
    if (currentTime - this.lastFiredTime < this.weapon.fireRate * fireRateMod) {
      return null;
    }

    // Ammo check
    if (this.weaponKey !== 'knife' && this.ammoInMag <= 0) {
      if (soundEngine) soundEngine.playDryFire();
      this.lastFiredTime = currentTime;
      
      // Auto reload
      if (this.reserveAmmo > 0) {
        this.startReload(soundEngine, currentTime);
      }
      return null;
    }

    // Success fire
    if (this.weaponKey !== 'knife') {
      this.ammoInMag--;
    }
    this.lastFiredTime = currentTime;
    this.muzzleFlash = this.weaponKey === 'knife' ? 0.0 : 1.0;

    // Gun Physical recoil force pushing player backwards
    const recoilForce = this.weapon.recoil;
    this.vx -= Math.cos(this.angle) * recoilForce * 0.15;
    this.vy -= Math.sin(this.angle) * recoilForce * 0.15;

    // Play gunshot sound
    if (soundEngine) {
      soundEngine.playGunshot(this.weaponKey, distance);
    }

    if (this.isLocal && !this.isBot) {
      this.updateHUD();
    }

    // Return bullets generated
    const shootData = {
      playerId: this.id,
      x: this.x + Math.cos(this.angle) * 22, // spawn tip of barrel
      y: this.y + Math.sin(this.angle) * 22,
      angle: this.angle,
      weaponKey: this.weaponKey,
      damage: this.weapon.damage,
      bulletSpeed: this.weapon.bulletSpeed,
      range: this.weapon.range,
      recoil: recoilForce,
      pellets: this.weapon.pellets || 1,
      accuracy: this.weapon.accuracy
    };

    return shootData;
  }

  // Sync HUD interface for local player
  updateHUD() {
    const hpBar = document.getElementById('hud-self-hp');
    if (hpBar) hpBar.style.width = `${Math.max(0, this.health)}%`;
    
    const hpText = document.getElementById('hud-self-hp-text');
    if (hpText) hpText.innerText = Math.round(Math.max(0, this.health));
    
    const weaponName = document.getElementById('hud-weapon-name');
    if (weaponName && this.weapon && this.weapon.name) {
      weaponName.innerText = this.weapon.name.toUpperCase();
    }
    
    const ammoVal = document.getElementById('hud-ammo-val');
    if (ammoVal) {
      ammoVal.innerText = `${this.ammoInMag} / ${this.reserveAmmo}`;
    }

    const flashVal = document.getElementById('hud-flash-val');
    if (flashVal) {
      flashVal.innerText = `FLASH [${this.flashGrenades !== undefined ? this.flashGrenades : 1}]`;
      if (this.flashGrenades <= 0) {
        flashVal.style.color = '#ff3c3c';
        flashVal.style.borderColor = 'rgba(255, 60, 60, 0.3)';
      } else {
        flashVal.style.color = '#ffd700';
        flashVal.style.borderColor = 'rgba(255, 215, 0, 0.3)';
      }
    }

    // Update inventory slots UI
    for (let slotNum = 1; slotNum <= 3; slotNum++) {
      const slotEl = document.getElementById(`inv-slot-${slotNum}`);
      if (slotEl) {
        if (slotNum === 3) {
          slotEl.innerText = `[3] FLASH (${this.flashGrenades !== undefined ? this.flashGrenades : 1})`;
        } else if (slotNum === 1) {
          const wName = this.primaryWeaponKey ? this.primaryWeaponKey.toUpperCase() : 'PRIMARY';
          slotEl.innerText = `[1] ${wName}`;
        }
        
        if (this.activeSlot === slotNum) {
          slotEl.style.background = 'rgba(102, 252, 241, 0.12)';
          slotEl.style.borderColor = 'var(--neon-cyan)';
          slotEl.style.color = '#fff';
          slotEl.style.boxShadow = '0 0 8px rgba(102,252,241,0.2)';
        } else {
          slotEl.style.background = 'rgba(0, 0, 0, 0.4)';
          slotEl.style.borderColor = 'rgba(255,255,255,0.08)';
          slotEl.style.color = 'rgba(255,255,255,0.5)';
          slotEl.style.boxShadow = 'none';
        }
      }
    }
  }

  updateDashHUD(currentTime) {
    const dashCooldown = 10000;
    const statusEl = document.getElementById('hud-dash-status');
    const iconEl = document.getElementById('hud-dash-icon');
    if (!statusEl) return;

    if (!this.lastDashTime || (currentTime - this.lastDashTime) >= dashCooldown) {
      statusEl.innerText = 'DASH READY (SPACE)';
      statusEl.style.color = 'var(--neon-cyan)';
      if (iconEl) {
        iconEl.innerText = '⚡';
        iconEl.style.color = 'var(--neon-cyan)';
      }
    } else {
      const remaining = Math.ceil((dashCooldown - (currentTime - this.lastDashTime)) / 1000);
      statusEl.innerText = `DASH COOLDOWN: ${remaining}s`;
      statusEl.style.color = '#ff3c3c';
      if (iconEl) {
        iconEl.innerText = '⏳';
        iconEl.style.color = '#ff3c3c';
      }
    }
  }

  // Damage handling
  takeDamage(amount, soundEngine) {
    if (this.health <= 0) return;
    this.health = Math.max(0, this.health - amount);
    
    if (soundEngine) {
      soundEngine.playFleshHit();
    }

    if (this.isLocal && !this.isBot) {
      this.updateHUD();
      // Flash red vignette
      const canvas = document.getElementById('game-canvas');
      if (canvas) {
        canvas.style.filter = 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.4))';
        setTimeout(() => canvas.style.filter = 'none', 150);
      }
    }
  }

  // Check item pick up
  checkPickups(map, soundEngine) {
    if (this.health <= 0) return;

    map.items.forEach(item => {
      if (!item.active) return;

      const dist = Math.hypot(this.x - item.x, this.y - item.y);
      if (dist < this.radius + 12) {
        // Collect
        item.active = false;
        if (soundEngine) soundEngine.playPickup();

        if (item.type === 'health') {
          this.health = Math.min(this.maxHealth, this.health + 35);
          if (this.isLocal && !this.isBot) {
            this.updateHUD();
            this.showTextNotification('+35 HEALTH');
            if (window.AppSocket) {
              const cheatActive = window.gameEngine && window.gameEngine.devCheatActive;
              const syncedHealth = cheatActive ? Math.round(this.health / 2) : this.health;
              window.AppSocket.emit('sync-health', {
                playerId: this.id,
                health: syncedHealth
              });
            }
          }
        } else if (item.type === 'ammo') {
          const maxAmmo = this.weapon.magSize * 2;
          this.reserveAmmo = Math.min(this.maxReserveAmmo, this.reserveAmmo + maxAmmo);
          if (this.isLocal && !this.isBot) {
            this.updateHUD();
            this.showTextNotification('+AMMO');
          }
        } else if (item.type === 'adrenaline') {
          this.adrenalineEndTime = Date.now() + 8000;
          this.adrenalineActive = true;
          if (this.isLocal && !this.isBot) {
            this.showTextNotification('⚡ SPEED BOOST ACTIVE');
          }
        } else if (item.type === 'overdrive') {
          this.overdriveEndTime = Date.now() + 6000;
          this.overdriveActive = true;
          if (this.isLocal && !this.isBot) {
            this.showTextNotification('🔥 OVERDRIVE CHARGED');
          }
        }

        // Notify opponent of pickup in online mode
        if (this.isLocal && !this.isBot && window.AppSocket) {
          window.AppSocket.emit('pickup-item', { itemId: item.id });
        }
      }
    });
  }

  showTextNotification(text) {
    // Show a floating visual indicator above player
    this.floatingText = {
      text,
      timer: 45,
      yOffset: -30
    };
  }

  // --- 8. Bot AI Logic (Single Player Offline Mode) ---
  handleBotAI(map, soundEngine, currentTime, player, localPlayer, dtFactor) {
    // Check line of sight to player
    const distToPlayer = Math.hypot(this.x - player.x, this.y - player.y);
    const inVent = player.inVent;
    const hasRawLOS = !inVent && distToPlayer < 700 && this.checkLineOfSight(map, this.x, this.y, player.x, player.y);

    // Bot can see player in the dark if close, if player has flashlight on, or if player is in bot's flashlight beam
    let angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
    let diff = angleToPlayer - this.angle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    const inCone = Math.abs(diff) <= (32.5 * Math.PI / 180); // 65-degree flashlight cone

    const hasLOS = hasRawLOS && (
      distToPlayer < 140 || // Peripheral hearing/sensing radius (stealth detection)
      player.flashlightActive || 
      (this.flashlightActive && inCone)
    );

    // Hear gunshot investigate behavior
    const hearsGunshot = (currentTime - player.lastFiredTime < 60) && (distToPlayer < 900);
    if (hearsGunshot && !hasLOS && this.botState !== 'chase') {
      this.botState = 'search';
      this.lastKnownPlayerPos = { x: player.x, y: player.y };
      this.botTargetX = player.x;
      this.botTargetY = player.y;
      this.angle = Math.atan2(player.y - this.y, player.x - this.x); // turn towards shot
    }

    let alarmOverride = false;
    // Investigate alarm behavior in sabotage mode — highest priority (overrides chase unless player is very close)
    if (window.gameEngine && window.gameEngine.matchMode === 'sabotage') {
      const activeAlarms = window.gameEngine.tasks ? window.gameEngine.tasks.filter(t => t.alarmActive) : [];
      if (activeAlarms.length > 0) {
        // Find closest active alarm
        activeAlarms.sort((a, b) => Math.hypot(this.x - a.x, this.y - a.y) - Math.hypot(this.x - b.x, this.y - b.y));
        const closestAlarm = activeAlarms[0];

        // Only break alarm pursuit if player is practically right next to us (< 120px) AND visible
        const playerTooClose = hasLOS && distToPlayer < 120;

        if (!playerTooClose) {
          // Redirect bot to alarm — override any current patrol/search/chase state
          this.botState = 'search';
          this.botTargetX = closestAlarm.x;
          this.botTargetY = closestAlarm.y;
          this.angle = Math.atan2(closestAlarm.y - this.y, closestAlarm.x - this.x);
          // Show urgency — speed up artificially by pretending we just made a decision
          this.botLastDecisionTime = currentTime;
          alarmOverride = true;
        }
      }
    }

    const timeDiff = currentTime - this.botLastDecisionTime;
 
    // AI State Machine decisions every 250ms
    if (!alarmOverride && timeDiff > 250) {
      this.botLastDecisionTime = currentTime;

      // Strafe toggles every 800-1500ms
      if (currentTime - this.botLastStrafeToggle > 1000) {
        this.botStrafeDir = Math.random() > 0.5 ? 1 : -1;
        this.botLastStrafeToggle = currentTime;
      }

      // Dynamic cover/health seeking
      if (this.health < 35 && Math.random() < 0.3) {
        const healthItems = map.items.filter(i => i.active && i.type === 'health');
        if (healthItems.length > 0) {
          healthItems.sort((a,b) => Math.hypot(this.x-a.x, this.y-a.y) - Math.hypot(this.x-b.x, this.y-b.y));
          this.botTargetX = healthItems[0].x;
          this.botTargetY = healthItems[0].y;
          this.botState = 'patrol';
        }
      }

      if (hasLOS) {
        this.botState = 'chase';
        this.lastKnownPlayerPos = { x: player.x, y: player.y };
        
        // Face player
        this.angle = Math.atan2(player.y - this.y, player.x - this.x);

        if (this.isReloading) {
          // Tactical retreat while reloading
          this.botTargetX = this.x - Math.cos(this.angle) * 220;
          this.botTargetY = this.y - Math.sin(this.angle) * 220;
        } else if (this.weaponKey === 'sniper') {
          if (distToPlayer < 400) {
            this.botTargetX = this.x - Math.cos(this.angle) * 200;
            this.botTargetY = this.y - Math.sin(this.angle) * 200;
          } else {
            this.botTargetX = this.x;
            this.botTargetY = this.y;
          }
        } else if (this.weaponKey === 'shotgun') {
          // Charge player
          this.botTargetX = player.x;
          this.botTargetY = player.y;
        } else {
          // Tactical strafe dodging
          const strafeAngle = this.angle + (Math.PI / 2) * this.botStrafeDir;
          this.botTargetX = player.x + Math.cos(strafeAngle) * 180 + (Math.random() - 0.5) * 60;
          this.botTargetY = player.y + Math.sin(strafeAngle) * 180 + (Math.random() - 0.5) * 60;
        }
        
        // Auto-reloading for bot
        if (this.ammoInMag === 0 && !this.isReloading && this.reserveAmmo > 0) {
          this.startReload(soundEngine, currentTime);
        }
      } else {
        // Lost LOS
        if (this.botState === 'chase' && this.lastKnownPlayerPos) {
          this.botState = 'search';
          this.botTargetX = this.lastKnownPlayerPos.x;
          this.botTargetY = this.lastKnownPlayerPos.y;
        } else if (this.botState === 'search') {
          const distToTarget = Math.hypot(this.x - this.botTargetX, this.y - this.botTargetY);
          if (distToTarget < 50) {
            this.botState = 'patrol';
            this.choosePatrolPoint(map);
          }
        } else {
          // Patrol state (actual roaming)
          const distToTarget = Math.hypot(this.x - this.botTargetX, this.y - this.botTargetY);
          if (distToTarget < 50 || Math.random() < 0.02) {
            this.choosePatrolPoint(map);
          }
        }
      }
    }

    // Stuck detection & sliding navigation: check if bot is trying to roam but position hasn't updated much
    const targetDist = Math.hypot(this.x - this.botTargetX, this.y - this.botTargetY);
    if (targetDist > 30) {
      if (!this.lastStuckCheckTime) {
        this.lastStuckCheckTime = currentTime;
        this.lastStuckPosX = this.x;
        this.lastStuckPosY = this.y;
        this.stuckDuration = 0;
      } else if (currentTime - this.lastStuckCheckTime > 300) {
        const distMoved = Math.hypot(this.x - this.lastStuckPosX, this.y - this.lastStuckPosY);
        if (distMoved < 12) {
          this.stuckDuration += (currentTime - this.lastStuckCheckTime);
        } else {
          this.stuckDuration = 0;
        }
        this.lastStuckCheckTime = currentTime;
        this.lastStuckPosX = this.x;
        this.lastStuckPosY = this.y;
      }
    } else {
      this.stuckDuration = 0;
    }

    if (this.stuckDuration > 800 && (this.botState === 'patrol' || this.botState === 'search')) {
      // Pick a brand new target point if we've been stuck for a very long time during patrolling/searching
      this.choosePatrolPoint(map);
      this.stuckDuration = 0;
    }

    // Steering movement towards target
    const isRanked = window.gameEngine && window.gameEngine.isRanked;
    let modeAccelMult = isRanked ? 1.25 : 1.0;
    if (this.adrenalineActive) {
      modeAccelMult *= 1.35;
    }
    const currentAccel = this.accel * modeAccelMult;

    const distToTarget = Math.hypot(this.x - this.botTargetX, this.y - this.botTargetY);
    if (distToTarget > 10) {
      const moveAngle = Math.atan2(this.botTargetY - this.y, this.botTargetX - this.x);
      
      let steerAngle = moveAngle;
      if (this.stuckDuration > 350) {
        if (!this.stuckSteerDir) {
          this.stuckSteerDir = Math.random() < 0.5 ? 1 : -1;
        }
        steerAngle += (Math.PI / 2) * this.stuckSteerDir;
      } else {
        this.stuckSteerDir = 0;
      }

      if (this.botState !== 'chase') {
        this.angle = moveAngle;
      }
      
      this.vx += Math.cos(steerAngle) * currentAccel * dtFactor;
      this.vy += Math.sin(steerAngle) * currentAccel * dtFactor;
    }

    // Proximity wall avoidance force to prevent sliding sticking
    let avoidForceX = 0;
    let avoidForceY = 0;
    for (const wall of map.walls) {
      const clX = Math.max(wall.x, Math.min(this.x, wall.x + wall.w));
      const clY = Math.max(wall.y, Math.min(this.y, wall.y + wall.h));
      const dX = this.x - clX;
      const dY = this.y - clY;
      const d = Math.hypot(dX, dY);
      if (d < this.radius + 20 && d > 0) {
        const force = (this.radius + 20 - d) / 20;
        avoidForceX += (dX / d) * force * 0.45;
        avoidForceY += (dY / d) * force * 0.45;
      }
    }
    this.vx += avoidForceX * dtFactor;
    this.vy += avoidForceY * dtFactor;

    // Shooting behavior — fires instantly on sight, respects weapon fire-rate only
    if (hasLOS && !this.isReloading && this.ammoInMag > 0) {
      const timeSinceLast = currentTime - this.lastFiredTime;
      const weaponFireRate = this.weapon.fireRate || 300;

      if (timeSinceLast >= weaponFireRate) {
        const dist = localPlayer ? Math.hypot(this.x - localPlayer.x, this.y - localPlayer.y) : 0;
        const shootResult = this.shoot(currentTime, soundEngine, dist);
        if (shootResult && window.OnBotShootCallback) {
          window.OnBotShootCallback(shootResult);
        }
      }
    }
  }

  checkLineOfSight(map, sx, sy, tx, ty) {
    const hit = map.getLineIntersection({ x: sx, y: sy }, { x: tx, y: ty });
    return !hit; // If no intersection with walls, we have Line of Sight
  }

  choosePatrolPoint(map) {
    if (!map || !map.rooms || map.rooms.length === 0) {
      this.botTargetX = Math.random() * (map.width - 160) + 80;
      this.botTargetY = Math.random() * (map.height - 160) + 80;
      return;
    }

    // 1. Find the current room index (0-8)
    const currentRoomIdx = map.rooms.findIndex(r => 
      this.x >= r.x && this.x <= r.x + r.w &&
      this.y >= r.y && this.y <= r.y + r.h
    );

    let targetRoom = null;

    if (currentRoomIdx !== -1 && Math.random() < 0.75) {
      // 75% chance: Pick current room or adjacent room
      const col = currentRoomIdx % 3;
      const row = Math.floor(currentRoomIdx / 3);

      const adjacentIndices = [];
      for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dCol = -1; dCol <= 1; dCol++) {
          const nRow = row + dRow;
          const nCol = col + dCol;
          if (nRow >= 0 && nRow < 3 && nCol >= 0 && nCol < 3) {
            adjacentIndices.push(nRow * 3 + nCol);
          }
        }
      }

      // Pick one random adjacent index
      const targetIdx = adjacentIndices[Math.floor(Math.random() * adjacentIndices.length)];
      targetRoom = map.rooms[targetIdx];
    } else {
      // 25% chance or if not inside any room: Pick any room completely randomly
      targetRoom = map.rooms[Math.floor(Math.random() * map.rooms.length)];
    }

    if (!targetRoom) {
      targetRoom = map.rooms[0];
    }

    // 2. Select a random coordinate inside the target room (keeping distance from outer walls)
    let attempts = 0;
    const padding = 38; // Keep 38px padding from room walls

    while (attempts < 100) {
      attempts++;
      const rx = targetRoom.x + padding + Math.random() * (targetRoom.w - padding * 2);
      const ry = targetRoom.y + padding + Math.random() * (targetRoom.h - padding * 2);

      // Verify not overlapping with furniture walls/crates
      let overlaps = false;
      for (const wall of map.walls) {
        if (rx + 25 > wall.x && rx - 25 < wall.x + wall.w &&
            ry + 25 > wall.y && ry - 25 < wall.y + wall.h) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        this.botTargetX = rx;
        this.botTargetY = ry;
        return;
      }
    }

    // Fallback: If room target selection failed to avoid overlap after 100 attempts, pick the room center
    this.botTargetX = targetRoom.x + targetRoom.w / 2;
    this.botTargetY = targetRoom.y + targetRoom.h / 2;
  }

  // Draw player operative on canvas
  draw(ctx, configSettings = { laser: true }, map = null) {
    if (this.inVent) return;
    if (this.health <= 0) {
      // Draw death pool / fallen character
      ctx.save();
      ctx.fillStyle = 'rgba(180, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.radius + 8, this.radius + 4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Try to draw the fallen elf girl sprite (rotated sideways)
      if (CharacterRenderer.ready) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2);
        ctx.globalAlpha = 0.55;
        CharacterRenderer.draw(ctx, this.id + '_dead', 0, 0, 0, 0, false, this.isLocal ? 'blue' : 'red');
        ctx.restore();
      }
      ctx.restore();
      return;
    }

    ctx.save();

    // ── Muzzle flash ground glow ──
    if (this.health > 0 && this.muzzleFlash > 0.15) {
      ctx.save();
      const flashRadius = 130 * this.muzzleFlash;
      const groundGlow = ctx.createRadialGradient(this.x, this.y, 10, this.x, this.y, flashRadius);
      groundGlow.addColorStop(0, 'rgba(255, 160, 40, 0.28)');
      groundGlow.addColorStop(0.5, 'rgba(255, 100, 20, 0.10)');
      groundGlow.addColorStop(1, 'rgba(255, 50, 0, 0.0)');
      ctx.fillStyle = groundGlow;
      ctx.beginPath();
      ctx.arc(this.x, this.y, flashRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Laser Sight (only for local player, or if settings enabled)
    const isSabotage = window.gameEngine && window.gameEngine.matchMode === 'sabotage';
    if (configSettings.laser && this.isLocal && !this.isReloading && !isSabotage) {
      const maxLaserDist = 1200;
      let endX = this.x + Math.cos(this.angle) * maxLaserDist;
      let endY = this.y + Math.sin(this.angle) * maxLaserDist;
      
      if (map) {
        const intersection = map.getLineIntersection({ x: this.x, y: this.y }, { x: endX, y: endY });
        if (intersection) {
          endX = intersection.x;
          endY = intersection.y;
        }
      }

      ctx.save();
      // Draw red/cyan laser line
      ctx.strokeStyle = this.isLocal ? 'rgba(102, 252, 241, 0.5)' : 'rgba(255, 60, 60, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Draw bright glowing dot at impact point
      const dotColor = this.isLocal ? '#66fcf1' : '#ff3c3c';
      const glowGrad = ctx.createRadialGradient(endX, endY, 1, endX, endY, 6);
      glowGrad.addColorStop(0, '#ffffff');
      glowGrad.addColorStop(0.3, dotColor);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(endX, endY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();

    // ── Draw dash trails/afterimages ──
    const drawTime = performance.now();
    if (this.dashTrails && this.dashTrails.length > 0) {
      this.dashTrails.forEach((trail) => {
        const age = drawTime - trail.time;
        const opacity = Math.max(0, 0.35 * (1 - age / 180));
        if (opacity <= 0) return;

        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Draw the ghost sprite at trail position
        const drewSprite = CharacterRenderer.draw(
          ctx,
          this.id + '_trail',
          trail.x,
          trail.y,
          trail.angle,
          0, // static walk frame
          false
        );

        // Fallback vector drawing if sprite not ready
        if (!drewSprite) {
          ctx.save();
          ctx.translate(trail.x, trail.y);
          ctx.rotate(trail.angle);
          const theme = COLOR_THEMES[this.colorTheme] || COLOR_THEMES[this.isLocal ? 'cyan' : 'red'];
          ctx.fillStyle = theme.helmet || '#66fcf1';
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.restore();
      });
    }

    // ── Draw aura if power-up active ──
    const nowTime = Date.now();
    const hasAdrenaline = this.adrenalineEndTime && (nowTime < this.adrenalineEndTime) || this.adrenalineActive;
    const hasOverdrive = this.overdriveEndTime && (nowTime < this.overdriveEndTime) || this.overdriveActive;
    if (hasAdrenaline || hasOverdrive) {
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.lineWidth = 3;
      ctx.shadowColor = hasOverdrive ? '#ffd700' : '#39db14';
      ctx.strokeStyle = hasOverdrive ? 'rgba(255, 215, 0, 0.4)' : 'rgba(57, 219, 20, 0.4)';
      const r = this.radius + 2 + Math.sin(nowTime / 150) * 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // ── Try drawing elf girl 3D sprite ──────────────────────────────────
    const isShooting = this.muzzleFlash > 0.1;
    const drewSprite = CharacterRenderer.draw(
      ctx,
      this.id,
      this.x,
      this.y,
      this.angle,
      this.currentSpeed || 0,
      isShooting,
      this.isLocal ? 'blue' : 'red'
    );

    // ── Fallback: tactical circle operative ──────────────────────────────
    if (!drewSprite) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      const theme = COLOR_THEMES[this.colorTheme] || COLOR_THEMES[this.isLocal ? 'cyan' : 'red'];
      const bodyColor = theme.body;
      const armorColor = theme.armor;
      const helmetColor = theme.helmet;

      let barrelLength = 18, barrelWidth = 4;
      if (this.weaponKey === 'rifle')   { barrelLength = 24; barrelWidth = 5; }
      if (this.weaponKey === 'shotgun') { barrelLength = 22; barrelWidth = 6; }
      if (this.weaponKey === 'sniper')  { barrelLength = 32; barrelWidth = 4; ctx.fillStyle='#444'; ctx.fillRect(8,-5,6,3); }
      if (this.weaponKey === 'smg')     { barrelLength = 16; barrelWidth = 4; }
      if (this.weaponKey === 'lmg')     { barrelLength = 26; barrelWidth = 7; ctx.fillStyle='#222'; ctx.fillRect(6,-8,6,16); }
      if (this.weaponKey === 'dmr')     { barrelLength = 28; barrelWidth = 5; ctx.fillRect(10,-4,5,2); }
      if (this.weaponKey === 'vector')  { barrelLength = 14; barrelWidth = 4; ctx.fillStyle='#333'; ctx.fillRect(4,-6,5,12); }
      if (this.weaponKey === 'famas')   { barrelLength = 20; barrelWidth = 5; ctx.fillStyle='#555'; ctx.fillRect(6,-3,8,6); }
      if (this.weaponKey === 'plasma')  { ctx.fillStyle='#9b1fe8'; barrelLength = 20; barrelWidth = 5; }
      if (this.weaponKey === 'railgun') { ctx.fillStyle='#0d8a8a'; barrelLength = 30; barrelWidth = 6; ctx.fillStyle='#066'; ctx.fillRect(6,-7,8,14); }

      ctx.fillStyle = '#444'; ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
      ctx.fillRect(10, -barrelWidth / 2, barrelLength, barrelWidth);
      ctx.strokeRect(10, -barrelWidth / 2, barrelLength, barrelWidth);

      ctx.fillStyle = armorColor; ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(8, -10, 5, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(14, 6, 5, 0, Math.PI*2); ctx.fill(); ctx.stroke();

      ctx.fillStyle = bodyColor;
      ctx.beginPath(); ctx.ellipse(0, 0, this.radius, this.radius+3, 0, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = armorColor;
      ctx.beginPath(); ctx.ellipse(-3, 0, this.radius-4, this.radius-2, 0, 0, Math.PI*2);
      ctx.fill();

      ctx.fillStyle = helmetColor;
      ctx.beginPath(); ctx.arc(-2, 0, 8, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#111'; ctx.fillRect(1, -5, 3, 10);
      ctx.restore();
    }

    // ── Weapon barrel & muzzle flash (drawn on top of sprite) ──────────
    if (this.weaponKey !== 'none') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

    ctx.fillStyle = this.weaponKey === 'knife' ? '#b0b8c0' : '#333';
    ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.lineWidth = 1;
    let barrelLength = 18, barrelWidth = 3;
    if (this.weaponKey === 'rifle')   { barrelLength = 26; barrelWidth = 4; }
    if (this.weaponKey === 'shotgun') { barrelLength = 22; barrelWidth = 5; }
    if (this.weaponKey === 'sniper')  { barrelLength = 36; barrelWidth = 3; }
    if (this.weaponKey === 'smg')     { barrelLength = 16; barrelWidth = 3; }
    if (this.weaponKey === 'lmg')     { barrelLength = 28; barrelWidth = 5; }
    if (this.weaponKey === 'dmr')     { barrelLength = 30; barrelWidth = 4; }
    if (this.weaponKey === 'knife')   { barrelLength = 10; barrelWidth = 2; }
    if (this.weaponKey === 'vector')  { barrelLength = 14; barrelWidth = 3; ctx.fillStyle='#2a2a2a'; ctx.fillRect(4,-5,4,10); }
    if (this.weaponKey === 'famas')   { barrelLength = 20; barrelWidth = 4; ctx.fillStyle='#444'; ctx.fillRect(5,-4,7,8); }
    if (this.weaponKey === 'plasma')  { ctx.fillStyle='#9b1fe8'; barrelLength = 20; barrelWidth = 5; ctx.fillStyle='#c455ff'; ctx.fillRect(6,-4,6,8); }
    if (this.weaponKey === 'railgun') { ctx.fillStyle='#0d8a8a'; barrelLength = 30; barrelWidth = 6; ctx.fillStyle='#0af'; ctx.fillRect(4,-6,8,12); }

    ctx.fillRect(12, -barrelWidth / 2, barrelLength, barrelWidth);
    ctx.strokeRect(12, -barrelWidth / 2, barrelLength, barrelWidth);

    // Muzzle Flash
    if (this.muzzleFlash > 0) {
      ctx.save();
      ctx.translate(12 + barrelLength, 0);
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.3, 'rgba(255, 220, 0, 0.9)');
      grad.addColorStop(0.7, 'rgba(255, 80, 0, 0.5)');
      grad.addColorStop(1, 'rgba(255, 0, 0, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

      ctx.restore();
    }

    // 4. Floating HUD text above player (Operative name / pickups)
    ctx.save();
    ctx.textAlign = 'center';
    
    const nameColor = this.isLocal 
      ? (COLOR_THEMES[this.colorTheme]?.helmet || '#66fcf1')
      : (this.isTeammate ? '#39db14' : '#ff3c3c');

    // ── Rank badge above name ────────────────────────────────────────────────
    if (this.rank) {
      const badgeY = this.y - this.radius - 28;
      const badgeTxt = `${this.rank.icon} ${this.rank.label}`;
      ctx.font = 'bold 8px Orbitron';
      const tw = ctx.measureText(badgeTxt).width;
      const bw = tw + 10, bh = 12;
      // Badge background
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.beginPath();
      ctx.roundRect(this.x - bw / 2, badgeY - bh / 2, bw, bh, 3);
      ctx.fill();
      // Badge border
      ctx.strokeStyle = this.rank.color;
      ctx.lineWidth = 1;
      ctx.stroke();
      // Badge text
      ctx.fillStyle = this.rank.color;
      ctx.fillText(badgeTxt, this.x, badgeY + 4);
    }
    // ────────────────────────────────────────────────────────────────────────
      
    ctx.fillStyle = nameColor;
    ctx.font = '10px Orbitron';
    ctx.fillText(this.name.toUpperCase(), this.x, this.y - this.radius - 12);
    
    // Draw tiny mini healthbar above opponent/bot
    const isSabotageMode = window.gameEngine && window.gameEngine.matchMode === 'sabotage';
    if (!this.isLocal && this.health > 0 && !isSabotageMode) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(this.x - 20, this.y - this.radius - 8, 40, 4);
      
      const hpColor = this.isTeammate ? '#39db14' : '#ff3c3c';
      ctx.fillStyle = hpColor;
      ctx.fillRect(this.x - 20, this.y - this.radius - 8, 40 * (this.health / this.maxHealth), 4);
    }

    // Render local floating text (+HP / +AMMO)
    if (this.floatingText && this.floatingText.timer > 0) {
      ctx.font = 'bold 9px Orbitron';
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(this.floatingText.text, this.x, this.y + this.floatingText.yOffset);
      this.floatingText.yOffset -= 0.4;
      this.floatingText.timer--;
    }
    ctx.restore();
  }

  updateBuffsHUD(now) {
    if (!this.isLocal || this.isBot) return;
    const buffsContainer = document.getElementById('hud-active-buffs');
    if (!buffsContainer) return;

    let html = '';
    if (this.adrenalineActive) {
      const remaining = Math.max(0, (this.adrenalineEndTime - now) / 1000).toFixed(1);
      html += `<div style="font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; background: rgba(57, 219, 20, 0.15); border: 1px solid rgba(57, 219, 20, 0.4); color: #39db14; padding: 4px 8px; border-radius: 3px; display: flex; align-items: center; gap: 4px; box-shadow: 0 0 8px rgba(57, 219, 20, 0.2);">⚡ SPEED: ${remaining}s</div>`;
    }
    if (this.overdriveActive) {
      const geographical = Math.max(0, (this.overdriveEndTime - now) / 1000).toFixed(1);
      html += `<div style="font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; background: rgba(255, 215, 0, 0.15); border: 1px solid rgba(255, 215, 0, 0.4); color: #ffd700; padding: 4px 8px; border-radius: 3px; display: flex; align-items: center; gap: 4px; box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);">🔥 OVERDRIVE: ${geographical}s</div>`;
    }
    buffsContainer.innerHTML = html;
  }
}
