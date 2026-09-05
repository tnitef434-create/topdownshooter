import fs from 'fs';
import path from 'path';
import { randomInt } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { normalizeUsername, usernameTakenError } from './accountUsername.js';

// Null is an explicitly persistent session; missing/malformed expiry is invalid.
export function isAccountSessionActive(session, now = Date.now()) {
  return Boolean(session && (session.expiresAt === null ||
    (Number.isFinite(session.expiresAt) && session.expiresAt > now)));
}

function createEmptyLocalDatabase() {
  return {
    version: 4,
    users: {},
    emailIndex: {},
    sessions: {},
    purchaseIntents: {},
    purchaseCases: {},
    purchaseMessages: {}
  };
}

function mapDatabaseUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    displayName: row.username || row.display_name,
    username: row.username || null,
    password: {
      algorithm: row.password_algorithm,
      salt: row.password_salt,
      hash: row.password_hash
    },
    credits: Number(row.credits || 0),
    purchasedWeapons: Array.isArray(row.purchased_weapons) ? row.purchased_weapons : [],
    emailVerifiedAt: row.email_verified_at ? new Date(row.email_verified_at).toISOString() : null,
    friendCode: row.friend_code || null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

function duplicateEmailError() {
  const error = new Error('An account already exists for this email.');
  error.code = 'DUPLICATE_EMAIL';
  return error;
}

function mapPurchaseCase(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    userEmail: row.user_email || null,
    orderNumber: row.order_number,
    packageId: row.package_id,
    requestedCredits: Number(row.requested_credits || 0),
    status: row.status,
    creditsGranted: Number(row.credits_granted || 0),
    closed: Boolean(row.closed_at),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    resolvedAt: row.resolved_at ? new Date(row.resolved_at).toISOString() : null,
    closedAt: row.closed_at ? new Date(row.closed_at).toISOString() : null
  };
}

function mapPurchaseMessage(row) {
  if (!row) return null;
  return {
    id: row.id,
    caseId: row.case_id,
    senderRole: row.sender_role,
    body: row.body || '',
    proofName: row.proof_name || null,
    proofMime: row.proof_mime || null,
    proofData: row.proof_data || null,
    createdAt: new Date(row.created_at).toISOString()
  };
}

