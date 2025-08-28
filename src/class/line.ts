import {
  Group,
  Layer,
  Hole,
  Vertex
} from './export';
import {
  IDBroker,
  NameGenerator,
  GeometryUtils,
  SnapUtils,
  SnapSceneUtils,
} from '../utils/export';
import {
  MODE_IDLE,
  MODE_WAITING_DRAWING_LINE,
  MODE_DRAWING_LINE,
  MODE_DRAGGING_LINE
} from '../constants';
import { State, Line as LineModel, catalogElementFactory, Hole as HoleModel } from '../models';
import { current, produce } from "immer";

type HomeWithOffsetPosition = {
  hole: HoleModel;
  offsetPosition: { x: number, y: number };
};

class Line {
  static create(state: State, layerID: string, type, x0: number, y0: number, x1: number, y1: number, properties?) {
    const lineID = IDBroker.acquireID();

    const { updatedState: stateV0, vertex: v0 } = Vertex.add(state, layerID, x0, y0, 'lines', lineID);
    const { updatedState: stateV1, vertex: v1 } = Vertex.add(stateV0, layerID, x1, y1, 'lines', lineID);
    state = stateV1;

    const line = catalogElementFactory(state.catalog, type, {
      id: lineID,
      name: NameGenerator.generateName('lines', state.catalog.elements[type].info.title),
      vertices: [v0.id, v1.id],
      type
    }, properties) as LineModel;

    state = produce(state, draft => {
      draft.scene.layers[layerID].lines[lineID] = line;
    });

    return { updatedState: state, line };
  }

  static select(state: State, layerID: string, lineID: string) {
    state = Layer.select(state, layerID);

    const line = state.scene.layers[layerID].lines[lineID];
    state = Layer.selectElement(state, layerID, 'lines', lineID);
    state = Layer.selectElement(state, layerID, 'vertices', line.vertices[0]);
    state = Layer.selectElement(state, layerID, 'vertices', line.vertices[1]);

    return state;
  }

  static remove(state: State, layerID: string, lineID: string) {
    const line = state.scene.layers[layerID].lines[lineID];
    return produce(state, draft => {
      if (line) {
        draft = this.unselect(draft, layerID, lineID);
        line.holes.forEach(holeID => draft = Hole.remove(draft, layerID, holeID));
        draft = Layer.removeElement(draft, layerID, 'lines', lineID);
        line.vertices.forEach(vertexID => draft = Vertex.remove(draft, layerID, vertexID, 'lines', lineID));

        Object.values(draft.scene.groups).forEach(group => {
          draft = Group.removeElement(draft, group.id, layerID, 'lines', lineID);
        });
        return draft;
      }
    });
  }

  static unselect(state: State, layerID: string, lineID: string) {
    const line = state.scene.layers[layerID].lines[lineID];
    if (line) {
      state = produce(state, draft => {
        draft = Layer.unselect(draft, layerID, 'vertices', line.vertices[0]);
        draft = Layer.unselect(draft, layerID, 'vertices', line.vertices[1]);
        draft = Layer.unselect(draft, layerID, 'lines', lineID);
        return draft;
      });
    }
    return state;
  }

