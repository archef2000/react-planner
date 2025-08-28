import { defineCatalogElement } from '@archef2000/react-planner';
import React from 'react';
import * as Three from 'three';

const black = new Three.MeshLambertMaterial({ color: 0x000000 });
const green = new Three.MeshLambertMaterial({ color: 0x348781 });
const red = new Three.MeshLambertMaterial({ color: 0xFF0000 });
const turquoise = new Three.MeshLambertMaterial({ color: 0x43C6DB, opacity: 0.7, transparent: true });
const metalBlue = new Three.MeshLambertMaterial({ color: 0xB7CEEC });
const darkGrey = new Three.MeshLambertMaterial({ color: 0x313131 });
const darkGrey2 = new Three.MeshLambertMaterial({ color: 0x212121 });
const metalBlueGrey = new Three.MeshLambertMaterial({ color: 0x566D7E });

function makePanicDoor() {
  const panicDoorDouble = new Three.Mesh();
  const doorLeft = makeDoorStructure();
  const doorRight = makeDoorStructure();
  const handle = makeHandle();
  const doorLeftPivot = makePivot();
  const doorRightPivot = makePivot();
  const safetyHandleLeft = makeSafetyHandle();
  const safetyHandleRight = makeSafetyHandle();
  const lock = makeLock();
  const doorLockLeft = makeDoorLock();
  const doorLockRight = makeDoorLock();
  lock.position.set(-0.05, -0.02, 0.03);
  handle.position.set(-0.47 / 2, 0.85 / 2, -0.03);
  doorLeftPivot.position.set(0.595 / 2, 0, -0.06 / 2);
  doorRightPivot.position.set(0.6 / 2, 0, 0.077 / 2);
  doorRight.rotation.y = Math.PI;
  doorRight.position.set(-0.35 / 2 - 0.084, 0, 0.0043);
  doorLeft.position.set(0.35 / 2 + 0.084, 0, -0.0043);
  safetyHandleLeft.position.set(0, 0.4, 0.06 / 2);
  safetyHandleRight.position.set(0, 0.4, -0.062 / 2);
  handle.add(lock);
  doorLeft.add(handle);
  doorLeft.add(safetyHandleLeft);
  doorRight.add(safetyHandleRight);
  doorLeft.add(doorLeftPivot);
  panicDoorDouble.add(doorLeft);
  doorRight.add(doorRightPivot);
  doorLeft.add(doorLockLeft);
  doorRight.add(doorLockRight);
  panicDoorDouble.add(doorRight);

  return panicDoorDouble
}

function makeDoorLock() {
  const block = new Three.Object3D();
  const DoorLockGeometry1 = new Three.CylinderGeometry(0.012, 0.012, 1.905, Math.round(32));
  const DoorLockGeometry2 = new Three.CylinderGeometry(0.007, 0.007, 1.907, Math.round(32));
  const DoorLock1 = new Three.Mesh(DoorLockGeometry1, metalBlue);
  const DoorLock2 = new Three.Mesh(DoorLockGeometry2, metalBlueGrey);
  block.position.set(-0.275, 0.7 / 2, 0);
  block.scale.x = 1 / 1.3;
  DoorLock1.add(DoorLock2);
  block.add(DoorLock1);

  return block;
}

function makeLock() {
  const mechanism = new Three.Object3D();
  const BaseGeometry = new Three.BoxGeometry(0.01, 0.1, 0.02);
  const FirstBlockGeometry = new Three.BoxGeometry(0.01, 0.02, 0.01);
  const SecondBlockGeometry = new Three.BoxGeometry(0.006, 0.04, 0.008);
  const base = new Three.Mesh(BaseGeometry, metalBlue);
  const FirstBlock = new Three.Mesh(FirstBlockGeometry, metalBlueGrey);
  const SecondBlock = new Three.Mesh(SecondBlockGeometry, metalBlueGrey);
  FirstBlock.position.set(-0.008 / 2, 0.03, 0);
  SecondBlock.position.y = -0.05;
  FirstBlock.add(SecondBlock);
  base.add(FirstBlock);
  mechanism.add(base);

  return mechanism;
}

