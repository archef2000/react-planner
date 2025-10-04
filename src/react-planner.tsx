import React, { useContext, useEffect } from 'react';

import { enableMapSet } from 'immer';
import { connect, ReactReduxContext } from 'react-redux';
import { bindActionCreators, Dispatch, Store } from 'redux';

import actions, {
  AreaActionsType,
  GroupsActionsType,
  HolesActionsType,
  ItemsActionsType,
  LinesActionsType,
  ProjectActionsType,
  SceneActionsType,
  VerticesActionsType,
  Viewer2DActionsType,
  Viewer3DActionsType
} from './actions/export';
import { CatalogFactory, CatalogJson } from './catalog/catalog';
import Content from './components/content';
import FooterBar from './components/footerbar/footerbar';
import Sidebar from './components/sidebar/sidebar';
import Toolbar from './components/toolbar/toolbar';
import ReactPlannerContext from './react-planner-context';
import './styles/export';
import Translator from './translator/translator';
import { ReactPlannerPlugin, ReactPlannerStateExtractor } from './types';
import { objectsMap } from './utils/objects-utils';
import { VERSION } from './version';

enableMapSet();

const toolbarW = 50;
const sidebarW = 300;
const footerBarH = 20;

const wrapperStyle = {
  display: 'flex',
  flexFlow: 'row nowrap'
};

interface ReactPlannerOptionalProps {
  translator: Translator;
  catalog: CatalogJson;
  allowProjectFileSupport: boolean;
  toolbarButtons: any[];
  sidebarComponents: [];
  customContents: {};
  softwareSignature: string; // `React Planner ${VERSION}`
  footerbarComponents: [];
  customOverlays: { [key: string]: React.ComponentType<any> }[];
  customActions: { [key: string]: any };
}

interface ReactPlannerExternalProps {
  plugins: ReactPlannerPlugin[];
  autosaveKey?: string;
  autosaveDelay?: number;
  width: number;
  height: number;
  stateExtractor: ReactPlannerStateExtractor;
}

interface ReactPlannerInternalProps {
  projectActions: ProjectActionsType;
  viewer2DActions: Viewer2DActionsType;
  viewer3DActions: Viewer3DActionsType;
  linesActions: LinesActionsType;
  holesActions: HolesActionsType;
  sceneActions: SceneActionsType;
  verticesActions: VerticesActionsType;
  itemsActions: ItemsActionsType;
  areaActions: AreaActionsType;
  groupsActions: GroupsActionsType;
}

type ExternalReactPlannerProps = ReactPlannerExternalProps &
  Partial<ReactPlannerOptionalProps>;
type ReactPlannerProps = ReactPlannerInternalProps &
  ReactPlannerExternalProps &
  Partial<ReactPlannerOptionalProps>;
type InternalReactPlannerProps = ReactPlannerInternalProps &
  ReactPlannerExternalProps &
  ReactPlannerOptionalProps;

function ReactPlanner(props: InternalReactPlannerProps) {
  const { width, height, stateExtractor, ...restProps } = props;

  const context = useContext(ReactReduxContext);
  if (!context)
    throw new Error(
      'ReactPlanner must be used inside a <Provider> component from react-redux library'
    );

  useEffect(() => {
    const store = context.store;
    const { projectActions, catalog, stateExtractor, plugins } = props;
    plugins.forEach((plugin) => plugin(store, stateExtractor));
    projectActions.initCatalog(catalog);
  }, []);

  useEffect(() => {
    const { stateExtractor, projectActions, catalog } = props;
    const state = context.store.getState();
    const plannerState = stateExtractor(state);
    const catalogReady = plannerState.catalog.ready;
    if (!catalogReady) {
      projectActions.initCatalog(catalog);
    }
  }, [props]);

  const state = context.store.getState();

  const contentW = width - toolbarW - sidebarW;
  const toolbarH = height - footerBarH;
  const contentH = height - footerBarH;
  const sidebarH = height - footerBarH;

  const extractedState = stateExtractor(state);

  return (
    <div style={{ ...wrapperStyle, height }}>
      <Toolbar
        {...restProps}
        width={toolbarW}
        height={toolbarH}
        state={extractedState}
      />
      <Content
        {...restProps}
        width={contentW}
        height={contentH}
        state={extractedState}
      />{' '}
      {/* onWheel={event => event.preventDefault()} */}
      <Sidebar
        {...restProps}
        width={sidebarW}
        height={sidebarH}
        state={extractedState}
      />
      <FooterBar
        {...restProps}
        width={width}
        height={footerBarH}
        state={extractedState}
      />
    </div>
  );
}

//redux connect
function mapStateToProps(reduxState: Store) {
  return {
    state: reduxState
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return objectsMap(actions, (actionNamespace) =>
    bindActionCreators(actions[actionNamespace], dispatch)
  );
}

function ReactPlannerWrapper(tempProps: ReactPlannerProps) {
  const {
    translator = new Translator(),
    catalog = CatalogFactory(),
    allowProjectFileSupport = true,
    toolbarButtons = [],
    sidebarComponents = [],
    footerbarComponents = [],
    customContents = {},
    customOverlays = [],
    customActions = {},
    softwareSignature = `React-Planner ${VERSION}`,
    ...otherProps
  } = tempProps;
  const props = {
    ...otherProps,
    translator,
    catalog,
    allowProjectFileSupport,
    toolbarButtons,
    sidebarComponents,
    footerbarComponents,
    customContents,
    customOverlays,
    customActions,
    softwareSignature
  } as InternalReactPlannerProps;
  return (
    <ReactPlannerContext.Provider value={{ ...props }}>
      <ReactPlanner {...props} />
    </ReactPlannerContext.Provider>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactPlannerWrapper as React.ComponentType<ExternalReactPlannerProps>);
