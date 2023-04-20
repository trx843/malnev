import { Checkbox } from "antd";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ctrlgroupEventSettingsBtnDisabled,
  ctrlgroupMailChecked,
} from "../../../actions/ctrlgroupeventsettings/creators";
import { CtrlGroupEventSettingsState } from "../../../interfaces";
import { NotificationStatus, StateType } from "../../../types";

interface IGroupMailCheckBoxHeaderProps {
  displayName: string;
}

export const CtrlGroupMailCheckBoxHeader: FunctionComponent<
  IGroupMailCheckBoxHeaderProps
> = (props: IGroupMailCheckBoxHeaderProps) => {
  const eventSettingsState = useSelector<
    StateType,
    CtrlGroupEventSettingsState
  >((state) => state.ctrlgroupEventSettings);

  const dispatch = useDispatch();

  const onCheckAllChange = (e: any) => {
    dispatch(ctrlgroupEventSettingsBtnDisabled(false));
    let notificationStatus: NotificationStatus = {
      checked: e.target.checked,
      indeterminate: false,
    };
    dispatch(ctrlgroupMailChecked(notificationStatus));
  };

  return (
    <Checkbox
      indeterminate={eventSettingsState.mailChecked.indeterminate}
      onChange={onCheckAllChange}
      checked={eventSettingsState.mailChecked.checked}
      disabled={eventSettingsState.tableItems.length === 0}
    >
      {props.displayName}
    </Checkbox>
  );
};
