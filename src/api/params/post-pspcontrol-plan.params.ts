export interface IVerificationPlanModel {
  // Идентификатор записи
  Id?: string;
  // Уровень проверки
  PlanName?: string;
  // ИД проверки
  VerificationId?: string;
  // ИД акта проверки
  VerificationActId?: string;
  // ИД графика проверки
  VerificationSchedulesId?: string;
  // Статус плана
  Status?: number;
  // Дата создания
  CreatedOn?: string;
}
