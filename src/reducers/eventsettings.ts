import { IEventSettingsState } from "../interfaces";
import * as actions from "../actions/eventsettings/creators";
import { ActionTypes } from "../types";
import EventSettingsConstants from "../actions/eventsettings/constants";
import { UsersEventTypes } from "../classes/UsersEventTypes";

const initialState: IEventSettingsState = {
  tableItems: [],
  saveBtnDisabled: true,
  resetToAdminBtnStatus: true,
  siknTree: [],
  treeKeys: [],
  mailChecked: { checked: false, indeterminate: false },
  webChecked: { checked: false, indeterminate: false },
  resetToAdmin: false,
};

export function eventSettingsReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): IEventSettingsState {
  switch (action.type) {
    case EventSettingsConstants.EVSETTINGS_FILLTABLE:
      return {
        ...state,
        tableItems: action.payload?.slice() ?? [],
      };
    case EventSettingsConstants.EVSETTINGS_BTN_DISABLED:
      return {
        ...state,
        saveBtnDisabled: action.payload ?? true,
      };
    case EventSettingsConstants.EVSETTINGS_RESET_BTN_DISABLED:
      return {
        ...state,
        resetToAdminBtnStatus: action.payload ?? true,
      };
    case EventSettingsConstants.SIKN_TREE_FETCHED:
      return {
        ...state,
        siknTree: action.payload?.slice() ?? [],
      };
    case EventSettingsConstants.SIKN_TREE_CHECKED:
      return {
        ...state,
        treeKeys: action.payload?.slice() ?? [],
      };
    case EventSettingsConstants.MAIL_CHECKED:
      return {
        ...state,
        mailChecked: action.payload ?? { checked: false, indeterminate: false },
      };
    case EventSettingsConstants.WEB_CHECKED:
      return {
        ...state,
        webChecked: action.payload ?? { checked: false, indeterminate: false },
      };
    case EventSettingsConstants.RESET_TO_ADMIN:
      return {
        ...state,
        resetToAdmin: action.payload ?? false,
      };
    case EventSettingsConstants.RESET_EVENTSETTINGS_INITIAL_VALUES:
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
