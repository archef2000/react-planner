import { MeshBasicMaterial, Mesh, BoxHelper } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import React from 'react';
import { HELVETIKER } from './helvetiker_regular.typeface';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { defineCatalogElement } from '@archef2000/react-planner';

const fontLoader = new FontLoader();
const font = fontLoader.parse(HELVETIKER);

const defaultFontSize = 16;
const defaultColor = '#000000';

export default defineCatalogElement({
  name: 'text',
  prototype: 'items',

  info: {
    tag: ['text'],
    title: 'Text 3D',
    description: 'Text',
    image: require('./img.png')
  },

  properties: {
    text: {
      label: 'text',
      type: 'string',
      defaultValue: 'Custom Text'
    },
    fontSize: {
      label: 'font size',
      type: 'number',
      defaultValue: defaultFontSize
    },
    color: {
      label: 'text color',
      type: 'color',
      defaultValue: defaultColor
    },
    altitude: {
      label: 'altitude',
      type: 'length-measure',
      defaultValue: {
        length: 0
      }
    }
  },

  render2D: function (element, layer, scene) {
    const color = element.properties.color || defaultColor;
    const text = element.properties.text || '';
    const fontSize = element.properties.fontSize || defaultFontSize;
    const textHorizontalPadding = defaultFontSize;
    const width = ((text.length - (text.length / 2)) * fontSize) + textHorizontalPadding;
    const height = 2 * fontSize;

    return (
      <g>
        <rect
          x={-width / 2}
          y={-height / 2}
          fill="#FFF"
          width={width}
          height={height}
          stroke="#000"
          strokeWidth="2"
        />
        <text
          x="0"
          y="0"
          fontFamily="Arial"
          alignmentBaseline="middle"
          textAnchor="middle"
          fontSize={fontSize}
          fill={color}
          transform={'scale(1,-1)'}
        >
          {text}
        </text>
      </g>
    )
  },

  async render3D(element, layer, scene) {
    const text = element.properties.text || '';
    const size = element.properties.fontSize || defaultFontSize;
    const textHorizontalPadding = defaultFontSize;
    const width = ((text.length - (text.length / 2)) * size) + textHorizontalPadding;
    const color = element.properties.color || defaultColor;

    const mesh = new Mesh(
      new TextGeometry(text, { size, depth: 1, font }),
      new MeshBasicMaterial({ color })
    );

    if (element.selected) {
      const box = new BoxHelper(mesh, 0x99c3fb);
      box.material.linewidth = 2;
      box.material.depthTest = false;
      box.renderOrder = 1000;
      mesh.add(box);
    }

    mesh.position.y += element.properties.altitude.length;
    mesh.position.x -= (width / 2);

    return mesh;
  }
});
