import moment from "moment";

export enum FormFields {
  verificatedOn = "verificatedOn", // поле Дата проведения
  preparedOn = "preparedOn", // поле Дата подготовки плана
  verificationPlace = "verificationPlace", // поле Место проведения
  inspectedTypeId = "inspectedTypeId", // поле Тип проверки
}

export const InitialFormValues = {
  [FormFields.verificatedOn]: moment()
    .startOf("day")
    .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
  [FormFields.preparedOn]: "",
  [FormFields.verificationPlace]: "",
  [FormFields.inspectedTypeId]: null,
};
