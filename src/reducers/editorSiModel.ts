import { IEditorSiModelState } from "../interfaces";
import * as actions from "../actions/editorSiModel/creators";
import { ActionTypes } from "../types";
import EditorSiModelConstants from "../actions/editorSiModel/constants";

const initialState: IEditorSiModelState = {
  items: {
      entities: [],
      pageInfo: {
        pageNumber: 1,
        pageSize: 1,
        totalItems: 1,
        totalPages: 1
      }
  },
  filtered: [],
  writtenItem: null,
  insertedItem: null,
  archiveFilter: false
};

export function editorSiModelReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): IEditorSiModelState {
  switch (action.type) {
    case EditorSiModelConstants.EDITORSIMODEL_FETCHED:
      return {
        ...state,
        items: action.payload ?? initialState.items,
        writtenItem: null,
        insertedItem: null,
      };
    case EditorSiModelConstants.EDITORSIMODEL_FILTERED:
      return {
        ...state,
        filtered: action.payload?.slice() ?? [],
        writtenItem: null,
        insertedItem: null,
      };
    case EditorSiModelConstants.EDITORSIMODEL_UPDATED:
      return {
        ...state,
        writtenItem: action.payload ?? null,
      };
    case EditorSiModelConstants.EDITORSIMODEL_INSERTED:
      return {
        ...state,
        insertedItem: action.payload ?? null,
      };
      case EditorSiModelConstants.EDITORSIMODEL_ARCHIVE_FILTER:
        return {
          ...state,
          archiveFilter: action.payload ?? false,
        };
    default:
      return state;
  }
}