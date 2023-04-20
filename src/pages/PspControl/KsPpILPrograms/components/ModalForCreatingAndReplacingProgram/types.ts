import moment from "moment";
import { FormFields } from "./constants";

export interface IFormValues {
  [FormFields.ProgramType]: number;
  [FormFields.TransportedProduct]: number;
  [FormFields.OwnThirdParty]: number;
  [FormFields.DateOfIntroduction]: moment.Moment;
  [FormFields.DateOfApproval]: moment.Moment;
  [FormFields.File]: any[];
}
