import React, { Component, useContext } from 'react';
import * as SharedStyle from '../../shared-style';
import ReactPlannerContext from '../../react-planner-context';

interface RulerXProps {
  unitPixelSize: number;
  positiveUnitsNumber?: number;
  negativeUnitsNumber?: number;
  zoom: number;
  mouseX: number;
  width: number;
  zeroLeftPosition: number;
  backgroundColor?: string;
  fontColor?: string;
  markerColor?: string;
}

export default function RulerX({ unitPixelSize, positiveUnitsNumber = 50, negativeUnitsNumber = 50, mouseX = 0, zoom, width, zeroLeftPosition, backgroundColor = SharedStyle.PRIMARY_COLOR.main, fontColor = SharedStyle.COLORS.white, markerColor = SharedStyle.SECONDARY_COLOR.main }: RulerXProps) {
  const elementW = unitPixelSize * zoom;

  const elementStyle = {
    display: 'inline-block',
    width: elementW,
    position: 'relative',
    borderLeft: '1px solid ' + fontColor,
    paddingLeft: '0.2em',
    fontSize: '10px',
    height: '100%'
  } as const;

  const insideElementsStyle = {
    width: '20%',
    display: 'inline-block',
    margin: 0,
    padding: 0
  } as const;

  const rulerStyle = {
    backgroundColor: backgroundColor,
    position: 'relative',
    width: width,
    height: '100%',
    color: fontColor
  } as const;

  const markerStyle = {
    position: 'absolute',
    left: zeroLeftPosition + (mouseX * zoom) - 6.5,
    top: 8,
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '8px solid ' + markerColor,
    zIndex: 9001
  } as const;

  const rulerContainer = {
    position: 'absolute',
    height: '10px',
    top: '4px',
    display: 'grid',
    gridRowGap: '0',
    gridColumnGap: '0',
    gridTemplateRows: '100%',
    grdAutoColumns: `${elementW}px`
  } as const;

  const positiveRulerContainer = {
    ...rulerContainer,
    width: (positiveUnitsNumber * elementW),
    left: zeroLeftPosition
  };

  const negativeRulerContainer = {
    ...rulerContainer,
    width: (negativeUnitsNumber * elementW),
    left: zeroLeftPosition - (negativeUnitsNumber * elementW)
  };

  const positiveDomElements = [];

  if (elementW <= 200) {
    for (let x = 0; x < positiveUnitsNumber; x++) {
      positiveDomElements.push(
        <div key={x} style={{ ...elementStyle, gridColumn: (x + 1), gridRow: 1 }}>
          {elementW > 30 ? (x * 100) : ''}
        </div>
      );
    }
  }
  else if (elementW > 200) {
    for (let x = 0; x < positiveUnitsNumber; x++) {
      const val = x * 100;
      positiveDomElements.push(
        <div key={x} style={{ ...elementStyle, gridColumn: (x + 1), gridRow: 1 }}>
          <div style={insideElementsStyle}>{val}</div>
          <div style={insideElementsStyle}>{val + (1 * 20)}</div>
          <div style={insideElementsStyle}>{val + (2 * 20)}</div>
          <div style={insideElementsStyle}>{val + (3 * 20)}</div>
          <div style={insideElementsStyle}>{val + (4 * 20)}</div>
        </div>
      );
    }
  }

  return <div style={rulerStyle}>
    <div id="horizontalMarker" style={markerStyle}></div>
    <div id="negativeRuler" style={negativeRulerContainer}></div>
    <div id="positiveRuler" style={positiveRulerContainer}>{positiveDomElements}</div>
  </div>;
}
