import { ReactNode } from 'react';

import { Unit } from 'convert-units';
import { Store, UnknownAction } from 'redux';
import { Object3D, Object3DEventMap } from 'three';

import { Area, Hole, Item, Layer, Line, Scene, State, Vertex } from './models';
import { SNAP_MASK } from './utils/snap';

export type FooterBarComponentProps = {
  state: State;
};

export type LineAttributes = {
  vertexOne: Vertex;
  vertexTwo: Vertex;
  lineLength: { length: number; _length: number; _unit: Unit };
  name: string;
};

export type HoleAttributes = {
  offset: number;
  offsetA: { length: number; _length: number; _unit: Unit };
  offsetB: { length: number; _length: number; _unit: Unit };
};

export type CatalogPropertyType =
  | 'color'
  | 'enum'
  | 'string'
  | 'number'
  | 'length-measure'
  | 'toggle'
  | 'checkbox'
  | 'hidden'
  | 'read-only';

interface CatalogPropertyBase {
  label?: string;
  hook?: (...args: any[]) => any;
  // Additional arbitrary custom extensions are permitted
  [extra: string]: any; // keep backward compatibility / extensibility
}

export interface ColorProperty extends CatalogPropertyBase {
  type: 'color';
  /** hex / css color */
  defaultValue: string;
}

export interface EnumProperty extends CatalogPropertyBase {
  type: 'enum';
  defaultValue: string; // TODO: key of values map
  values: Record<string, string | number | boolean>;
}

export interface StringProperty extends CatalogPropertyBase {
  type: 'string';
  defaultValue: string;
}

export type NumberProperty = CatalogPropertyBase & {
  type: 'number';
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
};

export type LengthMeasureValue = {
  /** canonical length in catalog unit (cm) */
  length: number;
  /** raw value in selected unit */
  _length?: number;
  /** selected unit (e.g., 'cm') */
  _unit?: Unit;
};

export type LengthMeasureProperty = CatalogPropertyBase & {
  type: 'length-measure';
  defaultValue: LengthMeasureValue;
  min?: number;
  max?: number;
};

export type ToggleProperty = CatalogPropertyBase & {
  type: 'toggle';
  defaultValue: boolean;
  /** label on the toggle button */
  actionName?: string;
};

export type CheckboxProperty = CatalogPropertyBase & {
  type: 'checkbox';
  defaultValue: boolean;
  values?: Record<string, boolean>;
};

export type HiddenProperty = CatalogPropertyBase & {
  type: 'hidden';
  defaultValue: any;
};

export type ReadOnlyProperty = CatalogPropertyBase & {
  type: 'read-only';
  defaultValue: any;
};

export type FallbackProperty = CatalogPropertyBase & {
  type: string;
  defaultValue: any;
};

export type CatalogProperty =
  | ColorProperty
  | EnumProperty
  | StringProperty
  | NumberProperty
  | LengthMeasureProperty
  | ToggleProperty
  | CheckboxProperty
  | HiddenProperty
  | ReadOnlyProperty
  | FallbackProperty;

export type CatalogElementProperty = CatalogProperty; //TODO: remove {}
export type CatalogElementPropertyWithDefault = CatalogElementProperty & {
  defaultValue?: any;
};

export type CatalogElementProperties = Record<string, CatalogElementProperty>;

// ============================================================================
// Property value inference helpers
// Map a catalog property config to the runtime value type used in element.properties
// ============================================================================

export type PropertyValue<T extends CatalogElementProperty> =
  T extends LengthMeasureProperty
    ? LengthMeasureValue
    : T extends ColorProperty
      ? string
      : T extends EnumProperty
        ? string
        : T extends StringProperty
          ? string
          : T extends NumberProperty
            ? number
            : T extends ToggleProperty
              ? boolean
              : T extends CheckboxProperty
                ? boolean
                : T extends HiddenProperty
                  ? any
                  : T extends ReadOnlyProperty
                    ? any
                    : any;

export type ElementPropertiesValues<P extends CatalogElementProperties> = {
  [K in keyof P]: PropertyValue<P[K]>;
};

// Map each property key to its catalog property 'type' literal (e.g. 'width' -> 'length-measure').
export type PropertyTypeMap<P extends CatalogElementProperties> = {
  [K in keyof P]: P[K]['type'];
};

