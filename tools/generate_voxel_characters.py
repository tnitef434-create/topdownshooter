"""Author Worldloom's rigid pixel characters in Blender; export the same meshes to GLB and JS.

Run: blender --background --factory-startup --python tools/generate_voxel_characters.py
No downloaded artwork, rigs, textures or add-ons are used.
"""
import bpy, bmesh, json, math
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'src/public/worldloom/assets/characters'
OUT = ROOT.parents[1] / 'outputs'
ASSETS.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def xyz(v): return (v[0], -v[2], v[1])
def rgb(h):
    c = [int(h[i:i+2],16)/255 for i in (0,2,4)]
    return tuple(x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in c)

SKIN = dict(skin='bd8768', light='ca9574', shade='ad745b', hair='352b29', tunic='387587', seam='82b4b7', pants='344656', boot='302b2a', eye='25343e', white='ece5d9')
PIG = dict(skin='df9b9d', light='e8adb0', shade='d38d93', hoof='88656b', snout='e6a3a7', nose='9d5966', eye='312c35', white='fff0e7')

TOOL_COLORS={}

def pixel(kind, face, u, v, w, h):
    if kind.startswith('tool_'): return rgb(TOOL_COLORS[kind[5:]])
    p = PIG if kind.startswith('pig') else SKIN
    key = 'skin'
    if kind == 'head':
        if v >= h-2 or face in ('back','top') or (face in ('left','right') and u > w-3): key='hair'
        if face=='front':
            if v==3 and u in (1,2,5,6): key='white'
            if v==3 and u in (2,5): key='eye'
            if v==1 and u in (3,4): key='shade'
    elif kind == 'torso':
        key='tunic'
        if v==0: key='boot'
        if face=='front' and u in (3,4): key='seam'
        if v==h-1 and u in (3,4): key='skin'
    elif kind == 'arm': key = 'tunic' if v>=8 or face=='top' else 'skin'
    elif kind == 'held_arm': key = 'tunic' if v<4 or face=='bottom' else 'skin'
    elif kind == 'leg': key = 'boot' if v<3 else 'pants'
    elif kind == 'pig_leg': key = 'hoof' if v<1 else 'skin'
    elif kind == 'pig_head' and face=='front':
        if v==4 and u in (0,1,6,7): key='white'
        if v==4 and u in (1,6): key='eye'
    elif kind == 'pig_snout':
        key='snout'
        if face=='front' and v==1 and u in (0,3): key='nose'
    elif kind == 'pig_ear': key='shade' if face=='front' else 'skin'
    if key=='skin':
        noise=(u*17+v*31+len(face)*7)%29
        key='light' if noise==0 else 'shade' if noise==1 else key
    return rgb(p[key])

