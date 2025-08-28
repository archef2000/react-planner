import React, { CSSProperties, ReactNode } from 'react';

const BASE_STYLE = {
  marginBottom: "16px"
} as const;

interface FormBlockProps {
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: any; // Allow other props
}

export default function FormBlock({ children, style, ...rest }: FormBlockProps) {
  return <div style={{ ...BASE_STYLE, ...style }} {...rest}>{children}</div>
}
