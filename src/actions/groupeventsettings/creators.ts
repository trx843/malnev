import { SqlTree } from '../../classes/SqlTree';
import { GroupsEventTypes } from '../../classes/GroupsEventTypes';
import { IAction,  } from '../../interfaces';
import { NotificationStatus } from '../../types';
import GroupEventSettingsConstants from './constants';



export function groupEventSettingsFillTable(itemsTable: Array<GroupsEventTypes>): IAction<GroupEventSettingsConstants.GROUP_EVSETTINGS_FILLTABLE, Array<GroupsEventTypes>> {
    return {
        type: GroupEventSettingsConstants.GROUP_EVSETTINGS_FILLTABLE,
        payload: itemsTable
    };
}


export function groupEventSettingsBtnDisabled(status: boolean): IAction<GroupEventSettingsConstants.GROUP_EVSETTINGS_BTN_DISABLED, boolean> {
    return {
        type: GroupEventSettingsConstants.GROUP_EVSETTINGS_BTN_DISABLED,
        payload: status
    };
}


export function groupSiknTreeFetched(tree: Array<SqlTree>): IAction<GroupEventSettingsConstants.GROUP_SIKN_TREE_FETCHED, Array<SqlTree>> {
    return {
        type: GroupEventSettingsConstants.GROUP_SIKN_TREE_FETCHED,
        payload: tree
    };
}

export function groupSiknTreeChecked(treeKeys: Array<string>): IAction<GroupEventSettingsConstants.GROUP_SIKN_TREE_CHECKED, Array<string>> {
    return {
        type: GroupEventSettingsConstants.GROUP_SIKN_TREE_CHECKED,
        payload: treeKeys
    };
}

export function groupMailChecked(status: NotificationStatus): IAction<GroupEventSettingsConstants.GROUP_MAIL_CHECKED, NotificationStatus> {
    return {
        type: GroupEventSettingsConstants.GROUP_MAIL_CHECKED,
        payload: status
    };
}


export function groupWebChecked(status: NotificationStatus): IAction<GroupEventSettingsConstants.GROUP_WEB_CHECKED, NotificationStatus> {
    return {
        type: GroupEventSettingsConstants.GROUP_WEB_CHECKED,
        payload: status
    };
}

export function changeCurrentGroup(id: string): IAction<GroupEventSettingsConstants.CURRENT_GROUP, string> {
    return {
        type: GroupEventSettingsConstants.CURRENT_GROUP,
        payload: id
    };
}

export function resetGroupInitialValues(): IAction<GroupEventSettingsConstants.RESET_GROUP_EVENTSETTINGS_INITIAL_VALUES> {
    return {
        type: GroupEventSettingsConstants.RESET_GROUP_EVENTSETTINGS_INITIAL_VALUES,
    };
}