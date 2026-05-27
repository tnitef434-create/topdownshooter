import { Player } from './Player.js';
import { Bullet } from './Bullet.js';
import { Map } from './Map.js';
import { ParticleEngine } from './Particle.js';
import { Sound } from './Sound.js';
import { Network } from './Network.js';

export class Engine {
  constructor(canvasId, config) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    this.mode = config.mode; // 'online' | 'offline'
    this.socket = config.socket;
    
    // Map dimensions
    this.mapWidth = 1400;
    this.mapHeight = 1400;
    
    // Seeded map & item configuration
    this.map = new Map(this.mapWidth, this.mapHeight, config.seed);
    
    // Sound & particles setup
    this.sound = new Sound();
    this.sound.setVolume((config.settings.volume !== undefined) ? config.settings.volume : 0.5);
    this.particles = new ParticleEngine();
    this.particles.setBloodEnabled(config.settings.blood);
    this.settings = config.settings;
    
    // Global identifiers
    window.LocalPlayerId = config.localPlayerId;
    window.IsOfflineMode = (this.mode === 'offline');
    
    // Spawn positions (P1 spawns top-left, P2 bottom-right)
    const p1Spawn = { x: 150, y: 150 };
    const p2Spawn = { x: this.mapWidth - 150, y: this.mapHeight - 150 };
    
    const isP1 = this.mode === 'offline' || this.socket.id === config.localPlayerId;
    const localSpawn = isP1 ? p1Spawn : p2Spawn;
    const oppSpawn = isP1 ? p2Spawn : p1Spawn;
    
    // Operatives
    this.localPlayer = new Player(
      config.localPlayerId, 
      localSpawn.x, 
      localSpawn.y, 
      config.localPlayerName, 
      config.localWeapon, 
      true, 
      false
    );
    
    const isOpponentBot = (this.mode === 'offline');
    this.opponent = new Player(
      config.opponentId, 
      oppSpawn.x, 
      oppSpawn.y, 
      config.opponentName, 
      config.opponentWeapon, 
      false, 
      isOpponentBot
    );
    
    this.players = [this.localPlayer, this.opponent];
    this.bullets = [];
    
    // Network component
    this.network = null;
    if (this.mode === 'online') {
      this.network = new Network(
        this.socket, 
        this.localPlayer, 
        this.opponent, 
        this.map, 
        this.particles, 
        this.sound, 
        this
      );
    }
    
    // Match Stats trackers
    window.MatchStats = {
      roundsWon: 0,
      damageDealt: 0,
      shotsFired: 0,
      accuracy: 0,
      hitsRegistered: 0
    };
    
    // Callback handlers
    this.onMatchEnd = config.onMatchEnd;
    this.onKillFeed = config.onKillFeed;
    
    // Camera settings
    this.camera = { x: this.localPlayer.x, y: this.localPlayer.y, shakeX: 0, shakeY: 0 };
    this.cameraShake = 0;
    this.zoom = 1.0;
    
    // Game state phases
    this.gameState = 'warmup'; // warmup, countdown, playing, round-over, match-over
    this.roundNumber = 1;
    this.scoreSelf = 0;
    this.scoreOpponent = 0;
    this.countdownTimer = 3; // countdown seconds
    this.matchTime = 120; // 2 minutes round time limit
    
    // Timing
    this.lastTime = performance.now();
    this.roundStartTime = 0;
    this.countdownStart = 0;
    this.matchTimerInterval = null;
    
    // Controls binding
    this.keys = {};
    this.mouse = { x: 0, y: 0, gameX: 0, gameY: 0, angle: 0, clicked: false };
    
    // Setup
    this.resizeCanvas();
    this.setupControls();
    
    // Start warmups
    this.startRoundCycle();
    
    // Begin main animation loop
    this.active = true;
    this.loop();

    // Trigger local HUD loadouts
    this.localPlayer.updateHUD();
    this.updateScoreboardHUD();

