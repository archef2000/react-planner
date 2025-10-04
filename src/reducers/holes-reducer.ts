import { Hole } from '../class/export';
import {
  BEGIN_DRAGGING_HOLE,
  END_DRAGGING_HOLE,
  END_DRAWING_HOLE,
  SELECT_HOLE,
  SELECT_TOOL_DRAWING_HOLE,
  UPDATE_DRAGGING_HOLE,
  UPDATE_DRAWING_HOLE
} from '../constants';
import { State } from '../models';
import { history } from '../utils/export';

export type SelectToolDrawingHoleAction = {
  type: typeof SELECT_TOOL_DRAWING_HOLE;
  sceneComponentType: string;
};

export type UpdateDrawingHoleAction = {
  type: typeof UPDATE_DRAWING_HOLE;
  layerID: string;
  x: number;
  y: number;
};

export type EndDrawingHoleAction = {
  type: typeof END_DRAWING_HOLE;
  layerID: string;
  x: number;
  y: number;
};

export type BeginDraggingHoleAction = {
  type: typeof BEGIN_DRAGGING_HOLE;
  layerID: string;
  holeID: string;
  x: number;
  y: number;
};

export type UpdateDraggingHoleAction = {
  type: typeof UPDATE_DRAGGING_HOLE;
  x: number;
  y: number;
};

export type EndDraggingHoleAction = {
  type: typeof END_DRAGGING_HOLE;
  x: number;
  y: number;
};
export type SelectHoleAction = {
  type: typeof SELECT_HOLE;
  layerID: string;
  holeID: string;
};

export type HoleAction =
  | SelectToolDrawingHoleAction
  | UpdateDrawingHoleAction
  | EndDrawingHoleAction
  | BeginDraggingHoleAction
  | UpdateDraggingHoleAction
  | EndDraggingHoleAction
  | SelectHoleAction;

export default function holesReducer(state: State, action: HoleAction): State {
  switch (action.type) {
    case SELECT_TOOL_DRAWING_HOLE:
      state = {
        ...state,
        sceneHistory: history.historyPush(state.sceneHistory, state.scene)
      };
      return Hole.selectToolDrawingHole(state, action.sceneComponentType);

    case UPDATE_DRAWING_HOLE:
      return Hole.updateDrawingHole(state, action.layerID, action.x, action.y);

    case END_DRAWING_HOLE:
      state = {
        ...state,
        sceneHistory: history.historyPush(state.sceneHistory, state.scene)
      };
      return Hole.endDrawingHole(state, action.layerID, action.x, action.y);

    case BEGIN_DRAGGING_HOLE:
      state = {
        ...state,
        sceneHistory: history.historyPush(state.sceneHistory, state.scene)
      };
      return Hole.beginDraggingHole(
        state,
        action.layerID,
        action.holeID,
        action.x,
        action.y
      );

    case UPDATE_DRAGGING_HOLE:
      return Hole.updateDraggingHole(state, action.x, action.y);

    case END_DRAGGING_HOLE:
      state = {
        ...state,
        sceneHistory: history.historyPush(state.sceneHistory, state.scene)
      };
      return Hole.endDraggingHole(state, action.x, action.y);

    case SELECT_HOLE:
      return Hole.select(state, action.layerID, action.holeID);
    default:
      return state;
  }
}
