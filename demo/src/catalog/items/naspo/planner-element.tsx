import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const WIDTH = 50;
const DEPTH = 30;
const HEIGHT = 80;

const red = new Three.MeshPhongMaterial({ color: 0xAA0000 });
const grey = new Three.MeshLambertMaterial({ color: 0xAAAAAA });
const black = new Three.MeshLambertMaterial({ color: 0x000000 });
const textureLoader = new Three.TextureLoader();
const frontTexture = textureLoader.load(require('./naspofront.png'));

const objectMaxLOD = makeObjectMaxLOD();
const objectMiddleLOD = makeObjectMiddleLOD();
const objectMinLOD = makeObjectMinLOD();

function makeObjectMaxLOD() {
  const naspo = new Three.Mesh();

  const roundedRectShape = new Three.Shape();

  const x = 0;
  const y = 0;
  const radius = 0.1;
  const height = 1.2;
  const width = 0.8;
  const depth = 0.6;

  roundedRectShape.moveTo(x, y + radius);
  roundedRectShape.lineTo(x, y + height - radius);
  roundedRectShape.quadraticCurveTo(x, y + height, x + radius, y + height);
  roundedRectShape.lineTo(x + width - radius, y + height);
  roundedRectShape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  roundedRectShape.lineTo(x + width, y + radius);
  roundedRectShape.quadraticCurveTo(x + width, y, x + width - radius, y);
  roundedRectShape.lineTo(x + radius, y);
  roundedRectShape.quadraticCurveTo(x, y, x, y + radius);

  const extrudeSettings = {
    steps: 2,
    depth: depth / 3,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 1
  };

  const geometryBody = new Three.ExtrudeGeometry(roundedRectShape, extrudeSettings);
  const mesh = new Three.Mesh(geometryBody, red);
  mesh.position.set(0.1, 1.1, 0.1);
  naspo.add(mesh);

  const geometryBox = new Three.BoxGeometry(0.95, 1.05, 0.2);
  const mesh1 = new Three.Mesh(geometryBox, red);
  mesh1.position.set(0.5, 1.7, 0.2);
  naspo.add(mesh1);

  const geometryPlane = new Three.PlaneGeometry(0.6, 0.9);
  const mesh3 = new Three.Mesh(geometryPlane, new Three.MeshPhongMaterial({ map: frontTexture, transparent: true }));
  mesh3.position.set(0.5, 1.7, 0.31);
  naspo.add(mesh3);

  const cylinderGeometry1 = new Three.CylinderGeometry(0.05, 0.05, 0.025, 80, 80);
  const handle_p1 = new Three.Mesh(cylinderGeometry1, grey);
  handle_p1.position.set(0.17, 1.7, 0.3);
  handle_p1.rotation.x = Math.PI / 2;
  naspo.add(handle_p1);

  const cylinderGeometry2 = new Three.CylinderGeometry(0.051, 0.051, 0.05, 80, 80, true);
  black.side = Three.DoubleSide;
  const handle_p2 = new Three.Mesh(cylinderGeometry2, black);
  handle_p2.position.set(0.17, 1.7, 0.31);
  handle_p2.rotation.x = Math.PI / 2;
  naspo.add(handle_p2);

  const geometry = new Three.BoxGeometry(0.1, 0.02, 0.02);
  const handle_p3 = new Three.Mesh(geometry, black);
  handle_p3.position.set(0.17, 1.7, 0.32);
  naspo.add(handle_p3);

  const cylinderGeometry4 = new Three.CylinderGeometry(0.015, 0.015, 0.1, 80, 80);
  const pivot1 = new Three.Mesh(cylinderGeometry4, black);
  pivot1.position.set(0.99, 1.9, 0.28);
  naspo.add(pivot1);

  const cylinderGeometry5 = new Three.CylinderGeometry(0.015, 0.015, 0.1, 80, 80);
  const pivot2 = new Three.Mesh(cylinderGeometry5, black);
  pivot2.position.set(0.99, 1.4, 0.28);
  naspo.add(pivot2);

  const roundedRectShape2 = new Three.Shape();

  const width2 = 1.05;
  const height2 = 1.3;
  const radius2 = 0.1;

  roundedRectShape2.moveTo(x, y + radius2);
  roundedRectShape2.lineTo(x, y + height2 - radius2);
  roundedRectShape2.quadraticCurveTo(x, y + height2, x + radius2, y + height2);
  roundedRectShape2.lineTo(x + width2 - radius2, y + height2);
  roundedRectShape2.quadraticCurveTo(x + width2, y + height2, x + width2, y + height2 - radius2);
  roundedRectShape2.lineTo(x + width2, y + radius2);
  roundedRectShape2.quadraticCurveTo(x + width2, y, x + width2 - radius2, y);
  roundedRectShape2.lineTo(x + radius2, y);
  roundedRectShape2.quadraticCurveTo(x, y, x, y + radius2);

  const extrudeSettings2 = {
    steps: 2,
    depth: depth,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 1
  };

  const geometry2 = new Three.ExtrudeGeometry(roundedRectShape2, extrudeSettings2);
  const mesh2 = new Three.Mesh(geometry2, red);
  mesh2.position.set(0, 1.05, -0.33);
  naspo.add(mesh2);

  return naspo
}

