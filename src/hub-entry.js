// Paint the same U that the destination displays while its modules load.
export function initGameEntry() {
  const links = document.querySelectorAll('#enter-worldloom, #enter-tacticstrike');
  const overlay = document.querySelector('#worldloom-transition');
  if (!links.length || !overlay) return;
  let navigating = false;
  const reset = () => { navigating = false; overlay.hidden = true; };
  window.addEventListener('pagehide', reset); // Cache the hub with its outgoing loader already cleared.
  window.addEventListener('pageshow', reset); // Back/forward cache restores the hub.
  links.forEach(link => link.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    const game = link.id === 'enter-worldloom' ? 'Worldloom' : 'TacticStrike';
    overlay.querySelector('.u-loading__title').textContent = game;
    overlay.querySelector('.u-loading__message').textContent = 'Opening the menu.';
    overlay.setAttribute('aria-label', `Opening ${game}`);
    overlay.hidden = false;
    // Allow one painted frame, then navigate without a fabricated loading delay.
    requestAnimationFrame(() => requestAnimationFrame(() => window.location.assign(link.href)));
  }));
}
