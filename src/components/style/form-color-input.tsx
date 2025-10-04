import React from 'react';

import FormTextInput from './form-text-input';

const STYLE = {
  padding: 0,
  border: 0
} as const;
const EREG_NUMBER = /^.*$/;

export type FormColorInputProps = React.ComponentPropsWithoutRef<'input'> & {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FormColorInput({
  onChange,
  ...rest
}: FormColorInputProps) {
  const onChangeCustom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (EREG_NUMBER.test(value)) {
      onChange(event);
    }
  };

  return (
    <FormTextInput
      type="color"
      style={STYLE}
      onChange={onChangeCustom}
      autoComplete="off"
      {...rest}
    />
  );
}
