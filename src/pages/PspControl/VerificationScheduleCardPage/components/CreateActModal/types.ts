import { Nullable } from "types";
import { FormFields } from "./constants";

export interface IFormValues {
  [FormFields.verificatedOn]: string;
  [FormFields.preparedOn]: string;
  [FormFields.verificationPlace]: string;
  [FormFields.inspectedTypeId]: Nullable<string>;
}
