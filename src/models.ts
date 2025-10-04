import { ReactNode } from 'react';

import { immerable } from 'immer';

import { MODE_IDLE, ModeType, UnitLengthType } from './constants';
import { CatalogElement, SnapMaskType } from './types';
import { SNAP_MASK, SnapElement } from './utils/snap';

export type Grid = {
  id: string;
  type: 'horizontal-streak' | 'vertical-streak' | '';
  properties: {
    step: number;
    colors: string[];
    [key: string]: any;
  };
};

export function Grid(props: Grid): Grid {
  const defaults = {
    id: '',
    type: '',
    properties: {}
  } as const;
  return { ...defaults, ...props };
}

export const DefaultGrids = {
  h1: Grid({
    id: 'h1',
    type: 'horizontal-streak',
    properties: {
      step: 20,
      colors: ['#808080', '#ddd', '#ddd', '#ddd', '#ddd']
    }
  }),
  v1: Grid({
    id: 'v1',
    type: 'vertical-streak',
    properties: {
      step: 20,
      colors: ['#808080', '#ddd', '#ddd', '#ddd', '#ddd']
    }
  })
};

export type ElementsSet = {
  vertices: string[];
  lines: string[];
  holes: string[];
  areas: string[];
  items: string[];
};

export function ElementsSet(props: Partial<ElementsSet> = {}): ElementsSet {
  const defaults = {
    vertices: [],
    lines: [],
    holes: [],
    areas: [],
    items: []
  };
  return { ...defaults, ...props };
}

const sharedAttributes = {
  //prototype: '',
  id: '',
  type: '',
  name: '',
  misc: {} as Record<string, any>,
  selected: false,
  properties: {} as Record<string, any>,
  visible: true
};

export type SharedAttributes = typeof sharedAttributes;

export type Vertex = SharedAttributes & {
  prototype: 'vertices';
  x: number;
  y: number;
  lines: any[];
  areas: any[];
};

export type VertexPrototypeKeys = keyof Vertex;

export function Vertex(props: Partial<Vertex> = {}): Vertex {
  const defaults = {
    prototype: 'vertices',
    x: -1,
    y: -1,
    lines: [],
    areas: []
  } as const;
  return { ...sharedAttributes, ...defaults, ...props } as Vertex;
}

export type Line = SharedAttributes & {
  prototype: 'lines';
  vertices: string[];
  holes: string[];
  misc: {
    _unitLength?: UnitLengthType;
    [key: string]: any;
  };
};

export function Line(props: Partial<Line>): Line {
  const defaults = {
    prototype: 'lines',
    vertices: [],
    holes: []
  } as const;
  return { ...sharedAttributes, ...defaults, ...props } as Line;
}

export type Hole = SharedAttributes & {
  prototype: 'holes';
  offset: number;
  line: string;
};

export function Hole(props: Partial<Hole>): Hole {
  const defaults = {
    prototype: 'holes',
    offset: -1,
    line: ''
  } as Hole;
  return { ...sharedAttributes, ...defaults, ...props };
}

export type Area = SharedAttributes & {
  prototype: 'areas';
  vertices: string[];
  holes: string[];
};

export function Area(props: Partial<Area>): Area {
  const defaults = {
    prototype: 'areas',
    vertices: [],
    holes: []
  } as const;
  return { ...sharedAttributes, ...defaults, ...props } as Area;
}

export interface Item extends SharedAttributes {
  prototype: 'items';
  x: number;
  y: number;
  rotation: number;
}

export function Item(props: Partial<Item>): Item {
  const defaults = {
    prototype: 'items',
    x: 0,
    y: 0,
    rotation: 0
  } as Item;
  return { ...sharedAttributes, ...defaults, ...props };
}

export type Layer = {
  id: string;
  altitude: number;
  order: number;
  opacity: number;
  name: string;
  visible: boolean;
  vertices: { [id: string]: Vertex };
  lines: { [id: string]: Line };
  holes: { [id: string]: Hole };
  areas: { [id: string]: Area };
  items: { [id: string]: Item };
  selected: ElementsSet;
};

