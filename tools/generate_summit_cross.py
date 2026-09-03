"""Generate Worldloom's Blender-authored mountain summit cross.

Run from the repository root:

  "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" --background \
    --factory-startup --python tools/generate_summit_cross.py -- \
    --source tools/assets/summit-cross-textures/gpt-summit-cross-wood-source.png \
    --atlas src/public/worldloom/assets/environment/summit-cross-wood-atlas.png \
    --output src/public/worldloom/assets/environment/summit-cross.glb \
    --preview outputs/summit-cross-qa.png

The exported origin is the buried base of the post. Blender Z becomes glTF Y,
so the runtime can place each instance directly at a generated summit height.
"""

from __future__ import annotations

import argparse
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector


GENERATOR_VERSION = "1.0.0"
REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = REPOSITORY_ROOT / "tools/assets/summit-cross-textures/gpt-summit-cross-wood-source.png"
DEFAULT_ATLAS = REPOSITORY_ROOT / "src/public/worldloom/assets/environment/summit-cross-wood-atlas.png"
DEFAULT_OUTPUT = REPOSITORY_ROOT / "src/public/worldloom/assets/environment/summit-cross.glb"
DEFAULT_PREVIEW = REPOSITORY_ROOT / "outputs/summit-cross-qa.png"
ATLAS_WIDTH = 128
ATLAS_HEIGHT = 64
LOGICAL_SIZE = 16
PIXEL_SCALE = 4
WOOD_PALETTE = (
    (0x27 / 255.0, 0x17 / 255.0, 0x0C / 255.0),
    (0x36 / 255.0, 0x21 / 255.0, 0x11 / 255.0),
    (0x47 / 255.0, 0x2C / 255.0, 0x16 / 255.0),
    (0x5B / 255.0, 0x3A / 255.0, 0x1D / 255.0),
    (0x73 / 255.0, 0x4E / 255.0, 0x29 / 255.0),
    (0x91 / 255.0, 0x69 / 255.0, 0x39 / 255.0),
)


def blender_arguments() -> list[str]:
    return sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build the Worldloom summit cross asset.")
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--atlas", type=Path, default=DEFAULT_ATLAS)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--preview", type=Path, default=DEFAULT_PREVIEW)
    args = parser.parse_args(blender_arguments())
    args.source = args.source.expanduser().resolve()
    args.atlas = args.atlas.expanduser().resolve().with_suffix(".png")
    args.output = args.output.expanduser().resolve().with_suffix(".glb")
    args.preview = args.preview.expanduser().resolve().with_suffix(".png") if args.preview else None
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


def source_pixel(pixels: list[float], width: int, height: int, u: float, v: float) -> tuple[float, float, float]:
    x = min(width - 1, max(0, round(u * (width - 1))))
    y = min(height - 1, max(0, round(v * (height - 1))))
    index = (y * width + x) * 4
    return pixels[index], pixels[index + 1], pixels[index + 2]


def generate_atlas(source_path: Path, atlas_path: Path) -> bpy.types.Image:
    """Quantize the GPT source into vertical and horizontal nearest-filter regions."""
    source = bpy.data.images.load(str(source_path), check_existing=False)
    source.colorspace_settings.name = "sRGB"
    width, height = int(source.size[0]), int(source.size[1])
    if width < 64 or height < 64:
        raise ValueError(f"Source must be at least 64x64, got {width}x{height}")
    pixels = list(source.pixels[:])
    sampled: list[tuple[float, float, float]] = []
    luminances: list[float] = []
    for y in range(LOGICAL_SIZE):
        for x in range(LOGICAL_SIZE):
            # The slight inset avoids any image-generation seam at the border.
            color = source_pixel(
                pixels,
                width,
                height,
                0.035 + (x / (LOGICAL_SIZE - 1)) * 0.93,
                0.035 + (y / (LOGICAL_SIZE - 1)) * 0.93,
            )
            sampled.append(color)
            luminances.append(0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2])
    low = min(luminances)
    high = max(luminances)
    span = max(1e-6, high - low)
    logical: list[tuple[float, float, float]] = []
    for color, luminance in zip(sampled, luminances):
        normalized = (luminance - low) / span
        # Preserve authored cracks by weighting darker source pixels downward;
        # output bytes remain locked to Worldloom's warm timber palette.
        palette_index = min(len(WOOD_PALETTE) - 1, max(0, round(normalized * (len(WOOD_PALETTE) - 1))))
        logical.append(WOOD_PALETTE[palette_index])

    atlas_pixels = [0.0] * (ATLAS_WIDTH * ATLAS_HEIGHT * 4)

    def write_region(region: int, x: int, y: int, color: tuple[float, float, float]) -> None:
        for oy in range(PIXEL_SCALE):
            for ox in range(PIXEL_SCALE):
                atlas_x = region * 64 + x * PIXEL_SCALE + ox
                atlas_y = y * PIXEL_SCALE + oy
                target = (atlas_y * ATLAS_WIDTH + atlas_x) * 4
                atlas_pixels[target] = color[0]
                atlas_pixels[target + 1] = color[1]
                atlas_pixels[target + 2] = color[2]
                atlas_pixels[target + 3] = 1.0

    for y in range(LOGICAL_SIZE):
        for x in range(LOGICAL_SIZE):
            write_region(0, x, y, logical[y * LOGICAL_SIZE + x])
            # Rotate the same authored grain for the horizontal crossbeam.
            write_region(1, x, y, logical[(LOGICAL_SIZE - 1 - x) * LOGICAL_SIZE + y])

    atlas = bpy.data.images.new("Summit_Cross_Wood_Atlas", ATLAS_WIDTH, ATLAS_HEIGHT, alpha=True)
    atlas.colorspace_settings.name = "sRGB"
    atlas.pixels[:] = atlas_pixels
    atlas.filepath_raw = str(atlas_path)
    atlas.file_format = "PNG"
    atlas_path.parent.mkdir(parents=True, exist_ok=True)
    atlas.save()
    atlas.pack()
    atlas["source_file"] = source_path.name
    atlas["pixel_filter"] = "nearest"
    atlas["vertical_region"] = "0..0.5"
    atlas["horizontal_region"] = "0.5..1"
    bpy.data.images.remove(source)
    return atlas


