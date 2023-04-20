import { SqlTree } from '../../classes/SqlTree';
import { GroupsEventTypes } from '../../classes/GroupsEventTypes';
import { IAction,  } from '../../interfaces';
import { NotificationStatus } from '../../types';
import GroupEventSettingsConstants from './constants';



export function ctrlgroupEventSettingsFillTable(itemsTable: Array<GroupsEventTypes>): IAction<GroupEventSettingsConstants.GROUP_EVSETTINGS_FILLTABLE, Array<GroupsEventTypes>> {
    return {
        type: GroupEventSettingsConstants.GROUP_EVSETTINGS_FILLTABLE,
        payload: itemsTable
    };
}


export function ctrlgroupEventSettingsBtnDisabled(status: boolean): IAction<GroupEventSettingsConstants.GROUP_EVSETTINGS_BTN_DISABLED, boolean> {
    return {
        type: GroupEventSettingsConstants.GROUP_EVSETTINGS_BTN_DISABLED,
        payload: status
    };
}



export function ctrlgroupMailChecked(status: NotificationStatus): IAction<GroupEventSettingsConstants.GROUP_MAIL_CHECKED, NotificationStatus> {
    return {
        type: GroupEventSettingsConstants.GROUP_MAIL_CHECKED,
        payload: status
    };
}


export function ctrlgroupWebChecked(status: NotificationStatus): IAction<GroupEventSettingsConstants.GROUP_WEB_CHECKED, NotificationStatus> {
    return {
        type: GroupEventSettingsConstants.GROUP_WEB_CHECKED,
        payload: status
    };
}

export function ctrlchangeCurrentGroup(id: string): IAction<GroupEventSettingsConstants.CURRENT_GROUP, string> {
    return {
        type: GroupEventSettingsConstants.CURRENT_GROUP,
        payload: id
    };
}


export function ctrlresetGroupInitialValues(): IAction<GroupEventSettingsConstants.CTRL_RESET_GROUP_EVENTSETTINGS_INITIAL_VALUES> {
    return {
        type: GroupEventSettingsConstants.CTRL_RESET_GROUP_EVENTSETTINGS_INITIAL_VALUES,
    };
}