export function Layer(props: Partial<Layer>): Layer {
  const defaults = {
    id: '',
    altitude: 0,
    order: 0,
    opacity: 1,
    name: '',
    visible: true,
    vertices: {},
    lines: {},
    holes: {},
    areas: {},
    items: {},
    selected: ElementsSet()
  };
  return { ...defaults, ...props };
}

export type GroupElementPrototypes = 'items' | 'lines' | 'holes' | 'areas';

export type GroupElement = Record<GroupElementPrototypes, string[]>;

export type Group = {
  prototype: 'groups';
  id: string;
  type: string;
  name: string;
  misc: Record<string, any>;
  selected: boolean;
  properties: Record<string, any>;
  visible: boolean;
  x: number;
  y: number;
  rotation: number;
  elements: Record<string, GroupElement>;
};

export function Group(props: Partial<Group>): Group {
  const defaults = {
    id: '',
    type: '',
    prototype: 'groups',
    name: '',
    misc: {},
    selected: false,
    properties: {},
    visible: true,
    x: 0,
    y: 0,
    rotation: 0,
    elements: {}
  } as const;
  return { ...defaults, ...props };
}

export const DefaultLayers = {
  'layer-1': Layer({ id: 'layer-1', name: 'default' })
};

export interface SceneJson {
  unit: UnitLengthType;
  layers: { [key: string]: Layer };
  grids: { [key: string]: Grid };
  selectedLayer: string | undefined;
  groups: { [key: string]: Group };
  width: number;
  height: number;
  meta: Record<string, any>;
  guides: {
    horizontal: { [key: string]: number };
    vertical: { [key: string]: number };
    circular: any;
  };
}

export type Scene = SceneJson;

export function Scene(props: Partial<SceneJson> = {}): SceneJson {
  const defaults: SceneJson = {
    unit: 'cm',
    layers: DefaultLayers,
    grids: DefaultGrids,
    selectedLayer: undefined,
    groups: {},
    width: 3000,
    height: 2000,
    meta: {},
    guides: { horizontal: {}, vertical: {}, circular: {} }
  };
  const result = { ...defaults, ...props };
  if (result.layers && result.selectedLayer === undefined) {
    result.selectedLayer = Object.keys(result.layers)[0];
  }
  return result;
}

export interface CatalogProps {
  elements: Record<string, CatalogElement>;
  page?: string;
  path: string[];
}

export type CatalogState = {
  elements: Record<string, CatalogElement>;
  page: string;
  path: string[];
  ready: boolean;
};

export function CatalogState(
  { elements, page, path = [] }: CatalogProps = { elements: {}, path: [] }
): CatalogState {
  return {
    elements,
    page: page || 'root',
    path,
    ready: Object.keys(elements).length > 0
  };
}

export function catalogElementFactory(
  catalog: CatalogState,
  type: string,
  options?: Record<string, any>,
  initialProperties?: Record<string, any>
) {
  if (!catalog.elements[type]) {
    const catList = Object.values(catalog.elements).map(
      (element) => (element as { name?: string }).name
    );
    throw new Error(`Element ${type} does not exist in catalog ${catList}`);
  }

  const element = catalog.elements[type];
  const properties: Record<string, any> = {};
  for (const key in element.properties) {
    properties[key] =
      initialProperties && initialProperties[key] !== undefined
        ? initialProperties[key]
        : (element.properties[key] as { defaultValue: any }).defaultValue;
  }

  switch (element.prototype) {
    case 'lines':
      return Object.assign(Line(options as Partial<Line>), { properties });
    case 'holes':
      return Object.assign(Hole(options as Partial<Hole>), { properties });
    case 'areas':
      return Object.assign(Area(options as Partial<Area>), { properties });
    case 'items':
      return Object.assign(Item(options as Partial<Item>), { properties });
    default:
      throw new Error('prototype not valid');
  }
}

