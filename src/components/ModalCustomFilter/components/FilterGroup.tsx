import React, { FC } from "react";
import { OptionData } from "../../../global";

import { IFilterGroup } from "../../CustomFilter/interfaces";
import { FilterField, OnChangeSelect } from "./FilterField";

interface FilterGroupProps {
  groupFilter: IFilterGroup[];
  onChange?: OnChangeSelect;
  getOptionsSelect?: (
    filterName: string,
    controller: string
  ) => Promise<OptionData[]>;
  values: any;
  setFieldValue: any;
}

export const FilterGroup: FC<FilterGroupProps> = ({
  values,
  setFieldValue,
  onChange,
  groupFilter,
  getOptionsSelect
}) => (
  <div className="psp-custom-filter-modal__group">
    {groupFilter.map(field => (
      <FilterField
        key={field.name}
        field={field}
        onChange={onChange}
        groupName={field.displayGroupName}
        values={values}
        setFieldValue={setFieldValue}
        getOptionsSelect={getOptionsSelect}
      />
    ))}
  </div>
);
