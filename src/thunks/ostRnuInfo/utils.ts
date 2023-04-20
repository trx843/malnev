import _ from "lodash";
import { IOstRnuInfoModel } from "../../slices/ostRnuInfo/types";
import { HierarchyNodeNames } from "./constants";

const sortObjectByKey = (targetObject: any) => {
  return Object.keys(targetObject)
    .sort()
    .reduce((obj: any, key) => {
      obj[key] = targetObject[key];
      return obj;
    }, {});
};

export const mapOstRnuInfo = (ostRnuInfo: IOstRnuInfoModel) => {
  const sortedOstRnuInfo = sortObjectByKey(ostRnuInfo);
  const sortedOstRnuInfoArr = _.reduce(
    sortedOstRnuInfo,
    (acc, value, key) => {
      if (value) {
        return [
          ...acc,
          {
            ...value,
          },
        ];
      }

      return acc;
    },
    []
  );

  return sortedOstRnuInfoArr;
};
