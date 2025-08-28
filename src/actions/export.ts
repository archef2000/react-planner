import * as projectActions from './project-actions';
import * as viewer2DActions from './viewer2d-actions';
import * as viewer3DActions from './viewer3d-actions';
import * as linesActions from './lines-actions';
import * as holesActions from './holes-actions';
import * as sceneActions from './scene-actions';
import * as verticesActions from './vertices-actions';
import * as itemsActions from './items-actions';
import * as areaActions from './area-actions';
import * as groupsActions from './groups-actions';

export type ProjectActionsType = typeof projectActions;
export type Viewer2DActionsType = typeof viewer2DActions;
export type Viewer3DActionsType = typeof viewer3DActions;
export type LinesActionsType = typeof linesActions;
export type HolesActionsType = typeof holesActions;
export type SceneActionsType = typeof sceneActions;
export type VerticesActionsType = typeof verticesActions;
export type ItemsActionsType = typeof itemsActions;
export type AreaActionsType = typeof areaActions;
export type GroupsActionsType = typeof groupsActions;

export {
  projectActions,
  viewer2DActions,
  viewer3DActions,
  linesActions,
  holesActions,
  sceneActions,
  verticesActions,
  itemsActions,
  areaActions,
  groupsActions
};

export default {
  projectActions,
  viewer2DActions,
  viewer3DActions,
  linesActions,
  holesActions,
  sceneActions,
  verticesActions,
  itemsActions,
  areaActions,
  groupsActions
};
