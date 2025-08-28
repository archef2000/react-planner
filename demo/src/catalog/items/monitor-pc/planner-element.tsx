import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const WIDTH = 50;
const DEPTH = 50;
const HEIGHT = 50;

const textureLoader = new Three.TextureLoader();
const power = textureLoader.load(require("./power.jpg"));
const black = textureLoader.load(require("./black.jpg"));
const white = textureLoader.load(require("./white.jpg"));
const keyboard = textureLoader.load(require("./keyboard.jpg"));
const blackMaterial = new Three.MeshLambertMaterial({ map: black });

const objectMaxLOD = makeObjectMaxLOD();
const objectMinLOD = makeObjectMinLOD();

function makeObjectMaxLOD() {
  const monitorPC = new Three.Mesh();

  const cubeGeometryBase = new Three.BoxGeometry(0.04, 0.42, 0.06);
  const whiteMaterial = new Three.MeshLambertMaterial({ map: white });
  const edge_p0 = new Three.Mesh(cubeGeometryBase, whiteMaterial);
  edge_p0.position.set(0, 0.79, 0);
  edge_p0.rotation.x = Math.PI / 2;
  monitorPC.add(edge_p0);

  const cubeGeometryBase2 = new Three.BoxGeometry(0.04, 0.42, 0.06);
  const edge_p1 = new Three.Mesh(cubeGeometryBase2, whiteMaterial);
  edge_p1.position.set(0, 0.43, 0);
  edge_p1.rotation.x = Math.PI / 2;
  monitorPC.add(edge_p1);

  const cubeGeometryBase3 = new Three.BoxGeometry(0.04, 0.42, 0.04);
  const edge_p3 = new Three.Mesh(cubeGeometryBase3, whiteMaterial);
  edge_p3.position.set(0, 0.61, 0.21);
  monitorPC.add(edge_p3);

  const cubeGeometryBase4 = new Three.BoxGeometry(0.04, 0.42, 0.04);
  const edge_p4 = new Three.Mesh(cubeGeometryBase4, whiteMaterial);
  edge_p4.position.set(0, 0.61, -0.21);
  monitorPC.add(edge_p4);

  const cubeGeometryBase5 = new Three.BoxGeometry(0.4, 0.40, 0.05);
  const back = new Three.Mesh(cubeGeometryBase5, blackMaterial);
  back.position.set(-0.02, 0.61, 0);
  back.rotation.y = Math.PI / 2;
  monitorPC.add(back);

  const powerGeometry = new Three.BoxGeometry(0.01, 0.02, 0.02);
  const powerMaterial = new Three.MeshLambertMaterial({ map: power });
  const powerButton = new Three.Mesh(powerGeometry, powerMaterial);
  powerButton.position.set(0.0155, 0.43, 0);
  monitorPC.add(powerButton);

  const cylinderGeometry1 = new Three.CylinderGeometry(0.02, 0.02, 0.06, 32, 32);
  const base_p1 = new Three.Mesh(cylinderGeometry1, blackMaterial);
  base_p1.position.set(0, 0.38, 0);
  monitorPC.add(base_p1);

  const geometry = new Three.CylinderGeometry(0.1, 0.1, 0.02, 32, 32);
  const material = new Three.MeshLambertMaterial({ map: black });
  const base_p2 = new Three.Mesh(geometry, material);
  base_p2.scale.set(0.8, 1, 1);
  base_p2.position.set(0, 0.36, 0);
  monitorPC.add(base_p2);

  //keyboard
  const cubeGeometryBase8 = new Three.BoxGeometry(0.4, 0.02, 0.2);

  const boxMaterials = [
    new Three.MeshBasicMaterial({ color: 0x000000 }),
    new Three.MeshBasicMaterial({ color: 0x000000 }),
    new Three.MeshLambertMaterial({ map: keyboard }),
    new Three.MeshBasicMaterial({ color: 0x000000 }),
    new Three.MeshBasicMaterial({ color: 0x000000 }),
    new Three.MeshBasicMaterial({ color: 0x000000 })
  ];

  const keyboardMesh = new Three.Mesh(cubeGeometryBase8, boxMaterials);
  keyboardMesh.position.set(0.3, 0.36, 0);
  keyboardMesh.rotation.y = Math.PI / 2;
  monitorPC.add(keyboardMesh);

  return monitorPC;
}

