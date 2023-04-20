import { IEntity } from "../../interfaces";
import { description, IdType } from "../../types";

export class VerificationItem implements IEntity {
  id: IdType;
  @description("Уровень проверки")
  verificationLevel: string = "";
  verificationLevelId: number;
  @description("Тип проверки")
  verificationType: string = "";
  @description("ОСТ")
  ostName: string = "";
  @description("Филиал")
  filial: string = "";
  @description("ПСП")
  psp: string = "";
  @description("План мероприятий")
  planName: string = "";
  @description("Объекты проверки")
  checkingObjects: string = "";
  @description("Дата проверки")
  verificatedOn: Date = new Date();
  preparedOn: Date;
  @description("Дата создания")
  createdOn: Date = new Date();
  @description("Статус")
  verificationStatus: string = "";
  verificationStatusId: number = 1;
  planId: string = "";
  actName: string = "";
  hasNotClassified: boolean;
  verificationPlace: string;
  ostRnuPspId: IdType;
  verificationSchedulesId: IdType | null;
  isSendedToElis: boolean;
}
