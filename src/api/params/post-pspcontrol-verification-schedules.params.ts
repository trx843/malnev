import { PspcontrolVerificationScheduleSiknLabRsuInfo } from "./put-pspcontrol-verification-schedules.params";

export interface IPostPspcontrolVerificationSchedulesParams {
  verificationLevelId: number;
  checkTypeId: string;
  inspectionYear: string;
  siknLabRsuInfoArray: PspcontrolVerificationScheduleSiknLabRsuInfo[];
}
