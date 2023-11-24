import { IFailuresState } from "../interfaces";
import * as actions from "../actions/failures/creators";
import FailuresConstants from "../actions/failures/constants";
import { ActionTypes } from "../types";
import { techPosTreeConstant, zeroGuid } from "../utils";

const date = new Date();

const initialState: IFailuresState = {
  items: {
    entities: [],
    pageInfo: {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    },
  },
  filteredItems: [],
  writtenItem: null,
  node: {
    id: zeroGuid,
    nodeId: 0,
    title: "Все",
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
  selected: null,
  ownedFilter: null,
  warningFilter: null, // Недостоверные события
  failureTypeFilter: [],
  failureConsequenceFilter: [],
};

export function failuresReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): IFailuresState {
  switch (action.type) {
    case FailuresConstants.FAILURES_FETCHED:
      return {
        ...state,
        items: action.payload ?? initialState.items,
      };
    case FailuresConstants.NODE_CHANGED:
      return {
        ...state,
        node: action.payload ?? initialState.node,
      };
    case FailuresConstants.DATE_CHANGED:
      return {
        ...state,
        filterDates: action.payload ?? initialState.filterDates,
      };
    case FailuresConstants.TREE_CHANGED:
      return {
        ...state,
        viewName: action.payload ?? initialState.viewName,
      };
    case FailuresConstants.FAILURE_SELECTED:
      return {
        ...state,
        selected: action.payload ?? null,
      };
    case FailuresConstants.FAILURE_UPDATED:
      return {
        ...state,
        writtenItem: action.payload ?? null,
      };
    case FailuresConstants.FAILURE_OWNED_TYPE_FILTER:
      return {
        ...state,
        ownedFilter: action.payload ?? null,
      };
    case FailuresConstants.FAILURE_WARNING_TYPE_FILTER: // Недостоверные события
      return {
        ...state,
        warningFilter: action.payload ?? null
      };
    case FailuresConstants.FAILURE_TYPE_CHANGED:
      return {
        ...state,
        failureTypeFilter: action.payload?.slice() ?? [],
      };
    case FailuresConstants.FAILURE_CONSEQ_CHANGED:
      return {
        ...state,
        failureConsequenceFilter: action.payload?.slice() ?? [],
      };
    default:
      return state;
  }
}
