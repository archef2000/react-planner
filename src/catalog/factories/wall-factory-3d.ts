import {
  TextureLoader,
  Mesh,
  RepeatWrapping,
  Vector2,
  BoxGeometry,
  MeshBasicMaterial,
  Group,
  MeshStandardMaterial,
  MeshStandardMaterialParameters,
  BufferGeometry,
  Float32BufferAttribute,
  Vector3,
  DoubleSide,
  SRGBColorSpace,
  Object3D,
  Object3DEventMap,
  Texture
} from 'three';

import { CSG } from 'three-csg-ts';
import { verticesDistance } from '../../utils/geometry';
import * as SharedStyle from '../../shared-style';
import { Layer, Line, Scene } from '../../models';
import { CatalogElementTextures } from '../../types';
import { calcLineEnd } from './utils/calcPolygon';

const halfPI = Math.PI / 2;

const baseTextureCache: Record<string, Texture> = {};
const loaderSingleton = new TextureLoader();

function getBaseTexture(uri: string): Texture {
  if (!uri) return null as any;
  if (baseTextureCache[uri]) return baseTextureCache[uri];
  const tex = loaderSingleton.load(uri);
  tex.colorSpace = SRGBColorSpace;
  baseTextureCache[uri] = tex;
  return tex;
}


const applyTexture = (texture: CatalogElementTextures[string], length: number, height: number) => {
  const material = new MeshStandardMaterial();

  const setupMap = (
    base: Texture,
    repeatL: number,
    repeatH: number,
    assign: (t: Texture) => void,
    extra?: (t: Texture) => void
  ) => {
    if (!base) return;

    const cloneAndAssign = () => {
      if (!base.image || !base.image.width) {
        requestAnimationFrame(cloneAndAssign);
        return;
      }
      const map = base.clone();
      map.image = base.image;
      map.wrapS = RepeatWrapping;
      map.wrapT = RepeatWrapping;
      map.repeat.set(repeatL, repeatH);
      map.needsUpdate = true;
      assign(map);
      if (extra) extra(map);
      material.needsUpdate = true;
    };

    cloneAndAssign();
  };

  if (texture) {
    const base = getBaseTexture(texture.uri);
    setupMap(
      base,
      length * texture.lengthRepeatScale,
      height * texture.heightRepeatScale,
      (m) => { material.map = m; }
    );

    if (texture.normal) {
      const baseNormal = getBaseTexture(texture.normal.uri);
      setupMap(
        baseNormal,
        length * texture.normal.lengthRepeatScale,
        height * texture.normal.heightRepeatScale,
        (m) => { material.normalMap = m; },
        () => { material.normalScale = new Vector2(texture.normal.normalScaleX, texture.normal.normalScaleY); }
      );
    }
  }

  return material;
};


