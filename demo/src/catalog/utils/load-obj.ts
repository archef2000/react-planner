import { Group, Object3DEventMap } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export async function loadObjWithMaterial(
  mtlFile: string,
  objFile: string,
  resourcePath: string
) {
  const mtlLoader = new MTLLoader();
  mtlLoader.setResourcePath(resourcePath);

  const materials = await mtlLoader.loadAsync(mtlFile);
  materials.preload();

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  const object = await objLoader.loadAsync(objFile);
  return object;
}

