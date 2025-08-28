import { BoxHelper, Box3, ObjectLoader, Object3DJSON, Object3D, Object3DEventMap } from 'three';
import { loadObjWithMaterial } from '../../utils/load-obj';
import convert from 'convert-units';

import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const mtl = require('./sofa.mtl');
const obj = require('./sofa.obj');
const img = require('./texture.jpg');
const resourcePath = img.substr(0, img.lastIndexOf("/")) + "/";

const width = { length: 180, unit: 'cm' };
const depth = { length: 60, unit: 'cm' };
const height = { length: 70, unit: 'cm' };

let cachedJSONSofa: Object3DJSON;

export default defineCatalogElement({
  name: 'sofa',
  prototype: 'items',

  info: {
    title: 'sofa',
    tag: ['furnishings', 'leather'],
    description: 'Leather sofa',
    image: require('./sofa.png')
  },

  // TODO: Add properties
  properties: {},

  render2D: function (element, layer, scene) {
    const angle = element.rotation + 90;
    const textRotation = Math.sin(angle * Math.PI / 180) < 0 ? 180 : 0;

    const style = { stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: '#84e1ce' } as const;
    const arrow_style = { stroke: element.selected ? '#0096fd' : undefined, strokeWidth: '2px', fill: '#84e1ce' } as const;

    return (
      <g transform={`translate(${-width.length / 2},${-depth.length / 2})`}>
        <rect x="0" y="0" width={width.length} height={depth.length} style={style} />
        <line x1={width.length / 2} x2={width.length / 2} y1={depth.length} y2={1.5 * depth.length}
          style={arrow_style} />
        <line
          x1={.35 * width.length}
          x2={width.length / 2}
          y1={1.2 * depth.length}
          y2={1.5 * depth.length}
          style={arrow_style}
        />
        <line
          x1={width.length / 2}
          x2={.65 * width.length}
          y1={1.5 * depth.length}
          y2={1.2 * depth.length}
          style={arrow_style}
        />
        <text
          x="0"
          y="0"
          transform={`translate(${width.length / 2}, ${depth.length / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: 'middle', fontSize: '11px' }}
        >
          {element.type}
        </text>
      </g>
    );
  },

  async render3D(element, layer, scene) {
    const onLoadItem = (object: Object3D<Object3DEventMap>) => {
      const newWidth = convert(width.length).from(width.unit).to(scene.unit);
      const newHeight = convert(height.length).from(height.unit).to(scene.unit);
      const newDepth = convert(depth.length).from(depth.unit).to(scene.unit);

      object.scale.set(newWidth / width.length, newHeight / height.length, newDepth / depth.length);

      const box = new BoxHelper(object, 0x99c3fb);
      box.material.linewidth = 2;
      box.material.depthTest = false;
      box.renderOrder = 1000;
      box.visible = element.selected;
      object.add(box);

      // Normalize the origin of this item
      const boundingBox = new Box3().setFromObject(object);

      const center = [
        (boundingBox.max.x - boundingBox.min.x) / 2 + boundingBox.min.x,
        (boundingBox.max.y - boundingBox.min.y) / 2 + boundingBox.min.y,
        (boundingBox.max.z - boundingBox.min.z) / 2 + boundingBox.min.z];

      object.position.x -= center[0];
      object.position.y -= center[1] - (boundingBox.max.y - boundingBox.min.y) / 2;
      object.position.z -= center[2];

      return object;
    };

    if (cachedJSONSofa) {
      const loader = new ObjectLoader();
      const object = loader.parse(cachedJSONSofa);
      return onLoadItem(object);
    }

    const object = await loadObjWithMaterial(mtl, obj, resourcePath);
    cachedJSONSofa = object.toJSON();
    return onLoadItem(object);
  },

  async updateRender3D(element, layer, scene, mesh, oldElement, differences, selfDestroy, selfBuild) {
    const noPerf = () => { selfDestroy(); return selfBuild(); };

    if (differences.indexOf('selected') !== -1) {
      mesh.traverse((child) => {
        if (child instanceof BoxHelper) {
          child.visible = element.selected;
        }
      });

      return mesh;
    }

    if (differences.indexOf('rotation') !== -1) {
      mesh.rotation.y = element.rotation * Math.PI / 180;
      return mesh;
    }

    return noPerf();
  }
});