// Convenience extractor: given a CatalogElementBase, get its PropertyTypeMap
export type ExtractPropertyTypeMap<E> =
  E extends CatalogElementBase<any, infer P> ? PropertyTypeMap<P> : never;

// Map each prototype string to its concrete element type
export type PrototypeToElement = {
  lines: Omit<Line, 'properties'>;
  holes: Omit<Hole, 'properties'>;
  areas: Omit<Area, 'properties'>;
  items: Omit<Item, 'properties'>;
};

// Base catalog element type parameterized by its prototype kind and its properties definition object.
// The render/update handlers receive an element whose "properties" field is strongly typed with
// the value types derived from the element's own property config (length-measure -> LengthMeasureValue, etc.).
export type CatalogElementBase<
  P extends keyof PrototypeToElement,
  Props extends CatalogElementProperties = CatalogElementProperties
> = {
  name: string;
  prototype: P;
  info: CatalogElementInfo;
  properties: Props;
  render2D: (
    element: PrototypeToElement[P] & {
      properties: { [K in keyof Props]: PropertyValue<Props[K]> };
    },
    layer: Layer,
    scene: Scene
  ) => ReactNode;
  render3D: (
    element: PrototypeToElement[P] & {
      properties: ElementPropertiesValues<Props>;
    },
    layer: Layer,
    scene: Scene
  ) => Promise<Object3D<Object3DEventMap>>;
  updateRender3D?: (
    element: PrototypeToElement[P] & {
      properties: ElementPropertiesValues<Props>;
    },
    layer: Layer,
    scene: Scene,
    mesh: Object3D<Object3DEventMap>,
    oldElement: PrototypeToElement[P] & {
      properties: ElementPropertiesValues<Props>;
    },
    differences: string[],
    selfDestroy: () => void,
    selfBuild: () => void
  ) => Promise<any>;
};

export type AnyCatalogElement =
  | CatalogElementBase<'lines', CatalogElementProperties>
  | CatalogElementBase<'holes', CatalogElementProperties>
  | CatalogElementBase<'areas', CatalogElementProperties>
  | CatalogElementBase<'items', CatalogElementProperties>;

export type CatalogElement<
  P extends keyof PrototypeToElement = keyof PrototypeToElement,
  Props extends CatalogElementProperties = CatalogElementProperties
> = CatalogElementBase<P, Props>;

export type CatalogElementInfo = {
  title: string;
  description: string;
  image: string | { uri: string; width?: number; height?: number };
  tag: string[];
  visibility?: { catalog?: boolean; layerElementsVisible?: boolean };
};

export type CatalogElementTextures = {
  [key: string]: {
    name: string;
    uri: string;
    lengthRepeatScale: number;
    heightRepeatScale: number;
    normal?: {
      uri: string;
      lengthRepeatScale: number;
      heightRepeatScale: number;
      normalScaleX: number;
      normalScaleY: number;
    };
  };
};

export type ElementType = Line | Hole | Area | Item;

export type ReactPlannerStore = Store<any, UnknownAction>;

export interface ReactPlannerPluginProps {
  store: ReactPlannerStore;
  stateExtractor: (state: State) => any;
}

export type SnapMaskType = Partial<typeof SNAP_MASK>;

export type ElementPrototypes =
  | 'areas'
  | 'holes'
  | 'items'
  | 'lines'
  | 'vertices';

export type StructuredComponentType = {
  index?: number;
  condition: boolean;
  dom: React.ReactNode;
};

export type ComponentType =
  | React.ComponentType<{ state: StateProps }>
  | StructuredComponentType;

export interface ReactPlannerStateExtractor {
  (state: { [key: string]: any }): StateProps;
}

type ReactPlannerPluginUnmountCallback = () => void;

export interface ReactPlannerPlugin {
  (
    store: ReactPlannerStore,
    stateExtractor: ReactPlannerStateExtractor
  ): void | ReactPlannerPluginUnmountCallback;
}

export class ViewerEventError extends Event {
  viewerEvent: any;

  constructor(type: string, viewerEvent: any) {
    super(type);
    this.viewerEvent = viewerEvent;
  }
}

export type ElementTypes = 'area' | 'hole' | 'item' | 'line';

/**Helper factory for catalog elements with full property value inference.*/
export function defineCatalogElement<
  P extends keyof PrototypeToElement,
  Props extends CatalogElementProperties
>(el: CatalogElementBase<P, Props>): CatalogElementBase<P, Props> {
  return el;
}
