import { SqlTree } from '../../classes/SqlTree';
import { UsersEventTypes } from '../../classes/UsersEventTypes';
import { IAction,  } from '../../interfaces';
import { NotificationStatus } from '../../types';
import CtrlEventSettingsConstants from './constants';



export function ctrleventSettingsFillTable(itemsTable: Array<UsersEventTypes>): IAction<CtrlEventSettingsConstants.EVSETTINGS_FILLTABLE, Array<UsersEventTypes>> {
    return {
        type: CtrlEventSettingsConstants.EVSETTINGS_FILLTABLE,
        payload: itemsTable
    };
}


export function ctrleventSettingsBtnDisabled(status: boolean): IAction<CtrlEventSettingsConstants.EVSETTINGS_BTN_DISABLED, boolean> {
    return {
        type: CtrlEventSettingsConstants.EVSETTINGS_BTN_DISABLED,
        payload: status
    };
}
export function ctrlresetToAdminBtnDisabled(status: boolean): IAction<CtrlEventSettingsConstants.EVSETTINGS_RESET_BTN_DISABLED, boolean> {
    return {
        type: CtrlEventSettingsConstants.EVSETTINGS_RESET_BTN_DISABLED,
        payload: status
    };
}


export function ctrlmailChecked(status: NotificationStatus): IAction<CtrlEventSettingsConstants.MAIL_CHECKED, NotificationStatus> {
    return {
        type: CtrlEventSettingsConstants.MAIL_CHECKED,
        payload: status
    };
}


export function ctrlwebChecked(status: NotificationStatus): IAction<CtrlEventSettingsConstants.WEB_CHECKED, NotificationStatus> {
    return {
        type: CtrlEventSettingsConstants.WEB_CHECKED,
        payload: status
    };
}

export function ctrlresetToAdmin(reset: boolean): IAction<CtrlEventSettingsConstants.RESET_TO_ADMIN, boolean> {
    return {
        type: CtrlEventSettingsConstants.RESET_TO_ADMIN,
        payload: reset
    };
}

export function ctrlresetInitialValues(): IAction<CtrlEventSettingsConstants.CTRL_RESET_EVENTSETTINGS_INITIAL_VALUES> {
    return {
        type: CtrlEventSettingsConstants.CTRL_RESET_EVENTSETTINGS_INITIAL_VALUES,
    };
}