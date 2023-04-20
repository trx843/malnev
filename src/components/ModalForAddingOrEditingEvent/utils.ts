import * as Yup from "yup";
import moment from "moment";
import _ from "lodash";
import { Nullable } from "types";
import { IActionPlanModel } from "slices/pspControl/planCard/types";
import { VerificationTypeCodes } from "../../enums";
import {
  FormFields,
  ModalModes,
  RadioGroupValues,
  TargetFormNames,
} from "./constants";
import { EntityValues } from "./types";

const formatDate = (date: any) => {
  if (!date) return null;
  const momentDate = moment(date).startOf("day");
  return momentDate.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
};

export const adjustValuesToCreate = (
  values: IActionPlanModel,
  entityValues: EntityValues,
  planId: string
) => {
  return {
    ...values,
    ...entityValues,
    [FormFields.EliminatedOn]: formatDate(values[FormFields.EliminatedOn]),
    [FormFields.VerificationPlanId]: planId,
  };
};

export const adjustValuesToEdit = (values: IActionPlanModel) => {
  return {
    ...values,
    [FormFields.EliminatedOn]: formatDate(values[FormFields.EliminatedOn]),
  };
};

export const getDate = (date: any) => {
  if (!date) return null;

  const momentDate = moment(date);

  if (momentDate?.isValid()) return momentDate;

  return null;
};

export const getFormValues = (actionPlan: IActionPlanModel) => {
  const isPermanent = actionPlan.isPermanent;
  const isDone = actionPlan.isDone;

  return {
    [FormFields.ActionText]: actionPlan.actionText,
    [FormFields.IsPermanent]: _.isBoolean(isPermanent) ? isPermanent : false,
    [FormFields.IsDone]: _.isBoolean(isDone) ? isDone : false,
    [FormFields.EliminatedOn]: getDate(actionPlan.eliminatedOn),
    [FormFields.FullNameExecutor]: actionPlan.fullNameExecutor,
    [FormFields.PositionExecutor]: actionPlan.positionExecutor,
    [FormFields.FullNameController]: actionPlan.fullNameController,
    [FormFields.PositionController]: actionPlan.positionController,
    [FormFields.Id]: actionPlan.id,
    [FormFields.IdentifiedViolationsId]: actionPlan.identifiedViolationsId,
    [FormFields.VerificationPlanId]: actionPlan.verificationPlanId,
    [FormFields.ViolationsId]: actionPlan.violationsId,
    [FormFields.Serial]: actionPlan.serial,
    [FormFields.RecommendationId]: actionPlan.recommendationId,
  };
};

export const isDoneDisabled = (
  values: IActionPlanModel,
  targetForm: TargetFormNames
) => {
  return (
    values[FormFields.IsPermanent] === RadioGroupValues.yes ||
    targetForm === TargetFormNames.EliminationOfTypicalViolations
  );
};

export const isShowed = (
  values: IActionPlanModel,
  targetForm: TargetFormNames
) => {
  if (targetForm !== TargetFormNames.EliminationOfTypicalViolations)
    return true;
  const ret =
    values[FormFields.IsPermanent] === RadioGroupValues.no &&
    targetForm === TargetFormNames.EliminationOfTypicalViolations;
  return ret;
};

export const isPermanentDisabled = (values: IActionPlanModel) => {
  return values[FormFields.IsDone] === RadioGroupValues.yes;
};

export const isEliminatedOnDisabled = (values: IActionPlanModel) => {
  return values[FormFields.IsDone] === RadioGroupValues.yes;
};

export const getAdjustedActionText = (
  actionText: Nullable<string>,
  filedValue: boolean,
  pattern: RegExp,
  additionalText: string
) => {
  if (filedValue) {
    if (actionText) {
      // если текст мероприятия заканчивается пробелом
      if (actionText.lastIndexOf(" ") === actionText.length - 1) {
        return `${actionText}${additionalText}`;
      }

      return `${actionText} ${additionalText}`;
    }

    return additionalText;
  }

  if (!filedValue) {
    const adjustedActionText = actionText
      ? actionText.replace(pattern, "")
      : additionalText;

    return adjustedActionText;
  }
};

export const getValidationSchema = (
  verificationTypeCode: VerificationTypeCodes | undefined,
  targetForm: TargetFormNames,
  isPermanent: boolean | null | undefined
) => {
  const commonSchema = {
    [FormFields.ActionText]: Yup.string()
      .nullable()
      .max(1024, "Максимальная длина текста мероприятия 1024 символа")
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
  };

  if (
    targetForm === TargetFormNames.EliminationOfTypicalViolations &&
    isPermanent
  ) {
    return Yup.object({
      ...commonSchema,
      [FormFields.EliminatedOn]: Yup.string().nullable(),
      [FormFields.FullNameExecutor]: Yup.string().nullable(),
      [FormFields.PositionExecutor]: Yup.string().nullable(),
      [FormFields.FullNameController]: Yup.string().nullable(),
      [FormFields.PositionController]: Yup.string().nullable(),
    });
  }

  if (targetForm === TargetFormNames.EliminationOfTypicalViolations) {
    return Yup.object({
      ...commonSchema,
      [FormFields.FullNameExecutor]: Yup.string().nullable(),
      [FormFields.PositionExecutor]: Yup.string().nullable(),
      [FormFields.FullNameController]: Yup.string().nullable(),
      [FormFields.PositionController]: Yup.string().nullable(),
    });
  }

  if (
    (targetForm === TargetFormNames.PlanCardPage &&
      verificationTypeCode ===
        VerificationTypeCodes.MonitoringStatusOfThirdPartyPSP) ||
    verificationTypeCode ===
      VerificationTypeCodes.PeriodicMonitoringOfStatusOfThirdPartyPSP
  ) {
    return Yup.object({
      ...commonSchema,
      [FormFields.FullNameController]: Yup.string().nullable(),
      [FormFields.PositionController]: Yup.string().nullable(),
    });
  }

  return Yup.object({
    ...commonSchema,
    [FormFields.FullNameController]: Yup.string()
      .nullable()
      .required("Поле обязательно к заполнению!"),
    [FormFields.PositionController]: Yup.string()
      .nullable()
      .required("Поле обязательно к заполнению!"),
  });
};

export const getModalTitle = (mode: ModalModes) => {
  return mode === ModalModes.create
    ? "Добавление мероприятия"
    : "Редактирование мероприятия";
};
