# Nite hub update — September 2026

The new independent homepage is `src/index.html`, styled by `src/hub.css` and controlled by `src/hub.js`. The games now live at `/worldloom/` and `/tacticstrike/`; the latter is `src/tacticstrike/index.html` with the existing `src/main.js` and `src/style.css`. No Worldloom iframe or promotion remains inside the shooter. The hub uses a white 50/50 split, full game footage, a compact NITE wordmark and original N favicon. Nite is the shared hub identity. The existing game interface details below are historical context. No shared layout components are required for this new target.

# Extractable components

This is a static HTML project. There are no React/Vue layout components to convert into DraftComponents, so component extraction should be skipped for this target.

## WorldloomMenuShell
- Source: `src/public/worldloom/index.html` and `src/public/worldloom/styles.css`
- Category: layout
- Description: Main title, world setup form, controls, and backdrop.
- Extractable props if componentized later: `hasSave`, `selectedMode`, `seed`.
- Hardcoded: Worldloom name, control labels, semantic IDs, menu layout classes.

## WorldloomPausePanel
- Source: `src/public/worldloom/index.html`
- Category: layout
- Description: Escape menu with resume, save, settings, and leave actions.
- Extractable props if componentized later: `canSave`, `savePending`.
- Hardcoded: button labels and IDs used by `ui.js`.

## ObjectiveAndTimeHUD
- Source: `src/public/worldloom/index.html`
- Category: basic
- Description: Top-left current objective and top-right time/day display.
- Extractable props if componentized later: `objectiveText`, `timeText`.
- Hardcoded: semantic labels and IDs.

## WorldloomPortalCard
- Source: `src/index.html` and `src/style.css`
- Category: basic
- Description: Update/launch feature inside Enter Battlefield.
- Extractable props if componentized later: `headline`, `summary`, `versionLabel`.
- Hardcoded: play button ID and iframe path.
