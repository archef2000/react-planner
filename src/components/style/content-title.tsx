import React from 'react';
import * as SharedStyle from '../../shared-style';

const STYLE = {
  color: SharedStyle.PRIMARY_COLOR.alt,
  fontWeight: 300,
} as const;

interface ContentTitleProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}

export default function ContentTitle({ children, style = {}, ...rest }: ContentTitleProps) {
  return <h1 style={{ ...STYLE, ...style }} {...rest}>{children}</h1>
}
