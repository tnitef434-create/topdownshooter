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
  rankedRealistic: document.getElementById('btn-ranked-realistic'),
  rankedCompetitive: document.getElementById('btn-ranked-competitive'),
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
  chat: document.getElementById('chat-input'),
  qpMapSelect: document.getElementById('qp-map-select'),
  lobbyMapSelect: document.getElementById('lobby-map-select')
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
  pistol:  { name: 'Tactical 9mm',          damage: 22, fireRate: 35,  accuracy: 90, magSize: 12,  range: 400,  reloadTime: 1200, speedMultiplier: 1.0,  type: 'Semi-Auto',   damagePct: 33, fireRatePct: 45 },
  rifle:   { name: 'Assault Rifle (M4A1)',   damage: 28, fireRate: 75,  accuracy: 70, magSize: 30,  range: 600,  reloadTime: 2200, speedMultiplier: 1.0,  type: 'Automatic',   damagePct: 65, fireRatePct: 85 },
  shotgun: { name: 'Shotgun (Remington 870)',damage: 15, fireRate: 20,  accuracy: 40, magSize: 6,   range: 250,  reloadTime: 3000, speedMultiplier: 1.0,  type: 'Pump-Action', damagePct: 80, fireRatePct: 20, pellets: 8 },
  sniper:  { name: 'Sniper Rifle (AWM)',     damage: 95, fireRate: 10,  accuracy: 98, magSize: 5,   range: 1000, reloadTime: 2800, speedMultiplier: 1.0,  type: 'Bolt-Action', damagePct: 100, fireRatePct: 10 },
  smg:     { name: 'SMG (MP5)',              damage: 18, fireRate: 85,  accuracy: 82, magSize: 30,  range: 350,  reloadTime: 1500, speedMultiplier: 1.0,  type: 'Automatic',   damagePct: 30, fireRatePct: 95 },
  lmg:     { name: 'LMG (M249)',             damage: 25, fireRate: 80,  accuracy: 75, magSize: 100, range: 550,  reloadTime: 4500, speedMultiplier: 1.0,  type: 'Automatic',   damagePct: 55, fireRatePct: 90 },
  dmr:     { name: 'DMR (M14 EBR)',          damage: 45, fireRate: 30,  accuracy: 94, magSize: 20,  range: 800,  reloadTime: 2400, speedMultiplier: 1.0,  type: 'Semi-Auto',   damagePct: 75, fireRatePct: 35 },
  vector:  { name: 'Vector SMG',             damage: 14, fireRate: 95,  accuracy: 85, magSize: 33,  range: 320,  reloadTime: 1100, speedMultiplier: 1.0,  type: 'Automatic',   damagePct: 25, fireRatePct: 98 },
  famas:   { name: 'FAMAS Burst Carbine',    damage: 20, fireRate: 55,  accuracy: 91, magSize: 25,  range: 550,  reloadTime: 1800, speedMultiplier: 1.0,  type: 'Burst-Fire',  damagePct: 45, fireRatePct: 60 },
  plasma:  { name: 'Plasma Rifle PL-45',     damage: 32, fireRate: 65,  accuracy: 90, magSize: 20,  range: 600,  reloadTime: 2000, speedMultiplier: 1.0,  type: 'Automatic',   damagePct: 60, fireRatePct: 70 },
  railgun: { name: 'Railgun RG-X',           damage: 85, fireRate: 8,   accuracy: 99, magSize: 5,   range: 1200, reloadTime: 3500, speedMultiplier: 0.95, type: 'Single-Shot', damagePct: 95, fireRatePct: 8  }
};

// Weapon locks requirements
const WEAPON_LOCKS = {
  dmr:     { rp: 1000, rank: 'VETERAN', price: 2200 },
  sniper:  { rp: 1000, rank: 'VETERAN', price: 2500 },
  lmg:     { rp: 4000, rank: 'ELITE',   price: 4500 },
  vector:  { rp: 1000, rank: 'VETERAN', price: 2100 },
  famas:   { rp: 1000, rank: 'VETERAN', price: 2300 },
  plasma:  { rp: 4000, rank: 'ELITE',   price: 4000 },
  railgun: { rp: 4000, rank: 'ELITE',   price: 5000 }
};

