import { io } from 'socket.io-client';
import { Engine } from './game/Engine.js';

// Safe localStorage wrapper to prevent crash if disabled in browser
const safeStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage.getItem failed:', e);
      return null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage.setItem failed:', e);
    }
  }
};

// DOM Elements
const auth = {
  panel: document.getElementById('auth-panel'),
  tabLogin: document.getElementById('tab-login'),
  tabRegister: document.getElementById('tab-register'),
  formLogin: document.getElementById('form-login'),
  formRegister: document.getElementById('form-register'),
  loginUser: document.getElementById('login-username'),
  loginPass: document.getElementById('login-password'),
  regUser: document.getElementById('reg-username'),
  regPass: document.getElementById('reg-password'),
  btnLogin: document.getElementById('btn-login-submit'),
  btnRegister: document.getElementById('btn-register-submit'),
  btnGuest: document.getElementById('btn-guest-play'),
  profilePanel: document.getElementById('profile-panel'),
  profileName: document.getElementById('profile-codename'),
  statWins: document.getElementById('stat-profile-wins'),
  statRounds: document.getElementById('stat-profile-rounds'),
  statAcc: document.getElementById('stat-profile-acc'),
  btnLogout: document.getElementById('btn-logout')
};

const screens = {
  menu: document.getElementById('menu-screen'),
  lobby: document.getElementById('lobby-screen'),
  game: document.getElementById('game-screen')
};

const btns = {
  quickMatch: document.getElementById('btn-quick-match'),
  createRoom: document.getElementById('btn-create-room'),
  joinRoom: document.getElementById('btn-join-room'),
  practiceBot: document.getElementById('btn-practice-bot'),
  openSettings: document.getElementById('btn-open-settings'),
  closeSettings: document.getElementById('btn-close-settings'),
  leaveLobby: document.getElementById('btn-leave-lobby'),
  readyToggle: document.getElementById('btn-ready-toggle'),
  copyCode: document.getElementById('btn-copy-code'),
  returnLobby: document.getElementById('btn-return-lobby'),
  toggleMute: document.getElementById('btn-toggle-mute')
};

const inputs = {
  name: document.getElementById('player-name-input'),
  roomCode: document.getElementById('room-code-input'),
  chat: document.getElementById('chat-input')
};

const displays = {
  roomCode: document.getElementById('room-code-display'),
  weaponStats: document.getElementById('weapon-stats-display'),
  playersList: document.getElementById('lobby-players-list'),
  chatMessages: document.getElementById('chat-messages'),
  chatDrawer: document.getElementById('chat-drawer')
};

const settings = {
  modal: document.getElementById('settings-modal'),
  volume: document.getElementById('setting-volume'),
  volumeVal: document.getElementById('volume-val'),
  blood: document.getElementById('setting-blood'),
  shadows: document.getElementById('setting-shadows'),
  laser: document.getElementById('setting-laser'),
  serverUrl: document.getElementById('setting-server-url')
};

const gameOverModal = document.getElementById('game-over-modal');

// Weapon Stats DB
const WEAPON_STATS = {
  pistol: { name: 'Tactical 9mm', damage: 22, fireRate: 35, accuracy: 90, magSize: 12, range: 400, reloadTime: 1200, speedMultiplier: 1.0, type: 'Semi-Auto' },
  rifle: { name: 'Assault Rifle (M4A1)', damage: 28, fireRate: 75, accuracy: 70, magSize: 30, range: 600, reloadTime: 2200, speedMultiplier: 1.0, type: 'Automatic' },
  shotgun: { name: 'Shotgun (Remington 870)', damage: 15, fireRate: 20, accuracy: 40, magSize: 6, range: 250, reloadTime: 3000, speedMultiplier: 1.0, type: 'Pump-Action', pellets: 8 },
  sniper: { name: 'Sniper Rifle (AWM)', damage: 95, fireRate: 10, accuracy: 98, magSize: 5, range: 1000, reloadTime: 2800, speedMultiplier: 1.0, type: 'Bolt-Action' },
  smg: { name: 'SMG (MP5)', damage: 18, fireRate: 85, accuracy: 82, magSize: 30, range: 350, reloadTime: 1500, speedMultiplier: 1.0, type: 'Automatic' },
  lmg: { name: 'LMG (M249)', damage: 25, fireRate: 80, accuracy: 75, magSize: 100, range: 550, reloadTime: 4500, speedMultiplier: 1.0, type: 'Automatic' },
  dmr: { name: 'DMR (M14 EBR)', damage: 45, fireRate: 30, accuracy: 94, magSize: 20, range: 800, reloadTime: 2400, speedMultiplier: 1.0, type: 'Semi-Auto' }
};

