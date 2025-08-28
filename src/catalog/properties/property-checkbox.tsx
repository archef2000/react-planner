import React from 'react';
import { FormLabel } from '../../components/style/export';
import PropertyStyle from './shared-property-style';
import { State } from '../../models';

const checkboxStyle = { margin: 0 };

interface PropertyCheckboxProps {
  value: any;
  onUpdate: (value: any) => void;
  configs: any;
  sourceElement?: any;
  internalState?: any;
  state: State;
}

export default function PropertyCheckbox({ value, onUpdate, configs, sourceElement, internalState, state }: PropertyCheckboxProps) {
  const update = (val) => {
    if (configs.hook) {
      return configs.hook(val, sourceElement, internalState, state).then(_val => {
        return onUpdate(_val);
      });
    }

    return onUpdate(val);
  };

  return (
    <table className="PropertyCheckbox" style={PropertyStyle.tableStyle}>
      <tbody>
        <tr>
          <td style={PropertyStyle.firstTdStyle}><FormLabel>{configs.label}</FormLabel></td>
          <td>
            <input style={checkboxStyle} type="checkbox" checked={value} onChange={e => update(!value)} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
