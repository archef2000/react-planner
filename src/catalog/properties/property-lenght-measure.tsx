import React, { useContext } from 'react';
import { UNITS_LENGTH, UNIT_CENTIMETER } from './../../constants';
import convert from 'convert-units';
import { FormLabel, FormNumberInput, FormSelect } from '../../components/style/export';
import { toFixedFloat } from '../../utils/math';
import PropertyStyle from './shared-property-style';
import { State } from '../../models';
import { LengthMeasureValue } from '../../types';

const internalTableStyle = { borderCollapse: 'collapse' } as const;
const secondTdStyle = { padding: 0 } as const;
const unitContainerStyle = { width: '5em' } as const;

interface PropertyLengthMeasureProps {
  value: LengthMeasureValue;
  onUpdate: (value: LengthMeasureValue) => void;
  onValid?: (isValid: boolean) => void,
  configs: any,
  sourceElement?: any,
  internalState?: any,
  state: State
}

export default function PropertyLengthMeasure({ value, onUpdate, onValid, configs, sourceElement, internalState, state }: PropertyLengthMeasureProps) {
  const length = value.length || 0;
  const _length = value._length || length;
  const _unit = value._unit || UNIT_CENTIMETER;
  const { hook, label, ...configRest } = configs;

  const update = (lengthInput: number, unitInput: string) => {
    const newLength = toFixedFloat(lengthInput);
    const merged = {
      ...value,
      length: unitInput !== UNIT_CENTIMETER ? convert(newLength).from(unitInput).to(UNIT_CENTIMETER) : newLength,
      _length: lengthInput,
      _unit: unitInput
    };

    if (hook) {
      return hook(merged, sourceElement, internalState, state).then(val => {
        return onUpdate(val);
      });
    }

    return onUpdate(merged);
  };

  return (
    <table className="PropertyLengthMeasure" style={PropertyStyle.tableStyle}>
      <tbody>
        <tr>
          <td style={PropertyStyle.firstTdStyle}><FormLabel>{label}</FormLabel></td>
          <td style={secondTdStyle}>
            <table style={internalTableStyle}>
              <tbody>
                <tr>
                  <td>
                    <FormNumberInput
                      value={_length}
                      onChange={event => update(event.target.value, _unit)}
                      onValid={onValid}
                      {...configRest}
                    />
                  </td>
                  <td style={unitContainerStyle}>
                    <FormSelect value={_unit} onChange={event => update(_length, event.target.value)}>
                      {
                        UNITS_LENGTH.map(el => <option key={el} value={el}>{el}</option>)
                      }
                    </FormSelect>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );

}
