"""Generate original voxel-style pond-detail assets with Blender.

Requirements:
  - Blender 4.0+ (verified with Blender 5.2; no third-party Python packages).
  - The bundled Blender glTF 2.0 exporter must be enabled (default installs are).

Example:
  blender --background --python tools/generate_pond_assets.py -- \
    --output src/public/worldloom/assets/environment/pond-details.glb \
    --atlas src/public/worldloom/assets/environment/pond-lily-atlas.png \
    --preview outputs/pond-lily-qa.png --seed 240824 --flies 5 --flower --animate

The scene is rebuilt from scratch, every pseudo-random choice uses ``--seed``,
and all generated data has stable names. The resulting GLB/GLTF contains three
independently named roots: Lily_Pad_Asset, Mist_Wisp_Asset, and Fly_Swarm_Asset.
Animation clips are authored with matching first/last frames so a browser can
play them with its normal looping mode.
"""

from __future__ import annotations

import argparse
import json
import math
import random
import sys
from pathlib import Path
from typing import Sequence

import bpy
from mathutils import Vector


GENERATOR_VERSION = "1.1.0"
DEFAULT_SEED = 240824
LOOP_START = 1
LOOP_END = 97
VOXEL_UNIT = 0.0625
DEFAULT_ATLAS = (
    Path(__file__).resolve().parents[1]
    / "src/public/worldloom/assets/environment/pond-lily-atlas.png"
)


def blender_arguments() -> list[str]:
    """Return only arguments following Blender's conventional ``--`` marker."""
    return sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build deterministic lily-pad, mist, and animated fly assets.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("pond_detail_assets.glb"),
        help="Destination .glb or .gltf path (default: pond_detail_assets.glb).",
    )
    parser.add_argument(
        "--format",
        choices=("AUTO", "GLB", "GLTF"),
        default="AUTO",
        help="Export container; AUTO infers it from --output (default: AUTO).",
    )
    parser.add_argument(
        "--atlas",
        type=Path,
        default=DEFAULT_ATLAS,
        help="64x64 RGBA lily/flower atlas embedded into the exported asset.",
    )
    parser.add_argument(
        "--preview",
        type=Path,
        default=None,
        help="Optional PNG path for a deterministic rendered lily QA still.",
    )
    parser.add_argument("--seed", type=int, default=DEFAULT_SEED, help="Deterministic layout seed.")
    parser.add_argument("--flies", type=int, default=5, help="Number of flies, from 1 to 12.")
    parser.add_argument("--scale", type=float, default=1.0, help="Uniform asset scale in metres.")
    parser.add_argument("--flower", dest="flower", action="store_true", help="Add the block-petal flower.")
    parser.add_argument("--no-flower", dest="flower", action="store_false", help="Omit the flower.")
    parser.add_argument("--animate", dest="animate", action="store_true", help="Add looping mist/fly animation.")
    parser.add_argument("--no-animate", dest="animate", action="store_false", help="Export static assets.")
    parser.set_defaults(flower=True, animate=True)
    args = parser.parse_args(blender_arguments())
    if not 1 <= args.flies <= 12:
        parser.error("--flies must be between 1 and 12 so Fly_Swarm_Asset remains loadable")
    if not math.isfinite(args.scale) or args.scale <= 0:
        parser.error("--scale must be a positive finite number")
    args.atlas = args.atlas.expanduser().resolve()
    if not args.atlas.is_file():
        parser.error(f"--atlas does not exist: {args.atlas}")
    return args


def reset_scene() -> None:
    """Remove prior scene data so stable names and seeded output stay reproducible."""
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in list(bpy.data.collections):
        bpy.data.collections.remove(collection, do_unlink=True)
    for data_store in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.actions,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for block in list(data_store):
            data_store.remove(block)

    scene = bpy.context.scene
    scene.frame_start = LOOP_START
    scene.frame_end = LOOP_END
    scene.render.fps = 24
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 1.0


def create_collection(name: str) -> bpy.types.Collection:
    collection = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(collection)
    return collection


def link_object(obj: bpy.types.Object, collection: bpy.types.Collection) -> bpy.types.Object:
    for current in list(obj.users_collection):
        current.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


