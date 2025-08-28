import React from 'react';
import { Grid } from '../../../models';

interface GridVerticalStreakProps {
  width: number;
  height: number;
  grid: Grid;
}

export default function GridVerticalStreak({ width, height, grid }: GridVerticalStreakProps) {
  const step = grid.properties.step;
  let colors: string[];

  if (grid.properties.color) {
    colors = [grid.properties.color];
  } else {
    colors = grid.properties.colors;
  }

  const rendered = [];
  let i = 0;
  for (let x = 0; x <= width; x += step) {
    const color = colors[i % colors.length];
    i++;
    rendered.push(<line key={x} x1={x} y1="0" x2={x} y2={height} strokeWidth="1" stroke={color} />);
  }

  return (<g>{rendered}</g>);
}
