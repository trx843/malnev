import { ProgramStatuses } from "../../../../constants";

export const isCancelProgramButtonVisible = (
  statusId: number,
  hasFile: boolean
) => {
  return statusId !== ProgramStatuses.Canceled && hasFile;
};

export const isProgramReplacementButtonVisible = (
  statusId: number,
  hasFile: boolean
) => {
  return statusId === ProgramStatuses.Active && hasFile;
};
