import { Value as ReactSVGPanZoomValue } from 'react-svg-pan-zoom';

import {
  MODE_2D_PAN,
  MODE_2D_ZOOM_IN,
  MODE_2D_ZOOM_OUT,
  SELECT_TOOL_PAN,
  SELECT_TOOL_ZOOM_IN,
  SELECT_TOOL_ZOOM_OUT,
  UPDATE_2D_CAMERA
} from '../constants';
import { State } from '../models';

export type Update2DCameraAction = {
  type: typeof UPDATE_2D_CAMERA;
  value: ReactSVGPanZoomValue;
};

export type SelectToolPanAction = {
  type: typeof SELECT_TOOL_PAN;
};

export type SelectToolZoomInAction = {
  type: typeof SELECT_TOOL_ZOOM_IN;
};

export type SelectToolZoomOutAction = {
  type: typeof SELECT_TOOL_ZOOM_OUT;
};

export type Viewer2DAction =
  | Update2DCameraAction
  | SelectToolPanAction
  | SelectToolZoomInAction
  | SelectToolZoomOutAction;

export default function viewer2DReducer(
  state: State,
  action: Viewer2DAction
): State {
  switch (action.type) {
    case UPDATE_2D_CAMERA:
      return { ...state, viewer2D: action.value };

    case SELECT_TOOL_PAN:
      return { ...state, mode: MODE_2D_PAN };

    case SELECT_TOOL_ZOOM_IN:
      return { ...state, mode: MODE_2D_ZOOM_IN };

    case SELECT_TOOL_ZOOM_OUT:
      return { ...state, mode: MODE_2D_ZOOM_OUT };

    default:
      return state;
  }
}
