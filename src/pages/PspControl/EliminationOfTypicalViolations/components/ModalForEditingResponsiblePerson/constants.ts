import * as Yup from "yup";

export enum FormFields {
  FullName = "fullName",
  Position = "jobTitle",

  id = "id",
  ostRnuPspId ="ostRnuPspId",
  ostName = "ostName",
  rnuName = "rnuName",
  pspFullName = "pspFullName",
  pspAffiliation = "pspAffiliation",
  pspOwner = "pspOwner",
  pspPurpose = "pspPurpose",
  pspOwned = "pspOwned"
}

export const ValidationSchema = Yup.object({
  [FormFields.FullName]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
  [FormFields.Position]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
});
