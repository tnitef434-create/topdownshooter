"""Blender background authoring of a low, curved windblown-sand ribbon.
Run with blender --background --factory-startup --python tools/generate_sand_drift.py.
The exported evaluated mesh is used directly by the game's sand renderer.
"""
import bpy, math, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT.parents[1]/'outputs'; OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
vertices=[]; faces=[]; uvs=[]
for i in range(25):
    u=i/24
    for j in range(7):
        v=j/6; width=math.sin(math.pi*u)**.6
        vertices.append((u-.5,(v-.5)*width+.07*math.sin(u*8),.055*math.sin(math.pi*u)*(1-(2*v-1)**2)))
        uvs.append((u,v))
for i in range(24):
    for j in range(6):
        a=i*7+j;faces.append((a,a+7,a+8,a+1))
mesh=bpy.data.meshes.new('Sand ribbon with tapered feather edges');mesh.from_pydata(vertices,[],faces);mesh.update()
uv=mesh.uv_layers.new(name='DriftUV')
for loop in mesh.loops:uv.data[loop.index].uv=uvs[loop.vertex_index]
obj=bpy.data.objects.new('Sand_Drift_Ribbon',mesh);bpy.context.collection.objects.link(obj)
obj['authored_in']='Blender';obj['purpose']='near-ground intermittent sand drift';obj['runtime_draws']=1
mat=bpy.data.materials.new('Fine warm sand haze');mat.use_nodes=True
shader=mat.node_tree.nodes.get('Principled BSDF');shader.inputs['Base Color'].default_value=(.65,.49,.29,1);shader.inputs['Roughness'].default_value=.95
nodes=mat.node_tree.nodes;links=mat.node_tree.links
tex=nodes.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=15;tex.inputs['Detail'].default_value=2
ramp=nodes.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].position=.32;ramp.color_ramp.elements[0].color=(0,0,0,0)
ramp.color_ramp.elements[1].position=.8;ramp.color_ramp.elements[1].color=(.18,.18,.18,1)
links.new(tex.outputs['Fac'],ramp.inputs[0]);links.new(ramp.outputs['Color'],shader.inputs['Alpha']);mesh.materials.append(mat)
mesh.calc_loop_triangles();p=[];n=[];uvout=[]
for tri in mesh.loop_triangles:
    for li in tri.loops:
        vertex=mesh.vertices[mesh.loops[li].vertex_index];q=vertex.co;normal=tri.normal
        p.extend(round(x,6) for x in (q.x,q.z,-q.y));n.extend(round(x,6) for x in (normal.x,normal.z,-normal.y));uvout.extend(uv.data[li].uv)
(ROOT/'src/public/worldloom/src/sand-drift-mesh.js').write_text('// Evaluated Blender mesh; regenerate with tools/generate_sand_drift.py.\nexport const SAND_DRIFT_MESH = '+json.dumps(dict(position=p,normal=n,uv=uvout),separators=(',',':'))+';\n')
bpy.ops.export_scene.gltf(filepath=str(ROOT/'src/public/worldloom/assets/environment/sand-drift.glb'),export_format='GLB',export_animations=False)
# Preserve a readable editable project with the authored ribbon selected.
obj.scale=(5,2,1.7)
bpy.context.view_layer.objects.active=obj;obj.select_set(True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'worldloom-sand-drift.blend'))
print('Exported Blender sand ribbon: 288 triangles, UV feathering and soft granular material.')
