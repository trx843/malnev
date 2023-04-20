import { IPspcontrolVerificationLevelsResponse } from "api/responses/get-pspcontrol-verification-levels.response";

export interface ISchedule {
  id: string;
  label: string;
}

export interface IDictionaries {
  verificationSchedules: ISchedule[];
  verificationLevels: IPspcontrolVerificationLevelsResponse[];
}
