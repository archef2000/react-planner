import { Layer } from '../class/export';
import { history } from '../utils/export';
import {
  ADD_LAYER,
  SELECT_LAYER,
  SET_LAYER_PROPERTIES,
  REMOVE_LAYER
} from '../constants';
import { State } from '../models';

export default function (state: State, action): State {

  state = { ...state, sceneHistory: history.historyPush(state.sceneHistory, state.scene) };

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
