import { Layer } from '../class/export';
import {
  ADD_LAYER,
  REMOVE_LAYER,
  SELECT_LAYER,
  SET_LAYER_PROPERTIES
} from '../constants';
import { Layer as LayerModel, State } from '../models';
import { history } from '../utils/export';

export type SceneAction =
  | { type: typeof ADD_LAYER; name: string; altitude: number }
  | { type: typeof SELECT_LAYER; layerID: string }
  | {
    type: typeof SET_LAYER_PROPERTIES;
    layerID: string;
    properties: Partial<LayerModel>;
  }
  | { type: typeof REMOVE_LAYER; layerID: string };

export default function sceneReducer(state: State, action: SceneAction): State {
  state = {
    ...state,
    sceneHistory: history.historyPush(state.sceneHistory, state.scene)
  };

  switch (action.type) {
    case ADD_LAYER:
      return Layer.create(state, action.name, action.altitude);

    case SELECT_LAYER:
      return Layer.select(state, action.layerID);

    case SET_LAYER_PROPERTIES:
      return Layer.setProperties(state, action.layerID, action.properties);

    case REMOVE_LAYER:
      return Layer.remove(state, action.layerID);

    default:
      return state;
  }
}
