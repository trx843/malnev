import { IPspcontrolVerificationLevelsResponse } from "api/responses/get-pspcontrol-verification-levels.response";

export const mapOptions = (
  options: IPspcontrolVerificationLevelsResponse[]
) => {
  return options.map((option) => {
    return {
      value: option.id,
      label: option.name,
    };
  });
};
