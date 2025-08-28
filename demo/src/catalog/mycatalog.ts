// TypeScript does not know about require.context by default, so we declare it here
declare let require: {
    context(directory: string, useSubdirectories?: boolean, regExp?: RegExp): any;
};
import { CatalogFactory, CatalogFn } from '@archef2000/react-planner';


import Area from "./areas/area/planner-element";
import Wall from "./lines/wall/planner-element";

export function createCatalog() {
    const catalog = CatalogFactory();

    CatalogFn.registerElement(catalog, Area);
    CatalogFn.registerElement(catalog, Wall);


    const Holes: any[] = [];
    const holesContext = require.context('./holes/', true, /planner-element\.[tj]sx$/);
    holesContext.keys().forEach((key: string) => {
        const element = holesContext(key).default;
        Holes.push(element);
        CatalogFn.registerElement(catalog, element);
    });

    const Items: any[] = [];
    const itemsContext = require.context('./items/', true, /planner-element\.[tj]sx$/);
    itemsContext.keys().forEach((key: string) => {
        const element = itemsContext(key).default;
        Items.push(element);
        CatalogFn.registerElement(catalog, element);
    });
    CatalogFn.registerCategory(catalog, 'windows', 'Windows', Holes.filter(h => h.info.tag.includes("window")));
    CatalogFn.registerCategory(catalog, 'doors', 'Doors', Holes.filter(h => h.info.tag.includes("door")));
    return catalog;
}

export default createCatalog();
