import { NotificationVerSched } from "slices/pspControl/verificationScheduleCard/types";
import { IEntity } from "../../../interfaces";
import { description, IdType, Nullable } from "../../../types";

export interface VerificationScheduleResponse {
  id: IdType;
  verificationLevel: string;
  verificationLevelId: number;
  checkTypeId: string;
  checkType: string;
  ost: string;
  inspectionYear: string;
  yearText: string;
  createdOn: Nullable<Date>;
  status: number;
  statusText: string;
  ostRnuPspIds: any;
  name: string;
  isVisibilityInspection: boolean;
  exVerificationSheduleIds: NotificationVerSched[];
}

export class VerificationScheduleItem implements IEntity {
  id: IdType;
  @description("Уровень проверки")
  verificationLevel: string = "";
  verificationLevelId: number;
  checkTypeId: string;
  @description("Тип проверки")
  checkType: string = "";
  @description("Наименование ОСТ")
  ost: string = "";
  inspectionYear: string;
  @description("Год проверки")
  yearText: string = "";
  @description("Дата создания")
  createdOn: Nullable<Date> = new Date();
  status: number;
  @description("Статус")
  statusText: string = "";
  ostRnuPspIds: any;
  name: string;
  exVerificationSheduleIds: NotificationVerSched[];
}
