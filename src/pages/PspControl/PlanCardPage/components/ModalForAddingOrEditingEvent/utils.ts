import * as Yup from "yup";
import moment from "moment";
import { Nullable } from "types";
import { IActionPlanModel } from "../../../../../slices/pspControl/planCard/types";
import {
  FormFields,
  ModalEntityTypes,
  ModalModes,
  RadioGroupValues,
} from "./constants";
import { VerificationTypeCodes } from "../../../../../enums";

const formatDate = (date: any) => {
  if (!date) return null;
  const momentDate = moment(date).startOf("day");
  return momentDate.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
};

export const adjustValuesToCreate = (
  values: IActionPlanModel,
  entity: any,
  planId: string,
  entityType: ModalEntityTypes
) => {
  if (entityType === ModalEntityTypes.violation) {
    const {
      violation_id,
      violation_identifiedViolationsId,
      _maxActionPlanSerial = 0,
    } = entity ?? {};

    return {
      ...values,
      [FormFields.EliminatedOn]: formatDate(values[FormFields.EliminatedOn]),
      [FormFields.ViolationsId]: violation_id,
      [FormFields.IdentifiedViolationsId]: violation_identifiedViolationsId,
      [FormFields.Serial]: _maxActionPlanSerial + 1,
      [FormFields.VerificationPlanId]: planId,
    };
  }

  if (entityType === ModalEntityTypes.recommendation) {
    const { recommendation_id, _maxActionPlanSerial = 0 } = entity ?? {};

    return {
      ...values,
      [FormFields.EliminatedOn]: formatDate(values[FormFields.EliminatedOn]),
      [FormFields.RecommendationId]: recommendation_id,
      [FormFields.Serial]: _maxActionPlanSerial + 1,
      [FormFields.VerificationPlanId]: planId,
    };
  }
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
  return {
    [FormFields.ActionText]: actionPlan.actionText,
    [FormFields.IsPermanent]: actionPlan.isPermanent,
    [FormFields.IsDone]: actionPlan.isDone,
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

export const isDoneDisabled = (values: IActionPlanModel) => {
  return values[FormFields.IsPermanent] === RadioGroupValues.yes;
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
  verificationTypeCode: VerificationTypeCodes | undefined
) => {
  const commonSchema = {
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
  };

  if (
    verificationTypeCode ===
      VerificationTypeCodes.MonitoringStatusOfThirdPartyPSP ||
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
