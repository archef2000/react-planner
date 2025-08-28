import React, { useContext } from 'react';
import { FormNumberInput, FormTextInput } from '../../../style/export';
import { PropertyLengthMeasure } from '../../../../catalog/properties/export';
import ReactPlannerContext from '../../../../react-planner-context';
import { State } from '../../../../models';

const tableStyle = { width: '100%' } as const;
const firstTdStyle = { width: '6em' } as const;
const inputStyle = { textAlign: 'left' } as const;

interface LineAttributesEditorProps {
  element: {
    name: string;
    [key: string]: any;
  };
  onUpdate: (key: string, value: any) => void;
  attributeFormData: { [key: string]: any };
  state: State;
  [key: string]: any;
}

export default function LineAttributesEditor({ element, onUpdate, attributeFormData, state, ...rest }: LineAttributesEditorProps) {
  const { translator } = useContext(ReactPlannerContext);

  const name = attributeFormData.name || element.name;
  const vertexOne = attributeFormData.vertexOne || null;
  const vertexTwo = attributeFormData.vertexTwo || null;
  const lineLength = attributeFormData.lineLength || null;

  return (
    <div>
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
            <td style={firstTdStyle}>X1</td>
            <td>
              <FormNumberInput
                value={vertexOne.x}
                onChange={event => onUpdate('vertexOne', { 'x': event.target.value })}
                style={inputStyle}
                precision={2}
                {...rest}
              />
            </td>
          </tr>
          <tr>
            <td style={firstTdStyle}>Y1</td>
            <td>
              <FormNumberInput
                value={vertexOne.y}
                onChange={event => onUpdate('vertexOne', { 'y': event.target.value })}
                style={inputStyle}
                precision={2}
                {...rest}
              />
            </td>
          </tr>
          <tr>
            <td style={firstTdStyle}>X2</td>
            <td>
              <FormNumberInput
                value={vertexTwo.x}
                onChange={event => onUpdate('vertexTwo', { 'x': event.target.value })}
                style={inputStyle}
                precision={2}
                {...rest}
              />
            </td>
          </tr>
          <tr>
            <td style={firstTdStyle}>Y2</td>
            <td>
              <FormNumberInput
                value={vertexTwo.y}
                onChange={event => onUpdate('vertexTwo', { 'y': event.target.value })}
                style={inputStyle}
                precision={2}
                {...rest}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <PropertyLengthMeasure
        value={lineLength}
        onUpdate={mapped => onUpdate('lineLength', mapped)}
        configs={{ label: translator.t('Length'), min: 0, max: Infinity, precision: 2 }}
        state={state}
      />
    </div>
  );
}
