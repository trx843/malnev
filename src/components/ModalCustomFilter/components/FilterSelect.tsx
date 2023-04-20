import React, { FC, useEffect, useState } from "react";

import { Select, SelectProps } from "formik-antd";
import { Spin } from "antd";
import { isEmptyOptions } from "../helpers";
import { OptionData, OptionGroupData } from "../../../global";

export type GetOptions = (filterName: string) => Promise<OptionData[]>;

interface FilterSelectProps
  extends Omit<SelectProps, "onSelect" | "onDeselect"> {
  getOptions?: GetOptions;
  options?: OptionData[];
  onSelect?: (
    value: any,
    option: OptionData | OptionGroupData,
    name: string
  ) => void;
  onDeselect?: (
    value: any,
    option: OptionData | OptionGroupData,
    name: string
  ) => void;
  filterName: string;
  name: string;
}

export const FilterSelect: FC<FilterSelectProps> = ({
  onDeselect,
  getOptions,
  onSelect,
  filterName,
  name,
  options: optionsData
}) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<OptionData[]>(optionsData || []);

  useEffect(() => {
    if (isEmptyOptions(optionsData)) {
      return;
    }
    setOptions(optionsData || []);
  }, [optionsData]);

  const handleOpen = async (open: boolean) => {
    if (!isEmptyOptions(optionsData)) {
      return;
    }
    try {
      setFetching(true);
      if (open) {
        const options = (await getOptions?.(filterName)) || [];
        setOptions(options);
      }
    } finally {
      setFetching(false);
    }
  };

  const handleDeselect = (
    value: any,
    options: OptionData | OptionGroupData
  ) => {
    onDeselect?.(value, options, name);
  };
  const handleSelect = (value: any, options: OptionData | OptionGroupData) => {
    onSelect?.(value, options, name);
  };

  return (
    <Select
      name={name}
      onDropdownVisibleChange={handleOpen}
      notFoundContent={fetching ? <Spin size="small" /> : "Нет данных"}
      virtual={false}
      options={options}
      onDeselect={handleDeselect}
      onSelect={handleSelect}
      showSearch
      mode="multiple"
      placeholder="Все"
    />
  );
};
