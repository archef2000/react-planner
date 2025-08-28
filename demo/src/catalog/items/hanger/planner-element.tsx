import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const WIDTH = 50;
const DEPTH = 50;
const HEIGHT = 180;

const blackMaterial = new Three.MeshLambertMaterial({ color: 0x4B4B4B });
const greyMaterial = new Three.MeshLambertMaterial({ color: 0xC0C0C0 });
const blueMaterial = new Three.MeshLambertMaterial({ color: 0x3399FF, transparent: true, opacity: 0.8 });

const objectMaxLOD = makeObjectMaxLOD();
const objectMinLOD = makeObjectMinLOD();

function makeObjectMaxLOD() {
  const hanger = new Three.Mesh();

  //base
  const base_geom = new Three.CylinderGeometry(0.09, 0.25, 0.08, 20, 2, true);
  blackMaterial.side = Three.DoubleSide;
  const base = new Three.Mesh(base_geom, blackMaterial);
  base.position.set(0, 0.04, 0);

  const base2_geom = new Three.CylinderGeometry(0.09, 0.01, 0.03, 20, 2, true);
  const base2 = new Three.Mesh(base2_geom, blackMaterial);
  base2.position.set(0, 0.015 + 0.05, 0);

  //central body
  const body_geom = new Three.CylinderGeometry(0.03, 0.03, 2, 32, 32);
  const body = new Three.Mesh(body_geom, greyMaterial);
  body.position.set(0, 1, 0);

  //umbrella base
  const g_umbrella_base = new Three.TorusGeometry(0.045, 0.02, 32, 32);

  const umbrella_base = new Three.Mesh(g_umbrella_base, blueMaterial);
  umbrella_base.rotation.x = Math.PI / 2;
  umbrella_base.position.set(0, 0.7, 0);

  const g_umbrella = new Three.TorusGeometry(0.06, 0.015, 32, 32);
  const umbrella: Three.Mesh[] = [];

  for (let i = 0; i < 4; i++) {
    umbrella[i] = new Three.Mesh(g_umbrella, blueMaterial);
    umbrella[i].rotation.x = Math.PI / 2;
    umbrella[i].position.y = 0.7;
  }

  umbrella[0].position.x = 0.1;
  umbrella[1].position.z = 0.1;
  umbrella[2].position.x = -0.1;
  umbrella[3].position.z = -0.1;

  //hooks
  const g_hook_body = new Three.CylinderGeometry(0.015, 0.015, 0.17, 32, 32);

  const g_hook = new Three.CylinderGeometry(0.05, 0.05, 0.02, 32, 32);

  const hooks: Three.Object3D<Three.Object3DEventMap>[] = [];

  for (let i = 0; i < 8; i++) {
    hooks[i] = new Three.Object3D();
    hooks[i].rotation.x = Math.PI / 2;
    hooks[i].position.set(0, 1.7, 0);

    const hook_body = new Three.Mesh(g_hook_body, greyMaterial);
    hooks[i].add(hook_body);

    const hook = new Three.Mesh(g_hook, blueMaterial);
    hook_body.add(hook);
    hook.position.y = 0.085;

    hooks[i].rotation.z = 45 * i * Math.PI / 180;
    hook_body.position.y = 0.115;

    if ((i % 2) === 1)
      hooks[i].position.y += 0.2;
  }

  hanger.add(base);
  hanger.add(base2);
  hanger.add(body);
  hanger.add(umbrella_base);

  for (let i = 0; i < 4; i++) {
    hanger.add(umbrella[i]);
  }

  for (let i = 0; i < 8; i++) {
    hanger.add(hooks[i]);
  }
  return hanger;
}

