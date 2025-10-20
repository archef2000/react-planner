import React from 'react';

import PropertyString from '../../../../catalog/properties/property-string';
import { Area, State } from '../../../../models';

interface AreaAttributesEditorProps {
  element: Area;
  onUpdate: (name: string, data: string) => void;
  attributeFormData: Area;
  state: State;
  [key: string]: any;
}

export default function AreaAttributesEditor({
  element,
  onUpdate,
  attributeFormData,
  state,
  ...rest
}: AreaAttributesEditorProps) {
  const name = attributeFormData.name ?? element.name;

  return (
    <div>
      <PropertyString
        value={name}
        onUpdate={(mapped) => onUpdate('name', mapped)}
        configs={{ label: 'Nome' }}
        state={state}
        {...rest}
      />
    </div>
  );
}