function makeSafetyHandle() {
  const handle = new Three.Object3D();
  const handleSupportGeometry = new Three.BoxGeometry(0.5, 0.1, 0.005);
  const PushButtonGeometry = new Three.CylinderGeometry(0.04, 0.04, 0.48, Math.round(32));
  const PushButtonCoverGeometry = new Three.CylinderGeometry(0.042, 0.042, 0.01, Math.round(32));
  const handleSupport = new Three.Mesh(handleSupportGeometry, black);
  const pushButton = new Three.Mesh(PushButtonGeometry, red);
  const pushButtonCover1 = new Three.Mesh(PushButtonCoverGeometry, black);
  const pushButtonCover2 = new Three.Mesh(PushButtonCoverGeometry, black);
  handleSupport.position.z = 0.005 / 2;
  pushButton.rotation.z = Math.PI / 2;
  pushButtonCover1.position.y = 0.48 / 2 + 0.01 / 2;
  pushButtonCover2.position.y = -0.48 / 2 - 0.01 / 2;
  pushButton.add(pushButtonCover1);
  pushButton.add(pushButtonCover2);
  handleSupport.add(pushButton);
  handle.add(handleSupport);

  return handle;
}

function makePivot() {
  const DoorPivot = new Three.Object3D();
  const DownPivotGeometry = new Three.CylinderGeometry(0.009, 0.009, 0.04, Math.round(32));
  const UpPivotGeometry = new Three.CylinderGeometry(0.01, 0.01, 0.04, Math.round(32));
  const downPivot1 = new Three.Mesh(DownPivotGeometry, green);
  const upPivot1 = new Three.Mesh(UpPivotGeometry, green);
  const downPivot2 = new Three.Mesh(DownPivotGeometry, green);
  const upPivot2 = new Three.Mesh(UpPivotGeometry, green);
  downPivot1.position.y = -0.4;
  upPivot1.position.y = 0.04;
  downPivot2.position.y = 1;
  upPivot2.position.y = 0.04;
  downPivot2.add(upPivot2);
  downPivot1.add(upPivot1);
  DoorPivot.add(downPivot2);
  DoorPivot.add(downPivot1);

  return DoorPivot;
}

function makeHandle() {
  const handle = new Three.Object3D();
  const handleBase = makeHandleBase();
  const hilt = makeHilt();
  hilt.rotation.x = Math.PI / 2;
  hilt.position.set(0, 0.04, -0.03 / 2 - 0.01 / 2);
  handle.add(handleBase);
  handle.add(hilt);
  handle.scale.set(1.1, 1.1, 1.1);

  return handle;
}

function makeHilt() {
  const hilt = new Three.Object3D();
  const GeometryPiece1 = new Three.CylinderGeometry(0.01, 0.01, 0.03, Math.round(32));
  const GeometryPiece2 = new Three.SphereGeometry(0.01, Math.round(32), Math.round(32));
  const GeometryPiece3 = new Three.CylinderGeometry(0.01, 0.01, 0.07, Math.round(32));
  const piece1 = new Three.Mesh(GeometryPiece1, black);
  const piece2 = new Three.Mesh(GeometryPiece2, black);
  const piece3 = new Three.Mesh(GeometryPiece3, black);
  const piece4 = new Three.Mesh(GeometryPiece2, black);
  piece3.rotation.z = Math.PI / 2;
  piece3.position.x = 0.07 / 2;
  piece2.position.y = -0.03 / 2;
  piece4.position.y = -0.07 / 2;
  piece3.add(piece4);
  piece2.add(piece3);
  piece1.add(piece2);
  hilt.add(piece1);

  return hilt;
}

function makeHandleBase() {
  const base = new Three.Object3D();
  const BaseGeometry1 = new Three.BoxGeometry(0.038, 0.14, 0.01);
  const BaseGeometry2 = new Three.CylinderGeometry(0.023, 0.023, 0.01, Math.round(32));
  const lock = makeLockKey();
  const base1 = new Three.Mesh(BaseGeometry1, black);
  const base2 = new Three.Mesh(BaseGeometry2, black);
  lock.rotation.x = Math.PI / 2;
  lock.position.y = -0.03;
  base2.rotation.x = Math.PI / 2;
  base2.position.y = -0.033;
  base2.scale.z = 1.5;
  base1.add(lock);
  base1.add(base2);
  base.add(base1);

  return base;
}

