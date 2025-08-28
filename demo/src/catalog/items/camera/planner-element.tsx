import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const WIDTH = 10;
const DEPTH = 20;
const HEIGHT = 20;

const grey = new Three.MeshLambertMaterial({ color: 0xaaaaaa });
const black = new Three.MeshLambertMaterial({ color: 0x000000 });
const white = new Three.MeshLambertMaterial({ color: 0xffffff });
const glassMaterial = new Three.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

const objectMaxLOD = makeObjectMaxLOD();
const objectMinLOD = makeObjectMinLOD();

function makeObjectMaxLOD() {
  const video_camera = new Three.Mesh();

  const cylinderGeometry = new Three.CylinderGeometry(0.2, 0.2, 0.5, 80);
  const body = new Three.Mesh(cylinderGeometry, grey);
  body.rotation.x += Math.PI / 2;
  body.position.set(0, 0.5, 0);

  const geometrySphereUp = new Three.SphereGeometry(0.2, 32, 32);
  const sphereUp = new Three.Mesh(geometrySphereUp, grey);
  sphereUp.position.set(0, -0.25, 0);
  body.add(sphereUp);

  const cylinderGeometry2b = new Three.CylinderGeometry(0.085, 0.085, 0.5, 80);
  const focus = new Three.Mesh(cylinderGeometry2b, black);
  focus.position.set(0, 0.04, 0);
  body.add(focus);

  const geometrySphereUp2 = new Three.SphereGeometry(0.025, 32, 32);

  for (let i = 0; i < 16; i++) {
    const led_1 = new Three.Mesh(geometrySphereUp2, white);
    const led_2 = new Three.Mesh(geometrySphereUp2, white);

    led_1.position.set(Math.cos(2 * Math.PI / 14 * i) * 0.115, 0.2497, Math.sin(2 * Math.PI / 14 * i) * 0.115);
    led_2.position.set(Math.cos(2 * Math.PI / 16 * i) * 0.17, 0.25, Math.sin(2 * Math.PI / 16 * i) * 0.17);
    led_1.scale.set(1, 1, 1.3);
    led_2.scale.set(1, 1, 1.3);
    led_1.rotation.x += Math.PI / 2;
    led_2.rotation.x += Math.PI / 2;
    body.add(led_1);
    body.add(led_2);
  }

  const cylinderGeometry2 = new Three.CylinderGeometry(0.195, 0.195, 0.05, 80);
  const glass = new Three.Mesh(cylinderGeometry2, glassMaterial);
  glass.position.set(0, 0.27, 0);
  body.add(glass);

  const cylinderGeometry3 = new Three.CylinderGeometry(0.2, 0.2, 0.1, 80, 16, true);
  const cover = new Three.Mesh(cylinderGeometry3, grey);
  cover.position.set(0, 0.25, 0);
  body.add(cover);

  const cubeGeometryBase = new Three.BoxGeometry(0.25, 0.05, 0.25);
  const base = new Three.Mesh(cubeGeometryBase, grey);
  base.position.set(0, -0.6, 0.35);
  body.add(base);

  for (let i = 0.265; i <= 0.5; i += 0.165) {
    const cylinderGeometry = new Three.CylinderGeometry(0.02, 0.02, 0.055, 6, 6);
    const locknut1 = new Three.Mesh(cylinderGeometry, black);
    const locknut2 = new Three.Mesh(cylinderGeometry, black);
    locknut1.position.set(0.08, -0.6, i);
    locknut2.position.set(-0.08, -0.6, i);
    body.add(locknut1);
    body.add(locknut2);
  }

  const shape2 = new Three.Shape();
  shape2.moveTo(0.2, 0.45);
  shape2.lineTo(0.5, 0.5);
  shape2.lineTo(0.7, 0.5);
  shape2.lineTo(0.7, 0.6);
  shape2.lineTo(0.2, 0.6);

  const extrudeSettings = {
    steps: 2,
    depth: 0.1,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 1
  };

  const geometry3 = new Three.ExtrudeGeometry(shape2, extrudeSettings);
  const arm_p1 = new Three.Mesh(geometry3, grey);
  arm_p1.rotation.z = Math.PI / 2;
  arm_p1.rotation.y = -Math.PI / 2;
  arm_p1.position.set(0.05, -0.8, 0.875);
  body.add(arm_p1);

  const cylinderGeometry4 = new Three.CylinderGeometry(0.1, 0.1, 0.1, 80, 16);
  const arm_p2 = new Three.Mesh(cylinderGeometry4, grey);
  arm_p2.rotation.x += Math.PI / 2;
  arm_p2.position.set(0, -0.02, 0.325);
  body.add(arm_p2);

  const cylinderGeometry5 = new Three.CylinderGeometry(0.05, 0.05, 0.14, 80, 16);
  const arm_p3 = new Three.Mesh(cylinderGeometry5, black);
  arm_p3.rotation.x += Math.PI / 2;
  arm_p3.position.set(0, -0.02, 0.325);
  body.add(arm_p3);

  const cylinderGeometry6 = new Three.CylinderGeometry(0.025, 0.025, 0.16, 80, 16);
  const arm_p3b = new Three.Mesh(cylinderGeometry6, grey);
  arm_p3b.rotation.x += Math.PI / 2;
  arm_p3b.position.set(0, -0.02, 0.325);
  body.add(arm_p3b);

  const cylinderGeometry7 = new Three.CylinderGeometry(0.026, 0.026, 0.12, 80, 16);
  const arm_p4 = new Three.Mesh(cylinderGeometry7, black);
  arm_p4.rotation.z += Math.PI / 2;
  arm_p4.position.set(0, -0.02, 0.23);
  body.add(arm_p4);

  const cylinderGeometry8 = new Three.CylinderGeometry(0.02, 0.02, 0.16, 80, 16);
  const arm_p5 = new Three.Mesh(cylinderGeometry8, grey);
  arm_p5.rotation.z += Math.PI / 2;
  arm_p5.position.set(0, -0.02, 0.23);
  body.add(arm_p5);

  const joint = new Three.Shape();

  // startpoint
  joint.moveTo(0, 0);
  joint.lineTo(0, 0.1);
  joint.lineTo(0.1, 0.1);
  joint.bezierCurveTo(0.05, 0.05, 0.05, 0.05, 0.1, 0);

  const extrudeSettings2 = { depth: 0.1, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };

  const geometry4 = new Three.ExtrudeGeometry(joint, extrudeSettings2);

  const mesh_1 = new Three.Mesh(geometry4, grey);

  mesh_1.position.set(-0.05, 0.03, 0.15);
  mesh_1.rotation.y += Math.PI / 2;
  mesh_1.rotation.z += -Math.PI;

  const mesh_2 = new Three.Mesh(geometry4, grey);
  mesh_2.position.set(-0.05, -0.07, 0.3);
  mesh_2.rotation.y += Math.PI / 2;

  body.add(mesh_1);
  body.add(mesh_2);

  const points: Three.Vector2[] = [];

  points.push(new Three.Vector2(0.2, 0));
  points.push(new Three.Vector2(0.2, 0));
  points.push(new Three.Vector2(0.2, 0.2));
  points.push(new Three.Vector2(0.2, 0.2));

  const geometry = new Three.LatheGeometry(points, 200, 0, Math.PI);
  grey.side = Three.DoubleSide;
  const cover_2 = new Three.Mesh(geometry, grey);
  cover_2.position.set(0, 0.2, 0);
  cover_2.rotation.y += Math.PI / 2;
  body.add(cover_2);

  const cylinderGeometry9 = new Three.CylinderGeometry(0.025, 0.02, 0.3, 80, 16);
  const antenna_p1 = new Three.Mesh(cylinderGeometry9, black);
  antenna_p1.rotation.x += Math.PI / 2;
  antenna_p1.position.set(0, -0.5, -0.18);
  body.add(antenna_p1);

  const cylinderGeometry10 = new Three.CylinderGeometry(0.02, 0.015, 0.3, 80, 16);
  const antenna_p2 = new Three.Mesh(cylinderGeometry10, black);
  antenna_p2.rotation.x += Math.PI / 2;
  antenna_p2.position.set(0, -0.5, -0.35);
  body.add(antenna_p2);

  const sphere_p1 = new Three.SphereGeometry(0.015, 32, 32);
  const antenna_p3 = new Three.Mesh(sphere_p1, black);
  antenna_p3.position.set(0, -0.5, -0.5);
  body.add(antenna_p3);

  const sphere_p2 = new Three.SphereGeometry(0.04, 32, 32);
  const antenna_p4 = new Three.Mesh(sphere_p2, black);
  antenna_p4.position.set(0, -0.5, 0);
  body.add(antenna_p4);

  const cylinderGeometry11 = new Three.CylinderGeometry(0.025, 0.025, 0.1, 80, 16);
  const antenna_p5 = new Three.Mesh(cylinderGeometry11, black);
  antenna_p5.position.set(0, -0.42, 0);
  body.add(antenna_p5);
  video_camera.add(body);

  return video_camera;
}

