import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const WIDTH = 150;
const DEPTH = 50;
const HEIGHT = 50;
const RADIUS = 10;

const grey = new Three.MeshLambertMaterial({ color: 0xC0C0C0 });
const black = new Three.MeshLambertMaterial({ color: 0x00000 });
const textureLoader = new Three.TextureLoader();
const woodTexture = textureLoader.load(require('./wood.jpg'));

const objectMaxLOD = makeObjectMaxLOD();
const objectMinLOD = makeObjectMinLOD();

function makeObjectMaxLOD() {
  const bench = new Three.Mesh();

  // axis
  const axis1 = new Three.Mesh(new Three.BoxGeometry(10, 0.5, 0.5), grey);
  axis1.position.set(0, 0, 0);
  bench.add(axis1);

  const axi2 = new Three.Mesh(new Three.BoxGeometry(10, 0.5, 0.5), grey);
  axi2.position.set(0, 0, 3);
  bench.add(axi2);

  //beams
  for (let lx = -5; lx <= 5; lx += 5) {
    const beam = new Three.Mesh(new Three.BoxGeometry(0.5, 0.5, 3.5), grey);
    beam.position.set(lx, 0, 1.5);
    bench.add(beam);
  }

  //legs
  for (let gx = -5; gx <= 5; gx += 5) {
    for (let gz = 0; gz <= 3; gz += 3) {
      const leg = new Three.Mesh(new Three.BoxGeometry(3, 0.5, 0.5), grey);
      leg.rotation.z = 0.5 * Math.PI;
      leg.position.set(gx, -1.5, gz);
      bench.add(leg);

      // foot
      const foot = new Three.Mesh(new Three.BoxGeometry(0.5, 0.25, 0.5), black);
      foot.rotation.z = 0.5 * Math.PI;
      foot.position.x = -1.625;
      leg.add(foot);
    }
  }

  // wood axis
  for (let z = 0; z <= 3; z += 0.75) {
    const woodAxis = new Three.Mesh(new Three.BoxGeometry(12, 0.25, 0.5), new Three.MeshPhongMaterial({ map: woodTexture }));
    woodAxis.position.set(0, 0.5, z);
    bench.add(woodAxis);
  }

  //nuts
  for (let z = 0; z <= 3; z += 0.75) {
    for (let dy = -5; dy <= 5; dy += 5) {
      const nut = new Three.Mesh(new Three.CylinderGeometry(0.1, 0.1, 0.8, 6), black);
      nut.position.set(dy, 0.3, z);
      bench.add(nut);
    }
  }

  return bench;
}

function makeObjectMinLOD() {
  const bench = new Three.Mesh();
  // axis
  const axis1 = new Three.Mesh(new Three.BoxGeometry(10, 0.5, 0.5), grey);
  axis1.position.set(0, 0, 0);
  bench.add(axis1);

  const axi2 = new Three.Mesh(new Three.BoxGeometry(10, 0.5, 0.5), grey);
  axi2.position.set(0, 0, 3);
  bench.add(axi2);

  //beams
  for (let lx = -5; lx <= 5; lx += 5) {
    const beam = new Three.Mesh(new Three.BoxGeometry(0.5, 0.5, 3.5), grey);
    beam.position.set(lx, 0, 1.5);
    bench.add(beam);
  }

  //legs
  for (let gx = -5; gx <= 5; gx += 5) {
    for (let gz = 0; gz <= 3; gz += 3) {
      const leg = new Three.Mesh(new Three.BoxGeometry(3, 0.5, 0.5), grey);
      leg.rotation.z = 0.5 * Math.PI;
      leg.position.set(gx, -1.5, gz);
      bench.add(leg);

    }
  }

  // wood axis
  for (let z = 0; z <= 3; z += 0.75) {
    const woodAxis = new Three.Mesh(new Three.BoxGeometry(12, 0.25, 0.5), new Three.MeshPhongMaterial({ map: woodTexture }));
    woodAxis.position.set(0, 0.5, z);
    bench.add(woodAxis);
  }

  return bench;
}

export default defineCatalogElement({
  name: 'bench',
  prototype: 'items',

  info: {
    tag: ['furnishings', 'wood', 'metal'],
    title: 'bench',
    description: 'bench',
    image: require('./bench.png')
  },

  properties: {
    altitude: {
      label: 'altitude',
      type: 'length-measure',
      defaultValue: {
        length: 0
      }
    }
  },

  render2D: function (element, layer, scene) {
    const angle = element.rotation + 90;
    const textRotation = Math.sin(angle * Math.PI / 180) < 0 ? 180 : 0;
    const rect_style = { stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: '#84e1ce' };

    return (
      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`}>
        <rect key='1' x='0' y='0' width={WIDTH} height={DEPTH} style={rect_style} />
        <text key='2' x='0' y='0' transform={`translate(${WIDTH / 2}, ${DEPTH / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: 'middle', fontSize: '11px' }}>
          {element.type}
        </text>
      </g>
    )
  },


  async render3D(element, layer, scene) {
    const newAltitude = element.properties.altitude.length;

    /************ lod max *****************/
    const benchMaxLOD = new Three.Object3D();
    benchMaxLOD.add(objectMaxLOD.clone());

    const value = new Three.Box3().setFromObject(benchMaxLOD);

    const deltaX = Math.abs(value.max.x - value.min.x);
    const deltaY = Math.abs(value.max.y - value.min.y);
    const deltaZ = Math.abs(value.max.z - value.min.z);

    benchMaxLOD.position.y += HEIGHT + newAltitude;
    benchMaxLOD.scale.set(WIDTH / deltaX, HEIGHT / deltaY, DEPTH / deltaZ);


    /************ lod min *****************/

    const benchMinLOD = new Three.Object3D();
    benchMinLOD.add(objectMinLOD.clone());
    benchMinLOD.position.y += HEIGHT + newAltitude;
    benchMinLOD.scale.set(WIDTH / deltaX, HEIGHT / deltaY, DEPTH / deltaZ);

    /**** all level of detail ***/

    const lod = new Three.LOD();

    lod.addLevel(benchMaxLOD, 200);
    lod.addLevel(benchMinLOD, 900);
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
  }
});
