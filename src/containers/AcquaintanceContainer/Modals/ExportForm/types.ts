import moment from "moment";
import { Nullable } from "types";
import { FormFields } from "./constants";

export interface IFormValues {
  [FormFields.verificationLevelId]: string;
  [FormFields.acquaintanceDateInterval]: Nullable<moment.Moment[]>;
  [FormFields.inspectionYear]: Nullable<string>;
  [FormFields.ostId]: Nullable<string>;
  [FormFields.pspId]: Nullable<string>;
}
