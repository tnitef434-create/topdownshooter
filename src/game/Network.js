export class Network {
  constructor(socket, localPlayer, opponentPlayer, map, particles, sound, engine) {
    this.socket = socket;
    this.localPlayer = localPlayer;
    this.opponent = opponentPlayer; // legacy fallback
    this.map = map;
    this.particles = particles;
    this.sound = sound;
    this.engine = engine;

    // Buffers for opponents state interpolation mapped by player ID
    this.opponentStateBuffers = new Map();
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
      if (!state.id) return;
      
      const remotePlayer = this.engine.remotePlayers.get(state.id);
      if (!remotePlayer) return;

      if (state.justDashed) {
        remotePlayer.justDashed = true;
      }

      if (state.health !== undefined) {
        // Only accept health updates from state packets if they are lower or equal to current health,
        // or if they indicate a round reset (health === 100).
        // This prevents the "health goes back up" glitch after hitting someone.
        // Healing (health going up) is handled authoritatively by 'opponent-health-sync' when items are picked up.
        if (state.health <= remotePlayer.health || state.health === 100) {
          remotePlayer.health = state.health;
        }
      }

      let buffer = this.opponentStateBuffers.get(state.id);
      if (!buffer) {
        buffer = [];
        this.opponentStateBuffers.set(state.id, buffer);
      }

      // Store in buffer with arrival timestamp
      buffer.push({
        time: Date.now(),
        x: state.x,
        y: state.y,
        angle: state.angle,
        vx: state.vx,
        vy: state.vy,
        health: state.health,
        weaponKey: state.weaponKey,
        isReloading: state.isReloading,
        muzzleFlash: state.muzzleFlash,
        flashlightActive: state.flashlightActive,
        inVent: state.inVent || false
      });

      // Keep buffer small (last 30 frames)
      if (buffer.length > 30) {
        buffer.shift();
      }
    });

    // 2. Receive Opponent Shooting Trigger
    this.socket.on('opponent-shoot', (shootData) => {
      const shooter = this.engine.remotePlayers.get(shootData.playerId);
      if (!shooter) return;

      // Force muzzle flash and eject shell casing visually
      shooter.muzzleFlash = 1.0;
      shooter.angle = shootData.angle;
      this.particles.spawnGunCasing(shooter.x, shooter.y, shooter.angle, shootData.weaponKey);

      // Play gunshot sound at opponent's location (muffled by distance to local player)
      if (this.sound) {
        const dist = Math.hypot(shooter.x - this.localPlayer.x, shooter.y - this.localPlayer.y);
        this.sound.playGunshot(shootData.weaponKey, dist);
      }

      // Add visual bullet tracers to engine
      this.engine.spawnBulletFromNetwork(shootData);
    });

    // 3. Receive hit notification (the opponent shot us)
    this.socket.on('damage-taken', (hitData) => {
      if (this.engine.gameState !== 'playing') return;
      if (hitData.targetId === this.localPlayer.id) {
        // Take damage locally
        this.localPlayer.takeDamage(hitData.damage, this.sound);
        
        // Broadcast updated health back to coordinate states
        const cheatActive = this.engine.devCheatActive;
        const syncedHealth = cheatActive ? Math.round(this.localPlayer.health / 2) : this.localPlayer.health;
        this.socket.emit('sync-health', {
          playerId: this.localPlayer.id,
          health: syncedHealth
        });

        // Trigger screen shake from heavy hits
        this.engine.shakeCamera(hitData.damage * 0.45);

        // Check if our team is completely eliminated
        const teamAlive = this.engine.players.some(p => p.health > 0 && p.team === this.localPlayer.team);
        if (!teamAlive) {
          this.socket.emit('player-died', {
            winnerId: hitData.shooterId,
            winnerName: 'Opponents',
            loserId: this.localPlayer.id,
            roundNumber: this.engine.roundNumber
          });
        }
      }
    });

    // 4. Coordinate Health adjustments
    this.socket.on('opponent-health-sync', (healthData) => {
      const remotePlayer = this.engine.remotePlayers.get(healthData.playerId);
      if (remotePlayer) {
        remotePlayer.health = healthData.health;
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

    // 6.5. Sabotage Alarm sync from opponent
    this.socket.on('opponent-sabotage-alarm', (alarmData) => {
      if (this.engine && this.engine.tasks) {
        const task = this.engine.tasks[alarmData.idx];
        if (task) {
          task.status = 'completed';
          task.alarmActive = true;
          task.alarmTimer = 15;
          if (this.sound) {
            const dist = Math.hypot(this.localPlayer.x - task.x, this.localPlayer.y - task.y);
            try { this.sound.playAlarmForTask(task.id, dist); } catch(e) {}
          }
        }
      }
    });

    // 7. Chat forwarding
    this.socket.on('opponent-chat', (chatData) => {
      let name = chatData.name;
      const sender = this.engine.remotePlayers.get(chatData.id);
      if (sender) name = sender.name;

      const chatEvent = new CustomEvent('opponent-chat-msg', {
        detail: { name: name, msg: chatData.msg }
      });
      window.dispatchEvent(chatEvent);
    });

    // 8. Server Round Over Event
    this.socket.on('round-over', (data) => {
      this.engine.handleServerRoundOver(data);
    });

    // 9. Server Match Over Event
    this.socket.on('match-over', (data) => {
      this.engine.handleServerMatchOver(data);
    });
  }

  // Send current state to opponent at 60Hz
  sendState(currentTime) {
    if (!this.socket) return;

    if (currentTime - this.lastSentTime >= this.sendInterval) {
      this.lastSentTime = currentTime;

      const cheatActive = this.engine.devCheatActive;
      const syncedHealth = cheatActive ? Math.round(this.localPlayer.health / 2) : this.localPlayer.health;

      const state = {
        x: this.localPlayer.x,
        y: this.localPlayer.y,
        angle: this.localPlayer.angle,
        vx: this.localPlayer.vx,
        vy: this.localPlayer.vy,
        health: syncedHealth,
        weaponKey: this.localPlayer.weaponKey,
        isReloading: this.localPlayer.isReloading,
        muzzleFlash: this.localPlayer.muzzleFlash,
        flashlightActive: this.localPlayer.flashlightActive,
        inVent: this.localPlayer.inVent || false,
        justDashed: this.localPlayer.networkJustDashed || false
      };

      this.localPlayer.networkJustDashed = false;

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
  // Interpolates all remote players' positions and rotations based on delayed server ticks
  interpolateOpponents() {
    const nowMs = Date.now();
    if (!this.lastInterpolateTime) {
      this.lastInterpolateTime = nowMs;
    }
    const dt = nowMs - this.lastInterpolateTime;
    this.lastInterpolateTime = nowMs;
    const clampedDt = Math.max(1, Math.min(100, dt));
    const dtFactor = clampedDt / 16.67;

    this.engine.remotePlayers.forEach((opponent, id) => {
      const buffer = this.opponentStateBuffers.get(id);
      if (!opponent || !buffer || buffer.length === 0) return;

      const now = Date.now();
      const renderTime = now - this.interpolationDelay;

      // Try to find two frames surrounding renderTime
      let beforeState = null;
      let afterState = null;

      for (let i = 0; i < buffer.length; i++) {
        const state = buffer[i];
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
        opponent.x = beforeState.x + (afterState.x - beforeState.x) * ratio;
        opponent.y = beforeState.y + (afterState.y - beforeState.y) * ratio;
        
        // Interpolate angles (handles wrap around 2*PI correctly)
        opponent.angle = this.lerpAngle(beforeState.angle, afterState.angle, ratio);
        
        // Fast sync status flags
        opponent.vx = beforeState.vx + (afterState.vx - beforeState.vx) * ratio;
        opponent.vy = beforeState.vy + (afterState.vy - beforeState.vy) * ratio;
        opponent.weaponKey = beforeState.weaponKey;
        opponent.isReloading = beforeState.isReloading;
        opponent.muzzleFlash = beforeState.muzzleFlash;
        opponent.flashlightActive = beforeState.flashlightActive;
        opponent.inVent = beforeState.inVent || false;
      } else {
        // Fallback: If lagging and don't have surround states, slide towards latest packet
        const latest = buffer[buffer.length - 1];
        const lerpFactor = 0.25; // responsive snap
        const currentLerp = 1 - Math.pow(1 - lerpFactor, dtFactor);
        
        opponent.x += (latest.x - opponent.x) * currentLerp;
        opponent.y += (latest.y - opponent.y) * currentLerp;
        opponent.angle = this.lerpAngle(opponent.angle, latest.angle, currentLerp);
        
        opponent.vx = latest.vx;
        opponent.vy = latest.vy;
        opponent.weaponKey = latest.weaponKey;
        opponent.isReloading = latest.isReloading;
        opponent.muzzleFlash = latest.muzzleFlash;
        opponent.flashlightActive = latest.flashlightActive;
        opponent.inVent = latest.inVent || false;
      }
    });
  }

  // Smooth angle interpolation solving wrap-around issues
  lerpAngle(a, b, t) {
    let diff = b - a;
    // Normalize to -PI to PI range
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    return a + diff * t;
  }

  destroy() {
    if (this.socket) {
      this.socket.off('opponent-state');
      this.socket.off('opponent-shoot');
      this.socket.off('damage-taken');
      this.socket.off('opponent-health-sync');
      this.socket.off('opponent-break-crate');
      this.socket.off('opponent-pickup-item');
      this.socket.off('opponent-sabotage-alarm');
      this.socket.off('opponent-chat');
      this.socket.off('round-over');
      this.socket.off('match-over');
    }
  }
}
