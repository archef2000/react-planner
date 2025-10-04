import { produce } from 'immer';

import {
  GroupElement,
  GroupElementPrototypes,
  Group as GroupModel,
  State
} from '../models';
import { GeometryUtils, IDBroker } from '../utils/export';

import { Area, Hole, Item, Layer, Line, Project } from './export';

class Group {
  static select(state: State, groupID: string) {
    state = Project.setAlterate(state);
    const group = state.scene.groups[groupID];
    if (!group) return state;

    const layerList = group.elements;
    for (const [groupLayerID, groupLayerElements] of Object.entries(
      layerList
    )) {
      state = Layer.unselectAll(state, groupLayerID);
      const lines = groupLayerElements.lines;
      const holes = groupLayerElements.holes;
      const items = groupLayerElements.items;
      const areas = groupLayerElements.areas;
      lines.forEach((lineID) => {
        state = Line.select(state, groupLayerID, lineID);
      });
      holes.forEach((holeID) => {
        state = Hole.select(state, groupLayerID, holeID);
      });
      items.forEach((itemID) => {
        state = Item.select(state, groupLayerID, itemID);
      });
      areas.forEach((areaID) => {
        state = Area.select(state, groupLayerID, areaID);
      });
    }

    state = Project.setAlterate(state);

    return produce(state, (draft) => {
      const groups = draft.scene.groups;
      Object.keys(groups).forEach((id) => {
        groups[id].selected = false;
      });

      Object.keys(groups).forEach((id) => {
        groups[id].selected = false;
      });
      groups[groupID].selected = true;
      return draft;
    });
  }

  static unselect(state: State, groupID: string) {
    state = produce(state, (draft) => {
      draft.scene.groups[groupID].selected = false;
    });
    for (const layerID of Object.keys(state.scene.groups[groupID].elements)) {
      state = Layer.unselectAll(state, layerID);
    }
    return state;
  }

  static create(state: State) {
    return produce(state, (draft) => {
      const groupID = IDBroker.acquireID();
      draft.scene.groups[groupID] = GroupModel({ id: groupID, name: groupID });
    });
  }

  static createFromSelectedElements(state: State) {
    return produce(state, (draft) => {
      const groupID = IDBroker.acquireID();
      const newGroup = GroupModel({ id: groupID, name: groupID });
      draft.scene.groups[groupID] = newGroup;

      Object.values(draft.scene.layers).forEach((layer) => {
        const layerID = layer.id;
        const elementTypes = ['lines', 'items', 'holes', 'areas'] as const;

        elementTypes.forEach((elementType) => {
          Object.values(layer[elementType]).forEach((el) => {
            if (el.selected) {
              if (!newGroup.elements[layerID]) {
                newGroup.elements[layerID] = {
                  lines: [],
                  items: [],
                  holes: [],
                  areas: []
                };
              }
              if (!newGroup.elements[layerID][elementType].includes(el.id)) {
                newGroup.elements[layerID][elementType].push(el.id);
              }
            }
          });
        });
      });
    });
  }

  static addElement(
    state: State,
    groupID: string,
    layerID: string,
    elementPrototype: keyof GroupElement,
    elementID: string
  ) {
    let elementAdded = false;
    state = produce(state, (draft) => {
      const group = draft.scene.groups[groupID];
      if (group) {
        if (!group.elements[layerID]) {
          group.elements[layerID] = {
            lines: [],
            items: [],
            holes: [],
            areas: []
          };
        }
        if (!group.elements[layerID][elementPrototype].includes(elementID)) {
          group.elements[layerID][elementPrototype].push(elementID);
          elementAdded = true;
        }
      }
    });
    if (elementAdded) {
      state = this.reloadBaricenter(state, groupID);
    }
    return state;
  }

  static setBarycenter(state: State, groupID: string, x: number, y: number) {
    return produce(state, (draft) => {
      const group = draft.scene.groups[groupID];
      if (group) {
        if (typeof x !== 'undefined') group.x = x;
        if (typeof y !== 'undefined') group.y = y;
      }
    });
  }

