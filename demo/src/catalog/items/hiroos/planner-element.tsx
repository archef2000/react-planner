import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const cubeMaterial = new Three.MeshLambertMaterial({ color: 0x65696c });
const textureLoader = new Three.TextureLoader();
const frontTexture1 = textureLoader.load(require('./hiroosTexture.jpg'));
const newWidth = 175;
const newDepth = 85;
const newHeight = 195;

function makeObjectMaxLOD(newWidth: number, newHeight: number, newDepth: number) {
  const rack = new Three.Mesh();

  //let backTexture;

  // if((Math.floor(Math.random()*10)+1) % 2 === 0) {
  //   backTexture  = backTexture1;
  const frontTexture = frontTexture1;
  // }
  // else {
  //   backTexture = backTexture2;
  //   frontTexture= frontTexture2;
  // }

  //base
  const cubeGeometryBase = new Three.BoxGeometry(newWidth, newHeight, newDepth);

  const p1 = new Three.Mesh(cubeGeometryBase, cubeMaterial);
  p1.position.set(0, 1, 0);
  rack.add(p1);

  const planeGeometryFront = new Three.PlaneGeometry(newWidth, newHeight);
  const planeMaterialFront = new Three.MeshLambertMaterial({ map: frontTexture });

  const front = new Three.Mesh(planeGeometryFront, planeMaterialFront);
  front.position.set(0, 1, newDepth / 1.95);
  rack.add(front);

  // let planeGeometryBack = new Three.PlaneGeometry(newWidth,newHeight);
  // let planeMaterialBack = new Three.MeshLambertMaterial({map:backTexture});
  //
  // let back = new Three.Mesh(planeGeometryBack,planeMaterialBack);
  // back.position.set(0,1,-newDepth/1.95);
  // back.rotation.y+=Math.PI;
  // rack.add(back);

  return rack
}

function makeObjectMinLOD(newWidth: number, newHeight: number, newDepth: number) {
  const rack = new Three.Mesh();

  //base
  const cubeGeometryBase = new Three.BoxGeometry(newWidth, newHeight, newDepth);

  const p1 = new Three.Mesh(cubeGeometryBase, cubeMaterial);
  p1.position.set(0, 1, 0);
  rack.add(p1);

  return rack
}

export default defineCatalogElement({
  name: "hiroos",
  prototype: "items",

  info: {
    tag: ['furnishings', 'metal'],
    title: "hiroos",
    description: "hiroos",
    image: require('./hiroos.png')
  },

  properties: {
    patternColor: {
      label: "pattern colori",
      type: "color",
      defaultValue: "#f5f4f4"
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
    const fillValue = element.selected ? "#99c3fb" : element.properties.patternColor;

    const angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }
    return (
      <g transform={`translate(${-newWidth / 2},${-newDepth / 2})`}>
        <rect key="1" x="0" y="0" width={newWidth} height={newDepth}
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: fillValue }} />
        <text key="2" x="0" y="0"
          transform={`translate(${newWidth / 2}, ${newDepth / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: "middle", fontSize: "11px" }}>
          {element.name}
        </text>
      </g>
    )
  },

  async render3D(element, layer, scene) {
    const newAltitude = element.properties.altitude.length;

    /**************** LOD max ***********************/

    const rackMaxLOD = new Three.Object3D();

    const objectMaxLOD = makeObjectMaxLOD(newWidth, newHeight, newDepth);
    rackMaxLOD.add(objectMaxLOD.clone());
    rackMaxLOD.rotation.y = Math.PI;
    rackMaxLOD.position.y += newHeight / 2 + newAltitude;

    /**************** LOD min ***********************/

    const rackMinLOD = new Three.Object3D();
    const objectMinLOD = makeObjectMinLOD(newWidth, newHeight, newDepth);
    rackMinLOD.add(objectMinLOD.clone());
    rackMinLOD.rotation.y = Math.PI;
    rackMinLOD.position.y += newHeight / 2 + newAltitude;

    /*** add all Level of Detail ***/

    const lod = new Three.LOD();

    lod.addLevel(rackMaxLOD, 100);
    lod.addLevel(rackMinLOD, 1800);
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
