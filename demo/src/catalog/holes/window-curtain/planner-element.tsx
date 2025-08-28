import React from 'react';
import * as Three from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import { loadObjWithMaterial } from '../../utils/load-obj';
import { defineCatalogElement } from '@archef2000/react-planner';

let cached3DWindow: Three.Group<Three.Object3DEventMap>;

const STYLE_HOLE_BASE = { stroke: '#000', strokeWidth: '3px', fill: '#000' };
const STYLE_HOLE_SELECTED = { stroke: '#0096fd', strokeWidth: '3px', fill: '#0096fd', cursor: 'move' };
const EPSILON = 3;

export default defineCatalogElement({
  name: 'window-curtain',
  prototype: 'holes',

  info: {
    tag: ['window'],
    title: 'Curtain window',
    description: 'Curtain window',
    image: require('./window-curtain.jpg')
  },

  properties: {
    width: {
      label: 'width',
      type: 'length-measure',
      defaultValue: {
        length: 90
      }
    },
    height: {
      label: 'height',
      type: 'length-measure',
      defaultValue: {
        length: 100
      }
    },
    altitude: {
      label: 'altitudine',
      type: 'length-measure',
      defaultValue: {
        length: 90
      }
    },
    thickness: {
      label: 'spessore',
      type: 'length-measure',
      defaultValue: {
        length: 10
      }
    },
    flip: {
      label: 'flip',
      type: 'checkbox',
      defaultValue: false,
      values: {
        'none': false,
        'yes': true
      }
    },
  },

  render2D: function (element, layer, scene) {
    const holeWidth = element.properties.width.length;
    const holePath = `M${0} ${-EPSILON}  L${holeWidth} ${-EPSILON}  L${holeWidth} ${EPSILON}  L${0} ${EPSILON}  z`;
    const holeStyle = element.selected ? STYLE_HOLE_SELECTED : STYLE_HOLE_BASE;
    const length = element.properties.width.length;
    return (
      <g transform={`translate(${-length / 2}, 0)`}>
        <path key='1' d={holePath} style={holeStyle} />
        <line key='2' x1={holeWidth / 2} y1={-10 - EPSILON} x2={holeWidth / 2} y2={10 + EPSILON} style={holeStyle} />
      </g>
    );
  },

  render3D: async function (element, layer, scene) {
    const width = element.properties.width.length;
    const height = element.properties.height.length;
    const thickness = element.properties.thickness.length;
    const flip = element.properties.flip;

    const onLoadItem = (object: Three.Group<Three.Object3DEventMap>) => {

      const window = new Three.Object3D();

      const boundingBox = new Three.Box3().setFromObject(object);

      const initialWidth = boundingBox.max.x - boundingBox.min.x;
      const initialHeight = boundingBox.max.y - boundingBox.min.y;
      const initialThickness = boundingBox.max.z - boundingBox.min.z;

      if (element.selected) {
        const box = new Three.BoxHelper(object, 0x99c3fb);
        box.material.linewidth = 2;
        box.material.depthTest = false;
        box.renderOrder = 1000;
        object.add(box);
      }

      const width = element.properties.width.length;
      const height = element.properties.height.length;
      const thickness = element.properties.thickness.length;

      object.scale.set(width / initialWidth, height / initialHeight,
        thickness / 2 / initialThickness);

      window.add(object);
      window.add(createTenda());

      if (flip === true)
        window.rotation.y += Math.PI;

      return window;
    };

    if (cached3DWindow) {
      return onLoadItem(cached3DWindow.clone());
    }

    const mtl = require('./window.mtl');
    const obj = require('./window.obj');
    const img = require('./texture.png');
    const resourcePath = img.substr(0, img.lastIndexOf("/")) + "/";

    cached3DWindow = await loadObjWithMaterial(mtl, obj, resourcePath);
    return onLoadItem(cached3DWindow.clone());

    function createTenda() {
      const radialWave = function (u: number, v: number) {
        const r = 10;
        const x = Math.sin(u) * 3 * r;
        const z = Math.sin(v / 2) * 2 * r;
        const y = (Math.sin(u * 2 * Math.PI) + Math.cos(v * 2 * Math.PI)) * .5;

        return new Three.Vector3(x, y, z);
      };

      //color
      const white = new Three.MeshLambertMaterial({ color: 0xeae6ca });

      const Tenda = new Three.Object3D();

      const mesh = createMesh(new ParametricGeometry(radialWave, 20, 20));
      mesh.rotation.x += Math.PI / 2;
      mesh.rotation.y += Math.PI / 2;
      mesh.position.y += 3.1;
      mesh.position.x += .05;
      mesh.scale.set(.125, .125, .125);

      const mesh2 = mesh.clone();
      mesh2.rotation.x += Math.PI;
      mesh2.position.set(1.4, 0, 0.06);

      Tenda.add(mesh);
      Tenda.add(mesh2);

      for (let i = -.7; i > -3.4; i -= .45) {
        const geometry = new Three.TorusGeometry(.08, .016, 32, 32, 2 * Math.PI);
        const torus = new Three.Mesh(geometry, white);

        if (i == -1.15)
          torus.position.set(i, 3.14, .045);
        else if (i == -2.5)
          torus.position.set(i, 3.14, -.01);
        else
          torus.position.set(i, 3.14, .04);
        torus.rotation.y += Math.PI / 2;
        Tenda.add(torus);
      }

      const geometryAsta = new Three.CylinderGeometry(0.02, 0.02, 1.25, 32);
      const asta = new Three.Mesh(geometryAsta, white);
      asta.position.set(-1.1, 3.18, 0.02);
      asta.rotation.z += Math.PI / 2;
      Tenda.add(asta);

      const asta2 = asta.clone();
      asta2.position.set(-2.5, 3.18, 0.02);
      Tenda.add(asta2);

      const geometrySphereUp = new Three.SphereGeometry(0.04, 32, 32);
      const sphere = new Three.Mesh(geometrySphereUp, white);
      sphere.position.set(-.5, 3.18, 0.02);
      sphere.rotation.x += Math.PI / 2;
      sphere.scale.set(0.8, 1, 1);
      Tenda.add(sphere);

      const sphere2 = sphere.clone();
      sphere2.position.x += -1.2;
      Tenda.add(sphere2);

      const sphere3 = sphere.clone();
      sphere3.position.x += -1.4;
      Tenda.add(sphere3);

      const sphere4 = sphere.clone();
      sphere4.position.x += -2.6;
      Tenda.add(sphere4);

      const panelMaterial = new Three.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, side: Three.DoubleSide });
      const panelWidth = 1.2; // base before scaling
      const panelHeight = 3.0;
      const segmentsX = 24;
      const segmentsY = 32;

      const buildPanel = (mirror = false) => {
        const geom = new Three.PlaneGeometry(panelWidth, panelHeight, segmentsX, segmentsY);
        const pos = geom.attributes.position;
        const v = new Three.Vector3();
        for (let i = 0; i < pos.count; i++) {
          v.fromBufferAttribute(pos, i);
          // u 0..1 across width
          const u = (v.x + panelWidth / 2) / panelWidth;
          // folds
          const fold = Math.sin(u * Math.PI * 3) * 0.05 * (0.3 + 0.7 * (-(v.y - panelHeight / 2) / panelHeight + 1));
          v.z = fold * (mirror ? 1 : -1);
          pos.setXYZ(i, v.x, v.y, v.z);
        }
        geom.computeVertexNormals();
        const mesh = new Three.Mesh(geom, panelMaterial.clone());
        mesh.position.y = 3.18 - panelHeight / 2 - 0.05; // hang from rod
        mesh.position.z = 0.03; // slightly in front
        return mesh;
      };

      const leftPanel = buildPanel(false);
      leftPanel.position.x = -1.15;
      const rightPanel = buildPanel(true);
      rightPanel.position.x = -2.45;
      Tenda.add(leftPanel);
      Tenda.add(rightPanel);

      const valueObject = new Three.Box3().setFromObject(Tenda);

      const deltaX = Math.abs(valueObject.max.x - valueObject.min.x);
      const deltaY = Math.abs(valueObject.max.y - valueObject.min.y);
      const deltaZ = Math.abs(valueObject.max.z - valueObject.min.z);

      Tenda.position.x += width / 1.48;
      Tenda.position.y += -height / 2.1;
      Tenda.position.z += thickness / 1024;
      Tenda.scale.set(width / deltaX, height / deltaY, thickness / deltaZ);

      return Tenda;
    }

    function createMesh(geom: ParametricGeometry) {
      geom.applyMatrix4(new Three.Matrix4().makeTranslation(-25, 0, -25));
      const meshMaterial = new Three.MeshLambertMaterial({ color: 0xffffff, opacity: 0.9, transparent: true });
      meshMaterial.side = Three.DoubleSide;

      const plane = new Three.Mesh(geom, meshMaterial);
      return plane;
    }
  }
});
