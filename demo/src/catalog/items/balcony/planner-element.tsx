import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

// Textures & materials
const paintedtexture = require('./painted.jpg');
const brickTexture = require('./bricks.jpg');
const textureLoader = new Three.TextureLoader();
const baseMat = new Three.MeshLambertMaterial({ map: textureLoader.load(paintedtexture) });
const wallMat = new Three.MeshLambertMaterial({ map: textureLoader.load(brickTexture) });

// Constant wall/base thickness independent from height property
const BASE_THICKNESS = 8;      // vertical thickness of the base slab
const WALL_THICKNESS = 10;     // horizontal thickness of side/front walls
const TOP_RAIL_THICKNESS = 6;  // thickness of the thin top rails
const TEXTURE_TILE_SIZE = 50;   // world units per texture tile for walls

function configureWallTexture(mesh: Three.Mesh, sizeX: number, sizeY: number) {
  const material = mesh.material as Three.MeshLambertMaterial;
  if (material.map) {
    material.map.wrapS = material.map.wrapT = Three.RepeatWrapping;
    material.map.repeat.set(Math.max(1, sizeX / TEXTURE_TILE_SIZE), Math.max(1, sizeY / TEXTURE_TILE_SIZE));
    material.map.needsUpdate = true;
  }
}

function createSideWall(name: string, height: number, depth: number, x: number) {
  // Brick texture for the two large faces (depth x height). Use duplicates so each face can have its own offset if needed later.
  const brickTex = textureLoader.load(brickTexture);
  brickTex.wrapS = brickTex.wrapT = Three.RepeatWrapping;
  brickTex.repeat.set(Math.max(1, depth / TEXTURE_TILE_SIZE), Math.max(1, height / TEXTURE_TILE_SIZE));
  const brickMatA = new Three.MeshLambertMaterial({ map: brickTex, side: Three.FrontSide });
  const brickMatB = brickMatA.clone();
  // Plain materials for thin faces (top, bottom, front, back) to avoid squished bricks on thickness faces
  const plainMat = baseMat.clone();
  const materials = [brickMatA, brickMatB, plainMat, plainMat, plainMat, plainMat];
  const geo = new Three.BoxGeometry(WALL_THICKNESS, height, depth);
  const wall = new Three.Mesh(geo, materials);
  wall.position.set(x, BASE_THICKNESS / 2 + height / 2, 0);
  wall.name = name;
  return wall;
}

function buildBalcony(width: number, height: number, depth: number) {
  const group = new Three.Object3D();
  group.name = 'balcony-root';

  // Width is the total outside width now
  const base = new Three.Mesh(new Three.BoxGeometry(width, BASE_THICKNESS, depth), baseMat.clone());
  base.name = 'balcony-base';
  group.add(base);

  const wallHeight = height; // vertical segment above base
  // Walls should sit directly on top of the base: base spans [-BASE_THICKNESS/2, +BASE_THICKNESS/2]
  // so wall bottom y = +BASE_THICKNESS/2 -> center = BASE_THICKNESS/2 + wallHeight/2
  const yWallCenter = BASE_THICKNESS / 2 + wallHeight / 2;

  // Side walls
  const leftWall = createSideWall('balcony-wall-left', wallHeight, depth, -width / 2 + WALL_THICKNESS / 2);
  group.add(leftWall);
  const rightWall = createSideWall('balcony-wall-right', wallHeight, depth, width / 2 - WALL_THICKNESS / 2);
  group.add(rightWall);

  // Front wall connects edges
  const frontWall = new Three.Mesh(new Three.BoxGeometry(width, wallHeight, WALL_THICKNESS), wallMat.clone());
  frontWall.position.set(0, yWallCenter, depth / 2 - WALL_THICKNESS / 2);
  frontWall.name = 'balcony-wall-front';
  configureWallTexture(frontWall, width, wallHeight);
  group.add(frontWall);

  // Rails at top (optional aesthetic)
  const yTopRailCenter = BASE_THICKNESS / 2 + wallHeight + TOP_RAIL_THICKNESS / 2;
  const railMat = baseMat.clone();
  const leftRail = new Three.Mesh(new Three.BoxGeometry(WALL_THICKNESS, TOP_RAIL_THICKNESS, depth), railMat);
  leftRail.position.set(-width / 2 + WALL_THICKNESS / 2, yTopRailCenter, 0);
  leftRail.name = 'balcony-rail-left';
  group.add(leftRail);
  const rightRail = new Three.Mesh(new Three.BoxGeometry(WALL_THICKNESS, TOP_RAIL_THICKNESS, depth), railMat.clone());
  rightRail.position.set(width / 2 - WALL_THICKNESS / 2, yTopRailCenter, 0);
  rightRail.name = 'balcony-rail-right';
  group.add(rightRail);
  const frontRail = new Three.Mesh(new Three.BoxGeometry(width, TOP_RAIL_THICKNESS, WALL_THICKNESS), railMat.clone());
  frontRail.position.set(0, yTopRailCenter, depth / 2 - WALL_THICKNESS / 2);
  frontRail.name = 'balcony-rail-front';
  group.add(frontRail);

  return group;
}

