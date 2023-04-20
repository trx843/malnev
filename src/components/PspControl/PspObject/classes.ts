import { IEntity } from "../../../interfaces";
import { cellRenderer, description, IdType } from "../../../types";

export class OsusItem implements IEntity {
  id: IdType;
  @description("Система учета")
  osuShortName: string = "";
  @description("Тип системы учета/ИЛ")
  osuType: string = "";
  @description("Владелец")
  osuOwner: string = "";
  @description("Принадлежность к компании")
  osuAffiliation: string = "";
  @description("Назначение")
  osuPurpose: string = "";
  @description("Собственный/сторонний")
  owned: string = "";
  @description("Транспортируемый продукт")
  transportedProduct: string = "";
  @description("Территориальное расположение")
  territorialLocation: string = "";
  @description("Принимающая сторона")
  receive: string = "";
  @description("Сдающая сторона")
  send: string = "";
  @description("ОСУ")
  osuName: string = "";
  @description("РСУ")
  rsuName: string = "";
  @description("Aккредитация")
  isAccredited: boolean = false;
  osuTypeId: number = 0;
  isDeleted: boolean;
}

export class ChecksObjectItem implements IEntity {
  id: IdType;
  @description("Тип проверки")
  checkType: string = "";
  @description("Уровень проверки")
  verificationLevel: string = "";
  @description("Дата проверки")
  verificationDate: string = "";
  @description("График проверки")
  @cellRenderer(`cellLinkSchedules`)
  verificationSchedulesId: string = "";
  @description("Акт/отчет проверки")
  @cellRenderer(`cellLinkAct`)
  actId: string = "";
  @description("План мероприятий")
  @cellRenderer(`cellLinkPlan`)
  planId: string = "";
  actName: string = "";
  planName: string = "";
  verificationSchedulesName: string = "";
}
