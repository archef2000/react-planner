import * as Three from 'three';
import { Object3D } from 'three';

import { CatalogFn } from '../../catalog/catalog';
import { Layer, Scene } from '../../models';
import { ReactPlannerContextProps } from '../../react-planner-context';

import createGrid from './grid-creator';
import { disposeObject } from './three-memory-cleaner';

/**
 * Structures used by parseData to build the 3D scene graph.
 */
export interface BusyResourcesLayer {
  id: string;
  lines: Record<string, boolean>;
  holes: Record<string, boolean>;
  areas: Record<string, boolean>;
  items: Record<string, boolean>;
}

export interface SceneGraphLayer {
  id: string;
  lines: Record<string, Three.Object3D>; // pivot objects containing meshes
  holes: Record<string, Three.Object3D>;
  areas: Record<string, Three.Object3D>;
  items: Record<string, Three.Object3D>;
  visible: boolean;
  altitude: number; // layer altitude
}

export interface SceneGraphData {
  unit: Scene['unit'];
  layers: Record<string, SceneGraphLayer>;
  busyResources: { layers: Record<string, BusyResourcesLayer> };
  width: number;
  height: number;
  /** Map of element id -> LOD object used for camera dependent switching */
  LODs: Record<string, Three.LOD>;
}

export interface PlanData {
  sceneGraph: SceneGraphData;
  plan: Three.Object3D; // root container for all scene objects
  grid: Three.Object3D; // visual reference grid
  boundingBox: Three.Box3; // axis-aligned bounding box centered at origin
}

export function parseData(
  sceneData: Scene,
  context: ReactPlannerContextProps
): PlanData {
  const planRoot = new Three.Object3D();
  planRoot.name = 'plan';
  const grid = createGrid(sceneData);
  grid.name = 'grid';

  const sceneGraph: SceneGraphData = {
    unit: sceneData.unit,
    layers: {},
    busyResources: { layers: {} },
    width: sceneData.width,
    height: sceneData.height,
    LODs: {}
  };

  const boundingBox = new Three.Box3().setFromObject(grid);
  (boundingBox as any).name = 'boundingBox';

  const planData: PlanData = {
    sceneGraph,
    plan: planRoot,
    grid,
    boundingBox
  };

  let promises: Promise<void>[] = [];

  Object.values(sceneData.layers).forEach((layer) => {
    if (layer.id === sceneData.selectedLayer || layer.visible) {
      promises = promises.concat(
        createLayerObjects(layer, planData, sceneData, context)
      );
    }
  });

  Promise.all(promises).then((value) => updateBoundingBox(planData));

  return planData;
}

function createLayerObjects(
  layer: Layer,
  planData: PlanData,
  sceneData: Scene,
  context: ReactPlannerContextProps
) {
  const promises: Promise<void>[] = [];

  planData.sceneGraph.layers[layer.id] = {
    id: layer.id,
    lines: {},
    holes: {},
    areas: {},
    items: {},
    visible: layer.visible,
    altitude: layer.altitude
  };

  planData.sceneGraph.busyResources.layers[layer.id] = {
    id: layer.id,
    lines: {},
    holes: {},
    areas: {},
    items: {}
  };

  // Import lines
  Object.values(layer.lines).forEach((line) => {
    promises.push(addLine(sceneData, planData, layer, line.id, context));
    line.holes.forEach((holeID) => {
      promises.push(addHole(sceneData, planData, layer, holeID, context));
    });
  });

  // Import areas
  Object.values(layer.areas).forEach((area) => {
    promises.push(addArea(sceneData, planData, layer, area.id, context));
  });

  // Import items
  Object.values(layer.items).forEach((item) => {
    promises.push(addItem(sceneData, planData, layer, item.id, context));
  });

  return promises;
}

type Diff = {
  op: 'add' | 'remove' | 'replace';
  path: string[];
  value: any;
};

