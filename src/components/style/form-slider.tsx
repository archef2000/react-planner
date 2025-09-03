import React from 'react';
import { Range } from 'react-range';
import FormTextInput from './form-text-input';

const sliderContainerStyle = { display: 'inline-block', width: '80%', marginRight: '5%' } as const;
const sliderStyle = { display: 'block', width: '100%', height: '30px' } as const;
const textContainerStyle = { display: 'inline-block', width: '15%', float: 'right' } as const;
const textStyle = { height: '34px', textAlign: 'center' } as const;

type FormSliderProps = {
  value: number;
  onChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
};

export default function FormSlider({ value, onChange, ...rest }: FormSliderProps) {
  return (
    <div>
      <div style={sliderContainerStyle}>
        <Range
          onChange={onChange}
          values={[value]} {...rest}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "6px",
                width: "100%",
                backgroundColor: "#ccc",
                transform: "translateY(10px)"
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              key={props.key}
              style={{
                ...props.style,
                height: "15px",
                width: "15px",
                backgroundColor: "#999",
                outline: "none"
              }}
            />
          )}
        />
        {/* Test if correct */}
        { /* TODO: style? */}
      </div>

      <div style={textContainerStyle}>
        <FormTextInput value={value} onChange={e => onChange([parseInt(e.target.value)])} style={textStyle} />
      </div>
    </div>
  )
}
