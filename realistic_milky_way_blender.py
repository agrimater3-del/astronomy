"""
PROCEDURAL MILKY WAY GALAXY — BLENDER PYTHON
============================================

A self-contained procedural Blender scene for a cinematic exterior view of the
Milky Way: a barred spiral galaxy with a luminous central bulge, four broad
spiral arms, many star populations, blue/pink star-forming regions, dark dust
lanes, a sparse outer halo, deep-space background stars, camera, compositor
glow, and optional camera animation.

No add-ons, APIs, downloads, or external assets required.

Run:
  1. Open Blender (3.6 LTS or 4.x+).
  2. Switch to the Scripting workspace.
  3. Paste/open this script and click Run Script.
  4. Press F12 to render.
  5. Use Render > Render Animation for the camera move.

PREVIEW_MODE=True creates fewer stars and cloud puffs for quick testing.
Set PREVIEW_MODE=False for a denser final render.

This is a procedural artistic visualization, not a physically exact simulation
or a reconstruction of the Milky Way's actual star catalogue.
"""

import bpy
import math
import random
from mathutils import Vector

# ---------------------------------------------------------------------
# 1. SETTINGS
# ---------------------------------------------------------------------

SEED = 2026
random.seed(SEED)

PREVIEW_MODE = True
STAR_COUNT_DISK = 65000 if PREVIEW_MODE else 230000
STAR_COUNT_ARM_CLUSTERS = 18000 if PREVIEW_MODE else 70000
STAR_COUNT_BULGE = 22000 if PREVIEW_MODE else 80000
STAR_COUNT_HALO = 4500 if PREVIEW_MODE else 15000
STAR_COUNT_BACKGROUND = 4000 if PREVIEW_MODE else 14000
STAR_COUNT_DUST_FLECKS = 5000 if PREVIEW_MODE else 20000

GALAXY_RADIUS = 10.0
ARM_COUNT = 4
ARM_TIGHTNESS = 0.30
ARM_WIDTH = 0.43
ARM_START_RADIUS = 1.1
ARM_END_RADIUS = 9.4
BULGE_RADIUS = 2.0

RES_X = 1600
RES_Y = 1100
SAMPLES = 48 if PREVIEW_MODE else 128
USE_CYCLES = True
ANIMATE_CAMERA = True
FRAME_START = 1
FRAME_END = 120
ADD_NEBULA_CLOUDS = True
ADD_DUST_LANES = True

# ---------------------------------------------------------------------
# 2. CLEAN SCENE
# ---------------------------------------------------------------------

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials,
                   bpy.data.cameras, bpy.data.lights):
    for datablock in list(datablocks):
        if datablock.users == 0:
            datablocks.remove(datablock)

scene = bpy.context.scene

# ---------------------------------------------------------------------
# 3. MATERIALS
# ---------------------------------------------------------------------

def emission_mat(name, color, strength):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    em = nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (*color, 1)
    em.inputs["Strength"].default_value = strength
    mat.node_tree.links.new(em.outputs["Emission"], out.inputs["Surface"])
    return mat


