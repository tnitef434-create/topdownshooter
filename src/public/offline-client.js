(() => {
  const state = window.__unpausedOffline = { ready: false, status: 'preparing', version: null };
  let registration, retry, requesting = false;
  function render() {
    const offline = navigator.onLine === false;
    document.querySelectorAll('[data-offline-status]').forEach(element => {
      element.hidden = false;
      element.textContent = state.ready
        ? (offline ? 'Offline · local worlds are ready to play. Shared worlds need a connection.' : 'Offline play ready on this browser.')
        : (state.status === 'unavailable' ? 'Offline files are not ready yet. Keep this tab open and reconnect to finish.' : 'Preparing offline play… You can start playing while files are saved.');
    });
    window.dispatchEvent(new CustomEvent('unpaused:offline-status', { detail: { ...state, offline } }));
  }
  function query() { (navigator.serviceWorker.controller || registration?.active)?.postMessage({ type: 'UNPAUSED_OFFLINE_STATUS', repair: navigator.onLine !== false }); }
  function watch(worker) {
    worker?.addEventListener('statechange', () => {
      if (worker.state === 'activated') query();
      if (worker.state === 'redundant' && !state.ready) { state.status = 'unavailable'; render(); }
    });
  }
  async function register() {
    if (requesting || navigator.onLine === false) return;
    requesting = true;
    try {
      registration = await navigator.serviceWorker.register('/offline-worker.js', { scope: '/', updateViaCache: 'none' });
      watch(registration.installing);
      registration.addEventListener('updatefound', () => watch(registration.installing));
      query();
    } catch { if (!state.ready) { state.status = 'unavailable'; render(); } }
    finally { requesting = false; }
  }
  if (!('serviceWorker' in navigator) || !window.isSecureContext) { state.status = 'unavailable'; render(); return; }
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type !== 'UNPAUSED_OFFLINE_STATUS') return;
    state.ready = event.data.ready === true; state.version = event.data.version;
    state.status = state.ready ? 'ready' : 'unavailable'; render();
    if (!state.ready && !retry) retry = setInterval(() => { register(); query(); }, 60000);
    if (state.ready) { clearInterval(retry); retry = null; }
  });
  navigator.serviceWorker.addEventListener('controllerchange', query);
  window.addEventListener('online', () => { render(); register(); query(); });
  window.addEventListener('offline', render);
  window.addEventListener('pageshow', query);
  // Start after the critical modules parse; a stalled decorative image must not
  // prevent the browser from ever preparing the offline game.
  if (document.readyState !== 'loading') register(); else window.addEventListener('DOMContentLoaded', register, { once: true });
  retry = setInterval(() => { if (!state.ready) register(); }, 60000);
  navigator.serviceWorker.ready.then(value => { registration = value; query(); }).catch(() => {});
  render();
})();
