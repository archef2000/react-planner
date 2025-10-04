import React, { memo, useContext, useState } from 'react';

import { FaTimes, FaTrash } from 'react-icons/fa';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { State } from '../../models';
import ReactPlannerContext from '../../react-planner-context';
import * as SharedStyle from '../../shared-style';
import { FormNumberInput } from '../style/export';

import Panel from './panel';

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

const listTabStyle = {
  display: 'inline-block',
  border: '1px solid transparent',
  borderBottom: 'none',
  bottom: '-1px',
  position: 'relative',
  listStyle: 'none',
  padding: '6px 12px',
  cursor: 'pointer'
} as const;

const activeTabStyle = {
  border: '1px solid white',
  borderBottom: '0px solid white',
  color: SharedStyle.SECONDARY_COLOR.main
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

  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <Panel name={translator.t('Guides')}>
      <Tabs
        id="guidesTabs"
        style={tabStyle}
        selectedIndex={selectedTab}
        onSelect={(i) => setSelectedTab(i)}
      >
        <TabList style={{ borderBottom: '1px solid #aaa' }}>
          <Tab
            style={
              selectedTab === 0
                ? { ...listTabStyle, ...activeTabStyle }
                : listTabStyle
            }
          >
            {translator.t('Horizontal')}
          </Tab>
          <Tab
            style={
              selectedTab === 1
                ? { ...listTabStyle, ...activeTabStyle }
                : listTabStyle
            }
          >
            {translator.t('Vertical')}
          </Tab>
          {/*<Tab>{translator.t('Circular')}</Tab>*/}
        </TabList>

        <TabPanel>
          <table style={tableTabStyle}>
            <tbody>
              {Object.entries(guides.horizontal).map(([hgKey, hgVal], ind) => {
                return (
                  <tr key={hgKey}>
                    <td style={{ width: '2em' }}>{ind + 1}</td>
                    <td>{hgVal}</td>
                    <td style={{ width: '5em' }}>
                      {/*<FaPencil style={iconStyle} />*/}
                      <FaTrash
                        style={iconStyle}
                        onClick={(e) =>
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
                    onClick={(e) => setAddHGVisible(false)}
                  >
                    {translator.t('+ Add Horizontal Giude')}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={2}>
                    <FormNumberInput
                      value={0}
                      onChange={(e) => {
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
                      onClick={(e) => setAddHGVisible(true)}
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
              {Object.entries(guides.vertical).map(([hgKey, hgVal], ind) => {
                return (
                  <tr key={hgKey}>
                    <td style={{ width: '2em' }}>{ind + 1}</td>
                    <td>{hgVal}</td>
                    <td style={{ width: '5em' }}>
                      {/*<FaPencil style={iconStyle} />*/}
                      <FaTrash
                        style={iconStyle}
                        onClick={(e) =>
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
                    onClick={(e) => setAddVGVisible(false)}
                  >
                    {translator.t('+ Add Vertical Giude')}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={2}>
                    <FormNumberInput
                      value={0}
                      onChange={(e) => {
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
                      onClick={(e) => setAddVGVisible(true)}
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

function propsAreEqual(
  prevProps: PanelGuidesProps,
  nextProps: PanelGuidesProps
) {
  return prevProps.state.scene.guides === nextProps.state.scene.guides;
}

export default memo(PanelGuides, propsAreEqual);
