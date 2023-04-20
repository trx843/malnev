import { IOperMonitState } from "../interfaces";
import * as actions from "../actions/operativemonotoring/creators";
import { ActionTypes } from "../types";
import OperativeMonotoringConstants from "../actions/operativemonotoring/constants";
import { OperativeMonitoringModel } from "../classes/OperativeMonitoringModel";
import moment, { Moment } from "moment";

const format ="YYYY-MM-DD";
const initialState: IOperMonitState = {
  model: new OperativeMonitoringModel(),
  filter: {
    siknIdList: [],
    status: null,
    period: [
      moment().startOf("month"),
      moment().endOf("day"),
    ],
    startTime: moment().startOf("month").format(format),
    endTime: moment().endOf("day").format(),
    acknowledgedStatus: null,
  },
};

export function operMonitReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): IOperMonitState {
  switch (action.type) {
    case OperativeMonotoringConstants.OM_FETCHED:
      return {
        ...state,
        model: action.payload ?? initialState.model,
      };
    case OperativeMonotoringConstants.OM_FILTERED:
      return {
        ...state,
        filter: action.payload ?? initialState.filter,
      };
    default:
      return state;
  }
}
