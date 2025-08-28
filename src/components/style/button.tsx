import React, { Component, CSSProperties, ReactNode, useState } from 'react';
import * as SharedStyle from '../../shared-style';

const BASE_STYLE = {
  display: "inline-block",
  fontWeight: "400",
  lineHeight: "1.25",
  textAlign: "center",
  whiteSpace: "nowrap",
  verticalAlign: "middle",
  cursor: "pointer",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  MsUserSelect: "none",
  userSelect: "none",
  padding: "5px 14px",
  fontSize: "14px",
  color: SharedStyle.COLORS.black,
  fonWeight: "400px",
  transition: "background-color 175ms ease, border 175ms ease",
  outline: "none",
  borderRadius: "2px",
  borderWidth: "1px",
  borderType: "solid",
  width: '100%'
} as const;

const BASE_STYLE_SIZE = {
  small: {
    fontSize: "12px",
    padding: "3px 8px",
  },
  normal: {},
  large: {
    padding: "8px 20px",
  },
} as const;

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  style?: CSSProperties;
  styleHover?: CSSProperties;
  size?: 'large' | 'normal' | 'small';
  children?: ReactNode;
  [key: string]: any;
}

export default function Button(props: ButtonProps) {
  const [state, setState] = useState({ hover: false });

  const { hover } = state;
  const {
    type = "button",
    style: customStyle = {
      backgroundColor: "#e6e6e6",
      borderColor: "#adadad",
    }, styleHover: customStyleHover = {
      backgroundColor: "#d4d4d4",
      borderColor: "#8c8c8c"
    },
    size = "normal",
    children,
    ...rest
  } = props;
  const styleMerged = Object.assign({}, BASE_STYLE, BASE_STYLE_SIZE[size], hover ? customStyleHover : customStyle);

  return <button
    type={type}
    onMouseEnter={e => setState({ hover: true })}
    onMouseLeave={e => setState({ hover: false })}
    style={styleMerged}
    {...rest}>{children}</button>
}