  static split(state: State, layerID: string, lineID: string, x: number, y: number) {
    const line = state.scene.layers[layerID].lines[lineID];
    const layer = state.scene.layers[layerID];
    const v0 = layer.vertices[line.vertices[0]];
    const v1 = layer.vertices[line.vertices[1]];
    const { x: x0, y: y0 } = v0;
    const { x: x1, y: y1 } = v1;

    const { updatedState: stateL1, line: line0 } = Line.create(state, layerID, line.type, x0, y0, x, y, line.properties);
    const { updatedState: stateL2, line: line1 } = Line.create(stateL1, layerID, line.type, x1, y1, x, y, line.properties);
    state = stateL2;

    let splitPointOffset = GeometryUtils.pointPositionOnLineSegment(x0, y0, x1, y1, x, y);
    const minVertex = GeometryUtils.minVertex(v0, v1);

    line.holes.forEach(holeID => {
      const hole = layer.holes[holeID];
      let holeOffset = hole.offset;
      if (minVertex.x === x1 && minVertex.y === y1) {
        splitPointOffset = 1 - splitPointOffset;
        holeOffset = 1 - hole.offset;
      }

      if (holeOffset < splitPointOffset) {
        let offset = holeOffset / splitPointOffset;
        if (minVertex.x === x1 && minVertex.y === y1) {
          offset = 1 - offset;
        }
        const { updatedState } = Hole.create(state, layerID, hole.type, line0.id, offset, hole.properties);
        state = updatedState;
      } else {
        let offset = (holeOffset - splitPointOffset) / (1 - splitPointOffset);
        if (minVertex.x === x1 && minVertex.y === y1) {
          offset = 1 - offset;
        }
        const { updatedState } = Hole.create(state, layerID, hole.type, line1.id, offset, hole.properties);
        state = updatedState;
      }
    });

    const lineGroups = Object.values(state.scene.groups).filter(group => {
      const lines = group.elements?.[layerID]?.lines;
      return lines && lines.includes(lineID);
    });

    lineGroups.forEach(group => {
      state = Group.addElement(state, group.id, layerID, 'lines', line0.id);
      state = Group.addElement(state, group.id, layerID, 'lines', line1.id);
    });

    state = Line.remove(state, layerID, lineID);

    return { updatedState: state, lines: [line0, line1] };
  }

  static addFromPoints(state: State, layerID, type, points: { x: number, y: number }[], properties?, holesWithOffsetPosition: HomeWithOffsetPosition[] = []) {
    points = points
      .sort(({ x: x1, y: y1 }, { x: x2, y: y2 }) => x1 === x2 ? y1 - y2 : x1 - x2)
    //.filter((point, idx, arr) => idx === 0 || point.x !== arr[idx - 1].x || point.y !== arr[idx - 1].y);

    const pointsPair = points
      .slice(0, points.length - 1)
      .map((point, idx) => [point, points[idx + 1]])
      .filter(([{ x: x1, y: y1 }, { x: x2, y: y2 }]) => !(x1 === x2 && y1 === y2))

    const lines: LineModel[] = [];

    pointsPair.forEach(([{ x: x1, y: y1 }, { x: x2, y: y2 }]) => {
      const { updatedState: stateL, line } = this.create(state, layerID, type, x1, y1, x2, y2, properties);
      state = stateL;

      if (holesWithOffsetPosition) {
        holesWithOffsetPosition.forEach(holeWithOffsetPoint => {
          const { x: xp, y: yp } = holeWithOffsetPoint.offsetPosition;

          if (GeometryUtils.isPointOnLineSegment(x1, y1, x2, y2, xp, yp)) {
            const newOffset = GeometryUtils.pointPositionOnLineSegment(x1, y1, x2, y2, xp, yp);
            if (newOffset >= 0 && newOffset <= 1) {
              state = Hole.create(state, layerID, holeWithOffsetPoint.hole.type, line.id, newOffset, holeWithOffsetPoint.hole.properties).updatedState;
            }
          }
        });
      }
      lines.push(line);
    });

    return { updatedState: state, lines };
  }

