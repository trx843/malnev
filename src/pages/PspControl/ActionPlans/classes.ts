import { IEntity } from "../../../interfaces";
import { description, IdType } from "../../../types";

export class EventPlanItem implements IEntity {
  id: IdType;
  // Name
  @description("Наименование")
  planName: string = "";
  // VerificationAct.OstRnuPsp.OstName
  @description("ОСТ")
  ostName: string = "";
  // VerificationAct.OstRnuPsp.RnuName
  @description("Филиал ОСТ")
  filial: string = "";
  // VerificationAct.OstRnuPsp.PspFullName
  @description("Наименование ПСП")
  psp: string = "";
  // disable
  @description("Объект проверки")
  checkingObjects: string = "";
  // VerificationAct.VerificationLevels.Id
  @description("Уровень проверки")
  verificationLevel: string = "";
  verificationLevelId: number;
  // VerificationAct.CheckTypes.Code
  @description("Тип проверки")
  verificationType: string = "";
  // VerificationAct.EliminationOn
  @description("Дата проверки")
  verificatedOn: string = "";
  verificationStatus: string = "";
  isSendedToElis: boolean;
}

// статус - VerificationAct.VerificationStatuses.Id
// CreatedOn - дата создания
