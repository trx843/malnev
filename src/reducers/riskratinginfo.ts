import RiskRatingInfoConstants from "../actions/riskratinginfo/constants";
import { IRiskRatingInfoState } from "../interfaces";
import * as actions from "../actions/riskratinginfo/creators";
import { ActionTypes } from "../types";

const date = new Date();

const initialState: IRiskRatingInfoState = {
  items: {
    entities: [],
    pageInfo: {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    },
  },
  selectedSikn: null,
};

export function riskRatingInfoReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): IRiskRatingInfoState {
  switch (action.type) {
    case RiskRatingInfoConstants.RRINFO_FETCHED:
      return {
        ...state,
        items: action.payload ?? initialState.items,
      };
    case RiskRatingInfoConstants.RRINFO_SIKN_SELECTED:
      return {
        ...state,
        selectedSikn: action.payload ?? null,
      };
    default:
      return state;
  }
}