export function updateScene(
  planData: PlanData,
  sceneData: Scene,
  oldSceneData: Scene,
  diffArray: { [key: string]: any },
  context: ReactPlannerContextProps
) {
  const splitted = Object.values(diffArray).map((el) => {
    return { op: el.op, path: el.path.split('/'), value: el.value };
  });
  let filteredDiffs = filterDiffs(splitted, sceneData, oldSceneData);

  //***testing additional filter***
  filteredDiffs = filteredDiffs.filter(({ path }) => path[3] !== 'selected');
  filteredDiffs = filteredDiffs.filter(({ path }) => path[1] !== 'groups');
  //*******************************

  filteredDiffs.forEach(({ op, path, value }) => {
    /* First of all I need to find the object I need to update */
    if (path[1] === 'layers') {
      const layer = sceneData.layers[path[2]];

      if (path.length === 3 && op === 'remove') {
        removeLayer(path[2], planData);
      } else if (path.length > 3) {
        switch (op) {
          case 'replace':
            replaceObject(
              path as ModifiedPath,
              layer,
              planData,
              sceneData,
              oldSceneData,
              context
            );
            break;
          case 'add':
            addObject(
              path as ModifiedPath,
              layer,
              planData,
              sceneData,
              oldSceneData,
              context
            );
            break;
          case 'remove':
            removeObject(
              path as ModifiedPath,
              layer,
              planData,
              sceneData,
              oldSceneData,
              context
            );
            break;
        }
      }
    } else if (path[1] === 'selectedLayer') {
      const layerSelectedID = value;
      const layerSelected = sceneData.layers[layerSelectedID];
      // First of all I check if the new selected layer is not visible
      if (!layerSelected.visible) {
        // I need to create the objects for this layer
        const promises = createLayerObjects(
          layerSelected,
          planData,
          sceneData,
          context
        );
        Promise.all(promises).then(() => updateBoundingBox(planData));
      }

      const layerGraph =
        planData.sceneGraph.layers[oldSceneData.selectedLayer as string];

      if (layerGraph) {
        if (!layerGraph.visible) {
          // I need to remove the objects for this layer
          for (const lineID in layerGraph.lines)
            removeLine(planData, layerGraph.id, lineID);
          for (const areaID in layerGraph.areas)
            removeArea(planData, layerGraph.id, areaID);
          for (const itemID in layerGraph.items)
            removeItem(planData, layerGraph.id, itemID);
          for (const holeID in layerGraph.holes)
            removeHole(planData, layerGraph.id, holeID);
        }
      }
    }
  });
  return planData;
}

type ModifiedPath = [number, number, number, string, string, ...string[]];

