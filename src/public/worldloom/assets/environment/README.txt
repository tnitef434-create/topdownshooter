Worldloom pond ecology assets
==============================

pond-details.glb is an original asset pack generated locally with Blender 5.2
from tools/generate_pond_assets.py. It contains the Lily_Pad_Asset,
Mist_Wisp_Asset, and Fly_Swarm_Asset roots used by pond-ecology.js.

Regenerate from the repository root with:

  "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" --background --factory-startup --python tools/generate_pond_assets.py -- --output src/public/worldloom/assets/environment/pond-details.glb --seed 240824 --flies 5 --flower --animate

The geometry, materials, and animation data are project-original and require no
third-party texture or model attribution.