  static createAvoidingIntersections(state: State, layerID: string, type: string, x0: number, y0: number, x1: number, y1: number, oldProperties: LineModel['properties'] = {}, oldHoles: HomeWithOffsetPosition[] = []) {
    const points: { x: number, y: number }[] = [{ x: x0, y: y0 }, { x: x1, y: y1 }];

    state = produce(state, draft => {
      const linesArr = Object.values(draft.scene.layers[layerID].lines);
      for (const line of linesArr) {
        const [v0, v1] = line.vertices.map(vertexID => {
          return draft.scene.layers[layerID].vertices[vertexID]
        }
        );
        //const v0 = draft.scene.layers[layerID].vertices[line.vertices[0]];
        //const v1 = draft.scene.layers[layerID].vertices[line.vertices[1]];

        const hasCommonEndpoint =
          GeometryUtils.samePoints(v0, points[0]) ||
          GeometryUtils.samePoints(v0, points[1]) ||
          GeometryUtils.samePoints(v1, points[0]) ||
          GeometryUtils.samePoints(v1, points[1]);

        const intersection = GeometryUtils.twoLineSegmentsIntersection(points[0], points[1], v0, v1);

        if (intersection.type === 'colinear') {
          if (!oldHoles) { oldHoles = []; }

          const orderedVertices = GeometryUtils.orderVertices(points);

          for (const holeID of line.holes) {
            const hole = draft.scene.layers[layerID].holes[holeID];
            const oldLineLength = GeometryUtils.pointsDistance(v0.x, v0.y, v1.x, v1.y);
            const offset = GeometryUtils.samePoints(orderedVertices[1], draft.scene.layers[layerID].vertices[line.vertices[1]]) ? (1 - hole.offset) : hole.offset;
            const offsetPosition = GeometryUtils.extendLine(v0.x, v0.y, v1.x, v1.y, oldLineLength * offset);
            oldHoles.push({ hole, offsetPosition });
          }

          draft = Line.remove(draft, layerID, line.id);

          points.push({ ...v0 }, { ...v1 });
        }

        if (intersection.type === 'intersecting' && (!hasCommonEndpoint)) {
          draft = Line.split(draft, layerID, line.id, intersection.point.x, intersection.point.y).updatedState;
          points.push(intersection.point);
        }
      }
      return draft;
    });

    const { updatedState, lines } = Line.addFromPoints(state, layerID, type, points, oldProperties, oldHoles);
    return { updatedState, lines };
  }

  static replaceVertex(state: State, layerID: string, lineID: string, vertexIndex: number, x: number, y: number) {
    const vertexID = state.scene.layers[layerID].lines[lineID].vertices[vertexIndex];

    state = Vertex.remove(state, layerID, vertexID, 'lines', lineID);
    const { updatedState: stateV, vertex } = Vertex.add(state, layerID, x, y, 'lines', lineID);
    state = stateV;

    state = produce(state, draft => {
      draft.scene.layers[layerID].lines[lineID].vertices[vertexIndex] = vertex.id;
    });

    return { updatedState: state, line: state.scene.layers[layerID].lines[lineID], vertex };
  }

  static selectToolDrawingLine(state: State, sceneComponentType) {
    return produce(state, draft => {
      draft.mode = MODE_WAITING_DRAWING_LINE;
      draft.drawingSupport = {
        type: sceneComponentType
      };
    });
  }

  static beginDrawingLine(state: State, layerID: string, x: number, y: number) {
    let snapElements = SnapSceneUtils.sceneSnapElements(state.scene, [], state.snapMask);
    let snap = null;

    if (state.snapMask) {
      snap = SnapUtils.nearestSnap(snapElements, x, y, state.snapMask);
      if (snap) ({ x, y } = snap.point);

      let a: number, b: number, c: number;
      ({ a, b, c } = GeometryUtils.horizontalLine(y));
      snapElements = SnapUtils.addLineSnap(snapElements, a, b, c, 10, 3, null);
      ({ a, b, c } = GeometryUtils.verticalLine(x));
      snapElements = SnapUtils.addLineSnap(snapElements, a, b, c, 10, 3, null);
    }

    const drawingSupport = { ...state.drawingSupport, layerID } as State["drawingSupport"];

    state = Layer.unselectAll(state, layerID);

    const { updatedState: stateL, line } = Line.create(state, layerID, drawingSupport.type, x, y, x, y);
    state = Line.select(stateL, layerID, line.id);

    return produce(state, draft => {
      draft.mode = MODE_DRAWING_LINE;
      draft.snapElements = snapElements;
      draft.activeSnapElement = snap ? snap.snap : null;
      draft.drawingSupport = drawingSupport;
    });
  }

