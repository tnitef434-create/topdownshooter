# Unpaused hub update — September 2026

The new independent homepage is `src/index.html`, styled by `src/hub.css` and controlled by `src/hub.js`. The games now live at `/worldloom/` and `/tacticstrike/`; the latter is `src/tacticstrike/index.html` with the existing `src/main.js` and `src/style.css`. No Worldloom iframe or promotion remains inside the shooter. The hub uses a white 50/50 split, full game footage, a compact UNPAUSED wordmark and original N favicon. Unpaused is the shared hub identity. The existing game interface details below are historical context. No shared layout components are required for this new target.

# Key pages and dependency trees

## `/worldloom/` — Worldloom game UI

Entry: `src/public/worldloom/index.html`

Dependencies:

- `src/public/worldloom/index.html`
  - `src/public/worldloom/styles.css`
  - `src/public/worldloom/src/main.js`
    - `src/public/worldloom/src/ui.js`
      - `src/public/worldloom/src/data.js`
      - `src/public/worldloom/src/save.js`
      - `src/public/worldloom/src/blocks.js`
      - `src/public/worldloom/src/item-art.js`
    - `src/public/worldloom/src/player.js`
    - `src/public/worldloom/src/world.js`
      - `src/public/worldloom/src/mesher.js`
      - `src/public/worldloom/src/noise.js`
    - `src/public/worldloom/src/environment.js`
    - `src/public/worldloom/src/graphics.js`
    - `src/public/worldloom/src/creatures.js`
    - `src/public/worldloom/src/audio.js`
    - `src/public/worldloom/src/viewmodel.js`
    - `src/public/worldloom/src/survival.js`
    - `src/public/worldloom/vendor/three.module.min.js`

Design target dependency subset: `index.html`, `styles.css`, and `ui.js`. `main.js` is needed only to preserve state/keyboard wiring and IDs, not as visual generation context.

## `/` — TacticStrike portal / Enter Battlefield

Entry: `src/index.html`

Dependencies:

- `src/index.html`
  - `src/style.css`
  - `src/main.js`
    - `src/game/Engine.js`
      - remaining `src/game/*.js` simulation modules

Design target dependency subset: deploy-modal markup in `src/index.html`, `.deploy-card` / `.worldloom-operation` / custom scrollbar rules in `src/style.css`, and the Worldloom iframe event wiring in `src/main.js`.
