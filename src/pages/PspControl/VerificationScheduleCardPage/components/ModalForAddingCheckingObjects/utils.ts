import { OwnStatuses } from "slices/pspControl/verificationSchedule/constants";
import { ISiknLabRsuVerificationSchedulesModel } from "slices/pspControl/verificationScheduleCard/types";
import { OstValues } from "../ModalScheduleEditing/types";

const getAdjustedOwnType = (type: OwnStatuses) => {
  if (type === OwnStatuses.own) return true;
  if (type === OwnStatuses.out) return false;
  return null;
};

export const getCheckingObjectsParams = (
  verificationScheduleCardInfo: ISiknLabRsuVerificationSchedulesModel
) => {
  const scheduleId = verificationScheduleCardInfo?.id.toString();
  const verificationLevel = verificationScheduleCardInfo?.verificationLevel;
  const ostsName = verificationScheduleCardInfo?.ostsName;
  const ownType = verificationScheduleCardInfo?.ownType;

  return {
    id: scheduleId,
    isOwn: getAdjustedOwnType(ownType),
    ...(verificationLevel === OstValues.Ost && {
      ostName: ostsName?.[0],
    }),
  };
};
