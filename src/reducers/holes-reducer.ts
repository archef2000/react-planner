import { Hole } from '../class/export';
import { history } from '../utils/export';
import {
  SELECT_TOOL_DRAWING_HOLE,
  UPDATE_DRAWING_HOLE,
  END_DRAWING_HOLE,
  BEGIN_DRAGGING_HOLE,
  UPDATE_DRAGGING_HOLE,
  END_DRAGGING_HOLE,
  SELECT_HOLE,
} from '../constants';
import { State } from '../models';

export default function (state: State, action) {
  switch (action.type) {
    case SELECT_TOOL_DRAWING_HOLE:
      state = { ...state, sceneHistory: history.historyPush(state.sceneHistory, state.scene) };
      return Hole.selectToolDrawingHole(state, action.sceneComponentType);

    case UPDATE_DRAWING_HOLE:
      return Hole.updateDrawingHole(state, action.layerID, action.x, action.y);

    case END_DRAWING_HOLE:
      state = { ...state, sceneHistory: history.historyPush(state.sceneHistory, state.scene) };
      return Hole.endDrawingHole(state, action.layerID, action.x, action.y);

    case BEGIN_DRAGGING_HOLE:
      state = { ...state, sceneHistory: history.historyPush(state.sceneHistory, state.scene) };
      return Hole.beginDraggingHole(state, action.layerID, action.holeID, action.x, action.y);

    case UPDATE_DRAGGING_HOLE:
      return Hole.updateDraggingHole(state, action.x, action.y);

    case END_DRAGGING_HOLE:
      state = { ...state, sceneHistory: history.historyPush(state.sceneHistory, state.scene) };
      return Hole.endDraggingHole(state, action.x, action.y);

    case SELECT_HOLE:
      return Hole.select(state, action.layerID, action.holeID);

    default:
      return state;
  }
}
