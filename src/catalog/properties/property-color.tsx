import React from 'react';
import { FormLabel, FormColorInput } from '../../components/style/export';
import PropertyStyle from './shared-property-style';
import { State } from '../../models';

interface PropertyColorProps {
  value: any;
  onUpdate: (value: any) => void;
  configs: any;
  sourceElement?: any;
  internalState?: any;
  state: State;
}

export default function PropertyColor({ value, onUpdate, configs, sourceElement, internalState, state }: PropertyColorProps) {
  const update = (val) => {
    if (configs.hook) {
      return configs.hook(val, sourceElement, internalState, state).then(_val => {
        return onUpdate(_val);
      });
    }

    return onUpdate(val);
  };

  return (
    <table className="PropertyColor" style={PropertyStyle.tableStyle}>
      <tbody>
        <tr>
          <td style={PropertyStyle.firstTdStyle}>
            <FormLabel>{configs.label}</FormLabel>
          </td>
          <td>
            <FormColorInput value={value} onChange={event => update(event.target.value)} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
