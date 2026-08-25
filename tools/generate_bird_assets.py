"""Generate Worldloom's two original animated pixel birds with Blender.

Requirements: Blender 4.0+ with the bundled glTF 2.0 exporter. The production
asset was generated with Blender 5.2.0 LTS and requires no third-party Python
packages.

Run from the repository root:

  blender --background --factory-startup --python tools/generate_bird_assets.py -- \
    --source tools/assets/bird-textures/gpt-bird-breeds-source.png \
    --atlas src/public/worldloom/assets/birds/worldloom-birds-atlas.png \
    --output src/public/worldloom/assets/birds/worldloom-birds.glb \
    --preview outputs/worldloom-birds-qa.png --seed 250825

The high-resolution GPT-image source is sampled deterministically into one
nearest-filtered 128x64 atlas. The GLB contains two stable breed roots and six
named transform-animation clips per breed. Bird motion uses a compact rigid
hierarchy instead of a dense deforming skin: that keeps the deliberately
voxel-built silhouette crisp and allows the browser to clone each breed root.
"""

from __future__ import annotations

import argparse
import json
import math
import random
import sys
from pathlib import Path
from typing import Iterable, Sequence

import bpy
from mathutils import Vector


GENERATOR_VERSION = "1.0.0"
DEFAULT_SEED = 250825
ATLAS_WIDTH = 128
ATLAS_HEIGHT = 64
TILE_SIZE = 16
REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = REPOSITORY_ROOT / "tools/assets/bird-textures/gpt-bird-breeds-source.png"
DEFAULT_ATLAS = REPOSITORY_ROOT / "src/public/worldloom/assets/birds/worldloom-birds-atlas.png"
DEFAULT_OUTPUT = REPOSITORY_ROOT / "src/public/worldloom/assets/birds/worldloom-birds.glb"
DEFAULT_PREVIEW = REPOSITORY_ROOT / "outputs/worldloom-birds-qa.png"

TILE_ORDER = (
    "body",
    "body_light",
    "breast",
    "head",
    "wing",
    "wing_dark",
    "tail",
    "beak",
    "leg",
    "eye",
    "eye_highlight",
    "accent",
    "foot",
    "underwing",
    "throat",
    "shadow",
)

# Targets guide selection from the generated source; final pixels always come
# from the GPT-image half for that breed rather than from these guide values.
BREED_TARGETS = {
    "ash": {
        "body": 0x9B4B2B,
        "body_light": 0xC66C38,
        "breast": 0xDDC99E,
        "head": 0xA84D2B,
        "wing": 0x7B3B27,
        "wing_dark": 0x4E362F,
        "tail": 0x65392F,
        "beak": 0x55515A,
        "leg": 0x6C4141,
        "eye": 0x15151C,
        "eye_highlight": 0xF2EEE1,
        "accent": 0xD07A3F,
        "foot": 0x493137,
        "underwing": 0xB59B78,
        "throat": 0xE5D7B6,
        "shadow": 0x332B2A,
    },
    "azure": {
        "body": 0x5A7394,
        "body_light": 0x7F97B5,
        "breast": 0xD7DDD4,
        "head": 0x506989,
        "wing": 0x278A83,
        "wing_dark": 0x285D71,
        "tail": 0x277A82,
        "beak": 0x4A4B56,
        "leg": 0x393A4B,
        "eye": 0x11121A,
        "eye_highlight": 0xF2F0E7,
        "accent": 0xD99228,
        "foot": 0x292B3A,
        "underwing": 0xADC4C5,
        "throat": 0xE5A13B,
        "shadow": 0x253044,
    },
}


def blender_arguments() -> list[str]:
    return sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build deterministic animated Worldloom birds.")
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE, help="GPT-image breed sheet.")
    parser.add_argument("--atlas", type=Path, default=DEFAULT_ATLAS, help="Generated 128x64 atlas PNG.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Self-contained output GLB.")
    parser.add_argument("--preview", type=Path, default=DEFAULT_PREVIEW, help="Optional QA render PNG.")
    parser.add_argument("--seed", type=int, default=DEFAULT_SEED, help="Deterministic detail seed.")
    parser.add_argument("--scale", type=float, default=1.0, help="Uniform authored bird scale.")
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
        bpy.data.actions,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for block in list(store):
            store.remove(block, do_unlink=True)
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 61
    scene.render.fps = 24
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 1.0


def srgb_tuple(value: int) -> tuple[float, float, float]:
    return (
        ((value >> 16) & 0xFF) / 255.0,
        ((value >> 8) & 0xFF) / 255.0,
        (value & 0xFF) / 255.0,
    )


def distance_sq(a: Sequence[float], b: Sequence[float]) -> float:
    # A small green-channel emphasis keeps teal and chestnut clusters distinct.
    return (a[0] - b[0]) ** 2 * 0.9 + (a[1] - b[1]) ** 2 * 1.15 + (a[2] - b[2]) ** 2


