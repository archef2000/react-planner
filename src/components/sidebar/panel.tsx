import React, { Component } from 'react';
import * as SharedStyle from '../../shared-style';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const STYLE = {
  borderTop: '1px solid #222',
  borderBottom: '1px solid #48494E',
  userSelect: 'none'
} as const;
const STYLE_TITLE = {
  fontSize: '11px',
  color: SharedStyle.PRIMARY_COLOR.text_alt,
  padding: '5px 15px 8px 15px',
  backgroundColor: SharedStyle.PRIMARY_COLOR.alt,
  textShadow: '-1px -1px 2px rgba(0, 0, 0, 1)',
  boxShadow: 'inset 0px -3px 19px 0px rgba(0,0,0,0.5)',
  margin: '0px',
  cursor: 'pointer'
} as const;
const STYLE_CONTENT = {
  fontSize: '11px',
  color: SharedStyle.PRIMARY_COLOR.text_alt,
  border: '1px solid #222',
  padding: '0px',
  backgroundColor: SharedStyle.PRIMARY_COLOR.alt,
  textShadow: '-1px -1px 2px rgba(0, 0, 0, 1)'
} as const;
const STYLE_ARROW = {
  float: 'right'
} as const;

interface PanelProps {
  name: string;
  headComponents?: React.ReactNode;
  opened?: boolean;
  children?: React.ReactNode;
}

interface PanelState {
  opened: boolean;
  hover: boolean;
}

export default class Panel extends Component<PanelProps, PanelState> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      opened: props.hasOwnProperty('opened') ? props.opened : false,
      hover: false
    };
  }

  toggleOpen() {
    this.setState({ opened: !this.state.opened });
  }

  toggleHover() {
    this.setState({ hover: !this.state.hover });
  }

  render() {

    const { name, headComponents, children } = this.props;
    const { opened, hover } = this.state;

    return (
      <div style={STYLE}>
        <p>wrong (create message 7)</p>
        <h3
          style={{ ...STYLE_TITLE, color: hover ? SharedStyle.SECONDARY_COLOR.main : SharedStyle.PRIMARY_COLOR.text_alt }}
          onMouseEnter={() => this.toggleHover()}
          onMouseLeave={() => this.toggleHover()}
          onClick={() => this.toggleOpen()}
        >
          {name}
          {headComponents}
          {
            opened ?
              <FaAngleUp style={STYLE_ARROW} /> :
              <FaAngleDown style={STYLE_ARROW} />
          }
        </h3>

        <div style={{ ...STYLE_CONTENT, display: opened ? 'block' : 'none' }}>
          {children}
        </div>
      </div>
    )
  }
}
