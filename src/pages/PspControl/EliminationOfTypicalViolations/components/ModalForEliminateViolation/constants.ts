import * as Yup from "yup";

export enum FormFields {
  FactDate = "factDate", // поле Содержание выявленного нарушения
}

export const InitialFormValues = {
  [FormFields.FactDate]: "",
};

export const ValidationSchema = Yup.object({
  [FormFields.FactDate]: Yup.date()
    .nullable()
    .required("Поле обязательно к заполнению!"),
});
