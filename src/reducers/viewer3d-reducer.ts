import { Project } from '../class/export';
import {
  MODE_3D_FIRST_PERSON,
  MODE_3D_VIEW,
  SELECT_TOOL_3D_FIRST_PERSON,
  SELECT_TOOL_3D_VIEW
} from '../constants';
import { State } from '../models';
import { history } from '../utils/export';

export type SelectTool3DViewAction = {
  type: typeof SELECT_TOOL_3D_VIEW;
};

export type SelectTool3DFirstPersonAction = {
  type: typeof SELECT_TOOL_3D_FIRST_PERSON;
};

export type Viewer3DAction =
  | SelectTool3DViewAction
  | SelectTool3DFirstPersonAction;

export default function viewer3DReducer(
  state: State,
  action: Viewer3DAction
): State {
  state = {
    ...state,
    sceneHistory: history.historyPush(state.sceneHistory, state.scene)
  };

  switch (action.type) {
    case SELECT_TOOL_3D_VIEW:
      state = Project.rollback(state);
      state = Project.setMode(state, MODE_3D_VIEW);
      return state;

    case SELECT_TOOL_3D_FIRST_PERSON:
      state = Project.rollback(state);
      state = Project.setMode(state, MODE_3D_FIRST_PERSON);
      return state;

    default:
      return state;
  }
}
