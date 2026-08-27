# Summit cross wood texture provenance

- Generator: OpenAI built-in ImageGen (`image_gen.imagegen`)
- Generated source: `gpt-summit-cross-wood-source.png`
- Production derivative: `src/public/worldloom/assets/environment/summit-cross-wood-atlas.png`
- Blender generator: `tools/generate_summit_cross.py`

The production atlas is a deliberately low-resolution, nearest-filtered,
palette-quantized derivative of the generated source. The Blender script keeps
vertical grain on the upright and rotates the source region for horizontal grain
on the raised crossbeam.

## Final generation prompt

> Use case: stylized-concept
>
> Asset type: tileable game texture source for a Blender-modeled Worldloom mountain summit cross
>
> Primary request: create a seamless square weathered hand-hewn dark oak timber surface texture that will wrap a tall traditional Christian cross
>
> Scene/backdrop: flat orthographic material swatch only, filling the full canvas
>
> Subject: aged dark oak with strong longitudinal grain, subtle axe-hewn facets, a few restrained cracks, darker recessed seams, and warm worn highlights
>
> Style/medium: crisp Minecraft-compatible pixel-art material, refined high-end voxel-game quality, deliberately pixelated rather than photorealistic
>
> Composition/framing: evenly distributed texture with no central focal object; all four edges must tile cleanly
>
> Lighting/mood: neutral diffuse material lighting with no cast shadows
>
> Color palette: deep brown, umber, muted warm tan highlights; no green tint
>
> Constraints: texture only; seamless edges; no cross silhouette; no objects; no scenery; no letters; no religious figure; no logos; no watermark; avoid smooth plastic surfaces and avoid noisy photoreal detail
