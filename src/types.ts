import { Store, UnknownAction } from 'redux';
import { Area, Hole, Item, Layer, Line, Scene, State, StateProps } from './models';
import { SNAP_MASK } from './utils/snap';
import { ReactNode } from 'react';
import { Object3D, Object3DEventMap } from 'three';

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
}

export type LengthMeasureValue = {
    /** canonical length in catalog unit (cm) */
    length: number;
    /** raw value in selected unit */
    _length?: number;
    /** selected unit (e.g., 'cm') */
    _unit?: string;
}

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
}

export type CheckboxProperty = CatalogPropertyBase & {
    type: 'checkbox';
    defaultValue: boolean;
    values?: Record<string, boolean>;
}

export type HiddenProperty = CatalogPropertyBase & {
    type: 'hidden';
    defaultValue: any;
}

export type ReadOnlyProperty = CatalogPropertyBase & {
    type: 'read-only';
    defaultValue: any;
}

export type CatalogProperty =
    | ColorProperty
    | EnumProperty
    | StringProperty
    | NumberProperty
    | LengthMeasureProperty
    | ToggleProperty
    | CheckboxProperty
    | HiddenProperty
    | ReadOnlyProperty;

export type CatalogElementProperty = CatalogProperty; //TODO: remove {}
export type CatalogElementPropertyWithDefault = CatalogElementProperty & { defaultValue?: any };

export type CatalogElementProperties = Record<string, CatalogElementProperty>;

// ============================================================================
// Property value inference helpers
// Map a catalog property config to the runtime value type used in element.properties
// ============================================================================

export type PropertyValue<T extends CatalogElementProperty> =
    T extends LengthMeasureProperty ? LengthMeasureValue :
    T extends ColorProperty ? string :
    T extends EnumProperty ? string : // stored key (currently string)
    T extends StringProperty ? string :
    T extends NumberProperty ? number :
    T extends ToggleProperty ? boolean :
    T extends CheckboxProperty ? boolean :
    T extends HiddenProperty ? any :
    T extends ReadOnlyProperty ? any :
    any;

export type ElementPropertiesValues<P extends CatalogElementProperties> = { [K in keyof P]: PropertyValue<P[K]> };

// Map each property key to its catalog property 'type' literal (e.g. 'width' -> 'length-measure').
export type PropertyTypeMap<P extends CatalogElementProperties> = { [K in keyof P]: P[K]['type'] };

// Convenience extractor: given a CatalogElementBase, get its PropertyTypeMap
export type ExtractPropertyTypeMap<E> = E extends CatalogElementBase<any, infer P> ? PropertyTypeMap<P> : never;

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
        element: PrototypeToElement[P] & { properties: { [K in keyof Props]: PropertyValue<Props[K]> } },
        layer: Layer,
        scene: Scene
    ) => ReactNode;
    render3D: (
        element: PrototypeToElement[P] & { properties: ElementPropertiesValues<Props> },
        layer: Layer,
        scene: Scene
    ) => Promise<Object3D<Object3DEventMap>>;
    updateRender3D?: (
        element: PrototypeToElement[P] & { properties: ElementPropertiesValues<Props> },
        layer: Layer,
        scene: Scene,
        mesh: Object3D<Object3DEventMap>,
        oldElement: PrototypeToElement[P] & { properties: ElementPropertiesValues<Props> },
        differences: string[],
        selfDestroy: () => void,
        selfBuild: () => Promise<any>
    ) => Promise<any>;
};

export type CatalogElementBase2 = {
    name: string;
    prototype: keyof PrototypeToElement;
    info: CatalogElementInfo;
    properties: CatalogElementProperties;
    render2D: (
        element: any,
        layer: Layer,
        scene: Scene
    ) => ReactNode;
    render3D: (
        element: any,
        layer: Layer,
        scene: Scene
    ) => Promise<Object3D<Object3DEventMap>>;
    updateRender3D?: (
        element: any,
        layer: Layer,
        scene: Scene,
        mesh: Object3D<Object3DEventMap>,
        oldElement: any,
        differences: string[],
        selfDestroy: () => void,
        selfBuild: () => Promise<any>
    ) => Promise<any>;
} extends infer Base
    ? { [K in keyof Base]: Base[K] } & {
        // 🔒 Infer properties properly
        properties: Base extends { properties: infer Props extends CatalogElementProperties }
        ? Props
        : never;
        render2D: (
            element: Base extends { prototype: infer P extends keyof PrototypeToElement, properties: infer Props extends CatalogElementProperties }
                ? PrototypeToElement[P] & { properties: { [K in keyof Props]: PropertyValue<Props[K]> } }
                : never,
            layer: Layer,
            scene: Scene
        ) => ReactNode;
        render3D: (
            element: Base extends { prototype: infer P extends keyof PrototypeToElement, properties: infer Props extends CatalogElementProperties }
                ? PrototypeToElement[P] & { properties: { [K in keyof Props]: PropertyValue<Props[K]> } }
                : never,
            layer: Layer,
            scene: Scene
        ) => Promise<Object3D<Object3DEventMap>>;
    }
    : never;

