import { Nullable } from "../../../../../types";
import { FormFields } from "./constants";

export interface IFormValues {
  [FormFields.Psp]: string;
  [FormFields.Ost]: string;
  [FormFields.Owned]: string;
  [FormFields.DateOfVerification]: Nullable<moment.Moment>;
  [FormFields.PlannedEliminationTime]: Nullable<moment.Moment>;
  [FormFields.ContentOfIdentifiedViolation]: string;
}
