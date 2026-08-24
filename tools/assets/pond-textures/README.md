# Pond texture sources

`gpt-lily-pad-source.png` and `gpt-lily-flower-source.png` are the preserved
high-resolution GPT Image outputs used to author the in-game pond atlas.

The production `pond-lily-atlas.png` is deliberately reduced to a 64×64 RGBA
nearest-filtered texture. Its top-left 32×32 tile is the pad top and its
top-right 32×32 tile is the crossed-plane blossom. The bottom row contains four
opaque 16×32 swatches for the pad edge, underside, stem, and flower core.
Blender embeds the atlas in `pond-details.glb`; no runtime texture request is
required.

From the repository root, the reproducible Blender 5.2 command is:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background `
  --python tools/generate_pond_assets.py -- `
  --output src/public/worldloom/assets/environment/pond-details.glb `
  --atlas src/public/worldloom/assets/environment/pond-lily-atlas.png `
  --preview outputs/pond-lily-qa.png --seed 240824 --flies 5 --flower --animate
```