DATA={}
def segment(name, pivot, boxes, parent=None):
    verts=[]; faces=[]; colors=[]
    occupied={tuple(round(v,6) for v in center) for size,center,kind in boxes if kind.startswith('tool_')}
    # Faces have outward winding. Surface pixels stay coplanar: no overlapping cuff/finger blocks.
    for size, center, kind in boxes:
        for axis, sign, label in [(0,1,'right'),(0,-1,'left'),(1,1,'top'),(1,-1,'bottom'),(2,1,'back'),(2,-1,'front')]:
            if kind.startswith('tool_'):
                neighbor=list(center);neighbor[axis]+=sign*size[axis]
                if tuple(round(v,6) for v in neighbor) in occupied: continue
            a,b=[n for n in range(3) if n!=axis]
            nu,nv=[max(1,round(size[n]*16)) for n in (a,b)]
            for u in range(nu):
                for v in range(nv):
                    quad=[]
                    for du,dv in [(0,0),(1,0),(1,1),(0,1)]:
                        q=list(center); q[axis]+=sign*size[axis]/2
                        q[a]+=((u+du)/nu-.5)*size[a]; q[b]+=((v+dv)/nv-.5)*size[b]
                        quad.append(xyz(q))
                    normal=(Vector(quad[1])-Vector(quad[0])).cross(Vector(quad[2])-Vector(quad[0]))
                    expected=[0,0,0]; expected[axis]=sign
                    if normal.dot(Vector(xyz(expected)))<0: quad.reverse()
                    start=len(verts); verts.extend(quad); faces.append(tuple(range(start,start+4)))
                    colors.append(pixel(kind,label,v,u,nv,nu) if axis==0 else pixel(kind,label,u,v,nu,nv))
    mesh=bpy.data.meshes.new(name); mesh.from_pydata(verts,[],faces); mesh.update()
    attr=mesh.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='CORNER')
    for poly,col in zip(mesh.polygons,colors):
        for idx in poly.loop_indices: attr.data[idx].color=(*col,1)
    obj=bpy.data.objects.new(name,mesh); bpy.context.collection.objects.link(obj)
    obj.location=xyz(pivot)
    if parent: obj.parent=parent
    mat=bpy.data.materials.get('Pixel surface')
    if not mat:
        mat=bpy.data.materials.new('Pixel surface'); mat.use_nodes=True
        shader=mat.node_tree.nodes.get('Principled BSDF'); shader.inputs['Roughness'].default_value=.9
        vc=mat.node_tree.nodes.new('ShaderNodeVertexColor'); vc.layer_name='Color'
        mat.node_tree.links.new(vc.outputs['Color'],shader.inputs['Base Color'])
    mesh.materials.append(mat)
    positions=[]; normals=[]; cols=[]
    for poly,col in zip(mesh.polygons,colors):
        n=poly.normal; normal=(n.x,n.z,-n.y)
        for j in (0,1,2,0,2,3):
            q=mesh.vertices[poly.vertices[j]].co
            positions.extend(round(x,5) for x in (q.x,q.z,-q.y))
            normals.extend(round(x,4) for x in normal)
            cols.extend(round(x,5) for x in col)
    DATA[name]=dict(pivot=pivot,position=positions,normal=normals,color=cols)
    return obj

def empty(name):
    obj=bpy.data.objects.new(name,None); bpy.context.collection.objects.link(obj); return obj
player=empty('Wayfarer'); pig=empty('Meadow pig')
segment('player_torso',[0,1.125,0],[([.5,.75,.25],[0,0,0],'torso')],player)
segment('player_head',[0,1.75,0],[([.5,.5,.5],[0,0,0],'head')],player)
arms=[]; legs=[]
for side,x in [('left',-.375),('right',.375)]:
    arms.append(segment('player_'+side+'_arm',[x,1.5,0],[([.25,.75,.25],[0,-.375,0],'arm')],player))
for side,x in [('left',-.125),('right',.125)]:
    legs.append(segment('player_'+side+'_leg',[x,.75,0],[([.25,.75,.25],[0,-.375,0],'leg')],player))
segment('pig_body',[0,.625,0],[([.625,.5,1],[0,0,0],'pig_body')],pig)
head=segment('pig_head',[0,.6875,-.4375],[([.5,.5,.5],[0,0,-.1875],'pig_head'),([.125,.1875,.0625],[-.1875,.28125,-.0625],'pig_ear'),([.125,.1875,.0625],[.1875,.28125,-.0625],'pig_ear')],pig)
snout=segment('pig_snout',[0,-.09375,-.484375],[([.25,.1875,.15625],[0,0,0],'pig_snout')],head)
piglegs=[]
for name,x,z in [('front_left',-.1875,-.3125),('front_right',.1875,-.3125),('back_left',-.1875,.3125),('back_right',.1875,.3125)]:
    piglegs.append(segment('pig_'+name,[x,.375,z],[([.25,.375,.25],[0,-.1875,0],'pig_leg')],pig))
segment('pig_tail',[0,.7,.5],[([.0625,.0625,.1875],[0,0,.09375],'pig_body'),([.0625,.125,.0625],[0,.0625,.15625],'pig_body')],pig)

