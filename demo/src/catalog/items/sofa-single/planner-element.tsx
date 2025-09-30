import { BoxHelper, Box3, ObjectLoader, Object3DJSON, Object3D, Object3DEventMap, Vector3 } from 'three';
import { loadObjWithMaterial } from '../../utils/load-obj';

import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const mtl = require('./sofa.mtl');
const obj = require('./sofa.obj');
const img = require('./texture.jpg');
const resourcePath = img.substr(0, img.lastIndexOf("/")) + "/";

const width = { length: 90, unit: 'cm' };
const depth = { length: 60, unit: 'cm' };
const height = { length: 70, unit: 'cm' };

let cachedJSONSofa: Object3DJSON;

export default defineCatalogElement({
  name: 'sofa single',
  prototype: 'items',

  info: {
    title: 'sofa single',
    tag: ['furnishings', 'leather'],
    description: 'Leather sofa',
    image: require('./sofa.png')
  },

  properties: {
    width: {
      label: 'Width',
      type: 'length-measure',
      defaultValue: width
    },
    depth: {
      label: 'Depth',
      type: 'length-measure',
      defaultValue: depth
    },
    height: {
      label: 'Height',
      type: 'length-measure',
      defaultValue: height
    }
  },

  render2D: function (element, layer, scene) {
    const angle = element.rotation + 90;
    const width = element.properties.width;
    const depth = element.properties.depth;
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
    const width = element.properties.width;
    const depth = element.properties.depth;
    const height = element.properties.height;
    const rotation = element.rotation;

    const onLoadItem = (object: Object3D<Object3DEventMap>) => {
      const newWidth = width.length;
      const newHeight = height.length;
      const newDepth = depth.length;

      const bbox = new Box3().setFromObject(object);
      const size = new Vector3();
      bbox.getSize(size);

      const box = new BoxHelper(object, 0x99c3fb);
      box.material.linewidth = 2;
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
      object.rotation.y = Math.PI + rotation * Math.PI / 180;

      const sx = newWidth / size.x;
      const sy = newHeight / size.y;
      const sz = newDepth / size.z;
      object.scale.set(sx, sy, sz);

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
