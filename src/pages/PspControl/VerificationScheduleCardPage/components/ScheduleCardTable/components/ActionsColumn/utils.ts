import { StatusesIds } from "../../../../../../../enums";

export const isEditCheckingObjectButtonDisabled = (
  status: StatusesIds | undefined
) => {
  return (
    status === StatusesIds.ApprovalInSED ||
    status === StatusesIds.Signed ||
    status === StatusesIds.ErrorCreatingDocumentInSED ||
    status === StatusesIds.Deleted
  );
};

export const isDeleteCheckingObjectButtonDisabled = (
  status: StatusesIds | undefined
) => {
  return (
    status === StatusesIds.ApprovalInSED ||
    status === StatusesIds.Signed ||
    status === StatusesIds.ErrorCreatingDocumentInSED ||
    status === StatusesIds.Deleted
  );
};

export const isCreateActButtonDisabled = (
  status: StatusesIds | undefined,
  isActExist: boolean
) => {
  return status !== StatusesIds.Signed || isActExist;
};

export const isOpenPspButtonDisabled = (status: StatusesIds | undefined) => {
  return status === StatusesIds.Deleted;
};
