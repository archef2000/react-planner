import * as Three from 'three';

import React from 'react';
import convert from 'convert-units';
import { defineCatalogElement } from '@archef2000/react-planner';
import { ReactPlannerConstants } from '@archef2000/react-planner';
import { BoxHelper, BufferGeometry } from 'three';

export default defineCatalogElement({
  name: "simple-stair",
  prototype: "items",

  info: {
    title: "simple stair",
    tag: ['building', 'stair'],
    description: "Simple stair",
    image: require('./simple-stair.png')
  },

  properties: {
    width: {
      label: "Width",
      type: "length-measure",
      defaultValue: {
        length: 50
      }
    },
    depth: {
      label: "Depth",
      type: "length-measure",
      defaultValue: {
        length: 300
      }
    },
    height: {
      label: "Height",
      type: "length-measure",
      defaultValue: {
        length: 300
      }
    },
    altitude: {
      label: "Altitude",
      type: "length-measure",
      defaultValue: {
        length: 0
      }
    }
  },

  render2D: function (element, layer, scene) {
    const newWidth = convert(element.properties.width.length)
      .from(ReactPlannerConstants.UNIT_CENTIMETER)
      .to(scene.unit);

    const newDepth = convert(element.properties.depth.length)
      .from(ReactPlannerConstants.UNIT_CENTIMETER)
      .to(scene.unit);

    const angle = element.rotation + 90;
    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }

    const style = { stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: "#84e1ce" } as const;
    const arrow_style = { stroke: element.selected ? '#0096fd' : undefined, strokeWidth: "2px", fill: "#84e1ce" } as const;

    return (
      <g transform={`translate(${-newWidth / 2},${-newDepth / 2})`}>
        <rect key="1" x="0" y="0" width={newWidth} height={newDepth} style={style} />
        <line key="2" x1={newWidth / 2} x2={newWidth / 2} y1={newDepth} y2={newDepth + 30} style={arrow_style} />
        <line key="3" x1={.35 * newWidth} x2={newWidth / 2} y1={newDepth + 15} y2={newDepth + 30} style={arrow_style} />
        <line key="4" x1={newWidth / 2} x2={.65 * newWidth} y1={newDepth + 30} y2={newDepth + 15} style={arrow_style} />
        <text key="5" x="0" y="0"
          transform={`translate(${newWidth / 2}, ${newDepth / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: "middle", fontSize: "11px" }}>
          {element.type}
        </text>
      </g>
    );
  },

  async render3D(element, layer, scene) {
    const loader = new Three.TextureLoader();
    const whitePaintTextureRepeatFactor = 1 / 20; // In a 100x100 area i want to repeat this texture 5x5 times

    const newWidth: number = convert(element.properties.width.length)
      .from(ReactPlannerConstants.UNIT_CENTIMETER)
      .to(scene.unit);

    const newDepth: number = convert(element.properties.depth.length)
      .from(ReactPlannerConstants.UNIT_CENTIMETER)
      .to(scene.unit);

    const newHeight: number = convert(element.properties.height.length)
      .from(ReactPlannerConstants.UNIT_CENTIMETER)
      .to(scene.unit);

    const newAltitude = convert(element.properties.altitude.length)
      .from(ReactPlannerConstants.UNIT_CENTIMETER)
      .to(scene.unit);

    const stair = new Three.Object3D();

    // compute step dimensions with Blondel formula
    const a = (63 * newHeight) / (newDepth + 2 * newHeight);
    const p = 63 - 2 * a;

    const numberOfSteps = Math.round(newHeight / a);
    const stepHeight = newHeight / numberOfSteps;
    const stepDepth = newDepth / numberOfSteps;
    const stepWidth = newWidth;

    // Build planes for every step
    const stepPlaneGeometry = new Three.PlaneGeometry(stepWidth, stepHeight);
    assignUVs(stepPlaneGeometry);
    const stepPlaneMaterial = new Three.MeshBasicMaterial({ side: Three.FrontSide });
    stepPlaneMaterial.map = loader.load(require('./textures/white-paint.jpg'));
    stepPlaneMaterial.needsUpdate = true;
    stepPlaneMaterial.map.wrapS = Three.RepeatWrapping;
    stepPlaneMaterial.map.wrapT = Three.RepeatWrapping;
    stepPlaneMaterial.map.repeat.set(stepWidth * whitePaintTextureRepeatFactor, stepHeight * whitePaintTextureRepeatFactor);

    // Build stair profile shape
    const starProfileShapePoints: [number, number][] = [];

    for (let i = 0; i < numberOfSteps; i++) {
      starProfileShapePoints.push([(numberOfSteps - i) * stepDepth, i * stepHeight],
        [(numberOfSteps - i) * stepDepth, (i + 1) * stepHeight]);

      const stepPlane = new Three.Mesh(stepPlaneGeometry, stepPlaneMaterial);
      stepPlane.position.x += stepWidth / 2;
      stepPlane.position.z = (numberOfSteps - i) * stepDepth;
      stepPlane.position.y = i * stepHeight + stepHeight / 2;
      stair.add(stepPlane);

      const stepCover = buildStepCover(stepWidth, stepHeight, stepDepth);
      stepCover.position.y += stepHeight * i + stepHeight / 2;
      stepCover.position.z += (numberOfSteps - i) * stepDepth;

      stair.add(stepCover);
    }

    starProfileShapePoints.push([0, numberOfSteps * stepHeight],
      [0, (numberOfSteps - 1) * stepHeight],
      [(numberOfSteps - 1) * stepDepth, 0]);

    const stairShapeProfile = new Three.Shape();
    stairShapeProfile.moveTo(starProfileShapePoints[0][0], starProfileShapePoints[0][1]);
    for (let i = 1; i < starProfileShapePoints.length; i++) {
      stairShapeProfile.lineTo(starProfileShapePoints[i][0], starProfileShapePoints[i][1]);
    }

    const stairShapeProfileGeometry = new Three.ShapeGeometry(stairShapeProfile);
    assignUVs(stairShapeProfileGeometry);
    const stairProfileMaterial = new Three.MeshPhongMaterial({ side: Three.FrontSide });

    stairProfileMaterial.map = loader.load(require('./textures/white-paint.jpg'));
    stairProfileMaterial.needsUpdate = true;
    stairProfileMaterial.map.wrapS = Three.RepeatWrapping;
    stairProfileMaterial.map.wrapT = Three.RepeatWrapping;
    stairProfileMaterial.map.repeat.set(numberOfSteps * stepDepth * whitePaintTextureRepeatFactor,
      numberOfSteps * stepHeight * whitePaintTextureRepeatFactor);

    const stairProfile = new Three.Mesh(stairShapeProfileGeometry, stairProfileMaterial);

    stairProfile.rotation.y = -Math.PI / 2;

    stair.add(stairProfile);

    const stairProfileMaterial2 = new Three.MeshPhongMaterial({ side: Three.BackSide });

    stairProfileMaterial2.map = loader.load(require('./textures/white-paint.jpg'));
    stairProfileMaterial2.needsUpdate = true;
    stairProfileMaterial2.map.wrapS = Three.RepeatWrapping;
    stairProfileMaterial2.map.wrapT = Three.RepeatWrapping;
    stairProfileMaterial2.map.repeat.set(numberOfSteps * stepDepth * whitePaintTextureRepeatFactor,
      numberOfSteps * stepHeight * whitePaintTextureRepeatFactor);

    const stairProfile2 = new Three.Mesh(stairShapeProfileGeometry, stairProfileMaterial2);

    stairProfile2.rotation.y = -Math.PI / 2;
    stairProfile2.position.x += newWidth;

    stair.add(stairProfile2);

    // Build closures for the stair

    /*** CLOSURE 1 ***/
    const closure1Slope = -Math.atan(stepDepth / stepHeight);
    const stairClosure1Width = newWidth;
    const stairClosure1Height = (numberOfSteps - 1) * stepHeight / Math.cos(closure1Slope);
    const stairClosure1Geometry = new Three.PlaneGeometry(stairClosure1Width, stairClosure1Height);

    const closure1Material = new Three.MeshPhongMaterial({ side: Three.BackSide });
    closure1Material.map = loader.load(require('./textures/white-paint.jpg'));
    closure1Material.needsUpdate = true;
    closure1Material.map.wrapS = Three.RepeatWrapping;
    closure1Material.map.wrapT = Three.RepeatWrapping;
    closure1Material.map.repeat.set(stairClosure1Width * whitePaintTextureRepeatFactor,
      stairClosure1Height * whitePaintTextureRepeatFactor);
    const stairClosure1 = new Three.Mesh(stairClosure1Geometry, closure1Material);
    const pivotClosure1 = new Three.Object3D();
    stairClosure1.position.y += stairClosure1Height / 2;
    pivotClosure1.add(stairClosure1);

    pivotClosure1.position.x = newWidth / 2;
    pivotClosure1.position.z = (numberOfSteps - 1) * stepDepth;

    pivotClosure1.rotation.x = closure1Slope;

    stair.add(pivotClosure1);

    /*** CLOSURE 2 ***/
    const closure2 = new Three.Mesh(stepPlaneGeometry, stepPlaneMaterial);
    closure2.rotation.y = Math.PI;
    closure2.position.x = stepWidth / 2;
    closure2.position.y = numberOfSteps * stepHeight - stepHeight / 2;
    stair.add(closure2);

    /*** CLOSURE 2 ***/
    const stairClosure3Geometry = new Three.PlaneGeometry(stepWidth, stepDepth);
    const closure3 = new Three.Mesh(stairClosure3Geometry, stepPlaneMaterial);
    closure3.rotation.x = Math.PI / 2;
    closure3.position.x = stepWidth / 2;
    closure3.position.z = (numberOfSteps - 1) * stepDepth + stepDepth / 2;

    stair.add(closure3);

    if (element.selected) {
      const box = new BoxHelper(stair, 0x99c3fb);
      box.material.linewidth = 2;
      box.material.depthTest = false;
      box.renderOrder = 1000;
      stair.add(box);
    }

    // Normalize the origin of the object
    const boundingBox = new Three.Box3().setFromObject(stair);

    const center = [
      (boundingBox.max.x - boundingBox.min.x) / 2 + boundingBox.min.x,
      (boundingBox.max.y - boundingBox.min.y) / 2 + boundingBox.min.y,
      (boundingBox.max.z - boundingBox.min.z) / 2 + boundingBox.min.z];

    stair.position.x -= center[0];
    stair.position.y -= center[1] - (boundingBox.max.y - boundingBox.min.y) / 2;
    stair.position.z -= center[2];

    // I re-scale the stair following the initial attributes
    stair.scale.set(newWidth / (boundingBox.max.x - boundingBox.min.x),
      newHeight / (boundingBox.max.y - boundingBox.min.y),
      newDepth / (boundingBox.max.z - boundingBox.min.z));

    stair.position.y += newAltitude;

    return stair;
  },

  async updateRender3D(element, layer, scene, mesh, oldElement, differences, selfDestroy, selfBuild) {
    const noPerf = () => { selfDestroy(); return selfBuild(); };

    if (differences.indexOf('selected') !== -1) {
      mesh.traverse((child) => {
        if (child instanceof BoxHelper) {
          child.visible = element.selected;
        }
      });
      return mesh;
    }

    if (differences.indexOf('rotation') !== -1) {
      mesh.rotation.y = element.rotation * Math.PI / 180;
      return mesh;
    }

    if (differences.indexOf('x') !== -1 || differences.indexOf('y') !== -1) {
      mesh.position.x = element.x;
      mesh.position.z = -element.y;
      return mesh;
    }

    if (differences.indexOf('properties') !== -1) {
      const oldWidth = convert(oldElement.properties.width.length)
        .from(ReactPlannerConstants.UNIT_CENTIMETER)
        .to(scene.unit);
      const oldDepth = convert(oldElement.properties.depth.length)
        .from(ReactPlannerConstants.UNIT_CENTIMETER)
        .to(scene.unit);
      const oldHeight = convert(oldElement.properties.height.length)
        .from(ReactPlannerConstants.UNIT_CENTIMETER)
        .to(scene.unit);
      const oldAltitude = convert(oldElement.properties.altitude.length)
        .from(ReactPlannerConstants.UNIT_CENTIMETER)
        .to(scene.unit);

      const newWidth = convert(element.properties.width.length)
        .from(ReactPlannerConstants.UNIT_CENTIMETER)
        .to(scene.unit);
      const newDepth = convert(element.properties.depth.length)
        .from(ReactPlannerConstants.UNIT_CENTIMETER)
        .to(scene.unit);
      const newHeight = convert(element.properties.height.length)
        .from(ReactPlannerConstants.UNIT_CENTIMETER)
        .to(scene.unit);
      const newAltitude = convert(element.properties.altitude.length)
        .from(ReactPlannerConstants.UNIT_CENTIMETER)
        .to(scene.unit);

      const widthChanged = Math.abs(newWidth - oldWidth) > 1e-6;
      const depthChanged = Math.abs(newDepth - oldDepth) > 1e-6;
      const heightChanged = Math.abs(newHeight - oldHeight) > 1e-6;
      const altitudeChanged = Math.abs(newAltitude - oldAltitude) > 1e-6;

      if (depthChanged || heightChanged) {
        return noPerf();
      }

      if (widthChanged) {
        const ratioW = newWidth / oldWidth;
        mesh.scale.x *= ratioW;
      }

      if (altitudeChanged) {
        const deltaAlt = newAltitude - oldAltitude;
        mesh.position.y += deltaAlt;
      }
      return mesh;
    }
    return noPerf();
  }
});

function assignUVs(geometry: BufferGeometry) {
  geometry.computeBoundingBox();

  const max = geometry.boundingBox.max;
  const min = geometry.boundingBox.min;

  const offset = new Three.Vector2(0 - min.x, 0 - min.y);
  const range = new Three.Vector2(max.x - min.x, max.y - min.y);

  const uvAttribute = geometry.getAttribute('uv');
  const positionAttribute = geometry.getAttribute('position');

  for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);

    const u = (x + offset.x) / range.x;
    const v = (y + offset.y) / range.y;

    uvAttribute.setXY(i, u, v);
  }
  uvAttribute.needsUpdate = true;
}

function buildStepCover(width: number, height: number, depth: number) {
  const loader = new Three.TextureLoader();

  const stepCoverHeight = 2;

  const stepCoverLength = 2;

  const planeGeometry = new Three.PlaneGeometry(width + stepCoverLength * 2, depth + stepCoverHeight);
  const planeMaterial = new Three.MeshBasicMaterial({ side: Three.FrontSide });
  assignUVs(planeGeometry);

  const planeGeometry2 = new Three.PlaneGeometry(depth + stepCoverLength, stepCoverHeight);
  assignUVs(planeGeometry2);

  const planeGeometry3 = new Three.PlaneGeometry(width + stepCoverLength * 2, stepCoverHeight);
  assignUVs(planeGeometry3);

  planeMaterial.map = loader.load(require('./textures/marble.jpg'));
  planeMaterial.needsUpdate = true;
  planeMaterial.map.wrapS = Three.RepeatWrapping;
  planeMaterial.map.wrapT = Three.RepeatWrapping;

  const plane = new Three.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;

  plane.position.x = width / 2;
  plane.position.z = -depth / 2;
  plane.position.y += height / 2 + stepCoverHeight;

  const plane2 = new Three.Mesh(planeGeometry2, planeMaterial);
  plane2.rotation.y = -Math.PI / 2;

  plane2.position.x -= stepCoverLength;
  plane2.position.y += height / 2 + stepCoverHeight / 2;
  plane2.position.z -= depth / 2;

  const plane3 = new Three.Mesh(planeGeometry, planeMaterial);
  plane3.rotation.x = Math.PI / 2;

  plane3.position.x = width / 2;
  plane3.position.z = -depth / 2;
  plane3.position.y += height / 2;

  const plane4 = new Three.Mesh(planeGeometry2, planeMaterial);
  plane4.rotation.y = Math.PI / 2;

  plane4.position.x += width + stepCoverLength;
  plane4.position.y += height / 2 + stepCoverHeight / 2;
  plane4.position.z -= depth / 2;

  const plane5 = new Three.Mesh(planeGeometry3, planeMaterial);

  plane5.position.x += width / 2;
  plane5.position.y += height / 2 + stepCoverHeight / 2;
  plane5.position.z += stepCoverLength / 2;

  const plane6 = new Three.Mesh(planeGeometry3, planeMaterial);

  plane6.rotation.y = Math.PI;

  plane6.position.x += width / 2;
  plane6.position.y += height / 2 + stepCoverHeight / 2;
  plane6.position.z -= depth + stepCoverLength / 2;

  const stepCover = new Three.Object3D();

  stepCover.add(plane);
  stepCover.add(plane2);
  stepCover.add(plane3);
  stepCover.add(plane4);
  stepCover.add(plane5);
  stepCover.add(plane6);

  return stepCover;
};
