import React from 'react';

import convert, { Unit } from 'convert-units';

import {
  FormLabel,
  FormNumberInput,
  FormSelect
} from '../../components/style/export';
import { State } from '../../models';
import { LengthMeasureValue } from '../../types';
import { toFixedFloat } from '../../utils/math';

import { UNIT_CENTIMETER, UNITS_LENGTH } from './../../constants';
import PropertyStyle from './shared-property-style';

const internalTableStyle = { borderCollapse: 'collapse' } as const;
const secondTdStyle = { padding: 0 } as const;
const unitContainerStyle = { width: '5em' } as const;

type PropertyLengthMeasureProps<T extends LengthMeasureValue> = {
  value: T;
  onUpdate: (value: T) => void;
  onValid?: (isValid: Event) => void;
  configs: {
    label: string;
    hook?: (
      value: T,
      sourceElement?: any,
      internalState?: any,
      state?: State
    ) => Promise<T>;
    min?: number;
    max?: number;
    precision?: number;
  };
  sourceElement?: any;
  internalState?: any;
  state: State;
};

export default function PropertyLengthMeasure<T extends LengthMeasureValue>({
  value,
  onUpdate,
  onValid,
  configs,
  sourceElement,
  internalState,
  state
}: PropertyLengthMeasureProps<T>) {
  const length = value.length || 0;
  const _length = value._length || length;
  const _unit = value._unit || UNIT_CENTIMETER;
  const { hook, label, ...configRest } = configs;

  const update = (lengthInput: number, unitInput: Unit) => {
    const newLength = toFixedFloat(lengthInput);
    const merged = {
      ...value,
      length:
        unitInput !== UNIT_CENTIMETER
          ? convert(newLength).from(unitInput).to(UNIT_CENTIMETER)
          : newLength,
      _length: lengthInput,
      _unit: unitInput
    };

    if (hook) {
      return hook(merged, sourceElement, internalState, state).then((val) => {
        return onUpdate(val);
      });
    }

    return onUpdate(merged);
  };

  return (
    <table className="PropertyLengthMeasure" style={PropertyStyle.tableStyle}>
      <tbody>
        <tr>
          <td style={PropertyStyle.firstTdStyle}>
            <FormLabel>{label}</FormLabel>
          </td>
          <td style={secondTdStyle}>
            <table style={internalTableStyle}>
              <tbody>
                <tr>
                  <td>
                    <FormNumberInput
                      value={_length}
                      onChange={(event) => update(event.target.value, _unit)}
                      onValid={onValid}
                      {...configRest}
                    />
                  </td>
                  <td style={unitContainerStyle}>
                    <FormSelect
                      value={_unit}
                      onChange={(event) =>
                        update(_length, event.target.value as Unit)
                      }
                    >
                      {UNITS_LENGTH.map((el) => (
                        <option key={el} value={el}>
                          {el}
                        </option>
                      ))}
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
