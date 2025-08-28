import React from 'react';
import { createRoot } from 'react-dom/client';
import useMeasure from 'react-use-measure';
import { configureStore, isPlain, createSerializableStateInvariantMiddleware } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import MyCatalog, { createCatalog } from './catalog/mycatalog';

import ToolbarScreenshotButton from './ui/toolbar-screenshot-button';

import {
  Models as PlannerModels,
  reducer as PlannerReducer,
  ReactPlanner,
  Plugins as PlannerPlugins,
} from '@archef2000/react-planner';
import { produce } from 'immer';

//define state
const AppState = {
  'react-planner': PlannerModels.State()
};

//define reducer
const reducer = (state: { [key: string]: any } | undefined, action: any) => {
  state = state || AppState;
  state = produce(state, draft => {
    draft['react-planner'] = PlannerReducer(draft['react-planner'], action);
  });
  return state;
};


const isProduction = process.env.NODE_ENV === 'production';

// Block specific actions in Redux DevTools
const devToolsActionsDenylist = [
  'UPDATE_MOUSE_COORDS',
  'UPDATE_ZOOM_SCALE',
  'UPDATE_2D_CAMERA',
];

if (!isProduction) {
  console.info('Environment is in development and these actions will be blacklisted', devToolsActionsDenylist);
}

const isSerializable = (value: any) =>
  typeof value === "function" || isPlain(value) // TODO: only exclude renderes: https://redux-toolkit.js.org/api/serializabilityMiddleware

const serializableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable,
})

const middleware = process.env.NODE_ENV !== 'production' ?
  [serializableMiddleware] :
  [];

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: true,
    immutableCheck: true,
    serializableCheck: false,
    actionCreatorCheck: true,
  }).concat(),
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
  devTools: {
    actionsDenylist: devToolsActionsDenylist,
    maxAge: 10000,
  },
  /*
  !isProduction && (window as any).devToolsExtension ?
    (window as any).devToolsExtension({
      features: {
        pause: true,     // start/pause recording of dispatched actions
        lock: true,     // lock/unlock dispatching actions and side effects
        persist: true,     // persist states on page reloading
        export: true,     // export history of actions in a file
        import: 'custom', // import history of actions from a file
        jump: true,     // jump back and forth (time travelling)
        skip: true,     // skip (cancel) actions
        reorder: true,     // drag and drop actions in the history list
        dispatch: true,     // dispatch custom actions or action creators
        test: true      // generate tests for the selected actions
      },
      maxAge: 99999999,
      actionsDenylist: devToolsActionsDenylist,
    }) :
    f => f,
    */
  ...((window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__({
    maxAge: 10000,
    actionsDenylist: devToolsActionsDenylist,
  }))
});

const plugins = [
  PlannerPlugins.Keyboard(),
  PlannerPlugins.Autosave('react-planner_v0'),
  PlannerPlugins.ConsoleDebugger(),
];

const toolbarButtons = [
  ToolbarScreenshotButton,
];

// Component that uses useMeasure hook
function ResponsiveReactPlanner() {
  const [ref, bounds] = useMeasure();

  const catalog = createCatalog();

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      {bounds.width > 0 && bounds.height > 0 && (
        <ReactPlanner
          catalog={catalog}
          width={bounds.width}
          height={bounds.height}
          plugins={plugins}
          toolbarButtons={toolbarButtons}
          stateExtractor={state => state["react-planner"]}
        />
      )}
    </div>
  );
}

//render
const container = document.getElementById('app');
if (!container) {
  throw new Error('Container element not found');
}

// Reuse a single React root across HMR updates
const globalAny = globalThis as any;
const ROOT_KEY = '__REACT_PLANNER_DEMO_ROOT__';
const root = globalAny[ROOT_KEY] || (globalAny[ROOT_KEY] = createRoot(container));

root.render(
  <Provider store={store}>
    <ResponsiveReactPlanner />
  </Provider>
);


// Optional: clean up on hot dispose (will recreate root on next replace)
if ((module as any)?.hot) {
  try {
    (module as any).hot.dispose(() => {
      // Keep the root to avoid flicker; uncomment to fully unmount on replace
      root.unmount();
      delete globalAny[ROOT_KEY];
    });
  } catch { }
}


