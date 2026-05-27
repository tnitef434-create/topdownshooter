const WEAPON_DEFS = {
  pistol: { name: 'Tactical 9mm', damage: 22, fireRate: 300, accuracy: 0.95, magSize: 12, range: 400, reloadTime: 1200, speedMultiplier: 1.0, type: 'Semi-Auto', recoil: 3, bulletSpeed: 14 },
  rifle: { name: 'Assault Rifle (M4A1)', damage: 26, fireRate: 110, accuracy: 0.88, magSize: 30, range: 600, reloadTime: 2200, speedMultiplier: 1.0, type: 'Automatic', recoil: 4.5, bulletSpeed: 16 },
  shotgun: { name: 'Shotgun (Remington 870)', damage: 14, fireRate: 850, accuracy: 0.65, magSize: 6, range: 250, reloadTime: 2800, speedMultiplier: 1.0, type: 'Pump-Action', pellets: 7, recoil: 12, bulletSpeed: 12 },
  sniper: { name: 'Sniper Rifle (AWM)', damage: 95, fireRate: 1500, accuracy: 0.99, magSize: 5, range: 1200, reloadTime: 2800, speedMultiplier: 1.0, type: 'Bolt-Action', recoil: 18, bulletSpeed: 24 },
  smg: { name: 'SMG (MP5)', damage: 18, fireRate: 75, accuracy: 0.82, magSize: 30, range: 350, reloadTime: 1500, speedMultiplier: 1.0, type: 'Automatic', recoil: 2.2, bulletSpeed: 13 },
  lmg: { name: 'LMG (M249)', damage: 25, fireRate: 85, accuracy: 0.75, magSize: 100, range: 550, reloadTime: 4500, speedMultiplier: 1.0, type: 'Automatic', recoil: 6.0, bulletSpeed: 15 },
  dmr: { name: 'DMR (M14 EBR)', damage: 45, fireRate: 400, accuracy: 0.94, magSize: 20, range: 800, reloadTime: 2400, speedMultiplier: 1.0, type: 'Semi-Auto', recoil: 8.5, bulletSpeed: 20 }
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
    this.weaponKey = weaponKey;
    this.weapon = { ...WEAPON_DEFS[weaponKey] };
    
    // Ammunition
    this.ammoInMag = this.weapon.magSize;
    this.reserveAmmo = this.weapon.magSize * 3; // 3 extra magazines
    this.maxReserveAmmo = this.weapon.magSize * 5;
    
    // Status Flags
    this.isReloading = false;
    this.reloadStartTime = 0;
    this.lastFiredTime = 0;
    
    // Movement configuration
    this.accel = 0.20;
    this.maxSpeed = 2.2;
    this.friction = 0.84;
    
    // Visual indicators
    this.muzzleFlash = 0; // opacity timer
    this.footstepTimer = 0;
    
    // AI Bot State (if isBot)
    this.botTargetX = x;
    this.botTargetY = y;
    this.botState = 'patrol'; // patrol, chase, search
    this.lastKnownPlayerPos = null;
    this.botReactTime = 0;
    this.botLastDecisionTime = 0;
    this.botShootDelay = 0;
  }

  changeWeapon(weaponKey) {
    this.weaponKey = weaponKey;
    this.weapon = { ...WEAPON_DEFS[weaponKey] };
    this.ammoInMag = this.weapon.magSize;
    this.reserveAmmo = this.weapon.magSize * 3;
    this.isReloading = false;
  }

  update(keys, mouse, map, soundEngine, currentTime, target, localPlayer) {
    if (this.health <= 0) return;

    // --- 1. Movement logic ---
    if (this.isLocal && !this.isBot) {
      this.handleLocalInput(keys, mouse, soundEngine, currentTime);
    } else if (this.isBot && target) {
      this.handleBotAI(map, soundEngine, currentTime, target, localPlayer);
    }

    // Apply speed multiplier based on carrying weapon weight
    const speedMod = this.weapon.speedMultiplier;
    let currentMaxSpeed = this.maxSpeed * speedMod;

    // Apply physics
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Clamp speed
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > currentMaxSpeed) {
      this.vx = (this.vx / speed) * currentMaxSpeed;
      this.vy = (this.vy / speed) * currentMaxSpeed;
    }

    // Collision detection against map walls & sliding response
    const nextX = this.x + this.vx;
    const nextY = this.y + this.vy;
    
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
          const distToLocal = localPlayer 
            ? Math.hypot(this.x - localPlayer.x, this.y - localPlayer.y) 
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
      this.muzzleFlash -= 0.15;
    }
  }

  handleLocalInput(keys, mouse, soundEngine, currentTime) {
    // WASD movement inputs
    let ax = 0;
    let ay = 0;
    if (keys['w'] || keys['arrowup']) ay -= this.accel;
    if (keys['s'] || keys['arrowdown']) ay += this.accel;
    if (keys['a'] || keys['arrowleft']) ax -= this.accel;
    if (keys['d'] || keys['arrowright']) ax += this.accel;

    // Normalize diagonal acceleration
    if (ax !== 0 && ay !== 0) {
      ax *= 0.7071;
      ay *= 0.7071;
    }

    this.vx += ax;
    this.vy += ay;

    // Point angle towards mouse cursor
    // Mouse coords are screen-space relative to player offset
    this.angle = mouse.angle;

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

    // Fire cooldown check
    if (currentTime - this.lastFiredTime < this.weapon.fireRate) {
      return null;
    }

    // Ammo check
    if (this.ammoInMag <= 0) {
      if (soundEngine) soundEngine.playDryFire();
      this.lastFiredTime = currentTime;
      
      // Auto reload
      if (this.reserveAmmo > 0) {
        this.startReload(soundEngine, currentTime);
      }
      return null;
    }

    // Success fire
    this.ammoInMag--;
    this.lastFiredTime = currentTime;
    this.muzzleFlash = 1.0;

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
          }
        } else {
          const maxAmmo = this.weapon.magSize * 2;
          this.reserveAmmo = Math.min(this.maxReserveAmmo, this.reserveAmmo + maxAmmo);
          if (this.isLocal && !this.isBot) {
            this.updateHUD();
            this.showTextNotification('+AMMO');
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
  handleBotAI(map, soundEngine, currentTime, player, localPlayer) {
    // Check line of sight to player
    const distToPlayer = Math.hypot(this.x - player.x, this.y - player.y);
    const hasLOS = distToPlayer < 700 && this.checkLineOfSight(map, this.x, this.y, player.x, player.y);

    const timeDiff = currentTime - this.botLastDecisionTime;

    // AI State Machine decisions every 250ms
    if (timeDiff > 250) {
      this.botLastDecisionTime = currentTime;

      // Dynamic weapon swapping (advanced AI)
      if (this.health < 40 && Math.random() < 0.2) {
        // steer to search for health pickups if low HP
        const healthItems = map.items.filter(i => i.active && i.type === 'health');
        if (healthItems.length > 0) {
          // find nearest health
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

        // Movement strategy depending on weapon range
        if (this.weaponKey === 'sniper') {
          // Sniper wants to keep distance
          if (distToPlayer < 400) {
            // run backward
            this.botTargetX = this.x - Math.cos(this.angle) * 200;
            this.botTargetY = this.y - Math.sin(this.angle) * 200;
          } else {
            // stand still and aim
            this.botTargetX = this.x;
            this.botTargetY = this.y;
          }
        } else if (this.weaponKey === 'shotgun') {
          // Shotgun wants to rush the player
          this.botTargetX = player.x;
          this.botTargetY = player.y;
        } else {
          // Rifle/Pistol circular strafing
          const angleOffset = Math.random() > 0.5 ? Math.PI/2 : -Math.PI/2;
          this.botTargetX = player.x + Math.cos(this.angle + angleOffset) * 200;
          this.botTargetY = player.y + Math.sin(this.angle + angleOffset) * 200;
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
          // Reached last known pos but player is gone, patrol randomly
          const distToTarget = Math.hypot(this.x - this.botTargetX, this.y - this.botTargetY);
          if (distToTarget < 50) {
            this.botState = 'patrol';
            this.choosePatrolPoint(map);
          }
        } else {
          // Patrol state
          const distToTarget = Math.hypot(this.x - this.botTargetX, this.y - this.botTargetY);
          if (distToTarget < 50 || Math.random() < 0.05) {
            this.choosePatrolPoint(map);
          }
        }
      }
    }

    // Steering movement towards target
    const distToTarget = Math.hypot(this.x - this.botTargetX, this.y - this.botTargetY);
    if (distToTarget > 10) {
      const moveAngle = Math.atan2(this.botTargetY - this.y, this.botTargetX - this.x);
      
      // Face movement direction if not in combat, otherwise face player
      if (this.botState !== 'chase') {
        this.angle = moveAngle;
      }
      
      this.vx += Math.cos(moveAngle) * this.accel;
      this.vy += Math.sin(moveAngle) * this.accel;
    }

    // Shooting behavior when chasing
    if (this.botState === 'chase' && hasLOS && !this.isReloading && this.ammoInMag > 0) {
      // Small reaction delay simulation
      if (Math.random() < 0.35) {
        // Calculate distance to local player (listener) for gunshot muffling
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
    // Choose a random location on the map that is not inside a wall
    let attempts = 0;
    while (attempts < 20) {
      attempts++;
      const rx = Math.random() * (map.width - 160) + 80;
      const ry = Math.random() * (map.height - 160) + 80;
      
      // verify not overlapping walls
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
        break;
      }
    }
  }

  // Draw player operative on canvas
  draw(ctx, configSettings = { laser: true }) {
    if (this.health <= 0) {
      // Draw death pool
      ctx.save();
      ctx.fillStyle = 'rgba(180, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.save();

    // Laser Sight (only for local player, or if settings enabled)
    if (configSettings.laser && this.isLocal && !this.isReloading) {
      ctx.strokeStyle = 'rgba(102, 252, 241, 0.45)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      // Cast a thin ray forward
      const maxLaserDist = 1200;
      const laserEnd = {
        x: this.x + Math.cos(this.angle) * maxLaserDist,
        y: this.y + Math.sin(this.angle) * maxLaserDist
      };
      
      ctx.lineTo(laserEnd.x, laserEnd.y);
      ctx.stroke();
    }

    // Set rotation around center
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // --- Draw Operative ---

    // 1. Draw Weapon Barrel
    ctx.fillStyle = '#444';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    let barrelLength = 18;
    let barrelWidth = 4;
    let handOffset = 10;

    if (this.weaponKey === 'rifle') {
      barrelLength = 24;
      barrelWidth = 5;
      handOffset = 12;
    } else if (this.weaponKey === 'shotgun') {
      barrelLength = 22;
      barrelWidth = 6;
      handOffset = 11;
    } else if (this.weaponKey === 'sniper') {
      barrelLength = 32;
      barrelWidth = 4;
      handOffset = 14;
      // Draw Scope block
      ctx.fillRect(8, -5, 6, 3);
    } else if (this.weaponKey === 'smg') {
      barrelLength = 16;
      barrelWidth = 4;
      handOffset = 9;
    } else if (this.weaponKey === 'lmg') {
      barrelLength = 26;
      barrelWidth = 7;
      handOffset = 13;
      // Draw drum mag visual details
      ctx.fillStyle = '#222';
      ctx.fillRect(6, -8, 6, 16);
    } else if (this.weaponKey === 'dmr') {
      barrelLength = 28;
      barrelWidth = 5;
      handOffset = 12;
      // Draw Scope block
      ctx.fillRect(10, -4, 5, 2);
    }

    // Barrel
    ctx.fillRect(10, -barrelWidth / 2, barrelLength, barrelWidth);
    ctx.strokeRect(10, -barrelWidth / 2, barrelLength, barrelWidth);

    // Muzzle Flash
    if (this.muzzleFlash > 0) {
      ctx.save();
      ctx.translate(10 + barrelLength, 0);
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

    // 2. Draw Shoulders & Body Circle
    const theme = COLOR_THEMES[this.colorTheme] || COLOR_THEMES[this.isLocal ? 'cyan' : 'red'];
    const bodyColor = theme.body;
    const armorColor = theme.armor;
    const helmetColor = theme.helmet;

    // Hands gripping weapon
    ctx.fillStyle = armorColor;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    // Left hand
    ctx.beginPath();
    ctx.arc(8, -handOffset, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Right hand
    ctx.beginPath();
    ctx.arc(14, handOffset - 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Shoulders base oval
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius, this.radius + 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Tactical Vest padding
    ctx.fillStyle = armorColor;
    ctx.beginPath();
    ctx.ellipse(-3, 0, this.radius - 4, this.radius - 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Head & Helmet
    ctx.fillStyle = helmetColor;
    ctx.beginPath();
    ctx.arc(-2, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Visor strip
    ctx.fillStyle = '#111';
    ctx.fillRect(1, -5, 3, 10);

    ctx.restore();

    // 4. Floating HUD text above player (Operative name / pickups)
    ctx.save();
    ctx.textAlign = 'center';
    
    const nameColor = this.isLocal 
      ? (COLOR_THEMES[this.colorTheme]?.helmet || '#66fcf1')
      : (this.isTeammate ? '#39db14' : '#ff3c3c');
      
    ctx.fillStyle = nameColor;
    ctx.font = '10px Orbitron';
    ctx.fillText(this.name.toUpperCase(), this.x, this.y - this.radius - 12);
    
    // Draw tiny mini healthbar above opponent/bot
    if (!this.isLocal && this.health > 0) {
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
}
