import { io } from 'socket.io-client';
import { Engine } from './game/Engine.js';
import { waitForMenuAnimation } from './public/menu-entry.js';
import { ACCOUNT_SESSION_KEY, ACCOUNT_USER_CACHE_KEY, readAccountSession, removeAccountSession, getBackendUrl, accountRequest } from './account-session.js';

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
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage.removeItem failed:', e);
    }
  }
};

const ADMIN_SESSION_KEY = 'tacticstrike_admin_session';

let accountSession = readAccountSession();
let accountAuthPending = Boolean(accountSession.token);
let adminSessionToken = safeStorage.getItem(ADMIN_SESSION_KEY);
let selectedAdminCaseId = null;

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function dismissStartupOverlay({ immediate = false } = {}) {
  const overlay = document.getElementById('startup-overlay');
  document.body.classList.remove('is-starting');
  if (!overlay) return;
  overlay.setAttribute('aria-hidden', 'true');
  if (immediate) {
    overlay.remove();
    return;
  }
  overlay.classList.add('fade-out');
  setTimeout(() => overlay.remove(), 450);
}

// Never leave the interface covered if an unrelated startup task fails.
setTimeout(() => {
  if (document.body.classList.contains('is-starting')) dismissStartupOverlay();
}, 6500);

async function finishStartupSequence(accountRestore) {
  const authWait = accountSession.token && !accountSession.user
    ? Promise.race([Promise.resolve(accountRestore), wait(3600)])
    : Promise.resolve();

  await Promise.all([waitForMenuAnimation(document.getElementById('startup-overlay')), authWait]);
  const status = document.getElementById('startup-status');
  if (status) status.textContent = 'Ready when you are.';
  await wait(140);
  dismissStartupOverlay();
}

function accountApi(path, options = {}) {
  return accountRequest(path, { ...options, token: accountSession.token });
}

async function adminApi(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (adminSessionToken) headers.Authorization = `Bearer ${adminSessionToken}`;
  const response = await fetch(`${getBackendUrl()}${path}`, { ...options, headers });
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(body?.message || 'The admin server could not complete this request.');
    error.code = body?.error;
    error.status = response.status;
    throw error;
  }
  return body;
}

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
  openMatchSettings: document.getElementById('btn-open-match-settings'),
  closeSettings: document.getElementById('btn-close-settings'),
  leaveLobby: document.getElementById('btn-leave-lobby'),
  readyToggle: document.getElementById('btn-ready-toggle'),
  copyCode: document.getElementById('btn-copy-code'),
  returnLobby: document.getElementById('btn-return-lobby'),
  btnAmongUs: document.getElementById('btn-among-us-mode')
};