const WEAPON_NAMES = {
  pistol:  'Pistol',
  rifle:   'Rifle',
  shotgun: 'Shotgun',
  sniper:  'Sniper',
  smg:     'SMG',
  lmg:     'LMG',
  dmr:     'DMR',
  vector:  'Vector',
  famas:   'FAMAS',
  plasma:  'Plasma',
  railgun: 'Railgun'
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
    const unlocked = isWeaponUnlocked(weaponKey);
    if (req && !unlocked) {
      btn.classList.add('locked');
      btn.innerHTML = `🔒 ${WEAPON_NAMES[weaponKey]} <span style="font-size:7px; display:block; color:#ff3c3c; margin-top:2.5px; font-family:var(--font-title); font-weight:bold;">${req.rank}</span>`;
    } else {
      btn.classList.remove('locked');
      let label = WEAPON_NAMES[weaponKey] || weaponKey;
      try {
        const purchased = JSON.parse(safeStorage.getItem('tacticstrike_purchased_weapons') || '[]');
        if (purchased.includes(weaponKey) && rp < req.rp) {
          label = `🛍️ ${label}`;
        }
      } catch(e) {}
      btn.innerHTML = label;
    }
  });

  // 2. Lobby Weapon Options
  const options = document.querySelectorAll('.weapon-option');
  options.forEach(opt => {
    const weaponKey = opt.dataset.weapon;
    const req = WEAPON_LOCKS[weaponKey];
    const unlocked = isWeaponUnlocked(weaponKey);
    let lockBadge = opt.querySelector('.lock-badge');
    
    if (req && !unlocked) {
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
  if (activeReq && !isWeaponUnlocked(myWeapon)) {
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
let currentMatchSource = 'menu'; // 'ranked', 'casual', 'practice'
let qpRenderStyle = safeStorage.getItem('tacticstrike_qp_style') || 'realistic';
let selectedMapId = safeStorage.getItem('tacticstrike_selected_map') || 'manor';

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

// Weapon Select Music / Lobby Music (loops in lobby and gameplay)
const weaponSelectMusic = new Audio('/Deployment_Sequence.mp3');
weaponSelectMusic.loop = true;
weaponSelectMusic.volume = 0.15;

function playLobbyMusic() {
  if (isMusicMuted) return;
  try {
    menuMusic.pause();
    menuMusic.currentTime = 0;
    waitMusic.pause();
    waitMusic.currentTime = 0;
    
    weaponSelectMusic.volume = 0.15;
    weaponSelectMusic.loop = true;
    weaponSelectMusic.play().catch(() => {});
  } catch(e) {}
}

function playMenuClick() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
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
    weaponSelectMusic.pause();
    weaponSelectMusic.currentTime = 0;
  } catch(e) {}
};

function playWaitMusic() {
  if (isMusicMuted) return;
  try {
    menuMusic.pause();
    menuMusic.currentTime = 0;
    weaponSelectMusic.pause();
    weaponSelectMusic.currentTime = 0;
    waitMusic.currentTime = 0;
    waitMusic.play().catch(() => {});
  } catch(e) {}
}

function playMenuMusic() {
  if (isMusicMuted) return;
  try {
    waitMusic.pause();
    waitMusic.currentTime = 0;
    weaponSelectMusic.pause();
    weaponSelectMusic.currentTime = 0;
    menuMusic.currentTime = 0;
    menuMusic.play().catch(() => {});
  } catch(e) {}
}

function playGameplayBackgroundMusic() {
  try {
    if (isMusicMuted) return;

    if (currentMatchSource === 'casual') {
      menuMusic.pause();
      menuMusic.currentTime = 0;
      waitMusic.pause();
      waitMusic.currentTime = 0;
      
      weaponSelectMusic.volume = 0.04;
      weaponSelectMusic.loop = true;
      weaponSelectMusic.play().catch(() => {});
    } else {
      weaponSelectMusic.pause();
      weaponSelectMusic.currentTime = 0;
      waitMusic.pause();
      waitMusic.currentTime = 0;
      
      menuMusic.volume = 0.04;
      menuMusic.play().catch(() => {});
    }
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
  sfxMuted: false,
  performanceMode: false,
  showFps: false
};

// 1. Initialize Settings
function initSettings() {
  // Load from LocalStorage if available
  const savedSettings = safeStorage.getItem('tacticstrike_settings');
  const showFpsCb = document.getElementById('setting-show-fps');

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
      if (showFpsCb) showFpsCb.checked = !!gameSettings.showFps;
      
      const counter = document.getElementById('fps-counter');
      if (counter) {
        counter.style.display = gameSettings.showFps ? 'block' : 'none';
      }
      
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
  if (showFpsCb) {
    showFpsCb.addEventListener('change', (e) => {
      gameSettings.showFps = e.target.checked;
      const counter = document.getElementById('fps-counter');
      if (counter) {
        counter.style.display = gameSettings.showFps ? 'block' : 'none';
      }
      saveSettings();
    });
  }

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
  const deployModal = document.getElementById('deploy-modal');
  if (deployModal) deployModal.classList.remove('active');

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
  } else if (screenKey === 'lobby') {
    playLobbyMusic();
  } else if (screenKey === 'matchmaking') {
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
      playMenuClick();   // ← play click sound on weapon pick

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

  const dmgPct   = stats.damagePct   ?? Math.min(100, Math.round(stats.damage / 95 * 100));
  const firePct  = stats.fireRatePct ?? Math.min(100, Math.round(stats.fireRate));
  const accPct   = stats.accuracy    ?? 75;

  const isEnergy = weaponKey === 'plasma' || weaponKey === 'railgun';
  const barColor = isEnergy ? '#ff6ef7' : '';
  const barStyle = barColor ? `background: ${barColor};` : '';

  displays.weaponStats.innerHTML = `
    <div class="stat-row">
      <span>DAMAGE:</span>
      <div class="stat-bar"><div class="bar-fill" style="width: ${dmgPct}%; ${barStyle}"></div></div>
    </div>
    <div class="stat-row">
      <span>FIRE RATE:</span>
      <div class="stat-bar"><div class="bar-fill" style="width: ${firePct}%; ${barStyle}"></div></div>
    </div>
    <div class="stat-row">
      <span>ACCURACY:</span>
      <div class="stat-bar"><div class="bar-fill" style="width: ${accPct}%; ${barStyle}"></div></div>
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

  // Update map select dropdown visibility and accessibility
  const lobbyMapContainer = document.getElementById('lobby-map-selector-container');
  const lobbyMapSelect = document.getElementById('lobby-map-select');
  if (lobbyMapContainer && lobbyMapSelect) {
    if (currentMatchSource === 'ranked') {
      lobbyMapContainer.style.display = 'none';
    } else {
      lobbyMapContainer.style.display = 'block';
      const isHost = players[0] && players[0].id === socket.id;
      lobbyMapSelect.disabled = !isHost;
    }
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
  window.AppSocket = socket;

  socket.on('connect_error', () => {
    // Fail silently or fallback for auto-login without annoying alerts
    console.warn('Failed to connect to multiplayer server.');
    updatePlayerCountsUI({ total: 1, quickplay: 0, ranked_realistic: 0, ranked_competitive: 0 });
  });

  socket.on('disconnect', () => {
    updatePlayerCountsUI({ total: 1, quickplay: 0, ranked_realistic: 0, ranked_competitive: 0 });
  });

  socket.on('player-counts', (data) => {
    updatePlayerCountsUI(data);
  });

  socket.on('connect', () => {
    console.log('Socket connected.');
    
    // Double redundant device sync
    const uuid = getOrCreateUUID();
    const rp = parseInt(safeStorage.getItem('tacticstrike_rp') || '0');
    const career = loadCareerStats();
    const credits = parseInt(safeStorage.getItem('tacticstrike_credits') || '0');
    let purchased = [];
    try { purchased = JSON.parse(safeStorage.getItem('tacticstrike_purchased_weapons') || '[]'); } catch(e) {}
    socket.emit('sync-device', {
      uuid: uuid,
      rp: rp,
      wins: career.wins,
      losses: career.losses,
      name: myName,
      credits: credits,
      purchasedWeapons: purchased
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

    const localCredits = parseInt(safeStorage.getItem('tacticstrike_credits') || '0');
    const mergedCredits = Math.max(localCredits, data.credits || 0);
    safeStorage.setItem('tacticstrike_credits', String(mergedCredits));

    let localPurchased = [];
    try { localPurchased = JSON.parse(safeStorage.getItem('tacticstrike_purchased_weapons') || '[]'); } catch(e) {}
    const mergedPurchased = Array.from(new Set([...localPurchased, ...(data.purchasedWeapons || [])]));
    safeStorage.setItem('tacticstrike_purchased_weapons', JSON.stringify(mergedPurchased));
    
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
  socket.on('room-created', ({ roomId, players, autoMatch, mode, mapId }) => {
    currentRoom = roomId;
    if (mode) myMode = mode;
    displays.roomCode.innerText = roomId;
    
    // Sync map choice
    const lobbyMapSelect = document.getElementById('lobby-map-select');
    if (lobbyMapSelect && mapId) {
      lobbyMapSelect.value = mapId;
    }

    if (autoMatch) {
      updateLobbyUI(players);
      addSystemChatMessage('Created matchmaking room. Waiting for opponent...');
    } else {
      showScreen('lobby');
      updateLobbyUI(players);
      addSystemChatMessage(`Lobby created. Share code [${roomId}] with a friend.`);
    }
  });

  socket.on('room-joined', ({ roomId, players, mode, mapId }) => {
    currentRoom = roomId;
    if (mode) myMode = mode;
    displays.roomCode.innerText = roomId;
    showScreen('lobby');
    updateLobbyUI(players);
    
    // Sync map choice
    const lobbyMapSelect = document.getElementById('lobby-map-select');
    if (lobbyMapSelect && mapId) {
      lobbyMapSelect.value = mapId;
    }

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

  socket.on('lobby-map-update', ({ mapId }) => {
    const lobbyMapSelect = document.getElementById('lobby-map-select');
    if (lobbyMapSelect) {
      lobbyMapSelect.value = mapId;
    }
    const mapName = mapId === 'cyberlab' ? 'Neon Cyber-Lab' : 'Residential Manor';
    addSystemChatMessage(`Host updated mission area to: ${mapName}`);
  });

  socket.on('player-left', ({ players, message }) => {
    updateLobbyUI(players);
    addSystemChatMessage(message);
    
    const activeScreen = document.querySelector('.screen.active');
    const isInGame = activeScreen && activeScreen.id === 'game-screen';
    
    if (gameEngine && isInGame) {
      if (gameEngine.active && gameEngine.mode === 'online' && (gameEngine.gameState === 'playing' || gameEngine.gameState === 'countdown' || gameEngine.gameState === 'replay')) {
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

  socket.on('match-start', ({ players, seed, isRanked, mode, mapId }) => {
    currentMatchSource = isRanked ? 'ranked' : 'casual';
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
        mapId: mapId || 'manor',
        settings: { ...gameSettings, volume: gameSettings.sfxMuted ? 0 : gameSettings.volume },
        matchMode: mode || myMode,
        isRanked: !!isRanked, // Pass isRanked
        qpRenderStyle: qpRenderStyle,
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
    window.AppSocket = null;
  }
}

// 6. Gameplay triggers
function startOfflineMode() {
  currentMatchSource = 'practice';
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
      mapId: selectedMapId,
      settings: { ...gameSettings, volume: gameSettings.sfxMuted ? 0 : gameSettings.volume },
      matchMode: myMode,
      isRanked: false, // bots never ranked
      qpRenderStyle: qpRenderStyle,
      onMatchEnd: handleMatchEnd,
      onKillFeed: addKillFeedMessage
    });
  };

  playRankedStartVideo(initGame);
}

function getRandomWeapon() {
  return ['pistol', 'rifle', 'shotgun', 'sniper', 'smg', 'lmg', 'dmr', 'vector', 'famas'][Math.floor(Math.random() * 9)];
}

// Match Over Debriefing Display
  function handleMatchEnd(results) {
    localStorage.removeItem('tacticstrike_active_match');
    if (gameOverModal) gameOverModal.classList.add('active');
    const isWin = !!results.isWin;

    let creditsBonusText = '';
    // Record W/L in localStorage only for human online matches!
    if (gameEngine && gameEngine.mode === 'online') {
      recordMatchResult(isWin);
      
      if (gameEngine.isRanked && isWin) {
        const currentCredits = parseInt(safeStorage.getItem('tacticstrike_credits') || '0');
        const nextCredits = currentCredits + 50;
        safeStorage.setItem('tacticstrike_credits', String(nextCredits));
        creditsBonusText = ` <span style="color:#ffd700; font-size:10px;">(+50 Credits Ranked Win Bonus!)</span>`;
        
        // Trigger background sync to server
        if (socket) {
          const uuid = getOrCreateUUID();
          const rp = parseInt(safeStorage.getItem('tacticstrike_rp') || '0');
          const career = loadCareerStats();
          let purchased = [];
          try { purchased = JSON.parse(safeStorage.getItem('tacticstrike_purchased_weapons') || '[]'); } catch(e) {}
          socket.emit('sync-device', {
            uuid,
            rp,
            wins: career.wins,
            losses: career.losses,
            name: myName,
            credits: nextCredits,
            purchasedWeapons: purchased
          });
        }
      }
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
      if (creditsBonusText) {
        const bonusDiv = document.createElement('div');
        bonusDiv.style.cssText = 'font-family:var(--font-title); font-size:10px; text-align:center; margin-top:8px;';
        bonusDiv.innerHTML = creditsBonusText;
        rankPanel.appendChild(bonusDiv);
      }
    }
    // ─────────────────────────────────────────────────────────────────────────
  }

// UI Event Handlers
function setupUIListeners() {
  const btnDeployMain = document.getElementById('btn-deploy-main');
  const btnCloseDeploy = document.getElementById('btn-close-deploy');
  const deployModal = document.getElementById('deploy-modal');
  
  if (btnDeployMain && deployModal) {
    btnDeployMain.addEventListener('click', () => {
      deployModal.classList.add('active');
      playMenuClick();
    });
  }
  
  if (btnCloseDeploy && deployModal) {
    btnCloseDeploy.addEventListener('click', () => {
      deployModal.classList.remove('active');
      playMenuClick();
    });
  }

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
        socket.emit('create-room', { playerName: myName, mode: myMode, color: myColor, mapId: selectedMapId });
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

  // Ranked matchmaking with 15-second rank expansion
  function startRankedMatchmaking(searchStyle) {
    if (inputs.name) myName = inputs.name.value.trim() || 'Operative';
    safeStorage.setItem('tacticstrike_player_name', myName);
    connectSocket();
    if (socket) {
      // Get current RP from localStorage
      const myRP = parseInt(localStorage.getItem('tacticstrike_rp') || '0');
      rankSearchExpanded = false;

      const searchMode = myMode + '_' + searchStyle;

      // Emit first with strict rank bracket
      socket.emit('auto-match', { playerName: myName, mode: searchMode, color: myColor, rp: myRP, rankStrict: true });
      
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

      // After 2s, expand search to any rank
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
            socket.emit('auto-match', { playerName: myName, mode: searchMode, color: myColor, rp: myRP, rankStrict: false });
          }
        }
      }, 2000);
    }
  }

  if (btns.rankedRealistic) {
    btns.rankedRealistic.addEventListener('click', () => startRankedMatchmaking('realistic'));
  }
  if (btns.rankedCompetitive) {
    btns.rankedCompetitive.addEventListener('click', () => startRankedMatchmaking('competitive'));
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
        // Keep playing lobby music since we are in the lobby waiting
        playLobbyMusic();
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

  // Map select change listeners
  if (inputs.qpMapSelect) {
    inputs.qpMapSelect.value = selectedMapId;
    inputs.qpMapSelect.addEventListener('change', (e) => {
      selectedMapId = e.target.value;
      safeStorage.setItem('tacticstrike_selected_map', selectedMapId);
      playMenuClick();
    });
  }

  if (inputs.lobbyMapSelect) {
    inputs.lobbyMapSelect.addEventListener('change', (e) => {
      const newMapId = e.target.value;
      if (socket && currentRoom) {
        socket.emit('select-map', { mapId: newMapId });
      }
      playMenuClick();
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

function setupQpStyleSelector() {
  const btnQpRealistic = document.getElementById('btn-qp-style-realistic');
  const btnQpCompetitive = document.getElementById('btn-qp-style-competitive');
  
  if (!btnQpRealistic || !btnQpCompetitive) return;

  function updateQpStyleUI() {
    if (qpRenderStyle === 'competitive') {
      btnQpCompetitive.classList.add('active');
      btnQpRealistic.classList.remove('active');
    } else {
      btnQpRealistic.classList.add('active');
      btnQpCompetitive.classList.remove('active');
    }
  }

  btnQpRealistic.addEventListener('click', () => {
    qpRenderStyle = 'realistic';
    safeStorage.setItem('tacticstrike_qp_style', 'realistic');
    updateQpStyleUI();
    playMenuClick();
  });

  btnQpCompetitive.addEventListener('click', () => {
    qpRenderStyle = 'competitive';
    safeStorage.setItem('tacticstrike_qp_style', 'competitive');
    updateQpStyleUI();
    playMenuClick();
  });

  // Init
  updateQpStyleUI();
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
      playMenuClick();
      
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

function showNotification(message, duration = 8000) {
  const container = document.getElementById('notification-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.style.cssText = `
    background: rgba(10, 15, 25, 0.95);
    border: 1px solid #66fcf1;
    box-shadow: 0 0 15px rgba(102, 252, 241, 0.25);
    border-radius: 6px;
    padding: 14px 20px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    letter-spacing: 0.5px;
    line-height: 1.5;
    min-width: 280px;
    max-width: 360px;
    pointer-events: auto;
    cursor: pointer;
    opacity: 0;
    transform: translateX(50px);
    transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
  `;
  
  // Left color border bar
  const borderBar = document.createElement('div');
  borderBar.style.cssText = `
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #66fcf1;
  `;
  toast.appendChild(borderBar);

  const textNode = document.createElement('div');
  textNode.style.paddingLeft = '6px';
  textNode.innerText = message;
  toast.appendChild(textNode);

  // Click to close
  toast.addEventListener('click', () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 350);
  });

  container.appendChild(toast);

  // Trigger animation next frame
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  // Auto remove
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 350);
    }
  }, duration);
}

// App Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  // Mobile check
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone|webOS/i.test(navigator.userAgent) || window.innerWidth < 800;
  if (isMobile) {
    const warning = document.getElementById('mobile-warning-screen');
    if (warning) {
      warning.style.display = 'flex';
    }
    return; // Block initialization
  }

  // Show standard update and performance notification
  setTimeout(() => {
    showNotification("The game is actively being updated and fixed, sorry for any issues you run into!", 12000);
  }, 1000);

  setTimeout(() => {
    showNotification("Low FPS? Try enabling the new 'Performance Mode' in Settings to boost your frame rate!", 14000);
  }, 3500);

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
  initNewsModal();
  initItemShop();
  setupWeaponSelector();
  setupMainMenuWeaponSelector();
  setupColorSelector();
  setupModeSelector();
  setupQpStyleSelector();
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

function isWeaponUnlocked(weaponKey) {
  const req = WEAPON_LOCKS[weaponKey];
  if (!req) return true;
  
  try {
    const purchased = JSON.parse(safeStorage.getItem('tacticstrike_purchased_weapons') || '[]');
    if (purchased.includes(weaponKey)) return true;
  } catch(e) {}
  
  const rp = parseInt(safeStorage.getItem('tacticstrike_rp') || '0');
  return rp >= req.rp;
}

function initNewsModal() {
  const newsModal = document.getElementById('news-modal');
  const closeNewsBtn = document.getElementById('btn-close-news');
  
  if (!newsModal || !closeNewsBtn) return;
  
  const hasSeenNews = sessionStorage.getItem('tacticstrike_news_seen');
  if (!hasSeenNews) {
    newsModal.classList.add('active');
  }
  
  closeNewsBtn.addEventListener('click', () => {
    newsModal.classList.remove('active');
    sessionStorage.setItem('tacticstrike_news_seen', 'true');
    playMenuClick();
  });
}

function initItemShop() {
  const shopModal = document.getElementById('shop-modal');
  const openShopBtn = document.getElementById('btn-open-shop');
  const closeShopBtn = document.getElementById('btn-close-shop');
  
  if (!shopModal || !openShopBtn || !closeShopBtn) return;
  
  if (safeStorage.getItem('tacticstrike_credits') === null) {
    safeStorage.setItem('tacticstrike_credits', '0'); // start with 0 credits
  }

  openShopBtn.addEventListener('click', () => {
    renderShopItems();
    shopModal.classList.add('active');
    playMenuClick();
  });
  
  closeShopBtn.addEventListener('click', () => {
    shopModal.classList.remove('active');
    playMenuClick();
  });
}

function renderShopItems() {
  const container = document.getElementById('shop-items-container');
  const creditsDisplay = document.getElementById('shop-credits-display');
  
  if (!container || !creditsDisplay) return;
  
  const currentCredits = parseInt(safeStorage.getItem('tacticstrike_credits') || '0');
  creditsDisplay.innerText = currentCredits;
  
  let purchased = [];
  try {
    purchased = JSON.parse(safeStorage.getItem('tacticstrike_purchased_weapons') || '[]');
  } catch(e) {}
  
  const rp = parseInt(safeStorage.getItem('tacticstrike_rp') || '0');
  
  container.innerHTML = '';
  
  Object.keys(WEAPON_LOCKS).forEach(key => {
    const req = WEAPON_LOCKS[key];
    const isPurchased = purchased.includes(key);
    const isRankUnlocked = rp >= req.rp;
    const canAfford = currentCredits >= req.price;
    
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cssText = `
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      border: 1px solid rgba(255,255,255,0.06);
      background: rgba(0, 0, 0, 0.4);
      border-radius: 6px;
      position: relative;
    `;
    
    let statusText = '';
    let btnHtml = '';
    
    if (isPurchased) {
      statusText = `<span style="color:#39db14; font-size:10px; font-weight:bold; letter-spacing:0.5px;">🛍️ UNLOCKED VIA SHOP</span>`;
      btnHtml = `<button class="btn secondary" disabled style="font-size: 10px; padding: 8px; width: 100%;">OWNED</button>`;
    } else if (isRankUnlocked) {
      statusText = `<span style="color:#66fcf1; font-size:10px; font-weight:bold; letter-spacing:0.5px;">✓ UNLOCKED BY RANK</span>`;
      btnHtml = `<button class="btn secondary" disabled style="font-size: 10px; padding: 8px; width: 100%;">OWNED</button>`;
    } else {
      statusText = `<span style="color:#ff3c3c; font-size:10px; font-weight:bold; letter-spacing:0.5px;">🔒 LOCKED (${req.rank})</span>`;
      if (canAfford) {
        btnHtml = `<button class="btn primary buy-btn btn-3d" data-weapon="${key}" style="background: linear-gradient(135deg, #aa7c11, #5c4008); border: 1px solid #73510c; color: #ffe6a3; font-size: 10px; padding: 8px; width: 100%;">BUY EARLY</button>`;
      } else {
        btnHtml = `<button class="btn secondary" disabled style="font-size: 10px; padding: 8px; width: 100%; color: #ff3c3c;">INSUFFICIENT CREDITS</button>`;
      }
    }
    
    const weaponStats = WEAPON_STATS[key] || { name: key };
    
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-family: var(--font-title); font-size: 13px; color: #fff; font-weight: bold; letter-spacing: 1px;">${weaponStats.name}</span>
        <span style="font-family: var(--font-title); font-size: 12px; color: #ffd700; font-weight: bold;">🪙 ${req.price}</span>
      </div>
      <div style="font-size: 10px; color: var(--text-muted); line-height: 1.4;">
        Early early access for this high-tier gun. Skip the Rank requirement and deploy instantly.
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
        ${statusText}
      </div>
      <div style="margin-top:auto;">
        ${btnHtml}
      </div>
    `;
    
    container.appendChild(card);
  });
  
  container.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const weaponKey = btn.dataset.weapon;
      buyWeapon(weaponKey);
    });
  });
}

