import React from "react";
import { DatePicker, FormItem } from "formik-antd";

interface IProps {
  className: string;
  fieldClassName: string;
  name: string;
  label: string;
}

export const DateFormItem: React.FC<IProps> = ({
  className,
  fieldClassName,
  name,
  label,
}) => {
  return (
    <FormItem className={className} name={name} label={label}>
      <DatePicker className={fieldClassName} name={name} format="DD.MM.YYYY" />
    </FormItem>
  );
};
