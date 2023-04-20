import React, { FunctionComponent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { TreeSelect } from 'antd';
import { UsersEventTypes } from "../../../classes/UsersEventTypes";
import { useDispatch, useSelector } from "react-redux";
import { eventSettingsBtnDisabled } from "../../../actions/eventsettings/creators";
import {  IEventSettingsState } from "../../../interfaces";
import { StateType } from "../../../types";


interface ISiknTreeSelectButtomProps {
  setValue(data: UsersEventTypes): void;
  data: UsersEventTypes;
  tableItems: Array<UsersEventTypes>;
}

export const SiknTreeSelect: FunctionComponent<ISiknTreeSelectButtomProps> = (props: ISiknTreeSelectButtomProps) => {


  const eventSettingsState = useSelector<StateType, IEventSettingsState>(state => state.eventSettings);

  const dispatch = useDispatch();
  const [value, setValue] = useState<Array<string>>(props.data.siknList);



  const onChange = (value: Array<string>) => {
    dispatch(eventSettingsBtnDisabled(false));
    setValue(value);
    props.data.siknList = value;
  };

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    setValue(eventSettingsState.treeKeys);
    props.data.siknList = eventSettingsState.treeKeys;
  }, [eventSettingsState.treeKeys]);


  const tProps = {
    allowClear: true,
    treeData: eventSettingsState.siknTree,
    value: value,
    onChange: onChange,
    treeCheckable: true,
    placeholder: 'Все',
    notFoundContent: "Нет данных",
    maxTagCount: 2,
    style: {
      width: 300,
    },
  };

  return <TreeSelect {...tProps} />;

}