// Game Instance & Socket State
let socket = null;
let gameEngine = null;
let currentRoom = null;
let myName = 'Operative';
let myWeapon = 'pistol';
let myColor = 'cyan';
let myMode = '1v1';
let isReady = false;

// Audio Background Music
const menuMusic = new Audio('/Midnight_Deployment.mp3');
menuMusic.loop = true;
let musicStarted = false;
let isMusicMuted = false;

// Fallback looping guarantee
menuMusic.addEventListener('ended', () => {
  if (!isMusicMuted) {
    menuMusic.currentTime = 0;
    menuMusic.play().catch(() => {});
  }
});

function startMusic() {
  if (musicStarted || isMusicMuted) {
    cleanupMusicListeners();
    return;
  }
  menuMusic.play().then(() => {
    musicStarted = true;
    updateMusicVolume();
    cleanupMusicListeners();
  }).catch(err => {
    console.warn("Autoplay / play blocked or not loaded yet, retrying on next interaction:", err);
  });
}

function cleanupMusicListeners() {
  ['click', 'keydown', 'touchstart'].forEach(evt => {
    window.removeEventListener(evt, startMusic);
  });
}

// Try to start music on user interactions (keep trying until successful)
['click', 'keydown', 'touchstart'].forEach(evt => {
  window.addEventListener(evt, startMusic);
});

function updateMusicVolume() {
  if (isMusicMuted) {
    menuMusic.volume = 0;
  } else {
    const activeScreen = document.querySelector('.screen.active');
    const isGameActive = activeScreen && activeScreen.id === 'game-screen';
    menuMusic.volume = isGameActive ? 0.04 : 0.15;
  }
}

// Global Game Settings
const gameSettings = {
  volume: 0.5,
  blood: true,
  shadows: true,
  laser: true,
  serverUrl: '',
  musicMuted: false,
  sfxMuted: false
};

// 1. Initialize Settings
function initSettings() {
  // Load from LocalStorage if available
  const savedSettings = safeStorage.getItem('tacticstrike_settings');
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      Object.assign(gameSettings, parsed);
      
      if (settings.volume) settings.volume.value = gameSettings.volume * 100;
      if (settings.volumeVal) settings.volumeVal.innerText = `${Math.round(gameSettings.volume * 100)}%`;
      if (settings.blood) settings.blood.checked = gameSettings.blood;
      if (settings.shadows) settings.shadows.checked = gameSettings.shadows;
      if (settings.laser) settings.laser.checked = gameSettings.laser;
      if (settings.serverUrl) settings.serverUrl.value = gameSettings.serverUrl || '';
      
      isMusicMuted = !!gameSettings.musicMuted;
      const muteMusicCb = document.getElementById('setting-mute-music');
      if (muteMusicCb) muteMusicCb.checked = isMusicMuted;
      
      const muteSfxCb = document.getElementById('setting-mute-sfx');
      if (muteSfxCb) muteSfxCb.checked = !!gameSettings.sfxMuted;
      
      const toggleBtn = document.getElementById('btn-toggle-mute');
      if (toggleBtn) toggleBtn.innerText = isMusicMuted ? 'UNMUTE MUSIC' : 'MUTE MUSIC';
    } catch (e) {
      console.error(e);
    }
  }

  // Bind settings UI changes safely
  if (settings.serverUrl) {
    settings.serverUrl.addEventListener('input', (e) => {
      gameSettings.serverUrl = e.target.value.trim();
      saveSettings();
    });
  }

  if (settings.volume) {
    settings.volume.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      gameSettings.volume = val / 100;
      if (settings.volumeVal) settings.volumeVal.innerText = `${val}%`;
      saveSettings();
    });
  }

  if (settings.blood) {
    settings.blood.addEventListener('change', (e) => {
      gameSettings.blood = e.target.checked;
      saveSettings();
    });
  }

  if (settings.shadows) {
    settings.shadows.addEventListener('change', (e) => {
      gameSettings.shadows = e.target.checked;
      saveSettings();
    });
  }

  if (settings.laser) {
    settings.laser.addEventListener('change', (e) => {
      gameSettings.laser = e.target.checked;
      saveSettings();
    });
  }

  const muteMusicCb = document.getElementById('setting-mute-music');
  if (muteMusicCb) {
    muteMusicCb.addEventListener('change', (e) => {
      gameSettings.musicMuted = e.target.checked;
      isMusicMuted = gameSettings.musicMuted;
      if (isMusicMuted) {
        menuMusic.pause();
      } else {
        menuMusic.play().catch(() => {});
      }
      updateMusicVolume();
      
      const toggleBtn = document.getElementById('btn-toggle-mute');
      if (toggleBtn) toggleBtn.innerText = isMusicMuted ? 'UNMUTE MUSIC' : 'MUTE MUSIC';
      saveSettings();
    });
  }

  const muteSfxCb = document.getElementById('setting-mute-sfx');
  if (muteSfxCb) {
    muteSfxCb.addEventListener('change', (e) => {
      gameSettings.sfxMuted = e.target.checked;
      saveSettings();
    });
  }

  if (btns.openSettings) {
    btns.openSettings.addEventListener('click', () => {
      if (settings.modal) settings.modal.classList.add('active');
    });
  }

  if (btns.closeSettings) {
    btns.closeSettings.addEventListener('click', () => {
      if (settings.modal) settings.modal.classList.remove('active');
    });
  }
}

