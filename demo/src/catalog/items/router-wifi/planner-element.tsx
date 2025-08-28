import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const WIDTH = 20;
const DEPTH = 5;
const HEIGHT = 20;
const RADIUS = 10;

const grey = new Three.MeshLambertMaterial({ color: 0x6b6b6b });
const grey2 = new Three.MeshLambertMaterial({ color: 0x939393 });
const greenMaterial = new Three.MeshLambertMaterial({ color: 0x00FF00 });

const objectMaxLOD = makeObjectMaxLOD();
const objectMinLOD = makeObjectMinLOD();

function makeObjectMaxLOD() {
  const routerWifi = new Three.Mesh();

  const x = 0;
  const y = 0;
  const w = WIDTH;
  const h = HEIGHT;
  const r = RADIUS;

  const roundedRectShape = new Three.Shape();

  roundedRectShape.moveTo(x, y + r);
  roundedRectShape.lineTo(x, y + h - r);
  roundedRectShape.quadraticCurveTo(x, y + h, x + r, y + h);
  roundedRectShape.lineTo(x + w - r, y + h);
  roundedRectShape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
  roundedRectShape.lineTo(x + w, y + r);
  roundedRectShape.quadraticCurveTo(x + w, y, x + w - r, y);
  roundedRectShape.lineTo(x + r, y);
  roundedRectShape.quadraticCurveTo(x, y, x, y + r);


  const extrudeSettings = {
    steps: 2,
    depth: DEPTH / 2,
    bevelEnabled: true,
    bevelThickness: DEPTH,
    bevelSize: 2 * DEPTH,
    bevelSegments: 2
  };

  const geometry = new Three.ExtrudeGeometry(roundedRectShape, extrudeSettings);
  const mesh = new Three.Mesh(geometry, grey);

  mesh.position.set(-0.4, 1, 0.2);
  routerWifi.add(mesh);

  const extrudeSettings2 = {
    steps: 2,
    depth: DEPTH / 2,
    bevelEnabled: false,
    bevelThickness: DEPTH,
    bevelSize: 2 * DEPTH,
    bevelSegments: 2
  };

  const geometry2 = new Three.ExtrudeGeometry(roundedRectShape, extrudeSettings2);
  const mesh2 = new Three.Mesh(geometry2, grey2);

  mesh2.position.set(-0.4, 1, 5.5);
  routerWifi.add(mesh2);

  const cylinderGeometry = new Three.CylinderGeometry(RADIUS / 20, RADIUS / 20, DEPTH, 32, 32);
  const led = new Three.Mesh(cylinderGeometry, greenMaterial);
  led.rotation.x += Math.PI / 2;
  led.position.set(WIDTH / 2, WIDTH / 2, 1.2 * DEPTH);
  routerWifi.add(led);

  const led2 = new Three.Mesh(cylinderGeometry, greenMaterial);
  led2.rotation.x += Math.PI / 2;
  led2.position.set(WIDTH / 2 + 5, WIDTH / 2, 1.2 * DEPTH);
  routerWifi.add(led2);

  const led3 = new Three.Mesh(cylinderGeometry, greenMaterial);
  led3.rotation.x += Math.PI / 2;
  led3.position.set(WIDTH / 2 - 5, WIDTH / 2, 1.2 * DEPTH);
  routerWifi.add(led3);

  return routerWifi;
}

function makeObjectMinLOD() {
  const routerWifi = new Three.Mesh();

  const x = 0;
  const y = 0;
  const w = WIDTH;
  const h = HEIGHT;
  const r = RADIUS;

  const roundedRectShape = new Three.Shape();

  roundedRectShape.moveTo(x, y + r);
  roundedRectShape.lineTo(x, y + h - r);
  roundedRectShape.quadraticCurveTo(x, y + h, x + r, y + h);
  roundedRectShape.lineTo(x + w - r, y + h);
  roundedRectShape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
  roundedRectShape.lineTo(x + w, y + r);
  roundedRectShape.quadraticCurveTo(x + w, y, x + w - r, y);
  roundedRectShape.lineTo(x + r, y);
  roundedRectShape.quadraticCurveTo(x, y, x, y + r);

  const extrudeSettings = {
    steps: 2,
    depth: DEPTH / 2,
    bevelEnabled: true,
    bevelThickness: DEPTH,
    bevelSize: 2 * DEPTH,
    bevelSegments: 2
  };

  const geometry = new Three.ExtrudeGeometry(roundedRectShape, extrudeSettings);
  const mesh = new Three.Mesh(geometry, grey);

  mesh.position.set(-0.4, 1, 0.2);
  routerWifi.add(mesh);

  return routerWifi;
}

export default defineCatalogElement({
  name: "router_wifi",
  prototype: "items",

  info: {
    tag: ['telecomunication'],
    title: "router Wifi",
    description: "router Wifi",
    image: require('./routerWifi.png')
  },
  properties: {
    altitude: {
      label: "altitude",
      type: "length-measure",
      defaultValue: {
        length: 0
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
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: "#bb00ff" }} />
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

    const routerWifiMaxLOD = new Three.Object3D();
    routerWifiMaxLOD.add(objectMaxLOD.clone());

    const aa = new Three.Box3().setFromObject(routerWifiMaxLOD);

    const deltaX = Math.abs(aa.max.x - aa.min.x);
    const deltaY = Math.abs(aa.max.y - aa.min.y);
    const deltaZ = Math.abs(aa.max.z - aa.min.z);

    routerWifiMaxLOD.position.y += HEIGHT / 2 + newAltitude;
    routerWifiMaxLOD.scale.set(WIDTH / deltaX, HEIGHT / deltaY, DEPTH / deltaZ);

    /**************** LOD min ***********************/

    const routerWifiMinLOD = new Three.Object3D();
    routerWifiMinLOD.add(objectMinLOD.clone());

    routerWifiMinLOD.position.y += HEIGHT / 2 + newAltitude;
    routerWifiMinLOD.scale.set(WIDTH / deltaX, HEIGHT / deltaY, DEPTH / deltaZ);

    /*** add all Level of Detail ***/

    const lod = new Three.LOD();

    lod.addLevel(routerWifiMaxLOD, 200);
    lod.addLevel(routerWifiMinLOD, 900);
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
