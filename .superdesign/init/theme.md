# Unpaused hub update — September 2026

The new independent homepage is `src/index.html`, styled by `src/hub.css` and controlled by `src/hub.js`. The games now live at `/worldloom/` and `/tacticstrike/`; the latter is `src/tacticstrike/index.html` with the existing `src/main.js` and `src/style.css`. No Worldloom iframe or promotion remains inside the shooter. The hub uses a white 50/50 split, full game footage, a compact UNPAUSED wordmark and original N favicon. Unpaused is the shared hub identity. The existing game interface details below are historical context. No shared layout components are required for this new target.

# Theme

## Compact token summary

- Framework: vanilla HTML/CSS/ES modules, built with Vite.
- Worldloom fonts: UI currently `Inter/system-ui`; inventory uses `Consolas, Courier New, monospace`; legacy title uses Georgia. Redesign should use the inventory's crisp monospace for controls and an original block-hewn display treatment using system-safe fonts, without importing Minecraft assets/fonts.
- Worldloom base colors: ink `#f4f0dd`; night `#040a08` / `#07130f`; moss `#214b35` / `#4f9461` / `#9ed582`; gold `#d8a953` / `#f4d78a`; danger `#d76959`; water `#4da6ad`.
- Approved inventory surface: panel `#c6c6c6`; recessed area `#9c9c9c`; slots `#8b8b8b`; highlight bevel `#f3f3f3/#eeeeee`; shadow bevel `#555`; text `#222/#555`; square radius `1–3px`.
- New 3D menu/HUD direction: layered block faces, 3–4px light top/left bevel and dark right/bottom bevel, inset wells, subtle 2–4px pressed motion, no glassmorphism, no soft pill cards, no decorative gradients unrelated to materials.
- Spacing: 2/4/8/10/14/18/22/30px; compact controls but comfortable 44px minimum hit target.
- Motion: 100–180ms press/hover, translateY 1–3px, reduced-motion mode disables nonessential movement.
- Breakpoints: menu/inventory adapt near 860px, 620px, and 520px.
- TacticStrike portal: near-black `#08090c`, gold `#d4af37`, teal/green Worldloom accent. Enter Battlefield modal must receive the existing gold custom scrollbar behavior.

## Raw source locations

The complete production token and component source is intentionally retained in the repository rather than duplicated into this discovery file:

- `src/public/worldloom/styles.css`: complete Worldloom tokens and all menu/HUD/inventory/dialog rules.
- `src/style.css`: complete TacticStrike tokens, modal system, custom scrollbar rules, and Worldloom portal card.
- `src/public/worldloom/index.html`: semantic markup for every game UI surface.

Critical current declarations:

```css
:root {
  --ink: #f4f0dd;
  --night-950: #040a08;
  --night-900: #07130f;
  --moss-500: #4f9461;
  --moss-300: #9ed582;
  --gold-500: #d8a953;
  --gold-300: #f4d78a;
  --danger: #d76959;
}

.inventory-window.surface-panel {
  border: 4px solid;
  border-color: #f3f3f3 #555 #555 #f3f3f3;
  border-radius: 3px;
  background: #c6c6c6;
  box-shadow: 0 18px 65px rgba(0,0,0,.64), inset 2px 2px #8b8b8b, inset -2px -2px #9a9a9a;
  color: #2a2a2a;
}

.inventory-slot {
  border: 2px solid;
  border-color: #555 #eee #eee #555;
  border-radius: 0;
  background: #8b8b8b;
}
```
