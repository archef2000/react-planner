import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const RADIUS = 3;

const PlaneMaterial = new Three.MeshLambertMaterial({ color: 0x9b8c75 });
const material_legs = new Three.MeshLambertMaterial({ color: 0xd9d7d7 });

function makeObjectMaxLOD(newWidth: number, newHeight: number, newDepth: number) {
  const table = new Three.Mesh();

  const PlaneGeometry = new Three.BoxGeometry(newWidth, newHeight / 20, newDepth);
  const plane = new Three.Mesh(PlaneGeometry, PlaneMaterial);
  plane.position.y = newHeight;
  table.add(plane);

  const geometry_legs = new Three.CylinderGeometry(RADIUS, RADIUS, newHeight, 32, 32);

  const leg1 = new Three.Mesh(geometry_legs, material_legs);
  leg1.position.x = newWidth / 2;
  leg1.position.z = newDepth / 2;
  leg1.position.y = newHeight / 2;
  table.add(leg1);

  const leg2 = new Three.Mesh(geometry_legs, material_legs);
  leg2.position.x = newWidth / 2;
  leg2.position.z = -newDepth / 2;
  leg2.position.y = newHeight / 2;
  table.add(leg2);

  const leg3 = new Three.Mesh(geometry_legs, material_legs);
  leg3.position.x = -newWidth / 2;
  leg3.position.z = newDepth / 2;
  leg3.position.y = newHeight / 2;
  table.add(leg3);

  const leg4 = new Three.Mesh(geometry_legs, material_legs);
  leg4.position.x = -newWidth / 2;
  leg4.position.z = -newDepth / 2;
  leg4.position.y = newHeight / 2;
  table.add(leg4);

  return table;
}

function makeObjectMinLOD(newWidth: number, newHeight: number, newDepth: number) {
  const table = new Three.Mesh();

  const PlaneGeometry = new Three.BoxGeometry(newWidth, newHeight / 20, newDepth);
  const plane = new Three.Mesh(PlaneGeometry, PlaneMaterial);
  plane.position.y = newHeight;
  table.add(plane);

  const geometry_legs = new Three.CylinderGeometry(RADIUS, RADIUS, newHeight, 8, 8);

  const leg1 = new Three.Mesh(geometry_legs, material_legs);
  leg1.position.x = newWidth / 2;
  leg1.position.z = newDepth / 2;
  leg1.position.y = newHeight / 2;
  table.add(leg1);

  const leg2 = new Three.Mesh(geometry_legs, material_legs);
  leg2.position.x = newWidth / 2;
  leg2.position.z = -newDepth / 2;
  leg2.position.y = newHeight / 2;
  table.add(leg2);

  const leg3 = new Three.Mesh(geometry_legs, material_legs);
  leg3.position.x = -newWidth / 2;
  leg3.position.z = newDepth / 2;
  leg3.position.y = newHeight / 2;
  table.add(leg3);

  const leg4 = new Three.Mesh(geometry_legs, material_legs);
  leg4.position.x = -newWidth / 2;
  leg4.position.z = -newDepth / 2;
  leg4.position.y = newHeight / 2;
  table.add(leg4);

  return table;
}

export default defineCatalogElement({
  name: "table",
  prototype: "items",

  info: {
    tag: ['furnishings', 'wood'],
    title: "table",
    description: "table",
    image: require('./table.png')
  },

  properties: {
    width: {
      label: "width",
      type: "length-measure",
      defaultValue: {
        length: 90
      }
    },
    depth: {
      label: "depth",
      type: "length-measure",
      defaultValue: {
        length: 50
      }
    },
    height: {
      label: "height",
      type: "length-measure",
      defaultValue: {
        length: 80
      }
    },
    altitude: {
      label: "altitude",
      type: "length-measure",
      defaultValue: {
        length: 0
      }
    }
  },

  render2D: function (element, layer, scene) {

    const newWidth = element.properties.width.length;
    const newDepth = element.properties.depth.length;
    const angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }

    return (
      <g transform={`translate(${-newWidth / 2},${-newDepth / 2})`}>
        <rect key="1" x="0" y="0" width={newWidth} height={newDepth}
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: "#84e1ce" }} />
        <text key="2" x="0" y="0"
          transform={`translate(${newWidth / 2}, ${newDepth / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: "middle", fontSize: "11px" }}>
          {element.type}
        </text>
      </g>
    )
  },

  async render3D(element, layer, scene) {
    const newWidth: number = element.properties.width.length;
    const newDepth: number = element.properties.depth.length;
    const newHeight: number = element.properties.height.length;
    const newAltitude: number = element.properties.altitude.length;

    /********** lod max ************/

    const tableMaxLOD = new Three.Object3D();
    const objectMaxLod = makeObjectMaxLOD(newWidth, newHeight, newDepth);
    tableMaxLOD.add(objectMaxLod.clone());
    tableMaxLOD.position.y += newHeight / 20 + newAltitude;

    /********** lod min ************/

    const tableMinLOD = new Three.Object3D();
    const objectMinLod = makeObjectMinLOD(newWidth, newHeight, newDepth);
    tableMinLOD.add(objectMinLod.clone());
    tableMinLOD.position.y += newHeight / 20 + newAltitude;


    /**** all level of detail ***/

    const lod = new Three.LOD();

    lod.addLevel(tableMaxLOD, 200);
    lod.addLevel(tableMinLOD, 900);
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