  static reloadBaricenter(state: State, groupID: string) {
    return produce(state, (draft) => {
      const group = draft.scene.groups[groupID];
      if (!group) return;

      let xBar = 0;
      let yBar = 0;
      let elementCount = 0;

      Object.entries(group.elements).forEach(
        ([groupLayerID, groupLayerElements]) => {
          if (groupLayerElements.lines) {
            groupLayerElements.lines.forEach((lineID) => {
              const line = draft.scene.layers[groupLayerID]?.lines[lineID];
              if (line) {
                const v0 =
                  draft.scene.layers[groupLayerID]?.vertices[line.vertices[0]];
                const v1 =
                  draft.scene.layers[groupLayerID]?.vertices[line.vertices[1]];
                if (v0 && v1) {
                  const { x: xM, y: yM } = GeometryUtils.midPoint(
                    v0.x,
                    v0.y,
                    v1.x,
                    v1.y
                  );
                  xBar += xM;
                  yBar += yM;
                  elementCount++;
                }
              }
            });
          }

          if (groupLayerElements.holes) {
            groupLayerElements.holes.forEach((holeID) => {
              const hole = draft.scene.layers[groupLayerID]?.holes[holeID];
              if (hole) {
                const line = draft.scene.layers[groupLayerID]?.lines[hole.line];
                if (line) {
                  const v0 =
                    draft.scene.layers[groupLayerID]?.vertices[
                    line.vertices[0]
                    ];
                  const v1 =
                    draft.scene.layers[groupLayerID]?.vertices[
                    line.vertices[1]
                    ];
                  if (v0 && v1) {
                    const { x: xM, y: yM } = GeometryUtils.midPoint(
                      v0.x,
                      v0.y,
                      v1.x,
                      v1.y
                    );
                    xBar += xM;
                    yBar += yM;
                    elementCount++;
                  }
                }
              }
            });
          }

          if (groupLayerElements.items) {
            groupLayerElements.items.forEach((itemID) => {
              const item = draft.scene.layers[groupLayerID]?.items[itemID];
              if (item) {
                xBar += item.x;
                yBar += item.y;
                elementCount++;
              }
            });
          }

          if (groupLayerElements.areas) {
            groupLayerElements.areas.forEach((areaID) => {
              const area = draft.scene.layers[groupLayerID]?.areas[areaID];
              if (area) {
                const areaVertices = area.vertices
                  .map((vID) => draft.scene.layers[groupLayerID]?.vertices[vID])
                  .filter((v) => v);
                const { x, y } = GeometryUtils.verticesMidPoint(areaVertices);
                xBar += x;
                yBar += y;
                elementCount++;
              }
            });
          }
        }
      );

      if (elementCount > 0) {
        group.x = xBar / elementCount;
        group.y = yBar / elementCount;
      }
    });
  }

  static removeElement(
    state: State,
    groupID: string,
    layerID: string,
    elementPrototype: GroupElementPrototypes,
    elementID: string
  ) {
    return produce(state, (draft) => {
      const group = draft.scene.groups[groupID];
      if (group?.elements[layerID]?.[elementPrototype]) {
        const index =
          group.elements[layerID][elementPrototype].indexOf(elementID);
        if (index !== -1) {
          group.elements[layerID][elementPrototype].splice(index, 1);
        }
      }
    });
  }

  static setAttributes(
    state: State,
    groupID: string,
    attributes: Partial<GroupModel>
  ) {
    return produce(state, (draft) => {
      Object.assign(draft.scene.groups[groupID], attributes);
    });
  }

  static setProperties(
    state: State,
    groupID: string,
    properties: GroupModel['properties']
  ) {
    return produce(state, (draft) => {
      const group = draft.scene.groups[groupID];
      if (group) {
        Object.assign(group.properties, properties);
      }
    });
  }

  static remove(state: State, groupID: string) {
    return produce(state, (draft) => {
      delete draft.scene.groups[groupID];
    });
  }

