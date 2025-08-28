import * as Three from 'three';

function disposeGeometry(geometry) {
  geometry.dispose();
}

function disposeTexture(texture) {
  if (!texture) {
    return;
  }
  texture.dispose();
}

function disposeMultimaterial(materials: Three.Material | Three.Material[]) {
  if (!(Array.isArray(materials))) {
    return;
  }
  materials.forEach(material => {
    disposeMaterial(material);
  });

}

function disposeMaterial(material: Three.Material | Three.Material[]) {
  if (Array.isArray(material)) {
    return;
  }
  material.dispose();
}

function disposeMesh(mesh) {
  if (!(mesh instanceof Three.Mesh || mesh instanceof Three.BoxHelper || mesh instanceof Three.LineSegments)) {
    return;
  }
  disposeGeometry(mesh.geometry);
  disposeMultimaterial(mesh.material);
  disposeMaterial(mesh.material);

  mesh.geometry = null;
  mesh.material = null;
}

export function disposeScene(scene3D) {
  scene3D.traverse(child => {
    disposeMesh(child);
    child = null;
  });
}

export function disposeObject(object) {
  object.traverse(child => {
    disposeMesh(child);
    child = null;
  });
}