const inputs = {
  name: document.getElementById('player-name-input'),
  roomCode: document.getElementById('room-code-input'),
  chat: document.getElementById('chat-input'),
  qpMapSelect: document.getElementById('qp-map-select'),
  lobbyMapSelect: document.getElementById('lobby-map-select'),
  lobbyModeSelect: document.getElementById('lobby-mode-select'),
  lobbyStyleSelect: document.getElementById('lobby-style-select')
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
  laser: document.getElementById('setting-laser')
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

const SHOP_WEAPON_META = {
  dmr:     { code: 'M14', role: 'PRECISION', tier: 'ADVANCED', description: 'A controlled semi-auto platform built for disciplined mid-to-long range fire.' },
  sniper:  { code: 'AWM', role: 'LONGSHOT',  tier: 'ADVANCED', description: 'A high-impact bolt-action system engineered to end an engagement in one shot.' },
  lmg:     { code: 'M249', role: 'SUPPORT',   tier: 'ELITE',    description: 'Sustained suppressive fire with a deep belt and uncompromising lane control.' },
  vector:  { code: 'VEC', role: 'BREACH',     tier: 'ADVANCED', description: 'Extreme close-range fire rate for operatives who fight inside the objective.' },
  famas:   { code: 'FAM', role: 'BURST',      tier: 'ADVANCED', description: 'A precise burst carbine tuned for fast target acquisition and controlled recoil.' },
  plasma:  { code: 'PL45', role: 'PROTOTYPE', tier: 'ELITE',    description: 'Experimental energy rifle with exceptional accuracy and balanced stopping power.' },
  railgun: { code: 'RG-X', role: 'EXOTIC',    tier: 'ELITE',    description: 'Blacksite electromagnetic technology delivering devastating single-shot force.' }
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
    let bought = false;
    try {
      const purchased = JSON.parse(safeStorage.getItem('tacticstrike_purchased_weapons') || '[]');
      bought = purchased.includes(weaponKey);
    } catch(e) {}
    btn.classList.toggle('owned', bought);
    if (req && !unlocked) {
      btn.classList.add('locked');
      btn.innerHTML = `🔒 ${WEAPON_NAMES[weaponKey]} <span style="font-size:7px; display:block; color:#ff3c3c; margin-top:2.5px; font-family:var(--font-title); font-weight:bold;">${req.rank}</span>`;
    } else {
      btn.classList.remove('locked');
      const label = WEAPON_NAMES[weaponKey] || weaponKey;
      btn.innerHTML = label;
    }
  });

  // 2. Lobby Weapon Options
  const options = document.querySelectorAll('.weapon-option');
  options.forEach(opt => {
    const weaponKey = opt.dataset.weapon;
    const req = WEAPON_LOCKS[weaponKey];
    const unlocked = isWeaponUnlocked(weaponKey);
    let bought = false;
    try {
      const purchased = JSON.parse(safeStorage.getItem('tacticstrike_purchased_weapons') || '[]');
      bought = purchased.includes(weaponKey);
    } catch(e) {}
    opt.classList.toggle('owned', bought);
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
function recordH2HResult(opponentName, isWin) {
  if (!opponentName) return;
  try {
    const h2hRaw = localStorage.getItem('tacticstrike_h2h') || '{}';
    const h2h = JSON.parse(h2hRaw);
    if (!h2h[opponentName]) {
      h2h[opponentName] = { wins: 0, losses: 0 };
    }
    if (isWin) {
      h2h[opponentName].wins++;
    } else {
      h2h[opponentName].losses++;
    }
    localStorage.setItem('tacticstrike_h2h', JSON.stringify(h2h));
  } catch (e) {
    console.warn('Failed to record H2H result:', e);
  }
}
function renderH2HHistory() {
  const container = document.getElementById('h2h-history-container');
  if (!container) return;
  let h2hData = {};
  try {
    h2hData = JSON.parse(localStorage.getItem('tacticstrike_h2h') || '{}');
  } catch (e) {
    h2hData = {};
  }
  const entries = Object.entries(h2hData);
  if (entries.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); font-size: 10px; text-align: center; padding: 10px 0; letter-spacing: 0.5px;">No head-to-head records found. Play a match to start tracking!</div>`;
    return;
  }
  entries.sort((a, b) => (b[1].wins + b[1].losses) - (a[1].wins + a[1].losses));
  let html = '';
  entries.forEach(([oppName, stats]) => {
    const total = stats.wins + stats.losses;
    const winPct = total > 0 ? Math.round((stats.wins / total) * 100) : 0;
    html += `
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 4px; font-family: var(--font-title);">
        <span style="color: #fff; font-size: 11px; font-weight: bold; letter-spacing: 0.5px;">${escapeHTML(oppName).toUpperCase()}</span>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 10px; color: var(--text-muted); letter-spacing: 0.5px;">RECORD: <strong style="color: #39db14;">${stats.wins}W</strong> - <strong style="color: #ff3c3c;">${stats.losses}L</strong></span>
          <span style="font-size: 9px; background: rgba(102, 252, 241, 0.1); border: 1px solid rgba(102, 252, 241, 0.3); color: #66fcf1; padding: 2px 5px; border-radius: 3px; font-weight: bold; letter-spacing: 0.5px;">${winPct}% WR</span>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}
// ───────────────────────────────────────────────────────────────────────────

// Audio Background Music
const menuMusic = new Audio('/Midnight_Deployment.mp3');
menuMusic.loop = true;
const waitMusic = new Audio('/Before_The_Starting_Bell.mp3');
waitMusic.loop = true;
const deployMusic = new Audio('/Into_Darkness.mp3');
deployMusic.loop = true;

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
    deployMusic.pause();
    deployMusic.currentTime = 0;
    
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

let creditShopAudioContext = null;

function playCreditShopSound(action = 'tap') {
  if (gameSettings.sfxMuted) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!creditShopAudioContext) {
      creditShopAudioContext = new AudioContextClass();
    }

    if (creditShopAudioContext.state === 'suspended') {
      creditShopAudioContext.resume().catch(() => {});
    }

    const tones = {
      open: { from: 390, to: 520, duration: 0.14 },
      close: { from: 510, to: 370, duration: 0.12 },
      confirm: { from: 560, to: 760, duration: 0.16 },
      tap: { from: 440, to: 500, duration: 0.1 }
    };
    const tone = tones[action] || tones.tap;
    const now = creditShopAudioContext.currentTime;
    const oscillator = creditShopAudioContext.createOscillator();
    const filter = creditShopAudioContext.createBiquadFilter();
    const gain = creditShopAudioContext.createGain();
    const peakVolume = 0.035 * Math.max(0, Math.min(1, gameSettings.volume));

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(tone.from, now);
    oscillator.frequency.exponentialRampToValueAtTime(tone.to, now + tone.duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(0.45, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peakVolume), now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.duration);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(creditShopAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + tone.duration + 0.02);
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
    deployMusic.pause();
    deployMusic.currentTime = 0;
    if (gameEngine && gameEngine.sound) {
      gameEngine.sound.stopBearMusic();
    }
  } catch(e) {}
};

function playWaitMusic() {
  if (isMusicMuted) return;
  try {
    menuMusic.pause();
    menuMusic.currentTime = 0;
    weaponSelectMusic.pause();
    weaponSelectMusic.currentTime = 0;
    deployMusic.pause();
    deployMusic.currentTime = 0;
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
    deployMusic.pause();
    deployMusic.currentTime = 0;
    menuMusic.currentTime = 0;
    menuMusic.play().catch(() => {});
  } catch(e) {}
}

function playGameplayBackgroundMusic() {
  try {
    if (isMusicMuted) return;

    deployMusic.pause();
    deployMusic.currentTime = 0;

    const isSabotageMode = (gameEngine && gameEngine.matchMode === 'sabotage') || (currentMatchSource === 'practice' && myMode === 'sabotage');
    if (isSabotageMode) {
      menuMusic.pause();
      menuMusic.currentTime = 0;
      waitMusic.pause();
      waitMusic.currentTime = 0;
      weaponSelectMusic.pause();
      weaponSelectMusic.currentTime = 0;
      if (gameEngine && gameEngine.gameState === 'playing' && gameEngine.sound) {
        gameEngine.sound.playBearMusic();
      }
      return;
    }

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

function getRankIndexForRP(rp) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (rp >= RANKS[i].minRP) return i;
  }
  return 0;
}

function updateMenuRankUI() {
  const rpVal = parseInt(localStorage.getItem('tacticstrike_rp') || '0');
  const rankIndex = getRankIndexForRP(rpVal);
  const rk = RANKS[rankIndex];
  const nextRank = RANKS[rankIndex + 1];
  
  const rIcon = document.getElementById('menu-rank-icon');
  const rLabel = document.getElementById('menu-rank-label');
  const rRp = document.getElementById('menu-rank-rp');
  const rBar = document.getElementById('menu-rank-progress');
  const rBarText = document.getElementById('menu-rank-progress-text');
  
  if (rIcon) {
    rIcon.innerText = rk.icon;
    rIcon.style.color = rk.color;
    rIcon.style.textShadow = `0 0 14px ${rk.color}80`;
  }
  if (rLabel) {
    rLabel.innerText = rk.label;
    rLabel.style.color = rk.color;
    rLabel.style.textShadow = `0 0 16px ${rk.color}66`;
  }
  if (rRp) {
    rRp.innerText = `${rpVal} RP`;
  }
  if (rBar && rBarText) {
    if (nextRank) {
      const span = nextRank.minRP - rk.minRP;
      const pct = Math.min(100, Math.max(0, ((rpVal - rk.minRP) / span) * 100));
      rBar.style.width = `${pct}%`;
      rBar.style.background = `linear-gradient(90deg, ${rk.color}, ${nextRank.color})`;
      rBar.style.boxShadow = `0 0 8px ${nextRank.color}66`;
      rBarText.innerText = `${rpVal} / ${nextRank.minRP} RP TO ${nextRank.label}`;
    } else {
      rBar.style.width = '100%';
      rBar.style.background = `linear-gradient(90deg, ${rk.color}, ${rk.color})`;
      rBar.style.boxShadow = `0 0 10px ${rk.color}80`;
      rBarText.innerText = 'MAX RANK ACHIEVED';
    }
  }
}

// Ranked Matchmaking state
let rankSearchExpanded = false;
let rankSearchTimer = null;
let botFallbackTimer = null;

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

  const deployModal = document.getElementById('deploy-modal');
  const isDeployActive = deployModal && deployModal.classList.contains('active');
  if (isDeployActive) {
    deployMusic.volume = 0.15;
    deployMusic.play().then(() => {
      musicStarted = true;
      cleanupMusicListeners();
    }).catch(() => {});
    return;
  }

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
    deployMusic.volume = 0;
  } else {
    const isGameplay = screens.game && screens.game.classList.contains('active');
    menuMusic.volume = isGameplay ? 0.04 : 0.15;
    waitMusic.volume = 0.15;
    deployMusic.volume = 0.15;
  }
}

function syncMusicToggleUI() {
  const musicToggleBtn = document.getElementById('setting-music-toggle');
  const musicAction = document.getElementById('settings-music-action');
  const musicStatus = document.getElementById('settings-music-status');

  if (!musicToggleBtn) return;

  musicToggleBtn.classList.toggle('is-muted', isMusicMuted);
  musicToggleBtn.setAttribute('aria-pressed', String(isMusicMuted));
  if (musicAction) musicAction.innerText = isMusicMuted ? 'UNMUTE MUSIC' : 'MUTE MUSIC';
  if (musicStatus) musicStatus.innerText = isMusicMuted ? 'MUSIC IS OFF' : 'MUSIC IS PLAYING';
}

function setMusicMuted(muted) {
  gameSettings.musicMuted = muted;
  isMusicMuted = muted;

  if (isMusicMuted) {
    window.stopAllMusic();
  } else {
    const activeScreen = document.querySelector('.screen.active');
    const deployModal = document.getElementById('deploy-modal');

    if (deployModal && deployModal.classList.contains('active')) {
      deployMusic.currentTime = 0;
      deployMusic.play().catch(() => {});
    } else if (activeScreen && (activeScreen.id === 'lobby-screen' || activeScreen.id === 'matchmaking-screen')) {
      playWaitMusic();
    } else if (activeScreen && activeScreen.id === 'game-screen') {
      playGameplayBackgroundMusic();
    } else {
      playMenuMusic();
    }
  }

  updateMusicVolume();
  syncMusicToggleUI();
  saveSettings();
}

// Global Game Settings
const gameSettings = {
  volume: 0.5,
  blood: true,
  shadows: true,
  laser: true,
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
      delete parsed.serverUrl;
      Object.assign(gameSettings, parsed);
      
      if (settings.volume) settings.volume.value = gameSettings.volume * 100;
      if (settings.volumeVal) settings.volumeVal.innerText = `${Math.round(gameSettings.volume * 100)}%`;
      if (settings.blood) settings.blood.checked = gameSettings.blood;
      if (settings.shadows) settings.shadows.checked = gameSettings.shadows;
      if (settings.laser) settings.laser.checked = gameSettings.laser;
      if (showFpsCb) showFpsCb.checked = !!gameSettings.showFps;
      
      const counter = document.getElementById('fps-counter');
      if (counter) {
        counter.style.display = gameSettings.showFps ? 'block' : 'none';
      }
      
      isMusicMuted = !!gameSettings.musicMuted;

      const muteSfxCb = document.getElementById('setting-mute-sfx');
      if (muteSfxCb) muteSfxCb.checked = !!gameSettings.sfxMuted;
    } catch (e) {
      console.error(e);
    }
  }

  syncMusicToggleUI();

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

  const musicToggleBtn = document.getElementById('setting-music-toggle');
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (!gameSettings.sfxMuted) playMenuClick();
      setMusicMuted(!isMusicMuted);
    });
  }

  const muteSfxCb = document.getElementById('setting-mute-sfx');
  if (muteSfxCb) {
    muteSfxCb.addEventListener('change', (e) => {
      gameSettings.sfxMuted = e.target.checked;
      saveSettings();
    });
  }

  if (btns.openMatchSettings) {
    btns.openMatchSettings.addEventListener('click', () => {
      if (!gameSettings.sfxMuted) playMenuClick();
      renderH2HHistory();
      syncMusicToggleUI();
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
    checkSaraMode(false);
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

  if (screenKey === 'menu') {
    if (displays && displays.chatMessages) {
      displays.chatMessages.innerHTML = '';
    }
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

  // Update mode select dropdown visibility and accessibility
  const lobbyModeContainer = document.getElementById('lobby-mode-selector-container');
  const lobbyModeSelect = document.getElementById('lobby-mode-select');
  if (lobbyModeContainer && lobbyModeSelect) {
    if (currentMatchSource === 'ranked') {
      lobbyModeContainer.style.display = 'none';
    } else {
      lobbyModeContainer.style.display = 'block';
      const isHost = players[0] && players[0].id === socket.id;
      lobbyModeSelect.disabled = !isHost;
    }
  }

  // Update style select dropdown visibility and accessibility
  const lobbyStyleContainer = document.getElementById('lobby-style-selector-container');
  const lobbyStyleSelect = document.getElementById('lobby-style-select');
  if (lobbyStyleContainer && lobbyStyleSelect) {
    if (currentMatchSource === 'ranked') {
      lobbyStyleContainer.style.display = 'none';
    } else {
      lobbyStyleContainer.style.display = 'block';
      const isHost = players[0] && players[0].id === socket.id;
      lobbyStyleSelect.disabled = !isHost;
    }
  }
}

// 5. Connect to Socket.io Server
function connectSocket() {
  if (socket) return;

  const serverUrl = getBackendUrl();

  socket = io(serverUrl);
  window.AppSocket = socket;

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
  socket.on('room-created', ({ roomId, players, autoMatch, mode, mapId, renderStyle, isRanked }) => {
    currentRoom = roomId;
    if (mode) myMode = mode;
    currentMatchSource = isRanked ? 'ranked' : 'casual';
    displays.roomCode.innerText = roomId;
    
    // Sync map choice
    const lobbyMapSelect = document.getElementById('lobby-map-select');
    if (lobbyMapSelect && mapId) {
      lobbyMapSelect.value = mapId;
    }

    // Sync mode choice
    const lobbyModeSelect = document.getElementById('lobby-mode-select');
    if (lobbyModeSelect && mode) {
      lobbyModeSelect.value = mode;
    }

    // Sync style choice
    const lobbyStyleSelect = document.getElementById('lobby-style-select');
    if (lobbyStyleSelect && renderStyle) {
      lobbyStyleSelect.value = renderStyle;
      qpRenderStyle = renderStyle;
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

  socket.on('room-joined', ({ roomId, players, mode, mapId, renderStyle, isRanked }) => {
    currentRoom = roomId;
    if (mode) myMode = mode;
    currentMatchSource = isRanked ? 'ranked' : 'casual';
    displays.roomCode.innerText = roomId;
    showScreen('lobby');
    updateLobbyUI(players);
    
    // Sync map choice
    const lobbyMapSelect = document.getElementById('lobby-map-select');
    if (lobbyMapSelect && mapId) {
      lobbyMapSelect.value = mapId;
    }

    // Sync mode choice
    const lobbyModeSelect = document.getElementById('lobby-mode-select');
    if (lobbyModeSelect && mode) {
      lobbyModeSelect.value = mode;
    }

    // Sync style choice
    const lobbyStyleSelect = document.getElementById('lobby-style-select');
    if (lobbyStyleSelect && renderStyle) {
      lobbyStyleSelect.value = renderStyle;
      qpRenderStyle = renderStyle;
    }

    addSystemChatMessage(`Joined lobby: ${roomId}`);
    // Cancel rank expansion timer
    if (rankSearchTimer) { clearTimeout(rankSearchTimer); rankSearchTimer = null; }
    if (botFallbackTimer) { clearTimeout(botFallbackTimer); botFallbackTimer = null; }
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
      if (botFallbackTimer) { clearTimeout(botFallbackTimer); botFallbackTimer = null; }
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
    const mapName = mapId === 'cyberlab' ? 'Neon Cyber-Lab' : (mapId === 'arena' ? 'Neon Arena' : 'Residential Manor');
    addSystemChatMessage(`Host updated mission area to: ${mapName}`);
  });

  socket.on('lobby-mode-update', ({ mode }) => {
    const lobbyModeSelect = document.getElementById('lobby-mode-select');
    if (lobbyModeSelect) {
      lobbyModeSelect.value = mode;
    }
    myMode = mode;
    let modeName = 'Duel 1v1';
    if (mode === 'sabotage') modeName = 'Sabotage (Task Survival)';
    addSystemChatMessage(`Host updated game mode to: ${modeName}`);
  });

  socket.on('lobby-style-update', ({ renderStyle }) => {
    const lobbyStyleSelect = document.getElementById('lobby-style-select');
    if (lobbyStyleSelect) {
      lobbyStyleSelect.value = renderStyle;
    }
    qpRenderStyle = renderStyle;
    const styleName = renderStyle === 'competitive' ? 'Competitive' : 'Realistic';
    addSystemChatMessage(`Host updated render style to: ${styleName}`);
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
        localStorage.removeItem('tacticstrike_active_match');
        gameEngine.endGameDueToDisconnect(message);
      } else if (gameEngine.gameState === 'match-over') {
        // Match finished normally. Opponent simply left the debriefing or lobby.
        const rStatus = document.getElementById('rematch-status');
        if (rStatus) {
          rStatus.innerText = 'Opponent left the room.';
        }
        const rBtn = document.getElementById('btn-rematch');
        if (rBtn) {
          rBtn.disabled = true;
          rBtn.innerText = 'OPPONENT LEFT';
        }
      } else {
        localStorage.removeItem('tacticstrike_active_match');
        gameEngine.endGameDueToDisconnect(message);
      }
    }
  });

  socket.on('match-start', ({ players, seed, isRanked, mode, mapId, renderStyle }) => {
    currentMatchSource = isRanked ? 'ranked' : 'casual';
    if (renderStyle) {
      qpRenderStyle = renderStyle;
    }
    if (gameOverModal) {
      gameOverModal.classList.remove('active');
    }
    const initGame = () => {
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

      showScreen('game');
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
  if (displays && displays.roomCode) {
    displays.roomCode.innerText = '-----';
  }
}

// 6. Gameplay triggers
function startOfflineMode() {
  const deployModal = document.getElementById('deploy-modal');
  if (deployModal) deployModal.classList.remove('active');

  currentMatchSource = 'practice';
  const initGame = () => {
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

    showScreen('game');
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
      
      const opponent = gameEngine.players.find(p => p.id !== socket.id);
      if (opponent) {
        recordH2HResult(opponent.name, isWin);
      }
      
      const currentCredits = parseInt(safeStorage.getItem('tacticstrike_credits') || '0');
      let nextCredits = currentCredits;
      if (gameEngine.isRanked && isWin) {
        nextCredits = currentCredits + 50;
        safeStorage.setItem('tacticstrike_credits', String(nextCredits));
        creditsBonusText = ` <span style="color:#ffd700; font-size:10px;">(+50 Credits Ranked Win Bonus!)</span>`;
      }
      
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
    if (btns.returnLobby) {
      if (gameEngine && gameEngine.isRanked) {
        btns.returnLobby.innerText = 'RETURN TO MENU';
      } else {
        btns.returnLobby.innerText = 'RETURN TO LOBBY';
      }
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
      const deployCard = deployModal.querySelector('.deploy-card');
      if (deployCard) deployCard.scrollTop = 0;
      playMenuClick();
      menuMusic.pause();
      menuMusic.currentTime = 0;
      if (!isMusicMuted) {
        deployMusic.volume = 0.15;
        deployMusic.currentTime = 0;
        deployMusic.play().catch(() => {});
      }
    });
  }
  
  if (btnCloseDeploy && deployModal) {
    btnCloseDeploy.addEventListener('click', () => {
      deployModal.classList.remove('active');
      playMenuClick();
      deployMusic.pause();
      deployMusic.currentTime = 0;
      if (!isMusicMuted) {
        playMenuMusic();
      }
    });
  }

  // Set operative name change
  if (inputs.name) {
    inputs.name.addEventListener('change', () => {
      myName = inputs.name.value.trim() || 'Operative';
      safeStorage.setItem('tacticstrike_player_name', myName);
      checkSaraMode();
      if (socket && socket.connected) {
        socket.emit('change-name', { name: myName });
      }
    });
    inputs.name.addEventListener('input', () => {
      checkSaraMode();
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

  // Sabotage Among Us Mode
  if (btns.btnAmongUs) {
    btns.btnAmongUs.addEventListener('click', () => {
      if (inputs.name) myName = inputs.name.value.trim() || 'Operative';
      safeStorage.setItem('tacticstrike_player_name', myName);
      
      const deployModal = document.getElementById('deploy-modal');
      if (deployModal) deployModal.classList.remove('active');

      currentMatchSource = 'practice';
      const initGame = () => {
        displays.chatMessages.innerHTML = '';

        if (gameEngine) {
          gameEngine.destroy();
        }

        const playersList = [
          { id: 'player', name: myName, weapon: 'none', color: myColor },
          { id: 'bot_enemy_1', name: 'Impostor Killer', weapon: 'pistol', color: 'red' }
        ];

        gameEngine = new Engine('game-canvas', {
          mode: 'offline',
          socket: null,
          localPlayerId: 'player',
          localPlayerName: myName,
          localWeapon: 'none',
          localColor: myColor,
          localPlayerIndex: 0,
          players: playersList,
          seed: Math.random(),
          mapId: selectedMapId,
          settings: { ...gameSettings, volume: gameSettings.sfxMuted ? 0 : gameSettings.volume },
          matchMode: 'sabotage',
          isRanked: false,
          qpRenderStyle: qpRenderStyle,
          onMatchEnd: handleMatchEnd,
          onKillFeed: addKillFeedMessage
        });

        showScreen('game');
      };

      playRankedStartVideo(initGame);
    });
  }

  // Create Room
  if (btns.createRoom) {
    btns.createRoom.addEventListener('click', () => {
      const deployModal = document.getElementById('deploy-modal');
      if (deployModal) deployModal.classList.remove('active');

      if (inputs.name) myName = inputs.name.value.trim() || 'Operative';
      safeStorage.setItem('tacticstrike_player_name', myName);
      connectSocket();
      if (socket) {
        socket.emit('create-room', { playerName: myName, mode: myMode, color: myColor, mapId: selectedMapId, weapon: myWeapon, renderStyle: qpRenderStyle });
      }
    });
  }

  // Join Room
  if (btns.joinRoom) {
    btns.joinRoom.addEventListener('click', () => {
      const deployModal = document.getElementById('deploy-modal');
      if (deployModal) deployModal.classList.remove('active');

      const code = inputs.roomCode ? inputs.roomCode.value.toUpperCase().trim() : '';
      if (!code || code.length !== 5) {
        alert('Please enter a valid 5-character room code.');
        return;
      }
      if (inputs.name) myName = inputs.name.value.trim() || 'Operative';
      safeStorage.setItem('tacticstrike_player_name', myName);
      connectSocket();
      if (socket) {
        socket.emit('join-room', { roomId: code, playerName: myName, color: myColor, weapon: myWeapon });
      }
    });
  }

  // Ranked matchmaking with 15-second rank expansion
  function startRankedMatchmaking(searchStyle) {
    const banUntil = parseInt(localStorage.getItem('tacticstrike_mm_ban_until') || '0');
    if (Date.now() < banUntil) {
      const remainingMs = banUntil - Date.now();
      const mins = Math.floor(remainingMs / 60000);
      const secs = Math.floor((remainingMs % 60000) / 1000);
      showInSiteDialog({
        title: 'MATCHMAKING BAN ACTIVE',
        message: `${mins}:${String(secs).padStart(2, '0')} remaining.\n\nLeaving ranked matches results in a temporary ban.`,
        confirmText: 'UNDERSTOOD',
        tone: 'ban'
      });
      return;
    }

    const deployModal = document.getElementById('deploy-modal');
    if (deployModal) deployModal.classList.remove('active');

    if (inputs.name) myName = inputs.name.value.trim() || 'Operative';
    safeStorage.setItem('tacticstrike_player_name', myName);
    connectSocket();
    if (socket) {
      // Get current RP from localStorage
      const myRP = parseInt(localStorage.getItem('tacticstrike_rp') || '0');
      rankSearchExpanded = false;

      const searchMode = myMode + '_' + searchStyle;

      // Emit first with strict rank bracket
      socket.emit('auto-match', { playerName: myName, mode: searchMode, color: myColor, rp: myRP, rankStrict: true, weapon: myWeapon });
      
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
            socket.emit('auto-match', { playerName: myName, mode: searchMode, color: myColor, rp: myRP, rankStrict: false, weapon: myWeapon });
          }
        }
      }, 2000);

      // Dynamic bot fallback: after a random 15-60s without a human opponent,
      // deploy into a ranked match against a bot with a realistic username
      const botFallbackDelay = 15000 + Math.floor(Math.random() * 46000);
      if (botFallbackTimer) clearTimeout(botFallbackTimer);
      botFallbackTimer = setTimeout(() => {
        botFallbackTimer = null;
        const activeScreen = document.querySelector('.screen.active');
        if (!activeScreen || activeScreen.id !== 'matchmaking-screen') return;
        if (currentRoom && lobbyPlayers && lobbyPlayers.length > 1) return;
        startRankedBotMatch(searchStyle);
      }, botFallbackDelay);
    }
  }

  function startRankedBotMatch(searchStyle) {
    if (window.mmInterval) clearInterval(window.mmInterval);
    if (window.mmDotsInterval) clearInterval(window.mmDotsInterval);
    if (rankSearchTimer) { clearTimeout(rankSearchTimer); rankSearchTimer = null; }
    if (botFallbackTimer) { clearTimeout(botFallbackTimer); botFallbackTimer = null; }
    rankSearchExpanded = true;

    const mmExpandNotice = document.getElementById('mm-expand-notice');
    const mmDots = document.getElementById('mm-dots');
    const mmTimer = document.getElementById('mm-timer');
    if (mmExpandNotice) mmExpandNotice.innerText = 'GAME FOUND — DEPLOYING...';
    if (mmDots) mmDots.innerText = '';
    if (mmTimer) mmTimer.innerText = '';

    if (socket) {
      socket.emit('leave-room');
    }
    disconnectSocket();
    currentRoom = null;

    const fallbackBotName = generateBotUsername();
    currentMatchSource = 'ranked';

    const initGame = () => {
      displays.chatMessages.innerHTML = '';

      if (gameEngine) {
        gameEngine.destroy();
      }

      localStorage.setItem('tacticstrike_active_match', 'ranked');

      const playersList = [
        { id: 'player', name: myName, weapon: myWeapon, color: myColor }
      ];

      if (myMode === '2v2') {
        playersList.push({ id: 'bot_enemy_1', name: fallbackBotName, weapon: getRandomWeapon(), color: 'red' });
        playersList.push({ id: 'bot_teammate', name: generateBotUsername(), weapon: getRandomWeapon(), color: 'green' });
        playersList.push({ id: 'bot_enemy_2', name: generateBotUsername(), weapon: getRandomWeapon(), color: 'orange' });
      } else {
        playersList.push({ id: 'bot_enemy_1', name: fallbackBotName, weapon: getRandomWeapon(), color: 'red' });
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
        isRanked: true,
        qpRenderStyle: searchStyle,
        onMatchEnd: handleMatchEnd,
        onKillFeed: addKillFeedMessage
      });

      addSystemChatMessage(`Game found! Playing against ${fallbackBotName}.`);
      showScreen('game');
    };

    setTimeout(() => playRankedStartVideo(initGame), 1200);
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
      if (botFallbackTimer) { clearTimeout(botFallbackTimer); botFallbackTimer = null; }
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
      if (socket && currentRoom && currentMatchSource !== 'ranked') {
        showScreen('lobby');
        isReady = false;
        updateLobbyUI(lobbyPlayers);
        updateWeaponStatsUI(myWeapon);
      } else {
        // Offline mode or finished ranked match goes back to main menu
        if (socket) {
          socket.emit('leave-room');
        }
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
    gameLeaveBtn.addEventListener('click', async () => {
      const matchActive = gameEngine && gameEngine.active && gameEngine.gameState !== 'match-over';
      if (matchActive) {
        let dialogConfig;
        if (gameEngine.isRanked) {
          dialogConfig = {
            title: 'MATCHMAKING BAN WARNING',
            message: 'Leaving this ranked match will count it as a LOSS (-40 RP) and give you a 5-minute MATCHMAKING BAN.',
            confirmText: 'LEAVE MATCH',
            cancelText: 'STAY IN MATCH',
            tone: 'danger'
          };
        } else if (gameEngine.mode === 'online') {
          dialogConfig = {
            title: 'LEAVE MATCH',
            message: 'Leaving this online match will count it as a LOSS.',
            confirmText: 'LEAVE MATCH',
            cancelText: 'STAY IN MATCH',
            tone: 'info'
          };
        } else {
          dialogConfig = {
            title: 'LEAVE MATCH',
            message: 'Your current match progress will be lost.',
            confirmText: 'LEAVE',
            cancelText: 'STAY',
            tone: 'info'
          };
        }
        const confirmed = await showInSiteDialog(dialogConfig);
        if (!confirmed) {
          gameMenuOverlay.classList.remove('active');
          return;
        }
      }
      console.log("LEAVE MATCH clicked. Cleaning up game session...");
      try {
        gameMenuOverlay.classList.remove('active');
        if (gameEngine) {
          try {
            if (gameEngine.active && (gameEngine.mode === 'online' || gameEngine.isRanked) && gameEngine.gameState !== 'match-over') {
              recordMatchResult(false);
              if (gameEngine.isRanked) {
                const myRP = parseInt(localStorage.getItem('tacticstrike_rp') || '0');
                const nextRP = Math.max(0, myRP - 40);
                localStorage.setItem('tacticstrike_rp', String(nextRP));
                localStorage.setItem('tacticstrike_mm_ban_until', String(Date.now() + 5 * 60 * 1000));
              }
            }
          } catch (e) {
            console.error("Error recording match result during leave:", e);
          }
          localStorage.removeItem('tacticstrike_active_match');
          try {
            gameEngine.destroy();
          } catch (e) {
            console.error("Error destroying gameEngine:", e);
          }
          gameEngine = null;
        }
      } catch (e) {
        console.error("Error in leave match handler pre-disconnect:", e);
      }
      
      try {
        if (socket && currentRoom) {
          socket.emit('leave-room');
        }
      } catch (e) {
        console.error("Error emitting leave-room:", e);
      }
      
      try {
        disconnectSocket();
      } catch (e) {
        console.error("Error disconnecting socket:", e);
      }
      
      try {
        showScreen('menu');
      } catch (e) {
        console.error("Error showing menu screen:", e);
      }
    });
  }

  // Warn before closing/refreshing during any active match
  window.addEventListener('beforeunload', (e) => {
    if (gameEngine && gameEngine.active && gameEngine.gameState !== 'match-over') {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  });


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

  // Custom map card selection
  if (inputs.qpMapSelect) {
    const mapOptions = inputs.qpMapSelect.querySelectorAll('.qp-map-option');
    const syncQpMapUI = () => {
      mapOptions.forEach(opt => {
        const isActive = opt.dataset.map === selectedMapId;
        opt.classList.toggle('active', isActive);
        opt.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    };
    syncQpMapUI();
    mapOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        if (selectedMapId === opt.dataset.map) return;
        selectedMapId = opt.dataset.map;
        safeStorage.setItem('tacticstrike_selected_map', selectedMapId);
        syncQpMapUI();
        playMenuClick();
      });
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

  if (inputs.lobbyModeSelect) {
    inputs.lobbyModeSelect.addEventListener('change', (e) => {
      const newMode = e.target.value;
      if (socket && currentRoom) {
        socket.emit('select-game-mode', { mode: newMode });
      }
      playMenuClick();
    });
  }

  if (inputs.lobbyStyleSelect) {
    inputs.lobbyStyleSelect.addEventListener('change', (e) => {
      const newStyle = e.target.value;
      if (socket && currentRoom) {
        socket.emit('select-render-style', { renderStyle: newStyle });
      }
      playMenuClick();
    });
  }

  initCustomDropdown(inputs.lobbyModeSelect);
  initCustomDropdown(inputs.lobbyMapSelect);
  initCustomDropdown(inputs.lobbyStyleSelect);
}

// Site-themed custom dropdown that wraps a native <select> (kept in sync both ways)
function closeAllCustomDropdowns(exceptWrapper = null) {
  document.querySelectorAll('.custom-dropdown.open').forEach(w => {
    if (w !== exceptWrapper) w.classList.remove('open');
  });
}

function initCustomDropdown(select) {
  if (!select || select.dataset.customDropdown === '1') return;
  select.dataset.customDropdown = '1';

  const wrapper = document.createElement('div');
  wrapper.className = 'custom-dropdown';
  select.parentNode.insertBefore(wrapper, select);
  wrapper.appendChild(select);
  select.classList.add('custom-dropdown-source');

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'custom-dropdown-toggle';
  toggle.innerHTML = '<span class="custom-dropdown-label"></span><span class="custom-dropdown-arrow">▾</span>';
  wrapper.appendChild(toggle);

  const menu = document.createElement('div');
  menu.className = 'custom-dropdown-menu';
  wrapper.appendChild(menu);

  Array.from(select.options).forEach(opt => {
    const item = document.createElement('div');
    item.className = 'custom-dropdown-option';
    item.dataset.value = opt.value;
    item.textContent = opt.textContent;
    item.addEventListener('click', () => {
      if (select.disabled) return;
      closeAllCustomDropdowns();
      if (rawGetValue() !== opt.value) {
        select.value = opt.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    menu.appendChild(item);
  });

  const valueDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  const rawGetValue = () => valueDesc.get.call(select);
  const rawSetValue = (v) => valueDesc.set.call(select, v);
  const disabledDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'disabled');

  function syncDropdownUI() {
    const current = rawGetValue();
    const selectedOption = select.options[select.selectedIndex];
    toggle.querySelector('.custom-dropdown-label').textContent = selectedOption ? selectedOption.textContent : '';
    menu.querySelectorAll('.custom-dropdown-option').forEach(o => o.classList.toggle('active', o.dataset.value === current));
    wrapper.classList.toggle('disabled', select.disabled);
    toggle.setAttribute('aria-expanded', wrapper.classList.contains('open') ? 'true' : 'false');
  }

  Object.defineProperty(select, 'value', {
    get: rawGetValue,
    set(v) { rawSetValue(v); syncDropdownUI(); },
    configurable: true
  });
  Object.defineProperty(select, 'disabled', {
    get: () => disabledDesc.get.call(select),
    set(v) { disabledDesc.set.call(select, v); syncDropdownUI(); },
    configurable: true
  });

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (select.disabled) return;
    const wasOpen = wrapper.classList.contains('open');
    closeAllCustomDropdowns();
    if (!wasOpen) {
      const rect = toggle.getBoundingClientRect();
      if (window.innerHeight - rect.bottom < 150) {
        wrapper.classList.add('drop-up');
      } else {
        wrapper.classList.remove('drop-up');
      }
      wrapper.classList.add('open');
    }
    syncDropdownUI();
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) wrapper.classList.remove('open');
  });

  syncDropdownUI();
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
      updateMatchConfigurationSummary();
    });
  });
}

function updateMatchConfigurationSummary() {
  const modeLabel = myMode === '2v2' ? '2V2 SQUAD' : '1V1 DUEL';
  const weaponLabel = (WEAPON_NAMES[myWeapon] || myWeapon || 'Pistol').toUpperCase();
  const summary = document.getElementById('match-config-summary');
  const loadout = document.getElementById('match-loadout-value');
  if (summary) summary.textContent = `${modeLabel} / ${weaponLabel}`;
  if (loadout) loadout.textContent = weaponLabel;
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
      updateMatchConfigurationSummary();
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
    dismissStartupOverlay({ immediate: true });
    const warning = document.getElementById('mobile-warning-screen');
    if (warning) {
      warning.style.display = 'flex';
    }
    return; // Block initialization
  }

  const startupStatus = document.getElementById('startup-status');
  if (startupStatus && accountSession.token) startupStatus.textContent = 'RESTORING OPERATIVE SESSION';


  // Forfeit/crash detection
  const activeMatch = localStorage.getItem('tacticstrike_active_match');
  if (activeMatch) {
    recordMatchResult(false);
    if (activeMatch === 'ranked') {
      const myRP = parseInt(localStorage.getItem('tacticstrike_rp') || '0');
      const nextRP = Math.max(0, myRP - 40);
      localStorage.setItem('tacticstrike_rp', String(nextRP));
      localStorage.setItem('tacticstrike_mm_ban_until', String(Date.now() + 5 * 60 * 1000));
      showInSiteDialog({
        title: 'GAME LOST',
        message: 'You left a ranked match. The result was recorded as a loss (-40 RP).\n\nMATCHMAKING BAN: 5 minutes.',
        confirmText: 'UNDERSTOOD',
        tone: 'danger'
      });
    } else {
      showInSiteDialog({
        title: 'GAME LOST',
        message: 'You disconnected from an active match. Recorded as a loss.',
        confirmText: 'UNDERSTOOD',
        tone: 'danger'
      });
    }
    localStorage.removeItem('tacticstrike_active_match');
  }

  initSettings();
  const accountRestore = initAccountAuth();
  initNewsModal();
  initWhatsNewModal();
  initCreditShop();
  initPurchaseSupport();
  initAdminDashboard();
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
  checkSaraMode(false);

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
  updateMatchConfigurationSummary();

  finishStartupSequence(accountRestore).then(() => {
    const url = new URL(location.href), shop = url.searchParams.get('shop');
    if (shop === 'credits') openCreditShopModal('menu');
    if (shop === 'support') document.getElementById('btn-open-purchase-support')?.click();
    if (shop === 'credits' || shop === 'support') {url.searchParams.delete('shop');history.replaceState(null, '', url);}
  });

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

function initWhatsNewModal() {
  const whatsNewModal = document.getElementById('whats-new-modal');
  const openWhatsNewBtn = document.getElementById('btn-open-whats-new');
  const closeWhatsNewBtn = document.getElementById('btn-close-whats-new');
  
  if (!whatsNewModal || !openWhatsNewBtn || !closeWhatsNewBtn) return;
  
  openWhatsNewBtn.addEventListener('click', () => {
    whatsNewModal.classList.add('active');
    playMenuClick();
  });
  
  closeWhatsNewBtn.addEventListener('click', () => {
    whatsNewModal.classList.remove('active');
    playMenuClick();
  });
}

function initCreditShop() {
  const creditShopModal = document.getElementById('credit-shop-modal');
  const openCreditShopBtn = document.getElementById('btn-open-credit-shop');
  const closeCreditShopBtn = document.getElementById('btn-close-credit-shop');
  const buyCreditsButtons = document.querySelectorAll('#credit-shop-modal [data-buy-credit-pack]');

  if (!creditShopModal || !closeCreditShopBtn) return;

  openCreditShopBtn?.addEventListener('click', () => openCreditShopModal('menu'));

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-credit-shop]');
    if (!trigger) return;
    openCreditShopModal(trigger.closest('#shop-modal') ? 'item-shop' : 'menu');
  });

  document.addEventListener('click', (event) => {
    const checkoutTrigger = event.target.closest('[data-buy-credit-pack]');
    if (!checkoutTrigger) return;
    event.preventDefault();
    startCreditCheckout(checkoutTrigger.dataset.buyCreditPack);
  });

  closeCreditShopBtn.addEventListener('click', () => {
    creditShopModal.classList.remove('active');
    playCreditShopSound('close');
  });

  buyCreditsButtons.forEach(button => button.addEventListener('click', () => playCreditShopSound('confirm')));

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) resetCreditCheckoutButtons();
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) resetCreditCheckoutButtons();
  });
}

function resetCreditCheckoutButtons() {
  document.querySelectorAll('#credit-shop-modal [data-buy-credit-pack]').forEach(button => {
    button.disabled = false;
    if (button.dataset.checkoutLabel) {
      button.innerHTML = button.dataset.checkoutLabel;
      delete button.dataset.checkoutLabel;
    }
  });
}
window.resetCreditCheckoutButtons = resetCreditCheckoutButtons;

function openCreditShopModal(source = 'menu') {
  const creditShopModal = document.getElementById('credit-shop-modal');
  if (!creditShopModal) return;
  creditShopModal.dataset.source = source;
  creditShopModal.classList.add('active');
  playCreditShopSound('open');
}

async function startCreditCheckout(packageId) {
  if (!accountSession.user?.emailVerified || !accountSession.token) {
    openHubAccount();
    return;
  }

  const checkoutButton = document.querySelector(`[data-buy-credit-pack="${packageId}"]`);
  if (checkoutButton) {
    checkoutButton.dataset.checkoutLabel = checkoutButton.innerHTML;
    checkoutButton.disabled = true;
    checkoutButton.textContent = 'OPENING SECURE CHECKOUT…';
  }

  try {
    const result = await accountApi('/api/credits/checkout', {
      method: 'POST',
      body: JSON.stringify({ packageId })
    });
    playCreditShopSound('confirm');
    resetCreditCheckoutButtons();
    window.location.assign(result.checkoutUrl);
  } catch (error) {
    resetCreditCheckoutButtons();
    if (error.code === 'EMAIL_VERIFICATION_REQUIRED') { openHubAccount(); return; }
    if (error.status === 401) {
      clearAccountSession();
      openHubAccount();
      return;
    }
    showNotification(error.message, 6000);
    playErrorBeep();
  }
}

function setSupportNotice(message = '', type = '') {
  const element = document.getElementById('purchase-support-message');
  if (!element) return;
  element.textContent = message;
  element.className = `support-notice${type ? ` ${type}` : ''}`;
}

function formatSupportDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function getCaseStatusLabel(purchaseCase) {
  if (purchaseCase.closed) return 'CLOSED';
  if (purchaseCase.status === 'approved') return `${purchaseCase.creditsGranted.toLocaleString()} CREDITS ADDED`;
  if (purchaseCase.status === 'denied') return 'DENIED';
  return 'AWAITING REVIEW';
}

function getCaseStatusClass(purchaseCase) {
  if (purchaseCase.closed) return 'closed';
  return purchaseCase.status || 'open';
}

function readProofFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Attach a receipt screenshot as proof of purchase.'));
      return;
    }
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      reject(new Error('Upload a PNG, JPG, or WebP receipt image.'));
      return;
    }
    if (file.size > 1_500_000) {
      reject(new Error('Receipt images must be smaller than 1.5 MB.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, data: reader.result });
    reader.onerror = () => reject(new Error('The receipt image could not be read.'));
    reader.readAsDataURL(file);
  });
}

function createSupportMessageBubble(message) {
  const bubble = document.createElement('div');
  bubble.className = `support-message-bubble ${message.senderRole}`;

  const meta = document.createElement('div');
  meta.className = 'support-message-meta';
  const sender = document.createElement('span');
  sender.textContent = message.senderRole === 'admin' ? 'TACTICSTRIKE SUPPORT' : 'YOU';
  const time = document.createElement('span');
  time.textContent = formatSupportDate(message.createdAt);
  meta.append(sender, time);
  bubble.appendChild(meta);

  if (message.body) {
    const body = document.createElement('div');
    body.textContent = message.body;
    bubble.appendChild(body);
  }
  if (message.proofData) {
    const proof = document.createElement('img');
    proof.className = 'support-proof-image';
    proof.src = message.proofData;
    proof.alt = message.proofName ? `Purchase proof: ${message.proofName}` : 'Purchase proof';
    bubble.appendChild(proof);
  }
  return bubble;
}

function syncGrantedCredits(user) {
  if (!user?.id) return;
  const seenKey = `tacticstrike_server_credits_seen_${user.id}`;
  const previouslySeen = Math.max(0, parseInt(safeStorage.getItem(seenKey) || '0'));
  const serverCredits = Math.max(0, Number(user.credits || 0));
  if (serverCredits > previouslySeen) {
    const currentLocalCredits = Math.max(0, parseInt(safeStorage.getItem('tacticstrike_credits') || '0'));
    safeStorage.setItem('tacticstrike_credits', String(currentLocalCredits + (serverCredits - previouslySeen)));
  }
  safeStorage.setItem(seenKey, String(serverCredits));
}

async function loadPurchaseSupportCases() {
  const container = document.getElementById('purchase-support-cases');
  if (!container) return;
  container.innerHTML = '<div class="support-empty-state">Loading secure conversations…</div>';
  try {
    const result = await accountApi('/api/purchase-support/cases');
    if (result.user) {
      accountSession.user = result.user;
      updateAccountUI();
    }
    if (!result.cases.length) {
      container.innerHTML = '<div class="support-empty-state">No purchase-verification chats yet.</div>';
      return;
    }
    const details = await Promise.all(result.cases.map(item => accountApi(`/api/purchase-support/cases/${item.id}`)));
    container.innerHTML = '';
    details.forEach(resultItem => renderPurchaseSupportCase(resultItem.purchaseCase, container));
  } catch (error) {
    if (error.status === 401) {
      clearAccountSession();
      document.getElementById('purchase-support-modal')?.classList.remove('active');
      openHubAccount('login', 'support');
      return;
    }
    container.innerHTML = '<div class="support-empty-state">Purchase chats could not be loaded. Try refreshing.</div>';
    setSupportNotice(error.message, 'error');
  }
}

function renderPurchaseSupportCase(purchaseCase, container) {
  const card = document.createElement('article');
  card.className = 'support-case-card';

  const summary = document.createElement('div');
  summary.className = 'support-case-summary';
  const summaryText = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = `ORDER ${purchaseCase.orderNumber}`;
  const subtitle = document.createElement('small');
  subtitle.textContent = `${purchaseCase.requestedCredits.toLocaleString()}-credit verification · opened ${formatSupportDate(purchaseCase.createdAt)}`;
  summaryText.append(title, subtitle);
  const status = document.createElement('span');
  status.className = `case-status ${getCaseStatusClass(purchaseCase)}`;
  status.textContent = getCaseStatusLabel(purchaseCase);
  summary.append(summaryText, status);
  card.appendChild(summary);

  const messages = document.createElement('div');
  messages.className = 'support-message-list';
  purchaseCase.messages.forEach(message => messages.appendChild(createSupportMessageBubble(message)));
  card.appendChild(messages);

  if (!purchaseCase.closed) {
    const replyForm = document.createElement('form');
    replyForm.className = 'support-reply-form';
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1500;
    input.required = true;
    input.placeholder = 'Reply to support…';
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'SEND';
    replyForm.append(input, button);
    replyForm.addEventListener('submit', async event => {
      event.preventDefault();
      button.disabled = true;
      try {
        await accountApi(`/api/purchase-support/cases/${purchaseCase.id}/messages`, {
          method: 'POST',
          body: JSON.stringify({ message: input.value })
        });
        setSupportNotice('Reply sent securely.', 'success');
        await loadPurchaseSupportCases();
      } catch (error) {
        setSupportNotice(error.message, 'error');
      } finally {
        button.disabled = false;
      }
    });
    card.appendChild(replyForm);
  }
  container.appendChild(card);
  requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; });
}

function initPurchaseSupport() {
  const modal = document.getElementById('purchase-support-modal');
  const openButton = document.getElementById('btn-open-purchase-support');
  const closeButton = document.getElementById('btn-close-purchase-support');
  const refreshButton = document.getElementById('btn-refresh-purchase-support');
  const form = document.getElementById('purchase-support-form');
  if (!modal || !openButton || !closeButton || !form) return;

  openButton.addEventListener('click', () => {
    if (!accountSession.user || !accountSession.token) {
      openHubAccount('login', 'support');
      return;
    }
    modal.classList.add('active');
    setSupportNotice();
    playCreditShopSound('open');
    loadPurchaseSupportCases();
  });
  closeButton.addEventListener('click', () => {
    modal.classList.remove('active');
    playCreditShopSound('close');
  });
  refreshButton?.addEventListener('click', loadPurchaseSupportCases);

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    setSupportNotice('Encrypting and submitting your purchase proof…', 'info');
    try {
      const file = document.getElementById('purchase-proof-file').files[0];
      const proof = await readProofFile(file);
      await accountApi('/api/purchase-support/cases', {
        method: 'POST',
        body: JSON.stringify({
          orderNumber: document.getElementById('purchase-order-number').value,
          packageId: document.getElementById('purchase-package').value,
          message: document.getElementById('purchase-support-text').value,
          proof
        })
      });
      form.reset();
      setSupportNotice('Purchase proof submitted. Support will reply within 1–12 hours.', 'success');
      playCreditShopSound('confirm');
      await loadPurchaseSupportCases();
    } catch (error) {
      setSupportNotice(error.message, 'error');
      playErrorBeep();
    } finally {
      submit.disabled = false;
    }
  });
}

function setAdminLoginMessage(message = '', type = '') {
  const element = document.getElementById('admin-login-message');
  if (!element) return;
  element.textContent = message;
  element.className = `support-notice${type ? ` ${type}` : ''}`;
}

function setAdminView(authenticated) {
  const loginView = document.getElementById('admin-login-view');
  const dashboardView = document.getElementById('admin-dashboard-view');
  if (loginView) loginView.hidden = authenticated;
  if (dashboardView) dashboardView.hidden = !authenticated;
}

function clearAdminSession() {
  adminSessionToken = null;
  selectedAdminCaseId = null;
  safeStorage.removeItem(ADMIN_SESSION_KEY);
  setAdminView(false);
}

async function loadAdminCases(preferredCaseId = selectedAdminCaseId) {
  const list = document.getElementById('admin-case-list');
  const detail = document.getElementById('admin-case-detail');
  if (!list || !detail) return;
  list.innerHTML = '<div class="support-empty-state">Loading purchase queue…</div>';
  try {
    const result = await adminApi('/api/admin/purchase-cases');
    if (!result.cases.length) {
      list.innerHTML = '<div class="support-empty-state">No messages submitted.</div>';
      detail.innerHTML = '<div class="support-empty-state">The verification queue is empty.</div>';
      return;
    }
    list.innerHTML = '';
    result.cases.forEach(purchaseCase => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.caseId = purchaseCase.id;
      button.className = `admin-case-list-item${purchaseCase.id === preferredCaseId ? ' active' : ''}`;
      const email = document.createElement('strong');
      email.textContent = purchaseCase.userEmail || 'Unknown account';
      const order = document.createElement('span');
      order.textContent = `Order ${purchaseCase.orderNumber}`;
      const state = document.createElement('small');
      state.textContent = `${getCaseStatusLabel(purchaseCase)} · ${formatSupportDate(purchaseCase.updatedAt)}`;
      button.append(email, order, state);
      button.addEventListener('click', () => loadAdminCase(purchaseCase.id));
      list.appendChild(button);
    });
    const targetId = result.cases.some(item => item.id === preferredCaseId) ? preferredCaseId : result.cases[0].id;
    await loadAdminCase(targetId, false);
  } catch (error) {
    if (error.status === 401) {
      clearAdminSession();
      setAdminLoginMessage('Admin session expired. Sign in again.', 'error');
      return;
    }
    list.innerHTML = '<div class="support-empty-state">The verification queue could not be loaded.</div>';
    detail.innerHTML = '';
  }
}

async function loadAdminCase(caseId, refreshListState = true) {
  const detail = document.getElementById('admin-case-detail');
  if (!detail) return;
  selectedAdminCaseId = caseId;
  if (refreshListState) {
    document.querySelectorAll('.admin-case-list-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`.admin-case-list-item[data-case-id="${caseId}"]`)?.classList.add('active');
  }
  detail.innerHTML = '<div class="support-empty-state">Loading secure chat…</div>';
  try {
    const result = await adminApi(`/api/admin/purchase-cases/${caseId}`);
    renderAdminCaseDetail(result.purchaseCase);
  } catch (error) {
    if (error.status === 401) {
      clearAdminSession();
      setAdminLoginMessage('Admin session expired. Sign in again.', 'error');
      return;
    }
    detail.innerHTML = '<div class="support-empty-state">This purchase chat could not be loaded.</div>';
  }
}

function renderAdminCaseDetail(purchaseCase) {
  const detail = document.getElementById('admin-case-detail');
  if (!detail) return;
  detail.innerHTML = '';

  const head = document.createElement('div');
  head.className = 'admin-case-detail-head';
  const copy = document.createElement('div');
  const eyebrow = document.createElement('span');
  eyebrow.className = 'section-kicker';
  eyebrow.textContent = purchaseCase.userEmail || 'OPERATIVE ACCOUNT';
  const title = document.createElement('h3');
  title.textContent = `ORDER ${purchaseCase.orderNumber}`;
  const description = document.createElement('p');
  description.textContent = `Requested package: ${purchaseCase.requestedCredits.toLocaleString()} credits · opened ${formatSupportDate(purchaseCase.createdAt)}`;
  copy.append(eyebrow, title, description);
  const status = document.createElement('span');
  status.className = `case-status ${getCaseStatusClass(purchaseCase)}`;
  status.textContent = getCaseStatusLabel(purchaseCase);
  head.append(copy, status);
  detail.appendChild(head);

  const messages = document.createElement('div');
  messages.className = 'support-message-list admin-message-list';
  purchaseCase.messages.forEach(message => messages.appendChild(createSupportMessageBubble(message)));
  detail.appendChild(messages);

  if (!purchaseCase.closed) {
    const reply = document.createElement('form');
    reply.className = 'support-reply-form admin-reply-form';
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1500;
    input.required = true;
    input.placeholder = 'Reply to this user…';
    const send = document.createElement('button');
    send.type = 'submit';
    send.textContent = 'SEND REPLY';
    reply.append(input, send);
    reply.addEventListener('submit', async event => {
      event.preventDefault();
      send.disabled = true;
      try {
        await adminApi(`/api/admin/purchase-cases/${purchaseCase.id}/messages`, {
          method: 'POST',
          body: JSON.stringify({ message: input.value })
        });
        await loadAdminCases(purchaseCase.id);
      } catch (error) {
        showNotification(error.message, 5000);
      } finally {
        send.disabled = false;
      }
    });
    detail.appendChild(reply);
  }

  const actions = document.createElement('div');
  actions.className = 'admin-actions';
  [50, 500, 2000].forEach(credits => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `ADD ${credits.toLocaleString()} CREDITS`;
    button.disabled = purchaseCase.closed || purchaseCase.status === 'approved';
    button.addEventListener('click', () => submitAdminDecision(purchaseCase, 'grant', credits));
    actions.appendChild(button);
  });
  const deny = document.createElement('button');
  deny.type = 'button';
  deny.className = 'danger';
  deny.textContent = 'DENY PROOF';
  deny.disabled = purchaseCase.closed || purchaseCase.status === 'approved';
  deny.addEventListener('click', () => submitAdminDecision(purchaseCase, 'deny'));
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'close-chat';
  close.textContent = 'CLOSE CHAT';
  close.disabled = purchaseCase.closed;
  close.addEventListener('click', () => submitAdminDecision(purchaseCase, 'close'));
  actions.append(deny, close);
  detail.appendChild(actions);
  requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; });
}

async function submitAdminDecision(purchaseCase, action, credits = 0) {
  const description = action === 'grant'
    ? `Add ${credits.toLocaleString()} credits to ${purchaseCase.userEmail}? This cannot be granted twice.`
    : action === 'deny'
      ? `Deny the proof submitted for order ${purchaseCase.orderNumber}?`
      : `Close this chat? The user will no longer be able to reply.`;
  if (!window.confirm(description)) return;
  try {
    await adminApi(`/api/admin/purchase-cases/${purchaseCase.id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ action, credits })
    });
    showNotification(action === 'grant' ? `${credits.toLocaleString()} credits added.` : action === 'deny' ? 'Proof denied.' : 'Chat closed.', 4500);
    await loadAdminCases(purchaseCase.id);
  } catch (error) {
    showNotification(error.message, 5500);
    playErrorBeep();
  }
}

