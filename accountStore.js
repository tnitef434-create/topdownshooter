import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

function createEmptyLocalDatabase() {
  return {
    version: 3,
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
    createUser,
    createSession,
    findSession,
    deleteSession,
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
