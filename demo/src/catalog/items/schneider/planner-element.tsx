import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

//color
const grey = new Three.MeshLambertMaterial({ color: 0xd3d3d3 });
const white = new Three.MeshLambertMaterial({ color: 0xf5f5f5 });
const darkGrey = new Three.MeshLambertMaterial({ color: 0x3d3d3d });
const black = new Three.MeshLambertMaterial({ color: 0x000000 });
const boxMaterials = [grey, darkGrey, grey, grey, grey, grey];
const boxMaterials2 = [grey, grey, grey, grey, grey, darkGrey];
const boxMaterials3 = [grey, grey, grey, grey, darkGrey, grey];

const textureLoader = new Three.TextureLoader();
const lcdTexture = textureLoader.load(require('./monitor.png'));

//dimensions
const width = 258;
const depth = 87;
const height = 195;
const filterWidth = 48;
const filterDepth = 10;
const filterHeight = 52;
const gridThickness = 3;

function makeObjectMaxLOD() {
  const schneider = new Three.Mesh();

  const gridVerticalElemGeometry = new Three.BoxGeometry(gridThickness / 2, filterHeight, filterDepth);
  const gridHorizontalElemGeometry = new Three.BoxGeometry(filterWidth, gridThickness, filterDepth);

  const filter = new Three.Object3D();

  for (let i = 0.25; i < 48; i += 3.32) {
    const gridVerticalElem = new Three.Mesh(gridVerticalElemGeometry, white);
    gridVerticalElem.position.x = i;
    gridVerticalElem.position.y = 26;
    filter.add(gridVerticalElem);
  }

  for (let i = 0; i < 52; i += 7.4) {
    const gridHorizontalElem = new Three.Mesh(gridHorizontalElemGeometry, white);
    gridHorizontalElem.position.x = 23.5;
    gridHorizontalElem.position.y = i;
    filter.add(gridHorizontalElem);
  }

  for (let k = 0; k <= 54; k += 46) {
    for (let j = 10; j < 240; j += 48) {
      const filterClone = filter.clone();
      filterClone.position.x += j;
      filterClone.position.y += k;
      filterClone.rotation.x -= Math.PI / 6;
      if (k === 0)
        filterClone.position.z += 18;
      else
        filterClone.position.z -= 10;
      schneider.add(filterClone);
    }
  }

  const panelSideElemGeometry = new Three.BoxGeometry(5, height, depth);
  const panelSideElemLeft = new Three.Mesh(panelSideElemGeometry, boxMaterials);
  panelSideElemLeft.rotation.y += Math.PI;
  schneider.add(panelSideElemLeft);

  const panelSideElemRight = new Three.Mesh(panelSideElemGeometry, boxMaterials);
  panelSideElemRight.position.x += 258;
  schneider.add(panelSideElemRight);

  const panelSideBackElemGeometry = new Three.BoxGeometry(width, height, 5);
  const panelSideElemBack = new Three.Mesh(panelSideBackElemGeometry, boxMaterials3);
  panelSideElemBack.position.x += 129;
  panelSideElemBack.position.z -= 43.5;
  schneider.add(panelSideElemBack);

  const boxElemGeometry = new Three.BoxGeometry(width / 3, height / 3, depth / 8);
  const boxElem = new Three.Mesh(boxElemGeometry, grey);
  boxElem.position.x += 212;
  boxElem.position.y += 65;
  boxElem.position.z += 35;
  schneider.add(boxElem);

  const panelSideFrontElemGeometry = new Three.BoxGeometry(width / 3, height, 5);
  const panelSideElemFront_P1 = new Three.Mesh(panelSideFrontElemGeometry, boxMaterials2);
  panelSideElemFront_P1.position.x += 43.5;
  panelSideElemFront_P1.position.z += 43.5;
  schneider.add(panelSideElemFront_P1);

  const panelSideElemFront_P2 = new Three.Mesh(panelSideFrontElemGeometry, boxMaterials2);
  panelSideElemFront_P2.position.x += 130;
  panelSideElemFront_P2.position.z += 43.5;
  schneider.add(panelSideElemFront_P2);

  const panelSideElemFront_P3 = new Three.Mesh(panelSideFrontElemGeometry, boxMaterials2);
  panelSideElemFront_P3.position.x += 217;
  panelSideElemFront_P3.position.z += 43.5;
  schneider.add(panelSideElemFront_P3);

  const planeGeometryFront = new Three.PlaneGeometry(width / 16, height / 12);
  const planeMaterialFront = new Three.MeshLambertMaterial({ map: lcdTexture, transparent: true });

  const planeGeometryFront1 = new Three.PlaneGeometry(width / 8, height / 3);
  const panelBase = new Three.Mesh(planeGeometryFront1, darkGrey);
  panelBase.position.set(217, 65, 46.5);
  schneider.add(panelBase);

  const lcd = new Three.Mesh(planeGeometryFront, planeMaterialFront);
  lcd.position.set(217, 60, 46.55);
  schneider.add(lcd);

  const panelSideMiddleElemGeometry = new Three.BoxGeometry(width, 5, depth);
  const panelSideElemMiddle = new Three.Mesh(panelSideMiddleElemGeometry, grey);
  panelSideElemMiddle.position.x += 129;
  panelSideElemMiddle.position.y -= 10;
  schneider.add(panelSideElemMiddle);

  const panelSideElemFooter = new Three.Mesh(panelSideMiddleElemGeometry, black);
  panelSideElemFooter.position.x += 129;
  panelSideElemFooter.position.y -= 97.5;
  schneider.add(panelSideElemFooter);

  return schneider
}

