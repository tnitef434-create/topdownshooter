export class Sound {
  constructor() {
    this.ctx = null;
    this.masterVolume = null;
    this.volume = 0.5;

    this.noiseBuffer = null;
    this.shotgunBuffer = null;

    // Per-task alarm oscillator nodes: taskId => { osc1, osc2, gainNode, intervalId, active }
    this.taskAlarms = new Map();
    this.bearMusic = null;
  }

  init() {
    if (this.ctx) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterVolume = this.ctx.createGain();
    this.masterVolume.gain.value = this.volume;
    this.masterVolume.connect(this.ctx.destination);

    // Generate white noise buffer (2s)
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    this.noiseBuffer = buffer;

    // Shotgun sound
    fetch('/dennish18-shotgun.mp3')
      .then(r => r.arrayBuffer())
      .then(ab => this.ctx.decodeAudioData(ab))
      .then(ab => { this.shotgunBuffer = ab; })
      .catch(err => console.error('Error loading shotgun sound:', err));

    // Build a small reverb impulse from noise (no file needed)
    this._buildReverb();
  }

  /** Build a short reverb convolver from white noise */
  _buildReverb() {
    if (!this.ctx || this.reverbNode) return;
    const len = Math.floor(this.ctx.sampleRate * 0.9);
    const ir = this.ctx.createBuffer(2, len, this.ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
      }
    }
    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = ir;
    // Reverb dry/wet mix
    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.value = 0.28;
    this.reverbNode.connect(this.reverbGain);
    this.reverbGain.connect(this.masterVolume);
  }

  setVolume(volume) {
    this.volume = volume;
    if (this.masterVolume) {
      this.masterVolume.gain.value = volume;
    }
    if (this.bearMusic) {
      this.bearMusic.volume = volume;
    }
  }

  playGunshot(weaponType, distance = 0) {
    this.init();
    if (!this.ctx) return;
    
    // Resume context if suspended (browser security)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;

    let finalDest = this.masterVolume;
    if (distance > 0) {
      const muffleFilter = this.ctx.createBiquadFilter();
      muffleFilter.type = 'lowpass';
      // Lowpass cutoff frequency: further distance = lower cutoff (more muffled)
      const cutoff = Math.max(220, 4500 * Math.pow(1 - Math.min(1, distance / 1300), 1.5));
      muffleFilter.frequency.setValueAtTime(cutoff, t);

      // Volume attenuation: further distance = quieter
      const volScale = Math.max(0.01, Math.pow(1 - Math.min(1, distance / 1400), 1.2));
      const distanceGain = this.ctx.createGain();
      distanceGain.gain.setValueAtTime(volScale, t);

      muffleFilter.connect(distanceGain);
      distanceGain.connect(this.masterVolume);
      finalDest = muffleFilter;
    }
    
    // 1. Noise Source (High frequencies & explosion body)
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    const noiseGain = this.ctx.createGain();

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(finalDest);

    // 2. Sine Sweep Source (Low-frequency punch)
    const punch = this.ctx.createOscillator();
    const punchGain = this.ctx.createGain();
    
    punch.connect(punchGain);
    punchGain.connect(finalDest);

    // Profile variables based on weapon
    let noiseFilterFreq = 1000;
    let noiseDecay = 0.1;
    let noiseVol = 0.6;
    let punchStartFreq = 150;
    let punchEndFreq = 40;
    let punchDecay = 0.08;
    let punchVol = 0.5;

    switch (weaponType) {
      case 'pistol':
        noiseFilterFreq = 1200;
        noiseDecay = 0.12;
        noiseVol = 0.5;
        punchStartFreq = 180;
        punchEndFreq = 50;
        punchDecay = 0.06;
        punchVol = 0.3;
        break;
      case 'rifle':
        noiseFilterFreq = 800;
        noiseDecay = 0.18;
        noiseVol = 0.6;
        punchStartFreq = 140;
        punchEndFreq = 40;
        punchDecay = 0.1;
        punchVol = 0.5;
        break;
      case 'shotgun':
        if (this.shotgunBuffer) {
          try {
            const source = this.ctx.createBufferSource();
            source.buffer = this.shotgunBuffer;
            
            const gainNode = this.ctx.createGain();
            gainNode.gain.setValueAtTime(0.9, t);
            
            source.connect(gainNode);
            gainNode.connect(finalDest);
            source.start(t);
            return;
          } catch (e) {
            console.error("Error playing custom shotgun audio:", e);
          }
        }
        noiseFilterFreq = 500;
        noiseDecay = 0.35;
        noiseVol = 0.9;
        punchStartFreq = 120;
        punchEndFreq = 30;
        punchDecay = 0.25;
        punchVol = 0.9;
        
        // Add a secondary crackle for shotgun spread
        this.playMetallicClick(t + 0.05, 800, 0.08, 0.3, distance);
        this.playMetallicClick(t + 0.1, 600, 0.05, 0.3, distance);
        break;
      case 'sniper':
        noiseFilterFreq = 1500;
        noiseDecay = 0.6;
        noiseVol = 1.0;
        punchStartFreq = 220;
        punchEndFreq = 30;
        punchDecay = 0.4;
        punchVol = 1.0;
        break;
      case 'knife':
        noiseFilterFreq = 2000;
        noiseDecay = 0.12;
        noiseVol = 0.45;
        punchStartFreq = 100;
        punchEndFreq = 100;
        punchDecay = 0.01;
        punchVol = 0.0;
        break;
      case 'vector':
        // Very fast light cracks
        noiseFilterFreq = 1600;
        noiseDecay = 0.08;
        noiseVol = 0.42;
        punchStartFreq = 200;
        punchEndFreq = 80;
        punchDecay = 0.05;
        punchVol = 0.25;
        break;
      case 'famas':
        // Tight burst — slightly sharper than rifle
        noiseFilterFreq = 1000;
        noiseDecay = 0.14;
        noiseVol = 0.55;
        punchStartFreq = 160;
        punchEndFreq = 50;
        punchDecay = 0.09;
        punchVol = 0.42;
        break;
      case 'plasma': {
        // Futuristic energy zap — high-pitched descending whine
        noiseFilterFreq = 3000;
        noiseDecay = 0.18;
        noiseVol = 0.3;
        punchStartFreq = 600;
        punchEndFreq = 120;
        punchDecay = 0.18;
        punchVol = 0.55;
        // Extra harmonic shimmer
        try {
          const shimmer = this.ctx.createOscillator();
          const shimmerGain = this.ctx.createGain();
          shimmer.type = 'sawtooth';
          shimmer.frequency.setValueAtTime(800, t);
          shimmer.frequency.exponentialRampToValueAtTime(200, t + 0.15);
          shimmerGain.gain.setValueAtTime(0.08, t);
          shimmerGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
          shimmer.connect(shimmerGain);
          shimmerGain.connect(finalDest);
          shimmer.start(t);
          shimmer.stop(t + 0.17);
        } catch(e) {}
        break;
      }
      case 'railgun': {
        // Heavy electromagnetic rail BOOM
        noiseFilterFreq = 600;
        noiseDecay = 0.55;
        noiseVol = 1.0;
        punchStartFreq = 320;
        punchEndFreq = 18;
        punchDecay = 0.45;
        punchVol = 1.0;
        // Electromagnetic crackle tail
        try {
          const crack = this.ctx.createOscillator();
          const crackGain = this.ctx.createGain();
          crack.type = 'square';
          crack.frequency.setValueAtTime(180, t);
          crack.frequency.exponentialRampToValueAtTime(40, t + 0.3);
          crackGain.gain.setValueAtTime(0.15, t);
          crackGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          crack.connect(crackGain);
          crackGain.connect(finalDest);
          crack.start(t);
          crack.stop(t + 0.32);
        } catch(e) {}
        break;
      }

    } // end switch

    // Configure Noise Envelope
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(noiseFilterFreq, t);
    
    noiseGain.gain.setValueAtTime(noiseVol, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + noiseDecay);

    // Configure Punch Envelope
    punch.type = 'sine';
    punch.frequency.setValueAtTime(punchStartFreq, t);
    punch.frequency.exponentialRampToValueAtTime(punchEndFreq, t + punchDecay);
    
    punchGain.gain.setValueAtTime(punchVol, t);
    punchGain.gain.exponentialRampToValueAtTime(0.001, t + punchDecay);

    // Start & Stop
    noise.start(t);
    noise.stop(t + noiseDecay + 0.05);

    punch.start(t);
    punch.stop(t + punchDecay + 0.05);
  }

  playReload(weaponType) {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    
    // Simulate multi-step reloading mechanical noises
    if (weaponType === 'pistol') {
      // 1. Remove mag (click)
      this.playMetallicClick(t, 2000, 0.05, 0.3);
      // 2. Insert new mag (click-clack)
      this.playMetallicClick(t + 0.4, 1500, 0.08, 0.4);
      this.playMetallicClick(t + 0.5, 2200, 0.04, 0.3);
    } else if (weaponType === 'rifle') {
      // 1. Unlatch clip
      this.playMetallicClick(t, 1800, 0.06, 0.3);
      // 2. Pull clip out
      this.playFrictionalScrape(t + 0.3, 0.2, 0.2);
      // 3. Slap new clip in
      this.playMetallicClick(t + 1.2, 1200, 0.1, 0.5);
      this.playMetallicClick(t + 1.35, 2000, 0.05, 0.4);
      // 4. Chamber round
      this.playMetallicClick(t + 1.8, 1400, 0.08, 0.5);
      this.playMetallicClick(t + 1.9, 1000, 0.08, 0.4);
    } else if (weaponType === 'shotgun') {
      // Load shells one by one (simulate based on reloading progress)
      this.playMetallicClick(t, 1200, 0.06, 0.4);
      this.playFrictionalScrape(t + 0.05, 0.15, 0.3);
      this.playMetallicClick(t + 0.2, 1800, 0.04, 0.4);
    } else if (weaponType === 'sniper') {
      // 1. Unbolt upward
      this.playMetallicClick(t, 1400, 0.08, 0.4);
      this.playMetallicClick(t + 0.1, 1000, 0.06, 0.3);
      // 2. Bolt back (eject shell)
      this.playMetallicClick(t + 0.5, 900, 0.1, 0.4);
      this.playMetallicClick(t + 0.65, 1200, 0.05, 0.3);
      // 3. Load magazine
      this.playMetallicClick(t + 1.2, 1500, 0.1, 0.4);
      this.playMetallicClick(t + 1.35, 1800, 0.05, 0.3);
      // 4. Push bolt forward
      this.playMetallicClick(t + 1.9, 1100, 0.08, 0.4);
      this.playMetallicClick(t + 2.05, 1600, 0.06, 0.4);
    }
  }

  playDryFire() {
    this.init();
    if (!this.ctx) return;
    this.playMetallicClick(this.ctx.currentTime, 3000, 0.03, 0.25);
  }

  playFootstep() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    
    // Footstep is a low-frequency muffled noise burst
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, t);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, t); // Soft footsteps
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);
    
    noise.start(t);
    noise.stop(t + 0.12);
  }

  playHitMarker() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    
    // Metallic clean "ding"
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, t);
    
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    
    osc.connect(gain);
    gain.connect(this.masterVolume);
    
    osc.start(t);
    osc.stop(t + 0.1);
  }

  playCriticalHitMarker() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    
    // Metallic high-pitched "ping"
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2300, t);
    
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    
    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  playFleshHit() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    
    // Soft, wet impact thump
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, t);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);
    
    noise.start(t);
    noise.stop(t + 0.12);
  }

  playCrateBreak() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    
    // Loud wooden crunch
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, t);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    // High frequency splinters
    const highNoise = this.ctx.createBufferSource();
    highNoise.buffer = this.noiseBuffer;
    
    const highFilter = this.ctx.createBiquadFilter();
    highFilter.type = 'highpass';
    highFilter.frequency.setValueAtTime(2000, t);
    
    const highGain = this.ctx.createGain();
    highGain.gain.setValueAtTime(0.2, t);
    highGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    
    highNoise.connect(highFilter);
    highFilter.connect(highGain);
    highGain.connect(this.masterVolume);
    
    noise.start(t);
    noise.stop(t + 0.35);
    highNoise.start(t);
    highNoise.stop(t + 0.2);
  }

  playPickup() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    
    // Synthesized digital beep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, t); // D5
    osc.frequency.setValueAtTime(880.00, t + 0.08); // A5
    
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.setValueAtTime(0.12, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    
    osc.connect(gain);
    gain.connect(this.masterVolume);
    
    osc.start(t);
    osc.stop(t + 0.28);
  }

  playMatchWin() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    
    const playTone = (freq, start, duration, vol) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(vol, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      
      osc.connect(gain);
      gain.connect(this.masterVolume);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    };

    // Ascending major chord
    playTone(523.25, t, 0.4, 0.2); // C5
    playTone(659.25, t + 0.15, 0.4, 0.2); // E5
    playTone(783.99, t + 0.3, 0.4, 0.2); // G5
    playTone(1046.50, t + 0.45, 0.6, 0.25); // C6
  }

  playMatchLose() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    
    const playTone = (freq, start, duration, vol) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, start);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, start);
      
      gain.gain.setValueAtTime(vol, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterVolume);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    };

    // Descending heavy minor chord
    playTone(220.00, t, 0.5, 0.2); // A3
    playTone(207.65, t + 0.2, 0.5, 0.2); // G#3
    playTone(196.00, t + 0.4, 0.5, 0.2); // G3
    playTone(146.83, t + 0.6, 0.8, 0.25); // D3
  }

  // Audio Building Blocks
  // timeOffset: seconds from NOW (ctx.currentTime). Default 0 = play immediately.
  playMetallicClick(timeOffset, frequency, duration, volume = 0.3, distance = 0) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      // timeOffset must be a small offset, not an absolute clock value
      // Clamp to valid range to prevent scheduling errors
      const safeOffset = (typeof timeOffset === 'number' && timeOffset < 10) ? Math.max(0, timeOffset) : 0;
      const t = this.ctx.currentTime + safeOffset;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      let finalDest = this.masterVolume;
      if (distance > 0) {
        const muffle = this.ctx.createBiquadFilter();
        muffle.type = 'lowpass';
        const cutoff = Math.max(220, 3000 * (1 - Math.min(1, distance / 1200)));
        muffle.frequency.setValueAtTime(cutoff, t);

        const distGain = this.ctx.createGain();
        const scale = Math.max(0.01, 1 - distance / 1300);
        distGain.gain.setValueAtTime(scale, t);

        muffle.connect(distGain);
        distGain.connect(this.masterVolume);
        finalDest = muffle;
      }

      osc.connect(gain);
      gain.connect(finalDest);

      osc.type = 'square';
      osc.frequency.setValueAtTime(frequency, t);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, t + duration);

      gain.gain.setValueAtTime(volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.start(t);
      osc.stop(t + duration + 0.01);
    } catch(e) { /* audio scheduling error — ignore to protect game loop */ }
  }

  // timeOffset: seconds from NOW (ctx.currentTime). Default 0 = play immediately.
  playFrictionalScrape(timeOffset, duration, volume = 0.2) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const safeOffset = (typeof timeOffset === 'number' && timeOffset < 10) ? Math.max(0, timeOffset) : 0;
      const t = this.ctx.currentTime + safeOffset;

      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(1400, t + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, t);
      gain.gain.linearRampToValueAtTime(volume * 0.5, t + duration * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterVolume);

      noise.start(t);
      noise.stop(t + duration + 0.02);
    } catch(e) { /* audio scheduling error — ignore to protect game loop */ }
  }

  playFlashbangExplosion(distance = 0) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const t = this.ctx.currentTime;
      
      // 1. Loud low-frequency explosion thump
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(10, t + 0.3);
      
      const distScale = Math.max(0.1, 1 - distance / 1100);
      oscGain.gain.setValueAtTime(0.85 * distScale, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      
      osc.connect(oscGain);
      oscGain.connect(this.masterVolume);
      osc.start(t);
      osc.stop(t + 0.4);

      // 2. High-pitched ears ringing feedback tone
      const ring = this.ctx.createOscillator();
      const ringGain = this.ctx.createGain();
      ring.type = 'sine';
      ring.frequency.setValueAtTime(4500, t);
      
      const ringVol = 0.35 * Math.max(0.01, 1 - distance / 700);
      ringGain.gain.setValueAtTime(ringVol, t);
      ringGain.gain.linearRampToValueAtTime(ringVol * 0.5, t + 1.0);
      ringGain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);
      
      ring.connect(ringGain);
      ringGain.connect(this.masterVolume);
      ring.start(t);
      ring.stop(t + 2.6);
    } catch(e) {}
  }

  playDashSound(distance = 0) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      let finalDest = this.masterVolume;
      if (distance > 0) {
        const muffle = this.ctx.createBiquadFilter();
        muffle.type = 'lowpass';
        const cutoff = Math.max(220, 3000 * (1 - Math.min(1, distance / 1200)));
        muffle.frequency.setValueAtTime(cutoff, t);

        const distGain = this.ctx.createGain();
        const scale = Math.max(0.01, 1 - distance / 1300);
        distGain.gain.setValueAtTime(scale, t);

        muffle.connect(distGain);
        distGain.connect(this.masterVolume);
        finalDest = muffle;
      }

      osc.connect(gain);
      gain.connect(finalDest);

      // Cyber/wind sweep whoosh
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.2);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.start(t);
      osc.stop(t + 0.25);
    } catch(e) {}
  }


  /**
   * Play a synthesized klaxon alarm for a specific task.
   * Each task gets its own independent audio loop — they don't cancel each other.
   * @param {string|number} taskId  - Unique task identifier
   * @param {number}        distance - Distance from listener to alarm source
   */
  playAlarmForTask(taskId, distance = 0) {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Already playing for this task? Ignore.
    if (this.taskAlarms.has(taskId)) return;

    const alarm = { intervalId: null, nodes: [], active: true };
    this.taskAlarms.set(taskId, alarm);

    const playKlaxonCycle = () => {
      if (!alarm.active || !this.ctx) return;

      // Distance-based volume and muffling
      const volScale   = Math.max(0.01, Math.pow(1 - Math.min(1, distance / 1500), 1.6));
      const muffleCutoff = Math.max(200, 3800 * Math.pow(1 - Math.min(1, distance / 1400), 1.8));

      const t = this.ctx.currentTime;

      // ── Master gain for this klaxon hit ──
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0, t);
      masterGain.gain.linearRampToValueAtTime(volScale * 0.55, t + 0.04);
      masterGain.gain.setValueAtTime(volScale * 0.55, t + 0.32);
      masterGain.gain.linearRampToValueAtTime(0, t + 0.42);

      // ── Low-pass muffle filter ──
      const muffle = this.ctx.createBiquadFilter();
      muffle.type = 'lowpass';
      muffle.frequency.setValueAtTime(muffleCutoff, t);
      muffle.Q.value = 0.9;

      // ── Two detuned oscillators for that industrial siren character ──
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(880, t);
      osc1.frequency.linearRampToValueAtTime(660, t + 0.20);
      osc1.frequency.linearRampToValueAtTime(880, t + 0.40);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1100, t);
      osc2.frequency.linearRampToValueAtTime(880, t + 0.20);
      osc2.frequency.linearRampToValueAtTime(1100, t + 0.40);

      // Mix osc2 quieter
      const oscMix2 = this.ctx.createGain();
      oscMix2.gain.value = 0.35;

      // ── Distortion (waveshaper) for metallic harshness ──
      const dist = this.ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i * 2) / 256 - 1;
        curve[i] = (Math.PI + 180) * x / (Math.PI + 180 * Math.abs(x));
      }
      dist.curve = curve;
      dist.oversample = '2x';

      // ── Wire up ──
      osc1.connect(dist);
      osc2.connect(oscMix2);
      oscMix2.connect(dist);
      dist.connect(muffle);
      muffle.connect(masterGain);
      masterGain.connect(this.masterVolume);

      // Reverb send (if built)
      if (this.reverbNode && distance < 900) {
        const reverbSend = this.ctx.createGain();
        reverbSend.gain.value = Math.max(0, 0.4 * (1 - distance / 900));
        masterGain.connect(reverbSend);
        reverbSend.connect(this.reverbNode);
      }

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.45);
      osc2.stop(t + 0.45);

      alarm.nodes.push(osc1, osc2, masterGain, muffle);
    };

    // Play immediately then loop every 600ms
    playKlaxonCycle();
    alarm.intervalId = setInterval(playKlaxonCycle, 600);
  }

  /**
   * Stop the alarm for a specific task.
   * @param {string|number} taskId
   */
  stopAlarmForTask(taskId) {
    const alarm = this.taskAlarms.get(taskId);
    if (!alarm) return;
    alarm.active = false;
    if (alarm.intervalId !== null) clearInterval(alarm.intervalId);
    alarm.nodes.forEach(n => { try { n.stop && n.stop(); } catch(e) {} });
    this.taskAlarms.delete(taskId);
  }

  /** Stop ALL task alarms immediately */
  stopAllAlarms() {
    this.taskAlarms.forEach((_, id) => this.stopAlarmForTask(id));
    this.taskAlarms.clear();
  }

  /** Play bear.mp3 looping background music for Sabotage/Imposter mode */
  playBearMusic() {
    if (!this.bearMusic) {
      this.bearMusic = new Audio('/bear.mp3');
      this.bearMusic.loop = true;
    }
    this.bearMusic.volume = this.volume;
    if (this.bearMusic.paused) {
      this.bearMusic.currentTime = 0;
      this.bearMusic.play().catch(err => console.warn('Error playing bear music:', err));
    }
  }

  /** Stop bear.mp3 background music */
  stopBearMusic() {
    if (this.bearMusic) {
      this.bearMusic.pause();
      this.bearMusic.currentTime = 0;
    }
  }
}
