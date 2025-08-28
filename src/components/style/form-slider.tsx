import React from 'react';
import { Range } from 'react-range';
import FormTextInput from './form-text-input';

const sliderContainerStyle = { display: 'inline-block', width: '80%', marginRight: '5%' } as const;
const sliderStyle = { display: 'block', width: '100%', height: '30px' } as const;
const textContainerStyle = { display: 'inline-block', width: '15%', float: 'right' } as const;
const textStyle = { height: '34px', textAlign: 'center' } as const;

export default function FormNumberInput({ value, onChange, ...rest }) {
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
                height: "42px",
                width: "42px",
                backgroundColor: "#999",
              }}
            />
          )}
        />
        {/* Test if correct */}
        { /* TODO: style? */}
      </div>

      <div style={textContainerStyle}>
        <FormTextInput value={value} onChange={onChange} style={textStyle} />
      </div>
    </div>
  )
}
