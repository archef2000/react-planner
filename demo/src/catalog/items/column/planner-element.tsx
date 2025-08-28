import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const textureLoader = new Three.TextureLoader();
const mat = textureLoader.load(require('./copper.jpg'));
const frameMaterial = new Three.MeshLambertMaterial({ map: mat });

function makeObjectMaxLOD(RADIUS: number, HEIGHT: number) {
  const RADIUS_10 = RADIUS / 10;
  const RADIUS_2_5 = RADIUS / 2.5;

  const column = new Three.Mesh();
  const object = new Three.Mesh(new Three.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32), frameMaterial);

  const frame1 = new Three.Mesh(new Three.CylinderGeometry(RADIUS_10, RADIUS_10, HEIGHT + HEIGHT / 10, 32), frameMaterial);
  const frame2 = new Three.Mesh(new Three.CylinderGeometry(RADIUS_10, RADIUS_10, HEIGHT + HEIGHT / 10, 32), frameMaterial);
  const frame3 = new Three.Mesh(new Three.CylinderGeometry(RADIUS_10, RADIUS_10, HEIGHT + HEIGHT / 10, 32), frameMaterial);
  const frame4 = new Three.Mesh(new Three.CylinderGeometry(RADIUS_10, RADIUS_10, HEIGHT + HEIGHT / 10, 32), frameMaterial);

  frame1.position.x += RADIUS_2_5;
  frame1.position.z += RADIUS_2_5;
  frame2.position.x -= RADIUS_2_5;
  frame2.position.z -= RADIUS_2_5;
  frame3.position.x -= RADIUS_2_5;
  frame3.position.z += RADIUS_2_5;
  frame4.position.x += RADIUS_2_5;
  frame4.position.z -= RADIUS_2_5;
  column.add(frame1);
  column.add(frame2);
  column.add(frame3);
  column.add(frame4);
  column.add(object);

  return column
}

function makeObjectMinLOD(RADIUS: number, HEIGHT: number) {
  const RADIUS_10 = RADIUS / 10;
  const RADIUS_2_5 = RADIUS / 2.5;

  const column = new Three.Mesh();
  const object = new Three.Mesh(new Three.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 6, 6), frameMaterial);

  const frame1 = new Three.Mesh(new Three.CylinderGeometry(RADIUS_10, RADIUS_10, HEIGHT + HEIGHT / 10, 6), frameMaterial);
  const frame2 = new Three.Mesh(new Three.CylinderGeometry(RADIUS_10, RADIUS_10, HEIGHT + HEIGHT / 10, 6), frameMaterial);
  const frame3 = new Three.Mesh(new Three.CylinderGeometry(RADIUS_10, RADIUS_10, HEIGHT + HEIGHT / 10, 6), frameMaterial);
  const frame4 = new Three.Mesh(new Three.CylinderGeometry(RADIUS_10, RADIUS_10, HEIGHT + HEIGHT / 10, 6), frameMaterial);

  frame1.position.x += RADIUS_2_5;
  frame1.position.z += RADIUS_2_5;
  frame2.position.x -= RADIUS_2_5;
  frame2.position.z -= RADIUS_2_5;
  frame3.position.x -= RADIUS_2_5;
  frame3.position.z += RADIUS_2_5;
  frame4.position.x += RADIUS_2_5;
  frame4.position.z -= RADIUS_2_5;
  column.add(frame1);
  column.add(frame2);
  column.add(frame3);
  column.add(frame4);
  column.add(object);

  return column
}

export default defineCatalogElement({
  name: 'round column',
  prototype: 'items',

  info: {
    tag: ['structure'],
    title: 'round column',
    description: 'round column',
    image: require('./column.png')
  },

  properties: {
    altitude: {
      label: 'altitude',
      type: 'length-measure',
      defaultValue: {
        length: 0
      }
    },
    height: {
      label: 'height',
      type: 'length-measure',
      defaultValue: {
        length: 300
      }
    },
    radius: {
      label: 'radius',
      type: 'length-measure',
      defaultValue: {
        length: 20
      }
    }
  },

  render2D: function (element, layer, scene) {
    const RADIUS: number = element.properties.radius.length;
    const angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }

    const circleStyle = { stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: '#84e1ce' };

    return (
      <g>
        <circle key='1' cx='0' cy='0' r={RADIUS} style={circleStyle} />
        <text key='2' cx='0' cy='0'
          transform={`scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: 'middle', fontSize: '11px' }}>
          {element.type}
        </text>
      </g>
    )
  },

  async render3D(element, layer, scene) {
    const HEIGHT: number = element.properties.height.length;
    const RADIUS: number = element.properties.radius.length;
    const newAltitude: number = element.properties.altitude.length;

    /**************** LOD max ***********************/

    const columnMaxLOD = new Three.Object3D();
    const objectMaxLOD = makeObjectMaxLOD(RADIUS, HEIGHT);
    columnMaxLOD.add(objectMaxLOD.clone());
    columnMaxLOD.position.y += HEIGHT / 2 + newAltitude;

    /**************** LOD min ***********************/

    const columnMinLOD = new Three.Object3D();
    const objectMinLOD = makeObjectMinLOD(RADIUS, HEIGHT);
    columnMinLOD.add(objectMinLOD.clone());
    columnMinLOD.position.y += HEIGHT / 2 + newAltitude;

    /*** add all Level of Detail ***/

    const lod = new Three.LOD();

    lod.addLevel(columnMaxLOD, 1300);
    lod.addLevel(columnMinLOD, 2000);
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
