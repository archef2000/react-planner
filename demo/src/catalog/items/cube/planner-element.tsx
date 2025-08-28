import React from 'react';
import { BoxGeometry, MeshBasicMaterial, Mesh, BoxHelper } from 'three';
import { defineCatalogElement, ReactPlannerSharedStyle } from '@archef2000/react-planner';

export default defineCatalogElement({
  name: 'cube',
  prototype: 'items',

  info: {
    title: 'cube',
    tag: ['demo'],
    description: 'Demo item',
    image: require('./cube.png')
  },

  properties: {
    color: {
      label: 'Color',
      type: 'color',
      defaultValue: ReactPlannerSharedStyle.AREA_MESH_COLOR.unselected
    },
    width: {
      label: 'Width',
      type: 'length-measure',
      defaultValue: {
        length: 100
      }
    },
    height: {
      label: 'Height',
      type: 'length-measure',
      defaultValue: {
        length: 100
      }
    },
    depth: {
      label: 'Depth',
      type: 'length-measure',
      defaultValue: {
        length: 100
      }
    },
  },

  render2D: (element, layer, scene) => {
    const style = {
      stroke: !element.selected ? ReactPlannerSharedStyle.LINE_MESH_COLOR.unselected : ReactPlannerSharedStyle.MESH_SELECTED,
      strokeWidth: 2,
      fill: element.properties.color
    } as const;

    const w = element.properties.width.length;
    const d = element.properties.depth.length;
    const w2 = w / 2;
    const d2 = d / 2;

    return (
      <g transform={`translate(-${w2}, -${d2})`}>
        <rect x="0" y="0" width={w} height={d} style={style} />
      </g>
    );
  },

  async render3D(element, layer, scene) {
    const w = element.properties.width.length;
    const h = element.properties.height.length;
    const d = element.properties.depth.length;
    const geometry = new BoxGeometry(w, h, d);
    const material = new MeshBasicMaterial({
      color: element.properties.color
    });

    const mesh = new Mesh(geometry, material);

    const box = new BoxHelper(mesh, !element.selected ? ReactPlannerSharedStyle.LINE_MESH_COLOR.unselected : ReactPlannerSharedStyle.MESH_SELECTED);
    box.material.linewidth = 2;
    box.renderOrder = 1000;
    mesh.add(box);

    mesh.position.y = (h / 2);

    return mesh;
  }
});
