import React from 'react';

interface IfProps {
  condition: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode | React.ReactNode[];
}

export default function If({ condition, style, children }: IfProps) {
  return condition ? (Array.isArray(children) ? <div style={style}>{children}</div> : children) : null;
}
