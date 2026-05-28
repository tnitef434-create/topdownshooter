import { Player, RP_WIN, RP_LOSS } from './Player.js';
import { Bullet } from './Bullet.js';
import { Map as GameMap } from './Map.js';
import { ParticleEngine } from './Particle.js';
import { Sound } from './Sound.js';
import { Network } from './Network.js';
import { CharacterRenderer } from './CharacterRenderer.js';

class FlashGrenade {
  constructor(x, y, vx, vy, throwerId) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.throwerId = throwerId;
    this.radius = 6;
    this.friction = 0.98;
    this.bounceFriction = 0.6;
    this.timer = 1200; // 1.2s fuse
    this.creationTime = performance.now();
    this.active = true;
  }

  update(map, currentTime) {
    const elapsed = currentTime - this.creationTime;
    if (elapsed >= this.timer) {
      this.active = false;
      return;
    }

    this.vx *= this.friction;
    this.vy *= this.friction;

    const nextX = this.x + this.vx;
    const nextY = this.y + this.vy;

    const response = map.checkCircleCollision(nextX, nextY, this.radius);
    if (response.x !== nextX || response.y !== nextY) {
      const checkX = map.checkCircleCollision(nextX, this.y, this.radius);
      const checkY = map.checkCircleCollision(this.x, nextY, this.radius);
      
      if (checkX.x !== nextX) {
        this.vx = -this.vx * this.bounceFriction;
      }
      if (checkY.y !== nextY) {
        this.vy = -this.vy * this.bounceFriction;
      }
      
      this.x = response.x;
      this.y = response.y;
    } else {
      this.x = nextX;
      this.y = nextY;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#2d332f';
    ctx.strokeStyle = '#66fcf1';
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();

    const isLit = Math.floor(performance.now() / 150) % 2 === 0;
    if (isLit) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ff3c3c';
      ctx.fill();
    }
    ctx.restore();
  }
}

