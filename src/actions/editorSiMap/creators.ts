import { EditorSiMapItem } from "../../classes";
import {
  FilterDates,
  IAction,
  IWrittenItem,
  SelectedNode,
} from "../../interfaces";
import { OwnedType } from "../../types";
import { PagedModel } from "../../types";
import EditorSiMapConstants from "./constants";

export function editorSiMapFetched(
  items: PagedModel<EditorSiMapItem>
): IAction<
  EditorSiMapConstants.EDITORSIMAP_FETCHED,
  PagedModel<EditorSiMapItem>
> {
  return {
    type: EditorSiMapConstants.EDITORSIMAP_FETCHED,
    payload: items,
  };
}

export function editorSiMapFiltered(
  items: Array<EditorSiMapItem>
): IAction<EditorSiMapConstants.EDITORSIMAP_FILTERED, Array<EditorSiMapItem>> {
  return {
    type: EditorSiMapConstants.EDITORSIMAP_FILTERED,
    payload: items,
  };
}

export function editorSiMapUpdated(
  item: IWrittenItem<EditorSiMapItem> | null
): IAction<
  EditorSiMapConstants.EDITORSIMAP_UPDATED,
  IWrittenItem<EditorSiMapItem> | null
> {
  return {
    type: EditorSiMapConstants.EDITORSIMAP_UPDATED,
    payload: item,
  };
}

export function editorSiMapInserted(
  item: EditorSiMapItem | null
): IAction<EditorSiMapConstants.EDITORSIMAP_INSERTED, EditorSiMapItem | null> {
  return {
    type: EditorSiMapConstants.EDITORSIMAP_INSERTED,
    payload: item,
  };
}

export function treeChanged(
  viewName: string
): IAction<EditorSiMapConstants.TREE_CHANGED, string> {
  return {
    type: EditorSiMapConstants.TREE_CHANGED,
    payload: viewName,
  };
}

export function siBindingNodeChanged(
  node: SelectedNode | undefined
): IAction<EditorSiMapConstants.NODE_CHANGED, SelectedNode | undefined> {
  return {
    type: EditorSiMapConstants.NODE_CHANGED,
    payload: node,
  };
}

export function siBindingArchiveFiltered(
  filter: boolean
): IAction<EditorSiMapConstants.ARCHIVE_FILTER, boolean> {
  return {
    type: EditorSiMapConstants.ARCHIVE_FILTER,
    payload: filter,
  };
}

export function siBindingOwnedFilter(
  type: OwnedType
): IAction<EditorSiMapConstants.EDITORSIMAP_OWNED_TYPE_FILTER, OwnedType> {
  return {
    type: EditorSiMapConstants.EDITORSIMAP_OWNED_TYPE_FILTER,
    payload: type,
  };
}
