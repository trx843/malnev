import { StatusesIds } from "../../../../../enums";

export const getDeleteButtonState = (status: number) => {
  return (
    status === StatusesIds.ApprovalInSED ||
    status === StatusesIds.Signed ||
    status === StatusesIds.Deleted ||
    status === StatusesIds.Editing
  );
};
