import React, { FunctionComponent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { TreeSelect } from 'antd';
import { GroupsEventTypes } from "../../../classes/GroupsEventTypes";
import { useDispatch, useSelector } from "react-redux";
import { IGroupEventSettingsState } from "../../../interfaces";
import { StateType } from "../../../types";
import { groupEventSettingsBtnDisabled } from "../../../actions/groupeventsettings/creators";


interface IGroupSiknTreeSelectButtomProps {
  setValue(data: GroupsEventTypes): void;
  data: GroupsEventTypes;
  tableItems: Array<GroupsEventTypes>;
}

export const GroupSiknTreeSelect: FunctionComponent<IGroupSiknTreeSelectButtomProps> = (props: IGroupSiknTreeSelectButtomProps) => {

  const eventSettingsState = useSelector<StateType, IGroupEventSettingsState>(state => state.groupEventSettings);

  const dispatch = useDispatch();
  const [value, setValue] = useState<Array<string>>(props.data.siknList);



  const onChange = (value: Array<string>) => {
    dispatch(groupEventSettingsBtnDisabled(false));
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