function makeObjectMinLOD() {
  const video_camera = new Three.Mesh();

  const cylinderGeometry = new Three.CylinderGeometry(0.2, 0.2, 0.5, 8.8);
  const body = new Three.Mesh(cylinderGeometry, grey);
  body.rotation.x += Math.PI / 2;
  body.position.set(0, 0.5, 0);

  const geometrySphereUp = new Three.SphereGeometry(0.2, 8, 8);
  const sphereUp = new Three.Mesh(geometrySphereUp, grey);
  sphereUp.position.set(0, -0.25, 0);
  body.add(sphereUp);

  const cylinderGeometry2b = new Three.CylinderGeometry(0.085, 0.085, 0.5, 8, 8);
  const focus = new Three.Mesh(cylinderGeometry2b, black);
  focus.position.set(0, 0.04, 0);
  body.add(focus);

  const cylinderGeometry2 = new Three.CylinderGeometry(0.195, 0.195, 0.05, 8, 8);
  const glass = new Three.Mesh(cylinderGeometry2, glassMaterial);
  glass.position.set(0, 0.27, 0);
  body.add(glass);

  const cylinderGeometry3 = new Three.CylinderGeometry(0.2, 0.2, 0.1, 8, 8, true);
  const cover = new Three.Mesh(cylinderGeometry3, grey);
  cover.position.set(0, 0.25, 0);
  body.add(cover);

  const cubeGeometryBase = new Three.BoxGeometry(0.25, 0.05, 0.25);
  const base = new Three.Mesh(cubeGeometryBase, grey);
  base.position.set(0, -0.6, 0.35);
  body.add(base);

  const shape2 = new Three.Shape();
  shape2.moveTo(0.2, 0.45);
  shape2.lineTo(0.5, 0.5);
  shape2.lineTo(0.7, 0.5);
  shape2.lineTo(0.7, 0.6);
  shape2.lineTo(0.2, 0.6);

  const extrudeSettings = {
    steps: 2,
    depth: 0.1,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 1
  };

  const geometry3 = new Three.ExtrudeGeometry(shape2, extrudeSettings);
  const arm_p1 = new Three.Mesh(geometry3, grey);
  arm_p1.rotation.z = Math.PI / 2;
  arm_p1.rotation.y = -Math.PI / 2;
  arm_p1.position.set(0.05, -0.8, 0.875);
  body.add(arm_p1);

  const cylinderGeometry4 = new Three.CylinderGeometry(0.1, 0.1, 0.1, 80, 16);
  const arm_p2 = new Three.Mesh(cylinderGeometry4, grey);
  arm_p2.rotation.x += Math.PI / 2;
  arm_p2.position.set(0, -0.02, 0.325);
  body.add(arm_p2);

  const cylinderGeometry5 = new Three.CylinderGeometry(0.05, 0.05, 0.14, 80, 16);
  const arm_p3 = new Three.Mesh(cylinderGeometry5, black);
  arm_p3.rotation.x += Math.PI / 2;
  arm_p3.position.set(0, -0.02, 0.325);
  body.add(arm_p3);

  const cylinderGeometry6 = new Three.CylinderGeometry(0.025, 0.025, 0.16, 80, 16);
  const arm_p3b = new Three.Mesh(cylinderGeometry6, grey);
  arm_p3b.rotation.x += Math.PI / 2;
  arm_p3b.position.set(0, -0.02, 0.325);
  body.add(arm_p3b);

  const cylinderGeometry7 = new Three.CylinderGeometry(0.026, 0.026, 0.12, 80, 16);
  const arm_p4 = new Three.Mesh(cylinderGeometry7, black);
  arm_p4.rotation.z += Math.PI / 2;
  arm_p4.position.set(0, -0.02, 0.23);
  body.add(arm_p4);

  const cylinderGeometry8 = new Three.CylinderGeometry(0.02, 0.02, 0.16, 80, 16);
  const arm_p5 = new Three.Mesh(cylinderGeometry8, grey);
  arm_p5.rotation.z += Math.PI / 2;
  arm_p5.position.set(0, -0.02, 0.23);
  body.add(arm_p5);

  const joint = new Three.Shape();

  // startpoint
  joint.moveTo(0, 0);
  joint.lineTo(0, 0.1);
  joint.lineTo(0.1, 0.1);
  joint.bezierCurveTo(0.05, 0.05, 0.05, 0.05, 0.1, 0);

  const extrudeSettings2 = { depth: 0.1, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };

  const geometry4 = new Three.ExtrudeGeometry(joint, extrudeSettings2);

  const mesh_1 = new Three.Mesh(geometry4, grey);

  mesh_1.position.set(-0.05, 0.03, 0.15);
  mesh_1.rotation.y += Math.PI / 2;
  mesh_1.rotation.z += -Math.PI;

  const mesh_2 = new Three.Mesh(geometry4, grey);
  mesh_2.position.set(-0.05, -0.07, 0.3);
  mesh_2.rotation.y += Math.PI / 2;

  body.add(mesh_1);
  body.add(mesh_2);

  const cylinderGeometry9 = new Three.CylinderGeometry(0.025, 0.02, 0.3, 8, 8);
  const antenna_p1 = new Three.Mesh(cylinderGeometry9, black);
  antenna_p1.rotation.x += Math.PI / 2;
  antenna_p1.position.set(0, -0.5, -0.18);
  body.add(antenna_p1);

  const cylinderGeometry10 = new Three.CylinderGeometry(0.02, 0.015, 0.3, 8, 8);
  const antenna_p2 = new Three.Mesh(cylinderGeometry10, black);
  antenna_p2.rotation.x += Math.PI / 2;
  antenna_p2.position.set(0, -0.5, -0.35);
  body.add(antenna_p2);

  const sphere_p1 = new Three.SphereGeometry(0.015, 8, 8);
  const antenna_p3 = new Three.Mesh(sphere_p1, black);
  antenna_p3.position.set(0, -0.5, -0.5);
  body.add(antenna_p3);

  const sphere_p2 = new Three.SphereGeometry(0.04, 8, 8);
  const antenna_p4 = new Three.Mesh(sphere_p2, black);
  antenna_p4.position.set(0, -0.5, 0);
  body.add(antenna_p4);

  const cylinderGeometry11 = new Three.CylinderGeometry(0.025, 0.025, 0.1, 8, 8);
  const antenna_p5 = new Three.Mesh(cylinderGeometry11, black);
  antenna_p5.position.set(0, -0.42, 0);
  body.add(antenna_p5);
  video_camera.add(body);

  return video_camera;
}

