import React from 'react';
import { FormLabel, Button } from '../../components/style/export';
import PropertyStyle from './shared-property-style';
import { State } from '../../models';

interface PropertyStringProps {
  value: boolean;
  onUpdate: (value: boolean) => void;
  configs: {
    hook?: (val: boolean, sourceElement, internalState, state: State) => Promise<boolean>;
    label: string;
    actionName?: string;
  };
  sourceElement?: any;
  internalState?: any;
  state: State;
}

export default function PropertyToggle({ value, onUpdate, configs, sourceElement, internalState, state }: PropertyStringProps) {
  const update = (val: boolean) => {
    if (configs.hook) {
      return configs.hook(val, sourceElement, internalState, state).then(_val => {
        return onUpdate(_val);
      });
    }

    return onUpdate(val);
  };

  const buttonStyle = {
    height: "30px",
    backgroundColor: value ? "#99C3FB" : "#8E9BA2"
  } as const;

  return (
    <table className="PropertyToggle" style={PropertyStyle.tableStyle}>
      <tbody>
        <tr>
          <td style={PropertyStyle.firstTdStyle}><FormLabel>{configs.label}</FormLabel></td>
          <td>
            <Button onClick={() => update(!value)} style={buttonStyle} styleHover={buttonStyle} size="small">{configs.actionName}</Button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
