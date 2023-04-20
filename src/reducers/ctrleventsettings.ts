import * as actions from "../actions/ctrleventsettings/creators";
import { ActionTypes } from "../types";
import CtrlEventSettingsConstants from "../actions/ctrleventsettings/constants";
import { CtrlEventSettingsState } from "interfaces";

const initialState: CtrlEventSettingsState = {
  tableItems: [],
  saveBtnDisabled: true,
  resetToAdminBtnStatus: true,
  siknTree: [],
  treeKeys: [],
  mailChecked: { checked: false, indeterminate: false },
  webChecked: { checked: false, indeterminate: false },
  resetToAdmin: false,
};

export function ctrleventSettingsReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): CtrlEventSettingsState {
  switch (action.type) {
    case CtrlEventSettingsConstants.EVSETTINGS_FILLTABLE:
      return {
        ...state,
        tableItems: action.payload?.slice() ?? [],
      };
    case CtrlEventSettingsConstants.EVSETTINGS_BTN_DISABLED:
      return {
        ...state,
        saveBtnDisabled: action.payload ?? true,
      };
    case CtrlEventSettingsConstants.EVSETTINGS_RESET_BTN_DISABLED:
      return {
        ...state,
        resetToAdminBtnStatus: action.payload ?? true,
      };
    case CtrlEventSettingsConstants.MAIL_CHECKED:
      return {
        ...state,
        mailChecked: action.payload ?? { checked: false, indeterminate: false },
      };
    case CtrlEventSettingsConstants.WEB_CHECKED:
      return {
        ...state,
        webChecked: action.payload ?? { checked: false, indeterminate: false },
      };
    case CtrlEventSettingsConstants.RESET_TO_ADMIN:
      return {
        ...state,
        resetToAdmin: action.payload ?? false,
      };
    case CtrlEventSettingsConstants.CTRL_RESET_EVENTSETTINGS_INITIAL_VALUES:
      return {
        ...state,
        tableItems: [],
        saveBtnDisabled: true,
        resetToAdminBtnStatus: true,
        siknTree: [],
        treeKeys: [],
        mailChecked: { checked: false, indeterminate: false },
        webChecked: { checked: false, indeterminate: false },
        resetToAdmin: false,
      };
    default:
      return state;
  }
}