function saveSettings() {
  safeStorage.setItem('tacticstrike_settings', JSON.stringify(gameSettings));
  if (gameEngine) {
    const sfxVol = gameSettings.sfxMuted ? 0 : gameSettings.volume;
    gameEngine.updateSettings({ ...gameSettings, volume: sfxVol });
  }
}

// 2. Navigation Utilities
function showScreen(screenKey) {
  Object.keys(screens).forEach(key => {
    if (key === screenKey) {
      screens[key].classList.add('active');
    } else {
      screens[key].classList.remove('active');
    }
  });
  updateMusicVolume();
}

// 3. Weapon Selector UI setup
function setupWeaponSelector() {
  const options = document.querySelectorAll('.weapon-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      myWeapon = opt.dataset.weapon;
      updateWeaponStatsUI(myWeapon);

      // Notify server if in a lobby
      if (socket && currentRoom) {
        socket.emit('select-weapon', { weapon: myWeapon });
      }
    });
  });

  // Init stats display
  updateWeaponStatsUI('pistol');
}

function updateWeaponStatsUI(weaponKey) {
  const stats = WEAPON_STATS[weaponKey];
  if (!stats || !displays.weaponStats) return;

  displays.weaponStats.innerHTML = `
    <div class="stat-row">
      <span>DAMAGE:</span>
      <div class="stat-bar"><div class="bar-fill" style="width: ${weaponKey === 'sniper' ? 100 : weaponKey === 'dmr' ? 75 : weaponKey === 'rifle' ? 65 : weaponKey === 'shotgun' ? 80 : weaponKey === 'smg' ? 30 : weaponKey === 'lmg' ? 55 : 35}%"></div></div>
    </div>
    <div class="stat-row">
      <span>FIRE RATE:</span>
      <div class="stat-bar"><div class="bar-fill" style="width: ${weaponKey === 'smg' ? 95 : weaponKey === 'rifle' ? 85 : weaponKey === 'lmg' ? 90 : weaponKey === 'pistol' ? 45 : weaponKey === 'shotgun' ? 25 : weaponKey === 'dmr' ? 35 : 10}%"></div></div>
    </div>
    <div class="stat-row">
      <span>ACCURACY:</span>
      <div class="stat-bar"><div class="bar-fill" style="width: ${stats.accuracy}%"></div></div>
    </div>
    <div class="stat-row">
      <span>MAG CAPACITY:</span>
      <span class="stat-val">${stats.magSize} rounds</span>
    </div>
  `;
}

// 4. Lobby UI Refresh
function updateLobbyUI(players) {
  if (!displays.playersList) return;

  displays.playersList.innerHTML = '';

  const maxCapacity = (myMode === '2v2') ? 4 : 2;
  
  for (let idx = 0; idx < maxCapacity; idx++) {
    const p = players[idx];
    const slotEl = document.createElement('div');
    
    if (p) {
      slotEl.className = `player-slot active ${p.ready ? 'ready' : ''}`;
      const weaponName = WEAPON_STATS[p.weapon]?.name || p.weapon;
      
      const themeColors = {
        cyan: '#66fcf1',
        green: '#39db14',
        purple: '#9d3bff',
        orange: '#ff7f3b',
        yellow: '#ffd700',
        red: '#ff3c3c'
      };
      const playerColor = themeColors[p.color] || '#66fcf1';
      
      const teamLabel = (myMode === '2v2') ? `TEAM ${ (idx % 2 === 0) ? '1' : '2' }` : (idx === 0 ? 'HOST' : 'GUEST');
      
      slotEl.innerHTML = `
        <div class="player-info">
          <span class="player-name" style="color: ${playerColor};">${escapeHTML(p.name)} ${p.id === socket.id ? '(YOU)' : ''}</span>
          <span class="player-weapon-desc">WEAPON: ${weaponName}</span>
        </div>
        <div class="player-badge ${idx % 2 === 0 ? 'host' : 'guest'}">
          ${teamLabel}
        </div>
        <div class="status-badge ${p.ready ? 'ready-status' : 'waiting'}">
          ${p.ready ? 'READY' : 'CHOOSING...'}
        </div>
      `;
    } else {
      slotEl.className = 'player-slot empty';
      const slotNum = idx + 1;
      const expectedTeam = (myMode === '2v2') ? ` (TEAM ${ (idx % 2 === 0) ? '1' : '2' })` : '';
      slotEl.innerHTML = `<div class="slot-status">WAITING FOR OPERATIVE ${slotNum}${expectedTeam}...</div>`;
    }
    
    displays.playersList.appendChild(slotEl);

    if (myMode === '1v1' && idx === 0) {
      const vsEl = document.createElement('div');
      vsEl.className = 'vs-divider';
      vsEl.innerText = 'VS';
      displays.playersList.appendChild(vsEl);
    }
  }

  // Update own ready button text
  const myState = players.find(p => p.id === socket.id);
  if (myState && btns.readyToggle) {
    isReady = myState.ready;
    btns.readyToggle.className = isReady ? 'btn secondary' : 'btn primary';
    btns.readyToggle.innerText = isReady ? 'CANCEL READY' : 'READY TO DEPLOY';
  }
}

