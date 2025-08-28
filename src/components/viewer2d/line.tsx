import React from 'react';
import { GeometryUtils } from '../../utils/export';
import Ruler from './ruler';
import { CatalogJson, CatalogFn } from '../../catalog/catalog';
import { Line as LineModel, Layer, Scene } from '../../models'

interface LineProps {
  line: LineModel;
  layer: Layer;
  scene: Scene;
  catalog: CatalogJson;
}

export default function Line({ line, layer, scene, catalog }: LineProps) {

  const vertex0 = layer.vertices[line.vertices[0]];
  const vertex1 = layer.vertices[line.vertices[1]];

  if (vertex0.id === vertex1.id || GeometryUtils.samePoints(vertex0, vertex1)) return null; //avoid 0-length lines

  let { x: x1, y: y1 } = vertex0;
  let { x: x2, y: y2 } = vertex1;

  if (x1 > x2) {
    ({ x: x1, y: y1 } = vertex1);
    ({ x: x2, y: y2 } = vertex0);
  }

  const length = GeometryUtils.pointsDistance(x1, y1, x2, y2);
  const angle = GeometryUtils.angleBetweenTwoPointsAndOrigin(x1, y1, x2, y2);

  const renderedHoles = line.holes.map(holeID => {
    const hole = layer.holes[holeID];
    const startAt = length * hole.offset;
    const renderedHole = CatalogFn.getElement(catalog, hole.type).render2D(hole, layer, scene);

    return (
      <g
        key={holeID}
        transform={`translate(${startAt}, 0)`}
        data-element-root
        data-prototype={hole.prototype}
        data-id={hole.id}
        data-selected={hole.selected}
        data-layer={layer.id}
      >
        {renderedHole}
      </g>
    );
  });

  const thickness = line.properties.thickness.length;
  const half_thickness = thickness / 2;

  const renderedLine = CatalogFn.getElement(catalog, line.type).render2D(line, layer, scene);
  const renderedRuler = line.selected ?
    <Ruler unit={scene.unit} length={length} transform={`translate(0, ${half_thickness + 10} )`} /> : null;

  return (
    <g
      transform={`translate(${x1}, ${y1}) rotate(${angle}, 0, 0)`}
      data-element-root
      data-prototype={line.prototype}
      data-id={line.id}
      data-selected={line.selected}
      data-layer={layer.id}
      style={line.selected ? { cursor: 'move' } : {}}
    >
      {renderedRuler}
      {renderedLine}
      {renderedHoles}
    </g>
  );

}
