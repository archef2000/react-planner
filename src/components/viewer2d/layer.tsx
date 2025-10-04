import React from 'react';

import { CatalogJson } from '../../catalog/catalog';
import { Layer as LayerModel, Scene } from '../../models';

import { Area, Group, Item, Line, Vertex } from './export';

interface LayerProps {
  layer: LayerModel;
  scene: Scene;
  catalog: CatalogJson;
}

export default function Layer({ layer, scene, catalog }: LayerProps) {
  const { unit, groups } = scene;
  const { lines, areas, vertices, id: layerID, items, opacity } = layer;

  return (
    <g opacity={opacity}>
      {Object.values(areas).map((area) => (
        <Area
          key={area.id}
          layer={layer}
          area={area}
          scene={scene}
          unit={unit}
          catalog={catalog}
        />
      ))}
      {Object.values(lines).map((line) => (
        <Line
          key={line.id}
          layer={layer}
          line={line}
          scene={scene}
          catalog={catalog}
        />
      ))}
      {Object.values(items).map((item) => (
        <Item
          key={item.id}
          layer={layer}
          item={item}
          scene={scene}
          catalog={catalog}
        />
      ))}
      {Object.values(vertices)
        .filter((v) => v.selected)
        .map((vertex) => (
          <Vertex key={vertex.id} layer={layer} vertex={vertex} />
        ))}
      {Object.values(groups)
        .filter((g) => g.elements[layerID] && g.selected)
        .map((group) => (
          <Group
            key={group.id}
            layer={layer}
            group={group}
            scene={scene}
            catalog={catalog}
          />
        ))}
    </g>
  );
}
