import React, { Component, CSSProperties, useState } from 'react';
import * as SharedStyle from '../../shared-style';

const STYLE_INPUT = {
  display: 'block',
  width: '100%',
  padding: '0 2px',
  fontSize: '13px',
  lineHeight: '1.25',
  color: SharedStyle.PRIMARY_COLOR.input,
  backgroundColor: SharedStyle.COLORS.white,
  backgroundImage: 'none',
  border: '1px solid rgba(0,0,0,.15)',
  outline: 'none',
  height: '30px',
} as const;

interface FormTextInputProps {
  style?: CSSProperties;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

export default function FormTextInput(props: FormTextInputProps) {
  const [state, setState] = useState({ focus: false });
  const { style, ...rest } = props;

  const textInputStyle = { ...STYLE_INPUT, ...style };
  if (state.focus) textInputStyle.border = `1px solid ${SharedStyle.SECONDARY_COLOR.main}`;

  return <input
    onFocus={e => setState({ focus: true })}
    onBlur={e => setState({ focus: false })}
    style={textInputStyle}
    type="text"
    {...rest}
  />
}
