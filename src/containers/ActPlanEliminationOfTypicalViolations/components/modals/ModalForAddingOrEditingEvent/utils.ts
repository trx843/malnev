import { FormFields, RadioGroupValues } from "./constants";

export const isNeedAction = (values: any) => {
  return values[FormFields.IsNeedAction];
};

export const isPermanent = (values: any) => {
  return values[FormFields.IsPermanent] === RadioGroupValues.yes;
};
