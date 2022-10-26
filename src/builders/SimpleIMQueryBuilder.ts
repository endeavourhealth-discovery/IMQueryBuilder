import { SetQueryObject, TTIriRef } from "im-library/dist/types/interfaces/Interfaces";
import { Helpers, Services } from "im-library";
import { Query, Select } from "im-library/dist/types/models/modules/AutoGen";
const {
  DataTypeCheckers: { isObjectHasKeys, isArrayHasLength }
} = Helpers;

export function buildIMQuery(selectProperties: TTIriRef[], clauses: SetQueryObject[]): any {
  const imquery = {
    where: {
      from: [] as any[]
    }
  } as any;

  if (selectProperties.length) addSelectProperties(imquery, selectProperties);
  addClauses(imquery, clauses);

  return { query: imquery };
}

function addClauses(imquery: any, clauses: SetQueryObject[]) {
  for (const clause of clauses) {
    if (clause.include) {
      if (!isObjectHasKeys(imquery.where, ["from"])) {
        imquery.where.from = [] as any;
      }
      imquery.where.from.push(clause.concept);
    } else if (!clause.include) {
      if (!isObjectHasKeys(imquery.where, ["notExists"])) {
        imquery.where.notExist = {
          from: [] as any[]
        };
      }
      imquery.where.notExist.from.push(clause.concept);
    }

    if (isArrayHasLength(clause.refinements)) {
      imquery.where.path = "http://endhealth.info/im#roleGroup";
      imquery.where.and = [] as any[];
    }

    for (const refinement of clause.refinements) {
      imquery.where.and.push(refinement);
    }
  }
}

function addSelectProperties(imquery: Query, selectProperties: TTIriRef[]) {
  imquery.select = [];

  for (const selectProperty of selectProperties) {
    const property = {
      property: {
        "@id": selectProperty["@id"]
      }
    } as Select;
    imquery.select.push(property);
  }
}
