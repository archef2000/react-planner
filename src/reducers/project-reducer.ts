import { history } from '../utils/export';
import {
  LOAD_PROJECT,
  NEW_PROJECT,
  OPEN_CATALOG,
  SELECT_TOOL_EDIT,
  MODE_IDLE,
  UNSELECT_ALL,
  SET_PROPERTIES,
  SET_ITEMS_ATTRIBUTES,
  SET_LINES_ATTRIBUTES,
  SET_HOLES_ATTRIBUTES,
  REMOVE,
  UNDO,
  ROLLBACK,
  SET_PROJECT_PROPERTIES,
  OPEN_PROJECT_CONFIGURATOR,
  INIT_CATALOG,
  UPDATE_MOUSE_COORDS,
  UPDATE_ZOOM_SCALE,
  TOGGLE_SNAP,
  CHANGE_CATALOG_PAGE,
  GO_BACK_TO_CATALOG_PAGE,
  THROW_ERROR,
  THROW_WARNING,
  COPY_PROPERTIES,
  PASTE_PROPERTIES,
  PUSH_LAST_SELECTED_CATALOG_ELEMENT_TO_HISTORY,
  ALTERATE_STATE,
  SET_MODE,
  ADD_HORIZONTAL_GUIDE,
  ADD_VERTICAL_GUIDE,
  ADD_CIRCULAR_GUIDE,
  REMOVE_HORIZONTAL_GUIDE,
  REMOVE_VERTICAL_GUIDE,
  REMOVE_CIRCULAR_GUIDE
} from '../constants';

import { Project } from '../class/export';
import { State } from '../models';
import { produce } from 'immer';

export default function (state: State, action): State {
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
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
      });
      return Project.setProperties(state, state.scene.selectedLayer, action.properties);

    case SET_ITEMS_ATTRIBUTES:
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
      });
      return Project.setItemsAttributes(state, action.itemsAttributes);

    case SET_LINES_ATTRIBUTES:
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
      });
      return Project.setLinesAttributes(state, action.linesAttributes);

    case SET_HOLES_ATTRIBUTES:
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
      });
      return Project.setHolesAttributes(state, action.holesAttributes);

    case REMOVE:
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
      });
      return Project.remove(state);

    case UNDO:
      return Project.undo(state);

    case ROLLBACK:
      return Project.rollback(state);

    case SET_PROJECT_PROPERTIES:
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
      });
      return Project.setProjectProperties(state, action.properties);

    case OPEN_PROJECT_CONFIGURATOR:
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
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
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
      });
      return Project.pasteProperties(state);

    case PUSH_LAST_SELECTED_CATALOG_ELEMENT_TO_HISTORY:
      return Project.pushLastSelectedCatalogElementToHistory(state, action.element);

    case ALTERATE_STATE:
      return Project.setAlterate(state);

    case SET_MODE:
      return Project.setMode(state, action.mode);

    case ADD_HORIZONTAL_GUIDE:
      state = produce(state, draft => {
        draft.sceneHistory = history.historyPush(draft.sceneHistory, draft.scene);
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

    default:
      return state;
  }
}
