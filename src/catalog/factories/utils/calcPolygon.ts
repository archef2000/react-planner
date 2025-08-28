import { Layer } from "../../../models";
import * as Geometry from "../../../utils/geometry";

const THRESHOLD_ANGLE = 0.3;

function uniqueArray<T>(array: T[]): T[] {
    return array.filter((item, index) => array.indexOf(item) === index);
}

export function calcLineEnd(layer: Layer, lineId: string, centerVertexId: string, thickness: number): { x: number, y: number }[] {
    let points: { x: number, y: number }[] = [];
    const centerVertex = layer.vertices[centerVertexId];
    const connectedLines = uniqueArray(centerVertex.lines.map((lineId) => layer.lines[lineId])).filter(line => line !== undefined);
    if (connectedLines.length < 2) {
        points.push({
            x: 0, y: thickness / 2
        })
        points.push({
            x: 0, y: -thickness / 2
        })
        return points;
    }

    const connectedLineVertexId = layer.lines[lineId].vertices.find(id => id !== centerVertexId);
    const firstVertexIsCenter = (layer.lines[lineId].vertices[0] === centerVertexId);
    const connectedLineVertex = layer.vertices[connectedLineVertexId];
    const connectedLineVertexAngle = Geometry.angleBetweenTwoVertices(centerVertex, connectedLineVertex);
    const connectedLineThickness = layer.lines[lineId].properties.thickness.length || 0;

    // Calculate relative angles for connected vertices
    const connectedVertices = connectedLines.map((line) => {
        const thickness: number = line.properties.thickness.length || 0;
        const vertex = layer.vertices[line.vertices.find(id => id !== centerVertexId)];
        if (!vertex) {
            return;
        }
        const angle = Geometry.angleBetweenTwoVertices(centerVertex, vertex) - connectedLineVertexAngle;
        const degree = angle * 180 / Math.PI;
        return {
            thickness,
            angle,
            vertex,
            degree,
        };
    }).filter((v) => v !== undefined);

    const sortedVertices = connectedVertices.sort((a, b) => a.angle - b.angle);

    // Find vertices before and after the target vertex
    const vertexIndex = sortedVertices.findIndex(v => v.vertex.id === connectedLineVertexId);
    const rightVertex = sortedVertices[vertexIndex === 0 ? sortedVertices.length - 1 : vertexIndex - 1];
    const leftVertex = sortedVertices[vertexIndex === sortedVertices.length - 1 ? 0 : vertexIndex + 1];
    rightVertex.angle = 2 * Math.PI - rightVertex.angle;
    if (rightVertex.angle > 2 * Math.PI) {
        rightVertex.angle -= 2 * Math.PI;
    }
    rightVertex.degree = rightVertex.angle * 180 / Math.PI;
    if (leftVertex.angle < 0) {
        leftVertex.angle += 2 * Math.PI;
    }

    const oneNeigbor = (connectedLines.length === 2);

    const half_thickness = thickness / 2;
    let angleDiff = 0
    const lengthLine = 340;
    const length = 100;


    angleDiff = leftVertex.angle;
    if (oneNeigbor) {
        angleDiff = 2 * Math.PI - angleDiff;
    }
    const halfLeftThickness = leftVertex.thickness / 2;

    const botWall = Geometry.linePassingThroughTwoPoints(0, - half_thickness, length, - half_thickness);
    const topLine = Geometry.linePassingThroughTwoPoints(0, halfLeftThickness / Math.cos(angleDiff), lengthLine * Math.cos(angleDiff), lengthLine * Math.sin(angleDiff) + halfLeftThickness / Math.cos(angleDiff));
    let point2 = Geometry.twoLinesIntersection(botWall.a, botWall.b, botWall.c, topLine.a, topLine.b, topLine.c);
    if (point2 && angleDiff > THRESHOLD_ANGLE) {
        point2 = { x: -point2.x, y: point2.y };
        points.push(point2);
    } else {
        points.push({ x: 0, y: -halfLeftThickness });
    }
    if (!oneNeigbor) {
        points.push({ x: 0, y: 0 });
    }

    angleDiff = rightVertex.angle;

    const halfRightThickness = rightVertex.thickness / 2;

    const topWall = Geometry.linePassingThroughTwoPoints(0, half_thickness, length, half_thickness);
    const botLine = Geometry.linePassingThroughTwoPoints(0, - halfRightThickness / Math.cos(angleDiff), lengthLine * Math.cos(angleDiff), lengthLine * Math.sin(angleDiff) - halfRightThickness / Math.cos(angleDiff));
    let point = Geometry.twoLinesIntersection(topWall.a, topWall.b, topWall.c, botLine.a, botLine.b, botLine.c);
    if (point && angleDiff > THRESHOLD_ANGLE && !(angleDiff == 2 * Math.PI)) {
        point = { x: point.x, y: point.y };
        points.push(point);
    } else {
        points.push({ x: 0, y: halfRightThickness });
    }

    if (Math.abs(connectedLineVertexAngle) == Math.PI / 2) {
        points = points.map(p => { return { x: p.x, y: p.y } });
    }

    if (connectedLineVertexAngle <= Math.PI / 2 && connectedLineVertexAngle > -Math.PI / 2) {
        points = points.map(p => { return { x: p.x, y: p.y } });
    }

    if (connectedLineVertexAngle == -Math.PI / 2 && firstVertexIsCenter) {
        points = points.map(p => { return { x: p.x, y: -p.y } });
    }
    if (connectedLineVertexAngle == Math.PI / 2 && firstVertexIsCenter) {
        points = points.map(p => { return { x: p.x, y: -p.y } });
    }
    if (Math.abs(connectedLineVertexAngle) < Math.PI / 2) {
        points = points.map(p => { return { x: p.x, y: -p.y } });
    }


    return points
    // returns deltas from line end 2/3 points always 3 maybe second(middle point) empty
}
