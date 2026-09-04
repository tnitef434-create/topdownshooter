import * as THREE from '../vendor/three.module.min.js';
import { CHARACTER_MESHES } from './character-meshes.js';

// These are the evaluated Blender meshes, not separately approximated browser models.
export function characterMesh(name, material) {
  const data = CHARACTER_MESHES[name];
  const geometry = new THREE.BufferGeometry();
  for (const key of ['position', 'normal', 'color']) {
    geometry.setAttribute(key, new THREE.Float32BufferAttribute(data[key], 3));
  }
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.fromArray(data.pivot);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.authoredIn = 'Blender';
  return mesh;
}

export function characterMaterial() {
  return new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .94, metalness: 0 });
}

export function makePigRig() {
  const root = new THREE.Group();
  root.name = 'Meadow pig · Blender';
  const mat = characterMaterial();
  const parts = {};
  for (const key of ['body', 'head', 'snout', 'front_left', 'front_right', 'back_left', 'back_right', 'tail']) {
    const mesh = characterMesh(`pig_${key}`, mat);
    parts[key] = mesh;
    (key === 'snout' ? parts.head : root).add(mesh);
  }
  return { root, parts, material: mat };
}

export function disposeCharacter(root) {
  const materials = new Set();
  root.traverse(node => { if (node.isMesh) { node.geometry.dispose(); materials.add(node.material); } });
  materials.forEach(material => material.dispose());
  root.removeFromParent();
}
