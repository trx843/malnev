import { ViolationStatuses } from "../../../../../../../enums";

export const isMarkViolationButtonDisabled = (status: ViolationStatuses) => {
  return (
    status === ViolationStatuses.Revealed ||
    status === ViolationStatuses.Eliminated
  );
};
