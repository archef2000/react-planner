import * as Three from 'three';

function disposeGeometry(geometry: Three.BufferGeometry) {
  geometry.dispose();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function disposeTexture(texture?: Three.Texture) {
  if (!texture) {
    return;
  }
  texture.dispose();
}

function disposeMultimaterial(materials: Three.Material | Three.Material[]) {
  if (!Array.isArray(materials)) {
    return;
  }
  materials.forEach((material) => {
    disposeMaterial(material);
  });
}

function disposeMaterial(material: Three.Material) {
  if (Array.isArray(material)) {
    return;
  }
  material.dispose();
}

function disposeMesh(mesh: Three.Object3D<Three.Object3DEventMap>) {
  if (
    !(
      mesh instanceof Three.Mesh ||
      mesh instanceof Three.BoxHelper ||
      mesh instanceof Three.LineSegments
    )
  ) {
    return;
  }
  disposeGeometry(mesh.geometry);
  disposeMultimaterial(mesh.material);
  disposeMaterial(mesh.material);

  mesh.geometry = null;
  mesh.material = null;
}

export function disposeScene(scene3D: Three.Scene) {
  scene3D.traverse((child) => {
    disposeMesh(child);
  });
}

export function disposeObject(object: Three.Object3D<Three.Object3DEventMap>) {
  object.traverse((child) => {
    disposeMesh(child);
  });
  object.clear();
}
