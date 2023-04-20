import moment from "moment";
import { Nullable } from "../../../types";
import { PlanStatuses } from "../../../enums";

export interface IPlanInfo {
  id: Nullable<string>;
  createdOn: Nullable<string>;
  planName: Nullable<string>;
  status: Nullable<number>;
  verificationActId: Nullable<string>;
  verificationId: Nullable<string>;
  verificationSchedulesId: Nullable<string>;
}

export interface IPlanCard {
  id: Nullable<string>; // Идентификатор записи
  planName: Nullable<string>; // Наименование
  planStatus: Nullable<string>; // Статус
  planStatusId: PlanStatuses;
  verificationId: Nullable<string>; // ИД проверки
  verificationActId: Nullable<string>; // ИД акта проверки
  verificationSchedulesId: Nullable<string>; // ИД графика проверки
  verificationLevelId: number;
  ostName: Nullable<string>; // Натменование ОСТ
  filialName: Nullable<string>; // Наименование РНУ / филиал
  pspFullName: Nullable<string>; // Наименование ПСП
  pspOwner: Nullable<string>; // Владелец ПСП
  suName: Nullable<string>; // Наименование сикн
  checkSuNames: Nullable<string>; // Проверяемые системы учета
  pspPurpose: Nullable<string>; // Назначение ПСП
  pspAffiliation: Nullable<string>; // Принадлежность к ПСП
  verificationLevel: Nullable<string>; // Уровень проверки
  verificatedOn: Nullable<Date | string>; // Дата проверки
  verificationType: Nullable<string>; // Статус плана
  verificationTypeDescription: Nullable<string>; // акт или отчет = ['0', '1']
  verificationActName: Nullable<string>; //  Наименование акта
  createdOnPlan: Nullable<Date | string>; // Дата создания
  verificationTypeCode: number;
  violations: IViolation[]; // Нарушения
  recommendation: IRecommendationWithActionPlanModel[]; // Планы мероприятий для рекомендаций
}

export interface IViolation {
  id: string; // Идентификатор записи
  identifiedViolationsId: Nullable<string>; // Идентификатор выявленного нарушения
  violationsId: Nullable<string>; // Идентификатор нарушения
  identifiedViolationsSerial: Nullable<number>; // Порядковый номер выявленного нарушения
  serial: Nullable<number>; // Прядковый номер нарушения
  violationText: Nullable<string>; // Текст нарушения
  pointNormativeDocuments: Nullable<string>; // Текст нормативной документации
  areaOfResponsibility: Nullable<string>; // Зона отвветственности
  actionPlan: IActionPlanCard[]; // Мероприятия
  sortOrder: number; // Прядковый номер нарушения
}

export interface IRecommendationWithActionPlanModel {
  id: string; // Идентификатор записи
  serial: number; // Прядковый номер рекомендации
  recommendationText: Nullable<string>; // Текст рекомендации
  actionPlan: IActionPlanCard[]; // План мероприятия
}

export interface ICommissionPlanModel {
  id: string;
  createdOn: string;
  serial: number;
  organizationName: string;
  fullName: string;
  jobTitle: string;
  verificationPlanId: string;
  commisionTypesId: number;
  commisionTypesText: string;
  isOutsideOrganizationText: string;
  isOutsideOrganization: boolean;
}

export interface IActionPlanCard {
  id: string; // Идентификатор записи
  serial: number; // Уровень проверки
  serialFull: Nullable<string>; // Уровень проверки полный с намерами нарушения
  eliminationText: Nullable<string>; // Текст устранения
  eliminatedOn: Nullable<string>; // Срок устранения
  actionText: Nullable<string>; // Текст мероприятия
  fullNameController: Nullable<string>; // ФИО контролера
  fullNameExecutor: Nullable<string>; // ФИО исполнителя
  positionController: Nullable<string>; // Должность контролера
  positionExecutor: Nullable<string>; // Должность исполнителя
}

export interface IActionPlanModel {
  actionText: Nullable<string>;
  eliminatedOn: Nullable<Date | moment.Moment | string>;
  fullNameController: Nullable<string>;
  fullNameExecutor: Nullable<string>;
  id: Nullable<string>;
  identifiedViolationsId: Nullable<string>;
  isDone: Nullable<boolean>;
  isPermanent: Nullable<boolean>;
  positionController: Nullable<string>;
  positionExecutor: Nullable<string>;
  serial: Nullable<number>;
  verificationPlanId: Nullable<string>;
  violationsId: Nullable<string>;
  recommendationId: Nullable<string>;
}

export interface IPlanAttachments {
  id: string; // Идентификатор записи
  serial: number; // Порядковый номер записи
  createdOn: string; // Дата создания записи
  fileName: string; // Имя файла
  docType: Nullable<any>; // Тип документа
  verificationPlanId: string; // План Id
  isMain: boolean; // пометка
  url: Nullable<string>
}

// модели для фронта с дополнительными атрибутами
export interface IViolationsViewModel {
  violation_actionPlan: IActionPlanCard[];
  violation_areaOfResponsibility: Nullable<string>;
  violation_id: string;
  violation_identifiedViolationsId: Nullable<string>;
  violation_identifiedViolationsSerial: Nullable<number>;
  violation_pointNormativeDocuments: Nullable<string>;
  violation_serial: Nullable<number>;
  violation_violationText: Nullable<string>;
  violation_violationsId: Nullable<string>;

  _isLastActionPlan: boolean;
  _maxActionPlanSerial: number;
  _rowSpanPointColumn: number;
  _violationSerial: string;
}

export interface IViolationsWithActionPlanViewModel
  extends IViolationsViewModel {
  actionPlan_actionText: Nullable<string>;
  actionPlan_eliminatedOn: Nullable<Date | string>;
  actionPlan_eliminationText: Nullable<string>;
  actionPlan_fullNameController: Nullable<string>;
  actionPlan_fullNameExecutor: Nullable<string>;
  actionPlan_id: string;
  actionPlan_positionController: Nullable<string>;
  actionPlan_positionExecutor: Nullable<string>;
  actionPlan_serial: Nullable<number>;

  _actionPlanSerial: string;
  _rowSpanSubPointColumn: number;
}

export interface IPlanCardActionPlanFullWidthRowViewModel {
  _fullWidthRowName: string;
  _isFullWidthRow: boolean;
}

export type IPlanCardActionPlanViewModel = (
  | IViolationsViewModel
  | IViolationsWithActionPlanViewModel
  | IPlanCardActionPlanFullWidthRowViewModel
)[];
