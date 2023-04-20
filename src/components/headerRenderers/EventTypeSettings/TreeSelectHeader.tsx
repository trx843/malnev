import { Modal, Space, TreeSelect } from "antd";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { eventSettingsBtnDisabled } from "../../../actions/eventsettings/creators";
import { siknTreeChecked } from "../../../actions/eventsettings/creators";
import { IEventSettingsState } from "../../../interfaces";
import { StateType } from "../../../types";

interface ITreeSelectHeaderProps {
  displayName: string;
  clicked: (siknList: Array<string>) => void;
}

export const TreeSelectHeader: FunctionComponent<ITreeSelectHeaderProps> = (
  props: ITreeSelectHeaderProps
) => {
  const eventSettingsState = useSelector<StateType, IEventSettingsState>(
    (state) => state.eventSettings
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
        dispatch(siknTreeChecked(value));
      },
      onCancel() {
        dispatch(siknTreeChecked([]));
      },
    });
  }

  const onChange = (value: Array<string>) => {
    dispatch(eventSettingsBtnDisabled(false));
    showConfirm(value);
    dispatch(siknTreeChecked(value));
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
