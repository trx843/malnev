import { SelectProps } from "antd";
import { SelectValue } from "antd/lib/select";
import { SelectProps as FormikSelectProps } from "formik-antd";
import { DropdownSelectTypes } from "components/DropdownSelect/constants";

export interface IDictionaryAntdSelectProps extends SelectProps<SelectValue> {
  type: DropdownSelectTypes.antd;
  name?: never;
}

export interface IDictionaryFormikSelectProps extends FormikSelectProps {
  type: DropdownSelectTypes.formik;
}

export type DictionarySelectProps =
  | IDictionaryAntdSelectProps
  | IDictionaryFormikSelectProps;
