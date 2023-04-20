import moment from "moment";
import { Nullable } from "types";
import { FormFields } from "./contants";
import { IFormValues } from "./types";
import { ViolationStatuses } from "../../../../../../../enums";

const formatDate = (date: Nullable<string>) => {
  if (!date) return null;

  const momentObj = moment(date);

  if (momentObj.isValid())
    return momentObj
      .startOf("day")
      .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

  return null;
};

export const adjustValues = (values: IFormValues) => {
  const presenceOfViolation = values[FormFields.PresenceOfViolation];

  return {
    [FormFields.DateOfVerificationFrom]: formatDate(
      values[FormFields.DateOfVerificationFrom]
    ),
    [FormFields.DateOfVerificationBy]: formatDate(
      values[FormFields.DateOfVerificationBy]
    ),
    [FormFields.PresenceOfViolation]:
      presenceOfViolation !== ViolationStatuses.None
        ? presenceOfViolation
        : null,
  };
};
