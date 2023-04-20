import _ from "lodash";
import { ITabsFilterFormValues } from "../../../../../../components/TabsFilter/types";
import { IViolationModalFilter } from "../../../../../../slices/pspControl/actionPlanTypicalViolations/types";

export const mapOptions = (options: string[]) => {
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

export const getListFilterBaseParams = (
  name: string,
  values: IViolationModalFilter
) => {
  return {
    pageIndex: 0,
    isSortAsc: true,
    sortedField: name,
    filter: {
      treeFilter: {
        nodePath: "all",
        isOwn: null,
      },
      ...values,
    },
  };
};
