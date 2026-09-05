import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import { promisify } from 'util';
import { createAccountStore, isAccountSessionActive } from './accountStore.js';
import { createAccountMailer } from './accountEmail.js';
import { createGoogleAuth } from './google-auth.js';
import { normalizeUsername, accountPlayerName } from './accountUsername.js';
import { installShooterAccountIdentity } from './shooterAccountIdentity.js';
import { createShooterRoomRecovery, SHOOTER_SOCKET_OPTIONS } from './shooterRoomRecovery.js';
import { createWorldStore } from './worldStore.js';
import { installWorldServer } from './worldServer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scryptAsync = promisify(crypto.scrypt);

const ADMIN_SESSION_LIFETIME_MS = 1000 * 60 * 60 * 8;
const MAX_PROOF_BYTES = 1_500_000;
const ADMIN_USERNAME = String(process.env.ADMIN_USERNAME || '').trim();
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || '');
const adminSessions = new Map();
const CREDIT_PACKAGES = Object.freeze({
  '50': {
    credits: 50,
    amount: 99,
    checkoutUrl: process.env.REVOLUT_50_CREDIT_LINK || 'https://checkout.revolut.com/payment-link/7ee65845-014a-4590-b0ec-010becb401c2'
  },
  '500': {
    credits: 500,
    amount: 499,
    checkoutUrl: process.env.REVOLUT_500_CREDIT_LINK || 'https://checkout.revolut.com/pay/c8f54521-09a0-423c-aca8-6fde93d57a63'
  }
});
const accountStore = createAccountStore({
  databaseUrl: process.env.DATABASE_URL || '',
  localFile: process.env.LOCAL_ACCOUNT_DATABASE_FILE || path.join(__dirname, 'accounts.json')
});
const requirePersistentAccountStore = process.env.RENDER === 'true' || process.env.NODE_ENV === 'production';
const accountMailer = createAccountMailer();
const worldStore = createWorldStore({
  databaseUrl: process.env.DATABASE_URL || '',
  localFile: process.env.LOCAL_WORLD_DATABASE_FILE || path.join(__dirname, 'worlds.json'),
});

function constantTimeTextEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function isAdminConfigured() {
  return ADMIN_USERNAME.length >= 3 && ADMIN_PASSWORD.length >= 8;
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

function normalizeMessage(value = '') {
  return String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

function normalizeProof(value) {
  if (!value) return { proofName: null, proofMime: null, proofData: null };
  const proofName = String(value.name || '').replace(/[^a-zA-Z0-9._ -]/g, '').trim().slice(0, 100);
  const proofData = String(value.data || '');
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(proofData);
  if (!match) {
    const error = new Error('Upload a PNG, JPG, or WebP receipt image.');
    error.code = 'INVALID_PROOF';
    throw error;
  }
  const decodedSize = Buffer.from(match[2], 'base64').length;
  if (!decodedSize || decodedSize > MAX_PROOF_BYTES) {
    const error = new Error('Receipt images must be smaller than 1.5 MB.');
    error.code = 'PROOF_TOO_LARGE';
    throw error;
  }
  return {
    proofName: proofName || 'purchase-proof',
    proofMime: match[1],
    proofData
  };
}

function createPurchaseMessage({ caseId, senderRole, body = '', proof = null }) {
  const normalizedBody = normalizeMessage(body);
  if (normalizedBody.length > 1500) {
    const error = new Error('Messages can be up to 1,500 characters.');
    error.code = 'MESSAGE_TOO_LONG';
    throw error;
  }
  const normalizedProof = normalizeProof(proof);
  if (!normalizedBody && !normalizedProof.proofData) {
    const error = new Error('Add a message or receipt image.');
    error.code = 'EMPTY_MESSAGE';
    throw error;
  }
  return {
    id: crypto.randomUUID(),
    caseId,
    senderRole,
    body: normalizedBody,
    ...normalizedProof,
    createdAt: new Date().toISOString()
  };
}

function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

async function createPasswordRecord(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);
  return { algorithm: 'scrypt', salt, hash: Buffer.from(derivedKey).toString('hex') };
}

async function verifyPassword(password, record) {
  if (!record?.salt || !record?.hash) return false;
  const derivedKey = Buffer.from(await scryptAsync(password, record.salt, 64));
  const storedKey = Buffer.from(record.hash, 'hex');
  return derivedKey.length === storedKey.length && crypto.timingSafeEqual(derivedKey, storedKey);
}

function hashSessionToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function publicAccount(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: accountPlayerName(user),
    username: user.username || null,
    emailVerified: Boolean(user.emailVerifiedAt),
    friendCode: user.friendCode || null,
    credits: user.credits || 0,
    provider: 'email',
    createdAt: user.createdAt
  };
}

async function createSession(userId, expectedPassword = null) {
  const token = crypto.randomBytes(32).toString('base64url');
  const issued = await accountStore.createSession(hashSessionToken(token), userId, null, expectedPassword);
  if (!issued) return null;
  return { token, expiresAt: null };
}

function ensureAccountStoreAvailable(res) {
  if (!accountStore.isReady) {
    res.status(503).json({ error: 'ACCOUNT_DATABASE_UNAVAILABLE', message: 'The account database is temporarily unavailable.' });
    return false;
  }
  if (requirePersistentAccountStore && !accountStore.isPersistent) {
    res.status(503).json({ error: 'ACCOUNT_DATABASE_NOT_CONFIGURED', message: 'Persistent account storage is being configured. Please try again soon.' });
    return false;
  }
  return true;
}

function requireAccountStore(req, res, next) {
  if (ensureAccountStoreAvailable(res)) next();
}

function requireVerifiedEmail(req, res, next) {
  if (!req.account.emailVerifiedAt) return res.status(403).json({error:'EMAIL_VERIFICATION_REQUIRED',message:'Verify your email on Unpaused to continue.'});
  next();
}

async function sendAccountVerification(user) {
  if (user.emailVerifiedAt) return;
  if (!accountMailer.configured) throw Object.assign(new Error('Email verification is being configured. Please try again soon.'),{code:'EMAIL_UNAVAILABLE'});
  const token=crypto.randomBytes(32).toString('base64url');
  if (!await accountStore.reserveEmailVerification(user.id, hashSessionToken(token), Date.now()+30*60*1000)) return;
  await accountMailer.sendVerification(user.email,token);
}

const verificationMessage='Check your inbox for a verification link. If you already have an active account, sign in instead.';
const passwordResetMessage='If an active account uses that email, a password reset link will arrive shortly. You can request another link after one minute.';

