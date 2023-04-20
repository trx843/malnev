import { Checkbox } from "antd";
import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  groupEventSettingsBtnDisabled,
  groupMailChecked,
} from "../../../actions/groupeventsettings/creators";
import { IGroupEventSettingsState } from "../../../interfaces";
import { NotificationStatus, StateType } from "../../../types";

interface IGroupMailCheckBoxHeaderProps {
  displayName: string;
  clicked: (checked: boolean) => void;
}

export const GroupMailCheckBoxHeader: FunctionComponent<
  IGroupMailCheckBoxHeaderProps
> = (props: IGroupMailCheckBoxHeaderProps) => {
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
    dispatch(groupMailChecked(notificationStatus));
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
