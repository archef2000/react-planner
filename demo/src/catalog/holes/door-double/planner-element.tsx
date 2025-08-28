import React from 'react';
import * as Three from 'three';
import { defineCatalogElement } from '@archef2000/react-planner';

const black = new Three.MeshLambertMaterial({ color: 0x000000 });
const metalBlue = new Three.MeshLambertMaterial({ color: 0xB7CEEC });
const grey = new Three.MeshLambertMaterial({ color: 0xD2B06A });
const darkGrey = new Three.MeshLambertMaterial({ color: 0xFFEFCE });

const boxMaterials = [grey, grey, grey, grey, darkGrey, darkGrey];

function makeDoor(width: number, height: number, thickness: number) {
  const door_double = new Three.Mesh();

  const LongDoorGeometry = new Three.BoxGeometry(.75 * width, height, thickness);
  const longDoor = new Three.Mesh(LongDoorGeometry, boxMaterials);
  longDoor.position.x -= width * .25;
  door_double.add(longDoor);

  const ShortDoorGeometry = new Three.BoxGeometry(.25 * width, height, thickness);
  const shortDoor = new Three.Mesh(ShortDoorGeometry, boxMaterials);
  shortDoor.position.x += width * 0.25;
  shortDoor.position.z += thickness / 10;
  door_double.add(shortDoor);

  const handle = makeHandle(width);
  handle.position.set(width / 20, height / 40, thickness / 2 + thickness / 10);
  handle.rotation.z += Math.PI;
  handle.rotation.x += Math.PI / 2;
  door_double.add(handle);

  const handleBase = makeHandleBase();
  handleBase.position.set(width / 20, 0, thickness / 2);
  handleBase.rotation.x = 0;
  door_double.add(handleBase);

  const handle2 = makeHandle(width);
  handle2.position.set(width / 20, height / 40, -thickness / 2 - thickness / 10);
  handle2.rotation.z += Math.PI;
  handle2.rotation.x -= Math.PI / 2;
  door_double.add(handle2);

  const handleBase2 = makeHandleBase();
  handleBase2.position.set(width / 20, 0, -thickness / 2);
  handleBase2.rotation.x = 0;
  door_double.add(handleBase2);

  return door_double
}


function makeHandle(width: number) {
  const handle = new Three.Object3D();
  const geometry_p1 = new Three.CylinderGeometry(width / 100, width / 100, width / 32.5, Math.round(32));
  const geometry_p2 = new Three.SphereGeometry(width / 100, Math.round(32), Math.round(32));
  const geometry_p3 = new Three.CylinderGeometry(width / 100, width / 100, width / 14.5, Math.round(32));
  const p1 = new Three.Mesh(geometry_p1, black);
  const p2 = new Three.Mesh(geometry_p2, black);
  const p3 = new Three.Mesh(geometry_p3, black);
  const p4 = new Three.Mesh(geometry_p2, black);
  p3.rotation.z = Math.PI / 2;
  p3.position.x = width / 14.5 / 2;
  p2.position.y = -width / 32.5 / 2;
  p4.position.y = -width / 14.5 / 2;
  p3.add(p4);
  p2.add(p3);
  p1.add(p2);
  handle.add(p1);

  return handle;
}

function makeHandleBase() {
  const handleBase = new Three.Object3D();
  const geometryBase1 = new Three.BoxGeometry(7.6, 28, 2);
  const geometryBase2 = new Three.CylinderGeometry(3.6, 3.6, 2, Math.round(32));
  const lock = makeLock();
  const handleBase1 = new Three.Mesh(geometryBase1, black);
  const handleBase2 = new Three.Mesh(geometryBase2, black);
  lock.rotation.x = Math.PI / 2;
  lock.position.y = -3;
  handleBase2.rotation.x = Math.PI / 2;
  handleBase2.position.y = -3.3;
  handleBase2.scale.z = 1.5;
  handleBase1.add(lock);
  handleBase1.add(handleBase2);
  handleBase.add(handleBase1);

  return handleBase;
}

function makeLock() {
  const lock = new Three.Object3D();
  const LockGeometry1 = new Three.CylinderGeometry(1.5, 1.5, 4, Math.round(32));
  const lockGeometry2 = new Three.BoxGeometry(1.6, 4, 4);
  const lockGeometry3 = new Three.BoxGeometry(1.4, 4.06, 0.36);
  const lock_p1 = new Three.Mesh(LockGeometry1, metalBlue);
  const lock_p2 = new Three.Mesh(lockGeometry2, metalBlue);
  const lock_p3 = new Three.Mesh(lockGeometry3, grey);
  lock_p2.position.z = 1;
  lock_p1.add(lock_p2);
  lock_p1.add(lock_p3);
  lock.add(lock_p1);

  return lock;
}

