import {
  groupEventSettingsBtnDisabled,
  groupSiknTreeChecked,
} from "actions/groupeventsettings/creators";
import { Modal, Space, TreeSelect } from "antd";
import { IGroupEventSettingsState } from "interfaces";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "types";

interface IGroupTreeSelectHeaderProps {
  displayName: string;
  clicked: (siknList: Array<string>) => void;
}

export const GroupTreeSelectHeader: FunctionComponent<
  IGroupTreeSelectHeaderProps
> = (props: IGroupTreeSelectHeaderProps) => {
  const eventSettingsState = useSelector<StateType, IGroupEventSettingsState>(
    (state) => state.groupEventSettings
  );

  const dispatch = useDispatch();

  const { confirm } = Modal;

  function showConfirm(value: Array<string>) {
    confirm({
      okText: "Применить",
      cancelText: "Отменить",
      title: "Вы хотите применить выбор ко всем типам уведомлений?",
      content: "Выбранные объекты применятся ко всем типам уведомлений!",
      onOk() {
        dispatch(groupSiknTreeChecked(value));
      },
      onCancel() {
        dispatch(groupSiknTreeChecked([]));
      },
    });
  }

  const onChange = (value: Array<string>) => {
    dispatch(groupEventSettingsBtnDisabled(false));
    showConfirm(value);
    dispatch(groupSiknTreeChecked(value));
    props.clicked(value);
  };

  const tProps = {
    allowClear: true,
    treeDataSimpleMode: true,
    treeData: eventSettingsState.siknTree,
    value: eventSettingsState.treeKeys,
    onChange: onChange,
    treeCheckable: true,
    notFoundContent: "Нет данных",
    placeholder: "Выберите СИКН для всех типов",
    maxTagCount: 1,
    style: {
      width: 260,
    },
  };

  return (
    <Space>
      {props.displayName}
      <TreeSelect
        {...tProps}
        disabled={eventSettingsState.tableItems.length === 0}
      />
    </Space>
  );
};
