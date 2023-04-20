import * as Yup from "yup";

export enum ModalModes {
  create = "create",
  edit = "edit",
  none = "none",
}

export enum FormFields {
  ActionText = "actionText", // поле Мероприятие
  IsNeedAction = "isNeedAction", // чекбокс Требуются действия по устранению
  IsPermanent = "isPermanent", // радио-группа Постоянно
  IsDone = "isDone", // радио-группа Выполнено
  EliminatedOn = "eliminatedOn", // поле Срок устранения
  FullNameExecutor = "fullNameExecutor", // селект ответ. за выполненение -> фио
  PositionExecutor = "positionExecutor", // селект ответ. за выполненение -> должность
  FullNameController = "fullNameController", // селект ответ. за контроль -> фио
  PositionController = "positionController", // селект ответ. за контроль -> должность
  Id = "id",
  IdentifiedViolationsId = "identifiedViolationsId",
  VerificationPlanId = "verificationPlanId",
  ViolationsId = "violationsId",
  Serial = "serial",
}

export const InitialFormValues = {
  [FormFields.ActionText]: undefined,
  [FormFields.IsNeedAction]: false,
  [FormFields.IsPermanent]: false,
  [FormFields.IsDone]: false,
  [FormFields.EliminatedOn]: undefined,
  [FormFields.FullNameExecutor]: undefined,
  [FormFields.PositionExecutor]: undefined,
  [FormFields.FullNameController]: undefined,
  [FormFields.PositionController]: undefined,
};

export const RadioGroupValues = {
  yes: true,
  no: false,
};

export const ValidationSchema = Yup.object({
  [FormFields.ActionText]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
  [FormFields.IsNeedAction]: Yup.boolean(),
  [FormFields.IsPermanent]: Yup.boolean().when(FormFields.IsNeedAction, {
    is: true,
    then: Yup.boolean().required("Поле обязательно к заполнению!"),
  }),
  [FormFields.IsDone]: Yup.string().when(FormFields.IsNeedAction, {
    is: true,
    then: Yup.string().required("Поле обязательно к заполнению!"),
  }),
  [FormFields.EliminatedOn]: Yup.string().when(
    [FormFields.IsNeedAction, FormFields.IsPermanent],
    {
      is: (isNeedAction, isPermanent) => isNeedAction && !isPermanent,
      then: Yup.string().required("Поле обязательно к заполнению!"),
    }
  ),
  [FormFields.FullNameExecutor]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
  [FormFields.PositionExecutor]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
  [FormFields.FullNameController]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
  [FormFields.PositionController]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
});
