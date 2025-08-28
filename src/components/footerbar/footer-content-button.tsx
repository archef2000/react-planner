import React, { Component } from 'react';
import * as SharedStyle from '../../shared-style';
import { FaTimes as IconClose } from 'react-icons/fa';
import ReactPlannerContext from '../../react-planner-context';
import { State } from '../../models';

const labelContainerStyle = {
  width: 'auto',
  display: 'inline-block',
  margin: 0,
  padding: '0px 5px 0px 0px'
} as const;

const toggleButtonStyle = {
  color: '#CCC',
  textAlign: 'center',
  cursor: 'pointer',
  userSelect: 'none'
} as const;

const toggleButtonStyleOver = {
  ...toggleButtonStyle,
  color: SharedStyle.COLORS.white
} as const;

const contentContainerStyleActive = {
  position: 'fixed',
  width: 'calc( 100% - 2px )',
  height: '40%',
  left: 0,
  bottom: 20,
  backgroundColor: SharedStyle.PRIMARY_COLOR.alt,
  borderTop: SharedStyle.PRIMARY_COLOR.border,
  zIndex: 0,
  padding: 0,
  margin: 0,
  transition: 'all 300ms ease'
} as const;

const contentContainerStyleInactive = {
  ...contentContainerStyleActive,
  visibility: 'hidden',
  height: 0
} as const;

const contentHeaderStyle = {
  position: 'relative',
  width: '100%',
  height: '2em',
  top: 0,
  left: 0,
  borderBottom: SharedStyle.PRIMARY_COLOR.border
} as const;

const titleStyle = {
  position: 'relative',
  height: '2em',
  lineHeight: '2em',
  marginLeft: '1em'
} as const;

const contentAreaStyle = {
  position: 'relative',
  width: '100%',
  height: 'calc( 100% - 2em )',
  padding: '1em',
  overflowY: 'auto'
} as const;

const iconCloseStyleOut = {
  position: 'absolute',
  width: '2em',
  height: '2em',
  right: 0,
  top: 0,
  padding: '0.5em',
  borderLeft: SharedStyle.PRIMARY_COLOR.border,
  cursor: 'pointer'
} as const;

const iconCloseStyleOver = {
  ...iconCloseStyleOut,
  color: SharedStyle.COLORS.white,
  backgroundColor: SharedStyle.SECONDARY_COLOR.alt
} as const;

const iconStyle = {
  width: '15px',
  height: '15px',
  marginTop: '-2px',
  marginRight: '2px'
} as const;

const textStyle = {
  position: 'relative'
} as const;

interface FooterContentButtonProps {
  text: string;
  textStyle?: React.CSSProperties;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  iconStyle?: React.CSSProperties;
  content: React.ReactNode[];
  toggleState?: boolean;
  title?: string;
  titleStyle?: React.CSSProperties;
}

interface FooterContentButtonState {
  over: boolean;
  closeOver: boolean;
  active: boolean;
}

export default class FooterContentButton extends Component<FooterContentButtonProps, FooterContentButtonState> {
  static contextType = ReactPlannerContext;
  context!: React.ContextType<typeof ReactPlannerContext>;
  constructor(props, context) {
    super(props, context);

    this.state = {
      over: false,
      closeOver: false,
      active: this.props.toggleState || false
    };
  }

  toggleOver(e) { this.setState({ over: true }); }
  toggleOut(e) { this.setState({ over: false }); }

  toggle(e) {
    const isActive = !this.state.active;
    this.setState({ active: isActive });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.over != nextState.over) return true;
    if (this.state.closeOver != nextState.closeOver) return true;
    if (this.state.active != nextState.active) return true;

    if (this.props.content.length != nextProps.content.length) return true;
    if (this.props.toggleState != nextProps.toggleState) return true;

    return false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.toggleState != prevProps.toggleState)
      this.setState({ ...this.state, active: this.props.toggleState });
  }

  render() {

    const s = this.state;
    const p = this.props;

    const LabelIcon = p.icon || null;
    const labelIconStyle = p.iconStyle || {};
    const labelTextStyle = p.textStyle || {};
    const inputTitleStyle = p.titleStyle || {};

    return (
      <div style={labelContainerStyle}>
        <div
          style={s.over || s.active ? toggleButtonStyleOver : toggleButtonStyle}
          onClick={e => this.toggle(e)}
          title={p.title}
        >
          <LabelIcon style={{ ...labelIconStyle, ...iconStyle }} />
          <span style={{ ...textStyle, ...labelTextStyle }}>{p.text}</span>
        </div>
        <div style={s.active ? contentContainerStyleActive : contentContainerStyleInactive}>
          <div style={contentHeaderStyle}>
            <b style={{ ...titleStyle, ...inputTitleStyle }}>{p.title}</b>
            <IconClose
              style={s.closeOver ? iconCloseStyleOver : iconCloseStyleOut}
              onMouseOver={e => this.setState({ closeOver: true })}
              onMouseOut={e => this.setState({ closeOver: false })}
              onClick={e => this.toggle(e)}
            />
          </div>
          <div style={contentAreaStyle}>
            {p.content}
          </div>
        </div>
      </div>
    );
  }
}