export function buildWall(element: Line, layer: Layer, scene: Scene, textures: CatalogElementTextures) {
  // Get the two vertices of the wall
  let vertex0 = layer.vertices[element.vertices[0]];
  let vertex1 = layer.vertices[element.vertices[1]];
  let inverted = false;

  // The first vertex is the smaller one
  if (vertex0.x > vertex1.x) {
    const app = vertex0;
    vertex0 = vertex1;
    vertex1 = app;
    inverted = true;
  }
  // Get height and thickness of the wall converting them into the current scene units
  const height = element.properties.height.length;
  const thickness = element.properties.thickness.length;
  const faceThickness = 0.2; // thickness of decorative textured panel
  const faceDistance = 0.5;    // no artificial gap; panels will be shifted just outside the wall body

  const distance = verticesDistance(vertex0, vertex1);


  const points1 = calcLineEnd(layer, element.id, element.vertices[0], thickness);
  const rawPoints2 = calcLineEnd(layer, element.id, element.vertices[1], thickness);
  const points2 = rawPoints2.map(p => ({ x: distance - p.x, y: p.y }));

  // Robustly pair front/back ends to avoid twists: match end corner closest (in plan y) to the start corner
  const endA = points2[0];
  const endB = points2[points2.length - 1];
  const frontEnd = Math.abs(endA.y - points1[0].y) <= Math.abs(endB.y - points1[0].y) ? endA : endB;
  const backEnd = (frontEnd === endA) ? endB : endA;

  const frontPoints = [points1[0], frontEnd].map((p) => { return { y: p.y * -1, x: p.x } });
  const backPoints = [points1[points1.length - 1], backEnd].map((p) => { return { y: p.y * -1, x: p.x } });

  const halfDistance = distance / 2;

  const soulMaterial = new MeshBasicMaterial({ color: (element.selected ? SharedStyle.MESH_SELECTED : 0xD3D3D3) });
  soulMaterial.side = DoubleSide;

  // Build a custom prism geometry using the four plan-view corners (front/back at start/end)
  const fStart = frontPoints[0];
  const fEnd = frontPoints[1];
  const bStart = backPoints[0];
  const bEnd = backPoints[1];

  const bottomY = -height / 2;
  const topY = height / 2;

  const xLocal = (x: number) => x - halfDistance; // center geometry on X=0 like BoxGeometry
  const uFromX = (x: number) => x / distance;     // normalize along length for UVs

  // 8 corner points (bottom and top)
  const v0 = { x: xLocal(fEnd.x), y: bottomY, z: fEnd.y }; // front start bottom
  const v1 = { x: xLocal(fStart.x), y: bottomY, z: fStart.y }; // front end bottom
  const v2 = { x: xLocal(bStart.x), y: bottomY, z: bStart.y }; // back end bottom
  const v3 = { x: xLocal(bEnd.x), y: bottomY, z: bEnd.y }; // back start bottom

  const v4 = { x: v0.x, y: topY, z: v0.z }; // front start top
  const v5 = { x: v1.x, y: topY, z: v1.z }; // front end top
  const v6 = { x: v2.x, y: topY, z: v2.z }; // back end top
  const v7 = { x: v3.x, y: topY, z: v3.z }; // back start top

  const positions: number[] = [];
  const uvs: number[] = [];

  const push = (vx: { x: number; y: number; z: number }, ux = 0, vy = 0) => {
    positions.push(vx.x, vx.y, vx.z);
    uvs.push(ux, vy);
  };

  const tri = (
    a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }, c: { x: number; y: number; z: number },
    au = 0, av = 0, bu = 0, bv = 0, cu = 0, cv = 0
  ) => {
    push(a, au, av); push(b, bu, bv); push(c, cu, cv);
  };

  // Front long face (map UVs: u along length [0..1], v along height [0..1])
  const uF0 = uFromX(fStart.x), uF1 = uFromX(fEnd.x);
  tri(v0, v1, v5, uF0, 0, uF1, 0, uF1, 1);
  tri(v0, v5, v4, uF0, 0, uF1, 1, uF0, 1);

  // Back long face (UVs)
  const uB0 = uFromX(bStart.x), uB1 = uFromX(bEnd.x);
  tri(v2, v3, v7, uB1, 0, uB0, 0, uB0, 1);
  tri(v2, v7, v6, uB1, 0, uB0, 1, uB1, 1);

  // Start end face (no UVs needed)
  tri(v3, v0, v4);
  tri(v3, v4, v7);

  // End end face (no UVs needed)
  tri(v1, v2, v6);
  tri(v1, v6, v5);

  // Bottom face (close the prism)
  tri(v0, v2, v1);
  tri(v0, v3, v2);

  // Top face
  tri(v4, v5, v6);
  tri(v4, v6, v7);

  const soulGeometry = new BufferGeometry();
  soulGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  soulGeometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  soulGeometry.computeVertexNormals();

  let soul: Mesh = new Mesh(soulGeometry, soulMaterial);

  const alpha = Math.asin((vertex1.y - vertex0.y) / (distance));

  const sinAlpha = Math.sin(alpha);
  const cosAlpha = Math.cos(alpha);

  element.holes.forEach(holeID => {
    const holeData = layer.holes[holeID];

    const holeWidth = holeData.properties.width.length;
    const holeHeight = holeData.properties.height.length;
    const holeAltitude = holeData.properties.altitude.length;
    const offset = inverted ? 1 - holeData.offset : holeData.offset;
    const holeDistance = offset * distance;

    const holeGeometry = new BoxGeometry(holeWidth, holeHeight, thickness);
    const holeMesh = new Mesh(holeGeometry);

    // Work in wall local space
    holeMesh.position.set(
      holeDistance - distance / 2,
      -(height / 2) + holeAltitude + holeHeight / 2,
      0
    );

    holeMesh.updateMatrix();

    soul = CSG.subtract(soul, holeMesh);
  });

  soul.position.y += height / 2;
  soul.position.x += halfDistance * cosAlpha;
  soul.position.z -= halfDistance * sinAlpha;

  soul.rotation.y = alpha;
  soul.name = 'soul';

  const frontMaterial = applyTexture(textures[element.properties.textureB], distance, height);
  const backMaterial = applyTexture(textures[element.properties.textureA], distance, height);

  // Build proper thin face panels from actual face quads, offset outward along face normal
  // Helper to build a thin extruded quad geometry with UVs along length (u) and height (v)
  const buildExtrudedQuad = (
    a: { x: number; y: number; z: number },
    b: { x: number; y: number; z: number },
    c: { x: number; y: number; z: number },
    d: { x: number; y: number; z: number },
    thicknessLocal: number,
    uA: number,
    uB: number
  ) => {
    // Convert to arrays for convenience
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;
    const cx = c.x, cy = c.y, cz = c.z;
    const dx = d.x, dy = d.y, dz = d.z;

    // Compute face normal (a->b) x (a->d)
    const abx = bx - ax, aby = by - ay, abz = bz - az;
    const adx = dx - ax, ady = dy - ay, adz = dz - az;
    // cross(ab, ad)
    let nx = aby * adz - abz * ady;
    let ny = abz * adx - abx * adz;
    let nz = abx * ady - aby * adx;
    const nLen = Math.hypot(nx, ny, nz) || 1;
    nx /= nLen; ny /= nLen; nz /= nLen;

    const halfT = thicknessLocal / 2;

    // Offset the quad along +/- normal to create a thin volume
    const aF = [ax + nx * halfT, ay + ny * halfT, az + nz * halfT]; // +normal side
    const bF = [bx + nx * halfT, by + ny * halfT, bz + nz * halfT];
    const cF = [cx + nx * halfT, cy + ny * halfT, cz + nz * halfT];
    const dF = [dx + nx * halfT, dy + ny * halfT, dz + nz * halfT];

    const aB = [ax - nx * halfT, ay - ny * halfT, az - nz * halfT]; // -normal side
    const bB = [bx - nx * halfT, by - ny * halfT, bz - nz * halfT];
    const cB = [cx - nx * halfT, cy - ny * halfT, cz - nz * halfT];
    const dB = [dx - nx * halfT, dy - ny * halfT, dz - nz * halfT];

    const pos: number[] = [];
    const uv: number[] = [];

    const pushV = (v: number[], u = 0, vT = 0) => { pos.push(v[0], v[1], v[2]); uv.push(u, vT); };
    const triV = (A: number[], B: number[], C: number[], Au = 0, Av = 0, Bu = 0, Bv = 0, Cu = 0, Cv = 0) => {
      pushV(A, Au, Av); pushV(B, Bu, Bv); pushV(C, Cu, Cv);
    };

    // Front face (+normal side) with UVs
    triV(aF, bF, cF, uA, 0, uB, 0, uB, 1);
    triV(aF, cF, dF, uA, 0, uB, 1, uA, 1);

    // Back face (-normal side) UVs can be mirrored or default
    triV(bB, aB, dB);
    triV(bB, dB, cB);

    // Sides (no UVs needed)
    // Edge AB
    triV(aB, aF, bF); triV(aB, bF, bB);
    // Edge BC
    triV(bB, bF, cF); triV(bB, cF, cB);
    // Edge CD
    triV(cB, cF, dF); triV(cB, dF, dB);
    // Edge DA
    triV(dB, dF, aF); triV(dB, aF, aB);

    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
    g.computeVertexNormals();
    return g;
  };

  // Build face quads from existing corners
  const uFrontA = uFromX(fStart.x), uFrontB = uFromX(fEnd.x);
  const frontGeom = buildExtrudedQuad(v0, v1, v5, v4, faceThickness, uFrontA, uFrontB);

  const uBackA = uFromX(bStart.x), uBackB = uFromX(bEnd.x);
  const backGeom = buildExtrudedQuad(v2, v3, v7, v6, faceThickness, uBackB, uBackA); // note reversed to keep u increasing along length

  let frontFace: Mesh = new Mesh(frontGeom, frontMaterial);
  let backFace: Mesh = new Mesh(backGeom, backMaterial);

  // Compute outward normals based on center-to-center vector so panels always sit fully outside
  const frontCenter = new Vector3(
    (v0.x + v1.x + v5.x + v4.x) / 4,
    (v0.y + v1.y + v5.y + v4.y) / 4,
    (v0.z + v1.z + v5.z + v4.z) / 4
  );
  const backCenter = new Vector3(
    (v2.x + v3.x + v7.x + v6.x) / 4,
    (v2.y + v3.y + v7.y + v6.y) / 4,
    (v2.z + v3.z + v7.z + v6.z) / 4
  );
  const centerVector = new Vector3().subVectors(backCenter, frontCenter); // from front to back
  const thicknessDir = centerVector.clone().normalize();
  // Invert previous direction: move front along +thicknessDir and back along -thicknessDir
  const frontOutward = thicknessDir.clone();
  const backOutward = thicknessDir.clone().multiplyScalar(1);
  const outwardShift = (faceThickness / 2) + faceDistance; // ensure panel sits fully outside + epsilon
  const inwardShift = (faceThickness / 2) - faceDistance; // ensure panel sits fully outside + epsilon

  // Subtract holes from the face panels as well to avoid panels crossing openings
  element.holes.forEach(holeID => {
    const holeData = layer.holes[holeID];

    const holeWidth = holeData.properties.width.length;
    const holeHeight = holeData.properties.height.length;
    const holeAltitude = holeData.properties.altitude.length;
    const offset = inverted ? 1 - holeData.offset : holeData.offset;
    const holeDistance = offset * distance;

    const holeGeometry = new BoxGeometry(holeWidth, holeHeight, thickness + faceThickness * 2 + faceDistance * 2);
    const holeMesh = new Mesh(holeGeometry);

    holeMesh.position.set(
      holeDistance - distance / 2,
      -(height / 2) + holeAltitude + holeHeight / 2,
      0
    );

    holeMesh.updateMatrix();

    // Front face
    frontFace = CSG.subtract(frontFace, holeMesh);

    // Back face
    backFace = CSG.subtract(backFace, holeMesh);
  });

  // Position/rotate like soul
  [frontFace, backFace].forEach(face => {
    face.position.y += height / 2;
    face.position.x += halfDistance * cosAlpha;
    face.position.z -= halfDistance * sinAlpha;
    face.rotation.y = alpha;
  });


  frontFace.translateOnAxis(frontOutward, inwardShift);
  backFace.translateOnAxis(backOutward, outwardShift);

  frontFace.name = 'frontFace';
  backFace.name = 'backFace';

  const merged = new Group();
  merged.add(soul, frontFace, backFace);

  return merged;
}

