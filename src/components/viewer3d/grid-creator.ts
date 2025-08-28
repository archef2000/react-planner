import * as Three from 'three';
import { HELVETIKER } from './libs/helvetiker_regular.typeface';
import gridHorizontalStreak from './grids/grid-horizontal-streak';
import gridVerticalStreak from './grids/grid-vertical-streak';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { Scene } from '../../models';

export default function createGrid(scene: Scene) {

  const gridMesh = new Three.Object3D();
  gridMesh.name = 'grid';
  const fontLoader = new FontLoader();
  const font = fontLoader.parse(HELVETIKER); // For measures
  const { grids, width, height } = scene;

  Object.values(grids).forEach(grid => {
    switch (grid.type) {
      case 'horizontal-streak':
        gridMesh.add(gridHorizontalStreak(width, height, grid, font));
        break;
      case 'vertical-streak':
        gridMesh.add(gridVerticalStreak(width, height, grid, font));
        break;
    }
  });

  gridMesh.position.y = -1;
  return gridMesh;
}
