import React, { Component } from 'react';

import ReactPlannerContext from '../../react-planner-context';
import * as SharedStyle from '../../shared-style';

const toggleButtonStyle = {
  width: '5.5em',
  color: '#CCC',
  textAlign: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  border: '1px solid transparent',
  margin: '-1px 5px 0 5px',
  borderRadius: '2px',
  display: 'inline-block'
} as const;

const toggleButtonStyleOver = {
  ...toggleButtonStyle,
  backgroundColor: '#1c82c6',
  border: '1px solid #FFF',
  color: SharedStyle.COLORS.white
} as const;

interface FooterToggleButtonProps {
  toggleOn: () => void;
  toggleOff: () => void;
  text: string;
  toggleState?: boolean;
  title?: string;
}

interface FooterToggleButtonState {
  over: boolean;
  active: boolean;
}

export default class FooterToggleButton extends Component<
  FooterToggleButtonProps,
  FooterToggleButtonState
> {
  static contextType = ReactPlannerContext;
  context!: React.ContextType<typeof ReactPlannerContext>;

  constructor(
    props: FooterToggleButtonProps,
    context: typeof ReactPlannerContext
  ) {
    super(props, context);

    this.state = {
      over: false,
      active: this.props.toggleState || false
    };
  }

  toggleOver(e: React.MouseEvent) {
    this.setState({ over: true });
  }
  toggleOut(e: React.MouseEvent) {
    this.setState({ over: false });
  }

  toggle(e: React.MouseEvent) {
    const isActive = !this.state.active;
    this.setState({ active: isActive });

    if (isActive) {
      this.props.toggleOn();
    } else {
      this.props.toggleOff();
    }
  }

  shouldComponentUpdate(
    nextProps: FooterToggleButtonProps,
    nextState: FooterToggleButtonState
  ) {
    if (this.state.over != nextState.over) return true;
    if (this.state.active != nextState.active) return true;
    if (this.props.toggleState != nextProps.toggleState) return true;

    return false;
  }

  componentDidUpdate(prevProps: FooterToggleButtonProps) {
    if (this.props.toggleState != prevProps.toggleState)
      this.setState({ ...this.state, active: !!this.props.toggleState });
  }

  render() {
    return (
      <div
        style={
          this.state.over || this.state.active
            ? toggleButtonStyleOver
            : toggleButtonStyle
        }
        onMouseOver={(e) => this.toggleOver(e)}
        onMouseOut={(e) => this.toggleOut(e)}
        onClick={(e) => this.toggle(e)}
        title={this.props.title}
      >
        {this.props.text}
      </div>
    );
  }
}
