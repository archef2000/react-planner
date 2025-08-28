import React, { Component, useContext, useState } from 'react';
import If from '../../utils/react-if';
import FooterToggleButton from './footer-toggle-button';
import FooterContentButton from './footer-content-button';
import { SNAP_POINT, SNAP_LINE, SNAP_SEGMENT, SNAP_GRID, SNAP_GUIDE } from '../../utils/snap';
import { MODE_SNAPPING } from '../../constants';
import * as SharedStyle from '../../shared-style';
import { MdAddCircle, MdWarning } from 'react-icons/md';
import { VERSION } from '../../version';
import ReactPlannerContext from '../../react-planner-context';
import { State } from '../../models';

const footerBarStyle = {
  position: 'absolute',
  bottom: 0,
  lineHeight: '14px',
  fontSize: '12px',
  color: SharedStyle.COLORS.white,
  backgroundColor: SharedStyle.SECONDARY_COLOR.alt,
  padding: '3px 1em',
  margin: 0,
  boxSizing: 'border-box',
  cursor: 'default',
  userSelect: 'none',
  zIndex: '9001'
} as const;

export const leftTextStyle = {
  position: 'relative',
  borderRight: '1px solid #FFF',
  float: 'left',
  padding: '0 1em',
  display: 'inline-block'
} as const;

export const rightTextStyle = {
  position: 'relative',
  borderLeft: '1px solid #FFF',
  float: 'right',
  padding: '0 1em',
  display: 'inline-block'
} as const;

const coordStyle = {
  display: 'inline-block',
  width: '6em',
  margin: 0,
  padding: 0
};

const appMessageStyle = { borderBottom: '1px solid #555', lineHeight: '1.5em' };

interface FooterBarProps {
  state: State;
  footerbarComponents: any[];
  width: number;
  height: number;
  softwareSignature: string;
}

export default function FooterBar(props: FooterBarProps) {
  const [state] = useState({});
  const { state: globalState, width, height, softwareSignature, footerbarComponents } = props;
  const { translator, projectActions } = useContext(ReactPlannerContext);
  const { x, y } = globalState.mouse;
  const zoom = globalState.zoom;
  const mode = globalState.mode;

  const errors = globalState.errors;
  const errorsJsx = errors.map((err, ind) =>
    <div key={ind} style={appMessageStyle}>[ {(new Date(err.date)).toLocaleString()} ] {err.error}</div>
  );
  const errorLableStyle = errors.length ? { color: SharedStyle.MATERIAL_COLORS[500].red } : {};
  const errorIconStyle = errors.length ? { transform: 'rotate(45deg)', color: SharedStyle.MATERIAL_COLORS[500].red } : { transform: 'rotate(45deg)' };

  const warnings = globalState.warnings;
  const warningsJsx = warnings.map((warn, ind) =>
    <div key={ind} style={appMessageStyle}>[ {(new Date(warn.date)).toLocaleString()} ] {warn.warning}</div>
  );
  const warningLableStyle = warnings.length ? { color: SharedStyle.MATERIAL_COLORS[500].yellow } : {};
  const warningIconStyle = warningLableStyle;

  const updateSnapMask = (val) => {
    projectActions.toggleSnap(
      { ...globalState.snapMask, ...val }
    );
  };

  return (
    <div style={{ ...footerBarStyle, width, height }}>

      <If condition={MODE_SNAPPING.includes(mode)} style={{}}>
        <div style={leftTextStyle}>
          <div title={translator.t('Mouse X Coordinate')} style={coordStyle}>X : {x.toFixed(3)}</div>
          <div title={translator.t('Mouse Y Coordinate')} style={coordStyle}>Y : {y.toFixed(3)}</div>
        </div>

        <div style={leftTextStyle} title={translator.t('Scene Zoom Level')}>Zoom: {zoom.toFixed(3)}X</div>

        <div style={leftTextStyle}>
          <FooterToggleButton
            toggleOn={() => { updateSnapMask({ SNAP_POINT: true }); }}
            toggleOff={() => { updateSnapMask({ SNAP_POINT: false }); }}
            text="Snap PT"
            toggleState={globalState.snapMask[SNAP_POINT]}
            title={translator.t('Snap to Point')}
          />
          <FooterToggleButton
            toggleOn={() => { updateSnapMask({ SNAP_LINE: true }); }}
            toggleOff={() => { updateSnapMask({ SNAP_LINE: false }); }}
            text="Snap LN"
            toggleState={globalState.snapMask[SNAP_LINE]}
            title={translator.t('Snap to Line')}
          />
          <FooterToggleButton
            toggleOn={() => { updateSnapMask({ SNAP_SEGMENT: true }); }}
            toggleOff={() => { updateSnapMask({ SNAP_SEGMENT: false }); }}
            text="Snap SEG"
            toggleState={globalState.snapMask[SNAP_SEGMENT]}
            title={translator.t('Snap to Segment')}
          />
          <FooterToggleButton
            toggleOn={() => { updateSnapMask({ SNAP_GRID: true }); }}
            toggleOff={() => { updateSnapMask({ SNAP_GRID: false }); }}
            text="Snap GRD"
            toggleState={globalState.snapMask[SNAP_GRID]}
            title={translator.t('Snap to Grid')}
          />
          <FooterToggleButton
            toggleOn={() => { updateSnapMask({ SNAP_GUIDE: true }); }}
            toggleOff={() => { updateSnapMask({ SNAP_GUIDE: false }); }}
            text="Snap GDE"
            toggleState={globalState.snapMask[SNAP_GUIDE]}
            title={translator.t('Snap to Guide')}
          />
        </div>
      </If>

      {footerbarComponents.map((Component, index) => <Component state={state} key={index} />)}

      {
        softwareSignature ?
          <div
            style={rightTextStyle}
            title={softwareSignature + (softwareSignature.includes('React-Planner') ? '' : ` using React-Planner ${VERSION}`)}
          >
            {softwareSignature}
          </div>
          : null
      }

      <div style={rightTextStyle}>
        <FooterContentButton
          icon={MdAddCircle}
          iconStyle={errorIconStyle}
          text={errors.length.toString()}
          textStyle={errorLableStyle}
          title={`Errors [ ${errors.length} ]`}
          titleStyle={errorLableStyle}
          content={[errorsJsx]}
        />
        <FooterContentButton
          icon={MdWarning}
          iconStyle={warningIconStyle}
          text={warnings.length.toString()}
          textStyle={warningLableStyle}
          title={`Warnings [ ${warnings.length} ]`}
          titleStyle={warningLableStyle}
          content={[warningsJsx]}
        />
      </div>

    </div>
  );
}
