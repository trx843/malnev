import {
  ctrlgroupEventSettingsBtnDisabled,
  ctrlgroupWebChecked,
} from "actions/ctrlgroupeventsettings/creators";
import { Checkbox } from "antd";
import { CtrlGroupEventSettingsState } from "interfaces";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NotificationStatus, StateType } from "types";

interface IGroupWebCheckBoxHeaderProps {
  displayName: string;
}

export const CtrlGroupWebCheckBoxHeader: FunctionComponent<
  IGroupWebCheckBoxHeaderProps
> = (props: IGroupWebCheckBoxHeaderProps) => {
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
    dispatch(ctrlgroupWebChecked(notificationStatus));
  };

  return (
    <Checkbox
      indeterminate={eventSettingsState.webChecked.indeterminate}
      onChange={onCheckAllChange}
      checked={eventSettingsState.webChecked.checked}
      disabled={eventSettingsState.tableItems.length === 0}
    >
      {props.displayName}
    </Checkbox>
  );
};
