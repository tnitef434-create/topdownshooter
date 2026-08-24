# Generates the Worldloom red meadow flower as a voxel .glb asset.
#
# Usage (run from the repository root):
#   "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" --background ^
#     --factory-startup --python tools/generate_red_flower.py -- ^
#     --output src/public/worldloom/assets/environment/red-flower.glb ^
#     --preview outputs/red-flower-qa.png
#
# The mesh is two 16x16 voxel reliefs crossed at 90 degrees (mirroring how the
# vanilla flora uses crossed billboards, so the flower reads from every
# angle). The relief is transcribed from the reference pixel art: a five-petal
# red flower with a yellow core, a two-pixel stem, two left leaves, a side
# bud, and a lower right leaflet.

import argparse
import math
import os
import sys

import bpy
from mathutils import Vector


GRID = [
    "................",
    "......DRRD......",
    ".....DHRRHD.....",
    "..D..DHRRRD..D..",
    ".DRD..DYYD..DRD.",
    ".DHRD.DYYD.DHRD.",
    ".DDRRRDDDDRRDD..",
    "...DRRDDRRDD....",
    ".....DRRRRD.....",
    ".......Gg.......",
    "..Gg...Gg..DRD..",
    ".Glgg.Gg..GDRDG.",
    ".Ggg..Gg...GDG..",
    "..G.GlggG..gg...",
    ".....gg.glg.....",
    ".....Gg.........",
]

# sRGB palette sampled from the reference art.
PALETTE_SRGB = {
    "D": (0.48, 0.08, 0.08),   # dark red petal shadow
    "R": (0.88, 0.15, 0.15),   # petal red
    "H": (1.00, 0.34, 0.26),   # petal highlight
    "Y": (1.00, 0.84, 0.00),   # flower core
    "O": (0.96, 0.61, 0.00),   # core shading
    "G": (0.16, 0.35, 0.16),   # deep leaf green
    "g": (0.25, 0.51, 0.25),   # stem green
    "l": (0.42, 0.67, 0.29),   # leaf highlight green
}

FACE_SHADE = {
    "top": 1.18,
    "bottom": 0.62,
    "south": 1.0,
    "north": 0.86,
    "east": 0.84,
    "west": 0.94,
}


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        default="src/public/worldloom/assets/environment/red-flower.glb",
    )
    parser.add_argument("--preview", default="")
    parser.add_argument("--pixel", type=float, default=1.0)
    parser.add_argument("--depth", type=float, default=0.62)
    return parser.parse_args(argv)


def srgb_to_linear(channel):
    if channel <= 0.04045:
        return channel / 12.92
    return ((channel + 0.055) / 1.055) ** 2.4


def linear_palette():
    return {
        key: tuple(srgb_to_linear(c) for c in rgb) + (1.0,)
        for key, rgb in PALETTE_SRGB.items()
    }


def shade(color, factor):
    return (
        min(1.0, color[0] * factor),
        min(1.0, color[1] * factor),
        min(1.0, color[2] * factor),
        color[3],
    )


