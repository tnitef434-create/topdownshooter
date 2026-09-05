import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

export const worldError = (message, status = 400) => Object.assign(new Error(message), { status });
export const isWorldMember = (world, userId) => world && (world.ownerId === userId || (world.guestId === userId && world.accepted));
const copy = value => structuredClone(value);

// A slot constraint enforces the ten-world limit even for concurrent requests.
// Revisions are compared in PostgreSQL, so an old server snapshot cannot replace
// a newer save. Local storage is used only for development and automated tests.
export function createWorldStore({ databaseUrl = '', sqlClient = null, localFile }) {
  const sql = sqlClient || (databaseUrl ? neon(databaseUrl) : null);
  let local = {}, ready = false;
  const queues = new Map();
  function persist() {
    fs.mkdirSync(path.dirname(localFile), { recursive: true });
    fs.writeFileSync(localFile + '.tmp', JSON.stringify(local));
    fs.renameSync(localFile + '.tmp', localFile);
  }
  const map = row => row ? { ...row.document, id: row.id, ownerId: row.owner_id, slot: row.slot, revision: Number(row.revision) } : null;
  async function get(id) {
    if (!ready) throw worldError('World storage is starting. Try again shortly.', 503);
    if (sql) return map((await sql`SELECT * FROM unpaused_worlds WHERE id=${id}`)[0]);
    return local[id] ? copy(local[id]) : null;
  }
  async function list(userId) {
    if (sql) return (await sql`SELECT * FROM unpaused_worlds WHERE owner_id=${userId} OR document->>'guestId'=${userId} ORDER BY document->>'updatedAt' DESC`).map(map);
    return Object.values(local).filter(w => w.ownerId === userId || w.guestId === userId).map(copy).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
  }
  async function create(ownerId, input) {
    const now = new Date().toISOString();
    for (let slot = 0; slot < 10; slot++) {
      const world = { ...copy(input), id: randomUUID(), ownerId, slot, revision: 0, createdAt: now, updatedAt: now };
      if (sql) {
        const rows = await sql`INSERT INTO unpaused_worlds(id,owner_id,slot,revision,document) VALUES(${world.id},${ownerId},${slot},0,${JSON.stringify(world)}::jsonb) ON CONFLICT(owner_id,slot) DO NOTHING RETURNING *`;
        if (rows[0]) return map(rows[0]);
      } else if (!Object.values(local).some(w => w.ownerId === ownerId && w.slot === slot)) {
        local[world.id] = world; persist(); return copy(world);
      }
    }
    throw worldError('You already have 10 worlds. Delete one in your account to make room.', 409);
  }
  async function mutate(id, userId, change, { ownerOnly = false, invited = false } = {}) {
    const previous = queues.get(id) || Promise.resolve();
    const work = previous.catch(()=>{}).then(async () => {
      for (let attempt = 0; attempt < 8; attempt++) {
        const world = await get(id);
        if (!world || (ownerOnly ? world.ownerId !== userId : !isWorldMember(world,userId) && !(invited && world.guestId === userId))) throw worldError('This world is not available to your account.', 404);
        const next = copy(world);
        const result = change(next);
        next.revision++; next.updatedAt = new Date().toISOString();
        if (sql) {
          const rows = await sql`UPDATE unpaused_worlds SET document=${JSON.stringify(next)}::jsonb, revision=revision+1 WHERE id=${id} AND revision=${world.revision} RETURNING *`;
          if (rows[0]) return { world: map(rows[0]), result };
        } else { local[id] = next; persist(); return { world: copy(next), result }; }
      }
      throw worldError('The world is busy. Please retry.', 409);
    });
    queues.set(id,work);
    try { return await work; } finally { if (queues.get(id) === work) queues.delete(id); }
  }
  return {
    get isReady() { return ready; }, get isPersistent() { return Boolean(sql); },
    async initialize() {
      if (sql) await sql`CREATE TABLE IF NOT EXISTS unpaused_worlds(id UUID PRIMARY KEY, owner_id UUID NOT NULL REFERENCES operative_accounts(id) ON DELETE CASCADE, slot SMALLINT NOT NULL CHECK(slot BETWEEN 0 AND 9), revision BIGINT NOT NULL DEFAULT 0, document JSONB NOT NULL, UNIQUE(owner_id,slot))`;
      else if (fs.existsSync(localFile)) local = JSON.parse(fs.readFileSync(localFile,'utf8'));
      ready = true;
    }, get, list, create, mutate,
    async remove(id, ownerId) {
      // A tombstone first closes the room. No old mutation can resurrect a delete.
      await mutate(id,ownerId,w=>{w.deleted=true;},{ownerOnly:true});
      if (sql) await sql`DELETE FROM unpaused_worlds WHERE id=${id} AND owner_id=${ownerId}`;
      else { delete local[id]; persist(); }
    },
  };
}
