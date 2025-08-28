import {
  MODE_3D_VIEW,
  MODE_3D_FIRST_PERSON,
  SELECT_TOOL_3D_VIEW,
  SELECT_TOOL_3D_FIRST_PERSON
} from '../constants';
import { Project } from '../class/export';
import { history } from '../utils/export';
import { State } from '../models';

export default function (state: State, action) {

  state = {
    ...state,
    sceneHistory: history.historyPush(state.sceneHistory, state.scene)
  }

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
