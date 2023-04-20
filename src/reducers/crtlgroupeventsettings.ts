import { CtrlGroupEventSettingsState } from "../interfaces";
import * as actions from "../actions/ctrlgroupeventsettings/creators";
import { ActionTypes } from "../types";
import GroupEventSettingsConstants from "../actions/ctrlgroupeventsettings/constants";

const initialState: CtrlGroupEventSettingsState = {
  tableItems: [],
  saveBtnDisabled: true,
  siknTree: [],
  treeKeys: [],
  mailChecked: { checked: false, indeterminate: false },
  webChecked: { checked: false, indeterminate: false },
  currentGroup: "",
};

export function ctrlgroupEventSettingsReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): CtrlGroupEventSettingsState {
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
    case GroupEventSettingsConstants.CTRL_RESET_GROUP_EVENTSETTINGS_INITIAL_VALUES:
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
