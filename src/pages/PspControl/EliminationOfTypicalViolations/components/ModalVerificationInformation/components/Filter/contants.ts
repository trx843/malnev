import { ViolationStatuses } from "../../../../../../../enums";

export enum FormFields {
  DateOfVerificationFrom = "verificatedDateFrom", // поле Дата проверки с
  DateOfVerificationBy = "verificatedDateTo", // поле Дата проверки по
  PresenceOfViolation = "eliminationStatus", // поле Наличие нарушения
}

export const InitialFormValues = {
  [FormFields.DateOfVerificationFrom]: null,
  [FormFields.DateOfVerificationBy]: null,
  [FormFields.PresenceOfViolation]: ViolationStatuses.None,
};

export const PresenceOfViolationOptions = [
  { value: ViolationStatuses.Revealed, label: "Выявлено" },
  { value: ViolationStatuses.NotRevealed, label: "Не выявлено" },
  { value: ViolationStatuses.Eliminated, label: "Устранено" },
  { value: ViolationStatuses.None, label: "Все" },
];