export default defineCatalogElement({
  name: 'double door',
  prototype: 'holes',

  info: {
    tag: ['door'],
    title: 'double door',
    description: 'iron door',
    image: require('./door_double.png')
  },

  properties: {
    width: {
      label: 'width',
      type: 'length-measure',
      defaultValue: {
        length: 200
      }
    },
    height: {
      label: 'height',
      type: 'length-measure',
      defaultValue: {
        length: 215
      }
    },
    thickness: {
      label: 'thickness',
      type: 'length-measure',
      defaultValue: {
        length: 30
      }
    },
    altitude: {
      label: 'altitude',
      type: 'length-measure',
      defaultValue: {
        length: 0
      }
    },
    flip_horizontal: {
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
    const STYLE_HOLE_BASE = { stroke: '#ff0000', strokeWidth: '3px', fill: '#ff0000' };
    const STYLE_HOLE_SELECTED = { stroke: '#ff0000', strokeWidth: '4px', fill: '#ff0000', cursor: 'move' };
    const STYLE_ARC_BASE = { stroke: '#ff0000', strokeWidth: '3px', strokeDasharray: '5,5', fill: 'none' };
    const STYLE_ARC_SELECTED = { stroke: '#ff0000', strokeWidth: '4px', strokeDasharray: '5,5', fill: 'none', cursor: 'move' };

    const epsilon = 3;
    const flip = element.properties.flip_horizontal;
    const holeWidth = element.properties.width.length;
    const holePath = `M${0} ${-epsilon}  L${holeWidth} ${-epsilon}  L${holeWidth} ${epsilon}  L${0} ${epsilon}  z`;
    const arcPath = `M${0},${0}  A${holeWidth / 4},${holeWidth / 4} 0 0,1 ${holeWidth / 4},${holeWidth / 4}`;
    const arcPath2 = `M${0},${0}  A${holeWidth / 2 + holeWidth / 4},${holeWidth / 2 + holeWidth / 4} 0 0,0 ${holeWidth / 2 + holeWidth / 4},${holeWidth / 2 + holeWidth / 4}`;
    const holeStyle = element.selected ? STYLE_HOLE_SELECTED : STYLE_HOLE_BASE;
    const arcStyle = element.selected ? STYLE_ARC_SELECTED : STYLE_ARC_BASE;
    const length = element.properties.width.length;

    if (flip) {
      return (
        <g transform={`translate(${-length / 2}, 0)`}>
          <path key='1' d={arcPath} style={arcStyle} transform={`translate(${0},${-holeWidth / 4})`} />
          <line key='2' x1={0} y1={0 - epsilon} x2={0} y2={-holeWidth / 4 - epsilon} style={holeStyle} />
          <path key='3' d={arcPath2} style={arcStyle} transform={`translate(${holeWidth},${-holeWidth / 2 - holeWidth / 4}) rotate(90)`} />
          <line key='4' x1={holeWidth} y1={0 - epsilon} x2={holeWidth} y2={-holeWidth / 2 - holeWidth / 4 - epsilon} style={holeStyle} />
          <path key='5' d={holePath} style={holeStyle} />
        </g>
      )
    }
    else {
      return (
        <g transform={`translate(${-length / 2}, 0)`}>
          <path key='1' d={arcPath} style={arcStyle} transform={`translate(${holeWidth},${holeWidth / 4}) rotate(180)`} />
          <line key='2' x1={0} y1={0 - epsilon} x2={0} y2={holeWidth / 2 + holeWidth / 4 - epsilon} style={holeStyle} />
          <path key='3' d={arcPath2} style={arcStyle} transform={`translate(${0},${holeWidth / 2 + holeWidth / 4}) rotate(270)`} />
          <line key='4' x1={holeWidth} y1={0 - epsilon} x2={holeWidth} y2={holeWidth / 4 - epsilon} style={holeStyle} />
          <path key='5' d={holePath} style={holeStyle} />
        </g>
      )
    }
  },

  async render3D(element, layer, scene) {
    const flip = element.properties.flip_horizontal;
    const width = element.properties.width.length;
    const height = element.properties.height.length;
    const thickness = element.properties.thickness.length;
    const newAltitude = element.properties.altitude.length;

    const door_double = new Three.Object3D();
    door_double.add(makeDoor(width, height, thickness).clone());

    const valuePosition = new Three.Box3().setFromObject(door_double);

    const deltaX = Math.abs(valuePosition.max.x - valuePosition.min.x);
    const deltaY = Math.abs(valuePosition.max.y - valuePosition.min.y);
    const deltaZ = Math.abs(valuePosition.max.z - valuePosition.min.z);

    if (element.selected) {
      const bbox = new Three.BoxHelper(door_double, 0x99c3fb);
      bbox.material.linewidth = 5;
      bbox.renderOrder = 1000;
      bbox.material.depthTest = false;
      door_double.add(bbox);
    }

    if (flip) {
      door_double.rotation.y += Math.PI;
      door_double.position.x -= width / 4;
    }

    door_double.position.y += newAltitude;
    door_double.position.x += width / 8;
    door_double.scale.set(width / deltaX, height / deltaY, thickness / deltaZ);

    return door_double;
  }
});
