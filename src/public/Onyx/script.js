// Onyx website: detects the visitor's OS for the main download button, fetches the
// latest version from GitHub, and adds small scroll effects.
(() => {
  const REPO = 'tnitef434-create/AIHelp';
  const BASE = `https://github.com/${REPO}/releases/latest/download/`;
  const PLATFORMS = {
    windows: { name: 'Windows', file: 'Onyx-Setup.exe', note: 'Windows 10 & 11 · 64-bit',
      icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 5.5 10.5 4.5v7H3zM11.5 4.3 21 3v8.5h-9.5zM3 12.5h7.5v7L3 18.5zM11.5 12.5H21V21l-9.5-1.3z"/></svg>' },
    mac: { name: 'macOS', file: 'Onyx.dmg', note: 'Apple Silicon & Intel',
      icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.8-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.5 0 2 .8 3.3.8 1.4 0 2.3-1.2 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.8-1.1-2.8-4.2zM13.9 5.2c.7-.8 1.2-2 1-3.2-1 .1-2.2.7-3 1.5-.6.7-1.2 1.9-1 3.1 1.1.1 2.2-.6 3-1.4z"/></svg>' },
    linux: { name: 'Linux', file: 'Onyx.AppImage', note: 'AppImage · 64-bit',
      icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c-2.2 0-3.6 1.9-3.6 4.6 0 1.4.3 2.3-.4 3.5-.8 1.3-2.9 3.9-2.9 6.6 0 .8.2 1.5.5 2-.7.4-1.6.6-1.6 1.4 0 1 1.6 1 2.7 1.3 1.2.3 2 1 3 1 .9 0 1.4-.6 2.2-.7h2.2c.8.1 1.3.7 2.2.7 1 0 1.8-.7 3-1 1.1-.3 2.7-.3 2.7-1.3 0-.8-.9-1-1.6-1.4.3-.5.5-1.2.5-2 0-2.7-2.1-5.3-2.9-6.6-.7-1.2-.4-2.1-.4-3.5C15.6 3.9 14.2 2 12 2z"/></svg>' },
  };

  function detectOS() {
    const ua = navigator.userAgent || '';
    const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
    if (/android|iphone|ipad|ipod/i.test(ua)) return null; // phones: show all platforms instead
    if (/win/i.test(platform) || /windows/i.test(ua)) return 'windows';
    if (/mac/i.test(platform) || /mac os x/i.test(ua)) return 'mac';
    if (/linux|x11|cros/i.test(platform + ua)) return 'linux';
    return null;
  }

  const os = detectOS();
  if (os) {
    const p = PLATFORMS[os];
    const primary = document.getElementById('primaryDownload');
    primary.href = BASE + p.file;
    document.getElementById('primaryLabel').textContent = `Download for ${p.name}`;
    document.getElementById('primaryIcon').innerHTML = p.icon;
    document.getElementById('primaryNote').textContent = `Free · ${p.note} · Also on ${Object.values(PLATFORMS).filter((x) => x !== p).map((x) => x.name).join(' & ')}`;
    const cta = document.getElementById('ctaDownload');
    cta.href = BASE + p.file; cta.textContent = `Download for ${p.name}`;
    const card = document.querySelector(`.dl[data-os="${os}"]`);
    if (card) card.classList.add('recommended');
  }

  // Show the real latest version number (falls back to the one in the page).
  fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
    .then((r) => (r.ok ? r.json() : null))
    .then((rel) => { if (rel && rel.tag_name) document.getElementById('version').textContent = rel.tag_name.replace(/^v/, ''); })
    .catch(() => {});

  // Nav background once scrolled.
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // Fade sections in as they scroll into view.
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 70}ms`;
    if (io) io.observe(el); else el.classList.add('in');
  });

  // Spotlight that follows the cursor on feature cards.
  document.querySelectorAll('.feature').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
})();
