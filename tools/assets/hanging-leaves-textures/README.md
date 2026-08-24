# Hanging-leaf texture source

`gpt-hanging-leaves-source.png` is the preserved 1254×1254 built-in GPT-image
output used to derive Worldloom's original hanging-tree-leaf atlas. The source
has OpenAI C2PA provenance. `tools/generate_hanging_leaves.py` deterministically
extracts its bright leaves and subtle stems into the production 64×64 RGBA
nearest-sampled atlas; no downloaded third-party texture is used.

The generated files are:

- `src/public/worldloom/assets/environment/hanging-tree-leaves-atlas.png`
- `src/public/worldloom/assets/environment/hanging-tree-leaves.glb`
- `outputs/hanging-tree-leaves-qa.png` (development QA only)

Regenerate from the repository root with Blender 5.2:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --factory-startup `
  --python tools/generate_hanging_leaves.py -- `
  --source tools/assets/hanging-leaves-textures/gpt-hanging-leaves-source.png `
  --atlas src/public/worldloom/assets/environment/hanging-tree-leaves-atlas.png `
  --output src/public/worldloom/assets/environment/hanging-tree-leaves.glb `
  --preview outputs/hanging-tree-leaves-qa.png --seed 240824
```

The exact generation prompt is preserved in `PROMPTS.md`.