  static updateDrawingLine(state: State, x: number, y: number) {
    let snap = null;
    if (state.snapMask) {
      snap = SnapUtils.nearestSnap(state.snapElements, x, y, state.snapMask);
      if (snap) ({ x, y } = snap.point);
    }
    const layerID = state.drawingSupport.layerID;
    const lineID = state.scene.layers[layerID].selected.lines[0];
    state = Line.replaceVertex(state, layerID, lineID, 1, x, y).updatedState;
    state = Line.select(state, layerID, lineID);
    state = produce(state, draft => {
      draft.activeSnapElement = snap ? snap.snap : null;
    });
    return state;
  }

  static endDrawingLine(state: State, x: number, y: number) {
    if (state.snapMask) {
      const snap = SnapUtils.nearestSnap(state.snapElements, x, y, state.snapMask);
      if (snap) ({ x, y } = snap.point);
    }

    const layerID = state.drawingSupport.layerID;
    const layer = state.scene.layers[layerID];
    const lineID = layer.selected.lines[0];
    const line = layer.lines[lineID];
    const v0 = layer.vertices[line.vertices[0]];

    state = Line.remove(state, layerID, lineID);
    state = Line.createAvoidingIntersections(state, layerID, line.type, v0.x, v0.y, x, y).updatedState;
    state = Layer.detectAndUpdateAreas(state, layerID);

    return produce(state, draft => {
      draft.mode = MODE_WAITING_DRAWING_LINE;
      draft.snapElements = [];
      draft.activeSnapElement = null;
    });
  }

  static beginDraggingLine(state: State, layerID, lineID, x, y) {
    return produce(state, draft => {
      const snapElements = SnapSceneUtils.sceneSnapElements(draft.scene, [], draft.snapMask);
      const layer = draft.scene.layers[layerID];
      const line = layer.lines[lineID];
      const vertex0 = layer.vertices[line.vertices[0]];
      const vertex1 = layer.vertices[line.vertices[1]];

      draft.mode = MODE_DRAGGING_LINE;
      draft.snapElements = snapElements;
      draft.draggingSupport = {
        layerID,
        lineID,
        startPointX: x,
        startPointY: y,
        startVertex0X: vertex0.x,
        startVertex0Y: vertex0.y,
        startVertex1X: vertex1.x,
        startVertex1Y: vertex1.y,
      };
    });
  }

  static updateDraggingLine(state: State, x, y) {
    return produce(state, draft => {
      const { draggingSupport, snapElements, snapMask } = draft;
      const layerID = draggingSupport.layerID;
      const lineID = draggingSupport.lineID;
      const diffX = x - draggingSupport.startPointX;
      const diffY = y - draggingSupport.startPointY;
      let newVertex0X = draggingSupport.startVertex0X + diffX;
      let newVertex0Y = draggingSupport.startVertex0Y + diffY;
      let newVertex1X = draggingSupport.startVertex1X + diffX;
      let newVertex1Y = draggingSupport.startVertex1Y + diffY;

      let activeSnapElement = null;
      let curSnap0 = null, curSnap1 = null;
      if (snapMask) {
        curSnap0 = SnapUtils.nearestSnap(snapElements, newVertex0X, newVertex0Y, snapMask);
        curSnap1 = SnapUtils.nearestSnap(snapElements, newVertex1X, newVertex1Y, snapMask);
      }

      let deltaX = 0, deltaY = 0;
      if (curSnap0 && curSnap1) {
        if (curSnap0.point.distance < curSnap1.point.distance) {
          deltaX = curSnap0.point.x - newVertex0X;
          deltaY = curSnap0.point.y - newVertex0Y;
          activeSnapElement = curSnap0.snap;
        } else {
          deltaX = curSnap1.point.x - newVertex1X;
          deltaY = curSnap1.point.y - newVertex1Y;
          activeSnapElement = curSnap1.snap;
        }
      } else {
        if (curSnap0) {
          deltaX = curSnap0.point.x - newVertex0X;
          deltaY = curSnap0.point.y - newVertex0Y;
          activeSnapElement = curSnap0.snap;
        }
        if (curSnap1) {
          deltaX = curSnap1.point.x - newVertex1X;
          deltaY = curSnap1.point.y - newVertex1Y;
          activeSnapElement = curSnap1.snap;
        }
      }

      newVertex0X += deltaX;
      newVertex0Y += deltaY;
      newVertex1X += deltaX;
      newVertex1Y += deltaY;

      draft.activeSnapElement = activeSnapElement;
      draft.scene.layers[layerID].vertices[
        draft.scene.layers[layerID].lines[lineID].vertices[0]
      ].x = newVertex0X;
      draft.scene.layers[layerID].vertices[
        draft.scene.layers[layerID].lines[lineID].vertices[0]
      ].y = newVertex0Y;
      draft.scene.layers[layerID].vertices[
        draft.scene.layers[layerID].lines[lineID].vertices[1]
      ].x = newVertex1X;
      draft.scene.layers[layerID].vertices[
        draft.scene.layers[layerID].lines[lineID].vertices[1]
      ].y = newVertex1Y;
    });
  }

