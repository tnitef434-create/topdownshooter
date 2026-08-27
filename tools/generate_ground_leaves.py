"""Build Worldloom's GPT-textured ground-leaf litter with Blender.

Run from the repository root with Blender 4.0+:

  blender --background --factory-startup --python tools/generate_ground_leaves.py

The source image is preserved for provenance. Blender reduces it to a hard-edge
4x4 pixel atlas, builds one low-poly litter patch, embeds the atlas in a compact
GLB, and exports the single-leaf particle sprite used by the matching airborne
leaves.
"""

from __future__ import annotations

import argparse
import math
import random
import sys
from pathlib import Path
from typing import Sequence

import bpy
from mathutils import Vector


GENERATOR_VERSION = "1.0.0"
DEFAULT_SEED = 270826
GRID = 4
LOGICAL_TILE = 16
PIXEL_SCALE = 2
TILE_SIZE = LOGICAL_TILE * PIXEL_SCALE
ATLAS_SIZE = GRID * TILE_SIZE
PALETTE_GREEN = (
    (0x34 / 255.0, 0x5F / 255.0, 0x47 / 255.0),
    (0x41 / 255.0, 0x6E / 255.0, 0x4C / 255.0),
    (0x4D / 255.0, 0x7D / 255.0, 0x51 / 255.0),
    (0x6B / 255.0, 0x98 / 255.0, 0x60 / 255.0),
    (0x82 / 255.0, 0xA9 / 255.0, 0x69 / 255.0),
)
PALETTE_WARM = (
    (0x65 / 255.0, 0x4B / 255.0, 0x27 / 255.0),
    (0x8A / 255.0, 0x6D / 255.0, 0x32 / 255.0),
    (0xB1 / 255.0, 0x83 / 255.0, 0x32 / 255.0),
    (0xD8 / 255.0, 0xB2 / 255.0, 0x4F / 255.0),
)
ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "tools/assets/ground-leaf-textures/gpt-ground-leaves-source.png"
DEFAULT_ATLAS = ROOT / "src/public/worldloom/assets/environment/ground-leaf-litter-atlas.png"
DEFAULT_PARTICLE = ROOT / "src/public/worldloom/assets/environment/falling-leaf-particle.png"
DEFAULT_OUTPUT = ROOT / "src/public/worldloom/assets/environment/ground-leaf-litter.glb"
DEFAULT_PREVIEW = ROOT / "outputs/ground-leaf-litter-qa.png"


