import { IEliminationTypicalViolationSettingsModel } from "api/requests/eliminationOfTypicalViolations/types";
import { Nullable } from "types";
import { FormFields } from "./constants";

export const getFormValues = (
  settingsPsp: Nullable<IEliminationTypicalViolationSettingsModel>
) => {
  return {
    [FormFields.FullName]: settingsPsp?.fullName || "",
    [FormFields.Position]: settingsPsp?.jobTitle || "",
  };
};
