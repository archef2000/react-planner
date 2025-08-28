import { Layer, Group } from './export';

import {
  IDBroker,
  NameGenerator
} from '../utils/export';

import {
  nearestSnap,
  addLineSegmentSnap,
} from '../utils/snap';

import {
  MODE_IDLE,
  MODE_DRAWING_HOLE,
  MODE_DRAGGING_HOLE,
} from '../constants';

import {
  GeometryUtils
} from '../utils/export';
import { State, catalogElementFactory, Hole as HoleModel } from '../models';
import { produce } from 'immer';

class Hole {
  static create(state: State, layerID: string, type, lineID: string, offset: number, properties?) {
    const holeID = IDBroker.acquireID();

    const hole = catalogElementFactory(state.catalog, type, {
      id: holeID,
      name: NameGenerator.generateName('holes', state.catalog.elements[type].info.title),
      type,
      offset,
      line: lineID
    }, properties);

    state = produce(state, draft => {
      if (!draft.scene.layers[layerID].holes) {
        draft.scene.layers[layerID].holes = {};
      }
      draft.scene.layers[layerID].holes[holeID] = hole as HoleModel;
      if (!draft.scene.layers[layerID].lines[lineID].holes) {
        draft.scene.layers[layerID].lines[lineID].holes = [];
      }
      draft.scene.layers[layerID].lines[lineID].holes.push(holeID);
    });
    return { updatedState: state, hole };
  }

  static select(state: State, layerID: string, holeID: string) {
    return produce(state, draft => {
      draft = Layer.select(draft, layerID);
      draft = Layer.selectElement(draft, layerID, 'holes', holeID);
      return draft;
    });
  }

  static remove(state: State, layerID: string, holeID: string) {
    return produce(state, draft => {
      const hole = draft.scene.layers[layerID]?.holes[holeID];
      if (!hole) return;

      const line = draft.scene.layers[layerID]?.lines[hole.line];
      if (line?.holes) {
        const index = line.holes.indexOf(holeID);
        if (index !== -1) {
          line.holes.splice(index, 1);
        }
      }

      delete draft.scene.layers[layerID].holes[holeID];

      Object.values(draft.scene.groups).forEach(group => {
        if (group.elements[layerID]?.holes) {
          const index = group.elements[layerID].holes.indexOf(holeID);
          if (index !== -1) {
            group.elements[layerID].holes.splice(index, 1);
          }
        }
      });
    });
  }

  static unselect(state: State, layerID: string, holeID: string) {
    return produce(state, draft => {
      const layer = draft.scene.layers[layerID];
      if (layer) {
        const index = layer.selected.holes.indexOf(holeID);
        if (index !== -1) {
          layer.selected.holes.splice(index, 1);
        }
        if (layer.holes[holeID]) {
          layer.holes[holeID].selected = false;
        }
      }
    });
  }

  static selectToolDrawingHole(state: State, sceneComponentType: string) {
    return produce(state, draft => {
      const snapElements = [];
      const layer = draft.scene.layers[draft.scene.selectedLayer];
      const { lines, vertices } = layer;

      Object.values(lines).forEach(line => {
        const v0 = vertices[line.vertices[0]];
        const v1 = vertices[line.vertices[1]];
        addLineSegmentSnap(snapElements, v0.x, v0.y, v1.x, v1.y, 20, 1, line.id);
      });

      draft.mode = MODE_DRAWING_HOLE;
      draft.snapElements = snapElements;
      draft.drawingSupport = { type: sceneComponentType };
    });
  }