// 5. Connect to Socket.io Server
function connectSocket() {
  if (socket) return;

  // Resolve server connection URL
  let serverUrl = gameSettings.serverUrl;
  
  if (!serverUrl) {
    // Fallback: In production, point to Render backend. In development (Vite), point to local server.
    serverUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'http://localhost:3000' 
      : 'https://topdownshooter.onrender.com';
  }

  socket = io(serverUrl);

  socket.on('connect_error', () => {
    // Fail silently or fallback for auto-login without annoying alerts
    console.warn('Failed to connect to multiplayer server.');
  });

  socket.on('connect', () => {
    console.log('Socket connected.');
    // Auto login if credentials exist
    const savedUser = safeStorage.getItem('tacticstrike_logged_in_user');
    const savedHash = safeStorage.getItem('tacticstrike_logged_in_hash');
    if (savedUser && savedHash) {
      socket.emit('login', { username: savedUser, password: savedHash });
    }
  });

  socket.on('register-response', (res) => {
    if (res.success) {
      alert('Operative registered successfully! You can now authorize.');
      if (auth.tabLogin) auth.tabLogin.click();
    } else {
      alert(`Registration failed: ${res.error}`);
    }
  });

  socket.on('login-response', (res) => {
    if (res.success) {
      handleLoginSuccess(res.username, res.stats);
    } else {
      alert(`Authorization failed: ${res.error}`);
      handleLogout();
    }
  });

  socket.on('stats-updated', (res) => {
    updateProfileStatsUI(res.stats);
  });

  // Socket Events
  socket.on('room-created', ({ roomId, players, autoMatch, mode }) => {
    currentRoom = roomId;
    if (mode) myMode = mode;
    displays.roomCode.innerText = roomId;
    showScreen('lobby');
    updateLobbyUI(players);
    addSystemChatMessage(autoMatch ? 'Created matchmaking room. Waiting for opponent...' : `Lobby created. Share code [${roomId}] with a friend.`);
  });

  socket.on('room-joined', ({ roomId, players, mode }) => {
    currentRoom = roomId;
    if (mode) myMode = mode;
    displays.roomCode.innerText = roomId;
    showScreen('lobby');
    updateLobbyUI(players);
    addSystemChatMessage(`Joined lobby: ${roomId}`);
  });

  socket.on('room-error', (msg) => {
    alert(msg);
  });

  socket.on('player-joined', ({ players }) => {
    updateLobbyUI(players);
    const opponent = players.find(p => p.id !== socket.id);
    if (opponent) {
      addSystemChatMessage(`${opponent.name} entered the lobby.`);
    }
  });

  socket.on('players-update', ({ players }) => {
    updateLobbyUI(players);
  });

  socket.on('player-left', ({ players, message }) => {
    updateLobbyUI(players);
    addSystemChatMessage(message);
    if (gameEngine) {
      gameEngine.endGameDueToDisconnect(message);
    }
  });

  socket.on('match-start', ({ players, seed }) => {
    showScreen('game');
    const myIndex = players.findIndex(p => p.id === socket.id);
    
    // Clear chat display for fresh round
    displays.chatMessages.innerHTML = '';
    
    // Instantiate game engine
    if (gameEngine) {
      gameEngine.destroy();
    }
    
    gameEngine = new Engine('game-canvas', {
      mode: 'online',
      socket: socket,
      localPlayerId: socket.id,
      localPlayerName: myName,
      localWeapon: myWeapon,
      localColor: myColor,
      localPlayerIndex: myIndex,
      players: players,
      seed: seed,
      settings: { ...gameSettings, volume: gameSettings.sfxMuted ? 0 : gameSettings.volume },
      matchMode: myMode,
      onMatchEnd: handleMatchEnd,
      onKillFeed: addKillFeedMessage
    });
  });
}