function replaceObject(
  modifiedPath: ModifiedPath,
  layer: Layer,
  planData: PlanData,
  sceneData: Scene,
  oldSceneData: Scene,
  context: ReactPlannerContextProps
) {
  let promises: Promise<void>[] = [];

  switch (modifiedPath[3]) {
    case 'vertices':
      if (modifiedPath[5] !== 'selected') {
        const vertex = layer.vertices[modifiedPath[4]];

        if (modifiedPath[5] === 'x' || modifiedPath[5] === 'y') {
          vertex.lines.forEach((lineID) => {
            const lineHoles = oldSceneData.layers[layer.id].lines[lineID].holes;
            if (lineHoles)
              lineHoles.forEach((holeID) => {
                replaceObject(
                  [0, 0, 0, 'holes', holeID, 'selected'],
                  layer,
                  planData,
                  sceneData,
                  oldSceneData,
                  context
                );
              });
            return replaceObject(
              [0, 0, 0, 'lines', lineID],
              layer,
              planData,
              sceneData,
              oldSceneData,
              context
            );
          });
          vertex.areas.forEach((areaID) =>
            replaceObject(
              [0, 0, 0, 'areas', areaID],
              layer,
              planData,
              sceneData,
              oldSceneData,
              context
            )
          );
        }

        if (modifiedPath[5] === 'areas') {
          const areaID = vertex.areas[~~modifiedPath[6]];
          replaceObject(
            [0, 0, 0, 'areas', areaID],
            layer,
            planData,
            sceneData,
            oldSceneData,
            context
          );
        }
      }
      break;
    case 'holes':
      const newHoleData = layer.holes[modifiedPath[4]];

      if (
        CatalogFn.getElement(context.catalog, newHoleData.type).updateRender3D
      ) {
        promises.push(
          updateHole(
            sceneData,
            oldSceneData,
            planData,
            layer,
            modifiedPath[4],
            modifiedPath.slice(5) as string[],
            context,
            () => removeHole(planData, layer.id, newHoleData.id),
            () => addHole(sceneData, planData, layer, newHoleData.id, context)
          )
        );
      } else {
        const lineID = newHoleData.line;
        if (modifiedPath[5] === 'selected') {
          // I remove only the hole without removing the wall
          removeHole(planData, layer.id, newHoleData.id);
          promises.push(
            addHole(sceneData, planData, layer, newHoleData.id, context)
          );
        } else {
          layer.lines[lineID].holes.forEach((holeID) => {
            removeHole(planData, layer.id, holeID);
          });
          removeLine(planData, layer.id, lineID);
          promises.push(addLine(sceneData, planData, layer, lineID, context));
          layer.lines[lineID].holes.forEach((holeID) => {
            promises.push(addHole(sceneData, planData, layer, holeID, context));
          });
        }
      }
      break;
    case 'lines':
      const line = layer.lines[modifiedPath[4]];

      if (CatalogFn.getElement(context.catalog, line.type).updateRender3D) {
        promises.push(
          updateLine(
            sceneData,
            oldSceneData,
            planData,
            layer,
            modifiedPath[4],
            modifiedPath.slice(5) as string[],
            context,
            () => removeLine(planData, layer.id, modifiedPath[4]),
            () => addLine(sceneData, planData, layer, modifiedPath[4], context)
          )
        );
        // If wall thickness/height changed, rebuild adjacent connected walls to recalc shared edge geometry
        if (
          modifiedPath[5] === 'properties' &&
          (modifiedPath[6] === 'thickness' || modifiedPath[6] === 'height')
        ) {
          const currentLineID = modifiedPath[4];
          const vertices = line.vertices || [];
          vertices.forEach((vID) => {
            const v = layer.vertices[vID];
            if (!v) return;
            (v.lines || []).forEach((adjLineID) => {
              if (adjLineID !== currentLineID && layer.lines[adjLineID]) {
                // Full rebuild of adjacent line
                removeLine(planData, layer.id, adjLineID);
                promises.push(
                  addLine(sceneData, planData, layer, adjLineID, context)
                );
              }
            });
          });
        }
      } else {
        removeLine(planData, layer.id, modifiedPath[4]);
        promises.push(
          addLine(sceneData, planData, layer, modifiedPath[4], context)
        );
      }
      break;
    case 'areas':
      const area = layer.areas[modifiedPath[4]];

      if (CatalogFn.getElement(context.catalog, area.type).updateRender3D) {
        promises.push(
          updateArea(
            sceneData,
            oldSceneData,
            planData,
            layer,
            modifiedPath[4],
            modifiedPath.slice(5) as string[],
            context,
            () => removeArea(planData, layer.id, modifiedPath[4]),
            () => addArea(sceneData, planData, layer, modifiedPath[4], context)
          )
        );
      } else {
        if (planData.sceneGraph.layers[layer.id].areas[modifiedPath[4]]) {
          removeArea(planData, layer.id, modifiedPath[4]);
        }
        promises.push(
          addArea(sceneData, planData, layer, modifiedPath[4], context)
        );
      }
      break;
    case 'items':
      const item = layer.items[modifiedPath[4]];

      if (CatalogFn.getElement(context.catalog, item.type).updateRender3D) {
        promises.push(
          updateItem(
            sceneData,
            oldSceneData,
            planData,
            layer,
            modifiedPath[4],
            modifiedPath.slice(5) as string[],
            context,
            () => removeItem(planData, layer.id, modifiedPath[4]),
            () => addItem(sceneData, planData, layer, modifiedPath[4], context)
          )
        );
      } else {
        removeItem(planData, layer.id, modifiedPath[4]);
        promises.push(
          addItem(sceneData, planData, layer, modifiedPath[4], context)
        );
      }
      break;

    case 'visible':
      if (!layer.visible) {
        const layerGraph = planData.sceneGraph.layers[layer.id];

        for (const lineID in layerGraph.lines)
          removeLine(planData, layer.id, lineID);
        for (const areaID in layerGraph.areas)
          removeArea(planData, layer.id, areaID);
        for (const itemID in layerGraph.items)
          removeItem(planData, layer.id, itemID);
        for (const holeID in layerGraph.holes)
          removeHole(planData, layer.id, holeID);
      } else {
        promises = promises.concat(
          createLayerObjects(layer, planData, sceneData, context)
        );
      }

      break;

    case 'opacity':
    case 'altitude':
      const layerGraph = planData.sceneGraph.layers[layer.id];
      for (const lineID in layerGraph.lines)
        removeLine(planData, layer.id, lineID);
      for (const areaID in layerGraph.areas)
        removeArea(planData, layer.id, areaID);
      for (const itemID in layerGraph.items)
        removeItem(planData, layer.id, itemID);
      for (const holeID in layerGraph.holes)
        removeHole(planData, layer.id, holeID);

      promises = promises.concat(
        createLayerObjects(layer, planData, sceneData, context)
      );
  }
  Promise.all(promises).then((values) => updateBoundingBox(planData));
}

