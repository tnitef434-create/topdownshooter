"""Generate original voxel-style pond-detail assets with Blender.

Requirements:
  - Blender 4.0+ (tested API target; no third-party Python packages).
  - The bundled Blender glTF 2.0 exporter must be enabled (default installs are).

Example:
  blender --background --python tools/generate_pond_assets.py -- \
    --output build/pond_details.glb --seed 240824 --flies 5 --flower --animate

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
from typing import Iterable, Sequence

import bpy


GENERATOR_VERSION = "1.0.0"
DEFAULT_SEED = 240824
LOOP_START = 1
LOOP_END = 97
VOXEL_UNIT = 0.0625


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


def create_lily_pad_mesh(
    collection: bpy.types.Collection,
    root: bpy.types.Object,
    material: bpy.types.Material,
) -> bpy.types.Object:
    radius = 0.53
    thickness = 0.045
    segments = 14
    notch_half_angle = math.radians(23)
    outline = []
    for index in range(segments + 1):
        angle = notch_half_angle + (math.tau - 2 * notch_half_angle) * index / segments
        stepped_radius = radius * (0.96 if index % 3 == 0 else 1.0)
        outline.append((math.cos(angle) * stepped_radius, math.sin(angle) * stepped_radius))
    outline.append((0.11, 0.0))

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
    obj = bpy.data.objects.new("Lily_Pad", mesh)
    collection.objects.link(obj)
    obj.parent = root
    return obj


def build_lily_pad(
    collection: bpy.types.Collection,
    materials: dict[str, bpy.types.Material],
    include_flower: bool,
) -> bpy.types.Object:
    root = create_empty("Lily_Pad_Asset", collection)
    root["asset_role"] = "pond_surface_detail"
    create_lily_pad_mesh(collection, root, materials["pad"])

    # Raised square flecks give the broad surface an intentional pixel texture.
    create_box("Pad_Light_Pixel_A", (0.12, 0.08, 0.008), (-0.19, 0.19, 0.027), materials["pad_light"], collection, rotation_z=0.18, parent=root)
    create_box("Pad_Light_Pixel_B", (0.07, 0.06, 0.008), (0.18, -0.22, 0.027), materials["pad_light"], collection, rotation_z=-0.12, parent=root)
    create_box("Pad_Dark_Pixel", (0.1, 0.065, 0.009), (-0.29, -0.1, 0.028), materials["pad_dark"], collection, rotation_z=-0.3, parent=root)

    if include_flower:
        flower_root = create_empty("Optional_Block_Flower", collection, root)
        flower_root.location = (-0.13, 0.08, 0.03)
        create_low_poly_cylinder("Flower_Stem", 0.026, 0.16, (0.0, 0.0, 0.08), materials["stem"], collection, vertices=6, parent=flower_root)
        for index in range(6):
            angle = math.tau * index / 6
            distance = 0.105
            create_box(
                f"Flower_Petal_{index + 1:02d}",
                (0.16, 0.085, 0.026),
                (math.cos(angle) * distance, math.sin(angle) * distance, 0.175),
                materials["petal"],
                collection,
                rotation_z=angle,
                parent=flower_root,
            )
        create_low_poly_cylinder("Flower_Core", 0.072, 0.052, (0.0, 0.0, 0.187), materials["flower_core"], collection, vertices=8, parent=flower_root)
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


def create_wing_mesh(
    name: str,
    side: float,
    collection: bpy.types.Collection,
    parent: bpy.types.Object,
    material: bpy.types.Material,
) -> bpy.types.Object:
    vertices = [
        (0.0, 0.0, 0.0),
        (side * 0.075, -0.01, 0.008),
        (side * 0.12, 0.035, 0.0),
        (side * 0.055, 0.062, -0.004),
    ]
    mesh = bpy.data.meshes.new(f"{name}_Mesh")
    mesh.from_pydata(vertices, [], [(0, 1, 2, 3)])
    mesh.materials.append(material)
    mesh.update(calc_edges=True)
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    obj.parent = parent
    return obj


def animate_fly(
    fly: bpy.types.Object,
    wings: Iterable[bpy.types.Object],
    index: int,
    base: Sequence[float],
    radius: float,
    phase: float,
) -> None:
    frames = (LOOP_START, 25, 49, 73, LOOP_END)
    for step, frame in enumerate(frames):
        angle = phase + math.tau * step / (len(frames) - 1)
        fly.location = (
            base[0] + math.cos(angle) * radius,
            base[1] + math.sin(angle) * radius * 0.7,
            base[2] + math.sin(angle * 2.0) * 0.035,
        )
        fly.rotation_euler[2] = angle + math.pi * 0.5
        fly.keyframe_insert("location", frame=frame)
        fly.keyframe_insert("rotation_euler", frame=frame)
    if fly.animation_data and fly.animation_data.action:
        fly.animation_data.action.name = f"Fly_{index:02d}_Orbit_Loop"
    set_linear_interpolation(fly)

    flap_frames = (LOOP_START, 13, 25, 37, 49, 61, 73, 85, LOOP_END)
    for wing_index, wing in enumerate(wings):
        direction = -1.0 if wing_index == 0 else 1.0
        for step, frame in enumerate(flap_frames):
            wing.rotation_euler[1] = direction * (0.18 if step % 2 == 0 else 0.78)
            wing.keyframe_insert("rotation_euler", frame=frame)
        if wing.animation_data and wing.animation_data.action:
            wing.animation_data.action.name = f"Fly_{index:02d}_Wing_{wing_index + 1}_Loop"
        set_linear_interpolation(wing)


def build_flies(
    collection: bpy.types.Collection,
    materials: dict[str, bpy.types.Material],
    count: int,
    rng: random.Random,
    animate: bool,
) -> bpy.types.Object:
    swarm = create_empty("Fly_Swarm_Asset", collection)
    swarm["asset_role"] = "pond_microfauna"
    for index in range(1, count + 1):
        fly = create_empty(f"Fly_{index:02d}", collection, swarm)
        base_angle = math.tau * (index - 1) / max(1, count) + rng.uniform(-0.18, 0.18)
        base_radius = rng.uniform(0.32, 0.62)
        base = (
            math.cos(base_angle) * base_radius,
            math.sin(base_angle) * base_radius * 0.72,
            rng.uniform(0.18, 0.48),
        )
        fly.location = base
        fly["loop_phase"] = round(base_angle, 6)
        create_box("Fly_%02d_Body" % index, (0.058, 0.035, 0.035), (0.0, 0.0, 0.0), materials["fly"], collection, parent=fly)
        create_box("Fly_%02d_Head" % index, (0.027, 0.032, 0.03), (0.039, 0.0, 0.0), materials["fly_eye"], collection, parent=fly)
        left_wing = create_wing_mesh(f"Fly_{index:02d}_Wing_L", -1.0, collection, fly, materials["wing"])
        right_wing = create_wing_mesh(f"Fly_{index:02d}_Wing_R", 1.0, collection, fly, materials["wing"])
        if animate:
            animate_fly(
                fly,
                (left_wing, right_wing),
                index,
                base,
                rng.uniform(0.055, 0.13),
                rng.uniform(0.0, math.tau),
            )
    return swarm


def make_materials() -> dict[str, bpy.types.Material]:
    return {
        "pad": create_material("Pad_Moss_Green", (0.16, 0.43, 0.19), roughness=0.96),
        "pad_light": create_material("Pad_Light_Pixels", (0.29, 0.58, 0.25), roughness=0.94),
        "pad_dark": create_material("Pad_Dark_Pixels", (0.08, 0.28, 0.13), roughness=0.98),
        "stem": create_material("Flower_Stem", (0.12, 0.38, 0.16), roughness=0.95),
        "petal": create_material("Flower_Petal", (0.93, 0.68, 0.72), roughness=0.9),
        "flower_core": create_material("Flower_Core", (0.92, 0.66, 0.19), roughness=0.9),
        "mist": create_material("Mist_Translucent", (0.72, 0.82, 0.82), roughness=1.0, alpha=0.24, emission_strength=0.08, double_sided=True),
        "fly": create_material("Fly_Charcoal", (0.055, 0.065, 0.06), roughness=0.82),
        "fly_eye": create_material("Fly_Eye", (0.19, 0.12, 0.08), roughness=0.58),
        "wing": create_material("Fly_Wing", (0.66, 0.76, 0.74), roughness=0.72, alpha=0.52, double_sided=True),
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
        "export_texcoords": False,
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

    materials = make_materials()
    lily = build_lily_pad(collection, materials, args.flower)
    mist = build_mist(collection, materials["mist"], args.animate)
    flies = build_flies(collection, materials, args.flies, rng, args.animate)
    lily.parent = root
    mist.parent = root
    flies.parent = root

    output, export_format = resolve_export(args)
    export_scene(output, export_format, args.animate)
    manifest = {
        "output": str(output),
        "format": export_format,
        "seed": args.seed,
        "scale": args.scale,
        "flower": args.flower,
        "flies": args.flies,
        "animated": args.animate,
        "loop_frames": [LOOP_START, LOOP_END] if args.animate else None,
        "generator_version": GENERATOR_VERSION,
    }
    print("POND_ASSET_EXPORT " + json.dumps(manifest, sort_keys=True))


if __name__ == "__main__":
    main()
