import { IdType } from "../../types";

export interface PspcontrolVerificationSchedulesParams {
  verificationScheduleId: string,
  siknLabRsuInfoArray: PspcontrolVerificationScheduleSiknLabRsuInfo[],
}

export interface PspcontrolVerificationScheduleSiknLabRsuInfo {
  ostRnuPspId: IdType,
  siknLabRsuId: string,
}
