import React from 'react';
import * as Three from 'three';
import { loadObjWithMaterial } from '../../utils/load-obj';
import { Group, Object3DEventMap } from 'three';
import { defineCatalogElement } from '@archef2000/react-planner';

let cached3DWindow: Group<Object3DEventMap>;

export default defineCatalogElement({
  name: "sash window",
  prototype: "holes",

  info: {
    title: "sash window",
    tag: ['window'],
    description: "Sash window",
    image: require('./window.png')
  },

  properties: {
    width: {
      label: "Width",
      type: "length-measure",
      defaultValue: {
        length: 90
      }
    },
    height: {
      label: "Height",
      type: "length-measure",
      defaultValue: {
        length: 100
      }
    },
    altitude: {
      label: "Altitude",
      type: "length-measure",
      defaultValue: {
        length: 90
      }
    },
    thickness: {
      label: "Thickness",
      type: "length-measure",
      defaultValue: {
        length: 10
      }
    }
  },

  render2D: function (element, layer, scene) {
    const STYLE_HOLE_BASE = { stroke: "#000", strokeWidth: "3px", fill: "#000" };
    const STYLE_HOLE_SELECTED = { stroke: "#0096fd", strokeWidth: "3px", fill: "#0096fd", cursor: "move" };
    //let line = layer.lines[hole.line];
    //let epsilon = line.properties.thickness / 2;

    const epsilon = 3;

    const holeWidth = element.properties.width.length;
    const holePath = `M${0} ${-epsilon}  L${holeWidth} ${-epsilon}  L${holeWidth} ${epsilon}  L${0} ${epsilon}  z`;
    const holeStyle = element.selected ? STYLE_HOLE_SELECTED : STYLE_HOLE_BASE;
    const length = element.properties.width.length;
    return (
      <g transform={`translate(${-length / 2}, 0)`}>
        <path key="1" d={holePath} style={holeStyle} />
        <line key="2" x1={holeWidth / 2} y1={-10 - epsilon} x2={holeWidth / 2} y2={10 + epsilon} style={holeStyle} />
      </g>
    );
  },

  render3D: async function (element, layer, scene) {
    const onLoadItem = (object: Three.Group<Three.Object3DEventMap>) => {
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

    if (cached3DWindow) {
      return onLoadItem(cached3DWindow.clone());
    }

    // TODO: better scaling for frame and inner grid

    const mtl = require('./sash-window.mtl');
    const obj = require('./sash-window.obj');
    const img = require('./texture.png');
    const resourcePath = img.substr(0, img.lastIndexOf("/")) + "/";

    cached3DWindow = await loadObjWithMaterial(mtl, obj, resourcePath);
    return onLoadItem(cached3DWindow.clone());
  }
});
