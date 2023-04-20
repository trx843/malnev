import React from "react";
import { FormItem, Input } from "formik-antd";

interface IProps {
  className: string;
  fieldClassName: string;
  name: string;
  label: string;
  submitForm: () => Promise<void>;
}

export const InputFormItem: React.FC<IProps> = ({
  className,
  fieldClassName,
  name,
  label,
  submitForm,
}) => {
  return (
    <FormItem className={className} name={name} label={label}>
      <Input className={fieldClassName} name={name} onPressEnter={submitForm} />
    </FormItem>
  );
};
