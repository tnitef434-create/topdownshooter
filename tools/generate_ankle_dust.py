"""Author a low drifting dust field in Blender and export its point parameters.

Blender units are metres. Runtime uses soft GPU points, never solid dust meshes.
Run: blender --background --factory-startup --python tools/generate_ankle_dust.py
"""
import bpy
import json
import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT.parents[1] / 'outputs'
OUTPUT.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
random.seed(714)
points, samples = [], []
for i in range(384):
    soft = i % 3 != 0
    size = random.uniform(.10, .21) if soft else random.uniform(.008, .023)
    # Every visible point stays below 25 cm, including its feathered radius.
    height = random.uniform(size * .5 + .006, .235 - size * .5)
    speed = random.uniform(.12, .27)
    x, y = random.uniform(-4, 4), random.uniform(-2.5, 2.5)
    points.append((x, y, height))
    samples.append([round(v, 5) for v in [x, y, height, size, speed, random.uniform(0, math.tau)]])

mesh = bpy.data.meshes.new('Ankle dust authored points')
mesh.from_pydata(points, [], [])
obj = bpy.data.objects.new('Soft wind · 0–25 cm · 12–27 cm per second', mesh)
bpy.context.collection.objects.link(obj)
for name, index in [('diameter', 3), ('drift_speed', 4), ('phase', 5)]:
    attr = mesh.attributes.new(name, 'FLOAT', 'POINT')
    for i, sample in enumerate(samples): attr.data[i].value = sample[index]
obj['runtime_rendering'] = 'Gaussian feathered GPU points; no opaque surfaces or AO'
obj['maximum_height_metres'] = .25

# Geometry Nodes provide an editable preview of the exported point distribution.
material = bpy.data.materials.new('Warm airborne mineral dust')
material.diffuse_color = (.58, .45, .28, 1)
nodes = bpy.data.node_groups.new('Preview dust grains at authored sizes', 'GeometryNodeTree')
nodes.interface.new_socket(name='Geometry', in_out='INPUT', socket_type='NodeSocketGeometry')
nodes.interface.new_socket(name='Geometry', in_out='OUTPUT', socket_type='NodeSocketGeometry')
inp = nodes.nodes.new('NodeGroupInput'); out = nodes.nodes.new('NodeGroupOutput')
ico = nodes.nodes.new('GeometryNodeMeshIcoSphere'); ico.inputs['Radius'].default_value = .5; ico.inputs['Subdivisions'].default_value = 1
attr = nodes.nodes.new('GeometryNodeInputNamedAttribute'); attr.data_type = 'FLOAT'; attr.inputs['Name'].default_value = 'diameter'
inst = nodes.nodes.new('GeometryNodeInstanceOnPoints')
nodes.links.new(inp.outputs['Geometry'], inst.inputs['Points'])
nodes.links.new(ico.outputs['Mesh'], inst.inputs['Instance'])
nodes.links.new(attr.outputs['Attribute'], inst.inputs['Scale'])
nodes.links.new(inst.outputs['Instances'], out.inputs['Geometry'])
mod = obj.modifiers.new('Editable grain preview', 'NODES'); mod.node_group = nodes
obj.location = (0, 0, 0); obj.keyframe_insert(data_path='location', frame=1)
obj.location = (1.6, .18, 0); obj.keyframe_insert(data_path='location', frame=241)
bpy.context.scene.frame_end = 241; bpy.context.scene.render.fps = 30
bpy.context.scene.frame_set(1)
bpy.context.view_layer.objects.active = obj; obj.select_set(True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT / 'worldloom-ankle-dust.blend'))
path = ROOT / 'src/public/worldloom/src/ankle-dust-data.js'
path.write_text('// Authored with Blender: tools/generate_ankle_dust.py. Metres: x, z, height, diameter, speed, phase.\n'
                + 'export const ANKLE_DUST = ' + json.dumps(samples, separators=(',', ':')) + ';\n')
print('Exported', len(samples), 'ankle-height dust samples to', path)
