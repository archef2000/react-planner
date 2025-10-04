import { produce } from 'immer';

import { Line } from '../class/export';
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
import { State } from '../models';
import { history } from '../utils/export';

export type LineAction =
  | { type: typeof SELECT_LINE; layerID: string; lineID: string }
  | { type: typeof SELECT_TOOL_DRAWING_LINE; sceneComponentType: string }
  | { type: typeof BEGIN_DRAWING_LINE; layerID: string; x: number; y: number }
  | { type: typeof UPDATE_DRAWING_LINE; x: number; y: number }
  | { type: typeof END_DRAWING_LINE; x: number; y: number }
  | {
    type: typeof BEGIN_DRAGGING_LINE;
    layerID: string;
    lineID: string;
    x: number;
    y: number;
  }
  | { type: typeof UPDATE_DRAGGING_LINE; x: number; y: number }
  | { type: typeof END_DRAGGING_LINE; x: number; y: number };

export default function (state: State, action: LineAction): State {
  switch (action.type) {
    case SELECT_TOOL_DRAWING_LINE:
      return Line.selectToolDrawingLine(state, action.sceneComponentType);

    case BEGIN_DRAWING_LINE:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Line.beginDrawingLine(state, action.layerID, action.x, action.y);

    case UPDATE_DRAWING_LINE:
      return Line.updateDrawingLine(state, action.x, action.y);

    case END_DRAWING_LINE:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Line.endDrawingLine(state, action.x, action.y);

    case BEGIN_DRAGGING_LINE:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Line.beginDraggingLine(
        state,
        action.layerID,
        action.lineID,
        action.x,
        action.y
      );

    case UPDATE_DRAGGING_LINE:
      return Line.updateDraggingLine(state, action.x, action.y);

    case END_DRAGGING_LINE:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Line.endDraggingLine(state, action.x, action.y);

    case SELECT_LINE:
      return Line.select(state, action.layerID, action.lineID);

    default:
      return state;
  }
}