function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentRoom = null;
  }
}

// 6. Gameplay triggers
function startOfflineMode() {
  showScreen('game');
  displays.chatMessages.innerHTML = '';

  if (gameEngine) {
    gameEngine.destroy();
  }

  const playersList = [
    { id: 'player', name: myName, weapon: myWeapon, color: myColor }
  ];
  
  if (myMode === '2v2') {
    playersList.push({ id: 'bot_enemy_1', name: 'Bot Miller (Enemy)', weapon: getRandomWeapon(), color: 'red' });
    playersList.push({ id: 'bot_teammate', name: 'Bot Ramirez (Teammate)', weapon: getRandomWeapon(), color: 'green' });
    playersList.push({ id: 'bot_enemy_2', name: 'Bot Cooper (Enemy)', weapon: getRandomWeapon(), color: 'orange' });
  } else {
    playersList.push({ id: 'bot_enemy_1', name: 'Bot Miller (Enemy)', weapon: getRandomWeapon(), color: 'red' });
  }

  gameEngine = new Engine('game-canvas', {
    mode: 'offline',
    socket: null,
    localPlayerId: 'player',
    localPlayerName: myName,
    localWeapon: myWeapon,
    localColor: myColor,
    localPlayerIndex: 0,
    players: playersList,
    seed: Math.random(),
    settings: { ...gameSettings, volume: gameSettings.sfxMuted ? 0 : gameSettings.volume },
    matchMode: myMode,
    onMatchEnd: handleMatchEnd,
    onKillFeed: addKillFeedMessage
  });
}

function getRandomWeapon() {
  return ['pistol', 'rifle', 'shotgun', 'sniper', 'smg', 'lmg', 'dmr'][Math.floor(Math.random() * 7)];
}

// Match Over Debriefing Display
  function handleMatchEnd(results) {
    if (gameOverModal) gameOverModal.classList.add('active');
    const isWin = results.winnerId === (socket ? socket.id : 'player');
  
    const loggedInUser = safeStorage.getItem('tacticstrike_logged_in_user');
    if (loggedInUser && socket && socket.connected) {
      socket.emit('match-stats', {
        isWin: isWin,
        rounds: results.roundsWon || 0,
        shots: results.shotsFired || 0,
        hits: results.hitsRegistered || 0
      });
    }
  
  const resultTitle = document.getElementById('match-result-title');
  const resultSubtitle = document.getElementById('match-result-subtitle');
  
  if (resultTitle) {
    if (isWin) {
      resultTitle.innerText = 'MISSION ACCOMPLISHED';
      resultTitle.className = 'result-title win';
    } else {
      resultTitle.innerText = 'MISSION FAILED';
      resultTitle.className = 'result-title lose';
    }
  }

  if (resultSubtitle) {
    if (isWin) {
      resultSubtitle.innerText = 'You successfully eliminated the target operative.';
    } else {
      resultSubtitle.innerText = 'You were eliminated by the target operative.';
    }
  }

  const roundsWonEl = document.getElementById('stat-rounds-won');
  if (roundsWonEl) roundsWonEl.innerText = results.roundsWon || 0;

  const damageDealtEl = document.getElementById('stat-damage-dealt');
  if (damageDealtEl) damageDealtEl.innerText = Math.round(results.damageDealt || 0);

  const accuracyEl = document.getElementById('stat-accuracy');
  if (accuracyEl) accuracyEl.innerText = `${Math.round(results.accuracy || 0)}%`;

  const shotsFiredEl = document.getElementById('stat-shots-fired');
  if (shotsFiredEl) shotsFiredEl.innerText = results.shotsFired || 0;
}

