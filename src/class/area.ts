import { Layer, Vertex, Group } from './export';
import { Area as AreaModel, State, Layer as LayerModel, Catalog, catalogElementFactory } from '../models';
import {
  IDBroker,
  NameGenerator
} from '../utils/export';
import { produce } from "immer";

class Area {
  static add(state: State, layerID: string, type: "area", verticesCoords: { x: number, y: number }[], catalog: Catalog) {
    if (!state.scene.layers[layerID]) return;

    const areaID = IDBroker.acquireID();
    const vertices = verticesCoords.map(v => {
      const { updatedState, vertex } = Vertex.add(state, layerID, v.x, v.y, 'areas', areaID);
      state = updatedState;
      return vertex.id;
    });

    const area = catalogElementFactory(catalog, type, {
      id: areaID,
      name: NameGenerator.generateName('areas', catalog.elements[type].info.title),
      type,
      prototype: 'areas',
      vertices
    });

    state = produce(state, draft => {
      draft.scene.layers[layerID].areas[area.id] = area as any;
    });
    return { updatedState: state, area };
  }

  static select(state: State, layerID: string, areaID: string) {
    state = Layer.select(state, layerID);
    state = Layer.selectElement(state, layerID, 'areas', areaID);
    return state
  }

  static remove(state: State, layerID: string, areaID: string) {
    return produce(state, draft => {
      const area = draft.scene.layers[layerID]?.areas[areaID];
      if (!area) return;

      area.vertices.forEach(vertexID => {
        Vertex.remove(draft, layerID, vertexID, 'areas', areaID);
      });

      delete draft.scene.layers[layerID].areas[areaID];

      Object.values(draft.scene.groups).forEach(group => {
        draft = Group.removeElement(draft, group.id, layerID, 'areas', areaID);
      });
      return draft;
    });
  }

  static unselect(state: State, layerID: string, areaID: string) {
    return Layer.unselect(state, layerID, 'areas', areaID);
  }

  static setProperties(state: State, layerID: string, areaID: string, properties: any) {
    return produce(state, draft => {
      const area = draft.scene.layers[layerID]?.areas[areaID];
      if (area) {
        Object.assign(area.properties, properties);
      }
    });
  }

  static updateProperties(state: State, layerID: string, areaID: string, properties: Record<string, any>) {
    return produce(state, draft => {
      const propsPath = draft.scene?.layers?.[layerID]?.areas?.[areaID]?.properties;

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

  static updateJsProperties(state: State, layerID: string, areaID: string, properties: any) {
    return this.updateProperties(state, layerID, areaID, properties);
  }

  static setAttributes(state: State, layerID: string, areaID: string, areaAttributes: any) {
    return produce(state, draft => {
      const area = draft.scene.layers[layerID].areas[areaID];
      Object.assign(area, areaAttributes);
    });
  }
}

export { Area as default };
