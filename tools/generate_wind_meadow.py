"""Original opaque, vertex-coloured meadow assets, authored with Blender.

Run this file in Blender's Python Console (or with --python). Runtime wind
deforms the segmented blades; the roots are fixed at Blender Z = 0.
"""
import bpy, math, random, importlib.util
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT.parents[1] / 'outputs'
spec = importlib.util.spec_from_file_location('meadow', ROOT / 'tools/generate_meadow_plants.py')
helper = importlib.util.module_from_spec(spec); spec.loader.exec_module(helper)
helper.reset_scene()
material = helper.create_material()
pack = helper.create_empty('Meadow_Plant_Asset_Pack')
pack['generator'] = 'generate_wind_meadow.py'
pack['generator_version'] = '3.0.0'
pack['asset_role'] = 'worldloom_meadow_plant_pack'
pack['representation'] = 'segmented_blades_and_pixel_bloom'
pack['runtime_draw_budget'] = 3
pack['material_contract'] = 'opaque_flat_vertex_colours'
pack['alpha_contract'] = 'opaque_geometry_only'
pack['texture_contract'] = 'no_uv_no_texture'

def colour(h):
    return helper.linear_colour(tuple(int(h[i:i+2], 16)/255 for i in (0,2,4)))

def mesh(name, verts, faces, colours, role, height):
    obj = helper.create_coloured_mesh(name, verts, faces, colours, material)
    obj.parent = pack
    obj['asset_role'] = role
    obj['authored_height_metres'] = height
    obj['triangle_count'] = sum(len(f)-2 for f in faces)
    obj['wind_root'] = 0.0
    obj['representation'] = 'hard_pixel_vertex_colour_voxels'
    return obj

def grass(name, tall, seed):
    rng=random.Random(seed); verts=[]; faces=[]; colours=[]
    palette=['274e19','366b20','4e8429','669936','89ac48']
    for blade in range(9 if tall else 6):
        angle=blade*2.399+rng.uniform(-.15,.15)
        radius=rng.uniform(.025,.22 if tall else .12)
        root=Vector((math.cos(angle)*radius,math.sin(angle)*radius,0))
        along=Vector((math.cos(angle),math.sin(angle),0))
        across=Vector((-math.sin(angle),math.cos(angle),0))
        height=rng.uniform(.55,.79) if tall else rng.uniform(.21,.36)
        width=rng.uniform(.038,.065) if tall else rng.uniform(.035,.052)
        lean=rng.uniform(.08,.23) if tall else rng.uniform(.03,.12)
        start=len(verts)
        # Five bend stations give a smooth arc under the GPU's shared gusts.
        for station in range(6):
            t=station/5; center=root+along*(lean*t*t)+Vector((0,0,height*t))
            half=width*(1-.87*t)/2
            for side,depth in [(-1,-1),(1,-1),(1,1),(-1,1)]:
                verts.append(tuple(center+across*(half*side)+along*(.004*depth)))
        faces.append(tuple(start+i for i in (3,2,1,0)));colours.append(colour(palette[0]))
        for station in range(5):
            for side in range(4):
                a=start+station*4+side;b=start+station*4+(side+1)%4
                faces.append((a,b,b+4,a+4));colours.append(colour(palette[min(4,station+(blade%3==0))]))
        faces.append(tuple(start+20+i for i in range(4)));colours.append(colour(palette[-1]))
    return mesh(name,verts,faces,colours,'opaque_meadow_tall_grass' if tall else 'opaque_meadow_short_grass',.79 if tall else .36)

def sunflower():
    verts=[];faces=[];colours=[]
    def box(center,size,h):
        x,y,z=center; a,b,c=[n/2 for n in size]; start=len(verts)
        verts.extend([(x-a,y-b,z-c),(x+a,y-b,z-c),(x+a,y+b,z-c),(x-a,y+b,z-c),
                      (x-a,y-b,z+c),(x+a,y-b,z+c),(x+a,y+b,z+c),(x-a,y+b,z+c)])
        for indices in [(3,2,1,0),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7),(4,5,6,7)]:
            faces.append(tuple(start+i for i in indices));colours.append(colour(h))
    for i in range(10): box((0,0,(i+.5)*.0625),(.042,.042,.0625),'477928' if i%3 else '5e8d30')
    # One square-pixel flower head, with a real thin rim and a green back.
    grid=['...YYY...','..YHYHY..','.YHDDDHY.','YHDBBBDHY','YYDBSBDYY','YHDBBBDHY','.YHDDDHY.','..YHYHY..','...YYY...']
    pal={'Y':'dfa51c','H':'ffda43','D':'96551c','B':'56301b','S':'b77b32'}
    for row,line in enumerate(grid):
        for col,ch in enumerate(line):
            if ch!='.': box(((col-4)*.055,-.016,.92-(row+.5)*.055),(.055,.025,.055),pal[ch])
    for side in (-1,1):
        for i in range(4):
            box((side*(.04+i*.042),0,.23+i*.042),(.06,.028,.055),'52882b' if i%2 else '70a034')
    return mesh('Sunflower_Asset',verts,faces,colours,'opaque_voxel_sunflower',.92)

flower=sunflower();short=grass('Short_Grass_Asset',False,11);tall=grass('Tall_Grass_Asset',True,23)
helper.export_glb(ROOT/'src/public/worldloom/assets/environment/meadow-plants.glb')
# Editable studio layout. Runtime roots in the export above all remain at zero.
flower.location.x=-.65;short.location.x=.65;tall.location.x=0
scene=bpy.context.scene
scene.world=bpy.data.worlds.new('Meadow studio')
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.18,.23,.28,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.55
for loc,energy in [((1,-3,4),240),((-3,1,3),180)]:
    bpy.ops.object.light_add(type='AREA',location=loc);lamp=bpy.context.object
    lamp.data.energy=energy;lamp.data.size=4
    lamp.rotation_euler=(Vector((0,0,.4))-lamp.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(1.4,-3.5,1.45));camera=bpy.context.object
camera.rotation_euler=(Vector((0,0,.44))-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type='ORTHO';camera.data.ortho_scale=2.5;scene.camera=camera
scene.render.engine='CYCLES';scene.cycles.samples=24
scene.render.resolution_x=1400;scene.render.resolution_y=850;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.view_settings.view_transform='Standard'
bpy.ops.object.select_all(action='DESELECT');tall.select_set(True);bpy.context.view_layer.objects.active=tall
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type=='VIEW_3D':
            area.spaces.active.shading.color_type='VERTEX'
            area.spaces.active.region_3d.view_distance=2.7
            area.spaces.active.region_3d.view_location=(0,0,.4)
OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'worldloom-wind-meadow.blend'))
print('MEADOW READY: original sunflower, short grass and knee-high meadow clump')
