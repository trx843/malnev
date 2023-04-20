import { Checkbox } from 'antd';
import  { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ctrlgroupEventSettingsBtnDisabled, ctrlgroupMailChecked } from '../../../actions/ctrlgroupeventsettings/creators';
import { GroupsEventTypes } from '../../../classes/GroupsEventTypes';
import { CtrlGroupEventSettingsState } from '../../../interfaces';
import { NotificationStatus, StateType } from '../../../types';

interface IGroupMailCheckBoxCellProps {
    data: GroupsEventTypes;
}



export const CtrlGroupMailCheckBoxCell: FunctionComponent<IGroupMailCheckBoxCellProps> = (props: IGroupMailCheckBoxCellProps) => {

    const eventSettingsState = useSelector<StateType, CtrlGroupEventSettingsState>(state => state.ctrlgroupEventSettings);

    const dispatch = useDispatch();
    const [value, setValue] = useState<boolean>(props.data.mailNotificationFlag);


    const onClick = () => {
        dispatch(ctrlgroupEventSettingsBtnDisabled(false))
        setValue(!props.data.mailNotificationFlag);
        props.data.mailNotificationFlag = !props.data.mailNotificationFlag;

        const tableItems: Array<GroupsEventTypes> = eventSettingsState.tableItems;
        const trueItems: Array<GroupsEventTypes> = tableItems.filter((item: GroupsEventTypes) => item.mailNotificationFlag === true);
        const falseItems: Array<GroupsEventTypes> = tableItems.filter((item: GroupsEventTypes) => item.mailNotificationFlag === false);

        let notificationStatus: NotificationStatus = { checked: falseItems.length === 0, indeterminate: trueItems.length > 0 && falseItems.length > 0 }
        dispatch(ctrlgroupMailChecked(notificationStatus))

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



