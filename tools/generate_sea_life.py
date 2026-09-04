"""Original Blender fish and ribbon seagrass, exported for the WebGL habitat.
Run: blender --background --factory-startup --python tools/generate_sea_life.py
Coordinates are authored in metres; fish face +X. No downloaded models.
"""
import bpy, math, json, random
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT.parents[1] / 'outputs'
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
random.seed(73)
scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 49
scene.render.fps = 24
scene.unit_settings.system = 'METRIC'
assets = {}

def material(name, color):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    shader = m.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Roughness'].default_value = .48
    return m

def mesh(name, vertices, faces, mat, root, motion='body'):
    # Author convenient Y-up coordinates, convert into Blender's Z-up scene.
    data = bpy.data.meshes.new(name)
    data.from_pydata([(x, -z, y) for x, y, z in vertices], [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.parent = root
    obj['motion_part'] = motion
    data.materials.append(mat)
    return obj

def ellipsoid(name, center, scale, mat, root):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=6, location=(center[0], -center[2], center[1]))
    obj = bpy.context.object
    obj.name = name
    obj.scale = (scale[0], scale[2], scale[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.parent = root
    obj['motion_part'] = 'body'
    obj.data.materials.append(mat)
    return obj

def export_root(root):
    positions, normals, colors, motion = [], [], [], []
    for obj in root.children:
        if obj.type != 'MESH': continue
        obj.data.calc_loop_triangles()
        for tri in obj.data.loop_triangles:
            color = obj.data.materials[tri.material_index].diffuse_color[:3]
            for vi in tri.vertices:
                q = obj.matrix_local @ obj.data.vertices[vi].co
                n = obj.matrix_local.to_3x3() @ tri.normal
                x, y, z = q.x, q.z, -q.y
                positions.extend(round(v, 6) for v in (x,y,z))
                normals.extend(round(v, 6) for v in (n.x,n.z,-n.y))
                colors.extend(round(v, 5) for v in color)
                part = obj.get('motion_part', 'body')
                motion.extend([max(0,min(1,(-x+.025)/.19)), 1 if part=='pectoral' else 0, 1 if z>0 else -1, 1 if part=='jaw' else 0])
    return dict(position=positions, normal=normals, color=colors, motion=motion)

species = [
    ('Silver_Dart', .34, .055, .033, (.34,.55,.59), (.72,.82,.73), (.25,.37,.40)),
    ('Amber_Bream', .31, .088, .035, (.67,.32,.085), (.96,.68,.27), (.48,.19,.05)),
    ('Reef_Wrasse', .39, .068, .038, (.08,.43,.40), (.38,.76,.55), (.12,.24,.38)),
]
for si,(name,length,height,width,back,belly,fin) in enumerate(species):
    root = bpy.data.objects.new(name, None)
    scene.collection.objects.link(root)
    root['authored_in'] = 'Blender'
    root['adult_length_metres'] = length
    root['behavior'] = 'protected seagrass grazer'
    backmat=material(name+' back',back); bellymat=material(name+' belly',belly)
    finmat=material(name+' translucent-looking fins',fin)
    stripe=material(name+' flank stripe',tuple(v*.58 for v in back))
    eye=material(name+' black pupils',(.005,.012,.014))
    iris=material(name+' pale iris',(.8,.83,.59))
    vertices=[];faces=[]
    rings=[(-.36,.17),(-.25,.50),(-.10,.88),(.06,1),(.24,.78),(.37,.42),(.43,.12)]
    for x,radius in rings:
        for a in range(12):
            angle=a/12*math.tau
            vertices.append((x*length,math.cos(angle)*height*radius,math.sin(angle)*width*radius))
    for i in range(len(rings)-1):
        for a in range(12): faces.append((i*12+a,(i+1)*12+a,(i+1)*12+(a+1)%12,i*12+(a+1)%12))
    faces.extend([tuple(reversed(range(12))),tuple((len(rings)-1)*12+a for a in range(12))])
    body=mesh(name+' tapered body',vertices,faces,backmat,root)
    body.data.materials.append(bellymat);body.data.materials.append(stripe)
    for poly in body.data.polygons:
        angle=poly.index%12
        poly.material_index=1 if 3<=angle<=8 else 0
        if si==2 and poly.index//12 in (1,3) and angle in (2,3,8,9): poly.material_index=2
        if si==0 and angle in (2,9): poly.material_index=2
    # Forked tail with a narrow peduncle; separate fin silhouette per species.
    tx=-length*.35; end=-length*.60
    mesh(name+' forked caudal fin',[(tx,0,0),(end,height*.91,0),(end+length*.08,0,0),(end,-height*.91,0)],[(0,1,2),(0,2,3)],finmat,root,'tail')
    mesh(name+' dorsal sail',[(-length*.27,height*.33,0),(-length*.17,height*(1.52 if si==1 else 1.30),0),(length*.14,height*1.08,0),(length*.24,height*.60,0)],[(0,1,2,3)],finmat,root)
    mesh(name+' anal fin',[(-length*.20,-height*.58,0),(-length*.22,-height*1.3,0),(length*.03,-height*.83,0)],[(0,1,2)],finmat,root)
    for side in [-1,1]:
        mesh(name+f' pectoral {side}',[(length*.16,-height*.15,side*width*.84),(-length*.05,-height*.68,side*width*2.1),(-length*.12,-height*.14,side*width*.95)],[(0,1,2)],finmat,root,'pectoral')
        ellipsoid(name+f' iris {side}',(length*.30,height*.24,side*width*.61),(.014,.014,.005),iris,root)
        ellipsoid(name+f' pupil {side}',(length*.309,height*.255,side*(width*.61+.004)),(.008,.009,.003),eye,root)
        # Small gill slit stays rooted in the rigid anterior body.
        mesh(name+f' gill {side}',[(length*.20,height*.45,side*width*.78),(length*.18,-height*.40,side*width*.84),(length*.17,-height*.33,side*width*.87)],[(0,1,2)],stripe,root)
    mesh(name+' feeding jaw',[(length*.43,-height*.04,-.007),(length*.45,-height*.13,0),(length*.43,-height*.04,.007),(length*.34,-height*.23,0)],[(0,1,2),(0,2,3)],bellymat,root,'jaw')
    bpy.context.view_layer.update()
    assets[name]=export_root(root)
    # Editable two-second swimming loop, with increasing tail displacement.
    for obj in root.children:
        if obj.type!='MESH':continue
        obj.shape_key_add(name='Rest')
        for sign,label in [(-1,'Tail sweep left'),(1,'Tail sweep right')]:
            key=obj.shape_key_add(name=label)
            for v in key.data:
                x=v.co.x+obj.location.x
                weight=max(0,min(1,(-x+.025)/.19))
                v.co.y += sign*.024*weight*weight
            for frame in [1,7,13,19,25,31,37,43,49]:
                key.value=max(0,sign*math.sin((frame-1)/24*math.tau))
                key.keyframe_insert('value',frame=frame)

root=bpy.data.objects.new('Ribbon_Seagrass',None);scene.collection.objects.link(root)
root['authored_in']='Blender';root['habitat']='submerged sand or loam; rooted flexible blades'
greens=[material('Seagrass '+str(i),c) for i,c in enumerate([(.055,.22,.12),(.10,.37,.18),(.23,.49,.20),(.34,.55,.23)])]
for blade in range(9):
    angle=blade*2.399963;h=.48+random.random()*.45;w=.032+random.random()*.027
    verts=[];faces=[]
    for level in range(11):
        t=level/10;curve=.18*t*t;twist=angle+t*.8
        width=w*math.sin(math.pi*(t*.94+.03))**.6
        for side in [-1,1]:
            verts.append((math.cos(angle)*curve+math.cos(twist)*width*side,h*t,math.sin(angle)*curve+math.sin(twist)*width*side))
    for level in range(10):faces.append((level*2,level*2+1,level*2+3,level*2+2))
    obj=mesh('Flexible blade '+str(blade+1),verts,faces,greens[blade%4],root,'plant')
    obj.data.materials.append(greens[(blade+1)%4])
    for poly in obj.data.polygons:poly.material_index=1 if poly.index>6 else 0
    obj.shape_key_add(name='Rooted rest')
    key=obj.shape_key_add(name='Current bend')
    for v in key.data:v.co.x+=.20*(v.co.z/.93)**2
    for frame in [1,13,25,37,49]:
        key.value=.5+.5*math.sin((frame-1)/48*math.tau);key.keyframe_insert('value',frame=frame)
bpy.context.view_layer.update()
assets['Ribbon_Seagrass']=export_root(root)
runtime=ROOT/'src/public/worldloom/src/sea-life-meshes.js'
runtime.write_text('// Original Blender meshes in metres, Y up, fish forward +X. Regenerate: tools/generate_sea_life.py\nexport const SEA_LIFE_MESHES = '+json.dumps(assets,separators=(',',':'))+';\n')
scene.frame_set(1)
bpy.ops.export_scene.gltf(filepath=str(ROOT/'src/public/worldloom/assets/environment/sea-life.glb'),export_format='GLB',export_animations=True,export_morph=True)
# Separate the originals into an editable presentation; exported data stays local.
for i,(name,*_) in enumerate(species):bpy.data.objects[name].location=(0,(i-1)*.4,.65)
root.location=(-.5,0,0)
scene.world.color=(.10,.16,.20)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'worldloom-sea-life.blend'))
print('Authored three small fish species and nine flexible seagrass blades; exported mesh data, animated GLB and Blender project.')
