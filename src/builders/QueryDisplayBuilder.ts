import { QueryDisplay } from "im-library/dist/types/interfaces/Interfaces";
import { Enums, Services, Vocabulary, Helpers } from "im-library";
import axios from "axios";

const { DataTypeCheckers } = Helpers;
const { isArrayHasLength, isObjectHasKeys, isObject } = DataTypeCheckers;
const { RDFS, IM } = Vocabulary;
const { EntityService } = Services;
const { QueryDisplayType } = Enums;
const entityService = new EntityService(axios);

export function buildQueryToQueryDisplay(queryAPI: any) {
  const queryUI = {} as QueryDisplay;
  queryUI.children = [] as QueryDisplay[];
  buildRecursively(queryAPI, queryUI);
  return queryUI;
}

export function buildQueryDisplay(label: string, type?: any, value?: any, selectable?: boolean): QueryDisplay {
  return {
    key: Math.floor(Math.random() * 9999999999999999),
    label: label,
    type: type,
    value: value,
    children: [] as QueryDisplay[],
    selectable: selectable
  } as QueryDisplay;
}

function buildRecursively(queryAPI: any, queryUI: QueryDisplay) {
  if (queryAPI !== null) {
    Object.keys(queryAPI).forEach(key => {
      if (isIncluded(key, queryAPI[key])) {
        if (isSimpleWhere(key, queryAPI[key])) {
          addSimpleWhere(queryAPI, key, queryUI);
        }

        if ("from" === key) {
          addFrom(queryAPI, key, queryUI);
        } else if (isPrimitiveType(queryAPI[key])) {
          addPrimitiveType(queryAPI, key, queryUI);
        } else if (isArrayHasLength(queryAPI[key])) {
          addArray(queryAPI, key, queryUI);
        } else if (isObject(queryAPI[key])) {
          addObject(queryAPI, key, queryUI);
        }
      }
    });
  }
}

function isIncluded(key: string, value: any) {
  if ("path" === key && IM.ROLE_GROUP === value) return false;
  const excluded = ["activeOnly"];
  return !excluded.includes(key);
}

function isPrimitiveType(object: any) {
  const primitiveTypes = ["string", "boolean"];
  return primitiveTypes.includes(typeof object);
}

function isIri(object: any) {
  if (typeof object === "string") {
    object = object as string;
    return object.startsWith("http://") || object.startsWith("http://");
  }
  return false;
}

function isSimpleWhere(key: string, object: any) {
  const whereClauses = ["where", "notExist"];
  if (whereClauses.includes(key)) {
    const keys = Object.keys(object);
    return keys.length === 2 && keys.includes("is") && keys.includes("property");
  }
  return false;
}

function isSimpleOr(key: string, object: any) {
  const simpleOr = ["or"];
  if (simpleOr.includes(key)) {
    const keys = Object.keys(object);
    return keys.length === 1 && keys.includes("from");
  }
  return false;
}

function addSimpleOr(queryAPI: any, index: number, key: string, queryUI: QueryDisplay) {
  const fromList: any[] = [];
  const element = { ...queryAPI[key][index] };
  delete queryAPI[key];
  if (isObjectHasKeys(element, ["from"])) {
    element.from.forEach(async (from: any) => {
      from.label = (await entityService.getPartialEntity(from["@id"], [RDFS.LABEL]))[RDFS.LABEL];
      fromList.push(from);
    });
  }
  const queryDisplay = buildQueryDisplay(key, QueryDisplayType.SimpleOr, fromList);
  queryUI.children?.push(queryDisplay);
}

function addFrom(queryAPI: any, key: string, queryUI: QueryDisplay) {
  queryAPI[key].forEach(async (from: any) => {
    const label = (await entityService.getPartialEntity(from["@id"], [RDFS.LABEL]))[RDFS.LABEL];
    const queryDisplay = buildQueryDisplay(label, QueryDisplayType.From, from);
    queryUI.children?.unshift(queryDisplay);
  });
}

function addPrimitiveType(queryAPI: any, key: string, queryUI: QueryDisplay) {
  const queryDisplay = buildQueryDisplay(key, getQueryDisplayType(queryAPI[key]));
  queryDisplay.value = queryAPI[key];
  queryUI.children?.push(queryDisplay);
}

function addArray(queryAPI: any, key: string, queryUI: QueryDisplay) {
  queryAPI[key].forEach((element: any, index: number) => {
    if (isSimpleOr(key, element)) {
      addSimpleOr(queryAPI, index, key, queryUI);
    } else {
      const queryDisplay = buildQueryDisplay(key, getQueryDisplayType(element));
      queryUI.children?.push(queryDisplay);
      buildRecursively(element, queryDisplay);
    }
  });
}

function addObject(queryAPI: any, key: string, queryUI: QueryDisplay) {
  const queryDisplay = buildQueryDisplay(key, getQueryDisplayType(queryAPI[key]));
  buildRecursively(queryAPI[key], queryDisplay);
  queryUI.children?.push(queryDisplay);
}

function addSimpleWhere(queryAPI: any, key: string, queryUI: QueryDisplay) {
  const where = buildQueryDisplay(key, QueryDisplayType.Default);
  where.children?.push(buildQueryDisplay(key, QueryDisplayType.PropertyIs, { ...queryAPI[key] }));
  queryUI.children?.push(where);
  delete queryAPI[key];
}

function getQueryDisplayType(queryAPIObject: any) {
  if (typeof queryAPIObject === "boolean") return QueryDisplayType.Boolean;
  else if (isIri(queryAPIObject)) return QueryDisplayType.Iri;
  else if (typeof queryAPIObject === "string") return QueryDisplayType.String;
  return QueryDisplayType.Default;
}
