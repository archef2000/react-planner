import React from 'react';
import GridHorizontalStreak from './grid-horizontal-streak';
import GridVerticalStreak from './grid-vertical-streak';
import { SceneJson } from '../../../models';

interface GridsProps {
  scene: SceneJson;
}

export default function Grids({ scene }: GridsProps) {
  const { width, height, grids } = scene;

  const renderedGrids = Object.entries(grids).map(([gridID, grid]) => {
    switch (grid.type) {
      case 'horizontal-streak':
        return (<GridHorizontalStreak key={gridID} width={width} height={height} grid={grid} />);

      case 'vertical-streak':
        return (<GridVerticalStreak key={gridID} width={width} height={height} grid={grid} />);

      default:
        console.warn(`grid ${grid.type} not allowed`);
    }
  });

  return (<g>{renderedGrids}</g>);
}
