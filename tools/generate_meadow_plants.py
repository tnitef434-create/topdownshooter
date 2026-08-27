"""Generate Worldloom's opaque Blender meadow-plant pack.

Run from the repository root with Blender 5.2:

  "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" --background \
    --factory-startup --python tools/generate_meadow_plants.py -- \
    --atlas src/public/worldloom/assets/environment/meadow-plants-atlas.png \
    --output src/public/worldloom/assets/environment/meadow-plants.glb \
    --preview outputs/meadow-plants-qa.png

The 128x64 production atlas is already a hard-edged, opaque derivative of the
preserved GPT Image source sheets. This generator never creates alpha cards:
the sunflower is assembled from textured cuboids and the short grass uses ten
tapered, opaque blade quads whose silhouette comes from geometry.
"""

from __future__ import annotations

import argparse
import math
import random
import sys
from pathlib import Path
from typing import Sequence

import bpy
from mathutils import Matrix, Vector


GENERATOR_VERSION = "1.0.0"
DEFAULT_SEED = 270827
REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ATLAS = (
    REPOSITORY_ROOT
    / "src/public/worldloom/assets/environment/meadow-plants-atlas.png"
)
DEFAULT_OUTPUT = (
    REPOSITORY_ROOT
    / "src/public/worldloom/assets/environment/meadow-plants.glb"
)
DEFAULT_PREVIEW = REPOSITORY_ROOT / "outputs/meadow-plants-qa.png"

ATLAS_WIDTH = 128
ATLAS_HEIGHT = 64
ATLAS_COLUMNS = 4
ATLAS_ROWS = 2

# Atlas cells are named from the top-left, matching the source-sheet records.
SUNFLOWER_PETAL = (0, 0)
SUNFLOWER_CENTRE = (1, 0)
SUNFLOWER_STEM = (0, 1)
SUNFLOWER_LEAF = (1, 1)
SHORT_GRASS_TILES = ((2, 0), (3, 0), (2, 1), (3, 1))


def blender_arguments() -> list[str]:
    """Return only the conventional arguments following Blender's ``--``."""
    return sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build Worldloom's opaque sunflower and short-grass GLB pack.",
    )
    parser.add_argument(
        "--atlas",
        type=Path,
        default=DEFAULT_ATLAS,
        help="Existing opaque 128x64 production atlas to embed in the GLB.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help="Destination self-contained .glb path.",
    )
    parser.add_argument(
        "--preview",
        type=Path,
        default=None,
        help="Optional deterministic QA preview PNG path.",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=DEFAULT_SEED,
        help="Deterministic short-grass blade layout seed.",
    )
    args = parser.parse_args(blender_arguments())
    args.atlas = args.atlas.expanduser().resolve()
    args.output = args.output.expanduser().resolve().with_suffix(".glb")
    args.preview = (
        args.preview.expanduser().resolve().with_suffix(".png")
        if args.preview
        else None
    )
    if not args.atlas.is_file():
        parser.error(f"--atlas does not exist: {args.atlas}")
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


def principled_input(node: bpy.types.Node, *names: str):
    for name in names:
        socket = node.inputs.get(name)
        if socket is not None:
            return socket
    return None


def load_atlas(path: Path) -> bpy.types.Image:
    atlas = bpy.data.images.load(str(path), check_existing=False)
    atlas.name = "Worldloom_Meadow_Plants_Atlas_128x64"
    atlas.colorspace_settings.name = "sRGB"
    width, height = int(atlas.size[0]), int(atlas.size[1])
    if (width, height) != (ATLAS_WIDTH, ATLAS_HEIGHT):
        raise ValueError(
            f"Meadow atlas must be {ATLAS_WIDTH}x{ATLAS_HEIGHT}, got {width}x{height}",
        )
    pixels = atlas.pixels[:]
    minimum_alpha = min(pixels[index] for index in range(3, len(pixels), 4))
    if minimum_alpha < 0.999:
        raise ValueError(
            f"Meadow atlas must be fully opaque; minimum alpha was {minimum_alpha:.4f}",
        )
    atlas.pack()
    atlas["source_file"] = path.name
    atlas["source_sunflower"] = "gpt-sunflower-atlas-source.png"
    atlas["source_short_grass"] = "gpt-short-grass-atlas-source.png"
    atlas["pixel_filter"] = "nearest"
    atlas["alpha_contract"] = "fully_opaque"
    return atlas


