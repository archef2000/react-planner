import {
  BEGIN_DRAGGING_LINE,
  BEGIN_DRAWING_LINE,
  END_DRAGGING_LINE,
  END_DRAWING_LINE,
  SELECT_LINE,
  SELECT_TOOL_DRAWING_LINE,
  UPDATE_DRAGGING_LINE,
  UPDATE_DRAWING_LINE
} from '../constants';
import { SnapMaskType } from '../types';

export function selectLine(layerID: string, lineID: string) {
  return {
    type: SELECT_LINE,
    layerID,
    lineID
  };
}

export function selectToolDrawingLine(sceneComponentType: string) {
  return {
    type: SELECT_TOOL_DRAWING_LINE,
    sceneComponentType
  };
}

export function beginDrawingLine(
  layerID: string,
  x: number,
  y: number,
  snapMask: SnapMaskType
) {
  return {
    type: BEGIN_DRAWING_LINE,
    layerID,
    x,
    y,
    snapMask
  };
}

export function updateDrawingLine(
  x: number,
  y: number,
  snapMask: SnapMaskType
) {
  return {
    type: UPDATE_DRAWING_LINE,
    x,
    y,
    snapMask
  };
}

export function endDrawingLine(x: number, y: number, snapMask: SnapMaskType) {
  return {
    type: END_DRAWING_LINE,
    x,
    y,
    snapMask
  };
}

export function beginDraggingLine(
  layerID: string,
  lineID: string,
  x: number,
  y: number,
  snapMask: SnapMaskType
) {
  return {
    type: BEGIN_DRAGGING_LINE,
    layerID,
    lineID,
    x,
    y,
    snapMask
  };
}

export function updateDraggingLine(
  x: number,
  y: number,
  snapMask: SnapMaskType
) {
  return {
    type: UPDATE_DRAGGING_LINE,
    x,
    y,
    snapMask
  };
}

export function endDraggingLine(x: number, y: number, snapMask: SnapMaskType) {
  return {
    type: END_DRAGGING_LINE,
    x,
    y,
    snapMask
  };
}
