import * as Yup from "yup";

export enum FormFields {
  verificationLevelId = "verificationLevelId", // поле Уровень проверки
  acquaintanceDateInterval = "acquaintanceDateInterval", // поле Дата ознакомления
  inspectionYear = "inspectionYear", // поле Год проверки
  ostId = "ostId", // поле ОСТ
  pspId = "pspId", // поле ПСП
}

export const InitialFormValues = {
  [FormFields.verificationLevelId]: "",
  [FormFields.acquaintanceDateInterval]: null,
  [FormFields.inspectionYear]: null,
  [FormFields.ostId]: null,
  [FormFields.pspId]: null,
};

export const ValidationSchema = Yup.object({
  [FormFields.verificationLevelId]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
  [FormFields.acquaintanceDateInterval]: Yup.array()
    .of(Yup.string())
    .nullable(),
  [FormFields.inspectionYear]: Yup.string().nullable(),
  [FormFields.ostId]: Yup.string().nullable(),
  [FormFields.pspId]: Yup.string().nullable(),
});
