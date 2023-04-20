import { IPspcontrolVerificationLevelsResponse } from "../../../../api/responses/get-pspcontrol-verification-levels.response";
import { VerificationScheduleItem } from "../../../../pages/PspControl/VerificationSchedulePage/classes";
import { Nullable } from "../../../../types";
import { FormFields } from "./constants";

export interface IFormValues {
  [FormFields.radioGroup]: string;
  [FormFields.verificationScheduleId]: string;
  [FormFields.verificationLevelId]: number;
  [FormFields.checkTypeId]: string;
  [FormFields.inspectionYear]: Nullable<string>;
}

export interface IDictionaries {
  verificationSchedules: VerificationScheduleItem[];
  verificationLevels: IPspcontrolVerificationLevelsResponse[];
}
