import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const DEPTH = 10;

const grey = new Three.MeshLambertMaterial({ color: 0xeae6ca });

function makeObjectMaxLOD(newWidth: number, newHeight: number, newDepth: number) {
  const ModernRadiator = new Three.Mesh();

  const roundedRectShape = new Three.Shape();

  const x = 0;
  const y = 0;
  const width = 9.5;
  const height = newHeight - 25;
  const radius = 2.5;

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
    steps: 1,
    depth: 2.5,
    bevelEnabled: false,
    bevelThickness: .4,
    bevelSize: .4,
    bevelSegments: 1
  };

  for (let i = 5; i <= newWidth - 7.5; i += 10) {
    const geometry = new Three.ExtrudeGeometry(roundedRectShape, extrudeSettings);
    const mesh = new Three.Mesh(geometry, grey);
    mesh.position.set(i, 0, 2.5);
    ModernRadiator.add(mesh);

    const mesh2 = new Three.Mesh(geometry, grey);
    mesh2.position.set(i, 5, 0);
    mesh2.scale.set(1, 1, 1);
    ModernRadiator.add(mesh2);

    const mesh3 = new Three.Mesh(geometry, grey);
    mesh3.position.set(i, 5, -2.5);
    mesh3.scale.set(1, 1.05, 1);
    ModernRadiator.add(mesh3);

    const mesh4 = new Three.Mesh(geometry, grey);
    mesh4.position.set(i, 6, -4);
    mesh4.scale.set(1, 1.2, 1);
    ModernRadiator.add(mesh4);

    const mesh5 = new Three.Mesh(geometry, grey);
    mesh5.position.set(i + 6, newHeight - 25, -2.5);
    mesh5.rotation.y -= Math.PI / 2;
    mesh5.scale.set(.8, .18, .8);
    ModernRadiator.add(mesh5);

    const mesh6 = new Three.Mesh(geometry, grey);
    mesh6.position.set(i, newHeight - 5, 5.5);
    mesh6.rotation.x -= Math.PI / 2;
    mesh6.scale.set(1, .13, .8);
    ModernRadiator.add(mesh6);

    const mesh7 = new Three.Mesh(geometry, grey);
    mesh7.position.set(i, newHeight - 17.5, -2);
    mesh7.rotation.x += Math.PI / 4;
    mesh7.scale.set(1, .14, .4);
    ModernRadiator.add(mesh7);

    const mesh8 = new Three.Mesh(geometry, grey);
    mesh8.position.set(i, newHeight - 11, 5);
    mesh8.scale.set(1, .1, .4);
    ModernRadiator.add(mesh8);
  }

  for (let i = 5; i <= newHeight; i += newHeight - 12.5) {
    const geometry1 = new Three.CylinderGeometry(newDepth / 6, newDepth / 6, newWidth, 32);
    const tube = new Three.Mesh(geometry1, grey);
    tube.rotation.x += Math.PI / 2;
    tube.rotation.z += Math.PI / 2;
    tube.position.set(newWidth / 2, i, newDepth / 6);
    ModernRadiator.add(tube);

    const geometry2 = new Three.CylinderGeometry(newDepth / 4, newDepth / 4, newWidth - 2.5, 6);
    const tube2 = new Three.Mesh(geometry2, grey);
    tube2.rotation.x += Math.PI / 2;
    tube2.rotation.z += Math.PI / 2;
    tube2.position.set(newWidth / 2, i, newDepth / 6);
    ModernRadiator.add(tube2);

    const geometry3 = new Three.CylinderGeometry(newDepth / 3.5, newDepth / 3.5, newWidth - 5, 32);
    const tube3 = new Three.Mesh(geometry3, grey);
    tube3.rotation.x += Math.PI / 2;
    tube3.rotation.z += Math.PI / 2;
    tube3.position.set(newWidth / 2, i, newDepth / 6);
    ModernRadiator.add(tube3);
  }
  return ModernRadiator
}

