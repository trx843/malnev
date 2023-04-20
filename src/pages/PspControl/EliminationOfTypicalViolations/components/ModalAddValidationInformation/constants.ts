import * as Yup from "yup";

export enum FormFields {
  Psp = "Psp", // поле ПСП
  Ost = "Ost", // поле ОСТ
  Owned = "owned", // поле Собственный/сторонний
  DateOfVerification = "verificatedOn", // поле Дата проверки
  PlannedEliminationTime = "planDate", // поле Планируемый срок устранения
  ContentOfIdentifiedViolation = "eliminationComment", // поле Содержание выявленного нарушения
}

export const InitialFormValues = {
  [FormFields.Psp]: "",
  [FormFields.Ost]: "",
  [FormFields.Owned]: "",
  [FormFields.DateOfVerification]: null,
  [FormFields.PlannedEliminationTime]: null,
  [FormFields.ContentOfIdentifiedViolation]: "",
};

export const ValidationSchema = Yup.object({
  [FormFields.PlannedEliminationTime]: Yup.string()
    .nullable()
    .required("Поле обязательно к заполнению!"),
  [FormFields.ContentOfIdentifiedViolation]: Yup.string()
    .nullable()
    .required("Поле обязательно к заполнению!"),
});
