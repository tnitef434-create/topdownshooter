// A containing window can be a browser preview. Only the TacticStrike launcher
// opts into the portal protocol; direct launches navigate back to the site.
export function saveAndReturn(save, host = window) {
  if (!save()) return false;
  const portal = new URLSearchParams(host.location.search).get('portal') === '1';
  if (portal && host.parent !== host) {
    host.parent.postMessage({source:'worldloom',type:'request-close'},host.location.origin);
  } else {
    host.location.assign(new URL('/',host.location.href).href);
  }
  return true;
}