# Original 16-pixel pickaxe silhouette. A single rigid mesh per material tier,
# with stepped edges, square pixels, a dark edge and a continuous wooden grip.
pick_pattern=[
    '.....#######....',
    '....#MMMMMMM#...',
    '...#MHHHHHMMM#..',
    '....#####HMMMM#.',
    '........#BHMMM#.',
    '.......#BW##MM#.',
    '......#BW#..#M#.',
    '.....#BW#....##.',
    '....#BW#........',
    '...#BW#.........',
    '..#BW#..........',
    '.#BW#...........',
    '.#W#............',
    '..#.............',
    '................',
    '................',
]
pickaxes=[]
for tier,metal,shine,edge in [('crude','969c92','c3c6af','434b43'),('stone','818b90','b4bec2','343e43'),('copper','be7448','f2b470','633b2c')]:
    palette={'#':edge,'M':metal,'H':shine,'B':'68472f','W':'b58a52'}
    boxes=[]
    for row,line in enumerate(pick_pattern):
        for col,ch in enumerate(line):
            if ch=='.': continue
            key=tier+'_'+ch; TOOL_COLORS[key]=palette[ch]
            boxes.append(([.055,.055,.055],[(col-6)*.055,(15-row-6)*.055,0],'tool_'+key))
    pickaxes.append(segment('tool_'+tier+'_pick',[0,0,0],boxes))
    # The held version is modeled around the closed fist in Blender and exported
    # as ONE mesh. The shaft intersects the palm; it cannot drift independently.
    assembly_boxes=[([.25,.75,.25],[0,-.375,0],'held_arm')]
    # Rotate the diagonal sprite shaft upright with grid-preserving geometry.
    # Each voxel retains its original rotation via the evaluated Blender mesh.
    held=segment('held_'+tier+'_pick',[0,0,0],assembly_boxes)
    tool=pickaxes[-1]
    # Use Blender's mesh transform/join pipeline so the runtime is the exact assembly.
    copy=tool.copy();copy.data=tool.data.copy();bpy.context.collection.objects.link(copy)
    copy.rotation_euler.y=-math.pi/4
    copy.scale=(.7,.7,.7);copy.location=xyz([0,-.075,0])
    hand_faces=len(held.data.polygons)
    bpy.ops.object.select_all(action='DESELECT');held.select_set(True);copy.select_set(True);bpy.context.view_layer.objects.active=held
    bpy.ops.object.join()
    # Remove shaft surfaces enclosed by the fist. The first-person pass suppresses
    # world depth, so hidden interior polygons must not draw over the skin.
    bm=bmesh.new();bm.from_mesh(held.data);bm.faces.ensure_lookup_table()
    buried=[face for face in bm.faces if face.index>=hand_faces and all(abs(v.co.x)<=.1251 and abs(v.co.y)<=.1251 and -.7501<=v.co.z<=.0001 for v in face.verts)]
    bmesh.ops.delete(bm,geom=buried,context='FACES');bm.to_mesh(held.data);bm.free();held.data.update()
    mesh=held.data;mesh.calc_loop_triangles()
    positions=[];normals=[];colors=[]
    attr=mesh.color_attributes['Color']
    for tri in mesh.loop_triangles:
        for loopidx in tri.loops:
            q=mesh.vertices[mesh.loops[loopidx].vertex_index].co
            n=mesh.polygons[tri.polygon_index].normal
            positions.extend(round(v,5) for v in (q.x,q.z,-q.y))
            normals.extend(round(v,4) for v in (n.x,n.z,-n.y))
            colors.extend(round(v,5) for v in attr.data[loopidx].color[:3])
    DATA[held.name]=dict(pivot=[0,0,0],position=positions,normal=normals,color=colors)
    held.hide_render=True

