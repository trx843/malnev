import {
  groupEventSettingsBtnDisabled,
  groupWebChecked,
} from "actions/groupeventsettings/creators";
import { Checkbox } from "antd";
import { IGroupEventSettingsState } from "interfaces";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NotificationStatus, StateType } from "types";

interface IGroupWebCheckBoxHeaderProps {
  displayName: string;
  clicked: (checked: boolean) => void;
}

export const GroupWebCheckBoxHeader: FunctionComponent<
  IGroupWebCheckBoxHeaderProps
> = (props: IGroupWebCheckBoxHeaderProps) => {
  const eventSettingsState = useSelector<StateType, IGroupEventSettingsState>(
    (state) => state.groupEventSettings
  );

  const dispatch = useDispatch();
  const onCheckAllChange = (e: any) => {
    dispatch(groupEventSettingsBtnDisabled(false));
    let notificationStatus: NotificationStatus = {
      checked: e.target.checked,
      indeterminate: false,
    };
    dispatch(groupWebChecked(notificationStatus));
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