async function authenticateAccount(req, res, next) {
  try {
    if (!ensureAccountStoreAvailable(res)) return;
    const authorization = req.get('authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    const sessionKey = token ? hashSessionToken(token) : '';
    const session = sessionKey ? await accountStore.findSession(sessionKey) : null;
    const user = session ? await accountStore.findUserById(session.userId) : null;

    if (!isAccountSessionActive(session) || !user) {
      if (sessionKey && session) await accountStore.deleteSession(sessionKey);
      res.status(401).json({ error: 'SIGN_IN_REQUIRED', message: 'Sign in to continue.' });
      return;
    }

    req.account = user;
    req.sessionKey = sessionKey;
    next();
  } catch (error) {
    console.error('Account authentication failed:', error);
    res.status(503).json({ error: 'ACCOUNT_DATABASE_UNAVAILABLE', message: 'The account database is temporarily unavailable.' });
  }
}

function authenticateAdmin(req, res, next) {
  if (!isAdminConfigured()) {
    res.status(503).json({ error: 'ADMIN_NOT_CONFIGURED', message: 'Admin access has not been configured on the server.' });
    return;
  }
  const authorization = req.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const session = token ? adminSessions.get(hashSessionToken(token)) : null;
  if (!session || session.expiresAt <= Date.now()) {
    if (token) adminSessions.delete(hashSessionToken(token));
    res.status(401).json({ error: 'ADMIN_SIGN_IN_REQUIRED', message: 'Admin authentication is required.' });
    return;
  }
  req.adminSessionKey = hashSessionToken(token);
  next();
}

const authAttempts = new Map();
function authRateLimit(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  for (const [address, attempt] of authAttempts) if (attempt.resetAt <= now) authAttempts.delete(address);
  if (!authAttempts.has(key) && authAttempts.size >= 10000) return res.status(429).json({error:'TOO_MANY_ATTEMPTS',message:'Please try again shortly.'});
  const current = authAttempts.get(key);
  const record = !current || current.resetAt <= now ? { count: 0, resetAt: now + 15 * 60 * 1000 } : current;
  record.count += 1;
  authAttempts.set(key, record);
  if (record.count > 25) {
    res.status(429).json({ error: 'TOO_MANY_ATTEMPTS', message: 'Too many sign-in attempts. Try again later.' });
    return;
  }
  next();
}

// In-memory Users database and persistent file storage
let users = {};
const USERS_FILE = process.env.LOCAL_USERS_DATABASE_FILE || path.join(__dirname, 'users.json');

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      users = JSON.parse(data || '{}');
      console.log(`Loaded ${Object.keys(users).length} registered operatives.`);
    } else {
      users = {};
      fs.writeFileSync(USERS_FILE, '{}', 'utf8');
    }
  } catch (e) {
    console.error("Failed to load users database:", e);
    users = {};
  }
}

function saveUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {
    console.error("Failed to save users database:", e);
  }
}

loadUsers();

// Socket session registry mapping socket ID to authenticated user key
const socketToUser = new Map();

const app = express();
const httpServer = createServer(app);
app.set('trust proxy', 1);
// Account/game endpoints use JSON bodies and do not need nested query parsing.
app.set('query parser', 'simple');

// Configure Socket.io with CORS enabled for local development
const io = new Server(httpServer, {
  ...SHOOTER_SOCKET_OPTIONS,
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

const configuredOrigins = (process.env.ALLOWED_ORIGINS || 'https://tacticstrike.nl,https://www.tacticstrike.nl,http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
// Keep existing deployments working while the hub moves to its own domain.
configuredOrigins.push('https://unpaused.online', 'https://www.unpaused.online');
const googleAuth = createGoogleAuth({ store: accountStore, createSession, publicAccount, allowedOrigins: configuredOrigins });

app.use((req, res, next) => {
  const origin = req.get('origin');
  if (origin && configuredOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }
  if (req.method === 'OPTIONS') {
    res.sendStatus(origin && configuredOrigins.includes(origin) ? 204 : 403);
    return;
  }
  next();
});
app.use(express.json({ limit: '3mb' }));
installWorldServer({app,io,store:worldStore,accounts:accountStore,authenticate:authenticateAccount,verified:requireVerifiedEmail,hashToken:hashSessionToken,rateLimit:authRateLimit});
app.use('/api/auth', (req,res,next)=>{res.setHeader('Cache-Control','no-store');next();});

app.get('/api/auth/status', (req, res) => {
  const persistent = accountStore.isPersistent;
  res.json({
    available: accountStore.isReady && (!requirePersistentAccountStore || persistent),
    persistent,
    storage: persistent ? 'postgresql' : 'local-development',
    persistentSessions: true,
    accountUsernames: true,
    googleClientId: googleAuth.clientId,
    revision: /^[a-f0-9]{40}$/i.test(process.env.RENDER_GIT_COMMIT || '') ? process.env.RENDER_GIT_COMMIT : null,
    emailVerification:accountMailer.configured
  });
});

app.post('/api/auth/google', requireAccountStore, authRateLimit, googleAuth.handle);

app.post('/api/auth/register', requireAccountStore, authRateLimit, async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);

    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'INVALID_EMAIL', message: 'Enter a valid email address.' });
      return;
    }
    if (!accountMailer.configured) return res.status(503).json({error:'EMAIL_UNAVAILABLE',message:'Email verification is being configured. Please try again soon.'});
    const existing = await accountStore.findUserByEmail(email);
    if (existing) {
      // Email ownership establishes the final password; a pending signup cannot squat another person's address.
      if (!existing.emailVerifiedAt) await sendAccountVerification(existing);
      return res.status(202).json({verificationRequired:true,message:verificationMessage});
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    // Only the inbox owner chooses a password or claims a username after verification.
    // Ignore values supplied by older clients or somebody preregistering another address.
    const user = await accountStore.createUser({
      id,
      email,
      displayName: 'Guest',
      username: null,
      password: await createPasswordRecord(crypto.randomBytes(48).toString('base64url')),
      credits: 0,
      purchasedWeapons: [],
      createdAt: now,
      updatedAt: now
    });
    await sendAccountVerification(user);
    res.status(202).json({verificationRequired:true,message:verificationMessage});
  } catch (error) {
    if (['INVALID_USERNAME','USERNAME_TAKEN'].includes(error?.code)) return res.status(error.code==='USERNAME_TAKEN'?409:400).json({error:error.code,message:error.message});
    if (error?.code === 'DUPLICATE_EMAIL') {
      res.status(202).json({verificationRequired:true,message:verificationMessage});
      return;
    }
    if (error?.code === 'EMAIL_UNAVAILABLE' || error?.code === 'EMAIL_DELIVERY_FAILED') return res.status(503).json({error:'EMAIL_UNAVAILABLE',message:'Verification email could not be sent. Please try again in a minute.'});
    console.error('Account registration failed:', error.code || 'DATABASE_ERROR');
    res.status(500).json({ error: 'REGISTER_FAILED', message: 'Account creation is temporarily unavailable.' });
  }
});

