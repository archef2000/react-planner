import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const WIDTH = 200;
const DEPTH = 60;
const HEIGHT = 150;

//colors
const white = new Three.MeshLambertMaterial({ color: 0xffffff });
const grey = new Three.MeshLambertMaterial({ color: 0xdddddd });
const grey2 = new Three.MeshLambertMaterial({ color: 0x414449 });

export default defineCatalogElement({
  name: 'multimedia chalkboard',
  prototype: 'items',

  info: {
    tag: ['furnishings', 'wood', 'metal'],
    title: 'multimedia chalkboard',
    description: 'multimedia chalkboard',
    image: require('./lim.png')
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

    const rect_style = { stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: '#84e1ce' };

    return (
      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`}>
        <rect key='1' x='0' y='0' width={WIDTH} height={DEPTH} style={rect_style} />
        <text key='2' x='0' y='0' transform={`translate(${WIDTH / 2}, ${DEPTH / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: 'middle', fontSize: '11px' }}>
          {element.type}
        </text>
      </g>
    )
  },

  async render3D(element, layer, scene) {
    const newAltitude = element.properties.altitude.length;

    const lim = new Three.Object3D();

    const roundedRectShape = new Three.Shape();

    const x = 0;
    const y = 0;
    const width = 5;
    const height = 4;
    const radius = 0.25;

    roundedRectShape.moveTo(x, y + radius);
    roundedRectShape.lineTo(x, y + height - radius);
    roundedRectShape.quadraticCurveTo(x, y + height, x + radius, y + height);
    roundedRectShape.lineTo(x + width - radius, y + height);
    roundedRectShape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    roundedRectShape.lineTo(x + width, y + radius);
    roundedRectShape.quadraticCurveTo(x + width, y, x + width - radius, y);
    roundedRectShape.lineTo(x + radius, y);
    roundedRectShape.quadraticCurveTo(x, y, x, y + radius);

    const extrudeSettings = {
      steps: 1,
      depth: 0.003125,
      bevelEnabled: false,
      bevelThickness: .4,
      bevelSize: .4,
      bevelSegments: 1
    };

    const geometry = new Three.ExtrudeGeometry(roundedRectShape, extrudeSettings);
    const mesh = new Three.Mesh(geometry, grey);
    mesh.position.set(0, 1.2, 0);
    lim.add(mesh);

    const geometry2 = new Three.BoxGeometry(width - width / 11, height - height / 8, .003125);
    const mesh2 = new Three.Mesh(geometry2, white);
    mesh2.position.set(2.5, 3.2, 0.00125);
    lim.add(mesh2);

    const roundedRectShape2 = new Three.Shape();

    const x2 = 0;
    const y2 = 0;
    const width2 = 1;
    const height2 = .6;
    const radius2 = 0.125;

    roundedRectShape2.moveTo(x2, y2 + radius2);
    roundedRectShape2.lineTo(x2, y2 + height2 - radius2);
    roundedRectShape2.quadraticCurveTo(x2, y2 + height2, x2 + radius2, y2 + height2);
    roundedRectShape2.lineTo(x2 + width2 - radius2, y2 + height2);
    roundedRectShape2.quadraticCurveTo(x2 + width2, y2 + height2, x2 + width2, y2 + height2 - radius2);
    roundedRectShape2.lineTo(x2 + width2, y2 + radius2);
    roundedRectShape2.quadraticCurveTo(x2 + width2, y2, x2 + width2 - radius2, y2);
    roundedRectShape2.lineTo(x2 + radius2, y2);
    roundedRectShape2.quadraticCurveTo(x2, y2, x2, y2 + radius2);

    const extrudeSettings2 = {
      steps: 1,
      depth: 0.003125,
      bevelEnabled: false,
      bevelThickness: .4,
      bevelSize: .4,
      bevelSegments: 1
    };

    const textureLoader = new Three.TextureLoader();
    const etichettaImage = textureLoader.load(require('./example_lim.png'));

    const geometryPlane = new Three.PlaneGeometry(4, 3);
    const material = new Three.MeshLambertMaterial({ map: etichettaImage, transparent: true });
    const plane = new Three.Mesh(geometryPlane, material);
    plane.position.set(2.5, 3.1, -.0005);
    plane.rotation.y += Math.PI;
    lim.add(plane);

    const geometry3 = new Three.ExtrudeGeometry(roundedRectShape2, extrudeSettings2);
    const mesh3 = new Three.Mesh(geometry3, grey);
    mesh3.position.set(width / 2 - width / 10, 5.35, 0);
    lim.add(mesh3);

    const roundedRectShape3 = new Three.Shape();

    const x3 = 0;
    const y3 = 0;
    const width3 = .45;
    const height3 = .25;
    const radius3 = 0.125;

    roundedRectShape3.moveTo(x3, y3 + radius3);
    roundedRectShape3.lineTo(x3, y3 + height3 - radius3);
    roundedRectShape3.quadraticCurveTo(x3, y3 + height3, x3 + radius3, y3 + height3);
    roundedRectShape3.lineTo(x3 + width3 - radius3, y3 + height3);
    roundedRectShape3.quadraticCurveTo(x3 + width3, y3 + height3, x3 + width3, y3 + height3 - radius3);
    roundedRectShape3.lineTo(x3 + width3, y3 + radius3);
    roundedRectShape3.quadraticCurveTo(x3 + width3, y3, x3 + width3 - radius3, y3);
    roundedRectShape3.lineTo(x3 + radius3, y3);
    roundedRectShape3.quadraticCurveTo(x3, y3, x3, y3 + radius3);

    const extrudeSettings3 = {
      steps: 1,
      depth: 0.0125,
      bevelEnabled: false,
      bevelThickness: .4,
      bevelSize: .4,
      bevelSegments: 1
    };

    const geometry4 = new Three.ExtrudeGeometry(roundedRectShape3, extrudeSettings3);
    const mesh4 = new Three.Mesh(geometry4, grey2);
    mesh4.position.set(width / 2 - width / 24, 5.45, -0.0125);
    lim.add(mesh4);

    const roundedRectShape4 = new Three.Shape();

    const x4 = 0;
    const y4 = 0;
    const width4 = .4;
    const height4 = .2;
    const radius4 = 0.10;

    roundedRectShape4.moveTo(x4, y4 + radius4);
    roundedRectShape4.lineTo(x4, y4 + height4 - radius4);
    roundedRectShape4.quadraticCurveTo(x4, y4 + height4, x4 + radius4, y4 + height4);
    roundedRectShape4.lineTo(x4 + width4 - radius4, y4 + height4);
    roundedRectShape4.quadraticCurveTo(x4 + width4, y4 + height4, x4 + width4, y4 + height4 - radius4);
    roundedRectShape4.lineTo(x4 + width4, y4 + radius4);
    roundedRectShape4.quadraticCurveTo(x4 + width4, y4, x4 + width4 - radius4, y4);
    roundedRectShape4.lineTo(x4 + radius4, y4);
    roundedRectShape4.quadraticCurveTo(x4, y4, x4, y4 + radius4);

    const extrudeSettings4 = {
      steps: 1,
      depth: 0.0125,
      bevelEnabled: false,
      bevelThickness: .4,
      bevelSize: .4,
      bevelSegments: 1
    };

    const geometry5 = new Three.ExtrudeGeometry(roundedRectShape4, extrudeSettings4);
    const mesh5 = new Three.Mesh(geometry5, grey2);
    mesh5.position.set(width / 2 - width / 27, 5.5, -0.02);
    lim.add(mesh5);


    const supportGeometry = new Three.CylinderGeometry(0.025, 0.035, 0.1, 32, 32, false, 0, 2 * Math.PI);
    const support = new Three.Mesh(supportGeometry, grey2);
    support.position.set(width / 2 - width / 1024, 5.45, -0.018);
    support.rotation.y += Math.PI / 2;
    support.scale.set(.05, 1, 4);
    lim.add(support);

    const roundedRectShape5 = new Three.Shape();

    const x5 = 0;
    const y5 = 0;
    const width5 = .4;
    const height5 = .2;
    const radius5 = 0.10;

    roundedRectShape5.moveTo(x5, y5);
    roundedRectShape5.lineTo(width5, y5);
    roundedRectShape5.lineTo(width5, height5);
    roundedRectShape5.lineTo(x5, height5);

    const extrudeSettings5 = {
      steps: 1,
      depth: 0.01,
      bevelEnabled: false,
      bevelThickness: .4,
      bevelSize: .4,
      bevelSegments: 1
    };

    const geometry6 = new Three.ExtrudeGeometry(roundedRectShape5, extrudeSettings5);
    const mesh6 = new Three.Mesh(geometry6, grey2);
    mesh6.position.set(width / 2 - width / 24.45, 5.2, -0.0225);
    lim.add(mesh6);

    const supportGeometry2 = new Three.CylinderGeometry(0.029, 0.029, 0.4, 32, 32, false, 0, 2 * Math.PI);
    const support2 = new Three.Mesh(supportGeometry2, grey2);
    support2.position.set(width / 2 - width / 1024, 5.2, -0.021);
    support2.rotation.y += Math.PI;
    support2.rotation.x += Math.PI / 2;
    support2.rotation.z += Math.PI / 2;
    support2.scale.set(.05, 1, 4);
    lim.add(support2);

    const value = new Three.Box3().setFromObject(lim);

    const deltaX = Math.abs(value.max.x - value.min.x);
    const deltaY = Math.abs(value.max.y - value.min.y);
    const deltaZ = Math.abs(value.max.z - value.min.z);


    if (element.selected) {
      const bbox = new Three.BoxHelper(lim, 0x99c3fb);
      bbox.material.linewidth = 5;
      bbox.renderOrder = 1000;
      bbox.material.depthTest = false;
      lim.add(bbox);
    }

    lim.rotation.y += Math.PI;
    lim.position.y += -HEIGHT / 3.2 + newAltitude;
    lim.position.x += WIDTH / 2;
    lim.position.z += -DEPTH / 3.5;

    lim.scale.set(WIDTH / deltaX, HEIGHT / deltaY, DEPTH / deltaZ);

    return lim;
  }
});
