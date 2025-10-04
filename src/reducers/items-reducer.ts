import { produce } from 'immer';

import { Item } from '../class/export';
import {
  BEGIN_DRAGGING_ITEM,
  BEGIN_ROTATING_ITEM,
  END_DRAGGING_ITEM,
  END_DRAWING_ITEM,
  END_ROTATING_ITEM,
  SELECT_ITEM,
  SELECT_TOOL_DRAWING_ITEM,
  UPDATE_DRAGGING_ITEM,
  UPDATE_DRAWING_ITEM,
  UPDATE_ROTATING_ITEM
} from '../constants';
import { State } from '../models';
import { history } from '../utils/export';

export type ItemAction =
  | { type: typeof SELECT_ITEM; layerID: string; itemID: string }
  | { type: typeof SELECT_TOOL_DRAWING_ITEM; sceneComponentType: string }
  | { type: typeof UPDATE_DRAWING_ITEM; layerID: string; x: number; y: number }
  | { type: typeof END_DRAWING_ITEM; layerID: string; x: number; y: number }
  | {
    type: typeof BEGIN_DRAGGING_ITEM;
    layerID: string;
    itemID: string;
    x: number;
    y: number;
  }
  | { type: typeof UPDATE_DRAGGING_ITEM; x: number; y: number }
  | { type: typeof END_DRAGGING_ITEM; x: number; y: number }
  | {
    type: typeof BEGIN_ROTATING_ITEM;
    layerID: string;
    itemID: string;
    x: number;
    y: number;
  }
  | { type: typeof UPDATE_ROTATING_ITEM; x: number; y: number }
  | { type: typeof END_ROTATING_ITEM; x: number; y: number };

export default function itemsReducer(state: State, action: ItemAction): State {
  switch (action.type) {
    case SELECT_ITEM:
      return Item.select(state, action.layerID, action.itemID);

    case SELECT_TOOL_DRAWING_ITEM:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Item.selectToolDrawingItem(state, action.sceneComponentType);

    case UPDATE_DRAWING_ITEM:
      return Item.updateDrawingItem(state, action.layerID, action.x, action.y);

    case END_DRAWING_ITEM:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Item.endDrawingItem(state, action.layerID, action.x, action.y);

    case BEGIN_DRAGGING_ITEM:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Item.beginDraggingItem(
        state,
        action.layerID,
        action.itemID,
        action.x,
        action.y
      );

    case UPDATE_DRAGGING_ITEM:
      return Item.updateDraggingItem(state, action.x, action.y);

    case END_DRAGGING_ITEM:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Item.endDraggingItem(state, action.x, action.y);

    case BEGIN_ROTATING_ITEM:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Item.beginRotatingItem(
        state,
        action.layerID,
        action.itemID,
        action.x,
        action.y
      );

    case UPDATE_ROTATING_ITEM:
      return Item.updateRotatingItem(state, action.x, action.y);

    case END_ROTATING_ITEM:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Item.endRotatingItem(state, action.x, action.y);
    default:
      return state;
  }
}
