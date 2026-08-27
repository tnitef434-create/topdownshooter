# Worldloom meadow-plant concept references

`gpt-pixel-sunflower-reference-v2.png` and
`gpt-pixel-grass-reference-v2.png` are preserved GPT Image concept references
for the hard-pixel sunflower and short grass. Their exact generation prompts
are recorded verbatim in `PROMPTS.md`.

These v2 PNGs are concept-only. They are never sampled by the game, packed
into the GLB, copied into a runtime atlas, or loaded by the browser. Visual
details from the references are transcribed into deterministic, hand-authored
grids and fixed palettes in `tools/generate_meadow_plants.py`.

The production `meadow-plants.glb` follows the same visual and technical
contract as `red-flower.glb`:

- the sunflower is a hand-authored 16x16 sprite built as two crossed,
  extruded voxel reliefs;
- the short grass is a hand-authored 8x8 sprite built as two crossed,
  extruded voxel reliefs, with 29 occupied logical pixels measuring 0.048m
  each;
- colours are stored as flat per-face vertex colours in the GLB `COLOR_0`
  attribute;
- the shipped meshes are fully opaque and contain no UVs, runtime texture
  maps, alpha cutouts, smooth curves, or antialiased silhouettes.

## Regeneration

Run from the repository root with Blender 5.2:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --factory-startup `
  --python tools/generate_meadow_plants.py -- `
  --output src/public/worldloom/assets/environment/meadow-plants.glb `
  --preview outputs/meadow-plants-qa.png
```

Omit `--preview` when only the production GLB is required. The generated pack
contains stable `Sunflower_Asset` and `Short_Grass_Asset` roots beneath
`Meadow_Plant_Asset_Pack`, two instanced runtime meshes, deterministic crossed
vertex-colour voxel reliefs, and no texture or Draco dependency.
