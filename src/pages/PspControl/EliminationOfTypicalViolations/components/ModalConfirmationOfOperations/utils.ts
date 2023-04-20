import moment from "moment";
import { User } from "classes";
import { ViolationStatuses } from "../../../../../enums";
import { ModalConfirmationOfOperationsModes } from "./constants";

export const getCollectionOfTypicalViolations = (
  selectedIdentifiedTypicalViolations: any[],
  mode: ModalConfirmationOfOperationsModes
) => {
  const collection = selectedIdentifiedTypicalViolations.reduce(
    (acc, violation) => {
      const violationStatus =
        violation.identifiedTypicalViolation_currentStatusId;

      if (
        mode === ModalConfirmationOfOperationsModes.markElimination &&
        (violationStatus === ViolationStatuses.Revealed || violationStatus === ViolationStatuses.Eliminated ||
          violationStatus === null)
      ) {
        return {
          ...acc,
          violationsWithCorrespondingStatus: [
            ...acc.violationsWithCorrespondingStatus,
            violation,
          ],
        };
      }

      if (
        mode === ModalConfirmationOfOperationsModes.noViolationDetected &&
        (violationStatus === ViolationStatuses.None ||
          violationStatus === ViolationStatuses.Eliminated ||
          violationStatus === null)
      ) {
        return {
          ...acc,
          violationsWithCorrespondingStatus: [
            ...acc.violationsWithCorrespondingStatus,
            violation,
          ],
        };
      }

      return {
        ...acc,
        violationsWithInappropriateStatus: [
          ...acc.violationsWithInappropriateStatus,
          violation,
        ],
      };
    },
    {
      violationsWithCorrespondingStatus: [],
      violationsWithInappropriateStatus: [],
    }
  );

  return collection;
};

export const getStringOfViolationNumbers = (violations: any[]) => {
  return violations
    .map(
      (violation) =>
        violation.identifiedTypicalViolation_identifiedViolationsSerial
    )
    .join(", ");
};

export const adjustValues = (
  ostRnuPspId: string,
  identifiedTypicalViolationsIds: any[]
) => {
  const user = JSON.parse(
    localStorage.getItem("userContext") as string
  ) as User;

  return {
    ostRnuPspId,
    identifiedTypicalViolationsIds,
    userId: user.id,
    planDate: moment()
      .startOf("day")
      .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) as string,
    verificatedOn: "",
    eliminationComment: "",
  };
};

export const getViolationsIds = (violations: any[]) =>
  violations.map((violation) => violation.identifiedTypicalViolation_id);
