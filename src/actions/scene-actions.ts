import {
  ADD_LAYER,
  REMOVE_LAYER,
  SELECT_LAYER,
  SET_LAYER_PROPERTIES
} from '../constants';
import { Layer as LayerModel } from '../models';

export function selectLayer(layerID: string) {
  return {
    type: SELECT_LAYER,
    layerID
  };
}

export function addLayer(name: string, altitude: number) {
  return {
    type: ADD_LAYER,
    name,
    altitude
  };
}

export function setLayerProperties(
  layerID: string,
  properties: Partial<LayerModel>
) {
  return {
    type: SET_LAYER_PROPERTIES,
    layerID,
    properties
  };
}

export function removeLayer(layerID: string) {
  return {
    type: REMOVE_LAYER,
    layerID
  };
}
