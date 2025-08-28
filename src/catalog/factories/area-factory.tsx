import React from 'react';
import { createArea, updatedArea } from './area-factory-3d';
import * as SharedStyle from '../../shared-style';
import Translator from '../../translator/translator';
import { CatalogElementTextures } from '../../types';
import { Area, Layer, Scene } from '../../models';
import { Object3D, Object3DEventMap } from 'three';
import { CatalogElement, CatalogElementInfo } from '../../types';

const translator = new Translator();

export default function AreaFactory(name: string, info: CatalogElementInfo, textures: CatalogElementTextures) {
  const textureValues = { 'none': 'None' };
  for (const textureName in textures) {
    textureValues[textureName] = textures[textureName].name
  }

  const areaElement: CatalogElement = {
    name,
    prototype: 'areas',
    info: {
      ...info,
      visibility: {
        catalog: false,
        layerElementsVisible: false
      }
    },
    properties: {
      patternColor: {
        label: translator.t('color'),
        type: 'color',
        defaultValue: SharedStyle.AREA_MESH_COLOR.unselected
      },
      thickness: {
        label: translator.t('thickness'),
        type: 'length-measure',
        defaultValue: {
          length: 0
        }
      },
      texture: {
        label: translator.t('texture'),
        type: 'enum',
        defaultValue: 'none',
        values: textureValues
      },
    },
    render2D: function (element: Area, layer: Layer, scene: Scene) {
      let path = '';

      ///print area path
      element.vertices.forEach((vertexID, ind) => {
        const vertex = layer.vertices[vertexID];
        path += (ind ? 'L' : 'M') + vertex.x + ' ' + vertex.y + ' ';
      });

      //add holes
      element.holes.forEach(areaID => {
        const area = layer.areas[areaID];

        area.vertices.reverse().forEach((vertexID, ind) => {
          const vertex = layer.vertices[vertexID];
          path += (ind ? 'L' : 'M') + vertex.x + ' ' + vertex.y + ' ';
        });

      });

      const fill = element.selected ? SharedStyle.AREA_MESH_COLOR.selected : element.properties.patternColor;

      return (<path d={path} fill={fill} />);
    },

    async render3D(element: Area, layer: Layer, scene: Scene) {
      return createArea(element, layer, scene, textures)
    },

    async updateRender3D(element: Area, layer: Layer, scene: Scene, mesh: Object3D<Object3DEventMap>, oldElement: Area, differences, selfDestroy, selfBuild) {
      return updatedArea(element, layer, scene, textures, mesh, oldElement, differences, selfDestroy, selfBuild);
  }
};

return areaElement
}