function removeObject(
  modifiedPath: ModifiedPath,
  layer: Layer,
  planData: PlanData,
  sceneData: Scene,
  oldSceneData: Scene,
  context: ReactPlannerContextProps
) {
  const promises = [];
  switch (modifiedPath[3]) {
    case 'lines':
      // Here I remove the line with all its holes
      const lineID = modifiedPath[4];
      oldSceneData.layers[layer.id].lines[lineID].holes.forEach((holeID) => {
        removeHole(planData, layer.id, holeID);
      });
      removeLine(planData, layer.id, lineID);
      if (modifiedPath.length > 5) {
        // I removed an hole, so I should add the new line
        promises.push(addLine(sceneData, planData, layer, lineID, context));
        layer.lines[lineID].holes.forEach((holeID) => {
          promises.push(addHole(sceneData, planData, layer, holeID, context));
        });
      }
      break;
    case 'areas':
      if (modifiedPath.length === 5) {
        // I am removing an entire area
        removeArea(planData, layer.id, modifiedPath[4]);
      }
      break;
    case 'items':
      if (modifiedPath.length === 5) {
        // I am removing an item
        removeItem(planData, layer.id, modifiedPath[4]);
      }
      break;
  }

  Promise.all(promises).then((values) => updateBoundingBox(planData));
}

function removeLayer(layerId: string, planData: PlanData) {
  const layerGraph = planData.sceneGraph.layers[layerId];

  for (const lineID in layerGraph.lines) removeLine(planData, layerId, lineID);
  for (const areaID in layerGraph.areas) removeArea(planData, layerId, areaID);
  for (const itemID in layerGraph.items) removeItem(planData, layerId, itemID);
  for (const holeID in layerGraph.holes) removeHole(planData, layerId, holeID);

  delete planData.sceneGraph.layers[layerId];
}

function removeHole(planData: PlanData, layerId: string, holeID: string) {
  if (planData.sceneGraph.busyResources.layers[layerId].holes[holeID]) {
    setTimeout(() => removeHole(planData, layerId, holeID), 100);
    return;
  }

  planData.sceneGraph.busyResources.layers[layerId].holes[holeID] = true;

  let hole3D: Object3D | null =
    planData.sceneGraph.layers[layerId].holes[holeID];

  if (hole3D) {
    planData.plan.remove(hole3D);
    disposeObject(hole3D);
    delete planData.sceneGraph.layers[layerId].holes[holeID];
    delete planData.sceneGraph.LODs[holeID];
    hole3D = null;
    updateBoundingBox(planData);
  }

  planData.sceneGraph.busyResources.layers[layerId].holes[holeID] = false;
}

function removeLine(planData: PlanData, layerId: string, lineID: string) {
  if (planData.sceneGraph.busyResources.layers[layerId].lines[lineID]) {
    setTimeout(() => removeLine(planData, layerId, lineID), 100);
    return;
  }

  planData.sceneGraph.busyResources.layers[layerId].lines[lineID] = true;

  let line3D: Object3D | null =
    planData.sceneGraph.layers[layerId].lines[lineID];

  if (line3D) {
    planData.plan.remove(line3D);
    disposeObject(line3D);
    delete planData.sceneGraph.layers[layerId].lines[lineID];
    delete planData.sceneGraph.LODs[lineID];
    line3D = null;
    updateBoundingBox(planData);
  }

  planData.sceneGraph.busyResources.layers[layerId].lines[lineID] = false;
}