app.post('/api/auth/login', requireAccountStore, authRateLimit, async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || '');
    if (!isValidEmail(email)||password.length>128) return res.status(401).json({error:'INVALID_CREDENTIALS',message:'Incorrect email or password.'});
    const user = await accountStore.findUserByEmail(email);
    // Local account records can change while scrypt is running. Retain the exact
    // credential checked here and require it again when the session is issued.
    const verifiedPassword = user?.password ? {...user.password} : null;
    if (!user || !(await verifyPassword(password, verifiedPassword))) {
      res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Incorrect email or passcode.' });
      return;
    }
    if (!user.emailVerifiedAt) {
      await sendAccountVerification(user);
      return res.status(202).json({verificationRequired:true,message:'Check your inbox and verify your email before signing in. You can request another link after one minute.'});
    }
    const session = await createSession(user.id, verifiedPassword);
    if (!session) return res.status(401).json({error:'INVALID_CREDENTIALS',message:'Incorrect email or password.'});
    res.json({ ...session, user: publicAccount(user) });
  } catch (error) {
    if (error?.code === 'EMAIL_UNAVAILABLE' || error?.code === 'EMAIL_DELIVERY_FAILED') return res.status(503).json({error:'EMAIL_UNAVAILABLE',message:'Verification email could not be sent. Please try again in a minute.'});
    console.error('Account login failed:', error.code || 'DATABASE_ERROR');
    res.status(500).json({ error: 'LOGIN_FAILED', message: 'Sign-in is temporarily unavailable.' });
  }
});

app.get('/api/auth/me', authenticateAccount, (req, res) => {
  res.json({ user: publicAccount(req.account) });
});

app.post('/api/auth/username', authenticateAccount, requireVerifiedEmail, authRateLimit, async(req,res)=>{
  try {
    const user=await accountStore.setUsername(req.account.id,req.body?.username);
    if(!user)return res.status(401).json({error:'INVALID_SESSION',message:'Please sign in again.'});
    res.json({user:publicAccount(user)});
  } catch(error) {
    if(['INVALID_USERNAME','USERNAME_TAKEN'].includes(error?.code))return res.status(error.code==='USERNAME_TAKEN'?409:400).json({error:error.code,message:error.message});
    res.status(503).json({error:'USERNAME_UNAVAILABLE',message:'Your username could not be saved. Please try again.'});
  }
});

app.post('/api/auth/verify-email', requireAccountStore, authRateLimit, async (req,res)=>{
  try {
    const token=String(req.body?.token||''), password=String(req.body?.password||'');
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)||password.length<8||password.length>128) return res.status(400).json({error:'INVALID_VERIFICATION',message:'This link is invalid or expired. Request a new verification email.'});
    const hash=hashSessionToken(token);
    const verification=await accountStore.findEmailVerification(hash);
    const user=verification&&verification.expiresAt>Date.now()?await accountStore.findUserById(verification.userId):null;
    if (!user) return res.status(400).json({error:'INVALID_VERIFICATION',message:'This link is invalid or expired. Request a new verification email.'});
    const verified=await accountStore.consumeEmailVerification(hash,await createPasswordRecord(password));
    if (!verified) return res.status(400).json({error:'INVALID_VERIFICATION',message:'This link has already been used or expired.'});
    const session=await createSession(verified.id);
    res.json({...session,user:publicAccount(verified)});
  } catch(error) {
    console.error('Email verification failed:',error.code||'DATABASE_ERROR');
    res.status(503).json({error:'VERIFICATION_FAILED',message:'Verification is temporarily unavailable. Please try again.'});
  }
});

app.post('/api/auth/password-reset/request', requireAccountStore, authRateLimit, async(req,res)=>{
  const email=normalizeEmail(req.body?.email);
  if (!isValidEmail(email)) return res.status(400).json({error:'INVALID_EMAIL',message:'Enter a valid email address.'});
  // Reply before account lookup or email delivery: existence, per-account throttling,
  // and delivery failures must not change the response or reveal the account by latency.
  res.status(202).json({message:passwordResetMessage});
  try {
    if (!accountMailer.configured) return;
    const user=await accountStore.findUserByEmail(email);
    if (!user?.emailVerifiedAt) return;
    const token=crypto.randomBytes(32).toString('base64url');
    if (!await accountStore.reservePasswordReset(user.id,hashSessionToken(token),Date.now()+30*60*1000)) return;
    await accountMailer.sendPasswordReset(user.email,token);
  } catch(error) {
    console.error('Password reset email failed:',error.code||'DELIVERY_ERROR');
  }
});

app.post('/api/auth/password-reset/confirm', requireAccountStore, authRateLimit, async(req,res)=>{
  try {
    const token=String(req.body?.token||''), password=String(req.body?.password||'');
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return res.status(400).json({error:'INVALID_PASSWORD_RESET',message:'This reset link is invalid or expired. Request a new reset email.'});
    if (password.length<8||password.length>128) return res.status(400).json({error:'INVALID_PASSWORD',message:'Password must be between 8 and 128 characters.'});
    const hash=hashSessionToken(token);
    const reset=await accountStore.findPasswordReset(hash);
    if (!reset||reset.expiresAt<=Date.now()) return res.status(400).json({error:'INVALID_PASSWORD_RESET',message:'This reset link is invalid or expired. Request a new reset email.'});
    const user=await accountStore.consumePasswordReset(hash,await createPasswordRecord(password));
    if (!user) return res.status(400).json({error:'INVALID_PASSWORD_RESET',message:'This reset link has already been used or expired. Request a new reset email.'});
    res.json({message:'Password updated. Sign in with your new password.'});
  } catch(error) {
    console.error('Password reset failed:',error.code||'DATABASE_ERROR');
    res.status(503).json({error:'PASSWORD_RESET_FAILED',message:'Your password could not be updated. Please try again.'});
  }
});

app.post('/api/auth/resend-verification', authenticateAccount, authRateLimit, async(req,res)=>{
  try {await sendAccountVerification(req.account);res.json({message:'Check your inbox. You can request another link after one minute.'});}
  catch(error) {res.status(503).json({error:'EMAIL_UNAVAILABLE',message:'Verification email could not be sent. Please try again later.'});}
});

app.post('/api/auth/friend-code', authenticateAccount, requireVerifiedEmail, authRateLimit, async(req,res)=>{
  try {res.json({user:publicAccount(await accountStore.generateFriendCode(req.account.id))});}
  catch(error) {res.status(503).json({error:'FRIEND_CODES_UNAVAILABLE',message:'A friend code is not available right now. Please try again later.'});}
});

app.post('/api/auth/logout', authenticateAccount, async (req, res) => {
  try {
    await accountStore.deleteSession(req.sessionKey);
    res.sendStatus(204);
  } catch (error) {
    console.error('Account logout failed:', error);
    res.status(503).json({ error: 'ACCOUNT_DATABASE_UNAVAILABLE', message: 'Sign-out could not be completed.' });
  }
});

