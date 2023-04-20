import { FC, useState } from "react";

import { Form, Select, Spin } from "antd";
import { IFiltersDescription } from "../../../../../../../../../types";
import { TabsFilterOptionsType } from "../../../../../../../../TabsFilter/types";

export interface FieldSelectProps
  extends Omit<IFiltersDescription, "typeField"> {
  getSelectOptions: (
    filterValueName: string,
    controller: string
  ) => Promise<void>;
  options: TabsFilterOptionsType;
}

export const FieldSelect: FC<FieldSelectProps> = ({
  propName,
  getSelectOptions,
  options,
  filterValueName,
  name,
  controller
}) => {
  const [loading, setLoading] = useState(false);

  const handleOpen = async (open: boolean) => {
    if (!open) {
      return;
    }
    try {
      setLoading(true);
      await getSelectOptions(filterValueName || "", controller || "");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form.Item name={propName} label={name}>
      <Select
        onDropdownVisibleChange={handleOpen}
        options={options}
        notFoundContent={loading ? <Spin size="small" /> : "Нет данных"}
        mode="multiple"
        maxTagCount={1}
        placeholder="Все"
        allowClear={true}
        maxTagTextLength={12}
      />
    </Form.Item>
  );
};