export type CatalogElementBase3 = {
    name: string;
    prototype: keyof PrototypeToElement;
    info: CatalogElementInfo;
    properties: CatalogElementProperties;
    render2D: (
        element: any,
        layer: Layer,
        scene: Scene
    ) => ReactNode;
    render3D: (
        element: any,
        layer: Layer,
        scene: Scene
    ) => Promise<Object3D<Object3DEventMap>>;
    updateRender3D?: (
        element: any,
        layer: Layer,
        scene: Scene,
        mesh: Object3D<Object3DEventMap>,
        oldElement: any,
        differences: string[],
        selfDestroy: () => void,
        selfBuild: () => Promise<any>
    ) => Promise<any>;
} & {
    // 🔒 inference: when you actually assign an object, infer Props from its `properties`
    __infer?: <P extends keyof PrototypeToElement, Props extends CatalogElementProperties>(
        x: {
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
                    properties: { [K in keyof Props]: PropertyValue<Props[K]> };
                },
                layer: Layer,
                scene: Scene
            ) => Promise<Object3D<Object3DEventMap>>;
            updateRender3D?: (
                element: PrototypeToElement[P] & {
                    properties: { [K in keyof Props]: PropertyValue<Props[K]> };
                },
                layer: Layer,
                scene: Scene,
                mesh: Object3D<Object3DEventMap>,
                oldElement: PrototypeToElement[P] & {
                    properties: { [K in keyof Props]: PropertyValue<Props[K]> };
                },
                differences: (keyof Props)[],
                selfDestroy: () => void,
                selfBuild: () => Promise<any>
            ) => Promise<any>;
        }
    ) => void;
};

export type CatalogElementBase4 =
    <P extends keyof PrototypeToElement, Props extends CatalogElementProperties>(def: {
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
                properties: { [K in keyof Props]: PropertyValue<Props[K]> };
            },
            layer: Layer,
            scene: Scene
        ) => Promise<Object3D<Object3DEventMap>>;
    }) => typeof def;

// Backward compatible non-generic union (uses loose property typing).
// Kept for existing code that relied on previous definition.
export type AnyCatalogElement =
    | CatalogElementBase<'lines', CatalogElementProperties>
    | CatalogElementBase<'holes', CatalogElementProperties>
    | CatalogElementBase<'areas', CatalogElementProperties>
    | CatalogElementBase<'items', CatalogElementProperties>;

// Generic CatalogElement alias with defaults allowing explicit instantiation if desired.
export type CatalogElement<
    P extends keyof PrototypeToElement = keyof PrototypeToElement,
    Props extends CatalogElementProperties = CatalogElementProperties
> = CatalogElementBase<P, Props>;

// Helper factory to get full inference of property value types when defining catalog elements.
// Usage: export default defineCatalogElement({ name: ..., properties: { width: { type: 'length-measure', ... } }, ... })
// Inside render2D/render3D the element parameter will have element.properties.width correctly typed.
// NOTE: Previously there was a helper function `defineCatalogElement` used to preserve
// generic inference for property value types when declaring catalog elements.
// If you want full typing WITHOUT that function, declare your element with an
// explicit generic instantiation of `CatalogElementBase` (or the `CatalogElement` alias):
//
//   type MyProps = {
//     width: { type: 'length-measure'; defaultValue: { length: 100 } };
//     color: { type: 'color'; defaultValue: '#ffffff' };
//   };
//   export const myElement: CatalogElementBase<'items', MyProps> = {
//     name: 'myElement',
//     prototype: 'items',
//     info: { title: 'My Element', description: '', image: '', tag: [] },
//     properties: {
//       width: { type: 'length-measure', defaultValue: { length: 100 } },
//       color: { type: 'color', defaultValue: '#ffffff' }
//     },
//     render2D(element, layer, scene) {
//       // element.properties.width.length is strongly typed (number)
//       return null;
//     },
//     async render3D(element, layer, scene) {
//       // Same strong typing here
//       return new Object3D();
//     }
//   };
//
// This pattern provides the same property-type safety without needing a factory function.

export type CatalogElementInfo = {
    title: string;
    description: string;
    image: string | { uri: string; width?: number; height?: number };
    tag: string[];
    visibility?: { catalog?: boolean; layerElementsVisible?: boolean };
}

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
        }
    }
}

export type ElementType = Line | Hole | Area | Item;

export type ReactPlannerStore = Store<any, UnknownAction>;

export interface ReactPlannerPluginProps {
    store: ReactPlannerStore;
    stateExtractor: (state: State) => any;
}

export type SnapMaskType = Partial<typeof SNAP_MASK>;

export type ElementPrototypes = 'areas' | 'holes' | 'items' | 'lines' | 'vertices';

export type StructuredComponentType = {
    index?: number;
    condition: boolean;
    dom: React.ReactNode;
};

export type ComponentType =
    | React.ComponentType<{ state: StateProps }>
    | StructuredComponentType;

export interface ReactPlannerStateExtractor {
    (state: State): StateProps;
}

export interface ReactPlannerPlugin {
    (store: ReactPlannerStore, stateExtractor: ReactPlannerStateExtractor): void;
}

export class ViewerEventError extends Event {
    viewerEvent: any;

    constructor(type: string, viewerEvent: any) {
        super(type);
        this.viewerEvent = viewerEvent;
    }
}

export type ElementTypes = 'area' | 'hole' | 'item' | 'line';

// ---------------------------------------------------------------------------
// Helper factory for catalog elements with full property value inference.
// Usage:
//   export default defineCatalogElement({
//     name: 'my-item',
//     prototype: 'items',
//     info: { title: 'My Item', description: '', image: '', tag: []},
//     properties: { width: { type: 'length-measure', defaultValue: { length: 100 } } },
//     render2D(element) { /* element.properties.width.length: number */ },
//     async render3D(element) { ... }
//   });
export function defineCatalogElement<
    P extends keyof PrototypeToElement,
    Props extends CatalogElementProperties
>(el: CatalogElementBase<P, Props>): CatalogElementBase<P, Props> { return el; }