app.post('/api/credits/checkout', authenticateAccount, requireVerifiedEmail, async (req, res) => {
  try {
    const packageId = String(req.body?.packageId || '');
    const creditPackage = CREDIT_PACKAGES[packageId];
    if (!creditPackage) {
      res.status(400).json({ error: 'PACKAGE_UNAVAILABLE', message: 'That credit package is not available yet.' });
      return;
    }

    const intentId = crypto.randomUUID();
    await accountStore.createPurchaseIntent({
      id: intentId,
      userId: req.account.id,
      packageId,
      credits: creditPackage.credits,
      amount: creditPackage.amount,
      currency: 'EUR',
      status: 'checkout_opened',
      createdAt: new Date().toISOString()
    });
    res.json({ checkoutUrl: creditPackage.checkoutUrl, intentId });
  } catch (error) {
    console.error('Credit checkout creation failed:', error);
    res.status(503).json({ error: 'CHECKOUT_UNAVAILABLE', message: 'Checkout is temporarily unavailable.' });
  }
});

async function loadPurchaseCaseDetail(purchaseCase) {
  if (!purchaseCase) return null;
  return {
    ...purchaseCase,
    messages: await accountStore.listPurchaseMessages(purchaseCase.id)
  };
}

app.get('/api/purchase-support/cases', authenticateAccount, async (req, res) => {
  try {
    const cases = await accountStore.listPurchaseCasesForUser(req.account.id);
    res.json({ cases, user: publicAccount(req.account) });
  } catch (error) {
    console.error('Purchase support list failed:', error);
    res.status(503).json({ error: 'SUPPORT_UNAVAILABLE', message: 'Purchase support is temporarily unavailable.' });
  }
});

app.post('/api/purchase-support/cases', authenticateAccount, async (req, res) => {
  try {
    const orderNumber = normalizeMessage(req.body?.orderNumber);
    const packageId = String(req.body?.packageId || '50');
    const creditPackage = CREDIT_PACKAGES[packageId];
    if (orderNumber.length < 3 || orderNumber.length > 100) {
      res.status(400).json({ error: 'INVALID_ORDER_NUMBER', message: 'Enter the order number shown on your receipt.' });
      return;
    }
    if (!creditPackage) {
      res.status(400).json({ error: 'PACKAGE_UNAVAILABLE', message: 'Choose an available credit package.' });
      return;
    }
    if (!req.body?.proof) {
      res.status(400).json({ error: 'PROOF_REQUIRED', message: 'Attach a receipt screenshot as proof of purchase.' });
      return;
    }
    const existingCases = await accountStore.listPurchaseCasesForUser(req.account.id);
    const activeCount = existingCases.filter(item => !item.closed && item.status === 'open').length;
    if (activeCount >= 3) {
      res.status(429).json({ error: 'TOO_MANY_OPEN_CASES', message: 'You already have three open verification chats. Wait for a reply before opening another.' });
      return;
    }

    const now = new Date().toISOString();
    const purchaseCase = {
      id: crypto.randomUUID(),
      userId: req.account.id,
      orderNumber,
      packageId,
      requestedCredits: creditPackage.credits,
      status: 'open',
      createdAt: now,
      updatedAt: now
    };
    const initialMessage = createPurchaseMessage({
      caseId: purchaseCase.id,
      senderRole: 'user',
      body: req.body?.message,
      proof: req.body?.proof
    });
    await accountStore.createPurchaseCase(purchaseCase, initialMessage);
    const detail = await loadPurchaseCaseDetail(await accountStore.findPurchaseCaseForUser(purchaseCase.id, req.account.id));
    res.status(201).json({ purchaseCase: detail });
  } catch (error) {
    if (['INVALID_PROOF', 'PROOF_TOO_LARGE', 'MESSAGE_TOO_LONG', 'EMPTY_MESSAGE'].includes(error?.code)) {
      res.status(400).json({ error: error.code, message: error.message });
      return;
    }
    console.error('Purchase support case creation failed:', error);
    res.status(503).json({ error: 'SUPPORT_UNAVAILABLE', message: 'The verification chat could not be created.' });
  }
});

app.get('/api/purchase-support/cases/:caseId', authenticateAccount, async (req, res) => {
  try {
    if (!isUuid(req.params.caseId)) {
      res.status(404).json({ error: 'CASE_NOT_FOUND', message: 'Verification chat not found.' });
      return;
    }
    const purchaseCase = await accountStore.findPurchaseCaseForUser(req.params.caseId, req.account.id);
    if (!purchaseCase) {
      res.status(404).json({ error: 'CASE_NOT_FOUND', message: 'Verification chat not found.' });
      return;
    }
    res.json({ purchaseCase: await loadPurchaseCaseDetail(purchaseCase), user: publicAccount(req.account) });
  } catch (error) {
    console.error('Purchase support case load failed:', error);
    res.status(503).json({ error: 'SUPPORT_UNAVAILABLE', message: 'The verification chat could not be loaded.' });
  }
});

app.post('/api/purchase-support/cases/:caseId/messages', authenticateAccount, async (req, res) => {
  try {
    if (!isUuid(req.params.caseId)) {
      res.status(404).json({ error: 'CASE_NOT_FOUND', message: 'Verification chat not found.' });
      return;
    }
    const purchaseCase = await accountStore.findPurchaseCaseForUser(req.params.caseId, req.account.id);
    if (!purchaseCase) {
      res.status(404).json({ error: 'CASE_NOT_FOUND', message: 'Verification chat not found.' });
      return;
    }
    if (purchaseCase.closed) {
      res.status(409).json({ error: 'CASE_CLOSED', message: 'This verification chat has been closed.' });
      return;
    }
    const message = createPurchaseMessage({
      caseId: purchaseCase.id,
      senderRole: 'user',
      body: req.body?.message,
      proof: req.body?.proof
    });
    await accountStore.addPurchaseMessage(message);
    const updatedCase = await accountStore.findPurchaseCaseForUser(purchaseCase.id, req.account.id);
    res.status(201).json({ purchaseCase: await loadPurchaseCaseDetail(updatedCase) });
  } catch (error) {
    if (['INVALID_PROOF', 'PROOF_TOO_LARGE', 'MESSAGE_TOO_LONG', 'EMPTY_MESSAGE'].includes(error?.code)) {
      res.status(400).json({ error: error.code, message: error.message });
      return;
    }
    console.error('Purchase support message failed:', error);
    res.status(503).json({ error: 'SUPPORT_UNAVAILABLE', message: 'Your message could not be sent.' });
  }
});

app.get('/api/admin/status', (req, res) => {
  res.json({ configured: isAdminConfigured() });
});

