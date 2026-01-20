import React from 'react';

import { State } from '../../models';
import * as SharedStyle from '../../shared-style';
import { ComponentType, StructuredComponentType } from '../../types';
import If from '../../utils/react-if';

import PanelElementEditor from './panel-element-editor/panel-element-editor';
import PanelMultiElementsEditor from './panel-element-editor/panel-multi-elements-editor';
import PanelGroupEditor from './panel-group-editor';
import PanelGroups from './panel-groups';
import PanelGuides from './panel-guides';
import PanelLayerElements from './panel-layer-elements';
import PanelLayers from './panel-layers';

const STYLE = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  display: 'block',
  overflowY: 'auto',
  overflowX: 'hidden',
  boxSizing: 'border-box'
} as const;

const sortButtonsCb = (
  a: StructuredComponentType,
  b: StructuredComponentType
) => {
  if (a.index === undefined || a.index === null) {
    a.index = Number.MAX_SAFE_INTEGER;
  }

  if (b.index === undefined || b.index === null) {
    b.index = Number.MAX_SAFE_INTEGER;
  }

  return a.index - b.index;
};

const mapButtonsCb = (el: StructuredComponentType, ind: number) => (
  <If key={ind} condition={el.condition} style={{ position: 'relative' }}>
    {el.dom}
  </If>
);

interface SidebarProps {
  state: State;
  width: number;
  height: number;
  sidebarComponents: ComponentType[];
}

export default function Sidebar({
  state,
  width,
  height,
  sidebarComponents
}: SidebarProps) {
  const selectedLayer = state.scene.selectedLayer;

  //TODO change in multi-layer check
  if (!selectedLayer) return null;
  const selected = state.scene.layers[selectedLayer].selected;

  const multiselected =
    selected.lines.length > 1 ||
    selected.items.length > 1 ||
    selected.holes.length > 1 ||
    selected.areas.length > 1 ||
    selected.lines.length +
      selected.items.length +
      selected.holes.length +
      selected.areas.length >
      1;

  const selectedGroup = Object.values(state.scene.groups).find(
    (g) => g.selected
  );

  let sorter: StructuredComponentType[] = [
    { index: 0, condition: true, dom: <PanelGuides state={state} /> },
    { index: 1, condition: true, dom: <PanelLayers state={state} /> },
    {
      index: 2,
      condition: true,
      dom: (
        <PanelLayerElements
          mode={state.mode}
          layers={state.scene.layers}
          selectedLayer={selectedLayer}
        />
      )
    },
    {
      index: 3,
      condition: true,
      dom: (
        <PanelGroups
          mode={state.mode}
          groups={state.scene.groups}
          layers={state.scene.layers}
        />
      )
    },
    {
      index: 4,
      condition: !multiselected,
      dom: <PanelElementEditor state={state} />
    },
    {
      index: 5,
      condition: multiselected,
      dom: <PanelMultiElementsEditor state={state} />
    },
    {
      index: 6,
      condition: !!selectedGroup,
      dom: <PanelGroupEditor state={state} groupID={selectedGroup?.id} />
    }
  ];

  sorter = sorter.concat(
    sidebarComponents.map((Component, key) => {
      if (typeof Component === 'function') {
        return {
          condition: true,
          dom: React.createElement(Component, { state, key })
        };
      } else {
        //else is a sortable toolbar button
        return {
          index: Component.index,
          condition: Component.condition,
          dom:
            typeof Component.dom === 'function'
              ? React.createElement(Component.dom, { state, key })
              : Component.dom
        };
      }
    })
  );

  return (
    <aside
      style={{ width, height, ...STYLE }}
      onKeyDown={(event) => event.stopPropagation()}
      onKeyUp={(event) => event.stopPropagation()}
      className="sidebar"
    >
      {sorter.sort(sortButtonsCb).map(mapButtonsCb)}
    </aside>
  );
}
