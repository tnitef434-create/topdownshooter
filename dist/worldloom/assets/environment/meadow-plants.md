# Wind meadow

Original Blender 5.2 models: one square-pixel sunflower, six-blade short grass and nine-blade knee-high grass. `tools/generate_wind_meadow.py` builds the GLB and editable Blender project. The authoring script was executed in the desktop Blender Python Console; the plants were rendered and inspected there and in the browser.

The GLB is opaque vertex-coloured geometry with no textures, alpha cards or external dependencies. Grass blades have five bend segments and fixed ground roots. `meadow-wind.js` animates shared world-space gusts, local ripples, flower twist and nearby player displacement on the GPU. The sunflower shadow uses the same deformation. Reduced motion lowers wind strength.

Tall grass appears in occasional seeded fields over open turf, including existing saves. Fields cross chunk borders and disappear when supporting turf is removed or grazed. Runtime caps scale with graphics quality: up to 240 flowers, 1,200 short clumps and 3,200 tall clumps, in three instanced draws. Terrain coordinates and saved block IDs are unchanged.

For visual QA serve the repository root and open `tests/meadow-preview.html`.