function buyWeapon(weaponKey) {
  const req = WEAPON_LOCKS[weaponKey];
  if (!req) return;
  
  const currentCredits = parseInt(safeStorage.getItem('tacticstrike_credits') || '0');
  if (currentCredits < req.price) {
    playErrorBeep();
    alert('Insufficient credits.');
    return;
  }
  
  const nextCredits = currentCredits - req.price;
  safeStorage.setItem('tacticstrike_credits', String(nextCredits));
  
  let purchased = [];
  try {
    purchased = JSON.parse(safeStorage.getItem('tacticstrike_purchased_weapons') || '[]');
  } catch(e) {}
  
  if (!purchased.includes(weaponKey)) {
    purchased.push(weaponKey);
    safeStorage.setItem('tacticstrike_purchased_weapons', JSON.stringify(purchased));
  }
  
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.38);
    }
  } catch(e) {}
  
  showNotification(`Successfully unlocked ${WEAPON_NAMES[weaponKey]} early!`, 6000);
  
  if (socket) {
    const uuid = getOrCreateUUID();
    const rp = parseInt(safeStorage.getItem('tacticstrike_rp') || '0');
    const career = loadCareerStats();
    socket.emit('sync-device', {
      uuid,
      rp,
      wins: career.wins,
      losses: career.losses,
      name: myName,
      credits: nextCredits,
      purchasedWeapons: purchased
    });
  }
  
  renderShopItems();
  updateWeaponLocksUI();
}

function updatePlayerCountsUI(data) {
  const totalVal = document.getElementById('total-player-count-value');
  const qpVal = document.getElementById('qp-player-count');
  const realVal = document.getElementById('ranked-real-player-count');
  const compVal = document.getElementById('ranked-comp-player-count');

  if (totalVal && data && data.total !== undefined) totalVal.innerText = data.total;
  if (qpVal && data && data.quickplay !== undefined) qpVal.innerText = data.quickplay;
  if (realVal && data && data.ranked_realistic !== undefined) realVal.innerText = data.ranked_realistic;
  if (compVal && data && data.ranked_competitive !== undefined) compVal.innerText = data.ranked_competitive;
}

// Expose remote chat event
window.addEventListener('opponent-chat-msg', (e) => {
  const { name, msg } = e.detail;
  appendChatMessage(name, msg, 'opponent');
});

