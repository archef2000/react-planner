import React from 'react';
import { FormLabel } from '../../components/style/export';
import PropertyStyle from './shared-property-style';
import { State } from '../../models';

interface PropertyReadOnlyProps {
  value: any;
  onUpdate: (value: any) => void;
  configs: any;
  sourceElement?: any;
  internalState?: any;
  state: State;
}

export default function PropertyReadOnly({ value, onUpdate, configs, sourceElement, internalState, state }: PropertyReadOnlyProps) {
  return (
    <table className="PropertyReadOnly" style={PropertyStyle.tableStyle}>
      <tbody>
        <tr>
          <td style={PropertyStyle.firstTdStyle}><FormLabel>{configs.label}</FormLabel></td>
          <td>
            <div>{value}</div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
