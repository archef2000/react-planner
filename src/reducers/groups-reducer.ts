import { Group } from '../class/export';
import {
  ADD_GROUP,
  ADD_GROUP_FROM_SELECTED,
  ADD_TO_GROUP,
  GROUP_ROTATE,
  GROUP_TRANSLATE,
  REMOVE_FROM_GROUP,
  REMOVE_GROUP,
  REMOVE_GROUP_AND_DELETE_ELEMENTS,
  SELECT_GROUP,
  SET_GROUP_ATTRIBUTES,
  SET_GROUP_BARYCENTER,
  SET_GROUP_PROPERTIES,
  UNSELECT_GROUP
} from '../constants';
import { GroupElementPrototypes, Group as GroupModel, State } from '../models';
import { history } from '../utils/export';

export type AppGroupAction = {
  type: typeof ADD_GROUP;
};

export type AddGroupFromSelectedAction = {
  type: typeof ADD_GROUP_FROM_SELECTED;
};

export type SelectGroupAction = {
  type: typeof SELECT_GROUP;
  groupID: string;
};

export type UnselectGroupAction = {
  type: typeof UNSELECT_GROUP;
  groupID: string;
};

export type AddToGroupAction = {
  type: typeof ADD_TO_GROUP;
  groupID: string;
  layerID: string;
  elementPrototype: GroupElementPrototypes;
  elementID: string;
};

export type RemoveFromGroupAction = {
  type: typeof REMOVE_FROM_GROUP;
  groupID: string;
  layerID: string;
  elementPrototype: GroupElementPrototypes;
  elementID: string;
};

export type SetGroupAttributesAction = {
  type: typeof SET_GROUP_ATTRIBUTES;
  groupID: string;
  attributes: Partial<GroupModel>;
};

export type SetGroupPropertiesAction = {
  type: typeof SET_GROUP_PROPERTIES;
  groupID: string;
  properties: GroupModel['properties'];
};

export type SetGroupBarycenterAction = {
  type: typeof SET_GROUP_BARYCENTER;
  groupID: string;
  barycenter: { x: number; y: number };
};

export type RemoveGroupAction = {
  type: typeof REMOVE_GROUP;
  groupID: string;
};

export type RemoveGroupAndDeleteElementsAction = {
  type: typeof REMOVE_GROUP_AND_DELETE_ELEMENTS;
  groupID: string;
};

export type GroupTranslateAction = {
  type: typeof GROUP_TRANSLATE;
  groupID: string;
  x: number;
  y: number;
};

export type GroupRotateAction = {
  type: typeof GROUP_ROTATE;
  groupID: string;
  rotation: number;
};

export type GroupAction =
  | AppGroupAction
  | AddGroupFromSelectedAction
  | SelectGroupAction
  | UnselectGroupAction
  | AddToGroupAction
  | RemoveFromGroupAction
  | SetGroupAttributesAction
  | SetGroupPropertiesAction
  | SetGroupBarycenterAction
  | RemoveGroupAction
  | RemoveGroupAndDeleteElementsAction
  | GroupTranslateAction
  | GroupRotateAction;

export default function groupsReducer(
  state: State,
  action: GroupAction
): State {
  state = {
    ...state,
    sceneHistory: history.historyPush(state.sceneHistory, state.scene)
  };

  switch (action.type) {
    case ADD_GROUP:
      return Group.create(state);

    case ADD_GROUP_FROM_SELECTED:
      return Group.createFromSelectedElements(state);

    case SELECT_GROUP:
      return Group.select(state, action.groupID);

    case UNSELECT_GROUP:
      return Group.unselect(state, action.groupID);

    case ADD_TO_GROUP:
      return Group.addElement(
        state,
        action.groupID,
        action.layerID,
        action.elementPrototype,
        action.elementID
      );

    case REMOVE_FROM_GROUP:
      return Group.removeElement(
        state,
        action.groupID,
        action.layerID,
        action.elementPrototype,
        action.elementID
      );

    case SET_GROUP_ATTRIBUTES:
      return Group.setAttributes(state, action.groupID, action.attributes);

    case SET_GROUP_PROPERTIES:
      return Group.setProperties(state, action.groupID, action.properties);

    case SET_GROUP_BARYCENTER:
      return Group.setBarycenter(
        state,
        action.groupID,
        action.barycenter.x,
        action.barycenter.y
      );

    case REMOVE_GROUP:
      return Group.remove(state, action.groupID);

    case REMOVE_GROUP_AND_DELETE_ELEMENTS:
      return Group.removeAndDeleteElements(state, action.groupID);

    case GROUP_TRANSLATE:
      return Group.translate(state, action.groupID, action.x, action.y);

    case GROUP_ROTATE:
      return Group.rotate(state, action.groupID, action.rotation);

    default:
      return state;
  }
}
