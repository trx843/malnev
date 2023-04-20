import { VerificationStatuses } from "./types";

export const isDeleteButtonVisible = (verificationStatus: string) => {
  return (
    verificationStatus === VerificationStatuses.create ||
    verificationStatus === VerificationStatuses.revision ||
    verificationStatus === VerificationStatuses.canceled
  );
};
