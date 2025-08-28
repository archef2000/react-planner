import * as Three from 'three';
import React from 'react';
import { defineCatalogElement, Models } from '@archef2000/react-planner'

function buildToiletGeom(
  width: number,
  depth: number,
  seatHeight: number,
  tankBodyHeight: number,
  tankBottomOffset: number,
  color: string,
  showTank: boolean,
  lowDetail: boolean,
  roundLower: number,
  opening: number,
  ringWidth: number,
  seatBackFlat: boolean,
  roundingStartHeight: number,
  tankWidthRatio: number,
  tankDepth: number,
  seatThicknessValue: number,
  roundingSmoothness: number
) {
  const group = new Three.Object3D();

  const mainColor = new Three.Color(color || '#ffffff');
  const porcelain = new Three.MeshLambertMaterial({ color: mainColor });
  const dark = new Three.MeshLambertMaterial({ color: 0x333333 });

  const seatOuterHalfX = width * 0.5;
  const seatThickness = seatThicknessValue > 0 ? seatThicknessValue : Math.max(1.2, seatHeight * 0.06);
  const openingWidth = Math.max(10, Math.min(opening, seatOuterHalfX * 1.8));
  const seatOuterRX = Math.min(openingWidth / 2 + 5, width / 2);
  let seatInnerRX = Math.max(1, seatOuterRX - ringWidth);
  seatInnerRX = Math.min(seatInnerRX, openingWidth / 2 - 0.0001);
  const aspect = depth / width;
  const seatOuterRZ = Math.min((openingWidth * aspect) / 2 + 5, depth / 2);
  const seatInnerRZ = seatInnerRX * aspect;
  const seatOuterHalfZ = depth / 2;
  const baseOuterR = Math.min(seatOuterHalfX, seatOuterHalfZ);
  const bowlHeight = seatHeight - seatThickness;
  const steps = lowDetail ? 20 : 30;

  // bowl
  const lowerSlider = Math.min(Math.max(roundLower, 0), 100);
  const lowerIntensity = lowerSlider / 100;
  const maxReductionFactor = 0.60;
  const bottomRadius = baseOuterR * (1 - maxReductionFactor * lowerIntensity);
  const roundingStart = Math.min(Math.max(roundingStartHeight, 0), bowlHeight - 0.01);
  const bowlProfile: Three.Vector2[] = [];
  bowlProfile.push(new Three.Vector2(0, 0)); // bottom closed

  const arcSteps = Math.max(8, Math.floor(steps));
  const smoothSlider = Math.min(Math.max(roundingSmoothness, 0), 100);
  const easingExponent = (smoothSlider / 100) * (3);
  if (roundingStart > 0) {
    for (let i = 0; i <= arcSteps; i++) {
      const t = i / arcSteps; // 0..1 along rounding height
      const y = t * roundingStart;
      const base = Math.sin((t * Math.PI) / 2);
      const progress = Math.pow(base, easingExponent);
      const r = bottomRadius + (baseOuterR - bottomRadius) * progress;
      const prev = bowlProfile[bowlProfile.length - 1];
      if (!prev || Math.abs(prev.x - r) > 1e-5 || Math.abs(prev.y - y) > 1e-5) {
        bowlProfile.push(new Three.Vector2(r, y));
      }
    }
  } else {
    bowlProfile.push(new Three.Vector2(baseOuterR, 0));
  }

  // Vertical section from roundingStart to bowlHeight (constant radius)
  if (roundingStart < bowlHeight) {
    const last = bowlProfile[bowlProfile.length - 1];
    if (Math.abs(last.x - baseOuterR) > 1e-5 || Math.abs(last.y - roundingStart) > 1e-5) {
      bowlProfile.push(new Three.Vector2(baseOuterR, roundingStart));
    }
    if (Math.abs(bowlHeight - roundingStart) > 1e-5) {
      bowlProfile.push(new Three.Vector2(baseOuterR, bowlHeight));
    }
  }

  const radialSegments = lowDetail ? 16 : 40;
  const bowlGeom = new Three.LatheGeometry(bowlProfile, radialSegments);
  bowlGeom.scale(seatOuterHalfX / baseOuterR, 1, seatOuterHalfZ / baseOuterR);
  bowlGeom.computeVertexNormals();
  const bowlMesh = new Three.Mesh(bowlGeom, porcelain);
  bowlMesh.material.side = Three.DoubleSide;
  group.add(bowlMesh);

  const buildTopRimShape = () => {
    if (!seatBackFlat) {
      const shape = new Three.Shape();
      shape.absellipse(0, 0, seatOuterHalfX, seatOuterHalfZ, 0, Math.PI * 2, false, 0);
      const hole = new Three.Path();
      hole.absellipse(0, 0, seatInnerRX, seatInnerRZ, 0, Math.PI * 2, true, 0);
      shape.holes.push(hole);
      return shape;
    }
    const segs = lowDetail ? 24 : 64;
    const shape = new Three.Shape();
    const yBack = seatOuterHalfZ;
    shape.moveTo(-seatOuterHalfX, yBack);
    shape.lineTo(seatOuterHalfX, yBack);
    shape.lineTo(seatOuterHalfX, 0);
    for (let i = 0; i <= segs; i++) {
      const a = Math.PI * (i / segs); // 0..PI
      const x = seatOuterHalfX * Math.cos(a);
      const z = -seatOuterHalfZ * Math.sin(a);
      shape.lineTo(x, z);
    }
    shape.lineTo(-seatOuterHalfX, 0);
    shape.lineTo(-seatOuterHalfX, yBack);
    const hole = new Three.Path();
    const innerYBack = seatInnerRZ;
    hole.moveTo(seatInnerRX, innerYBack);
    hole.lineTo(-seatInnerRX, innerYBack);
    hole.lineTo(-seatInnerRX, 0);
    for (let i = 0; i <= segs; i++) {
      const a = Math.PI - Math.PI * (i / segs); // PI..0
      const x = seatInnerRX * Math.cos(a);
      const z = -seatInnerRZ * Math.sin(a);
      hole.lineTo(x, z);
    }
    hole.lineTo(seatInnerRX, 0);
    hole.lineTo(seatInnerRX, innerYBack);
    shape.holes.push(hole);
    return shape;
  };
  const rimShape = buildTopRimShape();
  const rimGeom = new Three.ShapeGeometry(rimShape, lowDetail ? 16 : 48);
  const rimMesh = new Three.Mesh(rimGeom, porcelain);
  rimMesh.material.side = Three.DoubleSide;
  rimMesh.rotation.x = -Math.PI / 2;
  rimMesh.position.y = bowlHeight + 0.001;
  group.add(rimMesh);

  if (seatBackFlat) {
    const tempPos = bowlGeom.attributes.position;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (let i = 0; i < tempPos.count; i++) {
      const z = tempPos.getZ(i);
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
    const midZ = (minZ + maxZ) / 2;
    const planeZ = minZ + 1e-4;
    for (let i = 0; i < tempPos.count; i++) {
      if (tempPos.getZ(i) < midZ) tempPos.setZ(i, planeZ);
    }
    bowlGeom.computeVertexNormals();
    if (bowlProfile.length > 1) {
      const capShape = new Three.Shape();
      capShape.moveTo(0, 0);
      for (let i = 1; i < bowlProfile.length; i++) {
        const p = bowlProfile[i];
        capShape.lineTo(p.x, p.y);
      }
      capShape.lineTo(0, 0);
      const capGeom = new Three.ShapeGeometry(capShape, lowDetail ? 8 : 24);
      const sx = seatOuterHalfX / baseOuterR;
      capGeom.scale(sx, 1, 1);
      const capMesh = new Three.Mesh(capGeom, porcelain);
      capMesh.material.side = Three.DoubleSide;
      capMesh.position.z = planeZ + 1e-5;
      group.add(capMesh);
    }
  }

  // toilet ring start
  const buildSeatShape = () => {
    if (!seatBackFlat) {
      const shape = new Three.Shape();
      shape.absellipse(0, 0, seatOuterRX, seatOuterRZ, 0, Math.PI * 2, false, 0);
      const hole = new Three.Path();
      hole.absellipse(0, 0, seatInnerRX, seatInnerRZ, 0, Math.PI * 2, true, 0);
      shape.holes.push(hole);
      return shape;
    }
    const segs = lowDetail ? 24 : 64;
    const shape = new Three.Shape();
    const yBack = depth / 2;
    shape.moveTo(-seatOuterRX, yBack);
    shape.lineTo(seatOuterRX, yBack);
    shape.lineTo(seatOuterRX, 0);
    for (let i = 0; i <= segs; i++) {
      const a = Math.PI * (i / segs);
      const x = seatOuterRX * Math.cos(a);
      const y = -seatOuterRZ * Math.sin(a);
      shape.lineTo(x, y);
    }
    shape.lineTo(-seatOuterRX, 0);
    shape.lineTo(-seatOuterRX, yBack);
    const hole = new Three.Path();
    const innerYBack = seatInnerRZ;
    hole.moveTo(seatInnerRX, innerYBack);
    hole.lineTo(-seatInnerRX, innerYBack);
    hole.lineTo(-seatInnerRX, 0);
    for (let i = 0; i <= segs; i++) {
      const a = Math.PI - Math.PI * (i / segs);
      const x = seatInnerRX * Math.cos(a);
      const y = -seatInnerRZ * Math.sin(a);
      hole.lineTo(x, y);
    }
    hole.lineTo(seatInnerRX, 0);
    hole.lineTo(seatInnerRX, innerYBack);
    shape.holes.push(hole);
    return shape;
  };
  const seatShape = buildSeatShape();
  const seatGeom = new Three.ExtrudeGeometry(seatShape, { depth: seatThickness, bevelEnabled: false, curveSegments: lowDetail ? 24 : 48 });
  const seatMesh = new Three.Mesh(seatGeom, porcelain);
  seatMesh.material.side = Three.DoubleSide;
  seatMesh.rotation.x = -Math.PI / 2;
  seatMesh.position.y = seatHeight - seatThickness + 0.1;
  group.add(seatMesh);

  if (showTank && tankBodyHeight > 0) {
    const tankWidth = width * (tankWidthRatio / 100);
    const tankHeightLocal = Math.max(0, tankBodyHeight);
    if (tankHeightLocal > 0) {
      const tankGeom = new Three.BoxGeometry(tankWidth, tankHeightLocal, tankDepth);
      const tankMesh = new Three.Mesh(tankGeom, porcelain);
      tankMesh.position.set(0, seatHeight + tankBottomOffset + tankHeightLocal / 2, -depth / 2 + tankDepth / 2);
      group.add(tankMesh);
      const btnGeom = new Three.CylinderGeometry(tankWidth * 0.08, tankWidth * 0.08, 2, 16);
      const btnMesh = new Three.Mesh(btnGeom, dark);
      btnMesh.rotation.x = Math.PI / 2;
      btnMesh.position.set(0, seatHeight + tankBottomOffset + tankHeightLocal + 1, tankMesh.position.z - tankDepth / 4);
      group.add(btnMesh);
    }
  }

  return group;
}

export default defineCatalogElement({
  name: 'toilet',
  prototype: 'items',
  info: {
    tag: ['sanitary', 'bathroom'],
    title: 'Toilet',
    description: 'Adjustable toilet (width, depth, seat height, tank body height, color, show/hide tank)',
    image: require("./toilet.png"),
  },
  properties: {
    width: {
      label: 'width',
      type: 'length-measure',
      defaultValue: {
        length: 40
      }
    },
    depth: {
      label: 'depth',
      type: 'length-measure',
      defaultValue: {
        length: 50
      }
    },
    altitude: {
      label: 'altitude',
      type: 'length-measure',
      defaultValue: {
        length: 10
      }
    },
    seatHeight: {
      label: 'seat height',
      type: 'length-measure',
      defaultValue: {
        length: 40
      }
    },

    showTank: {
      label: 'show tank',
      type: 'toggle',
      defaultValue: false
    },
    tankHeight: {
      label: 'tank height',
      type: 'length-measure',
      defaultValue: {
        length: 30
      }
    },
    tankBottom: {
      label: 'tank bottom offset',
      type: 'length-measure',
      defaultValue: {
        length: 0
      }
    },
    tankWidthRatio: {
      label: 'tank width % seat',
      type: 'number',
      defaultValue: 90
    },
    tankDepth: {
      label: 'tank depth',
      type: 'length-measure',
      defaultValue: {
        length: 10
      }
    },

    color: {
      label: 'color',
      type: 'color',
      defaultValue: '#ffffff'
    },
    opening: {
      label: 'opening width',
      type: 'length-measure',
      defaultValue: {
        length: 28
      }
    },
    seatBackFlat: {
      label: 'flat back seat',
      type: 'toggle',
      defaultValue: true
    },
    seatThickness: {
      label: 'seat thickness',
      type: 'length-measure',
      defaultValue: {
        length: 3
      }
    },
    ringWidth: {
      label: 'Seat width',
      type: 'length-measure',
      defaultValue: {
        length: 8
      }
    },

    roundLower: {
      label: 'bowl round lower',
      type: 'number',
      defaultValue: 80
    },
    roundingStartHeight: {
      label: 'rounding start height',
      type: 'length-measure',
      defaultValue: {
        length: 14
      }
    },
    roundingSmoothness: {
      label: 'Bottom rounding',
      type: 'number',
      defaultValue: 20
    },
  },
  render2D: function (element: Models.Item, layer: Models.Layer, scene: Models.Scene) {
    const w = element.properties.width.length;
    const d = element.properties.depth.length;
    const showTank = element.properties.showTank;
    const seatBackFlat = element.properties.seatBackFlat === true;
    const tankWidthRatio = element.properties.tankWidthRatio;
    const tankDepthValue = element.properties.tankDepth.length;

    const angle = element.rotation + 90;
    const textRotation = Math.sin(angle * Math.PI / 180) < 0 ? 180 : 0;
    const selected = element.selected;
    const fill = selected ? '#99c3fb' : element.properties.color;

    const rx = w / 2;
    const ry = d / 2;
    let shapeNode: React.ReactNode;
    if (!seatBackFlat) {
      shapeNode = <ellipse cx={w / 2} cy={d / 2} rx={rx} ry={ry} style={{ stroke: selected ? '#0096fd' : '#000', strokeWidth: '2px', fill }} />;
    } else {
      const cx = w / 2;
      const cy = d / 2;
      const segs = 28;
      const pts: string[] = [];
      pts.push(`M ${cx - rx},${cy + ry}`);
      pts.push(`L ${cx + rx},${cy + ry}`);
      pts.push(`L ${cx + rx},${cy}`);
      for (let i = 0; i <= segs; i++) {
        const a = 2 * Math.PI - (i / segs) * Math.PI; // 2PI .. PI
        const x = cx + rx * Math.cos(a);
        const y = cy + ry * Math.sin(a);
        pts.push(`L ${x},${y}`);
      }
      pts.push(`L ${cx - rx},${cy + ry}`);
      pts.push('Z');
      const dPath = pts.join(' ');
      shapeNode = <path d={dPath} style={{ stroke: selected ? '#0096fd' : '#000', strokeWidth: '2px', fill }} />;
    }

    let tankNode: React.ReactNode = null;
    if (showTank) {
      const tankW = Math.min(w, Math.max(2, (w * (tankWidthRatio || 100)) / 100));
      const tankD = Math.min(d * 0.5, Math.max(2, tankDepthValue));
      const tankX = (w - tankW) / 2;
      tankNode = (
        <rect
          x={tankX}
          y={d - tankD}
          width={tankW}
          height={tankD}
          style={{ stroke: selected ? '#0096fd' : '#000', strokeWidth: '1px', fill, fillOpacity: 0.85 }}
        />
      );
    }

    return (
      <g transform={`translate(${-w / 2},${-d / 2})`}>
        {shapeNode}
        {tankNode}
        <text x="0" y="0" transform={`translate(${w / 2}, ${d / 2 - 5}) scale(1,-1) rotate(${textRotation})`} style={{ textAnchor: 'middle', fontSize: '11px' }}>{element.type}</text>
      </g>
    );
  },
  async render3D(element: Models.Item, layer: Models.Layer, scene: Models.Scene) {
    const w = element.properties.width.length;
    const d = element.properties.depth.length;
    const seatH = element.properties.seatHeight.length;
    const tankBodyHeight = element.properties.tankHeight.length;
    const color = element.properties.color;
    const altitude = element.properties.altitude.length;
    const showTank = element.properties.showTank !== false;
    const tankBottomOffset = element.properties.tankBottom.length;
    const roundLower = element.properties.roundLower;
    const opening = element.properties.opening.length;
    const seatBackFlat = element.properties.seatBackFlat === true;
    const roundingStartHeight = element.properties.roundingStartHeight.length;
    const tankWidthRatio = element.properties.tankWidthRatio;
    const tankDepth = element.properties.tankDepth.length;
    const seatThicknessValue = element.properties.seatThickness.length;
    const roundingSmoothness = element.properties.roundingSmoothness;
    const ringWidthProp = element.properties.ringWidth.length;

    const maxLOD = new Three.Object3D();
    maxLOD.add(buildToiletGeom(w, d, seatH, tankBodyHeight, tankBottomOffset, color, showTank, false, roundLower, opening, ringWidthProp, seatBackFlat, roundingStartHeight, tankWidthRatio, tankDepth, seatThicknessValue, roundingSmoothness));
    const minLOD = new Three.Object3D();
    minLOD.add(buildToiletGeom(w, d, seatH, tankBodyHeight, tankBottomOffset, color, showTank, true, roundLower, opening, ringWidthProp, seatBackFlat, roundingStartHeight, tankWidthRatio, tankDepth, seatThicknessValue, roundingSmoothness));

    const centerAndPlace = (obj: Three.Object3D) => {
      const box = new Three.Box3().setFromObject(obj);
      if (isFinite(box.min.x) && isFinite(box.max.x)) {
        const cx = (box.max.x + box.min.x) / 2;
        const cz = (box.max.z + box.min.z) / 2;
        const bottom = box.min.y;
        obj.position.x -= cx;
        obj.position.z -= cz;
        obj.position.y += altitude - bottom;
      } else {
        obj.position.y += altitude;
      }
    };
    centerAndPlace(maxLOD);
    centerAndPlace(minLOD);

    const lod = new Three.LOD();
    lod.addLevel(maxLOD, 200);
    lod.addLevel(minLOD, 900);
    lod.updateMatrix();
    lod.matrixAutoUpdate = false;

    if (element.selected) {
      const bbox = new Three.BoxHelper(lod, 0x99c3fb);
      bbox.material.linewidth = 5;
      bbox.renderOrder = 1000;
      bbox.material.depthTest = false;
      lod.add(bbox);
    }

    return lod;
  },

  async updateRender3D(element: Models.Item, layer: Models.Layer, scene: Models.Scene, mesh: Three.Object3D, oldElement: Models.Item, differences: any, selfDestroy: Function, selfBuild: Function) {
    const diffs = Array.isArray(differences) ? differences : [differences];
    if (typeof console !== 'undefined' && console.debug) {
      console.debug('[toilet] updateRender3D diffs:', diffs, 'element id:', element.id);
    }

    if (diffs.length === 1 && diffs[0] === 'selected') {
      let hasBox = false;
      mesh.traverse(child => {
        if (child instanceof Three.BoxHelper) {
          hasBox = true;
          child.visible = element.selected;
        }
      });
      if (!hasBox && element.selected) {
        const bbox = new Three.BoxHelper(mesh, 0x99c3fb);
        bbox.material.depthTest = false;
        bbox.renderOrder = 1000;
        mesh.add(bbox);
      }
      return mesh;
    }

    selfDestroy();
    return selfBuild();
  }
});
