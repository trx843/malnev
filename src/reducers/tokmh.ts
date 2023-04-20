import { IToKmhState } from "../interfaces";
import * as actions from "../actions/toKmh/creators";
import ToKmhConstants from "../actions/toKmh/constants";
import { ActionTypes } from "../types";
import { techPosTreeConstant, zeroGuid } from "../utils";

const date = new Date();

const initialState: IToKmhState = {
  items: {
    entities: [],
    pageInfo: {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    },
  },
  writtenItem: null,
  filteredItems: [],
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

export function toKmhReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): IToKmhState {
  switch (action.type) {
    case ToKmhConstants.TOKMH_FETCHED:
      return {
        ...state,
        items: action.payload ?? initialState.items,
      };
    case ToKmhConstants.TOKMH_UPDATED:
      return {
        ...state,
        writtenItem: action.payload ?? null,
      };
    case ToKmhConstants.TOKMH_FILTERED:
      return {
        ...state,
        filteredItems: action.payload?.slice() ?? [],
      };
    case ToKmhConstants.NODE_CHANGED:
      return {
        ...state,
        node: action.payload ?? initialState.node,
      };
    case ToKmhConstants.DATE_CHANGED:
      return {
        ...state,
        filterDates: action.payload ?? initialState.filterDates,
      };
    case ToKmhConstants.TREE_CHANGED:
      return {
        ...state,
        viewName: action.payload ?? initialState.viewName,
      };
    case ToKmhConstants.TOKMH_OWNED_TYPE_FILTER:
      return {
        ...state,
        ownedFilter: action.payload ?? null,
      };
    default:
      return state;
  }
}