export function createAccountStore({ databaseUrl = '', localFile, sqlClient = null }) {
  const sql = sqlClient || (databaseUrl ? neon(databaseUrl) : null);
  let localDatabase = createEmptyLocalDatabase();
  let ready = false;
  let initializationError = null;

  function loadLocalDatabase() {
    try {
      if (!fs.existsSync(localFile)) return createEmptyLocalDatabase();
      const parsed = JSON.parse(fs.readFileSync(localFile, 'utf8'));
      return {
        ...createEmptyLocalDatabase(),
        ...parsed,
        users: parsed.users || {},
        emailIndex: parsed.emailIndex || {},
        sessions: parsed.sessions || {},
        purchaseIntents: parsed.purchaseIntents || {},
        purchaseCases: parsed.purchaseCases || {},
        purchaseMessages: parsed.purchaseMessages || {}
      };
    } catch (error) {
      console.error('Failed to load the local account database:', error);
      return createEmptyLocalDatabase();
    }
  }

  function saveLocalDatabase() {
    const directory = path.dirname(localFile);
    const temporaryFile = `${localFile}.tmp`;
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(temporaryFile, JSON.stringify(localDatabase, null, 2), 'utf8');
    fs.renameSync(temporaryFile, localFile);
  }

  async function initialize() {
    initializationError = null;
    try {
      if (!sql) {
        localDatabase = loadLocalDatabase();
        let migrated = false;
        const now = Date.now();
        for (const session of Object.values(localDatabase.sessions)) {
          if (Number.isFinite(session?.expiresAt) && session.expiresAt > now) {
            session.expiresAt = null;
            migrated = true;
          }
        }
        if (migrated) saveLocalDatabase();
        ready = true;
        console.warn('DATABASE_URL is not set. Accounts are using local development storage.');
        return;
      }

      await sql`
        CREATE TABLE IF NOT EXISTS operative_accounts (
          id UUID PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          display_name TEXT NOT NULL,
          password_algorithm TEXT NOT NULL,
          password_salt TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          credits INTEGER NOT NULL DEFAULT 0 CHECK (credits >= 0),
          purchased_weapons JSONB NOT NULL DEFAULT '[]'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`ALTER TABLE operative_accounts ADD COLUMN IF NOT EXISTS username TEXT CHECK (username ~ '^[A-Za-z0-9_]{3,15}$')`;
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS operative_username_unique ON operative_accounts (LOWER(username)) WHERE username IS NOT NULL`;
      await sql`
        CREATE TABLE IF NOT EXISTS operative_sessions (
          token_hash TEXT PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES operative_accounts(id) ON DELETE CASCADE,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`ALTER TABLE operative_accounts ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ`;
      // Preserve the old expiry column during rolling deployments so an older
      // server cannot mistake an upgraded session for an expired one and delete it.
      await sql`ALTER TABLE operative_sessions ADD COLUMN IF NOT EXISTS persistent BOOLEAN NOT NULL DEFAULT FALSE`;
      await sql`UPDATE operative_sessions SET persistent = TRUE WHERE persistent = FALSE AND expires_at > NOW()`;
      await sql`ALTER TABLE operative_accounts ADD COLUMN IF NOT EXISTS friend_code TEXT CHECK (friend_code ~ '^[0-9]{4}$')`;
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS operative_accounts_friend_code_idx ON operative_accounts(friend_code)`;
      await sql`
        CREATE TABLE IF NOT EXISTS operative_email_verifications (
          user_id UUID PRIMARY KEY REFERENCES operative_accounts(id) ON DELETE CASCADE,
          token_hash TEXT UNIQUE NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          send_count INTEGER NOT NULL DEFAULT 1
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS operative_sessions_user_id_idx
        ON operative_sessions(user_id)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS operative_sessions_expires_at_idx
        ON operative_sessions(expires_at)
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS operative_purchase_intents (
          id UUID PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES operative_accounts(id) ON DELETE CASCADE,
          package_id TEXT NOT NULL,
          credits INTEGER NOT NULL,
          amount_cents INTEGER NOT NULL,
          currency TEXT NOT NULL,
          status TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS operative_purchase_cases (
          id UUID PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES operative_accounts(id) ON DELETE CASCADE,
          order_number TEXT NOT NULL,
          package_id TEXT NOT NULL,
          requested_credits INTEGER NOT NULL CHECK (requested_credits > 0),
          status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'approved', 'denied')),
          credits_granted INTEGER NOT NULL DEFAULT 0 CHECK (credits_granted >= 0),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          resolved_at TIMESTAMPTZ,
          closed_at TIMESTAMPTZ
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS operative_purchase_cases_user_id_idx
        ON operative_purchase_cases(user_id, updated_at DESC)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS operative_purchase_cases_status_idx
        ON operative_purchase_cases(status, updated_at DESC)
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS operative_purchase_messages (
          id UUID PRIMARY KEY,
          case_id UUID NOT NULL REFERENCES operative_purchase_cases(id) ON DELETE CASCADE,
          sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'admin')),
          body TEXT NOT NULL DEFAULT '',
          proof_name TEXT,
          proof_mime TEXT,
          proof_data TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS operative_purchase_messages_case_id_idx
        ON operative_purchase_messages(case_id, created_at ASC)
      `;
      ready = true;
      console.log('Persistent operative account database connected.');
    } catch (error) {
      ready = false;
      initializationError = error;
      console.error('Persistent account database initialization failed:', error);
    }
  }

  async function findUserByEmail(email) {
    if (sql) {
      const rows = await sql`
        SELECT * FROM operative_accounts
        WHERE email = ${email}
        LIMIT 1
      `;
      return mapDatabaseUser(rows[0]);
    }
    const userId = localDatabase.emailIndex[email];
    return userId ? localDatabase.users[userId] || null : null;
  }

  async function findUserById(id) {
    if (sql) {
      const rows = await sql`
        SELECT * FROM operative_accounts
        WHERE id = ${id}
        LIMIT 1
      `;
      return mapDatabaseUser(rows[0]);
    }
    return localDatabase.users[id] || null;
  }

  async function findUserByFriendCode(code) {
    if (!/^\d{4}$/.test(code)) return null;
    if (sql) return mapDatabaseUser((await sql`SELECT * FROM operative_accounts WHERE friend_code=${code} LIMIT 1`)[0]);
    return Object.values(localDatabase.users).find(user => user.friendCode === code) || null;
  }

  async function createUser(user) {
    user = {...user, username: user.username == null ? null : normalizeUsername(user.username)};
    if (sql) {
      try {
        const rows = await sql`
          INSERT INTO operative_accounts (
            id,
            email,
            display_name,
            username,
            password_algorithm,
            password_salt,
            password_hash,
            credits,
            purchased_weapons,
            created_at,
            updated_at
          ) VALUES (
            ${user.id},
            ${user.email},
            ${user.displayName},
            ${user.username},
            ${user.password.algorithm},
            ${user.password.salt},
            ${user.password.hash},
            ${user.credits},
            ${JSON.stringify(user.purchasedWeapons)}::jsonb,
            ${user.createdAt},
            ${user.updatedAt}
          )
          RETURNING *
        `;
        return mapDatabaseUser(rows[0]);
      } catch (error) {
        if (error?.code === '23505') {
          if (error.constraint === 'operative_username_unique') throw usernameTakenError();
          throw duplicateEmailError();
        }
        throw error;
      }
    }

    if (localDatabase.emailIndex[user.email]) throw duplicateEmailError();
    if (user.username && Object.values(localDatabase.users).some(other=>other.username?.toLowerCase()===user.username.toLowerCase())) throw usernameTakenError();
    localDatabase.users[user.id] = user;
    localDatabase.emailIndex[user.email] = user.id;
    saveLocalDatabase();
    return user;
  }

  async function createSession(tokenHash, userId, expiresAt = null) {
    if (sql) {
      const persistent = expiresAt === null;
      const legacyExpiry = persistent ? Date.now() + 30 * 86400000 : expiresAt;
      await sql`
        INSERT INTO operative_sessions (token_hash, user_id, expires_at, persistent)
        VALUES (${tokenHash}, ${userId}, ${new Date(legacyExpiry).toISOString()}, ${persistent})
      `;
      return;
    }
    localDatabase.sessions[tokenHash] = { userId, expiresAt };
    saveLocalDatabase();
  }

  // One outstanding link per account; the database enforces resend limits across instances.
  async function reserveEmailVerification(userId, tokenHash, expiresAt, now = Date.now()) {
    if (sql) {
      const rows = await sql`
        INSERT INTO operative_email_verifications (user_id, token_hash, expires_at, sent_at, window_started_at)
        VALUES (${userId}, ${tokenHash}, ${new Date(expiresAt).toISOString()}, ${new Date(now).toISOString()}, ${new Date(now).toISOString()})
        ON CONFLICT (user_id) DO UPDATE SET
          token_hash = EXCLUDED.token_hash, expires_at = EXCLUDED.expires_at, sent_at = EXCLUDED.sent_at,
          window_started_at = CASE WHEN operative_email_verifications.window_started_at <= EXCLUDED.sent_at - INTERVAL '24 hours' THEN EXCLUDED.sent_at ELSE operative_email_verifications.window_started_at END,
          send_count = CASE WHEN operative_email_verifications.window_started_at <= EXCLUDED.sent_at - INTERVAL '24 hours' THEN 1 ELSE operative_email_verifications.send_count + 1 END
        WHERE operative_email_verifications.sent_at <= EXCLUDED.sent_at - INTERVAL '60 seconds'
          AND (operative_email_verifications.send_count < 5 OR operative_email_verifications.window_started_at <= EXCLUDED.sent_at - INTERVAL '24 hours')
        RETURNING user_id
      `;
      return rows.length > 0;
    }
    localDatabase.emailVerifications ||= {};
    const old = localDatabase.emailVerifications[userId];
    const fresh = !old || old.windowStartedAt <= now - 86400000;
    if (old && (old.sentAt > now - 60000 || (!fresh && old.sendCount >= 5))) return false;
    localDatabase.emailVerifications[userId] = {tokenHash, expiresAt, sentAt:now, windowStartedAt:fresh?now:old.windowStartedAt, sendCount:fresh?1:old.sendCount+1};
    saveLocalDatabase();
    return true;
  }

  async function findEmailVerification(tokenHash) {
    if (sql) {
      const rows = await sql`SELECT user_id, expires_at FROM operative_email_verifications WHERE token_hash = ${tokenHash}`;
      return rows[0] ? {userId:rows[0].user_id, expiresAt:new Date(rows[0].expires_at).getTime()} : null;
    }
    const entry = Object.entries(localDatabase.emailVerifications || {}).find(([,v])=>v.tokenHash === tokenHash);
    return entry ? {userId:entry[0], expiresAt:entry[1].expiresAt} : null;
  }

  async function consumeEmailVerification(tokenHash, password, now = Date.now()) {
    if (sql) {
      const rows = await sql`
        WITH consumed AS (
          DELETE FROM operative_email_verifications WHERE token_hash = ${tokenHash} AND expires_at > ${new Date(now).toISOString()} RETURNING user_id
        ), revoked AS (
          DELETE FROM operative_sessions WHERE user_id IN (SELECT user_id FROM consumed)
        )
        UPDATE operative_accounts SET email_verified_at = COALESCE(email_verified_at, ${new Date(now).toISOString()}::timestamptz),
          password_algorithm = ${password.algorithm}, password_salt = ${password.salt}, password_hash = ${password.hash}, updated_at = NOW()
        WHERE id IN (SELECT user_id FROM consumed) RETURNING *
      `;
      return mapDatabaseUser(rows[0]);
    }
    const entry = Object.entries(localDatabase.emailVerifications || {}).find(([,v])=>v.tokenHash === tokenHash && v.expiresAt > now);
    if (!entry) return null;
    const user = localDatabase.users[entry[0]];
    if (!user) return null;
    delete localDatabase.emailVerifications[entry[0]];
    for (const [key,session] of Object.entries(localDatabase.sessions)) if (session.userId === user.id) delete localDatabase.sessions[key];
    user.emailVerifiedAt ||= new Date(now).toISOString();
    user.password = password;
    user.updatedAt = new Date(now).toISOString();
    saveLocalDatabase();
    return user;
  }

  async function setUsername(id, value) {
    const username=normalizeUsername(value);
    if(sql) {
      try {
        const rows=await sql`UPDATE operative_accounts SET username=${username}, display_name=${username}, updated_at=NOW() WHERE id=${id} RETURNING *`;
        return mapDatabaseUser(rows[0]);
      } catch(error) {
        if(error?.code==='23505')throw usernameTakenError();
        throw error;
      }
    }
    const user=localDatabase.users[id];
    if(!user)return null;
    if(Object.values(localDatabase.users).some(other=>other.id!==id&&other.username?.toLowerCase()===username.toLowerCase()))throw usernameTakenError();
    user.username=username;user.displayName=username;user.updatedAt=new Date().toISOString();
    saveLocalDatabase();
    return user;
  }

  async function generateFriendCode(userId) {
    for (let attempt = 0; attempt < 32; attempt++) {
      const user = await findUserById(userId);
      if (!user?.emailVerifiedAt) throw Object.assign(new Error('Verify your email first.'), {code:'EMAIL_VERIFICATION_REQUIRED'});
      if (user.friendCode) return user;
      if (sql) {
        try {
          const rows = await sql`
            WITH available AS (
              SELECT lpad(n::text, 4, '0') AS code FROM generate_series(0,9999) AS n
              WHERE NOT EXISTS (SELECT 1 FROM operative_accounts WHERE friend_code = lpad(n::text, 4, '0'))
              ORDER BY random() LIMIT 1
            )
            UPDATE operative_accounts SET friend_code = available.code, updated_at = NOW() FROM available
            WHERE id = ${userId} AND friend_code IS NULL AND email_verified_at IS NOT NULL RETURNING operative_accounts.*
          `;
          if (rows[0]) return mapDatabaseUser(rows[0]);
          const current = await findUserById(userId);
          if (current?.friendCode) return current;
          break;
        } catch (error) {
          if (error?.code === '23505') continue; // Another account claimed this candidate; retry against the unique index.
          throw error;
        }
      } else {
        const used = new Set(Object.values(localDatabase.users).map(u=>u.friendCode).filter(Boolean));
        const available = Array.from({length:10000},(_,n)=>String(n).padStart(4,'0')).filter(code=>!used.has(code));
        if (!available.length) break;
        // Recheck after the async read: concurrent requests for one account must be idempotent.
        if (!user.friendCode) { user.friendCode=available[randomInt(available.length)]; saveLocalDatabase(); }
        return user;
      }
    }
    throw Object.assign(new Error('All four-digit friend codes are currently taken. Please try again later.'), {code:'FRIEND_CODES_UNAVAILABLE'});
  }

  async function findSession(tokenHash) {
    if (sql) {
      const rows = await sql`
        SELECT token_hash, user_id, expires_at, persistent
        FROM operative_sessions
        WHERE token_hash = ${tokenHash}
        LIMIT 1
      `;
      const row = rows[0];
      if (!row) return null;
      return {
        tokenHash: row.token_hash,
        userId: row.user_id,
        expiresAt: row.persistent ? null : new Date(row.expires_at).getTime()
      };
    }
    return localDatabase.sessions[tokenHash] || null;
  }

  async function deleteSession(tokenHash) {
    if (sql) {
      await sql`DELETE FROM operative_sessions WHERE token_hash = ${tokenHash}`;
      return;
    }
    delete localDatabase.sessions[tokenHash];
    saveLocalDatabase();
  }

  async function createPurchaseIntent(intent) {
    if (sql) {
      await sql`
        INSERT INTO operative_purchase_intents (
          id,
          user_id,
          package_id,
          credits,
          amount_cents,
          currency,
          status,
          created_at
        ) VALUES (
          ${intent.id},
          ${intent.userId},
          ${intent.packageId},
          ${intent.credits},
          ${intent.amount},
          ${intent.currency},
          ${intent.status},
          ${intent.createdAt}
        )
      `;
      return;
    }
    localDatabase.purchaseIntents[intent.id] = intent;
    saveLocalDatabase();
  }

  async function createPurchaseCase(purchaseCase, initialMessage) {
    if (sql) {
      const rows = await sql`
        INSERT INTO operative_purchase_cases (
          id,
          user_id,
          order_number,
          package_id,
          requested_credits,
          status,
          credits_granted,
          created_at,
          updated_at
        ) VALUES (
          ${purchaseCase.id},
          ${purchaseCase.userId},
          ${purchaseCase.orderNumber},
          ${purchaseCase.packageId},
          ${purchaseCase.requestedCredits},
          ${purchaseCase.status},
          0,
          ${purchaseCase.createdAt},
          ${purchaseCase.updatedAt}
        )
        RETURNING *
      `;
      try {
        await sql`
          INSERT INTO operative_purchase_messages (
            id,
            case_id,
            sender_role,
            body,
            proof_name,
            proof_mime,
            proof_data,
            created_at
          ) VALUES (
            ${initialMessage.id},
            ${purchaseCase.id},
            ${initialMessage.senderRole},
            ${initialMessage.body},
            ${initialMessage.proofName},
            ${initialMessage.proofMime},
            ${initialMessage.proofData},
            ${initialMessage.createdAt}
          )
        `;
      } catch (error) {
        await sql`DELETE FROM operative_purchase_cases WHERE id = ${purchaseCase.id}`;
        throw error;
      }
      return mapPurchaseCase(rows[0]);
    }

    localDatabase.purchaseCases[purchaseCase.id] = { ...purchaseCase, creditsGranted: 0, closed: false, resolvedAt: null, closedAt: null };
    localDatabase.purchaseMessages[initialMessage.id] = { ...initialMessage, caseId: purchaseCase.id };
    saveLocalDatabase();
    return localDatabase.purchaseCases[purchaseCase.id];
  }

  async function listPurchaseCasesForUser(userId) {
    if (sql) {
      const rows = await sql`
        SELECT *
        FROM operative_purchase_cases
        WHERE user_id = ${userId}
        ORDER BY updated_at DESC
      `;
      return rows.map(mapPurchaseCase);
    }
    return Object.values(localDatabase.purchaseCases)
      .filter(item => item.userId === userId)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async function findPurchaseCaseForUser(caseId, userId) {
    if (sql) {
      const rows = await sql`
        SELECT *
        FROM operative_purchase_cases
        WHERE id = ${caseId} AND user_id = ${userId}
        LIMIT 1
      `;
      return mapPurchaseCase(rows[0]);
    }
    const purchaseCase = localDatabase.purchaseCases[caseId];
    return purchaseCase?.userId === userId ? purchaseCase : null;
  }

  async function findPurchaseCaseById(caseId) {
    if (sql) {
      const rows = await sql`
        SELECT purchase_case.*, account.email AS user_email
        FROM operative_purchase_cases AS purchase_case
        JOIN operative_accounts AS account ON account.id = purchase_case.user_id
        WHERE purchase_case.id = ${caseId}
        LIMIT 1
      `;
      return mapPurchaseCase(rows[0]);
    }
    const purchaseCase = localDatabase.purchaseCases[caseId];
    if (!purchaseCase) return null;
    return { ...purchaseCase, userEmail: localDatabase.users[purchaseCase.userId]?.email || null };
  }

  async function listAllPurchaseCases() {
    if (sql) {
      const rows = await sql`
        SELECT purchase_case.*, account.email AS user_email
        FROM operative_purchase_cases AS purchase_case
        JOIN operative_accounts AS account ON account.id = purchase_case.user_id
        ORDER BY
          CASE WHEN purchase_case.closed_at IS NULL THEN 0 ELSE 1 END,
          purchase_case.updated_at DESC
      `;
      return rows.map(mapPurchaseCase);
    }
    return Object.values(localDatabase.purchaseCases)
      .map(item => ({ ...item, userEmail: localDatabase.users[item.userId]?.email || null }))
      .sort((a, b) => Number(a.closed) - Number(b.closed) || new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async function listPurchaseMessages(caseId) {
    if (sql) {
      const rows = await sql`
        SELECT *
        FROM operative_purchase_messages
        WHERE case_id = ${caseId}
        ORDER BY created_at ASC
      `;
      return rows.map(mapPurchaseMessage);
    }
    return Object.values(localDatabase.purchaseMessages)
      .filter(message => message.caseId === caseId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  async function addPurchaseMessage(message) {
    if (sql) {
      const rows = await sql`
        INSERT INTO operative_purchase_messages (
          id,
          case_id,
          sender_role,
          body,
          proof_name,
          proof_mime,
          proof_data,
          created_at
        ) VALUES (
          ${message.id},
          ${message.caseId},
          ${message.senderRole},
          ${message.body},
          ${message.proofName},
          ${message.proofMime},
          ${message.proofData},
          ${message.createdAt}
        )
        RETURNING *
      `;
      await sql`
        UPDATE operative_purchase_cases
        SET updated_at = ${message.createdAt}
        WHERE id = ${message.caseId}
      `;
      return mapPurchaseMessage(rows[0]);
    }
    localDatabase.purchaseMessages[message.id] = message;
    const purchaseCase = localDatabase.purchaseCases[message.caseId];
    if (purchaseCase) purchaseCase.updatedAt = message.createdAt;
    saveLocalDatabase();
    return message;
  }

  async function decidePurchaseCase(caseId, action, credits = 0) {
    if (sql) {
      if (action === 'grant') {
        const rows = await sql`
          WITH decided AS (
            UPDATE operative_purchase_cases
            SET
              status = 'approved',
              credits_granted = ${credits},
              resolved_at = NOW(),
              updated_at = NOW()
            WHERE id = ${caseId}
              AND status <> 'approved'
              AND closed_at IS NULL
            RETURNING *
          ), credited AS (
            UPDATE operative_accounts
            SET credits = operative_accounts.credits + ${credits}, updated_at = NOW()
            FROM decided
            WHERE operative_accounts.id = decided.user_id
            RETURNING operative_accounts.credits
          )
          SELECT decided.*, credited.credits AS account_credits
          FROM decided
          JOIN credited ON TRUE
        `;
        if (!rows[0]) return null;
        return { purchaseCase: mapPurchaseCase(rows[0]), accountCredits: Number(rows[0].account_credits || 0) };
      }

      if (action === 'deny') {
        const rows = await sql`
          UPDATE operative_purchase_cases
          SET status = 'denied', resolved_at = NOW(), updated_at = NOW()
          WHERE id = ${caseId}
            AND status <> 'approved'
            AND closed_at IS NULL
          RETURNING *
        `;
        return rows[0] ? { purchaseCase: mapPurchaseCase(rows[0]), accountCredits: null } : null;
      }

      if (action === 'close') {
        const rows = await sql`
          UPDATE operative_purchase_cases
          SET closed_at = COALESCE(closed_at, NOW()), updated_at = NOW()
          WHERE id = ${caseId} AND closed_at IS NULL
          RETURNING *
        `;
        return rows[0] ? { purchaseCase: mapPurchaseCase(rows[0]), accountCredits: null } : null;
      }
      return null;
    }

    const purchaseCase = localDatabase.purchaseCases[caseId];
    if (!purchaseCase) return null;
    const now = new Date().toISOString();
    if (action === 'grant') {
      if (purchaseCase.status === 'approved' || purchaseCase.closed) return null;
      const user = localDatabase.users[purchaseCase.userId];
      if (!user) return null;
      user.credits = Number(user.credits || 0) + credits;
      user.updatedAt = now;
      purchaseCase.status = 'approved';
      purchaseCase.creditsGranted = credits;
      purchaseCase.resolvedAt = now;
      purchaseCase.updatedAt = now;
      saveLocalDatabase();
      return { purchaseCase, accountCredits: user.credits };
    }
    if (action === 'deny') {
      if (purchaseCase.status === 'approved' || purchaseCase.closed) return null;
      purchaseCase.status = 'denied';
      purchaseCase.resolvedAt = now;
      purchaseCase.updatedAt = now;
    } else if (action === 'close') {
      if (purchaseCase.closed) return null;
      purchaseCase.closed = true;
      purchaseCase.closedAt = purchaseCase.closedAt || now;
      purchaseCase.updatedAt = now;
    } else {
      return null;
    }
    saveLocalDatabase();
    return { purchaseCase, accountCredits: null };
  }

  return {
    initialize,
    findUserByEmail,
    findUserById,
    findUserByFriendCode,
    createUser,
    setUsername,
    createSession,
    findSession,
    deleteSession,
    reserveEmailVerification,
    findEmailVerification,
    consumeEmailVerification,
    generateFriendCode,
    createPurchaseIntent,
    createPurchaseCase,
    listPurchaseCasesForUser,
    findPurchaseCaseForUser,
    findPurchaseCaseById,
    listAllPurchaseCases,
    listPurchaseMessages,
    addPurchaseMessage,
    decidePurchaseCase,
    get isPersistent() {
      return Boolean(sql);
    },
    get isReady() {
      return ready;
    },
    get error() {
      return initializationError;
    }
  };
}
