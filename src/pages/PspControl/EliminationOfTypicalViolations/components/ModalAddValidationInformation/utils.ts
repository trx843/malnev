import moment from "moment";
import { IEliminationTypicalViolationSettingsModel } from "api/requests/eliminationOfTypicalViolations/types";
import { FormFields } from "./constants";
import { IFormValues } from "./types";
import { User } from "classes";

export const getFormValues = (
  settingsPsp: IEliminationTypicalViolationSettingsModel
) => {
  return {
    [FormFields.Psp]: settingsPsp.pspFullName || "",
    [FormFields.Ost]: settingsPsp.ostName || "",
    [FormFields.Owned]: settingsPsp.pspOwned || "",
    [FormFields.DateOfVerification]: moment(),
    [FormFields.PlannedEliminationTime]: null,
    [FormFields.ContentOfIdentifiedViolation]: "",
  };
};

export const adjustValues = (
  pspId: string,
  typicalViolation: any,
  values: IFormValues
) => {
  const user = JSON.parse(
    localStorage.getItem("userContext") as string
  ) as User;

  return {
    ostRnuPspId: pspId,
    identifiedTypicalViolationsIds: [
      typicalViolation.identifiedTypicalViolation_id,
    ],
    userId: user.id,
    planDate: values[FormFields.PlannedEliminationTime]
      ?.startOf("day")
      .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) as string,
    verificatedOn: values[FormFields.DateOfVerification]
      ?.startOf("day")
      .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) as string,
    eliminationComment: values[FormFields.ContentOfIdentifiedViolation],
  };
};

export const disabledDate = (current) =>
  current && current < moment().startOf("day");
