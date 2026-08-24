# Worldloom block-built interface system

## Product and jobs

Worldloom is an original first-person voxel survival/building game launched inside TacticStrike. Players create or continue a world, gather and craft, track objectives/time, pause/save safely, and change performance settings. The interface must feel authored for the world: tactile, legible, fast, and game-like—not a generic web dashboard.

## Required surfaces

- Main menu: Continue, seed input, Wayfarer/Dreamweaver mode choice, New World, Settings, Credits, control help.
- Escape menu: Resume, Save, Settings, Save & Leave.
- Gameplay HUD: objective, day/time, status, crosshair, target, hotbar.
- Existing inventory/crafting panel: visual source of truth.
- TacticStrike Enter Battlefield: custom-scrollable modal and a prominent Worldloom update promotion/launcher.

## Visual language

Build an original block-hewn survival-game UI heavily inspired by tactile voxel crafting interfaces, without copying proprietary logos, textures, fonts, wording, or exact screen composition. Match the existing inventory's material logic:

- Square grey stone/iron panels, 3–4px top/left highlight bevel, 3–4px right/bottom shadow bevel.
- Recessed dark-grey wells for inputs, selections, and secondary surfaces.
- Buttons read as raised blocks and move down 2px when pressed; selected modes read as inset slots.
- Crisp `Consolas, Courier New, monospace` labels and small uppercase utility captions. No serif display font.
- Minimal rounding (0–3px). Never use glassmorphism, floating translucent pills, neon glows, generic gradients, or excessive shadows.
- Use moss green only for positive/primary actions, warm ochre for New World/objective accents, muted red only for destructive Save & Leave.
- Background can show the live 3D world or an original CSS voxel panorama with a dark scrim for contrast.

## Tokens

- Panel face `#c6c6c6`; panel highlight `#f3f3f3`; panel mid `#9c9c9c`; panel shadow `#555555`; slot `#8b8b8b`.
- Text on light panels `#242424`; secondary `#555555`; light edge text `#f4f0dd`.
- Primary moss `#4f7d42`; hover `#629552`; selected dark moss `#355c31`.
- Objective ochre `#b78332`; destructive `#8d3f35`; outer scrim `rgba(0,0,0,.58)`.
- Spacing scale 2, 4, 8, 10, 14, 18, 22, 30px; hit targets at least 44px.

## Component rules

- Main menu uses one visually coherent 3D panel, with brand plate attached to it rather than a separate floating marketing hero.
- Pause menu is a compact centered block panel; the world remains visible behind a non-blurred dark scrim.
- Objective and time are small raised rectangular plates, not rounded glass cards. Keep text readable at 1280×720 and 320×640.
- Inventory remains unchanged except for any shared token alignment; its slot geometry is the reference.
- Settings and long modal regions use a custom beveled scrollbar: square dark track, raised grey/gold thumb, clear hover state, Firefox `scrollbar-color` fallback.
- Motion is functional: 100–160ms hover/press, no ambient UI bobbing, respect reduced motion.
- Preserve current DOM IDs and accessible labels so existing behavior/tests continue working.

## Performance and responsive constraints

- Prefer CSS backgrounds/borders over image assets and filters.
- Avoid `backdrop-filter` on full-screen overlays and frequently repainted HUD elements.
- Avoid large animated box shadows.
- At ≤620px, panels fill most width, controls stay 44px tall, objective/time remain on one row when possible and stack only if necessary.