function makeObjectMiddleLOD() {
  const naspo = new Three.Mesh();

  const roundedRectShape2 = new Three.Shape();

  const x = 0;
  const y = 0;
  const width2 = 1.05;
  const height2 = 1.3;
  const radius2 = 0.1;
  const depth = 0.6;

  roundedRectShape2.moveTo(x, y + radius2);
  roundedRectShape2.lineTo(x, y + height2 - radius2);
  roundedRectShape2.quadraticCurveTo(x, y + height2, x + radius2, y + height2);
  roundedRectShape2.lineTo(x + width2 - radius2, y + height2);
  roundedRectShape2.quadraticCurveTo(x + width2, y + height2, x + width2, y + height2 - radius2);
  roundedRectShape2.lineTo(x + width2, y + radius2);
  roundedRectShape2.quadraticCurveTo(x + width2, y, x + width2 - radius2, y);
  roundedRectShape2.lineTo(x + radius2, y);
  roundedRectShape2.quadraticCurveTo(x, y, x, y + radius2);

  const extrudeSettings2 = {
    steps: 2,
    depth: depth,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 1
  };

  const geometry2 = new Three.ExtrudeGeometry(roundedRectShape2, extrudeSettings2);
  const mesh2 = new Three.Mesh(geometry2, red);
  mesh2.position.set(0, 1.05, -0.33);
  naspo.add(mesh2);

  const geometryBox = new Three.BoxGeometry(0.95, 1.05, 0.2);
  const mesh1 = new Three.Mesh(geometryBox, red);
  mesh1.position.set(0.5, 1.7, 0.2);
  naspo.add(mesh1);

  const geometryPlane = new Three.PlaneGeometry(0.6, 0.9);
  const mesh3 = new Three.Mesh(geometryPlane, new Three.MeshPhongMaterial({ map: frontTexture, transparent: true }));
  mesh3.position.set(0.5, 1.7, 0.31);
  naspo.add(mesh3);

  return naspo;
}

function makeObjectMinLOD() {
  const naspo = new Three.Mesh();

  const roundedRectShape2 = new Three.Shape();

  const x = 0;
  const y = 0;
  const width2 = 1.05;
  const height2 = 1.3;
  const radius2 = 0.1;
  const depth = 0.6;

  roundedRectShape2.moveTo(x, y + radius2);
  roundedRectShape2.lineTo(x, y + height2 - radius2);
  roundedRectShape2.quadraticCurveTo(x, y + height2, x + radius2, y + height2);
  roundedRectShape2.lineTo(x + width2 - radius2, y + height2);
  roundedRectShape2.quadraticCurveTo(x + width2, y + height2, x + width2, y + height2 - radius2);
  roundedRectShape2.lineTo(x + width2, y + radius2);
  roundedRectShape2.quadraticCurveTo(x + width2, y, x + width2 - radius2, y);
  roundedRectShape2.lineTo(x + radius2, y);
  roundedRectShape2.quadraticCurveTo(x, y, x, y + radius2);

  const extrudeSettings2 = {
    steps: 2,
    depth: depth,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 1
  };

  const geometry2 = new Three.ExtrudeGeometry(roundedRectShape2, extrudeSettings2);
  const mesh2 = new Three.Mesh(geometry2, red);
  mesh2.position.set(0, 1.05, -0.33);
  naspo.add(mesh2);

  return naspo;
}

