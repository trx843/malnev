import { IEditorSiMapState } from "../interfaces";
import * as actions from "../actions/editorSiMap/creators";
import { ActionTypes } from "../types";
import EditorSiMapConstants from "../actions/editorSiMap/constants";
import { techPosTreeConstant, zeroGuid } from "../utils";

const initialState: IEditorSiMapState = {
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
  insertedItem: null,
  viewName: techPosTreeConstant,
  node: null,
  archiveFilter: false,
  ownedFilter: null,
};

export function editorSiMapReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): IEditorSiMapState {
  switch (action.type) {
    case EditorSiMapConstants.EDITORSIMAP_FETCHED:
      return {
        ...state,
        items: action.payload ?? initialState.items,
        writtenItem: null,
        insertedItem: null,
      };
    case EditorSiMapConstants.EDITORSIMAP_FILTERED:
      return {
        ...state,
        filteredItems: action.payload?.slice() ?? [],
        writtenItem: null,
        insertedItem: null,
      };
    case EditorSiMapConstants.EDITORSIMAP_UPDATED:
      return {
        ...state,
        writtenItem: action.payload ?? null,
      };
    case EditorSiMapConstants.EDITORSIMAP_INSERTED:
      return {
        ...state,
        insertedItem: action.payload ?? null,
      };
    case EditorSiMapConstants.TREE_CHANGED:
      return {
        ...state,
        viewName: action.payload ?? initialState.viewName,
      };
    case EditorSiMapConstants.NODE_CHANGED:
      return {
        ...state,
        items: initialState.items,
        writtenItem: null,
        insertedItem: null,
        node: action.payload ?? initialState.node,
      };
    case EditorSiMapConstants.ARCHIVE_FILTER:
      return {
        ...state,
        archiveFilter: action.payload ?? false,
      };
    case EditorSiMapConstants.EDITORSIMAP_OWNED_TYPE_FILTER:
      return {
        ...state,
        ownedFilter: action.payload ?? null,
      };
    default:
      return state;
  }
}
