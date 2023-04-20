import { FC } from "react";
import { Form, Input } from "antd";
import { IFiltersDescription } from "../../../../../../../../../types";

export const FilterInput: FC<Omit<IFiltersDescription, "typeField">> = ({
  name,
  propName
}) => {
  return (
    <Form.Item label={name} name={propName}>
      <Input />
    </Form.Item>
  );
};
