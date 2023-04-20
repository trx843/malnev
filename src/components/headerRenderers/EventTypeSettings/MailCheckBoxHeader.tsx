import { Checkbox } from "antd";
import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { eventSettingsBtnDisabled } from "../../../actions/eventsettings/creators";
import { mailChecked } from "../../../actions/eventsettings/creators";
import { IEventSettingsState } from "../../../interfaces";
import { NotificationStatus, StateType } from "../../../types";

interface IMailCheckBoxHeaderProps {
  displayName: string;
  clicked: (checked: boolean) => void;
}

export const MailCheckBoxHeader: FunctionComponent<IMailCheckBoxHeaderProps> = (
  props: IMailCheckBoxHeaderProps
) => {
  const eventSettingsState = useSelector<StateType, IEventSettingsState>(
    (state) => state.eventSettings
  );

  const dispatch = useDispatch();

  const onCheckAllChange = (e: any) => {
    dispatch(eventSettingsBtnDisabled(false));
    let notificationStatus: NotificationStatus = {
      checked: e.target.checked,
      indeterminate: false,
    };
    dispatch(mailChecked(notificationStatus));
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
