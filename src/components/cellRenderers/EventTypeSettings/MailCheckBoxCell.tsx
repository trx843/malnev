import { Checkbox } from 'antd';
import React, { FunctionComponent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { eventSettingsBtnDisabled } from '../../../actions/eventsettings/creators';
import { mailChecked } from '../../../actions/eventsettings/creators';
import { UsersEventTypes } from '../../../classes/UsersEventTypes';
import {  IEventSettingsState } from '../../../interfaces';
import { NotificationStatus, StateType } from '../../../types';

interface IMailCheckBoxCellProps {
    data: UsersEventTypes;
}



export const MailCheckBoxCell: FunctionComponent<IMailCheckBoxCellProps> = (props: IMailCheckBoxCellProps) => {

    const eventSettingsState = useSelector<StateType, IEventSettingsState>(state => state.eventSettings);

    const dispatch = useDispatch();
    const [value, setValue] = useState<boolean>(props.data.mailNotificationFlag);


    const onClick = () => {
        dispatch(eventSettingsBtnDisabled(false))
        setValue(!props.data.mailNotificationFlag);
        props.data.mailNotificationFlag = !props.data.mailNotificationFlag;

        const tableItems: Array<UsersEventTypes> = eventSettingsState.tableItems;
        const trueItems: Array<UsersEventTypes> = tableItems.filter((item: UsersEventTypes) => item.mailNotificationFlag === true);
        const falseItems: Array<UsersEventTypes> = tableItems.filter((item: UsersEventTypes) => item.mailNotificationFlag === false);

        let notificationStatus: NotificationStatus = { checked: falseItems.length === 0, indeterminate: trueItems.length > 0 && falseItems.length > 0 }
        dispatch(mailChecked(notificationStatus))

    }


    const firstUpdate = useRef(true);
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        if (!eventSettingsState.mailChecked.indeterminate) {
            setValue(eventSettingsState.mailChecked.checked);
            props.data.mailNotificationFlag = eventSettingsState.mailChecked.checked;
        }
    }, [eventSettingsState.mailChecked.checked]);

    return (
        <Checkbox
            onClick={onClick}
            checked={value}
        />
    )

}