  static endDraggingLine(state: State, x, y) {
    const { draggingSupport } = state;
    const layerID = draggingSupport.layerID;
    const layer = state.scene.layers[layerID];
    const lineID = draggingSupport.lineID;
    const line = layer.lines[lineID];

    const vertex0 = layer.vertices[line.vertices[0]];
    const vertex1 = layer.vertices[line.vertices[1]];

    const maxV = GeometryUtils.maxVertex(vertex0, vertex1);
    const minV = GeometryUtils.minVertex(vertex0, vertex1);

    const lineLength = GeometryUtils.verticesDistance(minV, maxV);
    const alpha = Math.atan2(maxV.y - minV.y, maxV.x - minV.x);

    const holesWithOffsetPosition: HomeWithOffsetPosition[] = [];
    layer.lines[lineID].holes.forEach(holeID => {
      const hole = layer.holes[holeID];
      const pointOnLine = lineLength * hole.offset;

      const offsetPosition = {
        x: pointOnLine * Math.cos(alpha) + minV.x,
        y: pointOnLine * Math.sin(alpha) + minV.y
      };

      holesWithOffsetPosition.push({ hole, offsetPosition });
    });

    const diffX = x - draggingSupport.startPointX;
    const diffY = y - draggingSupport.startPointY;
    let newVertex0X = draggingSupport.startVertex0X + diffX;
    let newVertex0Y = draggingSupport.startVertex0Y + diffY;
    let newVertex1X = draggingSupport.startVertex1X + diffX;
    let newVertex1Y = draggingSupport.startVertex1Y + diffY;

    if (state.snapMask) {
      const curSnap0 = SnapUtils.nearestSnap(state.snapElements, newVertex0X, newVertex0Y, state.snapMask);
      const curSnap1 = SnapUtils.nearestSnap(state.snapElements, newVertex1X, newVertex1Y, state.snapMask);

      let deltaX = 0, deltaY = 0;
      if (curSnap0 && curSnap1) {
        if (curSnap0.point.distance < curSnap1.point.distance) {
          deltaX = curSnap0.point.x - newVertex0X;
          deltaY = curSnap0.point.y - newVertex0Y;
        } else {
          deltaX = curSnap1.point.x - newVertex1X;
          deltaY = curSnap1.point.y - newVertex1Y;
        }
      } else {
        if (curSnap0) {
          deltaX = curSnap0.point.x - newVertex0X;
          deltaY = curSnap0.point.y - newVertex0Y;
        }
        if (curSnap1) {
          deltaX = curSnap1.point.x - newVertex1X;
          deltaY = curSnap1.point.y - newVertex1Y;
        }
      }

      newVertex0X += deltaX;
      newVertex0Y += deltaY;
      newVertex1X += deltaX;
      newVertex1Y += deltaY;
    }

    //get groups membership if present
    const lineGroups = Object.values(state.scene.groups).filter(group => {
      const lines = group.elements?.[layerID]?.lines;
      return lines && lines.includes(lineID);
    });

    state = Layer.mergeEqualsVertices(state, layerID, line.vertices[0]);
    state = Layer.mergeEqualsVertices(state, layerID, line.vertices[1]);

    state = Line.remove(state, layerID, lineID);

    if (!GeometryUtils.samePoints({ x: newVertex0X, y: newVertex0Y }, { x: newVertex1X, y: newVertex1Y })) {
      const ret = Line.createAvoidingIntersections(
        state,
        layerID,
        line.type,
        newVertex0X,
        newVertex0Y,
        newVertex1X,
        newVertex1Y,
        line.properties,
        holesWithOffsetPosition
      );

      state = ret.updatedState;

      //re-add to old line's groups if present
      ret.lines.forEach(addedLine => {
        lineGroups.forEach(oldLineGroup => {
          state = Group.addElement(state, oldLineGroup.id, layerID, 'lines', addedLine.id);
        });
      });
    }

    state = Layer.detectAndUpdateAreas(state, layerID);

    return produce(state, draft => {
      draft.mode = MODE_IDLE;
      draft.draggingSupport = null;
      draft.activeSnapElement = null;
      draft.snapElements = [];
    });
  }

