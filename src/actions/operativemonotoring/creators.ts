import { OperativeMonitoringModel } from "../../classes/OperativeMonitoringModel";
import { OperativeMonitoringFilter } from "../../components/operativeMonitoring/OperativeMonitoringFilterPanel";
import { IAction } from "../../interfaces";
import OperativeMonotoringConstants from "./constants";

export function operMonitFetched(
  model: OperativeMonitoringModel
): IAction<OperativeMonotoringConstants.OM_FETCHED, OperativeMonitoringModel> {
  return {
    type: OperativeMonotoringConstants.OM_FETCHED,
    payload: model,
  };
}

export function operMonitFiltered(
  filter: OperativeMonitoringFilter
): IAction<
  OperativeMonotoringConstants.OM_FILTERED,
  OperativeMonitoringFilter
> {
  return {
    type: OperativeMonotoringConstants.OM_FILTERED,
    payload: filter,
  };
}
