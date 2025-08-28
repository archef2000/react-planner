import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const WIDTH = 60;
const DEPTH = 60;
const HEIGHT = 100;

const greyMaterial = new Three.MeshLambertMaterial({ color: 0xC0C0C0 });
greyMaterial.side = Three.DoubleSide;
const greenMaterial = new Three.MeshLambertMaterial({ color: 0x008250 });

function makeArmchairMaxLOD() {
  const armchair = new Three.Object3D();
  const foot = new Three.Mesh();

  //armchair base
  const g_base_foot = new Three.BoxGeometry(0.3, 0.05, 0.4);
  const m_base_foot1 = new Three.Mesh(g_base_foot, greyMaterial);
  m_base_foot1.position.set(0, 0.1, 0.1);
  foot.add(m_base_foot1);

  const g_base_foot2 = new Three.CylinderGeometry(0.055, 0.055, 0.35, 20);
  const m_base_foot2 = new Three.Mesh(g_base_foot2, greyMaterial);
  m_base_foot2.position.set(0, 0.25, 0.15);
  foot.add(m_base_foot2);

  armchair.add(foot);

  //seat
  const seat = new Three.Mesh();

  const extrusionSettings = {
    depth: 0.65,
    bevelEnabled: false,
    bevelSegments: 2,
    steps: 10,
    bevelSize: 1,
    bevelThickness: 1
  };

  const shape_sed = new Three.Shape();
  shape_sed.moveTo(0, 0);
  shape_sed.lineTo(0, 0.05);
  shape_sed.quadraticCurveTo(0, 0.1, -0.02, 0.1);
  shape_sed.lineTo(-0.6, 0.1);
  shape_sed.quadraticCurveTo(-0.6, 0.1, -0.6, 0.07);
  shape_sed.lineTo(-0.6, 0);

  const g_sitting = new Three.ExtrudeGeometry(shape_sed, extrusionSettings);
  const sitting = new Three.Mesh(g_sitting, greenMaterial);

  sitting.rotation.y = Math.PI / 2;
  sitting.rotation.z = Math.PI / 3.5;
  sitting.position.set(-0.325, .905, -0.3);
  seat.add(sitting);

  //back armchair
  const shape_sc = new Three.Shape();
  shape_sc.moveTo(0, 0);
  shape_sc.lineTo(0, 0.1);
  shape_sc.quadraticCurveTo(-0.5, 0.07, -0.97, 0.1);
  shape_sc.quadraticCurveTo(-1, 0.1, -1, 0.07);
  shape_sc.lineTo(-1, 0);
  shape_sc.quadraticCurveTo(-0.5, -0.03, 0, 0);

  const g_back = new Three.ExtrudeGeometry(shape_sc, extrusionSettings);
  const back = new Three.Mesh(g_back, greenMaterial);

  back.rotation.z = -105 * Math.PI / 180;
  back.rotation.y = -Math.PI / 2;
  back.position.set(0.325, 0.52, 0.125);
  seat.add(back);

  const g_asse_rotaz2 = new Three.CylinderGeometry(0.06, 0.06, 0.8, 32, 32, true);
  const asse_rotaz2 = new Three.Mesh(g_asse_rotaz2, greyMaterial);

  asse_rotaz2.rotation.z = -Math.PI / 2;
  asse_rotaz2.position.set(0, 0.45, 0.15);
  seat.add(asse_rotaz2);

  const roundedRectShape = new Three.Shape();

  const x = 0;
  const y = 0;
  const width = .7;
  const height = .75;
  const radius = 0.25;

  roundedRectShape.moveTo(x, y + radius);
  roundedRectShape.lineTo(x, y + height - radius);
  roundedRectShape.quadraticCurveTo(x, y + height, x + radius, y + height);
  roundedRectShape.lineTo(x + width - radius, y + height);
  roundedRectShape.lineTo(x + width, y + radius);
  roundedRectShape.quadraticCurveTo(x + width, y, x + width - radius, y);
  roundedRectShape.lineTo(x + radius, y);
  roundedRectShape.quadraticCurveTo(x, y, x, y + radius);

  const extrudeSettings = {
    steps: 2,
    depth: .07,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 1
  };

  const geometry2 = new Three.ExtrudeGeometry(roundedRectShape, extrudeSettings);
  const armrest_1 = new Three.Mesh(geometry2, greyMaterial);
  armrest_1.rotation.y = Math.PI / 2;
  armrest_1.rotation.z = .9 * Math.PI;
  armrest_1.position.set(-0.4, 1, -0.4);
  seat.add(armrest_1);

  const armrest_2 = armrest_1.clone();
  armrest_2.position.x += .73;
  seat.add(armrest_2);
  armchair.add(seat);

  return armchair
}

