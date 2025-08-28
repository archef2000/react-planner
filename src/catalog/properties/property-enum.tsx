import React from 'react';
import { FormLabel, FormSelect } from '../../components/style/export';
import PropertyStyle from './shared-property-style';
import { State } from '../../models';

type PropertyEnumProps = {
  value: any;
  onUpdate: (value: string) => void;
  configs: {
    label: string;
    hook(val: string, sourceElement?: any, internalState?: any, state?: State): Promise<string>;
    values: Record<string, any>;
  };
  sourceElement?: any;
  internalState?: any;
  state: State;
}

export default function PropertyEnum({ value, onUpdate, configs, sourceElement, internalState, state }: PropertyEnumProps) {

  const update = (val: string) => {
    if (configs.hook) {
      return configs.hook(val, sourceElement, internalState, state).then(_val => {
        return onUpdate(_val);
      });
    }
    return onUpdate(val);
  };

  return (
    <table className="PropertyEnum" style={PropertyStyle.tableStyle}>
      <tbody>
        <tr>
          <td style={PropertyStyle.firstTdStyle}><FormLabel>{configs.label}</FormLabel></td>
          <td>
            <FormSelect value={value} onChange={event => update(event.target.value)}>
              {Object.entries(configs.values).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </FormSelect>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
