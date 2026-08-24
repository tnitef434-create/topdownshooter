# Hanging-leaf texture source

`gpt-hanging-leaves-source-v2.png` is the preserved 1254×1254 transparent
built-in GPT-image output used by Worldloom's revised hanging-tree-leaf atlas.
It was generated against an in-game Ashleaf canopy screenshot, and has OpenAI
C2PA provenance. `tools/generate_hanging_leaves.py` deterministically extracts
its silhouette and maps every opaque pixel onto the exact five-colour Ashleaf
palette from `blocks.js`. No downloaded third-party texture is used.

`gpt-hanging-leaves-source.png` is retained as the non-destructive v1 source.

The generated files are:

- `src/public/worldloom/assets/environment/hanging-tree-leaves-atlas.png`
- `src/public/worldloom/assets/environment/hanging-tree-leaves.glb`
- `outputs/hanging-tree-leaves-qa.png` (development QA only)

Regenerate from the repository root with Blender 5.2:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --factory-startup `
  --python tools/generate_hanging_leaves.py -- `
  --source tools/assets/hanging-leaves-textures/gpt-hanging-leaves-source-v2.png `
  --atlas src/public/worldloom/assets/environment/hanging-tree-leaves-atlas.png `
  --output src/public/worldloom/assets/environment/hanging-tree-leaves.glb `
  --preview outputs/hanging-tree-leaves-qa.png --seed 240824
```

The exact generation prompt is preserved in `PROMPTS.md`.