def build_mesh(pixel_size, depth_ratio):
    palette = linear_palette()
    rows = len(GRID)
    cols = max(len(row) for row in GRID)
    for row in GRID:
        if len(row) != cols:
            raise ValueError("Every grid row must have the same width")

    occupied = {
        (col, rows - 1 - row_index): char
        for row_index, row in enumerate(GRID)
        for col, char in enumerate(row)
        if char != "."
    }

    verts = []
    faces = []
    face_colors = []

    def emit_face(corners, color):
        base = len(verts)
        verts.extend(corners)
        faces.append((base, base + 1, base + 2, base + 3))
        face_colors.append(color)

    depth = pixel_size * depth_ratio

    def emit_relief(quarter_turns):
        def rotate_point(point):
            x, y, z = point
            for _ in range(quarter_turns):
                x, y = -y, x
            return (x, y, z)

        direction_map = {
            0: {"top": "top", "bottom": "bottom", "south": "south",
                "north": "north", "east": "east", "west": "west"},
            1: {"top": "top", "bottom": "bottom", "south": "west",
                "north": "east", "east": "south", "west": "north"},
        }[quarter_turns % 4]

        for (col, level), char in sorted(occupied.items()):
            color = palette[char]
            x0 = (col - cols / 2.0) * pixel_size
            x1 = x0 + pixel_size
            z0 = level * pixel_size
            z1 = z0 + pixel_size
            y_front = depth / 2.0
            y_back = -depth / 2.0

            corners = {
                "ftb": rotate_point((x0, y_front, z0)),
                "ftt": rotate_point((x0, y_front, z1)),
                "fbr": rotate_point((x1, y_front, z0)),
                "ftr": rotate_point((x1, y_front, z1)),
                "btb": rotate_point((x0, y_back, z0)),
                "btt": rotate_point((x0, y_back, z1)),
                "bbr": rotate_point((x1, y_back, z0)),
                "btr": rotate_point((x1, y_back, z1)),
            }

            if (col, level + 1) not in occupied:
                emit_face(
                    [corners["ftt"], corners["ftr"], corners["btr"], corners["btt"]],
                    shade(color, FACE_SHADE[direction_map["top"]]),
                )
            if (col, level - 1) not in occupied:
                emit_face(
                    [corners["ftb"], corners["btb"], corners["bbr"], corners["fbr"]],
                    shade(color, FACE_SHADE[direction_map["bottom"]]),
                )
            if (col - 1, level) not in occupied:
                emit_face(
                    [corners["ftb"], corners["ftt"], corners["btt"], corners["btb"]],
                    shade(color, FACE_SHADE[direction_map["west"]]),
                )
            if (col + 1, level) not in occupied:
                emit_face(
                    [corners["fbr"], corners["bbr"], corners["btr"], corners["ftr"]],
                    shade(color, FACE_SHADE[direction_map["east"]]),
                )
            emit_face(
                [corners["ftb"], corners["fbr"], corners["ftr"], corners["ftt"]],
                shade(color, FACE_SHADE[direction_map["south"]]),
            )
            emit_face(
                [corners["btb"], corners["btt"], corners["btr"], corners["bbr"]],
                shade(color, FACE_SHADE[direction_map["north"]]),
            )

    emit_relief(0)
    emit_relief(1)

    mesh = bpy.data.meshes.new("Red_Flower_Voxels")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    if len(mesh.polygons) != len(face_colors):
        raise ValueError(
            f"Face count mismatch after mesh build: "
            f"{len(mesh.polygons)} polygons vs {len(face_colors)} authored faces"
        )

    color_attribute = mesh.color_attributes.new(
        name="Col", type="BYTE_COLOR", domain="CORNER"
    )
    for polygon in mesh.polygons:
        color = face_colors[polygon.index]
        for loop_index in polygon.loop_indices:
            color_attribute.data[loop_index].color = color

    material = bpy.data.materials.new("Red_Flower_Material")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (1.0, 1.0, 1.0, 1.0)
        bsdf.inputs["Roughness"].default_value = 0.95
        color_node = nodes.new("ShaderNodeVertexColor")
        color_node.layer_name = "Col"
        links.new(color_node.outputs["Color"], bsdf.inputs["Base Color"])
    mesh.materials.append(material)

    obj = bpy.data.objects.new("Red_Flower_Asset", mesh)
    bpy.context.collection.objects.link(obj)
    return obj


def configure_scene():
    for existing in list(bpy.data.objects):
        bpy.data.objects.remove(existing, do_unlink=True)
    bpy.context.scene.unit_settings.system = "METRIC"
    world = bpy.data.worlds.new("Red_Flower_World")
    bpy.context.scene.world = world
    world.use_nodes = True
    background = world.node_tree.nodes.get("Background")
    if background:
        background.inputs[0].default_value = (0.05, 0.07, 0.05, 1.0)
        background.inputs[1].default_value = 1.0


def add_preview_rig():
    sun_data = bpy.data.lights.new("Flower_Sun", type="SUN")
    sun_data.energy = 3.2
    sun_data.angle = math.radians(12)
    sun = bpy.data.objects.new("Flower_Sun", sun_data)
    sun.rotation_euler = (math.radians(52), 0, math.radians(28))
    bpy.context.collection.objects.link(sun)

    fill_data = bpy.data.lights.new("Flower_Fill", type="AREA")
    fill_data.energy = 900
    fill_data.size = 14
    fill = bpy.data.objects.new("Flower_Fill", fill_data)
    fill.location = (-10, -12, 8)
    fill.rotation_euler = (math.radians(58), 0, math.radians(-38))
    bpy.context.collection.objects.link(fill)

    camera_data = bpy.data.cameras.new("Flower_Camera")
    camera_data.lens = 50
    camera = bpy.data.objects.new("Flower_Camera", camera_data)
    camera.location = (19.0, -24.0, 17.0)
    direction = Vector((0.0, 0.0, 7.0)) - camera.location
    camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    bpy.context.collection.objects.link(camera)
    bpy.context.scene.camera = camera


def render_preview(path):
    scene = bpy.context.scene
    scene.render.resolution_x = 640
    scene.render.resolution_y = 640
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


def main():
    args = parse_args()
    configure_scene()

    obj = build_mesh(args.pixel, args.depth)

    output = os.path.abspath(args.output)
    os.makedirs(os.path.dirname(output), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output,
        export_format="GLB",
        export_yup=True,
        export_apply=False,
        use_selection=False,
    )

    if args.preview:
        add_preview_rig()
        preview = os.path.abspath(args.preview)
        os.makedirs(os.path.dirname(preview), exist_ok=True)
        render_preview(preview)

    triangles = sum(
        len(polygon.vertices) - 2 for polygon in obj.data.polygons
    )
    print(f"RED_FLOWER_OK triangles={triangles} output={output}")


main()
