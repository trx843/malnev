import React from "react";
import classNames from "classnames/bind";
import { FormItem, Input } from "formik-antd";
import styles from "./TextAreaFormItem.module.css";

const { TextArea } = Input;

const cx = classNames.bind(styles);

interface IProps {
  className: string;
  fieldClassName: string;
  name: string;
  label: string;
  submitForm: () => Promise<void>;
}

export const TextAreaFormItem: React.FC<IProps> = ({
  className,
  fieldClassName,
  name,
  label,
  submitForm,
}) => {
  return (
    <FormItem className={className} name={name} label={label}>
      <TextArea
        className={cx(fieldClassName, "textArea")}
        name={name}
        onChange={submitForm}
      />
    </FormItem>
  );
};
