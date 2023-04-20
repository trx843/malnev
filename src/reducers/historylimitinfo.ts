import HistoryLimitInfoConstants from "../actions/historylimitinfo/constants";
import { IHistoryLimitState } from "../interfaces";
import * as actions from "../actions/historylimitinfo/creators";
import { ActionTypes } from "../types";

const date = new Date();

const initialState: IHistoryLimitState = {
    items: [],
    selectedName: "",
    selectedId: "",
    //selectedSi: null,
    //selectedSikn: null,
};

export function historyLimitInfoReducer(
    state = initialState,
    action: ActionTypes<typeof actions>
): IHistoryLimitState {
    switch (action.type) {
        case HistoryLimitInfoConstants.HL_FETCHED:
            return {
                ...state,
                items: action.payload ?? initialState.items,
            };

        // case HistoryLimitInfoConstants.HL_SI_SELECTED:
        //   return {
        //     ...state,
        //     selectedSi: action.payload ?? null,
        //   };
        // case HistoryLimitInfoConstants.HL_SIKN_SELECTED:
        //   return {
        //     ...state,
        //     selectedSikn: action.payload ?? null,
        //   };
        default:
            return state;
    }
}
