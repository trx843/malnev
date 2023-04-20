import React from "react";
import { Button, Divider, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../../../../../../../types";
import {
  DictionariesNames,
  IPlanCardStore,
  setDictionaries,
} from "../../../../../../../slices/pspControl/planCard";

interface IProps {
  menu: React.ReactNode;
  accessor: DictionariesNames;
}

export const CustomSelectDropdown: React.FC<IProps> = ({ menu, accessor }) => {
  const dispatch = useDispatch();

  const { dictionaries } = useSelector<StateType, IPlanCardStore>(
    (state) => state.planCard
  );

  const [name, setName] = React.useState("");

  const addNewOption = () => {
    dispatch(
      setDictionaries({
        name: DictionariesNames[accessor],
        value: [...dictionaries[accessor], { value: name, label: name }],
      })
    );
    setName("");
  };

  return (
    <React.Fragment>
      {menu}
      <Divider />
      <div style={{ display: "flex" }}>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <Button icon={<PlusOutlined />} type="link" onClick={addNewOption}>
          Добавить
        </Button>
      </div>
    </React.Fragment>
  );
};