function initAdminDashboard() {
  const modal = document.getElementById('admin-modal');
  const hiddenTrigger = document.getElementById('version-admin-trigger');
  const closeButton = document.getElementById('btn-close-admin');
  const loginForm = document.getElementById('admin-login-form');
  if (!modal || !closeButton || !loginForm) return;

  const openDashboard = () => {
    modal.classList.add('active');
    setAdminLoginMessage();
    setAdminView(Boolean(adminSessionToken));
    playCreditShopSound('open');
    if (adminSessionToken) loadAdminCases();
  };

  let triggerClicks = 0;
  let triggerResetTimer = null;
  hiddenTrigger?.addEventListener('click', () => {
    triggerClicks += 1;
    clearTimeout(triggerResetTimer);
    if (triggerClicks >= 5) {
      triggerClicks = 0;
      openDashboard();
      return;
    }
    triggerResetTimer = setTimeout(() => { triggerClicks = 0; }, 2200);
  });
  closeButton.addEventListener('click', () => {
    modal.classList.remove('active');
    playCreditShopSound('close');
  });
  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    const submit = loginForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    setAdminLoginMessage('Authenticating with the secure server…', 'info');
    try {
      const result = await adminApi('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({
          username: document.getElementById('admin-username').value,
          password: document.getElementById('admin-password').value
        })
      });
      adminSessionToken = result.token;
      safeStorage.setItem(ADMIN_SESSION_KEY, result.token);
      loginForm.reset();
      setAdminView(true);
      await loadAdminCases();
    } catch (error) {
      setAdminLoginMessage(error.message, 'error');
    } finally {
      submit.disabled = false;
    }
  });
  document.getElementById('btn-refresh-admin-cases')?.addEventListener('click', () => loadAdminCases());
  document.getElementById('btn-admin-logout')?.addEventListener('click', async () => {
    try { await adminApi('/api/admin/logout', { method: 'POST' }); } catch (error) {}
    clearAdminSession();
    setAdminLoginMessage('Signed out of the admin dashboard.', 'success');
  });
}

