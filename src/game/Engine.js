import { Player, RP_WIN, RP_LOSS } from './Player.js';
import { Bullet } from './Bullet.js';
import { Map as GameMap } from './Map.js';
import { ParticleEngine } from './Particle.js';
import { Sound } from './Sound.js';
import { Network } from './Network.js';
import { CharacterRenderer } from './CharacterRenderer.js';
import { FirstPersonController } from './FirstPersonController.js';

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
      this.map = new GameMap(this.mapWidth, this.mapHeight, config.seed, config.mapId);
      
      // Sound & particles setup
      this.sound = new Sound();
      this.sound.setVolume((config.settings.volume !== undefined) ? config.settings.volume : 0.5);
      this.particles = new ParticleEngine();
      this.particles.setBloodEnabled(config.settings.blood);
      // Determine rendering performance style based on match mode
      let forcePerformanceMode = false;
      const matchModeString = config.matchMode || config.mode || '';
      this.matchMode = matchModeString;
      this.qpRenderStyle = config.qpRenderStyle;
      
      if (this.isRanked) {
        if (matchModeString.includes('competitive')) {
          forcePerformanceMode = true;
        }
      } else {
        if (config.qpRenderStyle === 'competitive') {
          forcePerformanceMode = true;
        }
      }
      
      this.settings = { ...config.settings };
      // Sabotage mode always forces realistic graphics — ignore competitive/performance preference
      if (this.matchMode === 'sabotage') {
        this.settings.performanceMode = false;
        this.settings.shadows = true;
      } else if (forcePerformanceMode) {
        this.settings.performanceMode = true;
        this.settings.shadows = false;
      } else {
        this.settings.performanceMode = false;
        this.settings.shadows = true;
      }
      
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
      this.activeHitmarkers = [];
      this.floatingNumbers = [];
      this.replayFrames = [];
      this.lastSnapshotTime = 0;
      this.devCheatActive = false;

      this.vents = [];
      this.tasks = [];
      this.activeTask = null;
      this.ventCooldown = 0;
      this.currentVent = null;
      this.sweepAngle = 0;
      this.sweepProgress = 0;
      
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

      // Combat banners and multi-kills
      this.lastKillTime = 0;
      this.multiKillCount = 0;
      this.combatBanner = null;
      
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
      
      // timing
      this.lastTime = performance.now();
      this.roundStartTime = 0;
      this.countdownStart = 0;
      this.matchTimerInterval = null;
      
      // Global engine reference for player speed logic
      window.gameEngine = this;

      // FPS tracking variables
      this.fpsFrameCount = 0;
      this.fpsLastTick = performance.now();
      this.currentFPS = 0;
      
      // Controls binding
      this.keys = {};
      this.mouse = { x: 0, y: 0, gameX: 0, gameY: 0, angle: 0, clicked: false, buttons: {} };
      
      // Sprint Popup variables
      this.lastSprintTime = performance.now();
      this.sprintTipVisible = false;

      // --- Shrinking Zone (battle-royale circle) ---
      this.zone = {
        active: false,
        currentRadius: 0,
        targetRadius: 0,
        centerX: this.mapWidth / 2,
        centerY: this.mapHeight / 2,
        shrinkSpeed: 0,
        damage: 20,          // HP/s when outside
        lastDamageTick: 0,
        warnShown: false
      };
      this.zoneTimer = null;

      // First Person Mode Setup
      const isForcedFPM = this.matchMode && this.matchMode.startsWith('firstperson');
      this.firstPersonMode = isForcedFPM;
      this.firstPersonController = new FirstPersonController('game-canvas-3d');
      this.firstPersonController.init().then(() => {
        if (this.map) {
          this.firstPersonController.build3DMap(this.map);
        }
        if (isForcedFPM) {
          const btn = document.getElementById('btn-toggle-fpm');
          if (btn) {
            btn.style.display = 'none';
          }
          const canvas3d = document.getElementById('game-canvas-3d');
          if (canvas3d) {
            canvas3d.style.display = 'block';
            this.firstPersonController.onResize();
          }
          this.firstPersonController.active = true;
          // Request pointer lock after a small delay to ensure browser doesn't block it
          setTimeout(() => {
            this.requestPointerLock();
          }, 800);
        } else {
          const btn = document.getElementById('btn-toggle-fpm');
          if (btn) {
            btn.style.display = '';
          }
        }
      });

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

      // Apply UI visibility tweaks for Sabotage mode
      if (this.matchMode === 'sabotage') {
        const scoreDisplay = document.querySelector('.score-display');
        if (scoreDisplay) scoreDisplay.style.display = 'none';

        const timerDisplay = document.querySelector('.timer-display');
        if (timerDisplay) timerDisplay.style.display = 'none';

        const oppHPBar = document.querySelector('.bars-container.right-aligned');
        if (oppHPBar) oppHPBar.style.display = 'none';

        const oppWeaponDisplay = document.querySelector('.opponent-weapon-display');
        if (oppWeaponDisplay) oppWeaponDisplay.style.display = 'none';

        const ammoDisplay = document.querySelector('.ammo-display');
        if (ammoDisplay) ammoDisplay.style.display = 'none';

        const inventoryDisplay = document.querySelector('.inventory-display');
        if (inventoryDisplay) inventoryDisplay.style.display = 'none';
      }

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

      // Hacking Minigame inputs intercept
      if (this.activeMinigame) {
        e.preventDefault();
        if (e.key === 'Escape') {
          this.cancelHackingMinigame();
        } else {
          this.handleMinigameKeyPress(e.key.toLowerCase());
        }
        return;
      }

      const isIPressed = e.key.toLowerCase() === 'i';
      const is9Pressed = e.key === '9';
      if ((isIPressed && this.keys['9']) || (is9Pressed && this.keys['i'])) {
        this.devCheatActive = !this.devCheatActive;
        if (this.devCheatActive && this.localPlayer) {
          this.localPlayer.maxHealth = 200;
          this.localPlayer.health = 200;
        } else if (this.localPlayer) {
          this.localPlayer.maxHealth = 100;
          if (this.localPlayer.health > 100) {
            this.localPlayer.health = 100;
          }
        }
        return;
      }

      if (this.matchMode === 'sabotage' && this.localPlayer && this.localPlayer.health > 0) {
        // If inside a vent, handle vent navigation and exit
        if (this.localPlayer.inVent && this.currentVent) {
          if (e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const idx = parseInt(e.key) - 1;
            const targetVent = this.vents[idx];
            if (targetVent && targetVent.id !== this.currentVent.id) {
              this.localPlayer.x = targetVent.x;
              this.localPlayer.y = targetVent.y;
              this.currentVent = targetVent;
              try { this.sound.playFrictionalScrape(0, 0.3, 0.4); } catch(ex) {}
            }
          } else if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            this.localPlayer.inVent = false;
            this.currentVent = null;
            try { this.sound.playFrictionalScrape(0, 0.2, 0.3); } catch(ex) {}
          }
          return;
        }

        // If doing a minigame, handle minigame actions
        if (this.activeTask) {
          if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            const val = Math.abs(Math.sin(this.sweepAngle));
            if (val >= 0.4 && val <= 0.6) {
              this.sweepProgress = Math.min(100, this.sweepProgress + 20);
              try { this.sound.playMetallicClick(0, 2000, 0.08, 0.35); } catch(ex) {}
              if (this.sweepProgress >= 100) {
                const t = this.activeTask;
                t.status = 'completed';
                t.alarmActive = true;
                t.alarmTimer = 15;
                this.activeTask = null;
                this.localPlayer.showTextNotification('TASK COMPLETE! 🚨 ALARM TRIGGERED');
                const dist = Math.hypot(this.localPlayer.x - t.x, this.localPlayer.y - t.y);
                try { this.sound.playAlarmForTask(t.id, dist); } catch(ex) {}

                // Check if all tasks are completed in sabotage mode
                if (this.matchMode === 'sabotage') {
                  const allDone = this.tasks.every(task => task.status === 'completed');
                  if (allDone) {
                    if (this.mode === 'offline') {
                      this.endRound(1, 'tasks completed');
                    } else {
                      // Online mode: Host (Team 1) notifies server about the victory
                      if (this.localPlayer.team === 1 && this.socket) {
                        const killerPlayer = this.players.find(p => p.team === 2);
                        if (killerPlayer) {
                          this.socket.emit('player-died', {
                            winnerId: this.localPlayer.id,
                            winnerName: this.localPlayer.name,
                            loserId: killerPlayer.id,
                            roundNumber: this.roundNumber
                          });
                        }
                      }
                    }
                  }
                }
              }
            } else {
              this.sweepProgress = Math.max(0, this.sweepProgress - 10);
              try { this.sound.playMetallicClick(0, 500, 0.15, 0.25); } catch(ex) {}
            }
          } else if (e.key === 'Escape' || e.key.toLowerCase() === 'f') {
            if (this.activeTask) {
              this.activeTask.status = 'pending';
              this.activeTask = null;
            }
          }
          return;
        }

        // Enter a vent: Press E when near
        if (e.key.toLowerCase() === 'e') {
          const nearVent = this.vents.find(v => Math.hypot(this.localPlayer.x - v.x, this.localPlayer.y - v.y) < 50);
          if (nearVent) {
            if (this.ventCooldown > 0) {
              this.localPlayer.showTextNotification(`VENT COOLDOWN: ${this.ventCooldown.toFixed(1)}s`);
            } else {
              this.localPlayer.inVent = true;
              this.currentVent = nearVent;
              this.ventCooldown = 10;
              try { this.sound.playFrictionalScrape(0, 0.2, 0.35); } catch(ex) {}
            }
            return;
          }
        }

        // Interact with a task: Press F when near
        if (e.key.toLowerCase() === 'f') {
          const nearTask = this.tasks.find(t => t.status === 'pending' && Math.hypot(this.localPlayer.x - t.x, this.localPlayer.y - t.y) < 40);
          if (nearTask) {
            this.activeTask = nearTask;
            nearTask.status = 'doing';
            this.sweepProgress = 0;
            this.sweepAngle = 0;
            return;
          }
        }
      }

      if (e.key === ' ') {
        e.preventDefault();
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

      // Drop stashed items
      if (this.localPlayer && this.localPlayer.health > 0) {
        if (e.key.toLowerCase() === 'h') {
          if (this.localPlayer.healthPacks > 0) {
            this.localPlayer.healthPacks--;
            const itemId = this.spawnItemAt(this.localPlayer.x, this.localPlayer.y, 'health');
            this.localPlayer.showTextNotification('DROPPED HEALTH PACK', '#ff6ef7');
            this.localPlayer.updateHUD();
            
            if (!this.localPlayer.networkDroppedItems) this.localPlayer.networkDroppedItems = [];
            this.localPlayer.networkDroppedItems.push({
              id: itemId,
              x: this.localPlayer.x,
              y: this.localPlayer.y,
              type: 'health'
            });
          }
        }
        if (e.key.toLowerCase() === 'j') {
          if (this.localPlayer.ammoPacks > 0) {
            this.localPlayer.ammoPacks--;
            const itemId = this.spawnItemAt(this.localPlayer.x, this.localPlayer.y, 'ammo');
            this.localPlayer.showTextNotification('DROPPED AMMO PACK', '#ff6ef7');
            this.localPlayer.updateHUD();

            if (!this.localPlayer.networkDroppedItems) this.localPlayer.networkDroppedItems = [];
            this.localPlayer.networkDroppedItems.push({
              id: itemId,
              x: this.localPlayer.x,
              y: this.localPlayer.y,
              type: 'ammo'
            });
          }
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
      
      if (this.firstPersonMode) {
        if (this.localPlayer && this.localPlayer.health > 0) {
          this.localPlayer.angle += e.movementX * 0.0025;
        }
      } else {
        // Calculate coordinates relative to screen center (camera focal point)
        const dx = this.mouse.x - this.canvas.width / 2;
        const dy = this.mouse.y - this.canvas.height / 2;
        this.mouse.angle = Math.atan2(dy, dx);
      }
    };

    this.mousedownHandler = (e) => {
      this.mouse.buttons[e.button] = true;

      if (e.button === 0) { // left click
        const chatInput = document.getElementById('chat-input');
        if (chatInput && document.activeElement === chatInput) return;
        // Block shooting when clicking on interactive HUD elements
        if (e.target.closest('#btn-game-menu') || e.target.closest('.inv-slot') || e.target.closest('button') || e.target.closest('input') || e.target.closest('.inventory-display')) {
          return;
        }
        this.mouse.clicked = true;

        // Re-acquire pointer lock in FPM if click occurs and not locked
        if (this.firstPersonMode) {
          const isLocked = document.pointerLockElement === document.getElementById('game-container');
          if (!isLocked) {
            this.requestPointerLock();
          }
        }
      }

      // Middle click (button 1) + Right click (button 2) toggle cheat
      const isMiddle = e.button === 1;
      const isRight = e.button === 2;
      if ((isMiddle && this.mouse.buttons[2]) || (isRight && this.mouse.buttons[1])) {
        this.devCheatActive = !this.devCheatActive;
        if (this.devCheatActive && this.localPlayer) {
          this.localPlayer.maxHealth = 200;
          this.localPlayer.health = 200;
        } else if (this.localPlayer) {
          this.localPlayer.maxHealth = 100;
          if (this.localPlayer.health > 100) {
            this.localPlayer.health = 100;
          }
        }
      }
    };
    this.mouseupHandler = (e) => {
      this.mouse.buttons[e.button] = false;
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
    
    this.contextmenuHandler = (e) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', this.contextmenuHandler);

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

    // Gamepad / PS5 DualSense support
    this.setupGamepad();

    // Pointer lock listener
    this.pointerLockChangeHandler = () => {
      const isLocked = document.pointerLockElement === document.getElementById('game-container');
      const isForcedFPM = this.matchMode && this.matchMode.startsWith('firstperson');
      if (!isLocked && this.firstPersonMode && !isForcedFPM) {
        // Automatically switch back to 2D when lock is lost (e.g. Esc pressed)
        this.toggleFirstPersonMode();
      }
    };
    document.addEventListener('pointerlockchange', this.pointerLockChangeHandler);
  }

  // ── Gamepad / PS5 DualSense support ─────────────────────────────────────────
  // State is initialized here; actual polling happens in pollGamepad() called
  // from update() every frame so it is guaranteed to run after this.active=true.
  setupGamepad() {
    this._gpState = {
      prevButtons: [],
      deadzone: 0.18,
      aimAngle: 0,
      aimActive: false,
      frameCount: 0,    // used to throttle getGamepads() call
      cachedGP: null    // cached gamepad object to avoid per-frame scanning
    };
  }

  // Called once per frame from update(). Reads all gamepad axes/buttons and
  // maps them to the same keys/mouse state that keyboard/mouse use.
  pollGamepad() {
    if (!navigator.getGamepads) return;
    const GP = this._gpState;

    // Only re-scan the gamepad list every 2 frames to cut getGamepads() overhead.
    GP.frameCount++;
    if (GP.frameCount % 2 === 0) {
      const gamepads = navigator.getGamepads();
      GP.cachedGP = null;
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) { GP.cachedGP = gamepads[i]; break; }
      }
    }
    const gp = GP.cachedGP;
    if (!gp) return;  // no controller connected
    if (!this.localPlayer || this.localPlayer.health <= 0) return;

    const dz  = GP.deadzone;
    const btn = (i) => gp.buttons[i];
    const pressed = (i) => !!(btn(i) && btn(i).pressed);
    const value   = (i) =>  btn(i) ? btn(i).value : 0;
    const prev    = (i) => !!GP.prevButtons[i];

    // ── Left stick → WASD movement ───────────────────────────────────────────
    const lx = Math.abs(gp.axes[0]) > dz ? gp.axes[0] : 0;
    const ly = Math.abs(gp.axes[1]) > dz ? gp.axes[1] : 0;
    this.keys['w'] = ly < -dz;
    this.keys['s'] = ly >  dz;
    this.keys['a'] = lx < -dz;
    this.keys['d'] = lx >  dz;

    // L3 (button 10) = sprint
    this.keys['shift'] = pressed(10);

    // ── Right stick → aim angle ───────────────────────────────────────────────
    const rx = Math.abs(gp.axes[2]) > dz ? gp.axes[2] : 0;
    const ry = Math.abs(gp.axes[3]) > dz ? gp.axes[3] : 0;
    if (Math.hypot(rx, ry) > dz) {
      GP.aimAngle  = Math.atan2(ry, rx);
      GP.aimActive = true;
    } else {
      GP.aimActive = false;
    }
    if (GP.aimActive) {
      this.mouse.angle = GP.aimAngle;
      this.localPlayer.angle = GP.aimAngle;
    }

    // ── R2 (button 7) = shoot ─────────────────────────────────────────────────
    this.mouse.clicked = value(7) > 0.3;

    // ── L1 (button 4) = primary slot, R1 (button 5) = secondary slot ─────────
    if (pressed(4) && !prev(4)) this.localPlayer.switchSlot(1);
    if (pressed(5) && !prev(5)) this.localPlayer.switchSlot(2);

    // ── Circle / O (button 1) = reload ───────────────────────────────────────
    if (pressed(1) && !prev(1)) {
      this.keys['r'] = true;
      setTimeout(() => { this.keys['r'] = false; }, 80);
    }

    // ── Cross / X (button 0) = dash (injects spacebar key, which Player.js reads) ──
    // Hold spacebar key active for one frame when X is newly pressed,
    // but only if the dash cooldown has expired (mirrors what keyboard does).
    this.keys[' '] = pressed(0);

    // ── Triangle (button 3) = flashlight toggle ───────────────────────────────
    if (pressed(3) && !prev(3)) {
      this.localPlayer.flashlightActive = !this.localPlayer.flashlightActive;
      try { this.sound.playMetallicClick(0, 1800, 0.05, 0.15); } catch(e) {}
    }

    // ── Square (button 2) = throw flashbang ──────────────────────────────────
    if (pressed(2) && !prev(2) && this.localPlayer.flashGrenades > 0) {
      this.localPlayer.throwFlashbangRequest = true;
    }

    // Snapshot button states for next-frame edge detection
    GP.prevButtons = Array.from(gp.buttons).map(b => !!(b && b.pressed));
  }

  toggleFirstPersonMode() {
    const isForcedFPM = this.matchMode && this.matchMode.startsWith('firstperson');
    if (isForcedFPM && this.firstPersonMode) {
      const btn = document.getElementById('btn-toggle-fpm');
      if (btn) btn.style.display = 'none';
      const canvas3d = document.getElementById('game-canvas-3d');
      if (canvas3d) {
        canvas3d.style.display = 'block';
        if (this.firstPersonController) {
          this.firstPersonController.onResize();
        }
      }
      this.firstPersonController.active = true;
      this.requestPointerLock();
      return;
    }

    this.firstPersonMode = !this.firstPersonMode;
    const btn = document.getElementById('btn-toggle-fpm');
    const canvas3d = document.getElementById('game-canvas-3d');
    
    if (this.firstPersonMode) {
      if (btn) btn.classList.add('active');
      if (canvas3d) canvas3d.style.display = 'block';
      this.firstPersonController.active = true;
      if (this.firstPersonController) {
        this.firstPersonController.onResize();
      }
      this.requestPointerLock();
    } else {
      if (btn) btn.classList.remove('active');
      if (canvas3d) canvas3d.style.display = 'none';
      this.firstPersonController.active = false;
      this.exitPointerLock();
    }
  }

  requestPointerLock() {
    const container = document.getElementById('game-container');
    if (container && container.requestPointerLock) {
      container.requestPointerLock();
    }
  }

  exitPointerLock() {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
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
    window.removeEventListener('contextmenu', this.contextmenuHandler);
    if (this.pointerLockChangeHandler) {
      document.removeEventListener('pointerlockchange', this.pointerLockChangeHandler);
    }
    if (this.firstPersonController) {
      this.firstPersonController.destroy();
    }
    this.exitPointerLock();
    
    // Restore elements
    const fpmBtn = document.getElementById('btn-toggle-fpm');
    if (fpmBtn) {
      fpmBtn.style.display = '';
      fpmBtn.classList.remove('active');
    }
    const canvas3d = document.getElementById('game-canvas-3d');
    if (canvas3d) {
      canvas3d.style.display = 'none';
    }
    
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
    if (this.zoneTimer) {
      clearTimeout(this.zoneTimer);
      this.zoneTimer = null;
    }

    // Stop any lingering alarm sounds immediately
    if (this.sound) {
      try { this.sound.stopAllAlarms(); } catch(e) {}
      try { this.sound.stopBearMusic(); } catch(e) {}
    }

    // Note: gamepad polling is part of the main update() loop;
    // no separate RAF to cancel.
    
    if (this.network) {
      this.network.destroy();
    }

    // Restore UI visibility tweaks for Sabotage mode
    const scoreDisplay = document.querySelector('.score-display');
    if (scoreDisplay) scoreDisplay.style.display = '';

    const timerDisplay = document.querySelector('.timer-display');
    if (timerDisplay) timerDisplay.style.display = '';

    const oppHPBar = document.querySelector('.bars-container.right-aligned');
    if (oppHPBar) oppHPBar.style.display = '';

    const oppWeaponDisplay = document.querySelector('.opponent-weapon-display');
    if (oppWeaponDisplay) oppWeaponDisplay.style.display = '';

    const ammoDisplay = document.querySelector('.ammo-display');
    if (ammoDisplay) ammoDisplay.style.display = '';

    const inventoryDisplay = document.querySelector('.inventory-display');
    if (inventoryDisplay) inventoryDisplay.style.display = '';

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
    
    let forcePerformanceMode = false;
    const matchModeString = this.matchMode || this.mode || '';
    if (this.isRanked) {
      if (matchModeString.includes('competitive')) {
        forcePerformanceMode = true;
      }
    } else {
      if (this.qpRenderStyle === 'competitive') {
        forcePerformanceMode = true;
      }
    }
    
    this.settings = { ...settings };
    // Sabotage mode always forces realistic graphics
    if (this.matchMode === 'sabotage') {
      this.settings.performanceMode = false;
      this.settings.shadows = true;
    } else if (forcePerformanceMode) {
      this.settings.performanceMode = true;
      this.settings.shadows = false;
    } else {
      this.settings.performanceMode = false;
      this.settings.shadows = true;
    }
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

    if (this.matchMode === 'sabotage') {
      // Vents initialization
      this.vents = [
        { id: 'vent_a', x: 180, y: 180, name: 'North-West Vent' },
        { id: 'vent_b', x: this.mapWidth - 180, y: 180, name: 'North-East Vent' },
        { id: 'vent_c', x: 180, y: this.mapHeight - 180, name: 'South-West Vent' },
        { id: 'vent_d', x: this.mapWidth - 180, y: this.mapHeight - 180, name: 'South-East Vent' },
        { id: 'vent_e', x: 700, y: 700, name: 'Central Vent' }
      ];
      this.ventCooldown = 0;
      this.currentVent = null;
      this.activeTask = null;
      if (this.localPlayer) {
        this.localPlayer.inVent = false;
        this.localPlayer.weaponKey = 'none';
      }

      // Dynamic task locations using map rooms
      const candidates = [];
      for (let i = 0; i < 9; i++) {
        const r = this.map.rooms[i];
        if (r) {
          candidates.push({
            name: r.name || `Section ${i+1}`,
            x: Math.round(r.x + r.w / 2),
            y: Math.round(r.y + r.h / 2)
          });
        }
      }
      candidates.push({ name: "Central Corridors", x: 700, y: 700 });

      // Shuffle and take 5
      const shuffled = [...candidates].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 5);

      const taskNames = [
        "Fix Wiring", "Calibrate Core", "Download Files", 
        "Clear Vent Filters", "Stabilize Energy Grid", "Align Antenna", 
        "Unlock Console", "Refuel Engine", "Inspect Sample", "Reset Breakways"
      ];

      this.tasks = selected.map((c, i) => {
        return {
          id: `task_r${this.roundNumber}_${i}`,
          x: c.x,
          y: c.y,
          name: taskNames[i % taskNames.length] + ` in ${c.name}`,
          rawName: taskNames[i % taskNames.length],
          progress: 0,
          targetProgress: 100,
          status: 'pending',
          alarmActive: false,
          alarmTimer: 0
        };
      });
    }
    
    // Reset sprint warning popup
    this.lastSprintTime = performance.now();
    this.sprintTipVisible = false;
    const popup = document.getElementById('sprint-tip-popup');
    if (popup) popup.style.display = 'none';

    // Seeded/deterministic random choice based on map/lobby seed + round number
    const seedStr = (this.map.seed || "default_seed") + "_" + this.roundNumber;
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    const seededRandom = () => {
      hash = (hash * 1664525 + 1013904223) | 0;
      return (hash >>> 0) / 4294967296;
    };

    const team1Spawns = [this.spawns[0], this.spawns[2]];
    const team2Spawns = [this.spawns[1], this.spawns[3]];
    
    const t1IdxStart = seededRandom() < 0.5 ? 0 : 1;
    const t2IdxStart = seededRandom() < 0.5 ? 0 : 1;

    // Reset all operatives
    this.players.forEach((p, idx) => {
      let spawn;
      if (p.team === 1) {
        spawn = team1Spawns[(t1IdxStart + idx) % team1Spawns.length];
      } else {
        spawn = team2Spawns[(t2IdxStart + idx) % team2Spawns.length];
      }
      p.x = spawn.x;
      p.y = spawn.y;
      p.vx = 0;
      p.vy = 0;
      p.health = (p.isLocal && this.devCheatActive) ? 200 : 100;
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
    if (this.firstPersonController) {
      this.firstPersonController.build3DMap(this.map);
    }
    
    // Sync HUD displays
    this.localPlayer.updateHUD();
    
    // Tick round timer interval
    if (this.matchTimerInterval) clearInterval(this.matchTimerInterval);
    this.matchTime = 120;
    
    const hudStatus = document.getElementById('hud-status');
    if (hudStatus) hudStatus.innerText = `ROUND ${this.roundNumber} - COOLDOWN`;
    
    // Reset shrinking zone
    if (this.zoneTimer) { clearTimeout(this.zoneTimer); this.zoneTimer = null; }
    const halfMap = Math.max(this.mapWidth, this.mapHeight) / 2;
    this.zone.active = false;
    this.zone.currentRadius = halfMap * 1.05;  // starts fully covering map
    this.zone.targetRadius  = halfMap * 1.05;
    this.zone.centerX = this.mapWidth  / 2;
    this.zone.centerY = this.mapHeight / 2;
    this.zone.shrinkSpeed = 0;
    this.zone.lastDamageTick = 0;
    this.zone.warnShown = false;

    // Sound FX init (0 = play immediately from AudioContext.currentTime)
    try { this.sound.playFrictionalScrape(0, 0.5, 0.1); } catch(e) {}
  }

  startRoundAction() {
    this.gameState = 'playing';
    this.roundStartTime = performance.now();
    
    if (this.matchMode === 'sabotage') {
      try { this.sound.playBearMusic(); } catch(e) {}
    }

    const hudStatus = document.getElementById('hud-status');
    if (hudStatus) hudStatus.innerText = 'ENGAGE TARGET';
    
    // Start countdown timer ticking down
    if (this.matchMode !== 'sabotage') {
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

    // ── Shrinking Zone: disabled in Sabotage mode ─────────────────────────
    if (this.matchMode !== 'sabotage') {
      if (this.zoneTimer) clearTimeout(this.zoneTimer);
      this.zoneTimer = setTimeout(() => {
        if (this.gameState !== 'playing') return;
        const halfMap = Math.max(this.mapWidth, this.mapHeight) / 2;
        this.zone.active       = true;
        this.zone.currentRadius = halfMap * 1.05;
        this.zone.targetRadius  = halfMap * 0.12;
        this.zone.shrinkSpeed  = (this.zone.currentRadius - this.zone.targetRadius) / (60 * 60);
        this.zone.lastDamageTick = performance.now();
        this.zone.centerX = this.mapWidth  / 2;
        this.zone.centerY = this.mapHeight / 2;

        const ws = document.getElementById('hud-status');
        if (ws) {
          ws.innerText = '⚠ ZONE CLOSING IN!';
          ws.style.color = '#ff3c3c';
          setTimeout(() => {
            if (this.gameState === 'playing' && ws) {
              ws.innerText = 'ENGAGE TARGET';
              ws.style.color = '';
            }
          }, 2500);
        }
      }, 40000);
    }
  }

  // Triggered when a team dies or time runs out
  endRound(winningTeam, killFeedMsg = '') {
    if (this.gameState !== 'playing') return;
    
    this.gameState = 'round-over';
    if (this.matchTimerInterval) clearInterval(this.matchTimerInterval);

    if (this.matchMode === 'sabotage') {
      try { this.sound.stopBearMusic(); } catch(e) {}
    }

    let feedAlert = document.getElementById('hud-status');
    const myTeam = this.localPlayer.team;

    if (winningTeam === myTeam) {
      this.scoreSelf++;
      if (this.matchMode === 'sabotage') {
        this.scoreSelf = 3; // instantly finishes match
      }
      if (feedAlert) {
        feedAlert.innerText = 'ROUND WON';
        feedAlert.style.color = '#39ff14';
      }
    } else if (winningTeam !== null) {
      this.scoreOpponent++;
      if (this.matchMode === 'sabotage') {
        this.scoreOpponent = 3; // instantly finishes match
      }
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
    }, 0);
  }

  endMatch() {
    this.gameState = 'match-over';
    this.active = false;
    
    // Accumulate final accuracy
    const totalShots = window.MatchStats.shotsFired || 1;
    const accuracyVal = (window.MatchStats.hitsRegistered / totalShots) * 100;
    window.MatchStats.accuracy = accuracyVal;
    window.MatchStats.roundsWon = this.scoreSelf;
    const winningTeam = (this.matchMode === 'sabotage')
      ? (this.scoreSelf > this.scoreOpponent ? this.localPlayer.team : (this.localPlayer.team === 1 ? 2 : 1))
      : (this.scoreSelf >= 3 ? this.localPlayer.team : (this.localPlayer.team === 1 ? 2 : 1));
    const winningPlayer = this.players.find(p => p.team === winningTeam);
    window.MatchStats.winnerId = winningPlayer ? winningPlayer.id : 'unknown';

    // Apply rank RP delta only if ranked
    const isWin = (this.matchMode === 'sabotage')
      ? (this.scoreSelf > this.scoreOpponent)
      : (this.scoreSelf >= 3);
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

    // Track FPS
    this.fpsFrameCount++;
    if (now - this.fpsLastTick >= 1000) {
      this.currentFPS = Math.round((this.fpsFrameCount * 1000) / (now - this.fpsLastTick));
      this.fpsFrameCount = 0;
      this.fpsLastTick = now;
      
      const counterEl = document.getElementById('fps-counter');
      if (counterEl && this.settings && this.settings.showFps) {
        counterEl.innerText = `FPS: ${this.currentFPS}`;
      }
    }

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

  triggerHitmarker(x, y, damage, isHeadshot) {
    this.activeHitmarkers.push({
      x: x,
      y: y,
      age: 0,
      duration: 200,
      isHeadshot: !!isHeadshot
    });

    this.floatingNumbers.push({
      x: x,
      y: y - 10,
      damage: damage,
      age: 0,
      duration: 800,
      isHeadshot: !!isHeadshot
    });
  }

  registerLocalPlayerKill(currentTime) {
    if (currentTime - this.lastKillTime < 4000) {
      this.multiKillCount++;
    } else {
      this.multiKillCount = 1;
    }
    this.lastKillTime = currentTime;

    if (this.multiKillCount >= 2) {
      let bannerText = 'DOUBLE KILL!';
      if (this.multiKillCount === 3) bannerText = 'TRIPLE KILL!';
      else if (this.multiKillCount > 3) bannerText = 'RAMPAGE!';
      
      this.combatBanner = {
        text: bannerText,
        timer: 3.0,
        scale: 2.0
      };
      
      if (this.sound) {
        try {
          this.sound.playHighBeep();
        } catch (e) {
          console.warn(e);
        }
      }
    }
  }

  // Core Game State Update
  update(currentTime) {
    if (!this.lastUpdateTime) {
      this.lastUpdateTime = currentTime;
    }
    const dt = currentTime - this.lastUpdateTime;
    this.lastUpdateTime = currentTime;
    const clampedDt = Math.max(1, Math.min(150, dt));
    this.dtFactor = clampedDt / 16.67;

    if (this.combatBanner) {
      this.combatBanner.timer -= clampedDt / 1000;
      if (this.combatBanner.timer <= 0) {
        this.combatBanner = null;
      }
    }

    // Update active minigame timer
    if (this.activeMinigame) {
      this.activeMinigame.timer -= clampedDt / 1000;
      const timerBar = document.getElementById('minigame-timer-bar');
      if (timerBar) {
        timerBar.style.width = `${Math.max(0, this.activeMinigame.timer / 4.0 * 100)}%`;
      }
      if (this.activeMinigame.timer <= 0) {
        this.failHackingMinigame();
      }
    }

    // Proximity checks for Hacking Supply Terminals
    let nearTerminal = null;
    if (this.map && this.map.terminals && this.localPlayer && this.localPlayer.health > 0) {
      nearTerminal = this.map.terminals.find(t => !t.hacked && Math.hypot(this.localPlayer.x - t.x, this.localPlayer.y - t.y) < 55);
    }

    const hudPrompt = document.getElementById('hud-interaction-prompt');
    if (nearTerminal && this.gameState === 'playing') {
      if (hudPrompt) {
        hudPrompt.style.display = 'block';
        hudPrompt.innerText = this.keys['e'] ? `HACKING... ${Math.round(this.hackingProgress)}%` : 'HOLD [E] TO HACK TERMINAL';
      }
      
      if (this.keys['e'] && !this.activeMinigame) {
        // Lock player velocity
        this.localPlayer.vx = 0;
        this.localPlayer.vy = 0;
        
        if (!this.hackingProgress) this.hackingProgress = 0;
        this.hackingProgress += clampedDt * 0.08;
        if (this.hackingProgress >= 100) {
          this.hackingProgress = 0;
          this.startHackingMinigame(nearTerminal);
        }
      } else if (!this.activeMinigame) {
        this.hackingProgress = Math.max(0, (this.hackingProgress || 0) - clampedDt * 0.1);
      }
    } else {
      if (hudPrompt && !this.activeMinigame) hudPrompt.style.display = 'none';
      this.hackingProgress = 0;
    }

    if (this.matchMode === 'sabotage') {
      if (this.ventCooldown > 0) {
        this.ventCooldown = Math.max(0, this.ventCooldown - clampedDt / 1000);
      }
      if (this.activeTask) {
        this.sweepAngle += 0.06 * this.dtFactor;
      }
      this.tasks.forEach(t => {
        if (t.alarmActive) {
          t.alarmTimer -= clampedDt / 1000;
          // Start the per-task alarm sound when it first becomes active
          const dist = Math.hypot(this.localPlayer.x - t.x, this.localPlayer.y - t.y);
          try { this.sound.playAlarmForTask(t.id, dist); } catch(ex) {}
          if (t.alarmTimer <= 0) {
            t.alarmActive = false;
            t.lastBeepTime = 0;
            // Stop this specific task's alarm
            try { this.sound.stopAlarmForTask(t.id); } catch(ex) {}
          }
        } else {
          // Alarm deactivated externally — ensure sound is stopped
          try { this.sound.stopAlarmForTask(t.id); } catch(ex) {}
        }
      });
    }

    if (this.gameState === 'replay') {
      // Advance replayIndex based on real time (dtFactor corresponds to 60Hz ticks elapsed)
      this.replayIndex += this.dtFactor;
      if (Math.floor(this.replayIndex) >= this.replayFrames.length) {
        if (this.postReplayCallback) {
          const cb = this.postReplayCallback;
          this.postReplayCallback = null;
          cb();
        }
      }
      return;
    }

    // 0. Poll gamepad every frame (runs on same RAF as main loop)
    this.pollGamepad();

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
      if (this.localPlayer.justDashed) {
        this.localPlayer.justDashed = false;
        this.particles.spawnDashParticles(this.localPlayer.x, this.localPlayer.y, this.localPlayer.angle, this.localPlayer.colorTheme);
      }
      
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

      // Check remote/opponent player dashes to trigger visual & sound effects
      this.players.forEach(p => {
        if (p !== this.localPlayer && p.justDashed) {
          p.justDashed = false;
          this.particles.spawnDashParticles(p.x, p.y, p.angle, p.colorTheme);
          if (this.sound) {
            const dist = Math.hypot(p.x - this.localPlayer.x, p.y - this.localPlayer.y);
            this.sound.playDashSound(dist);
          }
        }
      });

      // Check item collisions
      this.localPlayer.checkPickups(this.map, this.sound);
      if (this.mode === 'offline') {
        this.players.forEach(p => {
          if (p.isBot) {
            p.checkPickups(this.map, this.sound);
          }
        });
      }

      // Handle all players (including bots) throwing flash grenades
      this.players.forEach(p => {
        if (this.gameState === 'playing' && p.throwFlashbangRequest && p.flashGrenades > 0) {
          p.throwFlashbangRequest = false;
          p.flashGrenades--;
          if (p.isLocal && !p.isBot) {
            p.updateHUD();
          }

          const speed = 11;
          const vx = Math.cos(p.angle) * speed;
          const vy = Math.sin(p.angle) * speed;
          
          const grenade = new FlashGrenade(p.x, p.y, vx, vy, p.id);
          this.grenades.push(grenade);

          // Play click/throw sound
          try {
            this.sound.playMetallicClick(0, 1500, 0.08, 0.2);
          } catch (ex) {}

          // Send to server if online and thrown by local player
          if (this.mode === 'online' && p.isLocal) {
            this.socket.emit('throw-grenade', {
              x: p.x,
              y: p.y,
              vx: vx,
              vy: vy
            });
          }
        } else {
          p.throwFlashbangRequest = false;
        }
      });
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
      b.update(this.map, this.players, this.particles, this.sound, this.dtFactor);
      
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

    // Update Hitmarkers
    for (let i = this.activeHitmarkers.length - 1; i >= 0; i--) {
      const hm = this.activeHitmarkers[i];
      hm.age += clampedDt;
      if (hm.age >= hm.duration) {
        this.activeHitmarkers.splice(i, 1);
      }
    }

    // Update Floating Numbers
    for (let i = this.floatingNumbers.length - 1; i >= 0; i--) {
      const fn = this.floatingNumbers[i];
      fn.age += clampedDt;
      fn.y -= 1.0 * this.dtFactor;
      if (fn.age >= fn.duration) {
        this.floatingNumbers.splice(i, 1);
      }
    }

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
    const avgTeam1HP = team1List.reduce((sum, p) => {
      let hp = p.health;
      if (p.isLocal && this.devCheatActive) {
        hp = Math.round(hp / 2);
      }
      return sum + hp;
    }, 0) / team1List.length;
    const hpBar = document.getElementById('hud-self-hp');
    if (hpBar) hpBar.style.width = `${Math.max(0, avgTeam1HP)}%`;
    const hpText = document.getElementById('hud-self-hp-text');
    if (hpText) hpText.innerText = Math.round(Math.max(0, avgTeam1HP));

    const enemyTeam = this.localPlayer.team === 1 ? 2 : 1;
    const team2List = this.players.filter(p => p.team === enemyTeam);
    const avgTeam2HP = team2List.reduce((sum, p) => sum + p.health, 0) / team2List.length;
    const oppHpBar = document.getElementById('hud-opponent-hp');
    if (oppHpBar) oppHpBar.style.width = `${Math.max(0, avgTeam2HP)}%`;

    // ── Zone shrink tick ─────────────────────────────────────────────────────
    if (this.zone.active && this.gameState === 'playing') {
      // Slowly shrink radius each frame
      if (this.zone.currentRadius > this.zone.targetRadius) {
        this.zone.currentRadius = Math.max(this.zone.targetRadius, this.zone.currentRadius - this.zone.shrinkSpeed * this.dtFactor);
      }

      // Apply damage to all players outside the zone every second
      const now = currentTime;
      if (now - this.zone.lastDamageTick >= 1000) {
        this.zone.lastDamageTick = now;
        this.players.forEach(p => {
          if (p.health <= 0) return;
          // In online mode, only apply zone damage to the local player authoritatively
          if (this.mode === 'online' && !p.isLocal) return;

          const dx = p.x - this.zone.centerX;
          const dy = p.y - this.zone.centerY;
          const distFromCenter = Math.sqrt(dx * dx + dy * dy);
          if (distFromCenter > this.zone.currentRadius) {
            p.takeDamage(this.zone.damage, this.sound);
            if (p.isLocal && !p.isBot) {
              if (p.showTextNotification) p.showTextNotification('-20 ZONE DAMAGE');
              
              if (this.mode === 'online' && this.socket) {
                const cheatActive = this.devCheatActive;
                const syncedHealth = cheatActive ? Math.round(p.health / 2) : p.health;
                this.socket.emit('sync-health', {
                  playerId: p.id,
                  health: syncedHealth
                });
              }
            }
          }
        });
      }
    }

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
    
    const camLerp = 1 - Math.pow(1 - 0.085, this.dtFactor);
    this.camera.x += (camTargetX - this.camera.x) * camLerp;
    this.camera.y += (camTargetY - this.camera.y) * camLerp;

    // Decay camera shake
    if (this.cameraShake > 0.1) {
      this.camera.shakeX = (Math.random() - 0.5) * this.cameraShake;
      this.camera.shakeY = (Math.random() - 0.5) * this.cameraShake;
      this.cameraShake *= Math.pow(0.88, this.dtFactor); // decay
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

    // 8. Record snapshot for Killcam Replay (throttled at 60Hz to maintain constant size across framerates)
    if (this.gameState === 'playing') {
      if (currentTime - this.lastSnapshotTime >= 1000 / 60) {
        this.lastSnapshotTime = currentTime;
        
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
          brokenLightOn: this.map.ambientLights.brokenCeiling ? this.map.ambientLights.brokenCeiling.on : true
        };
        this.replayFrames.push(snapshot);
        if (this.replayFrames.length > 300) { // 5 seconds at 60fps
          this.replayFrames.shift();
        }
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
    if (this.settings.laser && p.isLocal && this.matchMode !== 'sabotage') {
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
      const idx = Math.min(this.replayFrames.length - 1, Math.floor(this.replayIndex));
      frame = this.replayFrames[idx];
    }
    
    if (this.gameState === 'replay' && !frame) return;

    if (this.firstPersonMode) {
      if (this.firstPersonController) {
        this.firstPersonController.render(this);
      }
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;
      const W = this.canvas.width;
      const H = this.canvas.height;

      // ── Edge Vignette (dark corners for FPS depth) ────────────────────────
      const vgGrad = this.ctx.createRadialGradient(cx, cy, H * 0.28, cx, cy, H * 0.72);
      vgGrad.addColorStop(0, 'rgba(0,0,0,0)');
      vgGrad.addColorStop(1, 'rgba(0,0,0,0.55)');
      this.ctx.fillStyle = vgGrad;
      this.ctx.fillRect(0, 0, W, H);

      // ── Dynamic Crosshair ─────────────────────────────────────────────────
      // Spread grows with movement speed and shrinks at rest
      const spd = this.localPlayer ? Math.hypot(this.localPlayer.vx || 0, this.localPlayer.vy || 0) : 0;
      const flash = this.localPlayer ? (this.localPlayer.muzzleFlash || 0) : 0;
      const spread = 5 + spd * 2.5 + flash * 18;
      const lineLen = 10;
      const dotR = 1.2;

      this.ctx.save();

      // Outer shadow for visibility
      this.ctx.shadowColor = 'rgba(0,0,0,0.8)';
      this.ctx.shadowBlur = 4;
      this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.moveTo(cx - spread - lineLen, cy); this.ctx.lineTo(cx - spread, cy);
      this.ctx.moveTo(cx + spread, cy);           this.ctx.lineTo(cx + spread + lineLen, cy);
      this.ctx.moveTo(cx, cy - spread - lineLen); this.ctx.lineTo(cx, cy - spread);
      this.ctx.moveTo(cx, cy + spread);           this.ctx.lineTo(cx, cy + spread + lineLen);
      this.ctx.stroke();

      // Coloured lines
      const isMoving = spd > 0.5;
      const crossCol = isMoving ? 'rgba(255,220,50,0.85)' : 'rgba(102,252,241,0.90)';
      this.ctx.strokeStyle = crossCol;
      this.ctx.lineWidth = 2;
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = crossCol;
      this.ctx.beginPath();
      this.ctx.moveTo(cx - spread - lineLen, cy); this.ctx.lineTo(cx - spread, cy);
      this.ctx.moveTo(cx + spread, cy);           this.ctx.lineTo(cx + spread + lineLen, cy);
      this.ctx.moveTo(cx, cy - spread - lineLen); this.ctx.lineTo(cx, cy - spread);
      this.ctx.moveTo(cx, cy + spread);           this.ctx.lineTo(cx, cy + spread + lineLen);
      this.ctx.stroke();

      // Centre dot
      this.ctx.shadowBlur = 4;
      this.ctx.fillStyle = crossCol;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();

      this.activeHitmarkers.forEach(hm => {
        const agePct = hm.age / hm.duration;
        const alpha = 1 - agePct;
        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.strokeStyle = hm.isHeadshot ? `rgba(255, 215, 0, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
        this.ctx.lineWidth = hm.isHeadshot ? 2.5 : 1.5;
        const size = 6 + agePct * 6;
        const inner = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(-inner, -inner); this.ctx.lineTo(-size, -size);
        this.ctx.moveTo(inner, -inner); this.ctx.lineTo(size, -size);
        this.ctx.moveTo(-inner, inner); this.ctx.lineTo(-size, size);
        this.ctx.moveTo(inner, inner); this.ctx.lineTo(size, size);
        this.ctx.stroke();
        this.ctx.restore();
      });

      this.floatingNumbers.forEach(fn => {
        const agePct = fn.age / fn.duration;
        const floatHeight = 40 + agePct * 15;
        const screenPos = this.firstPersonController.projectToScreen(fn.x, fn.y, floatHeight);
        if (screenPos) {
          const alpha = 1 - agePct;
          let scale = 1.0;
          if (agePct < 0.25) {
            scale = 1.0 + (agePct / 0.25) * 0.4;
          } else {
            scale = 1.4 - ((agePct - 0.25) / 0.75) * 0.4;
          }
          this.ctx.save();
          this.ctx.translate(screenPos.x, screenPos.y);
          this.ctx.scale(scale, scale);
          
          this.ctx.font = fn.isHeadshot ? "bold 14px 'Orbitron', sans-serif" : "bold 11px 'Orbitron', sans-serif";
          this.ctx.textAlign = 'center';
          
          this.ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
          this.ctx.lineWidth = 3;
          this.ctx.strokeText(fn.damage, 0, 0);
          
          this.ctx.fillStyle = fn.isHeadshot ? `rgba(255, 215, 0, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
          this.ctx.fillText(fn.damage, 0, 0);
          this.ctx.restore();
        }
      });
    } else {
      // Clear canvas
      this.ctx.fillStyle = '#06070a';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Dynamic scale/zoom sizing helper based on resolution
      const refWidth = 1920;
      const refHeight = 1080;
      const ratioX = this.canvas.width / refWidth;
      const ratioY = this.canvas.height / refHeight;
      const scaleFactor = Math.min(ratioX, ratioY);
      this.zoom = Math.max(0.5, Math.min(1.35, scaleFactor));

      // 1. Save state and apply Camera Viewport translations
      this.ctx.save();
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(this.zoom, this.zoom);
      
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
    const brokenLightOn = frame
      ? frame.brokenLightOn
      : (this.map.ambientLights.brokenCeiling ? this.map.ambientLights.brokenCeiling.on : true);

    if (this.map.ambientLights.brokenCeiling) {
      this.map.ambientLights.brokenCeiling.on = brokenLightOn;
    }

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

    // ── Draw shrinking zone circle ──────────────────────────────────────────
    if (!frame && this.zone && this.zone.active) {
      const z = this.zone;
      const now = Date.now();
      const pulse = Math.sin(now / 300) * 0.15 + 0.85;

      this.ctx.save();
      // Danger fill outside the safe zone — draw as a large disc minus inner circle
      // We use a clip-path trick: draw full rect then punch safe circle out
      this.ctx.beginPath();
      // Outer boundary (entire map with margin)
      this.ctx.rect(-100, -100, this.mapWidth + 200, this.mapHeight + 200);
      // Inner safe zone (cut out)
      this.ctx.arc(z.centerX, z.centerY, z.currentRadius, 0, Math.PI * 2, true);
      this.ctx.fillStyle = `rgba(255, 30, 30, ${0.12 * pulse})`;
      this.ctx.fill('evenodd');

      // Safe zone border ring
      this.ctx.beginPath();
      this.ctx.arc(z.centerX, z.centerY, z.currentRadius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(255, 50, 50, ${0.85 * pulse})`;
      this.ctx.lineWidth = 4;
      this.ctx.shadowColor = '#ff2222';
      this.ctx.shadowBlur = 18;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // Inner glow ring
      this.ctx.beginPath();
      this.ctx.arc(z.centerX, z.centerY, z.currentRadius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(255, 150, 150, ${0.3 * pulse})`;
      this.ctx.lineWidth = 12;
      this.ctx.stroke();
      this.ctx.restore();
    }

    // Draw Vents and Tasks in world coordinates
    if (this.matchMode === 'sabotage') {
      this.vents.forEach(v => {
        this.ctx.save();
        this.ctx.translate(v.x, v.y);
        
        this.ctx.fillStyle = '#1e2124';
        this.ctx.fillRect(-20, -15, 40, 30);
        this.ctx.strokeStyle = '#535960';
        this.ctx.lineWidth = 2.5;
        this.ctx.strokeRect(-20, -15, 40, 30);
        
        this.ctx.strokeStyle = '#0f1112';
        this.ctx.lineWidth = 2;
        for (let i = -12; i <= 12; i += 6) {
          this.ctx.beginPath();
          this.ctx.moveTo(i, -10);
          this.ctx.lineTo(i, 10);
          this.ctx.stroke();
        }
        
        const dist = Math.hypot(this.localPlayer.x - v.x, this.localPlayer.y - v.y);
        if (dist < 50 && this.localPlayer.health > 0 && !this.localPlayer.inVent) {
          this.ctx.fillStyle = '#66fcf1';
          this.ctx.font = 'bold 9px Orbitron';
          this.ctx.textAlign = 'center';
          this.ctx.fillText('[E] VENT', 0, -22);
        }
        this.ctx.restore();
      });

      this.tasks.forEach(t => {
        const now = Date.now();
        this.ctx.save();
        this.ctx.translate(t.x, t.y);

        // ── Realistic alarm beacon light (rotates, casts dynamic cone) ──────
        const alarmPhase = (now % 1200) / 1200; // 0..1 full rotation per 1.2s
        const alarmAngle = alarmPhase * Math.PI * 2;
        if (t.alarmActive) {
          // Dynamic flickering intensity
          const flicker = 0.7 + 0.3 * Math.abs(Math.sin(now / 60 + t.x));
          // Cast rotating light cone on ground
          const coneLen = 90 + 20 * Math.abs(Math.sin(now / 200));
          const coneAngle = Math.PI / 6; // 30° cone
          this.ctx.save();
          const gradient = this.ctx.createConicalGradient
            ? null // standard canvas doesn't have conical; we'll use arc segments instead
            : null;
          // Draw two-phase sweep: main beam + secondary mirror
          for (let pass = 0; pass < 2; pass++) {
            const baseAngle = alarmAngle + pass * Math.PI;
            this.ctx.beginPath();
            this.ctx.moveTo(0, -26);
            this.ctx.arc(0, -26, coneLen, baseAngle - coneAngle, baseAngle + coneAngle);
            this.ctx.closePath();
            const grad = this.ctx.createRadialGradient(0, -26, 0, 0, -26, coneLen);
            grad.addColorStop(0, `rgba(255, 60, 40, ${0.55 * flicker})`);
            grad.addColorStop(0.45, `rgba(255, 80, 40, ${0.18 * flicker})`);
            grad.addColorStop(1, 'rgba(255, 40, 0, 0)');
            this.ctx.fillStyle = grad;
            this.ctx.fill();
          }
          // Ground splatter glow
          const splat = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 75);
          splat.addColorStop(0, `rgba(255, 30, 10, ${0.22 * flicker})`);
          splat.addColorStop(1, 'rgba(255,0,0,0)');
          this.ctx.fillStyle = splat;
          this.ctx.beginPath();
          this.ctx.ellipse(0, 5, 75, 35, 0, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();
        } else if (t.status === 'doing') {
          // Soft yellow pulse while doing minigame
          const pulse = 0.12 + 0.1 * Math.abs(Math.sin(now / 350));
          const softGrad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
          softGrad.addColorStop(0, `rgba(255,220,50,${pulse})`);
          softGrad.addColorStop(1, 'rgba(255,200,0,0)');
          this.ctx.fillStyle = softGrad;
          this.ctx.beginPath();
          this.ctx.ellipse(0, 5, 40, 22, 0, 0, Math.PI * 2);
          this.ctx.fill();
        }

        // ── Detailed task console body ────────────────────────────────────
        // Console base plate (metal casing)
        const screenColor = t.status === 'doing' ? '#ffd700' : '#1aff8a';
        const screenGlow  = t.alarmActive ? '#ff3c3c' : (t.status === 'doing' ? '#ffd700' : '#1aff8a');

        // Shadow under console
        this.ctx.fillStyle = 'rgba(0,0,0,0.45)';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 17, 22, 7, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Back panel
        this.ctx.fillStyle = '#1a1f26';
        this.ctx.beginPath();
        this.ctx.roundRect(-18, -18, 36, 32, 3);
        this.ctx.fill();
        this.ctx.strokeStyle = '#3a4555';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        // Screen bezel
        this.ctx.fillStyle = '#0d1117';
        this.ctx.fillRect(-13, -14, 26, 16);
        this.ctx.strokeStyle = '#2a3340';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(-13, -14, 26, 16);

        // Screen display (glowing)
        const screenBg = t.alarmActive ? '#1a0000' : '#001a0a';
        this.ctx.fillStyle = screenBg;
        this.ctx.fillRect(-11, -12, 22, 12);
        // Screen scanlines
        this.ctx.strokeStyle = t.alarmActive ? 'rgba(255,20,20,0.06)' : 'rgba(0,255,100,0.07)';
        this.ctx.lineWidth = 0.8;
        for (let sy = -11; sy < 0; sy += 2) {
          this.ctx.beginPath();
          this.ctx.moveTo(-11, sy);
          this.ctx.lineTo(11, sy);
          this.ctx.stroke();
        }
        // Screen text glow
        if (t.alarmActive) {
          this.ctx.shadowColor = '#ff3c3c';
          this.ctx.shadowBlur = 6;
          this.ctx.fillStyle = '#ff3c3c';
        } else if (t.status === 'completed') {
          this.ctx.shadowColor = '#66fcf1';
          this.ctx.shadowBlur = 6;
          this.ctx.fillStyle = '#66fcf1';
        } else if (t.status === 'doing') {
          this.ctx.shadowColor = '#ffd700';
          this.ctx.shadowBlur = 5;
          this.ctx.fillStyle = '#ffd700';
        } else {
          this.ctx.shadowColor = '#1aff8a';
          this.ctx.shadowBlur = 4;
          this.ctx.fillStyle = '#1aff8a';
        }
        this.ctx.font = 'bold 5px monospace';
        this.ctx.textAlign = 'center';
        const screenText = t.alarmActive ? 'ALARM' : (t.status === 'completed' ? 'DONE' : (t.status === 'doing' ? 'ACTIVE' : 'READY'));
        this.ctx.fillText(screenText, 0, -5);
        this.ctx.shadowBlur = 0;

        // Bottom control strip (buttons + LED)
        this.ctx.fillStyle = '#141a22';
        this.ctx.fillRect(-13, 4, 26, 8);
        // LED indicator
        const ledColor = t.alarmActive
          ? `rgba(255,40,40,${0.6 + 0.4 * Math.abs(Math.sin(now / 90))})`
          : (t.status === 'completed' ? '#66fcf1' : (t.status === 'doing' ? '#ffd700' : '#1aff8a'));
        this.ctx.fillStyle = ledColor;
        if (t.alarmActive) {
          this.ctx.shadowColor = '#ff3c3c';
          this.ctx.shadowBlur = 8;
        }
        this.ctx.beginPath();
        this.ctx.arc(-8, 8, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        // Small buttons
        for (let bx = -1; bx <= 5; bx += 3) {
          this.ctx.fillStyle = '#2a3545';
          this.ctx.fillRect(bx, 6, 2.5, 4);
        }

        // Alarm beacon dome on top
        if (t.alarmActive) {
          // Beacon housing dome
          const beaconFlicker = 0.6 + 0.4 * Math.abs(Math.sin(now / 45));
          this.ctx.fillStyle = '#1a0a0a';
          this.ctx.beginPath();
          this.ctx.arc(0, -26, 6, Math.PI, 0);
          this.ctx.fill();
          // Spinning beacon light
          this.ctx.save();
          this.ctx.translate(0, -26);
          this.ctx.rotate(alarmAngle);
          // Lens
          this.ctx.fillStyle = `rgba(255, 60, 10, ${beaconFlicker})`;
          this.ctx.shadowColor = '#ff3c3c';
          this.ctx.shadowBlur = 14;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.shadowBlur = 0;
          // Inner hot spot
          this.ctx.fillStyle = `rgba(255, 220, 180, ${0.8 * beaconFlicker})`;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 2, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();
          // Beacon pole
          this.ctx.strokeStyle = '#2a1a1a';
          this.ctx.lineWidth = 1.5;
          this.ctx.beginPath();
          this.ctx.moveTo(0, -20);
          this.ctx.lineTo(0, -22);
          this.ctx.stroke();
        } else {
          // Inactive beacon (grey dome)
          this.ctx.fillStyle = '#1a2030';
          this.ctx.beginPath();
          this.ctx.arc(0, -22, 4, Math.PI, 0);
          this.ctx.fill();
          this.ctx.fillStyle = '#2a3040';
          this.ctx.beginPath();
          this.ctx.arc(0, -22, 2, 0, Math.PI * 2);
          this.ctx.fill();
        }

        // Side cable / wire details
        this.ctx.strokeStyle = '#0a0f14';
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.moveTo(-18, 5);
        this.ctx.quadraticCurveTo(-26, 10, -24, 16);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(18, 3);
        this.ctx.quadraticCurveTo(25, 8, 22, 16);
        this.ctx.stroke();

        // Outer edge bolts
        const boltPositions = [[-16,-16],[16,-16],[-16,12],[16,12]];
        boltPositions.forEach(([bx,by]) => {
          this.ctx.fillStyle = '#2c3545';
          this.ctx.beginPath();
          this.ctx.arc(bx, by, 1.5, 0, Math.PI * 2);
          this.ctx.fill();
        });

        // Interact prompt
        const dist = Math.hypot(this.localPlayer.x - t.x, this.localPlayer.y - t.y);
        if (dist < 40 && this.localPlayer.health > 0 && t.status === 'pending') {
          this.ctx.shadowColor = '#ffd700';
          this.ctx.shadowBlur = 8;
          this.ctx.fillStyle = '#ffd700';
          this.ctx.font = 'bold 9px Orbitron';
          this.ctx.textAlign = 'center';
          this.ctx.fillText('[F] INTERACT', 0, -36);
          this.ctx.shadowBlur = 0;
        }
        this.ctx.restore();
      });
    }

    // Render Hitmarkers (World coordinates)
    this.activeHitmarkers.forEach(hm => {
      const agePct = hm.age / hm.duration;
      this.ctx.save();
      this.ctx.translate(hm.x, hm.y);
      
      const alpha = 1 - agePct;
      this.ctx.strokeStyle = hm.isHeadshot ? `rgba(255, 215, 0, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
      this.ctx.lineWidth = hm.isHeadshot ? 2.5 : 1.5;
      
      const size = 5 + agePct * 5;
      const inner = 2;
      
      this.ctx.beginPath();
      this.ctx.moveTo(-inner, -inner);
      this.ctx.lineTo(-size, -size);
      this.ctx.moveTo(inner, -inner);
      this.ctx.lineTo(size, -size);
      this.ctx.moveTo(-inner, inner);
      this.ctx.lineTo(-size, size);
      this.ctx.moveTo(inner, inner);
      this.ctx.lineTo(size, size);
      this.ctx.stroke();
      this.ctx.restore();
    });

    // Render Floating Damage Numbers (World coordinates)
    this.floatingNumbers.forEach(fn => {
      const agePct = fn.age / fn.duration;
      this.ctx.save();
      this.ctx.translate(fn.x, fn.y);
      
      const alpha = 1 - agePct;
      let scale = 1.0;
      if (agePct < 0.25) {
        scale = 1.0 + (agePct / 0.25) * 0.4;
      } else {
        scale = 1.4 - ((agePct - 0.25) / 0.75) * 0.4;
      }
      
      this.ctx.scale(scale, scale);
      
      this.ctx.font = fn.isHeadshot ? "bold 14px 'Orbitron', sans-serif" : "bold 11px 'Orbitron', sans-serif";
      this.ctx.textAlign = 'center';
      
      this.ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
      this.ctx.lineWidth = 3;
      this.ctx.strokeText(fn.damage, 0, 0);
      
      this.ctx.fillStyle = fn.isHeadshot ? `rgba(255, 215, 0, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
      this.ctx.fillText(fn.damage, 0, 0);
      this.ctx.restore();
    });

    // Restore viewport translations
    this.ctx.restore();
    }

    // 2. Render Tactical Screen Edge Vignette Overlay & Scanlines
    this.ctx.save();
    const vignette = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 3,
      this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 1.1
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    
    // Check local player active buffs for vignette color styling
    let edgeColor = 'rgba(0, 0, 0, 0.82)';
    if (this.localPlayer) {
      const now = Date.now();
      const hasAdrenaline = this.localPlayer.adrenalineEndTime && (now < this.localPlayer.adrenalineEndTime) || this.localPlayer.adrenalineActive;
      const hasOverdrive = this.localPlayer.overdriveEndTime && (now < this.localPlayer.overdriveEndTime) || this.localPlayer.overdriveActive;
      
      const hasAlarm = this.matchMode === 'sabotage' && this.tasks && this.tasks.some(t => t.alarmActive);
      if (hasAlarm) {
        const pulse = Math.sin(now / 100) * 0.15 + 0.55;
        edgeColor = `rgba(255, 30, 30, ${pulse})`;
      } else if (hasOverdrive) {
        const pulse = Math.sin(now / 150) * 0.12 + 0.48; // 0.36 to 0.60 alpha
        edgeColor = `rgba(255, 180, 0, ${pulse})`;
      } else if (hasAdrenaline) {
        const pulse = Math.sin(now / 150) * 0.12 + 0.48; // 0.36 to 0.60 alpha
        edgeColor = `rgba(57, 219, 20, ${pulse})`;
      }
    }
    
    vignette.addColorStop(1, edgeColor);
    this.ctx.fillStyle = vignette;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Scanlines
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let y = 0; y < this.canvas.height; y += 4) {
      this.ctx.fillRect(0, y, this.canvas.width, 1);
    }
    this.ctx.restore();

    // Low Health Pulsing Vignette
    if (this.localPlayer && this.localPlayer.health > 0 && this.localPlayer.health < 35 && !frame) {
      this.ctx.save();
      const pulseOpacity = Math.sin(Date.now() / 150) * 0.2 + 0.3;
      const lowHealthVignette = this.ctx.createRadialGradient(
        this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 3,
        this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 1.1
      );
      lowHealthVignette.addColorStop(0, 'rgba(255, 0, 0, 0)');
      lowHealthVignette.addColorStop(1, `rgba(255, 0, 0, ${pulseOpacity})`);
      this.ctx.fillStyle = lowHealthVignette;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.restore();
    }

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

    // Render task checklist (screen-space)
    if (this.matchMode === 'sabotage' && this.gameState === 'playing') {
      this.ctx.save();
      this.ctx.font = "bold 11px 'Orbitron', sans-serif";
      this.ctx.textAlign = 'left';
      
      const startX = 20;
      const startY = 120;
      
      this.ctx.fillStyle = '#ff3c3c';
      this.ctx.fillText("MISSION TASKS:", startX, startY);
      
      this.tasks.forEach((t, index) => {
        const y = startY + 20 + index * 18;
        const isDone = t.status === 'completed';
        
        this.ctx.fillStyle = isDone ? '#39db14' : '#fff';
        this.ctx.font = isDone ? "10px 'Orbitron', sans-serif" : "bold 10px 'Orbitron', sans-serif";
        
        this.ctx.strokeStyle = isDone ? '#39db14' : '#888';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(startX, y - 8, 8, 8);
        if (isDone) {
          this.ctx.fillStyle = '#39db14';
          this.ctx.fillRect(startX + 2, y - 6, 4, 4);
        }
        
        this.ctx.fillText(t.name, startX + 15, y);
      });
      this.ctx.restore();
    }

    // Render vent/task overlays in screen space
    if (this.matchMode === 'sabotage') {
      if (this.localPlayer && this.localPlayer.health > 0) {
        // Vent UI Overlay
        if (this.localPlayer.inVent && this.currentVent) {
          this.ctx.save();
          this.ctx.fillStyle = 'rgba(2, 4, 8, 0.85)';
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          
          this.ctx.fillStyle = 'rgba(102, 252, 241, 0.08)';
          this.ctx.strokeStyle = '#66fcf1';
          this.ctx.lineWidth = 2;
          this.ctx.fillRect(this.canvas.width / 2 - 200, this.canvas.height / 2 - 150, 400, 300);
          this.ctx.strokeRect(this.canvas.width / 2 - 200, this.canvas.height / 2 - 150, 400, 300);
          
          this.ctx.font = "bold 16px 'Orbitron', sans-serif";
          this.ctx.fillStyle = '#66fcf1';
          this.ctx.textAlign = 'center';
          this.ctx.fillText("VENT NETWORK SYSTEM", this.canvas.width / 2, this.canvas.height / 2 - 110);
          
          this.ctx.font = "11px 'Orbitron', sans-serif";
          this.ctx.fillStyle = '#8892b0';
          this.ctx.fillText("Select destination vent code to travel:", this.canvas.width / 2, this.canvas.height / 2 - 80);
          
          this.vents.forEach((v, idx) => {
            const num = idx + 1;
            const isCurrent = v.id === this.currentVent.id;
            this.ctx.fillStyle = isCurrent ? '#ffd700' : '#fff';
            this.ctx.fillText(`[${num}] ${v.name} ${isCurrent ? '(CURRENT LOCATION)' : ''}`, this.canvas.width / 2, this.canvas.height / 2 - 40 + idx * 30);
          });
          
          this.ctx.font = "bold 11px 'Orbitron', sans-serif";
          this.ctx.fillStyle = '#ff3c3c';
          this.ctx.fillText("PRESS [SPACEBAR] TO EXIT VENT", this.canvas.width / 2, this.canvas.height / 2 + 120);
          this.ctx.restore();
        }

        // Minigame UI Overlay (Calibration sweep)
        if (this.activeTask) {
          this.ctx.save();
          this.ctx.fillStyle = 'rgba(2, 4, 8, 0.85)';
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          
          const rx = this.canvas.width / 2 - 200;
          const ry = this.canvas.height / 2 - 140;
          const rw = 400;
          const rh = 280;
          
          this.ctx.fillStyle = '#11151c';
          this.ctx.strokeStyle = '#ffd700';
          this.ctx.lineWidth = 3;
          this.ctx.fillRect(rx, ry, rw, rh);
          this.ctx.strokeRect(rx, ry, rw, rh);
          
          this.ctx.font = "bold 15px 'Orbitron', sans-serif";
          this.ctx.fillStyle = '#ffd700';
          this.ctx.textAlign = 'center';
          this.ctx.fillText(this.activeTask.name.toUpperCase(), this.canvas.width / 2, ry + 35);
          
          this.ctx.font = "11px 'Orbitron', sans-serif";
          this.ctx.fillStyle = '#888';
          this.ctx.fillText("TASK TYPE: GRID CALIBRATION", this.canvas.width / 2, ry + 60);
          
          const targetBoxX = this.canvas.width / 2 - 120;
          const targetBoxY = ry + 100;
          const targetBoxW = 240;
          const targetBoxH = 40;
          
          this.ctx.fillStyle = '#1a1d24';
          this.ctx.fillRect(targetBoxX, targetBoxY, targetBoxW, targetBoxH);
          this.ctx.strokeStyle = '#333';
          this.ctx.strokeRect(targetBoxX, targetBoxY, targetBoxW, targetBoxH);
          
          this.ctx.fillStyle = 'rgba(57, 219, 20, 0.35)';
          this.ctx.fillRect(this.canvas.width / 2 - 24, targetBoxY, 48, targetBoxH);
          this.ctx.strokeStyle = '#39db14';
          this.ctx.strokeRect(this.canvas.width / 2 - 24, targetBoxY, 48, targetBoxH);
          
          const sweepVal = Math.abs(Math.sin(this.sweepAngle));
          const lineX = targetBoxX + sweepVal * targetBoxW;
          this.ctx.strokeStyle = '#fff';
          this.ctx.lineWidth = 3;
          this.ctx.beginPath();
          this.ctx.moveTo(lineX, targetBoxY - 5);
          this.ctx.lineTo(lineX, targetBoxY + targetBoxH + 5);
          this.ctx.stroke();
          
          const pbX = this.canvas.width / 2 - 120;
          const pbY = ry + 175;
          const pbW = 240;
          const pbH = 20;
          
          this.ctx.fillStyle = '#1a1d24';
          this.ctx.fillRect(pbX, pbY, pbW, pbH);
          this.ctx.fillStyle = '#ffd700';
          this.ctx.fillRect(pbX, pbY, (this.sweepProgress / 100) * pbW, pbH);
          this.ctx.strokeStyle = '#ffd700';
          this.ctx.strokeRect(pbX, pbY, pbW, pbH);
          
          this.ctx.font = "bold 10px 'Orbitron', sans-serif";
          this.ctx.fillStyle = '#fff';
          this.ctx.fillText(`CALIBRATION PROGRESS: ${this.sweepProgress}%`, this.canvas.width / 2, pbY + 14);
          
          this.ctx.font = "11px 'Orbitron', sans-serif";
          this.ctx.fillStyle = '#ffaa00';
          this.ctx.fillText("PRESS [SPACEBAR] WHEN LINE IS IN GREEN ZONE", this.canvas.width / 2, ry + 230);
          
          this.ctx.fillStyle = '#888';
          this.ctx.fillText("PRESS [ESC] OR [F] TO ABANDON TASK", this.canvas.width / 2, ry + 255);
          
          this.ctx.restore();
        }
      }
    }

    // Render Tactical Minimap after 20 seconds of gameplay
    if (!frame && this.gameState === 'playing' && (this.matchMode === 'sabotage' || (performance.now() - this.roundStartTime) > 20000)) {
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

      // Draw tasks on minimap in Sabotage mode
      if (this.matchMode === 'sabotage') {
        this.tasks.forEach(t => {
          if (t.status === 'completed') return;
          const tx = x + t.x * scale;
          const ty = y + t.y * scale;
          
          const pulse = Math.abs(Math.sin(performance.now() / 250));
          this.ctx.fillStyle = `rgba(255, 215, 0, ${0.4 + 0.6 * pulse})`;
          this.ctx.beginPath();
          this.ctx.arc(tx, ty, 3.5 + pulse * 2, 0, Math.PI * 2);
          this.ctx.fill();
        });
      }

      // Draw other players
      const pulse = Math.abs(Math.sin(performance.now() / 200));
      this.players.forEach(p => {
        if (p.health > 0 && !p.isLocal) {
          const px = x + p.x * scale;
          const py = y + p.y * scale;

          if (!p.isTeammate) {
            if (this.matchMode === 'sabotage') return; // do not show killer on minimap
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

    // Render Combat Banner
    if (!frame && this.combatBanner) {
      this.ctx.save();
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      const timer = this.combatBanner.timer;
      const text = this.combatBanner.text;
      
      let alpha = 1.0;
      if (timer < 0.5) {
        alpha = timer / 0.5;
      }
      
      const animScale = 1.5 + Math.max(0, timer - 2.5) * 2.0 + 0.05 * Math.sin(Date.now() / 100);
      
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 - 180);
      this.ctx.scale(animScale, animScale);
      
      this.ctx.shadowColor = '#ff3c3c';
      this.ctx.shadowBlur = 20;
      this.ctx.font = "italic 900 24px 'Orbitron', sans-serif";
      
      const grad = this.ctx.createLinearGradient(-150, 0, 150, 0);
      grad.addColorStop(0, `rgba(255, 60, 60, ${alpha})`);
      grad.addColorStop(0.5, `rgba(255, 220, 0, ${alpha})`);
      grad.addColorStop(1, `rgba(255, 60, 60, ${alpha})`);
      
      this.ctx.fillStyle = grad;
      this.ctx.fillText(text, 0, 0);
      
      this.ctx.shadowBlur = 0;
      this.ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 0.4})`;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(-100, 18);
      this.ctx.lineTo(100, 18);
      this.ctx.moveTo(-100, -18);
      this.ctx.lineTo(100, -18);
      this.ctx.stroke();
      
      this.ctx.restore();
    }

    // Render Weapon Upgraded Announcement
    if (this.localPlayer && this.localPlayer.weaponLevelUpAlert > 0 && !frame) {
      this.ctx.save();
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      const timeRemaining = this.localPlayer.weaponLevelUpAlert;
      const alpha = Math.min(1, timeRemaining);
      const scale = 1.0 + 0.15 * Math.sin(Date.now() / 150);
      
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 - 80);
      this.ctx.scale(scale, scale);
      
      this.ctx.shadowColor = '#ffd700';
      this.ctx.shadowBlur = 15;
      
      this.ctx.font = "bold 28px 'Orbitron', sans-serif";
      this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
      this.ctx.fillText("WEAPON UPGRADED", 0, 0);
      
      this.ctx.shadowBlur = 0;
      this.ctx.font = "bold 16px 'Orbitron', sans-serif";
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      this.ctx.fillText(`LVL ${this.localPlayer.weaponLevel}`, 0, 35);
      
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

    if (this.matchMode === 'sabotage') {
      try { this.sound.stopBearMusic(); } catch(e) {}
    }

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

    const losingTeam = data.winningTeam === 1 ? 2 : 1;
    this.players.forEach(p => {
      if (p.team === losingTeam) {
        p.health = 0;
      }
    });

    this.roundNumber = data.roundNumber;
    this.startReplay(() => this.startRoundCycle());
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
    const isWin = (this.matchMode === 'sabotage')
      ? (this.scoreSelf > this.scoreOpponent)
      : (this.scoreSelf >= 3);
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

    const winningTeam = (this.matchMode === 'sabotage')
      ? (data.score1 > data.score2 ? 1 : 2)
      : (data.score1 >= 3 ? 1 : 2);
    const losingTeam = winningTeam === 1 ? 2 : 1;
    this.players.forEach(p => {
      if (p.team === losingTeam) {
        p.health = 0;
      }
    });

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

    this.startReplay(finishMatch);
  }

  // ── Hacking Supply Terminals & Defusal Minigame ──
  spawnItemAt(x, y, type, customId = null) {
    const id = customId || `item_${type}_${Date.now()}_${Math.round(Math.random() * 1000)}`;
    if (this.map.items.some(item => item.id === id)) return id;
    this.map.items.push({ id, x, y, type, active: true });
    return id;
  }

  generateRandomCode() {
    const keys = ['w', 'a', 's', 'd', 'q', 'e', 'r', 'f'];
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += keys[Math.floor(Math.random() * keys.length)];
    }
    return code;
  }

  startHackingMinigame(terminal) {
    const code = this.generateRandomCode();
    this.activeMinigame = {
      terminal,
      code,
      input: '',
      timer: 4.0
    };
    
    this.keys['e'] = false;
    
    const overlay = document.getElementById('hacking-minigame-overlay');
    if (overlay) overlay.style.display = 'flex';
    
    const hudPrompt = document.getElementById('hud-interaction-prompt');
    if (hudPrompt) hudPrompt.style.display = 'none';

    this.renderMinigameKeys();
  }

  renderMinigameKeys() {
    const container = document.getElementById('minigame-keys-container');
    if (!container || !this.activeMinigame) return;

    container.innerHTML = '';
    const code = this.activeMinigame.code;
    const input = this.activeMinigame.input;

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const isTyped = i < input.length;
      const keyBox = document.createElement('div');
      keyBox.style.width = '35px';
      keyBox.style.height = '35px';
      keyBox.style.lineHeight = '35px';
      keyBox.style.borderRadius = '4px';
      keyBox.style.fontFamily = "var(--font-title)";
      keyBox.style.fontWeight = 'bold';
      keyBox.style.fontSize = '14px';
      keyBox.style.textTransform = 'uppercase';
      keyBox.style.border = isTyped ? '1px solid #39ff14' : '1px solid rgba(255,255,255,0.15)';
      keyBox.style.background = isTyped ? 'rgba(57, 255, 20, 0.12)' : 'rgba(0,0,0,0.4)';
      keyBox.style.color = isTyped ? '#39ff14' : 'rgba(255,255,255,0.7)';
      keyBox.style.boxShadow = isTyped ? '0 0 6px rgba(57, 255, 20, 0.25)' : 'none';
      keyBox.innerText = char;
      container.appendChild(keyBox);
    }
  }

  handleMinigameKeyPress(key) {
    if (!this.activeMinigame) return;

    const code = this.activeMinigame.code;
    const input = this.activeMinigame.input;
    const expected = code[input.length];

    if (key === expected) {
      this.activeMinigame.input += key;
      this.renderMinigameKeys();
      
      try { this.sound.playMetallicClick(0, 2500, 0.04, 0.2); } catch(ex) {}

      if (this.activeMinigame.input === code) {
        this.successHackingMinigame();
      }
    } else {
      this.activeMinigame.input = '';
      this.renderMinigameKeys();
      try { this.sound.playMetallicClick(0, 300, 0.15, 0.3); } catch(ex) {}
    }
  }

  cancelHackingMinigame() {
    this.activeMinigame = null;
    const overlay = document.getElementById('hacking-minigame-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  successHackingMinigame() {
    if (!this.activeMinigame) return;
    const term = this.activeMinigame.terminal;
    term.hacked = true;
    
    const lootId1 = this.spawnItemAt(term.x - 22, term.y, 'health');
    const lootId2 = this.spawnItemAt(term.x + 22, term.y, 'adrenaline');
    
    this.localPlayer.showTextNotification('HACK SUCCESSFUL! LOOT SPAWNED', '#39ff14');

    if (!this.localPlayer.networkDroppedItems) this.localPlayer.networkDroppedItems = [];
    this.localPlayer.networkDroppedItems.push({
      id: lootId1,
      x: term.x - 22,
      y: term.y,
      type: 'health'
    });
    this.localPlayer.networkDroppedItems.push({
      id: lootId2,
      x: term.x + 22,
      y: term.y,
      type: 'adrenaline'
    });

    try { this.sound.playMetallicClick(0, 3500, 0.25, 0.45); } catch(e) {}

    this.cancelHackingMinigame();
  }

  failHackingMinigame() {
    this.localPlayer.showTextNotification('HACK FAILED!', '#ff3c3c');
    try { this.sound.playMetallicClick(0, 200, 0.3, 0.45); } catch(e) {}
    this.cancelHackingMinigame();
  }
}
