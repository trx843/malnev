import { FC } from "react";
import { Col } from "antd";
import { TypeFields } from "../../../../../../../TabsFilter/constants";
import { IFiltersDescription } from "../../../../../../../../types";
import { FieldSelect } from "./Controls/Select";
import { TabsFilterOptionsType } from "../../../../../../../TabsFilter/types";
import { FilterInput } from "./Controls/Input";

interface FilterFieldProps extends IFiltersDescription {
  getSelectOptions: (
    filterValueName: string,
    controller: string
  ) => Promise<void>;
  formik: any;
}

export const FilterField: FC<FilterFieldProps> = ({
  typeField,
  getSelectOptions,
  formik,
  name,
  ...props
}) => {
  const renderControl = () => {
    switch (typeField) {
      case TypeFields.Select:
        return (
          <FieldSelect
            {...props}
            name={name}
            options={
              Array.isArray(formik.values[name])
                ? (formik.values[name] as TabsFilterOptionsType)
                : []
            }
            getSelectOptions={getSelectOptions}
          />
        );

      case TypeFields.Input:
        return <FilterInput {...props} name={name} />;

      default: {
        return null;
      }
    }
  };

  return <Col span={12}>{renderControl()}</Col>;
};