function removeArea(planData: PlanData, layerId: string, areaID: string) {
  if (planData.sceneGraph.busyResources.layers[layerId].areas[areaID]) {
    setTimeout(() => removeArea(planData, layerId, areaID), 100);
    return;
  }

  planData.sceneGraph.busyResources.layers[layerId].areas[areaID] = true;

  let area3D: Object3D | null =
    planData.sceneGraph.layers[layerId].areas[areaID];

  if (area3D) {
    planData.plan.remove(area3D);
    disposeObject(area3D);
    delete planData.sceneGraph.layers[layerId].areas[areaID];
    delete planData.sceneGraph.LODs[areaID];
    area3D = null;
    updateBoundingBox(planData);
  }

  planData.sceneGraph.busyResources.layers[layerId].areas[areaID] = false;
}

function removeItem(planData: PlanData, layerId: string, itemID: string) {
  if (planData.sceneGraph.busyResources.layers[layerId].items[itemID]) {
    setTimeout(() => removeItem(planData, layerId, itemID), 100);
    return;
  }

  planData.sceneGraph.busyResources.layers[layerId].items[itemID] = true;

  let item3D: Object3D | null =
    planData.sceneGraph.layers[layerId].items[itemID];

  if (item3D) {
    planData.plan.remove(item3D);
    disposeObject(item3D);
    delete planData.sceneGraph.layers[layerId].items[itemID];
    delete planData.sceneGraph.LODs[itemID];
    item3D = null;
    updateBoundingBox(planData);
  }

  planData.sceneGraph.busyResources.layers[layerId].items[itemID] = false;
}

//TODO generate an area's replace if vertex has been changed
function addObject(
  modifiedPath: ModifiedPath,
  layer: Layer,
  planData: PlanData,
  sceneData: Scene,
  oldSceneData: Scene,
  context: ReactPlannerContextProps
) {
  if (modifiedPath.length === 5) {
    let addPromise = null;

    switch (modifiedPath[3]) {
      case 'lines':
        addPromise = addLine;
        break;
      case 'areas':
        addPromise = addArea;
        break;
      case 'items':
        addPromise = addItem;
        break;
      case 'holes':
        addPromise = addHole;
        break;
    }

    if (addPromise)
      addPromise(sceneData, planData, layer, modifiedPath[4], context).then(
        () => updateBoundingBox(planData)
      );
  }
}

async function addHole(
  sceneData: Scene,
  planData: PlanData,
  layer: Layer,
  holeID: string,
  context: ReactPlannerContextProps
) {
  const holeData = layer.holes[holeID];

  // Create the hole object
  const object = await CatalogFn.getElement(
    context.catalog,
    holeData.type
  ).render3D(holeData, layer, sceneData);
  if (object instanceof Three.LOD) {
    planData.sceneGraph.LODs[holeID] = object;
  }
  const pivot = new Three.Object3D();
  pivot.name = 'pivot';
  pivot.add(object);
  const line_1 = layer.lines[holeData.line];
  // First of all I need to find the vertices of this line
  let vertex0 = layer.vertices[line_1.vertices[0]];
  let vertex1 = layer.vertices[line_1.vertices[1]];
  let offset = holeData.offset;
  if (vertex0.x > vertex1.x) {
    const tmp = vertex0;
    vertex0 = vertex1;
    vertex1 = tmp;
    offset = 1 - offset;
  }
  const distance = Math.sqrt(
    Math.pow(vertex0.x - vertex1.x, 2) + Math.pow(vertex0.y - vertex1.y, 2)
  );
  const alpha = Math.asin((vertex1.y - vertex0.y) / distance);
  const boundingBox = new Three.Box3().setFromObject(pivot);
  const center = [
    (boundingBox.max.x - boundingBox.min.x) / 2 + boundingBox.min.x,
    (boundingBox.max.y - boundingBox.min.y) / 2 + boundingBox.min.y,
    (boundingBox.max.z - boundingBox.min.z) / 2 + boundingBox.min.z
  ];
  const holeAltitude = holeData.properties.altitude.length;
  const holeHeight = holeData.properties.height.length;
  pivot.rotation.y = alpha;
  pivot.position.x =
    vertex0.x +
    distance * offset * Math.cos(alpha) -
    center[2] * Math.sin(alpha);
  pivot.position.y = holeAltitude + holeHeight / 2 - center[1] + layer.altitude;
  pivot.position.z =
    -vertex0.y -
    distance * offset * Math.sin(alpha) -
    center[2] * Math.cos(alpha);
  planData.plan.add(pivot);
  planData.sceneGraph.layers[layer.id].holes[holeData.id] = pivot;
  applyInteract(pivot, () => {
    return context.holesActions.selectHole(layer.id, holeData.id);
  });
  let opacity = layer.opacity;
  if (holeData.selected) {
    opacity = 1;
  }
  applyOpacity(pivot, opacity);
}

