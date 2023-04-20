import {
  ModalEntityTypes,
  ModalModes,
} from "components/ModalForAddingOrEditingEvent/constants";
import { PlanStatuses } from "../../../../../enums";

export const isButtonEditAndDeleteVisible = (data: any) => {
  return (
    !!data?.violation_actionPlan?.length ||
    !!data?.recommendation_actionPlan?.length
  );
};

export const isButtonCreateVisible = (data: any) => {
  return data._isLastActionPlan; // если последнее мероприятие в нарушении
};

export const isButtonCreateDisabled = (planStatusId: PlanStatuses) => {
  return (
    planStatusId === PlanStatuses.SEDApproval ||
    planStatusId === PlanStatuses.Signed ||
    planStatusId === PlanStatuses.Deleted ||
    planStatusId === PlanStatuses.ErrorCreatingDocumentInSED
  );
};

export const isButtonEditDisabled = (planStatusId: PlanStatuses) => {
  return (
    planStatusId === PlanStatuses.SEDApproval ||
    planStatusId === PlanStatuses.Signed ||
    planStatusId === PlanStatuses.Deleted ||
    planStatusId === PlanStatuses.ErrorCreatingDocumentInSED
  );
};

export const isButtonDeleteDisabled = (planStatusId: PlanStatuses) => {
  return (
    planStatusId === PlanStatuses.SEDApproval ||
    planStatusId === PlanStatuses.Signed ||
    planStatusId === PlanStatuses.Deleted ||
    planStatusId === PlanStatuses.ErrorCreatingDocumentInSED
  );
};

export const getAdjustedValues = (
  data: any,
  entityType: ModalEntityTypes,
  mode: ModalModes
) => {
  const commonValues = {
    ...(mode === ModalModes.edit && { actionPlanId: data.actionPlan_id }),
    serial: data._maxActionPlanSerial + 1,
  };

  if (entityType === ModalEntityTypes.violation) {
    return {
      ...commonValues,
      violationsId: data.violation_id,
      identifiedViolationsId: data.violation_identifiedViolationsId,
    };
  } else {
    return {
      ...commonValues,
      recommendationId: data.recommendation_id,
    };
  }
};