function updateAccountUI() {
  const user = accountSession.user;
  if (user) {
    syncGrantedCredits(user);
    const cached = JSON.stringify(user);
    if (accountSession.token && safeStorage.getItem(ACCOUNT_USER_CACHE_KEY) !== cached) {
      safeStorage.setItem(ACCOUNT_USER_CACHE_KEY, cached);
    }
  }
  const status = document.getElementById('credit-shop-account-status');
  status?.classList.toggle('signed-in', Boolean(user));
  const label = status?.querySelector('span:last-child');
  if (label) label.textContent = user ? user.emailVerified ? 'ACCOUNT CONNECTED' : 'VERIFY YOUR EMAIL' : accountAuthPending ? 'CONNECTING…' : 'SIGN IN';
  document.querySelectorAll('#credit-shop-modal [data-buy-credit-pack]').forEach(button => {
    if (button.firstChild) button.firstChild.textContent = user ? user.emailVerified ? 'CONTINUE TO CHECKOUT ' : 'VERIFY EMAIL TO CONTINUE ' : accountAuthPending ? 'CONNECTING… ' : 'SIGN IN TO BUY ';
  });
}

function clearAccountSession() {
  accountSession = { token: null, user: null };
  accountAuthPending = false;
  removeAccountSession();
  updateAccountUI();
}

