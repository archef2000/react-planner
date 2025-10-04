import React, { useState } from 'react';

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
  height: '30px'
} as const;

export default function FormTextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  const [focus, setFocus] = useState(false);
  const { style, ...rest } = props;

  const textInputStyle = { ...STYLE_INPUT, ...style };
  if (focus)
    textInputStyle.border = `1px solid ${SharedStyle.SECONDARY_COLOR.main}`;

  return (
    <input
      onFocus={(e) => setFocus(true)}
      onBlur={(e) => setFocus(false)}
      style={textInputStyle}
      type="text"
      {...rest}
    />
  );
}