app.post('/api/admin/login', authRateLimit, (req, res) => {
  if (!isAdminConfigured()) {
    res.status(503).json({ error: 'ADMIN_NOT_CONFIGURED', message: 'Set ADMIN_USERNAME and ADMIN_PASSWORD on the server first.' });
    return;
  }
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '');
  const usernameMatches = constantTimeTextEqual(username, ADMIN_USERNAME);
  const passwordMatches = constantTimeTextEqual(password, ADMIN_PASSWORD);
  if (!usernameMatches || !passwordMatches) {
    res.status(401).json({ error: 'INVALID_ADMIN_CREDENTIALS', message: 'Incorrect admin username or password.' });
    return;
  }
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = Date.now() + ADMIN_SESSION_LIFETIME_MS;
  adminSessions.set(hashSessionToken(token), { expiresAt });
  res.json({ token, expiresAt });
});

app.post('/api/admin/logout', authenticateAdmin, (req, res) => {
  adminSessions.delete(req.adminSessionKey);
  res.sendStatus(204);
});

app.get('/api/admin/purchase-cases', authenticateAdmin, async (req, res) => {
  try {
    res.json({ cases: await accountStore.listAllPurchaseCases() });
  } catch (error) {
    console.error('Admin purchase case list failed:', error);
    res.status(503).json({ error: 'SUPPORT_UNAVAILABLE', message: 'Purchase chats could not be loaded.' });
  }
});

app.get('/api/admin/purchase-cases/:caseId', authenticateAdmin, async (req, res) => {
  try {
    if (!isUuid(req.params.caseId)) {
      res.status(404).json({ error: 'CASE_NOT_FOUND', message: 'Verification chat not found.' });
      return;
    }
    const purchaseCase = await accountStore.findPurchaseCaseById(req.params.caseId);
    if (!purchaseCase) {
      res.status(404).json({ error: 'CASE_NOT_FOUND', message: 'Verification chat not found.' });
      return;
    }
    res.json({ purchaseCase: await loadPurchaseCaseDetail(purchaseCase) });
  } catch (error) {
    console.error('Admin purchase case load failed:', error);
    res.status(503).json({ error: 'SUPPORT_UNAVAILABLE', message: 'The verification chat could not be loaded.' });
  }
});

app.post('/api/admin/purchase-cases/:caseId/messages', authenticateAdmin, async (req, res) => {
  try {
    if (!isUuid(req.params.caseId)) {
      res.status(404).json({ error: 'CASE_NOT_FOUND', message: 'Verification chat not found.' });
      return;
    }
    const purchaseCase = await accountStore.findPurchaseCaseById(req.params.caseId);
    if (!purchaseCase) {
      res.status(404).json({ error: 'CASE_NOT_FOUND', message: 'Verification chat not found.' });
      return;
    }
    if (purchaseCase.closed) {
      res.status(409).json({ error: 'CASE_CLOSED', message: 'This verification chat has been closed.' });
      return;
    }
    const message = createPurchaseMessage({ caseId: purchaseCase.id, senderRole: 'admin', body: req.body?.message });
    await accountStore.addPurchaseMessage(message);
    res.status(201).json({ purchaseCase: await loadPurchaseCaseDetail(await accountStore.findPurchaseCaseById(purchaseCase.id)) });
  } catch (error) {
    if (['MESSAGE_TOO_LONG', 'EMPTY_MESSAGE'].includes(error?.code)) {
      res.status(400).json({ error: error.code, message: error.message });
      return;
    }
    console.error('Admin purchase support message failed:', error);
    res.status(503).json({ error: 'SUPPORT_UNAVAILABLE', message: 'The reply could not be sent.' });
  }
});

app.post('/api/admin/purchase-cases/:caseId/decision', authenticateAdmin, async (req, res) => {
  try {
    if (!isUuid(req.params.caseId)) {
      res.status(404).json({ error: 'CASE_NOT_FOUND', message: 'Verification chat not found.' });
      return;
    }
    const action = String(req.body?.action || '');
    const credits = Number(req.body?.credits || 0);
    if (!['grant', 'deny', 'close'].includes(action)) {
      res.status(400).json({ error: 'INVALID_DECISION', message: 'Choose grant, deny, or close.' });
      return;
    }
    if (action === 'grant' && ![50, 500, 2000].includes(credits)) {
      res.status(400).json({ error: 'INVALID_CREDIT_AMOUNT', message: 'Credits must be 50, 500, or 2,000.' });
      return;
    }
    const result = await accountStore.decidePurchaseCase(req.params.caseId, action, credits);
    if (!result) {
      res.status(409).json({ error: 'DECISION_NOT_ALLOWED', message: 'This action has already been completed or the chat is closed.' });
      return;
    }
    const statusMessage = action === 'grant'
      ? `${credits.toLocaleString('en-US')} credits were added to your account.`
      : action === 'deny'
        ? 'The submitted purchase proof was denied. Reply in this chat if you believe this is a mistake.'
        : 'This purchase-support chat was closed by an administrator.';
    await accountStore.addPurchaseMessage(createPurchaseMessage({
      caseId: req.params.caseId,
      senderRole: 'admin',
      body: statusMessage
    }));
    res.json({
      purchaseCase: await loadPurchaseCaseDetail(await accountStore.findPurchaseCaseById(req.params.caseId)),
      accountCredits: result.accountCredits
    });
  } catch (error) {
    console.error('Admin purchase case decision failed:', error);
    res.status(503).json({ error: 'DECISION_FAILED', message: 'The purchase decision could not be saved.' });
  }
});

// Serve client build files if they exist, otherwise serve src directory for dev/fallback
const distPath = path.join(__dirname, 'dist');
const srcPath = path.join(__dirname, 'src');

app.use(express.static(distPath));
app.use('/src', express.static(srcPath));

app.get('/api/player-counts', (req, res) => {
  res.json(collectPlayerCounts());
});

// Fallback to index.html for single page routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      // If build files don't exist, serve src index.html
      res.sendFile(path.join(srcPath, 'index.html'));
    }
  });
});

// Matchmaking and Room State
const rooms = new Map(); // roomId -> { id, players: [{id, name, ready, weapon}], status: 'lobby'|'playing' }

function collectPlayerCounts() {
  let quickplay = 0;
  let ranked_realistic = 0;
  let ranked_competitive = 0;

  for (const room of rooms.values()) {
    const count = room.players.length;
    if (room.isRanked) {
      if (room.mode && room.mode.includes('realistic')) {
        ranked_realistic += count;
      } else if (room.mode && room.mode.includes('competitive')) {
        ranked_competitive += count;
      } else {
        ranked_realistic += count;
      }
    } else {
      quickplay += count;
    }
  }

  const totalOnline = io.engine.clientsCount;

  return {
    total: totalOnline,
    quickplay: quickplay,
    ranked_realistic: ranked_realistic,
    ranked_competitive: ranked_competitive,
    sabotage: 0,
    worldloom: 0
  };
}

