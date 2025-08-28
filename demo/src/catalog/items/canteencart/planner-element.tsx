import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const WIDTH = 30;
const DEPTH = 40;
const HEIGHT = 180;
const RADIUS = 10;

const black = new Three.MeshLambertMaterial({ color: 0x000000 });
const grey = new Three.MeshLambertMaterial({ color: 0xC0C0C0 });

const objectMaxLOD = makeObjectMaxLOD();
const objectMinLOD = makeObjectMinLOD();

function makeObjectMaxLOD() {
  const canteen_cart = new Three.Mesh(new Three.CylinderGeometry(0.8, 0.8, 0.5, 32), black);

  for (let fx = 0; fx <= 6; fx += 6) {
    for (let fz = 0; fz <= 6; fz += 6) {
      // ruota pneumatico
      const wheel = new Three.Mesh(new Three.CylinderGeometry(0.8, 0.8, 0.5, 32), black);
      wheel.position.set(fx, fz, 0);
      canteen_cart.add(wheel);

      // ruota cuscinetto
      const r1a = new Three.Mesh(new Three.CylinderGeometry(0.6, 0.6, 0.6, 32), grey);
      wheel.add(r1a);

      // dado esagonale
      const cr1 = new Three.Mesh(new Three.CylinderGeometry(0.1, 0.1, 0.8, 6), black);
      cr1.position.set(0, 0, 0);
      wheel.add(cr1);

      // copriruota disco superiore
      const wheelCoverUp = new Three.Mesh(new Three.CylinderGeometry(0.6, 0.6, 0.1, 32), grey);
      wheelCoverUp.rotation.x = 0.5 * Math.PI;
      wheelCoverUp.position.set(-0.3, 0, -1.2);
      wheel.add(wheelCoverUp);

      // copriruota disco inferiore
      const wheelCoverDown = new Three.Mesh(new Three.CylinderGeometry(0.3725, 0.3725, 0.3, 32), black);
      wheelCoverDown.rotation.x = 0.5 * Math.PI;
      wheelCoverDown.position.set(-0.3, 0, -1);
      wheel.add(wheelCoverDown);

      // triangolo  lato 1
      const cr2 = new Three.Mesh(new Three.CylinderGeometry(0.55, 0.55, 0.05, 3), grey);
      cr2.position.set(-0.2, -0.35, -0.6);
      wheel.add(cr2);

      // rettangolo lato 1
      const b1 = new Three.Mesh(new Three.BoxGeometry(0.55, 1.1, 0.05), grey);
      b1.rotation.x = 0.5 * Math.PI;
      b1.position.set(0, -0.35, -0.4);
      wheel.add(b1);

      // triangolo  lato 2
      const cr3 = new Three.Mesh(new Three.CylinderGeometry(0.55, 0.55, 0.05, 3), grey);
      cr3.position.set(-0.2, 0.35, -0.6);
      wheel.add(cr3);

      // rettangolo lato 2
      const b2 = new Three.Mesh(new Three.BoxGeometry(0.55, 1.1, 0.05), grey);
      b2.rotation.x = 0.5 * Math.PI;
      b2.position.set(0, 0.35, -0.4);
      wheel.add(b2);

      // rettangolo lato up
      const b3 = new Three.Mesh(new Three.BoxGeometry(0.95, 0.75, 0.1), grey);
      b3.position.set(-0.2, 0, -0.9);
      wheel.add(b3);
    }
  }

  // side
  const side1 = new Three.Mesh(new Three.BoxGeometry(0.3, 17.1, 0.3), grey);
  side1.rotation.x = 0.5 * Math.PI;
  side1.position.set(-0.3, 0, -9.6);
  canteen_cart.add(side1);

  const side2 = new Three.Mesh(new Three.BoxGeometry(0.3, 17.1, 0.3), grey);
  side2.rotation.x = 0.5 * Math.PI;
  side2.position.set(-0.3, 6, -9.6);
  canteen_cart.add(side2);

  const side3 = new Three.Mesh(new Three.BoxGeometry(0.3, 17.1, 0.3), grey);
  side3.rotation.x = 0.5 * Math.PI;
  side3.position.set(5.7, 0, -9.6);
  canteen_cart.add(side3);

  const side4 = new Three.Mesh(new Three.BoxGeometry(0.3, 17.1, 0.3), grey);
  side4.rotation.x = 0.5 * Math.PI;
  side4.position.set(5.7, 6, -9.6);
  canteen_cart.add(side4);

  // archi top
  const a1 = new Three.Mesh(new Three.TorusGeometry(3, 0.15, 20, 20, 3.125), grey);
  a1.rotation.x = -0.5 * Math.PI;
  a1.position.set(2.7, 6, -18.1);
  canteen_cart.add(a1);

  // archi top
  const a2 = new Three.Mesh(new Three.TorusGeometry(3, 0.15, 20, 20, 3.125), grey);
  a2.rotation.x = -0.5 * Math.PI;
  a2.position.set(2.7, 0, -18.1);
  canteen_cart.add(a2);

  // ripiano top
  const plane = new Three.Mesh(new Three.BoxGeometry(0.3, 5.7, 0.3), grey);
  plane.position.set(-0.3, 3, -18);
  canteen_cart.add(plane);

  // ripiano top
  const plane2 = new Three.Mesh(new Three.BoxGeometry(0.3, 5.7, 0.3), grey);
  plane2.rotation.x = 0.5 * Math.PI;
  plane2.rotation.z = 0.5 * Math.PI;
  plane2.position.set(2.7, 0, -18);
  canteen_cart.add(plane2);

  // ripiano top
  const plane3 = new Three.Mesh(new Three.BoxGeometry(0.3, 5.7, 0.3), grey);
  plane3.rotation.x = 0.5 * Math.PI;
  plane3.rotation.z = 0.5 * Math.PI;
  plane3.position.set(2.7, 6, -18);
  canteen_cart.add(plane3);

  // ripiano top
  const plane4 = new Three.Mesh(new Three.BoxGeometry(0.3, 5.7, 0.3), grey);
  plane4.position.set(5.7, 3, -18);
  canteen_cart.add(plane4);

  //ripiani
  for (let Dz = -16.5; Dz <= -2.8; Dz += 1.5) {
    const plane5 = new Three.Mesh(new Three.BoxGeometry(0.5, 5.7, 0.1), grey);
    plane5.rotation.z = 0.5 * Math.PI;
    plane5.position.set(2.7, 5.9, Dz + 0.2);
    canteen_cart.add(plane5);

    const plane6 = new Three.Mesh(new Three.BoxGeometry(0.1, 5.7, 0.5), grey);
    plane6.rotation.z = 0.5 * Math.PI;
    plane6.position.set(2.7, 6.1, Dz);
    canteen_cart.add(plane6);

    const plane7 = new Three.Mesh(new Three.BoxGeometry(0.5, 5.7, 0.1), grey);
    plane7.rotation.z = 0.5 * Math.PI;
    plane7.position.set(2.7, 0.1, Dz + 0.2);
    canteen_cart.add(plane7);

    const plane8 = new Three.Mesh(new Three.BoxGeometry(0.1, 5.7, 0.5), grey);
    plane8.rotation.z = 0.5 * Math.PI;
    plane8.position.set(2.7, -0.1, Dz);
    canteen_cart.add(plane8)
  }

  // ripiano down
  const d1 = new Three.Mesh(new Three.BoxGeometry(0.3, 5.7, 0.3), grey);
  d1.position.set(-0.3, 3, -2);
  canteen_cart.add(d1);

  //ripiano down
  const d2 = new Three.Mesh(new Three.BoxGeometry(0.3, 5.7, 0.3), grey);
  d2.position.set(5.7, 3, -2);
  canteen_cart.add(d2);

  return canteen_cart
}

