import React from 'react';
import { buildWall, updatedWall } from './wall-factory-3d';
import * as SharedStyle from '../../shared-style';
import * as Geometry from '../../utils/geometry';
import Translator from '../../translator/translator';
import { Layer, Line, Scene } from '../../models';
import { calcLineEnd } from './utils/calcPolygon';
import { CatalogElementTextures, CatalogElementInfo, CatalogElement } from '../../types';
import * as Three from 'three';

const epsilon = 20;
const EPSILON_ANGLE = 0.01;

const STYLE_TEXT = { textAnchor: 'middle' } as const;
const STYLE_LINE = { stroke: SharedStyle.LINE_MESH_COLOR.selected };
const STYLE_RECT = { strokeWidth: 1, stroke: SharedStyle.LINE_MESH_COLOR.unselected, fill: 'url(#diagonalFill)' };
const STYLE_RECT_SELECTED = { ...STYLE_RECT, stroke: SharedStyle.LINE_MESH_COLOR.selected };

const translator = new Translator();

function orderPoints(points: { x: number, y: number }[]) {
  // Compute centroid
  const centroid = points.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 }
  );
  centroid.x /= points.length;
  centroid.y /= points.length;

  // Sort by angle from centroid
  return points.slice().sort((a, b) => {
    const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
    const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
    return angleA - angleB;
  });
}

export default function WallFactory(name: string, info: CatalogElementInfo, textures: CatalogElementTextures) {
  const textureValues = { 'none': 'None', 'bricks': false };

  for (const textureName in textures) { // textures is always an object
    textureValues[textureName] = textures[textureName].name;
  }

  const wallElement: CatalogElement = {
    name,
    prototype: 'lines',
    info,
    properties: {
      height: {
        label: translator.t('height'),
        type: 'length-measure',
        defaultValue: {
          length: 300
        }
      },
      thickness: {
        label: translator.t('thickness'),
        type: 'length-measure',
        defaultValue: {
          length: 20
        }
      },
      textureA: {
        label: translator.t('texture') + ' A',
        type: 'enum',
        defaultValue: textureValues.bricks ? 'bricks' : 'none',
        values: textureValues
      },
      textureB: {
        label: translator.t('texture') + ' B',
        type: 'enum',
        defaultValue: textureValues.bricks ? 'bricks' : 'none',
        values: textureValues
      },
    },

    render2D: function (element: Line, layer: Layer, scene: Scene) {
      let { x: x1, y: y1, lines: lines1 } = layer.vertices[element.vertices[0]];
      let { x: x2, y: y2, lines: lines2 } = layer.vertices[element.vertices[1]];

      const length = Geometry.pointsDistance(x1, y1, x2, y2);
      const length_5 = length / 5;

      const thickness = element.properties.thickness.length;
      const half_thickness = thickness / 2;
      const half_thickness_eps = half_thickness + epsilon;
      const char_height = 11;
      const extra_epsilon = 5;
      const textDistance = half_thickness + epsilon + extra_epsilon;

      const points1 = calcLineEnd(layer, element.id, element.vertices[0], thickness);
      const points2 = calcLineEnd(layer, element.id, element.vertices[1], thickness);
      const wp1 = layer.vertices[element.vertices[0]];
      const wp2 = layer.vertices[element.vertices[1]];
      const angleWall = Geometry.angleBetweenTwoVertices(wp1, wp2);
      let points = [];

      const degreeWall = angleWall * 180 / Math.PI;
      const lineInverted = (degreeWall > 90 || degreeWall < -90);
      if (lineInverted) { // currently dragged
        points.push(...points1.map((p) => ({ x: length - p.x, y: p.y })));
        points.push(...points2);
      } else {
        points.push(...points1);
        points.push(...points2.map((p) => ({ x: length - p.x, y: p.y })));
      }

      points = orderPoints(points);

      lines1 = lines1.filter((line) => (line !== undefined && line !== element.id));
      lines2 = lines2.filter((line) => (line !== undefined && line !== element.id));

      return (element.selected) ?
        <g>
          {/*<rect x="0" y={-half_thickness} width={length} height={thickness} style={STYLE_RECT_SELECTED} />*/}
          {<polygon points={points.map((p) => `${p.x},${p.y}`).join(' ')} style={STYLE_RECT_SELECTED} />}
          <line x1={length_5} y1={-half_thickness_eps} x2={length_5} y2={half_thickness_eps} style={STYLE_LINE} />
          <text x={length_5} y={textDistance + char_height} style={STYLE_TEXT}>A</text>
          <text x={length_5} y={-textDistance} style={STYLE_TEXT}>B</text>
        </g> :
        <>
          {/*<rect x="0" y={-half_thickness} width={length} height={thickness} style={STYLE_RECT} />*/}
          {<polygon points={points.map((p) => `${p.x},${p.y}`).join(' ')} style={STYLE_RECT} />}
          {/* ////<text x={length_5} y={-thickness} style={STYLE_TEXT}>{element.id}</text>*/}
        </>
    },

    async render3D(element: Line, layer: Layer, scene: Scene) {
      return buildWall(element, layer, scene, textures);
    },

    async updateRender3D(element: Line, layer: Layer, scene: Scene, mesh: Three.Object3D<Three.Object3DEventMap>, oldElement: Line, differences, selfDestroy, selfBuild) {
      return updatedWall(element, layer, scene, textures, mesh, oldElement, differences, selfDestroy, selfBuild);
    }
  };

  return wallElement;
}
