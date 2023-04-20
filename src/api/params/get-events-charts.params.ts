import { DateRange } from "../../slices/eventsCharts";
import { IdType } from "../../types";

export interface GetEventsChartsParams {
  siId: IdType,
  dateFilter: DateRange,
}