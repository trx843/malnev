import { Nullable } from "types";
import { FormFields } from "./constants";

export interface IFormValues {
  [FormFields.verificationPeriodFrom]: Nullable<string>;
  [FormFields.verificationPeriodFor]: Nullable<string>;
}
