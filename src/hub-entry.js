// Paint the same U that the destination displays while its modules load.
export function initWorldloomEntry() {
  const link = document.querySelector('#enter-worldloom');
  const overlay = document.querySelector('#worldloom-transition');
  if (!link || !overlay) return;
  let navigating = false;
  const reset = () => { navigating = false; overlay.hidden = true; };
  window.addEventListener('pageshow', reset); // Back/forward cache restores the hub.
  link.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    overlay.hidden = false;
    // Allow one painted frame, then navigate without a fabricated loading delay.
    requestAnimationFrame(() => requestAnimationFrame(() => window.location.assign(link.href)));
  });
}
