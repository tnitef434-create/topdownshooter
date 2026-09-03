"""Generate Worldloom's hard-pixel sunflower and short-grass asset pack.

Run from the repository root with Blender 5.2:

  "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" --background \
    --factory-startup --python tools/generate_meadow_plants.py -- \
    --output src/public/worldloom/assets/environment/meadow-plants.glb \
    --preview outputs/meadow-plants-qa.png

The red meadow flower is the visual contract for these assets. The sunflower
is a hand-authored 16x16 sprite rebuilt as two crossed voxel reliefs. The
short grass is made from whole, grid-snapped voxel stacks. Both use a small
flat vertex-colour palette: there are no UVs, texture maps, alpha cards,
smooth curves, or antialiased silhouettes in the shipped model.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Sequence

import bpy
from mathutils import Vector


GENERATOR_VERSION = "2.0.0"
DEFAULT_SEED = 270827
REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = (
    REPOSITORY_ROOT
    / "src/public/worldloom/assets/environment/meadow-plants.glb"
)

SUNFLOWER_PIXEL_METRES = 0.0575
SUNFLOWER_DEPTH_RATIO = 0.62
GRASS_VOXEL_METRES = 0.048
GRASS_DEPTH_RATIO = 0.62

# A literal 16x16 sunflower sprite. The same construction is used by
# generate_red_flower.py: every occupied character becomes an extruded square
# pixel and the relief is crossed at 90 degrees so it reads from every angle.
SUNFLOWER_GRID = (
    ".....DHHHD......",
    "...DYYHHHYYD....",
    "..DYYDDDDDYYD...",
    ".DYYDBBBBBBDYY..",
    "DYYDBbbbbbbBDYYD",
    "DYYBbbSssSbbBYYD",
    "DYYBbsSSSSsbBYYD",
    "DYYBbsSSSSsbBYYD",
    ".DYYBbbSSbbBYYD.",
    "..DYYBBBBBYYD...",
    "....DYYgYYD.....",
    "..GG...gg...GG..",
    ".GllG..gg..GllG.",
    "..GllG.gg.GllG..",
    "....Gg.gg.gG....",
    "......gg........",
)

# S/s reuse the two brown values, keeping the authored base palette to the
# same eight colours used by the red flower.
SUNFLOWER_PALETTE_SRGB = {
    "D": (0.55, 0.31, 0.035),
    "Y": (0.94, 0.65, 0.055),
    "H": (1.00, 0.83, 0.18),
    "B": (0.18, 0.075, 0.018),
    "b": (0.39, 0.17, 0.035),
    "S": (0.39, 0.17, 0.035),
    "s": (0.18, 0.075, 0.018),
    "G": (0.075, 0.25, 0.075),
    "g": (0.15, 0.43, 0.11),
    "l": (0.34, 0.61, 0.18),
}

GRASS_GRID = (
    "...L....",
    ".G.l..L.",
    ".g.g..l.",
    "Gg.g.Gg.",
    "gg.g.gg.",
    ".ggglgg.",
    "..gggg..",
    "...dd...",
)

GRASS_PALETTE_SRGB = {
    "d": (0.055, 0.19, 0.055),
    "G": (0.085, 0.28, 0.065),
    "g": (0.13, 0.39, 0.085),
    "l": (0.22, 0.50, 0.12),
    "L": (0.35, 0.60, 0.17),
}

FACE_SHADE = {
    "top": 1.18,
    "bottom": 0.62,
    "south": 1.0,
    "north": 0.86,
    "east": 0.84,
    "west": 0.94,
}


def blender_arguments() -> list[str]:
    return sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build Worldloom's vertex-colour voxel meadow plants.",
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
        help="Recorded deterministic asset-layout seed.",
    )
    args = parser.parse_args(blender_arguments())
    args.output = args.output.expanduser().resolve().with_suffix(".glb")
    args.preview = (
        args.preview.expanduser().resolve().with_suffix(".png")
        if args.preview
        else None
    )
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
        bpy.data.worlds,
    ):
        for block in list(store):
            store.remove(block)
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 1.0


def srgb_to_linear(channel: float) -> float:
    if channel <= 0.04045:
        return channel / 12.92
    return ((channel + 0.055) / 1.055) ** 2.4


def linear_colour(rgb: tuple[float, float, float]) -> tuple[float, float, float, float]:
    return tuple(srgb_to_linear(channel) for channel in rgb) + (1.0,)


def shade(
    colour: tuple[float, float, float, float],
    factor: float,
) -> tuple[float, float, float, float]:
    return (
        min(1.0, colour[0] * factor),
        min(1.0, colour[1] * factor),
        min(1.0, colour[2] * factor),
        colour[3],
    )


def create_material() -> bpy.types.Material:
    material = bpy.data.materials.new("Worldloom_Pixel_Voxel_Plants")
    material.use_nodes = True
    material.use_backface_culling = True
    material.diffuse_color = (1.0, 1.0, 1.0, 1.0)
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    principled = nodes.get("Principled BSDF")
    if principled:
        base = principled.inputs.get("Base Color")
        roughness = principled.inputs.get("Roughness")
        metallic = principled.inputs.get("Metallic")
        alpha = principled.inputs.get("Alpha")
        if base:
            base.default_value = (1.0, 1.0, 1.0, 1.0)
            colour_node = nodes.new("ShaderNodeVertexColor")
            colour_node.layer_name = "Col"
            links.new(colour_node.outputs["Color"], base)
        if roughness:
            roughness.default_value = 0.95
        if metallic:
            metallic.default_value = 0.0
        if alpha:
            alpha.default_value = 1.0
    material["colour_contract"] = "flat_per_face_vertex_colours"
    material["texture_contract"] = "none"
    material["alpha_contract"] = "opaque_geometry"
    return material


def create_empty(name: str, parent: bpy.types.Object | None = None) -> bpy.types.Object:
    empty = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(empty)
    empty.empty_display_type = "PLAIN_AXES"
    empty.empty_display_size = 0.1
    empty.parent = parent
    return empty


def create_coloured_mesh(
    name: str,
    vertices: list[tuple[float, float, float]],
    faces: list[tuple[int, int, int, int]],
    face_colours: list[tuple[float, float, float, float]],
    material: bpy.types.Material,
) -> bpy.types.Object:
    if len(faces) != len(face_colours):
        raise ValueError(f"{name} face/colour count mismatch")
    mesh = bpy.data.meshes.new(f"{name}_Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(material)
    mesh.validate(clean_customdata=False)
    mesh.update(calc_edges=True)
    colour_attribute = mesh.color_attributes.new(
        name="Col",
        type="BYTE_COLOR",
        domain="CORNER",
    )
    for polygon in mesh.polygons:
        polygon.use_smooth = False
        colour = face_colours[polygon.index]
        for loop_index in polygon.loop_indices:
            colour_attribute.data[loop_index].color = colour
    mesh.calc_loop_triangles()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    return obj


def append_face(
    vertices: list[tuple[float, float, float]],
    faces: list[tuple[int, int, int, int]],
    face_colours: list[tuple[float, float, float, float]],
    corners: Sequence[tuple[float, float, float]],
    colour: tuple[float, float, float, float],
) -> None:
    first = len(vertices)
    vertices.extend(corners)
    faces.append((first, first + 1, first + 2, first + 3))
    face_colours.append(colour)


def build_sunflower(
    pack: bpy.types.Object,
    material: bpy.types.Material,
) -> bpy.types.Object:
    rows = len(SUNFLOWER_GRID)
    columns = len(SUNFLOWER_GRID[0])
    if rows != 16 or columns != 16 or any(len(row) != columns for row in SUNFLOWER_GRID):
        raise ValueError("Sunflower source must remain an exact 16x16 logical grid")
    palette = {
        key: linear_colour(rgb)
        for key, rgb in SUNFLOWER_PALETTE_SRGB.items()
    }
    occupied = {
        (column, rows - 1 - row_index): character
        for row_index, row in enumerate(SUNFLOWER_GRID)
        for column, character in enumerate(row)
        if character != "."
    }
    vertices: list[tuple[float, float, float]] = []
    faces: list[tuple[int, int, int, int]] = []
    face_colours: list[tuple[float, float, float, float]] = []
    pixel = SUNFLOWER_PIXEL_METRES
    depth = pixel * SUNFLOWER_DEPTH_RATIO

    def emit_relief(quarter_turns: int) -> None:
        def rotate(point: tuple[float, float, float]) -> tuple[float, float, float]:
            x, y, z = point
            for _ in range(quarter_turns):
                x, y = -y, x
            return x, y, z

        direction_map = {
            0: {
                "top": "top", "bottom": "bottom", "south": "south",
                "north": "north", "east": "east", "west": "west",
            },
            1: {
                "top": "top", "bottom": "bottom", "south": "west",
                "north": "east", "east": "south", "west": "north",
            },
        }[quarter_turns]

        for (column, level), character in sorted(occupied.items()):
            colour = palette[character]
            x0 = (column - columns / 2.0) * pixel
            x1 = x0 + pixel
            z0 = level * pixel
            z1 = z0 + pixel
            front = depth / 2.0
            back = -depth / 2.0
            corners = {
                "ftb": rotate((x0, front, z0)),
                "ftt": rotate((x0, front, z1)),
                "fbr": rotate((x1, front, z0)),
                "ftr": rotate((x1, front, z1)),
                "btb": rotate((x0, back, z0)),
                "btt": rotate((x0, back, z1)),
                "bbr": rotate((x1, back, z0)),
                "btr": rotate((x1, back, z1)),
            }
            if (column, level + 1) not in occupied:
                append_face(
                    vertices, faces, face_colours,
                    (corners["ftt"], corners["ftr"], corners["btr"], corners["btt"]),
                    shade(colour, FACE_SHADE[direction_map["top"]]),
                )
            if (column, level - 1) not in occupied:
                append_face(
                    vertices, faces, face_colours,
                    (corners["ftb"], corners["btb"], corners["bbr"], corners["fbr"]),
                    shade(colour, FACE_SHADE[direction_map["bottom"]]),
                )
            if (column - 1, level) not in occupied:
                append_face(
                    vertices, faces, face_colours,
                    (corners["ftb"], corners["ftt"], corners["btt"], corners["btb"]),
                    shade(colour, FACE_SHADE[direction_map["west"]]),
                )
            if (column + 1, level) not in occupied:
                append_face(
                    vertices, faces, face_colours,
                    (corners["fbr"], corners["bbr"], corners["btr"], corners["ftr"]),
                    shade(colour, FACE_SHADE[direction_map["east"]]),
                )
            append_face(
                vertices, faces, face_colours,
                (corners["ftb"], corners["fbr"], corners["ftr"], corners["ftt"]),
                shade(colour, FACE_SHADE[direction_map["south"]]),
            )
            append_face(
                vertices, faces, face_colours,
                (corners["btb"], corners["btt"], corners["btr"], corners["bbr"]),
                shade(colour, FACE_SHADE[direction_map["north"]]),
            )

    emit_relief(0)
    emit_relief(1)
    mesh = create_coloured_mesh(
        "Sunflower_Voxel_Mesh",
        vertices,
        faces,
        face_colours,
        material,
    )
    root = create_empty("Sunflower_Asset", pack)
    mesh.parent = root
    triangle_count = len(mesh.data.loop_triangles)
    if triangle_count > 1_800:
        raise RuntimeError(f"Sunflower exceeds 1800 triangles: {triangle_count}")
    root["asset_role"] = "meadow_sunflower"
    root["representation"] = "crossed_16x16_vertex_color_voxel_relief"
    root["logical_grid"] = "16x16"
    root["logical_pixel_metres"] = SUNFLOWER_PIXEL_METRES
    root["authored_height_metres"] = round(rows * pixel, 4)
    root["palette_colours"] = 8
    root["runtime_draw_budget"] = 1
    root["triangle_count"] = triangle_count
    root["source_reference"] = "gpt-pixel-sunflower-reference-v2.png"
    root["texture_contract"] = "no_uv_no_texture"
    return root


def build_short_grass(
    pack: bpy.types.Object,
    material: bpy.types.Material,
) -> bpy.types.Object:
    rows = len(GRASS_GRID)
    columns = len(GRASS_GRID[0])
    if rows != 8 or columns != 8 or any(len(row) != columns for row in GRASS_GRID):
        raise ValueError("Short grass source must remain an exact 8x8 logical grid")
    palette = {
        key: linear_colour(rgb)
        for key, rgb in GRASS_PALETTE_SRGB.items()
    }
    occupied = {
        (column, rows - 1 - row_index): character
        for row_index, row in enumerate(GRASS_GRID)
        for column, character in enumerate(row)
        if character != "."
    }
    vertices: list[tuple[float, float, float]] = []
    faces: list[tuple[int, int, int, int]] = []
    face_colours: list[tuple[float, float, float, float]] = []
    pixel = GRASS_VOXEL_METRES
    depth = pixel * GRASS_DEPTH_RATIO

    def emit_relief(quarter_turns: int) -> None:
        def rotate(point: tuple[float, float, float]) -> tuple[float, float, float]:
            x, y, z = point
            for _ in range(quarter_turns):
                x, y = -y, x
            return x, y, z

        direction_map = {
            0: {
                "top": "top", "bottom": "bottom", "south": "south",
                "north": "north", "east": "east", "west": "west",
            },
            1: {
                "top": "top", "bottom": "bottom", "south": "west",
                "north": "east", "east": "south", "west": "north",
            },
        }[quarter_turns]
        for (column, level), character in sorted(occupied.items()):
            colour = palette[character]
            x0 = (column - columns / 2.0) * pixel
            x1 = x0 + pixel
            z0 = level * pixel
            z1 = z0 + pixel
            front = depth / 2.0
            back = -depth / 2.0
            corners = {
                "ftb": rotate((x0, front, z0)),
                "ftt": rotate((x0, front, z1)),
                "fbr": rotate((x1, front, z0)),
                "ftr": rotate((x1, front, z1)),
                "btb": rotate((x0, back, z0)),
                "btt": rotate((x0, back, z1)),
                "bbr": rotate((x1, back, z0)),
                "btr": rotate((x1, back, z1)),
            }
            if (column, level + 1) not in occupied:
                append_face(
                    vertices, faces, face_colours,
                    (corners["ftt"], corners["ftr"], corners["btr"], corners["btt"]),
                    shade(colour, FACE_SHADE[direction_map["top"]]),
                )
            if (column, level - 1) not in occupied:
                append_face(
                    vertices, faces, face_colours,
                    (corners["ftb"], corners["btb"], corners["bbr"], corners["fbr"]),
                    shade(colour, FACE_SHADE[direction_map["bottom"]]),
                )
            if (column - 1, level) not in occupied:
                append_face(
                    vertices, faces, face_colours,
                    (corners["ftb"], corners["ftt"], corners["btt"], corners["btb"]),
                    shade(colour, FACE_SHADE[direction_map["west"]]),
                )
            if (column + 1, level) not in occupied:
                append_face(
                    vertices, faces, face_colours,
                    (corners["fbr"], corners["bbr"], corners["btr"], corners["ftr"]),
                    shade(colour, FACE_SHADE[direction_map["east"]]),
                )
            append_face(
                vertices, faces, face_colours,
                (corners["ftb"], corners["fbr"], corners["ftr"], corners["ftt"]),
                shade(colour, FACE_SHADE[direction_map["south"]]),
            )
            append_face(
                vertices, faces, face_colours,
                (corners["btb"], corners["btt"], corners["btr"], corners["bbr"]),
                shade(colour, FACE_SHADE[direction_map["north"]]),
            )

    emit_relief(0)
    emit_relief(1)

    mesh = create_coloured_mesh(
        "Short_Grass_Voxel_Mesh",
        vertices,
        faces,
        face_colours,
        material,
    )
    root = create_empty("Short_Grass_Asset", pack)
    mesh.parent = root
    triangle_count = len(mesh.data.loop_triangles)
    maximum_height = rows * pixel
    if triangle_count > 680:
        raise RuntimeError(f"Short grass exceeds 680 triangles: {triangle_count}")
    root["asset_role"] = "meadow_short_grass"
    root["representation"] = "crossed_8x8_vertex_color_voxel_relief"
    root["logical_grid"] = "8x8"
    root["voxel_size_metres"] = GRASS_VOXEL_METRES
    root["authored_height_metres"] = round(maximum_height, 4)
    root["palette_colours"] = len(GRASS_PALETTE_SRGB)
    root["occupied_pixels"] = len(occupied)
    root["runtime_draw_budget"] = 1
    root["triangle_count"] = triangle_count
    root["source_reference"] = "gpt-pixel-grass-reference-v2.png"
    root["texture_contract"] = "no_uv_no_texture"
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
    pack["representation"] = "hard_pixel_vertex_colour_voxels"
    pack["material_contract"] = "opaque_flat_vertex_colours"
    pack["alpha_contract"] = "opaque_geometry_only"
    pack["texture_contract"] = "no_uv_no_texture"
    pack["visual_reference"] = "red-flower.glb"
    sunflower = build_sunflower(pack, material)
    grass = build_short_grass(pack, material)
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
        "export_texcoords": False,
        "export_normals": True,
        "export_tangents": False,
        "export_vertex_color": "NAME",
        "export_vertex_color_name": "Col",
        "export_all_vertex_colors": False,
        "export_draco_mesh_compression_enable": False,
    }
    supported = {
        prop.identifier
        for prop in bpy.ops.export_scene.gltf.get_rna_type().properties
    }
    options = {key: value for key, value in requested.items() if key in supported}
    result = bpy.ops.export_scene.gltf(**options)
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
    scene.render.resolution_x = 960
    scene.render.resolution_y = 720
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = False
    scene.render.filepath = str(path)
    world = bpy.data.worlds.new("QA_Meadow_Pixel_World")
    scene.world = world
    world.use_nodes = True
    background = world.node_tree.nodes.get("Background")
    if background:
        background.inputs[0].default_value = (0.035, 0.065, 0.025, 1.0)
        background.inputs[1].default_value = 0.75

    # Preview transforms are applied only after export.
    sunflower.location.x = -0.58
    grass.location.x = 0.62
    grass.scale = (1.5, 1.5, 1.5)

    bpy.ops.mesh.primitive_plane_add(size=4.5, location=(0.0, 0.0, -0.006))
    ground = bpy.context.object
    ground.name = "QA_Meadow_Ground"
    ground_material = bpy.data.materials.new("QA_Meadow_Ground_Material")
    ground_material.diffuse_color = (0.13, 0.29, 0.07, 1.0)
    ground_material.roughness = 1.0
    ground.data.materials.append(ground_material)

    camera_data = bpy.data.cameras.new("QA_Meadow_Pixel_Camera")
    camera_data.lens = 58
    camera = bpy.data.objects.new("QA_Meadow_Pixel_Camera", camera_data)
    scene.collection.objects.link(camera)
    camera.location = (1.95, -3.2, 1.48)
    look_at(camera, (0.0, 0.0, 0.48))
    scene.camera = camera

    key_data = bpy.data.lights.new("QA_Warm_Sun", type="AREA")
    key_data.energy = 880
    key_data.size = 3.5
    key_data.color = (1.0, 0.76, 0.43)
    key = bpy.data.objects.new("QA_Warm_Sun", key_data)
    scene.collection.objects.link(key)
    key.location = (-3.0, -3.4, 5.0)
    look_at(key, (0.0, 0.0, 0.45))

    fill_data = bpy.data.lights.new("QA_Sky_Fill", type="AREA")
    fill_data.energy = 440
    fill_data.size = 4.5
    fill_data.color = (0.58, 0.72, 1.0)
    fill = bpy.data.objects.new("QA_Sky_Fill", fill_data)
    scene.collection.objects.link(fill)
    fill.location = (3.2, 1.2, 3.6)
    look_at(fill, (0.0, 0.0, 0.45))
    bpy.ops.render.render(write_still=True)


def main() -> None:
    args = parse_args()
    reset_scene()
    material = create_material()
    pack, sunflower, grass = build_pack(material, args.seed)
    export_glb(args.output)
    if args.preview:
        render_preview(args.preview, sunflower, grass)
    print(
        "MEADOW_PLANTS_OK "
        f"output={args.output} "
        f"sunflower_height={sunflower.get('authored_height_metres', 0)} "
        f"sunflower_triangles={sunflower.get('triangle_count', 0)} "
        f"grass_height={grass.get('authored_height_metres', 0)} "
        f"grass_triangles={grass.get('triangle_count', 0)} "
        f"pack={pack.name}"
    )


if __name__ == "__main__":
    main()
