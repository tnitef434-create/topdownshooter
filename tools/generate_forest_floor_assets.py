"""Generate Worldloom's hard-pixel forest-floor prop pack with Blender 5.2.

Run from the repository root:

  "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" --background \
    --factory-startup --python tools/generate_forest_floor_assets.py -- \
    --output src/public/worldloom/assets/environment/forest-floor.glb \
    --preview outputs/forest-floor-qa.png

Every prop is opaque, low-poly geometry with flat per-face COLOR_0 data. The
pack deliberately contains no UVs, image textures, alpha cards, animation,
lights, or cameras. Preview-only objects are created after the GLB export.
"""

from __future__ import annotations

import argparse
import math
import sys
from pathlib import Path
from typing import Sequence

import bpy
from mathutils import Vector


GENERATOR_VERSION = "2.0.0"
DEFAULT_SEED = 280827
VOXEL_CELL_METRES = 0.08
REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = (
    REPOSITORY_ROOT
    / "src/public/worldloom/assets/environment/forest-floor.glb"
)

EXPECTED_ROOTS = (
    "Fallen_Log_Asset",
    "Mossy_Stump_Asset",
    "Exposed_Root_Asset",
    "Twig_Cluster_Asset",
    "Pinecone_Asset",
    "Rock_Cluster_Asset",
    "Mushroom_Log_Detail",
)

FACE_SHADE = {
    "top": 1.16,
    "bottom": 0.62,
    "south": 1.00,
    "north": 0.84,
    "east": 0.80,
    "west": 0.92,
}

# Hand-authored sRGB palette. Values are converted to scene-linear before
# entering Blender's colour attribute, matching generate_red_flower.py and
# generate_meadow_plants.py.
PALETTE_SRGB = {
    "bark_dark": (0.17, 0.085, 0.035),
    "bark": (0.31, 0.16, 0.065),
    "bark_light": (0.47, 0.27, 0.11),
    "cut_dark": (0.37, 0.20, 0.085),
    "cut": (0.64, 0.43, 0.20),
    "cut_light": (0.78, 0.59, 0.30),
    "moss_dark": (0.08, 0.23, 0.075),
    "moss": (0.16, 0.38, 0.10),
    "moss_light": (0.32, 0.54, 0.16),
    "twig_dark": (0.20, 0.11, 0.055),
    "twig": (0.38, 0.22, 0.10),
    "cone_dark": (0.15, 0.075, 0.035),
    "cone": (0.32, 0.16, 0.065),
    "cone_light": (0.48, 0.27, 0.11),
    "stone_dark": (0.22, 0.25, 0.23),
    "stone": (0.36, 0.40, 0.36),
    "stone_light": (0.52, 0.55, 0.48),
    "mushroom_stem": (0.69, 0.58, 0.39),
    "mushroom_shadow": (0.36, 0.15, 0.075),
    "mushroom_cap": (0.64, 0.29, 0.10),
    "mushroom_highlight": (0.86, 0.52, 0.18),
}