  static removeAndDeleteElements(state: State, groupID: string) {
    const group = state.scene.groups[groupID];
    if (!group) return state;
    const layerList = group.elements;

    Object.entries(layerList).forEach(([groupLayerID, groupLayerElements]) => {
      state = Layer.unselectAll(state, groupLayerID);

      const lines = groupLayerElements.lines;
      const holes = groupLayerElements.holes;
      const items = groupLayerElements.items;

      if (lines) {
        lines.forEach((lineID) => {
          state = Line.remove(state, groupLayerID, lineID);
          state = Layer.detectAndUpdateAreas(state, groupLayerID);
        });
      }

      if (holes)
        holes.forEach((holeID) => {
          state = Hole.remove(state, groupLayerID, holeID);
        });
      if (items)
        items.forEach((itemID) => {
          state = Item.remove(state, groupLayerID, itemID);
        });
    });

    return produce(state, (draft) => {
      delete draft.scene.groups[groupID];
    });
  }

  static translate(state: State, groupID: string, x: number, y: number) {
    return produce(state, (draft) => {
      const group = draft.scene.groups[groupID];
      if (!group) return;

      const deltaX = x - group.x;
      const deltaY = y - group.y;

      group.x = x;
      group.y = y;

      Object.entries(group.elements).forEach(([layerID, layerElements]) => {
        const layer = draft.scene.layers[layerID];
        if (!layer) return;

        const processVertices = (
          ids: string[],
          getVertices: (id: string) => string[]
        ) => {
          const vertexIds = new Set<string>();
          ids.forEach((id) => {
            getVertices(id).forEach((vId) => vertexIds.add(vId));
          });
          vertexIds.forEach((vertexID) => {
            const vertex = layer.vertices[vertexID];
            if (vertex) {
              vertex.x += deltaX;
              vertex.y += deltaY;
            }
          });
        };

        if (layerElements.lines) {
          processVertices(
            layerElements.lines,
            (lineID) => layer.lines[lineID].vertices || []
          );
        }
        if (layerElements.areas) {
          processVertices(
            layerElements.areas,
            (areaID) => layer.areas[areaID].vertices || []
          );
        }

        if (layerElements.items) {
          layerElements.items.forEach((itemID) => {
            const item = layer.items[itemID];
            if (item) {
              item.x += deltaX;
              item.y += deltaY;
            }
          });
        }
      });
    });
  }

  static rotate(state: State, groupID: string, rotation: number) {
    return produce(state, (draft) => {
      const group = draft.scene.groups[groupID];
      if (!group) return;

      const { x: barX, y: barY } = group;
      const newRotation = (group.rotation + rotation) % 360;
      group.rotation = newRotation;

      Object.entries(group.elements).forEach(([layerID, layerElements]) => {
        const layer = draft.scene.layers[layerID];
        if (!layer) return;

        const processVertices = (
          ids: string[],
          getVertices: (id: string) => string[]
        ) => {
          const vertexIds = new Set<string>();
          ids.forEach((id) => {
            getVertices(id).forEach((vId) => vertexIds.add(vId));
          });
          vertexIds.forEach((vertexID) => {
            const vertex = layer.vertices[vertexID];
            if (vertex) {
              const { x: newX, y: newY } = GeometryUtils.rotatePointAroundPoint(
                vertex.x,
                vertex.y,
                barX,
                barY,
                rotation
              );
              vertex.x = newX;
              vertex.y = newY;
            }
          });
        };

        if (layerElements.lines) {
          processVertices(
            layerElements.lines,
            (lineID) => layer.lines[lineID]?.vertices || []
          );
        }
        if (layerElements.areas) {
          processVertices(
            layerElements.areas,
            (areaID) => layer.areas[areaID]?.vertices || []
          );
        }

        if (layerElements.items) {
          layerElements.items.forEach((itemID) => {
            const item = layer.items[itemID];
            if (item) {
              const { x: newX, y: newY } = GeometryUtils.rotatePointAroundPoint(
                item.x,
                item.y,
                barX,
                barY,
                rotation
              );
              item.x = newX;
              item.y = newY;
              item.rotation = (item.rotation + rotation) % 360;
            }
          });
        }
      });
    });
  }
}

export { Group as default };
