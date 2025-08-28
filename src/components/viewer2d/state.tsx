import React from 'react';
import Scene from './scene';
import Snap from './snap';
import * as SharedStyle from '../../shared-style';
import { State as StateClass } from '../../models';

const guideStyle = {
  stroke: SharedStyle.SECONDARY_COLOR.main,
  strokewidth: '2.5px'
};

interface StateProps {
  state: StateClass, // object
  catalog: any, // object
}

export default function State({ state, catalog }: StateProps) {

  let { activeSnapElement, snapElements, scene } = state;
  const { width, height } = scene;

  activeSnapElement = activeSnapElement ?
    <Snap snap={activeSnapElement} width={scene.width} height={scene.height} /> : null;
  // snapElements = snapElements.map((snap,id) => <Snap key={id} snap={snap} width={scene.width} height={scene.height}/>);
  snapElements = null; //only for debug purpose

  return (
    <g>
      <rect x="0" y="0" width={width} height={height} fill={SharedStyle.COLORS.white} />
      <g transform={`translate(0, ${scene.height}) scale(1, -1)`} id="svg-drawing-paper">
        <Scene scene={scene} catalog={catalog} />
        {Object.entries(scene.guides.horizontal).map(([hgKey, hgVal]) => <line id={'hGuide' + hgKey} key={hgKey} x1={0} y1={hgVal} x2={width} y2={hgVal} style={guideStyle} />)}
        {Object.entries(scene.guides.vertical).map(([vgKey, vgVal]) => <line key={vgKey} x1={vgVal} y1={0} x2={vgVal} y2={height} style={guideStyle} />)}
        {activeSnapElement}
        {snapElements}

      </g>
    </g>
  )
}
