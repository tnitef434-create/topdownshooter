# GPT-image source record

Tool: built-in image generation mode

Source: `tools/assets/hanging-leaves-textures/gpt-hanging-leaves-source.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: seamless tileable albedo texture for a voxel sandbox game environment model
Primary request: create an original square pixel-art foliage texture for hanging jungle-like tree leaves and leafy vines
Subject: layered broadleaf foliage, small hanging leaflets, irregular mossy green clusters, subtle vine stems
Style/medium: crisp hand-authored pixel art matching a polished voxel sandbox game; deliberately limited 16x16-like pixel language scaled cleanly to the canvas; original design, not copied from any existing game texture
Composition/framing: flat orthographic texture filling the entire square; seamlessly tileable on all four edges; even distribution with no central focal point
Lighting/mood: neutral albedo only, no cast shadows, no directional lighting
Color palette: deep forest green, mid moss green, fresh leaf green, a few muted yellow-green highlights; strong readable pixel clusters
Materials/textures: matte leaves with controlled pixel noise and clean block clusters
Constraints: truly seamless edges; no text; no logo; no watermark; no trunk, flowers, fruit, sky, ground, or scene; no photorealism; no blur; no gradients; no anti-aliased edges; no recognizable copyrighted texture pattern
Avoid: noisy speckle, muddy gray, neon glow, smooth painting, realistic photography, empty borders
```

## Ashleaf-matched revision (v2)

Tool: built-in image generation mode

Source: `tools/assets/hanging-leaves-textures/gpt-hanging-leaves-source-v2.png`

Reference roles:

- Image 1: original hanging-leaf texture being replaced
- Image 2: in-game Ashleaf canopy palette and pixel-style reference

Exact prompt:

```text
Use case: style-transfer
Asset type: production albedo source for a hanging foliage card in the Worldloom voxel game
Input images: Image 1 is the current texture to replace; Image 2 is the exact in-game Ashleaf canopy style and palette reference
Primary request: completely re-author Image 1 so its hanging foliage matches the cubic Ashleaf canopy texture visible in Image 2
Subject: one vertically repeatable curtain of dangling Ashleaf foliage, made from irregular connected square and rectangular leaf clusters, with a few narrow gaps so it reads as hanging vegetation
Style/medium: crisp low-resolution voxel-game pixel art; use the same flat, chunky, mottled pixel language as the canopy blocks in Image 2; no individually drawn tropical leaves
Composition/framing: square source sheet; foliage centered in the middle 50 percent with transparent side gutters; the top and bottom foliage patterns must connect cleanly when repeated vertically; no scene or mockup
Lighting/mood: neutral flat albedo, designed to receive game lighting; no baked shadows, shine, bloom, or directional highlights
Color palette: strictly use muted Ashleaf greens matching #4d7d51, #6b9860, #345f47, #82a969, and #416e4c, plus transparency; keep #82a969 sparse
Materials/textures: matte, chunky 1-to-4-pixel-style rectangular clusters with controlled density and several tiny transparent holes like the canopy block
Constraints: genuinely transparent background; change only the texture asset; preserve square framing; hard pixel edges; no antialiasing; no gradients; no text; no logo; no watermark; original design
Avoid: lime, neon, yellow-green, tropical palm or monstera leaves, rounded leaf silhouettes, brown vines, realistic foliage, soft painting, blur, speckled noise, black opaque background
```