let accountPanelPromise, accountReturnDestination = 'credits';
async function openHubAccount(mode = 'login', destination = 'credits') {
  accountReturnDestination = destination;
  try {
    accountPanelPromise ||= import('./public/account/dialog-controller.js').then(({initHubAccount})=>{
      const panel=initHubAccount({autoOpen:false,onSessionChange:session=>{accountSession=session;accountAuthPending=false;updateAccountUI();}});
      panel.dialog.querySelector('#account-return').addEventListener('click',event=>{
        event.preventDefault();panel.close();
        if(accountReturnDestination==='support')document.getElementById('btn-open-purchase-support')?.click();
        else openCreditShopModal();
      });
      return panel;
    }).catch(error=>{accountPanelPromise=null;throw error;});
    const panel=await accountPanelPromise;
    panel.open({tab:'profile',mode});
  } catch {
    const label=document.querySelector('#credit-shop-account-status span:last-child');
    if(label)label.textContent='RETRY ACCOUNT';
  }
}

function initAccountAuth() {
  document.addEventListener('click', event => {
    if (event.target.closest('[data-open-account]')) { event.preventDefault(); openHubAccount(); }
  });
  async function restore() {
    const token = accountSession.token;
    accountAuthPending = Boolean(token);
    updateAccountUI();
    if (!token) return;
    try {
      const result = await accountRequest('/api/auth/me', {token});
      if (accountSession.token !== token) return;
      accountSession.user = result.user;
    } catch(error) {
      if (accountSession.token !== token) return;
      if (error.status === 401) clearAccountSession();
    } finally {
      if (accountSession.token === token) { accountAuthPending = false; updateAccountUI(); }
    }
  }
  window.addEventListener('storage', event => {
    if (event.key === null || [ACCOUNT_SESSION_KEY, ACCOUNT_USER_CACHE_KEY].includes(event.key)) {
      const oldToken = accountSession.token;
      accountSession = readAccountSession();
      if (oldToken !== accountSession.token) restore();
      else updateAccountUI();
    }
  });
  return restore();
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
  const ownedCount = document.getElementById('shop-owned-count');
  const availableCount = document.getElementById('shop-available-count');
  
  if (!container || !creditsDisplay) return;
  
  const currentCredits = parseInt(safeStorage.getItem('tacticstrike_credits') || '0');
  creditsDisplay.innerText = currentCredits;
  
  let purchased = [];
  try {
    purchased = JSON.parse(safeStorage.getItem('tacticstrike_purchased_weapons') || '[]');
  } catch(e) {}
  
  const rp = parseInt(safeStorage.getItem('tacticstrike_rp') || '0');
  
  container.innerHTML = '';

  let ownedTotal = 0;
  let availableTotal = 0;
  
  Object.keys(WEAPON_LOCKS).forEach(key => {
    const req = WEAPON_LOCKS[key];
    const meta = SHOP_WEAPON_META[key];
    const isPurchased = purchased.includes(key);
    const isRankUnlocked = rp >= req.rp;
    const canAfford = currentCredits >= req.price;
    const isOwned = isPurchased || isRankUnlocked;

    if (isOwned) ownedTotal += 1;
    else if (canAfford) availableTotal += 1;
    
    const card = document.createElement('article');
    card.className = `shop-item-card tier-${meta.tier.toLowerCase()}${isOwned ? ' is-owned' : ''}${!canAfford && !isOwned ? ' needs-credits' : ''}`;
    
    let statusText = '';
    let btnHtml = '';
    
    if (isPurchased) {
      statusText = '<span class="shop-item-status owned"><i></i>ACQUIRED</span>';
      btnHtml = '<button class="shop-buy-action owned" disabled>IN YOUR ARMORY</button>';
    } else if (isRankUnlocked) {
      statusText = '<span class="shop-item-status rank"><i></i>RANK UNLOCKED</span>';
      btnHtml = '<button class="shop-buy-action owned" disabled>AVAILABLE IN LOADOUT</button>';
    } else {
      statusText = `<span class="shop-item-status locked"><i></i>${req.rank} CLEARANCE</span>`;
      if (canAfford) {
        btnHtml = `<button class="shop-buy-action buy-btn" data-weapon="${key}">UNLOCK EARLY <span>→</span></button>`;
      } else {
        const shortfall = req.price - currentCredits;
        btnHtml = `<button class="shop-buy-action top-up" type="button" data-open-credit-shop>GET CREDITS <span>+${shortfall.toLocaleString()}</span></button>`;
      }
    }
    
    const weaponStats = WEAPON_STATS[key] || { name: key };
    
    card.innerHTML = `
      <div class="shop-item-topline">
        <span>${meta.tier} ISSUE</span>
        ${statusText}
      </div>
      <div class="shop-item-visual" aria-hidden="true">
        <span class="shop-item-code">${meta.code}</span>
        <span class="shop-item-crosshair"></span>
        <small>${meta.role}</small>
      </div>
      <div class="shop-item-copy">
        <h4>${weaponStats.name}</h4>
        <p>${meta.description}</p>
      </div>
      <div class="shop-item-stats">
        <span><small>DAMAGE</small><strong>${weaponStats.damagePct}</strong></span>
        <span><small>ACCURACY</small><strong>${weaponStats.accuracy}</strong></span>
        <span><small>CAPACITY</small><strong>${weaponStats.magSize}</strong></span>
      </div>
      <div class="shop-item-unlock">
        <span>STANDARD UNLOCK</span><strong>${req.rank} · ${req.rp.toLocaleString()} RP</strong>
      </div>
      <div class="shop-item-purchase">
        <div class="shop-item-price"><img class="mini-credit-mark" src="/tacticstrike-credit-stack.webp" alt="" aria-hidden="true"><strong>${req.price.toLocaleString()}</strong><small>CREDITS</small></div>
        ${btnHtml}
      </div>
    `;
    
    container.appendChild(card);
  });

  if (ownedCount) ownedCount.textContent = ownedTotal;
  if (availableCount) availableCount.textContent = availableTotal;
  
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
    showNotification(`You need ${(req.price - currentCredits).toLocaleString()} more credits for ${WEAPON_NAMES[weaponKey]}.`, 4500);
    openCreditShopModal('item-shop');
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

function showInSiteDialog({ title, message, confirmText = 'CONFIRM', cancelText = null, tone = 'info' }) {
  return new Promise((resolve) => {
    const toneColor = tone === 'danger' ? '#ff3c3c' : (tone === 'ban' ? '#ff6ef7' : '#d4af37');
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay insite-dialog-overlay';
    overlay.style.cssText = 'position: fixed; inset: 0; z-index: 130000;';

    const confirmStyle = (tone === 'danger' || tone === 'ban')
      ? 'background: linear-gradient(135deg, #a11c1c, #520f0f); border: 1px solid #7a1515; color: #ffbcbc;'
      : '';

    overlay.innerHTML = `
      <div class="modal-card" style="width: 400px; max-width: 92vw; padding: 30px 26px; gap: 14px; border-color: ${toneColor}55; box-shadow: 0 0 45px ${toneColor}22;">
        <div style="font-family: var(--font-title); font-size: 11px; letter-spacing: 2.5px; color: ${toneColor}; font-weight: 700; text-shadow: 0 0 10px ${toneColor}55;">${title}</div>
        <div style="font-size: 12.5px; line-height: 1.65; color: #e8ecf2; white-space: pre-line;">${message}</div>
        <div style="display: flex; gap: 10px; width: 100%; margin-top: 8px;">
          ${cancelText ? `<button data-dialog-cancel class="btn secondary btn-3d" style="flex: 1; font-size: 11px; padding: 12px;">${cancelText}</button>` : ''}
          <button data-dialog-confirm class="btn primary btn-3d" style="flex: 1; font-size: 11px; padding: 12px; ${confirmStyle}">${confirmText}</button>
        </div>
      </div>
    `;

    let settled = false;
    const done = (result) => {
      if (settled) return;
      settled = true;
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
      resolve(result);
    };

    overlay.querySelector('[data-dialog-confirm]').addEventListener('click', () => done(true));
    const cancelBtn = overlay.querySelector('[data-dialog-cancel]');
    if (cancelBtn) cancelBtn.addEventListener('click', () => done(false));

    const appRoot = document.getElementById('app') || document.body;
    appRoot.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));
  });
}

