# Shared layouts

## Worldloom standalone shell

Source: `src/public/worldloom/index.html`

The page is a fixed full-viewport `#game-shell` containing, in paint order:

```html
<main id="game-shell">
  <canvas id="game"></canvas>
  <section id="unsupported" class="system-message hidden">…</section>
  <section id="loading-screen" class="screen loading-screen">…</section>
  <section id="main-menu" class="screen menu-screen hidden">…</section>
  <section id="pause-menu" class="screen overlay-screen hidden">…</section>
  <section id="hud" class="hud hidden">…</section>
  <section id="inventory-panel" class="screen overlay-screen hidden">…</section>
  <section id="settings-panel" class="screen overlay-screen hidden">…</section>
  <section id="credits-panel" class="screen overlay-screen hidden">…</section>
  <div id="toast-layer"></div>
  <div id="damage-vignette"></div>
  <div id="water-overlay"></div>
</main>
```

Main-menu structure: full-screen world backdrop/scenery; left-aligned brand; one action panel with Continue, seed, two journey choices, New World, Settings, Credits; keyboard help beneath.

Pause structure: centered modal with Return to World, Save World, Settings, Save & Leave.

HUD structure: objective card top-left, time card top-right, crosshair center, status bars bottom-left, nine-slot hotbar bottom-center.

Inventory structure: large centered two-column grey beveled window; storage grid left and scrollable recipe book right. This is the visual source of truth for the redesign.

## TacticStrike portal shell

Source: `src/index.html`, `src/style.css`, and `src/main.js`.

The main site is a framework-free SPA with multiple `.screen` sections. `#deploy-modal` is the Enter Battlefield dialog. Inside it, `.worldloom-operation` advertises Worldloom and `#btn-play-worldloom` opens the lazy-loaded game in `#worldloom-site-screen` / `#worldloom-frame`.

Relevant production structure:

```html
<div id="deploy-modal" class="modal-overlay">
  <div class="modal-card deploy-card">
    <!-- match setup content -->
    <section class="worldloom-operation">
      <div class="worldloom-operation-copy">…</div>
      <button id="btn-play-worldloom" class="worldloom-launch-btn">…</button>
    </section>
  </div>
</div>
<section id="worldloom-site-screen" class="worldloom-site-screen">
  <div class="worldloom-site-toolbar">…</div>
  <div id="worldloom-frame-loading">…</div>
  <iframe id="worldloom-frame"></iframe>
</section>
```
