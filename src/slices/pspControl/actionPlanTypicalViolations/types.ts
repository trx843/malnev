import {
  TypicalPlanCardDtoType,
  TypicalPlanCardFilterEntitiesDto,
  TypicalPlanFilterDto,
} from "../../../api/requests/pspControl/plan-typical-violations/dto-types";
import moment, { Moment } from "moment";
import { IFiltersDescription, IListFilter, Nullable } from "../../../types";
import { LoadingsNames } from ".";
import { number } from "yup";
import { IAttachments } from "components/UploadAttachment/types";

export interface TypicalPlanFilter
  extends Omit<
  TypicalPlanFilterDto,
  "planId" | "verificatedDateFrom" | "verificatedDateTo"
  > {
  planId: string | null;
  verificatedDateFrom: Moment;
  verificatedDateTo: Moment;
}
export type TypicalPlanCardFilterEntities = TypicalPlanCardFilterEntitiesDto;

export enum TypicalPlanSections {
  AcceptancePointsForOilAndPetroleumProducts = "AcceptancePointsForOilAndPetroleumProducts",
  TestingLaboratoriesOfOilAndPetroleumProducts = "TestingLaboratoriesOfOilAndPetroleumProducts",
  Matchings = "Matchings",
}

export interface ActionTypicalPlanItems {
  filter: TypicalPlanFilter;
}

export interface ActionTypicalPlanSectionBody {
  filter: TypicalPlanFilter;
  entities: TypicalPlanCardFilterEntities[];
  pageInfo: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ActionPlanTypicalSection {
  [TypicalPlanSections.AcceptancePointsForOilAndPetroleumProducts]: ActionTypicalPlanSectionBody;
  [TypicalPlanSections.TestingLaboratoriesOfOilAndPetroleumProducts]: ActionTypicalPlanSectionBody;
}

export interface ActionPlanTypicalSectionPending {
  [TypicalPlanSections.AcceptancePointsForOilAndPetroleumProducts]: boolean;
  [TypicalPlanSections.TestingLaboratoriesOfOilAndPetroleumProducts]: boolean;
}

export interface ActionPlanTypicalViolationsStore {
  pending: boolean;
  currentId: string | null;
  planName: string;
  planStatus: string;
  attachments: IAttachments[];
  memoizePages: Record<string, ActionPlanTypicalSection>;
  sectionPending: Record<string, ActionPlanTypicalSectionPending>;
  violations: IViolationListModel[];
  filterList: IFiltersDescription[];
  // listFilter: IListFilter<IFilter>;
  isAddViolationsModalVisible: boolean;
  [LoadingsNames.isViolationsLoading]: boolean;
  [LoadingsNames.isFilterListLoading]: boolean;
  [LoadingsNames.isAddingTypicalViolation]: boolean;

  filterBasicInformation: IFilterBasicInformation;
  typicalPlanCard: Nullable<TypicalPlanCardDtoType>;
  isTypicalPlanCardLoading: boolean;
  isViolationsByAreaOfResponsibilityLoading: boolean;
  acceptancePointsForOilAndPetroleumProducts: ITypicalViolationsForPlanCardWithActionPlanModel[];
  testingLaboratoriesOfOilAndPetroleumProducts: ITypicalViolationsForPlanCardWithActionPlanModel[];
  listFilter: TypicalPlanListFilter;

  isMatchingsTabLoading: boolean;
  planStatusId: number;
  isIL: boolean;
  isAttachmentsLoading: boolean;
  reloadTableItems: boolean;
}

export interface IViolationModalFilter {
  ostsName?: string[];
  areaOfResponsibility?: string[];
  osuShortName?: string[];
  violationSerial?: string[];
  // repeatViolation?: boolean;
  classifficationType?: string[];
  pointNormativeDocuments?: string;
  violationText?: string;
}

export interface IFilter extends IViolationModalFilter {
  treeFilter: {
    nodePath: string;
    isOwn: Nullable<boolean>;
  };
}

export interface TypicalViolationForActModalFilter {
  typicalViolationText?: string;
  typicalViolationSerial?: string[];
}

export interface IViolationListModel {
  id: string; // Идентификатор записи
  ostName: string; // наименование ОСТ
  areaOfResponsibility: string; // Зона ответственности
  serial: string; // подпункт нарушения
  violationSerial: string;
  violationText: string; // Текст нарушения
  pointNormativeDocuments: string; // Нормативный документ
  osuShortName: string; // Объекты проверки
  classifficationTypeName: string; // номер классификации
  duplicate: string; // Повторяющийся
}

export interface ITypicalViolationsForPlanCardWithActionPlanModel {
  id: string; // Идентификатор записи (подпункта)
  index: number; // Индекс записи
  identifiedTypicalViolationId: string; // Идентификатор типового нарушения
  identifiedTypicalViolationSerial: string; // Прядковый номер пункта нарушения
  typicalViolationSerial: string; // Прядковый номер подпункта нарушения
  typicalViolationText: Nullable<string>; // Текст нарушения
  pointNormativeDocuments: Nullable<string>; // Текст нормативной документации
  actionPlan: IActionPlanCardModel[]; // План мероприятия
  groupField: string; // Группировочное поле
}

export interface IActionPlanCardModel {
  id: string; // Идентификатор записи
  serial: number; // Уровень проверки
  serialFull: Nullable<string>; // Уровень проверки полный с номерами нарушения
  eliminationText: Nullable<string>; // Текст устранения
  eliminatedOn: Nullable<string>; // Срок устранения
  actionText: Nullable<string>; // Текст мероприятия
  fullNameExecutor: Nullable<string>; // ФИО исполнителя
  positionExecutor: Nullable<string>; // Должность исполнителя
  fullNameController: Nullable<string>; // ФИО контролера
  positionController: Nullable<string>; // Должность контролера
}

export type TypicalPlanListFilter = IListFilter<TypicalPlanModelFilter>;

export interface TypicalPlanModelFilter {
  areaOfResponsibility?: string;
  verificatedDateFrom?: string;
  verificatedDateTo?: string;
  treeFilter: TreeFilter;
  isIL?: boolean;
}
export interface TreeFilter {
  nodePath: string;
  isOwn: Nullable<boolean>;
}

export interface IFilterBasicInformation {
  verificationPeriodFrom: string;
  verificationPeriodFor: string;
}

export interface IIdentifiedViolationsListModel {
  id: string; // Идентификатор записи
  ostName: string; // наименование ОСТ
  classifficationTypeId: number; // Классификация нарушения
  sourceRemarkId: number; // Источник нарушения
  specialOpinion: string; // особое мнение
  typicalViolationId: string; // номер типового нарушения ID
  typicalViolationNumber: string; // номер типового нарушения
  areaOfResponsibility: string; // Зона ответственности
  identifiedViolationSerial: string; // пункт нарушения
  osusShortNames: string; // Объекты проверки
  classifficationTypeName: string; // имя классификации
  classifficationNumber: string; // номер классификации
  duplicate: string; // Повторяющийся
  violations: IViolationsModel[]; // Нарушения
}

export interface IViolationsModel {
  id: string; // Идентификатор записи
  serial: number; // порядковый номер
  createdOn: string; // Дата создания
  violationText: string; // Текст нарушения
  pointNormativeDocuments: string; // Пункт НД и/или ОРД
  identifiedViolationsId: string; // Идентификатор нарушения
}

export interface ITypicalViolationSortedModel {
  violationText: Nullable<string>;
  pointNormativeDocuments: Nullable<string>;
  id: string;
  newSerial: number;
}

export interface IFormViolation {
  pointNormativeDocuments: string,
  violationText: string
}