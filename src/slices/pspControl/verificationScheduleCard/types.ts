import { IdType, Nullable } from "../../../types";

export interface ISiknLabRsuVerificationSchedulesModel {
  id: string;
  header: string;
  groups: ISiknLabRsuVerificationSchedulesGroup[];
  verificationLevel: number;
  verificationStatusId: number;
  verificationStatus: string;
  inspectionYear: number;
  ostsName: string[];
  ownType: number;
  checkTypeId: string;
}

export interface NotificationVerSched {
  verificationScheduleId: IdType;
  verificationScheduleName: string;
}


export interface ISiknLabRsuVerificationSchedulesGroup {
  id: string;

  objectsInfo: Nullable<IObjectsInfo>;
  dates: Nullable<IDateInfo[]>;

  january: Nullable<IMonthInfo>;
  february: Nullable<IMonthInfo>;
  march: Nullable<IMonthInfo>;
  april: Nullable<IMonthInfo>;
  may: Nullable<IMonthInfo>;
  june: Nullable<IMonthInfo>;
  july: Nullable<IMonthInfo>;
  august: Nullable<IMonthInfo>;
  september: Nullable<IMonthInfo>;
  october: Nullable<IMonthInfo>;
  november: Nullable<IMonthInfo>;
  december: Nullable<IMonthInfo>;

  osuCount: number;
  ilCount: number;
  note: Nullable<string>;

  listOfSiknLabRsuIds: IdType[];
  hasDates: boolean;
  isActExist: boolean;
}

export interface IObjectsInfo {
  ilNamesStr: Nullable<string>;
  osuNamesStr: Nullable<string>;
  pspName: Nullable<string>;
  rsuNamesStr: Nullable<string>;
  ostName: Nullable<string>;
  verificationActId: Nullable<string>;
  isActExist: boolean;
}

export interface IDateInfo {
  dateInterval: Nullable<string>;
  end: Nullable<string>;
  m_Info: Nullable<IMonthInfo>;
  start: Nullable<string>;
  isMonth: boolean;
}

export interface IMonthInfo {
  transportedProduct: Nullable<number>;
  levels: Nullable<ILevelInfo[]>;
}

export interface ILevelInfo {
  names: Nullable<string[]>;
  levelEnum: Nullable<number>;
}

export interface IVerificationLevelsOst {
  id: number;
  name: string;
  checkTypes: null;
}

export interface IOsu {
  bdmiMaxFlowrange: Nullable<number>;
  bdmiMinFlowrange: Nullable<number>;
  bdmiOilPipeline: Nullable<string>;
  bdmiPerformance: Nullable<number>;
  bdmiStatus: Nullable<string>;
  id: string;
  isAccredited: Nullable<boolean>;
  osuAffiliation: Nullable<string>;
  osuName: Nullable<string>;
  osuOwner: Nullable<string>;
  osuPurpose: Nullable<string>;
  osuShortName: Nullable<string>;
  osuType: Nullable<string>;
  owned: Nullable<string>;
  receive: Nullable<string>;
  rsuName: Nullable<string>;
  send: Nullable<string>;
  territorialLocation: Nullable<string>;
  transportedProduct: Nullable<string>;
}

export interface IPspCard {
  bdmiStatus: Nullable<string>;
  id: string;
  ostControlDate: Nullable<Date | string>;
  ostName: Nullable<string>;
  osus: IOsu[];
  paoControlDate: Nullable<Date | string>;
  pspAffiliation: Nullable<string>;
  pspFullName: Nullable<string>;
  pspOwned: Nullable<string>;
  pspOwner: Nullable<string>;
  pspPurpose: Nullable<string>;
  rnuName: Nullable<string>;
  tnmControlDate: Nullable<Date | string>;
  tnmMonitoringDate: Nullable<Date | string>;
}

export interface ICheckingObject {
  createdOn: Nullable<string>;
  id: string;
  siknLabRsuId: string;
}

export interface IPsp {
  checkingObject: ICheckingObject[];
  endDate: Nullable<string>;
  isMonth: boolean;
  isTnm: boolean;
  ostRnuPspId: Nullable<string>;
  startDate: Nullable<string>;
  verificationOstLevelsId: Nullable<number>;
  verificationScheduleId: Nullable<string>;
}

// модель для фронта с дополнительными атрибутами
export interface IPspViewModel extends IPsp {
  _siknLabRsuIds: Nullable<string[]> | undefined; // атрибут для значений селекта Объекты проверки
  _dateRange: moment.Moment[] | undefined; // атрибут для значения диапазона дат
  month: number | undefined; // атрибут для номера месяца
}

export interface ICheckingObjectsModalFilter {
  ostName?: string;
  pspsFullName?: string[];
  ostsName?: string[];
  rnuName?: string[];
  pspAffiliation?: string[];
  pspOwner?: string[];
  pspPurpose?: string[];
  osuShortName?: string[];
  territorialLocation?: string[];
  transportedProduct?: string[];
  send?: string[];
  receive?: string[];
  isOwn?: Nullable<boolean>;
}

export interface IScheduleAttachments {
  id: string; // Идентификатор записи
  serial: number; // Порядковый номер записи
  createdOn: string; // Дата создания записи
  fileName: string; // Имя файла
  docType: Nullable<any>; // Тип документа
  verificationPlanId: string; // График Id
  isMain: boolean;
  url: Nullable<string>;
}

export interface ICommissionVerificationModel {
  id: string;
  createdOn: string;
  serial: number;
  organizationName: string;
  fullName: string;
  jobTitle: string;
  verificationScheduleId: string;
  commisionTypesId: number;
  commisionTypesText: string;
  isOutsideOrganizationText: string;
  isOutsideOrganization: boolean;
}

export type Month =
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";
