import {
  MODE_IDLE,
  MODE_3D_FIRST_PERSON,
  MODE_3D_VIEW,
  MODE_SNAPPING,
  KEYBOARD_BUTTON_CODE
} from '../constants';

import {
  rollback,
  undo,
  remove,
  toggleSnap,
  copyProperties,
  pasteProperties,
  setAlterateState
} from '../actions/project-actions';
import { State } from '../models';

export default function keyboard() {

  return (store, stateExtractor: (store: any) => State) => {

    window.addEventListener('keydown', event => {

      const state = stateExtractor(store.getState());
      const mode = state.mode;

      switch (event.keyCode) {
        case KEYBOARD_BUTTON_CODE.BACKSPACE:
        case KEYBOARD_BUTTON_CODE.DELETE:
          {
            if ([MODE_IDLE, MODE_3D_FIRST_PERSON, MODE_3D_VIEW].includes(mode))
              store.dispatch(remove());
            break;
          }
        case KEYBOARD_BUTTON_CODE.ESC:
          {
            store.dispatch(rollback());
            break;
          }
        case KEYBOARD_BUTTON_CODE.Z:
          {
            if (event.getModifierState('Control') || event.getModifierState('Meta'))
              store.dispatch(undo());
            break;
          }
        case KEYBOARD_BUTTON_CODE.ALT:
          {
            if (MODE_SNAPPING.includes(mode))
              store.dispatch(toggleSnap({
                ...state.snapMask,
                SNAP_POINT: false,
                SNAP_LINE: false,
                SNAP_SEGMENT: false,
                SNAP_GRID: false,
                SNAP_GUIDE: false,
                //tempSnapConfiguartion: state.snapMask
              }));
            break;
          }
        case KEYBOARD_BUTTON_CODE.C:
          {
            const selectedLayer = state.scene.selectedLayer;
            const selected = state.scene.layers[selectedLayer].selected;

            if ((mode === MODE_IDLE || mode === MODE_3D_VIEW) && (selected.holes.length || selected.areas.length || selected.items.length || selected.lines.length)) {
              if (selected.holes.length) {
                const hole = state.scene.layers[selectedLayer].holes[selected.holes[0]];
                store.dispatch(copyProperties(hole.properties));
              }
              else if (selected.areas.length) {
                const area = state.scene.layers[selectedLayer].areas[selected.areas[0]];
                store.dispatch(copyProperties(area.properties));
              }
              else if (selected.items.length) {
                const item = state.scene.layers[selectedLayer].items[selected.items[0]];
                store.dispatch(copyProperties(item.properties));
              }
              else if (selected.lines.length) {
                const line = state.scene.layers[selectedLayer].lines[selected.lines[0]];
                store.dispatch(copyProperties(line.properties));
              }
            }
            break;
          }
        case KEYBOARD_BUTTON_CODE.V:
          {
            store.dispatch(pasteProperties());
            break;
          }
        case KEYBOARD_BUTTON_CODE.CTRL:
          {
            store.dispatch(setAlterateState());
            break;
          }
      }

    });

    window.addEventListener('keyup', event => {

      const state = stateExtractor(store.getState());
      const mode = state.mode;

      switch (event.keyCode) {
        case KEYBOARD_BUTTON_CODE.ALT:
          {
            if (MODE_SNAPPING.includes(mode))
              store.dispatch(toggleSnap({
                ...state.snapMask,
                //...state.snapMask.tempSnapConfiguartion
              }));
            break;
          }
        case KEYBOARD_BUTTON_CODE.CTRL:
          {
            store.dispatch(setAlterateState());
            break;
          }
      }

    });

  }
}
