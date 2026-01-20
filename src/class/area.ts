import { produce } from 'immer';

import { catalogElementFactory, CatalogState, State } from '../models';
import { IDBroker, NameGenerator } from '../utils/export';

import { Group, Layer, Line, Vertex } from './export';

class Area {
  static add(
    state: State,
    layerID: string,
    type: 'area',
    verticesCoords: { x: number; y: number }[],
    catalog: CatalogState
  ) {
    const areaID = IDBroker.acquireID();
    const vertices = verticesCoords.map((v) => {
      const { updatedState, vertex } = Vertex.add(
        state,
        layerID,
        v.x,
        v.y,
        'areas',
        areaID
      );
      state = updatedState;
      return vertex.id;
    });

    const area = catalogElementFactory(catalog, type, {
      id: areaID,
      name: NameGenerator.generateName(
        'areas',
        catalog.elements[type].info.title
      ),
      type,
      prototype: 'areas',
      vertices
    });

    state = produce(state, (draft) => {
      draft.scene.layers[layerID].areas[area.id] = area as any;
    });
    return { updatedState: state, area };
  }

  static select(state: State, layerID: string, areaID: string) {
    state = Layer.select(state, layerID);
    state = Layer.selectElement(state, layerID, 'areas', areaID);
    return state;
  }

  static remove(state: State, layerID: string, areaID: string) {
    const area = state.scene.layers[layerID]?.areas[areaID];
    if (!area) return state;

    for (const line of Object.values(state.scene.layers[layerID].lines)) {
      if (line.vertices.every((v) => area.vertices.includes(v))) {
        state = Line.remove(state, layerID, line.id);
      }
    }

    state = produce(state, (draft) => {
      delete draft.scene.layers[layerID].areas[areaID];
    });

    Object.values(state.scene.groups).forEach((group) => {
      state = Group.removeElement(state, group.id, layerID, 'areas', areaID);
    });
    return state;
  }

  static unselect(state: State, layerID: string, areaID: string) {
    return Layer.unselect(state, layerID, 'areas', areaID);
  }

  static setProperties(
    state: State,
    layerID: string,
    areaID: string,
    properties: any
  ) {
    return produce(state, (draft) => {
      const area = draft.scene.layers[layerID]?.areas[areaID];
      if (area) {
        Object.assign(area.properties, properties);
      }
    });
  }

  static updateProperties(
    state: State,
    layerID: string,
    areaID: string,
    properties: Record<string, any>
  ) {
    return produce(state, (draft) => {
      const propsPath =
        draft.scene?.layers?.[layerID]?.areas?.[areaID]?.properties;

      if (!propsPath) return;

      Object.entries(properties).forEach(([k, v]) => {
        if (propsPath.hasOwnProperty(k)) {
          propsPath[k] = {
            ...propsPath[k],
            ...v
          };
        }
      });
    });
  }

  static updateJsProperties(
    state: State,
    layerID: string,
    areaID: string,
    properties: any
  ) {
    return this.updateProperties(state, layerID, areaID, properties);
  }

  static setAttributes(
    state: State,
    layerID: string,
    areaID: string,
    areaAttributes: any
  ) {
    return produce(state, (draft) => {
      const area = draft.scene.layers[layerID].areas[areaID];
      Object.assign(area, areaAttributes);
    });
  }
}

export { Area as default };
