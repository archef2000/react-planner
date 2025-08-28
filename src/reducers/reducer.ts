import {
  PROJECT_ACTIONS,
  VIEWER2D_ACTIONS,
  VIEWER3D_ACTIONS,
  GROUP_ACTIONS,
  ITEMS_ACTIONS,
  HOLE_ACTIONS,
  LINE_ACTIONS,
  AREA_ACTIONS,
  SCENE_ACTIONS,
  VERTEX_ACTIONS
} from '../constants';

import {
  ReactPlannerAreasReducer,
  ReactPlannerHolesReducer,
  ReactPlannerItemsReducer,
  ReactPlannerLinesReducer,
  ReactPlannerGroupsReducer,
  ReactPlannerProjectReducer,
  ReactPlannerSceneReducer,
  ReactPlannerVerticesReducer,
  ReactPlannerViewer2dReducer,
  ReactPlannerViewer3dReducer
} from './export';

import { State } from '../models';

export const initialState = State();

export default function appReducer(state, action) {
  if (PROJECT_ACTIONS[action.type]) return ReactPlannerProjectReducer(state, action);
  if (VIEWER2D_ACTIONS[action.type]) return ReactPlannerViewer2dReducer(state, action);
  if (VIEWER3D_ACTIONS[action.type]) return ReactPlannerViewer3dReducer(state, action);
  if (ITEMS_ACTIONS[action.type]) return ReactPlannerItemsReducer(state, action);
  if (HOLE_ACTIONS[action.type]) return ReactPlannerHolesReducer(state, action);
  if (LINE_ACTIONS[action.type]) return ReactPlannerLinesReducer(state, action);
  if (AREA_ACTIONS[action.type]) return ReactPlannerAreasReducer(state, action);
  if (GROUP_ACTIONS[action.type]) return ReactPlannerGroupsReducer(state, action);
  if (SCENE_ACTIONS[action.type]) return ReactPlannerSceneReducer(state, action);
  if (VERTEX_ACTIONS[action.type]) return ReactPlannerVerticesReducer(state, action);

  return state || initialState;
};
