import { Layer, Group } from './export';
import {
  IDBroker,
  NameGenerator
} from '../utils/export';

import {
  MODE_IDLE,
  MODE_DRAWING_ITEM,
  MODE_DRAGGING_ITEM,
  MODE_ROTATING_ITEM
} from '../constants';
import { produce } from 'immer';
import { State, Item as ItemModel, catalogElementFactory } from '../models';

class Item {

  static create(state: State, layerID: string, type: string, x: number, y: number, width: number, height: number, rotation: number) {
    const itemID = IDBroker.acquireID();

    const item = catalogElementFactory(state.catalog, type, {
      id: itemID,
      name: NameGenerator.generateName('items', state.catalog.elements[type].info.title),
      type,
      height,
      width,
      x,
      y,
      rotation
    }) as ItemModel;

    const updatedState = produce(state, draft => {
      draft.scene.layers[layerID].items[itemID] = item;
    });

    return { updatedState, item };
  }

  static select(state: State, layerID: string, itemID: string) {
    state = Layer.select(state, layerID);
    state = Layer.selectElement(state, layerID, 'items', itemID);
    return state;
  }

  static remove(state: State, layerID: string, itemID: string) {
    return produce(state, draft => {
      draft = this.unselect(draft, layerID, itemID);
      draft = Layer.removeElement(draft, layerID, 'items', itemID);
      Object.values(draft.scene.groups).forEach(group => {
        draft = Group.removeElement(draft, group.id, layerID, 'items', itemID);
      });
      return draft;
    });
  }

  static unselect(state: State, layerID: string, itemID: string) {
    return Layer.unselect(state, layerID, 'items', itemID);
  }

  static selectToolDrawingItem(state: State, sceneComponentType: string) {
    return produce(state, draft => {
      draft.mode = MODE_DRAWING_ITEM;
      draft.drawingSupport = {
        type: sceneComponentType
      };
    });
  }

  static updateDrawingItem(state: State, layerID: string, x: number, y: number) {
    if (state.drawingSupport.currentID) {
      return produce(state, draft => {
        const item = draft.scene.layers[layerID]?.items[draft.drawingSupport.currentID];
        if (item) {
          item.x = x;
          item.y = y;
        }
      });
    } else {
      const { updatedState: stateI, item } = this.create(state, layerID, state.drawingSupport.type, x, y, 200, 100, 0);
      state = Item.select(stateI, layerID, item.id);
      //draft.drawingSupport.currentID = item.id;
      //draft = { ...draft, drawingSupport: { ...draft.drawingSupport, currentID: item.id } };
      return produce(state, draft => {
        draft.drawingSupport.currentID = item.id;
      });
    }
  }

  static endDrawingItem(state: State, layerID: string, x: number, y: number) {
    state = this.updateDrawingItem(state, layerID, x, y);
    state = Layer.unselectAll(state, layerID);
    return produce(state, draft => {
      draft.drawingSupport = { type: draft.drawingSupport.type };
    });;
  }

  static beginDraggingItem(state: State, layerID: string, itemID: string, x: number, y: number) {
    return produce(state, draft => {
      const item = draft.scene.layers[layerID]?.items[itemID];
      if (item) {
        draft.mode = MODE_DRAGGING_ITEM;
        draft.draggingSupport = {
          layerID,
          itemID,
          startPointX: x,
          startPointY: y,
          originalX: item.x,
          originalY: item.y
        };
      }
    });
  }

  static updateDraggingItem(state: State, x: number, y: number) {
    return produce(state, draft => {
      const { layerID, itemID, startPointX, startPointY, originalX, originalY } = draft.draggingSupport;
      const layer = draft.scene.layers[layerID];
      const item = layer?.items[itemID];
      if (layer && item) {
        const deltaX = x - startPointX;
        const deltaY = y - startPointY;
        item.x = originalX + deltaX;
        item.y = originalY + deltaY;
      }
    });
  }

  static endDraggingItem(state: State, x: number, y: number) {
    return produce(state, draft => {
      const { layerID, itemID, startPointX, startPointY, originalX, originalY } = draft.draggingSupport;
      const layer = draft.scene.layers[layerID];
      const item = layer?.items[itemID];
      if (layer && item) {
        const deltaX = x - startPointX;
        const deltaY = y - startPointY;
        item.x = originalX + deltaX;
        item.y = originalY + deltaY;
      }
      draft.mode = MODE_IDLE;
      draft.draggingSupport = {};
    });
  }

  static beginRotatingItem(state: State, layerID: string, itemID: string, x: number, y: number) {
    return produce(state, draft => {
      draft.mode = MODE_ROTATING_ITEM;
      draft.rotatingSupport = {
        layerID,
        itemID
      };
    });
  }

  static updateRotatingItem(state: State, x: number, y: number) {
    return produce(state, draft => {
      const { rotatingSupport } = draft;
      const layerID = rotatingSupport.layerID;
      const itemID = rotatingSupport.itemID;
      const item = draft.scene.layers[layerID].items[itemID];

      const deltaX = x - item.x;
      const deltaY = y - item.y;
      let rotation = Math.atan2(deltaY, deltaX) * 180 / Math.PI - 90;

      if (-5 < rotation && rotation < 5) rotation = 0;
      if (-95 < rotation && rotation < -85) rotation = -90;
      if (-185 < rotation && rotation < -175) rotation = -180;
      if (85 < rotation && rotation < 90) rotation = 90;
      if (-270 < rotation && rotation < -265) rotation = 90;

      item.rotation = rotation;
    });
  }

  static endRotatingItem(state: State, x: number, y: number) {
    state = this.updateRotatingItem(state, x, y);
    return produce(state, draft => {
      draft.mode = MODE_IDLE;
    });
  }

  static setProperties(state: State, layerID: string, itemID: string, properties: any) {
    return produce(state, draft => {
      draft.scene.layers[layerID].items[itemID].properties = properties;
    });
  }

  static setJsProperties(state: State, layerID: string, itemID: string, properties: any) {
    return this.setProperties(state, layerID, itemID, properties);
  }

  static updateProperties(state: State, layerID: string, itemID: string, properties: Record<string, any>) {
    return produce(state, draft => {
      const item = draft.scene.layers[layerID]?.items[itemID];
      if (item) {
        Object.entries(properties).forEach(([key, value]) => {
          if (item.properties[key] !== undefined) {
            item.properties[key] = value;
          }
        });
      }
    });
  }

  static updateJsProperties(state: State, layerID: string, itemID: string, properties: any) {
    return this.updateProperties(state, layerID, itemID, properties);
  }

  static setAttributes(state: State, layerID: string, itemID: string, attributes: any) {
    return produce(state, draft => {
      const item = draft.scene.layers[layerID]?.items[itemID];
      if (item) {
        Object.assign(item, attributes);
      }
    });
  }
}

export { Item as default };