def blender_arguments() -> list[str]:
    return sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build deterministic pixel ground leaves.")
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--atlas", type=Path, default=DEFAULT_ATLAS)
    parser.add_argument("--particle", type=Path, default=DEFAULT_PARTICLE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--preview", type=Path, default=DEFAULT_PREVIEW)
    parser.add_argument("--seed", type=int, default=DEFAULT_SEED)
    args = parser.parse_args(blender_arguments())
    for field in ("source", "atlas", "particle", "output", "preview"):
        value = getattr(args, field)
        setattr(args, field, value.expanduser().resolve() if value else None)
    if not args.source.is_file():
        parser.error(f"--source does not exist: {args.source}")
    return args


def reset_scene() -> None:
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for store in (
        bpy.data.collections,
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.images,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for block in list(store):
            store.remove(block)
    bpy.context.scene.unit_settings.system = "METRIC"


def palette_color(r: float, g: float, b: float) -> tuple[float, float, float]:
    luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
    warm = r > g * 1.04 and r > b * 1.35
    palette = PALETTE_WARM if warm else PALETTE_GREEN
    index = min(len(palette) - 1, max(0, int(luminance * len(palette))))
    return palette[index]


def save_rgba(name: str, size: int, pixels: list[float], path: Path) -> bpy.types.Image:
    path.parent.mkdir(parents=True, exist_ok=True)
    image = bpy.data.images.new(name, size, size, alpha=True)
    image.colorspace_settings.name = "sRGB"
    image.pixels[:] = pixels
    image.filepath_raw = str(path)
    image.file_format = "PNG"
    image.save()
    return image


def generate_textures(source_path: Path, atlas_path: Path, particle_path: Path) -> bpy.types.Image:
    source = bpy.data.images.load(str(source_path), check_existing=False)
    source.colorspace_settings.name = "sRGB"
    width, height = int(source.size[0]), int(source.size[1])
    if width < 256 or height < 256:
        raise ValueError(f"GPT source must be at least 256x256, got {width}x{height}")
    source_pixels = list(source.pixels[:])
    atlas_pixels = [0.0] * (ATLAS_SIZE * ATLAS_SIZE * 4)

    def source_pixel(x: int, y: int) -> tuple[float, float, float, float]:
        offset = (min(height - 1, max(0, y)) * width + min(width - 1, max(0, x))) * 4
        return tuple(source_pixels[offset + channel] for channel in range(4))

    opaque_counts: list[int] = []
    for tile_y in range(GRID):
        for tile_x in range(GRID):
            opaque = 0
            for logical_y in range(LOGICAL_TILE):
                for logical_x in range(LOGICAL_TILE):
                    u = (logical_x + 0.5) / LOGICAL_TILE
                    v = (logical_y + 0.5) / LOGICAL_TILE
                    # A small cell inset removes neighbouring sprites while
                    # retaining the full hard-edged GPT-authored silhouette.
                    source_x = round((tile_x + 0.035 + u * 0.93) * width / GRID)
                    source_y = round((tile_y + 0.035 + v * 0.93) * height / GRID)
                    r, g, b, alpha = source_pixel(source_x, source_y)
                    retained = alpha >= 0.54 and max(r, g, b) >= 0.08
                    color = palette_color(r, g, b) if retained else (0.0, 0.0, 0.0)
                    opaque += int(retained)
                    for oy in range(PIXEL_SCALE):
                        for ox in range(PIXEL_SCALE):
                            atlas_x = tile_x * TILE_SIZE + logical_x * PIXEL_SCALE + ox
                            atlas_y = tile_y * TILE_SIZE + logical_y * PIXEL_SCALE + oy
                            target = (atlas_y * ATLAS_SIZE + atlas_x) * 4
                            atlas_pixels[target:target + 4] = [*color, 1.0 if retained else 0.0]
            opaque_counts.append(opaque)

    if sum(count >= 10 for count in opaque_counts) < 8:
        raise RuntimeError(f"GPT atlas extraction retained too few readable leaves: {opaque_counts}")
    atlas = save_rgba("Worldloom_Ground_Leaf_Atlas_128", ATLAS_SIZE, atlas_pixels, atlas_path)
    atlas.pack()
    atlas["source_file"] = source_path.name
    atlas["pixel_filter"] = "nearest"
    atlas["logical_tile_pixels"] = LOGICAL_TILE

    # Tile 0 is a single green ash leaf and becomes the airborne sprite. It is
    # copied byte-for-byte from the same quantized atlas, guaranteeing that the
    # leaves in the air and the litter below use one color system.
    particle_pixels = [0.0] * (TILE_SIZE * TILE_SIZE * 4)
    for y in range(TILE_SIZE):
        for x in range(TILE_SIZE):
            source_offset = (y * ATLAS_SIZE + x) * 4
            target_offset = (y * TILE_SIZE + x) * 4
            particle_pixels[target_offset:target_offset + 4] = atlas_pixels[source_offset:source_offset + 4]
    save_rgba("Worldloom_Falling_Leaf_Particle_32", TILE_SIZE, particle_pixels, particle_path)
    bpy.data.images.remove(source)
    return atlas


def principled_input(node: bpy.types.Node, *names: str):
    for name in names:
        socket = node.inputs.get(name)
        if socket is not None:
            return socket
    return None


def create_material(atlas: bpy.types.Image) -> bpy.types.Material:
    material = bpy.data.materials.new("Worldloom_GPT_Ground_Leaf_Atlas")
    material.use_nodes = True
    material.diffuse_color = (1.0, 1.0, 1.0, 1.0)
    material.use_backface_culling = False
    if hasattr(material, "surface_render_method"):
        material.surface_render_method = "DITHERED"
    elif hasattr(material, "blend_method"):
        material.blend_method = "CLIP"
    if hasattr(material, "alpha_threshold"):
        material.alpha_threshold = 0.5
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    principled = nodes.get("Principled BSDF")
    texture = nodes.new("ShaderNodeTexImage")
    texture.name = "Nearest_GPT_Ground_Leaf_Atlas"
    texture.image = atlas
    texture.interpolation = "Closest"
    texture.extension = "CLIP"
    cutoff = nodes.new("ShaderNodeMath")
    cutoff.operation = "GREATER_THAN"
    cutoff.inputs[1].default_value = 0.5
    if principled:
        base = principled_input(principled, "Base Color")
        alpha = principled_input(principled, "Alpha")
        roughness = principled_input(principled, "Roughness")
        metallic = principled_input(principled, "Metallic")
        if base: links.new(texture.outputs["Color"], base)
        if alpha:
            links.new(texture.outputs["Alpha"], cutoff.inputs[0])
            links.new(cutoff.outputs[0], alpha)
        if roughness: roughness.default_value = 0.96
        if metallic: metallic.default_value = 0.0
    return material


def create_patch(material: bpy.types.Material, seed: int) -> bpy.types.Object:
    rng = random.Random(seed)
    vertices: list[tuple[float, float, float]] = []
    faces: list[tuple[int, int, int, int]] = []
    uvs: list[tuple[float, float]] = []
    placements = (
        (-0.92, -0.48, 0.47, 0.25), (-0.5, 0.62, 0.39, 0.21),
        (-0.08, -0.16, 0.5, 0.26), (0.36, 0.58, 0.42, 0.22),
        (0.74, -0.38, 0.45, 0.24), (0.98, 0.24, 0.35, 0.2),
        (-0.95, 0.42, 0.31, 0.18), (0.2, -0.76, 0.36, 0.2),
        (0.58, 0.06, 0.29, 0.17), (-0.28, 0.12, 0.28, 0.17),
    )
    tile_choices = (0, 2, 3, 5, 6, 8, 10, 11, 12, 15)
    for leaf_index, (cx, cy, length, width) in enumerate(placements):
        angle = rng.uniform(-math.pi, math.pi)
        direction = Vector((math.cos(angle), math.sin(angle)))
        side = Vector((-direction.y, direction.x))
        half_length = length * 0.5
        half_width = width * 0.5
        lift = 0.012 + rng.uniform(0.0, 0.018)
        first = len(vertices)
        points = (
            Vector((cx, cy)) - direction * half_length - side * half_width,
            Vector((cx, cy)) + direction * half_length - side * half_width,
            Vector((cx, cy)) + direction * half_length + side * half_width,
            Vector((cx, cy)) - direction * half_length + side * half_width,
        )
        vertices.extend((point.x, point.y, lift + (0.008 if corner in (1, 2) else 0.0))
                        for corner, point in enumerate(points))
        faces.append((first, first + 1, first + 2, first + 3))
        tile = tile_choices[leaf_index % len(tile_choices)]
        tile_x = tile % GRID
        tile_y = tile // GRID
        inset = 0.5 / ATLAS_SIZE
        u0 = tile_x / GRID + inset
        u1 = (tile_x + 1) / GRID - inset
        v0 = tile_y / GRID + inset
        v1 = (tile_y + 1) / GRID - inset
        uvs.extend(((u0, v0), (u1, v0), (u1, v1), (u0, v1)))

    mesh = bpy.data.meshes.new("Ground_Leaf_Litter_Patch_Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(material)
    mesh.update(calc_edges=True)
    uv_layer = mesh.uv_layers.new(name="UVMap")
    for polygon in mesh.polygons:
        for loop_index in polygon.loop_indices:
            uv_layer.data[loop_index].uv = uvs[mesh.loops[loop_index].vertex_index]
    mesh.validate(clean_customdata=False)
    mesh.calc_loop_triangles()
    patch = bpy.data.objects.new("Ground_Leaf_Litter_Patch", mesh)
    bpy.context.scene.collection.objects.link(patch)
    patch["leaf_cards"] = len(placements)
    patch["triangle_count"] = len(mesh.loop_triangles)
    patch["source_texture"] = "gpt-ground-leaves-source.png"
    return patch


def build_asset(material: bpy.types.Material, seed: int) -> bpy.types.Object:
    root = bpy.data.objects.new("Ground_Leaf_Litter_Asset", None)
    bpy.context.scene.collection.objects.link(root)
    root["asset_role"] = "falling_leaf_tree_ground_litter"
    root["generator"] = "generate_ground_leaves.py"
    root["generator_version"] = GENERATOR_VERSION
    root["seed"] = seed
    root["runtime_draw_budget"] = 1
    root["gpt_texture_source"] = "gpt-ground-leaves-source.png"
    root["matching_particle_texture"] = "falling-leaf-particle.png"
    patch = create_patch(material, seed)
    patch.parent = root
    return root


def export_glb(output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    requested = {
        "filepath": str(output), "export_format": "GLB", "use_selection": True,
        "export_animations": False, "export_yup": True, "export_apply": True,
        "export_cameras": False, "export_lights": False, "export_extras": True,
        "export_materials": "EXPORT", "export_texcoords": True,
        "export_normals": True, "export_tangents": False,
        "export_colors": False, "export_draco_mesh_compression_enable": False,
    }
    supported = {prop.identifier for prop in bpy.ops.export_scene.gltf.get_rna_type().properties}
    result = bpy.ops.export_scene.gltf(**{key: value for key, value in requested.items() if key in supported})
    if "FINISHED" not in result:
        raise RuntimeError(f"glTF export did not finish: {sorted(result)}")


def look_at(obj: bpy.types.Object, point: Sequence[float]) -> None:
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat("-Z", "Y").to_euler()


def render_preview(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except (TypeError, ValueError):
        pass
    scene.render.resolution_x = 768
    scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(path)
    scene.world.color = (0.025, 0.045, 0.025)
    bpy.ops.mesh.primitive_plane_add(size=7, location=(0, 0, -0.012))
    ground = bpy.context.object
    ground_material = bpy.data.materials.new("QA_Meadow_Ground")
    ground_material.diffuse_color = (0.12, 0.27, 0.08, 1)
    ground.data.materials.append(ground_material)
    camera_data = bpy.data.cameras.new("QA_Ground_Leaf_Camera")
    camera = bpy.data.objects.new("QA_Ground_Leaf_Camera", camera_data)
    scene.collection.objects.link(camera)
    camera.location = (2.65, -3.8, 3.3)
    look_at(camera, (0, 0, 0))
    camera_data.lens = 58
    scene.camera = camera
    key_data = bpy.data.lights.new("QA_Key", type="AREA")
    key_data.energy = 780
    key_data.size = 4.0
    key = bpy.data.objects.new("QA_Key", key_data)
    scene.collection.objects.link(key)
    key.location = (-2.2, -2.5, 4.2)
    look_at(key, (0, 0, 0))
    bpy.ops.render.render(write_still=True)


def main() -> None:
    args = parse_args()
    reset_scene()
    atlas = generate_textures(args.source, args.atlas, args.particle)
    material = create_material(atlas)
    root = build_asset(material, args.seed)
    export_glb(args.output)
    if args.preview:
        render_preview(args.preview)
    triangles = sum(len(obj.data.loop_triangles) for obj in root.children if obj.type == "MESH")
    print(f"Generated {args.output} | atlas={args.atlas} | particle={args.particle} | triangles={triangles}")


if __name__ == "__main__":
    main()
