import { Checkbox } from 'antd';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ctrlgroupEventSettingsBtnDisabled, ctrlgroupWebChecked } from '../../../actions/ctrlgroupeventsettings/creators';
import { GroupsEventTypes } from '../../../classes/GroupsEventTypes';
import {  CtrlGroupEventSettingsState } from '../../../interfaces';
import { NotificationStatus, StateType } from '../../../types';

interface IGroupWebCheckBoxCellProps {
    data: GroupsEventTypes;
}



export const CtrlGroupWebCheckBoxCell: FunctionComponent<IGroupWebCheckBoxCellProps> = (props: IGroupWebCheckBoxCellProps) => {

    const eventSettingsState = useSelector<StateType, CtrlGroupEventSettingsState>(state => state.ctrlgroupEventSettings);



    const dispatch = useDispatch();
    const [value, setValue] = useState<boolean>(props.data.webNotificationFlag);


    const onClick = () => {
        dispatch(ctrlgroupEventSettingsBtnDisabled(false))
        setValue(!props.data.webNotificationFlag);
        props.data.webNotificationFlag = !props.data.webNotificationFlag;

        const tableItems: Array<GroupsEventTypes> = eventSettingsState.tableItems;
        const trueItems: Array<GroupsEventTypes> = tableItems.filter((item: GroupsEventTypes) => item.webNotificationFlag === true);
        const falseItems: Array<GroupsEventTypes> = tableItems.filter((item: GroupsEventTypes) => item.webNotificationFlag === false);

        let notificationStatus: NotificationStatus = { checked: falseItems.length === 0 , indeterminate: trueItems.length > 0 && falseItems.length > 0 }
        dispatch(ctrlgroupWebChecked(notificationStatus))

    }


    const firstUpdate = useRef(true);
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        if (!eventSettingsState.webChecked.indeterminate) {
            setValue(eventSettingsState.webChecked.checked);
            props.data.webNotificationFlag = eventSettingsState.webChecked.checked;
        }
    }, [eventSettingsState.webChecked.checked]);

    return (
        <Checkbox
            onClick={onClick}
            checked={value}
        />
    )

}

