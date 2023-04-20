import { ISiEquipmentState } from "../interfaces";
import * as actions from "../actions/editorSiEquipment/creators";
import { ActionTypes } from "../types";
import EditorSiEqConstants from "../actions/editorSiEquipment/constants";
import { techPosTreeConstant, zeroGuid } from "../utils";

const initialState: ISiEquipmentState = {
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
  ownedFilter: null,
  archiveFilter: false,
};

export function editorSiEqReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): ISiEquipmentState {
  switch (action.type) {
    case EditorSiEqConstants.EDITORSIEQ_FETCHED:
      return {
        ...state,
        items: action.payload ?? initialState.items,
        writtenItem: null,
        insertedItem: null,
      };
    case EditorSiEqConstants.EDITORSIEQ_FILTERED:
      return {
        ...state,
        filtered: action.payload?.slice() ?? [],
        writtenItem: null,
        insertedItem: null,
      };
    case EditorSiEqConstants.EDITORSIEQ_UPDATED:
      return {
        ...state,
        writtenItem: action.payload ?? null,
      };
    case EditorSiEqConstants.EDITORSIEQ_INSERTED:
      return {
        ...state,
        insertedItem: action.payload ?? null,
      };
    case EditorSiEqConstants.TREE_CHANGED:
      return {
        ...state,
        viewName: action.payload ?? initialState.viewName,
      };
    case EditorSiEqConstants.NODE_CHANGED:
      return {
        ...state,
        items: initialState.items,
        writtenItem: null,
        insertedItem: null,
        node: action.payload ?? initialState.node,
      };
    case EditorSiEqConstants.EDITORSIEQ_OWNED_TYPE_FILTER:
      return {
        ...state,
        ownedFilter: action.payload ?? null,
      };
    case EditorSiEqConstants.EDITORSIEQ_ARCHIVE_FILTER:
      return {
        ...state,
        archiveFilter: action.payload ?? false,
      };
    default:
      return state;
  }
}
