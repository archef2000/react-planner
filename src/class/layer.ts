import { Project, Area, Line, Hole, Item, Vertex } from './export';
import { Edge } from '../utils/graph';
import {
  GraphInnerCycles,
  GeometryUtils,
  IDBroker
} from '../utils/export';
import { Layer as LayerModel, State } from '../models';
import { produce } from 'immer';
import { ElementPrototypes } from '../types';

const sameSet = (set1: Set<string>, set2: Set<string>) => set1.size === set2.size && set1.isSupersetOf(set2) && set1.isSupersetOf(set2);

class Layer {

  static create(state: State, name: string, altitude: number) {
    return produce(state, draft => {
      const layerID = IDBroker.acquireID();
      name = name || `layer ${layerID}`;
      altitude = altitude || 0;

      const layer = LayerModel({ id: layerID, name, altitude });
      draft.scene.selectedLayer = layerID;
      draft.scene.layers[layerID] = layer;
    });
  }

  static select(state: State, layerID: string) {
    return produce(state, draft => {
      if (!draft.alterate) {
        draft = Project.unselectAll(draft);
      }
      draft.scene.selectedLayer = layerID;
      return draft;
    });
  }

  static selectElement(state: State, layerID: string, elementPrototype: ElementPrototypes, elementID: string) {
    return produce(state, draft => {
      const layer = draft.scene.layers[layerID];
      if (!layer) return;
      const element = layer[elementPrototype][elementID];
      if (!element) return;
      element.selected = true;
      if (elementID in layer.selected[elementPrototype]) return;
      layer.selected[elementPrototype].push(elementID);
    });
  }

  static unselect(state: State, layerID: string, elementPrototype: ElementPrototypes, elementID: string) {
    return produce(state, draft => {
      const layer = draft.scene.layers[layerID];
      if (!layer) return;
      const element = layer[elementPrototype][elementID];
      if (!element) return;

      element.selected = false;
      layer.selected[elementPrototype] = layer.selected[elementPrototype].filter(el => el !== elementID);
    });
  }

  static unselectAll(state: State, layerID: string) {
    return produce(state, draft => {
      const layer = draft.scene.layers[layerID];
      if (!layer) return;

      const { lines, holes, items, areas } = layer;

      Object.values(lines).forEach(line => { draft = Line.unselect(draft, layerID, line.id); });
      Object.values(holes).forEach(hole => { draft = Hole.unselect(draft, layerID, hole.id); });
      Object.values(items).forEach(item => { draft = Item.unselect(draft, layerID, item.id); });
      Object.values(areas).forEach(area => { draft = Area.unselect(draft, layerID, area.id); });
      return draft;
    });
  }

  static setProperties(state: State, layerID: string, properties: any) {
    return produce(state, draft => {
      const layer = draft.scene.layers[layerID];
      if (!layer) return;
      Object.assign(layer, properties);
      const sortedLayers = Object.values(draft.scene.layers).sort((a, b) => a.altitude !== b.altitude ? a.altitude - b.altitude : a.order - b.order);
      draft.scene.layers = sortedLayers.reduce((acc, l) => ({ ...acc, [l.id]: l }), {});
    });
  }

  static remove(state: State, layerID: string) {
    return produce(state, draft => {
      delete draft.scene.layers[layerID];
      if (draft.scene.selectedLayer === layerID) {
        const newSelectedLayer = Object.keys(draft.scene.layers)[0];
        draft.scene.selectedLayer = newSelectedLayer || null;
      }
    });
  }

  static removeElement(state: State, layerID: string, elementPrototype: string, elementID: string) {
    return produce(state, draft => {
      const layer = draft.scene.layers[layerID];
      if (layer && layer[elementPrototype]) {
        delete layer[elementPrototype][elementID];
      }
    });
  }

