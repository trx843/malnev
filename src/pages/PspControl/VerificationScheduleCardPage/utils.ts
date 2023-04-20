import { StatusesIds } from "enums";

export const isOperationButtonDisabled = (status: StatusesIds | undefined) => {
  return (
    status === StatusesIds.ApprovalInSED ||
    status === StatusesIds.Signed ||
    status === StatusesIds.ErrorCreatingDocumentInSED ||
    status === StatusesIds.Deleted
  );
};
