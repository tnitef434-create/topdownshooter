# Worldloom living forest-floor concept

The production geometry is authored deterministically by
`tools/generate_forest_floor_assets.py`. The GPT Image result is retained only
as a visual concept reference; its pixels are not sampled, traced, or shipped
as a runtime texture.

Built-in ImageGen mode was used with the existing Worldloom red-flower prop as
the visual style reference.

## Exact prompt

```text
Use case: stylized-concept
Asset type: project concept sheet for Blender-authored forest-floor props in an original browser voxel-survival game
Input images: Image 1 is a style reference only for chunky square voxel scale, flat palette discipline, hard silhouettes, and face shading; do not copy its red flower subject
Primary request: create one cohesive original forest-floor prop set containing exactly these clearly separated objects: one mossy fallen log with visible cut rings, one mossy stump with exposed roots, one exposed-root cluster, one twig cluster, one pinecone, one small irregular rock cluster, and one tiny mushroom patch that could sit on a log
Scene/backdrop: genuinely transparent background; no ground plane, no forest scene
Style/medium: unmistakably low-resolution Minecraft-inspired voxel pixel art, designed to be transcribed into Blender cube geometry; large square logical pixels, stepped shapes, flat colours, no outlines
Composition/framing: clean orthographic three-quarter asset sheet; seven separated objects in a tidy grid; each full object visible; no overlap
Color palette: restrained natural palette of dark/mid bark brown, cut-wood tan, moss greens, muted grey stone, mushroom cream and rust red
Materials/textures: colour-blocked voxel faces only, sparse moss patches; no detailed photographic texture
Constraints: original designs; every edge snapped to a coarse voxel grid; hard square corners; no curves; no gradients; no antialiasing; no transparency inside objects; no insects; no text; no labels; no logo; no watermark
Avoid: realistic photography, smooth low-poly shapes, tiny noisy texture detail, glossy plastic, magical glow, outlines, soft edges, ground shadows
```

Generated reference: `gpt-forest-floor-concept-v1.png`.
