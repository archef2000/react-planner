import React, { CSSProperties, ReactNode } from 'react';

const BASE_STYLE = {
  display: "block",
  marginBottom: "5px"
} as const;

interface FormLabelProps {
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: any; // Allow other props
}

export default function FormLabel({ children, style, ...rest }: FormLabelProps) {
  return <label style={{ ...BASE_STYLE, ...style }} {...rest}>{children}</label>
}
