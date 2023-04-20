import { Nullable } from "../types";

export class OperativeMonitoringModel {
  ostList: Array<OstInformation> = [];
}

export interface OstInformation {
  id: number;
  ostName: string;
  inWorkCount: number;
  offCount: number;
  invalidCount: number;
  criticalEventsCount: number;
  otherEventsCount: number;

  siknList: Array<SknInformation>;
}
export interface SknInformation {
  id: number;
  siknName: string;
  status: number;
  statusText: string;
  criticalEventsCount: number;
  otherEventsCount: number;
  massFlow: number;
  volFlow: number;
  orgStructTrendName: Nullable<string>
}
