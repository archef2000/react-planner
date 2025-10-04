const localStorage = window.hasOwnProperty('localStorage')
  ? window.localStorage
  : false;
import { Store } from 'redux';

import { ReactPlannerStateExtractor } from '..';
import { loadProject } from '../actions/project-actions';

const TIMEOUT_DELAY = 500;

let timeout: NodeJS.Timeout | null = null;

export default function autosave(autosaveKey: string, delay = TIMEOUT_DELAY) {
  return (store: Store, stateExtractor: ReactPlannerStateExtractor) => {
    if (!autosaveKey) return;
    if (!localStorage) return;

    //revert
    if (autosaveKey in localStorage) {
      const data = localStorage[autosaveKey];
      const json = JSON.parse(data);
      store.dispatch(loadProject(json));
    }

    //update
    store.subscribe(() => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const state = stateExtractor(store.getState());
        localStorage.setItem(autosaveKey, JSON.stringify(state.scene));
        /*let scene = state.sceneHistory.last;
        if (scene) {
          let json = JSON.stringify(scene.toJS());
          localStorage.setItem(autosaveKey, json);
        }*/
      }, delay);
    });
  };
}
