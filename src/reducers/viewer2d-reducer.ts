import { State } from '../models';
import {
  UPDATE_2D_CAMERA,
  SELECT_TOOL_PAN,
  SELECT_TOOL_ZOOM_IN,
  SELECT_TOOL_ZOOM_OUT,
  MODE_2D_PAN,
  MODE_2D_ZOOM_IN,
  MODE_2D_ZOOM_OUT
} from '../constants';

export default function (state: State, action): State {
  switch (action.type) {
    case UPDATE_2D_CAMERA:
      return { ...state, viewer2D: action.value };

    case SELECT_TOOL_PAN:
      return { ...state, mode: MODE_2D_PAN };

    case SELECT_TOOL_ZOOM_IN:
      return { ...state, mode: MODE_2D_ZOOM_IN };

    case SELECT_TOOL_ZOOM_OUT:
      return { ...state, mode: MODE_2D_ZOOM_OUT };
  }
}
