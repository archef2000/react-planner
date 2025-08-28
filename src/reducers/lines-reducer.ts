import { Line } from '../class/export';
import { history } from '../utils/export';
import {
  SELECT_TOOL_DRAWING_LINE,
  BEGIN_DRAWING_LINE,
  UPDATE_DRAWING_LINE,
  END_DRAWING_LINE,
  BEGIN_DRAGGING_LINE,
  UPDATE_DRAGGING_LINE,
  END_DRAGGING_LINE,
  SELECT_LINE
} from '../constants';
import { State } from '../models';
import { produce } from 'immer';

export default function (state: State, action): State {
  switch (action.type) {
    case SELECT_TOOL_DRAWING_LINE:
      return Line.selectToolDrawingLine(state, action.sceneComponentType);

    case BEGIN_DRAWING_LINE:
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
      });
      return Line.beginDrawingLine(state, action.layerID, action.x, action.y);

    case UPDATE_DRAWING_LINE:
      return Line.updateDrawingLine(state, action.x, action.y);

    case END_DRAWING_LINE:
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
      });
      return Line.endDrawingLine(state, action.x, action.y);

    case BEGIN_DRAGGING_LINE:
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
      });
      return Line.beginDraggingLine(state, action.layerID, action.lineID, action.x, action.y);

    case UPDATE_DRAGGING_LINE:
      return Line.updateDraggingLine(state, action.x, action.y);

    case END_DRAGGING_LINE:
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
      });
      return Line.endDraggingLine(state, action.x, action.y);

    case SELECT_LINE:
      return Line.select(state, action.layerID, action.lineID);

    default:
      return state;
  }
}
