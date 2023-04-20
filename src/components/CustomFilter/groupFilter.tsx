import locale from "antd/lib/date-picker/locale/ru_RU";
import { FormItem, Input, Select, InputNumber, DatePicker } from "formik-antd";
import React, { FC } from "react";
import { useSelector } from "react-redux";
import { ListFilterBase } from "../../interfaces";
import { ICustomFilterState } from "../../slices/customFilter";
import {
  FilterGroupCollapse,
  FilterGroupPanel
} from "../../styles/commonStyledComponents";
import { StateType } from "../../types";
import { IFilterGroup, IFilter } from "./interfaces";
import { FilterSelect } from "./selectFilter";

interface ICustomFilterProps {
  groupFilter: IFilterGroup;
  sumbitForm: (data: any) => void;
}
export const GroupFilter: FC<ICustomFilterProps> = props => {
  const customFilterStore = useSelector<StateType, ICustomFilterState>(
    state => state.customFilter
  );

  const drawFilter = (filter: IFilter) => {
    switch (filter.type) {
      case "String":
        return (
          <Input name={`${props.groupFilter.propName}.${filter.propName}`} />
        );
      case "Int32":
        return (
          <InputNumber
            name={`${props.groupFilter.propName}.${filter.propName}`}
          />
        );
      case "DateTime":
        return (
          <DatePicker
            style={{ width: "100%" }}
            locale={locale}
            name={`${props.groupFilter.propName}.${filter.propName}`}
          />
        );
      default:
        return <></>;
    }
  };
  return (
    <>
      <FilterGroupCollapse expandIconPosition={"right"}>
        <FilterGroupPanel
          header={props.groupFilter.name}
          key={props.groupFilter.propName}
        >
          {/**} {props.groupFilter.filterList.map((filter) => {
            return (
              <FormItem
                name={`${props.groupFilter.propName}.${filter.propName}`}
                label={filter.name}
              >
                {filter.isArray ? (
                  <>
                    <FilterSelect
                      sumbitForm={props.sumbitForm}
                      filterName={filter.propName}
                      propName={`${props.groupFilter.propName}.${filter.propName}`}
                    />
                  </>
                ) : (
                  drawFilter(filter)

              </FormItem>
            );
          })}    )} **/}
        </FilterGroupPanel>
      </FilterGroupCollapse>
    </>
  );
};