function makeLockKey() {
  const lock = new Three.Object3D();
  const geometryLock1 = new Three.CylinderGeometry(0.005, 0.005, 0.02, Math.round(32));
  const geometryLock2 = new Three.BoxGeometry(0.008, 0.02, 0.02);
  const geometryLock3 = new Three.BoxGeometry(0.007, 0.0203, 0.0018);
  const lockPiece1 = new Three.Mesh(geometryLock1, metalBlue);
  const lockPiece2 = new Three.Mesh(geometryLock2, metalBlue);
  const lockPiece3 = new Three.Mesh(geometryLock3, metalBlueGrey);
  lockPiece2.position.z = 0.01;
  lockPiece1.add(lockPiece2);
  lockPiece1.add(lockPiece3);
  lock.add(lockPiece1);

  return lock;
}

function makeDoorStructure() {
  const door = new Three.Object3D();
  const lowBaseDoorGeometry = new Three.BoxGeometry(0.6, 1.2, 0.01);
  const middleBaseDoorGeometry = new Three.BoxGeometry(0.2, 0.7, 0.01);
  const highBaseDoorGeometry = new Three.BoxGeometry(0.2, 0.2, 0.01);
  const BorderCoverDoorGeometry1 = new Three.CylinderGeometry(0.005, 0.005, 1.9, Math.round(32));
  const BorderCoverDoorGeometry2 = new Three.BoxGeometry(0.03, 1.9, 0.01);
  const MiddleDoorGeometry2 = new Three.BoxGeometry(0.2, 0.7, 0.06);
  const MiddleDoorGeometry1 = new Three.BoxGeometry(0.19, 0.7, 0.06);
  const HighDoorGeometry = new Three.BoxGeometry(0.2, 0.2, 0.06);
  const glassGeometry = new Three.BoxGeometry(0.2, 0.5, 0.05);
  const LowDoorGeometry = new Three.BoxGeometry(0.59, 1.2, 0.06);
  const glassCoverVertical = new Three.BoxGeometry(0.01, 0.52, 0.064);
  const glassCoverHorizontal = new Three.BoxGeometry(0.224, 0.01, 0.064);
  const lowCoverDoor = new Three.Mesh(lowBaseDoorGeometry, green);
  const middleDoor1 = new Three.Mesh(MiddleDoorGeometry1, green);
  const middleDoor2 = new Three.Mesh(MiddleDoorGeometry2, green);
  const baseDoor = new Three.Mesh(LowDoorGeometry, green);
  const middleCoverDoor1 = new Three.Mesh(middleBaseDoorGeometry, green);
  const middleCoverDoor2 = new Three.Mesh(middleBaseDoorGeometry, green);
  const highCoverDoor = new Three.Mesh(highBaseDoorGeometry, green);
  const highDoor = new Three.Mesh(HighDoorGeometry, green);
  const borderCoverDoor1 = new Three.Mesh(BorderCoverDoorGeometry1, green);
  const borderCoverDoor2 = new Three.Mesh(BorderCoverDoorGeometry2, green);
  const glass = new Three.Mesh(glassGeometry, turquoise);
  const glassVerticalCover1 = new Three.Mesh(glassCoverVertical, green);
  const glassVerticalCover2 = new Three.Mesh(glassCoverVertical, green);
  const glassHorizontalCover1 = new Three.Mesh(glassCoverHorizontal, green);
  const glassHorizontalCover2 = new Three.Mesh(glassCoverHorizontal, green);
  lowCoverDoor.position.set(-(0.6 - 0.59) / 2, 0, -0.05 / 2);
  middleCoverDoor1.position.set(-0.2, 1.2 / 2 + 0.7 / 2, 0);
  middleCoverDoor2.position.set(0.2, 1.2 / 2 + 0.7 / 2, 0);
  highCoverDoor.position.set(0, (0.5 + 0.2) / 2, -0.05 / 2);
  highDoor.position.set(0, (0.5 + 0.2) / 2, -0.05 / 2 + 0.05 / 2);
  glass.position.set(-0.01 / 2, 1.2 / 2 + 0.5 / 2, 0);
  middleDoor2.position.z = 0.05 / 2;
  middleDoor1.position.set(0.005, 0, 0.05 / 2);
  borderCoverDoor1.position.set(-0.6 / 2, 0.7 / 2, 0);
  glassVerticalCover1.position.x = 0.2 / 2 + 0.014 / 2;
  glassVerticalCover2.position.x = -0.2 / 2 - 0.014 / 2;
  glassHorizontalCover1.position.y = 0.5 / 2 + 0.014 / 2;
  glassHorizontalCover2.position.y = -0.5 / 2 - 0.014 / 2;
  borderCoverDoor2.position.set(0.02 / 2, 0, -0.01 / 2);
  borderCoverDoor1.add(borderCoverDoor2);
  glass.add(highCoverDoor);
  glass.add(glassVerticalCover1);
  glass.add(glassVerticalCover2);
  glass.add(glassHorizontalCover1);
  glass.add(glassHorizontalCover2);
  glass.add(highCoverDoor);
  glass.add(highDoor);
  baseDoor.add(glass);
  middleCoverDoor1.add(middleDoor1);
  middleCoverDoor2.add(middleDoor2);
  lowCoverDoor.add(borderCoverDoor1);
  lowCoverDoor.add(middleCoverDoor1);
  lowCoverDoor.add(middleCoverDoor2);
  baseDoor.add(lowCoverDoor);
  door.add(baseDoor);
  door.scale.x = 0.9;

  return door;
}

