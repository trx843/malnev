import { Checkbox } from 'antd';
import  { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ctrleventSettingsBtnDisabled } from '../../../actions/ctrleventsettings/creators';
import { ctrlwebChecked } from '../../../actions/ctrleventsettings/creators';
import { UsersEventTypes } from '../../../classes/UsersEventTypes';
import { CtrlEventSettingsState } from '../../../interfaces';
import { NotificationStatus, StateType } from '../../../types';

interface IWebCheckBoxCellProps {
    data: UsersEventTypes;
}



export const CtrlWebCheckBoxCell: FunctionComponent<IWebCheckBoxCellProps> = (props: IWebCheckBoxCellProps) => {

    const eventSettingsState = useSelector<StateType, CtrlEventSettingsState>(state => state.ctrleventSettings);


    const dispatch = useDispatch();
    const [value, setValue] = useState<boolean>(props.data.webNotificationFlag);


    const onClick = () => {
        dispatch(ctrleventSettingsBtnDisabled(false))
        setValue(!props.data.webNotificationFlag);
        props.data.webNotificationFlag = !props.data.webNotificationFlag;

        const tableItems: Array<UsersEventTypes> = eventSettingsState.tableItems;
        const trueItems: Array<UsersEventTypes> = tableItems.filter((item: UsersEventTypes) => item.webNotificationFlag === true);
        const falseItems: Array<UsersEventTypes> = tableItems.filter((item: UsersEventTypes) => item.webNotificationFlag === false);

        let notificationStatus: NotificationStatus = { checked: falseItems.length === 0 , indeterminate: trueItems.length > 0 && falseItems.length > 0 }
        dispatch(ctrlwebChecked(notificationStatus))

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