async function updateHole(
  sceneData: Scene,
  oldSceneData: Scene,
  planData: PlanData,
  layer: Layer,
  holeID: string,
  differences: string[],
  context: ReactPlannerContextProps,
  selfDestroy: () => void,
  selfBuild: () => void
) {
  const hole = layer.holes[holeID];
  const oldHole = oldSceneData.layers[layer.id].holes[holeID];
  const mesh = planData.sceneGraph.layers[layer.id].holes[holeID];

  if (!mesh) return null;

  return CatalogFn.getElement(context.catalog, hole.type).updateRender3D?.(
    hole,
    layer,
    sceneData,
    mesh,
    oldHole,
    differences,
    selfDestroy,
    selfBuild
  );
}

async function addLine(
  sceneData: Scene,
  planData: PlanData,
  layer: Layer,
  lineID: string,
  context: ReactPlannerContextProps
) {
  if (planData.sceneGraph.busyResources.layers[layer.id].lines[lineID]) {
    setTimeout(() => addLine(sceneData, planData, layer, lineID, context), 100);
    return;
  }

  planData.sceneGraph.busyResources.layers[layer.id].lines[lineID] = true;

  const line = layer.lines[lineID];

  // First of all I need to find the vertices of this line
  let vertex0 = layer.vertices[line.vertices[0]];
  let vertex1 = layer.vertices[line.vertices[1]];

  if (vertex0.x > vertex1.x) {
    const tmp = vertex0;
    vertex0 = vertex1;
    vertex1 = tmp;
  }

  const line3D = await CatalogFn.getElement(
    context.catalog,
    line.type
  ).render3D(line, layer, sceneData);
  if (line3D instanceof Three.LOD) {
    planData.sceneGraph.LODs[line.id] = line3D;
  }
  const pivot = new Three.Object3D();
  pivot.name = 'pivot';
  pivot.add(line3D);
  pivot.position.x = vertex0.x;
  pivot.position.y = layer.altitude;
  pivot.position.z = -vertex0.y;
  planData.plan.add(pivot);
  planData.sceneGraph.layers[layer.id].lines[lineID] = pivot;
  applyInteract(pivot, () => {
    return context.linesActions.selectLine(layer.id, line.id);
  });
  let opacity = layer.opacity;
  if (line.selected) {
    opacity = 1;
  }
  applyOpacity(pivot, opacity);
  planData.sceneGraph.busyResources.layers[layer.id].lines[lineID] = false;
}

async function updateLine(
  sceneData: Scene,
  oldSceneData: Scene,
  planData: PlanData,
  layer: Layer,
  lineID: string,
  differences: string[],
  context: ReactPlannerContextProps,
  selfDestroy: () => void,
  selfBuild: () => void
) {
  const line = layer.lines[lineID];
  const oldLine = oldSceneData.layers[layer.id].lines[lineID];
  const mesh = planData.sceneGraph.layers[layer.id].lines[lineID];

  if (!mesh) return null;

  return CatalogFn.getElement(context.catalog, line.type).updateRender3D?.(
    line,
    layer,
    sceneData,
    mesh,
    oldLine,
    differences,
    selfDestroy,
    selfBuild
  );
}

