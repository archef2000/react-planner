import {
  SNAP_POINT,
  SNAP_LINE,
  SNAP_SEGMENT,
  SNAP_GRID,
  SNAP_GUIDE,
  addPointSnap,
  addLineSnap,
  addLineSegmentSnap,
  addGridSnap
} from './snap';
import { GeometryUtils } from './export';
import { produce } from 'immer';
import { Scene } from '../models';
import { SnapMaskType } from '../types';

export function sceneSnapElements(scene: Scene, snapElements, snapMask: SnapMaskType) {

  const { width, height } = scene;
  Object.values(scene.layers).forEach(layer => {

    const { lines, vertices } = layer;

    Object.values(vertices).forEach(({ id: vertexID, x, y }) => {

      if (snapMask[SNAP_POINT]) {
        snapElements = addPointSnap(snapElements, x, y, 10, 10, vertexID);
      }

      if (snapMask[SNAP_LINE]) {
        let a: number, b: number, c: number;
        ({ a, b, c } = GeometryUtils.horizontalLine(y));
        snapElements = addLineSnap(snapElements, a, b, c, 10, 1, vertexID);
        ({ a, b, c } = GeometryUtils.verticalLine(x));
        snapElements = addLineSnap(snapElements, a, b, c, 10, 1, vertexID);

      }

    });

    if (snapMask[SNAP_SEGMENT]) {
      Object.values(lines).forEach(({ id: lineID, vertices: [v0, v1] }) => {
        const { x: x1, y: y1 } = vertices[v0];
        const { x: x2, y: y2 } = vertices[v1];

        snapElements = addLineSegmentSnap(snapElements, x1, y1, x2, y2, 20, 1, lineID);
      });
    }
  });

  if (snapMask[SNAP_GRID]) {
    const divider = 5;
    const gridCellSize = 100 / divider;
    const xCycle = width / gridCellSize;
    const yCycle = height / gridCellSize;

    for (let x = 0; x < xCycle; x++) {
      const xMul = x * gridCellSize;

      for (let y = 0; y < yCycle; y++) {
        const yMul = y * gridCellSize;

        const onXCross = !(x % divider) ? true : false;
        const onYCross = !(y % divider) ? true : false;

        addGridSnap(snapElements, xMul, yMul, 10, onXCross && onYCross ? 15 : 10, null);
      }
    }
  }

  if (snapMask[SNAP_GUIDE]) {
    const hValues = scene.guides.horizontal;
    const vValues = scene.guides.vertical;

    Object.values(hValues).forEach(hVal => {
      Object.values(vValues).forEach(vVal => {
        addPointSnap(snapElements, vVal, hVal, 10, 10, null);
      });
    });

    Object.values(hValues).forEach(hVal => addLineSegmentSnap(snapElements, 0, hVal, width, hVal, 20, 1, null));
    Object.values(vValues).forEach(vVal => addLineSegmentSnap(snapElements, vVal, 0, vVal, height, 20, 1, null));
  }

  return snapElements;
}
