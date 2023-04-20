import * as Yup from "yup";

export enum FormFields {
  verificationPeriodFrom = "verificationPeriodFrom", // поле Период проверки с
  verificationPeriodFor = "verificationPeriodFor", // поле Период проверки по
}

export const InitialFormValues = {
  [FormFields.verificationPeriodFrom]: null,
  [FormFields.verificationPeriodFor]: null,
};

export const ValidationSchema = Yup.object({
  [FormFields.verificationPeriodFrom]: Yup.date()
    .nullable()
    .required("Поле обязательно к заполнению!"),
  [FormFields.verificationPeriodFor]: Yup.date()
    .nullable()
    .required("Поле обязательно к заполнению!"),
});
