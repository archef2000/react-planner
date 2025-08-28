import React, { Component } from 'react';
import { Layer, Grids } from './export';
import { CatalogJson } from '../../catalog/catalog';
import { SceneJson } from '../../models';

interface SceneProps {
  scene: SceneJson,
  catalog: CatalogJson,
}

export default function Scene({ scene, catalog }: SceneProps) {
  const { height, layers } = scene;
  const selectedLayer = layers[scene.selectedLayer];

  return (
    <g>
      <Grids scene={scene} />

      <g style={{ pointerEvents: 'none' }}>
        {
          Object.entries(layers)
            .filter(([layerID, layer]) => layerID !== scene.selectedLayer && layer.visible)
            .map(([layerID, layer]) => <Layer key={layerID} layer={layer} scene={scene} catalog={catalog} />)
        }
      </g>

      <Layer key={selectedLayer.id} layer={selectedLayer} scene={scene} catalog={catalog} />
    </g>
  );
}