function makeObjectMinLOD() {
  const canteen_cart = new Three.Mesh();

  for (let fx = 0; fx <= 6; fx += 6) {
    for (let fz = 0; fz <= 6; fz += 6) {
      // ruota pneumatico
      const wheel = new Three.Mesh(new Three.CylinderGeometry(0.8, 0.8, 0.5, 32), black);
      wheel.position.set(fx, fz, 0);
      canteen_cart.add(wheel);

      // ruota cuscinetto
      const r1a = new Three.Mesh(new Three.CylinderGeometry(0.6, 0.6, 0.6, 32), grey);
      wheel.add(r1a);

      // dado esagonale
      const cr1 = new Three.Mesh(new Three.CylinderGeometry(0.1, 0.1, 0.8, 6), black);
      cr1.position.set(0, 0, 0);
      wheel.add(cr1);

      // copriruota disco superiore
      const wheelCoverUp = new Three.Mesh(new Three.CylinderGeometry(0.6, 0.6, 0.1, 32), grey);
      wheelCoverUp.rotation.x = 0.5 * Math.PI;
      wheelCoverUp.position.set(-0.3, 0, -1.2);
      wheel.add(wheelCoverUp);

      // copriruota disco inferiore
      const wheelCoverDown = new Three.Mesh(new Three.CylinderGeometry(0.3725, 0.3725, 0.3, 32), black);
      wheelCoverDown.rotation.x = 0.5 * Math.PI;
      wheelCoverDown.position.set(-0.3, 0, -1);
      wheel.add(wheelCoverDown);

      // triangolo  lato 1
      const cr2 = new Three.Mesh(new Three.CylinderGeometry(0.55, 0.55, 0.05, 3), grey);
      cr2.position.set(-0.2, -0.35, -0.6);
      wheel.add(cr2);

      // rettangolo lato 1
      const b1 = new Three.Mesh(new Three.BoxGeometry(0.55, 1.1, 0.05), grey);
      b1.rotation.x = 0.5 * Math.PI;
      b1.position.set(0, -0.35, -0.4);
      wheel.add(b1);

      // triangolo  lato 2
      const cr3 = new Three.Mesh(new Three.CylinderGeometry(0.55, 0.55, 0.05, 3), grey);
      cr3.position.set(-0.2, 0.35, -0.6);
      wheel.add(cr3);

      // rettangolo lato 2
      const b2 = new Three.Mesh(new Three.BoxGeometry(0.55, 1.1, 0.05), grey);
      b2.rotation.x = 0.5 * Math.PI;
      b2.position.set(0, 0.35, -0.4);
      wheel.add(b2);

      // rettangolo lato up
      const b3 = new Three.Mesh(new Three.BoxGeometry(0.95, 0.75, 0.1), grey);
      b3.position.set(-0.2, 0, -0.9);
      wheel.add(b3);
    }
  }

  // side
  const side1 = new Three.Mesh(new Three.BoxGeometry(0.3, 17.1, 0.3), grey);
  side1.rotation.x = 0.5 * Math.PI;
  side1.position.set(-0.3, 0, -9.6);
  canteen_cart.add(side1);

  const side2 = new Three.Mesh(new Three.BoxGeometry(0.3, 17.1, 0.3), grey);
  side2.rotation.x = 0.5 * Math.PI;
  side2.position.set(-0.3, 6, -9.6);
  canteen_cart.add(side2);

  const side3 = new Three.Mesh(new Three.BoxGeometry(0.3, 17.1, 0.3), grey);
  side3.rotation.x = 0.5 * Math.PI;
  side3.position.set(5.7, 0, -9.6);
  canteen_cart.add(side3);

  const side4 = new Three.Mesh(new Three.BoxGeometry(0.3, 17.1, 0.3), grey);
  side4.rotation.x = 0.5 * Math.PI;
  side4.position.set(5.7, 6, -9.6);
  canteen_cart.add(side4);

  // archi top
  const a1 = new Three.Mesh(new Three.TorusGeometry(3, 0.15, 20, 20, 3.125), grey);
  a1.rotation.x = -0.5 * Math.PI;
  a1.position.set(2.7, 6, -18.1);
  canteen_cart.add(a1);

  // archi top
  const a2 = new Three.Mesh(new Three.TorusGeometry(3, 0.15, 20, 20, 3.125), grey);
  a2.rotation.x = -0.5 * Math.PI;
  a2.position.set(2.7, 0, -18.1);
  canteen_cart.add(a2);

  // ripiano top
  const plane = new Three.Mesh(new Three.BoxGeometry(0.3, 5.7, 0.3), grey);
  plane.position.set(-0.3, 3, -18);
  canteen_cart.add(plane);

  // ripiano top
  const plane2 = new Three.Mesh(new Three.BoxGeometry(0.3, 5.7, 0.3), grey);
  plane2.rotation.x = 0.5 * Math.PI;
  plane2.rotation.z = 0.5 * Math.PI;
  plane2.position.set(2.7, 0, -18);
  canteen_cart.add(plane2);

  // ripiano top
  const plane3 = new Three.Mesh(new Three.BoxGeometry(0.3, 5.7, 0.3), grey);
  plane3.rotation.x = 0.5 * Math.PI;
  plane3.rotation.z = 0.5 * Math.PI;
  plane3.position.set(2.7, 6, -18);
  canteen_cart.add(plane3);

  // ripiano top
  const plane4 = new Three.Mesh(new Three.BoxGeometry(0.3, 5.7, 0.3), grey);
  plane4.position.set(5.7, 3, -18);
  canteen_cart.add(plane4);

  //ripiani
  for (let Dz = -16.5; Dz <= -2.8; Dz += 1.5) {
    const plane5 = new Three.Mesh(new Three.BoxGeometry(0.5, 5.7, 0.1), grey);
    plane5.rotation.z = 0.5 * Math.PI;
    plane5.position.set(2.7, 5.9, Dz + 0.2);
    canteen_cart.add(plane5);

    const plane6 = new Three.Mesh(new Three.BoxGeometry(0.1, 5.7, 0.5), grey);
    plane6.rotation.z = 0.5 * Math.PI;
    plane6.position.set(2.7, 6.1, Dz);
    canteen_cart.add(plane6);

    const plane7 = new Three.Mesh(new Three.BoxGeometry(0.5, 5.7, 0.1), grey);
    plane7.rotation.z = 0.5 * Math.PI;
    plane7.position.set(2.7, 0.1, Dz + 0.2);
    canteen_cart.add(plane7);

    const plane8 = new Three.Mesh(new Three.BoxGeometry(0.1, 5.7, 0.5), grey);
    plane8.rotation.z = 0.5 * Math.PI;
    plane8.position.set(2.7, -0.1, Dz);
    canteen_cart.add(plane8)
  }

  // ripiano down
  const d1 = new Three.Mesh(new Three.BoxGeometry(0.3, 5.7, 0.3), grey);
  d1.position.set(-0.3, 3, -2);
  canteen_cart.add(d1);

  //ripiano down
  const d2 = new Three.Mesh(new Three.BoxGeometry(0.3, 5.7, 0.3), grey);
  d2.position.set(5.7, 3, -2);
  canteen_cart.add(d2);

  return canteen_cart
}