    // Expose bot shot coordinate handler in offline mode
    if (this.mode === 'offline') {
      window.OnBotShootCallback = (shootData) => {
        this.particles.spawnGunCasing(this.opponent.x, this.opponent.y, this.opponent.angle, shootData.weaponKey);
        this.spawnBulletFromNetwork(shootData);
      };
    }
  }

  // Handle browser window resize
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setupControls() {
    this.resizeHandler = () => this.resizeCanvas();
    window.addEventListener('resize', this.resizeHandler);

    // Keyboard registers
    this.keydownHandler = (e) => {
      // Disable key bindings if typing in chat
      const chatInput = document.getElementById('chat-input');
      if (chatInput && document.activeElement === chatInput) {
        return;
      }
      this.keys[e.key.toLowerCase()] = true;
    };
    this.keyupHandler = (e) => {
      this.keys[e.key.toLowerCase()] = false;
    };
    
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);

    // Mouse aim trackers
    this.mousemoveHandler = (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      
      // Calculate coordinates relative to screen center (camera focal point)
      const dx = this.mouse.x - this.canvas.width / 2;
      const dy = this.mouse.y - this.canvas.height / 2;
      this.mouse.angle = Math.atan2(dy, dx);
    };

    this.mousedownHandler = (e) => {
      if (e.button === 0) { // left click
        const chatInput = document.getElementById('chat-input');
        if (chatInput && document.activeElement === chatInput) return;
        this.mouse.clicked = true;
      }
    };
    this.mouseupHandler = (e) => {
      if (e.button === 0) {
        this.mouse.clicked = false;
      }
    };

    window.addEventListener('mousemove', this.mousemoveHandler);
    window.addEventListener('mousedown', this.mousedownHandler);
    window.addEventListener('mouseup', this.mouseupHandler);
  }

  destroy() {
    this.active = false;
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
    window.removeEventListener('mousemove', this.mousemoveHandler);
    window.removeEventListener('mousedown', this.mousedownHandler);
    window.removeEventListener('mouseup', this.mouseupHandler);
    
    if (this.matchTimerInterval) {
      clearInterval(this.matchTimerInterval);
    }
    
    this.particles.clear();
    window.OnBotShootCallback = null;
    window.AppSocket = null;
  }

  updateSettings(settings) {
    if (this.sound) this.sound.setVolume(settings.volume);
    if (this.particles) this.particles.setBloodEnabled(settings.blood);
    this.settings = settings;
  }

  // Camera Shake trigger
  shakeCamera(intensity) {
    this.cameraShake = Math.max(this.cameraShake, intensity);
  }

  // Spawns bullet relayed from opposing client / AI
  spawnBulletFromNetwork(shootData) {
    if (shootData.pellets && shootData.pellets > 1) {
      // Shotgun spread
      for (let i = 0; i < shootData.pellets; i++) {
        this.bullets.push(new Bullet(shootData));
      }
    } else {
      this.bullets.push(new Bullet(shootData));
    }
  }

  // --- Round & Match Cycles ---
  startRoundCycle() {
    this.gameState = 'countdown';
    this.countdownTimer = 3;
    this.countdownStart = performance.now();
    
    const p1Spawn = { x: 150, y: 150 };
    const p2Spawn = { x: this.mapWidth - 150, y: this.mapHeight - 150 };
    
    const isP1 = this.mode === 'offline' || this.socket.id === window.LocalPlayerId;
    const localSpawn = isP1 ? p1Spawn : p2Spawn;
    const oppSpawn = isP1 ? p2Spawn : p1Spawn;
    
    // Reset operatives
    this.localPlayer.x = localSpawn.x;
    this.localPlayer.y = localSpawn.y;
    this.localPlayer.vx = 0;
    this.localPlayer.vy = 0;
    this.localPlayer.health = 100;
    this.localPlayer.ammoInMag = this.localPlayer.weapon.magSize;
    this.localPlayer.reserveAmmo = this.localPlayer.weapon.magSize * 3;
    this.localPlayer.isReloading = false;
    this.localPlayer.floatingText = null;

    this.opponent.x = oppSpawn.x;
    this.opponent.y = oppSpawn.y;
    this.opponent.vx = 0;
    this.opponent.vy = 0;
    this.opponent.health = 100;
    this.opponent.ammoInMag = this.opponent.weapon.magSize;
    this.opponent.reserveAmmo = this.opponent.weapon.magSize * 3;
    this.opponent.isReloading = false;

    if (this.opponent.isBot) {
      this.opponent.botState = 'patrol';
      this.opponent.choosePatrolPoint(this.map);
    }
    
    // Clear dynamic bullet trails and particles for fresh round
    this.bullets = [];
    this.particles.clear();
    this.map.generateMap(); // Regen crate positions
    
    // Sync HUD displays
    this.localPlayer.updateHUD();
    
    // Tick round timer interval
    if (this.matchTimerInterval) clearInterval(this.matchTimerInterval);
    this.matchTime = 120;
    
    const hudStatus = document.getElementById('hud-status');
    if (hudStatus) hudStatus.innerText = `ROUND ${this.roundNumber} - COOLDOWN`;
    
    // Sound FX init
    this.sound.playFrictionalScrape(performance.now()/1000, 0.5, 0.1);
  }

  startRoundAction() {
    this.gameState = 'playing';
    this.roundStartTime = performance.now();
    
    const hudStatus = document.getElementById('hud-status');
    if (hudStatus) hudStatus.innerText = 'ENGAGE TARGET';
    
    // Start countdown timer ticking down
    this.matchTimerInterval = setInterval(() => {
      if (this.gameState === 'playing') {
        this.matchTime--;
        if (this.matchTime <= 0) {
          this.matchTime = 0;
          this.endRound(null, 'TIME EXPIRED'); // draw
        }
        
        // Update clock HUD
        const mins = Math.floor(this.matchTime / 60).toString().padStart(2, '0');
        const secs = (this.matchTime % 60).toString().padStart(2, '0');
        const timerDisplay = document.getElementById('game-timer');
        if (timerDisplay) timerDisplay.innerText = `${mins}:${secs}`;
      }
    }, 1000);
  }

  // Triggered when a player dies or time runs out
  endRound(winnerId, killFeedMsg = '') {
    if (this.gameState !== 'playing') return;
    
    this.gameState = 'round-over';
    if (this.matchTimerInterval) clearInterval(this.matchTimerInterval);

    let feedAlert = document.getElementById('hud-status');

    if (winnerId === this.localPlayer.id) {
      this.scoreSelf++;
      if (feedAlert) {
        feedAlert.innerText = 'ROUND WON';
        feedAlert.style.color = '#39ff14';
      }
      if (this.onKillFeed && killFeedMsg) {
        this.onKillFeed(this.localPlayer.name, this.opponent.name, this.localPlayer.weaponKey);
      }
    } else if (winnerId === this.opponent.id) {
      this.scoreOpponent++;
      if (feedAlert) {
        feedAlert.innerText = 'ROUND LOST';
        feedAlert.style.color = '#ff3c3c';
      }
      if (this.onKillFeed && killFeedMsg) {
        this.onKillFeed(this.opponent.name, this.localPlayer.name, this.opponent.weaponKey);
      }
    } else {
      if (feedAlert) {
        feedAlert.innerText = 'ROUND DRAW';
        feedAlert.style.color = '#ffd700';
      }
    }

    this.updateScoreboardHUD();

    // Check if match over (First to 3 rounds won)
    if (this.scoreSelf >= 3 || this.scoreOpponent >= 3) {
      setTimeout(() => this.endMatch(), 2000);
    } else {
      this.roundNumber++;
      // Restart round cycle after 3s
      setTimeout(() => this.startRoundCycle(), 3000);
    }
  }

  endMatch() {
    this.gameState = 'match-over';
    this.active = false;
    
    // Accumulate final accuracy
    const totalShots = window.MatchStats.shotsFired || 1;
    const accuracyVal = (window.MatchStats.hitsRegistered / totalShots) * 100;
    window.MatchStats.accuracy = accuracyVal;
    window.MatchStats.roundsWon = this.scoreSelf;
    window.MatchStats.winnerId = this.scoreSelf >= 3 ? this.localPlayer.id : this.opponent.id;

    // Trigger end match callback sound FX
    if (this.scoreSelf >= 3) {
      this.sound.playMatchWin();
    } else {
      this.sound.playMatchLose();
    }

    if (this.onMatchEnd) {
      this.onMatchEnd(window.MatchStats);
    }
  }

  endGameDueToDisconnect(msg) {
    this.gameState = 'match-over';
    this.active = false;
    alert(msg);
    // Force return
    const returnBtn = document.getElementById('btn-return-lobby');
    if (returnBtn) returnBtn.click();
  }

  updateScoreboardHUD() {
    const scoreSelf = document.getElementById('score-self');
    if (scoreSelf) scoreSelf.innerText = this.scoreSelf;
    
    const scoreOpponent = document.getElementById('score-opponent');
    if (scoreOpponent) scoreOpponent.innerText = this.scoreOpponent;
    
    const selfName = document.getElementById('hud-self-name');
    if (selfName) selfName.innerText = this.localPlayer.name.toUpperCase();
    
    const opponentName = document.getElementById('hud-opponent-name');
    if (opponentName) opponentName.innerText = this.opponent.name.toUpperCase();
    
    const opponentWeapon = document.getElementById('hud-opponent-weapon');
    if (opponentWeapon) opponentWeapon.innerText = this.opponent.weapon.name.toUpperCase();
    
    const opponentIndicator = document.getElementById('opponent-indicator');
    if (opponentIndicator) {
      opponentIndicator.className = 'op-indicator online';
    }
  }

  // --- Main Loop tick ---
  loop() {
    if (!this.active) return;
    
    const now = performance.now();
    const dt = now - this.lastTime;
    this.lastTime = now;

    this.update(now);
    this.render();

    requestAnimationFrame(() => this.loop());
  }

  // Core Game State Update
  update(currentTime) {
    // 1. Process Round countdowns
    if (this.gameState === 'countdown') {
      const elapsed = (currentTime - this.countdownStart) / 1000;
      const count = 3 - Math.floor(elapsed);
      
      if (count !== this.countdownTimer && count >= 0) {
        this.countdownTimer = count;
        // Play click tone
        this.sound.playMetallicClick(currentTime/1000, 1000, 0.05, 0.2);
      }
      
      if (count > 0) {
        const hudStatus = document.getElementById('hud-status');
        if (hudStatus) hudStatus.innerText = `DEPLOYING IN ${count}...`;
      } else {
        this.sound.playMetallicClick(currentTime/1000, 2000, 0.15, 0.35); // final beep
        this.startRoundAction();
      }
    }

    // 2. Update Operatives (Player / Opponent)
    if (this.gameState === 'playing' || this.gameState === 'countdown') {
      this.localPlayer.update(this.keys, this.mouse, this.map, this.sound, currentTime, null);
      
      if (this.mode === 'offline') {
        // Update bot AI
        this.opponent.update(null, null, this.map, this.sound, currentTime, this.localPlayer);
      } else {
        // Online opponent is updated by interpolating server states
        this.network.interpolateOpponent();
      }

      // Check item collisions
      this.localPlayer.checkPickups(this.map, this.sound);
      if (this.mode === 'offline') {
        this.opponent.checkPickups(this.map, this.sound);
      }
    }

    // Local Player shooting controller
    if (this.gameState === 'playing' && this.mouse.clicked && !this.localPlayer.isReloading) {
      // Auto weapons fire repeatedly, semi-autos require clicking
      const isAuto = this.localPlayer.weapon.type === 'Automatic';
      const timeSinceLast = currentTime - this.localPlayer.lastFiredTime;
      
      if (isAuto || timeSinceLast > this.localPlayer.weapon.fireRate) {
        const shootData = this.localPlayer.shoot(currentTime, this.sound);
        if (shootData) {
          window.MatchStats.shotsFired += shootData.pellets || 1;
          
          // Apply screen shake based on recoil force
          this.shakeCamera(shootData.recoil * 0.7);

          // Eject shell casing particles locally
          this.particles.spawnGunCasing(this.localPlayer.x, this.localPlayer.y, this.localPlayer.angle, this.localPlayer.weaponKey);

          // Generate local bullets
          if (shootData.pellets && shootData.pellets > 1) {
            // Shotgun spread
            for (let i = 0; i < shootData.pellets; i++) {
              this.bullets.push(new Bullet(shootData));
            }
          } else {
            this.bullets.push(new Bullet(shootData));
          }

          // Broadcast shooting event in multiplayer
          if (this.mode === 'online') {
            this.network.sendShoot(shootData);
          }

          // Force release click if Semi-Auto/Pump/Bolt action
          if (!isAuto) {
            this.mouse.clicked = false;
          }
        }
      }
    }

    // 3. Update Bullets and resolve hits
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.update(this.map, this.players, this.particles, this.sound);
      
      if (!b.active) {
        // Collect local hits statistics for accuracy
        if (b.playerId === this.localPlayer.id) {
          window.MatchStats.hitsRegistered++;
        }
        this.bullets.splice(i, 1);
      }
    }

    // 4. Update Particle animations
    this.particles.update(this.map);

    // 5. Check local kill checks
    if (this.gameState === 'playing') {
      if (this.opponent.health <= 0 && this.localPlayer.health > 0) {
        this.endRound(this.localPlayer.id, 'eliminated');
      } else if (this.localPlayer.health <= 0 && this.opponent.health > 0) {
        this.endRound(this.opponent.id, 'eliminated');
      } else if (this.localPlayer.health <= 0 && this.opponent.health <= 0) {
        this.endRound(null, 'both dead'); // draw
      }
    }

    // 6. Camera follows local player with smooth interpolations
    // Peek ahead feature: shifts camera 25% towards mouse cursor direction
    const mouseOffsetMax = 0.25;
    const camTargetX = this.localPlayer.x + (this.mouse.x - this.canvas.width / 2) * mouseOffsetMax;
    const camTargetY = this.localPlayer.y + (this.mouse.y - this.canvas.height / 2) * mouseOffsetMax;
    
    this.camera.x += (camTargetX - this.camera.x) * 0.085;
    this.camera.y += (camTargetY - this.camera.y) * 0.085;

    // Decay camera shake
    if (this.cameraShake > 0.1) {
      this.camera.shakeX = (Math.random() - 0.5) * this.cameraShake;
      this.camera.shakeY = (Math.random() - 0.5) * this.cameraShake;
      this.cameraShake *= 0.88; // decay
    } else {
      this.camera.shakeX = 0;
      this.camera.shakeY = 0;
      this.cameraShake = 0;
    }

    // 7. Relay state over network (60Hz throttled)
    if (this.mode === 'online' && (this.gameState === 'playing' || this.gameState === 'countdown')) {
      this.network.sendState(currentTime);
    }
  }

  // Core Render loop
  render() {
    // Clear canvas
    this.ctx.fillStyle = '#06070a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Dynamic scale/zoom sizing helper based on resolution
    const baseWidth = 1920;
    const scaleFactor = Math.max(0.65, Math.min(1.2, this.canvas.width / baseWidth));
    this.zoom = scaleFactor;

    // 1. Save state and apply Camera Viewport translations
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.scale(this.zoom, this.zoom);
    
    // Apply camera centrings and screenshakes
    const focusX = -this.camera.x + this.camera.shakeX;
    const focusY = -this.camera.y + this.camera.shakeY;
    this.ctx.translate(focusX, focusY);

    // Compute dynamic Visibility Light Field (FOV Shadows)
    let visibilityPolygon = null;
    if (this.settings.shadows && this.localPlayer.health > 0) {
      // Cast rays from player coordinates (eyes) up to 720px vision range limit
      visibilityPolygon = this.map.computeVisibilityPolygon(this.localPlayer.x, this.localPlayer.y, 720);
    }

    // Render floor details & blood decals underneath players/obstacles
    this.particles.drawDecals(this.ctx);

    // Render static walls & crates. Overlay shadows using calculated visibility field
    this.map.draw(this.ctx, this.settings, visibilityPolygon);

    // Render dead operatives lying flat
    this.players.forEach(p => {
      if (p.health <= 0) p.draw(this.ctx);
    });

    // Check if opponent is visible (inside visibility field)
    let oppVisible = true;
    if (this.settings.shadows && visibilityPolygon && this.opponent.health > 0) {
      // Determine if opponent center coordinate lies within the visibility polygon
      oppVisible = this.isPointInPolygon({ x: this.opponent.x, y: this.opponent.y }, visibilityPolygon);
    }

    // Render active players (only draw opponent if visible in Line of Sight)
    this.localPlayer.draw(this.ctx, this.settings);
    if (this.opponent.health > 0 && oppVisible) {
      this.opponent.draw(this.ctx, this.settings);
    }

    // Render Bullets
    this.bullets.forEach(b => b.draw(this.ctx));

    // Render active flying sparks, wood fragments & shell casings
    this.particles.drawParticles(this.ctx);

    // Restore viewport transformations
    this.ctx.restore();
  }

  // Ray-crossing algorithm to check if opponent is inside the player's light field
  isPointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      
      const intersect = ((yi > point.y) !== (yj > point.y))
          && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
}
