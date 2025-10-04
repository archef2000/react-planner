import React from 'react';

import { FormLabel } from '../../components/style/export';
import { State } from '../../models';

import PropertyStyle from './shared-property-style';

const checkboxStyle = { margin: 0 };

interface PropertyCheckboxProps {
  value: boolean;
  onUpdate: (value: boolean) => void;
  configs: {
    hook?: (
      value: boolean,
      sourceElement: any,
      internalState: any,
      state: State
    ) => Promise<boolean>;
    label: string;
  };
  sourceElement?: any;
  internalState?: any;
  state: State;
}

export default function PropertyCheckbox({
  value,
  onUpdate,
  configs,
  sourceElement,
  internalState,
  state
}: PropertyCheckboxProps) {
  const update = (val: boolean) => {
    if (configs.hook) {
      return configs
        .hook(val, sourceElement, internalState, state)
        .then((_val) => {
          return onUpdate(_val);
        });
    }

    return onUpdate(val);
  };

  return (
    <table className="PropertyCheckbox" style={PropertyStyle.tableStyle}>
      <tbody>
        <tr>
          <td style={PropertyStyle.firstTdStyle}>
            <FormLabel>{configs.label}</FormLabel>
          </td>
          <td>
            <input
              style={checkboxStyle}
              type="checkbox"
              checked={value}
              onChange={(e) => update(!value)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