export function updatedWall(element: Line, layer: Layer, scene: Scene, textures: CatalogElementTextures, mesh: Object3D<Object3DEventMap>, oldElement: Line, differences, selfDestroy, selfBuild) {
  const noPerf = () => { selfDestroy(); return selfBuild(); };

  const soul = mesh.getObjectByName('soul');
  const frontFace = mesh.getObjectByName('frontFace');
  const backFace = mesh.getObjectByName('backFace');

  if (differences[0] == 'selected') {
    const mat = new MeshBasicMaterial({ color: (element.selected ? SharedStyle.MESH_SELECTED : 0xD3D3D3) });
    mat.side = DoubleSide;
    (soul as Mesh).material = mat;
  }
  else if (differences[0] == 'properties') {
    if (differences[1] == 'thickness') {
      const newThickness = element.properties.thickness.length;
      const oldThickness = oldElement.properties.thickness.length;
      const halfNewThickness = newThickness / 2;
      const texturedFaceDistance = halfNewThickness + 1;
      const originalThickness = oldThickness / soul.scale.z;
      const alpha = soul.rotation.y;

      const xTemp = texturedFaceDistance * Math.cos(alpha - halfPI);
      const zTemp = texturedFaceDistance * Math.sin(alpha - halfPI);

      soul.scale.set(1, 1, newThickness / originalThickness);

      frontFace.position.x = soul.position.x + xTemp;
      frontFace.position.z = soul.position.z + zTemp;

      backFace.position.x = soul.position.x - xTemp;
      backFace.position.z = soul.position.z - zTemp;
      return noPerf();
    }
    else return noPerf();
  }
  else return noPerf();

  return mesh;
}
