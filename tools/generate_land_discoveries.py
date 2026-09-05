"""Build original voxel landmarks in Blender, including editable collision boxes.

Run with Blender --background --python tools/generate_land_discoveries.py.
Geometry is authored in game coordinates, converted to Blender Z-up for editing,
then exported from evaluated Blender mesh triangles for the browser.
"""
import bpy, json, random
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT.parents[1] / 'outputs'
OUT.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
STONE = [(0.30,.36,.33),(.38,.43,.38),(.44,.47,.40),(.27,.31,.29)]
WOOD = [(.27,.14,.07),(.34,.19,.10),(.42,.25,.13),(.49,.31,.17)]
MOSS = [(.18,.29,.08),(.27,.36,.11),(.35,.42,.14)]
BRONZE = [(.52,.30,.095),(.68,.43,.14),(.38,.25,.105)]
IRON = [(.105,.13,.13),(.19,.23,.22)]
exports = {}

def landmark(name, offset):
    collection = bpy.data.collections.new(name); bpy.context.scene.collection.children.link(collection)
    boxes=[]; rng=random.Random(name)
    def box(label, x,y,z, sx,sy,sz, palette, collision=True):
        color=rng.choice(palette)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x+offset,-z,y))
        obj=bpy.context.object; obj.name=label; obj.scale=(sx,sz,sy)
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
        for c in list(obj.users_collection): c.objects.unlink(obj)
        collection.objects.link(obj)
        mesh=obj.data; attr=mesh.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='CORNER')
        for p in mesh.polygons:
            light = .91 if p.normal.z<-.1 else 1.04 if p.normal.z>.1 else 1
            for li in p.loop_indices: attr.data[li].color=tuple(min(1,v*light) for v in color)+(1,)
        obj['game_center']=[x,y,z]; obj['game_size']=[sx,sy,sz]; obj['collision']=collision
        if collision: boxes.append({'x':x,'y':y,'z':z,'halfX':sx/2,'halfZ':sz/2,'height':sy})
        return obj
    if name=='bell_shrine':
        # A broken freestanding arch: no roof, walls or occupied building.
        for x in [-2,2]:
            box('Mossy footing',x,.22,-1.4,1.5,.44,1.5,STONE)
            for row in range(5):
                box('Hand-cut pillar course',x,.7+row*.66,-1.4,1.05,.62,1.02,STONE)
            box('Stepped capital',x,3.73,-1.4,1.45,.34,1.38,STONE)
        for i in range(7):
            box('Broken arch keystone',-2.1+i*.70,4.12+(1-abs(i-3)/3)*.36,-1.4,.66,.58,1.1,STONE)
        # Two-tier square bell with hollow-looking dark mouth and voxel clapper.
        box('Bell suspension',0,3.79,-1.4,.18,.75,.18,IRON)
        box('Bell crown',0,3.40,-1.4,.64,.35,.64,BRONZE)
        box('Bell shoulder',0,3.15,-1.4,.93,.24,.93,BRONZE)
        for x,z,sx,sz in [(-.59,-1.4,.2,1.38),(.59,-1.4,.2,1.38),(0,-2,.98,.18),(0,-.8,.98,.18)]:
            box('Hollow bell wall',x,2.79,z,sx,.55,sz,BRONZE)
        box('Bell broad lip',0,2.46,-1.4,1.5,.14,1.5,BRONZE)
        box('Bell shadow opening',0,2.37,-1.4,1.12,.05,1.12,[IRON[0]])
        box('Square bronze clapper',0,2.26,-1.4,.22,.31,.22,BRONZE)
        # Fragmentary walls make an open courtyard and clear path to the chest.
        for x,z,h in [(-3,0,.78),(-3,1,.53),(-2.7,2.7,.30),(2.9,-2.4,.9),(1.4,-2.7,.35),(-.6,2.8,.25)]:
            box('Tumbled masonry',x,h/2,z,.83,h,.8,STONE)
            box('Moss mat',x-.11,h+.018,z,.57,.045,.57,MOSS,False)
        for x in [-2,2]:
            for y in [.45,1.15,2.45]:
                box('Creeping moss squares',x-.29,y,-.865,.32,.23,.05,MOSS,False)
        for x,z in [(-.9,.4),(0,.8),(.2,1.7),(-1,2.5)]:
            box('Inset pilgrim paver',x,.025,z,.7,.05,.62,STONE,False)
    else:
        # Timber derrick with stepped diagonal braces and an open suspended hoist.
        for x in [-1.6,1.6]:
            for z in [-1.4,.8]:
                box('Stone rig footing',x,.17,z,1,.34,1,STONE)
                box('Weathered timber upright',x,2.52,z,.48,4.7,.48,WOOD)
                box('Iron post collar',x,1.0,z,.52,.16,.52,IRON)
                for step in range(5):
                    box('Stepped diagonal brace',x-(1 if x>0 else -1)*(.22+step*.19),3.00+step*.20,z,.34,.31,.34,WOOD)
        for z in [-1.4,.8]:
            box('Derrick crossbeam',0,4.7,z,4.3,.48,.6,WOOD)
        box('Top lifting spine',0,4.97,-.20,.6,.38,3.85,WOOD)
        box('Hoist pulley rim',0,4.55,.43,.78,.76,.31,IRON)
        box('Hoist pulley hub',0,4.55,.62,.26,.28,.12,BRONZE)
        for y in [1.65+i*.27 for i in range(10)]:
            box('Hanging square chain',0,y,.42,.075,.21,.075,IRON,False)
        box('Lift hook',.09,1.23,.42,.3,.22,.12,IRON)
        for x,z,h in [(-.7,-.55,.37),(.2,-.7,.58),(.75,-.1,.27),(-.6,.2,.28)]:
            box('Loose quarry stone',x,h/2,z,.70,h,.63,STONE)
            box('Copper mineral seam',x+.08,h+.035,z,.3,.065,.24,BRONZE,False)
        for x in [-2.75,-2.35]:
            box('Ore sled rail',x,.18,1.2,.19,.23,2.0,IRON)
        for z in [.45,1.2,1.95]:
            box('Sled timber sleeper',-2.55,.08,z,1.05,.16,.27,WOOD)
        box('Miner supply crate',-2.6,.60,-1.75,.9,1.2,.9,WOOD)
        for y in [.2,1.0]:box('Crate strap',-2.6,y,-1.75,.94,.10,.94,IRON)
        for z in [-.8,.1,.95]:box('Overgrown rig moss',1.92,.04,z,.41,.08,.52,MOSS,False)
    data={'position':[],'normal':[],'color':[],'colliders':boxes}
    for obj in collection.objects:
        mesh=obj.data; mesh.calc_loop_triangles();attr=mesh.color_attributes['Color']
        for tri in mesh.loop_triangles:
            for li in tri.loops:
                p=obj.matrix_world@mesh.vertices[mesh.loops[li].vertex_index].co;n=tri.normal;c=attr.data[li].color
                data['position'].extend(round(v,5) for v in (p.x-offset,p.z,-p.y))
                data['normal'].extend(round(v,5) for v in (n.x,n.z,-n.y))
                data['color'].extend(round(v,5) for v in c[:3])
    mat=bpy.data.materials.new(name+' vertex palette');mat.use_nodes=True
    vc=mat.node_tree.nodes.new('ShaderNodeVertexColor');vc.layer_name='Color'
    mat.node_tree.links.new(vc.outputs['Color'],mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
    mat.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.86
    for obj in collection.objects:obj.data.materials.append(mat)
    exports[name]=data

landmark('bell_shrine',-5);landmark('quarry_rig',5)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'worldloom-land-discoveries.blend'))
(ROOT/'src/public/worldloom/src/discovery-assets.js').write_text('// Generated from evaluated Blender meshes by tools/generate_land_discoveries.py.\nexport const DISCOVERY_ASSETS = '+json.dumps(exports,separators=(',',':'))+';\n')
print(json.dumps({name:{'triangles':len(data['position'])//9,'colliders':len(data['colliders'])} for name,data in exports.items()}))