export default defineCatalogElement({
  name: 'canteen cart',
  prototype: 'items',

  info: {
    tag: ['furnishings', 'metal'],
    title: 'canteen cart',
    description: 'canteen cart',
    image: require('./canteen_cart.png')
  },

  properties: {
    altitude: {
      label: 'altitude',
      type: 'length-measure',
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
        <rect key='1' x='0' y='0' width={WIDTH} height={DEPTH}
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: '#84e1ce' }} />
        <text key='2' x='0' y='0' transform={`translate(${WIDTH / 2}, ${DEPTH / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: 'middle', fontSize: '11px' }}>
          {element.type}</text>
      </g>
    )
  },


  async render3D(element, layer, scene) {
    const newAltitude = element.properties.altitude.length;

    /************** lod max ****************/

    const canteen_cartMaxLOD = new Three.Object3D();
    canteen_cartMaxLOD.add(objectMaxLOD.clone());

    const valuePosition = new Three.Box3().setFromObject(canteen_cartMaxLOD);

    const deltaX = Math.abs(valuePosition.max.x - valuePosition.min.x);
    const deltaY = Math.abs(valuePosition.max.y - valuePosition.min.y);
    const deltaZ = Math.abs(valuePosition.max.z - valuePosition.min.z);

    canteen_cartMaxLOD.rotation.x += Math.PI / 2;
    canteen_cartMaxLOD.position.y += newAltitude;
    canteen_cartMaxLOD.scale.set(WIDTH / deltaY, DEPTH / deltaX, HEIGHT / deltaZ);

    /************** lod min ****************/

    const canteen_cartMinLOD = new Three.Object3D();
    canteen_cartMinLOD.add(objectMinLOD.clone());
    canteen_cartMinLOD.rotation.x += Math.PI / 2;
    canteen_cartMinLOD.position.y += newAltitude;
    canteen_cartMinLOD.scale.set(WIDTH / deltaY, DEPTH / deltaX, HEIGHT / deltaZ);

    /**** all level of detail ***/

    const lod = new Three.LOD();

    lod.addLevel(canteen_cartMaxLOD, 200);
    lod.addLevel(canteen_cartMinLOD, 900);
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
