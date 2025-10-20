import React from 'react';

import PropertyLengthMeasure from '../../../../catalog/properties/property-lenght-measure';
import PropertyString from '../../../../catalog/properties/property-string';
import { Hole, State } from '../../../../models';
import { HoleAttributes } from '../../../../types';

interface HoleAttributesEditorProps {
  element: Hole;
  onUpdate: (name: string, data: any) => void;
  attributeFormData: HoleAttributes;
  state: State;
  [key: string]: any;
}

export default function HoleAttributesEditor({
  element,
  onUpdate,
  attributeFormData,
  state,
  ...rest
}: HoleAttributesEditorProps) {
  const name = element.name;
  const offsetA = attributeFormData.offsetA;
  const offsetB = attributeFormData.offsetB;

  return (
    <div>
      <PropertyString
        value={name}
        onUpdate={(mapped) => onUpdate('name', mapped)}
        configs={{ label: 'Nome' }}
        state={state}
        {...rest}
      />
      <PropertyLengthMeasure
        value={offsetA}
        onUpdate={(mapped) => onUpdate('offsetA', mapped)}
        configs={{ label: 'Offset 1', min: 0, max: Infinity, precision: 2 }}
        state={state}
        {...rest}
      />
      <PropertyLengthMeasure
        value={offsetB}
        onUpdate={(mapped) => onUpdate('offsetB', mapped)}
        configs={{ label: 'Offset 2', min: 0, max: Infinity, precision: 2 }}
        state={state}
        {...rest}
      />
    </div>
  );
}
