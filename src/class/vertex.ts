import { produce } from 'immer';

import { Group, Layer, Line } from '../class/export';
import { MODE_DRAGGING_VERTEX } from '../constants';
import { State, Vertex as VertexModel } from '../models';
import {
  GeometryUtils,
  IDBroker,
  SnapSceneUtils,
  SnapUtils
} from '../utils/export';

import { HoleWithOffsetPosition } from './line';

class Vertex {
  static add(
    state: State,
    layerID: string,
    x: number,
    y: number,
    relatedPrototype: 'lines' | 'areas',
    relatedID: string
  ) {
    let vertex: VertexModel | undefined = undefined;
    let vertexID: string | undefined = undefined;
    state = produce(state, (draft) => {
      const vertices = draft.scene.layers[layerID].vertices;
      for (const v of Object.values(vertices)) {
        if (GeometryUtils.samePoints(v, { x, y })) {
          if (!v[relatedPrototype].includes(relatedID)) {
            v[relatedPrototype].push(relatedID);
          }
          vertexID = v.id;
          break;
        }
      }
    });
    if (vertexID) {
      vertex = state.scene.layers[layerID].vertices[vertexID];
    } else {
      const vertexID = IDBroker.acquireID();
      vertex = VertexModel({
        id: vertexID,
        name: 'Vertex',
        x,
        y,
        [relatedPrototype]: [relatedID]
      });
      state = produce(state, (draft) => {
        draft.scene.layers[layerID].vertices[vertexID] = vertex as VertexModel;
      });
    }
    return { updatedState: state, vertex };
  }

  static setAttributes(
    state: State,
    layerID: string,
    vertexID: string,
    vertexAttributes: Partial<VertexModel>
  ) {
    return produce(state, (draft) => {
      Object.assign(
        draft.scene.layers[layerID].vertices[vertexID],
        vertexAttributes
      );
    });
  }

  static addElement(
    state: State,
    layerID: string,
    vertexID: string,
    elementPrototype: 'lines' | 'areas',
    elementID: string
  ) {
    return produce(state, (draft) => {
      const list =
        draft.scene.layers[layerID].vertices[vertexID][elementPrototype];
      if (!list.includes(elementID)) {
        list.push(elementID);
      }
    });
  }

  static removeElement(
    state: State,
    layerID: string,
    vertexID: string,
    elementPrototype: 'lines' | 'areas',
    elementID: string
  ) {
    return produce(state, (draft) => {
      const list =
        draft.scene.layers[layerID].vertices[vertexID][elementPrototype];
      const elementIndex = list.findIndex((el) => el === elementID);
      if (elementIndex !== -1) {
        list.splice(elementIndex, 1);
      }
    });
  }

  static select(state: State, layerID: string, vertexID: string) {
    state = produce(state, (draft) => {
      draft.scene.layers[layerID].vertices[vertexID].selected = true;
      draft.scene.layers[layerID].selected.vertices.push(vertexID);
    });

    return state;
  }

  static unselect(state: State, layerID: string, vertexID: string) {
    state = produce(state, (draft) => {
      draft.scene.layers[layerID].vertices[vertexID].selected = false;
      const selectedVertices = draft.scene.layers[layerID].selected.vertices;
      const idx = selectedVertices.indexOf(vertexID);
      if (idx !== -1) selectedVertices.splice(idx, 1);
    });

    return state;
  }

  static remove(
    state: State,
    layerID: string,
    vertexID: string,
    relatedPrototype: 'lines' | 'areas' | null,
    relatedID: string | null,
    forceRemove = false
  ) {
    let vertex = state.scene.layers[layerID].vertices[vertexID];

    if (vertex) {
      state = this.unselect(state, layerID, vertexID);
      state = produce(state, (draft) => {
        if (relatedPrototype && relatedID) {
          const related =
            draft.scene.layers[layerID].vertices[vertexID][relatedPrototype];
          const index = related.findIndex((ID) => relatedID === ID);
          if (index !== -1) {
            related.splice(index, 1);
          }
          vertex = draft.scene.layers[layerID].vertices[vertexID];
        }

        const inUse = vertex.areas.length || vertex.lines.length;

        if (inUse && !forceRemove) {
          draft.scene.layers[layerID].vertices[vertexID] = vertex;
        } else {
          delete draft.scene.layers[layerID].vertices[vertexID];
        }
      });
    }
    return state;
  }

