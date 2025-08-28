import React, { Component, MouseEventHandler, ReactNode, useState } from 'react';
import * as SharedStyle from '../../shared-style';

//http://www.cssportal.com/css-tooltip-generator/

const STYLE = {
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '5px',
  fontSize: '25px',
  position: 'relative',
  cursor: 'pointer'
} as const;

const STYLE_TOOLTIP = {
  position: 'absolute',
  width: '140px',
  color: SharedStyle.COLORS.white,
  background: SharedStyle.COLORS.black,
  height: '30px',
  lineHeight: '30px',
  textAlign: 'center',
  visibility: 'visible',
  borderRadius: '6px',
  opacity: '0.8',
  left: '100%',
  top: '50%',
  marginTop: '-15px',
  marginLeft: '15px',
  zIndex: '999',
  fontSize: '12px'
} as const;

const STYLE_TOOLTIP_PIN = {
  position: 'absolute',
  top: '50%',
  right: '100%',
  marginTop: '-8px',
  width: '0',
  height: '0',
  borderRight: '8px solid #000000',
  borderTop: '8px solid transparent',
  borderBottom: '8px solid transparent'
} as const;

interface ToolbarButtonProps {
  active: boolean;
  tooltip: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  children: ReactNode;
}

export default function ToolbarButton(props: ToolbarButtonProps) {
  const [state, setState] = useState({ active: false })
  const color = props.active || state.active ? SharedStyle.SECONDARY_COLOR.icon : SharedStyle.PRIMARY_COLOR.icon;

  return (
    <div style={STYLE}
      onMouseOver={event => setState({ active: true })}
      onMouseOut={event => setState({ active: false })}>
      <div style={{ color }} onClick={props.onClick}>
        {props.children}
      </div>
      {
        state.active ?
          <div style={STYLE_TOOLTIP}>
            <span style={STYLE_TOOLTIP_PIN} />
            {props.tooltip}
          </div>
          : null
      }
    </div>
  )
}

