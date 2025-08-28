import React, { createContext } from 'react';
import { ProjectActionsType, Viewer3DActionsType, Viewer2DActionsType, AreaActionsType, VerticesActionsType, ItemsActionsType, HolesActionsType, LinesActionsType, GroupsActionsType, SceneActionsType } from './actions/export';
import Translator from './translator/translator';
import { CatalogJson } from './catalog/catalog';

export interface ReactPlannerContextProps {
    projectActions: ProjectActionsType,
    viewer2DActions: Viewer2DActionsType,
    viewer3DActions: Viewer3DActionsType,
    linesActions: LinesActionsType,
    holesActions: HolesActionsType,
    itemsActions: ItemsActionsType,
    sceneActions: SceneActionsType,
    translator: Translator,
    catalog: CatalogJson,
    areaActions: AreaActionsType,
    verticesActions: VerticesActionsType,
    groupsActions: GroupsActionsType,
}

const ReactPlannerContext = createContext<ReactPlannerContextProps>({} as ReactPlannerContextProps);

export default ReactPlannerContext;