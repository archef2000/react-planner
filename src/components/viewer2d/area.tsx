import React from 'react';
import polylabel from 'polylabel';
import areapolygon from 'area-polygon';
import { CatalogFn, CatalogJson } from '../../catalog/catalog';
import { Layer, Area as AreaModel, Scene } from '../../models';

const STYLE_TEXT = {
  textAnchor: 'middle',
  fontSize: '12px',
  fontFamily: '"Courier New", Courier, monospace',
  pointerEvents: 'none',
  fontWeight: 'bold',

  //http://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting-using-css
  WebkitTouchCallout: 'none', /* iOS Safari */
  WebkitUserSelect: 'none', /* Chrome/Safari/Opera */
  MozUserSelect: 'none', /* Firefox */
  MsUserSelect: 'none', /* Internet Explorer/Edge */
  userSelect: 'none'
} as const;

interface AreaProps {
  area: AreaModel;
  layer: Layer;
  scene: Scene;
  catalog: CatalogJson;
  unit?: string;
}

export default function Area({ layer, area, scene, catalog, unit }: AreaProps) {

  const rendered = CatalogFn.getElement(catalog, area.type).render2D(area, layer, scene);

  let renderedAreaSize = null;

  if (area.selected) {
    const polygon = area.vertices.map(vertexID => {
      const { x, y } = layer.vertices[vertexID];
      return [x, y];
    });

    let polygonWithHoles = polygon;

    area.holes.forEach(holeID => {

      const polygonHole = layer.areas[holeID].vertices.map(vertexID => {
        const { x, y } = layer.vertices[vertexID];
        return [x, y];
      });

      polygonWithHoles = polygonWithHoles.concat(polygonHole.reverse());
    });

    const center = polylabel([polygonWithHoles], 1.0);
    let areaSize = areapolygon(polygon, false);

    //subtract holes area
    area.holes.forEach(areaID => {
      const hole = layer.areas[areaID];
      const holePolygon = hole.vertices.map(vertexID => {
        const { x, y } = layer.vertices[vertexID];
        return [x, y];
      });
      areaSize -= areapolygon(holePolygon, false);
    });

    renderedAreaSize = (
      <text x="0" y="0" transform={`translate(${center[0]} ${center[1]}) scale(1, -1)`} style={STYLE_TEXT}>
        {(areaSize / 10000).toFixed(2)} m{String.fromCharCode(0xb2)}
      </text>
    )
  }

  return (
    <g
      data-element-root
      data-prototype={area.prototype}
      data-id={area.id}
      data-selected={area.selected}
      data-layer={layer.id}
    >
      {rendered}
      {renderedAreaSize}
    </g>
  )

}
