import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

function createEmptyLocalDatabase() {
  return { version: 2, users: {}, emailIndex: {}, sessions: {}, purchaseIntents: {} };
}

function mapDatabaseUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    password: {
      algorithm: row.password_algorithm,
      salt: row.password_salt,
      hash: row.password_hash
    },
    credits: Number(row.credits || 0),
    purchasedWeapons: Array.isArray(row.purchased_weapons) ? row.purchased_weapons : [],
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

function duplicateEmailError() {
  const error = new Error('An account already exists for this email.');
  error.code = 'DUPLICATE_EMAIL';
  return error;
}

export function createAccountStore({ databaseUrl = '', localFile }) {
  const sql = databaseUrl ? neon(databaseUrl) : null;
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
        purchaseIntents: parsed.purchaseIntents || {}
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
      await sql`
        CREATE TABLE IF NOT EXISTS operative_sessions (
          token_hash TEXT PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES operative_accounts(id) ON DELETE CASCADE,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

  async function createUser(user) {
    if (sql) {
      try {
        const rows = await sql`
          INSERT INTO operative_accounts (
            id,
            email,
            display_name,
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
        if (error?.code === '23505') throw duplicateEmailError();
        throw error;
      }
    }

    if (localDatabase.emailIndex[user.email]) throw duplicateEmailError();
    localDatabase.users[user.id] = user;
    localDatabase.emailIndex[user.email] = user.id;
    saveLocalDatabase();
    return user;
  }

  async function createSession(tokenHash, userId, expiresAt) {
    if (sql) {
      await sql`
        INSERT INTO operative_sessions (token_hash, user_id, expires_at)
        VALUES (${tokenHash}, ${userId}, ${new Date(expiresAt).toISOString()})
      `;
      return;
    }
    localDatabase.sessions[tokenHash] = { userId, expiresAt };
    saveLocalDatabase();
  }

  async function findSession(tokenHash) {
    if (sql) {
      const rows = await sql`
        SELECT token_hash, user_id, expires_at
        FROM operative_sessions
        WHERE token_hash = ${tokenHash}
        LIMIT 1
      `;
      const row = rows[0];
      if (!row) return null;
      return {
        tokenHash: row.token_hash,
        userId: row.user_id,
        expiresAt: new Date(row.expires_at).getTime()
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

  return {
    initialize,
    findUserByEmail,
    findUserById,
    createUser,
    createSession,
    findSession,
    deleteSession,
    createPurchaseIntent,
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
