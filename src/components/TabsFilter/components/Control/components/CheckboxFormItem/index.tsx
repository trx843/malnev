import React from "react";
import { Checkbox, FormItem } from "formik-antd";

interface IProps {
  className: string;
  fieldClassName: string;
  name: string;
  label: string;
  submitForm: () => Promise<void>;
}

export const CheckboxFormItem: React.FC<IProps> = ({
  className,
  fieldClassName,
  name,
  label,
  submitForm,
}) => {
  return (
    <FormItem className={className} name={name}>
      <Checkbox className={fieldClassName} name={name} onChange={submitForm}>
        {label}
      </Checkbox>
    </FormItem>
  );
};