const BOT_USERNAME_POOL = [
  'ShadowViper', 'NovaStrike', 'GhostPulse', 'IronTactic', 'DarkHavoc',
  'StormRider', 'PhantomUnit', 'RogueAgent', 'BlitzKing', 'NightOwl',
  'ToxicViper', 'CrimsonGhost', 'AlphaWolf', 'ReaperSix', 'Frostbite',
  'VenomStrike', 'LoneWolf', 'SilentHawk', 'RapidFire', 'SteelRaven',
  'VoidWalker', 'SnapAim', 'HeadshotHero', 'TacticalTurtle', 'QuickScope',
  'MidnightFox', 'SavageOtter', 'WraithOne', 'BulletMagnet', 'ClutchMaster',
  'DriftKing', 'ZeroFear', 'HavocWolf', 'PixelSniper', 'RushHourZ',
  'CamperKing', 'NoScopeNate', 'EchoSquad', 'VexArcher', 'GrimReaperz',
  'SmokeCheck', 'FragMovie', 'LagSwitch', 'SpawnCamper', 'OneTapWonder',
  'SilentStep', 'HeadhunterPro', 'Warlord77', 'TacticalTed', 'ClutchGod'
];

function generateBotUsername() {
  const base = BOT_USERNAME_POOL[Math.floor(Math.random() * BOT_USERNAME_POOL.length)];
  const roll = Math.random();
  if (roll < 0.4) return base + (Math.floor(Math.random() * 90) + 10);
  if (roll < 0.55) return base + 'X';
  if (roll < 0.65) return 'xX' + base + 'Xx';
  if (roll < 0.75) return base + '_' + (Math.floor(Math.random() * 90) + 10);
  return base;
}

