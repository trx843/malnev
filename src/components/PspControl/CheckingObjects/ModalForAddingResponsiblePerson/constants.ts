import * as Yup from "yup";

export enum FormFields {
  FullName = "fullName",
  Position = "jobTitle",
}

export const InitialFormValues = {
  [FormFields.FullName]: "",
  [FormFields.Position]: "",
};

export const ValidationSchema = Yup.object({
  [FormFields.FullName]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
  [FormFields.Position]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
});
