import { PlanStatuses } from "enums";

export const isOperationButtonDisabled = (
  planStatusId: PlanStatuses | undefined | null
) => {
  return (
    planStatusId === PlanStatuses.SEDApproval ||
    planStatusId === PlanStatuses.ErrorCreatingDocumentInSED ||
    planStatusId === PlanStatuses.Signed
  );
};
