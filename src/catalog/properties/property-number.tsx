import React from 'react';

import { FormLabel, FormNumberInput } from '../../components/style/export';
import { State } from '../../models';

import PropertyStyle from './shared-property-style';

interface PropertyNumberProps {
  value: any;
  onUpdate: (value: number) => void;
  onValid?: (event: Event) => void;
  configs: {
    label: string;
    hook?: (
      value: number,
      sourceElement?: any,
      internalState?: any,
      state?: State
    ) => Promise<number>;
    min?: number;
    max?: number;
  };
  sourceElement?: any;
  internalState?: any;
  state: State;
}

export default function PropertyNumber({
  value,
  onUpdate,
  onValid,
  configs,
  sourceElement,
  internalState,
  state
}: PropertyNumberProps) {
  const update = (val: number) => {
    let number = parseFloat(val as any);

    if (isNaN(number)) {
      number = 0;
    }

    if (configs.hook) {
      return configs
        .hook(number, sourceElement, internalState, state)
        .then((_val) => {
          return onUpdate(_val);
        });
    }

    return onUpdate(number);
  };

  return (
    <table className="PropertyNumber" style={PropertyStyle.tableStyle}>
      <tbody>
        <tr>
          <td style={PropertyStyle.firstTdStyle}>
            <FormLabel>{configs.label}</FormLabel>
          </td>
          <td>
            <FormNumberInput
              value={value}
              onChange={(event) => update(event.target.value)}
              onValid={onValid}
              min={configs.min}
              max={configs.max}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
