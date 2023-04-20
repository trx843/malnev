import { FC, memo } from "react";
import locale from "antd/lib/date-picker/locale/ru_RU";
import { DatePicker, Checkbox, Input, InputNumber } from "formik-antd";

import { IFilterGroup } from "../../CustomFilter/interfaces";
import { FilterSelect } from "./FilterSelect";
import { OptionData } from "../../../global";
import { Moment } from "moment";

export type OnChangeSelect = (
  value: any,
  name: string,
  options: { controller: string }
) => void;

interface FieldProps {
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

enum FieldType {
  String = "String",
  Int32 = "Int32",
  DateTime = "DateTime",
  Boolean = "Boolean",
}

export const Field: FC<FieldProps> = memo(
  ({ field, groupName, onChange, getOptionsSelect, ...props }) => {
    const renderControl = () => {
      switch (field.type) {
        case FieldType.String:
          return <Input {...props} name={`${field.propName}`} />;
        case FieldType.Int32:
          return <InputNumber {...props} name={`${field.propName}`} />;
        case FieldType.DateTime:
          return (
            <DatePicker
              {...props}
              style={{ width: "100%" }}
              locale={locale}
              format="DD.MM.YYYY"
              name={`${field.propName}`}
              onChange={(value) => {
                props.setFieldValue(
                  `${field.propName}`,
                  value?.endOf("day").format("YYYY-MM-DDTHH:mm:ss")
                );
              }}
            />
          );
        case FieldType.Boolean:
          return <Checkbox {...props} name={`${field.propName}`} />;
        default:
          return null;
      }
    };
    const renderContent = () => {
      if (field.typeField === "Multipleselect") {
        return (
          <FilterSelect
            {...props}
            onSelect={(value, options, name) =>
              onChange?.(value, name, {
                ...options,
                controller: field.controller || "",
              })
            }
            onDeselect={(value, options, name) =>
              onChange?.(value, name, {
                ...options,
                controller: field.controller || "",
              })
            }
            filterName={field.propName}
            name={`${field.propName}`}
            options={field.options || []}
            getOptions={async (value: string) =>
              (await getOptionsSelect?.(
                field.filterValueName,
                field.controller || ""
              )) || []
            }
          />
        );
      }
      if (field.typeField === "Daterange") {
        return (
          <DatePicker.RangePicker
            {...props}
            style={{ width: "100%" }}
            locale={locale}
            format="DD.MM.YYYY"
            name={`${field.propName}`}
            // onChange={(
            //   dates: [Moment, Moment],
            //   formatString: [string, string]
            // ) => {
            //   if (dates != undefined) {
            //     let start = dates[0].toDate();
            //     let end = dates[1].toDate();
            //     setFieldValue("startTime", start);
            //     setFieldValue("endTime", end);
            //   }
            // }}
          />
        );
      }
      return renderControl();
    };

    return renderContent();
  }
);