  static detectAndUpdateAreas(state: State, layerID: string) {
    // Compute cycles from the current state first
    const layer0 = state.scene.layers[layerID];
    if (!layer0) return state;

    const verticesArray: Array<[number, number]> = [];
    const vertexID_to_verticesArrayIndex: Record<string, number> = {};
    const verticesArrayIndex_to_vertexID: Record<number, string> = {};

    Object.values(layer0.vertices).forEach((vertex, i) => {
      verticesArray.push([vertex.x, vertex.y]);
      vertexID_to_verticesArrayIndex[vertex.id] = i;
      verticesArrayIndex_to_vertexID[i] = vertex.id;
    });

    const linesArray = Object.values(layer0.lines)
      .map(line => line.vertices.map(vertexID => vertexID_to_verticesArrayIndex[vertexID]));

    const innerCyclesByVerticesID1 = GraphInnerCycles.calculateInnerCycles(verticesArray, linesArray);
    const innerCyclesByVerticesID2 = innerCyclesByVerticesID1
      .map(cycle => cycle.map(vertexIndex => verticesArrayIndex_to_vertexID[vertexIndex]));

    const innerCyclesByVerticesID = innerCyclesByVerticesID2
      .map(area => GraphInnerCycles.isClockWiseOrder(area.map(vertexID => layer0.vertices[vertexID])) ? area.reverse() : area);

    // Remove old areas
    Object.values(state.scene.layers[layerID].areas).forEach(area => {
      if (!innerCyclesByVerticesID.some(vertices => sameSet(new Set(vertices), new Set(area.vertices)))) {
        state = Area.remove(state, layerID, area.id);
      }
    });

    let layer = state.scene.layers[layerID];
    const areaIDs: string[] = [];
    const areasToReset: string[] = [];

    // Add new areas or mark reused ones for holes reset
    innerCyclesByVerticesID.forEach((cycle, ind) => {
      const areaInUse = Object.values(layer.areas).find(area => sameSet(new Set(area.vertices), new Set(cycle)));

      if (areaInUse) {
        areaIDs[ind] = areaInUse.id;
        areasToReset.push(areaInUse.id);
      } else {
        const areaVerticesCoords = cycle.map(vertexID => {
          const vertex = layer.vertices[vertexID];
          return { x: vertex.x, y: vertex.y };
        });
        const resultAdd = Area.add(state, layerID, 'area', areaVerticesCoords, state.catalog);
        areaIDs[ind] = resultAdd.area.id;
        state = resultAdd.updatedState;
        layer = state.scene.layers[layerID];
      }
    });

    // Finally, mutate holes in a single produce call
    state = produce(state, draft => {
      const lay = draft.scene.layers[layerID];

      // Reset holes on reused areas
      areasToReset.forEach(id => {
        if (lay.areas[id]) lay.areas[id].holes = [];
      });

      // Prepare vertices for containment checks
      const verticesCoordsForArea = areaIDs.map(id => {
        const area = lay.areas[id];
        const vertices = area.vertices.map(vertexID => {
          const { x, y } = lay.vertices[vertexID];
          return [x, y] as [number, number];
        });
        return { id, vertices };
      });

      // Update holes lists
      verticesCoordsForArea.forEach(area1 => {
        const holesList: string[] = [];
        verticesCoordsForArea.forEach(area2 => {
          if (area1.id !== area2.id) {
            if (GeometryUtils.ContainsPoint(area1.vertices.flat(), area2.vertices[0][0], area2.vertices[0][1])) {
              holesList.push(area2.id);
            }
          }
        });
        lay.areas[area1.id].holes = holesList;
      });

      // Deduplicate holes
      areaIDs.forEach(areaID => {
        const doubleHoles = new Set<string>();
        const areaHoles = lay.areas[areaID].holes;
        areaHoles.forEach(areaHoleID => {
          const holesOfholes = lay.areas[areaHoleID].holes;
          holesOfholes.forEach(holeID => {
            if (areaHoles.indexOf(holeID) !== -1) {
              doubleHoles.add(holeID);
            }
          });
        });
        if (doubleHoles.size) {
          lay.areas[areaID].holes = areaHoles.filter(holeID => !doubleHoles.has(holeID));
        }
      });
    });

    return state;
  }