export default defineCatalogElement({
  name: 'camera',
  prototype: 'items',

  info: {
    tag: ['security', 'metal'],
    title: 'camera',
    description: 'camera',
    image: require('./camera.png')
  },
  properties: {
    altitude: {
      label: 'altitude',
      type: 'length-measure',
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
      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`}>
        <rect key='1' x='0' y='0' width={WIDTH} height={DEPTH}
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: '#84e1ce' }} />
        <text key='2' x='0' y='0'
          transform={`translate(${WIDTH / 2}, ${DEPTH / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: 'middle', fontSize: '11px' }}>
          {element.type}
        </text>
      </g>
    )
  },

  async render3D(element, layer, scene) {
    const newAltitude = element.properties.altitude.length;

    /**************** LOD max ***********************/

    const video_cameraMaxLOD = new Three.Object3D();
    video_cameraMaxLOD.add(objectMaxLOD.clone());

    const aa = new Three.Box3().setFromObject(video_cameraMaxLOD);

    const deltaX = Math.abs(aa.max.x - aa.min.x);
    const deltaY = Math.abs(aa.max.y - aa.min.y);
    const deltaZ = Math.abs(aa.max.z - aa.min.z);

    video_cameraMaxLOD.position.y += HEIGHT / 8 + newAltitude;
    video_cameraMaxLOD.position.z += DEPTH / 2;
    video_cameraMaxLOD.scale.set(DEPTH / deltaZ, HEIGHT / deltaY, WIDTH / deltaX);

    /**************** LOD min ***********************/

    const video_cameraMinLOD = new Three.Object3D();
    video_cameraMinLOD.add(objectMinLOD.clone());


    video_cameraMinLOD.position.y += HEIGHT / 8 + newAltitude;
    video_cameraMinLOD.position.z += DEPTH / 2;
    video_cameraMinLOD.scale.set(DEPTH / deltaZ, HEIGHT / deltaY, WIDTH / deltaX);

    /**** all level of detail ***/

    const lod = new Three.LOD();

    lod.addLevel(video_cameraMaxLOD, 200);
    lod.addLevel(video_cameraMinLOD, 900);
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
