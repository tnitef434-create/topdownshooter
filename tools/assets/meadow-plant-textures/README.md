# Worldloom meadow-plant texture sources

`gpt-sunflower-atlas-source.png` and `gpt-short-grass-atlas-source.png` are the
preserved built-in GPT Image production sources for Worldloom's Blender-authored
sunflower and short-grass models. Their exact prompts are recorded in
`PROMPTS.md`.

The game-ready `meadow-plants-atlas.png` is an opaque 128×64 nearest-sampled
derivative stored in `src/public/worldloom/assets/environment`. Its left 64×64
half contains the sunflower's yellow petal, brown seed-head, green stem, and
green leaf materials. Its right 64×64 half contains four short-grass greens.
The Blender generator packs that one atlas into the GLB without using alpha
cutouts.

## Regeneration

Run from the repository root with Blender 5.2.0 LTS:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --factory-startup `
  --python tools/generate_meadow_plants.py -- `
  --atlas src/public/worldloom/assets/environment/meadow-plants-atlas.png `
  --output src/public/worldloom/assets/environment/meadow-plants.glb `
  --preview outputs/meadow-plants-qa.png
```

Omit `--preview` when only the production GLB is required. The output contains
stable `Sunflower_Asset` and `Short_Grass_Asset` roots beneath
`Meadow_Plant_Asset_Pack`, one embedded atlas/material, opaque textured
geometry, nearest filtering, and no Draco dependency.
