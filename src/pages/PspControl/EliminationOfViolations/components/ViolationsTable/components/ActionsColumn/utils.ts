import {
  OperationsStatuses,
  ViolationEliminationStatuses,
} from "../../../../../../../enums";
import { Nullable } from "../../../../../../../types";

export const isEliminationProgressInformationButtonVisible = (
  eliminationId: string
) => {
  return !!eliminationId;
};

export const isSendForVerificationButtonVisible = (
  eliminateStatus: Nullable<number>
) => {
  return (
    eliminateStatus === null ||
    eliminateStatus === ViolationEliminationStatuses.AtWork ||
    eliminateStatus === ViolationEliminationStatuses.Postponement ||
    eliminateStatus === ViolationEliminationStatuses.Expired
  );
};

export const isDeclineRenewalButtonVisible = (
  eliminateStatus: Nullable<number>,
  eliminateOperationId: Nullable<number>
) => {
  return (
    eliminateStatus === ViolationEliminationStatuses.OnInspection &&
    eliminateOperationId === OperationsStatuses.RequestAnExtension
  );
};

export const isRejectMaterialsButtonVisible = (
  eliminateStatus: Nullable<number>,
  eliminateOperationId: Nullable<number>
) => {
  return (
    eliminateStatus === ViolationEliminationStatuses.OnInspection &&
    eliminateOperationId === OperationsStatuses.SendForVerification
  );
};

export const isAcceptMaterialsButtonVisible = (
  eliminateStatus: Nullable<number>,
  eliminateOperationId: Nullable<number>
) => {
  return (
    eliminateStatus === ViolationEliminationStatuses.OnInspection &&
    eliminateOperationId === OperationsStatuses.SendForVerification
  );
};

export const isExtendButtonVisible = (
  eliminateStatus: Nullable<number>,
  eliminateOperationId: Nullable<number>
) => {
  return (
    eliminateStatus === ViolationEliminationStatuses.OnInspection &&
    eliminateOperationId === OperationsStatuses.RequestAnExtension
  );
};

export const isRequestAnExtensionButtonVisible = (
  eliminateStatus: Nullable<number>
) => {
  return (
    eliminateStatus === ViolationEliminationStatuses.AtWork ||
    eliminateStatus === ViolationEliminationStatuses.Postponement ||
    eliminateStatus === ViolationEliminationStatuses.Expired
  );
};
