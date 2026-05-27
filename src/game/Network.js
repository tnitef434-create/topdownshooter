export class Network {
  constructor(socket, localPlayer, opponentPlayer, map, particles, sound, engine) {
    this.socket = socket;
    this.localPlayer = localPlayer;
    this.opponent = opponentPlayer;
    this.map = map;
    this.particles = particles;
    this.sound = sound;
    this.engine = engine;

    // Buffer for opponent state interpolation
    this.opponentStateBuffer = [];
    this.interpolationDelay = 100; // 100ms lag buffer for interpolation

    this.lastSentTime = 0;
    this.sendInterval = 1000 / 60; // Send state at 60Hz

    // Bind global reference for access in other files
    window.AppSocket = this.socket;

    if (this.socket) {
      this.setupListeners();
    }
  }

  setupListeners() {
    // 1. Receive Opponent State
    this.socket.on('opponent-state', (state) => {
      // Store in buffer with arrival timestamp
      this.opponentStateBuffer.push({
        time: Date.now(),
        x: state.x,
        y: state.y,
        angle: state.angle,
        vx: state.vx,
        vy: state.vy,
        health: state.health,
        weaponKey: state.weaponKey,
        isReloading: state.isReloading,
        muzzleFlash: state.muzzleFlash
      });

      // Keep buffer small (last 30 frames)
      if (this.opponentStateBuffer.length > 30) {
        this.opponentStateBuffer.shift();
      }
    });

    // 2. Receive Opponent Shooting Trigger
    this.socket.on('opponent-shoot', (shootData) => {
      if (!this.opponent) return;

      // Force muzzle flash and eject shell casing visually
      this.opponent.muzzleFlash = 1.0;
      this.opponent.angle = shootData.angle;
      this.particles.spawnGunCasing(this.opponent.x, this.opponent.y, this.opponent.angle, shootData.weaponKey);

      // Play gunshot sound at opponent's location
      if (this.sound) {
        this.sound.playGunshot(shootData.weaponKey);
      }

      // Add visual bullet tracers to engine
      this.engine.spawnBulletFromNetwork(shootData);
    });

    // 3. Receive hit notification (the opponent shot us)
    this.socket.on('damage-taken', (hitData) => {
      if (hitData.targetId === this.localPlayer.id) {
        // Take damage locally
        this.localPlayer.takeDamage(hitData.damage, this.sound);
        
        // Broadcast updated health back to coordinate states
        this.socket.emit('sync-health', {
          playerId: this.localPlayer.id,
          health: this.localPlayer.health
        });

        // Trigger screen shake from heavy hits
        this.engine.shakeCamera(hitData.damage * 0.45);

        // Check if dead
        if (this.localPlayer.health <= 0) {
          this.localPlayer.health = 0;
          this.socket.emit('player-died', {
            winnerId: this.opponent.id,
            winnerName: this.opponent.name,
            loserId: this.localPlayer.id
          });
        }
      }
    });

    // 4. Coordinate Health adjustments
    this.socket.on('opponent-health-sync', (healthData) => {
      if (this.opponent && healthData.playerId === this.opponent.id) {
        this.opponent.health = healthData.health;
        const bar = document.getElementById('hud-opponent-hp');
        if (bar) bar.style.width = `${Math.max(0, this.opponent.health)}%`;
      }
    });

    // 5. Crate sync from opponent
    this.socket.on('opponent-break-crate', (crateData) => {
      this.map.syncBreakCrate(crateData.crateId, crateData.spawnedItem);
      // Play crate break sounds
      if (this.sound) {
        this.sound.playCrateBreak();
      }
      this.particles.spawnCrateSplinters(crateData.crateX || 0, crateData.crateY || 0);
    });

    // 6. Item Pickups sync from opponent
    this.socket.on('opponent-pickup-item', (pickupData) => {
      const item = this.map.items.find(i => i.id === pickupData.itemId);
      if (item) {
        item.active = false;
        if (this.sound) this.sound.playPickup();
      }
    });

    // 7. Chat forwarding
    this.socket.on('opponent-chat', (chatData) => {
      // Dispatch custom event to main.js UI
      const chatEvent = new CustomEvent('opponent-chat-msg', {
        detail: { name: chatData.name, msg: chatData.msg }
      });
      window.dispatchEvent(chatEvent);
    });
  }

  // Send current state to opponent at 60Hz
  sendState(currentTime) {
    if (!this.socket) return;

    if (currentTime - this.lastSentTime >= this.sendInterval) {
      this.lastSentTime = currentTime;

      const state = {
        x: this.localPlayer.x,
        y: this.localPlayer.y,
        angle: this.localPlayer.angle,
        vx: this.localPlayer.vx,
        vy: this.localPlayer.vy,
        health: this.localPlayer.health,
        weaponKey: this.localPlayer.weaponKey,
        isReloading: this.localPlayer.isReloading,
        muzzleFlash: this.localPlayer.muzzleFlash
      };

      this.socket.emit('player-state', state);
    }
  }

  // Broadcast local shoots online
  sendShoot(shootData) {
    if (this.socket) {
      this.socket.emit('shoot', shootData);
    }
  }

  // --- Entity Interpolation loop ---
  // Interpolates the opponent's position and rotation based on delayed server ticks
  interpolateOpponent() {
    if (!this.opponent || this.opponentStateBuffer.length === 0) return;

    const now = Date.now();
    const renderTime = now - this.interpolationDelay;

    // Try to find two frames surrounding renderTime
    let beforeState = null;
    let afterState = null;

    for (let i = 0; i < this.opponentStateBuffer.length; i++) {
      const state = this.opponentStateBuffer[i];
      if (state.time <= renderTime) {
        beforeState = state;
      } else {
        afterState = state;
        break; // found the future frame
      }
    }

    if (beforeState && afterState) {
      // Linear Interpolation ratio (0.0 to 1.0)
      const total = afterState.time - beforeState.time;
      const ratio = total > 0 ? (renderTime - beforeState.time) / total : 0;

      // Lerp positions
      this.opponent.x = beforeState.x + (afterState.x - beforeState.x) * ratio;
      this.opponent.y = beforeState.y + (afterState.y - beforeState.y) * ratio;
      
      // Interpolate angles (handles wrap around 2*PI correctly)
      this.opponent.angle = this.lerpAngle(beforeState.angle, afterState.angle, ratio);
      
      // Fast sync status flags
      this.opponent.vx = beforeState.vx + (afterState.vx - beforeState.vx) * ratio;
      this.opponent.vy = beforeState.vy + (afterState.vy - beforeState.vy) * ratio;
      this.opponent.health = beforeState.health;
      this.opponent.weaponKey = beforeState.weaponKey;
      this.opponent.isReloading = beforeState.isReloading;
      this.opponent.muzzleFlash = beforeState.muzzleFlash;
    } else {
      // Fallback: If lagging and don't have surround states, slide towards latest packet
      const latest = this.opponentStateBuffer[this.opponentStateBuffer.length - 1];
      const lerpFactor = 0.25; // responsive snap
      
      this.opponent.x += (latest.x - this.opponent.x) * lerpFactor;
      this.opponent.y += (latest.y - this.opponent.y) * lerpFactor;
      this.opponent.angle = this.lerpAngle(this.opponent.angle, latest.angle, lerpFactor);
      
      this.opponent.vx = latest.vx;
      this.opponent.vy = latest.vy;
      this.opponent.health = latest.health;
      this.opponent.weaponKey = latest.weaponKey;
      this.opponent.isReloading = latest.isReloading;
      this.opponent.muzzleFlash = latest.muzzleFlash;
    }

    // Keep HUD updated
    const bar = document.getElementById('hud-opponent-hp');
    if (bar) bar.style.width = `${Math.max(0, this.opponent.health)}%`;
  }

  // Smooth angle interpolation solving wrap-around issues
  lerpAngle(a, b, t) {
    let diff = b - a;
    // Normalize to -PI to PI range
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    return a + diff * t;
  }
}
