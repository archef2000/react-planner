import * as Three from 'three';
import { COLORS } from '../../../shared-style';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Grid } from '../../../models';
import { Font } from 'three/examples/jsm/loaders/FontLoader';

export default function (width: number, height: number, grid: Grid, font: Font) {
  const step = grid.properties.step;
  const colors = grid.properties.color ? [grid.properties.color] : grid.properties.colors;

  const streak = new Three.Object3D();
  streak.name = 'streak';

  let counter = 0;

  for (let i = 0; i <= width; i += step) {

    const geometry = new Three.BufferGeometry();
    const positions = new Float32Array([
      i, 0, 0,
      i, 0, -height
    ]);
    geometry.setAttribute('position', new Three.BufferAttribute(positions, 3));
    const color = colors[counter % colors.length];
    const material = new Three.LineBasicMaterial({ color });

    if (counter % 5 == 0) {
      const shape = new TextGeometry(('' + (counter * step)), {
        size: 16,
        font: font,
        depth: 0.1,
      });

      const wrapper = new Three.MeshBasicMaterial({ color: COLORS.black });
      const words = new Three.Mesh(shape, wrapper);

      words.rotation.x -= Math.PI / 2;
      words.position.set(i - 20, 0, 50);
      streak.add(words);
    }

    streak.add(new Three.LineSegments(geometry, material));
    counter++;
  }
  return streak;
}
