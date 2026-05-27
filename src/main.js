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
  returnLobby: document.getElementById('btn-return-lobby')
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

// Global Game Settings
const gameSettings = {
  volume: 0.5,
  blood: true,
  shadows: true,
  laser: true,
  serverUrl: ''
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
    gameEngine.updateSettings(gameSettings);
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
    alert('Failed to connect to multiplayer server. Starting offline practice mode.');
    disconnectSocket();
    startOfflineMode();
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
      settings: gameSettings,
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
    settings: gameSettings,
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

  showScreen('menu');
});

// Expose remote chat event
window.addEventListener('opponent-chat-msg', (e) => {
  const { name, msg } = e.detail;
  appendChatMessage(name, msg, 'opponent');
});
