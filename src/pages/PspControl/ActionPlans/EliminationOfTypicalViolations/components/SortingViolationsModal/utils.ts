import _ from "lodash";
import { ITypicalViolationsForPlanCardWithActionPlanModel } from "slices/pspControl/actionPlanTypicalViolations/types";
import { FormValues } from "./types";

export const adjustTypicalViolationSerial = (
  data: ITypicalViolationsForPlanCardWithActionPlanModel[]
): any[] => {
  return data.map((item, index) => ({
    ...item,
    typicalViolationSerial: index + 1,
  }));
};

export const adjustValues = (
  values: FormValues,
  data: ITypicalViolationsForPlanCardWithActionPlanModel[]
) => {
  return _.reduce(
    values,
    (acc, value, key) => {
      const itemById = data.find((i) => i.id == key);
      if (itemById) {
        return [
          ...acc,
          {
            id: itemById.id,
            newSerial: Number(itemById.typicalViolationSerial),
            violationText: value.typicalViolationText,
            pointNormativeDocuments: value.pointNormativeDocuments,
          },
        ];
      }

      return acc;
    },
    []
  );
};

export const getInitialValues = (
  items: ITypicalViolationsForPlanCardWithActionPlanModel[]
) => {
  return items.reduce((acc, item) => {
    return {
      ...acc,
      [item.id]: {
        typicalViolationText: item.typicalViolationText,
        pointNormativeDocuments: item.pointNormativeDocuments,
      },
    };
  }, {});
};