def create_empty(
    name: str,
    collection: bpy.types.Collection,
    parent: bpy.types.Object | None = None,
) -> bpy.types.Object:
    obj = bpy.data.objects.new(name, None)
    collection.objects.link(obj)
    obj.empty_display_type = "PLAIN_AXES"
    obj.empty_display_size = 0.08
    obj.parent = parent
    return obj


def principled_input(node: bpy.types.Node, *names: str):
    for name in names:
        socket = node.inputs.get(name)
        if socket is not None:
            return socket
    return None


def create_material(
    name: str,
    color: Sequence[float],
    *,
    roughness: float = 0.9,
    alpha: float = 1.0,
    emission_strength: float = 0.0,
    double_sided: bool = False,
) -> bpy.types.Material:
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    material.diffuse_color = (*color[:3], alpha)
    material.use_backface_culling = not double_sided
    nodes = material.node_tree.nodes
    principled = nodes.get("Principled BSDF")
    if principled:
        base = principled_input(principled, "Base Color")
        if base:
            base.default_value = (*color[:3], 1.0)
        rough = principled_input(principled, "Roughness")
        if rough:
            rough.default_value = roughness
        alpha_socket = principled_input(principled, "Alpha")
        if alpha_socket:
            alpha_socket.default_value = alpha
        emission = principled_input(principled, "Emission Color", "Emission")
        if emission:
            emission.default_value = (*color[:3], 1.0)
        emission_amount = principled_input(principled, "Emission Strength")
        if emission_amount:
            emission_amount.default_value = emission_strength

    if alpha < 1.0:
        if hasattr(material, "surface_render_method"):
            material.surface_render_method = "DITHERED"
        elif hasattr(material, "blend_method"):
            material.blend_method = "BLEND"
        if hasattr(material, "alpha_threshold"):
            material.alpha_threshold = 0.02
    return material


def create_lily_atlas_material(atlas_path: Path) -> bpy.types.Material:
    """Create a nearest-filtered material whose source PNG is packed into the GLB."""
    image = bpy.data.images.load(str(atlas_path), check_existing=True)
    if tuple(int(value) for value in image.size) != (64, 64):
        raise ValueError(f"Lily atlas must be exactly 64x64 pixels: {atlas_path}")
    image.name = "Worldloom_Pond_Lily_Atlas_64"
    image.colorspace_settings.name = "sRGB"
    image.pack()

    material = create_material(
        "Worldloom_Pond_Lily_Atlas",
        (1.0, 1.0, 1.0),
        roughness=0.94,
        double_sided=True,
    )
    material["atlas_layout"] = "pad:0,0,32,32;flower:32,0,32,32;swatches:0,32,64,32"
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
    texture.name = "Nearest_Pond_Lily_Atlas"
    texture.label = "64px nearest lily atlas"
    texture.image = image
    texture.interpolation = "Closest"
    texture.extension = "EXTEND"
    alpha_clip = nodes.new("ShaderNodeMath")
    alpha_clip.name = "Pond_Atlas_Alpha_Cutoff"
    alpha_clip.operation = "GREATER_THAN"
    alpha_clip.inputs[1].default_value = 0.5
    if principled:
        base = principled_input(principled, "Base Color")
        alpha_socket = principled_input(principled, "Alpha")
        if base:
            links.new(texture.outputs["Color"], base)
        if alpha_socket:
            links.new(texture.outputs["Alpha"], alpha_clip.inputs[0])
            links.new(alpha_clip.outputs[0], alpha_socket)
    return material


def create_box(
    name: str,
    size: Sequence[float],
    location: Sequence[float],
    material: bpy.types.Material,
    collection: bpy.types.Collection,
    *,
    rotation_z: float = 0.0,
    parent: bpy.types.Object | None = None,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location, rotation=(0.0, 0.0, rotation_z))
    obj = bpy.context.object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.name = f"{name}_Mesh"
    obj.data.materials.append(material)
    obj.parent = parent
    return link_object(obj, collection)