export class Engine {
  constructor(canvasId, config) {
    try {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      
      this.mode = config.mode; // 'online' | 'offline'
      this.socket = config.socket;
      this.isRanked = !!config.isRanked;
      
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
      this.grenades = [];
      this.replayFrames = [];
      
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
        this.socket.on('opponent-throw-grenade', (data) => {
          const grenade = new FlashGrenade(data.x, data.y, data.vx, data.vy, data.playerId);
          this.grenades.push(grenade);
          const dist = Math.hypot(this.localPlayer.x - data.x, this.localPlayer.y - data.y);
          this.sound.playMetallicClick(0, 1500, 0.08, 0.2, dist);
        });
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
      
      // Sprint Popup variables
      this.lastSprintTime = performance.now();
      this.sprintTipVisible = false;

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

      // Switch weapon slots
      if (e.key === '1') {
        if (this.localPlayer && this.localPlayer.health > 0) {
          this.localPlayer.switchSlot(1);
        }
      }
      if (e.key === '2') {
        if (this.localPlayer && this.localPlayer.health > 0) {
          this.localPlayer.switchSlot(2);
        }
      }

      // Throw flash grenade
      if (e.key === '3') {
        if (this.localPlayer && this.localPlayer.health > 0) {
          this.localPlayer.throwFlashbangRequest = true;
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
        // Block shooting when clicking on interactive HUD elements
        if (e.target.closest('#btn-game-menu') || e.target.closest('.inv-slot') || e.target.closest('button') || e.target.closest('input') || e.target.closest('.inventory-display')) {
          return;
        }
        this.mouse.clicked = true;
      }
    };
    this.mouseupHandler = (e) => {
      if (e.button === 0) {
        this.mouse.clicked = false;
      }
    };

    this.wheelHandler = (e) => {
      const chatInput = document.getElementById('chat-input');
      if (chatInput && document.activeElement === chatInput) return;
      if (this.localPlayer && this.localPlayer.health > 0) {
        this.localPlayer.throwFlashbangRequest = true;
      }
    };

    window.addEventListener('mousemove', this.mousemoveHandler);
    window.addEventListener('mousedown', this.mousedownHandler);
    window.addEventListener('mouseup', this.mouseupHandler);
    window.addEventListener('wheel', this.wheelHandler, { passive: true });

    // Inventory slots UI clicking
    this.invSlot1Handler = () => {
      if (this.localPlayer && this.localPlayer.health > 0) {
        this.localPlayer.switchSlot(1);
      }
    };
    this.invSlot2Handler = () => {
      if (this.localPlayer && this.localPlayer.health > 0) {
        this.localPlayer.switchSlot(2);
      }
    };
    this.invSlot3Handler = () => {
      if (this.localPlayer && this.localPlayer.health > 0) {
        this.localPlayer.throwFlashbangRequest = true;
      }
    };

    const slot1 = document.getElementById('inv-slot-1');
    const slot2 = document.getElementById('inv-slot-2');
    const slot3 = document.getElementById('inv-slot-3');
    if (slot1) slot1.addEventListener('click', this.invSlot1Handler);
    if (slot2) slot2.addEventListener('click', this.invSlot2Handler);
    if (slot3) slot3.addEventListener('click', this.invSlot3Handler);
  }

  destroy() {
    this.active = false;
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
    window.removeEventListener('mousemove', this.mousemoveHandler);
    window.removeEventListener('mousedown', this.mousedownHandler);
    window.removeEventListener('mouseup', this.mouseupHandler);
    window.removeEventListener('wheel', this.wheelHandler);
    
    // Clean up inventory click handlers
    const slot1 = document.getElementById('inv-slot-1');
    const slot2 = document.getElementById('inv-slot-2');
    const slot3 = document.getElementById('inv-slot-3');
    if (slot1 && this.invSlot1Handler) slot1.removeEventListener('click', this.invSlot1Handler);
    if (slot2 && this.invSlot2Handler) slot2.removeEventListener('click', this.invSlot2Handler);
    if (slot3 && this.invSlot3Handler) slot3.removeEventListener('click', this.invSlot3Handler);
    
    if (this.matchTimerInterval) {
      clearInterval(this.matchTimerInterval);
    }
    
    if (this.network) {
      this.network.destroy();
    }

    if (this.socket) {
      this.socket.off('opponent-throw-grenade');
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
    
    // Reset sprint warning popup
    this.lastSprintTime = performance.now();
    this.sprintTipVisible = false;
    const popup = document.getElementById('sprint-tip-popup');
    if (popup) popup.style.display = 'none';

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
      p.flashGrenades = 1;
      p.flashAlpha = 0;

      if (p.isBot) {
        p.botState = 'patrol';
        p.choosePatrolPoint(this.map);
      }
    });
    
    // Clear dynamic bullet trails and particles for fresh round
    this.bullets = [];
    this.grenades = [];
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

    const transitionAction = () => {
      if (this.scoreSelf >= 3 || this.scoreOpponent >= 3) {
        this.endMatch();
      } else {
        this.roundNumber++;
        this.startRoundCycle();
      }
    };

    setTimeout(() => {
      if (!this.active) return;
      this.startReplay(transitionAction);
    }, 3000);
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
    if (this.gameState === 'replay') {
      this.replayIndex++;
      if (this.replayIndex >= this.replayFrames.length) {
        if (this.postReplayCallback) {
          const cb = this.postReplayCallback;
          this.postReplayCallback = null;
          cb();
        }
      }
      return;
    }

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

      // Handle local player throwing a flash grenade
      if (this.gameState === 'playing' && this.localPlayer.throwFlashbangRequest && this.localPlayer.flashGrenades > 0) {
        this.localPlayer.throwFlashbangRequest = false;
        this.localPlayer.flashGrenades--;
        this.localPlayer.updateHUD();

        const speed = 11;
        const vx = Math.cos(this.localPlayer.angle) * speed;
        const vy = Math.sin(this.localPlayer.angle) * speed;
        
        const grenade = new FlashGrenade(this.localPlayer.x, this.localPlayer.y, vx, vy, this.localPlayer.id);
        this.grenades.push(grenade);

        // Play local click/throw sound
        this.sound.playMetallicClick(0, 1500, 0.08, 0.2);

        // Send to server
        if (this.mode === 'online') {
          this.socket.emit('throw-grenade', {
            x: this.localPlayer.x,
            y: this.localPlayer.y,
            vx: vx,
            vy: vy
          });
        }
      } else {
        this.localPlayer.throwFlashbangRequest = false;
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

    // Update active grenades
    for (let i = this.grenades.length - 1; i >= 0; i--) {
      const g = this.grenades[i];
      g.update(this.map, currentTime);
      
      if (!g.active) {
        // Explode!
        this.particles.spawnFlashbangBurst(g.x, g.y);
        
        const dist = Math.hypot(this.localPlayer.x - g.x, this.localPlayer.y - g.y);
        this.sound.playFlashbangExplosion(dist);
        
        if (dist < 800) {
          this.shakeCamera(Math.max(1, 15 * (1 - dist / 800)));
        }

        // Apply white screen flash to players in range & Line of Sight
        this.players.forEach(p => {
          if (p.health <= 0) return;
          const pDist = Math.hypot(p.x - g.x, p.y - g.y);
          if (pDist < 380) {
            const hasLOS = p.checkLineOfSight(this.map, g.x, g.y, p.x, p.y);
            if (hasLOS) {
              p.flashAlpha = 1.0;
              if (p.isLocal) {
                p.updateHUD();
              }
            }
          }
        });

        this.grenades.splice(i, 1);
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

    // Update sprint warning popup
    if (this.gameState === 'playing') {
      const isSprinting = this.keys['shift'];
      const popup = document.getElementById('sprint-tip-popup');
      
      if (isSprinting) {
        this.lastSprintTime = currentTime;
        if (this.sprintTipVisible) {
          this.sprintTipVisible = false;
          if (popup) popup.style.display = 'none';
        }
      } else {
        // Check if local player is actively moving
        const isMoving = this.localPlayer && (Math.abs(this.localPlayer.vx) > 0.2 || Math.abs(this.localPlayer.vy) > 0.2);
        if (isMoving) {
          if (currentTime - this.lastSprintTime > 9000) {
            if (!this.sprintTipVisible) {
              this.sprintTipVisible = true;
              if (popup) popup.style.display = 'flex';
            }
          }
        } else {
          // Standing still resets the sprint reminder timer
          this.lastSprintTime = currentTime;
        }
      }
    }

    // 7. Relay state over network (60Hz throttled)
    if (this.mode === 'online' && (this.gameState === 'playing' || this.gameState === 'countdown')) {
      this.network.sendState(currentTime);
    }

    // 8. Record snapshot for Killcam Replay
    if (this.gameState === 'playing') {
      const snapshot = {
        players: this.players.map(p => ({
          id: p.id,
          x: p.x,
          y: p.y,
          angle: p.angle,
          health: p.health,
          maxHealth: p.maxHealth,
          weaponKey: p.weaponKey,
          muzzleFlash: p.muzzleFlash,
          isLocal: p.isLocal,
          isBot: p.isBot,
          isTeammate: p.isTeammate,
          color: p.colorTheme,
          name: p.name,
          flashlightActive: p.flashlightActive,
          flashAlpha: p.flashAlpha,
          radius: p.radius
        })),
        bullets: this.bullets.map(b => ({
          x: b.x,
          y: b.y,
          prevX: b.prevX,
          prevY: b.prevY,
          angle: b.angle,
          playerId: b.playerId,
          active: b.active,
          weaponKey: b.weaponKey
        })),
        grenades: this.grenades.map(g => ({
          x: g.x,
          y: g.y
        })),
        particles: this.particles.particles.map(p => ({
          x: p.x,
          y: p.y,
          type: p.type,
          angle: p.angle,
          size: p.size,
          color: p.color,
          life: p.life
        })),
        decals: this.particles.decals.map(d => ({
          x: d.x,
          y: d.y,
          type: d.type,
          size: d.size,
          color: d.color,
          angle: d.angle,
          scaleX: d.scaleX,
          scaleY: d.scaleY
        })),
        camera: { x: this.camera.x, y: this.camera.y },
        brokenLightOn: this.map.ambientLights.brokenCeiling.on
      };
      this.replayFrames.push(snapshot);
      if (this.replayFrames.length > 300) { // 5 seconds at 60fps
        this.replayFrames.shift();
      }
    }
  }

  // Core Render loop
  startReplay(callback) {
    const someoneDied = this.players.some(p => p.health <= 0);
    if (this.replayFrames && this.replayFrames.length > 0 && someoneDied) {
      this.gameState = 'replay';
      this.replayIndex = 0;
      this.postReplayCallback = callback;
      const hudStatus = document.getElementById('hud-status');
      if (hudStatus) {
        hudStatus.innerText = '● REPLAY / KILLCAM';
        hudStatus.style.color = '#ff3c3c';
      }
    } else {
      callback();
    }
  }

  drawSnapshotPlayer(p, isDead) {
    this.ctx.save();
    if (isDead) {
      // Draw death pool
      this.ctx.fillStyle = 'rgba(180, 0, 0, 0.35)';
      this.ctx.beginPath();
      this.ctx.ellipse(p.x, p.y, 26, 22, 0, 0, Math.PI * 2);
      this.ctx.fill();
      
      if (CharacterRenderer.ready) {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.angle + Math.PI / 2);
        this.ctx.globalAlpha = 0.55;
        CharacterRenderer.draw(this.ctx, p.id + '_dead', 0, 0, 0, 0, false, p.isLocal ? 'blue' : 'red');
        this.ctx.restore();
      }
      this.ctx.restore();
      return;
    }

    // Laser Sight (only for local player, or if settings enabled)
    if (this.settings.laser && p.isLocal) {
      const maxLaserDist = 1200;
      let endX = p.x + Math.cos(p.angle) * maxLaserDist;
      let endY = p.y + Math.sin(p.angle) * maxLaserDist;
      
      const intersection = this.map.getLineIntersection({ x: p.x, y: p.y }, { x: endX, y: endY });
      if (intersection) {
        endX = intersection.x;
        endY = intersection.y;
      }

      this.ctx.save();
      this.ctx.strokeStyle = p.isLocal ? 'rgba(102, 252, 241, 0.5)' : 'rgba(255, 60, 60, 0.5)';
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
      
      const dotColor = p.isLocal ? '#66fcf1' : '#ff3c3c';
      const glowGrad = this.ctx.createRadialGradient(endX, endY, 1, endX, endY, 6);
      glowGrad.addColorStop(0, '#ffffff');
      glowGrad.addColorStop(0.3, dotColor);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = glowGrad;
      this.ctx.beginPath();
      this.ctx.arc(endX, endY, 6, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Draw sprite using CharacterRenderer
    const isShooting = p.muzzleFlash > 0.1;
    const drewSprite = CharacterRenderer.draw(
      this.ctx,
      p.id,
      p.x,
      p.y,
      p.angle,
      0, // current speed not critical for replay stance
      isShooting,
      p.isLocal ? 'blue' : 'red'
    );

    // Fallback tactical circle
    if (!drewSprite) {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      
      const COLOR_THEMES = {
        cyan: { body: '#3ba39f', armor: '#16202c', helmet: '#66fcf1' },
        green: { body: '#39db14', armor: '#133d07', helmet: '#5eff39' },
        purple: { body: '#9d3bff', armor: '#20083c', helmet: '#c47aff' },
        orange: { body: '#ff7f3b', armor: '#3f1b07', helmet: '#ff9d7a' },
        yellow: { body: '#ffd700', armor: '#3a3000', helmet: '#ffea70' },
        red: { body: '#ff3c3c', armor: '#3a0707', helmet: '#ff7a7a' }
      };

      const theme = COLOR_THEMES[p.color] || COLOR_THEMES[p.isLocal ? 'cyan' : 'red'];
      const bodyColor = theme.body;
      const armorColor = theme.armor;
      const helmetColor = theme.helmet;

      let barrelLength = 18, barrelWidth = 4;
      if (p.weaponKey === 'rifle')  { barrelLength = 24; barrelWidth = 5; }
      if (p.weaponKey === 'shotgun'){ barrelLength = 22; barrelWidth = 6; }
      if (p.weaponKey === 'sniper') { barrelLength = 32; barrelWidth = 4; }
      if (p.weaponKey === 'smg')    { barrelLength = 16; barrelWidth = 4; }
      if (p.weaponKey === 'lmg')    { barrelLength = 26; barrelWidth = 7; }
      if (p.weaponKey === 'dmr')    { barrelLength = 28; barrelWidth = 5; }
      if (p.weaponKey === 'knife')  { barrelLength = 10; barrelWidth = 2; }

      this.ctx.fillStyle = '#444'; this.ctx.strokeStyle = '#000'; this.ctx.lineWidth = 1;
      this.ctx.fillRect(10, -barrelWidth / 2, barrelLength, barrelWidth);
      this.ctx.strokeRect(10, -barrelWidth / 2, barrelLength, barrelWidth);

      this.ctx.fillStyle = armorColor; this.ctx.strokeStyle = '#000'; this.ctx.lineWidth = 1.5;
      this.ctx.beginPath(); this.ctx.arc(8, -10, 5, 0, Math.PI*2); this.ctx.fill(); this.ctx.stroke();
      this.ctx.beginPath(); this.ctx.arc(14, 6, 5, 0, Math.PI*2); this.ctx.fill(); this.ctx.stroke();

      this.ctx.fillStyle = bodyColor;
      this.ctx.beginPath(); this.ctx.ellipse(0, 0, 18, 21, 0, 0, Math.PI*2);
      this.ctx.fill(); this.ctx.stroke();

      this.ctx.fillStyle = armorColor;
      this.ctx.beginPath(); this.ctx.ellipse(-3, 0, 14, 16, 0, 0, Math.PI*2);
      this.ctx.fill();

      this.ctx.fillStyle = helmetColor;
      this.ctx.beginPath(); this.ctx.arc(-2, 0, 8, 0, Math.PI*2);
      this.ctx.fill(); this.ctx.stroke();

      this.ctx.fillStyle = '#111'; this.ctx.fillRect(1, -5, 3, 10);
      this.ctx.restore();
    }

    // Draw weapon barrel & muzzle flash
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.angle);

    this.ctx.fillStyle = p.weaponKey === 'knife' ? '#b0b8c0' : '#333';
    this.ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    this.ctx.lineWidth = 1;
    let barrelLength = 18, barrelWidth = 3;
    if (p.weaponKey === 'rifle')  { barrelLength = 26; barrelWidth = 4; }
    if (p.weaponKey === 'shotgun'){ barrelLength = 22; barrelWidth = 5; }
    if (p.weaponKey === 'sniper') { barrelLength = 36; barrelWidth = 3; }
    if (p.weaponKey === 'smg')    { barrelLength = 16; barrelWidth = 3; }
    if (p.weaponKey === 'lmg')    { barrelLength = 28; barrelWidth = 5; }
    if (p.weaponKey === 'dmr')    { barrelLength = 30; barrelWidth = 4; }
    if (p.weaponKey === 'knife')  { barrelLength = 10; barrelWidth = 2; }

    this.ctx.fillRect(12, -barrelWidth / 2, barrelLength, barrelWidth);
    this.ctx.strokeRect(12, -barrelWidth / 2, barrelLength, barrelWidth);

    // Muzzle Flash
    if (p.muzzleFlash > 0) {
      this.ctx.save();
      this.ctx.translate(12 + barrelLength, 0);
      const grad = this.ctx.createRadialGradient(0, 0, 2, 0, 0, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.3, 'rgba(255, 220, 0, 0.9)');
      grad.addColorStop(0.7, 'rgba(255, 80, 0, 0.5)');
      grad.addColorStop(1, 'rgba(255, 0, 0, 0.0)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 16, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
    this.ctx.restore();

    // Floating name HUD
    this.ctx.save();
    this.ctx.textAlign = 'center';
    const nameColor = p.isLocal 
      ? '#66fcf1' 
      : (p.isTeammate ? '#39db14' : '#ff3c3c');
    this.ctx.fillStyle = nameColor;
    this.ctx.font = '10px Orbitron';
    this.ctx.fillText(p.name.toUpperCase(), p.x, p.y - 30);
    
    // Draw tiny mini healthbar above opponent/bot
    if (!p.isLocal && p.health > 0) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
      this.ctx.fillRect(p.x - 20, p.y - 26, 40, 4);
      
      const hpColor = p.isTeammate ? '#39db14' : '#ff3c3c';
      this.ctx.fillStyle = hpColor;
      this.ctx.fillRect(p.x - 20, p.y - 26, 40 * (p.health / p.maxHealth), 4);
    }
    this.ctx.restore();
    this.ctx.restore();
  }

  render() {
    let frame = null;
    if (this.gameState === 'replay') {
      frame = this.replayFrames[this.replayIndex];
    }
    
    if (this.gameState === 'replay' && !frame) return;

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
    const camX = frame ? frame.camera.x : this.camera.x;
    const camY = frame ? frame.camera.y : this.camera.y;
    const shakeX = frame ? 0 : this.camera.shakeX;
    const shakeY = frame ? 0 : this.camera.shakeY;
    
    const focusX = -camX + shakeX;
    const focusY = -camY + shakeY;
    this.ctx.translate(focusX, focusY);

    // Compute flashlight polygons for all living players with active flashlight
    const renderPlayers = frame ? frame.players : this.players;
    const renderBullets = frame ? frame.bullets : this.bullets;
    const brokenLightOn = frame ? frame.brokenLightOn : this.map.ambientLights.brokenCeiling.on;
    
    this.map.ambientLights.brokenCeiling.on = brokenLightOn;

    renderPlayers.forEach(p => {
      if (p.health > 0 && p.flashlightActive) {
        p.lightPoly = this.map.computeVisibilityPolygon(p.x, p.y, 700, p.angle, 65 * Math.PI / 180);
      } else {
        p.lightPoly = null;
      }
    });

    // Render floor details & blood decals underneath players/obstacles
    if (frame) {
      frame.decals.forEach(d => {
        this.ctx.save();
        this.ctx.translate(d.x, d.y);
        this.ctx.rotate(d.angle);
        this.ctx.globalAlpha = d.type === 'blood' ? 0.75 : 0.9;
        if (d.type === 'blood') {
          this.ctx.fillStyle = d.color;
          this.ctx.beginPath();
          this.ctx.ellipse(0, 0, d.size * d.scaleX, d.size * d.scaleY, 0, 0, Math.PI * 2);
          this.ctx.fill();
        } else if (d.type === 'casing') {
          this.ctx.fillStyle = '#b5921c';
          this.ctx.fillRect(-d.size, -d.size / 2, d.size * 2, d.size);
        } else if (d.type === 'splinter') {
          this.ctx.fillStyle = '#6e441c';
          this.ctx.fillRect(-d.size, -d.size / 3, d.size * 1.5, d.size * 0.7);
        }
        this.ctx.restore();
      });
    } else {
      this.particles.drawDecals(this.ctx);
    }

    // Render static walls & crates. Overlay shadows using calculated visibility field
    const fLocalPlayer = frame ? frame.players.find(p => p.isLocal) : this.localPlayer;
    this.map.draw(this.ctx, this.settings, renderPlayers, fLocalPlayer, renderBullets);

    // Render dead operatives lying flat
    renderPlayers.forEach(p => {
      if (p.health <= 0) {
        if (frame) {
          this.drawSnapshotPlayer(p, true);
        } else {
          p.draw(this.ctx);
        }
      }
    });

    // Render active players (only draw enemies if visible in Line of Sight/flashlight)
    renderPlayers.forEach(p => {
      if (p.health <= 0) return;
      
      let visible = true;
      if (this.settings.shadows && fLocalPlayer && fLocalPlayer.health > 0 && !p.isLocal) {
        const inFlashlight = fLocalPlayer.flashlightActive && fLocalPlayer.lightPoly && this.isPointInPolygon({ x: p.x, y: p.y }, fLocalPlayer.lightPoly);
        const hasLOS = !this.map.getLineIntersection({ x: fLocalPlayer.x, y: fLocalPlayer.y }, { x: p.x, y: p.y });
        const inAmbientLight = this.map.isPointInAmbientLight(p.x, p.y, p.radius || 18);
        visible = inFlashlight || p.isTeammate || (p.flashlightActive && hasLOS) || (inAmbientLight && hasLOS);
      }
      
      if (visible) {
        if (frame) {
          this.drawSnapshotPlayer(p, false);
        } else {
          p.draw(this.ctx, this.settings, this.map);
        }
      }
    });

    // Render local player's rotating compass ring
    const localLiving = fLocalPlayer && fLocalPlayer.health > 0;
    if (localLiving) {
      this.ctx.save();
      this.ctx.translate(fLocalPlayer.x, fLocalPlayer.y);
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
    if (frame) {
      frame.bullets.forEach(b => {
        if (!b.active) return;
        this.ctx.save();
        if (b.weaponKey === 'knife') {
          this.ctx.lineWidth = 3.5;
          this.ctx.lineCap = 'round';
          this.ctx.strokeStyle = 'rgba(230, 235, 255, 0.85)';
          this.ctx.shadowColor = '#66fcf1';
          this.ctx.shadowBlur = 6;
          this.ctx.beginPath();
          this.ctx.arc(b.x, b.y, 18, b.angle - 0.6, b.angle + 0.6);
          this.ctx.stroke();
        } else {
          this.ctx.lineWidth = 2.5;
          this.ctx.lineCap = 'round';
          const isLocalBullet = b.playerId === fLocalPlayer?.id;
          const gradient = this.ctx.createLinearGradient(b.prevX, b.prevY, b.x, b.y);
          if (isLocalBullet) {
            gradient.addColorStop(0, 'rgba(102, 252, 241, 0.0)');
            gradient.addColorStop(1, 'rgba(102, 252, 241, 1.0)');
            this.ctx.strokeStyle = gradient;
            this.ctx.shadowColor = '#66fcf1';
          } else {
            gradient.addColorStop(0, 'rgba(255, 60, 60, 0.0)');
            gradient.addColorStop(1, 'rgba(255, 60, 60, 1.0)');
            this.ctx.strokeStyle = gradient;
            this.ctx.shadowColor = '#ff3c3c';
          }
          this.ctx.shadowBlur = 4;
          this.ctx.beginPath();
          this.ctx.moveTo(b.prevX, b.prevY);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.stroke();
        }
        this.ctx.restore();
      });
      frame.particles.forEach(p => {
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.life);
        if (p.type === 'casing') {
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.angle);
          this.ctx.fillStyle = '#d4af37';
          this.ctx.strokeStyle = '#996515';
          this.ctx.lineWidth = 0.5;
          this.ctx.fillRect(-p.size, -p.size / 2, p.size * 2, p.size);
          this.ctx.strokeRect(-p.size, -p.size / 2, p.size * 2, p.size);
        } else if (p.type === 'splinter') {
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.angle);
          this.ctx.fillStyle = '#8b5a2b';
          this.ctx.beginPath();
          this.ctx.moveTo(-p.size, 0);
          this.ctx.lineTo(p.size, -p.size / 2);
          this.ctx.lineTo(p.size / 2, p.size / 2);
          this.ctx.closePath();
          this.ctx.fill();
        } else if (p.type === 'blood') {
          this.ctx.fillStyle = p.color;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fill();
        } else {
          this.ctx.fillStyle = p.color;
          if (p.color.startsWith('#66fc') || p.color.startsWith('#ff3c')) {
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 4;
          }
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      });
    } else {
      this.bullets.forEach(b => b.draw(this.ctx));
      this.particles.drawParticles(this.ctx);
    }
    this.ctx.restore();

    // Draw active/snapshot grenades
    if (frame && frame.grenades) {
      frame.grenades.forEach(g => {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(g.x, g.y, 6, 0, Math.PI * 2);
        this.ctx.fillStyle = '#2d332f';
        this.ctx.strokeStyle = '#66fcf1';
        this.ctx.lineWidth = 1.5;
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
      });
    } else if (this.grenades) {
      this.grenades.forEach(g => g.draw(this.ctx));
    }

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

    // Render flashbang screen whiteout overlay (2 seconds decay)
    let currentFlashAlpha = 0;
    if (frame) {
      const localSnap = frame.players.find(p => p.isLocal);
      if (localSnap) currentFlashAlpha = localSnap.flashAlpha || 0;
    } else if (this.localPlayer) {
      currentFlashAlpha = this.localPlayer.flashAlpha || 0;
    }

    if (currentFlashAlpha > 0) {
      this.ctx.save();
      this.ctx.fillStyle = `rgba(255, 255, 255, ${currentFlashAlpha})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.restore();
    }

    // 3. Zone indicator HUD (screen-space overlay)
    if (!frame) {
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

          // Background fill
          this.ctx.fillStyle = zoneCol;
          this.ctx.fillRect(barX, barY, barW, barH);

          // Border
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
        } catch(e) {}
      }
    }

    // Render Tactical Minimap after 20 seconds of gameplay
    if (!frame && this.gameState === 'playing' && (performance.now() - this.roundStartTime) > 20000) {
      this.ctx.save();
      const mapSize = 150;
      const margin = 20;
      const x = this.canvas.width - mapSize - margin;
      const y = 100;

      // Container background
      this.ctx.fillStyle = 'rgba(6, 7, 10, 0.85)';
      this.ctx.fillRect(x, y, mapSize, mapSize);

      // Gold border
      this.ctx.strokeStyle = 'hsla(43, 74%, 49%, 0.6)';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(x, y, mapSize, mapSize);

      // Header label
      this.ctx.fillStyle = 'hsla(43, 74%, 49%, 0.9)';
      this.ctx.font = 'bold 9px Orbitron';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('TACTICAL MINIMAP', x + mapSize / 2, y - 6);

      const scale = mapSize / this.map.width;

      // Draw walls
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      this.map.walls.forEach(w => {
        this.ctx.fillRect(x + w.x * scale, y + w.y * scale, w.w * scale, w.h * scale);
      });

      // Draw local player (cyan with viewing angle line)
      if (this.localPlayer && this.localPlayer.health > 0) {
        const px = x + this.localPlayer.x * scale;
        const py = y + this.localPlayer.y * scale;

        this.ctx.fillStyle = '#00ffff';
        this.ctx.beginPath();
        this.ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(px, py);
        this.ctx.lineTo(
          px + Math.cos(this.localPlayer.angle) * 7,
          py + Math.sin(this.localPlayer.angle) * 7
        );
        this.ctx.stroke();
      }

      // Draw other players
      const pulse = Math.abs(Math.sin(performance.now() / 200));
      this.players.forEach(p => {
        if (p.health > 0 && !p.isLocal) {
          const px = x + p.x * scale;
          const py = y + p.y * scale;

          if (!p.isTeammate) {
            // Pulsating enemy blip
            this.ctx.fillStyle = `rgba(255, 60, 60, ${0.4 + 0.6 * pulse})`;
            this.ctx.beginPath();
            this.ctx.arc(px, py, 4 + pulse * 2.5, 0, Math.PI * 2);
            this.ctx.fill();

            // Center core
            this.ctx.fillStyle = '#ff3c3c';
            this.ctx.beginPath();
            this.ctx.arc(px, py, 2, 0, Math.PI * 2);
            this.ctx.fill();
          } else {
            // Teammate
            this.ctx.fillStyle = '#39ff14';
            this.ctx.beginPath();
            this.ctx.arc(px, py, 3, 0, Math.PI * 2);
            this.ctx.fill();
          }
        }
      });

      this.ctx.restore();
    }

    // 4. Render Replay Overlay HUD (vibrant AAA style)
    if (frame) {
      this.ctx.save();
      // Translucent red framing
      this.ctx.strokeStyle = 'rgba(255, 60, 60, 0.6)';
      this.ctx.lineWidth = 12;
      this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

      // Flashing REC indicator and "KILLCAM REPLAY" text
      const isFlash = Math.floor(Date.now() / 500) % 2 === 0;
      this.ctx.fillStyle = isFlash ? '#ff3c3c' : 'rgba(255, 60, 60, 0.2)';
      this.ctx.beginPath();
      this.ctx.arc(40, 40, 8, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.font = '900 16px Orbitron';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.textAlign = 'left';
      this.ctx.fillText('KILLCAM REPLAY', 60, 46);

      // Replay progress bar at the bottom
      const progress = this.replayIndex / this.replayFrames.length;
      const barW = this.canvas.width - 80;
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      this.ctx.fillRect(40, this.canvas.height - 40, barW, 6);
      this.ctx.fillStyle = '#ff3c3c';
      this.ctx.fillRect(40, this.canvas.height - 40, barW * progress, 6);
      
      this.ctx.restore();
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
    setTimeout(() => {
      if (!this.active) return;
      this.startReplay(() => this.startRoundCycle());
    }, 3000);
  }

  handleServerMatchOver(data) {
    if (this.gameState !== 'playing' && this.gameState !== 'round-over') return;
    this.gameState = 'round-over';
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

    const finishMatch = () => {
      this.gameState = 'match-over';
      this.active = false;
      if (isWin) {
        this.sound.playMatchWin();
      } else {
        this.sound.playMatchLose();
      }

      if (this.onMatchEnd) {
        this.onMatchEnd(window.MatchStats);
      }
    };

    setTimeout(() => {
      if (!this.active) return;
      this.startReplay(finishMatch);
    }, 3000);
  }
}