export default defineCatalogElement({
  name: "naspo",
  prototype: "items",

  info: {
    tag: ['furnishings', 'metal'],
    title: "naspo",
    description: "naspo",
    image: require('./naspo.png')
  },

  properties: {
    altitude: {
      label: "altitude",
      type: "length-measure",
      defaultValue: {
        length: 60
      }
    }
  },

  render2D: function (element, layer, scene) {
    const angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }

    return (
      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`}>
        <rect key="1" x="0" y="0" width={WIDTH} height={DEPTH}
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: "#ff0000" }} />
        <text key="2" x="0" y="0"
          transform={`translate(${WIDTH / 2}, ${DEPTH / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: "middle", fontSize: "11px" }}>
          {element.type}
        </text>
      </g>
    )
  },

  async render3D(element, layer, scene) {
    const newAltitude = element.properties.altitude.length;

    /**************** LOD max ***********************/

    const naspoMaxLOD = new Three.Object3D();
    naspoMaxLOD.add(objectMaxLOD.clone());

    const valuePosition = new Three.Box3().setFromObject(naspoMaxLOD);

    const deltaX = Math.abs(valuePosition.max.x - valuePosition.min.x);
    const deltaY = Math.abs(valuePosition.max.y - valuePosition.min.y);
    const deltaZ = Math.abs(valuePosition.max.z - valuePosition.min.z);

    naspoMaxLOD.rotation.y += Math.PI;
    naspoMaxLOD.position.x += WIDTH / 2;
    naspoMaxLOD.position.y += -HEIGHT / 1.3 + newAltitude;
    naspoMaxLOD.scale.set(WIDTH / deltaX, HEIGHT / deltaY, DEPTH / deltaZ);


    /**************** LOD middle ***********************/

    const naspoMiddleLOD = new Three.Object3D();
    naspoMiddleLOD.add(objectMiddleLOD.clone());

    naspoMiddleLOD.rotation.y += Math.PI;
    naspoMiddleLOD.position.x += WIDTH / 2;
    naspoMiddleLOD.position.y += -HEIGHT / 1.3 + newAltitude;
    naspoMiddleLOD.scale.set(WIDTH / deltaX, HEIGHT / deltaY, DEPTH / deltaZ);

    /**************** LOD min ***********************/

    const naspoMinLOD = new Three.Object3D();
    naspoMinLOD.add(objectMinLOD.clone());

    naspoMinLOD.rotation.y += Math.PI;
    naspoMinLOD.position.x += WIDTH / 2;
    naspoMinLOD.position.y += -HEIGHT / 1.3 + newAltitude;
    naspoMinLOD.scale.set(WIDTH / deltaX, HEIGHT / deltaY, DEPTH / deltaZ);

    /*** add all Level of Detail ***/

    const lod = new Three.LOD();

    lod.addLevel(naspoMaxLOD, 200);
    lod.addLevel(naspoMiddleLOD, 900);
    lod.addLevel(naspoMinLOD, 1200);
    lod.updateMatrix();
    lod.matrixAutoUpdate = false;

    if (element.selected) {
      const bbox = new Three.BoxHelper(lod, 0x99c3fb);
      bbox.material.linewidth = 5;
      bbox.renderOrder = 1000;
      bbox.material.depthTest = false;
      lod.add(bbox);
    }

    return lod;
  }
});
