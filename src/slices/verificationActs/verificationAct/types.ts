import { IAttachments } from "components/UploadAttachment/types";
import { LoadingsNames } from ".";
import { SourceRemarkDto } from "../../../api/requests/verificationActs/dto-types";
import { OsusItem } from "../../../components/PspControl/PspObject/classes";
import {
  CommissionItem,
  CompositionItem,
  IdentifiedVItem,
  NumberOneSideItem,
  OtherSideItem,
  RecommendationItem,
} from "../../../components/VerificationActs/VerificationAct/classes";
import {
  VerificationActOptions,
  VerificationActSection,
} from "../../../containers/VerificationActs/VerificationAct/types";
import { IFiltersDescription, IListFilter, Nullable } from "../../../types";
import {
  IFilter,
  TypicalViolationForActModalFilter,
} from "../../pspControl/actionPlanTypicalViolations/types";

export type GroupClassiffNumbersOptions = {
  group: string;
  options: { id: string; name: string; serial: string }[];
};

export interface BodyPage<T = unknown, D = unknown> {
  items: T[];
  data: D | null;
  cached: boolean;
}

export interface CheckingObject {
  bdmiMaxFlowrange: string | null;
  bdmiMinFlowrange: string | null;
  bdmiOilPipeline: string | null;
  bdmiPerformance: string | null;
  bdmiStatus: string | null;
  id: string;
  isAccredited: false;
  osuAffiliation: string | null;
  osuName: string;
  osuOwner: string;
  osuPurpose: string;
  osuShortName: string;
  osuType: string;
  owned: string;
  receive: string | null;
  rsuName: string;
  send: string | null;
  territorialLocation: string | null;
}

export interface VerificationOsuItem extends OsusItem {
  hasViolations: boolean;
  siknLabRsuId: string;
  rsus: string;
  hasAccreditationIl: string;
}

export type VerificationPage = {
  checkingObjects: VerificationOsuItem[];
  preparedOn: string;
  filial: string;
  createdOn: string;
  inspectedType: string | null;
  verificationPlanId: string | null;
  verificationPlanText: string | null;
  ostName: string;
  pspAffiliation: string | null;
  psp: string;
  pspOwned: string;
  pspOwner: string | null;
  id: string;
  ostRnuPspId: string;
  ostRnuPsp_VerificationSchedulesId: string | null;
  status: number;
  verificatedOn: string;
  verificationPlace: string;
  verificationSchedulesId: string | null;
  verificationShedulesText: string | null;
  actName: string;
  verificationStatus: string;
  verificationStatusId: number;
  verificationLevelId: number;
  isVisibilityInspection: boolean;
};

export interface SectionStore {
  compositionOfAppendicesToReport: BodyPage<ReportItemModel>;
  identifiedViolationsOrRecommendations: BodyPage<GroupedViolationByArea>;
  otherSides: BodyPage<OtherSideItem>;
  commission: BodyPage<CommissionItem>;
  numberOneSide: BodyPage<NumberOneSideItem, VerificationPage>;
  recommendations: BodyPage<RecommendationItemModel>;
}

export interface ActPage extends SectionStore {
  page: VerificationPage | null;
}

export interface VerificationPending {
  [VerificationActSection.NumberOneSide]: boolean;
  [VerificationActSection.Commission]: boolean;
  [VerificationActSection.CompositionOfAppendicesToReport]: boolean;
  [VerificationActSection.IdentifiedViolationsOrRecommendations]: boolean;
  [VerificationActSection.OtherSides]: boolean;
  [VerificationActSection.Recommendations]: boolean;
}

export interface VerificationActOptionsStore {
  [VerificationActOptions.OSUS]: CheckingObject[];
  [VerificationActOptions.AreaOfResponsibility]: string[];
  [VerificationActOptions.ClassificationNumber]: GroupClassiffNumbersOptions[];
  [VerificationActOptions.SourceViolations]: string[];
  [VerificationActOptions.CTO]: { id: null; label: string }[];
  [VerificationActOptions.InspectionType]: string[];
  [VerificationActOptions.SourceRemark]: string[];
}

export type IViolationListItemModel = {
  createdOn: Date;
  id: string;
  identifiedViolationsId: string;
  pointNormativeDocuments: string;
  serial: number;
  violationText: string;
};

export interface GroupedViolationByArea {
  areaOfResponsibility: string; // Зона ответственности
  violations: IViolationListModel[];
}

export interface IViolationListModel {
  id: string; // Идентификатор записи
  ostName: string; // наименование ОСТ
  areaOfResponsibility: string; // Зона ответственности
  serial: number; // подпункт нарушения
  violationText: string; // Текст нарушения
  pointNormativeDocuments: string; // Нормативный документ
  osuShortName: string; // Объекты проверки
  classifficationTypeName: string; // номер классификации
  duplicate: string; // Повторяющийся
  specialOpinion: string;
  sourceRemarkId: number;
  violationSerial: number;
  classifficationTypeId: number;
  sourceRemark: string;
  isDuplicate: boolean;
  siknLabRsu: ISiknLabRsu[];
  violations: IViolationListItemModel[];
  verificationLevelId: number;
}

interface ISiknLabRsu {
  id: string;
  siknLabRsuName: string;
}

export interface Violation {
  areaOfResponsibility: string;
  classifficationTypeId: string;
  serial: string;
  siknLabRsu: Array<string>;
  sourceRemarkId: string;
  specialOpinion: string;
  verificationActId: string;
  violations: {
    pointNormativeDocuments: string;
    violationText: string;
  }[];
}

export interface TypicalViloationList {
  id: string; // Идентификатор записи
  typicalViolations: {
    id: string;
    pointNormativeDocuments: string;
    typicalViolationSerial: string;
    typicalViolationText: string;
  }[];
}

export interface VerificationActStore {
  pending: boolean;
  currentId: string | null;
  memoizePages: Record<string, ActPage>;
  sectionPending: Record<string, VerificationPending>;
  memoizeOptions: Record<string, VerificationActOptionsStore>;
  attachments: IAttachments[];
  modalConfigs: {
    [ModalConfigTypes.IdentifiedViolations]: {
      filterList: IFiltersDescription[];
      listFilter: IListFilter<TypicalViolationForActModalFilter>;
      violations: IViolationListModel[];
    };
    [ModalConfigTypes.TypicalViolation]: {
      filterList: IFiltersDescription[];
      listFilter: IListFilter<TypicalViolationForActModalFilter>;
      violations: TypicalViloationList[];
    };
  };
  [LoadingsNames.isActAttachmentsLoading]: boolean;
  [LoadingsNames.isDeletingActAttachment]: boolean;
  [LoadingsNames.isDownloadingActAttachment]: boolean;

  act: Nullable<VerificationPage>;
  commission: CommissionItem[]; // вкладка Комиссия
  identifiedViolationsOrRecommendations: GroupedViolationByArea[];
  recommendations: RecommendationItemModel[]; // вкладка Рекомендации
  compositionOfAppendicesToReport: ReportItemModel[]; // вкладка Состав приложений к отчету
}

export enum ModalConfigTypes {
  IdentifiedViolations = "IdentifiedViolations",
  TypicalViolation = "TypicalViolation",
}

export type ClassifType = 3 | 1;

export type SourceRemark = SourceRemarkDto;

export type ReportItemModel = {
  id: string;
  serial: number;
  name: string;
  pageCount: string;
};

export type RecommendationItemModel = {
  id: string;
  serial: number;
  recommendationsText: string;
  hasActionPlan: boolean;
};
