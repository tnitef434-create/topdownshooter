# Worldloom characters

Original pixel characters and pickaxes authored in Blender 5.2. No imported animal models or third-party skin artwork. Flint, stone and copper pickaxes share a 16-pixel stepped silhouette, a continuous wooden grip and one mesh per tier. Internal voxel faces are removed before export.

`worldloom-characters.glb` includes a six-part 4/8/12-pixel player, an eight-part pig rig, and Walk/Graze animation tracks. `tools/generate_voxel_characters.py` rebuilds the Blender project, preview, GLB, and `src/character-meshes.js` from one source. The JS contains evaluated Blender mesh positions, normals and linear vertex colors so the game can create characters synchronously without a second model loader or a placeholder animal.

The runtime uses these same rigid mesh pivots. Pig walking follows actual travel distance, with diagonal foot phases and ground compensation. Grazing blends the neck down, stops translation, checks the ground at the snout, removes a grass tuft or converts turf to loam, chews, and recovers. A hit applies a 0.2-second red tint and a damped, collision-checked recoil before fleeing. Each pig owns its material so the tint never affects the herd.

Validation: `npm run test:worldloom`. For visual inspection, serve the repository root locally and open `tests/character-preview.html`.
