import { IGenericFilterConfig } from "../../../components/CustomFilter/interfaces";
import { ListFilterBase, SelectedNode } from "../../../interfaces";
import { Nullable } from "../../../types";

export enum LoadingsNames {
  isViolationsLoading = "isViolationsLoading",
}

export interface IEliminationOfViolationsStore {
  identifiedViolations: IdentifiedViolationsWithActionPlanAndEliminationModel[];
  selectedTreeNode: SelectedNode;
  appliedFilter: ListFilterBase;
  filterConfig: IGenericFilterConfig;
  [LoadingsNames.isViolationsLoading]: boolean;
}

export interface IdentifiedViolationsWithActionPlanAndEliminationModel {
  id: string; // Идентификатор выявленного нарушения
  actName: Nullable<string>; // Наименование акта, где зарегистрировано нарушение
  actId: Nullable<string>; // ID акта ,
  identifiedViolationsSerial: Nullable<number>; // Порядковый номер выявленного нарушения
  typeMismatch: Nullable<string>; // Тип несоответствия
  classifficationTypeName: Nullable<string>; // Классификация нарушения
  typical: Nullable<string>; // Типовое нарушение
  isDouble: Nullable<string>; // Повторяющееся
  serial: Nullable<string>; // Порядковый номер
  areaOfResponsibility: Nullable<string>; // Зона отвветственности
  violations: ViolationWithActionPlanAndEliminationModel[];
}

export interface ViolationWithActionPlanAndEliminationModel {
  serial: Nullable<string>; // Порядковый номер
  violationText: Nullable<string>; // Текст нарушения
  pointNormativeDocuments: Nullable<string>; // Пункт НД и/или ОРД
  actionPlans: IActionPlanWithEliminationModel[]; // Планы с исполнениями
}

export interface IActionPlanWithEliminationModel {
  actionPlanId: Nullable<string>; // Идентификатор плана мероприятия
  eliminationId: Nullable<string>; // Идентификатор исполнения нарушения
  serial: Nullable<number>; // Уровень проверки
  actionPlanText: Nullable<string>; // Текст плана мероприятия
  eliminateStatusText: Nullable<string>; // Текст статуса устранения нарушения
  eliminateStatusId: Nullable<number>; // ID статуса устранения нарушения
  eliminateFact: Nullable<string>; // Срок устранения факт
  eliminatePost: Nullable<string>; // Срок устранения перенос
  eliminatePlan: Nullable<string>; // Срок устранения плановый
  fullNameController: Nullable<string>; // Ответственный за контроль
  eliminationColorType: number // Тип окраса строки = ['0', '1', '2']
}

export interface IEliminationInfo {
  ostName: Nullable<string>; // Наименование ОСТ
  filialName: Nullable<string>; // Наименование филиала
  pspName: Nullable<string>; // Наименование ПСП
  suNames: Nullable<string>; // Наименования СУ
  pspAffilation: Nullable<string>; // Принадлежность ПСП
  ilName: Nullable<string>; // Наименование исп лаборатории
  ilOwner: Nullable<string>; // Владелец исп лаборатории
  controlDate: Nullable<Date>; // Даты проверки
  verificationLevel: Nullable<string>; // Уровень проверки
  verificationType: Nullable<string>; // Тип проверки
  inSchedule: Nullable<string>; // В графике/вне графика
}

export interface IInfoCourse {
  comment: Nullable<string>; // Коментрарий
  dateAdd: Nullable<string>; // Дата добавления статуса
  author: Nullable<string>; // ФИО и должнсоть автора
  operation: Nullable<string>; // Тип операции
  eliminationAttachment: EliminationAttachmentModel[]; // Вложения
}

export interface EliminationAttachmentModel {
  id: string; // ИД
  fileName: Nullable<string>; // Имя файла
  url: Nullable<string>; // Ссылка
}
