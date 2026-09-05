// Standalone games return to the Nite hub after a successful save. Keep the
// opt-in message protocol compatible with existing embedding integrations.
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
