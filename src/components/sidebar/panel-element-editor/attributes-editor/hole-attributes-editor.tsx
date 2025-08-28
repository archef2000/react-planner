import React, { Component, useContext } from 'react';
import PropertyLengthMeasure from '../../../../catalog/properties/property-lenght-measure';
import PropertyString from '../../../../catalog/properties/property-string';
import ReactPlannerContext from '../../../../react-planner-context';
import { State } from '../../../../models';

interface HoleAttributesEditorProps {
  element: any;
  onUpdate: (name: string, data: any) => void;
  attributeFormData: any;
  state: State;
  [key: string]: any;
}

export default function HoleAttributesEditor({ element, onUpdate, attributeFormData, state, ...rest }: HoleAttributesEditorProps) {
  const name = attributeFormData.name ?? element.name;
  const offsetA = attributeFormData.offsetA ?? element.offsetA;
  const offsetB = attributeFormData.offsetB ?? element.offsetA;

  return <div>
    <PropertyString
      value={name}
      onUpdate={mapped => onUpdate('name', mapped)}
      configs={{ label: 'Nome' }}
      state={state}
      {...rest}
    />
    <PropertyLengthMeasure
      value={offsetA}
      onUpdate={mapped => onUpdate('offsetA', mapped)}
      configs={{ label: 'Offset 1', min: 0, max: Infinity, precision: 2 }}
      state={state}
      {...rest}
    />
    <PropertyLengthMeasure
      value={offsetB}
      onUpdate={mapped => onUpdate('offsetB', mapped)}
      configs={{ label: 'Offset 2', min: 0, max: Infinity, precision: 2 }}
      state={state}
      {...rest}
    />
  </div>;
}