export default defineCatalogElement({
  name: 'double panic door',
  prototype: 'holes',

  info: {
    tag: ['door'],
    title: 'double panic door',
    description: 'iron door',
    image: require('./panicDoorDouble.png')
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
    const arcPath = `M${0},${0}  A${holeWidth / 2},${holeWidth / 2} 0 0,1 ${holeWidth / 2},${holeWidth / 2}`;
    const arcPath2 = `M${0},${0}  A${holeWidth / 2},${holeWidth / 2} 0 0,0 ${holeWidth / 2},${holeWidth / 2}`;
    const holeStyle = element.selected ? STYLE_HOLE_SELECTED : STYLE_HOLE_BASE;
    const arcStyle = element.selected ? STYLE_ARC_SELECTED : STYLE_ARC_BASE;
    const length = element.properties.width.length;

    if (flip) {
      return (
        <g transform={`translate(${-element.properties.width.length / 2}, 0)`}>
          <path key='1' d={arcPath} style={arcStyle} transform={`translate(${0},${-holeWidth / 2})`} />
          <line key='2' x1={0} y1={0 - epsilon} x2={0} y2={-holeWidth / 2 - epsilon} style={holeStyle} />
          <path key='3' d={arcPath2} style={arcStyle} transform={`translate(${holeWidth},${-holeWidth / 2}) rotate(90)`} />
          <line key='4' x1={holeWidth} y1={0 - epsilon} x2={holeWidth} y2={-holeWidth / 2 - epsilon} style={holeStyle} />
          <path key='5' d={holePath} style={holeStyle} />
        </g>
      )
    }
    else {
      return (
        <g transform={`translate(${-element.properties.width.length / 2}, 0)`}>
          <path key='1' d={arcPath} style={arcStyle} transform={`translate(${holeWidth},${holeWidth / 2}) rotate(180)`} />
          <line key='2' x1={0} y1={0 - epsilon} x2={0} y2={holeWidth / 2 - epsilon} style={holeStyle} />
          <path key='3' d={arcPath2} style={arcStyle} transform={`translate(${0},${holeWidth / 2}) rotate(270)`} />
          <line key='4' x1={holeWidth} y1={0 - epsilon} x2={holeWidth} y2={holeWidth / 2 - epsilon} style={holeStyle} />
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

    const panicDoorDouble = new Three.Object3D();
    panicDoorDouble.add(makePanicDoor().clone());

    const valuePosition = new Three.Box3().setFromObject(panicDoorDouble);

    const deltaX = Math.abs(valuePosition.max.x - valuePosition.min.x);
    const deltaY = Math.abs(valuePosition.max.y - valuePosition.min.y);
    const deltaZ = Math.abs(valuePosition.max.z - valuePosition.min.z);

    if (element.selected) {
      const boundingBox = new Three.BoxHelper(panicDoorDouble, 0x99c3fb);
      boundingBox.material.linewidth = 5;
      boundingBox.renderOrder = 1000;
      boundingBox.material.depthTest = false;
      panicDoorDouble.add(boundingBox);
    }

    if (flip) {
      panicDoorDouble.rotation.y += Math.PI;
    }

    panicDoorDouble.position.y += newAltitude;
    panicDoorDouble.scale.set(width / deltaX, height / deltaY, thickness / deltaZ);

    return panicDoorDouble;
  }
});
