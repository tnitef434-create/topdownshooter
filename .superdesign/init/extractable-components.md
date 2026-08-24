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
