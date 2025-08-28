import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const WIDTH = 120;
const DEPTH = 50;
const HEIGHT = 90;

const CHAIR_WIDTH = 55;
const CHAIR_DEPTH = 55;
const CHAIR_HEIGHT = 50;

const CHAIR_TRANSLATION = 30;

const TOTAL_DEPTH = DEPTH + CHAIR_DEPTH / 2 - (CHAIR_TRANSLATION - CHAIR_DEPTH / 2);

export default defineCatalogElement({
  name: "school-desk-double",
  prototype: "items",

  info: {
    tag: ['furnishings'],
    title: "School desk double",
    description: "school desk double",
    image: require('./school-desk-double.png')
  },

  properties: {
    altitude: {
      label: "altitude",
      type: "length-measure",
      defaultValue: {
        length: 0
      }
    }
  },

  render2D: function (element, layer, scene) {
    const angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }

    const arrow_style = { stroke: element.selected ? '#0096fd' : undefined, strokeWidth: "2px", fill: "#84e1ce" } as const;

    return (
      <g transform={`translate(${-WIDTH / 2},${-TOTAL_DEPTH / 2})`}>
        <rect key="1" x="0" y="0" width={WIDTH} height={TOTAL_DEPTH}
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: "#84e1ce" }} />
        <line key="2" x1={WIDTH / 2} x2={WIDTH / 2} y1={DEPTH + DEPTH / 2} y2={1.5 * DEPTH + DEPTH / 2}
          style={arrow_style} />
        <line key="3" x1={.25 * WIDTH} x2={WIDTH / 2} y1={1.2 * DEPTH + DEPTH / 2} y2={1.5 * DEPTH + DEPTH / 2}
          style={arrow_style} />
        <line key="4" x1={WIDTH / 2} x2={.75 * WIDTH} y1={1.5 * DEPTH + DEPTH / 2} y2={1.2 * DEPTH + DEPTH / 2}
          style={arrow_style} />
        <text key="5" x="0" y="0"
          transform={`translate(${WIDTH / 2}, ${(TOTAL_DEPTH) / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: "middle", fontSize: "11px" }}>
          {element.type}
        </text>
      </g>
    )
  },

  async render3D(element, layer, scene) {
    const makeChair = (altitude: number) => {
      const WIDTH = CHAIR_WIDTH;
      const DEPTH = CHAIR_DEPTH;
      const HEIGHT = CHAIR_HEIGHT;

      const chair = new Three.Object3D();

      const geometry = new Three.CylinderGeometry(0.02, 0.02, 0.5, 32);
      const material = new Three.MeshLambertMaterial({ color: 0xd9d7d7 });

      const p1 = new Three.Mesh(geometry, material);
      p1.rotation.x += Math.PI / 2;
      p1.position.z += 0.5 / 2;

      const p2 = new Three.Mesh(geometry, material);
      p2.rotation.x += Math.PI / 2;
      p2.position.z += 0.5 / 2;
      p2.position.y += 0.4;

      const p3 = new Three.Mesh(geometry, material);
      p3.rotation.x += Math.PI / 2;
      p3.position.z += 0.5 / 2;
      p3.position.x += 0.4;

      const p4 = new Three.Mesh(geometry, material);
      p4.rotation.x += Math.PI / 2;
      p4.position.z += 0.5 / 2;
      p4.position.y += 0.4;
      p4.position.x += 0.4;

      const p5 = new Three.Mesh(geometry, material);
      p5.rotation.x += Math.PI / 2;
      p5.position.z += 0.5 * 3 / 2;

      const p6 = new Three.Mesh(geometry, material);
      p6.rotation.x += Math.PI / 2;
      p6.position.z += 0.5 * 3 / 2;
      p6.position.x += 0.4;

      //      material = new Three.MeshLambertMaterial({color: 0x9b8c75});
      const texture = new Three.TextureLoader().load(require('./wood.jpg'));
      const materialTexture = new Three.MeshLambertMaterial({ map: texture });

      const roundedRectShape = new Three.Shape();

      const x = 0;
      const y = 0;
      const width = .5;
      const height = .48;
      const radius = 0.05;

      roundedRectShape.moveTo(x, y + radius);
      roundedRectShape.lineTo(x, y + height - radius);
      roundedRectShape.quadraticCurveTo(x, y + height, x + radius, y + height);
      roundedRectShape.lineTo(x + width - radius, y + height);
      roundedRectShape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
      roundedRectShape.lineTo(x + width, y + radius);
      roundedRectShape.quadraticCurveTo(x + width, y, x + width - radius, y);
      roundedRectShape.lineTo(x + radius, y);
      roundedRectShape.quadraticCurveTo(x, y, x, y + radius);

      const extrudeSettings = {
        steps: 2,
        depth: 0.03,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 1
      };

      const geometry50 = new Three.ExtrudeGeometry(roundedRectShape, extrudeSettings);
      const plane = new Three.Mesh(geometry50, materialTexture);

      plane.position.x += -0.05;
      plane.position.y += -0.04;
      plane.position.z += 0.5;

      const roundedRectShape2 = new Three.Shape();

      const x1 = 0;
      const y1 = 0;
      const width1 = .45;
      const height1 = .25;
      const radius1 = 0.05;

      roundedRectShape2.moveTo(x1, y1 + radius1);
      roundedRectShape2.lineTo(x1, y1 + height1 - radius1);
      roundedRectShape2.quadraticCurveTo(x1, y1 + height1, x1 + radius1, y1 + height1);
      roundedRectShape2.lineTo(x1 + width1 - radius1, y1 + height1);
      roundedRectShape2.quadraticCurveTo(x1 + width1, y1 + height1, x1 + width1, y1 + height1 - radius1);
      roundedRectShape2.lineTo(x1 + width1, y1 + radius1);
      roundedRectShape2.quadraticCurveTo(x1 + width1, y1, x1 + width1 - radius1, y1);
      roundedRectShape2.lineTo(x1 + radius1, y1);
      roundedRectShape2.quadraticCurveTo(x1, y1, x1, y1 + radius1);

      const extrudeSettings2 = {
        steps: 2,
        depth: 0.03,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 1
      };

      const geometry22 = new Three.ExtrudeGeometry(roundedRectShape2, extrudeSettings2);
      const back = new Three.Mesh(geometry22, materialTexture);

      //geometry = new Three.BoxGeometry( 0.38, 0.02, 0.15);
      //let back = new Three.Mesh( geometry, material );
      back.rotation.x += Math.PI / 2;
      back.position.z += 0.5 * 12 / 8;
      back.position.y += 0.03;
      back.position.x += -0.025;

      chair.add(back);
      chair.add(plane);
      chair.add(p1);
      chair.add(p2);
      chair.add(p3);
      chair.add(p4);
      chair.add(p5);
      chair.add(p6);

      const aa = new Three.Box3().setFromObject(chair);

      const deltaX = Math.abs(aa.max.x - aa.min.x);
      const deltaY = Math.abs(aa.max.y - aa.min.y);
      const deltaZ = Math.abs(aa.max.z - aa.min.z);

      // if (element.selected) {
      //   let bbox = new Three.BoxHelper(chair, 0x99c3fb);
      //   bbox.material.linewidth = 5;
      //   bbox.renderOrder = 1000;
      //   bbox.material.depthTest = false;
      //   chair.add(bbox);
      // }

      chair.rotation.x += -Math.PI / 2;
      chair.position.y += altitude;
      chair.position.x += -WIDTH / 3.5;
      chair.position.z += DEPTH / 4;
      chair.scale.set(1.5 * WIDTH / deltaZ, DEPTH / 1.5 / deltaX, HEIGHT / deltaY);

      return chair;
    };

    const newAltitude = element.properties.altitude.length;

    const grey = new Three.MeshLambertMaterial({ color: 0xd9d7d7 });

    const texture = new Three.TextureLoader().load(require('./wood.jpg'));
    const materialTexture = new Three.MeshLambertMaterial({ map: texture });

    const newDepth = .5;
    const newWidth = .9;
    const newHeight = 1;
    const raggio = .03;

    const bancoDouble = new Three.Object3D();

    const geometry = new Three.BoxGeometry(newWidth + newWidth / 6, newHeight / 20, newDepth + newDepth / 4);

    const boxMaterials = [
      new Three.MeshBasicMaterial({ map: texture }),
      new Three.MeshBasicMaterial({ map: texture }),
      new Three.MeshBasicMaterial({ color: 0x669966 }), //top
      new Three.MeshBasicMaterial({ map: texture }),
      new Three.MeshBasicMaterial({ map: texture }),
      new Three.MeshBasicMaterial({ map: texture })
    ];

    const plane = new Three.Mesh(geometry, boxMaterials);
    plane.position.y = newHeight;
    bancoDouble.add(plane);

    const geometry_legs = new Three.CylinderGeometry(raggio, raggio, newHeight, 32);

    const geometry2 = new Three.BoxGeometry(newWidth, newHeight / 20, newDepth);
    const plane2 = new Three.Mesh(geometry2, materialTexture);
    plane2.position.y = newHeight / 2 + newHeight / 4;
    bancoDouble.add(plane2);

    const geometry3 = new Three.BoxGeometry(newWidth, newHeight / 10, newDepth / 20);
    const plane3 = new Three.Mesh(geometry3, materialTexture);
    plane3.position.y = newHeight / 2 + newHeight / 4 + newHeight / 16;
    plane3.position.z = newDepth / 3 + newDepth / 5;
    bancoDouble.add(plane3);

    const p1 = new Three.Mesh(geometry_legs, grey);
    p1.position.x = newWidth / 2;
    p1.position.z = newDepth / 2;
    p1.position.y = newHeight / 2;
    p1.scale.set(.5, 1, .75);
    bancoDouble.add(p1);

    const p2 = new Three.Mesh(geometry_legs, grey);
    p2.position.x = newWidth / 2;
    p2.position.z = -newDepth / 2;
    p2.position.y = newHeight / 2;
    p2.scale.set(.5, 1, .75);
    bancoDouble.add(p2);

    const p3 = new Three.Mesh(geometry_legs, grey);
    p3.position.x = -newWidth / 2;
    p3.position.z = newDepth / 2;
    p3.position.y = newHeight / 2;
    p3.scale.set(.5, 1, .75);
    bancoDouble.add(p3);

    const p4 = new Three.Mesh(geometry_legs, grey);
    p4.position.x = -newWidth / 2;
    p4.position.z = -newDepth / 2;
    p4.position.y = newHeight / 2;
    p4.scale.set(.5, 1, .75);
    bancoDouble.add(p4);


    const valueObject = new Three.Box3().setFromObject(bancoDouble);

    const deltaX = Math.abs(valueObject.max.x - valueObject.min.x);
    const deltaY = Math.abs(valueObject.max.y - valueObject.min.y);
    const deltaZ = Math.abs(valueObject.max.z - valueObject.min.z);


    // if (element.selected) {
    //   let bbox = new Three.BoxHelper(bancoDouble, 0x99c3fb);
    //   bbox.material.linewidth = 5;
    //   bbox.renderOrder = 1000;
    //   bbox.material.depthTest = false;
    //   bancoDouble.add(bbox);
    // }

    bancoDouble.rotation.y += Math.PI;
    bancoDouble.position.y += newAltitude;
    bancoDouble.scale.set(WIDTH / deltaX, HEIGHT / deltaY, DEPTH / deltaZ);

    const chair = makeChair(newAltitude);
    chair.position.z += 30;
    chair.position.x += 25;

    const chair2 = makeChair(newAltitude);
    chair2.position.z += 30;
    chair2.position.x -= 25;

    const deskAndChairDouble = new Three.Object3D();
    deskAndChairDouble.add(bancoDouble);
    deskAndChairDouble.add(chair);
    deskAndChairDouble.add(chair2);

    if (element.selected) {
      const bbox = new Three.BoxHelper(deskAndChairDouble, 0x99c3fb);
      bbox.material.linewidth = 5;
      bbox.renderOrder = 1000;
      bbox.material.depthTest = false;
      deskAndChairDouble.add(bbox);
    }

    // deskAndChairDouble.position.z-=DEPTH/4;

    deskAndChairDouble.position.z -= (CHAIR_DEPTH / 2 - (CHAIR_TRANSLATION - CHAIR_DEPTH / 2)) / 2;

    const boundingBoxDeskAndChair = new Three.Box3().setFromObject(deskAndChairDouble);

    const deltaZDeskAndChair = Math.abs(boundingBoxDeskAndChair.max.z - boundingBoxDeskAndChair.min.z);

    deskAndChairDouble.scale.set(1, 1, TOTAL_DEPTH / deltaZDeskAndChair); //Fix Depth problem with the chair

    return deskAndChairDouble;
  }
});
