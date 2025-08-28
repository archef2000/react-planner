import React, { Component, memo, useContext, useState } from 'react';
import Panel from './panel';
import * as SharedStyle from '../../shared-style';
import { TiPlus, TiDelete } from 'react-icons/ti';
import { FaTrash, FaEye, FaLink, FaUnlink } from 'react-icons/fa';
import ReactPlannerContext from '../../react-planner-context';

import {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
} from '../../constants';
import { ElementPrototypes } from '../../types';
import { Scene, State } from '../../models';

const VISIBILITY_MODE = {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
} as const;

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
  padding: '0 1em',
  marginLeft: '1px'
} as const;

const iconColStyle = { width: '2em', textAlign: 'center' } as const;
const styleHoverColor = { color: SharedStyle.SECONDARY_COLOR.main } as const;
const styleEditButtonHover = { ...styleEditButton, ...styleHoverColor } as const;
const styleAddLabel = { fontSize: '10px', marginLeft: '5px' } as const;
const styleEyeVisible = { fontSize: '1.25em' } as const;
const styleEyeHidden = { ...styleEyeVisible, color: '#a5a1a1' } as const;
const newLayerLableStyle = { fontSize: '1.3em', cursor: 'pointer', textAlign: 'center' } as const;
const newLayerLableHoverStyle = { ...newLayerLableStyle, ...styleHoverColor } as const;

interface PanelGroupsProps {
  mode: State["mode"];
  groups: Scene["groups"];
  layers: Scene["layers"];
}

function PanelGroups(props: PanelGroupsProps) {
  const { translator, groupsActions } = useContext(ReactPlannerContext);
  const [newEmptyHover, setNewEmptyHover] = useState(false);
  const [newSelectedHover, setNewSelectedHover] = useState(false);

  const { mode, groups, layers } = props;

  if (!VISIBILITY_MODE[mode]) return null;

  return (
    <Panel name={translator.t('Groups')} opened={Object.keys(groups).length > 0}>
      {Object.keys(groups).length ? <table style={tablegroupStyle}>
        <thead>
          <tr>
            <th colSpan={4}></th>
            <th>{translator.t('Elements')}</th>
            <th>{translator.t('Name')}</th>
          </tr>
        </thead>
        <tbody>
          {
            Object.entries(groups).map(([groupID, group]) => {
              const selectClick = e => groupsActions.selectGroup(groupID);

              const swapVisibility = e => {
                e.stopPropagation();
                groupsActions.setGroupAttributes(groupID, { "visible": !group.visible });
              };

              const chainToGroup = e => {
                Object.values(layers).forEach((layer) => {

                  const layerID = layer.id;
                  const layerElements = {
                    'lines': layer.lines,
                    'items': layer.items,
                    'holes': layer.holes,
                    'areas': layer.areas
                  } as const;

                  Object.entries(layerElements).forEach(([elementPrototype, ElementList]) => {
                    Object.values(ElementList).filter(el => el.selected).forEach(element => {
                      groupsActions.addToGroup(
                        groupID,
                        layerID,
                        elementPrototype as ElementPrototypes,
                        element.id
                      );
                    });
                  });
                });

                selectClick(e);
              };

              const isCurrentgroup = group.selected;
              const shouldHighlight = isCurrentgroup;
              const rowStyle = !shouldHighlight ? null : styleHoverColor;

              const dimension = Object.values(group.elements).reduce((sum, layer) => {
                return sum + Object.values(layer).reduce((lSum, elProt) => lSum + elProt.length, 0);
              }, 0);

              return (
                <tr
                  key={groupID}
                  style={rowStyle}
                >
                  <td style={iconColStyle} title={translator.t('Toggle Group Visibility')}>
                    <FaEye
                      onClick={swapVisibility}
                      style={!group.visible ? styleEyeHidden : styleEyeVisible}
                    />
                  </td>
                  <td style={iconColStyle} title={translator.t('Chain selected Elements to Group')}>
                    <FaLink
                      onClick={chainToGroup}
                      style={!shouldHighlight ? styleEditButton : styleEditButtonHover}
                    />
                  </td>
                  <td style={iconColStyle} title={translator.t('Un-chain all Group\'s Elements and remove Group')}>
                    <FaUnlink
                      onClick={e => groupsActions.removeGroup(groupID)}
                      style={!shouldHighlight ? styleEditButton : styleEditButtonHover}
                    />
                  </td>
                  <td style={iconColStyle} title={translator.t('Delete group and all Elements')}>
                    <FaTrash
                      onClick={e => groupsActions.removeGroupAndDeleteElements(groupID)}
                      style={!shouldHighlight ? styleEditButton : styleEditButtonHover}
                    />
                  </td>
                  <td onClick={selectClick} style={{ width: '0em', textAlign: 'center' }}>
                    {dimension}
                  </td>
                  <td onClick={selectClick}>
                    {group.name}
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table> : null}

      <table style={{ width: '100%', marginTop: '0.1em' }}>
        <tbody>
          <tr>
            <td
              style={!newEmptyHover ? newLayerLableStyle : newLayerLableHoverStyle}
              onMouseOver={() => setNewEmptyHover(true)}
              onMouseOut={() => setNewEmptyHover(false)}
              onClick={e => groupsActions.addGroup()}
            >
              <TiPlus />
              <b style={styleAddLabel}>{translator.t('New Empty Group')}</b>
            </td>
            <td
              style={!newSelectedHover ? newLayerLableStyle : newLayerLableHoverStyle}
              onMouseOver={() => setNewSelectedHover(true)}
              onMouseOut={() => setNewSelectedHover(false)}
              onClick={e => groupsActions.addGroupFromSelected()}
            >
              <TiPlus />
              <b style={styleAddLabel}>{translator.t('New Group from selected')}</b>
            </td>
          </tr>
        </tbody>
      </table>

    </Panel>
  )
}

function areEqual(prevProps: PanelGroupsProps, nextProps: PanelGroupsProps) {
  return (
    prevProps.groups === nextProps.groups &&
    prevProps.layers === nextProps.layers &&
    prevProps.mode === nextProps.mode
  );
}

export default memo(PanelGroups, areEqual);
