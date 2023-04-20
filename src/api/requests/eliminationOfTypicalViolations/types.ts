import { Nullable } from "types";

export interface IEliminationTypicalViolationSettingsModel {
  id: string; // Идентификатор нарушения
  ostRnuPspId: Nullable<string>; // Идентификатор ПСП
  ostName: Nullable<string>; // Натменование ОСТ
  rnuName: Nullable<string>; // Наименование РНУ / филиал
  pspFullName: Nullable<string>; // Наименование ПСП
  pspAffiliation: Nullable<string>; // Принадлежность к ПСП
  pspOwner: Nullable<string>; // Владелец ПСП
  pspPurpose: Nullable<string>; // Назначение ПСП
  pspOwned: Nullable<string>; // Принадлежность
  fullName: Nullable<string>; // ФИО исполнителя
  jobTitle: Nullable<string>; // Должность
}

export interface IEliminationTypicalViolationFilter {
  identifiedTypicalViolationId?: string;
  eliminationStatus?: number;
  verificatedDateFrom?: string;
  verificatedDateTo?: string;
  ostRnuPspId?: string;
  treeFilter?: ITreeFilter;
}

export interface ITreeFilter {
  nodePath: string;
  isOwn: Nullable<boolean>;
}

export interface IEliminationTypicalViolationInfoModel {
  id: string; // Идентификатор записи
  verificatedOn: Nullable<string>; // дата проверки
  fullNameAuthor: Nullable<string>; // Автор
  status: Nullable<string>; // Статус нарушения
  statusId: Nullable<number>; // Статус нарушения ID
  eliminationText: Nullable<string>; // Выявлено нарушение (текст)
  planDate: Nullable<string>; // плановая дата проверки
  factDate: Nullable<string>; // фактическая дата проверки
}
