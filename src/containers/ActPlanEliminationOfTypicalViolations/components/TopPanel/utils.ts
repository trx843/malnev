import { PlanStatuses } from "enums";

export const isSeDApprovalButtonVisible = (
  status: PlanStatuses | undefined
) => {
  return (
    status === PlanStatuses.Create ||
    status === PlanStatuses.ErrorCreatingDocumentInSED ||
    status === PlanStatuses.Editing ||
    status === PlanStatuses.Revision
  );
};

export const isRevisionButtonVisible = (status: PlanStatuses | undefined) => {
  return (
    status === PlanStatuses.SEDApproval ||
    status === PlanStatuses.ErrorCreatingDocumentInSED
  );
};

export const isEditButtonVisible = (status: PlanStatuses | undefined) => {
  return status === PlanStatuses.Signed;
};

export const isFinishEditingButtonVisible = (
  status: PlanStatuses | undefined
) => {
  return status === PlanStatuses.Editing || status === PlanStatuses.Revision;
};

export const isFinishCreationButtonVisible = (
  status: PlanStatuses | undefined
) => {
  return (
    status === PlanStatuses.Create ||
    status === PlanStatuses.SEDApproval ||
    status === PlanStatuses.ErrorCreatingDocumentInSED
  );
};

export const isExportButtonVisible = (status: PlanStatuses | undefined) => {
  return (
    status === PlanStatuses.Create ||
    status === PlanStatuses.ErrorCreatingDocumentInSED ||
    status === PlanStatuses.Editing ||
    status === PlanStatuses.Revision
  );
};
