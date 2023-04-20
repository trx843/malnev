import React from "react";
import { FormItem, InputNumber } from "formik-antd";

interface IProps {
  className: string;
  fieldClassName: string;
  name: string;
  label: string;
}

export const InputNumberFormItem: React.FC<IProps> = ({
  className,
  fieldClassName,
  name,
  label,
}) => {
  return (
    <FormItem className={className} name={name} label={label}>
      <InputNumber className={fieldClassName} name={name} />
    </FormItem>
  );
};
