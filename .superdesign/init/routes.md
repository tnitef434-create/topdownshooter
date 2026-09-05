# Nite hub update — September 2026

The new independent homepage is `src/index.html`, styled by `src/hub.css` and controlled by `src/hub.js`. The games now live at `/worldloom/` and `/tacticstrike/`; the latter is `src/tacticstrike/index.html` with the existing `src/main.js` and `src/style.css`. No Worldloom iframe or promotion remains inside the shooter. The hub uses a white 50/50 split, full game footage, a compact NITE wordmark and original N favicon. Nite is the shared hub identity. The existing game interface details below are historical context. No shared layout components are required for this new target.

# Route map

The project uses Vite static entry points and imperative screen switching, not a router library.

| URL | Entry | Layout | Purpose |
| --- | --- | --- | --- |
| `/` | `src/index.html` + `src/main.js` | TacticStrike SPA shell | Main TacticStrike menu, matchmaking, Enter Battlefield modal, and embedded Worldloom launcher |
| `/worldloom/` | `src/public/worldloom/index.html` + `src/public/worldloom/src/main.js` | Worldloom full-screen shell | Standalone voxel-survival game, menus, HUD, inventory, settings |

Worldloom screen-state mapping in `src/public/worldloom/src/ui.js`:

- `#loading-screen`: initialization and world preparation.
- `#main-menu`: title/new/continue flow.
- `#pause-menu`: Escape overlay while playing.
- `#hud`: normal gameplay overlay.
- `#inventory-panel`: E-key inventory/crafting overlay.
- `#settings-panel`: shared settings dialog from title or pause.
- `#credits-panel`: title-screen credits.

TacticStrike opens Worldloom without a desktop download: `#btn-play-worldloom` assigns `./worldloom/index.html` to the iframe and activates `#worldloom-site-screen`.
