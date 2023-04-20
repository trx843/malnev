import moment, { Moment } from "moment";
import { Nullable } from "../../../../../types";
import { FormFields } from "./constants";
import { IFormValues } from "./constants";

const formatDate = (
  dates: Moment[]
) => {
  if (!dates) return null;
  const momentStartDate = dates[0];
  const momentEndDate = dates[1];

  if (momentStartDate.isValid() && momentEndDate.isValid())
    return [momentStartDate
      .startOf("day")
      .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),momentEndDate
      .endOf("day")
      .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)];
  return null;
};

export const serializeValues = (values: IFormValues) => {
  const eventTypes =values[FormFields.EventTypes].map(type => type.split('-').pop());
  return {
    [FormFields.DateRange]: formatDate(values[FormFields.DateRange]),
    [FormFields.ForExecution]: values[FormFields.ForExecution],
    [FormFields.OnlyUnread]: values[FormFields.OnlyUnread],
    [FormFields.EventTypes]: eventTypes,
  };
};