  static removeZeroLengthLines(state: State, layerID: string) {
    return produce(state, draft => {
      const layer = draft.scene.layers[layerID];
      if (!layer) return;
      Object.values(layer.lines).forEach(line => {
        const v0 = layer.vertices[line.vertices[0]];
        const v1 = layer.vertices[line.vertices[1]];
        if (GeometryUtils.verticesDistance(v0, v1) === 0) {
          delete layer.lines[line.id];
        }
      });
    });
  }

  static mergeEqualsVertices(state: State, layerID: string, vertexID: string) {
    const layer = state.scene.layers[layerID];
    if (!layer) return;
    const vertex = layer.vertices[vertexID];
    if (!vertex) return;

    const doubleVertices = Object.values(layer.vertices).filter(v =>
      v.id !== vertexID && GeometryUtils.samePoints(vertex, v)
    );

    doubleVertices.forEach(doubleVertex => {
      doubleVertex.lines.forEach(lineID => {
        const line = layer.lines[lineID];
        if (line) {
          state = produce(state, draft => {
            draft.scene.layers[layerID].lines[lineID].vertices = line.vertices.map(v => v === doubleVertex.id ? vertexID : v) as [string, string];
          });
          state = Vertex.addElement(state, layerID, vertexID, 'lines', lineID);
        }
      });

      doubleVertex.areas.forEach(areaID => {
        const area = layer.areas[areaID];
        if (area) {
          state = produce(state, draft => {
            draft.scene.layers[layerID].areas[areaID].vertices = area.vertices.map(v => v === doubleVertex.id ? vertexID : v) as [string, string];
          });
          state = Vertex.addElement(state, layerID, vertexID, 'areas', areaID);
        }
      });

      state = Vertex.remove(state, layerID, doubleVertex.id, null, null, true);
    });
    return state;
  }

  static setPropertiesOnSelected(state: State, layerID: string, properties: Record<string, any>) {
    return produce(state, draft => {
      const selected = draft.scene.layers[layerID].selected;
      selected.lines.forEach(lineID => draft = Line.setProperties(draft, layerID, lineID, properties));
      selected.holes.forEach(holeID => draft = Hole.setProperties(draft, layerID, holeID, properties));
      selected.areas.forEach(areaID => draft = Area.setProperties(draft, layerID, areaID, properties));
      selected.items.forEach(itemID => draft = Item.setProperties(draft, layerID, itemID, properties));
      return draft;
    });
  }

  static updatePropertiesOnSelected(state: State, layerID: string, properties: Record<string, any>) {
    return produce(state, draft => {
      const selected = draft.scene.layers[layerID].selected;
      selected.lines.forEach(lineID => draft = Line.updateProperties(draft, layerID, lineID, properties));
      selected.holes.forEach(holeID => draft = Hole.updateProperties(draft, layerID, holeID, properties));
      selected.areas.forEach(areaID => draft = Area.updateProperties(draft, layerID, areaID, properties));
      selected.items.forEach(itemID => draft = Item.updateProperties(draft, layerID, itemID, properties));
      return draft;
    });
  }

  static setAttributesOnSelected(state: State, layerID: string, attributes: any) {
    return produce(state, draft => {
      const selected = draft.scene.layers[layerID].selected;
      selected.lines.forEach(lineID => draft = Line.setAttributes(draft, layerID, lineID, attributes));
      selected.holes.forEach(holeID => draft = Hole.setAttributes(draft, layerID, holeID, attributes));
      selected.items.forEach(itemID => draft = Item.setAttributes(draft, layerID, itemID, attributes));
      selected.areas.forEach(areaID => draft = Area.setAttributes(draft, layerID, areaID, attributes));
      return draft;
    });
  }
}

export { Layer as default };
