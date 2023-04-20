import { ISiknOffState } from "../interfaces";
import * as actions from "../actions/siknoffs/creators";
import { ActionTypes } from "../types";
import SiknOffConstants from "../actions/siknoffs/constants";
import { zeroGuid } from "../utils";

const date = new Date();

const initialState: ISiknOffState = {
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
  insertedItem: null,
  filteredItems: [],
  node: {
    id: zeroGuid,
    nodeId: 0,
    title: "",
    key: "0",
    type: "all",
    owned: null,
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
  rsuFilter: true,
  reportFilter: false,
  ownedFilter: null,
};

export function siknOffReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): ISiknOffState {
  switch (action.type) {
    case SiknOffConstants.OFFS_FETCHED:
      return {
        ...state,
        items: action.payload ?? initialState.items,
        writtenItem: null,
        insertedItem: null,
      };
    case SiknOffConstants.OFF_UPDATED:
      return {
        ...state,
        writtenItem: action.payload ?? null,
      };
    case SiknOffConstants.OFF_INSERTED:
      return {
        ...state,
        insertedItem: action.payload ?? null,
      };
    case SiknOffConstants.OFFS_FILTERED:
      return {
        ...state,
        filteredItems: action.payload?.slice() ?? [],
        writtenItem: null,
        insertedItem: null,
      };
    case SiknOffConstants.NODE_CHANGED:
      return {
        ...state,
        items: initialState.items,
        filteredItems: [],
        writtenItem: null,
        insertedItem: null,
        node: action.payload ?? initialState.node,
      };
    case SiknOffConstants.DATE_CHANGED:
      return {
        ...state,
        filterDates: action.payload ?? initialState.filterDates,
      };
    case SiknOffConstants.RSU_FILTER:
      return {
        ...state,
        rsuFilter: action.payload ?? true,
      };
    case SiknOffConstants.REPORT_FILTER:
      return {
        ...state,
        reportFilter: action.payload ?? false,
      };
    case SiknOffConstants.OFF_OWNED_TYPE_FILTER:
      return {
        ...state,
        ownedFilter: action.payload ?? null,
      };
    default:
      return state;
  }
}