def source_color_buckets(
    pixels: Sequence[float],
    width: int,
    height: int,
    minimum_x: int,
    maximum_x: int,
) -> list[tuple[tuple[float, float, float], int]]:
    buckets: dict[tuple[int, int, int], list[float]] = {}
    # Sampling every second pixel is ample for the intentionally low-resolution
    # source while avoiding a large temporary allocation inside Blender.
    for y in range(0, height, 2):
        for x in range(minimum_x, maximum_x, 2):
            index = (y * width + x) * 4
            alpha = pixels[index + 3]
            if alpha < 0.55:
                continue
            rgb = (pixels[index], pixels[index + 1], pixels[index + 2])
            if max(rgb) < 0.035:
                continue
            key = tuple(min(31, max(0, int(round(channel * 31)))) for channel in rgb)
            entry = buckets.setdefault(key, [0.0, 0.0, 0.0, 0.0])
            entry[0] += rgb[0]
            entry[1] += rgb[1]
            entry[2] += rgb[2]
            entry[3] += 1
    candidates = []
    for total in buckets.values():
        count = int(total[3])
        if count < 2:
            continue
        candidates.append(((total[0] / count, total[1] / count, total[2] / count), count))
    if len(candidates) < 24:
        raise RuntimeError(f"GPT bird source retained too few opaque colour buckets ({len(candidates)})")
    return candidates


def select_source_palette(
    candidates: Sequence[tuple[tuple[float, float, float], int]],
    targets: dict[str, int],
) -> dict[str, tuple[float, float, float]]:
    palette: dict[str, tuple[float, float, float]] = {}
    for name in TILE_ORDER:
        target = srgb_tuple(targets[name])
        # Common feather pixels win ties over isolated antialiasing remnants.
        color, _count = min(
            candidates,
            key=lambda item: distance_sq(item[0], target) - min(0.025, math.log2(item[1] + 1) * 0.0015),
        )
        palette[name] = color
    return palette