def principled_mat(name, color, roughness=0.8, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return mat


STAR_MATERIALS = [
    emission_mat("Star Color | Blue-White", (0.50, 0.68, 1.0), 2.7),
    emission_mat("Star Color | Cool White", (0.78, 0.88, 1.0), 2.2),
    emission_mat("Star Color | Warm White", (1.0, 0.94, 0.82), 2.0),
    emission_mat("Star Color | Golden Giant", (1.0, 0.62, 0.30), 1.8),
    emission_mat("Star Color | Red Giant", (1.0, 0.25, 0.12), 1.6),
]
CORE_GOLD = emission_mat("Galactic Core | Warm Gold", (1.0, 0.58, 0.25), 2.8)
CORE_HOT = emission_mat("Galactic Core | Hot Center", (1.0, 0.84, 0.60), 4.0)
BAR_GLOW = emission_mat("Galactic Bar | Amber Glow", (1.0, 0.37, 0.12), 1.3)
NEBULA_BLUE = emission_mat("Nebula | Blue", (0.13, 0.35, 1.0), 0.72)
NEBULA_CYAN = emission_mat("Nebula | Cyan", (0.08, 0.58, 1.0), 0.55)
NEBULA_PINK = emission_mat("Nebula | Hydrogen Pink", (1.0, 0.12, 0.27), 0.42)
NEBULA_VIOLET = emission_mat("Nebula | Violet", (0.32, 0.12, 0.82), 0.34)
DUST_MAT = principled_mat("Interstellar Dust | Deep Umber", (0.025, 0.009, 0.006), 0.98)
HALO_MAT = emission_mat("Outer Halo | Faint Warm Dust", (0.30, 0.22, 0.17), 0.12)

# ---------------------------------------------------------------------
# 4. GEOMETRY HELPERS
# ---------------------------------------------------------------------

def smooth(obj):
    if hasattr(obj.data, "polygons"):
        for poly in obj.data.polygons:
            poly.use_smooth = True
    return obj


def uv_sphere(name, location, scale, mat, segments=32, rings=16):
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=segments, ring_count=rings, radius=1, location=location
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    if mat:
        obj.data.materials.append(mat)
    return smooth(obj)


def curve_tube(name, points, radius, mat):
    data = bpy.data.curves.new(name + " | Curve", 'CURVE')
    data.dimensions = '3D'
    data.resolution_u = 2
    data.bevel_depth = radius
    data.bevel_resolution = 2
    spline = data.splines.new('POLY')
    spline.points.add(len(points) - 1)
    for i, point in enumerate(points):
        spline.points[i].co = (*point, 1)
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    data.materials.append(mat)
    return obj


def create_star_mesh(name, points, color_indices, radii):
    """
    Efficiently pack many stars into one mesh. Each star is a tiny octahedron,
    rather than a separate Blender object. Material indices give each star a
    varied temperature/color.
    """
    verts, faces, face_mats = [], [], []
    for (x, y, z), color_i, r in zip(points, color_indices, radii):
        k = len(verts)
        verts.extend([
            (x, y, z+r), (x, y, z-r),
            (x+r, y, z), (x-r, y, z),
            (x, y+r, z), (x, y-r, z),
        ])
        faces.extend([
            (k, k+2, k+4), (k, k+4, k+3),
            (k, k+3, k+5), (k, k+5, k+2),
            (k+1, k+4, k+2), (k+1, k+3, k+4),
            (k+1, k+5, k+3), (k+1, k+2, k+5),
        ])
        face_mats.extend([color_i] * 8)

    mesh = bpy.data.meshes.new(name + " | Mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    for mat in STAR_MATERIALS:
        mesh.materials.append(mat)
    for poly, material_index in zip(mesh.polygons, face_mats):
        poly.material_index = material_index
    obj["star_count"] = len(points)
    return obj


def choose_star_color(warm_bias=False):
    if warm_bias:
        return random.choices([0, 1, 2, 3, 4], [3, 8, 27, 40, 22])[0]
    return random.choices([0, 1, 2, 3, 4], [18, 28, 30, 17, 7])[0]


def spiral_theta(radius, arm, jitter=0.0):
    offset = math.tau * arm / ARM_COUNT
    return offset + math.log(max(radius, 0.001) / ARM_START_RADIUS) / ARM_TIGHTNESS + jitter


# ---------------------------------------------------------------------
# 5. MAIN GALACTIC DISK
# ---------------------------------------------------------------------

disk_points, disk_colors, disk_radii = [], [], []
for i in range(STAR_COUNT_DISK):
    if random.random() < 0.80:
        arm = random.randrange(ARM_COUNT)
        r = random.uniform(ARM_START_RADIUS, ARM_END_RADIUS)
        theta = spiral_theta(r, arm, random.gauss(0, ARM_WIDTH / max(r, 0.6)))
        theta += random.gauss(0, ARM_WIDTH * (0.4 + r * 0.018) / max(r, 0.6))
    else:
        r = GALAXY_RADIUS * math.sqrt(random.random())
        theta = random.random() * math.tau

    x, y = r * math.cos(theta), r * math.sin(theta)
    z = random.gauss(0, 0.045 + r * 0.012)
    disk_points.append((x, y, z))
    disk_colors.append(choose_star_color())
    disk_radii.append(random.choices(
        [random.uniform(0.006, 0.014),
         random.uniform(0.015, 0.026),
         random.uniform(0.027, 0.045)],
        [84, 14, 2]
    )[0])

create_star_mesh("Stars | Main Spiral Disk", disk_points, disk_colors, disk_radii)

# ---------------------------------------------------------------------
# 6. BRIGHTER STAR-FORMING REGIONS IN SPIRAL ARMS
# ---------------------------------------------------------------------

cluster_points, cluster_colors, cluster_radii = [], [], []
for i in range(STAR_COUNT_ARM_CLUSTERS):
    arm = random.randrange(ARM_COUNT)
    r = random.uniform(ARM_START_RADIUS + 0.15, ARM_END_RADIUS)
    theta = spiral_theta(r, arm, random.gauss(0, 0.065))
    theta += random.gauss(0, ARM_WIDTH * 0.22 / max(r, 0.5))
    cluster_points.append((
        r * math.cos(theta),
        r * math.sin(theta),
        random.gauss(0, 0.045 + r * 0.008)
    ))
    cluster_colors.append(random.choices([0, 1, 2, 3, 4], [26, 32, 22, 14, 6])[0])
    cluster_radii.append(random.uniform(0.010, 0.028))

create_star_mesh("Stars | Dense Spiral Arm Clusters", cluster_points, cluster_colors, cluster_radii)

# ---------------------------------------------------------------------
# 7. CENTRAL BULGE AND BARRED CORE
# ---------------------------------------------------------------------

bulge_points, bulge_colors, bulge_radii = [], [], []
for i in range(STAR_COUNT_BULGE):
    r = (random.random() ** 1.7) * BULGE_RADIUS
    theta = random.random() * math.tau
    bulge_points.append((
        1.12 * r * math.cos(theta),
        0.84 * r * math.sin(theta),
        random.gauss(0, 0.035 + 0.17 * (1 - r / (BULGE_RADIUS + 0.01)))
    ))
    bulge_colors.append(choose_star_color(warm_bias=True))
    bulge_radii.append(random.uniform(0.008, 0.027))

create_star_mesh("Stars | Dense Golden Central Bulge", bulge_points, bulge_colors, bulge_radii)

bar = uv_sphere("Galaxy | Elongated Bar Glow", (0, 0, 0),
                (1.75, 0.58, 0.18), BAR_GLOW, 64, 32)
bar.rotation_euler[2] = math.radians(18)

core = uv_sphere("Galaxy | Golden Central Bulge", (0, 0, 0.015),
                 (1.42, 1.10, 0.29), CORE_GOLD, 64, 32)
hot_core = uv_sphere("Galaxy | Bright Inner Core", (0, 0, 0.025),
                     (0.70, 0.57, 0.21), CORE_HOT, 64, 32)

# ---------------------------------------------------------------------
# 8. NEBULA CLOUDS ALONG THE ARMS
# ---------------------------------------------------------------------

if ADD_NEBULA_CLOUDS:
    cloud_mats = [NEBULA_BLUE, NEBULA_CYAN, NEBULA_PINK, NEBULA_VIOLET]
    cloud_count = 110 if PREVIEW_MODE else 300
    for i in range(cloud_count):
        arm = random.randrange(ARM_COUNT)
        r = random.uniform(1.6, 8.9)
        theta = spiral_theta(r, arm, random.gauss(0, 0.09))
        x, y = r * math.cos(theta), r * math.sin(theta)
        size = random.uniform(0.10, 0.34)
        cloud = uv_sphere(
            "Nebula | Soft Gas Cloud %03d" % i,
            (x, y, random.uniform(-0.025, 0.025)),
            (size * random.uniform(1.1, 2.0),
             size * random.uniform(0.65, 1.35),
             size * random.uniform(0.12, 0.24)),
            random.choice(cloud_mats), 24, 12
        )
        cloud.rotation_euler[2] = theta + random.uniform(-0.6, 0.6)

# ---------------------------------------------------------------------
# 9. DARK INTERSTELLAR DUST LANES
# ---------------------------------------------------------------------

if ADD_DUST_LANES:
    # Four broad, curved dust ribbons on the inner edge of each spiral arm.
    for arm in range(ARM_COUNT):
        points = []
        for j in range(180):
            r = 1.15 + 8.0 * j / 179
            theta = spiral_theta(r, arm) + 0.055
            points.append((
                r * math.cos(theta),
                r * math.sin(theta),
                -0.035 + 0.008 * math.sin(j * 0.12)
            ))
        curve_tube("Dust Lane | Spiral Arm %d" % (arm+1), points, 0.038, DUST_MAT)

    # Dust filaments near the center.
    for lane in range(5):
        points = []
        x_start = -1.65 + lane * 0.68
        for j in range(40):
            t = j / 39
            points.append((
                x_start + 0.42 * t,
                -0.72 + 1.44 * t,
                0.11 + 0.012 * math.sin(t * math.tau + lane)
            ))
        curve_tube("Dust Lane | Central Filament %02d" % lane,
                   points, random.uniform(0.018, 0.045), DUST_MAT)

# ---------------------------------------------------------------------
# 10. SPARSE OUTER HALO STARS
# ---------------------------------------------------------------------

halo_points, halo_colors, halo_radii = [], [], []
for i in range(STAR_COUNT_HALO):
    radius = random.uniform(7.0, 13.5)
    theta = random.random() * math.tau
    halo_points.append((
        radius * math.cos(theta),
        radius * math.sin(theta),
        random.gauss(0, 1.25)
    ))
    halo_colors.append(choose_star_color())
    halo_radii.append(random.uniform(0.006, 0.019))

create_star_mesh("Stars | Extended Galactic Halo", halo_points, halo_colors, halo_radii)

# ---------------------------------------------------------------------
# 11. DEEP-SPACE BACKGROUND STARS
# ---------------------------------------------------------------------

bg_points, bg_colors, bg_radii = [], [], []
for i in range(STAR_COUNT_BACKGROUND):
    theta = random.uniform(0, math.tau)
    zdir = random.uniform(-1, 1)
    phi = math.acos(zdir)
    radius = random.uniform(18, 28)
    bg_points.append((
        radius * math.sin(phi) * math.cos(theta),
        radius * math.sin(phi) * math.sin(theta),
        radius * math.cos(phi)
    ))
    bg_colors.append(choose_star_color())
    bg_radii.append(random.uniform(0.006, 0.016))

create_star_mesh("Stars | Deep Space Backdrop", bg_points, bg_colors, bg_radii)

# ---------------------------------------------------------------------
# 12. FINE DUST-SCALE FLECKS
# ---------------------------------------------------------------------

dust_points, dust_colors, dust_radii = [], [], []
for i in range(STAR_COUNT_DUST_FLECKS):
    arm = random.randrange(ARM_COUNT)
    r = random.uniform(1.0, 9.2)
    theta = spiral_theta(r, arm, random.gauss(0, 0.12))
    theta += random.gauss(0, 0.40 / max(r, 0.5))
    dust_points.append((
        r * math.cos(theta), r * math.sin(theta),
        random.gauss(-0.04, 0.028)
    ))
    dust_colors.append(4)
    dust_radii.append(random.uniform(0.003, 0.009))

create_star_mesh("Disk | Tiny Dust-Scale Flecks", dust_points, dust_colors, dust_radii)

# ---------------------------------------------------------------------
# 13. WORLD AND CINEMATIC GLOW
# ---------------------------------------------------------------------

world = bpy.data.worlds.new("Deep Space World") if not bpy.data.worlds else bpy.data.worlds[0]
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.001, 0.002, 0.008, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.10

scene.use_nodes = True
tree = scene.node_tree
tree.nodes.clear()
rl = tree.nodes.new("CompositorNodeRLayers")
glare = tree.nodes.new("CompositorNodeGlare")
glare.glare_type = 'FOG_GLOW'
glare.quality = 'MEDIUM'
glare.threshold = 1.35
glare.size = 7
comp = tree.nodes.new("CompositorNodeComposite")
tree.links.new(rl.outputs["Image"], glare.inputs["Image"])
tree.links.new(glare.outputs["Image"], comp.inputs["Image"])

# ---------------------------------------------------------------------
# 14. CAMERA
# ---------------------------------------------------------------------

cam_data = bpy.data.cameras.new("Milky Way | Cinematic Camera")
cam = bpy.data.objects.new("Milky Way | Cinematic Camera", cam_data)
scene.collection.objects.link(cam)
cam.location = (13.5, -17.0, 12.5)
target = Vector((0, 0, 0))
cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()
cam_data.type = 'ORTHO'
cam_data.ortho_scale = 24.0
scene.camera = cam

if ANIMATE_CAMERA:
    cam.location = (13.5, -17.0, 12.5)
    cam.keyframe_insert(data_path="location", frame=FRAME_START)
    cam.location = (16.0, -14.0, 10.8)
    cam.keyframe_insert(data_path="location", frame=FRAME_END)
    if cam.animation_data and cam.animation_data.action:
        for fc in cam.animation_data.action.fcurves:
            for key in fc.keyframe_points:
                key.interpolation = 'BEZIER'

# ---------------------------------------------------------------------
# 15. LIGHTS FOR THE NON-EMISSIVE DUST
# ---------------------------------------------------------------------

def area_light(name, location, energy, color, size, target=(0, 0, 0)):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = energy
    data.color = color
    data.shape = 'DISK'
    data.size = size
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()
    return obj

area_light("Light | Cool Rim", (4, -6, 10), 500, (0.25, 0.42, 1.0), 8)
area_light("Light | Warm Core Bounce", (-4, 1, 5), 700, (1.0, 0.35, 0.12), 5)

# ---------------------------------------------------------------------
# 16. RENDER SETTINGS
# ---------------------------------------------------------------------

scene.render.engine = 'CYCLES' if USE_CYCLES else 'BLENDER_EEVEE_NEXT'
if scene.render.engine == 'CYCLES':
    scene.cycles.samples = SAMPLES
    scene.cycles.use_denoising = True

scene.render.resolution_x = RES_X
scene.render.resolution_y = RES_Y
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.film_transparent = False
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.frame_start = FRAME_START
scene.frame_end = FRAME_END
scene.render.fps = 30
scene.frame_set(FRAME_START)

bpy.ops.object.select_all(action='DESELECT')
core.select_set(True)
bpy.context.view_layer.objects.active = core

print("\\n" + "=" * 72)
print("PROCEDURAL MILKY WAY SCENE CREATED")
print("Press F12 to render.")
print("Preview mode:", PREVIEW_MODE)
print("Set PREVIEW_MODE=False for the full star population.")
print("This is an artistic exterior visualization, not an exact star catalogue.")
print("=" * 72 + "\\n")
