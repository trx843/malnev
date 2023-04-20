import { OperativeMonitoringFilter } from "components/operativeMonitoring/OperativeMonitoringFilterPanel";
import { AcknowledgedStatus } from "enums";
import { IdType, Nullable } from "types";

export type FilterType = {
  id: IdType;
  critical: boolean;
  operativeMonitFilter?: OperativeMonitoringFilterLight | undefined;
};


export class OperativeMonitoringFilterLight {
  status: Nullable<number> = null;
  startTime: string;
  endTime: string;
  acknowledgedStatus: Nullable<AcknowledgedStatus> = null;
}