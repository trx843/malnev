import * as Yup from "yup";

export enum ModalModes {
  create = "create",
  edit = "edit",
  none = "none",
}

export enum ModalEntityTypes {
  violation = "violation",
  recommendation = "recommendation",
}

export enum FormFields {
  ActionText = "actionText", // поле Мероприятие
  IsPermanent = "isPermanent", // радио-группа Постоянно
  IsDone = "isDone", // радио-группа Выполнено
  EliminatedOn = "eliminatedOn", // поле Срок устранения
  FullNameExecutor = "fullNameExecutor", // селект ответ. за выполненение -> фио
  PositionExecutor = "positionExecutor", // селект ответ. за выполненение -> должность
  FullNameController = "fullNameController", // селект ответ. за контроль -> фио
  PositionController = "positionController", // селект ответ. за контроль -> должность
  RecommendationId = "recommendationId",

  Id = "id",
  IdentifiedViolationsId = "identifiedViolationsId",
  VerificationPlanId = "verificationPlanId",
  ViolationsId = "violationsId",
  Serial = "serial",
}

export const InitialFormValues = {
  [FormFields.ActionText]: "",
  [FormFields.IsPermanent]: false,
  [FormFields.IsDone]: false,
  [FormFields.EliminatedOn]: null,
  [FormFields.FullNameExecutor]: "",
  [FormFields.PositionExecutor]: "",
  [FormFields.FullNameController]: "",
  [FormFields.PositionController]: "",

  [FormFields.IdentifiedViolationsId]: null,
  [FormFields.VerificationPlanId]: null,
  [FormFields.ViolationsId]: null,
  [FormFields.Serial]: null,
  [FormFields.Id]: null,
  [FormFields.RecommendationId]: null,
};

export const RadioGroupValues = {
  yes: true,
  no: false,
};

export const ValidationSchema = Yup.object({
  [FormFields.ActionText]: Yup.string()
    .nullable()
    .required("Поле обязательно к заполнению!"),
  [FormFields.IsPermanent]: Yup.boolean()
    .nullable()
    .required("Поле обязательно к заполнению!"),
  [FormFields.IsDone]: Yup.boolean()
    .nullable()
    .required("Поле обязательно к заполнению!"),
  [FormFields.EliminatedOn]: Yup.string()
    .nullable()
    .required("Поле обязательно к заполнению!"),
  [FormFields.FullNameExecutor]: Yup.string()
    .nullable()
    .required("Поле обязательно к заполнению!"),
  [FormFields.PositionExecutor]: Yup.string()
    .nullable()
    .required("Поле обязательно к заполнению!"),
  [FormFields.FullNameController]: Yup.string()
    .nullable()
    .required("Поле обязательно к заполнению!"),
  [FormFields.PositionController]: Yup.string()
    .nullable()
    .required("Поле обязательно к заполнению!"),
});

export const PermanentActionText = "Мероприятие с постоянным сроком исполнения";
export const PermanentActionPattern =
  /\s*Мероприятие с постоянным сроком исполнения\s*/;

export const DoneActionText = "Устранено в ходе проверки";
export const DoneActionTextPattern = /\s*Устранено в ходе проверки\s*/;
