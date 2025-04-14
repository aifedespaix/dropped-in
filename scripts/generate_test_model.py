import trimesh
import numpy as np

# Créer une boîte simple
box = trimesh.creation.box(extents=[1, 2, 1])

# Ajouter une couleur bleue
box.visual.face_colors = [100, 100, 255, 255]

# Créer une scène
scene = trimesh.Scene()
scene.add_geometry(box)

# Exporter en GLB
scene.export('public/models/character.glb') 