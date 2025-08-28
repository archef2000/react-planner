import React, { useContext } from 'react';
import If from '../../utils/react-if';
import * as sharedStyles from '../../shared-style';
import ReactPlannerContext from '../../react-planner-context';
import { CatalogJson, CatalogFn } from '../../catalog/catalog';

const cx = 0;
const cy = 0;
const radius = 5;

const STYLE_CIRCLE = {
  fill: sharedStyles.MATERIAL_COLORS[500].orange,
  stroke: sharedStyles.MATERIAL_COLORS[500].orange,
  cursor: 'default'
};

interface GroupProps {
  layer: any;
  group: any;
  scene: any;
  catalog: CatalogJson
}

export default function Group({ layer, group, scene, catalog }: GroupProps) {
  const { translator } = useContext(ReactPlannerContext);
  return (
    <g
      data-element-root
      data-prototype={group.prototype}
      data-id={group.id}
      data-selected={group.selected}
      data-layer={layer.id}
      style={group.selected ? { cursor: 'move' } : {}}
      transform={`translate(${group.x},${group.y}) rotate(${group.rotation})`}
    >
      <If condition={group.selected} style={{}}>
        <g
          data-element-root
          data-prototype={group.prototype}
          data-id={group.id}
          data-selected={group.selected}
          data-layer={layer.id}
          data-part="rotation-anchor"
        >
          <circle cx={cx} cy={cy} r={radius} style={STYLE_CIRCLE}>
            <title>{translator.t('Group\'s Barycenter')}</title>
          </circle>
        </g>
      </If>
    </g>
  )
}