export default defineCatalogElement({
  name: 'balcony',
  prototype: 'items',
  info: {
    tag: ['furnishings', 'metal'],
    title: 'balcony',
    description: 'balcony',
    image: require('./balcony.png')
  },
  properties: {
    width: {
      label: 'width',
      type: 'length-measure',
      defaultValue: { length: 500 }
    },
    depth: {
      label: 'depth',
      type: 'length-measure',
      defaultValue: { length: 100 }
    },
    height: {
      label: 'height',
      type: 'length-measure',
      defaultValue: { length: 100 }
    },
    altitude: {
      label: 'altitude',
      type: 'length-measure',
      defaultValue: { length: 0 }
    },
    patternColor: {
      label: '2D color',
      type: 'color',
      defaultValue: '#f5f4f4'
    }
  },
  render2D(element) {
    const newWidth = element.properties.width.length;
    const newDepth = element.properties.depth.length;
    const fillValue = element.selected ? '#99c3fb' : element.properties.patternColor;
    const angle = element.rotation + 90;
    const textRotation = Math.sin(angle * Math.PI / 180) < 0 ? 180 : 0;
    return (
      <g transform={`translate(${-newWidth / 2},${-newDepth / 2})`}>
        <rect x='0' y='0' width={newWidth} height={newDepth}
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: fillValue }} />
        <text x='0' y='0'
          transform={`translate(${newWidth / 2}, ${newDepth / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: 'middle', fontSize: '11px' }}>
          {element.name}
        </text>
      </g>
    );
  },
  async render3D(element) {
    const width = element.properties.width.length;
    const depth = element.properties.depth.length;
    const height = element.properties.height.length; // vertical wall extent
    const altitude = element.properties.altitude.length;

    const balcony = buildBalcony(width, height, depth);
    // Custom selection anchor to avoid oversized bounding box (exclude outer wall thickness)
    const totalHeight = BASE_THICKNESS + height + TOP_RAIL_THICKNESS;
    const selectionAnchorGeo = new Three.BoxGeometry(width, totalHeight, depth);
    const selectionAnchorMat = new Three.MeshBasicMaterial({ visible: false });
    const selectionAnchor = new Three.Mesh(selectionAnchorGeo, selectionAnchorMat);
    selectionAnchor.name = 'balcony-selection-anchor';
    // Center logic: root origin at base center; selection box bottom should align with base bottom
    // Center so bottom aligns to base bottom (-BASE_THICKNESS/2) and top to rail top (BASE_THICKNESS/2 + height + TOP_RAIL_THICKNESS)
    selectionAnchor.position.y = (height + TOP_RAIL_THICKNESS) / 2; // relative to base center
    balcony.add(selectionAnchor);

    const box = new Three.BoxHelper(selectionAnchor, 0x99c3fb);
    box.material.linewidth = 2;
    box.material.depthTest = false;
    box.renderOrder = 1000;
    box.visible = !!element.selected;
    box.name = 'balcony-selection-box';
    balcony.add(box);

    // Position base so its bottom sits at altitude
    balcony.position.y = BASE_THICKNESS / 2 + altitude;
    return balcony;
  },
  async updateRender3D(element, _layer, _scene, mesh, oldElement, differences, selfDestroy, selfBuild) {
    const noPerf = () => { selfDestroy(); return selfBuild(); };

    if (differences.indexOf('selected') !== -1) {
      const selectionBox = mesh.getObjectByName('balcony-selection-box') as Three.BoxHelper | undefined;
      if (selectionBox) selectionBox.visible = !!element.selected;
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
      const oldWidth = oldElement.properties.width.length;
      const oldDepth = oldElement.properties.depth.length;
      const oldHeight = oldElement.properties.height.length;
      const oldAltitude = oldElement.properties.altitude.length;

      const newWidth = element.properties.width.length;
      const newDepth = element.properties.depth.length;
      const newHeight = element.properties.height.length;
      const newAltitude = element.properties.altitude.length;

      const widthChanged = Math.abs(newWidth - oldWidth) > 1e-6;
      const depthChanged = Math.abs(newDepth - oldDepth) > 1e-6;
      const heightChanged = Math.abs(newHeight - oldHeight) > 1e-6;
      const altitudeChanged = Math.abs(newAltitude - oldAltitude) > 1e-6;

      if (widthChanged || depthChanged || heightChanged) {
        const replaceGeometry = (name: string, geometry: Three.BufferGeometry) => {
          const obj = mesh.getObjectByName(name) as Three.Mesh | null;
          if (obj) { obj.geometry.dispose(); obj.geometry = geometry; }
        };

        // Base
        replaceGeometry('balcony-base', new Three.BoxGeometry(newWidth, BASE_THICKNESS, newDepth));

        const wallHeight = newHeight;
        const yWallCenter = BASE_THICKNESS / 2 + wallHeight / 2;
        const yTopRailCenter = BASE_THICKNESS / 2 + wallHeight + TOP_RAIL_THICKNESS / 2;

        // Side walls
        replaceGeometry('balcony-wall-left', new Three.BoxGeometry(WALL_THICKNESS, wallHeight, newDepth));
        const leftWall = mesh.getObjectByName('balcony-wall-left') as Three.Mesh | null;
        if (leftWall) {
          leftWall.position.set(-newWidth / 2 + WALL_THICKNESS / 2, yWallCenter, 0);
          if (Array.isArray(leftWall.material)) {
            for (let i = 0; i < 2; i++) {
              const mat = leftWall.material[i] as Three.MeshLambertMaterial;
              if (mat.map) {
                mat.map.wrapS = mat.map.wrapT = Three.RepeatWrapping;
                mat.map.repeat.set(Math.max(1, newDepth / TEXTURE_TILE_SIZE), Math.max(1, wallHeight / TEXTURE_TILE_SIZE));
                mat.map.needsUpdate = true;
              }
            }
          }
        }

        replaceGeometry('balcony-wall-right', new Three.BoxGeometry(WALL_THICKNESS, wallHeight, newDepth));
        const rightWall = mesh.getObjectByName('balcony-wall-right') as Three.Mesh | null;
        if (rightWall) {
          rightWall.position.set(newWidth / 2 - WALL_THICKNESS / 2, yWallCenter, 0);
          if (Array.isArray(rightWall.material)) {
            for (let i = 0; i < 2; i++) {
              const mat = rightWall.material[i] as Three.MeshLambertMaterial;
              if (mat.map) {
                mat.map.wrapS = mat.map.wrapT = Three.RepeatWrapping;
                mat.map.repeat.set(Math.max(1, newDepth / TEXTURE_TILE_SIZE), Math.max(1, wallHeight / TEXTURE_TILE_SIZE));
                mat.map.needsUpdate = true;
              }
            }
          }
        }

        // Front wall
        replaceGeometry('balcony-wall-front', new Three.BoxGeometry(newWidth, wallHeight, WALL_THICKNESS));
        const frontWall = mesh.getObjectByName('balcony-wall-front') as Three.Mesh | null;
        if (frontWall) {
          frontWall.position.set(0, yWallCenter, newDepth / 2 - WALL_THICKNESS / 2);
          configureWallTexture(frontWall, newWidth, wallHeight);
        }

        // Rails
        replaceGeometry('balcony-rail-left', new Three.BoxGeometry(WALL_THICKNESS, TOP_RAIL_THICKNESS, newDepth));
        const leftRail = mesh.getObjectByName('balcony-rail-left') as Three.Mesh | null;
        if (leftRail) leftRail.position.set(-newWidth / 2 + WALL_THICKNESS / 2, yTopRailCenter, 0);

        replaceGeometry('balcony-rail-right', new Three.BoxGeometry(WALL_THICKNESS, TOP_RAIL_THICKNESS, newDepth));
        const rightRail = mesh.getObjectByName('balcony-rail-right') as Three.Mesh | null;
        if (rightRail) rightRail.position.set(newWidth / 2 - WALL_THICKNESS / 2, yTopRailCenter, 0);

        replaceGeometry('balcony-rail-front', new Three.BoxGeometry(newWidth, TOP_RAIL_THICKNESS, WALL_THICKNESS));
        const frontRail = mesh.getObjectByName('balcony-rail-front') as Three.Mesh | null;
        if (frontRail) frontRail.position.set(0, yTopRailCenter, newDepth / 2 - WALL_THICKNESS / 2);

        // Selection anchor
        const selectionAnchor = mesh.getObjectByName('balcony-selection-anchor') as Three.Mesh | null;
        const totalHeight = BASE_THICKNESS + newHeight + TOP_RAIL_THICKNESS;
        if (selectionAnchor) {
          selectionAnchor.geometry.dispose();
          selectionAnchor.geometry = new Three.BoxGeometry(newWidth, totalHeight, newDepth);
          selectionAnchor.position.y = newAltitude + (newHeight + TOP_RAIL_THICKNESS) + BASE_THICKNESS;
          selectionAnchor.updateMatrixWorld(true);
        }

        // Refresh selection box if exists
        const selectionBox = mesh.getObjectByName('balcony-selection-box') as Three.BoxHelper | null;
        if (selectionBox) selectionBox.update();
      }

      if (altitudeChanged) {
        mesh.position.y = BASE_THICKNESS / 2 + newAltitude;
      }

      return mesh;
    }

    return noPerf();
  }
});
