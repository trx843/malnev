import { TypicalPlanCardDtoType } from "api/requests/pspControl/plan-typical-violations/dto-types";
import { Nullable } from "types";

export const getDataRange = (
  typicalPlanCard: Nullable<TypicalPlanCardDtoType>
) => {
  const planName = typicalPlanCard?.planName;

  if (planName) {
    const dateRangeString = planName.match(/\d\d\d\d-\d\d\d\d/);
    const dataRange = dateRangeString?.[0].split("-");

    if (dataRange) return dataRange;

    return [null, null];
  }

  return [null, null];
};
