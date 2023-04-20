import { Nullable } from "types";
import { FormFields } from "./contants";

export interface IFormValues {
  [FormFields.DateOfVerificationFrom]: Nullable<string>;
  [FormFields.DateOfVerificationBy]: Nullable<string>;
  [FormFields.PresenceOfViolation]: number;
}
