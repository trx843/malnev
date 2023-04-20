import _ from "lodash";
import { OwnStatuses } from "slices/pspControl/verificationSchedule/constants";
import { ICheckingObjectsModalFilter } from "../../../../../../../slices/pspControl/verificationScheduleCard/types";

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
  isOwn: boolean | null,
  values: ICheckingObjectsModalFilter
) => {
  return {
    pageIndex: 0,
    isSortAsc: true,
    sortedField: name,
    filter: {
      treeFilter: {
        nodePath: "all",
        isOwn: isOwn,
      },
      ...values,
    },
  };
};
