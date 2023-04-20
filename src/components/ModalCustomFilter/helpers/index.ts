import { IGenericFilterConfig } from "../../CustomFilter/interfaces";
import { FilterObject, ListFilterBase } from "../../../interfaces";
import { OptionData } from "../../../global";

export const isEmptyOptions = (options: OptionData[] | undefined) =>
  !Array.isArray(options) || options.length === 0;

export const getDependsOnTreeField = (
  config: IGenericFilterConfig,
  keys: string | string[]
): Set<string> => {
  const fields = new Set<string>();

  for (let i = 0; i < config.filterList.length; i++) {
    const field = config.filterList[i];
    if (Array.isArray(keys)) {
      keys.forEach((key) => {
        if (field[key as keyof typeof field]) {
          fields.add(field.propName);
        }
      });
    }
    if (typeof keys === "string" && field[keys as keyof typeof field]) {
      fields.add(field.propName);
    }
  }

  return fields;
};

export const getGroup = (group: any, fields: Set<string>) => {
  return Object.keys(group).reduce((acc, key) => {
    if (fields.has(key)) {
      return {
        ...acc,
        [key]: group[key],
      };
    }
    return acc;
  }, {});
};

export const partiallyReset = (
  filterConfig: IGenericFilterConfig,
  values: ListFilterBase,
  keys: string | string[]
): ListFilterBase => {
  const fields = getDependsOnTreeField(filterConfig, keys);
  const newFilter = Object.keys(values.filter).reduce((acc, key) => {
    if (key === "treeFilter") {
      return acc;
    }
    const group = getGroup(values.filter[key as keyof FilterObject], fields);
    if (Object.keys(group).length === 0) {
      return acc;
    }
    return {
      ...acc,
      [key]: group,
    };
  }, {});

  return newFilter as ListFilterBase;
};
