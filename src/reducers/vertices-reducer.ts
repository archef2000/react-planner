import { produce } from 'immer';

import { Vertex } from '../class/export';
import {
  BEGIN_DRAGGING_VERTEX,
  END_DRAGGING_VERTEX,
  UPDATE_DRAGGING_VERTEX
} from '../constants';
import { State } from '../models';
import { history } from '../utils/export';

export type BeginDraggingVertexAction = {
  type: typeof BEGIN_DRAGGING_VERTEX;
  layerID: string;
  vertexID: string;
  x: number;
  y: number;
};

export type UpdateDraggingVertexAction = {
  type: typeof UPDATE_DRAGGING_VERTEX;
  x: number;
  y: number;
};

export type EndDraggingVertexAction = {
  type: typeof END_DRAGGING_VERTEX;
  x: number;
  y: number;
};

export type VerticesAction =
  | BeginDraggingVertexAction
  | UpdateDraggingVertexAction
  | EndDraggingVertexAction;

export default function verticesReducer(
  state: State,
  action: VerticesAction
): State {
  switch (action.type) {
    case BEGIN_DRAGGING_VERTEX:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Vertex.beginDraggingVertex(
        state,
        action.layerID,
        action.vertexID,
        action.x,
        action.y
      );

    case UPDATE_DRAGGING_VERTEX:
      return Vertex.updateDraggingVertex(state, action.x, action.y);

    case END_DRAGGING_VERTEX:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Vertex.endDraggingVertex(state, action.x, action.y);

    default:
      return state;
  }
}