function makeObjectMinLOD() {
  const schneider = new Three.Mesh();

  const gridVerticalElemGeometry = new Three.BoxGeometry(gridThickness / 2, filterHeight, filterDepth);
  const gridHorizontalElemGeometry = new Three.BoxGeometry(filterWidth, gridThickness, filterDepth);

  const filter = new Three.Object3D();

  for (let i = 0.25; i < 48; i += 3.32) {
    const gridVerticalElem = new Three.Mesh(gridVerticalElemGeometry, white);
    gridVerticalElem.position.x = i;
    gridVerticalElem.position.y = 26;
    filter.add(gridVerticalElem);
  }

  for (let i = 0; i < 52; i += 7.4) {
    const gridHorizontalElem = new Three.Mesh(gridHorizontalElemGeometry, white);
    gridHorizontalElem.position.x = 23.5;
    gridHorizontalElem.position.y = i;
    filter.add(gridHorizontalElem);
  }

  for (let k = 0; k <= 54; k += 46) {
    for (let j = 10; j < 240; j += 48) {
      const filterClone = filter.clone();
      filterClone.position.x += j;
      filterClone.position.y += k;
      filterClone.rotation.x -= Math.PI / 6;
      if (k === 0)
        filterClone.position.z += 18;
      else
        filterClone.position.z -= 10;
      schneider.add(filterClone);
    }
  }

  const panelSideElemGeometry = new Three.BoxGeometry(5, height, depth);
  const panelSideElemLeft = new Three.Mesh(panelSideElemGeometry, boxMaterials);
  panelSideElemLeft.rotation.y += Math.PI;
  schneider.add(panelSideElemLeft);

  const panelSideElemRight = new Three.Mesh(panelSideElemGeometry, boxMaterials);
  panelSideElemRight.position.x += 258;
  schneider.add(panelSideElemRight);

  const panelSideBackElemGeometry = new Three.BoxGeometry(width, height, 5);
  const panelSideElemBack = new Three.Mesh(panelSideBackElemGeometry, boxMaterials3);
  panelSideElemBack.position.x += 129;
  panelSideElemBack.position.z -= 43.5;
  schneider.add(panelSideElemBack);

  const boxElemGeometry = new Three.BoxGeometry(width / 3, height / 3, depth / 8);
  const boxElem = new Three.Mesh(boxElemGeometry, grey);
  boxElem.position.x += 212;
  boxElem.position.y += 65;
  boxElem.position.z += 35;
  schneider.add(boxElem);

  const panelSideFrontElemGeometry = new Three.BoxGeometry(width / 3, height, 5);
  const panelSideElemFront_P1 = new Three.Mesh(panelSideFrontElemGeometry, boxMaterials2);
  panelSideElemFront_P1.position.x += 43.5;
  panelSideElemFront_P1.position.z += 43.5;
  schneider.add(panelSideElemFront_P1);

  const panelSideElemFront_P2 = new Three.Mesh(panelSideFrontElemGeometry, boxMaterials2);
  panelSideElemFront_P2.position.x += 130;
  panelSideElemFront_P2.position.z += 43.5;
  schneider.add(panelSideElemFront_P2);

  const panelSideElemFront_P3 = new Three.Mesh(panelSideFrontElemGeometry, boxMaterials2);
  panelSideElemFront_P3.position.x += 217;
  panelSideElemFront_P3.position.z += 43.5;
  schneider.add(panelSideElemFront_P3);

  const planeGeometryFront = new Three.PlaneGeometry(width / 16, height / 12);
  const planeMaterialFront = new Three.MeshLambertMaterial({ map: lcdTexture, transparent: true });

  const planeGeometryFront1 = new Three.PlaneGeometry(width / 8, height / 3);
  const panelBase = new Three.Mesh(planeGeometryFront1, darkGrey);
  panelBase.position.set(217, 65, 46.5);
  schneider.add(panelBase);

  const lcd = new Three.Mesh(planeGeometryFront, planeMaterialFront);
  lcd.position.set(217, 60, 46.55);
  schneider.add(lcd);

  const panelSideMiddleElemGeometry = new Three.BoxGeometry(width, 5, depth);
  const panelSideElemMiddle = new Three.Mesh(panelSideMiddleElemGeometry, grey);
  panelSideElemMiddle.position.x += 129;
  panelSideElemMiddle.position.y -= 10;
  schneider.add(panelSideElemMiddle);

  const panelSideElemFooter = new Three.Mesh(panelSideMiddleElemGeometry, black);
  panelSideElemFooter.position.x += 129;
  panelSideElemFooter.position.y -= 97.5;
  schneider.add(panelSideElemFooter);

  return schneider
}

export default defineCatalogElement({
  name: "schneider",
  prototype: "items",

  info: {
    tag: ['metal'],
    title: "schneider",
    description: "schneider",
    image: require('./schneider.png')
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
      <g transform={`translate(${-width / 2},${-depth / 2})`}>
        <rect key="1" x="0" y="0" width={width} height={depth}
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: fillValue }} />
        <text key="2" x="0" y="0"
          transform={`translate(${width / 2}, ${depth / 2}) scale(1,-1) rotate(${textRotation})`}
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

    const objectMaxLOD = makeObjectMaxLOD();
    rackMaxLOD.add(objectMaxLOD.clone());
    rackMaxLOD.rotation.y = Math.PI;
    rackMaxLOD.position.x += width / 2;
    rackMaxLOD.position.y += height / 1.8 + newAltitude;

    /**************** LOD min ***********************/

    const rackMinLOD = new Three.Object3D();
    const objectMinLOD = makeObjectMinLOD();
    rackMinLOD.add(objectMinLOD.clone());
    rackMinLOD.rotation.y = Math.PI;
    rackMinLOD.position.x += width / 2;
    rackMinLOD.position.y += height / 1.8 + newAltitude;

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
