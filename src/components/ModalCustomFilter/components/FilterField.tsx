import { FC, memo } from "react";
import { Typography } from "antd";
import { FormItem } from "formik-antd";

import { IFilterGroup } from "../../CustomFilter/interfaces";
import { Field } from "./Field";
import { OptionData } from "../../../global";

export type OnChangeSelect = (
  value: any,
  name: string,
  options: { controller: string }
) => void;

interface FilterFieldProps {
  field: IFilterGroup;
  groupName: string;
  className?: string;
  onChange?: OnChangeSelect;
  getOptionsSelect?: (
    filterName: string,
    controller: string
  ) => Promise<OptionData[]>;
  values: any;
  setFieldValue: any;
}

export const FilterField: FC<FilterFieldProps> = memo(
  ({ field, groupName, ...props }) => {
    return (
      <FormItem
        {...props}
        name={`${groupName}.${field.propName}`}
        label={field.name}
        colon={false}
        noStyle
      >
        <div className="psp-custom-filter-modal__field">
          <Typography.Text
            className="psp-custom-filter-label-field"
            title={field.name}
          >
            {field.name}
          </Typography.Text>
          <Field {...props} field={field} groupName={groupName} />
        </div>
      </FormItem>
    );
  }
);