function makeObjectMinLOD() {
  const hanger = new Three.Mesh();

  //base
  const base_geom = new Three.CylinderGeometry(0.09, 0.25, 0.08, 20, 2, true);
  blackMaterial.side = Three.DoubleSide;
  const base = new Three.Mesh(base_geom, blackMaterial);
  base.position.set(0, 0.04, 0);

  const base2_geom = new Three.CylinderGeometry(0.09, 0.01, 0.03, 20, 2, true);
  const base2 = new Three.Mesh(base2_geom, blackMaterial);
  base2.position.set(0, 0.015 + 0.05, 0);

  //central body
  const body_geom = new Three.CylinderGeometry(0.03, 0.03, 2, 8, 8);
  const body = new Three.Mesh(body_geom, greyMaterial);
  body.position.set(0, 1, 0);

  //umbrella support
  const g_umbrella_base = new Three.TorusGeometry(0.045, 0.02, 8, 8);
  const m_umbrella = new Three.MeshLambertMaterial({
    color: 0x3399FF,
    transparent: true,
    opacity: 0.8
  });
  const umbrella_base = new Three.Mesh(g_umbrella_base, m_umbrella);
  umbrella_base.rotation.x = Math.PI / 2;
  umbrella_base.position.set(0, 0.7, 0);

  const g_umbrella = new Three.TorusGeometry(0.06, 0.015, 8, 8);
  const umbrella: Three.Mesh[] = [];

  for (let i = 0; i < 4; i++) {
    umbrella[i] = new Three.Mesh(g_umbrella, m_umbrella);
    umbrella[i].rotation.x = Math.PI / 2;
    umbrella[i].position.y = 0.7;
  }

  umbrella[0].position.x = 0.1;
  umbrella[1].position.z = 0.1;
  umbrella[2].position.x = -0.1;
  umbrella[3].position.z = -0.1;

  //hooks
  const g_hook_body = new Three.CylinderGeometry(0.015, 0.015, 0.17, 8, 8);

  const g_hook = new Three.CylinderGeometry(0.05, 0.05, 0.02, 8, 8);

  const hooks: Three.Object3D<Three.Object3DEventMap>[] = [];

  for (let i = 0; i < 8; i++) {
    hooks[i] = new Three.Object3D();
    hooks[i].rotation.x = Math.PI / 2;
    hooks[i].position.set(0, 1.7, 0);

    const hook_body = new Three.Mesh(g_hook_body, greyMaterial);
    hooks[i].add(hook_body);

    const hook = new Three.Mesh(g_hook, m_umbrella);
    hook_body.add(hook);
    hook.position.y = 0.085;

    hooks[i].rotation.z = 45 * i * Math.PI / 180;
    hook_body.position.y = 0.115;

    if (i % 2 === 1)
      hooks[i].position.y += 0.2;
  }

  hanger.add(base);
  hanger.add(base2);
  hanger.add(body);
  hanger.add(umbrella_base);

  for (let i = 0; i < 4; i++) {
    hanger.add(umbrella[i]);
  }

  for (let i = 0; i < 8; i++) {
    hanger.add(hooks[i]);
  }

  return hanger;
}

export default defineCatalogElement({
  name: "hanger",
  prototype: "items",

  info: {
    tag: ['furnishings', 'metallo', 'plastic'],
    title: "hanger",
    description: "hanger",
    image: require('./hanger.png')
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
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: "#84e1ce" }} />
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

    /************* lod max ******************/
    const hangerMaxLOD = new Three.Object3D();
    hangerMaxLOD.add(objectMaxLOD.clone());

    const aa = new Three.Box3().setFromObject(hangerMaxLOD);

    const deltaX = Math.abs(aa.max.x - aa.min.x);
    const deltaY = Math.abs(aa.max.y - aa.min.y);
    const deltaZ = Math.abs(aa.max.z - aa.min.z);

    hangerMaxLOD.position.y += newAltitude;
    hangerMaxLOD.scale.set(WIDTH / deltaX, HEIGHT / deltaY, DEPTH / deltaZ);

    /************* lod min ******************/
    const hangerMinLOD = new Three.Object3D();
    hangerMinLOD.add(objectMinLOD.clone());
    hangerMinLOD.position.y += newAltitude;
    hangerMinLOD.scale.set(WIDTH / deltaX, HEIGHT / deltaY, DEPTH / deltaZ);

    /**** all level of detail ***/

    const lod = new Three.LOD();

    lod.addLevel(hangerMaxLOD, 200);
    lod.addLevel(hangerMinLOD, 900);
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
