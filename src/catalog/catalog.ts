import {
  PropertyColor,
  PropertyEnum,
  PropertyString,
  PropertyNumber,
  PropertyLengthMeasure,
  PropertyToggle,
  PropertyCheckbox,
  PropertyHidden,
  PropertyReadOnly
} from './properties/export';

import { UNIT_CENTIMETER, UnitLengthType } from '../constants';
import { Layer, Line, Scene, Hole, Area, Item } from '../models';
import { ReactNode } from 'react';
import { Object3DEventMap, Object3D } from 'three';
import { CatalogElementInfo, CatalogElement, CatalogElementBase, PrototypeToElement } from '../types';

export type CatalogJson = {
  elements: Record<string, CatalogElement>;
  categories: {
    root: {
      [key: string]: any;
    };
    [key: string]: any;
  };
  propertyTypes: Record<string, any>;
  unit: UnitLengthType;
}

export const CatalogFn = {
  /** @description Get catalog's element
   *  @param catalog Catalog object
   *  @param type Element's type
   *  @return Element
  */
  getElement: <Name extends keyof CatalogJson['elements']>(catalog: CatalogJson, type: Name): CatalogElementBase<keyof PrototypeToElement> => {
    const elements = catalog.elements;
    if (Object.prototype.hasOwnProperty.call(elements, type)) {
      return elements[type];
    }
    throw new Error(`Element ${String(type)} does not exist in catalog`);
  },

  /** @description Get catalog category
   *  @param catalog Catalog object
   *  @param categoryName Name of category
   *  @return Category
  */
  getCategory: (catalog: CatalogJson, categoryName: string) => {
    if (CatalogFn.hasCategory(catalog, categoryName)) {
      return catalog.categories[categoryName];
    }
    throw new Error(`Category ${categoryName} does not exist in catalog`);
  },

  /** @description Return type of a specfied property
   *  @param catalog Catalog object
   *  @param type Property type
   *  @return Property
  */
  getPropertyType: (catalog: CatalogJson, type: string) => {
    if (catalog.propertyTypes.hasOwnProperty(type)) {
      return catalog.propertyTypes[type];
    }
    throw new Error(`Element ${type} does not exist in catalog`);
  },

  /** @description Register a new element
   *  @param {CatalogJson} catalog Catalog object
   *  @param {object} json Element structure
   *  @return {void}
  */
  registerElement: (catalog: CatalogJson, json: CatalogElement): void => {
    //json.properties = json.properties || {};
    if (CatalogFn.validateElement(catalog, json)) {
      catalog.elements[json.name] = json;
      catalog.categories.root.elements.push(catalog.elements[json.name]);
    }
  },

  /** @description Register multiple elements
   *  @param {CatalogJson} catalog Catalog object
   *  @param {array} [elementArray] Array of elements
   *  @return {void}
  */
  registerMultipleElements: (catalog: CatalogJson, elementArray: Array<any>): void => {
    elementArray.forEach(el => CatalogFn.registerElement(catalog, el));
  },

  /** @description Register a new property
   *  @param {CatalogJson} catalog Catalog object
   *  @param {string} type Type of property
   *  @param {object} Viewer Property viewer component
   *  @param {object} Editor Property editor component
   *  @return {void}
  */
  registerPropertyType: (catalog: CatalogJson, type: string, Viewer: object, Editor: object): void => {
    catalog.propertyTypes[type] = { type, Viewer, Editor };
  },

  /** @description Register multiple property
   *  @param {CatalogJson} catalog Catalog object
   *  @param {array} propertyTypeArray Array of properties
   *  @return {void}
  */
  registerMultiplePropertyType: (catalog: CatalogJson, propertyTypeArray: Array<[string, any, any]>): void => {
    propertyTypeArray.forEach(el => CatalogFn.registerPropertyType(catalog, ...el));
  },

  /** @description Validate an element
   *  @param {CatalogJson} catalog Catalog object
   *  @param {object} json Element's structure
   *  @return {?boolean}
  */
  validateElement: (catalog: CatalogJson, json: CatalogElement): boolean | null => {
    if (!json.hasOwnProperty('name')) throw new Error('Element not valid');

    const name = json.name;
    if (!json.hasOwnProperty('prototype')) throw new Error(`Element ${name} doesn't have prototype`);

    if (!json.hasOwnProperty('info')) throw new Error(`Element ${name} doesn't have info`);
    if (!json.info.hasOwnProperty('tag')) throw new Error(`Element ${name} doesn't have tag`);
    if (!json.info.hasOwnProperty('description')) throw new Error(`Element ${name} doesn't have description`);
    if (!json.info.hasOwnProperty('image')) throw new Error(`Element ${name} doesn't have image`);

    if (!json.hasOwnProperty('render2D')) throw new Error(`Element ${name} doesn't have render2D handler`);
    if (!json.hasOwnProperty('render3D')) throw new Error(`Element ${name} doesn't have render3D handler`);
    if (!json.hasOwnProperty('properties')) throw new Error(`Element ${name} doesn't have properties`);

    for (const propertyName in json.properties) {
      const propertyConfigs = json.properties[propertyName];
      if (!propertyConfigs.hasOwnProperty('type')) throw new Error(`Element ${name}, Property ${propertyName} doesn't have type`);
      if (!propertyConfigs.hasOwnProperty('defaultValue')) throw new Error(`Element ${name}, Property ${propertyName} doesn't have defaultValue`);
    }

    return true;
  },

  /** @description Check if catalog has element
   *  @param {CatalogJson} catalog Catalog object
   *  @param {string} type Element's type
   *  @return {boolean}
  */
  hasElement: (catalog: CatalogJson, type: string): boolean => {
    return catalog.elements.hasOwnProperty(type);
  },

  /** @description Register a new category
   *  @param {CatalogJson} catalog Catalog object
   *  @param {string} name Name of category
   *  @param {string} label Label of category
   *  @param {array} [childs] Category's childs
   *  @return {?object} Registered category
  */
  registerCategory: (catalog: CatalogJson, name: string, label: string, childs: any[]): object | null => {
    if (CatalogFn.validateCategory(catalog, name, label)) {
      catalog.categories[name] = { name, label, categories: [], elements: [] };
      catalog.categories.root.categories.push(catalog.categories[name]);

      if (childs) {
        childs.forEach(el => CatalogFn.addToCategory(catalog, name, el));
      }

      return catalog.categories[name];
    }
    return null;
  },

  /** @description Add an element to the specified category
   *  @param {CatalogJson} catalog Catalog object
   *  @param {string} name Name of category
   *  @param {object} child Element's structure
   *  @return {?void}
  */
  addToCategory: (catalog: CatalogJson, name: string, child: any): void | null => {
    if (CatalogFn.hasElement(catalog, child.name)) {
      catalog.categories[name].elements.push(child);
      catalog.categories.root.elements.splice(catalog.categories.root.elements.indexOf(child), 1);
    } else if (CatalogFn.hasCategory(catalog, child.name)) {
      catalog.categories[name].categories.push(child);
      catalog.categories.root.categories.splice(catalog.categories.root.categories.indexOf(child), 1);
    } else {
      throw new Error(`child ${child} is either category nor element`);
    }
  },

  /** @description Check if category contain element
   *  @param {CatalogJson} catalog Catalog object
   *  @param {string} categoryName Name of category
   *  @param {string} elementName Name of element
   *  @return {boolean}
  */
  categoryHasElement: (catalog: CatalogJson, categoryName: string, elementName: string): boolean => {
    return CatalogFn.hasCategory(catalog, categoryName) && catalog.categories[categoryName].elements.some(el => el.name === elementName);
  },

  /** @description Validate a category
   *  @param {CatalogJson} catalog Catalog object
   *  @param {string} name Name of category
   *  @param {string} label Label of category
   *  @return {?boolean}
  */
  validateCategory: (catalog: CatalogJson, name: string, label: string): boolean | null => {
    if (!name) {
      throw new Error('Category has undefined name');
    }
    if (name === '') {
      throw new Error('Category has empty name');
    }
    if (CatalogFn.hasCategory(catalog, name)) {
      throw new Error('Category has already been registered');
    }

    return true;
  },

  /** @description Verify if catalog already contain a category with specified name
   *  @param {CatalogJson} catalog Catalog object
   *  @param {string} categoryName Name of category
   *  @return {boolean}
  */
  hasCategory: (catalog: CatalogJson, categoryName: string): boolean => {
    return catalog.categories.hasOwnProperty(categoryName);
  },
}

export function CatalogFactory(unit: UnitLengthType = UNIT_CENTIMETER): CatalogJson {
  const catalog = {
    unit,
    elements: {},
    categories: { root: { name: 'root', label: '/', elements: [], categories: [] } },
    propertyTypes: {},
  }
  CatalogFn.registerMultiplePropertyType(catalog, [
    ['color', PropertyColor, PropertyColor],
    ['enum', PropertyEnum, PropertyEnum],
    ['string', PropertyString, PropertyString],
    ['number', PropertyNumber, PropertyNumber],
    ['length-measure', PropertyLengthMeasure, PropertyLengthMeasure],
    ['toggle', PropertyToggle, PropertyToggle],
    ['checkbox', PropertyCheckbox, PropertyCheckbox],
    ['hidden', PropertyHidden, PropertyHidden],
    ['read-only', PropertyReadOnly, PropertyReadOnly]
  ])
  return catalog;
}
