import { Nullable } from "types";
import {
  ITypicalViolationsForPlanCardWithActionPlanModel,
  TypicalPlanSections,
} from "../../../../slices/pspControl/actionPlanTypicalViolations/types";

export interface TypicalPlanCardDtoType {
  id: string;
  planName: string;
  planStatus: string;
  planStatusId: number;
}

export interface EntitiesActionPlanDto {
  id: string;
  serial: number;
  eliminationText: string;
  eliminatedOn: string;
  actionText: string;
  fullNameExecutor: string;
  positionExecutor: string;
  fullNameController: string;
  positionController: string;
}

export interface TypicalPlanCardFilterEntitiesDto {
  id: string;
  identifiedTypicalViolationId: string;
  identifiedTypicalViolationSerial: number;
  typicalViolationSerial: number;
  typicalViolationText: string;
  violationsId: string;
  areaOfResponsibility: string;
  pointNormativeDocuments: string;
  actionPlan: EntitiesActionPlanDto[] | null;
  typicalViolationId: string;
}

export interface TypicalPlanCardFilterDto {
  entities: ITypicalViolationsForPlanCardWithActionPlanModel[];
  pageInfo: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface TypicalPlanFilterDto {
  planId: string;
  areaOfResponsibility: string | TypicalPlanSections;
  verificatedDateFrom: string;
  verificatedDateTo: string;
  treeFilter: {
    nodePath: string;
    isOwn: string;
  };
  rowCount: number;
  pageIndex: number;
  sortedField: string;
  isSortAsc: boolean;
}

export interface TypicalPlanFilterParamsDto {
  filter: TypicalPlanFilterDto;
}

export interface AddActionPlanDtoType {
  id: string;
  serial: number;
  isNeedAction: boolean;
  isPermanent: boolean;
  isDone: boolean;
  eliminatedOn: string;
  actionText: string;
  fullNameExecutor: string;
  positionExecutor: string;
  fullNameController: string;
  positionController: string;
  violationsId: string;
  identifiedViolationsId: string;
  inspectedYear: number;
  verificationPlanId: string;
}

export interface IIdentifiedViolation {
  id: string;
  identifiedViolationSerial: number;
  createdOn: Nullable<string>;
  verificatedOn: Nullable<string>;
  siknLabRsuTypeId: number;
  archiveIdentifiedTypicalViolationId: Nullable<string>;
  typicalViolations: ITypicalViolation[];
}

export interface ITypicalViolation {
  id: string;
  typicalViolationSerial: number;
  typicalViolationText: Nullable<string>;
  identifiedTypicalViolationsId: Nullable<string>;
  pointNormativeDocuments: Nullable<string>;
}
