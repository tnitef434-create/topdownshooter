// Keep these keys so existing TacticStrike accounts stay signed in on Unpaused.
export const ACCOUNT_SESSION_KEY = 'tacticstrike_account_session';
export const ACCOUNT_USER_CACHE_KEY = 'tacticstrike_account_user';

export function readAccountSession() {
  try {
    const token = localStorage.getItem(ACCOUNT_SESSION_KEY);
    let cached=null;
    try {cached=JSON.parse(localStorage.getItem(ACCOUNT_USER_CACHE_KEY)||'null');} catch { /* Restore from the server when the cache is damaged. */ }
    return { token, user: token && typeof cached?.email === 'string' ? cached : null };
  } catch { return { token: null, user: null }; }
}

export function storeAccountSession(session) {
  // Do not report success if the browser cannot retain the sign-in.
  if(typeof session?.token!=='string'||!session.token||typeof session?.user?.email!=='string')throw new Error('Invalid account response');
  const user=JSON.stringify(session.user);
  const previousToken=localStorage.getItem(ACCOUNT_SESSION_KEY),previousUser=localStorage.getItem(ACCOUNT_USER_CACHE_KEY);
  try {
    if(previousToken!==session.token)localStorage.setItem(ACCOUNT_SESSION_KEY,session.token);
    if(previousUser!==user)localStorage.setItem(ACCOUNT_USER_CACHE_KEY,user);
  } catch(error) {
    // Avoid pairing a new token with somebody else's cached profile on quota failure.
    for(const [key,value] of [[ACCOUNT_SESSION_KEY,previousToken],[ACCOUNT_USER_CACHE_KEY,previousUser]]){
      try {if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);} catch {try {localStorage.removeItem(key);} catch {}}
    }
    throw error;
  }
}

export function removeAccountSession() {
  try {
    localStorage.removeItem(ACCOUNT_SESSION_KEY);
    localStorage.removeItem(ACCOUNT_USER_CACHE_KEY);
  } catch { /* The in-memory session is still cleared by the caller. */ }
}

export function getBackendUrl() {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return location.port === '3000' ? location.origin : 'http://localhost:3000';
  }
  return location.hostname.endsWith('onrender.com') ? location.origin : 'https://topdownshooter.onrender.com';
}

export async function accountRequest(path, {token, ...options} = {}) {
  const headers = {'Content-Type':'application/json', ...options.headers};
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${getBackendUrl()}${path}`, {...options,headers,signal:options.signal || AbortSignal.timeout(20000)});
  } catch {
    throw new Error('Could not reach the account service. Please try again.');
  }
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok || (response.status !== 204 && !body)) {
    const error = new Error(body?.message || 'The account service could not complete this request.');
    error.status = response.status;
    error.code = body?.error;
    throw error;
  }
  return body;
}
