import React, { Component } from 'react';
import { MdNavigateBefore } from 'react-icons/md';
import * as SharedStyle from '../../shared-style';
import ReactPlannerContext from '../../react-planner-context';

const STYLE_BOX = {
  width: '14em',
  height: '14em',
  padding: '0.625em',
  background: '#f7f7f9',
  border: '1px solid #e1e1e8',
  margin: '0.3em',
  cursor: 'pointer',
  position: 'relative',
  boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.11), 0 1px 4px 0 rgba(0, 0, 0, 0.11)',
  borderRadius: '2px',
  transition: 'all .2s ease-in-out',
  WebkitTransition: 'all .2s ease-in-out'
} as const;

const STYLE_BOX_HOVER = {
  ...STYLE_BOX,
  background: SharedStyle.SECONDARY_COLOR.main
} as const;

const STYLE_BACK = {
  position: 'absolute',
  color: SharedStyle.COLORS.black,
  fontSize: '5em',
  width: '100%'
} as const;

const STYLE_BACK_HOVER = {
  ...STYLE_BACK,
  color: SharedStyle.SECONDARY_COLOR.main
} as const;

const CONTAINER_DIV = {
  background: SharedStyle.COLORS.white,
  marginBottom: '5px',
  border: 'solid 1px #e6e6e6',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
} as const;

interface CatalogTurnBackPageItemProps {
  page: {
    name: string;
    label: string;
    [key: string]: any;
  };
}

interface CatalogTurnBackPageItemState {
  hover: boolean;
}

export default class CatalogTurnBackPageItem extends Component<CatalogTurnBackPageItemProps, CatalogTurnBackPageItemState> {
  static contextType = ReactPlannerContext;
  context!: React.ContextType<typeof ReactPlannerContext>;

  constructor(props, context) {
    super(props, context);
    this.state = { hover: false };
  }

  changePage(newPage) {
    this.context.projectActions.goBackToCatalogPage(newPage)
  }

  render() {
    const page = this.props.page;
    const hover = this.state.hover;

    return (
      <div
        style={hover ? STYLE_BOX_HOVER : STYLE_BOX}
        onClick={e => this.changePage(page.name)}
        onMouseEnter={e => this.setState({ hover: true })}
        onMouseLeave={e => this.setState({ hover: false })}
      >
        <div style={CONTAINER_DIV}>
          <MdNavigateBefore style={!hover ? STYLE_BACK : STYLE_BACK_HOVER} />
        </div>

      </div>
    );
  }
}
