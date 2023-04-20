import React from "react";
import classNames from "classnames/bind";
import { Control } from "../Control";
import { TypeFields } from "../../constants";
import { IFiltersDescription } from "../../../../types";
import { TabsFilterOptionsType } from "../../types";
import styles from "./FilterList.module.css";

const cx = classNames.bind(styles);

interface IProps {
  filterList: IFiltersDescription[];
  submitForm: () => Promise<void>;
  getSelectOptions: (
    filterName: string,
    controller: string
  ) => Promise<TabsFilterOptionsType>;
}

export const FilterList: React.FC<IProps> = ({
  filterList,
  submitForm,
  getSelectOptions
}) => {
  return (
    <div className={cx("filterList")}>
      {filterList.map(field => {
        const typeField = field.typeField;

        return (
          <Control
            // класс FormItem
            key={field.propName}
            className={cx("control", {
              control_field: typeField !== TypeFields.Textarea
            })}
            fieldClassName={cx("field")} // класс поля
            filterValueName={field.filterValueName}
            name={field.propName}
            label={field.name}
            type={field.type}
            typeField={typeField}
            controller={field.controller}
            submitForm={submitForm}
            getSelectOptions={getSelectOptions}
          />
        );
      })}
    </div>
  );
};
