import { ReactNode } from 'react';

import { produce } from 'immer';

import { Project } from '../class/export';
import {
  ADD_CIRCULAR_GUIDE,
  ADD_HORIZONTAL_GUIDE,
  ADD_VERTICAL_GUIDE,
  ALTERATE_STATE,
  CHANGE_CATALOG_PAGE,
  COPY_PROPERTIES,
  GO_BACK_TO_CATALOG_PAGE,
  INIT_CATALOG,
  LOAD_PROJECT,
  MODE_IDLE,
  ModeType,
  NEW_PROJECT,
  OPEN_CATALOG,
  OPEN_PROJECT_CONFIGURATOR,
  PASTE_PROPERTIES,
  PUSH_LAST_SELECTED_CATALOG_ELEMENT_TO_HISTORY,
  REMOVE,
  REMOVE_CIRCULAR_GUIDE,
  REMOVE_HORIZONTAL_GUIDE,
  REMOVE_VERTICAL_GUIDE,
  ROLLBACK,
  SELECT_TOOL_EDIT,
  SET_AREAS_ATTRIBUTES,
  SET_HOLES_ATTRIBUTES,
  SET_ITEMS_ATTRIBUTES,
  SET_LINES_ATTRIBUTES,
  SET_MODE,
  SET_PROJECT_PROPERTIES,
  SET_PROPERTIES,
  THROW_ERROR,
  THROW_WARNING,
  TOGGLE_SNAP,
  UNDO,
  UNSELECT_ALL,
  UPDATE_MOUSE_COORDS,
  UPDATE_ZOOM_SCALE
} from '../constants';
import { Area, CatalogState, Item, Scene, State } from '../models';
import {
  CatalogElement,
  HoleAttributes,
  LineAttributes,
  SnapMaskType
} from '../types';
import { history } from '../utils/export';

export type NewProjectAction = {
  type: typeof NEW_PROJECT;
};

export type LoadProjectAction = {
  type: typeof LOAD_PROJECT;
  sceneJSON: Scene;
};

export type OpenCatalogAction = {
  type: typeof OPEN_CATALOG;
};

export type ChangeCatalogPageAction = {
  type: typeof CHANGE_CATALOG_PAGE;
  oldPage: string;
  newPage: string;
};

export type GoBackToCatalogPageAction = {
  type: typeof GO_BACK_TO_CATALOG_PAGE;
  newPage: string;
};

export type SelectToolEditAction = {
  type: typeof SELECT_TOOL_EDIT;
};

export type UnselectAllAction = {
  type: typeof UNSELECT_ALL;
};

export type SetPropertiesAction = {
  type: typeof SET_PROPERTIES;
  properties: Record<string, any>;
};

export type SetItemsAttributesAction = {
  type: typeof SET_ITEMS_ATTRIBUTES;
  itemsAttributes: Partial<Item>;
};

export type SetLinesAttributesAction = {
  type: typeof SET_LINES_ATTRIBUTES;
  linesAttributes: Partial<LineAttributes>;
};

export type SetHolesAttributesAction = {
  type: typeof SET_HOLES_ATTRIBUTES;
  holesAttributes: Partial<HoleAttributes>;
};

export type SetAreasAttributesAction = {
  type: typeof SET_AREAS_ATTRIBUTES;
  areasAttributes: Partial<Area>;
};

export type RemoveAction = {
  type: typeof REMOVE;
};

export type UnDoAction = {
  type: typeof UNDO;
};

export type RollbackAction = {
  type: typeof ROLLBACK;
};

export type SetProjectPropertiesAction = {
  type: typeof SET_PROJECT_PROPERTIES;
  properties: Partial<Scene>;
};

export type OpenProjectConfiguratorAction = {
  type: typeof OPEN_PROJECT_CONFIGURATOR;
};

export type InitCatalogAction = {
  type: typeof INIT_CATALOG;
  catalog: CatalogState;
};

export type UpdateMouseCoordsAction = {
  type: typeof UPDATE_MOUSE_COORDS;
  coords: { x: number; y: number };
};

export type UpdateZoomScaleAction = {
  type: typeof UPDATE_ZOOM_SCALE;
  scale: number;
};

export type ToggleSnapAction = {
  type: typeof TOGGLE_SNAP;
  mask: SnapMaskType;
};

export type ThrowErrorAction = {
  type: typeof THROW_ERROR;
  error: ReactNode;
};

export type ThrowWarningAction = {
  type: typeof THROW_WARNING;
  warning: ReactNode;
};

export type CopyPropertiesAction = {
  type: typeof COPY_PROPERTIES;
  properties: Record<string, any>;
};

export type PastePropertiesAction = {
  type: typeof PASTE_PROPERTIES;
};

export type PushLastSelectedCatalogElementToHistoryAction = {
  type: typeof PUSH_LAST_SELECTED_CATALOG_ELEMENT_TO_HISTORY;
  element: CatalogElement;
};

export type AlterateStateAction = {
  type: typeof ALTERATE_STATE;
  alterate?: boolean;
};

export type SetModeAction = {
  type: typeof SET_MODE;
  mode: ModeType;
};

export type AddHorizontalGuideAction = {
  type: typeof ADD_HORIZONTAL_GUIDE;
  coordinate: number;
};

export type AddVerticalGuideAction = {
  type: typeof ADD_VERTICAL_GUIDE;
  coordinate: number;
};