function makeObjectMinLOD(newWidth: number, newHeight: number, newDepth: number) {
  const ModernRadiator = new Three.Mesh();

  const roundedRectShape = new Three.Shape();

  const x = 0;
  const y = 0;
  const width = 9.5;
  const height = newHeight - 25;
  const radius = 0.25;

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
    steps: 1,
    depth: 2.5,
    bevelEnabled: false,
    bevelThickness: .4,
    bevelSize: .4,
    bevelSegments: 1
  };

  for (let i = 5; i <= newWidth - 7.5; i += 10) {
    const geometry = new Three.ExtrudeGeometry(roundedRectShape, extrudeSettings);
    const mesh = new Three.Mesh(geometry, grey);
    mesh.position.set(i, 0, 2.5);
    ModernRadiator.add(mesh);

    const mesh3 = new Three.Mesh(geometry, grey);
    mesh3.position.set(i, 5, -2.5);
    mesh3.scale.set(1, 1.05, 1);
    ModernRadiator.add(mesh3);

    const mesh4 = new Three.Mesh(geometry, grey);
    mesh4.position.set(i, 6, -4);
    mesh4.scale.set(1, 1.2, 1);
    ModernRadiator.add(mesh4);

    const mesh6 = new Three.Mesh(geometry, grey);
    mesh6.position.set(i, newHeight - 5, 5.5);
    mesh6.rotation.x -= Math.PI / 2;
    mesh6.scale.set(1, .13, .8);
    ModernRadiator.add(mesh6);

    const mesh7 = new Three.Mesh(geometry, grey);
    mesh7.position.set(i, newHeight - 17.5, -2);
    mesh7.rotation.x += Math.PI / 4;
    mesh7.scale.set(1, .14, .4);
    ModernRadiator.add(mesh7);

    const mesh8 = new Three.Mesh(geometry, grey);
    mesh8.position.set(i, newHeight - 11, 5);
    mesh8.scale.set(1, .1, .4);
    ModernRadiator.add(mesh8);
  }


  for (let i = newDepth / 6; i <= newHeight; i += newHeight - 10) {
    const geometry1 = new Three.CylinderGeometry(newDepth / 6, newDepth / 6, newWidth, 8);
    const tube = new Three.Mesh(geometry1, grey);
    tube.rotation.x += Math.PI / 2;
    tube.rotation.z += Math.PI / 2;
    tube.position.set(newWidth / 2, i, newDepth / 6);
    ModernRadiator.add(tube);
  }
  return ModernRadiator
}

export default defineCatalogElement({
  name: "termosifone_alluminio",
  prototype: "items",

  info: {
    tag: ['furnishings', 'metal'],
    title: "aluminum radiator",
    description: "aluminum radiator",
    image: require('./ModernStyleRadiator.png')
  },

  properties: {
    width: {
      label: "width",
      type: "length-measure",
      defaultValue: {
        length: 100
      }
    },
    height: {
      label: "height",
      type: "length-measure",
      defaultValue: {
        length: 100
      }
    },
    altitude: {
      label: "altitude",
      type: "length-measure",
      defaultValue: {
        length: 20
      }
    }
  },

  render2D: function (element, layer, scene) {
    const WIDTH = element.properties.width.length;
    const angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }

    const rect_style = { stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: "#84e1ce" };

    return (
      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`}>
        <rect key="1" x="0" y="0" width={WIDTH} height={DEPTH} style={rect_style} />
        <text key="2" x="0" y="0" transform={`translate(${WIDTH / 2}, ${DEPTH / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: "middle", fontSize: "11px" }}>
          {element.type}
        </text>
      </g>
    )
  },

  async render3D(element, layer, scene) {
    const newWidth = element.properties.width.length;
    const newDepth = DEPTH;
    const newHeight = element.properties.height.length;
    const newAltitude = element.properties.altitude.length;

    /************ lod max **************/

    const ModernRadiatorMaxLOD = new Three.Object3D();
    ModernRadiatorMaxLOD.add(makeObjectMaxLOD(newWidth, newHeight, newDepth).clone());

    const value = new Three.Box3().setFromObject(ModernRadiatorMaxLOD);

    const deltaX = Math.abs(value.max.x - value.min.x);
    const deltaY = Math.abs(value.max.y - value.min.y);
    const deltaZ = Math.abs(value.max.z - value.min.z);

    ModernRadiatorMaxLOD.position.x -= newWidth / 2;
    ModernRadiatorMaxLOD.position.y += 5 + newAltitude;
    ModernRadiatorMaxLOD.scale.set(newWidth / deltaX, newHeight / deltaY, newDepth / deltaZ);

    // let bigger = new Three.Object3D();
    //
    // bigger.add(ModernRadiator);
    //
    // let pivot = new Three.Mesh(new Three.SphereGeometry(10), new Three.MeshBasicMaterial({color:0xff0000}));
    // bigger.add(pivot);

    /************ lod min **************/

    const ModernRadiatorMinLOD = new Three.Object3D();
    ModernRadiatorMinLOD.add(makeObjectMinLOD(newWidth, newHeight, newDepth).clone());
    ModernRadiatorMinLOD.position.x -= newWidth / 2;
    ModernRadiatorMinLOD.position.y += 5 + newAltitude;
    ModernRadiatorMinLOD.scale.set(newWidth / deltaX, newHeight / deltaY, newDepth / deltaZ);

    /**** all level of detail ***/

    const lod = new Three.LOD();

    lod.addLevel(ModernRadiatorMaxLOD, 200);
    lod.addLevel(ModernRadiatorMinLOD, 900);
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
