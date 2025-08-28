import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const WIDTH = 300;
const DEPTH = 20;
const HEIGHT = 150;

export default defineCatalogElement({
  name: "blackboard",
  prototype: "items",

  info: {
    tag: ['furnishings'],
    title: "Blackboard",
    description: "Blackboard",
    image: require('./blackboard.png')
  },

  properties: {
    altitude: {
      label: "altitude",
      type: "length-measure",
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

    const rect_style = { stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: "#84e1ce" } as const;
    const arrow_style = { stroke: element.selected ? '#0096fd' : undefined, strokeWidth: "2px", fill: "#84e1ce" } as const;

    return (
      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`}>
        <rect key="1" x="0" y="0" width={WIDTH} height={DEPTH} style={rect_style} />
        <line key="2" x1={WIDTH / 2} x2={WIDTH / 2} y1={DEPTH} y2={1.8 * DEPTH} style={arrow_style} />
        <line key="3" x1={.45 * WIDTH} x2={WIDTH / 2} y1={1.2 * DEPTH} y2={1.8 * DEPTH} style={arrow_style} />
        <line key="4" x1={WIDTH / 2} x2={.55 * WIDTH} y1={1.8 * DEPTH} y2={1.2 * DEPTH} style={arrow_style} />
        <text key="5" x="0" y="0" transform={`translate(${WIDTH / 2}, ${DEPTH / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: "middle", fontSize: "11px" }}>
          {element.type}
        </text>
      </g>
    )
  },

  async render3D(element, layer, scene) {
    const newAltitude = element.properties.altitude.length;

    //colors
    const grey = new Three.MeshLambertMaterial({ color: 0xCCCCCC });
    const grey2 = new Three.MeshLambertMaterial({ color: 0x414449 });

    const lavagna = new Three.Object3D();

    const roundedRectShape = new Three.Shape();

    const x = 0;
    const y = 0;
    const width = 8;
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
      depth: 0.2,
      bevelEnabled: false,
      bevelThickness: .4,
      bevelSize: .4,
      bevelSegments: 1
    };

    const geometry = new Three.ExtrudeGeometry(roundedRectShape, extrudeSettings);
    const mesh = new Three.Mesh(geometry, grey);
    mesh.position.set(0, 1.2, 0);
    lavagna.add(mesh);

    const geometry2 = new Three.BoxGeometry(width - width / 11, height - height / 8, .2);
    const mesh2 = new Three.Mesh(geometry2, grey2);
    mesh2.position.set(4, 3.2, 0.07);
    lavagna.add(mesh2);

    const geometry3 = new Three.BoxGeometry(width, height / 50, .33);
    const mesh3 = new Three.Mesh(geometry3, grey);
    mesh3.position.set(4, 1.0, -0.095);
    lavagna.add(mesh3);

    const geometry4 = new Three.BoxGeometry(width, height / 50, .25);
    const mesh4 = new Three.Mesh(geometry4, grey);
    mesh4.rotation.x += Math.PI / 2;
    mesh4.position.set(4, 1.1, 0.03);
    lavagna.add(mesh4);

    const mesh5 = new Three.Mesh(geometry4, grey);
    mesh5.rotation.x += Math.PI / 2;
    mesh5.position.set(4, 1.1, -0.22);
    lavagna.add(mesh5);

    const value = new Three.Box3().setFromObject(lavagna);

    const deltaX = Math.abs(value.max.x - value.min.x);
    const deltaY = Math.abs(value.max.y - value.min.y);
    const deltaZ = Math.abs(value.max.z - value.min.z);

    if (element.selected) {
      const bbox = new Three.BoxHelper(lavagna, 0x99c3fb);
      bbox.material.linewidth = 5;
      bbox.renderOrder = 1000;
      bbox.material.depthTest = false;
      lavagna.add(bbox);
    }

    lavagna.position.y += -HEIGHT / 3.2 + newAltitude;
    lavagna.position.x += -WIDTH / 2;
    lavagna.position.z += DEPTH / 4;

    lavagna.scale.set(WIDTH / deltaX, HEIGHT / deltaY, DEPTH / deltaZ);

    return lavagna;
  }
});