def create_material(atlas: bpy.types.Image) -> bpy.types.Material:
    material = bpy.data.materials.new("Worldloom_Opaque_Meadow_Plant_Atlas")
    material.use_nodes = True
    material.use_backface_culling = False
    material.diffuse_color = (1.0, 1.0, 1.0, 1.0)
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    principled = nodes.get("Principled BSDF")
    base = principled_input(principled, "Base Color") if principled else None
    roughness = principled_input(principled, "Roughness") if principled else None
    metallic = principled_input(principled, "Metallic") if principled else None
    alpha = principled_input(principled, "Alpha") if principled else None
    if roughness:
        roughness.default_value = 0.94
    if metallic:
        metallic.default_value = 0.0
    if alpha:
        alpha.default_value = 1.0
    texture = nodes.new("ShaderNodeTexImage")
    texture.name = "Nearest_Opaque_Meadow_Plant_Atlas"
    texture.image = atlas
    texture.interpolation = "Closest"
    texture.extension = "CLIP"
    if base:
        links.new(texture.outputs["Color"], base)
    # Intentionally do not connect texture alpha. Every silhouette is authored
    # in geometry, leaving the exported material in glTF OPAQUE mode.
    material["source_texture"] = atlas.get("source_file", "")
    material["runtime_filter"] = "nearest"
    material["alpha_mode"] = "opaque_geometry"
    material["double_sided_for_blades"] = True
    return material


def atlas_region(column: int, row_from_top: int) -> tuple[float, float, float, float]:
    inset_u = 0.5 / ATLAS_WIDTH
    inset_v = 0.5 / ATLAS_HEIGHT
    u0 = column / ATLAS_COLUMNS + inset_u
    u1 = (column + 1) / ATLAS_COLUMNS - inset_u
    v0 = 1.0 - (row_from_top + 1) / ATLAS_ROWS + inset_v
    v1 = 1.0 - row_from_top / ATLAS_ROWS - inset_v
    return u0, v0, u1, v1


def remap_uvs(obj: bpy.types.Object, region: tuple[int, int]) -> None:
    uv_layer = obj.data.uv_layers.active
    if uv_layer is None:
        raise RuntimeError(f"{obj.name} lost its generated UV map")
    u0, v0, u1, v1 = atlas_region(*region)
    for loop in uv_layer.data:
        loop.uv.x = u0 + loop.uv.x * (u1 - u0)
        loop.uv.y = v0 + loop.uv.y * (v1 - v0)


def create_empty(name: str, parent: bpy.types.Object | None = None) -> bpy.types.Object:
    empty = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(empty)
    empty.empty_display_type = "PLAIN_AXES"
    empty.empty_display_size = 0.1
    empty.parent = parent
    return empty


