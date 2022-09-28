import { QueryDisplay } from "im-library/dist/types/interfaces/Interfaces";
import { Enums } from "im-library";
const { QueryDisplayType } = Enums;

export function convertQueryToQueryDisplay(queryAPI: any) {
  const queryUI = {} as QueryDisplay;
  queryUI.children = [] as QueryDisplay[];
  buildRecursively(queryAPI, queryUI);
  return queryUI;
}

export function buildQueryDisplay(label: string, queryAPIObject: any): QueryDisplay {
  const queryDisplay = {
    key: Math.floor(Math.random() * 9999999999999999),
    label: label,
    type: isPrimitiveType(queryAPIObject) ? QueryDisplayType.Complex : QueryDisplayType.Default,
    // value: queryAPIObject,
    children: [] as QueryDisplay[],
    selectable: true
  } as QueryDisplay;
  return queryDisplay;
}

function buildRecursively(queryAPI: any, queryUI: QueryDisplay) {
  if (queryAPI != null) {
    Object.keys(queryAPI).forEach(key => {
      console.log(key, typeof queryAPI[key]);

      if (isPrimitiveType(queryAPI[key])) {
        const queryDisplay = buildQueryDisplay(key, queryAPI[key]);
        queryDisplay.value = queryAPI[key];
        queryUI.children?.push(queryDisplay);
      } else if (isArray(queryAPI[key])) {
        queryAPI[key].forEach((element: any) => {
          const queryDisplay = buildQueryDisplay(key, element);
          queryUI.children?.push(queryDisplay);
          buildRecursively(element, queryDisplay);
        });
      } else if (isObject(queryAPI[key])) {
        const queryDisplay = buildQueryDisplay(key, queryAPI[key]);
        queryUI.children?.push(queryDisplay);
        buildRecursively(queryAPI[key], queryDisplay);
      }
    });
  }
}

function isPrimitiveType(object: any) {
  const primitiveTypes = ["string", "boolean"];
  return primitiveTypes.includes(typeof object);
}

function isObject(object: any) {
  return typeof object === "object";
}

function isArray(object: any) {
  return Array.isArray(object);
}
