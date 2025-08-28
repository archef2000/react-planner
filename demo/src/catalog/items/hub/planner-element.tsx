import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const textureLoader = new Three.TextureLoader();
const front = textureLoader.load(require('./front.png'));
const blackMaterial = new Three.MeshLambertMaterial({ color: 0x3d3d3d });

function makeObjectMaxLOD(newWidth: number, newHeight: number, newDepth: number) {
  const hub = new Three.Mesh();

  const cubeGeometryBase = new Three.BoxGeometry(newWidth, newHeight, newDepth);
  const body = new Three.Mesh(cubeGeometryBase, blackMaterial);
  body.position.set(0, 1, 0);
  hub.add(body);

  for (let i = -newHeight / 2 + newHeight / 32; i < newHeight / 2; i += newHeight / 16) {
    const planeGeometry = new Three.PlaneGeometry(newWidth, newHeight / 16);
    const planeMaterial = new Three.MeshLambertMaterial({ map: front });
    const plane_texture = new Three.Mesh(planeGeometry, planeMaterial);
    plane_texture.position.set(0, i, newDepth / 3 + newDepth / 5.9);
    body.add(plane_texture);
  }
  return hub
}

function makeObjectMinLOD(newWidth: number, newHeight: number, newDepth: number) {
  const hub = new Three.Mesh();

  const cubeGeometryBase = new Three.BoxGeometry(newWidth, newHeight, newDepth);
  const body = new Three.Mesh(cubeGeometryBase, blackMaterial);
  body.position.set(0, 1, 0);
  hub.add(body);

  return hub
}

export default defineCatalogElement({
  name: "hub",
  prototype: "items",

  info: {
    tag: ['furnishings', 'metal'],
    title: "hub",
    description: "hub",
    image: require('./hub.png')
  },

  properties: {
    width: {
      label: "width",
      type: "length-measure",
      defaultValue: {
        length: 60
      }
    },
    depth: {
      label: "depth",
      type: "length-measure",
      defaultValue: {
        length: 30
      }
    },
    height: {
      label: "height",
      type: "length-measure",
      defaultValue: {
        length: 200
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
    const newWidth = element.properties.width.length;
    const newDepth = element.properties.depth.length;
    const newHeight = element.properties.height.length;
    const newAltitude = element.properties.altitude.length;

    /*************** lod max ******************/

    const hubMaxLOD = new Three.Object3D();
    hubMaxLOD.add(makeObjectMaxLOD(newWidth, newHeight, newDepth).clone());

    const valuePosition = new Three.Box3().setFromObject(hubMaxLOD);

    const deltaX = Math.abs(valuePosition.max.x - valuePosition.min.x);
    const deltaY = Math.abs(valuePosition.max.y - valuePosition.min.y);
    const deltaZ = Math.abs(valuePosition.max.z - valuePosition.min.z);

    hubMaxLOD.position.y += newHeight / 2 + newAltitude;
    hubMaxLOD.scale.set(newWidth / deltaX, newHeight / deltaY, newDepth / deltaZ);

    /*************** lod min ******************/

    const hubMinLOD = new Three.Object3D();
    hubMinLOD.add(makeObjectMinLOD(newWidth, newHeight, newDepth).clone());
    hubMinLOD.position.y += newHeight / 2 + newAltitude;
    hubMinLOD.scale.set(newWidth / deltaX, newHeight / deltaY, newDepth / deltaZ);

    /**** all level of detail ***/

    const lod = new Three.LOD();

    lod.addLevel(hubMaxLOD, 200);
    lod.addLevel(hubMinLOD, 2000);
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
