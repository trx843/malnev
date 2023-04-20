import * as Yup from "yup";

export enum FormFields {
  planName = "planName", // Уровень проверки
}

export type IFormValues = {
  [key in FormFields]: undefined | string
}

export const InitialFormValues = {
  [FormFields.planName]: undefined,
};

export const ValidationSchema = Yup.object({
  [FormFields.planName]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
});
