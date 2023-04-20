import { StatusesIds } from "enums";

export const isSeDApprovalButtonVisible = (status: StatusesIds | undefined) => {
  return (
    status === StatusesIds.Creation ||
    status === StatusesIds.Editing ||
    status === StatusesIds.Modification ||
    status === StatusesIds.ErrorCreatingDocumentInSED
  );
};

export const isRevisionButtonVisible = (status: StatusesIds | undefined) => {
  return (
    status === StatusesIds.ApprovalInSED ||
    status === StatusesIds.ErrorCreatingDocumentInSED
  );
};

export const isEditButtonVisible = (status: StatusesIds | undefined) => {
  return status === StatusesIds.Signed;
};

export const isFinishEditingButtonVisible = (
  status: StatusesIds | undefined
) => {
  return status === StatusesIds.Editing || status === StatusesIds.Modification;
};

export const isFinishCreationButtonVisible = (
  status: StatusesIds | undefined
) => {
  return (
    status === StatusesIds.Creation ||
    status === StatusesIds.ApprovalInSED ||
    status === StatusesIds.ErrorCreatingDocumentInSED
  );
};

export const isExportButtonVisible = (status: StatusesIds | undefined) => {
  return (
    status === StatusesIds.Creation ||
    status === StatusesIds.Editing ||
    status === StatusesIds.Modification ||
    status === StatusesIds.ErrorCreatingDocumentInSED
  );
};