def principled_input(node: bpy.types.Node, *names: str):
    for name in names:
        socket = node.inputs.get(name)
        if socket is not None:
            return socket
    return None


def create_wood_material(atlas: bpy.types.Image) -> bpy.types.Material:
    material = bpy.data.materials.new("Summit_Cross_Hand_Hewn_Wood")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    principled = nodes.get("Principled BSDF")
    base = principled_input(principled, "Base Color") if principled else None
    roughness = principled_input(principled, "Roughness") if principled else None
    metallic = principled_input(principled, "Metallic") if principled else None
    if roughness:
        roughness.default_value = 0.91
    if metallic:
        metallic.default_value = 0.0
    texture = nodes.new("ShaderNodeTexImage")
    texture.name = "Nearest_GPT_Wood_Atlas"
    texture.image = atlas
    texture.interpolation = "Closest"
    texture.extension = "REPEAT"
    if base:
        links.new(texture.outputs["Color"], base)
    material.diffuse_color = (0.28, 0.16, 0.075, 1.0)
    material["source_texture"] = atlas.get("source_file", "")
    material["runtime_filter"] = "nearest"
    return material


def create_iron_material() -> bpy.types.Material:
    material = bpy.data.materials.new("Summit_Cross_Forged_Iron")
    material.use_nodes = True
    principled = material.node_tree.nodes.get("Principled BSDF")
    base = principled_input(principled, "Base Color") if principled else None
    roughness = principled_input(principled, "Roughness") if principled else None
    metallic = principled_input(principled, "Metallic") if principled else None
    if base:
        base.default_value = (0.035, 0.028, 0.022, 1.0)
    if roughness:
        roughness.default_value = 0.78
    if metallic:
        metallic.default_value = 0.58
    material.diffuse_color = (0.035, 0.028, 0.022, 1.0)
    return material


def create_beam(
    name: str,
    dimensions: tuple[float, float, float],
    location: tuple[float, float, float],
    material: bpy.types.Material,
    horizontal: bool,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(size=1.0, calc_uvs=True, location=location)
    beam = bpy.context.object
    beam.name = name
    beam.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    # Subtle unequal corner movement keeps the silhouette hand-hewn without
    # compromising the instantly readable Latin-cross proportions.
    for vertex in beam.data.vertices:
        if horizontal:
            end = abs(vertex.co.x) / max(0.001, dimensions[0] * 0.5)
            vertex.co.z += (0.018 if vertex.co.x > 0 else -0.012) * end
            vertex.co.y += (0.011 if vertex.co.z > 0 else -0.008) * end
        else:
            height = (vertex.co.z + dimensions[2] * 0.5) / dimensions[2]
            vertex.co.x += (height - 0.5) * 0.026
            vertex.co.y -= (height - 0.5) * 0.014

    bevel = beam.modifiers.new("Hand-hewn edge bevel", "BEVEL")
    bevel.width = 0.055
    bevel.segments = 1
    bevel.affect = "EDGES"
    bpy.context.view_layer.objects.active = beam
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    beam.data.materials.append(material)

    uv_layer = beam.data.uv_layers.active
    if uv_layer is None:
        raise RuntimeError(f"{name} lost its generated UV map")
    for loop in uv_layer.data:
        loop.uv.x = loop.uv.x * 0.5 + (0.5 if horizontal else 0.0)
    return beam


def create_iron_peg(name: str, z: float, material: bpy.types.Material) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, -0.215, z))
    peg = bpy.context.object
    peg.name = name
    peg.dimensions = (0.145, 0.075, 0.145)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bevel = peg.modifiers.new("Forged edge bevel", "BEVEL")
    bevel.width = 0.018
    bevel.segments = 1
    bpy.context.view_layer.objects.active = peg
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    peg.data.materials.append(material)
    return peg


