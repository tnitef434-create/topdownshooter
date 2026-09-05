// A separate title track keeps the supplied menu theme out of the gameplay mix.
export class MenuMusic {
  constructor() {
    this.element = document.createElement('audio');
    this.element.id = 'menu-theme';
    this.element.src = new URL('../assets/music/overworld-greenery.mp3', import.meta.url).href;
    this.element.preload = 'none';
    this.element.loop = true;
    this.element.volume = 0;
    document.body.append(this.element);
    this.active = false;
    this.level = 0;
    this.volume = .72 * .28 * .65;
    this.frame = 0;
    this.lastTime = 0;
    this.pending = null;
    // Autoplay is attempted on entry; blocked browsers retry on a real gesture.
    for (const event of ['pointerdown', 'keydown']) {
      document.addEventListener(event, () => this.sync(), {passive:true});
    }
    document.addEventListener('visibilitychange', () => this.sync());
    window.addEventListener('pagehide', () => this.stop());
    window.addEventListener('pageshow', () => this.sync());
  }

  setSettings(settings) {
    this.volume = settings.musicEnabled === false ? 0
      : Math.max(0, Math.min(1, Number(settings.volume ?? .72)))
        * Math.max(0, Math.min(1, Number(settings.musicVolume ?? .28))) * .65;
    this.sync();
  }

  setActive(active) {
    this.active = Boolean(active);
    this.sync();
  }

  shouldPlay() {
    return this.active && !document.hidden && this.volume > .0001;
  }

  stop() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.level = 0;
    this.element.volume = 0;
    this.element.pause();
  }

  sync() {
    if (document.hidden) { this.stop(); return; }
    if (this.shouldPlay() && this.element.paused && !this.pending) {
      this.pending = this.element.play().then(() => {
        if (!this.shouldPlay()) this.stop();
        else this.animate();
      }).catch(() => {
        // Leave the menu usable and retry on the next gesture.
      }).finally(() => { this.pending = null; });
    }
    if (!this.element.paused) this.animate();
  }

  animate() {
    if (this.frame) return;
    this.lastTime = performance.now();
    const tick = now => {
      this.frame = 0;
      const dt = Math.min(.1, (now - this.lastTime) / 1000);
      this.lastTime = now;
      const target = this.shouldPlay() ? this.volume : 0;
      this.level += (target - this.level) * (1 - Math.exp(-dt * 5));
      const {currentTime, duration} = this.element;
      // Feather the two ends of the original recording without re-encoding it.
      const seam = Number.isFinite(duration)
        ? Math.max(0, Math.min(1, currentTime / .8, (duration - currentTime) / 1.25)) : 1;
      this.element.volume = Math.max(0, Math.min(1, this.level * seam));
      if (!target && this.level < .0005) { this.stop(); return; }
      if (!this.element.paused) this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }
}
