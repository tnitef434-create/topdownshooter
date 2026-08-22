const MATERIAL_TONES = {
  grass: { low: 210, high: 1500, decay: 0.055, noise: 0.9 },
  dirt: { low: 150, high: 1000, decay: 0.07, noise: 0.8 },
  stone: { low: 420, high: 2600, decay: 0.045, noise: 0.42 },
  wood: { low: 260, high: 1350, decay: 0.065, noise: 0.58 },
  sand: { low: 130, high: 3400, decay: 0.085, noise: 1 },
  glass: { low: 880, high: 4500, decay: 0.13, noise: 0.18 },
  water: { low: 95, high: 780, decay: 0.18, noise: 0.75 },
  crystal: { low: 1280, high: 6200, decay: 0.34, noise: 0.08 },
};

// The supplied long-form mix is losslessly segmented for web hosting. Only the
// active segment is fetched, so opening TacticStrike never downloads the music.
const MUSIC_URLS = Object.freeze([
  'assets/music/worldloom-flowstate-00.ogg',
  'assets/music/worldloom-flowstate-01.ogg',
  'assets/music/worldloom-flowstate-02.ogg',
  'assets/music/worldloom-flowstate-03.ogg',
]);
const RAIN_RECORDING_URL = 'assets/audio/rain-on-grass.mp3';
const BIRDS_RECORDING_URL = 'assets/audio/birds-near-trees.mp3';
const SEAWATER_RECORDING_URL = 'assets/audio/seawater.mp3';
const BREAK_RECORDING_URLS = Object.freeze({
  dirt: 'assets/audio/break-dirt.mp3',
  sand: 'assets/audio/break-sand.mp3',
  stone: 'assets/audio/break-stone.mp3',
});
const BREAK_RECORDING_GAINS = Object.freeze({ dirt: 2, sand: 0.55, stone: 0.82 });
const MUSIC_HEADROOM = 0.48;

function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function smoothstep(value, min, max) {
  const amount = clamp01((Number(value) - min) / Math.max(0.0001, max - min));
  return amount * amount * (3 - 2 * amount);
}

function recordedBreakKey(material) {
  if (material === 'grass' || material === 'dirt') return 'dirt';
  return Object.hasOwn(BREAK_RECORDING_URLS, material) ? material : null;
}

