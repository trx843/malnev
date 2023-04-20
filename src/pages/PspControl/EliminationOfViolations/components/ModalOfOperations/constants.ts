import { FormFields } from "../../constants";

export const InitialFormValues = {
  [FormFields.processedDate]: "",
  [FormFields.files]: [],
  [FormFields.urls]: [],
  [FormFields.comment]: "",
};

export enum TypesOfOperations {
  sendForVerification = 1, // Отправить на проверку
  acceptMaterials = 2, // Принять материалы
  rejectMaterials = 3, // Отклонить материалы
  requestAnExtension = 4, // Запросить продление
  extend = 5, // Продлить
  rejectExtension = 6, // Отклонить продление
  none = "none",
}
