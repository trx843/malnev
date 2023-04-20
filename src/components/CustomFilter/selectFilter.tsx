import { Spin } from "antd";
import { Select } from "formik-antd";
import { SelectProps, OptionProps } from "antd/es/select";
import React, { FC, useRef, useState } from "react";
import { getFilterValues } from "../../actions/customfilter";
import { ListFilterBase } from "../../interfaces";
import { useSelector } from "react-redux";
import { StateType } from "../../types";
import { ICustomFilterState } from "../../slices/customFilter";
import { OptionData, OptionGroupData } from "../../global";

export interface FetchingSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, "options" | "children"> {
  fetchOptions: (
    baseUrl: string,
    filterName: string,
    filterData: ListFilterBase
  ) => Promise<ValueType[]>;
  propName: string;
  filterName: string;
}

const FetchingSelect: FC<FetchingSelectProps> = ({
  fetchOptions,
  ...props
}) => {
  const customFilterStore = useSelector<StateType, ICustomFilterState>(
    state => state.customFilter
  );

  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState<any[]>([]);

  const loadOptions = (filterName: string) => {
    setOptions([]);
    setFetching(true);

    fetchOptions(
      customFilterStore.baseUrl,
      filterName,
      customFilterStore.filterData
    ).then(newOptions => {
      if (newOptions) setOptions(newOptions);
      setFetching(false);
    });
  };

  return (
    <Select
      name={props.propName}
      onDropdownVisibleChange={open => {
        if (open) loadOptions(props.filterName);
      }}
      notFoundContent={fetching ? <Spin size="small" /> : "Нет данных"}
      {...props}
      options={options.map((option: string) => ({
        label: option,
        value: option
      }))}
    />
  );
};

interface IFilterSelectProps {
  propName: string;
  filterName: string;
  width?: number | string;
  sumbitForm?: (
    value: any,
    option: OptionData | OptionGroupData,
    name: string
  ) => void;
}

export const FilterSelect: FC<IFilterSelectProps> = ({
  width = 250,
  propName,
  sumbitForm,
  ...props
}) => {
  const handleDeselect = (
    value: any,
    options: OptionData | OptionGroupData
  ) => {
    sumbitForm?.(value, options, propName);
  };
  const handleSelect = (value: any, options: OptionData | OptionGroupData) => {
    sumbitForm?.(value, options, propName);
  };
  return (
    <FetchingSelect
      {...props}
      filterName={props.filterName}
      propName={propName}
      mode="multiple"
      placeholder="Все"
      style={{ width }}
      optionFilterProp={"label"}
      showSearch
      fetchOptions={getFilterValues}
      onSelect={handleSelect}
      onDeselect={handleDeselect}
    />
  );
};