let saraModeActive = false;

function isSaraName(name) {
  return (name || '').trim().toLowerCase() === 'sara';
}

function showSaraToast(message) {
  const container = document.getElementById('notification-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'custom-toast sara-toast';
  toast.style.cssText = `
    background: rgba(30, 10, 22, 0.95);
    border: 1px solid #ff9ecf;
    box-shadow: 0 0 18px rgba(255, 158, 207, 0.35);
    border-radius: 6px;
    padding: 14px 20px;
    color: #ffd3e8;
    font-family: var(--font-title);
    font-size: 11px;
    letter-spacing: 1.5px;
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
    text-shadow: 0 0 8px rgba(255, 158, 207, 0.5);
  `;
  const textNode = document.createElement('div');
  textNode.innerText = message;
  toast.appendChild(textNode);
  const dismiss = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 350);
  };
  toast.addEventListener('click', dismiss);
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });
  setTimeout(() => { if (toast.parentNode) dismiss(); }, 4200);
}

function checkSaraMode(showPopup = true) {
  const current = inputs.name ? inputs.name.value : myName;
  const active = isSaraName(current);
  if (inputs.name) inputs.name.classList.toggle('name-sara-effect', active);
  const hudName = document.getElementById('hud-self-name');
  if (hudName) hudName.classList.toggle('name-sara-effect', active);
  if (active && !saraModeActive && showPopup) {
    showSaraToast('💗 x2 XP enabled, Sara xx');
  } else if (!active && saraModeActive && showPopup) {
    showSaraToast('💔 x2 XP gone, Sara xx');
  }
  saraModeActive = active;
}

// Expose remote chat event
window.addEventListener('opponent-chat-msg', (e) => {
  const { name, msg } = e.detail;
  appendChatMessage(name, msg, 'opponent');
});