def tile_origin(breed_index: int, tile_index: int) -> tuple[int, int]:
    return breed_index * 64 + (tile_index % 4) * TILE_SIZE, (tile_index // 4) * TILE_SIZE


def generate_atlas(source_path: Path, atlas_path: Path, seed: int) -> tuple[bpy.types.Image, dict[str, dict[str, tuple[float, float, float]]]]:
    source = bpy.data.images.load(str(source_path), check_existing=False)
    source.colorspace_settings.name = "sRGB"
    width, height = int(source.size[0]), int(source.size[1])
    if width < 256 or height < 256:
        raise ValueError(f"Bird source must be at least 256x256, got {width}x{height}")
    pixels = list(source.pixels[:])
    halves = ((0, width // 2), (width // 2, width))
    palettes: dict[str, dict[str, tuple[float, float, float]]] = {}
    for breed_name, bounds in zip(("ash", "azure"), halves):
        candidates = source_color_buckets(pixels, width, height, *bounds)
        palettes[breed_name] = select_source_palette(candidates, BREED_TARGETS[breed_name])

    atlas_pixels = [0.0] * (ATLAS_WIDTH * ATLAS_HEIGHT * 4)
    for breed_index, breed_name in enumerate(("ash", "azure")):
        palette = palettes[breed_name]
        breed_rng = random.Random(seed ^ (0xA511E9B3 if breed_name == "ash" else 0x63D83595))
        for tile_index, semantic in enumerate(TILE_ORDER):
            x0, y0 = tile_origin(breed_index, tile_index)
            base = palette[semantic]
            lighter = palette["body_light" if semantic not in ("eye", "foot", "shadow") else "eye_highlight"]
            darker = palette["shadow" if semantic != "eye_highlight" else "eye"]
            phase = breed_rng.randrange(17)
            for y in range(TILE_SIZE):
                for x in range(TILE_SIZE):
                    # Two-pixel clusters create readable feather variation while
                    # remaining crisp under nearest sampling and low mip budgets.
                    cluster = ((x // 2) * 3 + (y // 2) * 5 + tile_index * 7 + phase) % 19
                    color = lighter if cluster == 0 else darker if cluster in (7, 13) else base
                    target = ((y0 + y) * ATLAS_WIDTH + x0 + x) * 4
                    atlas_pixels[target : target + 4] = (*color, 1.0)

    atlas = bpy.data.images.new("Worldloom_Bird_Atlas_128x64", ATLAS_WIDTH, ATLAS_HEIGHT, alpha=True)
    atlas.colorspace_settings.name = "sRGB"
    atlas.pixels[:] = atlas_pixels
    atlas.filepath_raw = str(atlas_path)
    atlas.file_format = "PNG"
    atlas_path.parent.mkdir(parents=True, exist_ok=True)
    atlas.save()
    # Saving adopts the destination basename as Blender's datablock name. Put
    # the stable authored name back before packing so GLB bytes do not depend on
    # the caller's temporary output path during reproducibility checks.
    atlas.name = "Worldloom_Bird_Atlas_128x64"
    atlas.pack()
    atlas["source_file"] = source_path.name
    atlas["generator_version"] = GENERATOR_VERSION
    atlas["pixel_filter"] = "nearest"
    atlas["breed_layout"] = "ash:0,0,64,64;azure:64,0,64,64"
    bpy.data.images.remove(source)
    return atlas, palettes


def principled_input(node: bpy.types.Node, *names: str):
    for name in names:
        socket = node.inputs.get(name)
        if socket is not None:
            return socket
    return None


def create_material(atlas: bpy.types.Image) -> bpy.types.Material:
    material = bpy.data.materials.new("Worldloom_Bird_Pixel_Atlas")
    material.use_nodes = True
    material.diffuse_color = (1.0, 1.0, 1.0, 1.0)
    material.use_backface_culling = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    principled = nodes.get("Principled BSDF")
    texture = nodes.new("ShaderNodeTexImage")
    texture.name = "Nearest_Worldloom_Bird_Atlas"
    texture.label = "128x64 GPT-derived bird atlas"
    texture.image = atlas
    texture.interpolation = "Closest"
    texture.extension = "EXTEND"
    if principled:
        base = principled_input(principled, "Base Color")
        roughness = principled_input(principled, "Roughness")
        metallic = principled_input(principled, "Metallic")
        if base:
            links.new(texture.outputs["Color"], base)
        if roughness:
            roughness.default_value = 0.9
        if metallic:
            metallic.default_value = 0.0
    material["atlas_pixels"] = f"{ATLAS_WIDTH}x{ATLAS_HEIGHT}"
    material["runtime_filter"] = "nearest_no_mipmaps"
    return material


def create_collection(name: str) -> bpy.types.Collection:
    collection = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(collection)
    return collection


def create_pivot(
    name: str,
    collection: bpy.types.Collection,
    parent: bpy.types.Object,
    location: Sequence[float],
) -> bpy.types.Object:
    obj = bpy.data.objects.new(name, None)
    collection.objects.link(obj)
    obj.parent = parent
    obj.location = location
    obj.rotation_mode = "XYZ"
    obj.empty_display_type = "PLAIN_AXES"
    obj.empty_display_size = 0.055
    obj["animated_voxel_pivot"] = True
    return obj


def tile_uvs(breed_index: int, semantic: str) -> tuple[tuple[float, float], ...]:
    tile_index = TILE_ORDER.index(semantic)
    x0, y0 = tile_origin(breed_index, tile_index)
    u0 = (x0 + 0.5) / ATLAS_WIDTH
    u1 = (x0 + TILE_SIZE - 0.5) / ATLAS_WIDTH
    v0 = (y0 + 0.5) / ATLAS_HEIGHT
    v1 = (y0 + TILE_SIZE - 0.5) / ATLAS_HEIGHT
    return ((u0, v0), (u1, v0), (u1, v1), (u0, v1))


def create_mesh_object(
    name: str,
    vertices: Iterable[Sequence[float]],
    faces: Iterable[Sequence[int]],
    collection: bpy.types.Collection,
    parent: bpy.types.Object,
    material: bpy.types.Material,
    breed_index: int,
    semantic: str,
) -> bpy.types.Object:
    mesh = bpy.data.meshes.new(f"{name}_Mesh")
    mesh.from_pydata(list(vertices), [], list(faces))
    mesh.materials.append(material)
    mesh.update(calc_edges=True)
    uv_layer = mesh.uv_layers.new(name="UVMap")
    quad_uv = tile_uvs(breed_index, semantic)
    for polygon in mesh.polygons:
        for index, loop_index in enumerate(polygon.loop_indices):
            uv_layer.data[loop_index].uv = quad_uv[index % 4]
    mesh.validate(clean_customdata=False)
    mesh.calc_loop_triangles()
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    obj.parent = parent
    obj["pixel_atlas_tile"] = semantic
    obj["triangle_count"] = len(mesh.loop_triangles)
    return obj


BOX_FACES = (
    (0, 3, 2, 1),
    (4, 5, 6, 7),
    (0, 1, 5, 4),
    (1, 2, 6, 5),
    (2, 3, 7, 6),
    (3, 0, 4, 7),
)


def create_box(
    name: str,
    size: Sequence[float],
    center: Sequence[float],
    collection: bpy.types.Collection,
    parent: bpy.types.Object,
    material: bpy.types.Material,
    breed_index: int,
    semantic: str,
) -> bpy.types.Object:
    hx, hy, hz = (float(size[0]) * 0.5, float(size[1]) * 0.5, float(size[2]) * 0.5)
    cx, cy, cz = (float(center[0]), float(center[1]), float(center[2]))
    vertices = (
        (cx - hx, cy - hy, cz - hz),
        (cx + hx, cy - hy, cz - hz),
        (cx + hx, cy + hy, cz - hz),
        (cx - hx, cy + hy, cz - hz),
        (cx - hx, cy - hy, cz + hz),
        (cx + hx, cy - hy, cz + hz),
        (cx + hx, cy + hy, cz + hz),
        (cx - hx, cy + hy, cz + hz),
    )
    return create_mesh_object(
        name, vertices, BOX_FACES, collection, parent, material, breed_index, semantic,
    )


def create_beak(
    name: str,
    length: float,
    width: float,
    height: float,
    collection: bpy.types.Collection,
    parent: bpy.types.Object,
    material: bpy.types.Material,
    breed_index: int,
) -> bpy.types.Object:
    half_width = width * 0.5
    half_height = height * 0.5
    vertices = (
        (-half_width, 0.0, -half_height),
        (half_width, 0.0, -half_height),
        (half_width, 0.0, half_height),
        (-half_width, 0.0, half_height),
        (-width * 0.1, -length, -height * 0.1),
        (width * 0.1, -length, -height * 0.1),
        (width * 0.1, -length, height * 0.1),
        (-width * 0.1, -length, height * 0.1),
    )
    return create_mesh_object(
        name, vertices, BOX_FACES, collection, parent, material, breed_index, "beak",
    )


def build_bird(
    collection: bpy.types.Collection,
    pack: bpy.types.Object,
    material: bpy.types.Material,
    *,
    breed_index: int,
    root_name: str,
    display_name: str,
    slenderness: float,
    scale: float,
) -> dict[str, object]:
    prefix = root_name.removesuffix("_Asset")
    root = create_pivot(root_name, collection, pack, (0.0, 0.0, 0.0))
    root.scale = (0.46 * scale, 0.46 * scale, 0.46 * scale)
    root["asset_role"] = "ambient_animated_bird"
    root["breed"] = display_name
    root["breed_key"] = "ash_sparrow" if breed_index == 0 else "pond_azurefin"
    root["target_height_m"] = round(0.56 * scale, 3)
    root["forward_axis_blender"] = "-Y"
    root["forward_axis_gltf"] = "+Z"
    root["generator_version"] = GENERATOR_VERSION

    body = create_pivot(f"{prefix}_Body", collection, root, (0.0, 0.04, 0.72))
    head = create_pivot(f"{prefix}_Head", collection, root, (0.0, -0.35, 1.0))
    tail = create_pivot(f"{prefix}_Tail", collection, root, (0.0, 0.39, 0.75))
    wing_l = create_pivot(f"{prefix}_Wing_L", collection, root, (-0.27, -0.01, 0.82))
    wing_r = create_pivot(f"{prefix}_Wing_R", collection, root, (0.27, -0.01, 0.82))
    leg_l = create_pivot(f"{prefix}_Leg_L", collection, root, (-0.14, -0.02, 0.47))
    leg_r = create_pivot(f"{prefix}_Leg_R", collection, root, (0.14, -0.02, 0.47))

    width = 0.62 * slenderness
    create_box(f"{prefix}_Body_Core", (width, 0.72, 0.36), (0, 0.03, 0), collection, body, material, breed_index, "body")
    create_box(f"{prefix}_Body_Back", (width * 0.86, 0.57, 0.18), (0, 0.04, 0.25), collection, body, material, breed_index, "body_light")
    create_box(f"{prefix}_Breast", (width * 0.78, 0.5, 0.2), (0, -0.09, -0.24), collection, body, material, breed_index, "breast")
    create_box(f"{prefix}_Throat", (width * 0.5, 0.1, 0.2), (0, -0.38, 0.01), collection, body, material, breed_index, "throat")

    head_width = 0.46 * slenderness
    create_box(f"{prefix}_Head_Core", (head_width, 0.43, 0.38), (0, 0, 0), collection, head, material, breed_index, "head")
    create_box(f"{prefix}_Head_Cheek", (head_width * 0.84, 0.08, 0.23), (0, -0.22, -0.045), collection, head, material, breed_index, "breast")
    create_box(f"{prefix}_Throat_Accent", (head_width * 0.48, 0.055, 0.13), (0, -0.245, -0.15), collection, head, material, breed_index, "accent")
    create_beak(f"{prefix}_Beak", 0.24, 0.2, 0.13, collection, head, material, breed_index)
    for side, sign in (("L", -1), ("R", 1)):
        eye = create_box(
            f"{prefix}_Eye_{side}", (0.035, 0.105, 0.085),
            (sign * (head_width * 0.5 + 0.018), -0.095, 0.07),
            collection, head, material, breed_index, "eye",
        )
        create_box(
            f"{prefix}_Eye_Glint_{side}", (0.012, 0.035, 0.025),
            (sign * 0.019, -0.045, 0.018), collection, eye, material,
            breed_index, "eye_highlight",
        )

    tail_length = 0.66 if breed_index == 0 else 0.78
    create_box(f"{prefix}_Tail_Center", (0.21, tail_length, 0.105), (0, tail_length * 0.45, 0), collection, tail, material, breed_index, "tail")
    create_box(f"{prefix}_Tail_L", (0.09, tail_length * 0.82, 0.075), (-0.14, tail_length * 0.42, -0.015), collection, tail, material, breed_index, "wing_dark")
    create_box(f"{prefix}_Tail_R", (0.09, tail_length * 0.82, 0.075), (0.14, tail_length * 0.42, -0.015), collection, tail, material, breed_index, "underwing")

    for side, sign, wing in (("L", -1, wing_l), ("R", 1, wing_r)):
        create_box(
            f"{prefix}_Wing_Panel_{side}", (0.3, 0.5, 0.115),
            (sign * 0.145, 0.085, 0), collection, wing, material, breed_index, "wing",
        )
        create_box(
            f"{prefix}_Wing_Tip_{side}", (0.19, 0.32, 0.085),
            (sign * 0.27, 0.24, -0.035), collection, wing, material, breed_index, "wing_dark",
        )
        create_box(
            f"{prefix}_Wing_Bar_{side}", (0.035, 0.37, 0.13),
            (sign * 0.22, 0.08, 0.005), collection, wing, material, breed_index, "accent",
        )

    for side, leg in (("L", leg_l), ("R", leg_r)):
        create_box(f"{prefix}_Shank_{side}", (0.075, 0.075, 0.43), (0, 0, -0.22), collection, leg, material, breed_index, "leg")
        create_box(f"{prefix}_Foot_{side}", (0.13, 0.3, 0.055), (0, -0.09, -0.45), collection, leg, material, breed_index, "foot")
        create_box(f"{prefix}_Rear_Toe_{side}", (0.06, 0.15, 0.045), (0, 0.13, -0.45), collection, leg, material, breed_index, "foot")

    nodes = {
        "body": body,
        "head": head,
        "tail": tail,
        "wing_l": wing_l,
        "wing_r": wing_r,
        "leg_l": leg_l,
        "leg_r": leg_r,
    }
    for key, node in nodes.items():
        node["bird_part"] = key
        node["breed_root"] = root_name
    return {"root": root, "nodes": nodes, "prefix": prefix, "display_name": display_name}


def mesh_descendants(root: bpy.types.Object) -> list[bpy.types.Object]:
    found: list[bpy.types.Object] = []
    pending = list(root.children)
    while pending:
        node = pending.pop()
        pending.extend(node.children)
        if node.type == "MESH":
            found.append(node)
    return found


def merge_part_geometry(breed: dict[str, object], material: bpy.types.Material) -> None:
    """Collapse each animated pivot to one draw without baking away its motion."""
    nodes: dict[str, bpy.types.Object] = breed["nodes"]  # type: ignore[assignment]
    for key, pivot in nodes.items():
        meshes = mesh_descendants(pivot)
        if not meshes:
            raise RuntimeError(f"Animated bird pivot {pivot.name} has no geometry")
        bpy.ops.object.select_all(action="DESELECT")
        for mesh in meshes:
            mesh.select_set(True)
        active = meshes[0]
        bpy.context.view_layer.objects.active = active
        bpy.ops.object.join()
        active.name = f"{breed['prefix']}_{key.title()}_Geometry"
        active.data.name = f"{active.name}_Mesh"
        active.parent = pivot
        active.data.materials.clear()
        active.data.materials.append(material)
        for polygon in active.data.polygons:
            polygon.material_index = 0
        active.data.validate(clean_customdata=False)
        active.data.calc_loop_triangles()
        active["merged_voxel_part"] = key
        active["triangle_count"] = len(active.data.loop_triangles)
    root: bpy.types.Object = breed["root"]  # type: ignore[assignment]
    root["runtime_mesh_draws"] = len(nodes)


def delta_pose(
    *,
    loc: Sequence[float] = (0.0, 0.0, 0.0),
    rot: Sequence[float] = (0.0, 0.0, 0.0),
    scale: Sequence[float] = (1.0, 1.0, 1.0),
) -> dict[str, tuple[float, float, float]]:
    return {"loc": tuple(loc), "rot": tuple(rot), "scale": tuple(scale)}


def full_pose(**parts: dict[str, tuple[float, float, float]]) -> dict[str, dict[str, tuple[float, float, float]]]:
    return parts


def clip_specs() -> dict[str, list[tuple[int, dict[str, dict[str, tuple[float, float, float]]]]]]:
    neutral = delta_pose()
    return {
        "Perch_Idle_Loop": [
            (1, full_pose(body=neutral, head=neutral, tail=neutral, wing_l=neutral, wing_r=neutral, leg_l=neutral, leg_r=neutral)),
            (17, full_pose(body=delta_pose(loc=(0, 0, 0.014), scale=(1.0, 1.0, 1.025)), head=delta_pose(rot=(0.0, 0.0, 0.14)), tail=delta_pose(rot=(-0.07, 0, 0)), wing_l=delta_pose(rot=(0, 0.045, 0)), wing_r=delta_pose(rot=(0, -0.045, 0)), leg_l=neutral, leg_r=neutral)),
            (33, full_pose(body=delta_pose(loc=(0, 0, 0.004)), head=delta_pose(rot=(0.03, 0.0, -0.2)), tail=delta_pose(rot=(0.06, 0, 0)), wing_l=neutral, wing_r=neutral, leg_l=neutral, leg_r=neutral)),
            (49, full_pose(body=neutral, head=neutral, tail=neutral, wing_l=neutral, wing_r=neutral, leg_l=neutral, leg_r=neutral)),
        ],
        "Flight_Loop": [
            (1, full_pose(body=delta_pose(loc=(0, 0, 0.015), rot=(-0.08, 0, 0)), head=delta_pose(rot=(0.04, 0, 0)), tail=delta_pose(rot=(0.08, 0, 0)), wing_l=delta_pose(rot=(0, 0.92, 0)), wing_r=delta_pose(rot=(0, -0.92, 0)), leg_l=delta_pose(rot=(-0.62, 0, 0)), leg_r=delta_pose(rot=(-0.62, 0, 0)))),
            (7, full_pose(body=delta_pose(loc=(0, 0, -0.006), rot=(0.035, 0, 0)), head=neutral, tail=delta_pose(rot=(-0.12, 0, 0)), wing_l=delta_pose(rot=(0, 0.08, 0)), wing_r=delta_pose(rot=(0, -0.08, 0)), leg_l=delta_pose(rot=(-0.65, 0, 0)), leg_r=delta_pose(rot=(-0.65, 0, 0)))),
            (13, full_pose(body=delta_pose(loc=(0, 0, 0.025), rot=(-0.06, 0, 0)), head=delta_pose(rot=(0.025, 0, 0)), tail=delta_pose(rot=(0.1, 0, 0)), wing_l=delta_pose(rot=(0, -0.8, 0)), wing_r=delta_pose(rot=(0, 0.8, 0)), leg_l=delta_pose(rot=(-0.62, 0, 0)), leg_r=delta_pose(rot=(-0.62, 0, 0)))),
            (19, full_pose(body=delta_pose(loc=(0, 0, -0.004), rot=(0.025, 0, 0)), head=neutral, tail=delta_pose(rot=(-0.08, 0, 0)), wing_l=delta_pose(rot=(0, 0.12, 0)), wing_r=delta_pose(rot=(0, -0.12, 0)), leg_l=delta_pose(rot=(-0.65, 0, 0)), leg_r=delta_pose(rot=(-0.65, 0, 0)))),
            (25, full_pose(body=delta_pose(loc=(0, 0, 0.015), rot=(-0.08, 0, 0)), head=delta_pose(rot=(0.04, 0, 0)), tail=delta_pose(rot=(0.08, 0, 0)), wing_l=delta_pose(rot=(0, 0.92, 0)), wing_r=delta_pose(rot=(0, -0.92, 0)), leg_l=delta_pose(rot=(-0.62, 0, 0)), leg_r=delta_pose(rot=(-0.62, 0, 0)))),
        ],
        "Takeoff": [
            (1, full_pose(body=neutral, head=neutral, tail=neutral, wing_l=neutral, wing_r=neutral, leg_l=neutral, leg_r=neutral)),
            (7, full_pose(body=delta_pose(loc=(0, 0.045, -0.035), rot=(0.12, 0, 0)), head=delta_pose(rot=(-0.08, 0, 0)), tail=delta_pose(rot=(-0.18, 0, 0)), wing_l=delta_pose(rot=(0, 0.9, 0)), wing_r=delta_pose(rot=(0, -0.9, 0)), leg_l=delta_pose(rot=(0.18, 0, 0)), leg_r=delta_pose(rot=(0.18, 0, 0)))),
            (14, full_pose(body=delta_pose(loc=(0, -0.02, 0.04), rot=(-0.22, 0, 0)), head=delta_pose(rot=(0.08, 0, 0)), tail=delta_pose(rot=(0.18, 0, 0)), wing_l=delta_pose(rot=(0, -0.72, 0)), wing_r=delta_pose(rot=(0, 0.72, 0)), leg_l=delta_pose(rot=(-0.52, 0, 0)), leg_r=delta_pose(rot=(-0.52, 0, 0)))),
            (23, full_pose(body=delta_pose(loc=(0, 0, 0.06), rot=(-0.1, 0, 0)), head=delta_pose(rot=(0.04, 0, 0)), tail=delta_pose(rot=(0.08, 0, 0)), wing_l=delta_pose(rot=(0, 0.25, 0)), wing_r=delta_pose(rot=(0, -0.25, 0)), leg_l=delta_pose(rot=(-0.62, 0, 0)), leg_r=delta_pose(rot=(-0.62, 0, 0)))),
        ],
        "Landing": [
            (1, full_pose(body=delta_pose(loc=(0, 0, 0.06), rot=(-0.08, 0, 0)), head=delta_pose(rot=(0.03, 0, 0)), tail=delta_pose(rot=(0.08, 0, 0)), wing_l=delta_pose(rot=(0, 0.3, 0)), wing_r=delta_pose(rot=(0, -0.3, 0)), leg_l=delta_pose(rot=(-0.58, 0, 0)), leg_r=delta_pose(rot=(-0.58, 0, 0)))),
            (9, full_pose(body=delta_pose(loc=(0, 0.03, 0.035), rot=(0.15, 0, 0)), head=delta_pose(rot=(-0.06, 0, 0)), tail=delta_pose(rot=(-0.2, 0, 0)), wing_l=delta_pose(rot=(0, 0.95, 0)), wing_r=delta_pose(rot=(0, -0.95, 0)), leg_l=delta_pose(rot=(0.15, 0, 0)), leg_r=delta_pose(rot=(0.15, 0, 0)))),
            (17, full_pose(body=delta_pose(loc=(0, 0, 0.01), rot=(0.05, 0, 0)), head=neutral, tail=delta_pose(rot=(-0.08, 0, 0)), wing_l=delta_pose(rot=(0, -0.2, 0)), wing_r=delta_pose(rot=(0, 0.2, 0)), leg_l=neutral, leg_r=neutral)),
            (25, full_pose(body=neutral, head=neutral, tail=neutral, wing_l=neutral, wing_r=neutral, leg_l=neutral, leg_r=neutral)),
        ],
        "Pond_Peck_Loop": [
            (1, full_pose(body=neutral, head=neutral, tail=neutral, wing_l=neutral, wing_r=neutral, leg_l=neutral, leg_r=neutral)),
            (10, full_pose(body=delta_pose(loc=(0, -0.025, -0.015), rot=(0.09, 0, 0)), head=delta_pose(rot=(0.72, 0, 0)), tail=delta_pose(rot=(-0.08, 0, 0)), wing_l=delta_pose(rot=(0, 0.04, 0)), wing_r=delta_pose(rot=(0, -0.04, 0)), leg_l=neutral, leg_r=neutral)),
            (17, full_pose(body=delta_pose(loc=(0, -0.01, 0)), head=delta_pose(rot=(0.25, 0, 0.08)), tail=neutral, wing_l=neutral, wing_r=neutral, leg_l=neutral, leg_r=neutral)),
            (30, full_pose(body=delta_pose(loc=(0, -0.02, -0.012), rot=(0.07, 0, 0)), head=delta_pose(rot=(0.64, 0, -0.06)), tail=delta_pose(rot=(-0.06, 0, 0)), wing_l=neutral, wing_r=neutral, leg_l=neutral, leg_r=neutral)),
            (49, full_pose(body=neutral, head=neutral, tail=neutral, wing_l=neutral, wing_r=neutral, leg_l=neutral, leg_r=neutral)),
        ],
        "Ground_Idle_Loop": [
            (1, full_pose(body=neutral, head=neutral, tail=neutral, wing_l=neutral, wing_r=neutral, leg_l=neutral, leg_r=neutral)),
            (19, full_pose(body=delta_pose(loc=(0, 0, 0.01)), head=delta_pose(rot=(-0.03, 0, 0.24)), tail=delta_pose(rot=(0.05, 0, 0)), wing_l=neutral, wing_r=neutral, leg_l=delta_pose(rot=(0.035, 0, 0)), leg_r=delta_pose(rot=(-0.035, 0, 0)))),
            (37, full_pose(body=delta_pose(loc=(0, 0, 0.018)), head=delta_pose(rot=(0.02, 0, -0.2)), tail=delta_pose(rot=(-0.04, 0, 0)), wing_l=delta_pose(rot=(0, 0.035, 0)), wing_r=delta_pose(rot=(0, -0.035, 0)), leg_l=delta_pose(rot=(-0.025, 0, 0)), leg_r=delta_pose(rot=(0.025, 0, 0)))),
            (61, full_pose(body=neutral, head=neutral, tail=neutral, wing_l=neutral, wing_r=neutral, leg_l=neutral, leg_r=neutral)),
        ],
    }


def install_clip(
    breed: dict[str, object],
    clip_name: str,
    samples: Sequence[tuple[int, dict[str, dict[str, tuple[float, float, float]]]]],
) -> None:
    nodes: dict[str, bpy.types.Object] = breed["nodes"]  # type: ignore[assignment]
    full_name = f"{breed['prefix']}_{clip_name}"
    for key, obj in nodes.items():
        rest_location = obj.location.copy()
        rest_rotation = obj.rotation_euler.copy()
        rest_scale = obj.scale.copy()
        action = bpy.data.actions.new(f"{full_name}__{key}")
        obj.animation_data_create()
        obj.animation_data.action = action
        for frame, pose_by_part in samples:
            pose = pose_by_part.get(key, delta_pose())
            obj.location = rest_location + Vector(pose["loc"])
            obj.rotation_euler = (
                rest_rotation.x + pose["rot"][0],
                rest_rotation.y + pose["rot"][1],
                rest_rotation.z + pose["rot"][2],
            )
            obj.scale = (
                rest_scale.x * pose["scale"][0],
                rest_scale.y * pose["scale"][1],
                rest_scale.z * pose["scale"][2],
            )
            obj.keyframe_insert(data_path="location", frame=frame, group="Bird motion")
            obj.keyframe_insert(data_path="rotation_euler", frame=frame, group="Bird motion")
            obj.keyframe_insert(data_path="scale", frame=frame, group="Bird motion")
        track = obj.animation_data.nla_tracks.new()
        track.name = full_name
        strip = track.strips.new(full_name, int(samples[0][0]), action)
        strip.name = full_name
        strip.action_frame_start = float(samples[0][0])
        strip.action_frame_end = float(samples[-1][0])
        strip.extrapolation = "NOTHING"
        obj.animation_data.action = None
        obj.location = rest_location
        obj.rotation_euler = rest_rotation
        obj.scale = rest_scale


def add_animations(breed: dict[str, object]) -> list[str]:
    names = []
    for clip_name, samples in clip_specs().items():
        install_clip(breed, clip_name, samples)
        names.append(f"{breed['prefix']}_{clip_name}")
    root: bpy.types.Object = breed["root"]  # type: ignore[assignment]
    root["animation_clips"] = ";".join(names)
    return names


def export_glb(output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    requested = {
        "filepath": str(output),
        "export_format": "GLB",
        "use_selection": True,
        "export_animations": True,
        "export_animation_mode": "NLA_TRACKS",
        "export_nla_strips": True,
        "export_anim_single_armature": False,
        "export_frame_range": False,
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
        "export_skins": False,
        "export_optimize_animation_size": True,
        "export_optimize_animation_keep_anim_object": True,
        "export_draco_mesh_compression_enable": False,
    }
    supported = {prop.identifier for prop in bpy.ops.export_scene.gltf.get_rna_type().properties}
    result = bpy.ops.export_scene.gltf(**{key: value for key, value in requested.items() if key in supported})
    if "FINISHED" not in result:
        raise RuntimeError(f"glTF export did not finish: {sorted(result)}")


def mute_animation_for_preview(breed: dict[str, object]) -> None:
    nodes: dict[str, bpy.types.Object] = breed["nodes"]  # type: ignore[assignment]
    for obj in nodes.values():
        if obj.animation_data:
            for track in obj.animation_data.nla_tracks:
                track.mute = True
        obj.location = Vector(obj.location)
        obj.rotation_euler = (0.0, 0.0, 0.0)
        obj.scale = (1.0, 1.0, 1.0)


def look_at(obj: bpy.types.Object, point: Sequence[float]) -> None:
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat("-Z", "Y").to_euler()


def flat_material(name: str, color: Sequence[float], roughness: float = 0.9) -> bpy.types.Material:
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    principled = material.node_tree.nodes.get("Principled BSDF")
    base = principled_input(principled, "Base Color") if principled else None
    rough = principled_input(principled, "Roughness") if principled else None
    if base:
        base.default_value = (*color[:3], 1.0)
    if rough:
        rough.default_value = roughness
    return material


def render_preview(preview: Path, breeds: Sequence[dict[str, object]]) -> None:
    preview.parent.mkdir(parents=True, exist_ok=True)
    for breed in breeds:
        mute_animation_for_preview(breed)
    ash_root: bpy.types.Object = breeds[0]["root"]  # type: ignore[assignment]
    azure_root: bpy.types.Object = breeds[1]["root"]  # type: ignore[assignment]
    ash_root.location = (-0.72, 0.0, 0.38)
    azure_root.location = (0.72, 0.08, 0.93)
    azure_root.rotation_euler[2] = -0.14
    azure_nodes: dict[str, bpy.types.Object] = breeds[1]["nodes"]  # type: ignore[assignment]
    azure_nodes["wing_l"].rotation_euler[1] = 0.72
    azure_nodes["wing_r"].rotation_euler[1] = -0.72
    azure_nodes["leg_l"].rotation_euler[0] = -0.58
    azure_nodes["leg_r"].rotation_euler[0] = -0.58
    azure_nodes["body"].rotation_euler[0] = -0.08

    branch_material = flat_material("QA_Branch_Bark", (0.16, 0.09, 0.035))
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.7, 0.08, 0.29))
    branch = bpy.context.object
    branch.name = "QA_Perch_Branch"
    branch.scale = (0.72, 0.09, 0.075)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    branch.data.materials.append(branch_material)

    ground_material = flat_material("QA_Grass", (0.19, 0.34, 0.16))
    bpy.ops.mesh.primitive_plane_add(size=6.0, location=(0.0, 0.0, 0.0))
    ground = bpy.context.object
    ground.name = "QA_Ground"
    ground.data.materials.append(ground_material)

    water_material = flat_material("QA_Pond_Water", (0.075, 0.29, 0.38), 0.32)
    bpy.ops.mesh.primitive_plane_add(size=2.1, location=(0.95, 0.48, 0.012))
    water = bpy.context.object
    water.name = "QA_Pond"
    water.scale = (1.0, 0.48, 1.0)
    water.data.materials.append(water_material)

    camera_data = bpy.data.cameras.new("QA_Bird_Camera")
    camera = bpy.data.objects.new("QA_Bird_Camera", camera_data)
    bpy.context.scene.collection.objects.link(camera)
    camera.location = (2.25, -4.35, 1.72)
    look_at(camera, (0.0, 0.0, 0.72))
    camera_data.lens = 66
    bpy.context.scene.camera = camera

    key_data = bpy.data.lights.new("QA_Bird_Key", type="AREA")
    key_data.energy = 900
    key_data.shape = "DISK"
    key_data.size = 4.0
    key = bpy.data.objects.new("QA_Bird_Key", key_data)
    bpy.context.scene.collection.objects.link(key)
    key.location = (-2.8, -3.4, 5.0)
    look_at(key, (0.0, 0.0, 0.6))
    fill_data = bpy.data.lights.new("QA_Bird_Fill", type="AREA")
    fill_data.energy = 420
    fill_data.size = 3.2
    fill = bpy.data.objects.new("QA_Bird_Fill", fill_data)
    bpy.context.scene.collection.objects.link(fill)
    fill.location = (3.5, -0.6, 2.7)
    look_at(fill, (0.0, 0.0, 0.7))

    scene = bpy.context.scene
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except (TypeError, ValueError):
        scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1024
    scene.render.resolution_y = 640
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = False
    scene.render.filepath = str(preview)
    scene.world.color = (0.055, 0.085, 0.11)
    bpy.ops.render.render(write_still=True)


def main() -> None:
    args = parse_args()
    reset_scene()
    atlas, palettes = generate_atlas(args.source, args.atlas, args.seed)
    material = create_material(atlas)
    collection = create_collection("Worldloom_Animated_Birds")
    pack = bpy.data.objects.new("Worldloom_Bird_Asset_Pack", None)
    collection.objects.link(pack)
    pack["generator"] = Path(__file__).name
    pack["generator_version"] = GENERATOR_VERSION
    pack["seed"] = args.seed
    pack["source_texture"] = args.source.name
    pack["breeds"] = "ash_sparrow;pond_azurefin"
    pack["animation_system"] = "named_rigid_hierarchy_nla"

    ash = build_bird(
        collection, pack, material, breed_index=0, root_name="Ash_Sparrow_Asset",
        display_name="Ash Sparrow", slenderness=1.0, scale=args.scale,
    )
    azure = build_bird(
        collection, pack, material, breed_index=1, root_name="Pond_Azurefin_Asset",
        display_name="Pond Azurefin", slenderness=0.91, scale=args.scale * 0.96,
    )
    merge_part_geometry(ash, material)
    merge_part_geometry(azure, material)
    clip_names = add_animations(ash) + add_animations(azure)
    export_glb(args.output)
    if args.preview:
        render_preview(args.preview, (ash, azure))

    triangles = 0
    for obj in collection.objects:
        if obj.type == "MESH":
            obj.data.calc_loop_triangles()
            triangles += len(obj.data.loop_triangles)
    manifest = {
        "output": str(args.output),
        "atlas": str(args.atlas),
        "preview": str(args.preview) if args.preview else None,
        "source": str(args.source),
        "seed": args.seed,
        "generator_version": GENERATOR_VERSION,
        "breeds": ["Ash Sparrow", "Pond Azurefin"],
        "clips": clip_names,
        "triangles": triangles,
        "atlas_size": [ATLAS_WIDTH, ATLAS_HEIGHT],
        "palette": {
            breed: {name: "#" + "".join(f"{round(channel * 255):02x}" for channel in color) for name, color in values.items()}
            for breed, values in palettes.items()
        },
    }
    print("BIRD_ASSET_EXPORT " + json.dumps(manifest, sort_keys=True))


if __name__ == "__main__":
    main()
