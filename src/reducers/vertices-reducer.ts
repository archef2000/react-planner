import {
  BEGIN_DRAGGING_VERTEX,
  UPDATE_DRAGGING_VERTEX,
  END_DRAGGING_VERTEX
} from '../constants';
import { Vertex } from '../class/export';
import { State } from '../models';
import { history } from '../utils/export';
import { produce } from 'immer';

export default function (state: State, action) {
  switch (action.type) {
    case BEGIN_DRAGGING_VERTEX:
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
      });
      return Vertex.beginDraggingVertex(state, action.layerID, action.vertexID, action.x, action.y);

    case UPDATE_DRAGGING_VERTEX:
      return Vertex.updateDraggingVertex(state, action.x, action.y);

    case END_DRAGGING_VERTEX:
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
      });
      return Vertex.endDraggingVertex(state, action.x, action.y);

    default:
      return state;
  }
}
