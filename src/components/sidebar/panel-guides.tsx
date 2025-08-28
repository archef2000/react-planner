import React, { Component, memo, useContext, useState } from 'react';
import Panel from './panel';
import * as SharedStyle from '../../shared-style';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaTrash, FaTimes } from 'react-icons/fa';
import { FormNumberInput } from '../style/export';
import ReactPlannerContext from '../../react-planner-context';
import { State } from '../../models';

const tabStyle = { margin: '1em' } as const;

const iconStyle = {
  fontSize: '14px',
  margin: '2px',
  cursor: 'pointer'
} as const;

const addGuideStyle = {
  cursor: 'pointer',
  height: '2em'
} as const;

const tableTabStyle = {
  width: '100%',
  textAlign: 'center'
} as const;

export interface PanelGuidesProps {
  state: State;
}

function PanelGuides(props: PanelGuidesProps) {
  const { state } = props;
  const { projectActions, translator } = useContext(ReactPlannerContext);
  const [addHGVisible, setAddHGVisible] = useState(true);
  const [addVGVisible, setAddVGVisible] = useState(true);

  const { guides } = state.scene;

  return (
    <Panel name={translator.t('Guides')}>
      <Tabs id='guidesTabs' style={tabStyle}>
        <TabList>
          <Tab>{translator.t('Horizontal')}</Tab>
          <Tab>{translator.t('Vertical')}</Tab>
          {/*<Tab>{translator.t('Circular')}</Tab>*/}
        </TabList>

        <TabPanel>
          <table style={tableTabStyle}>
            <tbody>
              {Object.entries(guides.horizontal)
                .map(([hgKey, hgVal], ind) => {
                  return (
                    <tr key={hgKey}>
                      <td style={{ width: '2em' }}>{ind + 1}</td>
                      <td>{hgVal}</td>
                      <td style={{ width: '5em' }}>
                        {/*<FaPencil style={iconStyle} />*/}
                        <FaTrash
                          style={iconStyle}
                          onClick={e =>
                            projectActions.removeHorizontalGuide(hgKey)
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              {addHGVisible ? (
                <tr>
                  <td
                    colSpan={3}
                    style={addGuideStyle}
                    onClick={e => setAddHGVisible(false)}
                  >
                    {translator.t('+ Add Horizontal Giude')}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={2}>
                    <FormNumberInput
                      value={0}
                      onChange={e => {
                        projectActions.addHorizontalGuide(e.target.value);
                        return setAddHGVisible(true);
                      }}
                      min={0}
                      max={state.scene.height}
                    />
                  </td>
                  <td>
                    <FaTimes
                      style={iconStyle}
                      onClick={e => setAddHGVisible(true)}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TabPanel>
        <TabPanel>
          <table style={tableTabStyle}>
            <tbody>
              {Object.entries(guides.vertical)
                .map(([hgKey, hgVal], ind) => {
                  return (
                    <tr key={hgKey}>
                      <td style={{ width: '2em' }}>{ind + 1}</td>
                      <td>{hgVal}</td>
                      <td style={{ width: '5em' }}>
                        {/*<FaPencil style={iconStyle} />*/}
                        <FaTrash
                          style={iconStyle}
                          onClick={e =>
                            projectActions.removeVerticalGuide(hgKey)
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              {addVGVisible ? (
                <tr>
                  <td
                    colSpan={3}
                    style={addGuideStyle}
                    onClick={e => setAddVGVisible(false)}
                  >
                    {translator.t('+ Add Vertical Giude')}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={2}>
                    <FormNumberInput
                      value={0}
                      onChange={e => {
                        projectActions.addVerticalGuide(e.target.value);
                        return setAddVGVisible(true);
                      }}
                      min={0}
                      max={state.scene.height}
                    />
                  </td>
                  <td>
                    <FaTimes
                      style={iconStyle}
                      onClick={e => setAddVGVisible(true)}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TabPanel>
        {/*<TabPanel>
            <b>TODO Circular Giudes</b>
          </TabPanel>*/}
      </Tabs>
    </Panel>
  );
}


function shouldUpdate(prevProps: PanelGuidesProps, nextProps: PanelGuidesProps) {
  return (
    prevProps.state.scene.guides !== nextProps.state.scene.guides
  );
}

export default memo(PanelGuides, shouldUpdate)