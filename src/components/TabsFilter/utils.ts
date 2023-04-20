import _ from "lodash";
import { IFiltersDescription } from "../../types";

export const groupFilterListByGroup = (filterList: IFiltersDescription[]) => {
  const groupedObject = _.groupBy(filterList, "displayGroupName");

  const numberOfGroups = Object.keys(groupedObject).length;

  if (numberOfGroups > 1) return groupedObject;

  return filterList;
};

export const serializeValuesForFetchSelectOptions = <T extends object>(
  name: string,
  values: T,
  filterList: IFiltersDescription[]
) => {
  const adjustedValues = _.reduce(
    values,
    (acc, value, key) => {
      const filter = filterList.find((filter) => filter.propName === key);
      const filterValueName = filter?.filterValueName;

      if (!filterValueName || filterValueName === name) return acc;

      return {
        ...acc,
        [filterValueName]: value,
      };
    },
    {}
  );

  return adjustedValues;
};

export const mapTabsFilterOptions = (options: string[]) => {
  if (Array.isArray(options) && options.length) {
    const adjustedOptions = options.reduce((acc, option: string) => {
      if (_.isNull(option)) return acc;

      return [
        ...acc,
        {
          label: option,
          value: option,
        },
      ];
    }, []);

    return adjustedOptions;
  }

  return [];
};
