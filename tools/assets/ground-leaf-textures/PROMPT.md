# GPT ground-leaf source

The source image `gpt-ground-leaves-source.png` was generated with the built-in
GPT image tool and is intentionally preserved here so the game asset remains
reproducible and auditable.

## Final prompt

```text
Use case: stylized-concept
Asset type: pixel-art game texture source for a Blender-modeled forest floor leaf-litter prop and matching airborne leaf particles
Primary request: a clean atlas-like collection of individual fallen ash-tree leaves and tiny clustered leaf fragments, designed to be cut into several separate sprites
Scene/backdrop: genuinely transparent background
Subject: 10 to 14 isolated small leaves, some single and some groups of two or three, with clear gaps between every cluster
Style/medium: crisp Minecraft-inspired voxel-game pixel art, deliberately blocky 16-bit pixels, no antialiasing, no painterly softness, no realism outside the established pixel style
Composition/framing: orthographic top-down view, evenly distributed across a square canvas, generous transparent gutters around each cluster
Color palette: exactly coordinated forest canopy greens and softly aged falling-leaf accents: deep #345f47, moss #416e4c, base #4d7d51, light #6b9860, sparse #82a969, with restrained ochre #8a6d32 and gold #d8b24f accents
Materials/textures: flat opaque pixel clusters with simple two-to-four-tone shading
Constraints: true transparent alpha; hard pixel edges; no halos; no outlines; no cast shadows; no background; no branches; no text; no logos; no watermark; every leaf cluster fully separated and readable at 16x16 logical resolution
```

`tools/generate_ground_leaves.py` hard-cuts alpha, quantizes the source onto the
Worldloom canopy/falling-leaf palette, and embeds the resulting nearest-filtered
atlas into the Blender-exported GLB.
