import { Nullable } from "../../../../../types";
import { FormFields } from "./constants";

export interface IFormValues {
  [FormFields.OwnThirdParty]: number;
  [FormFields.DateOfIntroduction]: Nullable<string>;
  [FormFields.TransportedProduct]: number;
}
