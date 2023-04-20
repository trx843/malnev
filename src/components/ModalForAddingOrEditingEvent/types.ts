import { Nullable } from "types";

export interface IViolationValues {
  actionPlanId?: string;
  violationsId: string;
  identifiedViolationsId: string;
  serial: number;
}

export interface IRecommendationValues {
  actionPlanId?: string;
  recommendationId: string;
  serial: number;
}

export interface ITypicalViolationValues {
  actionPlanId?: string;
  violationsId: string;
  identifiedViolationsId: string;
  serial: number;
}

export type EntityValues = Nullable<IViolationValues | IRecommendationValues | ITypicalViolationValues>;
