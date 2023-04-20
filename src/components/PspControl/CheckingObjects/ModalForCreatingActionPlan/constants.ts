import * as Yup from "yup";

export enum FormFields {
  VerificationActId = 'VerificationActId' // ИД акта проверки
}

export const InitialFormValues = {
  [FormFields.VerificationActId]: "",
};

export const ValidationSchema = Yup.object({
  [FormFields.VerificationActId]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
});