def blender_arguments() -> list[str]:
    """Return arguments following Blender's conventional ``--`` separator."""
    return sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build Worldloom's vertex-colour forest-floor prop pack.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help="Destination self-contained forest-floor GLB.",
    )
    parser.add_argument(
        "--preview",
        type=Path,
        default=None,
        help="Optional deterministic QA preview PNG.",
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
    material = bpy.data.materials.new("Worldloom_Forest_Floor_Vertex_Colours")
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
            roughness.default_value = 0.96
        if metallic:
            metallic.default_value = 0.0
        if alpha:
            alpha.default_value = 1.0
    material["colour_contract"] = "flat_per_face_COLOR_0"
    material["texture_contract"] = "none"
    material["alpha_contract"] = "opaque_geometry"
    material["rain_tint_compatible"] = True
    return material


def create_empty(name: str, parent: bpy.types.Object | None = None) -> bpy.types.Object:
    empty = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(empty)
    empty.empty_display_type = "PLAIN_AXES"
    empty.empty_display_size = 0.1
    empty.parent = parent
    return empty


class VoxelGridBuilder:
    """Build an integer-grid voxel mesh while culling every internal face.

    Each occupied coordinate represents exactly one shared-size cube cell. No
    object rotation, bevel, curve, or continuous slab is involved: silhouette
    changes can only happen in whole-cell steps, matching the red-flower and
    meadow logical-pixel assets.
    """

    FACE_SPECS = (
        ("bottom", (0, 0, -1)),
        ("top", (0, 0, 1)),
        ("south", (0, -1, 0)),
        ("north", (0, 1, 0)),
        ("east", (1, 0, 0)),
        ("west", (-1, 0, 0)),
    )

    def __init__(
        self,
        material: bpy.types.Material,
        cell_size: float = VOXEL_CELL_METRES,
    ):
        self.material = material
        self.cell_size = cell_size
        self.cells: dict[tuple[int, int, int], str] = {}
        self.face_overrides: dict[tuple[tuple[int, int, int], str], str] = {}
        self.vertices: list[tuple[float, float, float]] = []
        self.faces: list[tuple[int, int, int, int]] = []
        self.face_colours: list[tuple[float, float, float, float]] = []
        self.palette_names: set[str] = set()

    def set_voxel(self, coordinate: tuple[int, int, int], palette_name: str) -> None:
        if any(not isinstance(value, int) for value in coordinate):
            raise TypeError(f"Voxel coordinates must be integers: {coordinate}")
        if palette_name not in PALETTE_SRGB:
            raise KeyError(f"Unknown forest-floor palette colour: {palette_name}")
        self.cells[coordinate] = palette_name
        self.palette_names.add(palette_name)

    def fill(
        self,
        x_values: Sequence[int],
        y_values: Sequence[int],
        z_values: Sequence[int],
        palette_name: str,
    ) -> None:
        for x in x_values:
            for y in y_values:
                for z in z_values:
                    self.set_voxel((x, y, z), palette_name)

    def set_face_palette(
        self,
        coordinate: tuple[int, int, int],
        direction: str,
        palette_name: str,
    ) -> None:
        if coordinate not in self.cells:
            raise KeyError(f"Cannot colour absent voxel face: {coordinate}")
        if direction not in dict(self.FACE_SPECS):
            raise KeyError(f"Unknown voxel face direction: {direction}")
        if palette_name not in PALETTE_SRGB:
            raise KeyError(f"Unknown forest-floor palette colour: {palette_name}")
        self.face_overrides[(coordinate, direction)] = palette_name
        self.palette_names.add(palette_name)

    def _append_face(
        self,
        corners: Sequence[tuple[float, float, float]],
        palette_name: str,
        direction: str,
    ) -> None:
        first = len(self.vertices)
        self.vertices.extend(corners)
        self.faces.append((first, first + 1, first + 2, first + 3))
        colour = linear_colour(PALETTE_SRGB[palette_name])
        self.face_colours.append(shade(colour, FACE_SHADE[direction]))

    def _corners(
        self,
        coordinate: tuple[int, int, int],
        direction: str,
    ) -> tuple[tuple[float, float, float], ...]:
        x, y, z = coordinate
        half = self.cell_size * 0.5
        centre_x = x * self.cell_size
        centre_y = y * self.cell_size
        centre_z = (z + 0.5) * self.cell_size
        x0, x1 = centre_x - half, centre_x + half
        y0, y1 = centre_y - half, centre_y + half
        z0, z1 = centre_z - half, centre_z + half
        return {
            "bottom": ((x0, y0, z0), (x0, y1, z0), (x1, y1, z0), (x1, y0, z0)),
            "top": ((x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)),
            "south": ((x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1)),
            "north": ((x0, y1, z0), (x0, y1, z1), (x1, y1, z1), (x1, y1, z0)),
            "east": ((x1, y0, z0), (x1, y1, z0), (x1, y1, z1), (x1, y0, z1)),
            "west": ((x0, y0, z0), (x0, y0, z1), (x0, y1, z1), (x0, y1, z0)),
        }[direction]

    def build(self, name: str) -> bpy.types.Object:
        if not self.cells:
            raise ValueError(f"{name} has no occupied voxel cells")
        for coordinate in sorted(self.cells):
            base_palette = self.cells[coordinate]
            for direction, delta in self.FACE_SPECS:
                neighbour = tuple(coordinate[index] + delta[index] for index in range(3))
                if neighbour in self.cells:
                    continue
                palette_name = self.face_overrides.get(
                    (coordinate, direction),
                    base_palette,
                )
                self._append_face(
                    self._corners(coordinate, direction),
                    palette_name,
                    direction,
                )
        if not self.faces or len(self.faces) != len(self.face_colours):
            raise ValueError(f"{name} has incomplete exposed-face colour data")
        mesh = bpy.data.meshes.new(f"{name}_Mesh")
        mesh.from_pydata(self.vertices, [], self.faces)
        mesh.materials.append(self.material)
        mesh.validate(clean_customdata=False)
        mesh.update(calc_edges=True)
        colour_attribute = mesh.color_attributes.new(
            name="Col",
            type="BYTE_COLOR",
            domain="CORNER",
        )
        for polygon in mesh.polygons:
            polygon.use_smooth = False
            colour = self.face_colours[polygon.index]
            for loop_index in polygon.loop_indices:
                colour_attribute.data[loop_index].color = colour
        mesh.calc_loop_triangles()
        obj = bpy.data.objects.new(name, mesh)
        bpy.context.scene.collection.objects.link(obj)
        return obj


def finish_asset(
    pack: bpy.types.Object,
    root_name: str,
    mesh_name: str,
    representation: str,
    builder: VoxelGridBuilder,
    triangle_budget: int,
    extras: dict[str, object] | None = None,
) -> bpy.types.Object:
    root = create_empty(root_name, pack)
    mesh = builder.build(mesh_name)
    mesh.parent = root
    triangle_count = len(mesh.data.loop_triangles)
    if triangle_count > triangle_budget:
        raise RuntimeError(
            f"{root_name} exceeds {triangle_budget} triangles: {triangle_count}",
        )
    coordinates = [vertex.co for vertex in mesh.data.vertices]
    minimum = Vector((
        min(vertex.x for vertex in coordinates),
        min(vertex.y for vertex in coordinates),
        min(vertex.z for vertex in coordinates),
    ))
    maximum = Vector((
        max(vertex.x for vertex in coordinates),
        max(vertex.y for vertex in coordinates),
        max(vertex.z for vertex in coordinates),
    ))
    dimensions = maximum - minimum
    root["asset_role"] = root_name.removesuffix("_Asset").lower()
    root["representation"] = representation
    root["triangle_count"] = triangle_count
    root["runtime_draw_budget"] = 1
    root["palette_colours"] = len(builder.palette_names)
    root["occupied_voxel_cells"] = len(builder.cells)
    root["authored_dimensions_metres"] = (
        f"{dimensions.x:.4f}x{dimensions.y:.4f}x{dimensions.z:.4f}"
    )
    root["authored_height_metres"] = round(dimensions.z, 4)
    root["colour_contract"] = "COLOR_0_flat_per_face"
    root["texture_contract"] = "no_uv_no_texture"
    root["alpha_contract"] = "opaque_geometry"
    root["rain_tint_compatible"] = True
    root["rain_tint_contract"] = "runtime_multiply_vertex_colour"
    root["grid_contract"] = "integer_xyz_voxel_cells"
    root["voxel_cell_metres"] = builder.cell_size
    root["exposed_face_meshing"] = True
    root["rotated_geometry"] = False
    root["smooth_shading"] = False
    for key, value in (extras or {}).items():
        root[key] = value
    return root


def clustered_palette(
    coordinate: tuple[int, int, int],
    base: str,
    dark: str,
    light: str,
    salt: int,
) -> str:
    """Return stable two-cell colour clusters instead of noisy single pixels."""
    x, y, z = coordinate
    code = ((x // 2) * 17 + (y // 2) * 31 + (z // 2) * 13 + salt * 7) % 13
    if code in (0, 1, 2):
        return dark
    if code in (3, 4):
        return light
    return base


def paint_exposed_pixel_clusters(
    builder: VoxelGridBuilder,
    family: set[str],
    base: str,
    dark: str,
    light: str,
    salt: int,
    cluster_cells: int = 2,
) -> None:
    """Paint readable square colour clusters on every exposed voxel face."""
    face_axes = {
        "bottom": (0, 1), "top": (0, 1),
        "south": (0, 2), "north": (0, 2),
        "east": (1, 2), "west": (1, 2),
    }
    for coordinate in sorted(builder.cells):
        if builder.cells[coordinate] not in family:
            continue
        for face_index, (direction, delta) in enumerate(builder.FACE_SPECS):
            neighbour = tuple(coordinate[index] + delta[index] for index in range(3))
            if neighbour in builder.cells or (coordinate, direction) in builder.face_overrides:
                continue
            axis_u, axis_v = face_axes[direction]
            u = coordinate[axis_u] // cluster_cells
            v = coordinate[axis_v] // cluster_cells
            code = (u * 3 + v * 5 + salt + face_index * 2) % 11
            if code in (0, 1, 2):
                palette_name = dark
            elif code in (3, 4):
                palette_name = light
            else:
                palette_name = base
            builder.set_face_palette(coordinate, direction, palette_name)


def build_fallen_log(pack: bpy.types.Object, material: bpy.types.Material) -> bpy.types.Object:
    builder = VoxelGridBuilder(material)
    cross_section = {
        0: range(-1, 2),
        1: range(-2, 3),
        2: range(-2, 3),
        3: range(-2, 3),
        4: range(-2, 3),
        5: range(-1, 2),
    }
    for x in range(-9, 10):
        for z, y_values in cross_section.items():
            for y in y_values:
                coordinate = (x, y, z)
                builder.set_voxel(
                    coordinate,
                    clustered_palette(coordinate, "bark", "bark_dark", "bark_light", 2),
                )

    # Both sawn ends are authored directly on the end-facing voxel faces as
    # concentric square pixels, so no clean panel or texture card is involved.
    for x, direction in ((-9, "west"), (9, "east")):
        for z, y_values in cross_section.items():
            for y in y_values:
                if y == 0 and z in (2, 3):
                    colour = "cut_dark"
                elif abs(y) <= 1 and 1 <= z <= 4:
                    colour = "cut_light" if (y + z + x) % 3 == 0 else "cut"
                else:
                    colour = "cut_dark" if (y + z) % 2 else "cut"
                builder.set_face_palette((x, y, z), direction, colour)

    # Coarse bark relief cells keep the silhouette stepped at gameplay scale.
    for coordinate, colour in (
        ((-7, -3, 1), "bark_dark"), ((-6, -3, 1), "bark_dark"),
        ((-2, 3, 3), "bark_light"), ((-1, 3, 3), "bark_light"),
        ((4, -3, 4), "bark_dark"), ((5, -3, 4), "bark"),
        ((7, 3, 2), "bark_light"), ((0, 0, 6), "bark_light"),
    ):
        builder.set_voxel(coordinate, colour)

    # Moss occupies full cells in a stepped patch rather than a smooth plaque.
    moss_cells = {
        (-6, -1, 6): "moss_dark", (-5, -1, 6): "moss",
        (-5, 0, 6): "moss", (-4, 0, 6): "moss_light",
        (-3, 0, 6): "moss", (-3, 1, 6): "moss_dark",
        (2, -1, 6): "moss_dark", (2, 0, 6): "moss",
        (3, 0, 6): "moss_light", (4, 0, 6): "moss",
        (4, 1, 6): "moss_dark", (7, 0, 6): "moss_light",
    }
    for coordinate, colour in moss_cells.items():
        builder.set_voxel(coordinate, colour)

    # A snapped-grid branch stub grows orthogonally from the south side.
    for y in range(-5, -2):
        builder.set_voxel((3, y, 2), "bark_dark" if y % 2 else "bark")
    builder.set_voxel((3, -3, 3), "bark")
    builder.set_voxel((3, -4, 3), "bark_light")
    paint_exposed_pixel_clusters(
        builder,
        {"bark", "bark_dark", "bark_light"},
        "bark", "bark_dark", "bark_light", salt=2, cluster_cells=2,
    )
    return finish_asset(
        pack,
        "Fallen_Log_Asset",
        "Fallen_Log_Voxel_Mesh",
        "stepped_horizontal_integer_grid_voxel_log_with_pixel_end_rings",
        builder,
        1_200,
        {
            "orientation": "horizontal_x",
            "features": "voxel_bark_clusters_square_end_rings_stepped_moss_branch_stub",
            "supports_log_details": True,
        },
    )


def build_mossy_stump(pack: bpy.types.Object, material: bpy.types.Material) -> bpy.types.Object:
    builder = VoxelGridBuilder(material)
    for z in range(0, 9):
        radius = 3 if z < 2 else 2
        for x in range(-radius, radius + 1):
            for y in range(-radius, radius + 1):
                coordinate = (x, y, z)
                builder.set_voxel(
                    coordinate,
                    clustered_palette(coordinate, "bark", "bark_dark", "bark_light", 5),
                )

    # Four broad, orthogonal roots taper in whole-cell steps.
    for distance in range(4, 9):
        width = 1 if distance < 6 else 0
        for offset in range(-width, width + 1):
            for coordinate in (
                (distance, offset, 0), (-distance, offset, 0),
                (offset, distance, 0), (offset, -distance, 0),
            ):
                builder.set_voxel(
                    coordinate,
                    clustered_palette(coordinate, "bark", "bark_dark", "bark_light", 7),
                )
    for coordinate in ((4, 0, 1), (-4, 0, 1), (0, 4, 1), (0, -4, 1)):
        builder.set_voxel(coordinate, "bark_dark")

    # The top five-by-five face is a square-pixel growth-ring mosaic.
    for x in range(-2, 3):
        for y in range(-2, 3):
            ring = max(abs(x), abs(y))
            colour = {2: "cut_dark", 1: "cut", 0: "cut_light"}[ring]
            if ring == 1 and (x + y) % 2 == 0:
                colour = "cut_light"
            builder.set_face_palette((x, y, 8), "top", colour)

    # Raised moss pixels step over the rim and down two side faces.
    for coordinate, colour in {
        (-2, -2, 9): "moss_dark", (-1, -2, 9): "moss",
        (-2, -1, 9): "moss", (2, 1, 9): "moss_light",
        (2, 2, 9): "moss", (1, 2, 9): "moss_dark",
        (-3, -2, 5): "moss_dark", (-3, -2, 6): "moss",
        (-3, -1, 5): "moss_light", (2, 3, 3): "moss_dark",
        (2, 3, 4): "moss", (1, 3, 4): "moss_light",
    }.items():
        builder.set_voxel(coordinate, colour)
    paint_exposed_pixel_clusters(
        builder,
        {"bark", "bark_dark", "bark_light"},
        "bark", "bark_dark", "bark_light", salt=5, cluster_cells=2,
    )
    return finish_asset(
        pack,
        "Mossy_Stump_Asset",
        "Mossy_Stump_Voxel_Mesh",
        "squat_stepped_integer_grid_voxel_stump_with_square_top_rings",
        builder,
        1_200,
        {"features": "square_growth_rings_four_orthogonal_roots_stepped_moss"},
    )


def build_exposed_root(pack: bpy.types.Object, material: bpy.types.Material) -> bpy.types.Object:
    builder = VoxelGridBuilder(material)
    for x in range(-2, 3):
        for y in range(-2, 3):
            builder.set_voxel(
                (x, y, 0),
                clustered_palette((x, y, 0), "bark", "bark_dark", "bark_light", 9),
            )
    for x in range(-1, 2):
        for y in range(-1, 2):
            builder.set_voxel((x, y, 1), "bark_dark" if (x + y) % 3 == 0 else "bark")
    builder.set_voxel((0, 0, 2), "bark_light")

    # Hand-authored Manhattan paths make every branch visibly stepped and
    # guarantee the model has only the six cardinal face normals.
    paths = (
        [(x, 0, 0) for x in range(3, 10)],
        [(x, 1, 0) for x in range(-9, -2)],
        [(0, y, 0) for y in range(3, 9)],
        [(-1, y, 0) for y in range(-8, -2)],
        [(x, -2, 0) for x in range(3, 8)] + [(7, y, 0) for y in range(-6, -1)],
        [(x, 3, 0) for x in range(-7, -2)] + [(-7, y, 0) for y in range(3, 7)],
        [(x, -4, 0) for x in range(-6, -1)] + [(-6, y, 0) for y in range(-4, -1)],
    )
    for path_index, path in enumerate(paths):
        for coordinate in path:
            builder.set_voxel(
                coordinate,
                clustered_palette(coordinate, "bark", "bark_dark", "bark_light", 11 + path_index),
            )
    for coordinate, colour in {
        (1, 0, 2): "moss", (2, 0, 1): "moss_light",
        (-4, 1, 1): "moss_dark", (-5, 1, 1): "moss",
        (5, -2, 1): "moss_light", (7, -4, 1): "moss_dark",
        (-1, 5, 1): "moss", (-6, 3, 1): "moss_dark",
    }.items():
        builder.set_voxel(coordinate, colour)
    paint_exposed_pixel_clusters(
        builder,
        {"bark", "bark_dark", "bark_light"},
        "bark", "bark_dark", "bark_light", salt=9, cluster_cells=1,
    )
    return finish_asset(
        pack,
        "Exposed_Root_Asset",
        "Exposed_Root_Voxel_Mesh",
        "stepped_orthogonal_integer_grid_exposed_root_network",
        builder,
        900,
        {"features": "seven_manhattan_branches_central_knot_moss_pixels"},
    )


def build_twigs(pack: bpy.types.Object, material: bpy.types.Material) -> bpy.types.Object:
    builder = VoxelGridBuilder(material)
    snapped_sticks = (
        [(x, 0, 0) for x in range(-5, 6)],
        [(1, y, 1) for y in range(-5, 5)],
        [(x, -3, 1) for x in range(-4, 1)] + [(0, y, 1) for y in range(-3, 3)],
        [(x, 3, 2) for x in range(-3, 5)] + [(4, y, 2) for y in range(0, 4)],
    )
    for stick_index, stick in enumerate(snapped_sticks):
        for step_index, coordinate in enumerate(stick):
            palette_name = "twig_dark" if (step_index // 2 + stick_index) % 3 == 0 else "twig"
            builder.set_voxel(coordinate, palette_name)
    for coordinate in ((-5, 0, 1), (1, -5, 2), (4, 3, 3), (-4, -3, 2)):
        builder.set_voxel(coordinate, "bark_light")
    paint_exposed_pixel_clusters(
        builder,
        {"twig", "twig_dark", "bark_light"},
        "twig", "twig_dark", "bark_light", salt=12, cluster_cells=1,
    )
    return finish_asset(
        pack,
        "Twig_Cluster_Asset",
        "Twig_Cluster_Voxel_Mesh",
        "snapped_grid_orthogonal_voxel_twig_cluster",
        builder,
        700,
        {"features": "four_crossed_manhattan_sticks_four_pixel_buds"},
    )


def build_pinecone(pack: bpy.types.Object, material: bpy.types.Material) -> bpy.types.Object:
    builder = VoxelGridBuilder(material)
    layers = {
        0: {(x, y) for x in range(-1, 2) for y in range(-1, 2) if abs(x) + abs(y) <= 1},
        1: {(x, y) for x in range(-2, 3) for y in range(-2, 3) if abs(x) + abs(y) <= 3},
        2: {(x, y) for x in range(-2, 3) for y in range(-2, 3) if abs(x) + abs(y) <= 3},
        3: {(x, y) for x in range(-1, 2) for y in range(-1, 2)},
        4: {(x, y) for x in range(-1, 2) for y in range(-1, 2) if abs(x) + abs(y) <= 1},
        5: {(0, 0)},
    }
    for z, layer in layers.items():
        for x, y in sorted(layer):
            edge = max(abs(x), abs(y))
            if (x - y + z) % 4 == 0:
                colour = "cone_light"
            elif edge >= 2 or (x + y + z) % 3 == 0:
                colour = "cone_dark"
            else:
                colour = "cone"
            builder.set_voxel((x, y, z), colour)
    paint_exposed_pixel_clusters(
        builder,
        {"cone", "cone_dark", "cone_light"},
        "cone", "cone_dark", "cone_light", salt=15, cluster_cells=1,
    )
    return finish_asset(
        pack,
        "Pinecone_Asset",
        "Pinecone_Voxel_Mesh",
        "chunky_stepped_integer_grid_voxel_pinecone",
        builder,
        650,
        {"features": "six_terraced_layers_contrast_scale_pixels"},
    )


def build_rocks(pack: bpy.types.Object, material: bpy.types.Material) -> bpy.types.Object:
    builder = VoxelGridBuilder(material)
    rock_cells: set[tuple[int, int, int]] = set()
    rock_cells.update((x, y, 0) for x in range(-5, 0) for y in range(-1, 3))
    rock_cells.update((x, y, 1) for x in range(-4, 0) for y in range(-1, 2))
    rock_cells.update((x, y, 2) for x in range(-3, -1) for y in range(0, 2))
    rock_cells.update((x, y, 0) for x in range(1, 5) for y in range(0, 4))
    rock_cells.update((x, y, 1) for x in range(2, 5) for y in range(1, 4))
    rock_cells.update((x, y, 2) for x in range(2, 4) for y in range(1, 3))
    rock_cells.update((x, y, 0) for x in range(-1, 3) for y in range(-4, -1))
    rock_cells.update((x, y, 1) for x in range(0, 2) for y in range(-3, -1))
    for coordinate in sorted(rock_cells):
        x, y, z = coordinate
        if z >= 2 or (x - y) % 7 == 0:
            colour = "stone_light"
        elif (x + y + z) % 5 in (0, 1):
            colour = "stone_dark"
        else:
            colour = "stone"
        builder.set_voxel(coordinate, colour)
    paint_exposed_pixel_clusters(
        builder,
        {"stone", "stone_dark", "stone_light"},
        "stone", "stone_dark", "stone_light", salt=18, cluster_cells=1,
    )
    return finish_asset(
        pack,
        "Rock_Cluster_Asset",
        "Rock_Cluster_Voxel_Mesh",
        "stair_stepped_integer_grid_voxel_rock_cluster",
        builder,
        800,
        {"features": "three_terraced_rocks_coarse_shadow_and_highlight_pixels"},
    )


def build_mushroom_log_detail(
    pack: bpy.types.Object,
    material: bpy.types.Material,
) -> bpy.types.Object:
    builder = VoxelGridBuilder(material)

    def add_mushroom(
        x: int,
        y: int,
        stem_cells: int,
        cap_radius: int,
        salt: int,
    ) -> None:
        for z in range(1, stem_cells + 1):
            stem_colour = "mushroom_stem" if z % 2 else "cut_light"
            builder.set_voxel((x, y, z), stem_colour)
        cap_z = stem_cells + 1
        for dx in range(-cap_radius, cap_radius + 1):
            for dy in range(-cap_radius, cap_radius + 1):
                if abs(dx) + abs(dy) > cap_radius + 1:
                    continue
                edge = max(abs(dx), abs(dy)) == cap_radius
                colour = "mushroom_shadow" if edge else "mushroom_cap"
                if (dx - dy + salt) % 5 == 0:
                    colour = "mushroom_highlight"
                builder.set_voxel((x + dx, y + dy, cap_z), colour)
        crown_radius = max(0, cap_radius - 1)
        for dx in range(-crown_radius, crown_radius + 1):
            for dy in range(-crown_radius, crown_radius + 1):
                if abs(dx) + abs(dy) > crown_radius + 1:
                    continue
                colour = "mushroom_highlight" if (dx + dy + salt) % 3 == 0 else "mushroom_cap"
                builder.set_voxel((x + dx, y + dy, cap_z + 1), colour)

    for coordinate, colour in {
        (-5, 0, 0): "moss_dark", (-4, 0, 0): "moss",
        (-3, 0, 0): "moss", (-2, 0, 0): "moss_light",
        (-1, 0, 0): "moss", (0, 0, 0): "moss_dark",
        (1, 0, 0): "moss", (2, 0, 0): "moss_light",
        (3, 0, 0): "moss", (4, 0, 0): "moss_dark",
        (5, 0, 0): "moss", (-3, 1, 0): "moss_dark",
        (-2, 1, 0): "moss", (0, 1, 0): "moss_light",
        (1, 1, 0): "moss", (3, -1, 0): "moss_dark",
        (4, -1, 0): "moss", (0, -1, 0): "moss_dark",
    }.items():
        builder.set_voxel(coordinate, colour)
    add_mushroom(-4, 0, 2, 1, 1)
    add_mushroom(0, 1, 3, 2, 3)
    add_mushroom(4, -1, 2, 1, 5)
    paint_exposed_pixel_clusters(
        builder,
        {"mushroom_cap", "mushroom_shadow", "mushroom_highlight"},
        "mushroom_cap", "mushroom_shadow", "mushroom_highlight",
        salt=21, cluster_cells=1,
    )
    return finish_asset(
        pack,
        "Mushroom_Log_Detail",
        "Mushroom_Log_Detail_Voxel_Mesh",
        "support_surface_integer_grid_voxel_mushroom_patch",
        builder,
        1_100,
        {
            "features": "three_stepped_pixel_caps_block_stems_moss_cells",
            "attachment_target": "fallen_log_top",
            "authored_origin": "support_surface",
        },
    )


def build_pack(
    material: bpy.types.Material,
    seed: int,
) -> tuple[bpy.types.Object, list[bpy.types.Object]]:
    pack = create_empty("Forest_Floor_Asset_Pack")
    pack["asset_role"] = "worldloom_forest_floor_prop_pack"
    pack["generator"] = "generate_forest_floor_assets.py"
    pack["generator_version"] = GENERATOR_VERSION
    pack["seed"] = seed
    pack["representation"] = "integer_grid_exposed_face_vertex_colour_voxels"
    pack["material_contract"] = "one_shared_opaque_vertex_colour_material"
    pack["colour_contract"] = "COLOR_0_flat_per_face"
    pack["texture_contract"] = "no_uv_no_texture"
    pack["alpha_contract"] = "opaque_geometry_only"
    pack["rain_tint_compatible"] = True
    pack["rain_tint_contract"] = "runtime_multiply_vertex_colour"
    pack["grid_contract"] = "integer_xyz_voxel_cells"
    pack["voxel_cell_metres"] = VOXEL_CELL_METRES
    pack["exposed_face_meshing"] = True
    pack["rotated_geometry"] = False
    pack["smooth_shading"] = False
    pack["root_count"] = len(EXPECTED_ROOTS)
    roots = [
        build_fallen_log(pack, material),
        build_mossy_stump(pack, material),
        build_exposed_root(pack, material),
        build_twigs(pack, material),
        build_pinecone(pack, material),
        build_rocks(pack, material),
        build_mushroom_log_detail(pack, material),
    ]
    if tuple(root.name for root in roots) != EXPECTED_ROOTS:
        raise RuntimeError("Forest-floor root names or order drifted from the stable contract")
    pack["total_triangles"] = sum(int(root.get("triangle_count", 0)) for root in roots)
    return pack, roots


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


def render_preview(path: Path, roots: list[bpy.types.Object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    for engine in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE", "BLENDER_WORKBENCH"):
        try:
            scene.render.engine = engine
            break
        except (TypeError, ValueError):
            continue
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 800
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = False
    scene.render.filepath = str(path)

    world = bpy.data.worlds.new("QA_Forest_Floor_World")
    scene.world = world
    world.use_nodes = True
    background = world.node_tree.nodes.get("Background")
    if background:
        background.inputs[0].default_value = (0.060, 0.075, 0.055, 1.0)
        background.inputs[1].default_value = 1.0

    positions = {
        "Fallen_Log_Asset": (-1.55, 0.72, 0.0),
        "Mossy_Stump_Asset": (0.0, 0.72, 0.0),
        "Exposed_Root_Asset": (1.55, 0.70, 0.0),
        "Twig_Cluster_Asset": (-1.55, -0.72, 0.0),
        "Pinecone_Asset": (-0.52, -0.70, 0.0),
        "Rock_Cluster_Asset": (0.45, -0.72, 0.0),
        "Mushroom_Log_Detail": (1.55, -0.72, 0.0),
    }
    for root in roots:
        root.location = positions[root.name]

    def qa_material(
        name: str,
        srgb: tuple[float, float, float],
    ) -> bpy.types.Material:
        material = bpy.data.materials.new(name)
        material.use_nodes = True
        colour = linear_colour(srgb)
        material.diffuse_color = colour
        principled = material.node_tree.nodes.get("Principled BSDF")
        if principled:
            base = principled.inputs.get("Base Color")
            roughness = principled.inputs.get("Roughness")
            if base:
                base.default_value = colour
            if roughness:
                roughness.default_value = 1.0
        return material

    bpy.ops.mesh.primitive_plane_add(size=5.5, location=(0.0, 0.0, -0.008))
    ground = bpy.context.object
    ground.name = "QA_Forest_Floor_Ground"
    ground_material = qa_material(
        "QA_Forest_Floor_Ground_Material",
        (0.30, 0.34, 0.28),
    )
    ground.data.materials.append(ground_material)

    camera_data = bpy.data.cameras.new("QA_Forest_Floor_Camera")
    camera_data.type = "ORTHO"
    camera_data.ortho_scale = 4.45
    camera_data.dof.use_dof = False
    camera = bpy.data.objects.new("QA_Forest_Floor_Camera", camera_data)
    scene.collection.objects.link(camera)
    camera.location = (3.8, -6.4, 4.4)
    look_at(camera, (0.0, 0.0, 0.26))
    scene.camera = camera

    key_data = bpy.data.lights.new("QA_Forest_Key", type="SUN")
    key_data.energy = 2.0
    key_data.angle = math.radians(4.0)
    key_data.color = (1.0, 0.78, 0.48)
    key = bpy.data.objects.new("QA_Forest_Key", key_data)
    scene.collection.objects.link(key)
    key.location = (-3.2, -3.4, 5.2)
    look_at(key, (0.0, 0.0, 0.25))

    fill_data = bpy.data.lights.new("QA_Forest_Fill", type="SUN")
    fill_data.energy = 0.85
    fill_data.angle = math.radians(8.0)
    fill_data.color = (0.68, 0.78, 1.0)
    fill = bpy.data.objects.new("QA_Forest_Fill", fill_data)
    scene.collection.objects.link(fill)
    fill.location = (3.4, 2.8, 4.0)
    look_at(fill, (0.0, 0.0, 0.20))

    bpy.ops.render.render(write_still=True)


def main() -> None:
    args = parse_args()
    reset_scene()
    material = create_material()
    pack, roots = build_pack(material, args.seed)
    export_glb(args.output)
    if args.preview:
        render_preview(args.preview, roots)
    counts = " ".join(
        f"{root.name}={int(root.get('triangle_count', 0))}"
        for root in roots
    )
    print(
        "FOREST_FLOOR_OK "
        f"output={args.output} generator={GENERATOR_VERSION} "
        f"total_triangles={int(pack.get('total_triangles', 0))} {counts}",
    )


if __name__ == "__main__":
    main()
