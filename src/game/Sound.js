export class Sound {
  constructor() {
    this.ctx = null;
    this.masterVolume = null;
    this.volume = 0.5; // default 50%
    
    // Create pre-baked noise buffer for efficiency
    this.noiseBuffer = null;
  }

  init() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    this.ctx = new AudioContextClass();
    this.masterVolume = this.ctx.createGain();
    this.masterVolume.gain.value = this.volume;
    this.masterVolume.connect(this.ctx.destination);
    
    // Generate white noise buffer
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  setVolume(volume) {
    this.volume = volume;
    if (this.masterVolume) {
      this.masterVolume.gain.value = volume;
    }
  }

  playGunshot(weaponType) {
    this.init();
    if (!this.ctx) return;
    
    // Resume context if suspended (browser security)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    
    // 1. Noise Source (High frequencies & explosion body)
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    const noiseGain = this.ctx.createGain();

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterVolume);

    // 2. Sine Sweep Source (Low-frequency punch)
    const punch = this.ctx.createOscillator();
    const punchGain = this.ctx.createGain();
    
    punch.connect(punchGain);
    punchGain.connect(this.masterVolume);

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
        noiseFilterFreq = 500;
        noiseDecay = 0.35;
        noiseVol = 0.9;
        punchStartFreq = 120;
        punchEndFreq = 30;
        punchDecay = 0.25;
        punchVol = 0.9;
        
        // Add a secondary crackle for shotgun spread
        this.playMetallicClick(t + 0.05, 800, 0.08);
        this.playMetallicClick(t + 0.1, 600, 0.05);
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
    }

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
  playMetallicClick(timeOffset, frequency, duration, volume = 0.3) {
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

      osc.connect(gain);
      gain.connect(this.masterVolume);

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
}
