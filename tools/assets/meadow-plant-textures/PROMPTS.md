# GPT Image v2 concept-reference prompts

The two v2 images in this directory were generated with the built-in GPT Image
tool on 2026-08-27. The prompts below are preserved verbatim. Both PNGs are
concept-only visual references: the game never samples them at runtime. The
shipped plant colours and silhouettes are deterministic, hand-authored
crossed vertex-colour voxel reliefs in `tools/generate_meadow_plants.py`.

## Sunflower concept reference

Source: `gpt-pixel-sunflower-reference-v2.png`

```text
Use case: stylized-concept
Asset type: visual reference sprite for a Blender-authored voxel-relief survival-game plant
Input images: Image 1 is a style reference only for pixel scale, chunky voxel silhouette, and restrained flat palette; do not copy its red flower design
Primary request: create one original yellow sunflower as an unmistakably hard-edged 16 by 16 pixel sprite that can be transcribed one pixel at a time into voxel relief geometry
Scene/backdrop: genuinely transparent background, no ground and no scene
Subject: one front-facing sunflower with a dark brown square seed head, chunky golden-yellow petals, a short green stem, and two blocky leaves; stem reaches the bottom edge
Style/medium: deliberately low-resolution game sprite, exactly aligned to a 16 by 16 square-pixel grid, same large block scale and simple palette discipline as Image 1
Composition/framing: single centered full plant, almost fills the 16 by 16 grid, readable silhouette
Color palette: at most 8 flat colours total: dark and mid brown, dark/mid/light yellow, dark/mid/light green
Constraints: every edge follows the 16 by 16 grid; large square pixels; no subpixel details; no smooth curves; no gradients; no antialiasing; no outlines; no texture noise; no shadows; no lighting; no 3D render; no text; no logo; no watermark
Avoid: realistic sunflower photography, painterly pixels, tiny high-resolution mosaic, red petals, soft edges, diagonal antialiased edges
```

## Short-grass concept reference

Source: `gpt-pixel-grass-reference-v2.png`

```text
Use case: stylized-concept
Asset type: visual reference sprite for a Blender-authored voxel-relief survival-game plant
Input images: Image 1 is a style reference only for pixel scale, chunky voxel silhouette, and restrained flat palette; do not copy its flower shape
Primary request: create one original short meadow grass tuft as an unmistakably hard-edged 16 by 16 pixel sprite that can be transcribed one pixel at a time into voxel relief geometry
Scene/backdrop: genuinely transparent background, no ground and no scene
Subject: a dense low tuft of several upright and slightly angled blocky grass blades, with a broad base and irregular heights, no flower
Style/medium: deliberately low-resolution game sprite, exactly aligned to a 16 by 16 square-pixel grid, same large block scale and simple palette discipline as Image 1
Composition/framing: single centered tuft occupying the lower two-thirds of the grid, strong readable silhouette
Color palette: at most 5 flat greens: deep forest, dark meadow, mid green, light green, muted olive
Constraints: every edge follows the 16 by 16 grid; large square pixels; no subpixel details; no smooth curves; no gradients; no antialiasing; no outlines; no texture noise; no shadows; no lighting; no 3D render; no text; no logo; no watermark
Avoid: realistic grass, thin smooth blades, painterly pixels, tiny high-resolution mosaic, flowers, soft edges, diagonal antialiased edges
```