// UI Event Handlers
function setupUIListeners() {
  // Toggle music mute button in footer
  if (btns.toggleMute) {
    btns.toggleMute.addEventListener('click', () => {
      gameSettings.musicMuted = !gameSettings.musicMuted;
      isMusicMuted = gameSettings.musicMuted;
      if (isMusicMuted) {
        menuMusic.pause();
      } else {
        menuMusic.play().catch(() => {});
      }
      updateMusicVolume();
      
      const muteMusicCb = document.getElementById('setting-mute-music');
      if (muteMusicCb) muteMusicCb.checked = isMusicMuted;
      
      btns.toggleMute.innerText = isMusicMuted ? 'UNMUTE MUSIC' : 'MUTE MUSIC';
      saveSettings();
    });
  }

  // Set operative name change
  if (inputs.name) {
    inputs.name.addEventListener('change', () => {
      myName = inputs.name.value.trim() || 'Operative';
      safeStorage.setItem('tacticstrike_player_name', myName);
    });
  }

  // Practice Bot
  if (btns.practiceBot) {
    btns.practiceBot.addEventListener('click', () => {
      if (inputs.name) myName = inputs.name.value.trim() || 'Operative';
      safeStorage.setItem('tacticstrike_player_name', myName);
      startOfflineMode();
    });
  }

  // Create Room
  if (btns.createRoom) {
    btns.createRoom.addEventListener('click', () => {
      if (inputs.name) myName = inputs.name.value.trim() || 'Operative';
      safeStorage.setItem('tacticstrike_player_name', myName);
      connectSocket();
      if (socket) {
        socket.emit('create-room', { playerName: myName, mode: myMode, color: myColor });
      }
    });
  }

  // Join Room
  if (btns.joinRoom) {
    btns.joinRoom.addEventListener('click', () => {
      const code = inputs.roomCode ? inputs.roomCode.value.toUpperCase().trim() : '';
      if (!code || code.length !== 5) {
        alert('Please enter a valid 5-character room code.');
        return;
      }
      if (inputs.name) myName = inputs.name.value.trim() || 'Operative';
      safeStorage.setItem('tacticstrike_player_name', myName);
      connectSocket();
      if (socket) {
        socket.emit('join-room', { roomId: code, playerName: myName, color: myColor });
      }
    });
  }

  // Quick Match
  if (btns.quickMatch) {
    btns.quickMatch.addEventListener('click', () => {
      if (inputs.name) myName = inputs.name.value.trim() || 'Operative';
      safeStorage.setItem('tacticstrike_player_name', myName);
      connectSocket();
      if (socket) {
        socket.emit('auto-match', { playerName: myName, mode: myMode, color: myColor });
      }
    });
  }

  // Leave Lobby
  if (btns.leaveLobby) {
    btns.leaveLobby.addEventListener('click', () => {
      if (socket && currentRoom) {
        socket.emit('leave-room');
      }
      disconnectSocket();
      showScreen('menu');
    });
  }

  // Ready Up Toggle
  if (btns.readyToggle) {
    btns.readyToggle.addEventListener('click', () => {
      if (socket && currentRoom) {
        socket.emit('player-ready', { ready: !isReady });
      }
    });
  }

  // Copy Room Code
  if (btns.copyCode) {
    btns.copyCode.addEventListener('click', () => {
      if (currentRoom) {
        navigator.clipboard.writeText(currentRoom).then(() => {
          btns.copyCode.innerText = '✅';
          setTimeout(() => btns.copyCode.innerText = '📋', 1500);
        });
      }
    });
  }

  // Return to Lobby after game over
  if (btns.returnLobby) {
    btns.returnLobby.addEventListener('click', () => {
      if (gameOverModal) gameOverModal.classList.remove('active');
      if (gameEngine) {
        gameEngine.destroy();
        gameEngine = null;
      }
      if (socket && currentRoom) {
        showScreen('lobby');
        isReady = false;
        updateWeaponStatsUI(myWeapon);
      } else {
        // Offline mode goes back to main menu
        disconnectSocket();
        showScreen('menu');
      }
    });
  }

  // Keyboard binding for chat focus
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputs.chat && document.activeElement === inputs.chat) {
        // Send message
        sendChatMessage();
      } else if (screens.game && screens.game.classList.contains('active')) {
        // Focus chat input
        if (displays.chatDrawer && inputs.chat) {
          displays.chatDrawer.classList.add('active');
          inputs.chat.focus();
        }
      }
    }
  });

  if (inputs.chat) {
    inputs.chat.addEventListener('blur', () => {
      setTimeout(() => {
        if (inputs.chat && document.activeElement !== inputs.chat) {
          if (displays.chatDrawer) displays.chatDrawer.classList.remove('active');
        }
      }, 100);
    });
  }
}

// 7. Chat Utilities
function sendChatMessage() {
  if (!inputs.chat) return;
  const msg = inputs.chat.value.trim();
  if (msg) {
    // Append locally
    appendChatMessage(myName, msg, 'self');
    
    // Broadcast online
    if (socket && currentRoom) {
      socket.emit('chat-message', { name: myName, msg });
    }
    inputs.chat.value = '';
  }
  inputs.chat.blur();
}

