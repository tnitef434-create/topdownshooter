"""Blender source for solid button mushrooms, water motion and a baked mist volume."""
import bpy, math, json, base64
from mathutils import Vector, noise
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT.parents[1]/'outputs'
OUT.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)

verts=[];faces=[];colors=[]
def ring_shape(cx,cy,rings,sides,palette):
    start=len(verts)
    for radius,height in rings:
        for i in range(sides):
            a=i*math.tau/sides
            verts.append((cx+math.cos(a)*radius,cy+math.sin(a)*radius,height))
    for k in range(len(rings)-1):
        for i in range(sides):
            faces.append((start+k*sides+i,start+k*sides+(i+1)%sides,start+(k+1)*sides+(i+1)%sides,start+(k+1)*sides+i))
            c=palette[min(k,len(palette)-1)]
            colors.append(tuple(v*(.94+.06*math.sin(i*4.7+k)) for v in c))
    faces.append(tuple(start+i for i in reversed(range(sides))));colors.append(palette[0])
    faces.append(tuple(start+(len(rings)-1)*sides+i for i in range(sides)));colors.append(palette[-1])

for cx,cy,scale in [(-.12,-.06,1),(.16,.10,.72),(-.10,.19,.52)]:
    ring_shape(cx,cy,[(.035*scale,0),(.043*scale,.10*scale),(.032*scale,.27*scale)],9,[(.53,.39,.25),(.73,.59,.41)])
    ring_shape(cx,cy,[(.038*scale,.225*scale),(.145*scale,.235*scale),(.170*scale,.275*scale),(.148*scale,.335*scale),(.096*scale,.385*scale),(.008,.410*scale)],12,
               [(.61,.45,.31),(.37,.20,.105),(.53,.29,.13),(.63,.38,.20),(.69,.43,.235)])
mesh=bpy.data.meshes.new('Solid mushroom caps, gills and stems');mesh.from_pydata(verts,[],faces);mesh.update()
obj=bpy.data.objects.new('Button mushroom cluster · no cards',mesh);bpy.context.collection.objects.link(obj)
attr=mesh.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='CORNER')
for polygon,c in zip(mesh.polygons,colors):
    for loop in polygon.loop_indices:attr.data[loop].color=(*c,1)
mat=bpy.data.materials.new('Earthy mushroom colours');mat.use_nodes=True
vc=mat.node_tree.nodes.new('ShaderNodeVertexColor');vc.layer_name='Color'
mat.node_tree.links.new(vc.outputs['Color'],mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
mat.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.88
mesh.materials.append(mat);mesh.calc_loop_triangles()
data=dict(position=[],normal=[],color=[])
for triangle in mesh.loop_triangles:
    for li in triangle.loops:
        p=mesh.vertices[mesh.loops[li].vertex_index].co;n=triangle.normal;c=attr.data[li].color
        data['position'].extend(round(v,5) for v in (p.x,p.z,-p.y))
        data['normal'].extend(round(v,5) for v in (n.x,n.z,-n.y))
        data['color'].extend(round(v,5) for v in c[:3])

# Bake Blender's coherent 3D noise, sampled at runtime as a filtered volume.
size=32;volume=bytearray()
for z in range(size):
    for y in range(size):
        for x in range(size):
            # Runtime mirrored wrapping keeps the baked noise continuous at tile edges.
            p=Vector((x/size*4,y/size*4,z/size*4))
            n=noise.fractal(p,1.,2.,3,noise_basis='PERLIN_ORIGINAL')
            volume.append(round(max(0,min(1,.5+n*.55))*255))
fog=bpy.data.materials.new('Hanging pond fog · soft volume');fog.use_nodes=True
nodes=fog.node_tree.nodes;nodes.clear();output=nodes.new('ShaderNodeOutputMaterial')
shader=nodes.new('ShaderNodeVolumePrincipled');shader.inputs['Color'].default_value=(.79,.84,.82,1);shader.inputs['Density'].default_value=.16
tex=nodes.new('ShaderNodeTexNoise');tex.noise_dimensions='3D';tex.inputs['Scale'].default_value=2.3;tex.inputs['Detail'].default_value=3
scale=nodes.new('ShaderNodeMath');scale.operation='MULTIPLY';scale.inputs[1].default_value=.4
fog.node_tree.links.new(tex.outputs['Fac'],scale.inputs[0]);fog.node_tree.links.new(scale.outputs[0],shader.inputs['Density']);fog.node_tree.links.new(shader.outputs['Volume'],output.inputs['Volume'])
bpy.ops.mesh.primitive_cube_add(size=1,location=(0,0,.35));fog_obj=bpy.context.object;fog_obj.name='Low pond mist volume';fog_obj.scale=(10,8,.65);fog_obj.data.materials.append(fog);fog_obj.hide_set(True)

waves=[[.96,.28,1.05,.078,1.10],[-.44,.9,1.68,.038,.84],[.71,-.7,2.6,.014,1.43]]
waterverts=[];waterfaces=[];resolution=48
for z in range(resolution+1):
    for x in range(resolution+1):waterverts.append(((x/resolution-.5)*10,(z/resolution-.5)*10,-.1))
for z in range(resolution):
    for x in range(resolution):
        i=x+z*(resolution+1);waterfaces.append((i,i+1,i+resolution+2,i+resolution+1))
wm=bpy.data.meshes.new('Subdivided water preview');wm.from_pydata(waterverts,[],waterfaces)
wo=bpy.data.objects.new('Animated surface and impact wave preview',wm);bpy.context.collection.objects.link(wo)
watermat=bpy.data.materials.new('Blue-green reflective water');watermat.diffuse_color=(.02,.21,.24,1);watermat.metallic=.1;watermat.roughness=.16;wm.materials.append(watermat)
wo.shape_key_add(name='Basis')
for frame in [1,31,61,91,121]:
    t=(frame-1)/30;key=wo.shape_key_add(name=f'Surface {t:.1f}s')
    for i,(x,y,_) in enumerate(waterverts):
        h=sum(math.sin((x*dx+y*dy)*k-t*speed)*amp for dx,dy,k,amp,speed in waves)
        r=math.hypot(x,y);q=r-t*1.4
        h+=math.sin(q*8)*math.exp(-q*q/1.5)*.05*math.exp(-t*.7)
        key.data[i].co.z=-.1+h
    for f,value in [(max(1,frame-30),0),(frame,1),(frame+30,0)]:key.value=value;key.keyframe_insert('value',frame=f)
wo.hide_set(True)
bpy.context.scene.frame_end=121;bpy.context.scene.render.fps=30;bpy.context.scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'worldloom-water-and-mushrooms.blend'))
target=ROOT/'src/public/worldloom/src/water-nature-data.js'
target.write_text('// Blender authored: tools/generate_water_nature.py\nexport const MUSHROOM_MESH = '+json.dumps(data,separators=(',',':'))+';\nexport const WATER_WAVES = '+json.dumps(waves)+';\nexport const MIST_VOLUME_SIZE = 32;\nexport const MIST_VOLUME_BASE64 = '+json.dumps(base64.b64encode(volume).decode())+';\n')
print('Exported mushroom triangles:',len(data['position'])//9,'and mist voxels:',len(volume))