  static updateDrawingHole(state: State, layerID: string, x: number, y: number) {
    return produce(state, draft => {
      const snap = nearestSnap(draft.snapElements, x, y, { ...draft.snapMask, SNAP_SEGMENT: true });
      if (!snap) return;

      ({ x, y } = snap.point);

      const selectedHoleID = draft.scene.layers[layerID].selected.holes[0];

      const lineID = snap.snap.related[0];
      const line = draft.scene.layers[layerID].lines[lineID];
      const [v0ID, v1ID] = line.vertices;
      const v0 = draft.scene.layers[layerID].vertices[v0ID];
      const v1 = draft.scene.layers[layerID].vertices[v1ID];

      const offset = GeometryUtils.pointPositionOnLineSegment(v0.x, v0.y, v1.x, v1.y, x, y);

      if (selectedHoleID) {
        const hole = draft.scene.layers[layerID].holes[selectedHoleID];
        hole.offset = offset;
        hole.line = lineID;
      } else {
        const { updatedState: stateH, hole } = this.create(draft, layerID, draft.drawingSupport.type, lineID, offset);
        draft = this.select(stateH, layerID, hole.id);
      }
      return draft;
    });
  }

  static endDrawingHole(state: State, layerID: string, x: number, y: number) {
    return produce(state, draft => {
      const updatedState = this.updateDrawingHole(draft, layerID, x, y);
      Object.assign(draft, updatedState);
      Layer.unselectAll(draft, layerID);
      draft.mode = MODE_IDLE;
      return draft;
    });
  }

  static beginDraggingHole(state: State, layerID: string, holeID: string, x: number, y: number) {
    return produce(state, draft => {
      const layer = draft.scene.layers[layerID];
      const hole = layer.holes[holeID];
      const line = layer.lines[hole.line];
      const v0 = layer.vertices[line.vertices[0]];
      const v1 = layer.vertices[line.vertices[1]];

      const snapElements = addLineSegmentSnap([], v0.x, v0.y, v1.x, v1.y, 9999999, 1, null);

      draft.mode = MODE_DRAGGING_HOLE;
      draft.snapElements = snapElements;
      draft.draggingSupport = {
        layerID,
        holeID,
        startPointX: x,
        startPointY: y,
      };
    });
  }

  static updateDraggingHole(state: State, x: number, y: number) {
    return produce(state, draft => {
      const snap = nearestSnap(draft.snapElements, x, y, { ...draft.snapMask, SNAP_SEGMENT: true });
      if (!snap) return;

      ({ x, y } = snap.point);

      const { layerID, holeID } = draft.draggingSupport;
      const hole = draft.scene.layers[layerID].holes[holeID];
      const line = draft.scene.layers[layerID].lines[hole.line];
      const v0 = draft.scene.layers[layerID].vertices[line.vertices[0]];
      const v1 = draft.scene.layers[layerID].vertices[line.vertices[1]];

      const offset = GeometryUtils.pointPositionOnLineSegment(v0.x, v0.y, v1.x, v1.y, x, y);
      hole.offset = offset;
    });
  }

  static endDraggingHole(state: State, x: number, y: number) {
    return produce(state, draft => {
      const updatedState = this.updateDraggingHole(draft, x, y);
      Object.assign(draft, updatedState);
      draft.mode = MODE_IDLE;
    });
  }

  static setProperties(state: State, layerID: string, holeID: string, properties: any) {
    return produce(state, draft => {
      draft.scene.layers[layerID].holes[holeID].properties = properties;
    });
  }

  static setJsProperties(state: State, layerID: string, holeID: string, properties: any) {
    return this.setProperties(state, layerID, holeID, properties);
  }

  static updateProperties(state: State, layerID: string, holeID: string, properties: Record<string, any>) {
    return produce(state, draft => {
      const hole = draft.scene.layers[layerID]?.holes[holeID];
      if (hole) {
        Object.entries(properties).forEach(([key, value]) => {
          if (hole.properties[key] !== undefined) {
            hole.properties[key] = value;
          }
        });
      }
    });
  }

  static updateJsProperties(state: State, layerID: string, holeID: string, properties: any) {
    return this.updateProperties(state, layerID, holeID, properties);
  }

  static setAttributes(state: State, layerID: string, holeID: string, holesAttributes: any) {
    return produce(state, draft => {
      const hole = draft.scene.layers[layerID]?.holes[holeID];
      if (hole) {
        const { offsetA, offsetB, offset, ...rest } = holesAttributes;
        Object.assign(hole, rest);
        hole.offset = offset;
        hole.misc = { _unitA: offsetA._unit, _unitB: offsetB._unit };
      }
    });
  }
}

export { Hole as default };
