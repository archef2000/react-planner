import React, { CSSProperties, useContext } from 'react';

import { ReactSVGPanZoom, TOOL_NONE, TOOL_PAN, TOOL_ZOOM_IN, TOOL_ZOOM_OUT, TOOL_AUTO, ViewerMouseEvent, Value as ReactSVGPanZoomValue } from 'react-svg-pan-zoom';
import * as constants from '../../constants';
import State from './state';
import * as SharedStyle from '../../shared-style';
import { RulerX, RulerY } from './export';
import ReactPlannerContext from '../../react-planner-context';
import { State as StateClass } from '../../models';

function mode2Tool(mode) {
  switch (mode) {
    case constants.MODE_2D_PAN:
      return TOOL_PAN;
    case constants.MODE_2D_ZOOM_IN:
      return TOOL_ZOOM_IN;
    case constants.MODE_2D_ZOOM_OUT:
      return TOOL_ZOOM_OUT;
    case constants.MODE_IDLE:
      return TOOL_AUTO;
    default:
      return TOOL_NONE;
  }
}

function mode2PointerEvents(mode) {
  switch (mode) {
    case constants.MODE_DRAWING_LINE:
    case constants.MODE_DRAWING_HOLE:
    case constants.MODE_DRAWING_ITEM:
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_DRAGGING_ITEM:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
      return { pointerEvents: 'none' };

    default:
      return {};
  }
}

function mode2Cursor(mode) {
  switch (mode) {
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
    case constants.MODE_DRAGGING_ITEM:
      return { cursor: 'move' };

    case constants.MODE_ROTATING_ITEM:
      return { cursor: 'ew-resize' };

    case constants.MODE_WAITING_DRAWING_LINE:
    case constants.MODE_DRAWING_LINE:
      return { cursor: 'crosshair' };
    default:
      return { cursor: 'default' };
  }
}

function mode2DetectAutopan(mode) {
  switch (mode) {
    case constants.MODE_DRAWING_LINE:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_DRAGGING_ITEM:
    case constants.MODE_DRAWING_HOLE:
    case constants.MODE_DRAWING_ITEM:
      return true;

    default:
      return false;
  }
}

function extractElementData(node) {
  while (!node.attributes.getNamedItem('data-element-root') && node.tagName !== 'svg') {
    node = node.parentNode;
  }
  if (node.tagName === 'svg') return null;

  return {
    part: node.attributes.getNamedItem('data-part') ? node.attributes.getNamedItem('data-part').value : undefined,
    layer: node.attributes.getNamedItem('data-layer').value,
    prototype: node.attributes.getNamedItem('data-prototype').value,
    selected: node.attributes.getNamedItem('data-selected').value === 'true',
    id: node.attributes.getNamedItem('data-id').value
  }
}

interface Viewer2DProps {
  state: StateClass;
  width: number;
  height: number;
}

