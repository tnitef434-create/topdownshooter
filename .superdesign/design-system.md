# Worldloom block-built interface system

## Unpaused hub — new independent homepage, September 2026

Unpaused is the shared game hub. The homepage fills the viewport with two game panels and a single white center divider. Each panel expands to roughly 62% on hover or keyboard focus. Use large original vector game wordmarks: beveled block lettering for Worldloom and slanted, angular lettering for TacticStrike. Both have solid PLAY NOW controls, with cream/moss on Worldloom and orange on TacticStrike. Keep the UNPAUSED brand compact at top-left. Remove decorative rules, genre captions, marketing paragraphs and circular arrows. Full-panel semantic links lead to /worldloom/ and /tacticstrike/. Worldloom's muted looping background is real first-person gameplay with the normal hand and walking movement; TacticStrike uses a captured match. Backgrounds must remain visible. Mobile stacks two equal-height panels with a white horizontal divider and 44px minimum play targets. Autoplay the muted video on entry as explicitly requested, including when Windows reduces motion. No playback control is shown; the user requested continuous playback. Limit decorative transitions for reduced motion and show the poster if video fails. Worldloom main menu has separate native 4K drone footage with an HD encode for phones; it pauses when gameplay begins. The hub never boots either game engine in the background. The Unpaused account button at top-right opens a native dialog for registration, sign-in and account details. TacticStrike links back to it and never displays the account email. Existing session storage stays compatible. The hub shows Players online beneath each game without a number, per user preference. A critically damped spring drives the divider and preserves velocity on hover reversal; fixed media dimensions keep the video from stretching. The intended new domain is unpaused.online. The older rules below describe Worldloom's separate in-game UI only.

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


Account verification: Resend sends a single-use, 30-minute email link. New accounts stay inactive until the inbox owner sets the final password. Existing credits and purchases remain intact. Verified accounts can generate one permanent, unique four-digit friend code (0000–9999) in the hub profile and copy it. No email addresses or friend-code generation controls appear inside TacticStrike. Resends are limited to one per minute and five per account per day. Canonical public domain: https://unpaused.online.

September 5 account and shared worlds update: visible hub branding is the custom U mark alone; retain the name in document titles, accessibility labels and email sender details. Use the existing cream U/orange play mark, black #090909 account surfaces and deep orange #e95128 actions. Signed-in account dialog has accessible Account / Worlds / Invites tabs. World cards show name, journey, friend/owner, Play and owner-only Delete with an inline irreversible-delete confirmation. Account worlds are persistent, with ten owned worlds and one invited friend per world; shared worlds do not consume the guest’s ownership quota. Existing browser saves can be copied explicitly to the account. The email header uses the U image with alt text for clients that block images.


## Worldloom entry and legibility — September 5, 2026

Use the original U mark on a #090909 loading screen. Its orange triangle follows the U from the right down around the base and up the left, then retraces its path. Inline SVG and CSS motion start before the game module downloads; the small loading indicator keeps moving even with reduced-motion settings, as explicitly requested. The hub paints the same screen on normal link activation and clears it on history restoration. The animated U is limited to entering the Worldloom or TacticStrike main menu. Creating, continuing or joining a Worldloom world uses a plain progress screen with no U. Visible branding uses the U, with Worldloom as the destination label.

The hub gameplay is captured natively at 1800 × 2000, 30 fps; phones and Save-Data use 900 × 1000. Encode directly from frames, with a seamless three-scene loop, H.264 faststart, and no intermediate lossy pass. The separate main-menu panorama remains native 4K.

Keep the grey beveled Worldloom menu, moss actions, and ochre new-world action. The invitation well uses explicit light text on charcoal. Labels are at least 12px, descriptions 13px, controls 14px, inputs 15px (16px on phones). Reduce heading shadows and letter compression. Use one menu scroll area rather than a nested clipped form; all actions remain reachable on narrow screens.
