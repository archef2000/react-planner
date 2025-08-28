import React from 'react'
import { FormLabel, FormNumberInput } from '../../components/style/export';
import PropertyStyle from './shared-property-style';
import { State } from '../../models';

interface PropertyNumberProps {
  value: any;
  onUpdate: (value: any) => void;
  onValid?: (event: Event) => void;
  configs: any;
  sourceElement?: any;
  internalState?: any;
  state: State;
}

export default function PropertyNumber({ value, onUpdate, onValid, configs, sourceElement, internalState, state }: PropertyNumberProps) {
  const update = (val) => {
    let number = parseFloat(val);

    if (isNaN(number)) {
      number = 0;
    }

    if (configs.hook) {
      return configs.hook(number, sourceElement, internalState, state).then(_val => {
        return onUpdate(_val);
      });
    }

    return onUpdate(number);
  };

  return (
    <table className="PropertyNumber" style={PropertyStyle.tableStyle}>
      <tbody>
        <tr>
          <td style={PropertyStyle.firstTdStyle}><FormLabel>{configs.label}</FormLabel></td>
          <td>
            <FormNumberInput
              value={value}
              onChange={event => update(event.target.value)}
              onValid={onValid}
              min={configs.min}
              max={configs.max} />
          </td>
        </tr>
      </tbody>
    </table>
  );

}
