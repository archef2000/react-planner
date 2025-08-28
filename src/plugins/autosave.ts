const localStorage = window.hasOwnProperty('localStorage') ? window.localStorage : false;
import { loadProject } from '../actions/project-actions';

const TIMEOUT_DELAY = 500;

let timeout = null;

export default function autosave(autosaveKey, delay = TIMEOUT_DELAY) {

  return (store, stateExtractor) => {
    if (!autosaveKey) return;
    if (!localStorage) return;

    //revert
    if (localStorage.getItem(autosaveKey) !== null) {
      const data = localStorage.getItem(autosaveKey);
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
