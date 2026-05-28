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
  game: document.getElementById('game-screen'),
  matchmaking: document.getElementById('matchmaking-screen')
};

const btns = {
  quickMatch: document.getElementById('btn-ranked-match'),
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

// Weapon locks requirements
const WEAPON_LOCKS = {
  dmr: { rp: 1000, rank: 'VETERAN' },
  sniper: { rp: 1000, rank: 'VETERAN' },
  lmg: { rp: 4000, rank: 'ELITE' }
};

const WEAPON_NAMES = {
  pistol: 'Pistol',
  rifle: 'Rifle',
  shotgun: 'Shotgun',
  sniper: 'Sniper',
  smg: 'SMG',
  lmg: 'LMG',
  dmr: 'DMR'
};

// Device UUID double-redundant persistence helpers
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Strict`;
}

function getOrCreateUUID() {
  let uuid = safeStorage.getItem('tacticstrike_uuid');
  if (!uuid) {
    uuid = getCookie('tacticstrike_uuid');
  }
  if (!uuid) {
    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  safeStorage.setItem('tacticstrike_uuid', uuid);
  setCookie('tacticstrike_uuid', uuid, 365);
  return uuid;
}

function playErrorBeep() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch(e) {}
}

function updateWeaponLocksUI() {
  const rp = parseInt(safeStorage.getItem('tacticstrike_rp') || '0');
  
  // 1. Menu Weapon Buttons
  const wBtns = document.querySelectorAll('#menu-weapon-selector .weapon-btn');
  wBtns.forEach(btn => {
    const weaponKey = btn.dataset.weapon;
    const req = WEAPON_LOCKS[weaponKey];
    if (req && rp < req.rp) {
      btn.classList.add('locked');
      btn.innerHTML = `🔒 ${WEAPON_NAMES[weaponKey]} <span style="font-size:7px; display:block; color:#ff3c3c; margin-top:2.5px; font-family:var(--font-title); font-weight:bold;">${req.rank}</span>`;
    } else {
      btn.classList.remove('locked');
      btn.innerHTML = WEAPON_NAMES[weaponKey] || weaponKey;
    }
  });

  // 2. Lobby Weapon Options
  const options = document.querySelectorAll('.weapon-option');
  options.forEach(opt => {
    const weaponKey = opt.dataset.weapon;
    const req = WEAPON_LOCKS[weaponKey];
    let lockBadge = opt.querySelector('.lock-badge');
    
    if (req && rp < req.rp) {
      opt.classList.add('locked');
      if (!lockBadge) {
        lockBadge = document.createElement('span');
        lockBadge.className = 'lock-badge';
        opt.appendChild(lockBadge);
      }
      lockBadge.innerHTML = `🔒 <span style="font-size:8px; font-weight:bold; color:#ff3c3c; margin-left:2px;">${req.rank}</span>`;
      lockBadge.style.display = 'inline-flex';
    } else {
      opt.classList.remove('locked');
      if (lockBadge) {
        lockBadge.style.display = 'none';
      }
    }
  });

  // 3. Fallback check: if selected weapon is locked, force select pistol
  const activeReq = WEAPON_LOCKS[myWeapon];
  if (activeReq && rp < activeReq.rp) {
    myWeapon = 'pistol';
    safeStorage.setItem('tacticstrike_player_weapon', 'pistol');
    
    // Highlight pistol buttons
    wBtns.forEach(b => {
      if (b.dataset.weapon === 'pistol') b.classList.add('active');
      else b.classList.remove('active');
    });
    options.forEach(o => {
      if (o.dataset.weapon === 'pistol') o.classList.add('active');
      else o.classList.remove('active');
    });
    updateWeaponStatsUI('pistol');
  }
}


// Game Instance & Socket State
let socket = null;
let gameEngine = null;
let currentRoom = null;
let myName = 'Operative';
let myWeapon = 'pistol';
let myColor = 'cyan';
let myMode = '1v1';
let isReady = false;
let lobbyPlayers = [];

// ── Career Stats (localStorage) ────────────────────────────────────────────
function loadCareerStats() {
  try {
    return JSON.parse(localStorage.getItem('tacticstrike_career') || '{"wins":0,"losses":0}');
  } catch(e) { return { wins: 0, losses: 0 }; }
}
function saveCareerStats(s) {
  try { localStorage.setItem('tacticstrike_career', JSON.stringify(s)); } catch(e) {}
}
function renderCareerStats() {
  const s = loadCareerStats();
  const total = s.wins + s.losses;
  const pct = total > 0 ? Math.round((s.wins / total) * 100) : null;
  const wEl = document.getElementById('stat-wins');
  const lEl = document.getElementById('stat-losses');
  const pEl = document.getElementById('stat-winpct');
  if (wEl) wEl.innerText = s.wins;
  if (lEl) lEl.innerText = s.losses;
  if (pEl) pEl.innerText = pct !== null ? `${pct}%` : '—';
}
function recordMatchResult(isWin) {
  const s = loadCareerStats();
  if (isWin) s.wins++; else s.losses++;
  saveCareerStats(s);
  renderCareerStats();
}
// ───────────────────────────────────────────────────────────────────────────

// Audio Background Music
const menuMusic = new Audio('/Midnight_Deployment.mp3');
menuMusic.loop = true;
const waitMusic = new Audio('/Before_The_Starting_Bell.mp3');
waitMusic.loop = true;

let musicStarted = false;
let isMusicMuted = false;

// Weapon Select Music (plays once when a weapon card is clicked)
const weaponSelectMusic = new Audio('/Deployment_Sequence.mp3');
weaponSelectMusic.loop = false;
weaponSelectMusic.volume = 0.18;

function playWeaponSelectMusic() {
  if (isMusicMuted) return;
  try {
    weaponSelectMusic.currentTime = 0;
    weaponSelectMusic.play().catch(() => {});
  } catch(e) {}
}

// Gameplay Tip System
let activeTipKey = null;
const gameplayTips = [
  { key: 'knife', text: 'Equip your Melee Knife (Press 2) to move 15% faster.' },
  { key: 'flashbang', text: 'Throw a Flash Grenade (Press 3) to blind enemies in line-of-sight.' },
  { key: 'dash', text: 'Press Space to dash forward in the direction you are facing (10s CD).' },
  { key: 'flashlight', text: 'Toggle your Flashlight (Press F) to spot enemies in dark rooms.' }
];

function showNextGameplayTip() {
  const panel = document.getElementById('gameplay-tips-panel');
  if (!panel) return;

  const availableTips = gameplayTips.filter(tip => {
    return localStorage.getItem(`tacticstrike_hide_tip_${tip.key}`) !== 'true';
  });

  if (availableTips.length === 0) {
    panel.style.display = 'none';
    activeTipKey = null;
    return;
  }

  const tip = availableTips[Math.floor(Math.random() * availableTips.length)];
  activeTipKey = tip.key;

  const tipTextEl = document.getElementById('tip-text');
  if (tipTextEl) tipTextEl.innerText = tip.text;

  panel.style.display = 'flex';
}

function initTipSystem() {
  const dismissBtn = document.getElementById('btn-dismiss-tip');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      if (activeTipKey) {
        localStorage.setItem(`tacticstrike_hide_tip_${activeTipKey}`, 'true');
        const panel = document.getElementById('gameplay-tips-panel');
        if (panel) panel.style.display = 'none';
        
        // Show another tip after a short delay
        setTimeout(showNextGameplayTip, 1000);
      }
    });
  }
}


window.stopAllMusic = function() {
  try {
    menuMusic.pause();
    menuMusic.currentTime = 0;
    waitMusic.pause();
    waitMusic.currentTime = 0;
  } catch(e) {}
};

function playWaitMusic() {
  if (isMusicMuted) return;
  try {
    menuMusic.pause();
    menuMusic.currentTime = 0;
    waitMusic.currentTime = 0;
    waitMusic.play().catch(() => {});
  } catch(e) {}
}

function playMenuMusic() {
  if (isMusicMuted) return;
  try {
    waitMusic.pause();
    waitMusic.currentTime = 0;
    menuMusic.currentTime = 0;
    menuMusic.play().catch(() => {});
  } catch(e) {}
}

function playGameplayBackgroundMusic() {
  try {
    waitMusic.pause();
    waitMusic.currentTime = 0;
    if (isMusicMuted) return;
    menuMusic.volume = 0.04;
    menuMusic.play().catch(() => {});
  } catch(e) {}
}

function playRankedStartVideo(callback) {
  const overlay = document.getElementById('ranked-video-overlay');
  const video = document.getElementById('ranked-video');
  if (!overlay || !video) {
    callback();
    return;
  }

  video.muted = !!gameSettings.sfxMuted;
  video.volume = typeof gameSettings.volume === 'number' ? gameSettings.volume : 0.5;
  video.currentTime = 0;
  overlay.style.display = 'flex';
  overlay.offsetHeight; // trigger reflow
  overlay.style.opacity = '1';
  
  window.stopAllMusic();

  video.play().then(() => {
    const fadeOutTimeout = setTimeout(() => {
      overlay.style.opacity = '0';
    }, 4400);

    const endTimeout = setTimeout(() => {
      video.pause();
      overlay.style.display = 'none';
      callback();
    }, 5000);

    const onEnded = () => {
      clearTimeout(fadeOutTimeout);
      clearTimeout(endTimeout);
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
        callback();
      }, 500);
      video.removeEventListener('ended', onEnded);
    };
    video.addEventListener('ended', onEnded);
  }).catch(err => {
    console.warn('Ranked video playback failed or blocked by browser:', err);
    overlay.style.opacity = '0';
    overlay.style.display = 'none';
    callback();
  });
}

const RANKS = [
  { id: 'recruit', label: 'RECRUIT',  minRP: 0,    maxRP: 999,  color: '#8a9bb5', icon: '▪' },
  { id: 'veteran', label: 'VETERAN',  minRP: 1000, maxRP: 3999, color: '#e8c84a', icon: '◆' },
  { id: 'elite',   label: 'ELITE',    minRP: 4000, maxRP: Infinity, color: '#ff6ef7', icon: '★' }
];

function getRankForRP(rp) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (rp >= RANKS[i].minRP) return RANKS[i];
  }
  return RANKS[0];
}

function updateMenuRankUI() {
  const rpVal = parseInt(localStorage.getItem('tacticstrike_rp') || '0');
  const rk = getRankForRP(rpVal);
  
  const rIcon = document.getElementById('menu-rank-icon');
  const rLabel = document.getElementById('menu-rank-label');
  const rRp = document.getElementById('menu-rank-rp');
  
  if (rIcon) {
    rIcon.innerText = rk.icon;
    rIcon.style.color = rk.color;
  }
  if (rLabel) {
    rLabel.innerText = rk.label;
    rLabel.style.color = rk.color;
  }
  if (rRp) {
    rRp.innerText = `(${rpVal} RP)`;
  }
}

// Ranked Matchmaking state
let rankSearchExpanded = false;
let rankSearchTimer = null;

// Fallback looping guarantee
menuMusic.addEventListener('ended', () => {
  if (!isMusicMuted) {
    menuMusic.currentTime = 0;
    menuMusic.play().catch(() => {});
  }
});

waitMusic.addEventListener('ended', () => {
  if (!isMusicMuted) {
    waitMusic.currentTime = 0;
    waitMusic.play().catch(() => {});
  }
});

function startMusic() {
  if (musicStarted || isMusicMuted) {
    cleanupMusicListeners();
    return;
  }
  const activeScreen = document.querySelector('.screen.active');
  const isGameplay = (activeScreen && activeScreen.id === 'game') || (screens.game && screens.game.classList.contains('active'));
  if (isGameplay) return;

  if (activeScreen && (activeScreen.id === 'lobby-screen' || activeScreen.id === 'matchmaking-screen')) {
    waitMusic.play().then(() => {
      musicStarted = true;
      cleanupMusicListeners();
    }).catch(() => {});
  } else {
    menuMusic.play().then(() => {
      musicStarted = true;
      cleanupMusicListeners();
    }).catch(() => {});
  }
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
    waitMusic.volume = 0;
  } else {
    const isGameplay = screens.game && screens.game.classList.contains('active');
    menuMusic.volume = isGameplay ? 0.04 : 0.15;
    waitMusic.volume = 0.15;
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
      if (key === 'matchmaking' || key === 'lobby') {
        screens[key].style.display = 'flex';
      }
    } else {
      screens[key].classList.remove('active');
      if (key === 'matchmaking') {
        screens[key].style.display = 'none';
      }
    }
  });

  if (screenKey !== 'matchmaking') {
    if (window.mmDotsInterval) {
      clearInterval(window.mmDotsInterval);
      window.mmDotsInterval = null;
    }
  }

  // Transition music based on screen
  if (screenKey === 'menu') {
    playMenuMusic();
  } else if (screenKey === 'lobby' || screenKey === 'matchmaking') {
    playWaitMusic();
  } else if (screenKey === 'game') {
    playGameplayBackgroundMusic();
    if (window.tipInterval) clearInterval(window.tipInterval);
    showNextGameplayTip();
    window.tipInterval = setInterval(showNextGameplayTip, 18000);
  } else {
    if (window.tipInterval) {
      clearInterval(window.tipInterval);
      window.tipInterval = null;
    }
    const panel = document.getElementById('gameplay-tips-panel');
    if (panel) panel.style.display = 'none';
  }

  updateMusicVolume();
}

// 3. Weapon Selector UI setup
function setupWeaponSelector() {
  const options = document.querySelectorAll('.weapon-option');
  options.forEach(opt => {
    opt.addEventListener('click', (e) => {
      if (opt.classList.contains('locked')) {
        e.preventDefault();
        e.stopPropagation();
        playErrorBeep();
        return;
      }
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      myWeapon = opt.dataset.weapon;
      safeStorage.setItem('tacticstrike_player_weapon', myWeapon);
      updateWeaponStatsUI(myWeapon);
      playWeaponSelectMusic();   // ← play deployment music on weapon pick

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
  lobbyPlayers = players;
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
      
      const playerRP = p.rp || 0;
      const playerRank = getRankForRP(playerRP);
      
      slotEl.innerHTML = `
        <div class="player-info">
          <span class="player-name" style="color: ${playerColor};">
            <span style="color: ${playerRank.color}; margin-right: 4px;">${playerRank.icon}</span>${escapeHTML(p.name)} ${p.id === socket.id ? '(YOU)' : ''}
          </span>
          <span class="player-weapon-desc">RANK: <span style="color:${playerRank.color}">${playerRank.label}</span> | WEAPON: ${weaponName}</span>
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
    
    // Double redundant device sync
    const uuid = getOrCreateUUID();
    const rp = parseInt(safeStorage.getItem('tacticstrike_rp') || '0');
    const career = loadCareerStats();
    socket.emit('sync-device', {
      uuid: uuid,
      rp: rp,
      wins: career.wins,
      losses: career.losses,
      name: myName
    });
  });

  socket.on('device-synced', (data) => {
    console.log('Device synced with database:', data);
    
    const localRP = parseInt(safeStorage.getItem('tacticstrike_rp') || '0');
    const mergedRP = Math.max(localRP, data.rp || 0);
    safeStorage.setItem('tacticstrike_rp', String(mergedRP));
    
    const localCareer = loadCareerStats();
    const mergedWins = Math.max(localCareer.wins, data.wins || 0);
    const mergedLosses = Math.max(localCareer.losses, data.losses || 0);
    saveCareerStats({ wins: mergedWins, losses: mergedLosses });
    
    if (data.name && data.name !== 'Operative') {
      myName = data.name;
      safeStorage.setItem('tacticstrike_player_name', myName);
      if (inputs.name) {
        inputs.name.value = myName;
      }
    }
    
    updateMenuRankUI();
    renderCareerStats();
    updateWeaponLocksUI();
  });

  socket.on('register-response', (res) => {
    if (!res.success) console.warn('Register failed:', res.error);
  });

  socket.on('login-response', (res) => {
    if (!res.success) console.warn('Login failed:', res.error);
  });

  // Socket Events
  socket.on('room-created', ({ roomId, players, autoMatch, mode }) => {
    currentRoom = roomId;
    if (mode) myMode = mode;
    displays.roomCode.innerText = roomId;
    if (autoMatch) {
      updateLobbyUI(players);
      addSystemChatMessage('Created matchmaking room. Waiting for opponent...');
    } else {
      showScreen('lobby');
      updateLobbyUI(players);
      addSystemChatMessage(`Lobby created. Share code [${roomId}] with a friend.`);
    }
  });

  socket.on('room-joined', ({ roomId, players, mode }) => {
    currentRoom = roomId;
    if (mode) myMode = mode;
    displays.roomCode.innerText = roomId;
    showScreen('lobby');
    updateLobbyUI(players);
    addSystemChatMessage(`Joined lobby: ${roomId}`);
    // Cancel rank expansion timer
    if (rankSearchTimer) { clearTimeout(rankSearchTimer); rankSearchTimer = null; }
    rankSearchExpanded = false;
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
    
    // Transition from matchmaking screen to lobby screen once opponent is found
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen && activeScreen.id === 'matchmaking-screen') {
      showScreen('lobby');
    }
  });

  socket.on('players-update', ({ players }) => {
    updateLobbyUI(players);
  });

  socket.on('player-left', ({ players, message }) => {
    updateLobbyUI(players);
    addSystemChatMessage(message);
    if (gameEngine) {
      if (gameEngine.active && gameEngine.mode === 'online') {
        recordMatchResult(true);
        if (gameEngine.isRanked) {
          const myRP = parseInt(localStorage.getItem('tacticstrike_rp') || '0');
          const nextRP = myRP + 80;
          localStorage.setItem('tacticstrike_rp', String(nextRP));
          if (gameEngine.localPlayer) {
            gameEngine.localPlayer.rp = nextRP;
            gameEngine.localPlayer.rank = gameEngine.localPlayer._calcRank(nextRP);
          }
        }
      }
      localStorage.removeItem('tacticstrike_active_match');
      gameEngine.endGameDueToDisconnect(message);
    }
  });

  socket.on('match-start', ({ players, seed, isRanked }) => {
    const initGame = () => {
      showScreen('game');
      const myIndex = players.findIndex(p => p.id === socket.id);
      
      // Clear chat display for fresh round
      displays.chatMessages.innerHTML = '';
      
      // Set active match flag for crash protection
      localStorage.setItem('tacticstrike_active_match', isRanked ? 'ranked' : 'casual');
      
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
        isRanked: !!isRanked, // Pass isRanked
        onMatchEnd: handleMatchEnd,
        onKillFeed: addKillFeedMessage
      });
    };

    playRankedStartVideo(initGame);
  });

  socket.on('opponent-requested-rematch', (data) => {
    const rStatus = document.getElementById('rematch-status');
    let oppName = 'Opponent';
    if (gameEngine && data && data.playerId) {
      const opp = gameEngine.players.find(p => p.id === data.playerId);
      if (opp) {
        oppName = opp.name;
      }
    }
    if (rStatus) {
      rStatus.innerText = `${oppName} requested a rematch! Click REMATCH to accept.`;
    }
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
  const initGame = () => {
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
      isRanked: false, // bots never ranked
      onMatchEnd: handleMatchEnd,
      onKillFeed: addKillFeedMessage
    });
  };

  playRankedStartVideo(initGame);
}

