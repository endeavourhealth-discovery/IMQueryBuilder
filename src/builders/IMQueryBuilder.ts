import { QueryObject } from "im-library/dist/types/interfaces/Interfaces";
import { Query } from "im-library/dist/types/models/modules/AutoGen";
import { Helpers } from "im-library";
const { DataTypeCheckers } = Helpers;
const { isObject, isObjectHasKeys, isArrayHasLength } = DataTypeCheckers;

export function buildIMQuery(queryObject: QueryObject) {
  const imquery = {} as Query;
  buildRecursively(queryObject, imquery);
  return imquery;
}

function buildRecursively(queryObject: QueryObject, imquery: any) {
  if (isObjectHasKeys(queryObject) && isObject(imquery)) {
    if (isArrayHasLength(queryObject.children)) {
      imquery[queryObject.label] = queryObject.type.secondType === "java.util.List" ? [] : {};
      for (const child of queryObject.children!) {
        buildRecursively(child, imquery[queryObject.label]);
      }
    } else if (isObjectHasKeys(queryObject, ["value"])) {
      imquery[queryObject.label] = queryObject.value;
    }
  } else if (isObjectHasKeys(queryObject) && Array.isArray(imquery)) {
    if (isArrayHasLength(queryObject.children)) {
      const value = {} as any;
      value[queryObject.label] = queryObject.type.secondType === "java.util.List" ? [] : {};
      imquery.push(value);
      for (const child of queryObject.children!) {
        buildRecursively(child, imquery);
      }
    } else if (isObjectHasKeys(queryObject, ["value"])) {
      imquery.push(queryObject.value);
    }
  }
}
