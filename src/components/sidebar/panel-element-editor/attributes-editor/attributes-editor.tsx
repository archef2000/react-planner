import React, { Component } from 'react';
import ItemAttributesEditor from './item-attributes-editor';
import LineAttributesEditor from './line-attributes-editor';
import HoleAttributesEditor from './hole-attributes-editor';
import { State } from '../../../../models';

interface AttributesEditorProps {
  element: any;
  onUpdate: (name: string, data: any) => void;
  onValid?: (isValid: boolean) => void;
  attributeFormData: any;
  state: State;
  [key: string]: any;
}

export default function AttributesEditor({ element, onUpdate, onValid, attributeFormData, state, ...rest }: AttributesEditorProps) {
  switch (element.prototype) {
    case 'items':
      return <ItemAttributesEditor
        element={element}
        onUpdate={onUpdate}
        onValid={onValid}
        attributeFormData={attributeFormData}
        state={state}
        {...rest}
      />;
    case 'lines':
      return <LineAttributesEditor
        element={element}
        onUpdate={onUpdate}
        onValid={onValid}
        attributeFormData={attributeFormData}
        state={state}
        {...rest}
      />;
    case 'holes':
      return <HoleAttributesEditor
        element={element}
        onUpdate={onUpdate}
        onValid={onValid}
        attributeFormData={attributeFormData}
        state={state}
        {...rest}
      />;
    case 'areas':
      return null;

  }

  return null;
}

