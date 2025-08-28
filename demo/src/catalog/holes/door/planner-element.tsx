import React from 'react';
import * as Three from 'three';
import { loadObjWithMaterial } from '../../utils/load-obj';
import { Object3DEventMap, Group } from 'three';
import { defineCatalogElement } from '@archef2000/react-planner';

let cached3DDoor: Group<Object3DEventMap>;

const STYLE_HOLE_BASE = { stroke: '#000', strokeWidth: '3px', fill: '#000' } as const;
const STYLE_HOLE_SELECTED = { stroke: '#0096fd', strokeWidth: '4px', fill: '#0096fd', cursor: 'move' } as const;
const STYLE_ARC_BASE = { stroke: '#000', strokeWidth: '3px', strokeDasharray: '5,5', fill: 'none' } as const;
const STYLE_ARC_SELECTED = { stroke: '#0096fd', strokeWidth: '4px', strokeDasharray: '5,5', fill: 'none', cursor: 'move' } as const;
const EPSILON = 3;

export default defineCatalogElement({
  name: 'door',
  prototype: 'holes',

  info: {
    title: 'door',
    tag: ['door'],
    description: 'Wooden door',
    image: require('./door.png')
  },

  properties: {
    width: {
      label: 'Width',
      type: 'length-measure',
      defaultValue: {
        length: 80
      }
    },
    height: {
      label: 'Height',
      type: 'length-measure',
      defaultValue: {
        length: 215
      }
    },
    altitude: {
      label: 'Altitude',
      type: 'length-measure',
      defaultValue: {
        length: 0
      }
    },
    thickness: {
      label: 'Thickness',
      type: 'length-measure',
      defaultValue: {
        length: 30
      }
    },
    flip_orizzontal: {
      label: 'flip orizzontale',
      type: 'checkbox',
      defaultValue: false,
      values: {
        'none': false,
        'yes': true
      }
    }
  },

  render2D: function (element, layer, scene) {
    const flip = element.properties.flip_orizzontal;
    const holeWidth = element.properties.width.length;
    const holePath = `M${0} ${-EPSILON}  L${holeWidth} ${-EPSILON}  L${holeWidth} ${EPSILON}  L${0} ${EPSILON}  z`;
    const arcPath = `M${0},${0}  A${holeWidth},${holeWidth} 0 0,1 ${holeWidth},${holeWidth}`;
    const holeStyle = element.selected ? STYLE_HOLE_SELECTED : STYLE_HOLE_BASE;
    const arcStyle = element.selected ? STYLE_ARC_SELECTED : STYLE_ARC_BASE;
    const length = element.properties.width.length;

    if (flip == false) {
      return (
        <g transform={`translate(${-length / 2}, 0)`}>
          <path d={arcPath} style={arcStyle} transform={`translate(${0},${holeWidth}) scale(${1},${-1}) rotate(${0})`} />
          <line x1={0} y1={holeWidth - EPSILON} x2={0} y2={0 - EPSILON} style={holeStyle} transform={`scale(${-1},${1})`} />
          <path d={holePath} style={holeStyle} />
        </g>
      )
    }
    else {
      return (
        <g transform={`translate(${-length / 2}, 0)`}>
          <path d={arcPath} style={arcStyle} transform={`translate(${0},${-holeWidth}) scale(${1},${1}) rotate(${0})`} />
          <line x1={0} y1={-holeWidth - EPSILON} x2={0} y2={0 - EPSILON} style={holeStyle} transform={`scale(${-1},${1})`} />
          <path d={holePath} style={holeStyle} />
        </g>
      )
    }
  },

  render3D: async function (element, layer, scene) {
    const onLoadItem = (object: Group<Object3DEventMap>) => {
      const boundingBox = new Three.Box3().setFromObject(object);

      const initialWidth = boundingBox.max.x - boundingBox.min.x;
      const initialHeight = boundingBox.max.y - boundingBox.min.y;
      const initialThickness = boundingBox.max.z - boundingBox.min.z;

      if (element.selected) {
        const box = new Three.BoxHelper(object, 0x99c3fb);
        box.material.linewidth = 2;
        box.material.depthTest = false;
        box.renderOrder = 1000;
        object.add(box);
      }

      const width = element.properties.width.length;
      const height = element.properties.height.length;
      const thickness = element.properties.thickness.length;

      object.scale.set(width / initialWidth, height / initialHeight,
        thickness / initialThickness);

      return object;
    };

    if (cached3DDoor) {
      return onLoadItem(cached3DDoor.clone());
    }

    const mtl = require('./door.mtl');
    const obj = require('./door.obj');
    const img = require('./texture.jpg');
    const resourcePath = img.substr(0, img.lastIndexOf("/")) + "/";

    cached3DDoor = await loadObjWithMaterial(mtl, obj, resourcePath);
    return onLoadItem(cached3DDoor.clone());
  }
});