def create_box(
    name: str,
    dimensions: tuple[float, float, float],
    location: tuple[float, float, float],
    rotation: tuple[float, float, float],
    material: bpy.types.Material,
    region: tuple[int, int],
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(
        size=1.0,
        calc_uvs=True,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    remap_uvs(obj, region)
    return obj


def join_objects(
    objects: list[bpy.types.Object],
    name: str,
    material: bpy.types.Material,
) -> bpy.types.Object:
    if not objects:
        raise ValueError(f"Cannot create empty joined mesh {name}")
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    joined = bpy.context.object
    joined.name = name
    joined.data.name = f"{name}_Mesh"
    # Joining transformed cuboids retains the active object's transform. Bake
    # that transform so the authored asset root remains exactly at ground zero.
    joined.data.transform(joined.matrix_world)
    joined.matrix_world = Matrix.Identity(4)
    for polygon in joined.data.polygons:
        polygon.material_index = 0
    while len(joined.data.materials) > 1:
        joined.data.materials.pop(index=len(joined.data.materials) - 1)
    if not joined.data.materials:
        joined.data.materials.append(material)
    elif joined.data.materials[0] != material:
        joined.data.materials[0] = material
    joined.data.validate(clean_customdata=False)
    joined.data.update(calc_edges=True)
    joined.data.calc_loop_triangles()
    return joined


def mesh_height(obj: bpy.types.Object) -> float:
    if not obj.data.vertices:
        return 0.0
    heights = [(obj.matrix_world @ vertex.co).z for vertex in obj.data.vertices]
    return max(heights) - min(heights)


def build_sunflower(
    pack: bpy.types.Object,
    material: bpy.types.Material,
) -> bpy.types.Object:
    root = create_empty("Sunflower_Asset", pack)
    parts: list[bpy.types.Object] = []

    parts.append(create_box(
        "Sunflower_Stem",
        (0.09, 0.09, 0.66),
        (0.0, 0.0, 0.33),
        (0.0, 0.0, 0.0),
        material,
        SUNFLOWER_STEM,
    ))
    parts.append(create_box(
        "Sunflower_Left_Leaf",
        (0.12, 0.065, 0.34),
        (-0.13, 0.015, 0.36),
        (0.0, -0.88, 0.0),
        material,
        SUNFLOWER_LEAF,
    ))
    parts.append(create_box(
        "Sunflower_Right_Leaf",
        (0.12, 0.065, 0.32),
        (0.13, 0.01, 0.49),
        (0.0, 0.91, 0.0),
        material,
        SUNFLOWER_LEAF,
    ))

    bloom_z = 0.78
    for petal_index in range(12):
        angle = petal_index * math.tau / 12.0
        radius = 0.21 if petal_index % 2 == 0 else 0.195
        parts.append(create_box(
            f"Sunflower_Petal_{petal_index + 1:02d}",
            (0.115, 0.075, 0.22),
            (
                math.sin(angle) * radius,
                0.02,
                bloom_z + math.cos(angle) * radius,
            ),
            (0.0, angle, 0.0),
            material,
            SUNFLOWER_PETAL,
        ))

    parts.append(create_box(
        "Sunflower_Seed_Head",
        (0.33, 0.11, 0.33),
        (0.0, -0.025, bloom_z),
        (0.0, 0.0, 0.0),
        material,
        SUNFLOWER_CENTRE,
    ))
    # Nine shallow front voxels give the seed head readable depth without a
    # high-poly cylinder or an outline texture.
    seed_index = 0
    for row in (-1, 0, 1):
        for column in (-1, 0, 1):
            seed_index += 1
            depth = 0.035 + 0.008 * ((row + column) & 1)
            parts.append(create_box(
                f"Sunflower_Seed_Voxel_{seed_index:02d}",
                (0.082, depth, 0.082),
                (column * 0.087, -0.09 - depth * 0.5, bloom_z + row * 0.087),
                (0.0, 0.0, 0.0),
                material,
                SUNFLOWER_CENTRE,
            ))

    mesh = join_objects(parts, "Sunflower_Voxel_Mesh", material)
    mesh.parent = root
    mesh.data.calc_loop_triangles()
    triangle_count = len(mesh.data.loop_triangles)
    authored_height = mesh_height(mesh)
    if triangle_count > 480:
        raise RuntimeError(f"Sunflower exceeds 480 triangles: {triangle_count}")
    root["asset_role"] = "meadow_sunflower"
    root["representation"] = "opaque_textured_voxel_cuboids"
    root["authored_height_metres"] = round(authored_height, 4)
    root["runtime_draw_budget"] = 1
    root["triangle_count"] = triangle_count
    root["petal_cuboids"] = 12
    root["seed_detail_cuboids"] = 9
    root["source_texture"] = "gpt-sunflower-atlas-source.png"
    return root


def build_short_grass(
    pack: bpy.types.Object,
    material: bpy.types.Material,
    seed: int,
) -> bpy.types.Object:
    root = create_empty("Short_Grass_Asset", pack)
    rng = random.Random(seed)
    blade_count = 10
    vertices: list[tuple[float, float, float]] = []
    faces: list[tuple[int, int, int, int]] = []
    regions: list[tuple[int, int]] = []

    # A fixed low-discrepancy footprint keeps the tuft full from every view.
    placements = (
        (-0.27, -0.16), (-0.09, -0.22), (0.12, -0.21), (0.28, -0.08),
        (-0.24, 0.05), (-0.07, 0.00), (0.10, 0.04), (0.25, 0.13),
        (-0.12, 0.20), (0.08, 0.22),
    )
    for blade_index, (center_x, center_y) in enumerate(placements):
        angle = blade_index * math.pi * (3.0 - math.sqrt(5.0)) + rng.uniform(-0.18, 0.18)
        side_x = math.cos(angle)
        side_y = math.sin(angle)
        height = 0.20 + rng.uniform(0.035, 0.10)
        base_width = 0.075 + rng.uniform(0.008, 0.026)
        tip_width = base_width * rng.uniform(0.12, 0.24)
        lean = rng.uniform(0.025, 0.075)
        lean_x = -side_y * lean
        lean_y = side_x * lean
        first = len(vertices)
        vertices.extend((
            (
                center_x - side_x * base_width * 0.5,
                center_y - side_y * base_width * 0.5,
                0.0,
            ),
            (
                center_x + side_x * base_width * 0.5,
                center_y + side_y * base_width * 0.5,
                0.0,
            ),
            (
                center_x + lean_x + side_x * tip_width * 0.5,
                center_y + lean_y + side_y * tip_width * 0.5,
                height,
            ),
            (
                center_x + lean_x - side_x * tip_width * 0.5,
                center_y + lean_y - side_y * tip_width * 0.5,
                height,
            ),
        ))
        faces.append((first, first + 1, first + 2, first + 3))
        regions.append(SHORT_GRASS_TILES[blade_index % len(SHORT_GRASS_TILES)])

    mesh_data = bpy.data.meshes.new("Short_Grass_Blade_Mesh")
    mesh_data.from_pydata(vertices, [], faces)
    mesh_data.materials.append(material)
    mesh_data.update(calc_edges=True)
    uv_layer = mesh_data.uv_layers.new(name="UVMap")
    for blade_index, polygon in enumerate(mesh_data.polygons):
        u0, v0, u1, v1 = atlas_region(*regions[blade_index])
        coordinates = ((u0, v0), (u1, v0), (u1, v1), (u0, v1))
        for loop_index, uv in zip(polygon.loop_indices, coordinates):
            uv_layer.data[loop_index].uv = uv
        polygon.use_smooth = False
    mesh_data.validate(clean_customdata=False)
    mesh_data.calc_loop_triangles()
    grass = bpy.data.objects.new("Short_Grass_Blade_Mesh", mesh_data)
    bpy.context.scene.collection.objects.link(grass)
    grass.parent = root

    triangle_count = len(mesh_data.loop_triangles)
    authored_height = mesh_height(grass)
    if not 8 <= blade_count <= 12:
        raise RuntimeError(f"Short grass must use 8-12 blade quads, got {blade_count}")
    if triangle_count > 24:
        raise RuntimeError(f"Short grass exceeds 24 triangles: {triangle_count}")
    root["asset_role"] = "meadow_short_grass"
    root["representation"] = "opaque_tapered_blade_quads"
    root["authored_height_metres"] = round(authored_height, 4)
    root["runtime_draw_budget"] = 1
    root["blade_quads"] = blade_count
    root["triangle_count"] = triangle_count
    root["double_sided"] = True
    root["source_texture"] = "gpt-short-grass-atlas-source.png"
    return root


def build_pack(
    material: bpy.types.Material,
    seed: int,
) -> tuple[bpy.types.Object, bpy.types.Object, bpy.types.Object]:
    pack = create_empty("Meadow_Plant_Asset_Pack")
    pack["asset_role"] = "worldloom_meadow_plant_pack"
    pack["generator"] = "generate_meadow_plants.py"
    pack["generator_version"] = GENERATOR_VERSION
    pack["seed"] = seed
    pack["runtime_draw_budget"] = 2
    pack["atlas"] = "meadow-plants-atlas.png"
    pack["atlas_dimensions"] = "128x64"
    pack["texture_filter"] = "nearest"
    pack["alpha_contract"] = "opaque_geometry_only"
    pack["sunflower_source"] = "gpt-sunflower-atlas-source.png"
    pack["short_grass_source"] = "gpt-short-grass-atlas-source.png"
    sunflower = build_sunflower(pack, material)
    grass = build_short_grass(pack, material, seed)
    return pack, sunflower, grass


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
    supported = {
        prop.identifier
        for prop in bpy.ops.export_scene.gltf.get_rna_type().properties
    }
    result = bpy.ops.export_scene.gltf(
        **{key: value for key, value in requested.items() if key in supported},
    )
    if "FINISHED" not in result:
        raise RuntimeError(f"glTF export did not finish: {sorted(result)}")


def look_at(obj: bpy.types.Object, point: Sequence[float]) -> None:
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat("-Z", "Y").to_euler()


def render_preview(
    path: Path,
    sunflower: bpy.types.Object,
    grass: bpy.types.Object,
) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    for engine in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE", "BLENDER_WORKBENCH"):
        try:
            scene.render.engine = engine
            break
        except (TypeError, ValueError):
            continue
    scene.render.resolution_x = 900
    scene.render.resolution_y = 700
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = False
    scene.render.filepath = str(path)
    scene.world.color = (0.045, 0.075, 0.035)

    # Preview transforms are intentionally applied only after export.
    sunflower.location.x = -0.58
    grass.location.x = 0.68
    grass.scale = (1.35, 1.35, 1.35)

    bpy.ops.mesh.primitive_plane_add(size=4.5, location=(0.0, 0.0, -0.008))
    ground = bpy.context.object
    ground.name = "QA_Meadow_Ground"
    ground_material = bpy.data.materials.new("QA_Meadow_Ground_Material")
    ground_material.diffuse_color = (0.16, 0.31, 0.09, 1.0)
    ground_material.roughness = 1.0
    ground.data.materials.append(ground_material)

    camera_data = bpy.data.cameras.new("QA_Meadow_Plant_Camera")
    camera = bpy.data.objects.new("QA_Meadow_Plant_Camera", camera_data)
    scene.collection.objects.link(camera)
    camera.location = (2.45, -4.4, 2.05)
    camera_data.lens = 62
    look_at(camera, (0.0, 0.0, 0.48))
    scene.camera = camera

    key_data = bpy.data.lights.new("QA_Warm_Sun", type="AREA")
    key_data.energy = 900
    key_data.size = 4.0
    key_data.color = (1.0, 0.78, 0.48)
    key = bpy.data.objects.new("QA_Warm_Sun", key_data)
    scene.collection.objects.link(key)
    key.location = (-3.0, -3.4, 5.0)
    look_at(key, (0.0, 0.0, 0.5))

    fill_data = bpy.data.lights.new("QA_Sky_Fill", type="AREA")
    fill_data.energy = 460
    fill_data.size = 4.5
    fill_data.color = (0.56, 0.72, 1.0)
    fill = bpy.data.objects.new("QA_Sky_Fill", fill_data)
    scene.collection.objects.link(fill)
    fill.location = (3.2, 1.2, 3.6)
    look_at(fill, (0.0, 0.0, 0.45))
    bpy.ops.render.render(write_still=True)


def main() -> None:
    args = parse_args()
    reset_scene()
    atlas = load_atlas(args.atlas)
    material = create_material(atlas)
    pack, sunflower, grass = build_pack(material, args.seed)
    export_glb(args.output)
    if args.preview:
        render_preview(args.preview, sunflower, grass)
    print(
        "MEADOW_PLANTS_OK "
        f"output={args.output} atlas={args.atlas} "
        f"sunflower_height={sunflower.get('authored_height_metres', 0)} "
        f"sunflower_triangles={sunflower.get('triangle_count', 0)} "
        f"grass_height={grass.get('authored_height_metres', 0)} "
        f"grass_triangles={grass.get('triangle_count', 0)} "
        f"pack={pack.name}"
    )


if __name__ == "__main__":
    main()