async function addArea(
  sceneData: Scene,
  planData: PlanData,
  layer: Layer,
  areaID: string,
  context: ReactPlannerContextProps
) {
  if (planData.sceneGraph.busyResources.layers[layer.id].areas[areaID]) {
    setTimeout(() => addArea(sceneData, planData, layer, areaID, context), 100);
    return;
  }

  planData.sceneGraph.busyResources.layers[layer.id].areas[areaID] = true;

  const area = layer.areas[areaID];
  const interactFunction = () =>
    context.areaActions.selectArea(layer.id, areaID);

  const area3D = await CatalogFn.getElement(
    context.catalog,
    area.type
  ).render3D(area, layer, sceneData);
  if (area3D instanceof Three.LOD) {
    planData.sceneGraph.LODs[areaID] = area3D;
  }
  const pivot = new Three.Object3D();
  pivot.name = 'pivot';
  pivot.add(area3D);
  pivot.position.y = layer.altitude;
  planData.plan.add(pivot);
  planData.sceneGraph.layers[layer.id].areas[areaID] = pivot;
  applyInteract(pivot, interactFunction);
  let opacity = layer.opacity;
  if (area.selected) {
    opacity = 1;
  }
  applyOpacity(pivot, opacity);
  planData.sceneGraph.busyResources.layers[layer.id].areas[areaID] = false;
}

async function updateArea(
  sceneData: Scene,
  oldSceneData: Scene,
  planData: PlanData,
  layer: Layer,
  areaID: string,
  differences: string[],
  context: ReactPlannerContextProps,
  selfDestroy: () => void,
  selfBuild: () => void
) {
  const area = layer.areas[areaID];
  const oldArea = oldSceneData.layers[layer.id].areas[areaID];
  const mesh = planData.sceneGraph.layers[layer.id].areas[areaID];

  if (!mesh) return null;

  return CatalogFn.getElement(context.catalog, area.type).updateRender3D?.(
    area,
    layer,
    sceneData,
    mesh,
    oldArea,
    differences,
    selfDestroy,
    selfBuild
  );
}

async function addItem(
  sceneData: Scene,
  planData: PlanData,
  layer: Layer,
  itemID: string,
  context: ReactPlannerContextProps
) {
  const item = layer.items[itemID];

  const item3D = await CatalogFn.getElement(
    context.catalog,
    item.type
  ).render3D(item, layer, sceneData);
  if (item3D instanceof Three.LOD) {
    planData.sceneGraph.LODs[itemID] = item3D;
  }
  const pivot = new Three.Object3D();
  pivot.name = 'pivot';
  pivot.add(item3D);
  pivot.rotation.y = (item.rotation * Math.PI) / 180;
  pivot.position.x = item.x;
  pivot.position.y = layer.altitude;
  pivot.position.z = -item.y;
  applyInteract(item3D, () => {
    context.itemsActions.selectItem(layer.id, item.id);
  });
  let opacity = layer.opacity;
  if (item.selected) {
    opacity = 1;
  }
  applyOpacity(pivot, opacity);
  planData.plan.add(pivot);
  planData.sceneGraph.layers[layer.id].items[item.id] = pivot;
}

async function updateItem(
  sceneData: Scene,
  oldSceneData: Scene,
  planData: PlanData,
  layer: Layer,
  itemID: string,
  differences: string[],
  context: ReactPlannerContextProps,
  selfDestroy: () => void,
  selfBuild: () => void
) {
  const item = layer.items[itemID];
  const oldItem = oldSceneData.layers[layer.id].items[itemID];
  const mesh = planData.sceneGraph.layers[layer.id].items[itemID];

  if (!mesh) return null;

  return CatalogFn.getElement(context.catalog, item.type).updateRender3D?.(
    item,
    layer,
    sceneData,
    mesh,
    oldItem,
    differences,
    selfDestroy,
    selfBuild
  );
}

// Apply interact function to children of an Object3D
function applyInteract(
  object: Three.Object3D<Three.Object3DEventMap>,
  interactFunction: () => void
) {
  object.traverse((child) => {
    if (child instanceof Three.Mesh) {
      (child as any).interact = interactFunction; //TODO
    }
  });
}

// Apply opacity to children of an Object3D
function applyOpacity(
  object: Three.Object3D<Three.Object3DEventMap>,
  opacity: number
) {
  object.traverse((child) => {
    if (child instanceof Three.Mesh) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => {
          material.transparent = true;
          if (material.maxOpacity) {
            material.opacity = Math.min(material.maxOpacity, opacity);
          } else if (material.opacity && material.opacity > opacity) {
            material.maxOpacity = material.opacity;
            material.opacity = opacity;
          }
        });
      } else if (child.material) {
        child.material.transparent = true;
        if (child.material.maxOpacity) {
          child.material.opacity = Math.min(child.material.maxOpacity, opacity);
        } else if (child.material.opacity && child.material.opacity > opacity) {
          child.material.maxOpacity = child.material.opacity;
          child.material.opacity = opacity;
        }
      }
    }
  });
}