export type AddCircularGuideAction = {
  type: typeof ADD_CIRCULAR_GUIDE;
  x: number;
  y: number;
  radius: number;
};

export type RemoveHorizontalGuideAction = {
  type: typeof REMOVE_HORIZONTAL_GUIDE;
  guideID: string;
};

export type RemoveVerticalGuideAction = {
  type: typeof REMOVE_VERTICAL_GUIDE;
  guideID: string;
};

export type RemoveCircularGuideAction = {
  type: typeof REMOVE_CIRCULAR_GUIDE;
  guideID: string;
};

export type ProjectAction =
  | NewProjectAction
  | LoadProjectAction
  | OpenCatalogAction
  | ChangeCatalogPageAction
  | GoBackToCatalogPageAction
  | SelectToolEditAction
  | UnselectAllAction
  | SetPropertiesAction
  | SetItemsAttributesAction
  | SetLinesAttributesAction
  | SetHolesAttributesAction
  | SetAreasAttributesAction
  | RemoveAction
  | UnDoAction
  | RollbackAction
  | SetProjectPropertiesAction
  | OpenProjectConfiguratorAction
  | InitCatalogAction
  | UpdateMouseCoordsAction
  | UpdateZoomScaleAction
  | ToggleSnapAction
  | ThrowErrorAction
  | ThrowWarningAction
  | CopyPropertiesAction
  | PastePropertiesAction
  | PushLastSelectedCatalogElementToHistoryAction
  | AlterateStateAction
  | SetModeAction
  | AddHorizontalGuideAction
  | AddVerticalGuideAction
  | AddCircularGuideAction
  | RemoveHorizontalGuideAction
  | RemoveVerticalGuideAction
  | RemoveCircularGuideAction;

export default function projectReducer(
  state: State,
  action: ProjectAction
): State {
  switch (action.type) {
    case NEW_PROJECT:
      return Project.newProject(state);

    case LOAD_PROJECT:
      return Project.loadProject(state, action.sceneJSON);

    case OPEN_CATALOG:
      return Project.openCatalog(state);

    case CHANGE_CATALOG_PAGE:
      return Project.changeCatalogPage(state, action.oldPage, action.newPage);

    case GO_BACK_TO_CATALOG_PAGE:
      return Project.goBackToCatalogPage(state, action.newPage);

    case SELECT_TOOL_EDIT:
      return Project.setMode(state, MODE_IDLE);

    case UNSELECT_ALL:
      return Project.unselectAll(state);

    case SET_PROPERTIES:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Project.setProperties(
        state,
        state.scene.selectedLayer as string,
        action.properties
      );

    case SET_ITEMS_ATTRIBUTES:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Project.setItemsAttributes(state, action.itemsAttributes);

    case SET_LINES_ATTRIBUTES:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Project.setLinesAttributes(state, action.linesAttributes);

    case SET_HOLES_ATTRIBUTES:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Project.setHolesAttributes(state, action.holesAttributes);

    case SET_AREAS_ATTRIBUTES:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Project.setAreasAttributes(state, action.areasAttributes);

    case REMOVE:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Project.remove(state);

    case UNDO:
      return Project.undo(state);

    case ROLLBACK:
      return Project.rollback(state);

    case SET_PROJECT_PROPERTIES:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Project.setProjectProperties(state, action.properties);

    case OPEN_PROJECT_CONFIGURATOR:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Project.openProjectConfigurator(state);

    case INIT_CATALOG:
      return Project.initCatalog(state, action.catalog);

    case UPDATE_MOUSE_COORDS:
      return Project.updateMouseCoord(state, action.coords);

    case UPDATE_ZOOM_SCALE:
      return Project.updateZoomScale(state, action.scale);

    case TOGGLE_SNAP:
      return Project.toggleSnap(state, action.mask);

    case THROW_ERROR:
      return Project.throwError(state, action.error);

    case THROW_WARNING:
      return Project.throwWarning(state, action.warning);

    case COPY_PROPERTIES:
      return Project.copyProperties(state, action.properties);

    case PASTE_PROPERTIES:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Project.pasteProperties(state);

    case PUSH_LAST_SELECTED_CATALOG_ELEMENT_TO_HISTORY:
      return Project.pushLastSelectedCatalogElementToHistory(
        state,
        action.element
      );

    case ALTERATE_STATE:
      return Project.setAlterate(state, action.alterate);

    case SET_MODE:
      return Project.setMode(state, action.mode);

    case ADD_HORIZONTAL_GUIDE:
      state = produce(state, (draft) => {
        draft.sceneHistory = history.historyPush(
          draft.sceneHistory,
          draft.scene
        );
      });
      return Project.addHorizontalGuide(state, action.coordinate);

    case ADD_VERTICAL_GUIDE:
      return Project.addVerticalGuide(state, action.coordinate);

    case ADD_CIRCULAR_GUIDE:
      return Project.addCircularGuide(state, action.x, action.y, action.radius);

    case REMOVE_HORIZONTAL_GUIDE:
      return Project.removeHorizontalGuide(state, action.guideID);

    case REMOVE_VERTICAL_GUIDE:
      return Project.removeVerticalGuide(state, action.guideID);

    case REMOVE_CIRCULAR_GUIDE:
      return Project.removeCircularGuide(state, action.guideID);
  }
}