function broadcastPlayerCounts() {
  io.emit('player-counts', collectPlayerCounts());
}

// Helper to generate a room ID
function generateRoomId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Readable chars (no O/0/I/1)
  let id = '';
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

installShooterAccountIdentity(io,{accounts:accountStore,hashToken:hashSessionToken});
const shooterRecovery = createShooterRoomRecovery({ io, rooms, onLeave: handleRoomLeave });
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  let currentRoomId = shooterRecovery.resume(socket);
  if (socket.recovered && socket.data.legacyUserKey) socketToUser.set(socket.id, socket.data.legacyUserKey);
  socket.on('account-session',()=>{
    const name=socket.data.accountName;
    socket.emit('account-name',{name});
    const room=rooms.get(currentRoomId), player=room?.players.find(p=>p.id===socket.id);
    if(player){player.name=name;io.to(currentRoomId).emit('players-update',{players:room.players});}
  });
  broadcastPlayerCounts();

  // 0. Authentication Events
  socket.on('register', ({ username, password }) => {
    const cleanUsername = username.trim();
    if (!cleanUsername || cleanUsername.length < 3 || cleanUsername.length > 15) {
      socket.emit('register-response', { success: false, error: 'Invalid codename length (3-15 chars).' });
      return;
    }
    
    // Check characters (alphanumeric and underscores only)
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      socket.emit('register-response', { success: false, error: 'Codename must contain only letters, numbers, and underscores.' });
      return;
    }

    const lowerName = cleanUsername.toLowerCase();
    if (users[lowerName]) {
      socket.emit('register-response', { success: false, error: 'Codename already registered.' });
      return;
    }

    users[lowerName] = {
      username: cleanUsername,
      password: password, // client sends hashed password
      stats: { wins: 0, rounds: 0, hits: 0, shots: 0 }
    };
    saveUsers();
    socket.emit('register-response', { success: true });
    console.log(`Registered new operative: ${cleanUsername}`);
  });

  socket.on('login', ({ username, password }) => {
    const cleanUsername = username.trim();
    const lowerName = cleanUsername.toLowerCase();
    const user = users[lowerName];
    if (!user || user.password !== password) {
      socket.emit('login-response', { success: false, error: 'Invalid Codename or Secure Passkey.' });
      return;
    }
    
    // Bind socket session to user record
    socketToUser.set(socket.id, lowerName);
    socket.data.legacyUserKey = lowerName;
    socket.emit('login-response', { 
      success: true, 
      username: user.username,
      stats: user.stats
    });
    console.log(`Operative logged in: ${user.username} (${socket.id})`);
  });

  socket.on('match-stats', ({ isWin, rounds, shots, hits }) => {
    const userKey = socketToUser.get(socket.id);
    if (userKey && users[userKey]) {
      const user = users[userKey];
      if (isWin) user.stats.wins++;
      user.stats.rounds += rounds;
      user.stats.shots += shots;
      user.stats.hits += hits;
      saveUsers();
      socket.emit('stats-updated', { stats: user.stats });
      console.log(`Updated stats for ${user.username}: wins=${user.stats.wins}, rounds=${user.stats.rounds}`);
    }
  });

  // 1. Create a custom room
  socket.on('create-room', ({ playerName, mode, color, mapId, weapon, renderStyle }) => {
    let roomId = generateRoomId();
    while (rooms.has(roomId)) {
      roomId = generateRoomId();
    }

    const roomMode = (mode === '2v2') ? '2v2' : '1v1';
    const room = {
      id: roomId,
      mode: roomMode,
      isRanked: false, // Custom rooms are never ranked
      mapId: mapId || 'manor',
      renderStyle: renderStyle || 'realistic',
      players: [{
        id: socket.id,
        name: playerName || 'Player 1',
        ready: false,
        weapon: weapon || 'pistol',
        color: color || 'cyan',
        rp: 0
      }],
      status: 'lobby',
      score1: 0,
      score2: 0,
      roundNumber: 1
    };

    rooms.set(roomId, room);
    socket.join(roomId);
    currentRoomId = roomId;
    shooterRecovery.joined(socket, roomId);

    socket.emit('room-created', { roomId, players: room.players, mode: roomMode, mapId: room.mapId, renderStyle: room.renderStyle, isRanked: false });
    console.log(`Room created: ${roomId} (${roomMode}, Map: ${room.mapId}, Style: ${room.renderStyle}) by player: ${playerName} (${socket.id})`);
    broadcastPlayerCounts();
  });

  // 1.1 Select map (Quick Play Custom Lobby)
  socket.on('select-map', ({ mapId }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;
    // Check if sender is admin/host
    if (room.players[0] && room.players[0].id === socket.id) {
      room.mapId = mapId;
      io.to(currentRoomId).emit('lobby-map-update', { mapId });
      console.log(`[Server] Map updated to ${mapId} in room: ${currentRoomId}`);
    }
  });

  // 1.2 Select game mode (custom lobby)
  socket.on('select-game-mode', ({ mode }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;
    if (room.players[0] && room.players[0].id === socket.id) {
      room.mode = mode;
      io.to(currentRoomId).emit('lobby-mode-update', { mode });
      console.log(`[Server] Game mode updated to ${mode} in room: ${currentRoomId}`);
    }
  });

  // 1.3 Select render style (custom lobby)
  socket.on('select-render-style', ({ renderStyle }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;
    if (room.players[0] && room.players[0].id === socket.id) {
      room.renderStyle = renderStyle;
      io.to(currentRoomId).emit('lobby-style-update', { renderStyle });
      console.log(`[Server] Render style updated to ${renderStyle} in room: ${currentRoomId}`);
    }
  });

  socket.on('join-room', ({ roomId, playerName, color, weapon }) => {
    const cleanRoomId = roomId.trim().toUpperCase();
    const room = rooms.get(cleanRoomId);

    if (!room) {
      socket.emit('room-error', 'Room not found.');
      return;
    }

    const maxPlayers = (room.mode && room.mode.startsWith('2v2')) ? 4 : 2;
    if (room.players.length >= maxPlayers) {
      socket.emit('room-error', 'Room is full.');
      return;
    }

    // Add player
    const newPlayer = {
      id: socket.id,
      name: playerName || `Player ${room.players.length + 1}`,
      ready: false,
      weapon: weapon || 'pistol',
      color: color || 'cyan',
      rp: 0
    };
    room.players.push(newPlayer);
    
    socket.join(cleanRoomId);
    currentRoomId = cleanRoomId;
    shooterRecovery.joined(socket, cleanRoomId);

    socket.emit('room-joined', { roomId: cleanRoomId, players: room.players, mode: room.mode, mapId: room.mapId || 'manor', renderStyle: room.renderStyle || 'realistic', isRanked: false });
    socket.to(cleanRoomId).emit('player-joined', { players: room.players });
    console.log(`Player ${playerName} (${socket.id}) joined room: ${cleanRoomId}`);
    broadcastPlayerCounts();
  });

  // 3. Auto-matchmaking (Ranked)
  socket.on('auto-match', ({ playerName, mode, color, rp, rankStrict, weapon }) => {
    let searchMode = mode;
    if (!['1v1_realistic', '1v1_competitive', '2v2_realistic', '2v2_competitive'].includes(searchMode)) {
      searchMode = '1v1_realistic';
    }
    const maxPlayers = searchMode.startsWith('2v2') ? 4 : 2;
    const playerRP = typeof rp === 'number' ? rp : 0;
    
    // Find a room with space in lobby status and matching mode
    let targetRoom = null;
    for (const [id, room] of rooms.entries()) {
      if (room.status === 'lobby' && room.mode === searchMode && room.players.length < maxPlayers && room.isRanked) {
        if (!rankStrict) {
          targetRoom = room;
          break;
        } else {
          // Strict check: all players in room must be within 1000 RP of playerRP
          const withinBracket = room.players.every(p => Math.abs((p.rp || 0) - playerRP) <= 1000);
          if (withinBracket) {
            targetRoom = room;
            break;
          }
        }
      }
    }

    if (targetRoom) {
      // Join it
      const newPlayer = {
        id: socket.id,
        name: playerName || `Player ${targetRoom.players.length + 1}`,
        ready: false,
        weapon: weapon || 'pistol',
        color: color || 'cyan',
        rp: playerRP
      };
      targetRoom.players.push(newPlayer);
      socket.join(targetRoom.id);
      currentRoomId = targetRoom.id;
      shooterRecovery.joined(socket, targetRoom.id);

      socket.emit('room-joined', { roomId: targetRoom.id, players: targetRoom.players, mode: targetRoom.mode, isRanked: true, mapId: targetRoom.mapId || 'manor', renderStyle: targetRoom.renderStyle || 'realistic' });
      socket.to(targetRoom.id).emit('player-joined', { players: targetRoom.players });
      console.log(`Auto-matched Player ${playerName} (RP: ${playerRP}) into room: ${targetRoom.id}`);
      broadcastPlayerCounts();
    } else {
      // Create a room
      let roomId = generateRoomId();
      while (rooms.has(roomId)) {
        roomId = generateRoomId();
      }

      const room = {
        id: roomId,
        mode: searchMode,
        isRanked: true, // Lobbies created via matchmaking are ranked
        players: [{
          id: socket.id,
          name: playerName || 'Player 1',
          ready: false,
          weapon: weapon || 'pistol',
          color: color || 'cyan',
          rp: playerRP
        }],
        status: 'lobby',
        score1: 0,
        score2: 0,
        roundNumber: 1
      };

      rooms.set(roomId, room);
      socket.join(roomId);
      currentRoomId = roomId;
      shooterRecovery.joined(socket, roomId);

      socket.emit('room-created', { roomId, players: room.players, autoMatch: true, mode: searchMode, isRanked: true, mapId: room.mapId || 'manor', renderStyle: room.renderStyle || 'realistic' });
      console.log(`Auto-match created room: ${roomId} (${searchMode}) for player: ${playerName} (RP: ${playerRP})`);
      broadcastPlayerCounts();
    }
  });

  // 4. Update Weapon selection
  socket.on('select-weapon', ({ weapon }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.weapon = weapon;
      io.to(currentRoomId).emit('players-update', { players: room.players });
    }
  });

  // 4.1 Update Color selection
  socket.on('select-color', ({ color }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.color = color;
      io.to(currentRoomId).emit('players-update', { players: room.players });
    }
  });

  // 4.2 Update Name selection
  socket.on('change-name', ({ name }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.name = name || 'Operative';
      io.to(currentRoomId).emit('players-update', { players: room.players });
    }
  });


  // 5. Ready state toggle
  socket.on('player-ready', ({ ready }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.ready = ready;
      io.to(currentRoomId).emit('players-update', { players: room.players });

      // Start match if all players are ready and lobby is full
      const maxPlayers = (room.mode && room.mode.startsWith('2v2')) ? 4 : 2;
      const allReady = room.players.every(p => p.ready) && room.players.length === maxPlayers;
      if (allReady) {
        room.status = 'playing';
        room.score1 = 0;
        room.score2 = 0;
        room.roundNumber = 1;
        room.players.forEach(p => p.wantsRematch = false); // clear any old rematch tags
        const startRandVal = Math.random();
        const startMapId = room.isRanked
          ? (startRandVal < 0.33 ? 'manor' : (startRandVal < 0.66 ? 'cyberlab' : 'arena'))
          : (room.mapId || 'manor');
        const startRenderStyle = room.isRanked 
          ? (room.mode.includes('competitive') ? 'competitive' : 'realistic')
          : (room.renderStyle || 'realistic');
        io.to(currentRoomId).emit('match-start', {
          players: room.players,
          seed: Math.random(), // synchronized seed for map spawns / layouts
          isRanked: room.isRanked,
          mode: room.mode,
          mapId: startMapId,
          renderStyle: startRenderStyle
        });
        console.log(`Match started in room: ${currentRoomId} (${room.mode}, Ranked: ${room.isRanked})`);
      }
    }
  });

  // Rematch request
  socket.on('request-rematch', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.wantsRematch = true;
      socket.to(currentRoomId).emit('opponent-requested-rematch', { playerId: socket.id });
      
      const allWantRematch = room.players.every(p => p.wantsRematch);
      if (allWantRematch && room.players.length >= 2) {
        room.status = 'playing';
        room.score1 = 0;
        room.score2 = 0;
        room.roundNumber = 1;
        room.players.forEach(p => {
          p.ready = false;
          p.wantsRematch = false;
        });
        const rematchRandVal = Math.random();
        const rematchMapId = room.isRanked
          ? (rematchRandVal < 0.33 ? 'manor' : (rematchRandVal < 0.66 ? 'cyberlab' : 'arena'))
          : (room.mapId || 'manor');
        const rematchRenderStyle = room.isRanked 
          ? (room.mode.includes('competitive') ? 'competitive' : 'realistic')
          : (room.renderStyle || 'realistic');
        io.to(currentRoomId).emit('match-start', {
          players: room.players,
          seed: Math.random(),
          isRanked: room.isRanked,
          mode: room.mode,
          mapId: rematchMapId,
          renderStyle: rematchRenderStyle
        });
        console.log(`Rematch started in room: ${currentRoomId} (Ranked: ${room.isRanked})`);
      }
    }
  });


  // 6. In-game: Relay Player State (60hz updates)
  socket.on('player-state', (state) => {
    if (!currentRoomId) return;
    state.id = socket.id; // inject sender ID
    const relay = state.droppedItem || state.justDashed ? socket.to(currentRoomId) : socket.to(currentRoomId).volatile;
    relay.emit('opponent-state', state);
  });

  // 7. In-game: Relay Shooting Action
  socket.on('shoot', (shootData) => {
    if (!currentRoomId) return;
    shootData.playerId = socket.id; // tag shooter ID
    socket.to(currentRoomId).emit('opponent-shoot', shootData);
  });

  // 8. In-game: Hit Event
  socket.on('hit', (hitData) => {
    if (!currentRoomId) return;
    hitData.shooterId = socket.id; // tag shooter ID
    socket.to(currentRoomId).emit('damage-taken', hitData);
  });

  // 9. In-game: Health Sync
  socket.on('sync-health', (healthData) => {
    if (!currentRoomId) return;
    healthData.playerId = socket.id; // tag player ID
    socket.to(currentRoomId).emit('opponent-health-sync', healthData);
  });

  // 10. In-game: Player Died
  socket.on('player-died', (deathData) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (room && room.status === 'playing') {
      if (deathData && deathData.roundNumber !== undefined && deathData.roundNumber !== room.roundNumber) {
        console.log(`[Server] Ignored duplicate/late death event for round ${deathData.roundNumber} (current server round: ${room.roundNumber})`);
        return;
      }
      const loserId = deathData.loserId;
      const loserIdx = room.players.findIndex(p => p.id === loserId);
      if (loserIdx !== -1) {
        const loserTeam = (loserIdx % 2 === 0) ? 1 : 2;
        const winnerTeam = (loserTeam === 1) ? 2 : 1;

        if (winnerTeam === 1) {
          room.score1++;
        } else {
          room.score2++;
        }

        const matchFinished = (room.mode === 'sabotage') || (room.score1 >= 3 || room.score2 >= 3);
        if (matchFinished) {
          room.status = 'lobby';
          // Reset ready states for next match
          room.players.forEach(p => p.ready = false);
          
          const winnerPlayer = room.players.find(p => {
            const idx = room.players.indexOf(p);
            const team = (idx % 2 === 0) ? 1 : 2;
            return team === winnerTeam;
          });

          io.to(currentRoomId).emit('match-over', {
            winnerId: winnerPlayer ? winnerPlayer.id : deathData.winnerId,
            score1: room.score1,
            score2: room.score2
          });
          io.to(currentRoomId).emit('players-update', { players: room.players });
          console.log(`Match finished in room: ${currentRoomId}. Score: ${room.score1}-${room.score2}`);
        } else {
          room.roundNumber++;
          io.to(currentRoomId).emit('round-over', {
            winningTeam: winnerTeam,
            score1: room.score1,
            score2: room.score2,
            roundNumber: room.roundNumber
          });
          console.log(`Round finished in room: ${currentRoomId}. Round Winner Team: ${winnerTeam}. Score: ${room.score1}-${room.score2}`);
        }
      }
    }
  });

  // 11. In-game: Break Crate
  socket.on('break-crate', (crateData) => {
    if (!currentRoomId) return;
    socket.to(currentRoomId).emit('opponent-break-crate', crateData);
  });

  // 12. In-game: Pickup Item
  socket.on('pickup-item', (pickupData) => {
    if (!currentRoomId) return;
    socket.to(currentRoomId).emit('opponent-pickup-item', pickupData);
  });

  // 14. In-game: Sabotage Alarm
  socket.on('sabotage-alarm', (alarmData) => {
    if (!currentRoomId) return;
    socket.to(currentRoomId).emit('opponent-sabotage-alarm', alarmData);
  });

  // 13. Text Chat
  socket.on('chat-message', (msg) => {
    if (!currentRoomId) return;
    msg.id = socket.id; // tag sender ID
    socket.to(currentRoomId).emit('opponent-chat', msg);
  });

  // 13.1 Device Sync & Backup
  socket.on('sync-device', ({ uuid, rp, wins, losses, name, credits, purchasedWeapons }) => {
    if (!uuid) return;
    const id = uuid.toLowerCase();
    
    if (!users[id]) {
      users[id] = {
        username: name || 'Operative',
        rp: rp || 0,
        credits: credits || 0,
        purchasedWeapons: purchasedWeapons || [],
        stats: { wins: wins || 0, losses: losses || 0, rounds: 0, hits: 0, shots: 0 }
      };
      saveUsers();
    } else {
      const sProfile = users[id];
      sProfile.rp = rp;
      sProfile.stats.wins = wins;
      sProfile.stats.losses = losses;
      sProfile.credits = credits;
      sProfile.purchasedWeapons = Array.from(new Set([...(sProfile.purchasedWeapons || []), ...(purchasedWeapons || [])]));
      if (name && name !== 'Operative') {
        sProfile.username = name;
      }
      saveUsers();
    }
    
    const sProfile = users[id];
    socket.emit('device-synced', {
      rp: sProfile.rp,
      wins: sProfile.stats.wins,
      losses: sProfile.stats.losses,
      name: sProfile.username,
      credits: sProfile.credits || 0,
      purchasedWeapons: sProfile.purchasedWeapons || []
    });
  });

  // 13.2 Relay Grenade
  socket.on('throw-grenade', (data) => {
    if (!currentRoomId) return;
    data.playerId = socket.id;
    socket.to(currentRoomId).emit('opponent-throw-grenade', data);
  });

  // 14. Leave Room
  socket.on('leave-room', () => {
    if (currentRoomId) {
      shooterRecovery.leave(socket, currentRoomId);
      currentRoomId = null;
      broadcastPlayerCounts();
    }
  });

  // 15. Disconnection
  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id}`);
    socketToUser.delete(socket.id);
    if (currentRoomId) {
      shooterRecovery.disconnect(socket, reason);
    }
    broadcastPlayerCounts();
  });
});

function handleRoomLeave(socket, roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  // Remove player from room list
  room.players = room.players.filter(p => p.id !== socket.id);
  socket.leave(roomId);

  if (room.players.length === 0) {
    rooms.delete(roomId);
    console.log(`Room: ${roomId} deleted (empty)`);
  } else {
    // Notify remaining player
    room.status = 'lobby';
    room.players.forEach(p => {
      p.ready = false;
      p.wantsRematch = false;
    }); // reset ready and rematch
    io.to(roomId).emit('player-left', {
      players: room.players,
      message: 'Opponent disconnected. Returned to lobby.'
    });
    console.log(`Player left room: ${roomId}. 1 player remaining.`);
  }
  broadcastPlayerCounts();
}

await accountStore.initialize();
if (!requirePersistentAccountStore || worldStore.isPersistent) {
  try { await worldStore.initialize(); } catch { console.error('Persistent Worldloom storage could not start.'); }
}

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
