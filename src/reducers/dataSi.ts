import { IDataSiState } from "../interfaces";
import * as actions from "../actions/dataSi/creators";
import { ActionTypes } from "../types";
import DataSiConstants from "../actions/dataSi/constants";
import { techPosTreeConstant } from "../utils";

const initialState: IDataSiState = {
  items: {
    entities: [],
    pageInfo: {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    },
  },
  filtered: [],
  writtenItem: null,
  insertedItem: null,
  viewName: techPosTreeConstant,
  node: null,
  archiveFilter: false,
  ownedFilter: null,
};

export function dataSiReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): IDataSiState {
  switch (action.type) {
    case DataSiConstants.DATASI_FETCHED:
      return {
        ...state,
        items: action.payload ?? initialState.items,
        writtenItem: null,
        insertedItem: null,
      };
    case DataSiConstants.DATASI_FILTERED:
      return {
        ...state,
        filtered: action.payload?.slice() ?? [],
        writtenItem: null,
        insertedItem: null,
      };
    case DataSiConstants.DATASI_UPDATED:
      return {
        ...state,
        writtenItem: action.payload ?? null,
      };
    case DataSiConstants.DATASI_INSERTED:
      return {
        ...state,
        insertedItem: action.payload ?? null,
      };
    case DataSiConstants.TREE_CHANGED:
      return {
        ...state,
        viewName: action.payload ?? initialState.viewName,
      };
    case DataSiConstants.NODE_CHANGED:
      return {
        ...state,
        items: initialState.items,
        writtenItem: null,
        insertedItem: null,
        node: action.payload ?? initialState.node,
      };
    case DataSiConstants.ARCHIVE_FILTER:
      return {
        ...state,
        archiveFilter: action.payload ?? false,
      };
    case DataSiConstants.DATASI_OWNED_TYPE_FILTER:
      return {
        ...state,
        ownedFilter: action.payload ?? null,
      };
    default:
      return state;
  }
}
