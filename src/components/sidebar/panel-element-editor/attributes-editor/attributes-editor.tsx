import React from 'react';

import { Area, Item, State } from '../../../../models';
import { ElementType, HoleAttributes, LineAttributes } from '../../../../types';
import { AttributesFormData } from '../element-editor';

import AreaAttributesEditor from './area-attributes-editor';
import HoleAttributesEditor from './hole-attributes-editor';
import ItemAttributesEditor from './item-attributes-editor';
import LineAttributesEditor from './line-attributes-editor';

interface AttributesEditorProps {
  element: ElementType;
  onUpdate: (name: string, data: any) => void;
  onValid?: (isValid: boolean) => void;
  attributeFormData: AttributesFormData;
  state: State;
  [key: string]: any;
}

export default function AttributesEditor({
  element,
  onUpdate,
  onValid,
  attributeFormData,
  state,
  ...rest
}: AttributesEditorProps) {
  switch (element.prototype) {
    case 'items':
      return (
        <ItemAttributesEditor
          element={element}
          onUpdate={onUpdate}
          onValid={onValid}
          attributeFormData={attributeFormData as Item}
          state={state}
          {...rest}
        />
      );
    case 'lines':
      return (
        <LineAttributesEditor
          element={element}
          onUpdate={onUpdate}
          onValid={onValid}
          attributeFormData={attributeFormData as LineAttributes}
          state={state}
          {...rest}
        />
      );
    case 'holes':
      return (
        <HoleAttributesEditor
          element={element}
          onUpdate={onUpdate}
          onValid={onValid}
          attributeFormData={attributeFormData as HoleAttributes}
          state={state}
          {...rest}
        />
      );
    case 'areas':
      return (
        <AreaAttributesEditor
          element={element}
          onUpdate={onUpdate}
          onValid={onValid}
          attributeFormData={attributeFormData as Area}
          state={state}
          {...rest}
        />
      );
  }

  return null;
}
