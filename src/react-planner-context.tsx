import { createContext } from 'react';

import {
  AreaActionsType,
  GroupsActionsType,
  HolesActionsType,
  ItemsActionsType,
  LinesActionsType,
  ProjectActionsType,
  SceneActionsType,
  VerticesActionsType,
  Viewer2DActionsType,
  Viewer3DActionsType
} from './actions/export';
import { CatalogJson } from './catalog/catalog';
import Translator from './translator/translator';

export interface ReactPlannerContextProps {
  projectActions: ProjectActionsType;
  viewer2DActions: Viewer2DActionsType;
  viewer3DActions: Viewer3DActionsType;
  linesActions: LinesActionsType;
  holesActions: HolesActionsType;
  itemsActions: ItemsActionsType;
  sceneActions: SceneActionsType;
  translator: Translator;
  catalog: CatalogJson;
  areaActions: AreaActionsType;
  verticesActions: VerticesActionsType;
  groupsActions: GroupsActionsType;
}

const ReactPlannerContext = createContext<ReactPlannerContextProps>(
  {} as ReactPlannerContextProps
);

export default ReactPlannerContext;
