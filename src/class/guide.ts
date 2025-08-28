import { IDBroker } from '../utils/export';
import { produce } from 'immer';
import { State } from '../models';

class HorizontalGuide {
  static create(state: State, coordinate: number) {
    return produce(state, draft => {
      const hGuideID = IDBroker.acquireID();
      draft.scene.guides.horizontal[hGuideID] = coordinate;
    });
  }

  static remove(state: State, hGuideID: string) {
    return produce(state, draft => {
      delete draft.scene.guides.horizontal[hGuideID];
    });
  }
}

class VerticalGuide {
  static create(state: State, coordinate: number) {
    return produce(state, draft => {
      const vGuideID = IDBroker.acquireID();
      draft.scene.guides.vertical[vGuideID] = coordinate;
    });
  }

  static remove(state: State, vGuideID: string) {
    return produce(state, draft => {
      delete draft.scene.guides.vertical[vGuideID];
    });
  }
}

class CircularGuide {
}

export {
  HorizontalGuide,
  VerticalGuide,
  CircularGuide
};

export default {
  HorizontalGuide,
  VerticalGuide,
  CircularGuide
};
