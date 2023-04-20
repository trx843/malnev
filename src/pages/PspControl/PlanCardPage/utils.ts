import moment from "moment";
import { PlanStatuses } from "enums";

export const formatDate = (date: Date | string | undefined | null) => {
  if (date && typeof date === "string") {
    return date;
  }

  if (date && typeof date === "object") {
    return moment(date).format("DD.MM.YYYY");
  }

  return undefined;
};

export const getExecutor = (params: any) => {
  const fullNameExecutor = params.data?.actionPlan_fullNameExecutor ?? "";
  const positionExecutor = params.data?.actionPlan_positionExecutor ?? "";

  if (!fullNameExecutor && !positionExecutor) return "";

  return `${fullNameExecutor} - ${positionExecutor}`;
};

export const getController = (params: any) => {
  const fullNameController = params.data?.actionPlan_fullNameController ?? "";
  const positionController = params.data?.actionPlan_positionController ?? "";

  if (!fullNameController && !positionController) return "";

  return `${fullNameController} - ${positionController}`;
};

export const isOperationButtonDisabled = (planStatusId: PlanStatuses | undefined) => {
  return (
    planStatusId === PlanStatuses.SEDApproval ||
    planStatusId === PlanStatuses.ErrorCreatingDocumentInSED ||
    planStatusId === PlanStatuses.Signed ||
    planStatusId === PlanStatuses.Deleted
  );
};
