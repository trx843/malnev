import {
  ModalEntityTypes,
  ModalModes,
} from "components/ModalForAddingOrEditingEvent/constants";
import { PlanStatuses } from "../../../../../../enums";

export const isButtonEditAndDeleteVisible = (data) => !!data.actionPlan_id;

export const isButtonCreateVisible = (data) => {
  return data._isLastActionPlan; // если последнее мероприятие в нарушении
};

export const isButtonSortVisible = (data) => data._isFirstActionPlan;
export const isButtonEditTypicalViolation = (data) => data._isFirstActionPlan;

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

export const isOperationButtonDisabled = (planStatusId: PlanStatuses) => {
  return (
    planStatusId === PlanStatuses.SEDApproval ||
    planStatusId === PlanStatuses.Signed ||
    planStatusId === PlanStatuses.Deleted ||
    planStatusId === PlanStatuses.ErrorCreatingDocumentInSED
  );
};

export const getAdjustedValues = (data: any, mode: ModalModes) => {
  return {
    ...(mode === ModalModes.edit && { actionPlanId: data.actionPlan_id }),
    serial: data._maxActionPlanSerial + 1,
    violationsId: data.typicalViolation_id,
    identifiedViolationsId: data.typicalViolation_identifiedTypicalViolationId,
  };
};
