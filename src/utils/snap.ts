
import { current, produce } from 'immer';
import * as Geometry from './geometry';
import { SnapMaskType } from '../types';

export const SNAP_POINT = 'SNAP_POINT';
export const SNAP_LINE = 'SNAP_LINE';
export const SNAP_SEGMENT = 'SNAP_SEGMENT';
export const SNAP_GRID = 'SNAP_GRID';
export const SNAP_GUIDE = 'SNAP_GUIDE';

export const SNAP_MASK = {
  SNAP_POINT: true,
  SNAP_LINE: true,
  SNAP_SEGMENT: true,
  SNAP_GRID: false,
  SNAP_GUIDE: true
};

interface SharedSnapElementJson {
  radius: number;
  priority: number;
  related: string[];
  nearestPoint(x: number, y: number): { x: number, y: number, distance: number };
  isNear(x: number, y: number, distance: number): boolean;
}

export type SnapElement = SharedSnapElementJson & (PointSnap | LineSnap | LineSegmentSnap | GridSnap);

class PointSnap {
  type: 'point' = 'point';
  x = -1
  y = -1
  radius = 1
  priority = 1
  related = new Array<any>()
  constructor({ x, y, radius = 1, priority = 1, related = [] }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.priority = priority;
    this.related = related;
  }

  nearestPoint(x: number, y: number) {
    return {
      x: this.x,
      y: this.y,
      distance: Geometry.pointsDistance(this.x, this.y, x, y)
    };
  }
  isNear(x: number, y: number, distance: number) { return ~(this.x - x) + 1 < distance && ~(this.y - y) + 1 < distance; }
}

class LineSnap {
  type: 'line' = 'line';
  a = -1
  b = -1
  c = -1
  radius = 1
  priority = 1
  related = new Array<any>()

  constructor({ a, b, c, radius = 1, priority = 1, related = [] }) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.radius = radius;
    this.priority = priority;
    this.related = related;
  }
  nearestPoint(x: number, y: number) {
    return {
      ...Geometry.closestPointFromLine(this.a, this.b, this.c, x, y),
      distance: Geometry.distancePointFromLine(this.a, this.b, this.c, x, y)
    };
  }
  isNear(x: number, y: number, distance: number) { return true; }
}

class LineSegmentSnap {
  type: 'line-segment' = 'line-segment';
  x1 = -1
  y1 = -1
  x2 = -1
  y2 = -1
  radius = 1
  priority = 1
  related = new Array<any>()

  constructor({ x1, y1, x2, y2, radius = 1, priority = 1, related = [] }) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.radius = radius;
    this.priority = priority;
    this.related = related;
  }

  nearestPoint(x: number, y: number) {
    return {
      ...Geometry.closestPointFromLineSegment(this.x1, this.y1, this.x2, this.y2, x, y),
      distance: Geometry.distancePointFromLineSegment(this.x1, this.y1, this.x2, this.y2, x, y)
    };
  }
  isNear(x: number, y: number, distance: number) { return true; }
}

class GridSnap {
  type: 'grid' = 'grid';
  x = -1
  y = -1
  radius = 1
  priority = 1
  related = new Array<any>()

  constructor({ x, y, radius = 1, priority = 1, related = [] }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.priority = priority;
    this.related = related;
  }
  nearestPoint(x: number, y: number) {
    return {
      x: this.x,
      y: this.y,
      distance: Geometry.pointsDistance(this.x, this.y, x, y)
    };
  }
  isNear(x: number, y: number, distance: number) { return ~(this.x - x) + 1 < distance && ~(this.y - y) + 1 < distance; }
}

export function nearestSnap(snapElements: SnapElement[], x: number, y: number, snapMask: SnapMaskType) {
  const filter = {
    'point': snapMask[SNAP_POINT],
    'line': snapMask[SNAP_LINE],
    'line-segment': snapMask[SNAP_SEGMENT],
    'grid': snapMask[SNAP_GRID]
  };

  const nearestSnap = snapElements
    .filter((el) => filter[el.type] && el.isNear(x, y, el.radius))
    .map(snap => { return { snap, point: snap.nearestPoint(x, y) } })
    .filter(({ snap: { radius }, point: { distance } }) => distance < radius)
    .reduce((min, current) => {
      if (!min) return current;
      const { snap: { priority: p1 }, point: { distance: d1 } } = min;
      const { snap: { priority: p2 }, point: { distance: d2 } } = current;
      if (p1 === p2) {
        return d1 < d2 ? min : current;
      }
      return p1 > p2 ? min : current;
    },
      undefined
    );
  return nearestSnap;
}

export function addPointSnap(snapElements: SnapElement[], x: number, y: number, radius: number, priority: number, relatedId?: string) {
  const related = new Array(relatedId);
  snapElements.push(new PointSnap({ x, y, radius, priority, related }));
  return snapElements;
}

export function addLineSnap(snapElements: SnapElement[], a: number, b: number, c: number, radius: number, priority: number, relatedId: any) {
  const related = [relatedId];

  const alreadyPresent = snapElements.some(lineSnap =>
    lineSnap.type === 'line' &&
    a === lineSnap.a &&
    b === lineSnap.b &&
    c === lineSnap.c);
  if (alreadyPresent) return snapElements;

  snapElements
    .filter(snap => snap.type === 'line')
    .map(snap => Geometry.twoLinesIntersection(snap.a, snap.b, snap.c, a, b, c))
    .filter(intersection => intersection !== undefined)
    .forEach(({ x, y }) => snapElements = addPointSnap(snapElements, x, y, 20, 40, relatedId));

  snapElements.push(new LineSnap({ a, b, c, radius, priority, related }));

  return snapElements;
}

export function addLineSegmentSnap(snapElements: SnapElement[], x1: number, y1: number, x2: number, y2: number, radius: number, priority: number, relatedId?: string) {
  const related = new Array(relatedId);
  snapElements.push(new LineSegmentSnap({ x1, y1, x2, y2, radius, priority, related }));
  return snapElements;
}

export function addGridSnap(snapElements: SnapElement[], x: number, y: number, radius: number, priority: number, relatedId?: string) {
  const related = new Array(relatedId);
  snapElements.push(new GridSnap({ x, y, radius, priority, related }));
  return snapElements;
}
