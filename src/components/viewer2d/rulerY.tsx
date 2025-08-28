import React from 'react';
import * as SharedStyle from '../../shared-style';

interface RulerXProps {
  unitPixelSize: number,
  positiveUnitsNumber?: number,
  negativeUnitsNumber?: number,
  zoom: number,
  mouseY: number,
  height: number,
  zeroTopPosition: number,
  backgroundColor?: string,
  fontColor?: string,
  markerColor?: string
};

export default function RulerY({ unitPixelSize, positiveUnitsNumber = 50, negativeUnitsNumber = 50, zoom, mouseY, height, zeroTopPosition, backgroundColor = SharedStyle.PRIMARY_COLOR.main, fontColor = SharedStyle.COLORS.white, markerColor = SharedStyle.SECONDARY_COLOR.main }: RulerXProps) {

  const elementH = unitPixelSize * zoom;

  const elementStyle = {
    width: '8px',
    borderBottom: '1px solid ' + fontColor,
    paddingBottom: '0.2em',
    fontSize: '10px',
    height: elementH,
    textOrientation: 'upright',
    writingMode: 'vertical-lr',
    letterSpacing: '-2px',
    textAlign: 'right'
  } as const;

  const insideElementsStyle = {
    height: '20%',
    width: '100%',
    textOrientation: 'upright',
    writingMode: 'vertical-lr',
    display: 'inline-block',
    letterSpacing: '-2px',
    textAlign: 'right'
  } as const;

  const rulerStyle = {
    backgroundColor: backgroundColor,
    height: height,
    width: '100%',
    color: fontColor
  } as const;

  const markerStyle = {
    position: 'absolute',
    top: zeroTopPosition - (mouseY * zoom) - 6.5,
    left: 8,
    width: 0,
    height: 0,
    borderTop: '5px solid transparent',
    borderBottom: '5px solid transparent',
    borderLeft: '8px solid ' + markerColor,
    zIndex: 9001
  } as const;

  const rulerContainer = {
    position: 'absolute',
    width: '100%',
    display: 'grid',
    gridRowGap: '0',
    gridColumnGap: '0',
    gridTemplateColumns: '100%',
    grdAutoRows: `${elementH}px`,
    paddingLeft: '5px'
  } as const;

  const positiveRulerContainer = {
    ...rulerContainer,
    top: zeroTopPosition - (positiveUnitsNumber * elementH),
    height: (positiveUnitsNumber * elementH)
  } as const;

  const negativeRulerContainer = {
    ...rulerContainer,
    top: zeroTopPosition + (negativeUnitsNumber * elementH),
    height: (negativeUnitsNumber * elementH)
  } as const;

  const positiveDomElements = [];

  if (elementH <= 200) {
    for (let x = 1; x <= positiveUnitsNumber; x++) {
      positiveDomElements.push(
        <div key={x} style={{ ...elementStyle, gridColumn: 1, gridRow: x }}>
          {elementH > 30 ? ((positiveUnitsNumber - x) * 100) : ''}
        </div>
      );
    }
  }
  else if (elementH > 200) {
    for (let x = 1; x <= positiveUnitsNumber; x++) {
      const val = (positiveUnitsNumber - x) * 100;
      positiveDomElements.push(
        <div key={x} style={{ ...elementStyle, gridColumn: 1, gridRow: x }}>
          <div style={insideElementsStyle}>{val + (4 * 20)}</div>
          <div style={insideElementsStyle}>{val + (3 * 20)}</div>
          <div style={insideElementsStyle}>{val + (2 * 20)}</div>
          <div style={insideElementsStyle}>{val + (1 * 20)}</div>
          <div style={insideElementsStyle}>{val}</div>
        </div>
      );
    }
  }

  return <div style={rulerStyle}>
    <div id="verticalMarker" style={markerStyle}></div>
    <div id="negativeRuler" style={negativeRulerContainer}></div>
    <div id="positiveRuler" style={positiveRulerContainer}>{positiveDomElements}</div>
  </div>;
}
