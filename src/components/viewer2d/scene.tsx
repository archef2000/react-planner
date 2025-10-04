import React from 'react';

import { CatalogJson } from '../../catalog/catalog';
import { SceneJson } from '../../models';

import { Grids, Layer } from './export';

interface SceneProps {
  scene: SceneJson;
  catalog: CatalogJson;
}

export default function Scene({ scene, catalog }: SceneProps) {
  const { layers } = scene;
  const selectedLayer = scene.selectedLayer
    ? layers[scene.selectedLayer]
    : undefined;

  return (
    <g>
      <Grids scene={scene} />

      <g style={{ pointerEvents: 'none' }}>
        {Object.entries(layers)
          .filter(
            ([layerID, layer]) =>
              layerID !== scene.selectedLayer && layer.visible
          )
          .map(([layerID, layer]) => (
            <Layer
              key={layerID}
              layer={layer}
              scene={scene}
              catalog={catalog}
            />
          ))}
      </g>

      {selectedLayer && (
        <Layer
          key={selectedLayer.id}
          layer={selectedLayer}
          scene={scene}
          catalog={catalog}
        />
      )}
    </g>
  );
}
