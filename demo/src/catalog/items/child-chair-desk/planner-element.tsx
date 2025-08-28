import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const WIDTH = 70;
const DEPTH = 100;
const HEIGHT = 100;

export default defineCatalogElement({
  name: 'child chair desk',
  prototype: 'items',

  info: {
    tag: ['furnishings', 'wood', 'metal'],
    title: 'child chair desk',
    description: 'child chair desk',
    image: require('./chairDesk.png')
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
    let angle = element.rotation;

    if (angle > -180 && angle < 0)
      angle = 360;
    else
      angle = 0;

    const rect_style = { stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: '#84e1ce' };

    return (
      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`}>
        <rect key='1' x='0' y='0' width={WIDTH} height={DEPTH} style={rect_style} />
        <text key='2' x='0' y='0' transform={`translate(${WIDTH / 2}, ${DEPTH / 2}) scale(1,-1) rotate(${angle / 2})`}
          style={{ textAnchor: 'middle', fontSize: '11px' }}>
          {element.type}
        </text>
      </g>
    )
  },

  async render3D(element, layer, scene) {
    const grey = new Three.MeshLambertMaterial({ color: 0xd9d7d7 });
    const red = new Three.MeshPhongMaterial({ color: 0xff0000 });
    const black = new Three.MeshPhongMaterial({ color: 0x000000 });

    const newAltitude = element.properties.altitude.length;

    const chairDesk = new Three.Object3D();

    const roundedRectShapeTable = new Three.Shape();

    const x = 0;
    const y = 0;
    const width = 1;
    const height = 1.2;
    const radius = 0.25;

    roundedRectShapeTable.moveTo(x, y + radius);
    roundedRectShapeTable.lineTo(x, y + height - radius);
    roundedRectShapeTable.quadraticCurveTo(x, y + height, x + radius, y + height);
    roundedRectShapeTable.lineTo(x + width - radius, y + height);
    roundedRectShapeTable.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    roundedRectShapeTable.lineTo(x + width, y + radius);
    roundedRectShapeTable.quadraticCurveTo(x + width, y, x + width - radius, y);
    roundedRectShapeTable.lineTo(x + radius, y);
    roundedRectShapeTable.quadraticCurveTo(x, y, x, y + radius);

    const extrudeSettingsTable = {
      steps: 2,
      depth: 0.1,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 1
    };

    const tableGeometry = new Three.ExtrudeGeometry(roundedRectShapeTable, extrudeSettingsTable);
    const table = new Three.Mesh(tableGeometry, red);

    table.position.set(0, 1.2, 0);
    table.rotation.x += Math.PI / 2;
    chairDesk.add(table);

    const baseGeometry = new Three.CylinderGeometry(0.08, 0.08, 1, 32);
    const baseVerticalGeometry = new Three.CylinderGeometry(0.08, 0.08, .6, 32);
    const unionGeometry = new Three.CylinderGeometry(0.08, 0.08, .2, 32);
    const footGeometry = new Three.CylinderGeometry(0.06, 0.06, .025, 32);
    const closureGeometry = new Three.CylinderGeometry(0.08, 0.08, .02, 32);

    const basePiece1 = new Three.Mesh(baseGeometry, grey);
    basePiece1.rotation.x += Math.PI / 2;
    basePiece1.position.set(0.5, 0.6, 0.6);
    table.add(basePiece1);

    const basePiece2 = new Three.Mesh(baseGeometry, grey);
    basePiece2.position.set(0.5, 0.6, 1.1);
    table.add(basePiece2);

    const basePiece3 = new Three.Mesh(baseGeometry, grey);
    basePiece3.rotation.z += Math.PI / 2;
    basePiece3.position.set(0, 0.6, 1.1);
    table.add(basePiece3);

    const baseVerticalPiece = new Three.Mesh(baseVerticalGeometry, grey);
    baseVerticalPiece.rotation.x += Math.PI / 2;
    baseVerticalPiece.position.set(-0.5, 0.6, 0.8);
    table.add(baseVerticalPiece);

    const unionPiece = new Three.Mesh(unionGeometry, grey);
    unionPiece.position.set(-0.5, 0.6, 1.1);
    table.add(unionPiece);

    const foot1 = new Three.Mesh(footGeometry, black);
    foot1.position.set(0.5, 0.2, 1.18);
    foot1.rotation.x += Math.PI / 2;
    table.add(foot1);

    const foot2 = new Three.Mesh(footGeometry, black);
    foot2.position.set(0.5, 1, 1.18);
    foot2.rotation.x += Math.PI / 2;
    table.add(foot2);

    const foot3 = new Three.Mesh(footGeometry, black);
    foot3.position.set(-.9, 0, 1.18);
    foot3.rotation.x += Math.PI / 2;
    table.add(foot3);

    const foot4 = new Three.Mesh(footGeometry, black);
    foot4.position.set(-.9, 1.2, 1.18);
    foot4.rotation.x += Math.PI / 2;
    table.add(foot4);

    const closurePiece1 = new Three.Mesh(closureGeometry, grey);
    closurePiece1.position.set(-1, 0, 1.1);
    closurePiece1.rotation.z += Math.PI / 2;
    table.add(closurePiece1);

    const closurePiece2 = new Three.Mesh(closureGeometry, grey);
    closurePiece2.position.set(-1, 1.2, 1.1);
    closurePiece2.rotation.z += Math.PI / 2;
    table.add(closurePiece2);

    const curve = new Three.CatmullRomCurve3([
      new Three.Vector3(.35, 0, 0),
      new Three.Vector3(0, 0, 0),
      new Three.Vector3(-.05, .25, 0),
    ]);

    const barGeometry = new Three.TubeGeometry(curve, 32, 0.03, 16, false);
    const leftBar = new Three.Mesh(barGeometry, grey);
    leftBar.rotation.x -= Math.PI / 2;
    leftBar.position.set(-1, .35, .48);
    table.add(leftBar);

    const rightBar = new Three.Mesh(barGeometry, grey);
    rightBar.position.set(-1, .85, .48);
    rightBar.rotation.x -= Math.PI / 2;
    table.add(rightBar);

    const baseCurvedGeometry = new Three.TorusGeometry(.5, .08, 32, 32, Math.PI / 2);
    const baseCurvePiece1 = new Three.Mesh(baseCurvedGeometry, grey);
    baseCurvePiece1.position.set(-1, .70, 1.1);
    table.add(baseCurvePiece1);

    const baseCurvePiece2 = new Three.Mesh(baseCurvedGeometry, grey);
    baseCurvePiece2.rotation.x += Math.PI;
    baseCurvePiece2.position.set(-1, .50, 1.1);
    table.add(baseCurvePiece2);

    const roundedRectShapeStairPiece1 = new Three.Shape();

    const x1 = 0;
    const y1 = 0;
    const width1 = .8;
    const height1 = .8;
    const radius1 = 0.25;

    roundedRectShapeStairPiece1.moveTo(x1, y1 + radius1);
    roundedRectShapeStairPiece1.lineTo(x1, y1 + height1 - radius1);
    roundedRectShapeStairPiece1.quadraticCurveTo(x1, y1 + height1, x1 + radius1, y1 + height1);
    roundedRectShapeStairPiece1.lineTo(x1 + width1 - radius1, y1 + height1);
    roundedRectShapeStairPiece1.quadraticCurveTo(x1 + width1, y1 + height1, x1 + width1, y1 + height1 - radius1);
    roundedRectShapeStairPiece1.lineTo(x1 + width1, y1 + radius1);
    roundedRectShapeStairPiece1.quadraticCurveTo(x1 + width1, y1, x1 + width1 - radius1, y1);
    roundedRectShapeStairPiece1.lineTo(x1 + radius1, y1);
    roundedRectShapeStairPiece1.quadraticCurveTo(x1, y1, x1, y1 + radius1);

    const extrudeSettingsStairPiece1 = {
      steps: 2,
      depth: 0.1,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 1
    };

    const stairGeometryPiece1 = new Three.ExtrudeGeometry(roundedRectShapeStairPiece1, extrudeSettingsStairPiece1);
    const stairPiece1 = new Three.Mesh(stairGeometryPiece1, red);

    stairPiece1.position.set(-.9, .2, .45);
    table.add(stairPiece1);

    const roundedRectShapeStairPiece2 = new Three.Shape();

    const x2 = 0;
    const y2 = 0;
    const width2 = .8;
    const height2 = .8;
    const radius2 = 0.25;

    roundedRectShapeStairPiece2.moveTo(x2, y2 + radius2);
    roundedRectShapeStairPiece2.lineTo(x2, y2 + height2 - radius2);
    roundedRectShapeStairPiece2.quadraticCurveTo(x2, y2 + height2, x2 + radius2, y2 + height2);
    roundedRectShapeStairPiece2.lineTo(x2 + width2 - radius2, y2 + height2);
    roundedRectShapeStairPiece2.quadraticCurveTo(x2 + width2, y2 + height2, x2 + width2, y2 + height2 - radius2);
    roundedRectShapeStairPiece2.lineTo(x2 + width2, y2 + radius2);
    roundedRectShapeStairPiece2.quadraticCurveTo(x2 + width2, y2, x2 + width2 - radius2, y2);
    roundedRectShapeStairPiece2.lineTo(x2 + radius2, y2);
    roundedRectShapeStairPiece2.quadraticCurveTo(x2, y2, x2, y2 + radius2);

    const holePath = new Three.Path();
    holePath.moveTo(3.5, 3.5);
    holePath.absellipse(.65, .4, .035, .125, .125, Math.PI * 2, false);
    roundedRectShapeStairPiece2.holes.push(holePath);

    const stairGeometryPiece2 = new Three.ExtrudeGeometry(roundedRectShapeStairPiece2, extrudeSettingsStairPiece1);
    const stairPiece2 = new Three.Mesh(stairGeometryPiece2, red);
    stairPiece2.position.set(-1.08, .2, .45);
    stairPiece2.rotation.y += Math.PI / 2;
    table.add(stairPiece2);

    const value = new Three.Box3().setFromObject(chairDesk);

    const deltaX = Math.abs(value.max.x - value.min.x);
    const deltaY = Math.abs(value.max.y - value.min.y);
    const deltaZ = Math.abs(value.max.z - value.min.z);

    if (element.selected) {
      const boundingBox = new Three.BoxHelper(chairDesk, 0x99c3fb);
      boundingBox.material.linewidth = 5;
      boundingBox.renderOrder = 1000;
      boundingBox.material.depthTest = false;
      chairDesk.add(boundingBox);
    }

    chairDesk.rotation.y += Math.PI / 2;
    chairDesk.position.x += -DEPTH / 2.75;
    chairDesk.scale.set(WIDTH / deltaZ, HEIGHT / deltaY, 1.25 * DEPTH / deltaX);

    return chairDesk;
  }
});
