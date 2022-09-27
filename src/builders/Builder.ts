export interface Field {
  name: string;
  type: string;
  genericType: string | GenericType;
}

export interface FieldUI {
  name: string;
  simplifiedType: SimplifiedType;
}

export interface GenericType {
  actualTypeArguments: string[];
  rawType: string;
  typeName: string;
}

export interface QueryObject {
  key: number;
  label: string;
  type: SimplifiedType;
  value?: any;
  children?: QueryObject[];
  selectable?: boolean;
}

export interface SimplifiedType {
  firstType: string;
  secondType?: string;
}

export function convertQueryToQueryObject(queryAPI: any) {
  const queryUI = {} as QueryObject;
  queryUI.children = [] as QueryObject[];
  buildRecursively(queryAPI, queryUI);
  return queryUI;
}

export function buildQueryObject(label: string, queryAPIObject: any) {
  const queryObject = {
    key: Math.floor(Math.random() * 9999999999999999),
    label: label,
    // type: { firstType: "org.endeavourhealth.imapi.model.tripletree.TTIriRef" },
    // value: { "@id": selected.value["@id"], name: selected.value.name },
    children: [] as QueryObject[],
    selectable: true
  } as QueryObject;
  return queryObject;
}

function buildRecursively(queryAPI: any, queryUI: QueryObject) {
  if (queryAPI != null) {
    Object.keys(queryAPI).forEach(key => {
      console.log(key, typeof queryAPI[key]);

      if (isPrimitiveType(queryAPI[key])) {
        const queryObject = buildQueryObject(key, queryAPI[key]);
        queryObject.value = queryAPI[key];
        queryUI.children?.push(queryObject);
      } else if (isArray(queryAPI[key])) {
        queryAPI[key].forEach((element: any) => {
          const queryObject = buildQueryObject(key, element);
          queryUI.children?.push(queryObject);
          buildRecursively(element, queryObject);
        });
      } else if (isObject(queryAPI[key])) {
        const queryObject = buildQueryObject(key, queryAPI[key]);
        queryUI.children?.push(queryObject);
        buildRecursively(queryAPI[key], queryObject);
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
