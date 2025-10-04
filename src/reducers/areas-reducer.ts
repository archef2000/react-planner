import { Area } from '../class/export';
import { SELECT_AREA } from '../constants';
import { State } from '../models';

export type SelectAreaAction = {
  type: typeof SELECT_AREA;
  layerID: string;
  areaID: string;
};

export type AreaAction = SelectAreaAction;

export default function areasReducer(state: State, action: AreaAction): State {
  switch (action.type) {
    case SELECT_AREA:
      return Area.select(state, action.layerID, action.areaID);
    default:
      return state;
  }
}