export default function Viewer2D({ state, width, height }: Viewer2DProps) {
  const { viewer2DActions, linesActions, holesActions, verticesActions, itemsActions, areaActions, projectActions, catalog } = useContext(ReactPlannerContext);

  const { viewer2D, mode, scene } = state;

  const layerID = scene.selectedLayer;

  const mapCursorPosition = <T,>({ x, y }: ViewerMouseEvent<T>) => {
    return { x, y: -y + scene.height }
  };

  const onMouseMove = <T,>(viewerEvent: ViewerMouseEvent<T>) => {
    //workaround that allow imageful component to work
    const evt = new Event('mousemove-planner-event');
    (evt as any).viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    const { x, y } = mapCursorPosition(viewerEvent);

    projectActions.updateMouseCoord({ x, y });

    switch (mode) {
      case constants.MODE_DRAWING_LINE:
        linesActions.updateDrawingLine(x, y, state.snapMask);
        break;

      case constants.MODE_DRAWING_HOLE:
        holesActions.updateDrawingHole(layerID, x, y);
        break;

      case constants.MODE_DRAWING_ITEM:
        itemsActions.updateDrawingItem(layerID, x, y);
        break;

      case constants.MODE_DRAGGING_HOLE:
        holesActions.updateDraggingHole(x, y);
        break;

      case constants.MODE_DRAGGING_LINE:
        linesActions.updateDraggingLine(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_VERTEX:
        verticesActions.updateDraggingVertex(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_ITEM:
        itemsActions.updateDraggingItem(x, y);
        break;

      case constants.MODE_ROTATING_ITEM:
        itemsActions.updateRotatingItem(x, y);
        break;
    }

    (viewerEvent as any).originalEvent.stopPropagation();
  };

  const onMouseDown = viewerEvent => {
    const event = viewerEvent.originalEvent;

    //workaround that allow imageful component to work
    const evt = new Event('mousedown-planner-event');
    (evt as any).viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    const { x, y } = mapCursorPosition(viewerEvent);

    if (mode === constants.MODE_IDLE) {
      const elementData = extractElementData(event.target);
      if (!elementData || !elementData.selected) return;

      switch (elementData.prototype) {
        case 'lines':
          linesActions.beginDraggingLine(elementData.layer, elementData.id, x, y, state.snapMask);
          break;

        case 'vertices':
          verticesActions.beginDraggingVertex(elementData.layer, elementData.id, x, y, state.snapMask);
          break;

        case 'items':
          if (elementData.part === 'rotation-anchor')
            itemsActions.beginRotatingItem(elementData.layer, elementData.id, x, y);
          else
            itemsActions.beginDraggingItem(elementData.layer, elementData.id, x, y);
          break;

        case 'holes':
          holesActions.beginDraggingHole(elementData.layer, elementData.id, x, y);
          break;

        default: break;
      }
    }
    event.stopPropagation();
  };

  const onMouseUp = viewerEvent => {
    const event = viewerEvent.originalEvent;

    const evt = new Event('mouseup-planner-event');
    (evt as any).viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    const { x, y } = mapCursorPosition(viewerEvent);

    switch (mode) {

      case constants.MODE_IDLE:
        const elementData = extractElementData(event.target);

        if (elementData && elementData.selected) return;

        switch (elementData ? elementData.prototype : 'none') {
          case 'areas':
            areaActions.selectArea(elementData.layer, elementData.id);
            break;

          case 'lines':
            linesActions.selectLine(elementData.layer, elementData.id);
            break;

          case 'holes':
            holesActions.selectHole(elementData.layer, elementData.id);
            break;

          case 'items':
            itemsActions.selectItem(elementData.layer, elementData.id);
            break;

          case 'none':
            projectActions.unselectAll();
            break;
        }
        break;

      case constants.MODE_WAITING_DRAWING_LINE:
        linesActions.beginDrawingLine(layerID, x, y, state.snapMask);
        break;

      case constants.MODE_DRAWING_LINE:
        linesActions.endDrawingLine(x, y, state.snapMask);
        linesActions.beginDrawingLine(layerID, x, y, state.snapMask);
        break;

      case constants.MODE_DRAWING_HOLE:
        holesActions.endDrawingHole(layerID, x, y);
        break;

      case constants.MODE_DRAWING_ITEM:
        itemsActions.endDrawingItem(layerID, x, y);
        break;

      case constants.MODE_DRAGGING_LINE:
        linesActions.endDraggingLine(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_VERTEX:
        verticesActions.endDraggingVertex(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_ITEM:
        itemsActions.endDraggingItem(x, y);
        break;

      case constants.MODE_DRAGGING_HOLE:
        holesActions.endDraggingHole(x, y);
        break;

      case constants.MODE_ROTATING_ITEM:
        itemsActions.endRotatingItem(x, y);
        break;
    }

    event.stopPropagation();
  };

  const onChangeValue = (value) => {
    projectActions.updateZoomScale(value.a);
    viewer2DActions.updateCameraView(value);
  };

  const onChangeTool = (tool) => {
    switch (tool) {
      case TOOL_NONE:
        projectActions.selectToolEdit();
        break;

      case TOOL_PAN:
        viewer2DActions.selectToolPan();
        break;

      case TOOL_ZOOM_IN:
        viewer2DActions.selectToolZoomIn();
        break;

      case TOOL_ZOOM_OUT:
        viewer2DActions.selectToolZoomOut();
        break;
    }
  };

  const { e, f, SVGWidth, SVGHeight } = state.viewer2D;

  const rulerSize = 15; //px
  const rulerUnitPixelSize = 100;
  const rulerBgColor = SharedStyle.PRIMARY_COLOR.main;
  const rulerFnColor = SharedStyle.COLORS.white;
  const rulerMkColor = SharedStyle.SECONDARY_COLOR.main;
  const sceneWidth = SVGWidth || state.scene.width;
  const sceneHeight = SVGHeight || state.scene.height;
  const sceneZoom = state.zoom || 1;
  const rulerXElements = Math.ceil(sceneWidth / rulerUnitPixelSize) + 1;
  const rulerYElements = Math.ceil(sceneHeight / rulerUnitPixelSize) + 1;

  const miniatureProps = {
    position: "none",
    background: "#fff",
    //width: 0,
    //height: 0,
    width: 100,
    height: 80
  } as const;
  const toolbarProps = {
    position: "none",
  } as const;

  return (
    <div style={{
      margin: 0,
      padding: 0,
      display: 'grid',
      gridRowGap: '0',
      gridColumnGap: '0',
      gridTemplateColumns: `${rulerSize}px ${width - rulerSize}px`,
      gridTemplateRows: `${rulerSize}px ${height - rulerSize}px`,
      position: 'relative'
    }}>
      <div style={{ gridColumn: 1, gridRow: 1, backgroundColor: rulerBgColor }}></div>
      <div style={{ gridRow: 1, gridColumn: 2, position: 'relative', overflow: 'hidden' }} id="rulerX">
        {sceneWidth ? <RulerX
          unitPixelSize={rulerUnitPixelSize}
          zoom={sceneZoom}
          mouseX={state.mouse.x}
          width={width - rulerSize}
          zeroLeftPosition={e || 0}
          backgroundColor={rulerBgColor}
          fontColor={rulerFnColor}
          markerColor={rulerMkColor}
          positiveUnitsNumber={rulerXElements}
          negativeUnitsNumber={0}
        /> : null}
      </div>
      <div style={{ gridColumn: 1, gridRow: 2, position: 'relative', overflow: 'hidden' }} id="rulerY">
        {sceneHeight ? <RulerY
          unitPixelSize={rulerUnitPixelSize}
          zoom={sceneZoom}
          mouseY={state.mouse.y}
          height={height - rulerSize}
          zeroTopPosition={((sceneHeight * sceneZoom) + f) || 0}
          backgroundColor={rulerBgColor}
          fontColor={rulerFnColor}
          markerColor={rulerMkColor}
          positiveUnitsNumber={rulerYElements}
          negativeUnitsNumber={0}
        /> : null}
      </div>
      <ReactSVGPanZoom
        style={{ gridColumn: 2, gridRow: 2 }}
        width={width - rulerSize}
        height={height - rulerSize}
        value={viewer2D as any as ReactSVGPanZoomValue}
        onChangeValue={onChangeValue}
        tool={mode2Tool(mode)}
        onChangeTool={onChangeTool}
        detectAutoPan={mode2DetectAutopan(mode)}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        miniatureProps={miniatureProps}
        toolbarProps={toolbarProps}
      >
        <svg width={scene.width} height={scene.height}>
          <defs>
            <pattern id="diagonalFill" patternUnits="userSpaceOnUse" width="4" height="4" fill="#FFF">
              <rect x="0" y="0" width="4" height="4" fill="#FFF" />
              <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" style={{ stroke: '#8E9BA2', strokeWidth: 1 }} />
            </pattern>
          </defs>
          <g style={Object.assign(mode2Cursor(mode), mode2PointerEvents(mode)) as CSSProperties}>
            <State state={state} catalog={catalog} />
          </g>
        </svg>
      </ReactSVGPanZoom>
    </div>
  );
}
