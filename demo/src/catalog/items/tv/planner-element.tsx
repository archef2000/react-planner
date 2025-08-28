import * as Three from 'three';
import { loadObjWithMaterial } from '../../utils/load-obj';

import React from 'react';
import convert from 'convert-units';
import { defineCatalogElement } from '@archef2000/react-planner';

let cached3DTV: Three.Group<Three.Object3DEventMap>;

export default defineCatalogElement({
  name: "tv",
  prototype: "items",

  info: {
    title: "tv",
    tag: ['furnishing', 'electronics'],
    description: "LCD TV",
    image: require('./tv.png')
  },

  properties: {
    altitude: {
      label: "Altitude",
      type: "length-measure",
      defaultValue: {
        length: 0
      }
    }
  },

  render2D: function (element, layer, scene) {
    const width = { length: 1.60, unit: 'ft' };
    const depth = { length: 0.59, unit: 'ft' };

    const newWidth = convert(width.length).from(width.unit).to(scene.unit);
    const newDepth = convert(depth.length).from(depth.unit).to(scene.unit);

    const angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }

    const style = { stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: "#84e1ce" } as const;
    const arrow_style = { stroke: element.selected ? '#0096fd' : undefined, strokeWidth: "2px", fill: "#84e1ce" } as const;

    return (
      <g transform={`translate(${-newWidth / 2},${-newDepth / 2})`}>
        <rect key="1" x="0" y="0" width={newWidth} height={newDepth} style={style} />
        <line key="2" x1={newWidth / 2} x2={newWidth / 2} y1={newDepth} y2={1.5 * newDepth} style={arrow_style} />
        <line key="3" x1={.35 * newWidth} x2={newWidth / 2} y1={1.2 * newDepth} y2={1.5 * newDepth} style={arrow_style} />
        <line key="4" x1={newWidth / 2} x2={.65 * newWidth} y1={1.5 * newDepth} y2={1.2 * newDepth} style={arrow_style} />
        <text key="5" x="0" y="0" transform={`translate(${newWidth / 2}, ${newDepth / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: "middle", fontSize: "11px" }}>
          {element.type}
        </text>
      </g>
    );
  },

  async render3D(element, layer, scene) {
    const width = { length: 1.60, unit: 'ft' };
    const depth = { length: 0.59, unit: 'ft' };
    const height = { length: 1.05, unit: 'ft' };

    const onLoadItem = (object) => {

      const newWidth = convert(width.length).from(width.unit).to(scene.unit);
      const newHeight = convert(height.length).from(height.unit).to(scene.unit);
      const newDepth = convert(depth.length).from(depth.unit).to(scene.unit);

      const newAltitude = element.properties.altitude.length;

      if (element.selected) {
        const box = new Three.BoxHelper(object, 0x99c3fb);
        box.material.linewidth = 2;
        box.material.depthTest = false;
        box.renderOrder = 1000;
        object.add(box);
      }

      object.scale.set(newWidth / width.length, newHeight / height.length, newDepth / depth.length);

      // Normalize the origin of the object
      const boundingBox = new Three.Box3().setFromObject(object);

      const center = [
        (boundingBox.max.x - boundingBox.min.x) / 2 + boundingBox.min.x,
        (boundingBox.max.y - boundingBox.min.y) / 2 + boundingBox.min.y,
        (boundingBox.max.z - boundingBox.min.z) / 2 + boundingBox.min.z];

      object.position.x -= center[0];
      object.position.y -= center[1] - (boundingBox.max.y - boundingBox.min.y) / 2;
      object.position.z -= center[2];

      object.position.y += newAltitude;

      object.rotation.y = Math.PI;

      return object;
    };


    if (cached3DTV) {
      return onLoadItem(cached3DTV.clone());
    }

    const mtl = require('./tv.mtl');
    const obj = require('./tv.obj');
    const img = require('./tv.png');
    const resourcePath = img.substr(0, img.lastIndexOf("/")) + "/";

    return loadObjWithMaterial(mtl, obj, resourcePath)
      .then(object => {
        cached3DTV = object;
        return onLoadItem(cached3DTV.clone())
      })
  }
});
