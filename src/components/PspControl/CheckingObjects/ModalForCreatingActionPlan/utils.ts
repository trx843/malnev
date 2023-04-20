import { IVerificationActs } from "../../../../slices/pspControl/checkingObjects";

export const mapVerificationActs = (verificationActs: IVerificationActs[]) => {
  return verificationActs.map((i) => {
    return {
      value: i.id,
      label: i.label,
    };
  });
};
