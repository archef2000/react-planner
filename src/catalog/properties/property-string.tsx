import React from 'react';

import { FormLabel, FormTextInput } from '../../components/style/export';
import { State } from '../../models';

import PropertyStyle from './shared-property-style';

interface PropertyStringProps {
  value: string;
  onUpdate: (value: string) => void;
  configs: {
    label: string;
    hook?: (
      value: string,
      sourceElement?: any,
      internalState?: any,
      state?: State
    ) => Promise<string>;
  };
  sourceElement?: any;
  internalState?: any;
  state: State;
}

export default function PropertyString({
  value,
  onUpdate,
  configs,
  sourceElement,
  internalState,
  state
}: PropertyStringProps) {
  const update = (val: string) => {
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
    <table className="PropertyString" style={PropertyStyle.tableStyle}>
      <tbody>
        <tr>
          <td style={PropertyStyle.firstTdStyle}>
            <FormLabel>{configs.label}</FormLabel>
          </td>
          <td>
            <FormTextInput
              value={value}
              onChange={(event) => update(event.target.value)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
