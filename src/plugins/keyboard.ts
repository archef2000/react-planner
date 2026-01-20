import { Store } from 'redux';

import {
  copyProperties,
  pasteProperties,
  remove,
  rollback,
  setAlterateState,
  toggleSnap,
  undo
} from '../actions/project-actions';
import {
  KEYBOARD_BUTTON_CODE,
  MODE_3D_FIRST_PERSON,
  MODE_3D_VIEW,
  MODE_IDLE,
  MODE_SNAPPING
} from '../constants';
import { State } from '../models';

export default function keyboard() {
  return (store: Store, stateExtractor: (state: any) => State) => {
    function window_keydown_event_handler(event: KeyboardEvent) {
      const state = stateExtractor(store.getState());
      const mode = state.mode;

      switch (event.keyCode) {
        case KEYBOARD_BUTTON_CODE.BACKSPACE:
        case KEYBOARD_BUTTON_CODE.DELETE: {
          if ([MODE_IDLE, MODE_3D_FIRST_PERSON, MODE_3D_VIEW].includes(mode))
            store.dispatch(remove());
          break;
        }
        case KEYBOARD_BUTTON_CODE.ESC: {
          store.dispatch(rollback());
          break;
        }
        case KEYBOARD_BUTTON_CODE.Z: {
          if (
            event.getModifierState('Control') ||
            event.getModifierState('Meta')
          )
            store.dispatch(undo());
          break;
        }
        case KEYBOARD_BUTTON_CODE.ALT: {
          if (MODE_SNAPPING.includes(mode))
            store.dispatch(
              toggleSnap({
                ...state.snapMask,
                SNAP_POINT: false,
                SNAP_LINE: false,
                SNAP_SEGMENT: false,
                SNAP_GRID: false,
                SNAP_GUIDE: false
                //tempSnapConfiguartion: state.snapMask
              })
            );
          break;
        }
        case KEYBOARD_BUTTON_CODE.C: {
          if (
            event.getModifierState('Control') ||
            event.getModifierState('Meta')
          ) {
            break;
          }
          const selectedLayer = state.scene.selectedLayer;
          if (selectedLayer === undefined) break;
          const selected = state.scene.layers[selectedLayer].selected;

          if (
            (mode === MODE_IDLE || mode === MODE_3D_VIEW) &&
            (selected.holes.length ||
              selected.areas.length ||
              selected.items.length ||
              selected.lines.length)
          ) {
            if (selected.holes.length) {
              const hole =
                state.scene.layers[selectedLayer].holes[selected.holes[0]];
              store.dispatch(copyProperties(hole.properties));
            } else if (selected.areas.length) {
              const area =
                state.scene.layers[selectedLayer].areas[selected.areas[0]];
              store.dispatch(copyProperties(area.properties));
            } else if (selected.items.length) {
              const item =
                state.scene.layers[selectedLayer].items[selected.items[0]];
              store.dispatch(copyProperties(item.properties));
            } else if (selected.lines.length) {
              const line =
                state.scene.layers[selectedLayer].lines[selected.lines[0]];
              store.dispatch(copyProperties(line.properties));
            }
          }
          break;
        }
        case KEYBOARD_BUTTON_CODE.V: {
          if (
            event.getModifierState('Control') ||
            event.getModifierState('Meta')
          ) {
            break;
          }
          store.dispatch(pasteProperties());
          break;
        }
        case KEYBOARD_BUTTON_CODE.CTRL: {
          if (!state.alterate) {
            store.dispatch(setAlterateState(true));
          }
          break;
        }
      }
    }
    window.addEventListener('keydown', window_keydown_event_handler);

    function window_keyup_event_handler(event: KeyboardEvent) {
      const state = stateExtractor(store.getState());
      const mode = state.mode;

      switch (event.keyCode) {
        case KEYBOARD_BUTTON_CODE.ALT: {
          if (MODE_SNAPPING.includes(mode))
            store.dispatch(
              toggleSnap({
                ...state.snapMask
                //...state.snapMask.tempSnapConfiguartion
              })
            );
          break;
        }
        case KEYBOARD_BUTTON_CODE.CTRL: {
          store.dispatch(setAlterateState(false));
          break;
        }
      }
    }
    window.addEventListener('keyup', window_keyup_event_handler);

    return () => {
      window.removeEventListener('keydown', window_keydown_event_handler);
      window.removeEventListener('keyup', window_keyup_event_handler);
    };
  };
}