export class Catalog2 {
  static [immerable] = true;
  ready = false;
  page = 'root';
  path: string[] = [];
  elements: Record<string, CatalogElement> = {};

  constructor(json: any = {}) {
    this.elements = json.elements;
    this.ready = Object.keys(json.elements).length > 0;
    this.page = json.page || 'root';
    this.path = json.path ? [...json.path] : [];
  }

  factoryElement(
    type: string,
    options?: SharedAttributes &
      (Partial<Line> & Partial<Hole> & Partial<Area> & Partial<Item>),
    initialProperties?: Record<string, any>
  ) {
    if (!this.elements[type]) {
      const catList = Object.values(this.elements).map(
        (element) => (element as { name?: string }).name
      );
      throw new Error(`Element ${type} does not exist in catalog ${catList}`);
    }

    const element = this.elements[type];
    const properties: Record<string, any> = {};
    for (const key in element.properties) {
      properties[key] =
        initialProperties && initialProperties[key] !== undefined
          ? initialProperties[key]
          : (element.properties[key] as { defaultValue: any }).defaultValue;
    }

    switch (element.prototype) {
      case 'lines':
        return Object.assign(Line(options as Partial<Line>), { properties });
      case 'holes':
        return Object.assign(Hole(options as Partial<Hole>), { properties });
      case 'areas':
        return Object.assign(Area(options as Partial<Area>), { properties });
      case 'items':
        return Object.assign(Item(options as Partial<Item>), { properties });
      default:
        throw new Error('prototype not valid');
    }
  }
}

export interface HistoryStructureProps {
  list: any[];
  scene: SceneJson;
  last: SceneJson;
}

export interface HistoryStructureJson {
  list: any[];
  first: SceneJson;
  last: SceneJson;
}

export type HistoryStructure = HistoryStructureJson;

export function HistoryStructure(
  props: Partial<HistoryStructureProps> = {}
): HistoryStructureJson {
  const resullt = {
    list: props.list ?? [],
    first: Scene(props.scene || {}),
    last: Scene(props.last || props.scene || {})
  };
  return resullt;
}

export type DraggingSupportType = {
  layerID: string;
  itemID?: string;
  startPointX?: number;
  startPointY?: number;
  startVertex0X?: number;
  startVertex0Y?: number;
  startVertex1X?: number;
  startVertex1Y?: number;
  startLineX?: number;
  previousMode?: ModeType;
  vertexID?: string;
  originalItem?: Item;
  originalX?: number;
  originalY?: number;
  holeID?: string;
  lineID?: string;
};

export type StateProps = {
  mode: ModeType;
  scene: Scene;
  sceneHistory: HistoryStructure;
  catalog: CatalogState;
  viewer2D: Record<string, any>;
  mouse: { x: number; y: number };
  zoom: number;
  snapMask: SnapMaskType;
  snapElements: SnapElement[];
  activeSnapElement: any;
  drawingSupport: Record<string, any>;
  draggingSupport: DraggingSupportType | undefined;
  rotatingSupport: { layerID: string; itemID: string } | undefined;
  errors: { date: number; error: ReactNode }[];
  warnings: { date: number; warning: ReactNode }[];
  clipboardProperties: Record<string, any>;
  selectedElementsHistory: CatalogElement[];
  misc: Record<string, any>;
  alterate: boolean;
};

export type State = StateProps;

export function State(props: Partial<StateProps> = {}): StateProps {
  const defaults: StateProps = {
    mode: MODE_IDLE,
    scene: Scene(),
    sceneHistory: HistoryStructure(),
    catalog: CatalogState(),
    viewer2D: {},
    mouse: { x: 0, y: 0 },
    zoom: 0,
    snapMask: SNAP_MASK,
    snapElements: [],
    activeSnapElement: null,
    drawingSupport: {},
    draggingSupport: undefined,
    rotatingSupport: undefined,
    errors: [],
    warnings: [],
    clipboardProperties: {},
    selectedElementsHistory: [],
    misc: {},
    alterate: false
  };
  return { ...defaults, ...props };
}
