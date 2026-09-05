import './operative-account-hint.css';

export function initOperativeAccountHint() {
  const trigger = document.getElementById('operative-account');
  const hint = document.getElementById('operative-account-hint');
  if (!trigger || !hint) return;

  const isOpen = () => hint.matches(':popover-open');
  function positionHint() {
    if (!isOpen()) return;
    const anchor = trigger.getBoundingClientRect();
    const box = hint.getBoundingClientRect();
    const beside = anchor.right + box.width + 24 <= innerWidth;
    const left = beside ? anchor.right + 12 : anchor.right - box.width;
    const top = beside ? anchor.top - 6 : anchor.bottom + 10;
    hint.style.left = `${Math.max(12, Math.min(left, innerWidth - box.width - 12))}px`;
    hint.style.top = `${Math.max(12, Math.min(top, innerHeight - box.height - 12))}px`;
  }
  function closeHint({ restoreFocus = false } = {}) {
    if (isOpen()) hint.hidePopover();
    if (restoreFocus) trigger.focus({ preventScroll: true });
  }

  // Native light-dismiss also fires beforetoggle: every dismissal resets the U,
  // including outside clicks, Escape and opening another popover.
  hint.addEventListener('beforetoggle', event => {
    trigger.setAttribute('aria-expanded', String(event.newState === 'open'));
    if (event.newState === 'open') requestAnimationFrame(() => {
      if (isOpen()) {
        positionHint();
        hint.querySelector('.operative-account-link').focus({ preventScroll: true });
      }
    });
  });
  hint.querySelector('.operative-account-close').addEventListener('click', () => closeHint({ restoreFocus: true }));
  hint.querySelector('[data-open-account]').addEventListener('click', () => closeHint({ restoreFocus: true }));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !isOpen()) return;
    event.preventDefault();
    event.stopPropagation();
    closeHint({ restoreFocus: true });
  }, true);
  document.addEventListener('scroll', positionHint, true);
  window.addEventListener('resize', positionHint);
  window.addEventListener('pagehide', () => closeHint());
}
