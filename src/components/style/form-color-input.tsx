import React from 'react';
import FormTextInput from './form-text-input';


const STYLE = {
  padding: 0,
  border: 0,
} as const;
const EREG_NUMBER = /^.*$/;

export default function FormColorInput({ onChange, ...rest }) {
  const onChangeCustom = event => {
    const value = event.target.value;
    if (EREG_NUMBER.test(value)) {
      onChange(event);
    }
  };

  return <FormTextInput type="color" style={STYLE} onChange={onChangeCustom} autoComplete="off" {...rest} />;
}
