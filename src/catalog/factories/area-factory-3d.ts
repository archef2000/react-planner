import {
  Shape,
  MeshPhongMaterial,
  ShapeGeometry,
  Box3,
  TextureLoader,
  BackSide,
  FrontSide,
  Object3D,
  Mesh,
  MeshBasicMaterial,
  RepeatWrapping,
  Vector2,
  DoubleSide,
  Object3DEventMap
} from 'three';
import * as SharedStyle from '../../shared-style';
import { CatalogElementTextures } from '../../types';
import { Scene, Layer, Area } from '../../models';

/**
 * Apply a texture to a wall face
 * @param material: The material of the face
 * @param texture: The texture to load
 * @param length: The lenght of the face
 * @param height: The height of the face
 */
const applyTexture = (material: MeshPhongMaterial, texture: CatalogElementTextures[string], length: number, height: number) => {
  const loader = new TextureLoader();

  if (texture) {
    material.map = loader.load(texture.uri);
    material.needsUpdate = true;
    material.map.wrapS = RepeatWrapping;
    material.map.wrapT = RepeatWrapping;
    material.map.repeat.set(length * texture.lengthRepeatScale, height * texture.heightRepeatScale);

    if (texture.normal) {
      material.normalMap = loader.load(texture.normal.uri);
      material.normalScale = new Vector2(texture.normal.normalScaleX, texture.normal.normalScaleY);
      material.normalMap.wrapS = RepeatWrapping;
      material.normalMap.wrapT = RepeatWrapping;
      material.normalMap.repeat.set(length * texture.normal.lengthRepeatScale, height * texture.normal.heightRepeatScale);
    }
  }
};

/**
 * Function that assign UV coordinates to a geometry
 * @param geometry
 */
const assignUVs = (geometry) => {
  geometry.computeBoundingBox();

  const { min, max } = geometry.boundingBox;

  const offset = new Vector2(0 - min.x, 0 - min.y);
  const range = new Vector2(max.x - min.x, max.y - min.y);

  geometry.faceVertexUvs[0] = geometry.faces.map((face) => {

    const v1 = geometry.vertices[face.a];
    const v2 = geometry.vertices[face.b];
    const v3 = geometry.vertices[face.c];

    return [
      new Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
      new Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
      new Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
    ];

  });

  geometry.uvsNeedUpdate = true;
};

export function createArea(element: Area, layer: Layer, scene: Scene, textures: CatalogElementTextures) {
  const vertices = [];

  element.vertices.forEach(vertexID => {
    vertices.push(layer.vertices[vertexID]);
  });

  const textureName = element.properties.texture;
  let color = element.properties.patternColor;

  if (element.selected) {
    color = SharedStyle.AREA_MESH_COLOR.selected;
  } else if (textureName && textureName !== 'none') {
    color = SharedStyle.AREA_MESH_COLOR.unselected;
  }

  const shape = new Shape();
  shape.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i++) {
    shape.lineTo(vertices[i].x, vertices[i].y);
  }

  const areaMaterial = new MeshPhongMaterial({ side: DoubleSide, color });

  /* Create holes for the area */
  element.holes.forEach(holeID => {
    let holeCoords = [];
    layer.areas[holeID].vertices.forEach(vertexID => {
      const { x, y } = layer.vertices[vertexID];
      holeCoords.push([x, y]);
    });
    holeCoords = holeCoords.reverse();
    const holeShape = createShape(holeCoords);
    shape.holes.push(holeShape);
  });

  const shapeGeometry = new ShapeGeometry(shape);
  //assignUVs(shapeGeometry);

  const boundingBox = new Box3().setFromObject(new Mesh(shapeGeometry, new MeshBasicMaterial()));

  const width = boundingBox.max.x - boundingBox.min.x;
  const height = boundingBox.max.y - boundingBox.min.y;

  const texture = textures[textureName];

  applyTexture(areaMaterial, texture, width, height);

  const area = new Mesh(shapeGeometry, areaMaterial);

  area.rotation.x -= Math.PI / 2;
  area.name = 'floor';

  return area;
}

export function updatedArea(element, layer, scene, textures, mesh: Object3D<Object3DEventMap>, oldElement, differences, selfDestroy, selfBuild) {
  const noPerf = () => { selfDestroy(); return selfBuild(); };
  const floor = mesh.getObjectByName('floor');

  if (differences[0] == 'selected') {
    const color = element.selected ? SharedStyle.AREA_MESH_COLOR.selected : (element.properties.patternColor || SharedStyle.AREA_MESH_COLOR.unselected);
    ((floor as Mesh).material as MeshPhongMaterial).color.set(color);
  }
  else if (differences[0] == 'properties') {
    if (differences[1] === 'texture') {
      return noPerf();
    }
  }
  else return noPerf();

  return mesh;
}

/**
 * This function will create a shape given a list of coordinates
 * @param shapeCoords
 * @returns {Shape}
 */
const createShape = (shapeCoords) => {
  const shape = new Shape();
  shape.moveTo(shapeCoords[0][0], shapeCoords[0][1]);
  for (let i = 1; i < shapeCoords.length; i++) {
    shape.lineTo(shapeCoords[i][0], shapeCoords[i][1]);
  }
  return shape;
};
