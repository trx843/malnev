import { ICoefsState } from "../interfaces";
import * as actions from "../actions/coefs/creators";
import CoefConstants from "../actions/coefs/constants";
import { ActionTypes } from "../types";
import { techPosTreeConstant, zeroGuid } from "../utils";

const date = new Date();

const initialState: ICoefsState = {
  items: {
    entities: [],
    pageInfo: {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    },
  },
  node: {
    id: zeroGuid,
    nodeId: 0,
    title: "",
    key: "0",
    type: "all",
    owned: true,
    isSiType: false,
  },
  filterDates: {
    startDate: new Date(date.getFullYear(), date.getMonth(), 1),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ),
  },
  viewName: techPosTreeConstant,
  ownedFilter: null,
};

export function coefReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): ICoefsState {
  switch (action.type) {
    case CoefConstants.COEF_FETCHED:
      return {
        ...state,
        items: action.payload ?? initialState.items,
      };
    case CoefConstants.NODE_CHANGED:
      return {
        ...state,
        node: action.payload ?? initialState.node,
      };
    case CoefConstants.DATE_CHANGED:
      return {
        ...state,
        filterDates: action.payload ?? initialState.filterDates,
      };
    case CoefConstants.TREE_CHANGED:
      return {
        ...state,
        viewName: action.payload ?? initialState.viewName,
      };
    case CoefConstants.COEF_OWNED_TYPE_FILTER:
      return {
        ...state,
        ownedFilter: action.payload ?? null,
      };
    default:
      return state;
  }
}
