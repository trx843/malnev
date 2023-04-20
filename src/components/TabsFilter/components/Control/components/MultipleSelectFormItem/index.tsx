import React from "react";
import { FormItem, Select } from "formik-antd";
import { Spin } from "antd";
import { Nullable } from "../../../../../../types";
import { TabsFilterOptionsType } from "../../../../types";

interface IProps {
  className: string;
  fieldClassName: string;
  filterValueName: Nullable<string>;
  name: string;
  label: string;
  controller: Nullable<string>;
  getSelectOptions: (
    filterValueName: string,
    controller: string
  ) => Promise<TabsFilterOptionsType>;
  submitForm: () => Promise<void>;
}

export const MultipleSelectFormItem: React.FC<IProps> = ({
  className,
  fieldClassName,
  filterValueName,
  name,
  label,
  controller,
  getSelectOptions,
  submitForm,
}) => {
  const [isLoadingOptions, setIsLoadingOptions] = React.useState(false);
  const [options, setOptions] = React.useState<TabsFilterOptionsType>([]);

  const handleOpen = async (open: boolean) => {
    if (open) {
      setIsLoadingOptions(true);
      const options = await getSelectOptions(filterValueName || "", controller || "");
      setIsLoadingOptions(false);
      setOptions(options);
    }
  };

  return (
    <FormItem className={className} name={name} label={label}>
      <Select
        className={fieldClassName}
        name={name}
        onChange={submitForm}
        onDropdownVisibleChange={handleOpen}
        options={options}
        notFoundContent={
          isLoadingOptions ? <Spin size="small" /> : "Нет данных"
        }
        mode="multiple"
        maxTagCount={1}
        placeholder="Все"
        allowClear={true}
        maxTagTextLength={12}
      />
    </FormItem>
  );
};
