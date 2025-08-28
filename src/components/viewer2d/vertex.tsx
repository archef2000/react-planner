import React from 'react';
import * as SharedStyle from '../../shared-style';

const STYLE = { fill: "#0096fd", stroke: SharedStyle.COLORS.white, cursor: "move" };

interface VertexProps {
  vertex: any, // object
  layer: any, // object
}

export default function Vertex({ vertex, layer }: VertexProps) {

  const { x, y } = vertex;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      data-element-root
      data-prototype={vertex.prototype}
      data-id={vertex.id}
      data-selected={vertex.selected}
      data-layer={layer.id}
    >
      <circle cx="0" cy="0" r="7" style={STYLE} />
    </g>
  );
}