def create_low_poly_cylinder(
    name: str,
    radius: float,
    depth: float,
    location: Sequence[float],
    material: bpy.types.Material,
    collection: bpy.types.Collection,
    *,
    vertices: int = 8,
    parent: bpy.types.Object | None = None,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        end_fill_type="NGON",
        location=location,
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.name = f"{name}_Mesh"
    obj.data.materials.append(material)
    obj.parent = parent
    return link_object(obj, collection)


def inset_tile_uv(
    pixel_x: float,
    pixel_y: float,
    pixel_width: float,
    pixel_height: float,
    x: float,
    y: float,
) -> tuple[float, float]:
    """Map normalized tile coordinates to a half-texel-inset Blender UV."""
    u_min = (pixel_x + 0.5) / 64.0
    u_max = (pixel_x + pixel_width - 0.5) / 64.0
    # Atlas pixel coordinates start at the upper-left; Blender UVs start below.
    v_min = 1.0 - (pixel_y + pixel_height - 0.5) / 64.0
    v_max = 1.0 - (pixel_y + 0.5) / 64.0
    return (
        u_min + (u_max - u_min) * x,
        v_min + (v_max - v_min) * y,
    )


def create_lily_pad_mesh(
    collection: bpy.types.Collection,
    root: bpy.types.Object,
    material: bpy.types.Material,
) -> bpy.types.Object:
    # A hand-authored 1/16m grid silhouette: broad enough to read at range,
    # stepped at every quadrant, and deeply concave at the characteristic split.
    outline = [
        (0.4375, 0.1875),
        (0.4375, 0.3125),
        (0.3125, 0.3125),
        (0.3125, 0.4375),
        (0.1875, 0.4375),
        (0.1875, 0.5),
        (-0.1875, 0.5),
        (-0.1875, 0.4375),
        (-0.3125, 0.4375),
        (-0.3125, 0.3125),
        (-0.4375, 0.3125),
        (-0.4375, 0.1875),
        (-0.5, 0.1875),
        (-0.5, -0.1875),
        (-0.4375, -0.1875),
        (-0.4375, -0.3125),
        (-0.3125, -0.3125),
        (-0.3125, -0.4375),
        (-0.1875, -0.4375),
        (-0.1875, -0.5),
        (0.1875, -0.5),
        (0.1875, -0.4375),
        (0.3125, -0.4375),
        (0.3125, -0.3125),
        (0.4375, -0.3125),
        (0.4375, -0.1875),
        (0.5, -0.1875),
        (0.0625, 0.0),
    ]
    thickness = VOXEL_UNIT

    top_z = thickness * 0.5
    bottom_z = -top_z
    vertices = [(x, y, top_z) for x, y in outline] + [(x, y, bottom_z) for x, y in outline]
    count = len(outline)
    faces = [tuple(range(count)), tuple(reversed(range(count, count * 2)))]
    for index in range(count):
        following = (index + 1) % count
        faces.append((index, following, following + count, index + count))

    mesh = bpy.data.meshes.new("Lily_Pad_Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(material)
    mesh.update(calc_edges=True)
    uv_layer = mesh.uv_layers.new(name="UVMap")
    for polygon in mesh.polygons:
        if polygon.index == 0:
            # Top surface consumes the authored upper-left 32x32 pad tile.
            for loop_index in polygon.loop_indices:
                vertex = mesh.vertices[mesh.loops[loop_index].vertex_index].co
                uv_layer.data[loop_index].uv = inset_tile_uv(
                    0, 0, 32, 32, vertex.x + 0.5, vertex.y + 0.5,
                )
        elif polygon.index == 1:
            # The lower face maps into the opaque underside swatch (tile two).
            for loop_index in polygon.loop_indices:
                vertex = mesh.vertices[mesh.loops[loop_index].vertex_index].co
                uv_layer.data[loop_index].uv = inset_tile_uv(
                    16, 32, 16, 32, vertex.x + 0.5, vertex.y + 0.5,
                )
        else:
            # Every vertical step maps to the first opaque bottom-row edge swatch.
            side_uv = ((0.0, 1.0), (1.0, 1.0), (1.0, 0.0), (0.0, 0.0))
            for index, loop_index in enumerate(polygon.loop_indices):
                uv_layer.data[loop_index].uv = inset_tile_uv(0, 32, 16, 32, *side_uv[index])
    mesh.validate(clean_customdata=False)
    mesh.calc_loop_triangles()
    obj = bpy.data.objects.new("Lily_Pad", mesh)
    collection.objects.link(obj)
    obj.parent = root
    obj["voxel_step"] = VOXEL_UNIT
    obj["surface_tile"] = "atlas_top_left_32"
    return obj


def create_crossed_flower_mesh(
    collection: bpy.types.Collection,
    root: bpy.types.Object,
    material: bpy.types.Material,
) -> bpy.types.Object:
    """Create exactly two crossed alpha-cutout planes using the flower tile."""
    center_x, center_y = -0.13, 0.08
    half_width = 0.23
    bottom_z = VOXEL_UNIT * 0.42
    top_z = bottom_z + 0.48
    vertices = [
        (center_x - half_width, center_y, bottom_z),
        (center_x + half_width, center_y, bottom_z),
        (center_x + half_width, center_y, top_z),
        (center_x - half_width, center_y, top_z),
        (center_x, center_y - half_width, bottom_z),
        (center_x, center_y + half_width, bottom_z),
        (center_x, center_y + half_width, top_z),
        (center_x, center_y - half_width, top_z),
    ]
    mesh = bpy.data.meshes.new("Crossed_Waybloom_Mesh")
    mesh.from_pydata(vertices, [], [(0, 1, 2, 3), (4, 5, 6, 7)])
    mesh.materials.append(material)
    mesh.update(calc_edges=True)
    uv_layer = mesh.uv_layers.new(name="UVMap")
    plane_uv = ((0.0, 0.0), (1.0, 0.0), (1.0, 1.0), (0.0, 1.0))
    for polygon in mesh.polygons:
        for index, loop_index in enumerate(polygon.loop_indices):
            uv_layer.data[loop_index].uv = inset_tile_uv(32, 0, 32, 32, *plane_uv[index])
    mesh.validate(clean_customdata=False)
    mesh.calc_loop_triangles()
    obj = bpy.data.objects.new("Crossed_Waybloom_Flower", mesh)
    collection.objects.link(obj)
    obj.parent = root
    obj["alpha_cutout_planes"] = 2
    obj["surface_tile"] = "atlas_top_right_32"
    return obj


def build_lily_pad(
    collection: bpy.types.Collection,
    materials: dict[str, bpy.types.Material],
    include_flower: bool,
) -> bpy.types.Object:
    root = create_empty("Lily_Pad_Asset", collection)
    root["asset_role"] = "pond_surface_detail"
    root["runtime_draw_budget"] = 1
    root["atlas_pixels"] = 64
    create_lily_pad_mesh(collection, root, materials["lily_atlas"])

    if include_flower:
        create_crossed_flower_mesh(collection, root, materials["lily_atlas"])
    return root


def create_mist_ribbon_mesh(
    collection: bpy.types.Collection,
    root: bpy.types.Object,
    material: bpy.types.Material,
) -> bpy.types.Object:
    vertices: list[tuple[float, float, float]] = []
    faces: list[tuple[int, int, int, int]] = []
    ribbon_count = 2
    segments = 9
    for ribbon in range(ribbon_count):
        base_index = len(vertices)
        phase = ribbon * math.pi
        for index in range(segments + 1):
            t = index / segments
            angle = phase + t * math.pi * 1.55
            radius = 0.035 + t * 0.24
            center_x = math.cos(angle) * radius
            center_y = math.sin(angle) * radius * 0.62
            center_z = 0.055 + t * 0.48
            width = (0.105 * (1.0 - t) + 0.027) * (1.0 if ribbon == 0 else 0.72)
            side_x = -math.sin(angle) * width
            side_y = math.cos(angle) * width
            vertices.extend([
                (center_x + side_x, center_y + side_y, center_z),
                (center_x - side_x, center_y - side_y, center_z),
            ])
        for index in range(segments):
            a = base_index + index * 2
            faces.append((a, a + 1, a + 3, a + 2))

    mesh = bpy.data.meshes.new("Mist_Wisp_Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(material)
    mesh.update(calc_edges=True)
    obj = bpy.data.objects.new("Low_Poly_Mist_Wisp", mesh)
    collection.objects.link(obj)
    obj.parent = root
    return obj


def set_linear_interpolation(obj: bpy.types.Object) -> None:
    action = obj.animation_data.action if obj.animation_data else None
    if not action:
        return
    # Blender 5.0 introduced slotted Actions and no longer exposes ``fcurves``
    # on every Action object. The glTF exporter still receives the keyed data;
    # older releases additionally let us make each curve explicitly linear.
    for fcurve in getattr(action, "fcurves", ()):
        for keyframe in fcurve.keyframe_points:
            keyframe.interpolation = "LINEAR"


def build_mist(
    collection: bpy.types.Collection,
    material: bpy.types.Material,
    animate: bool,
) -> bpy.types.Object:
    root = create_empty("Mist_Wisp_Asset", collection)
    root.location = (-0.18, 0.06, 0.025)
    root["asset_role"] = "pond_mist"
    create_mist_ribbon_mesh(collection, root, material)
    if animate:
        keys = (
            (LOOP_START, 0.0, 1.0),
            (33, math.pi * 0.58, 1.06),
            (65, math.pi * 1.24, 0.96),
            (LOOP_END, math.tau, 1.0),
        )
        for frame, rotation, scale in keys:
            root.rotation_euler[2] = rotation
            root.scale = (scale, scale, scale)
            root.keyframe_insert("rotation_euler", frame=frame)
            root.keyframe_insert("scale", frame=frame)
        if root.animation_data and root.animation_data.action:
            root.animation_data.action.name = "Mist_Drift_Loop"
        set_linear_interpolation(root)
    return root


def build_flies(
    collection: bpy.types.Collection,
    count: int,
    rng: random.Random,
    animate: bool,
) -> bpy.types.Object:
    swarm = create_empty("Fly_Swarm_Asset", collection)
    swarm["asset_role"] = "pond_microfauna"
    # Browser runtime deliberately renders flies as one tiny black-dot Points
    # draw with procedural motion. Keep only deterministic metadata in the GLB;
    # the superseded wing/body prototype would never be consumed and cost bytes.
    swarm["runtime_representation"] = "procedural_black_points"
    swarm["flies_per_swarm"] = count
    swarm["seed_probe"] = round(rng.random(), 8)
    swarm["animated_at_runtime"] = bool(animate)
    return swarm


def make_materials(atlas_path: Path) -> dict[str, bpy.types.Material]:
    return {
        "lily_atlas": create_lily_atlas_material(atlas_path),
        "mist": create_material("Mist_Translucent", (0.72, 0.82, 0.82), roughness=1.0, alpha=0.24, emission_strength=0.08, double_sided=True),
    }


def resolve_export(args: argparse.Namespace) -> tuple[Path, str]:
    output = args.output.expanduser().resolve()
    export_format = args.format
    if export_format == "AUTO":
        export_format = "GLTF" if output.suffix.lower() == ".gltf" else "GLB"
    required_suffix = ".gltf" if export_format == "GLTF" else ".glb"
    if output.suffix.lower() != required_suffix:
        output = output.with_suffix(required_suffix)
    output.parent.mkdir(parents=True, exist_ok=True)
    return output, export_format


def export_scene(output: Path, export_format: str, animate: bool) -> None:
    bpy.ops.object.select_all(action="SELECT")
    requested = {
        "filepath": str(output),
        "export_format": export_format,
        "use_selection": True,
        "export_animations": animate,
        "export_frame_range": True,
        "export_yup": True,
        "export_apply": True,
        "export_cameras": False,
        "export_lights": False,
        "export_extras": True,
        "export_materials": "EXPORT",
        "export_texcoords": True,
        "export_normals": True,
        "export_tangents": False,
        "export_colors": True,
        "export_draco_mesh_compression_enable": False,
    }
    # glTF exporter keyword sets vary slightly between Blender point releases.
    # Filtering through RNA keeps one script usable across supported 4.x builds.
    supported = {prop.identifier for prop in bpy.ops.export_scene.gltf.get_rna_type().properties}
    result = bpy.ops.export_scene.gltf(**{key: value for key, value in requested.items() if key in supported})
    if "FINISHED" not in result:
        raise RuntimeError(f"glTF export did not finish: {sorted(result)}")


def render_preview(preview_path: Path, asset_root: bpy.types.Object, scale: float) -> Path:
    """Render a compact deterministic QA still after the export-only scene is saved."""
    preview = preview_path.expanduser().resolve().with_suffix(".png")
    preview.parent.mkdir(parents=True, exist_ok=True)

    bpy.ops.mesh.primitive_plane_add(size=8.0, location=(0.0, 0.0, -0.045 * scale))
    water = bpy.context.object
    water.name = "QA_Water_Backdrop"
    water_material = create_material("QA_Water", (0.075, 0.24, 0.3), roughness=0.34)
    water.data.materials.append(water_material)

    camera_data = bpy.data.cameras.new("QA_Lily_Camera")
    camera = bpy.data.objects.new("QA_Lily_Camera", camera_data)
    bpy.context.scene.collection.objects.link(camera)
    camera.location = (1.38 * scale, -1.52 * scale, 1.12 * scale)
    camera.rotation_euler = (
        Vector((0.0, 0.0, 0.13 * scale)) - camera.location
    ).to_track_quat("-Z", "Y").to_euler()
    camera_data.lens = 58
    bpy.context.scene.camera = camera

    key_data = bpy.data.lights.new("QA_Key", type="AREA")
    key_data.energy = 620
    key_data.shape = "DISK"
    key_data.size = 3.0
    key = bpy.data.objects.new("QA_Key", key_data)
    bpy.context.scene.collection.objects.link(key)
    key.location = (-1.6 * scale, -1.15 * scale, 2.5 * scale)
    key.rotation_euler = (
        Vector((0.0, 0.0, 0.0)) - key.location
    ).to_track_quat("-Z", "Y").to_euler()

    fill_data = bpy.data.lights.new("QA_Fill", type="AREA")
    fill_data.energy = 260
    fill_data.size = 2.0
    fill = bpy.data.objects.new("QA_Fill", fill_data)
    bpy.context.scene.collection.objects.link(fill)
    fill.location = (1.2 * scale, 0.85 * scale, 1.4 * scale)
    fill.rotation_euler = (
        Vector((0.0, 0.0, 0.1 * scale)) - fill.location
    ).to_track_quat("-Z", "Y").to_euler()

    scene = bpy.context.scene
    # Blender's 5.2 LTS API exposes the Eevee engine as BLENDER_EEVEE while
    # several earlier 4.x point releases used BLENDER_EEVEE_NEXT.
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except TypeError:
        scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 768
    scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = False
    scene.render.filepath = str(preview)
    scene.world.color = (0.035, 0.075, 0.09)
    asset_root.hide_render = False
    bpy.ops.render.render(write_still=True)
    return preview


def main() -> None:
    args = parse_args()
    reset_scene()
    rng = random.Random(args.seed)
    collection = create_collection("Pond_Detail_Assets")
    root = create_empty("Pond_Detail_Asset_Pack", collection)
    root.scale = (args.scale, args.scale, args.scale)
    root["generator"] = Path(__file__).name
    root["generator_version"] = GENERATOR_VERSION
    root["seed"] = args.seed
    root["loop_start"] = LOOP_START
    root["loop_end"] = LOOP_END

    materials = make_materials(args.atlas)
    lily = build_lily_pad(collection, materials, args.flower)
    mist = build_mist(collection, materials["mist"], args.animate)
    flies = build_flies(collection, args.flies, rng, args.animate)
    lily.parent = root
    mist.parent = root
    flies.parent = root

    output, export_format = resolve_export(args)
    export_scene(output, export_format, args.animate)
    preview = render_preview(args.preview, root, args.scale) if args.preview else None
    manifest = {
        "output": str(output),
        "atlas": str(args.atlas),
        "preview": str(preview) if preview else None,
        "format": export_format,
        "seed": args.seed,
        "scale": args.scale,
        "flower": args.flower,
        "flies": args.flies,
        "fly_representation": "procedural_black_points",
        "animated": args.animate,
        "loop_frames": [LOOP_START, LOOP_END] if args.animate else None,
        "generator_version": GENERATOR_VERSION,
    }
    print("POND_ASSET_EXPORT " + json.dumps(manifest, sort_keys=True))


if __name__ == "__main__":
    main()
