import { CharacterRenderer } from './CharacterRenderer.js';
import {
  advanceBotRoute,
  claimCoverPoint,
  createBotRouteState,
  getClaimedCoverPoints,
  getBotRouteEndpointStatus,
  getRecentSighting,
  getTeammateSeparation,
  invalidateBotRoute,
  predictAimPoint,
  recordTeamSighting,
  releaseCoverClaim,
  rotateAngleToward,
  routeNeedsReplan,
  setBotRoute
} from './BotTactics.js';

// ─── Rank System ──────────────────────────────────────────────────────────────
export const RANKS = [
  { id: 'recruit', label: 'RECRUIT',  minRP: 0,    maxRP: 999,  color: '#8a9bb5', icon: '▪' },
  { id: 'veteran', label: 'VETERAN',  minRP: 1000, maxRP: 3999, color: '#e8c84a', icon: '◆' },
  { id: 'elite',   label: 'ELITE',    minRP: 4000, maxRP: Infinity, color: '#ff6ef7', icon: '★' }
];
export const RP_WIN  =  80;   // RP gained on match win
export const RP_LOSS = -40;   // RP lost on match loss (negative)
// ─────────────────────────────────────────────────────────────────────────────

export function isSaraBoostActive() {
  try {
    return (localStorage.getItem('tacticstrike_player_name') || '').trim().toLowerCase() === 'sara';
  } catch (e) {
    return false;
  }
}

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
    this.botRoute = createBotRouteState();
    this.botTargetPurpose = 'patrol';
    this.botAimReadyAt = 0;
    this.botAimTargetId = null;
    this.botHadLOS = false;
    this.botLastSeenAt = -Infinity;
    this.botCoverUntil = 0;
    this.botLaneSign = 1;

    // Flashlight & strafing
    this.flashlightActive = true;
    this.botStrafeDir = Math.random() > 0.5 ? 1 : -1;
    this.botLastStrafeToggle = 0;

    // Dash trail effects & sync
    this.dashTrails = [];
    this.networkJustDashed = false;

    // Weapon XP & Leveling System
    this.weaponXP = 0;
    this.weaponLevel = 1;
    this.weaponLevelUpAlert = 0;

    // Tactical Inventory Items
    this.healthPacks = 0;
    this.ammoPacks = 0;
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
    if (this.isLocal && delta > 0 && isSaraBoostActive()) delta *= 2;
    this.rp = Math.max(0, this.rp + delta);
    const newRank = this._calcRank(this.rp);
    const rankChanged = newRank.id !== this.rank.id;
    this.rank = newRank;
    if (this.isLocal) {
      try { localStorage.setItem('tacticstrike_rp', String(this.rp)); } catch(e) {}
    }
    return rankChanged;
  }

  addWeaponXP(amount) {
    if (this.health <= 0) return;
    if (this.isLocal && isSaraBoostActive()) amount *= 2;
    this.weaponXP += amount;
    let leveledUp = false;
    while (this.weaponXP >= this.weaponLevel * 100) {
      this.weaponXP -= this.weaponLevel * 100;
      this.weaponLevel++;
      leveledUp = true;
    }
    if (leveledUp) {
      this.weaponLevelUpAlert = 4; // 4 seconds alert
      if (this.isLocal && !this.isBot) {
        this.updateHUD();
      }
    }
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

  update(keys, mouse, map, soundEngine, currentTime, botTargetPlayer = null, localPlayerRef = null, botContext = null) {
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
      this.aimbotHasLOS = false;
      if (cheatActive) {
        if (this.health > 200) this.health = 200;
        
        // Find nearest living opponent/bot
        const opposingTeam = this.team === 1 ? 2 : 1;
        const targets = window.gameEngine.players.filter(p => p !== this && p.health > 0 && p.team === opposingTeam);
        if (targets.length > 0) {
          const gameMap = window.gameEngine.map;
          // Sort targets by distance
          targets.sort((a, b) => Math.hypot(this.x - a.x, this.y - a.y) - Math.hypot(this.x - b.x, this.y - b.y));
          
          // Find the closest visible target (in line of sight)
          let target = null;
          if (gameMap) {
            target = targets.find(p => this.checkLineOfSight(gameMap, this.x, this.y, p.x, p.y));
          }
          
          if (target) {
            const dist = Math.hypot(this.x - target.x, this.y - target.y);
            const maxRange = this.weapon.range || 400;
            
            if (dist <= maxRange) {
              this.aimbotHasLOS = true;
              
              // Predictive lead calculation (aim ahead based on bullet travel time)
              // We adjust for the 22-pixel barrel spawn length to make the prediction mathematically perfect
              const dx = target.x - this.x;
              const dy = target.y - this.y;
              const scale = dist > 0 ? Math.max(0, dist - 22) / dist : 0;
              const edx = dx * scale;
              const edy = dy * scale;
              
              const s = this.weapon.bulletSpeed || 15;
              const targetVx = target.vx || 0;
              const targetVy = target.vy || 0;
              
              // Solve quadratic equation: (s^2 - v_t^2) * t^2 - 2 * (D . v_t) * t - D^2 = 0
              const vSqr = targetVx * targetVx + targetVy * targetVy;
              const a = s * s - vSqr;
              const b = -2 * (edx * targetVx + edy * targetVy);
              const c = -(edx * edx + edy * edy);
              
              let t = 0;
              if (Math.abs(a) > 0.001) {
                const disc = b * b - 4 * a * c;
                if (disc >= 0) {
                  const t1 = (-b + Math.sqrt(disc)) / (2 * a);
                  const t2 = (-b - Math.sqrt(disc)) / (2 * a);
                  if (t1 > 0 && t2 > 0) {
                    t = Math.min(t1, t2);
                  } else if (t1 > 0) {
                    t = t1;
                  } else if (t2 > 0) {
                    t = t2;
                  }
                }
              } else {
                if (Math.abs(b) > 0.001) {
                  const t1 = -c / b;
                  if (t1 > 0) t = t1;
                }
              }
              
              // Apply perfect aim angle directly to calculated future location
              const predX = target.x + targetVx * t;
              const predY = target.y + targetVy * t;
              this.angle = Math.atan2(predY - this.y, predX - this.x);
            }
          }
        }
      } else {
        if (this.health > 100) this.health = 100;
      }
    } else if (this.isBot) {
      this.handleBotAI(map, soundEngine, currentTime, botTargetPlayer, localPlayerRef, dtFactor, botContext || {});
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
    
    const collisionResponse = map.moveCircle
      ? map.moveCircle(this.x, this.y, this.vx * dtFactor, this.vy * dtFactor, this.radius)
      : map.checkCircleCollision(nextX, nextY, this.radius);
    this.x = collisionResponse.x;
    this.y = collisionResponse.y;
    if (collisionResponse.collided) {
      const intoWall = this.vx * collisionResponse.normalX + this.vy * collisionResponse.normalY;
      if (intoWall < 0) {
        this.vx -= intoWall * collisionResponse.normalX;
        this.vy -= intoWall * collisionResponse.normalY;
      }
    }

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

    // Weapon Level Up Announcement decay
    if (this.weaponLevelUpAlert > 0) {
      this.weaponLevelUpAlert = Math.max(0, this.weaponLevelUpAlert - clampedDt / 1000);
    }
  }

  handleLocalInput(keys, mouse, soundEngine, currentTime, dtFactor) {
    if (window.gameEngine && window.gameEngine.activeMinigame) {
      this.vx = 0;
      this.vy = 0;
      return;
    }
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
      const lvlSuffix = this.weaponKey !== 'knife' && this.weaponKey !== 'none' ? ` [LVL ${this.weaponLevel}]` : '';
      weaponName.innerText = (this.weapon.name + lvlSuffix).toUpperCase();
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

    const stashedPacks = document.getElementById('hud-stashed-packs');
    if (stashedPacks) {
      stashedPacks.innerHTML = `MEDKITS [${this.healthPacks || 0}] &nbsp; AMMO PACKS [${this.ammoPacks || 0}]`;
    }

    // Update weapon XP bar
    const xpWrapper = document.getElementById('hud-weapon-xp-wrapper');
    if (xpWrapper) {
      if (this.weaponKey !== 'knife' && this.weaponKey !== 'none') {
        xpWrapper.style.display = 'flex';
        const nextLevelXP = this.weaponLevel * 100;
        const xpPercent = (this.weaponXP / nextLevelXP) * 100;
        
        const xpBarFill = document.getElementById('hud-weapon-xp');
        if (xpBarFill) {
          xpBarFill.style.width = `${xpPercent}%`;
        }
        
        const xpText = document.getElementById('hud-weapon-xp-text');
        if (xpText) {
          xpText.innerText = `${this.weaponXP}/${nextLevelXP}`;
        }
      } else {
        xpWrapper.style.display = 'none';
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

    if (this.isBot && this.health > 0) {
      // 200 IQ reaction: if shot, instantly dash perpendicular to evade further hits
      const now = Date.now();
      const canDash = !this.lastDashTime || (now - this.lastDashTime > 3000);
      if (canDash && Math.random() < 0.6) {
        this.lastDashTime = now;
        this.networkJustDashed = true;
        const steerAngle = this.angle + (Math.PI / 2) * (Math.random() > 0.5 ? 1 : -1);
        this.vx = Math.cos(steerAngle) * 20;
        this.vy = Math.sin(steerAngle) * 20;
        if (soundEngine && soundEngine.playFrictionalScrape) {
          try { soundEngine.playFrictionalScrape(0, 0.4, 0.5); } catch(ex) {}
        }
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

        if (item.type === 'health') {
          if (this.health >= this.maxHealth) {
            if (this.healthPacks < 2) {
              this.healthPacks++;
              if (soundEngine) soundEngine.playPickup();
              if (this.isLocal && !this.isBot) {
                this.updateHUD();
                this.showTextNotification('+1 STASHED MEDKIT', '#ff6ef7');
              }
            } else {
              item.active = true;
              return; // Inventory full, leave it on ground
            }
          } else {
            if (soundEngine) soundEngine.playPickup();
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
          }
        } else if (item.type === 'ammo') {
          if (this.reserveAmmo >= this.maxReserveAmmo) {
            if (this.ammoPacks < 2) {
              this.ammoPacks++;
              if (soundEngine) soundEngine.playPickup();
              if (this.isLocal && !this.isBot) {
                this.updateHUD();
                this.showTextNotification('+1 STASHED AMMO PACK', '#ff6ef7');
              }
            } else {
              item.active = true;
              return; // Inventory full, leave it on ground
            }
          } else {
            if (soundEngine) soundEngine.playPickup();
            const maxAmmo = this.weapon.magSize * 2;
            this.reserveAmmo = Math.min(this.maxReserveAmmo, this.reserveAmmo + maxAmmo);
            if (this.isLocal && !this.isBot) {
              this.updateHUD();
              this.showTextNotification('+AMMO');
            }
          }
        } else if (item.type === 'adrenaline') {
          if (soundEngine) soundEngine.playPickup();
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

  showTextNotification(text, color = '#ffd700') {
    // Show a floating visual indicator above player
    this.floatingText = {
      text,
      timer: 45,
      yOffset: -30,
      color
    };
  }

  // --- 8. Bot AI Logic (Single Player Offline Mode) ---
  handleBotAI(map, soundEngine, currentTime, player, localPlayer, dtFactor, context = {}) {
    const navigation = context.navigation || null;
    const blackboard = context.blackboard || null;
    const teammates = context.teammates || [];
    const combatEnabled = context.combatEnabled !== false;
    const hasEnemy = !!(player && player.health > 0);
    const distToPlayer = hasEnemy ? Math.hypot(this.x - player.x, this.y - player.y) : Infinity;
    const hasRawLOS = hasEnemy && !player.inVent && distToPlayer < 760 && (
      navigation?.hasClearPath
        ? navigation.hasClearPath(this.x, this.y, player.x, player.y, 1)
        : this.checkLineOfSight(map, this.x, this.y, player.x, player.y)
    );

    const angleToPlayer = hasEnemy ? Math.atan2(player.y - this.y, player.x - this.x) : this.angle;
    let viewDiff = angleToPlayer - this.angle;
    while (viewDiff < -Math.PI) viewDiff += Math.PI * 2;
    while (viewDiff > Math.PI) viewDiff -= Math.PI * 2;
    const inCone = Math.abs(viewDiff) <= (38 * Math.PI / 180);
    const hasLOS = hasRawLOS && (
      distToPlayer < 145 || player.flashlightActive || (this.flashlightActive && inCone)
    );

    if (hasLOS) {
      recordTeamSighting(blackboard, this, player, currentTime);
      this.lastKnownPlayerPos = { x: player.x, y: player.y };
      this.botLastSeenAt = currentTime;
      if (!this.botHadLOS || this.botAimTargetId !== String(player.id)) {
        this.botAimTargetId = String(player.id);
        this.botAimReadyAt = currentTime + 105 + Math.random() * 120;
      }
      this.botHadLOS = true;
    } else if (currentTime - this.botLastSeenAt > 420) {
      this.botHadLOS = false;
    }

    const sharedSighting = hasEnemy ? getRecentSighting(blackboard, player.id, currentTime) : null;
    const hearsGunshot = hasEnemy && currentTime - player.lastFiredTime < 520 && distToPlayer < 900;
    if (hearsGunshot && !hasLOS) {
      this.lastKnownPlayerPos = { x: player.x, y: player.y };
      this.botState = 'search';
      this.setBotTarget(map, navigation, player.x, player.y, 'gunshot', currentTime);
    }

    let alarmOverride = false;
    const gameEngine = typeof window !== 'undefined' ? window.gameEngine : null;
    if (gameEngine?.matchMode === 'sabotage') {
      const activeAlarms = (gameEngine.tasks || []).filter(task => task.alarmActive);
      if (activeAlarms.length && !(hasLOS && distToPlayer < 120)) {
        const closestAlarm = activeAlarms.reduce((best, alarm) => (
          !best || Math.hypot(this.x - alarm.x, this.y - alarm.y) < Math.hypot(this.x - best.x, this.y - best.y)
            ? alarm : best
        ), null);
        if (closestAlarm && this.setBotTarget(map, navigation, closestAlarm.x, closestAlarm.y, 'alarm', currentTime)) {
          this.botState = 'search';
          alarmOverride = true;
        }
      }
    }

    const decisionDue = currentTime - this.botLastDecisionTime > 230;
    if (!alarmOverride && decisionDue) {
      this.botLastDecisionTime = currentTime;
      if (currentTime - this.botLastStrafeToggle > 1100) {
        this.botStrafeDir *= -1;
        this.botLastStrafeToggle = currentTime;
      }
      if (this.ammoInMag === 0 && !this.isReloading && this.reserveAmmo > 0) {
        this.startReload(soundEngine, currentTime);
      }

      let choseCover = false;
      const coverThreat = hasLOS ? player : sharedSighting;
      const shouldUseCover = coverThreat && (this.health < 46 || this.isReloading);
      if (shouldUseCover && navigation?.findCoverPoint) {
        const claimed = getClaimedCoverPoints(blackboard, currentTime, this.id);
        const cover = navigation.findCoverPoint(this.x, this.y, coverThreat.x, coverThreat.y, {
          radius: this.radius,
          claimed
        });
        if (cover && this.setBotTarget(map, navigation, cover.x, cover.y, 'cover', currentTime)) {
          claimCoverPoint(blackboard, this.id, cover, currentTime);
          this.botState = 'cover';
          this.botCoverUntil = currentTime + 1250;
          choseCover = true;
        }
      }

      if (!choseCover && this.health < 38 && !hasLOS) {
        const healthItems = (map.items || [])
          .filter(item => item.active && item.type === 'health')
          .sort((a, b) => Math.hypot(this.x - a.x, this.y - a.y) - Math.hypot(this.x - b.x, this.y - b.y));
        const health = healthItems.find(item => !navigation || navigation.projectPoint(item.x, item.y, this.radius));
        if (health && this.setBotTarget(map, navigation, health.x, health.y, 'health', currentTime)) {
          this.botState = 'health';
          choseCover = true;
        }
      }

      if (!choseCover && hasLOS) {
        releaseCoverClaim(blackboard, this.id);
        this.botState = 'chase';
        if (combatEnabled && this.flashGrenades > 0 && distToPlayer > 240 && distToPlayer < 500 && Math.random() < 0.035) {
          this.throwFlashbangRequest = true;
        }

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const invDist = distToPlayer > 1 ? 1 / distToPlayer : 0;
        let targetX;
        let targetY;
        if (this.weaponKey === 'sniper' && distToPlayer < 430) {
          targetX = this.x - dx * invDist * 210;
          targetY = this.y - dy * invDist * 210;
        } else if (this.weaponKey === 'shotgun') {
          targetX = player.x - dx * invDist * 62;
          targetY = player.y - dy * invDist * 62;
        } else {
          const laneSign = this.botLaneSign || this.botStrafeDir || 1;
          const laneDistance = 145 + ((context.laneIndex || 0) % 2) * 40;
          targetX = player.x + (-dy * invDist) * laneDistance * laneSign;
          targetY = player.y + (dx * invDist) * laneDistance * laneSign;
        }
        this.setBotTarget(map, navigation, targetX, targetY, 'chase', currentTime);
      } else if (!choseCover && !hasLOS) {
        const remembered = sharedSighting || this.lastKnownPlayerPos;
        let distanceToGoal = Math.hypot(this.x - this.botTargetX, this.y - this.botTargetY);
        if ((this.botState === 'cover' && (currentTime >= this.botCoverUntil || (!this.isReloading && this.health >= 46))) ||
            (this.botState === 'health' && (this.health >= 55 || distanceToGoal < 42))) {
          this.botState = remembered ? 'search' : 'patrol';
        }
        if (remembered && (this.botState === 'chase' || this.botState === 'search' || sharedSighting)) {
          this.botState = 'search';
          this.setBotTarget(map, navigation, remembered.x, remembered.y, sharedSighting ? 'shared-sighting' : 'search', currentTime);
        }

        distanceToGoal = Math.hypot(this.x - this.botTargetX, this.y - this.botTargetY);
        if ((this.botState === 'search' && distanceToGoal < 42) ||
            (this.botState === 'patrol' && distanceToGoal < 42) ||
            !Number.isFinite(this.botTargetX) || !Number.isFinite(this.botTargetY)) {
          this.botState = 'patrol';
          this.choosePatrolPoint(map, navigation);
        }
      }
    }

    // Aim prediction is fast, but acquisition and turning are deliberately human rather than instantaneous.
    let aimError = Infinity;
    if (hasLOS) {
      const predicted = predictAimPoint(this, player, this.weapon.bulletSpeed || 15, 30);
      const acquisition = Math.max(0, Math.min(1, (currentTime - (this.botAimReadyAt - 160)) / 420));
      const phase = currentTime * 0.006 + String(this.id).length * 1.7;
      const aimNoise = Math.sin(phase) * (0.045 - acquisition * 0.026);
      const desiredAim = Math.atan2(predicted.y - this.y, predicted.x - this.x) + aimNoise;
      this.angle = rotateAngleToward(this.angle, desiredAim, 0.095 * Math.max(0.55, dtFactor));
      let delta = desiredAim - this.angle;
      while (delta < -Math.PI) delta += Math.PI * 2;
      while (delta > Math.PI) delta -= Math.PI * 2;
      aimError = Math.abs(delta);
    }

    const finalTarget = this.validateBotTarget(map, navigation, this.botTargetX, this.botTargetY);
    if (finalTarget) {
      this.botTargetX = finalTarget.x;
      this.botTargetY = finalTarget.y;
    } else {
      this.choosePatrolPoint(map, navigation);
    }

    const target = { x: this.botTargetX, y: this.botTargetY };
    // Public scalar revision is intentionally used here; snapshot() is a heavy debug export.
    const navRevision = navigation?.obstacleRevision ?? null;
    const routeAge = this.botState === 'chase' ? 620 : 1250;
    const avoidPoints = teammates
      .filter(teammate => teammate && teammate !== this && teammate.health > 0)
      .map(teammate => ({ x: teammate.x, y: teammate.y, radius: teammate.radius || 18 }));
    if (navigation && routeNeedsReplan(this.botRoute, target, currentTime, {
      maxAge: routeAge,
      targetTolerance: this.botState === 'chase' ? 34 : 18,
      navRevision,
      stuck: (this.stuckDuration || 0) > 430
    })) {
      // findPath also performs the direct-path fast path, but respects teammate
      // avoidance when that straight lane would cause squad stacking.
      const path = navigation.findPath(this.x, this.y, target.x, target.y, {
        radius: this.radius,
        avoidPoints
      });
      const safePath = path?.length ? path : [{ x: this.x, y: this.y }];
      const pathEnd = safePath.at(-1);
      const routeComplete = !!pathEnd && Math.hypot(pathEnd.x - target.x, pathEnd.y - target.y) <= this.radius + 4;
      setBotRoute(this.botRoute, safePath, target, currentTime, navRevision, this.botTargetPurpose, routeComplete);
    }

    const waypoint = navigation
      ? advanceBotRoute(this.botRoute, this.x, this.y, this.radius + 7)
      : target;
    const wpX = waypoint?.x ?? target.x;
    const wpY = waypoint?.y ?? target.y;
    const waypointDistance = Math.hypot(this.x - wpX, this.y - wpY);
    const endpointStatus = getBotRouteEndpointStatus(this.botRoute, this.x, this.y, currentTime, this.radius + 8);

    if (waypointDistance > 28) {
      if (!this.lastStuckCheckTime) {
        this.lastStuckCheckTime = currentTime;
        this.lastStuckPosX = this.x;
        this.lastStuckPosY = this.y;
        this.stuckDuration = 0;
      } else if (currentTime - this.lastStuckCheckTime > 300) {
        const moved = Math.hypot(this.x - this.lastStuckPosX, this.y - this.lastStuckPosY);
        this.stuckDuration = moved < 10 ? (this.stuckDuration || 0) + currentTime - this.lastStuckCheckTime : 0;
        this.lastStuckCheckTime = currentTime;
        this.lastStuckPosX = this.x;
        this.lastStuckPosY = this.y;
        if (this.stuckDuration > 430) invalidateBotRoute(this.botRoute);
      }
    } else {
      this.stuckDuration = 0;
    }
    if (endpointStatus.atEndpoint && endpointStatus.blockedFor > 350) invalidateBotRoute(this.botRoute);

    // A dynamically placed crate can still close a lane; clear only the crate actually ahead.
    const obstructionDuration = Math.max(this.stuckDuration || 0, endpointStatus.blockedFor);
    if (obstructionDuration > 650) {
      const moveAngle = endpointStatus.incomplete
        ? Math.atan2(target.y - this.y, target.x - this.x)
        : Math.atan2(wpY - this.y, wpX - this.x);
      const lookAheadX = this.x + Math.cos(moveAngle) * 45;
      const lookAheadY = this.y + Math.sin(moveAngle) * 45;
      const blockingCrate = (map.walls || []).find(wall =>
        wall.type === 'crate' && lookAheadX >= wall.x && lookAheadX <= wall.x + wall.w &&
        lookAheadY >= wall.y && lookAheadY <= wall.y + wall.h
      );
      if (combatEnabled && blockingCrate) {
        this.angle = Math.atan2(blockingCrate.y + blockingCrate.h / 2 - this.y, blockingCrate.x + blockingCrate.w / 2 - this.x);
        if (this.ammoInMag === 0 && !this.isReloading && this.reserveAmmo > 0) {
          this.startReload(soundEngine, currentTime);
        } else if (!this.isReloading && this.ammoInMag > 0 && currentTime - this.lastFiredTime >= (this.weapon.fireRate || 300)) {
          const shot = this.shoot(currentTime, soundEngine, 50);
          if (shot && typeof window !== 'undefined' && window.OnBotShootCallback) window.OnBotShootCallback(shot);
        }
      } else if (obstructionDuration > 1800 && this.botTargetPurpose !== 'alarm') {
        this.botState = 'patrol';
        this.choosePatrolPoint(map, navigation);
        this.stuckDuration = 0;
      }
    }

    const isRanked = gameEngine?.isRanked;
    const currentAccel = this.accel * (isRanked ? 1.25 : 1) * (this.adrenalineActive ? 1.35 : 1);
    if (waypointDistance > 10) {
      const moveAngle = Math.atan2(wpY - this.y, wpX - this.x);
      if (!hasLOS) this.angle = rotateAngleToward(this.angle, moveAngle, 0.14 * Math.max(0.7, dtFactor));
      this.vx += Math.cos(moveAngle) * currentAccel * dtFactor;
      this.vy += Math.sin(moveAngle) * currentAccel * dtFactor;
    }

    const separation = getTeammateSeparation(this, teammates);
    this.vx += separation.x * currentAccel * 1.15 * dtFactor;
    this.vy += separation.y * currentAccel * 1.15 * dtFactor;

    if (combatEnabled && hasLOS && currentTime >= this.botAimReadyAt && aimError < 0.105 && !this.isReloading && this.ammoInMag > 0 &&
        distToPlayer <= (this.weapon.range || 400) * 1.08) {
      const weaponFireRate = this.weapon.fireRate || 300;
      if (currentTime - this.lastFiredTime >= weaponFireRate) {
        const shot = this.shoot(currentTime, soundEngine, distToPlayer);
        if (shot && typeof window !== 'undefined' && window.OnBotShootCallback) window.OnBotShootCallback(shot);
      }
    }
  }

  checkLineOfSight(map, sx, sy, tx, ty) {
    const hit = map.getLineIntersection({ x: sx, y: sy }, { x: tx, y: ty });
    return !hit; // If no intersection with walls, we have Line of Sight
  }

  validateBotTarget(map, navigation, x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    if (navigation?.isPointClear?.(x, y, this.radius)) return { x, y };
    const projected = navigation?.projectPoint?.(x, y, this.radius);
    if (projected && Number.isFinite(projected.x) && Number.isFinite(projected.y)) return projected;
    if (!map?.checkCircleCollision) return null;
    const fallback = map.checkCircleCollision(x, y, this.radius);
    return Number.isFinite(fallback?.x) && Number.isFinite(fallback?.y) ? fallback : null;
  }

  setBotTarget(map, navigation, x, y, purpose = 'move', currentTime = 0, forceReplan = false) {
    const point = this.validateBotTarget(map, navigation, x, y);
    if (!point) return false;
    const changed = Math.hypot(point.x - this.botTargetX, point.y - this.botTargetY) > 12 || this.botTargetPurpose !== purpose;
    this.botTargetX = point.x;
    this.botTargetY = point.y;
    this.botTargetPurpose = purpose;
    if (changed || forceReplan) invalidateBotRoute(this.botRoute);
    return true;
  }

  resetBotRound(map, navigation) {
    this.botRoute = createBotRouteState();
    this.botState = 'patrol';
    this.botTargetPurpose = 'patrol';
    this.botAimReadyAt = 0;
    this.botAimTargetId = null;
    this.botHadLOS = false;
    this.botLastSeenAt = -Infinity;
    this.botCoverUntil = 0;
    this.lastKnownPlayerPos = null;
    this.lastStuckCheckTime = 0;
    this.stuckDuration = 0;
    return this.choosePatrolPoint(map, navigation);
  }

  choosePatrolPoint(map, navigation = null, random = Math.random) {
    const navPoint = navigation?.choosePatrolPoint?.(this.x, this.y, random);
    if (navPoint && this.setBotTarget(map, navigation, navPoint.x, navPoint.y, 'patrol', 0, true)) return navPoint;

    const rooms = map?.rooms || [];
    for (let attempt = 0; attempt < 30; attempt++) {
      const room = rooms.length ? rooms[Math.floor(random() * rooms.length)] : {
        x: 60, y: 60, w: Math.max(1, (map?.width || 200) - 120), h: Math.max(1, (map?.height || 200) - 120)
      };
      const padding = 42;
      const x = room.x + padding + random() * Math.max(1, room.w - padding * 2);
      const y = room.y + padding + random() * Math.max(1, room.h - padding * 2);
      const point = this.validateBotTarget(map, navigation, x, y);
      if (point && this.setBotTarget(map, navigation, point.x, point.y, 'patrol', 0, true)) return point;
    }
    return this.setBotTarget(map, navigation, this.x, this.y, 'patrol', 0, true)
      ? { x: this.botTargetX, y: this.botTargetY }
      : null;
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
      const maxLaserDist = (this.weapon && this.weapon.range) ? this.weapon.range : 1200;
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
    
    // Draw tiny mini healthbar above character
    const isSabotageMode = window.gameEngine && window.gameEngine.matchMode === 'sabotage';
    if (this.health > 0 && !isSabotageMode) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(this.x - 20, this.y - this.radius - 8, 40, 4);
      
      const hpColor = this.isLocal 
        ? (COLOR_THEMES[this.colorTheme]?.helmet || '#66fcf1') 
        : (this.isTeammate ? '#39db14' : '#ff3c3c');
      ctx.fillStyle = hpColor;
      ctx.fillRect(this.x - 20, this.y - this.radius - 8, 40 * (this.health / this.maxHealth), 4);
    }

    // Render local floating text (+HP / +AMMO)
    if (this.floatingText && this.floatingText.timer > 0) {
      ctx.font = 'bold 9px Orbitron';
      ctx.fillStyle = this.floatingText.color || '#ffd700';
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
