import {
  ctrleventSettingsBtnDisabled,
  ctrlwebChecked,
} from "actions/ctrleventsettings/creators";
import { Checkbox } from "antd";
import { CtrlEventSettingsState } from "interfaces";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NotificationStatus, StateType } from "types";

interface IWebCheckBoxHeaderProps {
  displayName: string;
  clicked: (checked: boolean) => void;
}

export const CtrlWebCheckBoxHeader: FunctionComponent<
  IWebCheckBoxHeaderProps
> = (props: IWebCheckBoxHeaderProps) => {
  const eventSettingsState = useSelector<StateType, CtrlEventSettingsState>(
    (state) => state.ctrleventSettings
  );

  const dispatch = useDispatch();

  const onCheckAllChange = (e: any) => {
    dispatch(ctrleventSettingsBtnDisabled(false));
    let notificationStatus: NotificationStatus = {
      checked: e.target.checked,
      indeterminate: false,
    };
    dispatch(ctrlwebChecked(notificationStatus));
    props.clicked(e.target.checked);
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
