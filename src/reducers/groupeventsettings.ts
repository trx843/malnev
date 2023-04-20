import { IGroupEventSettingsState } from "../interfaces";
import * as actions from "../actions/groupeventsettings/creators";
import { ActionTypes } from "../types";
import GroupEventSettingsConstants from "../actions/groupeventsettings/constants";

const initialState: IGroupEventSettingsState = {
  tableItems: [],
  saveBtnDisabled: true,
  siknTree: [],
  treeKeys: [],
  mailChecked: { checked: false, indeterminate: false },
  webChecked: { checked: false, indeterminate: false },
  currentGroup: "",
};

export function groupEventSettingsReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): IGroupEventSettingsState {
  switch (action.type) {
    case GroupEventSettingsConstants.GROUP_EVSETTINGS_FILLTABLE:
      return {
        ...state,
        tableItems: action.payload?.slice() ?? [],
      };
    case GroupEventSettingsConstants.GROUP_EVSETTINGS_BTN_DISABLED:
      return {
        ...state,
        saveBtnDisabled: action.payload ?? true,
      };
    case GroupEventSettingsConstants.GROUP_SIKN_TREE_FETCHED:
      return {
        ...state,
        siknTree: action.payload?.slice() ?? [],
      };
    case GroupEventSettingsConstants.GROUP_SIKN_TREE_CHECKED:
      return {
        ...state,
        treeKeys: action.payload?.slice() ?? [],
      };
    case GroupEventSettingsConstants.GROUP_MAIL_CHECKED:
      return {
        ...state,
        mailChecked: action.payload ?? { checked: false, indeterminate: false },
      };
    case GroupEventSettingsConstants.GROUP_WEB_CHECKED:
      return {
        ...state,
        webChecked: action.payload ?? { checked: false, indeterminate: false },
      };
    case GroupEventSettingsConstants.CURRENT_GROUP:
      return {
        ...state,
        currentGroup: action.payload ?? "",
      };
    case GroupEventSettingsConstants.RESET_GROUP_EVENTSETTINGS_INITIAL_VALUES:
      return {
        ...state,
        tableItems: [],
        saveBtnDisabled: true,
        siknTree: [],
        treeKeys: [],
        mailChecked: { checked: false, indeterminate: false },
        webChecked: { checked: false, indeterminate: false },
        currentGroup: "",
      };
    default:
      return state;
  }
}
