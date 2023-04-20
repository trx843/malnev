import { IImportExcelState } from "../interfaces";
import * as actions from "../actions/importExcel/creators";
import ImportExcelConstants from "../actions/importExcel/constants";
import { ActionTypes } from "../types";

const date = new Date();

const initialState: IImportExcelState = {
  items: {
    entities: [],
    pageInfo: {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    },
  },
  filterDates: {
    startDate: new Date(date.getFullYear(), date.getMonth(), 1),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ),
  },
};

export function importExcelReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): IImportExcelState {
  switch (action.type) {
    case ImportExcelConstants.IMPORT_FETCHED:
      return {
        ...state,
        items: action.payload ?? initialState.items,
      };
    case ImportExcelConstants.DATE_CHANGED:
      return {
        ...state,
        filterDates: action.payload ?? initialState.filterDates,
      };
    default:
      return state;
  }
}
