import {
  eventSettingsBtnDisabled,
  webChecked,
} from "actions/eventsettings/creators";
import { Checkbox } from "antd";
import { IEventSettingsState } from "interfaces";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NotificationStatus, StateType } from "types";

interface IWebCheckBoxHeaderProps {
  displayName: string;
  clicked: (checked: boolean) => void;
}

export const WebCheckBoxHeader: FunctionComponent<IWebCheckBoxHeaderProps> = (
  props: IWebCheckBoxHeaderProps
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
    dispatch(webChecked(notificationStatus));
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
