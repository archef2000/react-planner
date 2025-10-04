import {
  AREA_ACTIONS,
  GROUP_ACTIONS,
  HOLE_ACTIONS,
  ITEMS_ACTIONS,
  LINE_ACTIONS,
  PROJECT_ACTIONS,
  SCENE_ACTIONS,
  VERTEX_ACTIONS,
  VIEWER2D_ACTIONS,
  VIEWER3D_ACTIONS
} from '../constants';
import { State } from '../models';

import { AreaAction } from './areas-reducer';
import {
  ReactPlannerAreasReducer,
  ReactPlannerGroupsReducer,
  ReactPlannerHolesReducer,
  ReactPlannerItemsReducer,
  ReactPlannerLinesReducer,
  ReactPlannerProjectReducer,
  ReactPlannerSceneReducer,
  ReactPlannerVerticesReducer,
  ReactPlannerViewer2dReducer,
  ReactPlannerViewer3dReducer
} from './export';
import { GroupAction } from './groups-reducer';
import { HoleAction } from './holes-reducer';
import { ItemAction } from './items-reducer';
import { LineAction } from './lines-reducer';
import { ProjectAction } from './project-reducer';
import { SceneAction } from './scene-reducer';
import { VerticesAction } from './vertices-reducer';
import { Viewer2DAction } from './viewer2d-reducer';
import { Viewer3DAction } from './viewer3d-reducer';

export const initialState = State();

export type ReducerAction =
  | ProjectAction
  | Viewer2DAction
  | Viewer3DAction
  | ItemAction
  | HoleAction
  | LineAction
  | AreaAction
  | GroupAction
  | SceneAction
  | VerticesAction;

export default function appReducer(state: State, action: ReducerAction): State {
  if (PROJECT_ACTIONS[action.type as keyof typeof PROJECT_ACTIONS])
    return ReactPlannerProjectReducer(state, action as ProjectAction);
  if (VIEWER2D_ACTIONS[action.type as keyof typeof VIEWER2D_ACTIONS])
    return ReactPlannerViewer2dReducer(state, action as Viewer2DAction);
  if (VIEWER3D_ACTIONS[action.type as keyof typeof VIEWER3D_ACTIONS])
    return ReactPlannerViewer3dReducer(state, action as Viewer3DAction);
  if (ITEMS_ACTIONS[action.type as keyof typeof ITEMS_ACTIONS])
    return ReactPlannerItemsReducer(state, action as ItemAction);
  if (HOLE_ACTIONS[action.type as keyof typeof HOLE_ACTIONS])
    return ReactPlannerHolesReducer(state, action as HoleAction);
  if (LINE_ACTIONS[action.type as keyof typeof LINE_ACTIONS])
    return ReactPlannerLinesReducer(state, action as LineAction);
  if (AREA_ACTIONS[action.type as keyof typeof AREA_ACTIONS])
    return ReactPlannerAreasReducer(state, action as AreaAction);
  if (GROUP_ACTIONS[action.type as keyof typeof GROUP_ACTIONS])
    return ReactPlannerGroupsReducer(state, action as GroupAction);
  if (SCENE_ACTIONS[action.type as keyof typeof SCENE_ACTIONS])
    return ReactPlannerSceneReducer(state, action as SceneAction);
  if (VERTEX_ACTIONS[action.type as keyof typeof VERTEX_ACTIONS])
    return ReactPlannerVerticesReducer(state, action as VerticesAction);

  return state || initialState;
}
