const GOOGLE_ISSUERS = new Set(['accounts.google.com', 'https://accounts.google.com']);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HOSTED_DOMAIN = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/i;

function authError(code, message, status = 401) {
  return Object.assign(new Error(message), { code, status });
}

export function validateGoogleClaims(payload, clientId, now = Date.now()) {
  const invalid = () => authError('INVALID_GOOGLE_CREDENTIAL', 'Google sign-in could not be verified. Please try again.');
  if (!payload || !GOOGLE_ISSUERS.has(payload.iss) || payload.aud !== clientId ||
      (payload.azp !== undefined && payload.azp !== clientId) ||
      !Number.isFinite(payload.exp) || payload.exp <= now / 1000 ||
      !Number.isFinite(payload.iat) || payload.iat > now / 1000 + 60 || payload.iat > payload.exp ||
      typeof payload.sub !== 'string' || !payload.sub.trim() || payload.sub.length > 255 ||
      payload.email_verified !== true || typeof payload.email !== 'string' ||
      payload.email.length > 254 || !EMAIL.test(payload.email)) throw invalid();
  const email = payload.email.toLowerCase();
  const domain = email.slice(email.lastIndexOf('@') + 1);
  const workspace = typeof payload.hd === 'string' && HOSTED_DOMAIN.test(payload.hd);
  return {
    subject: payload.sub,
    email,
    emailAuthoritative: domain === 'gmail.com' || workspace,
    emailVerifiedAt: new Date(now).toISOString()
  };
}

export function createGoogleTokenVerifier(clientId, initialClient = null) {
  let client = initialClient;
  return async credential => {
    if (!client) {
      try {
        const { OAuth2Client } = await import('google-auth-library');
        client = new OAuth2Client(clientId);
      } catch {
        throw authError('GOOGLE_UNAVAILABLE', 'Google sign-in is temporarily unavailable.', 503);
      }
    }
    try {
      const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
      return ticket.getPayload();
    } catch (error) {
      // Certificate fetch failures are retryable. Never disclose verifier
      // errors, which can contain credential material or internal URLs.
      if (error?.response || ['ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND', 'EAI_AGAIN', 'ECONNREFUSED'].includes(error?.code)) {
        throw authError('GOOGLE_UNAVAILABLE', 'Google sign-in is temporarily unavailable.', 503);
      }
      throw authError('INVALID_GOOGLE_CREDENTIAL', 'Google sign-in could not be verified. Please try again.');
    }
  };
}

// GIS uses its JS popup callback and our JSON endpoint, not Google's redirect
// form POST. Require an explicit trusted Origin and JSON so cross-site forms
// cannot sign a victim into an attacker's account.
export function createGoogleAuth({ clientId = process.env.GOOGLE_CLIENT_ID || '', store, createSession, publicAccount, allowedOrigins = [], verifyIdToken, now = Date.now }) {
  const configuredClientId = String(clientId).trim();
  const origins = new Set(allowedOrigins);
  const verify = verifyIdToken || createGoogleTokenVerifier(configuredClientId);
  return {
    clientId: configuredClientId || null,
    async handle(req, res) {
      res.set('Cache-Control', 'no-store');
      if (!configuredClientId) return res.status(503).json({ error: 'GOOGLE_NOT_CONFIGURED', message: 'Google sign-in is not configured yet. Use email sign-in.' });
      if (!origins.has(req.get('Origin'))) return res.status(403).json({ error: 'UNTRUSTED_ORIGIN', message: 'Open Unpaused directly to sign in.' });
      if (!req.is('application/json')) return res.status(415).json({ error: 'JSON_REQUIRED', message: 'Google sign-in requires JSON.' });
      const credential = req.body?.credential;
      if (typeof credential !== 'string' || credential.length > 16384 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(credential)) {
        return res.status(400).json({ error: 'INVALID_GOOGLE_CREDENTIAL', message: 'A Google sign-in credential is required.' });
      }
      try {
        const payload = await verify(credential, configuredClientId);
        const identity = validateGoogleClaims(payload, configuredClientId, now());
        const user = await store.findOrCreateGoogleUser(identity);
        const session = await createSession(user.id);
        return res.json({ ...session, user: publicAccount(user) });
      } catch (error) {
        if (error?.code === 'GOOGLE_EMAIL_VERIFICATION_REQUIRED') return res.status(403).json({ error: error.code, message: 'Use email sign-in for this Google account. Google cannot currently verify ownership of this email address.' });
        if (error?.code === 'GOOGLE_ACCOUNT_CONFLICT') return res.status(409).json({ error: error.code, message: 'This email is already linked to another Google account. Use email sign-in.' });
        if (error?.code === 'INVALID_GOOGLE_CREDENTIAL') return res.status(401).json({ error: error.code, message: 'Google sign-in could not be verified. Please try again.' });
        return res.status(503).json({ error: 'GOOGLE_UNAVAILABLE', message: 'Google sign-in is temporarily unavailable. Please try again.' });
      }
    }
  };
}
