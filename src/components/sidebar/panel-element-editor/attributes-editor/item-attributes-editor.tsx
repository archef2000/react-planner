import React, { Component, useContext } from 'react';
import FormNumberInput from '../../../style/form-number-input';
import FormTextInput from '../../../style/form-text-input';
import ReactPlannerContext from '../../../../react-planner-context';
import { State } from '../../../../models';

const tableStyle = { width: '100%' } as const;
const firstTdStyle = { width: '6em' } as const;
const inputStyle = { textAlign: 'left' } as const;

interface ItemAttributesEditorProps {
  element: any;
  onUpdate: (name: string, value: any) => void;
  attributeFormData: { [key: string]: any };
  state: State;
  [key: string]: any;
}

export default function ItemAttributesEditor({ element, onUpdate, attributeFormData, state, ...rest }: ItemAttributesEditorProps) {
  const { translator } = useContext(ReactPlannerContext);
  const name = attributeFormData.name || element.name;
  const renderedX = attributeFormData.x || element.x;
  const renderedY = attributeFormData.y || element.y;
  const renderedR = attributeFormData.rotation || element.rotation;

  return (
    <table style={tableStyle}>
      <tbody>
        <tr>
          <td style={firstTdStyle}>{translator.t('Name')}</td>
          <td>
            <FormTextInput
              value={name}
              onChange={event => onUpdate('name', event.target.value)}
              style={inputStyle}
            />
          </td>
        </tr>
        <tr>
          <td style={firstTdStyle}>X</td>
          <td>
            <FormNumberInput
              value={renderedX}
              onChange={event => onUpdate('x', event.target.value)}
              style={inputStyle}
              precision={2}
              {...rest}
            />
          </td>
        </tr>
        <tr>
          <td style={firstTdStyle}>Y</td>
          <td>
            <FormNumberInput
              value={renderedY}
              onChange={event => onUpdate('y', event.target.value)}
              style={inputStyle}
              precision={2}
              {...rest}
            />
          </td>
        </tr>
        <tr>
          <td style={firstTdStyle}>{translator.t('Rotation')}</td>
          <td>
            <FormNumberInput
              value={renderedR}
              onChange={event => onUpdate('rotation', event.target.value)}
              style={inputStyle}
              precision={2}
              {...rest}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
