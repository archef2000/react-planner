import { ReactNode } from 'react';

import { produce } from 'immer';

import { CatalogJson } from '../catalog/catalog';
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
  SAVE_PROJECT,
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
import { Area, Item, Scene } from '../models';
import {
  CatalogElement,
  HoleAttributes,
  LineAttributes,
  SnapMaskType
} from '../types';

export function loadProject(sceneJSON: Scene) {
  return {
    type: LOAD_PROJECT,
    sceneJSON
  };
}

export function newProject() {
  return {
    type: NEW_PROJECT
  };
}

export function saveProject() {
  return {
    type: SAVE_PROJECT
  };
}

export function openCatalog() {
  return {
    type: OPEN_CATALOG
  };
}

export function changeCatalogPage(newPage: string, oldPage: string) {
  return {
    type: CHANGE_CATALOG_PAGE,
    newPage,
    oldPage
  };
}

export function goBackToCatalogPage(newPage: string) {
  return {
    type: GO_BACK_TO_CATALOG_PAGE,
    newPage
  };
}

export function selectToolEdit() {
  return {
    type: SELECT_TOOL_EDIT
  };
}

export function unselectAll() {
  return {
    type: UNSELECT_ALL
  };
}

export function setProperties(properties: Record<string, any>) {
  return {
    type: SET_PROPERTIES,
    properties
  };
}

export function setItemsAttributes(itemsAttributes: Item) {
  itemsAttributes = produce(itemsAttributes, (draft) => {
    draft.rotation = parseFloat(draft.rotation as any);
  });

  return {
    type: SET_ITEMS_ATTRIBUTES,
    itemsAttributes
  };
}

export function setLinesAttributes(linesAttributes: LineAttributes) {
  linesAttributes = produce(linesAttributes, (draft) => {
    draft.vertexOne.x = parseFloat(draft.vertexOne.x as any);
    draft.vertexOne.y = parseFloat(draft.vertexOne.y as any);
    draft.vertexTwo.x = parseFloat(draft.vertexTwo.x as any);
    draft.vertexTwo.y = parseFloat(draft.vertexTwo.y as any);
  });

  return {
    type: SET_LINES_ATTRIBUTES,
    linesAttributes
  };
}

export function setHolesAttributes(holesAttributes: HoleAttributes) {
  holesAttributes = produce(holesAttributes, (draft) => {
    draft.offset = parseFloat(draft.offset as any);
  });

  return {
    type: SET_HOLES_ATTRIBUTES,
    holesAttributes
  };
}

export function setAreasAttributes(areasAttributes: Area) {
  return {
    type: SET_AREAS_ATTRIBUTES,
    areasAttributes
  };
}

export function remove() {
  return {
    type: REMOVE
  };
}

export function undo() {
  return {
    type: UNDO
  };
}

export function rollback() {
  return {
    type: ROLLBACK
  };
}

export function openProjectConfigurator() {
  return {
    type: OPEN_PROJECT_CONFIGURATOR
  };
}

export function setProjectProperties(properties: Partial<Scene>) {
  return {
    type: SET_PROJECT_PROPERTIES,
    properties
  };
}

export function initCatalog(catalog: CatalogJson) {
  return {
    type: INIT_CATALOG,
    catalog
  };
}

export function updateMouseCoord({ x = 0, y = 0 }: { x: number; y: number }) {
  return {
    type: UPDATE_MOUSE_COORDS,
    coords: { x, y }
  };
}

export function updateZoomScale(scale: number) {
  return {
    type: UPDATE_ZOOM_SCALE,
    scale
  };
}

export function toggleSnap(mask: SnapMaskType) {
  return {
    type: TOGGLE_SNAP,
    mask
  };
}

export function throwError(error: ReactNode) {
  return {
    type: THROW_ERROR,
    error
  };
}

export function throwWarning(warning: ReactNode) {
  return {
    type: THROW_WARNING,
    warning
  };
}

export function copyProperties(properties: Record<string, any>) {
  return {
    type: COPY_PROPERTIES,
    properties
  };
}

export function pasteProperties() {
  return {
    type: PASTE_PROPERTIES
  };
}

export function pushLastSelectedCatalogElementToHistory(
  element: CatalogElement
) {
  return {
    type: PUSH_LAST_SELECTED_CATALOG_ELEMENT_TO_HISTORY,
    element
  };
}

export function setAlterateState(alterate?: boolean) {
  return {
    type: ALTERATE_STATE,
    alterate
  };
}

export function setMode(mode: ModeType) {
  return {
    type: SET_MODE,
    mode
  };
}

export function addHorizontalGuide(coordinate: number) {
  return {
    type: ADD_HORIZONTAL_GUIDE,
    coordinate
  };
}

export function addVerticalGuide(coordinate: number) {
  return {
    type: ADD_VERTICAL_GUIDE,
    coordinate
  };
}

export function addCircularGuide(x: number, y: number, radius: number) {
  return {
    type: ADD_CIRCULAR_GUIDE,
    x,
    y,
    radius
  };
}
export function removeHorizontalGuide(guideID: string) {
  return {
    type: REMOVE_HORIZONTAL_GUIDE,
    guideID
  };
}

export function removeVerticalGuide(guideID: string) {
  return {
    type: REMOVE_VERTICAL_GUIDE,
    guideID
  };
}

export function removeCircularGuide(guideID: string) {
  return {
    type: REMOVE_CIRCULAR_GUIDE,
    guideID
  };
}
