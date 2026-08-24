# Worldloom bird texture source

`gpt-bird-breeds-source.png` is the preserved 1254×1254 transparent GPT Image
source for Worldloom's two original small bird breeds: the woodland Ash Sparrow
and pond-dwelling Pond Azurefin.

`tools/generate_bird_assets.py` deterministically samples each half of that
source into a compact 128×64 RGBA nearest-filtered atlas, builds the two Blender
models, authors their named transform-animation clips, embeds the atlas in one
self-contained GLB, and optionally renders a QA still. No downloaded model,
texture, rig, or animation is used.

Generated production files:

- `src/public/worldloom/assets/birds/worldloom-birds-atlas.png`
- `src/public/worldloom/assets/birds/worldloom-birds.glb`
- `outputs/worldloom-birds-qa.png` (development QA only)

Reproduce with Blender 5.2.0 LTS from the repository root:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --factory-startup `
  --python tools/generate_bird_assets.py -- `
  --source tools/assets/bird-textures/gpt-bird-breeds-source.png `
  --atlas src/public/worldloom/assets/birds/worldloom-birds-atlas.png `
  --output src/public/worldloom/assets/birds/worldloom-birds.glb `
  --preview outputs/worldloom-birds-qa.png --seed 250825
```

The GLB deliberately uses a rigid, articulated hierarchy rather than a dense
deforming skin. Each breed has stable body, head, tail, left/right wing and
left/right leg nodes. This matches the game's voxel language, preserves hard
silhouettes during wing motion, and keeps rare ambient birds inexpensive.
