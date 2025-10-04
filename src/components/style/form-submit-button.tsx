import React from 'react';

import * as SharedStyle from '../../shared-style';

import Button, { ButtonProps } from './button';

const STYLE = {
  borderColor: '#415375',
  backgroundColor: '#415375',
  color: SharedStyle.COLORS.white
};

const STYLE_HOVER = {
  borderColor: '#1f3149',
  backgroundColor: '#1f3149',
  color: SharedStyle.COLORS.white
};

export default function FormSubmitButton({ children, ...rest }: ButtonProps) {
  return (
    <Button type="submit" style={STYLE} styleHover={STYLE_HOVER} {...rest}>
      {children}
    </Button>
  );
}