def join_objects(objects: list[bpy.types.Object], name: str) -> bpy.types.Object:
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    joined = bpy.context.object
    joined.name = name
    joined.data.name = f"{name}_Mesh"
    joined.data.validate(clean_customdata=False)
    joined.data.calc_loop_triangles()
    return joined


def build_asset(wood: bpy.types.Material, iron: bpy.types.Material) -> bpy.types.Object:
    root = bpy.data.objects.new("Summit_Cross_Asset", None)
    bpy.context.scene.collection.objects.link(root)
    root.empty_display_type = "PLAIN_AXES"
    root.empty_display_size = 0.18
    root["asset_role"] = "mountain_summit_latin_cross"
    root["generator"] = "generate_summit_cross.py"
    root["generator_version"] = GENERATOR_VERSION
    root["height_metres"] = 7.0
    root["crossbeam_height_metres"] = 5.12
    root["runtime_draw_budget"] = 2
    root["gpt_texture_source"] = "gpt-summit-cross-wood-source.png"

    upright = create_beam(
        "Summit_Cross_Upright",
        (0.52, 0.38, 7.0),
        (0.0, 0.0, 3.5),
        wood,
        horizontal=False,
    )
    crossbeam = create_beam(
        "Summit_Cross_Raised_Crossbeam",
        (3.45, 0.36, 0.5),
        (0.0, -0.008, 5.12),
        wood,
        horizontal=True,
    )
    wood_mesh = join_objects([upright, crossbeam], "Summit_Cross_Wood")
    wood_mesh.parent = root
    wood_mesh["beam_layout"] = "traditional_latin_cross"
    wood_mesh["texture_filter"] = "nearest"

    pegs = [
        create_iron_peg("Summit_Cross_Centre_Peg", 5.12, iron),
        create_iron_peg("Summit_Cross_Lower_Peg", 2.28, iron),
    ]
    iron_mesh = join_objects(pegs, "Summit_Cross_Iron_Pegs")
    iron_mesh.parent = root
    iron_mesh["decorative_only"] = True

    triangle_count = sum(len(obj.data.loop_triangles) for obj in (wood_mesh, iron_mesh))
    root["triangle_count"] = triangle_count
    if triangle_count > 320:
        raise RuntimeError(f"Summit cross exceeds 320 triangles: {triangle_count}")
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
        raise RuntimeError(f"glTF export failed: {sorted(result)}")


def look_at(obj: bpy.types.Object, point: tuple[float, float, float]) -> None:
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat("-Z", "Y").to_euler()


def render_preview(preview_path: Path) -> None:
    preview_path.parent.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    for engine in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE", "BLENDER_WORKBENCH"):
        try:
            scene.render.engine = engine
            break
        except (TypeError, ValueError):
            continue
    scene.render.resolution_x = 900
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = False
    scene.render.filepath = str(preview_path)
    scene.world.color = (0.045, 0.065, 0.085)

    bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=1.45, depth=0.44, location=(0.0, 0.0, -0.25))
    summit = bpy.context.object
    summit.name = "QA_Rocky_Summit"
    summit.scale = (1.0, 0.78, 1.0)
    stone = bpy.data.materials.new("QA_Mountain_Stone")
    stone.diffuse_color = (0.21, 0.24, 0.25, 1.0)
    stone.roughness = 1.0
    summit.data.materials.append(stone)

    camera_data = bpy.data.cameras.new("QA_Summit_Cross_Camera")
    camera = bpy.data.objects.new("QA_Summit_Cross_Camera", camera_data)
    scene.collection.objects.link(camera)
    camera.location = (8.7, -11.8, 6.4)
    camera_data.lens = 64
    look_at(camera, (0.0, 0.0, 3.5))
    scene.camera = camera

    key_data = bpy.data.lights.new("QA_Sunset_Key", type="AREA")
    key_data.energy = 1150
    key_data.shape = "DISK"
    key_data.size = 5.5
    key_data.color = (1.0, 0.72, 0.43)
    key = bpy.data.objects.new("QA_Sunset_Key", key_data)
    scene.collection.objects.link(key)
    key.location = (-5.5, -5.0, 10.0)
    look_at(key, (0.0, 0.0, 3.6))

    fill_data = bpy.data.lights.new("QA_Sky_Fill", type="AREA")
    fill_data.energy = 620
    fill_data.size = 7.0
    fill_data.color = (0.52, 0.7, 1.0)
    fill = bpy.data.objects.new("QA_Sky_Fill", fill_data)
    scene.collection.objects.link(fill)
    fill.location = (5.2, 2.0, 7.5)
    look_at(fill, (0.0, 0.0, 3.5))
    bpy.ops.render.render(write_still=True)


def main() -> None:
    args = parse_args()
    reset_scene()
    atlas = generate_atlas(args.source, args.atlas)
    wood = create_wood_material(atlas)
    iron = create_iron_material()
    root = build_asset(wood, iron)
    export_glb(args.output)
    if args.preview:
        render_preview(args.preview)
    print(
        f"SUMMIT_CROSS_OK output={args.output} atlas={args.atlas} "
        f"triangles={root.get('triangle_count', 0)} source={args.source.name}"
    )


if __name__ == "__main__":
    main()
