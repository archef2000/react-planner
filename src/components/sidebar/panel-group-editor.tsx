import React, { Component, useContext, useState } from 'react';
import Panel from './panel';
import * as SharedStyle from '../../shared-style';
import { FormNumberInput, FormTextInput } from '../style/export';

import { FaUnlink } from 'react-icons/fa';

import {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
} from '../../constants';
import ReactPlannerContext from '../../react-planner-context';
import { State } from '../../models';
import { ElementPrototypes } from '../../types';

const VISIBILITY_MODE = {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
} as const;

const tableStyle = { width: '100%' } as const;
const firstTdStyle = { width: '6em' } as const;
const inputStyle = { textAlign: 'left' } as const;
const styleEditButton = {
  marginLeft: '5px',
  border: '0px',
  background: 'none',
  color: SharedStyle.COLORS.white,
  fontSize: '14px',
  outline: '0px'
} as const;

const tablegroupStyle = {
  width: '100%',
  cursor: 'pointer',
  maxHeight: '20em',
  marginLeft: '1px',
  marginTop: '1em'
} as const;

const iconColStyle = { width: '2em' };

interface PanelGroupEditorProps {
  state: State;
  groupID?: string;
}

export default function PanelGroupEditor(props: PanelGroupEditorProps) {
  const { groupID, state } = props;
  const { catalog, translator, itemsActions, linesActions, holesActions, groupsActions, projectActions } = useContext(ReactPlannerContext);

  if (!groupID || !VISIBILITY_MODE[state.mode]) return null;

  const group = state.scene.groups[groupID];
  const elements = group.elements;

  return (
    <Panel name={translator.t('Group [{0}]', group.name)} opened={true}>
      <div style={{ padding: '5px 15px' }}>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={firstTdStyle}>{translator.t('Name')}</td>
              <td>
                <FormTextInput
                  value={group.name}
                  onChange={e => groupsActions.setGroupAttributes(groupID, { 'name': e.target.value })}
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td style={firstTdStyle}>X</td>
              <td>
                <FormNumberInput
                  value={group.x}
                  onChange={e => groupsActions.groupTranslate(groupID, e.target.value, group.y)}
                  style={inputStyle}
                  precision={2}
                />
              </td>
            </tr>
            <tr>
              <td style={firstTdStyle}>Y</td>
              <td>
                <FormNumberInput
                  value={group.y}
                  onChange={e => groupsActions.groupTranslate(groupID, group.x, e.target.value)}
                  style={inputStyle}
                  precision={2}
                />
              </td>
            </tr>
            <tr>
              <td style={firstTdStyle}>{translator.t('Rotation')}</td>
              <td>
                <FormNumberInput
                  value={group.rotation}
                  onChange={e => groupsActions.groupRotate(groupID, e.target.value)}
                  style={inputStyle}
                  precision={2}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {
          Object.keys(elements).length ?
            <div>
              <p style={{ textAlign: 'center', borderBottom: SharedStyle.PRIMARY_COLOR.border, paddingBottom: '1em' }}>{translator.t('Group\'s Elements')}</p>
              <table style={tablegroupStyle}>
                <thead>
                  <tr>
                    <th style={iconColStyle}></th>
                    <th>{translator.t('Layer')}</th>
                    <th>{translator.t('Prototype')}</th>
                    <th>{translator.t('Name')}</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    Object.entries(elements).map(([layerID, layerElements]) => {
                      return Object.entries(layerElements).map(([elementPrototype, ElementList]) => {
                        return ElementList.map(elementID => {
                          const element = state.scene.layers[layerID][elementPrototype][elementID]

                          return <tr
                            key={elementID}
                          >
                            <td style={iconColStyle} title={translator.t('Un-chain Element from Group')}>
                              <FaUnlink
                                onClick={e => groupsActions.removeFromGroup(groupID, layerID, elementPrototype as ElementPrototypes, elementID)}
                                style={styleEditButton}
                              />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {layerID}
                            </td>
                            <td style={{ textAlign: 'center', textTransform: 'capitalize' }}>
                              {elementPrototype}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {element.name}
                            </td>
                          </tr>;
                        });
                      });
                    })
                  }
                </tbody>
              </table>
            </div> :
            null
        }
      </div>
    </Panel>
  );
}
