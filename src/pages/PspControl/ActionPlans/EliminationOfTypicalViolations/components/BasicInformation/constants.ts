export enum FormFields {
  verificationPeriodFrom = "verificationPeriodFrom", // поле Период проверки с
  verificationPeriodFor = "verificationPeriodFor", // поле Период проверки по
}

export const InitialFormValues = {
  [FormFields.verificationPeriodFrom]: null,
  [FormFields.verificationPeriodFor]: null,
};