function makeArmchairMinLOD() {
  const armchair = new Three.Object3D();
  const foot = new Three.Mesh();

  //armchair base
  const g_base_foot = new Three.BoxGeometry(0.3, 0.05, 0.4);
  const base_foot1 = new Three.Mesh(g_base_foot, greyMaterial);
  base_foot1.position.set(0, 0.1, 0.1);
  foot.add(base_foot1);

  const g_base_foot2 = new Three.CylinderGeometry(0.055, 0.055, 0.35, 8, 8);
  const base_foot2 = new Three.Mesh(g_base_foot2, greyMaterial);
  base_foot2.position.set(0, 0.25, 0.15);
  foot.add(base_foot2);

  armchair.add(foot);

  //seat
  const seat = new Three.Mesh();

  const extrusionSettings = {
    depth: 0.65,
    bevelEnabled: false,
    bevelSegments: 2,
    steps: 10,
    bevelSize: 1,
    bevelThickness: 1
  };

  const shape_sed = new Three.Shape();
  shape_sed.moveTo(0, 0);
  shape_sed.lineTo(0, 0.05);
  shape_sed.quadraticCurveTo(0, 0.1, -0.02, 0.1);
  shape_sed.lineTo(-0.6, 0.1);
  shape_sed.quadraticCurveTo(-0.6, 0.1, -0.6, 0.07);
  shape_sed.lineTo(-0.6, 0);

  const g_sitting = new Three.ExtrudeGeometry(shape_sed, extrusionSettings);
  const sitting = new Three.Mesh(g_sitting, greenMaterial);

  sitting.rotation.y = Math.PI / 2;
  sitting.rotation.z = Math.PI / 3.5;
  sitting.position.set(-0.325, .905, -0.3);
  seat.add(sitting);

  //back armchair
  const shape_sc = new Three.Shape();
  shape_sc.moveTo(0, 0);
  shape_sc.lineTo(0, 0.1);
  shape_sc.quadraticCurveTo(-0.5, 0.07, -0.97, 0.1);
  shape_sc.quadraticCurveTo(-1, 0.1, -1, 0.07);
  shape_sc.lineTo(-1, 0);
  shape_sc.quadraticCurveTo(-0.5, -0.03, 0, 0);

  const g_back = new Three.ExtrudeGeometry(shape_sc, extrusionSettings);
  const back = new Three.Mesh(g_back, greenMaterial);

  back.rotation.z = -105 * Math.PI / 180;
  back.rotation.y = -Math.PI / 2;
  back.position.set(0.325, 0.52, 0.125);
  seat.add(back);

  const g_asse_rotaz2 = new Three.CylinderGeometry(0.06, 0.06, 0.8, 8, 8, true);
  const asse_rotaz2 = new Three.Mesh(g_asse_rotaz2, greyMaterial);

  asse_rotaz2.rotation.z = -Math.PI / 2;
  asse_rotaz2.position.set(0, 0.45, 0.15);
  seat.add(asse_rotaz2);

  const roundedRectShape = new Three.Shape();

  const x = 0;
  const y = 0;
  const width = .7;
  const height = .75;
  const radius = 0.25;

  roundedRectShape.moveTo(x, y + radius);
  roundedRectShape.lineTo(x, y + height - radius);
  roundedRectShape.quadraticCurveTo(x, y + height, x + radius, y + height);
  roundedRectShape.lineTo(x + width - radius, y + height);
  roundedRectShape.lineTo(x + width, y + radius);
  roundedRectShape.quadraticCurveTo(x + width, y, x + width - radius, y);
  roundedRectShape.lineTo(x + radius, y);
  roundedRectShape.quadraticCurveTo(x, y, x, y + radius);

  const extrudeSettings = {
    steps: 2,
    depth: .07,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 1
  };

  const geometry2 = new Three.ExtrudeGeometry(roundedRectShape, extrudeSettings);
  const armrest_1 = new Three.Mesh(geometry2, greyMaterial);
  armrest_1.rotation.y = Math.PI / 2;
  armrest_1.rotation.z = .9 * Math.PI;
  armrest_1.position.set(-0.4, 1, -0.4);
  seat.add(armrest_1);

  const armrest_2 = armrest_1.clone();
  armrest_2.position.x += .73;
  seat.add(armrest_2);
  armchair.add(seat);

  return armchair
}

