import { randomUUID } from 'node:crypto';

export async function initializeGoogleAccountSchema(sql) {
  await sql`ALTER TABLE operative_accounts ADD COLUMN IF NOT EXISTS google_subject TEXT`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS operative_accounts_google_subject_idx ON operative_accounts(google_subject) WHERE google_subject IS NOT NULL`;
}

function accountError(code, message) {
  return Object.assign(new Error(message), { code });
}

const googleOnlyPassword = () => ({ algorithm: 'google', salt: '', hash: '' });

// Called only with claims validated by google-auth.js. Keep the subject binding
// atomic: an email address can change, but a Google subject identifies one user.
export function createGoogleAccountStore({ sql, getLocalDatabase, saveLocalDatabase, mapDatabaseUser }) {
  async function findSubject(subject) {
    if (sql) {
      const rows = await sql`SELECT * FROM operative_accounts WHERE google_subject = ${subject} LIMIT 1`;
      return mapDatabaseUser(rows[0]);
    }
    return Object.values(getLocalDatabase().users).find(user => user.googleSubject === subject) || null;
  }

  async function findOrCreateGoogleUser({ subject, email, emailAuthoritative, emailVerifiedAt }) {
    if (typeof subject !== 'string' || !subject || subject.length > 255 ||
        typeof email !== 'string' || !email.includes('@') || email.length > 254 ||
        !Number.isFinite(Date.parse(emailVerifiedAt))) {
      throw accountError('INVALID_GOOGLE_IDENTITY', 'Invalid Google identity.');
    }
    email = email.trim().toLowerCase();
    // Do not await the local read: one synchronous mutation covers concurrent
    // requests in the file-backed development store.
    const known = sql ? await findSubject(subject) :
      Object.values(getLocalDatabase().users).find(user => user.googleSubject === subject);
    if (known) return known;
    if (emailAuthoritative !== true) {
      throw accountError('GOOGLE_EMAIL_VERIFICATION_REQUIRED', 'Use email sign-in for this Google account. Google cannot currently verify ownership of this email address.');
    }

    if (sql) {
      try {
        const inserted = await sql`
          INSERT INTO operative_accounts (
            id, email, display_name, password_algorithm, password_salt,
            password_hash, google_subject, email_verified_at
          ) VALUES (${randomUUID()}, ${email}, 'Guest', 'google', '', '', ${subject}, ${emailVerifiedAt})
          ON CONFLICT DO NOTHING RETURNING *
        `;
        if (inserted[0]) return mapDatabaseUser(inserted[0]);
        const bound = await findSubject(subject);
        if (bound) return bound;
        // A fresh statement sees any account inserted concurrently with our
        // first lookup. Lock that row before examining its old verification
        // state, so pending credentials cannot escape adoption cleanup.
        const rows = await sql`
          WITH candidate AS MATERIALIZED (
            SELECT * FROM operative_accounts
            WHERE email = ${email}
              AND (google_subject IS NULL OR google_subject = ${subject})
            FOR UPDATE
          ), authenticated AS (
            UPDATE operative_accounts SET
              google_subject = ${subject},
              email_verified_at = COALESCE(operative_accounts.email_verified_at, ${emailVerifiedAt}::timestamptz),
              password_algorithm = CASE WHEN operative_accounts.email_verified_at IS NULL THEN 'google' ELSE operative_accounts.password_algorithm END,
              password_salt = CASE WHEN operative_accounts.email_verified_at IS NULL THEN '' ELSE operative_accounts.password_salt END,
              password_hash = CASE WHEN operative_accounts.email_verified_at IS NULL THEN '' ELSE operative_accounts.password_hash END,
              updated_at = NOW()
            FROM candidate
            WHERE operative_accounts.id = candidate.id
              AND (operative_accounts.google_subject IS NULL OR operative_accounts.google_subject = ${subject})
            RETURNING operative_accounts.*
          ), revoked_sessions AS (
            DELETE FROM operative_sessions USING authenticated, candidate
            WHERE operative_sessions.user_id = authenticated.id AND candidate.id = authenticated.id
              AND candidate.email_verified_at IS NULL
          ), revoked_verifications AS (
            DELETE FROM operative_email_verifications USING authenticated, candidate
            WHERE operative_email_verifications.user_id = authenticated.id AND candidate.id = authenticated.id
              AND candidate.email_verified_at IS NULL
          ), revoked_resets AS (
            DELETE FROM operative_password_resets USING authenticated, candidate
            WHERE operative_password_resets.user_id = authenticated.id AND candidate.id = authenticated.id
              AND candidate.email_verified_at IS NULL
          ) SELECT * FROM authenticated
        `;
        if (rows[0]) return mapDatabaseUser(rows[0]);
      } catch (error) {
        if (error.code !== '23505') throw error;
        // Another request may have bound this subject while we were looking up
        // its email. Return that account, never move it to the new email.
        const winner = await findSubject(subject);
        if (winner) return winner;
      }
      const winner = await findSubject(subject);
      if (winner) return winner;
      throw accountError('GOOGLE_ACCOUNT_CONFLICT', 'This email is already linked to another Google account.');
    }

    const database = getLocalDatabase();
    let user = database.users[database.emailIndex[email]];
    if (user?.googleSubject && user.googleSubject !== subject) {
      throw accountError('GOOGLE_ACCOUNT_CONFLICT', 'This email is already linked to another Google account.');
    }
    const now = new Date().toISOString();
    if (user) {
      if (!user.emailVerifiedAt) {
        user.password = googleOnlyPassword();
        for (const [token, session] of Object.entries(database.sessions)) {
          if (session.userId === user.id) delete database.sessions[token];
        }
        if (database.emailVerifications) delete database.emailVerifications[user.id];
        if (database.passwordResets) delete database.passwordResets[user.id];
        user.emailVerifiedAt = emailVerifiedAt;
      }
      user.googleSubject = subject;
      user.updatedAt = now;
    } else {
      user = {
        id: randomUUID(), email, displayName: 'Guest', username: null,
        password: googleOnlyPassword(), googleSubject: subject,
        emailVerifiedAt, friendCode: null, credits: 0, purchasedWeapons: [],
        createdAt: now, updatedAt: now
      };
      database.users[user.id] = user;
      database.emailIndex[email] = user.id;
    }
    saveLocalDatabase();
    return user;
  }

  return { findOrCreateGoogleUser };
}
