"""Generate Worldloom's original pixel hanging-leaf segment with Blender.

Requirements: Blender 4.0+ with the bundled glTF 2.0 exporter. No third-party
Python packages are used. Run from the repository root:

  blender --background --factory-startup --python tools/generate_hanging_leaves.py -- \
    --source tools/assets/hanging-leaves-textures/gpt-hanging-leaves-source.png \
    --atlas src/public/worldloom/assets/environment/hanging-tree-leaves-atlas.png \
    --output src/public/worldloom/assets/environment/hanging-tree-leaves.glb \
    --preview outputs/hanging-tree-leaves-qa.png --seed 240824

The generated mesh has a top-centre pivot. It extends down Blender -Z, which
the glTF Y-up conversion exports as local -Y for spring-chain instancing.
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


GENERATOR_VERSION = "1.1.0"
DEFAULT_SEED = 240824
ATLAS_SIZE = 64
LOGICAL_ATLAS_SIZE = 16
ATLAS_PIXEL_SCALE = ATLAS_SIZE // LOGICAL_ATLAS_SIZE
ASHLEAF_PALETTE_SRGB = (
    (0x4D / 255.0, 0x7D / 255.0, 0x51 / 255.0),
    (0x6B / 255.0, 0x98 / 255.0, 0x60 / 255.0),
    (0x34 / 255.0, 0x5F / 255.0, 0x47 / 255.0),
    (0x82 / 255.0, 0xA9 / 255.0, 0x69 / 255.0),
    (0x41 / 255.0, 0x6E / 255.0, 0x4C / 255.0),
)
ASHLEAF_PALETTE_HISTOGRAM = (
    (2, 0.076),  # #345f47
    (4, 0.131),  # #416e4c
    (0, 0.576),  # #4d7d51 base
    (1, 0.128),  # #6b9860
    (3, 0.090),  # #82a969 sparse highlight
)
REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = REPOSITORY_ROOT / "tools/assets/hanging-leaves-textures/gpt-hanging-leaves-source-v2.png"
DEFAULT_ATLAS = REPOSITORY_ROOT / "src/public/worldloom/assets/environment/hanging-tree-leaves-atlas.png"
DEFAULT_OUTPUT = REPOSITORY_ROOT / "src/public/worldloom/assets/environment/hanging-tree-leaves.glb"
DEFAULT_PREVIEW = REPOSITORY_ROOT / "outputs/hanging-tree-leaves-qa.png"


def blender_arguments() -> list[str]:
    return sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build deterministic pixel hanging leaves.")
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE, help="GPT-image source PNG.")
    parser.add_argument("--atlas", type=Path, default=DEFAULT_ATLAS, help="Generated 64x64 RGBA PNG.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Self-contained output GLB.")
    parser.add_argument("--preview", type=Path, default=DEFAULT_PREVIEW, help="Optional QA preview PNG.")
    parser.add_argument("--seed", type=int, default=DEFAULT_SEED, help="Deterministic geometry seed.")
    parser.add_argument("--scale", type=float, default=1.0, help="Uniform geometry scale in metres.")
    args = parser.parse_args(blender_arguments())
    args.source = args.source.expanduser().resolve()
    args.atlas = args.atlas.expanduser().resolve().with_suffix(".png")
    args.output = args.output.expanduser().resolve().with_suffix(".glb")
    args.preview = args.preview.expanduser().resolve().with_suffix(".png") if args.preview else None
    if not args.source.is_file():
        parser.error(f"--source does not exist: {args.source}")
    if not math.isfinite(args.scale) or args.scale <= 0:
        parser.error("--scale must be a positive finite number")
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
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 1.0


def generate_atlas(source_path: Path, atlas_path: Path) -> bpy.types.Image:
    """Extract a crisp Ashleaf-matched curtain from the transparent GPT source."""
    source = bpy.data.images.load(str(source_path), check_existing=False)
    source.colorspace_settings.name = "sRGB"
    width, height = (int(source.size[0]), int(source.size[1]))
    if width < 64 or height < 64:
        raise ValueError(f"Source must be at least 64x64 pixels, got {width}x{height}")
    source_pixels = list(source.pixels[:])

    # A tall central crop preserves several authored stems while transparent
    # side gutters give the card a narrow chain-segment silhouette.
    crop_left = 0.18
    crop_right = 0.82
    content_left = 3
    content_right = 12
    sampled: list[tuple[float, float, float, float]] = [
        (0.0, 0.0, 0.0, 0.0)
    ] * (LOGICAL_ATLAS_SIZE * LOGICAL_ATLAS_SIZE)
    keep = [False] * (LOGICAL_ATLAS_SIZE * LOGICAL_ATLAS_SIZE)

    for atlas_y in range(LOGICAL_ATLAS_SIZE):
        v = atlas_y / (LOGICAL_ATLAS_SIZE - 1)
        source_y = min(height - 1, max(0, round(v * (height - 1))))
        for atlas_x in range(content_left, content_right + 1):
            u = (atlas_x - content_left) / max(1, content_right - content_left)
            source_u = crop_left + (crop_right - crop_left) * u
            source_x = min(width - 1, max(0, round(source_u * (width - 1))))
            source_index = (source_y * width + source_x) * 4
            r = source_pixels[source_index]
            g = source_pixels[source_index + 1]
            b = source_pixels[source_index + 2]
            alpha = source_pixels[source_index + 3]

            # GPT-image v2 supplies real alpha. A hard cutoff removes its soft
            # antialias fringe before the retained shading is rank-mapped onto
            # the exact Ashleaf canopy palette below.
            green_leaf = alpha >= 0.58 and g >= r * 1.08 and g >= b * 1.04
            index = atlas_y * LOGICAL_ATLAS_SIZE + atlas_x
            keep[index] = green_leaf
            sampled[index] = (r, g, b, 1.0)

    # Remove single-pixel sampling flecks without softening authored corners.
    cleaned = keep[:]
    for y in range(1, LOGICAL_ATLAS_SIZE - 1):
        for x in range(1, LOGICAL_ATLAS_SIZE - 1):
            index = y * LOGICAL_ATLAS_SIZE + x
            if not keep[index]:
                continue
            neighbors = sum(
                1
                for oy in (-1, 0, 1)
                for ox in (-1, 0, 1)
                if (ox or oy) and keep[(y + oy) * LOGICAL_ATLAS_SIZE + x + ox]
            )
            if neighbors < 2:
                cleaned[index] = False

    opaque_indices = [index for index, retained in enumerate(cleaned) if retained]
    opaque_indices.sort(key=lambda index: (
        0.2126 * sampled[index][0] + 0.7152 * sampled[index][1] + 0.0722 * sampled[index][2],
        index,
    ))
    opaque_pixels = len(opaque_indices)
    histogram_total = sum(weight for _, weight in ASHLEAF_PALETTE_HISTOGRAM)
    cumulative_limits: list[tuple[float, tuple[float, float, float]]] = []
    cumulative = 0.0
    for palette_index, weight in ASHLEAF_PALETTE_HISTOGRAM:
        cumulative += weight / histogram_total
        cumulative_limits.append((cumulative, ASHLEAF_PALETTE_SRGB[palette_index]))

    atlas_pixels = [0.0] * (ATLAS_SIZE * ATLAS_SIZE * 4)
    for rank, index in enumerate(opaque_indices):
        quantile = (rank + 0.5) / max(1, opaque_pixels)
        color = cumulative_limits[-1][1]
        for limit, candidate in cumulative_limits:
            if quantile <= limit:
                color = candidate
                break
        logical_x = index % LOGICAL_ATLAS_SIZE
        logical_y = index // LOGICAL_ATLAS_SIZE
        for offset_y in range(ATLAS_PIXEL_SCALE):
            for offset_x in range(ATLAS_PIXEL_SCALE):
                atlas_x = logical_x * ATLAS_PIXEL_SCALE + offset_x
                atlas_y = logical_y * ATLAS_PIXEL_SCALE + offset_y
                target = (atlas_y * ATLAS_SIZE + atlas_x) * 4
                # Blender writes generated image pixels directly when saving
                # the PNG; preserve exact blocks.js sRGB bytes.
                atlas_pixels[target] = color[0]
                atlas_pixels[target + 1] = color[1]
                atlas_pixels[target + 2] = color[2]
                atlas_pixels[target + 3] = 1.0
    if opaque_pixels < 18:
        raise RuntimeError(f"Atlas extraction retained too little foliage ({opaque_pixels} logical pixels)")

    atlas = bpy.data.images.new("Worldloom_Hanging_Leaves_Atlas_64", ATLAS_SIZE, ATLAS_SIZE, alpha=True)
    atlas.colorspace_settings.name = "sRGB"
    atlas.pixels[:] = atlas_pixels
    atlas.filepath_raw = str(atlas_path)
    atlas.file_format = "PNG"
    atlas_path.parent.mkdir(parents=True, exist_ok=True)
    atlas.save()
    atlas.pack()
    atlas["source_file"] = source_path.name
    atlas["opaque_pixels"] = opaque_pixels * ATLAS_PIXEL_SCALE * ATLAS_PIXEL_SCALE
    atlas["logical_pixels"] = LOGICAL_ATLAS_SIZE
    atlas["pixel_filter"] = "nearest"
    bpy.data.images.remove(source)
    return atlas


def principled_input(node: bpy.types.Node, *names: str):
    for name in names:
        socket = node.inputs.get(name)
        if socket is not None:
            return socket
    return None


def create_leaf_material(atlas: bpy.types.Image) -> bpy.types.Material:
    material = bpy.data.materials.new("Worldloom_Hanging_Leaf_Atlas")
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
    base = principled_input(principled, "Base Color") if principled else None
    alpha = principled_input(principled, "Alpha") if principled else None
    roughness = principled_input(principled, "Roughness") if principled else None
    metallic = principled_input(principled, "Metallic") if principled else None
    if roughness:
        roughness.default_value = 0.92
    if metallic:
        metallic.default_value = 0.0

    texture = nodes.new("ShaderNodeTexImage")
    texture.name = "Nearest_Hanging_Leaf_Atlas"
    texture.label = "64px nearest hanging leaves"
    texture.image = atlas
    texture.interpolation = "Closest"
    texture.extension = "EXTEND"
    cutoff = nodes.new("ShaderNodeMath")
    cutoff.name = "Hanging_Leaf_Alpha_Cutoff"
    cutoff.operation = "GREATER_THAN"
    cutoff.inputs[1].default_value = 0.5
    if base:
        links.new(texture.outputs["Color"], base)
    if alpha:
        links.new(texture.outputs["Alpha"], cutoff.inputs[0])
        links.new(cutoff.outputs[0], alpha)
    material["atlas_pixels"] = ATLAS_SIZE
    material["runtime_filter"] = "nearest_no_mipmaps"
    return material


def create_hanging_segment(material: bpy.types.Material, scale: float, seed: int) -> bpy.types.Object:
    rng = random.Random(seed)
    vertices: list[tuple[float, float, float]] = []
    faces: list[tuple[int, int, int, int]] = []
    uvs: list[tuple[float, float]] = []
    rows = 6
    height = 1.18 * scale
    base_widths = (0.15, 0.18, 0.19, 0.18, 0.17, 0.15)
    angles = (-0.24 + rng.uniform(-0.025, 0.025), 0.31 + rng.uniform(-0.025, 0.025))

    for ribbon_index, angle in enumerate(angles):
        first = len(vertices)
        side_x = math.cos(angle)
        side_y = math.sin(angle)
        bend_x = -math.sin(angle)
        bend_y = math.cos(angle)
        for row in range(rows):
            t = row / (rows - 1)
            # The top centre remains exactly at the object origin. Lower rows
            # arc subtly so chains have volume without a second draw primitive.
            centre_offset = math.sin(t * math.pi) * 0.045 * scale * (1 if ribbon_index == 0 else -1)
            centre_x = bend_x * centre_offset
            centre_y = bend_y * centre_offset
            centre_z = -height * t
            half_width = base_widths[row] * scale
            vertices.extend([
                (centre_x - side_x * half_width, centre_y - side_y * half_width, centre_z),
                (centre_x + side_x * half_width, centre_y + side_y * half_width, centre_z),
            ])
            # Half-texel inset prevents sampling across the atlas border.
            v = 1.0 - t
            uvs.extend([(0.5 / ATLAS_SIZE, v), (1.0 - 0.5 / ATLAS_SIZE, v)])
        for row in range(rows - 1):
            a = first + row * 2
            faces.append((a, a + 1, a + 3, a + 2))

    mesh = bpy.data.meshes.new("Hanging_Leaf_Segment_Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(material)
    mesh.update(calc_edges=True)
    uv_layer = mesh.uv_layers.new(name="UVMap")
    # Each face loop references one of the per-vertex UVs above.
    for polygon in mesh.polygons:
        for loop_index in polygon.loop_indices:
            uv_layer.data[loop_index].uv = uvs[mesh.loops[loop_index].vertex_index]
    mesh.validate(clean_customdata=False)
    mesh.calc_loop_triangles()

    segment = bpy.data.objects.new("Hanging_Leaf_Segment", mesh)
    bpy.context.scene.collection.objects.link(segment)
    segment["spring_chain_segment"] = True
    segment["top_pivot"] = True
    segment["hang_axis_gltf"] = "local_negative_y"
    segment["triangle_count"] = len(mesh.loop_triangles)
    segment["source_texture"] = "gpt-hanging-leaves-source-v2.png"
    if len(mesh.loop_triangles) > 64:
        raise RuntimeError(f"Hanging segment exceeds 64 triangles: {len(mesh.loop_triangles)}")
    return segment


def build_asset(material: bpy.types.Material, scale: float, seed: int) -> bpy.types.Object:
    root = bpy.data.objects.new("Hanging_Leaf_Asset", None)
    bpy.context.scene.collection.objects.link(root)
    root.empty_display_type = "PLAIN_AXES"
    root.empty_display_size = 0.08
    root["asset_role"] = "tree_hanging_foliage"
    root["generator"] = "generate_hanging_leaves.py"
    root["generator_version"] = GENERATOR_VERSION
    root["seed"] = seed
    root["runtime_draw_budget"] = 1
    root["triangle_budget"] = 64
    root["atlas_pixels"] = ATLAS_SIZE
    root["spring_chain_segment"] = True
    segment = create_hanging_segment(material, scale, seed)
    segment.parent = root
    return root


def export_glb(output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    requested = {
        "filepath": str(output),
        "export_format": "GLB",
        "use_selection": True,
        "export_animations": False,
        "export_yup": True,
        "export_apply": True,
        "export_cameras": False,
        "export_lights": False,
        "export_extras": True,
        "export_materials": "EXPORT",
        "export_texcoords": True,
        "export_normals": True,
        "export_tangents": False,
        "export_colors": False,
        "export_draco_mesh_compression_enable": False,
    }
    supported = {prop.identifier for prop in bpy.ops.export_scene.gltf.get_rna_type().properties}
    result = bpy.ops.export_scene.gltf(**{key: value for key, value in requested.items() if key in supported})
    if "FINISHED" not in result:
        raise RuntimeError(f"glTF export did not finish: {sorted(result)}")


def look_at(obj: bpy.types.Object, point: Sequence[float]) -> None:
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat("-Z", "Y").to_euler()


def render_preview(preview_path: Path, root: bpy.types.Object, material: bpy.types.Material, scale: float) -> None:
    preview_path.parent.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except (TypeError, ValueError):
        # The exported GLB is renderer-independent; this fallback only keeps
        # the optional QA still usable on Blender builds without Eevee Next.
        pass
    scene.render.resolution_x = 768
    scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = False
    scene.render.filepath = str(preview_path)
    scene.world.color = (0.018, 0.032, 0.026)

    # Show repetition like the runtime spring chain while preserving the actual
    # exported asset untouched; preview objects are created only after export.
    segment = root.children[0]
    for index, location in enumerate(((-0.72, 0.0, 0.0), (0.0, 0.06, 0.15), (0.72, -0.01, -0.02))):
        if index == 1:
            segment.location = location
            continue
        duplicate = segment.copy()
        duplicate.data = segment.data
        duplicate.material_slots[0].material = material
        bpy.context.scene.collection.objects.link(duplicate)
        duplicate.parent = None
        duplicate.location = location
        duplicate.rotation_euler[2] = (-0.12, 0.0, 0.15)[index]
        preview_scale = (0.92, 1.0, 0.88)[index]
        duplicate.scale = (preview_scale, preview_scale, preview_scale)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, 0.035, 0.14 * scale))
    branch = bpy.context.object
    branch.name = "QA_Branch"
    branch.scale = (1.35 * scale, 0.09 * scale, 0.08 * scale)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    branch_material = bpy.data.materials.new("QA_Bark")
    branch_material.diffuse_color = (0.12, 0.075, 0.028, 1.0)
    branch_material.use_nodes = True
    branch_principled = branch_material.node_tree.nodes.get("Principled BSDF")
    branch_base = principled_input(branch_principled, "Base Color") if branch_principled else None
    if branch_base:
        branch_base.default_value = (0.12, 0.075, 0.028, 1.0)
    branch_material.roughness = 0.95
    branch.data.materials.append(branch_material)

    camera_data = bpy.data.cameras.new("QA_Hanging_Leaf_Camera")
    camera = bpy.data.objects.new("QA_Hanging_Leaf_Camera", camera_data)
    scene.collection.objects.link(camera)
    camera.location = (2.15 * scale, -4.1 * scale, 0.55 * scale)
    look_at(camera, (0.0, 0.0, -0.48 * scale))
    camera_data.lens = 58
    scene.camera = camera

    key_data = bpy.data.lights.new("QA_Key", type="AREA")
    key_data.energy = 720
    key_data.shape = "DISK"
    key_data.size = 3.0
    key = bpy.data.objects.new("QA_Key", key_data)
    scene.collection.objects.link(key)
    key.location = (-2.2 * scale, -2.4 * scale, 3.1 * scale)
    look_at(key, (0.0, 0.0, -0.5 * scale))
    fill_data = bpy.data.lights.new("QA_Fill", type="AREA")
    fill_data.energy = 340
    fill_data.size = 2.2
    fill = bpy.data.objects.new("QA_Fill", fill_data)
    scene.collection.objects.link(fill)
    fill.location = (2.4 * scale, -1.0 * scale, 1.2 * scale)
    look_at(fill, (0.0, 0.0, -0.55 * scale))
    bpy.ops.render.render(write_still=True)


def main() -> None:
    args = parse_args()
    reset_scene()
    atlas = generate_atlas(args.source, args.atlas)
    material = create_leaf_material(atlas)
    root = build_asset(material, args.scale, args.seed)
    export_glb(args.output)
    if args.preview:
        render_preview(args.preview, root, material, args.scale)
    triangle_count = sum(len(obj.data.loop_triangles) for obj in root.children if obj.type == "MESH")
    print(
        f"Generated {args.output} | atlas={args.atlas} | triangles={triangle_count} "
        f"| opaque_pixels={atlas.get('opaque_pixels', 0)} | seed={args.seed}"
    )


if __name__ == "__main__":
    main()