export class AudioSystem {
  constructor() {
    this.context = null;
    this.master = null;
    this.sfx = null;
    this.ambience = null;
    this.music = null;
    this.musicDuck = null;
    this.musicFilter = null;
    this.musicElement = null;
    this.musicSource = null;
    this.musicTrackIndex = 0;
    this.rainElement = null;
    this.rainSource = null;
    this.rainRecordingGain = null;
    this.rainRecordingFilter = null;
    this.birdsElement = null;
    this.birdsSource = null;
    this.birdsRecordingGain = null;
    this.seawaterElement = null;
    this.seawaterSource = null;
    this.seawaterRecordingGain = null;
    this.seawaterRecordingFilter = null;
    this.breakRecordings = new Map();
    this.activeBreakMaterial = null;
    this.enabled = true;
    this.volume = 0.72;
    this.musicVolume = 0.28;
    this.ambienceVolume = 0.68;
    this.musicEnabled = true;
    this.musicActive = true;
    this.musicLoopFading = false;
    this.noiseBuffer = null;
    this.lastStep = 0;
    this.ambientNodes = null;
    this.environment = {
      dayAmount: 1,
      biome: 'plains',
      caveDepth: 0,
      inWater: false,
      inOcean: false,
      nearTrees: 0,
      rainIntensity: 0,
      active: true,
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        this.setMusicActive(!document.hidden && this.environment.active, document.hidden ? 1.2 : 3.2);
      });
    }
  }

  async unlock() {
    if (!this.enabled) return;
    if (!this.context) this._create();
    if (!this.context) return;
    if (this.context.state === 'suspended') await this.context.resume();
    await this._playMusic();
    this.setEnvironment(this.environment);
    this.setMusicActive(this.musicActive, 3.5);
    this.ui('open');
  }

  _create() {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) {
      this.enabled = false;
      return;
    }
    this.context = new Context();
    this.master = this.context.createGain();
    this.master.gain.value = this.volume;
    this.master.connect(this.context.destination);

    this.sfx = this.context.createGain();
    this.sfx.gain.value = 0.82;
    this.sfx.connect(this.master);

    this.ambience = this.context.createGain();
    this.ambience.gain.value = 0.14 * this.ambienceVolume;
    this.ambience.connect(this.master);

    this.music = this.context.createGain();
    this.music.gain.value = 0.0001;
    this.musicDuck = this.context.createGain();
    this.musicDuck.gain.value = 1;
    this.musicFilter = this.context.createBiquadFilter();
    this.musicFilter.type = 'lowpass';
    this.musicFilter.frequency.value = 18000;
    this.musicFilter.Q.value = 0.25;
    this.music.connect(this.musicDuck).connect(this.musicFilter).connect(this.master);

    this.noiseBuffer = this._makeNoise(4);
    this._startAmbience();
    this._prepareMusic();
    this._prepareRainRecording();
    this._prepareNatureRecordings();
    this._prepareBreakRecordings();
  }

  _makeNoise(seconds) {
    const length = Math.floor(this.context.sampleRate * seconds);
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    let slow = 0;
    let fast = 0;
    for (let i = 0; i < length; i++) {
      const random = Math.random() * 2 - 1;
      slow = slow * 0.985 + random * 0.015;
      fast = fast * 0.72 + random * 0.28;
      data[i] = slow * 0.62 + fast * 0.38;
    }
    return buffer;
  }

  _noiseLayer({ type = 'bandpass', frequency, q = 0.4, gain = 0 }) {
    const source = this.context.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;
    const filter = this.context.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = q;
    const level = this.context.createGain();
    level.gain.value = gain;
    source.connect(filter).connect(level).connect(this.ambience);
    source.start();
    return { source, filter, level };
  }

  _startAmbience() {
    if (!this.context || this.ambientNodes) return;
    const wind = this._noiseLayer({ frequency: 330, q: 0.32, gain: 0.08 });
    const leaves = this._noiseLayer({ type: 'highpass', frequency: 1800, q: 0.22, gain: 0.0001 });
    const water = this._noiseLayer({ type: 'lowpass', frequency: 720, q: 0.5, gain: 0.0001 });
    const rain = this._noiseLayer({ type: 'bandpass', frequency: 2900, q: 0.3, gain: 0.0001 });

    const cave = this.context.createOscillator();
    cave.type = 'sine';
    cave.frequency.value = 51;
    const caveLevel = this.context.createGain();
    caveLevel.gain.value = 0.0001;
    cave.connect(caveLevel).connect(this.ambience);
    cave.start();

    // Wildlife is deliberately recording-only. The former high-frequency
    // oscillator and generated chirps caused a constant artificial "peep".
    this.ambientNodes = { wind, leaves, water, rain, cave, caveLevel };
  }

  _prepareMusic() {
    if (!this.context || this.musicElement || typeof Audio === 'undefined') return;
    const element = new Audio(MUSIC_URLS[this.musicTrackIndex]);
    element.preload = 'metadata';
    element.loop = false;
    element.volume = 1;
    element.addEventListener('timeupdate', () => {
      if (!Number.isFinite(element.duration) || element.duration <= 8) return;
      const remaining = element.duration - element.currentTime;
      if (remaining < 6 && !this.musicLoopFading) {
        this.musicLoopFading = true;
        this._setMusicGain(0, Math.max(0.5, remaining - 0.15));
      }
    });
    element.addEventListener('ended', async () => {
      this.musicLoopFading = false;
      this.musicTrackIndex = (this.musicTrackIndex + 1) % MUSIC_URLS.length;
      element.src = MUSIC_URLS[this.musicTrackIndex];
      element.load();
      if (this.musicEnabled && this.musicActive) {
        await element.play().catch(() => {});
        this._setMusicGain(1, 5);
      }
    });
    this.musicElement = element;
    this.musicSource = this.context.createMediaElementSource(element);
    this.musicSource.connect(this.music);
  }

  _prepareRainRecording() {
    if (!this.context || this.rainElement || typeof Audio === 'undefined') return;
    const element = new Audio(RAIN_RECORDING_URL);
    element.preload = 'auto';
    element.loop = true;
    element.volume = 1;
    this.rainRecordingGain = this.context.createGain();
    this.rainRecordingGain.gain.value = 0.0001;
    this.rainRecordingFilter = this.context.createBiquadFilter();
    this.rainRecordingFilter.type = 'lowpass';
    this.rainRecordingFilter.frequency.value = 15000;
    this.rainRecordingFilter.Q.value = 0.22;
    this.rainElement = element;
    this.rainSource = this.context.createMediaElementSource(element);
    this.rainSource.connect(this.rainRecordingFilter).connect(this.rainRecordingGain).connect(this.ambience);
  }

  _prepareNatureRecordings() {
    if (!this.context || typeof Audio === 'undefined') return;
    if (!this.birdsElement) {
      const element = new Audio(BIRDS_RECORDING_URL);
      element.preload = 'auto';
      element.loop = true;
      element.volume = 1;
      this.birdsRecordingGain = this.context.createGain();
      this.birdsRecordingGain.gain.value = 0.0001;
      this.birdsElement = element;
      this.birdsSource = this.context.createMediaElementSource(element);
      this.birdsSource.connect(this.birdsRecordingGain).connect(this.ambience);
    }
    if (!this.seawaterElement) {
      const element = new Audio(SEAWATER_RECORDING_URL);
      element.preload = 'auto';
      element.loop = true;
      element.volume = 1;
      this.seawaterRecordingGain = this.context.createGain();
      this.seawaterRecordingGain.gain.value = 0.0001;
      this.seawaterRecordingFilter = this.context.createBiquadFilter();
      this.seawaterRecordingFilter.type = 'lowpass';
      this.seawaterRecordingFilter.frequency.value = 1450;
      this.seawaterRecordingFilter.Q.value = 0.34;
      this.seawaterElement = element;
      this.seawaterSource = this.context.createMediaElementSource(element);
      this.seawaterSource
        .connect(this.seawaterRecordingFilter)
        .connect(this.seawaterRecordingGain)
        .connect(this.ambience);
    }
  }

  _prepareBreakRecordings() {
    if (!this.context || typeof Audio === 'undefined' || this.breakRecordings.size) return;
    Object.entries(BREAK_RECORDING_URLS).forEach(([material, url]) => {
      const element = new Audio(url);
      element.preload = 'auto';
      element.loop = true;
      element.volume = 1;
      const gain = this.context.createGain();
      gain.gain.value = BREAK_RECORDING_GAINS[material] || 1;
      const source = this.context.createMediaElementSource(element);
      source.connect(gain).connect(this.sfx);
      this.breakRecordings.set(material, { element, source, gain });
    });
  }

  _setLoopPlayback(element, active, resetOnStop = false) {
    if (!element) return;
    if (active && this.context?.state === 'running') {
      if (element.paused) element.play().catch(() => {});
      return;
    }
    if (!element.paused) element.pause();
    if (resetOnStop && Number.isFinite(element.duration)) element.currentTime = 0;
  }

  async _playMusic() {
    if (!this.musicEnabled || !this.musicElement || !this.musicElement.paused) return;
    await this.musicElement.play().catch(() => {});
  }

  _setMusicGain(activeAmount, fadeSeconds = 2.5) {
    if (!this.music || !this.context) return;
    const target = Math.max(0.0001, clamp01(activeAmount) * this.musicVolume * MUSIC_HEADROOM);
    const now = this.context.currentTime;
    this.music.gain.cancelScheduledValues(now);
    this.music.gain.setValueAtTime(Math.max(0.0001, this.music.gain.value), now);
    this.music.gain.exponentialRampToValueAtTime(target, now + Math.max(0.03, fadeSeconds));
  }

  setMusicActive(active, fadeSeconds = 2.5) {
    this.musicActive = Boolean(active);
    if (this.musicActive && this.musicEnabled) this._playMusic();
    this._setMusicGain(this.musicActive && this.musicEnabled ? 1 : 0, fadeSeconds);
  }

  setPaused(paused) {
    this.environment.active = !paused;
    this.setMusicActive(!paused, paused ? 1.4 : 3.2);
    if (paused) this.stopBreaking();
    this._syncEnvironmentRecordings();
    if (this.ambience && this.context) {
      const target = 0.14 * this.ambienceVolume * (paused ? 0.38 : 1);
      this.ambience.gain.setTargetAtTime(target, this.context.currentTime, 0.5);
    }
  }

  setSettings(settings = {}) {
    this.setVolume(settings.volume ?? this.volume);
    this.musicVolume = clamp01(settings.musicVolume ?? this.musicVolume);
    this.ambienceVolume = clamp01(settings.ambienceVolume ?? this.ambienceVolume);
    this.musicEnabled = settings.musicEnabled !== false;
    if (this.ambience && this.context) {
      this.ambience.gain.setTargetAtTime(0.14 * this.ambienceVolume, this.context.currentTime, 0.15);
    }
    if (this.musicEnabled) this._playMusic();
    this._setMusicGain(this.musicEnabled && this.musicActive ? 1 : 0, 0.35);
    this._syncEnvironmentRecordings();
  }

  setEnvironment(next = {}) {
    this.environment = { ...this.environment, ...next };
    this.environment.dayAmount = clamp01(this.environment.dayAmount);
    this.environment.caveDepth = clamp01(this.environment.caveDepth);
    this.environment.nearTrees = clamp01(this.environment.nearTrees);
    this.environment.rainIntensity = clamp01(this.environment.rainIntensity);
    if (!this.context || !this.ambientNodes) return;

    const {
      dayAmount, caveDepth, nearTrees, rainIntensity, inWater, inOcean, biome,
    } = this.environment;
    const forest = biome === 'forest' ? 1 : biome === 'plains' ? 0.35 : 0.08;
    const night = 1 - dayAmount;
    const now = this.context.currentTime;
    const target = (node, value, time = 1.2) => node.gain.setTargetAtTime(Math.max(0.0001, value), now, time);
    this.ambientNodes.wind.filter.frequency.setTargetAtTime(230 + dayAmount * 310 + rainIntensity * 180, now, 1.4);
    target(this.ambientNodes.wind.level, 0.055 + night * 0.055 + rainIntensity * 0.08, 1.5);
    target(this.ambientNodes.leaves.level, forest * (0.018 + dayAmount * 0.018) * (1 - caveDepth), 1.7);
    target(this.ambientNodes.water.level, inWater ? 0.17 : 0.004, 0.45);
    target(this.ambientNodes.rain.level, rainIntensity * (inWater ? 0.008 : 0.022) * (1 - caveDepth), 0.7);
    target(this.ambientNodes.caveLevel, 0.006 + caveDepth * 0.075, 1.3);
    this.musicFilter.frequency.setTargetAtTime(inWater ? 900 : 18000 - caveDepth * 11200, now, 0.7);
    if (this.rainRecordingGain && this.rainRecordingFilter) {
      // The supplied field recording is the primary rain layer. It remains
      // audible across the surface, disappears once truly underground, and
      // becomes soft and low-passed while the listener is in ocean water.
      const caveGate = caveDepth <= 0.06
        ? 1
        : Math.max(0, Math.min(1, (0.16 - caveDepth) / 0.1));
      // The supplied rain file is very quiet (-41 dB mean). This calibrated
      // gain makes it the clear primary rain layer without clipping the bus.
      const rainLevel = rainIntensity * caveGate * (inWater ? 7.5 : 22);
      this.rainRecordingGain.gain.setTargetAtTime(Math.max(0.0001, rainLevel), now, 0.65);
      this.rainRecordingFilter.frequency.setTargetAtTime(inWater ? 620 : 15000, now, 0.25);
    }
    if (this.birdsRecordingGain) {
      const birdsAllowed = nearTrees > 0.08
        && caveDepth < 0.08
        && !inWater
        && !inOcean
        && biome !== 'desert';
      const birdLevel = birdsAllowed ? 26 * smoothstep(nearTrees, 0.08, 0.72) : 0;
      this.birdsRecordingGain.gain.setTargetAtTime(Math.max(0.0001, birdLevel), now, 0.45);
    }
    if (this.seawaterRecordingGain && this.seawaterRecordingFilter) {
      this.seawaterRecordingGain.gain.setTargetAtTime(inWater ? 24 : 0.0001, now, inWater ? 0.22 : 0.08);
      this.seawaterRecordingFilter.frequency.setTargetAtTime(inWater ? 1250 : 1450, now, 0.2);
    }
    this._syncEnvironmentRecordings();
  }

  setDayAmount(amount) {
    this.setEnvironment({ dayAmount: amount });
  }

  _syncEnvironmentRecordings() {
    const {
      active, caveDepth, nearTrees, rainIntensity, inWater, inOcean, biome,
    } = this.environment;
    const surface = caveDepth < 0.08;
    this._setLoopPlayback(this.rainElement, active && surface && rainIntensity > 0.004);
    this._setLoopPlayback(
      this.birdsElement,
      active && surface && nearTrees > 0.08 && !inWater && !inOcean && biome !== 'desert',
      true,
    );
    this._setLoopPlayback(this.seawaterElement, active && Boolean(inWater), true);
  }

  hasRecordedBreak(material) {
    return Boolean(recordedBreakKey(material));
  }

  setBreaking(material) {
    const key = recordedBreakKey(material);
    if (!key) {
      this.stopBreaking();
      return false;
    }
    if (!this._ready()) return true;
    if (this.activeBreakMaterial !== key) {
      this.stopBreaking();
      this.activeBreakMaterial = key;
    }
    const recording = this.breakRecordings.get(key);
    this._setLoopPlayback(recording?.element, true);
    return true;
  }

  stopBreaking() {
    if (!this.activeBreakMaterial) return;
    const recording = this.breakRecordings.get(this.activeBreakMaterial);
    this._setLoopPlayback(recording?.element, false, true);
    this.activeBreakMaterial = null;
  }

  setVolume(value) {
    this.volume = clamp01(value);
    if (this.master && this.context) this.master.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.03);
  }

  duckMusic(amount = 0.58, duration = 0.32) {
    if (!this.musicDuck || !this.context) return;
    const now = this.context.currentTime;
    this.musicDuck.gain.cancelScheduledValues(now);
    this.musicDuck.gain.setTargetAtTime(Math.max(0.18, amount), now, 0.018);
    this.musicDuck.gain.setTargetAtTime(1, now + Math.max(0.08, duration), 0.22);
  }

  material(name, action = 'hit', strength = 1) {
    if (!this._ready()) return;
    const spec = MATERIAL_TONES[name] || MATERIAL_TONES.stone;
    const now = this.context.currentTime;
    const duration = spec.decay * (action === 'break' ? 2.1 : action === 'place' ? 1.25 : 1);
    this._noiseBurst(now, duration, spec.high, 0.07 * spec.noise * strength, action === 'break' ? 'bandpass' : 'lowpass');
    this._tone(now, spec.low * (0.92 + Math.random() * 0.16), duration * 1.1, 0.055 * strength, action === 'place' ? 'triangle' : 'sine', action === 'break' ? 0.58 : 0.82);
    if (action === 'break') {
      this._tone(now + 0.025, spec.low * 1.48, duration, 0.035 * strength, 'square', 0.45);
      this.duckMusic(0.7, duration);
    }
  }

  step(material = 'grass', strength = 0.8) {
    if (!this._ready()) return;
    const nowMs = performance.now();
    if (nowMs - this.lastStep < 80) return;
    this.lastStep = nowMs;
    const spec = MATERIAL_TONES[material] || MATERIAL_TONES.grass;
    const now = this.context.currentTime;
    this._noiseBurst(now, spec.decay * 0.8, spec.high * 0.75, 0.038 * strength, 'lowpass');
    this._tone(now, spec.low * 0.72, spec.decay, 0.025 * strength, 'sine', 0.7);
  }

  splash(strength = 1) {
    if (!this._ready()) return;
    const now = this.context.currentTime;
    this._noiseBurst(now, 0.25, 920, 0.07 * strength, 'lowpass');
    this._tone(now, 120, 0.21, 0.04 * strength, 'sine', 0.38);
    this.duckMusic(0.72, 0.35);
  }

  pickup() {
    if (!this._ready()) return;
    const now = this.context.currentTime;
    this._tone(now, 720, 0.08, 0.035, 'sine', 1.35);
    this._tone(now + 0.055, 980, 0.12, 0.035, 'sine', 1.2);
  }

  craft() {
    if (!this._ready()) return;
    const now = this.context.currentTime;
    [0, 0.065, 0.13].forEach((delay, index) => this._tone(now + delay, [392, 523, 659][index], 0.16, 0.045, 'triangle', 1.04));
    this.duckMusic(0.65, 0.5);
  }

  ui(kind = 'click') {
    if (!this._ready()) return;
    const now = this.context.currentTime;
    const freq = kind === 'error' ? 150 : kind === 'open' ? 520 : kind === 'close' ? 360 : 440;
    this._tone(now, freq, kind === 'error' ? 0.16 : 0.06, kind === 'error' ? 0.055 : 0.028, 'triangle', kind === 'error' ? 0.72 : 1.08);
    if (kind === 'error') this.duckMusic(0.62, 0.45);
  }

  objective() {
    if (!this._ready()) return;
    const now = this.context.currentTime;
    [523, 659, 784, 1047].forEach((freq, i) => this._tone(now + i * 0.09, freq, 0.4, 0.034, 'sine', 0.95));
    this.duckMusic(0.5, 1.1);
  }

  _ready() {
    return this.enabled && this.context && this.context.state === 'running';
  }

  _tone(time, frequency, duration, gain, type = 'sine', endRatio = 0.7, destination = this.sfx) {
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, frequency * endRatio), time + duration);
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), time + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(envelope).connect(destination);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.02);
  }

  _noiseBurst(time, duration, cutoff, gain, type = 'lowpass', destination = this.sfx) {
    const source = this.context.createBufferSource();
    source.buffer = this.noiseBuffer;
    const filter = this.context.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = cutoff;
    filter.Q.value = type === 'bandpass' ? 0.7 : 0.4;
    const envelope = this.context.createGain();
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), time + 0.005);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    source.connect(filter).connect(envelope).connect(destination);
    source.start(time, Math.random() * Math.max(0.01, this.noiseBuffer.duration - duration));
    source.stop(time + duration + 0.02);
  }
}
