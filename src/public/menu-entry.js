// Both game menus reveal after one complete outward-and-return U cycle.
export async function waitForMenuAnimation(overlay) {
  if (!overlay) return;
  const runner = overlay.querySelector('.u-loading__runner');
  const animation = runner?.getAnimations()[0];
  const elapsed = Number(animation?.currentTime) || 0;
  await new Promise(resolve => setTimeout(resolve, Math.max(0, 4600 - elapsed)));
}
