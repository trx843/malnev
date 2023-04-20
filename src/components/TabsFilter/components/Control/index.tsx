import React from "react";
import { DateFormItem } from "./components/DateFormItem";
import { InputFormItem } from "./components/InputFormItem";
import { InputNumberFormItem } from "./components/InputNumberFormItem";
import { MultipleSelectFormItem } from "./components/MultipleSelectFormItem";
import { TextAreaFormItem } from "./components/TextAreaFormItem";
import { CheckboxFormItem } from "./components/CheckboxFormItem";
import { SelectFormItem } from "./components/SelectFormItem";
import { Nullable } from "../../../../types";
import { TypeFields } from "../../constants";
import { TabsFilterOptionsType } from "../../types";

interface IProps {
  className: string;
  fieldClassName: string;
  filterValueName: Nullable<string>;
  name: string;
  label: string;
  typeField: string;
  type: string;
  controller: Nullable<string>;
  submitForm: () => Promise<void>;
  getSelectOptions: (
    filterValueName: string,
    controller: string
  ) => Promise<TabsFilterOptionsType>;
}

export const Control: React.FC<IProps> = ({
  className,
  fieldClassName,
  filterValueName,
  name,
  label,
  type,
  typeField,
  controller,
  getSelectOptions,
  submitForm,
}) => {
  const commonProps = {
    className,
    fieldClassName,
    name,
    label,
    submitForm,
  };

  const renderControlByTypeField = () => {
    switch (typeField) {
      case TypeFields.Select:
        return (
          <SelectFormItem
            {...commonProps}
            filterValueName={filterValueName}
            controller={controller}
            getSelectOptions={getSelectOptions}
          />
        );
      case TypeFields.Multipleselect:
        return (
          <MultipleSelectFormItem
            {...commonProps}
            filterValueName={filterValueName}
            controller={controller}
            getSelectOptions={getSelectOptions}
          />
        );
      case TypeFields.Textarea:
        return <TextAreaFormItem {...commonProps} />;
      case TypeFields.Checkbox:
        return <CheckboxFormItem {...commonProps} />;
      case TypeFields.Input:
        return <InputFormItem {...commonProps} />;

      default:
        return null;
    }
  };

  return renderControlByTypeField();
};
