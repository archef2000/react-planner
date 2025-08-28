import {
  MODE_VIEWING_CATALOG,
  MODE_CONFIGURING_PROJECT,
  MODE_IDLE
} from '../constants';
import { State, Catalog, CatalogProps, SceneJson } from '../models';
import { history } from '../utils/export';
import {
  Layer,
  Group,
  Line,
  Hole,
  Item,
  HorizontalGuide,
  VerticalGuide
} from '../class/export';
import { produce } from 'immer';

class Project {
  static setAlterate(state: State) {
    return produce(state, draft => {
      draft.alterate = !draft.alterate;
    });
  }

  static openCatalog(state: State) {
    return this.setMode(state, MODE_VIEWING_CATALOG);
  }

  static newProject(state: State) {
    return State({ 'viewer2D': state.viewer2D });
  }

  static loadProject(state: State, sceneJSON: SceneJson) {
    return State({ scene: sceneJSON, catalog: state.catalog });
  }

  static setProperties(state: State, layerID: string, properties: Record<string, any>) {
    return Layer.setPropertiesOnSelected(state, layerID, properties);
  }

  static updateProperties(state: State, layerID: string, properties: Record<string, any>) {
    return Layer.updatePropertiesOnSelected(state, layerID, properties);
  }

  static setItemsAttributes(state: State, attributes) {
    //TODO apply only to items
    return produce(state, draft => {
      Object.values(draft.scene.layers).forEach((layer) => {
        draft = Layer.setAttributesOnSelected(draft, layer.id, attributes);
      });
      return draft;
    });
  }

  static setLinesAttributes(state: State, attributes) {
    //TODO apply only to lines
    Object.values(state.scene.layers).forEach((layer) => {
      state = Layer.setAttributesOnSelected(state, layer.id, attributes);
    });
    return state;
  }

  static setHolesAttributes(state: State, attributes) {
    //TODO apply only to holes
    return produce(state, draft => {
      Object.values(draft.scene.layers).forEach((layer) => {
        draft = Layer.setAttributesOnSelected(draft, layer.id, attributes);
      });
      return draft;
    });
  }

  static unselectAll(state: State) {
    Object.values(state.scene.layers).forEach(layer => {
      state = Layer.unselectAll(state, layer.id);
    });
    Object.values(state.scene.groups).forEach(group => {
      state = Group.unselect(state, group.id);
    });
    return state;
  }

  static remove(state: State) {
    const selectedLayer = state.scene.selectedLayer;
    const {
      lines: selectedLines,
      holes: selectedHoles,
      items: selectedItems
    } = state.scene.layers[selectedLayer].selected;

    state = Layer.unselectAll(state, selectedLayer);

    selectedLines.forEach(lineID => { state = Line.remove(state, selectedLayer, lineID); });
    selectedHoles.forEach(holeID => { state = Hole.remove(state, selectedLayer, holeID); });
    selectedItems.forEach(itemID => { state = Item.remove(state, selectedLayer, itemID); });

    state = Layer.detectAndUpdateAreas(state, selectedLayer);
    return state;
  }

  static undo(state: State) {
    let sceneHistory = state.sceneHistory;
    if (state.scene === sceneHistory.last && sceneHistory.list.length > 1) {
      sceneHistory = history.historyPop(sceneHistory);
    }

    return produce(state, draft => {
      draft.mode = MODE_IDLE;
      draft.scene = sceneHistory.last;
      draft.sceneHistory = history.historyPop(sceneHistory);
    });
  }

  static rollback(state: State) {
    const sceneHistory = state.sceneHistory;

    if (!sceneHistory.last) {
      return state;
    }

    state = this.unselectAll(state);

    return produce(state, draft => {
      draft.mode = MODE_IDLE;
      draft.scene = sceneHistory.last;
      draft.sceneHistory = history.historyPush(sceneHistory, sceneHistory.last);
      draft.snapElements = [];
      draft.activeSnapElement = null;
      draft.drawingSupport = {};
      draft.draggingSupport = {};
      draft.rotatingSupport = null;
    });
  }

  static setProjectProperties(state: State, properties) {
    return produce(state, draft => {
      draft.mode = MODE_IDLE;
      Object.assign(draft.scene, properties);
    });
  }

  static openProjectConfigurator(state: State) {
    return produce(state, draft => {
      draft.mode = MODE_CONFIGURING_PROJECT;
    });
  }

  static initCatalog(state: State, catalog: CatalogProps): State {
    return State({
      ...state,
      catalog: Catalog(catalog)
    });
  }

  static updateMouseCoord(state: State, coords: { x: number; y: number }) {
    return produce(state, draft => {
      draft.mouse = coords;
    });
  }

  static updateZoomScale(state: State, scale) {
    return produce(state, draft => {
      draft.zoom = scale;
    });
  }

  static toggleSnap(state: State, mask) {
    return produce(state, draft => {
      draft.snapMask = mask;
    });
  }

  static throwError(state: State, error) {
    return produce(state, draft => {
      draft.errors.push({
        date: Date.now(),
        error
      });
    });
  }

  static throwWarning(state: State, warning) {
    return produce(state, draft => {
      draft.warnings.push({
        date: Date.now(),
        warning
      });
    });
  }

  static copyProperties(state: State, properties) {
    return produce(state, draft => {
      draft.clipboardProperties = properties;
    });
  }

  static pasteProperties(state: State) {
    return produce(state, draft => {
      const layerID = draft.scene.selectedLayer;
      const properties = draft.clipboardProperties;
      draft = Layer.updatePropertiesOnSelected(draft, layerID, properties);
      return draft;
    });
  }

  static pushLastSelectedCatalogElementToHistory(state: State, element) {
    let currHistory = state.selectedElementsHistory;

    const previousPosition = currHistory.findIndex(el => el.name === element.name);
    if (previousPosition !== -1) {
      currHistory = currHistory.splice(previousPosition, 1);
    }
    currHistory = currHistory.splice(0, 0, element);

    return produce(state, draft => {
      draft.selectedElementsHistory = currHistory;
    });
  }

  static changeCatalogPage(state: State, oldPage, newPage) {
    return produce(state, draft => {
      draft.catalog.page = newPage;
      draft.catalog.path.push(oldPage);
    });
  }

  static goBackToCatalogPage(state: State, newPage) {
    const pageIndex = state.catalog.path.findIndex(page => page === newPage);
    return produce(state, draft => {
      draft.catalog.page = newPage;
      draft.catalog.path = draft.catalog.path.slice(0, pageIndex);
    });
  }

  static setMode(state: State, mode) {
    return { ...state, mode };
  }

  static addHorizontalGuide(state: State, coordinate) {
    return HorizontalGuide.create(state, coordinate);
  }

  static addVerticalGuide(state: State, coordinate) {
    return VerticalGuide.create(state, coordinate);
  }

  static addCircularGuide(state: State, x: number, y: number, radius: number) {
    return state;
  }

  static removeHorizontalGuide(state: State, guideID: string) {
    return HorizontalGuide.remove(state, guideID);
  }

  static removeVerticalGuide(state: State, guideID: string) {
    return VerticalGuide.remove(state, guideID);
  }

  static removeCircularGuide(state: State, guideID: string) {
    return state;
  }

}

export { Project as default };