  static setProperties(state: State, layerID: string, lineID: string, properties: any) {
    return produce(state, draft => {
      draft.scene.layers[layerID].lines[lineID].properties = properties;
    });
  }

  static setJsProperties(state: State, layerID: string, lineID: string, properties) {
    return this.setProperties(state, layerID, lineID, properties);
  }

  static updateProperties(state: State, layerID: string, lineID: string, properties: Record<string, any>) {
    Object.entries(properties).forEach(([k, v]) => {
      state = produce(state, draft => {
        if (draft.scene.layers[layerID].lines[lineID].properties.hasOwnProperty(k)) {
          draft.scene.layers[layerID].lines[lineID].properties[k] = v;
        }
      });
    });
    return state;
  }

  static updateJsProperties(state: State, layerID: string, lineID: string, properties) {
    return this.updateProperties(state, layerID, lineID, properties);
  }

  static setAttributes(state: State, layerID: string, lineID: string, lineAttributes) {
    const { vertexOne, vertexTwo, lineLength, name, ...lAttr } = lineAttributes;

    state = produce(state, draft => {
      const layer = draft.scene.layers[layerID];
      layer.vertices[vertexOne.id].x = vertexOne.x;
      layer.vertices[vertexOne.id].y = vertexOne.y;
      layer.vertices[vertexTwo.id].x = vertexTwo.x;
      layer.vertices[vertexTwo.id].y = vertexTwo.y;
      if (!layer.lines[lineID].misc) {
        layer.lines[lineID].misc = {};
      }
      layer.lines[lineID].misc._unitLength = lineLength._unit;
      layer.lines[lineID].name = name;
    });

    state = Layer.mergeEqualsVertices(state, layerID, vertexOne.id);

    if (vertexOne.x != vertexTwo.x && vertexOne.y != vertexTwo.y) {
      state = Layer.mergeEqualsVertices(state, layerID, vertexTwo.id);
    }

    state = Layer.detectAndUpdateAreas(state, layerID);
    return state;
  }

  static setVerticesCoords(state: State, layerID, lineID, x1, y1, x2, y2) {
    const line = state.scene.layers[layerID].lines[lineID];
    state = Vertex.setAttributes(state, layerID, line.vertices[0], { x: x1, y: y1 });
    return Vertex.setAttributes(state, layerID, line.vertices[1], { x: x2, y: y2 });
  }
}

export { Line as default };
