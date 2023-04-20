import { SqlTree } from '../../classes/SqlTree';
import { UsersEventTypes } from '../../classes/UsersEventTypes';
import { IAction,  } from '../../interfaces';
import { NotificationStatus } from '../../types';
import EventSettingsConstants from './constants';



export function eventSettingsFillTable(itemsTable: Array<UsersEventTypes>): IAction<EventSettingsConstants.EVSETTINGS_FILLTABLE, Array<UsersEventTypes>> {
    return {
        type: EventSettingsConstants.EVSETTINGS_FILLTABLE,
        payload: itemsTable
    };
}


export function eventSettingsBtnDisabled(status: boolean): IAction<EventSettingsConstants.EVSETTINGS_BTN_DISABLED, boolean> {
    return {
        type: EventSettingsConstants.EVSETTINGS_BTN_DISABLED,
        payload: status
    };
}
export function resetToAdminBtnDisabled(status: boolean): IAction<EventSettingsConstants.EVSETTINGS_RESET_BTN_DISABLED, boolean> {
    return {
        type: EventSettingsConstants.EVSETTINGS_RESET_BTN_DISABLED,
        payload: status
    };
}


export function siknTreeFetched(tree: Array<SqlTree>): IAction<EventSettingsConstants.SIKN_TREE_FETCHED, Array<SqlTree>> {
    return {
        type: EventSettingsConstants.SIKN_TREE_FETCHED,
        payload: tree
    };
}

export function siknTreeChecked(treeKeys: Array<string>): IAction<EventSettingsConstants.SIKN_TREE_CHECKED, Array<string>> {
    return {
        type: EventSettingsConstants.SIKN_TREE_CHECKED,
        payload: treeKeys
    };
}

export function mailChecked(status: NotificationStatus): IAction<EventSettingsConstants.MAIL_CHECKED, NotificationStatus> {
    return {
        type: EventSettingsConstants.MAIL_CHECKED,
        payload: status
    };
}


export function webChecked(status: NotificationStatus): IAction<EventSettingsConstants.WEB_CHECKED, NotificationStatus> {
    return {
        type: EventSettingsConstants.WEB_CHECKED,
        payload: status
    };
}

export function resetToAdmin(reset: boolean): IAction<EventSettingsConstants.RESET_TO_ADMIN, boolean> {
    return {
        type: EventSettingsConstants.RESET_TO_ADMIN,
        payload: reset
    };
}

export function resetInitialValues(): IAction<EventSettingsConstants.RESET_EVENTSETTINGS_INITIAL_VALUES> {
    return {
        type: EventSettingsConstants.RESET_EVENTSETTINGS_INITIAL_VALUES,
    };
}