function appendChatMessage(author, message, type) {
  const msgEl = document.createElement('div');
  msgEl.className = `chat-msg ${type}`;
  
  if (type === 'system') {
    msgEl.innerHTML = `<span class="message">${escapeHTML(message)}</span>`;
  } else {
    msgEl.innerHTML = `
      <span class="author">${escapeHTML(author)}:</span>
      <span class="message">${escapeHTML(message)}</span>
    `;
  }
  
  if (displays.chatMessages) {
    displays.chatMessages.appendChild(msgEl);
    displays.chatMessages.scrollTop = displays.chatMessages.scrollHeight;
  }

  // Temporarily show chat drawer if passive message received
  if (displays.chatDrawer) {
    displays.chatDrawer.classList.add('active');
  }
  if (window.chatTimeout) clearTimeout(window.chatTimeout);
  window.chatTimeout = setTimeout(() => {
    if (inputs.chat && document.activeElement !== inputs.chat) {
      if (displays.chatDrawer) displays.chatDrawer.classList.remove('active');
    }
  }, 4000);
}

function addSystemChatMessage(message) {
  appendChatMessage('', message, 'system');
}

function addKillFeedMessage(killer, victim, weaponKey) {
  const feed = document.getElementById('kill-feed');
  if (!feed) return;
  
  const killEl = document.createElement('div');
  killEl.className = 'kill-msg';
  
  const wName = WEAPON_STATS[weaponKey]?.name || weaponKey;
  
  killEl.innerHTML = `
    <span class="killer">${escapeHTML(killer)}</span> 
    🔫 [<span class="weapon">${wName}</span>] ➔ 
    <span class="victim">${escapeHTML(victim)}</span>
  `;
  
  feed.appendChild(killEl);
  setTimeout(() => killEl.remove(), 5000);
}

// Helper to escape HTML tags
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

function setupColorSelector() {
  const options = document.querySelectorAll('#lobby-color-selector .color-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => {
        o.classList.remove('active');
        o.style.borderColor = 'transparent';
      });
      opt.classList.add('active');
      myColor = opt.dataset.color;
      
      const themeColors = {
        cyan: '#66fcf1',
        green: '#39db14',
        purple: '#9d3bff',
        orange: '#ff7f3b',
        yellow: '#ffd700',
        red: '#ff3c3c'
      };
      opt.style.borderColor = themeColors[myColor];
      safeStorage.setItem('tacticstrike_player_color', myColor);

      // Notify server if in a lobby
      if (socket && currentRoom) {
        socket.emit('select-color', { color: myColor });
      }
    });
  });

  // Pre-select saved color
  const savedColor = safeStorage.getItem('tacticstrike_player_color');
  if (savedColor) {
    const targetOpt = document.querySelector(`#lobby-color-selector .color-option[data-color="${savedColor}"]`);
    if (targetOpt) {
      targetOpt.click();
    }
  }
}

function setupModeSelector() {
  const radios = document.querySelectorAll('input[name="match-mode"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      myMode = radio.value;
    });
  });
}

// App Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  initSettings();
  setupWeaponSelector();
  setupColorSelector();
  setupModeSelector();
  setupUIListeners();
  // Set default name (load from local storage or generate a random one)
  const savedName = safeStorage.getItem('tacticstrike_player_name');
  if (savedName) {
    myName = savedName;
  } else {
    const names = ['Viper', 'Ghost', 'Specter', 'Rex', 'Apex', 'Phantom', 'Onyx', 'Nova'];
    myName = `${names[Math.floor(Math.random() * names.length)]}_${Math.floor(Math.random() * 900 + 100)}`;
    safeStorage.setItem('tacticstrike_player_name', myName);
  }
  if (inputs.name) {
    inputs.name.value = myName;
  }

  setupAuthUI();
  connectSocket(); // Attempt server connect and auto-login

  showScreen('menu');
});

// Helper functions for secure Auth
async function hashPassword(password) {
  if (window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch(e) {}
  }
  // Simple fallback hashing for non-secure HTTP contexts
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'fallback_' + hash.toString(16);
}

function handleLoginSuccess(username, stats) {
  myName = username;
  safeStorage.setItem('tacticstrike_logged_in_user', username);
  safeStorage.setItem('tacticstrike_player_name', username);
  
  if (inputs.name) inputs.name.value = username;
  
  // Toggle UI panels
  if (auth.panel) auth.panel.classList.add('hidden');
  if (auth.profilePanel) auth.profilePanel.classList.remove('hidden');
  if (auth.profileName) auth.profileName.innerText = username.toUpperCase();
  
  updateProfileStatsUI(stats);
}

function updateProfileStatsUI(stats) {
  if (!stats) return;
  if (auth.statWins) auth.statWins.innerText = stats.wins || 0;
  if (auth.statRounds) auth.statRounds.innerText = stats.rounds || 0;
  
  if (auth.statAcc) {
    const accuracy = stats.shots > 0 ? Math.round((stats.hits / stats.shots) * 100) : 0;
    auth.statAcc.innerText = `${accuracy}%`;
  }
}