# Blender preview clips use the same rigid shoulder/hip/neck pivots as the game.
for obj in arms+legs+piglegs+[head,snout]:
    for frame in range(1,50,2):
        phase=(frame-1)/48*math.tau
        if obj in arms+legs: angle=math.sin(phase)*.55*(1 if obj in (arms[0],legs[1]) else -1)
        elif obj in piglegs: angle=math.sin(phase)*.42*(1 if obj in (piglegs[0],piglegs[3]) else -1)
        else: angle=0
        obj.rotation_euler.x=angle; obj.keyframe_insert(data_path='rotation_euler',frame=frame)
    obj.animation_data.action.name=obj.name+'_Walk'
    track=obj.animation_data.nla_tracks.new(); track.name='Walk'
    track.strips.new('Walk',1,obj.animation_data.action); obj.animation_data.action=None
for obj in [head,snout]:
    for frame in range(1,145,3):
        t=(frame-1)/24; blend=min(1,t/1.2,(6-t)/1.2); blend=max(0,blend); blend=blend*blend*(3-2*blend)
        obj.rotation_euler.x=(-.92 if obj==head else math.sin(t*16)*.035)*blend
        if obj==head: obj.location.z=.6875-.12*blend
        obj.keyframe_insert(data_path='rotation_euler',frame=frame)
        obj.keyframe_insert(data_path='location',frame=frame)
    obj.animation_data.action.name=obj.name+'_Graze'
    track=obj.animation_data.nla_tracks.new(); track.name='Graze'
    track.strips.new('Graze',1,obj.animation_data.action); obj.animation_data.action=None
bpy.context.scene.frame_set(1)
(ROOT/'src/public/worldloom/src/character-meshes.js').write_text('// Generated from Blender mesh data by tools/generate_voxel_characters.py.\nexport const CHARACTER_MESHES = '+json.dumps(DATA,separators=(',',':'))+';\n')
bpy.ops.export_scene.gltf(filepath=str(ASSETS/'worldloom-characters.glb'),export_format='GLB',export_animations=True,export_animation_mode='NLA_TRACKS')

# Friendly, neutral studio preview, with the editable project preserved.
player.location.x=-.8; pig.location.x=.9
for i,pick in enumerate(pickaxes):
    pick.location=xyz([-.42+i*.65,.38,1.0])
    pick.rotation_euler=(0,0,0)
for obj in bpy.data.objects:
    if obj.animation_data:
        for track in obj.animation_data.nla_tracks: track.mute=True
    obj.rotation_euler=(0,0,0)
head.location=xyz([0,.6875,-.4375]); snout.location=xyz([0,-.09375,-.484375])
bpy.ops.mesh.primitive_plane_add(size=200)
floor=bpy.context.object
mat=bpy.data.materials.new('Studio sage'); mat.use_nodes=True; mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(*rgb('7f9683'),1); floor.data.materials.append(mat)
world=bpy.context.scene.world; world.use_nodes=True; world.node_tree.nodes['Background'].inputs[0].default_value=(.32,.4,.44,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.6
for loc,power,size in [((2,4,6),350,5),((-4,1,3),200,4),((1,-4,5),500,3)]:
    bpy.ops.object.light_add(type='AREA',location=loc); lamp=bpy.context.object; lamp.data.energy=power; lamp.data.shape='DISK'; lamp.data.size=size
    lamp.rotation_euler=(Vector((0,0,.8))-lamp.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(3.7,6.8,3.2))
cam=bpy.context.object; cam.rotation_euler=(Vector((0,0,.9))-cam.location).to_track_quat('-Z','Y').to_euler(); cam.data.type='ORTHO'; cam.data.ortho_scale=4.3
scene=bpy.context.scene; scene.camera=cam; scene.render.engine='CYCLES'; scene.cycles.samples=32
scene.render.resolution_x=1440; scene.render.resolution_y=1080; scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'; scene.render.image_settings.file_format='PNG'
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'worldloom-characters.blend'))
scene.render.filepath=str(OUT/'worldloom-characters.png'); bpy.ops.render.render(write_still=True)
print('Exported original Blender characters, runtime meshes, Walk/Graze clips and studio preview.')
