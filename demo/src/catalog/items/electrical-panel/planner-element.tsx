import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const cubeMaterial = new Three.MeshLambertMaterial({ color: 0xf5f4f4 });

function makeObjectMaxLOD(newWidth: number, newHeight: number, newDepth: number) {
  const electricalPanel = new Three.Mesh();

  const textureLoader = new Three.TextureLoader();
  const mat = textureLoader.load(require('./texturePanel.png'));

  const cubeGeometryBase = new Three.BoxGeometry(newWidth, newHeight, newDepth);

  const p1 = new Three.Mesh(cubeGeometryBase, cubeMaterial);
  p1.position.set(0, 1, 0);
  electricalPanel.add(p1);

  const planeGeometryBase = new Three.PlaneGeometry(newWidth, newHeight);
  const planeMaterial = new Three.MeshLambertMaterial({ map: mat });

  const p2 = new Three.Mesh(planeGeometryBase, planeMaterial);
  p2.position.set(0, 1, 25.5);
  p1.add(p2);

  return electricalPanel
}

function makeObjectMinLOD(newWidth: number, newHeight: number, newDepth: number) {
  const electricalPanel = new Three.Mesh();

  const cubeGeometryBase = new Three.BoxGeometry(newWidth, newHeight, newDepth);
  const p1 = new Three.Mesh(cubeGeometryBase, cubeMaterial);
  p1.position.set(0, 1, 0);
  electricalPanel.add(p1);

  return electricalPanel
}

export default defineCatalogElement({
  name: "pannello_elettrico",
  prototype: "items",

  info: {
    tag: ['furnishings', 'metal'],
    title: "electric panel",
    description: "electric panel",
    image: require('./electricalPanel.png')
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
        length: 210
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
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: "#ff0000" }} />
        <text key="2" x="0" y="0"
          transform={`translate(${newWidth / 2}, ${newDepth / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: "middle", fontSize: "11px" }}>
          {element.name}
        </text>
      </g>
    )
  },

  async render3D(element, layer, scene) {
    const newWidth = element.properties.width.length;
    const newDepth = element.properties.depth.length;
    const newHeight = element.properties.height.length;
    const newAltitude = element.properties.altitude.length;


    /**************** LOD max ***********************/

    const elettricalPannel2 = new Three.Object3D();

    const objectMaxLOD = makeObjectMaxLOD(newWidth, newHeight, newDepth);
    elettricalPannel2.add(objectMaxLOD.clone());
    elettricalPannel2.rotation.y = Math.PI;
    elettricalPannel2.position.y += newHeight / 2 + newAltitude;

    /**************** LOD max ***********************/

    const elettricalPannel1 = new Three.Object3D();
    const objectMinLOD = makeObjectMinLOD(newWidth, newHeight, newDepth);
    elettricalPannel1.add(objectMinLOD.clone());
    elettricalPannel1.rotation.y = Math.PI;
    elettricalPannel1.position.y += newHeight / 2 + newAltitude;

    /*** add all Level of Detail ***/

    const lod = new Three.LOD();

    lod.addLevel(elettricalPannel2, 200);
    lod.addLevel(elettricalPannel1, 2000);
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