  static beginDraggingVertex(
    state: State,
    layerID: string,
    vertexID: string,
    x?: number,
    y?: number
  ) {
    state = produce(state, (draft) => {
      const snapElements = SnapSceneUtils.sceneSnapElements(
        draft.scene,
        [],
        draft.snapMask
      );
      draft.snapElements = snapElements;
      draft.draggingSupport = {
        layerID,
        vertexID,
        previousMode: draft.mode
      };
      draft.mode = MODE_DRAGGING_VERTEX;
    });
    return state;
  }

  static updateDraggingVertex(state: State, x: number, y: number) {
    const { snapElements, snapMask } = state;
    const draggingSupport = state.draggingSupport as Required<
      State['draggingSupport']
    >;
    if (!draggingSupport) return state;

    let snap = null;
    if (Object.keys(snapMask).length) {
      snap = SnapUtils.nearestSnap(snapElements, x, y, snapMask);
      if (snap) ({ x, y } = snap.point);
    }

    const layerID = draggingSupport.layerID;
    const vertexID = draggingSupport.vertexID;
    state = produce(state, (draft) => {
      draft.activeSnapElement = snap ? snap.snap : null;
      const vertex = draft.scene.layers[layerID].vertices[vertexID];
      vertex.x = x;
      vertex.y = y;
    });

    return state;
  }

  static endDraggingVertex(state: State, x?: number, y?: number) {
    state = produce(state, (draft) => {
      const draggingSupport = state.draggingSupport as Required<
        State['draggingSupport']
      >;
      if (!draggingSupport) return state;
      const layerID = draggingSupport.layerID;
      const vertexID = draggingSupport.vertexID;
      const vertex = draft.scene.layers[layerID].vertices[vertexID];
      const lines = vertex.lines;

      if (lines) {
        lines.forEach((lineID) => {
          const line = draft.scene.layers[layerID].lines[lineID];
          if (!line) return;

          const v_id0 = line.vertices[0];
          const v_id1 = line.vertices[1];
          const oldVertexID = v_id0 === vertexID ? v_id1 : v_id0;

          const oldVertex = draft.scene.layers[layerID].vertices[oldVertexID];

          const oldHoles: HoleWithOffsetPosition[] = [];
          const orderedVertices = GeometryUtils.orderVertices([
            oldVertex,
            vertex
          ]);

          line.holes.forEach((holeID) => {
            const hole = draft.scene.layers[layerID].holes[holeID];
            const oldLineLength = GeometryUtils.pointsDistance(
              oldVertex.x,
              oldVertex.y,
              vertex.x,
              vertex.y
            );
            const vertexId1 =
              draft.scene.layers[layerID].lines[lineID].vertices[1];
            const vertexObj1 = draft.scene.layers[layerID].vertices[vertexId1];
            const offset = GeometryUtils.samePoints(
              orderedVertices[1],
              vertexObj1
            )
              ? 1 - hole.offset
              : hole.offset;
            const offsetPosition = GeometryUtils.extendLine(
              oldVertex.x,
              oldVertex.y,
              vertex.x,
              vertex.y,
              oldLineLength * offset
            );
            oldHoles.push({ hole, offsetPosition });
          });

          const lineType = line.type;
          const lineProps = line.properties;
          const lineGroups = Object.values(draft.scene.groups).filter(
            (group) => {
              const lines = group.elements[layerID]?.lines;
              return lines && lines.includes(lineID);
            }
          );

          draft = Layer.removeZeroLengthLines(draft, layerID);
          draft = Layer.mergeEqualsVertices(draft, layerID, vertexID);
          draft = Line.remove(draft, layerID, lineID);

          if (!GeometryUtils.samePoints(oldVertex, vertex)) {
            const { lines: newLines, updatedState: stateL } =
              Line.createAvoidingIntersections(
                draft,
                layerID,
                lineType,
                oldVertex.x,
                oldVertex.y,
                vertex.x,
                vertex.y,
                lineProps,
                oldHoles
              );
            draft = stateL;

            newLines.forEach((addedLine) => {
              lineGroups.forEach((oldLineGroup) => {
                draft = Group.addElement(
                  draft,
                  oldLineGroup.id,
                  layerID,
                  'lines',
                  addedLine.id
                );
              });
            });
          }
        });
      }

      draft = Layer.detectAndUpdateAreas(draft, layerID);

      draft.mode = draggingSupport.previousMode;
      draft.draggingSupport = undefined;
      draft.activeSnapElement = null;
      draft.snapElements = [];
      return draft;
    });

    return state;
  }
}

export { Vertex as default };
