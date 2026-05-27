import { Player, RP_WIN, RP_LOSS } from './Player.js';
import { Bullet } from './Bullet.js';
import { Map as GameMap } from './Map.js';
import { ParticleEngine } from './Particle.js';
import { Sound } from './Sound.js';
import { Network } from './Network.js';
import { CharacterRenderer } from './CharacterRenderer.js';

export class Engine {
  constructor(canvasId, config) {
    try {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      
      this.mode = config.mode; // 'online' | 'offline'
      this.socket = config.socket;
      this.isRanked = !!config.isRanked;
      if (window.stopAllMusic) window.stopAllMusic();
      
      // Map dimensions
      this.mapWidth = 1400;
      this.mapHeight = 1400;
      
      // Seeded map & item configuration
      this.map = new GameMap(this.mapWidth, this.mapHeight, config.seed);
      
      // Sound & particles setup
      this.sound = new Sound();
      this.sound.setVolume((config.settings.volume !== undefined) ? config.settings.volume : 0.5);
      this.particles = new ParticleEngine();
      this.particles.setBloodEnabled(config.settings.blood);
      this.settings = config.settings;
      
      // Start loading the 3D character model (async, non-blocking)
      CharacterRenderer.init().catch(e => console.warn('[Engine] CharacterRenderer init failed:', e));
      
      // Global identifiers
      window.LocalPlayerId = config.localPlayerId;
      window.IsOfflineMode = (this.mode === 'offline');
      
      // 4 distinct spawn points (opposite corners of the map)
      this.spawns = [
        { x: 150, y: 150 },                         // Team 1, Spawn A
        { x: this.mapWidth - 150, y: this.mapHeight - 150 }, // Team 2, Spawn A
        { x: 150, y: this.mapHeight - 150 },         // Team 1, Spawn B
        { x: this.mapWidth - 150, y: 150 }          // Team 2, Spawn B
      ];
      
      this.players = [];
      this.localPlayer = null;
      this.remotePlayers = new Map();
      
      const lobbyPlayers = config.players || [
        { id: config.localPlayerId, name: config.localPlayerName, weapon: config.localWeapon, color: config.localColor }
      ];
      
      lobbyPlayers.forEach((p, idx) => {
        const spawn = this.spawns[idx % this.spawns.length];
        const isLocal = p.id === config.localPlayerId;
        
        const team = (idx % 2 === 0) ? 1 : 2;
        const isBot = (this.mode === 'offline' && !isLocal);
        
        const player = new Player(
          p.id,
          spawn.x,
          spawn.y,
          p.name,
          p.weapon || 'pistol',
          p.color || 'cyan',
          isLocal,
          isBot
        );
        
        player.team = team;
        
        if (isLocal) {
          this.localPlayer = player;
          this.localPlayerIndex = idx;
        } else {
          const myIndex = config.localPlayerIndex !== undefined ? config.localPlayerIndex : 0;
          player.isTeammate = (idx % 2 === myIndex % 2);
          this.remotePlayers.set(p.id, player);
        }
        this.players.push(player);
      });

      this.bullets = [];
      
      // Network component
      this.network = null;
      if (this.mode === 'online') {
        this.network = new Network(
          this.socket, 
          this.localPlayer, 
          null, 
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
          const bot = this.players.find(p => p.id === shootData.playerId);
          if (bot) {
            this.particles.spawnGunCasing(bot.x, bot.y, bot.angle, shootData.weaponKey);
          }
          this.spawnBulletFromNetwork(shootData);
        };
      }
    } catch (e) {
      console.error("Engine Constructor Error:", e);
      try {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(10, 10, 15, 0.95)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff3c3c';
        ctx.font = 'bold 20px monospace';
        ctx.fillText("TACTICSTRIKE CONSTRUCTOR ERROR DETECTED", 20, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        const lines = (e.stack || e.toString()).split('\n');
        let y = 90;
        lines.forEach(line => {
          ctx.fillText(line, 20, y);
          y += 18;
        });
      } catch(ex) {}
      throw e;
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

      // Toggle flashlight
      if (e.key.toLowerCase() === 'f') {
        if (this.localPlayer && this.localPlayer.health > 0) {
          this.localPlayer.flashlightActive = !this.localPlayer.flashlightActive;
          try {
            this.sound.playMetallicClick(0, 1800, 0.05, 0.15);
          } catch (ex) {}
        }
      }
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
    
    if (this.network) {
      this.network.destroy();
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
    
    // Reset all operatives
    this.players.forEach((p, idx) => {
      const spawn = this.spawns[idx % this.spawns.length];
      p.x = spawn.x;
      p.y = spawn.y;
      p.vx = 0;
      p.vy = 0;
      p.health = 100;
      p.ammoInMag = p.weapon.magSize;
      p.reserveAmmo = p.weapon.magSize * 3;
      p.isReloading = false;
      p.floatingText = null;
      p.isDeadLogged = false;

      if (p.isBot) {
        p.botState = 'patrol';
        p.choosePatrolPoint(this.map);
      }
    });
    
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
    
    // Sound FX init (0 = play immediately from AudioContext.currentTime)
    try { this.sound.playFrictionalScrape(0, 0.5, 0.1); } catch(e) {}
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

  // Triggered when a team dies or time runs out
  endRound(winningTeam, killFeedMsg = '') {
    if (this.gameState !== 'playing') return;
    
    this.gameState = 'round-over';
    if (this.matchTimerInterval) clearInterval(this.matchTimerInterval);

    let feedAlert = document.getElementById('hud-status');
    const myTeam = this.localPlayer.team;

    if (winningTeam === myTeam) {
      this.scoreSelf++;
      if (feedAlert) {
        feedAlert.innerText = 'ROUND WON';
        feedAlert.style.color = '#39ff14';
      }
    } else if (winningTeam !== null) {
      this.scoreOpponent++;
      if (feedAlert) {
        feedAlert.innerText = 'ROUND LOST';
        feedAlert.style.color = '#ff3c3c';
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
    const winningTeam = this.scoreSelf >= 3 ? this.localPlayer.team : (this.localPlayer.team === 1 ? 2 : 1);
    const winningPlayer = this.players.find(p => p.team === winningTeam);
    window.MatchStats.winnerId = winningPlayer ? winningPlayer.id : 'unknown';

    // Apply rank RP delta only if ranked
    const isWin = this.scoreSelf >= 3;
    const oldRank = this.localPlayer.rank ? this.localPlayer.rank.label : '';
    let rankChanged = false;
    let rpDelta = 0;
    if (this.isRanked) {
      rankChanged = this.localPlayer.applyRankDelta(isWin ? RP_WIN : RP_LOSS);
      rpDelta = isWin ? RP_WIN : RP_LOSS;
    }
    window.MatchStats.isWin = isWin;
    window.MatchStats.newRP = this.localPlayer.rp;
    window.MatchStats.newRank = this.localPlayer.rank;
    window.MatchStats.rpDelta = rpDelta;
    window.MatchStats.rankChanged = rankChanged;
    window.MatchStats.oldRankLabel = oldRank;

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
    if (selfName) {
      selfName.innerText = this.mode === 'online' && this.players.length > 2
        ? 'YOUR TEAM'
        : this.localPlayer.name.toUpperCase();
    }
    
    const opponentName = document.getElementById('hud-opponent-name');
    if (opponentName) {
      opponentName.innerText = this.players.length > 2 ? 'OPPONENTS' : 'OPPONENT';
    }
    
    const opponentWeapon = document.getElementById('hud-opponent-weapon');
    if (opponentWeapon) {
      if (this.players.length > 2) {
        opponentWeapon.innerText = 'SQUAD LOADOUT';
      } else {
        const opp = this.players.find(p => p.id !== this.localPlayer.id);
        opponentWeapon.innerText = opp ? opp.weapon.name.toUpperCase() : 'UNKNOWN';
      }
    }
    
    const opponentIndicator = document.getElementById('opponent-indicator');
    if (opponentIndicator) {
      opponentIndicator.className = 'op-indicator online';
    }
  }

  drawErrorOverlay(error) {
    try {
      this.ctx.restore(); // Reset any transformations
    } catch(e) {}
    
    // Draw background
    this.ctx.fillStyle = 'rgba(10, 10, 15, 0.95)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw title
    this.ctx.fillStyle = '#ff3c3c';
    this.ctx.font = 'bold 20px monospace';
    this.ctx.fillText("TACTICSTRIKE RUNTIME ERROR DETECTED", 20, 50);
    
    // Draw stack trace lines
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '12px monospace';
    
    const lines = (error.stack || error.toString()).split('\n');
    let y = 90;
    lines.forEach(line => {
      // Split very long lines to wrap on canvas
      const maxChars = Math.floor((this.canvas.width - 40) / 7);
      for (let i = 0; i < line.length; i += maxChars) {
        this.ctx.fillText(line.substring(i, i + maxChars), 20, y);
        y += 18;
      }
    });
  }

  // --- Main Loop tick ---
  loop() {
    if (!this.active) return;
    
    const now = performance.now();
    this.lastTime = now;

    try {
      this.update(now);
      this.render();
    } catch (e) {
      console.error("Game Loop Crash:", e);
      this.drawErrorOverlay(e);
      this.active = false;
      return;
    }

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
        // Play countdown click tone (pass 0 = play immediately)
        try { this.sound.playMetallicClick(0, 1000, 0.05, 0.2); } catch(e) {}
      }
      
      if (count > 0) {
        const hudStatus = document.getElementById('hud-status');
        if (hudStatus) hudStatus.innerText = `DEPLOYING IN ${count}...`;
      } else {
        try { this.sound.playMetallicClick(0, 2000, 0.15, 0.35); } catch(e) {} // final beep
        this.startRoundAction();
      }
    }

    // 2. Update Operatives (Player / Opponent)
    if (this.gameState === 'playing' || this.gameState === 'countdown') {
      this.localPlayer.update(this.keys, this.mouse, this.map, this.sound, currentTime, null, this.localPlayer);
      
      if (this.mode === 'offline') {
        this.players.forEach(p => {
          if (p.isBot) {
            const opposingTeam = p.team === 1 ? 2 : 1;
            const targets = this.players.filter(t => t.health > 0 && t.team === opposingTeam);
            
            if (targets.length > 0) {
              targets.sort((a, b) => Math.hypot(p.x - a.x, p.y - a.y) - Math.hypot(p.x - b.x, p.y - b.y));
              p.update(null, null, this.map, this.sound, currentTime, targets[0], this.localPlayer);
            } else {
              p.update(null, null, this.map, this.sound, currentTime, null, this.localPlayer);
            }
          }
        });
      } else {
        this.network.interpolateOpponents();
      }

      // Check item collisions
      this.localPlayer.checkPickups(this.map, this.sound);
      if (this.mode === 'offline') {
        this.players.forEach(p => {
          if (p.isBot) {
            p.checkPickups(this.map, this.sound);
          }
        });
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

    // Log new deaths to kill feed
    this.players.forEach(p => {
      if (p.health <= 0 && !p.isDeadLogged) {
        p.isDeadLogged = true;
        if (this.onKillFeed) {
          this.onKillFeed('Eliminated', p.name, p.weaponKey);
        }
      }
    });

    // Update Average Team Health HUD Bars
    const team1List = this.players.filter(p => p.team === this.localPlayer.team);
    const avgTeam1HP = team1List.reduce((sum, p) => sum + p.health, 0) / team1List.length;
    const hpBar = document.getElementById('hud-self-hp');
    if (hpBar) hpBar.style.width = `${Math.max(0, avgTeam1HP)}%`;
    const hpText = document.getElementById('hud-self-hp-text');
    if (hpText) hpText.innerText = Math.round(Math.max(0, avgTeam1HP));

    const enemyTeam = this.localPlayer.team === 1 ? 2 : 1;
    const team2List = this.players.filter(p => p.team === enemyTeam);
    const avgTeam2HP = team2List.reduce((sum, p) => sum + p.health, 0) / team2List.length;
    const oppHpBar = document.getElementById('hud-opponent-hp');
    if (oppHpBar) oppHpBar.style.width = `${Math.max(0, avgTeam2HP)}%`;

    // 5. Check team-wide wipeout conditions
    if (this.gameState === 'playing') {
      const team1Alive = this.players.some(p => p.health > 0 && p.team === 1);
      const team2Alive = this.players.some(p => p.health > 0 && p.team === 2);
      
      if (team1Alive && !team2Alive) {
        if (this.mode === 'offline') {
          this.endRound(1, 'eliminated');
        }
      } else if (!team1Alive && team2Alive) {
        if (this.mode === 'offline') {
          this.endRound(2, 'eliminated');
        }
      } else if (!team1Alive && !team2Alive) {
        if (this.mode === 'offline') {
          this.endRound(null, 'both dead');
        }
      }
    }

    // 6. Healing zone tick — all living players regenerate HP when standing in a healing zone
    if (this.gameState === 'playing') {
      this.players.forEach(p => {
        if (p.health <= 0 || p.health >= p.maxHealth) return;
        const zone = this.map.checkZone(p.x, p.y);
        if (zone && zone.type === 'healing') {
          p.health = Math.min(p.maxHealth, p.health + zone.healRate);
          if (p.isLocal && !p.isBot) {
            p.updateHUD();
          }
        }
      });
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

    // Compute flashlight polygons for all living players with active flashlight
    this.players.forEach(p => {
      if (p.health > 0 && p.flashlightActive) {
        p.lightPoly = this.map.computeVisibilityPolygon(p.x, p.y, 700, p.angle, 65 * Math.PI / 180);
      } else {
        p.lightPoly = null;
      }
    });

    // Render floor details & blood decals underneath players/obstacles
    this.particles.drawDecals(this.ctx);

    // Render static walls & crates. Overlay shadows using calculated visibility field
    this.map.draw(this.ctx, this.settings, this.players, this.localPlayer);

    // Render dead operatives lying flat
    this.players.forEach(p => {
      if (p.health <= 0) p.draw(this.ctx);
    });

    // Render active players (only draw enemies if visible in Line of Sight/flashlight)
    this.players.forEach(p => {
      if (p.health <= 0) return;
      
      let visible = true;
      if (this.settings.shadows && this.localPlayer && this.localPlayer.health > 0 && !p.isLocal) {
        const inFlashlight = this.localPlayer.flashlightActive && this.localPlayer.lightPoly && this.isPointInPolygon({ x: p.x, y: p.y }, this.localPlayer.lightPoly);
        const hasLOS = !this.map.getLineIntersection({ x: this.localPlayer.x, y: this.localPlayer.y }, { x: p.x, y: p.y });
        const inAmbientLight = this.map.isPointInAmbientLight(p.x, p.y);
        visible = inFlashlight || p.isTeammate || (p.flashlightActive && hasLOS) || (inAmbientLight && hasLOS);
      }
      
      if (visible) {
        p.draw(this.ctx, this.settings);
      }
    });

    // Render local player's rotating compass ring
    if (this.localPlayer.health > 0) {
      this.ctx.save();
      this.ctx.translate(this.localPlayer.x, this.localPlayer.y);
      this.ctx.strokeStyle = 'rgba(102, 252, 241, 0.15)';
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([4, 8]);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 32, Date.now() / 1500, Date.now() / 1500 + Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // Render Bullets and Particles with additive bloom glow
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'lighter';
    this.bullets.forEach(b => b.draw(this.ctx));
    this.particles.drawParticles(this.ctx);
    this.ctx.restore();

    // Restore viewport translations
    this.ctx.restore();

    // 2. Render Tactical Screen Edge Vignette Overlay & Scanlines
    this.ctx.save();
    const vignette = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 3,
      this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 1.1
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.82)');
    this.ctx.fillStyle = vignette;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Scanlines
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let y = 0; y < this.canvas.height; y += 4) {
      this.ctx.fillRect(0, y, this.canvas.width, 1);
    }
    this.ctx.restore();

    // 3. Zone indicator HUD (screen-space overlay)
    const localZone = this.localPlayer && this.localPlayer.health > 0
      ? this.map.checkZone(this.localPlayer.x, this.localPlayer.y)
      : null;

    if (localZone) {
      try {
        this.ctx.save();
        const isHeal   = localZone.type === 'healing';
        const pulse    = Math.sin(Date.now() / 400) * 0.25 + 0.75;
        const textCol  = isHeal ? `rgba(80,255,130,${pulse})` : `rgba(255,100,60,${pulse})`;
        const zoneCol  = isHeal ? `rgba(40,255,110,${pulse*0.18})` : `rgba(255,60,20,${pulse*0.18})`;
        const borderC  = isHeal ? `rgba(80,255,130,${pulse*0.8})`  : `rgba(255,100,60,${pulse*0.8})`;

        const barW = 260, barH = 38;
        const barX = this.canvas.width / 2 - barW / 2;
        const barY = this.canvas.height - 130;

        // Background fill (plain rect)
        this.ctx.fillStyle = zoneCol;
        this.ctx.fillRect(barX, barY, barW, barH);

        // Border (plain rect)
        this.ctx.strokeStyle = borderC;
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(barX, barY, barW, barH);

        // Label
        this.ctx.textAlign = 'center';
        this.ctx.font = 'bold 12px Orbitron';
        this.ctx.fillStyle = textCol;
        const icon = isHeal ? '+' : '!';
        this.ctx.fillText(`${icon} ${localZone.label}`, this.canvas.width / 2, barY + 15);

        // Sub-text
        this.ctx.font = '9px Orbitron';
        this.ctx.fillStyle = isHeal ? 'rgba(60,255,110,0.7)' : 'rgba(255,80,40,0.7)';
        const sub = isHeal
          ? `+${(localZone.healRate * 60).toFixed(0)} HP/s REGENERATION`
          : `DAMAGE x${localZone.multiplier} -- DANGER`;
        this.ctx.fillText(sub, this.canvas.width / 2, barY + 29);

        this.ctx.restore();
      } catch(e) { /* silently ignore zone HUD errors to protect render loop */ }
    }
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

  handleServerRoundOver(data) {
    if (this.gameState !== 'playing') return;
    
    this.gameState = 'round-over';
    if (this.matchTimerInterval) clearInterval(this.matchTimerInterval);

    let feedAlert = document.getElementById('hud-status');
    const myTeam = this.localPlayer.team;

    if (data.winningTeam === myTeam) {
      if (feedAlert) {
        feedAlert.innerText = 'ROUND WON';
        feedAlert.style.color = '#39ff14';
      }
    } else {
      if (feedAlert) {
        feedAlert.innerText = 'ROUND LOST';
        feedAlert.style.color = '#ff3c3c';
      }
    }

    if (myTeam === 1) {
      this.scoreSelf = data.score1;
      this.scoreOpponent = data.score2;
    } else {
      this.scoreSelf = data.score2;
      this.scoreOpponent = data.score1;
    }

    this.updateScoreboardHUD();

    this.roundNumber = data.roundNumber;
    setTimeout(() => this.startRoundCycle(), 3000);
  }

  handleServerMatchOver(data) {
    this.gameState = 'match-over';
    this.active = false;
    if (this.matchTimerInterval) clearInterval(this.matchTimerInterval);

    const myTeam = this.localPlayer.team;
    if (myTeam === 1) {
      this.scoreSelf = data.score1;
      this.scoreOpponent = data.score2;
    } else {
      this.scoreSelf = data.score2;
      this.scoreOpponent = data.score1;
    }
    this.updateScoreboardHUD();

    const totalShots = window.MatchStats.shotsFired || 1;
    const accuracyVal = (window.MatchStats.hitsRegistered / totalShots) * 100;
    window.MatchStats.accuracy = accuracyVal;
    window.MatchStats.roundsWon = this.scoreSelf;
    window.MatchStats.winnerId = data.winnerId;

    // Apply rank RP delta only if ranked
    const isWin = this.scoreSelf >= 3;
    const oldRank = this.localPlayer.rank ? this.localPlayer.rank.label : '';
    let rankChanged = false;
    let rpDelta = 0;
    if (this.isRanked) {
      rankChanged = this.localPlayer.applyRankDelta(isWin ? RP_WIN : RP_LOSS);
      rpDelta = isWin ? RP_WIN : RP_LOSS;
    }
    window.MatchStats.isWin = isWin;
    window.MatchStats.newRP = this.localPlayer.rp;
    window.MatchStats.newRank = this.localPlayer.rank;
    window.MatchStats.rpDelta = rpDelta;
    window.MatchStats.rankChanged = rankChanged;
    window.MatchStats.oldRankLabel = oldRank;

    if (isWin) {
      this.sound.playMatchWin();
    } else {
      this.sound.playMatchLose();
    }

    if (this.onMatchEnd) {
      this.onMatchEnd(window.MatchStats);
    }
  }
}
