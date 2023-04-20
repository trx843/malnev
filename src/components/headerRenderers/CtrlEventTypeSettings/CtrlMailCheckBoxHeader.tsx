import { Checkbox } from "antd";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ctrleventSettingsBtnDisabled } from "../../../actions/ctrleventsettings/creators";
import { ctrlmailChecked } from "../../../actions/ctrleventsettings/creators";
import { CtrlEventSettingsState } from "../../../interfaces";
import { NotificationStatus, StateType } from "../../../types";

interface IMailCheckBoxHeaderProps {
  displayName: string;
  clicked: (checked: boolean) => void;
}

export const CtrlMailCheckBoxHeader: FunctionComponent<
  IMailCheckBoxHeaderProps
> = (props: IMailCheckBoxHeaderProps) => {
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
    dispatch(ctrlmailChecked(notificationStatus));
    props.clicked(e.target.checked);
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
