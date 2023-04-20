import { formatDate } from "utils";
import { FormFields } from "./constants";
import { IFormValues } from "./types";

export const getPlanName = (values: IFormValues) => {
  const verificationPeriodFrom = values[FormFields.verificationPeriodFrom];
  const verificationPeriodFor = values[FormFields.verificationPeriodFor];

  const formattedVerificationPeriodFrom = formatDate(
    verificationPeriodFrom,
    "YYYY"
  );
  const formattedVerificationPeriodFor = formatDate(
    verificationPeriodFor,
    "YYYY"
  );

  return `План мероприятий по устранению типовых нарушений ${formattedVerificationPeriodFrom}-${formattedVerificationPeriodFor}`;
};