function getRandomWeapon() {
  return ['pistol', 'rifle', 'shotgun', 'sniper', 'smg', 'lmg', 'dmr'][Math.floor(Math.random() * 7)];
}

// Match Over Debriefing Display
  function handleMatchEnd(results) {
    localStorage.removeItem('tacticstrike_active_match');
    if (gameOverModal) gameOverModal.classList.add('active');
    const isWin = !!results.isWin;

    // Record W/L in localStorage only for human online matches!
    if (gameEngine && gameEngine.mode === 'online') {
      recordMatchResult(isWin);
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

    // Set cinematic winner display
    let winnerName = 'Unknown Operative';
    if (gameEngine) {
      const winnerPlayer = gameEngine.players.find(p => p.id === results.winnerId);
      if (winnerPlayer) {
        winnerName = winnerPlayer.name;
      }
    }
    const winnerNameEl = document.getElementById('match-winner-name');
    if (winnerNameEl) {
      winnerNameEl.innerText = `WINNER: ${winnerName}`;
      winnerNameEl.style.color = isWin ? '#39db14' : '#ff3c3c';
    }

    const roundsWonEl = document.getElementById('stat-rounds-won');
    if (roundsWonEl) roundsWonEl.innerText = results.roundsWon || 0;

    const damageDealtEl = document.getElementById('stat-damage-dealt');
    if (damageDealtEl) damageDealtEl.innerText = Math.round(results.damageDealt || 0);

    const accuracyEl = document.getElementById('stat-accuracy');
    if (accuracyEl) accuracyEl.innerText = `${Math.round(results.accuracy || 0)}%`;

    const shotsFiredEl = document.getElementById('stat-shots-fired');
    if (shotsFiredEl) shotsFiredEl.innerText = results.shotsFired || 0;

    // Reset rematch UI on end of match
    const rStatus = document.getElementById('rematch-status');
    if (rStatus) rStatus.innerText = '';
    const rBtn = document.getElementById('btn-rematch');
    if (rBtn) {
      rBtn.disabled = false;
      rBtn.innerText = 'REMATCH';
    }

    // ── Rank / RP Panel ─────────────────────────────────────────────────────
    const rankPanel = document.getElementById('rank-result-panel');
    if (rankPanel) {
      if (gameEngine && gameEngine.isRanked && results.newRank) {
        const rk = results.newRank;
        const delta = results.rpDelta || 0;
        const deltaStr = delta >= 0 ? `+${delta} RP` : `${delta} RP`;
        const deltaColor = delta >= 0 ? '#39ff14' : '#ff3c3c';
        rankPanel.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:22px;color:${rk.color};">${rk.icon}</span>
              <div>
                <div style="font-family:var(--font-title);font-size:11px;color:var(--text-muted);letter-spacing:1px;">CURRENT RANK</div>
                <div style="font-family:var(--font-title);font-size:18px;color:${rk.color};font-weight:700;letter-spacing:2px;">${rk.label}</div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-family:var(--font-title);font-size:11px;color:var(--text-muted);">RANK POINTS</div>
              <div style="font-family:var(--font-title);font-size:16px;color:#fff;font-weight:700;">${results.newRP} RP</div>
              <div style="font-size:12px;color:${deltaColor};font-family:var(--font-title);margin-top:2px;">${deltaStr}</div>
            </div>
          </div>
          ${results.rankChanged ? `<div style="margin-top:10px;padding:6px 12px;background:rgba(${delta>=0?'57,255,20':'255,60,60'},0.12);border:1px solid ${delta>=0?'#39ff14':'#ff3c3c'};border-radius:6px;font-family:var(--font-title);font-size:10px;color:${delta>=0?'#39ff14':'#ff3c3c'};text-align:center;letter-spacing:1px;">${delta>=0?'▲ RANK UP!':'▼ RANK DOWN'} ${results.oldRankLabel} → ${rk.label}</div>` : ''}
        `;
        rankPanel.style.display = 'block';
      } else {
        rankPanel.innerHTML = `<div style="font-family:var(--font-title); font-size:10px; color:var(--text-muted); text-align:center; letter-spacing:1.5px;">CASUAL MATCH - NO RANK EFFECT</div>`;
        rankPanel.style.display = 'block';
      }
    }
    // ─────────────────────────────────────────────────────────────────────────
  }

// UI Event Handlers
function setupUIListeners() {
  // Toggle music mute button in footer
  if (btns.toggleMute) {
    btns.toggleMute.addEventListener('click', () => {
      gameSettings.musicMuted = !gameSettings.musicMuted;
      isMusicMuted = gameSettings.musicMuted;
      if (isMusicMuted) {
        window.stopAllMusic();
      } else {
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen && (activeScreen.id === 'lobby-screen' || activeScreen.id === 'matchmaking-screen')) {
          playWaitMusic();
        } else if (activeScreen && activeScreen.id === 'game-screen') {
          playGameplayBackgroundMusic();
        } else {
          playMenuMusic();
        }
      }
      
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

  // Quick Match — ranked matchmaking with 15-second rank expansion
  if (btns.quickMatch) {
    btns.quickMatch.addEventListener('click', () => {
      if (inputs.name) myName = inputs.name.value.trim() || 'Operative';
      safeStorage.setItem('tacticstrike_player_name', myName);
      connectSocket();
      if (socket) {
        // Get current RP from localStorage
        const myRP = parseInt(localStorage.getItem('tacticstrike_rp') || '0');
        rankSearchExpanded = false;

        // Emit first with strict rank bracket
        socket.emit('auto-match', { playerName: myName, mode: myMode, color: myColor, rp: myRP, rankStrict: true });
        
        // Show matchmaking screen
        showScreen('matchmaking');
        
        // Update matchmaking overlay details
        const mmRankDisplay = document.getElementById('mm-rank-display');
        const mmRankIcon = document.getElementById('mm-rank-icon');
        const mmTimer = document.getElementById('mm-timer');
        const mmExpandNotice = document.getElementById('mm-expand-notice');
        
        const myRank = getRankForRP(myRP);
        if (mmRankDisplay) mmRankDisplay.innerText = myRank.label;
        if (mmRankIcon) {
          mmRankIcon.innerText = myRank.icon;
          mmRankIcon.style.color = myRank.color;
        }
        if (mmTimer) mmTimer.innerText = '0s';
        if (mmExpandNotice) mmExpandNotice.innerText = 'Searching within your skill bracket...';
        
        let seconds = 0;
        if (window.mmInterval) clearInterval(window.mmInterval);
        window.mmInterval = setInterval(() => {
          seconds++;
          if (mmTimer) mmTimer.innerText = `${seconds}s`;
        }, 1000);

        // Start MM dots animation
        let dotCount = 0;
        const mmDots = document.getElementById('mm-dots');
        if (window.mmDotsInterval) clearInterval(window.mmDotsInterval);
        window.mmDotsInterval = setInterval(() => {
          dotCount = (dotCount + 1) % 4;
          if (mmDots) mmDots.innerText = '.'.repeat(dotCount);
        }, 500);

        // After 15 s, expand search to any rank
        if (rankSearchTimer) clearTimeout(rankSearchTimer);
        rankSearchTimer = setTimeout(() => {
          if (!rankSearchExpanded && socket && socket.connected) {
            if (!currentRoom || (lobbyPlayers && lobbyPlayers.length === 1)) {
              rankSearchExpanded = true;
              addSystemChatMessage('⚡ Rank filter removed — expanding search to all ranks...');
              if (mmExpandNotice) mmExpandNotice.innerText = '⚡ Search expanded to all skill ranks!';
              
              if (currentRoom) {
                socket.emit('leave-room');
                currentRoom = null;
              }
              socket.emit('auto-match', { playerName: myName, mode: myMode, color: myColor, rp: myRP, rankStrict: false });
            }
          }
        }, 15000);
      }
    });
  }

  // Cancel matchmaking
  const cancelMmBtn = document.getElementById('btn-cancel-matchmaking');
  if (cancelMmBtn) {
    cancelMmBtn.addEventListener('click', () => {
      if (window.mmInterval) clearInterval(window.mmInterval);
      if (rankSearchTimer) clearTimeout(rankSearchTimer);
      if (socket) {
        socket.emit('leave-room');
      }
      disconnectSocket();
      window.stopAllMusic();
      showScreen('menu');
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
        const nextReadyState = !isReady;
        socket.emit('player-ready', { ready: nextReadyState });
        if (nextReadyState) {
          window.stopAllMusic();
        } else {
          playWaitMusic();
        }
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
      // Reset rank panel for next match
      const rp = document.getElementById('rank-result-panel');
      if (rp) { rp.style.display = 'none'; rp.innerHTML = ''; }
      if (gameEngine) {
        gameEngine.destroy();
        gameEngine = null;
      }
      updateMenuRankUI();
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

  // Leave Game button in HUD
  const gameMenuBtn = document.getElementById('btn-game-menu');
  const gameMenuOverlay = document.getElementById('game-menu-overlay');
  const gameResumeBtn = document.getElementById('btn-game-resume');
  const gameLeaveBtn = document.getElementById('btn-game-leave');

  if (gameMenuBtn && gameMenuOverlay) {
    gameMenuBtn.addEventListener('click', () => {
      gameMenuOverlay.classList.add('active');
    });
  }
  if (gameResumeBtn && gameMenuOverlay) {
    gameResumeBtn.addEventListener('click', () => {
      gameMenuOverlay.classList.remove('active');
    });
  }
  if (gameLeaveBtn && gameMenuOverlay) {
    gameLeaveBtn.addEventListener('click', () => {
      gameMenuOverlay.classList.remove('active');
      if (gameEngine) {
        if (gameEngine.active && gameEngine.mode === 'online') {
          recordMatchResult(false);
          if (gameEngine.isRanked) {
            const myRP = parseInt(localStorage.getItem('tacticstrike_rp') || '0');
            const nextRP = Math.max(0, myRP - 40);
            localStorage.setItem('tacticstrike_rp', String(nextRP));
          }
        }
        localStorage.removeItem('tacticstrike_active_match');
        gameEngine.destroy();
        gameEngine = null;
      }
      if (socket && currentRoom) {
        socket.emit('leave-room');
      }
      disconnectSocket();
      showScreen('menu');
    });
  }

  // Rematch request button
  const rematchBtn = document.getElementById('btn-rematch');
  if (rematchBtn) {
    rematchBtn.addEventListener('click', () => {
      if (gameEngine && gameEngine.mode === 'offline') {
        if (gameOverModal) gameOverModal.classList.remove('active');
        if (gameEngine) {
          gameEngine.destroy();
          gameEngine = null;
        }
        startOfflineMode();
      } else {
        rematchBtn.disabled = true;
        rematchBtn.innerText = 'WAITING...';
        const rStatus = document.getElementById('rematch-status');
        if (rStatus) rStatus.innerText = 'Rematch requested. Waiting for opponent...';
        if (socket) {
          socket.emit('request-rematch');
        }
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

function setupMainMenuWeaponSelector() {
  const wBtns = document.querySelectorAll('#menu-weapon-selector .weapon-btn');
  wBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.classList.contains('locked')) {
        e.preventDefault();
        e.stopPropagation();
        playErrorBeep();
        return;
      }
      wBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      myWeapon = btn.dataset.weapon;
      safeStorage.setItem('tacticstrike_player_weapon', myWeapon);
      playWeaponSelectMusic();
      
      // Sync with lobby weapon option selected
      const lobbyOpts = document.querySelectorAll('.weapon-option');
      lobbyOpts.forEach(opt => {
        if (opt.dataset.weapon === myWeapon) {
          opt.classList.add('active');
        } else {
          opt.classList.remove('active');
        }
      });
      updateWeaponStatsUI(myWeapon);
      
      if (socket && currentRoom) {
        socket.emit('select-weapon', { weapon: myWeapon });
      }
    });
  });
}

// App Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  // Forfeit/crash detection
  const activeMatch = localStorage.getItem('tacticstrike_active_match');
  if (activeMatch) {
    recordMatchResult(false);
    if (activeMatch === 'ranked') {
      const myRP = parseInt(localStorage.getItem('tacticstrike_rp') || '0');
      const nextRP = Math.max(0, myRP - 40);
      localStorage.setItem('tacticstrike_rp', String(nextRP));
    }
    localStorage.removeItem('tacticstrike_active_match');
    alert('Forfeit detected: You disconnected from an active match. Recorded as a loss.');
  }

  initSettings();
  setupWeaponSelector();
  setupMainMenuWeaponSelector();
  setupColorSelector();
  setupModeSelector();
  setupUIListeners();
  initTipSystem();

  // Load or generate operative codename
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

  connectSocket();
  showScreen('menu');

  // Load career stats and rank
  renderCareerStats();
  updateMenuRankUI();

  // Load saved weapon and sync locks
  const savedWeapon = safeStorage.getItem('tacticstrike_player_weapon') || 'pistol';
  myWeapon = savedWeapon;
  updateWeaponLocksUI();

  // Highlight weapon selection in UI
  const wBtns = document.querySelectorAll('#menu-weapon-selector .weapon-btn');
  wBtns.forEach(btn => {
    if (btn.dataset.weapon === myWeapon) btn.classList.add('active');
    else btn.classList.remove('active');
  });
  const lobbyOpts = document.querySelectorAll('.weapon-option');
  lobbyOpts.forEach(opt => {
    if (opt.dataset.weapon === myWeapon) opt.classList.add('active');
    else opt.classList.remove('active');
  });
  updateWeaponStatsUI(myWeapon);

  // Reset stats button
  const resetBtn = document.getElementById('btn-reset-stats');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset your career record? This cannot be undone.')) {
        saveCareerStats({ wins: 0, losses: 0 });
        renderCareerStats();
      }
    });
  }
});

// Expose remote chat event
window.addEventListener('opponent-chat-msg', (e) => {
  const { name, msg } = e.detail;
  appendChatMessage(name, msg, 'opponent');
});