function makeObjectMinLOD() {
  const monitorPC = new Three.Mesh();

  const cubeGeometryBase = new Three.BoxGeometry(0.04, 0.42, 0.06);
  const whiteMaterial = new Three.MeshLambertMaterial({ map: white });
  const edge_p0 = new Three.Mesh(cubeGeometryBase, whiteMaterial);
  edge_p0.position.set(0, 0.79, 0);
  edge_p0.rotation.x = Math.PI / 2;
  monitorPC.add(edge_p0);

  const cubeGeometryBase2 = new Three.BoxGeometry(0.04, 0.42, 0.06);
  const edge_p1 = new Three.Mesh(cubeGeometryBase2, whiteMaterial);
  edge_p1.position.set(0, 0.43, 0);
  edge_p1.rotation.x = Math.PI / 2;
  monitorPC.add(edge_p1);

  const cubeGeometryBase3 = new Three.BoxGeometry(0.04, 0.42, 0.04);
  const edge_p3 = new Three.Mesh(cubeGeometryBase3, whiteMaterial);
  edge_p3.position.set(0, 0.61, 0.21);
  monitorPC.add(edge_p3);

  const cubeGeometryBase4 = new Three.BoxGeometry(0.04, 0.42, 0.04);
  const edge_p4 = new Three.Mesh(cubeGeometryBase4, whiteMaterial);
  edge_p4.position.set(0, 0.61, -0.21);
  monitorPC.add(edge_p4);

  const cubeGeometryBase5 = new Three.BoxGeometry(0.4, 0.40, 0.05);
  const blackMaterial = new Three.MeshLambertMaterial({ map: black });
  const back = new Three.Mesh(cubeGeometryBase5, blackMaterial);
  back.position.set(-0.02, 0.61, 0);
  back.rotation.y = Math.PI / 2;
  monitorPC.add(back);

  const cylinderGeometry1 = new Three.CylinderGeometry(0.02, 0.02, 0.06, 8, 8);
  const base_p1 = new Three.Mesh(cylinderGeometry1, blackMaterial);
  base_p1.position.set(0, 0.38, 0);
  monitorPC.add(base_p1);

  const geometry = new Three.CylinderGeometry(0.1, 0.1, 0.02, 8, 8);
  const base_p2 = new Three.Mesh(geometry, blackMaterial);
  base_p2.scale.set(0.8, 1, 1);
  base_p2.position.set(0, 0.36, 0);
  monitorPC.add(base_p2);

  //keyboard
  const cubeGeometryBase8 = new Three.BoxGeometry(0.4, 0.02, 0.2);
  const keyboardMesh = new Three.Mesh(cubeGeometryBase8, blackMaterial);
  keyboardMesh.position.set(0.3, 0.36, 0);
  keyboardMesh.rotation.y = Math.PI / 2;
  monitorPC.add(keyboardMesh);

  return monitorPC;
}

export default defineCatalogElement({
  name: "monitor_pc",
  prototype: "items",

  info: {
    tag: ['furnishings'],
    title: "pc monitor",
    description: "pc monitor",
    image: require('./monitorPC.png')
  },

  properties: {
    altitude: {
      label: "altitude",
      type: "length-measure",
      defaultValue: {
        length: 100
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
      <g transform={`translate(${-WIDTH / 2},${-DEPTH})`}>
        <rect key="1" x="0" y="0" width={WIDTH} height={DEPTH}
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: "#84e1ce" }} />
        <text key="2" x="0" y="0"
          transform={`translate(${WIDTH / 2}, ${DEPTH / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: "middle", fontSize: "10px" }}>
          {element.type}
        </text>
      </g>
    )
  },

  async render3D(element, layer, scene) {
    const newAltitude = element.properties.altitude.length;

    /**************** LOD max ***********************/

    const monitorPC_MaxLOD = new Three.Object3D();
    monitorPC_MaxLOD.add(objectMaxLOD.clone());

    const aa = new Three.Box3().setFromObject(monitorPC_MaxLOD);

    const deltaX = Math.abs(aa.max.x - aa.min.x);
    const deltaY = Math.abs(aa.max.y - aa.min.y);
    const deltaZ = Math.abs(aa.max.z - aa.min.z);

    monitorPC_MaxLOD.rotation.y += -Math.PI / 2;
    monitorPC_MaxLOD.position.y += -HEIGHT * .75 + newAltitude;
    monitorPC_MaxLOD.scale.set(WIDTH / deltaZ, HEIGHT / deltaY, DEPTH / deltaX);

    /**************** LOD min ***********************/

    const monitorPC_MinLOD = new Three.Object3D();

    monitorPC_MinLOD.add(objectMinLOD.clone());

    monitorPC_MinLOD.rotation.y += -Math.PI / 2;
    monitorPC_MinLOD.position.y += -HEIGHT * .75 + newAltitude;
    monitorPC_MinLOD.scale.set(WIDTH / deltaZ, HEIGHT / deltaY, DEPTH / deltaX);

    /*** add all Level of Detail ***/

    const lod = new Three.LOD();

    lod.addLevel(monitorPC_MaxLOD, 300);
    lod.addLevel(monitorPC_MinLOD, 700);
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
