import React, { useContext } from 'react';
import Panel from '../panel';
import {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
} from '../../../constants';
import ElementEditor from './element-editor';
import ReactPlannerContext from '../../../react-planner-context';
import { Layer, StateProps } from '../../../models';
import { ElementType } from '../../../types';

interface PanelElementEditorProps {
  state: StateProps;
}

export default function PanelElementEditor({ state }: PanelElementEditorProps) {
  const { translator } = useContext(ReactPlannerContext);

  const { scene, mode } = state;

  if (![MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN,
    MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
    MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM,
    MODE_DRAGGING_LINE, MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE,
    MODE_ROTATING_ITEM, MODE_UPLOADING_IMAGE, MODE_FITTING_IMAGE].includes(mode)) return null;

  const componentRenderer = (element: ElementType, layer: Layer) =>
    <Panel key={element.id} name={translator.t('Properties: [{0}] {1}', element.type, element.id)} opened={true}>
      <div style={{ padding: '5px 15px' }}>
        <ElementEditor element={element} layer={layer} state={state} />
      </div>
    </Panel>;

  const layerRenderer = (layer: Layer) => {
    const elements = [
      ...Object.values(layer.lines),
      ...Object.values(layer.holes),
      ...Object.values(layer.areas),
      ...Object.values(layer.items),
    ];
    return elements
      .filter((element) => element.selected)
      .map(element => componentRenderer(element, layer));
  };

  return <div>{Object.values(scene.layers).map(layerRenderer)}</div>
}