function handleLogout() {
  myName = 'Operative';
  safeStorage.setItem('tacticstrike_logged_in_user', '');
  safeStorage.setItem('tacticstrike_logged_in_hash', '');
  
  // Re-generate guest name
  const names = ['Viper', 'Ghost', 'Specter', 'Rex', 'Apex', 'Phantom', 'Onyx', 'Nova'];
  myName = `${names[Math.floor(Math.random() * names.length)]}_${Math.floor(Math.random() * 900 + 100)}`;
  safeStorage.setItem('tacticstrike_player_name', myName);
  if (inputs.name) inputs.name.value = myName;

  // Toggle UI panels
  if (auth.panel) auth.panel.classList.remove('hidden');
  if (auth.profilePanel) auth.profilePanel.classList.add('hidden');
  
  if (auth.loginUser) auth.loginUser.value = '';
  if (auth.loginPass) auth.loginPass.value = '';
  if (auth.regUser) auth.regUser.value = '';
  if (auth.regPass) auth.regPass.value = '';
}

function setupAuthUI() {
  // Tab switching
  if (auth.tabLogin && auth.tabRegister) {
    auth.tabLogin.addEventListener('click', () => {
      auth.tabLogin.classList.add('active');
      auth.tabRegister.classList.remove('active');
      if (auth.formLogin) auth.formLogin.classList.remove('hidden');
      if (auth.formRegister) auth.formRegister.classList.add('hidden');
    });
    auth.tabRegister.addEventListener('click', () => {
      auth.tabRegister.classList.add('active');
      auth.tabLogin.classList.remove('active');
      if (auth.formRegister) auth.formRegister.classList.remove('hidden');
      if (auth.formLogin) auth.formLogin.classList.add('hidden');
    });
  }

  // Submit Login
  if (auth.btnLogin) {
    auth.btnLogin.addEventListener('click', async () => {
      const username = auth.loginUser ? auth.loginUser.value.trim() : '';
      const password = auth.loginPass ? auth.loginPass.value : '';
      
      if (!username || !password) {
        alert('Please fill in all authorization fields.');
        return;
      }
      
      connectSocket();
      if (socket) {
        const hashedPassword = await hashPassword(password);
        // Save to cache for auto-login
        safeStorage.setItem('tacticstrike_logged_in_user', username);
        safeStorage.setItem('tacticstrike_logged_in_hash', hashedPassword);
        
        socket.emit('login', { username, password: hashedPassword });
      } else {
        alert('Multiplayer server is offline. Use guest mode to play offline.');
      }
    });
  }

  // Submit Register
  if (auth.btnRegister) {
    auth.btnRegister.addEventListener('click', async () => {
      const username = auth.regUser ? auth.regUser.value.trim() : '';
      const password = auth.regPass ? auth.regPass.value : '';
      
      if (!username || !password) {
        alert('Please fill in all registration fields.');
        return;
      }
      if (username.length < 3 || username.length > 15) {
        alert('Codename must be between 3 and 15 characters.');
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        alert('Codename must contain only letters, numbers, and underscores.');
        return;
      }
      if (password.length < 4) {
        alert('Passkey must be at least 4 characters long.');
        return;
      }
      
      connectSocket();
      if (socket) {
        const hashedPassword = await hashPassword(password);
        socket.emit('register', { username, password: hashedPassword });
      } else {
        alert('Multiplayer server is offline. Cannot register account.');
      }
    });
  }

  // Guest Play
  if (auth.btnGuest) {
    auth.btnGuest.addEventListener('click', () => {
      if (auth.panel) auth.panel.classList.add('hidden');
      if (auth.profilePanel) auth.profilePanel.classList.remove('hidden');
      
      const names = ['Guest_Viper', 'Guest_Ghost', 'Guest_Specter', 'Guest_Rex', 'Guest_Apex', 'Guest_Nova'];
      myName = `${names[Math.floor(Math.random() * names.length)]}_${Math.floor(Math.random() * 900 + 100)}`;
      safeStorage.setItem('tacticstrike_player_name', myName);
      if (inputs.name) inputs.name.value = myName;
      if (auth.profileName) auth.profileName.innerText = myName.toUpperCase();
      
      if (auth.statWins) auth.statWins.innerText = '-';
      if (auth.statRounds) auth.statRounds.innerText = '-';
      if (auth.statAcc) auth.statAcc.innerText = '-';
    });
  }

  // Logout
  if (auth.btnLogout) {
    auth.btnLogout.addEventListener('click', () => {
      handleLogout();
    });
  }
}

// Expose remote chat event
window.addEventListener('opponent-chat-msg', (e) => {
  const { name, msg } = e.detail;
  appendChatMessage(name, msg, 'opponent');
});