function updateBoundingBox(planData: PlanData) {
  const newBoundingBox = new Three.Box3().setFromObject(planData.plan);
  if (
    isFinite(newBoundingBox.max.x) &&
    isFinite(newBoundingBox.min.x) &&
    isFinite(newBoundingBox.max.y) &&
    isFinite(newBoundingBox.min.y) &&
    isFinite(newBoundingBox.max.z) &&
    isFinite(newBoundingBox.min.z)
  ) {
    const newCenter = new Three.Vector3(
      (newBoundingBox.max.x - newBoundingBox.min.x) / 2 + newBoundingBox.min.x,
      (newBoundingBox.max.y - newBoundingBox.min.y) / 2 + newBoundingBox.min.y,
      (newBoundingBox.max.z - newBoundingBox.min.z) / 2 + newBoundingBox.min.z
    );

    planData.plan.position.sub(newCenter);
    planData.grid.position.sub(newCenter);

    newBoundingBox.min.sub(newCenter);
    newBoundingBox.max.sub(newCenter);

    planData.boundingBox = newBoundingBox;
  }
}

/**
 * Filter the array of diffs
 * @param diffArray
 * @param sceneData
 * @param oldSceneData
 */
function filterDiffs(diffArray: Diff[], sceneData: Scene, oldSceneData: Scene) {
  return minimizeRemoveDiffsWhenSwitchingLayers(
    minimizeChangePropertiesAfterSelectionsDiffs(
      minimizeChangePropertiesDiffs(diffArray)
    ),
    sceneData,
    oldSceneData
  );
}

/**
 * Reduces the number of remove diffs when switching an hidden layer
 * @param diffArray the array of the diffs
 * @param sceneData
 * @param oldSceneData
 * @returns {Array}
 */
function minimizeRemoveDiffsWhenSwitchingLayers(
  diffArray: Diff[],
  sceneData: Scene,
  oldSceneData: Scene
) {
  const oldSelectedLayer = oldSceneData.selectedLayer;
  if (oldSelectedLayer === undefined) return diffArray;
  let foundDiff;
  for (let i = 0; i < diffArray.length && !foundDiff; i++) {
    if (diffArray[i].path[1] === 'selectedLayer') {
      foundDiff = diffArray[i];
    }
  }

  if (foundDiff) {
    if (!sceneData.layers[oldSelectedLayer].visible) {
      return diffArray.filter(({ op, path }) => {
        return (
          !(
            path[path.length - 1] === 'selected' &&
            path[1] === 'layers' &&
            path[2] === oldSelectedLayer
          ) && !(op === 'remove' && path.indexOf(oldSelectedLayer) !== -1)
        );
      });
    }
  }

  return diffArray;
}

/**
 * Reduces the number of change properties diffs for selected elements
 * @param diffArray the array of the diffs
 * @param sceneData
 * @param oldSceneData
 */
function minimizeChangePropertiesAfterSelectionsDiffs(diffArray: Diff[]) {
  const idsFound: Record<string, string> = {};
  diffArray.forEach(({ path }) => {
    if (path[5] === 'selected') {
      idsFound[path[4]] = path[4];
    }
  });

  return diffArray.filter(({ path }) => {
    if (path[5] === 'properties') {
      return idsFound[path[4]] ? false : true;
    }
    return true;
  });
}

/**
 * Reduces the number of change properties diffs
 * @param diffArray the array of the diffs
 * @param sceneData
 * @param oldSceneData
 */
function minimizeChangePropertiesDiffs(diffArray: Diff[]) {
  const idsFound: Record<string, boolean> = {};
  return diffArray.filter(({ path }) => {
    if (path[5] === 'properties') {
      return idsFound[path[4]] ? false : (idsFound[path[4]] = true);
    } else if (path[5] === 'misc') {
      // Remove misc changes
      return false;
    }
    return true;
  });
}
