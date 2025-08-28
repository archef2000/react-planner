import React from 'react';

const STYLE = {
  padding: '0 20px',
  overflowY: 'auto'
} as const;

interface ContentContainerProps {
  children: React.ReactNode;
  width: number;
  height: number;
  style?: React.CSSProperties;
}

export default function ContentContainer({ children, width, height, style = {} }: ContentContainerProps) {
  return <div style={{ width, height, ...STYLE, ...style }} onWheel={event => event.stopPropagation()}>{children}</div>
}
