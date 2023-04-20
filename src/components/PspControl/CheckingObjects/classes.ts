import { IEntity } from "../../../interfaces";
import { description, IdType, Nullable } from "../../../types";

export class CheckingObjectsItem implements IEntity {
  id: IdType;
  pspId: IdType;
  ostId: IdType;
  @description("ОСТ")
  ostName: string = "";
  @description("Филиал ")
  filial: string = "";
  @description("ПСП ")
  pspFullName: string = "";
  @description("ОСУ")
  osus: string = "";
  @description("Транспортируемый продукт")
  transportedProduct: string = "";
  @description("Владелец ПСП")
  pspOwner: string = "";
  @description("Владелец ОСУ")
  osuOwners: string = "";
  @description("РСУ ")
  rsus: string = "";
  @description("Владелец РСУ")
  rsuOwners: string = "";
  @description("Принадлежность ПСП")
  pspAffiliation: string = "";
  @description("Собственный/сторонний")
  pspOwned: string = "";
  @description("Принимающая сторона")
  receiver: string = "";
  @description("Сдающая сторона")
  sender: string = "";
  @description("Наименование исп. лаб.")
  ils: string = "";
  @description("Владелец исп. лаб.")
  ilOwner: string = "";
  @description("Наличие аккредитации")
  hasAccreditationIl: string = "";
  @description("Дата контроля ПАО")
  paoControlDate: Nullable<Date> = new Date();
  @description("Дата контроля ТНМ")
  tnmControlDate: Nullable<Date> = new Date();
  @description("Дата контроля ОСТ")
  ostControlDate: Nullable<Date> = new Date();
  @description("Дата мониторинга ТНМ")
  tnmMonitoringDate: Nullable<Date> = new Date();
  pspIsOwned: boolean;
  siknLabRsuIds: ISiknLabRsuId[];

  rowSpanPsp: number;
  isDeleted: boolean;
}

export interface ISiknLabRsuId {
  accountTypeId: number;
  id: string;
}
