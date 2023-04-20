import { FormFields } from "./constants";

export interface IFormValues {
  [FormFields.FullName]: string;
  [FormFields.Position]: string;

  [FormFields.id]: string,
  [FormFields.ostRnuPspId]: string,
  [FormFields.ostName]: string,
  [FormFields.rnuName]: string,
  [FormFields.pspFullName]: string,
  [FormFields.pspAffiliation]: string,
  [FormFields.pspOwner]: string,
  [FormFields.pspPurpose]: string,
  [FormFields.pspOwned]: string,
}
