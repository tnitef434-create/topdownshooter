"""Original fern leaf geometry and wearable headlamp, authored/exported in Blender."""
import bpy, math, json
from mathutils import Vector
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT.parents[1]/'outputs';OUT.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
exports={}

def export(name,verts,faces,colors,location=(0,0,0)):
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
    obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj);obj.location=location
    attr=mesh.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='CORNER')
    for poly,c in zip(mesh.polygons,colors):
        for li in poly.loop_indices:attr.data[li].color=(*c,1)
    mat=bpy.data.materials.new(name+' satin surface');mat.use_nodes=True
    vc=mat.node_tree.nodes.new('ShaderNodeVertexColor');vc.layer_name='Color'
    mat.node_tree.links.new(vc.outputs['Color'],mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
    mat.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.83
    mesh.materials.append(mat);mesh.calc_loop_triangles()
    data={'position':[],'normal':[],'color':[]}
    for tri in mesh.loop_triangles:
        for li in tri.loops:
            p=mesh.vertices[mesh.loops[li].vertex_index].co;n=tri.normal;c=attr.data[li].color
            data['position'] += [round(v,5) for v in (p.x,p.z,-p.y)]
            data['normal'] += [round(v,5) for v in (n.x,n.z,-n.y)]
            data['color'] += [round(v,5) for v in c[:3]]
    exports[name]=data
    return obj

def fern(name,scale,palette,location):
    vs=[];fs=[];cs=[]
    def triangle(a,b,c,color):
        i=len(vs);vs.extend([a,b,c]);fs.append((i,i+1,i+2));cs.append(color)
    for frond in range(8):
        angle=frond*math.tau/8+.12*math.sin(frond*8)
        length=scale*(.7+.14*math.sin(frond*4.7));side=Vector((-math.sin(angle),math.cos(angle),0))
        def stem(t):
            r=length*(.16*t+.66*t*t)
            return Vector((math.cos(angle)*r,math.sin(angle)*r,length*(1.58*t-1.04*t*t)))
        for j in range(10):
            a=stem(j/10);b=stem((j+1)/10);w=.007*scale
            triangle(a-side*w,b-side*w,b+side*w,palette[0]);triangle(a-side*w,b+side*w,a+side*w,palette[0])
        for j in range(1,10):
            t=j/10;base=stem(t);direction=(stem(t+.025)-base).normalized()
            leaflet=length*.24*math.sin(math.pi*t)**.8
            for sign in [-1,1]:
                end=base+side*leaflet*sign+direction*leaflet*.34
                mid=base.lerp(end,.48)+Vector((0,0,.021*scale))
                width=leaflet*.27
                left=mid-direction*width;right=mid+direction*width
                color=palette[1+(j+frond)%2]
                triangle(base,left,mid,color);triangle(base,mid,right,palette[2])
                triangle(left,end,mid,color);triangle(mid,end,right,palette[1])
    obj=export(name,vs,fs,cs,location)
    # Editable rooted wind preview; runtime bends the same leaves per instance.
    obj.shape_key_add(name='Rooted rest')
    key=obj.shape_key_add(name='Soft frond bend')
    for v in key.data:
        h=max(0,v.co.z);v.co.x+=h*h*.18;v.co.y+=h*h*.065
    for frame,value in [(1,0),(46,1),(91,0),(136,-.5),(181,0)]:
        key.value=value;key.keyframe_insert('value',frame=frame)
    return obj

fern('WOODLAND_FERN',1.3,[(.085,.18,.025),(.11,.28,.035),(.19,.39,.065)],(-1.5,0,0))
fern('CAVE_FERN',.82,[(.075,.13,.045),(.14,.26,.11),(.23,.35,.16)],(0,0,0))
# A hanging plant is authored from the root, not a rectangular cutout.
vs=[];fs=[];cs=[]
for strand in range(4):
    length=.8+strand*.16
    for j in range(9):
        t=j/9;z=-length*t;x=math.sin(t*4+strand)*.07+strand*.06-.09;y=math.cos(t*3+strand)*.055
        i=len(vs);vs.extend([(x-.004,y,z),(x+.004,y,z),(x+.008,y,z-length/9),(x,y,z-length/9)])
        fs.extend([(i,i+1,i+2),(i,i+2,i+3)]);cs.extend([(.16,.22,.07)]*2)
        sign=1 if j%2 else -1;w=.08*(1-t*.5)
        i=len(vs);vs.extend([(x,y,z),(x+sign*w,y-.015,z-.025),(x+sign*w*1.4,y,z-.12),(x+sign*w*.5,y+.025,z-.095)])
        fs.extend([(i,i+1,i+2),(i,i+2,i+3)]);cs.extend([(.18,.31,.095),(.23,.38,.13)])
export('CAVE_VINE',vs,fs,cs,(1.4,0,1.4))

# Wearable headlamp, local -Y is forward, mounted above the eyes.
parts=[]
for radius,depth,y,color in [(.072,.065,-.035,(.055,.065,.07)),(.062,.013,-.075,(.42,.45,.42)),(.051,.01,-.086,(.7,.83,.84))]:
    bpy.ops.mesh.primitive_cylinder_add(vertices=24,radius=radius,depth=depth,location=(0,y,0),rotation=(math.pi/2,0,0))
    o=bpy.context.object;bpy.ops.object.transform_apply(location=False,rotation=True,scale=True);parts.append((o,color))
bpy.ops.mesh.primitive_cube_add(size=1,location=(0,.015,0));o=bpy.context.object;o.scale=(.155,.035,.11);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);parts.append((o,(.08,.09,.085)))
vs=[];fs=[];cs=[]
for o,c in parts:
    start=len(vs);vs.extend([tuple(o.matrix_world@v.co) for v in o.data.vertices]);fs.extend([tuple(start+i for i in p.vertices) for p in o.data.polygons]);cs.extend([c]*len(o.data.polygons));bpy.data.objects.remove(o,do_unlink=True)
export('HEADLAMP',vs,fs,cs,(2.2,0,.6))
bpy.ops.object.light_add(type='SPOT',location=(2.2,-.1,.6));light=bpy.context.object;light.name='Headlamp soft shadow beam';light.rotation_euler=(math.pi/2,0,0);light.data.energy=32;light.data.spot_size=1.05;light.data.spot_blend=.8;light.data.shadow_soft_size=.035
exports['HEADLAMP_OPTICS']={'intensity':34,'distance':28,'angle':.525,'penumbra':.8,'decay':1.55}
bpy.context.scene.frame_end=181;bpy.context.scene.render.fps=30;bpy.context.scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'worldloom-cave-plants-and-headlamp.blend'))
(ROOT/'src/public/worldloom/src/cave-assets.js').write_text('// Generated with Blender: tools/generate_cave_assets.py\n'+''.join('export const '+name+' = '+json.dumps(data,separators=(',',':'))+';\n' for name,data in exports.items()))
print('Exported',[(k,len(v.get('position',[]))//9) for k,v in exports.items()])
