# Shared Worldloom worlds

The game uses the existing Render backend and PostgreSQL account database. `unpaused_worlds` is created by an idempotent startup migration; no new credentials or services are required.

- Ten owner slots are enforced by a PostgreSQL unique constraint, including concurrent creation requests.
- One optional guest is identified by a permanent friend code. Only that account can accept the invitation. Shared worlds do not consume the guest’s ownership quota.
- Socket.IO’s `/worldloom` namespace authenticates verified account sessions and admits only the two members. A second tab for the same account replaces its prior connection.
- Block edits are ordered and acknowledged after a durable database write. Compare-and-swap revisions prevent stale saves from overwriting newer data. Request receipts make retries idempotent. Conflicting edits restore the authoritative snapshot.
- Inventory, survival state and position are saved separately per member. Dropped-item collection is atomic, so two players cannot collect the same stack. Explicit Save and Leave waits for acknowledgement; unacknowledged edits trigger the browser’s leave protection.
- Player movement is predicted locally and sent at up to 20 updates per second; remote avatars interpolate a short buffer. Movement, held equipment, swimming, head direction, headlamp and nametags use the existing Blender-authored character assets. Pickaxes use the combined authored arm/tool geometry.
- One connected player advances pigs and fluids; the role moves to the remaining member when that connection leaves. Ecological snapshots and terrain changes are shared and persisted. Deterministic flower placement can materialize near either player. Cosmetic particles and ambient fish animation are rendered locally. This is a two-player co-op implementation, not a competitive anti-cheat server or a zero-latency guarantee.
- Existing browser saves remain untouched. The account’s Worlds tab can explicitly copy the old world, player state and loose items into a new account slot.
- The current deployment is one Render process. Scaling to multiple backend processes requires a shared Socket.IO adapter and a distributed simulation lease. The database revision checks already prevent stale document writes.

Run `npm test` for the 202 existing unit regressions and the four multiplayer suites (which include actual PostgreSQL via PGlite and two socket clients). The multiplayer suites run in a separate test process because the legacy WebGL tests install browser globals.

`npm run test:multiplayer:browser` uses two isolated private Chrome contexts and a local test email outbox. It covers world creation and invitation through the real menu, joining from the account, visible avatars, bidirectional edits, independent inventories, owner-offline play and reconnect. Never point this test at production or a real email provider.