export default defineCatalogElement({
  name: 'armchairs',
  prototype: 'items',

  info: {
    tag: ['furnishings', 'wood'],
    title: 'armchairs',
    description: 'armchairs',
    image: require('./armchairs.png')
  },

  properties: {
    altitude: {
      label: 'altitude',
      type: 'length-measure',
      defaultValue: {
        length: 0
      }
    },
    seat: {
      label: 'seats',
      type: 'number',
      defaultValue: 1
    },
    flip: {
      label: 'flip',
      type: 'checkbox',
      defaultValue: false,
      values: {
        'none': false,
        'yes': true
      }
    }
  },

  render2D: function (element, layer, scene) {
    const rect_style = { stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: '#84e1ce' } as const;
    const text_style = { textAnchor: 'middle', fontSize: '11px', fill: '#FF0000' } as const;

    const angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }

    const seats: number = element.properties.seat;
    const flip: boolean = element.properties.flip;

    const seatsArray = new Array(seats);

    const eps = -1.7;

    for (let ind = 0; ind < seats; ind++) {
      seatsArray[ind] = <rect key={ind} x={WIDTH * ind} y={eps * ind}
        width={WIDTH} height={DEPTH} style={rect_style} />
    }

    return (
      <g transform={`translate(${(flip ? -1 : 1) * WIDTH * seats / 2},${-DEPTH / 2}) scale(${flip ? 1 : -1},1)`}>
        {seatsArray}
        <text x='0' y='0'
          transform={`translate(${WIDTH * seats / 2}, ${DEPTH / 2 + eps * seats / 2}) scale(${flip ? 1 : -1},-1) rotate(${textRotation})`}
          style={text_style}>
          {element.type}
        </text>
      </g>
    );
  },

  async render3D(element, layer, scene) {
    const newAltitude: number = element.properties.altitude.length;
    const seats: number = element.properties.seat;
    const flip: boolean = element.properties.flip;
    let newWidth = WIDTH;
    let newDepth = DEPTH;

    const armchairsMaxLOD = new Three.Object3D();
    let seatArray = new Array<Three.Object3D<Three.Object3DEventMap>>(seats);

    function setArmchairsPos(listObject: Three.Object3D<Three.Object3DEventMap>[], seats: number) {
      newWidth = WIDTH * seats;
      newDepth = DEPTH + (DEPTH / 8 * seats / 2);
      seatArray = listObject;

      for (let ind = 0; ind < seats; ind++) {
        seatArray[ind].position.x = (ind - Math.floor(seats / 2)) * -.8;
        if (flip) {
          seatArray[ind].position.z = (ind - Math.floor(seats / 2)) * -.085;
        } else {
          seatArray[ind].position.z = (ind - Math.floor(seats / 2)) * +.085;
        }
      }
    }

    function makeSeriesArmchair2(seats: number) {
      const chair = makeArmchairMaxLOD().clone();
      for (let ind = 0; ind < seats; ind++) {
        seatArray[ind] = chair.clone();
      }
      return seatArray
    }

    const armchairsObject2 = makeSeriesArmchair2(seats);
    setArmchairsPos(armchairsObject2, seats);

    for (let i = 0; i < armchairsObject2.length; i++) {
      armchairsMaxLOD.add(armchairsObject2[i]);
    }

    const valueObject = new Three.Box3().setFromObject(armchairsMaxLOD);

    const deltaX = Math.abs(valueObject.max.x - valueObject.min.x);
    const deltaY = Math.abs(valueObject.max.y - valueObject.min.y);
    const deltaZ = Math.abs(valueObject.max.z - valueObject.min.z);

    armchairsMaxLOD.position.y += -HEIGHT / 20 + newAltitude;
    seats % 2 ? armchairsMaxLOD.position.x += newWidth / seats - WIDTH : armchairsMaxLOD.position.x += newWidth / seats - 1.5 * WIDTH;
    armchairsMaxLOD.position.z -= DEPTH / 8;
    armchairsMaxLOD.scale.set(newWidth / deltaX, HEIGHT / deltaY, newDepth / deltaZ);


    /********************** lod min ************************************/

    const armchairsMinLOD = new Three.Object3D();

    function makeSeriesArmchair1(seats) {
      const chair = makeArmchairMinLOD().clone();

      for (let ind = 0; ind < seats; ind++) {
        seatArray[ind] = chair.clone();
      }

      return seatArray
    }

    const armchairsObject1 = makeSeriesArmchair1(seats);
    setArmchairsPos(armchairsObject1, seats);

    for (let j = 0; j < armchairsObject1.length; j++)
      armchairsMinLOD.add(armchairsObject1[j]);

    armchairsMinLOD.position.y += -HEIGHT / 20 + newAltitude;
    seats % 2 ? armchairsMinLOD.position.x += newWidth / seats - WIDTH : armchairsMinLOD.position.x += (newWidth) / seats - 1.5 * WIDTH;
    armchairsMinLOD.position.z -= DEPTH / 8;
    armchairsMinLOD.scale.set(newWidth / deltaX, HEIGHT / deltaY, newDepth / deltaZ);


    /********* all level of detail ************/

    const lod = new Three.LOD();

    lod.addLevel(armchairsMaxLOD, 200);
    lod.addLevel(armchairsMinLOD, 700);
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
