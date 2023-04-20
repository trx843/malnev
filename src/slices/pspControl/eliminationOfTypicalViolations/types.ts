import { IEliminationTypicalViolationInfoModel, IEliminationTypicalViolationSettingsModel } from "../../../api/requests/eliminationOfTypicalViolations/types";
import { IGenericFilterConfig } from "../../../components/CustomFilter/interfaces";
import { IdType, IListFilter, Nullable, PageInfo } from "../../../types";

export enum LoadingsNames {
  isTypicalViolationsLoading = "isTypicalViolationsLoading",
  isSettingsPspLoading = "isSettingsPspLoading",
  isPendingAction = "isPendingAction"
}

export interface IEliminationOfTypicalViolationsStore {
  identifiedTypicalViolations: any[];
  listFilter: IListFilter<ITypicalViolationForEliminationFilter>;
  filterConfig: IGenericFilterConfig;
  settingsPsp: Nullable<IEliminationTypicalViolationSettingsModel>;
  selectedIdentifiedTypicalViolations: any[];
  selectedIdentifiedViolationId: Nullable<IdType>,
  eliminationTypicalViolationInfo: IEliminationTypicalViolationInfoModel[]
  pageInfo: PageInfo,
  [LoadingsNames.isTypicalViolationsLoading]: boolean;
  [LoadingsNames.isSettingsPspLoading]: boolean;
  [LoadingsNames.isPendingAction]: boolean;
}

export interface IIdentifiedTypicalViolationsWithEliminationModel {
  id: string; // Идентификатор нарушения
  eliminationId: string; // Идентификатор устранения нарушения
  identifiedViolationsSerial: number; // Порядковый номер выявленного нарушения
  siknLabRsuType: Nullable<string>; // Зона ответственности
  eliminationTermPlan: Nullable<string>; // Срок устранения плановый
  eliminationTermFact: Nullable<string>; // Срок устранения факт
  currentStatus: Nullable<string>; // Текущий статус
  currentStatusId: number; // Текущий статус (id)
  userId: string; // Идентификатор пользователя
  typicalViolationsWithActionPlan: ITypicalViolationsWithActionPlanModel[]; // Планы мероприятий и их устранение
}

export interface ITypicalViolationsWithActionPlanModel {
  id: string; // Идентификатор записи
  typicalViolationSerial: Nullable<string>; // Прядковый номер подпункта нарушения
  typicalViolationText: Nullable<string>; // Текст нарушения
  pointNormativeDocuments: Nullable<string>; // Текст нормативной документации
  actionPlan: IActionPlanCardModel[]; // План мероприятия
}

export interface IActionPlanCardModel {
  id: string; // Идентификатор записи
  serial: number; // Уровень проверки
  serialFull: Nullable<string>; // Уровень проверки полный с намерами нарушения
  eliminationText: Nullable<string>; // Текст устранения
  eliminatedOn: Nullable<string>; // Срок устранения
  actionText: Nullable<string>; // Текст мероприятия
  fullNameExecutor: Nullable<string>; // ФИО исполнителя
  positionExecutor: Nullable<string>; // Должность исполнителя
  fullNameController: Nullable<string>; // ФИО контролера
  positionController: Nullable<string>; // Должность контролер
}

export interface ITypicalViolationForEliminationFilter {
  fullNameExecutor?: string;
  jobTitleExecutor?: string;
  fullNameController?: string;
  jobTitleController?: string;
  eliminationTerm?: string[];
  lastVerificationDate?: string[];
  ostRnuPspId?: string;
}

export interface IEliminationTypicalViolationsSaveModel {
  ostRnuPspId: string; // Идентификатор ПСП
  identifiedTypicalViolationsIds: string[]; // Идентификатор типового нарушения
  userId: string; // Идентификатор пользователя
  planDate: string; // Плановая дата устранения
  verificatedOn: string; // Дата выявления или не выявления нарушения
  eliminationComment: string; // Содержание выявленного нарушения (как коментарий к типовому нарушению)
}



export interface EliminationViolationSaveModel {
  violationId: IdType; // Идентификатор типового нарушения
  factDate: string; // Фактическая дата устранения
  userId: string; // Идентификатор пользователя
}
