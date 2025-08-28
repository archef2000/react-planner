import React, { Component } from 'react';
import CatalogItem from './catalog-item';
import CatalogBreadcrumb from './catalog-breadcrumb';
import CatalogPageItem from './catalog-page-item';
import CatalogTurnBackPageItem from './catalog-turn-back-page-item';
import ContentContainer from '../style/content-container';
import ContentTitle from '../style/content-title';
import * as SharedStyle from '../../shared-style';
import ReactPlannerContext, { ReactPlannerContextProps } from '../../react-planner-context';

const containerStyle = {
  position: 'fixed',
  width: 'calc( 100% - 51px)',
  height: 'calc( 100% - 20px)',
  backgroundColor: '#FFF',
  padding: '1em',
  left: 50,
  overflowY: 'auto',
  overflowX: 'hidden',
  zIndex: 10
} as const;

const itemsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(14em, 1fr))',
  gridGap: '10px',
  marginTop: '1em'
} as const;

const searchContainer = {
  width: '100%',
  height: '3em',
  padding: '0.625em',
  background: '#f7f7f9',
  border: '1px solid #e1e1e8',
  cursor: 'pointer',
  position: 'relative',
  boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.11), 0 1px 4px 0 rgba(0, 0, 0, 0.11)',
  borderRadius: '2px',
  transition: 'all .2s ease-in-out',
  WebkitTransition: 'all .2s ease-in-out',
  marginBottom: '1em'
} as const;

const searchText = {
  width: '8em',
  display: 'inline-block'
} as const;

const searchInput = {
  width: 'calc( 100% - 10em )',
  height: '2em',
  margin: '0',
  padding: '0 1em',
  border: '1px solid #EEE'
} as const;

const historyContainer = {
  ...searchContainer,
  padding: '0.2em 0.625em'
} as const;

const historyElementStyle = {
  width: 'auto',
  height: '2em',
  lineHeight: '2em',
  textAlign: 'center',
  borderRadius: '1em',
  display: 'inline-block',
  cursor: 'pointer',
  backgroundColor: SharedStyle.PRIMARY_COLOR.alt,
  color: SharedStyle.PRIMARY_COLOR.text_main,
  textTransform: 'capitalize',
  margin: '0.25em',
  padding: '0 1em'
} as const;
import { State } from '../../models';
import { CatalogFn } from '../../catalog/catalog';

interface CatalogListProps {
  state: State;
  width: number;
  height: number;
  style?: any;
}

interface CatalogListState {
  categories: any[];
  elements: any[];
  matchString: string;
  matchedElements: any[];
}

export default class CatalogList extends Component<CatalogListProps, CatalogListState> {
  static contextType = ReactPlannerContext;
  context!: React.ContextType<typeof ReactPlannerContext>;

  constructor(props: CatalogListProps, context: ReactPlannerContextProps) {
    super(props, context);

    const page = props.state.catalog.page;
    const currentCategory = CatalogFn.getCategory(context.catalog, page);
    const categoriesToDisplay = currentCategory.categories;
    const elementsToDisplay = currentCategory.elements.filter(element => element.info.visibility ? element.info.visibility.catalog : true);

    this.state = {
      categories: currentCategory.categories,
      elements: elementsToDisplay,
      matchString: '',
      matchedElements: []
    };
  }

  flattenCategories(categories) {
    let toRet = [];

    for (let x = 0; x < categories.length; x++) {
      const curr = categories[x];
      toRet = toRet.concat(curr.elements);
      if (curr.categories.length) toRet = toRet.concat(this.flattenCategories(curr.categories));
    }

    return toRet;
  }

  matcharray(text) {

    const array = this.state.elements.concat(this.flattenCategories(this.state.categories));

    const filtered = [];

    if (text != '') {
      const regexp = new RegExp(text, 'i');
      for (let i = 0; i < array.length; i++) {
        if (regexp.test(array[i].info.title)) {
          filtered.push(array[i]);
        }
      }
    }

    this.setState({
      matchString: text,
      matchedElements: filtered
    });
  };

  select(element) {

    switch (element.prototype) {
      case 'lines':
        this.context.linesActions.selectToolDrawingLine(element.name);
        break;
      case 'items':
        this.context.itemsActions.selectToolDrawingItem(element.name);
        break;
      case 'holes':
        this.context.holesActions.selectToolDrawingHole(element.name);
        break;
    }

    this.context.projectActions.pushLastSelectedCatalogElementToHistory(element);
  }

  render() {

    const page = this.props.state.catalog.page;
    const currentCategory = CatalogFn.getCategory(this.context.catalog, page);
    const categoriesToDisplay = currentCategory.categories;
    const elementsToDisplay = currentCategory.elements.filter(element => element.info.visibility ? element.info.visibility.catalog : true);

    let breadcrumbComponent = null;

    if (page !== 'root') {

      const breadcrumbsNames = [];

      this.props.state.catalog.path.forEach(pathName => {
        breadcrumbsNames.push({
          name: CatalogFn.getCategory(this.context.catalog, pathName).label,
          action: () => this.context.projectActions.goBackToCatalogPage(pathName)
        });
      });

      breadcrumbsNames.push({ name: currentCategory.label, action: '' });

      breadcrumbComponent = (<CatalogBreadcrumb names={breadcrumbsNames} />);
    }

    const pathSize = this.props.state.catalog.path.length;

    const turnBackButton = pathSize > 0 ? (
      <CatalogTurnBackPageItem key={pathSize} page={this.context.catalog.categories[this.props.state.catalog.path[pathSize - 1]]} />) : null;


    const selectedHistory = this.props.state.selectedElementsHistory;
    const selectedHistoryElements = selectedHistory.map((el, ind) =>
      <div key={ind} style={historyElementStyle} title={el.name} onClick={() => this.select(el)}>{el.name}</div>
    );

    return (
      <ContentContainer width={this.props.width} height={this.props.height} style={{ ...containerStyle, ...this.props.style }}>
        <ContentTitle>{this.context.translator.t('Catalog')}</ContentTitle>
        {breadcrumbComponent}
        <div style={searchContainer}>
          <span style={searchText}>{this.context.translator.t('Search Element')}</span>
          <input type="text" style={searchInput} onChange={(e) => { this.matcharray(e.target.value); }} />
        </div>
        {selectedHistory.length ?
          <div style={historyContainer}>
            <span>{this.context.translator.t('Last Selected')}</span>
            {selectedHistoryElements}
          </div> :
          null
        }
        <div style={itemsStyle}>
          {
            this.state.matchString === '' ? [
              turnBackButton,
              categoriesToDisplay.map(cat => <CatalogPageItem key={cat.name} page={cat} oldPage={currentCategory} />),
              elementsToDisplay.map(elem => <CatalogItem key={elem.name} element={elem} />)
            ] :
              this.state.matchedElements.map(elem => <CatalogItem key={elem.name} element={elem} />)
          }
        </div>
      </ContentContainer>
    )
  }
}
