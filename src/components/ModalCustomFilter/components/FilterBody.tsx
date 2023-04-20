import { FC } from "react";

import { IFilterGroup } from "../../CustomFilter/interfaces";
import { FilterGroup } from "./FilterGroup";
import { OnChangeSelect } from "./FilterField";
import { OptionData } from "../../../global";

interface FilterBodyProps {
  groups: Record<string, IFilterGroup[]>;
  selectedKey: string | null;
  onChange?: OnChangeSelect;
  getOptionsSelect?: (
    filterName: string,
    controller: string
  ) => Promise<OptionData[]>;
  values: any;
  setFieldValue: any;
}

export const FilterBody: FC<FilterBodyProps> = ({
  onChange,
  selectedKey,
  groups,
  values,
  setFieldValue,
  getOptionsSelect
}) => {
  if (selectedKey === null || !groups[selectedKey]) {
    return null;
  }
  return (
    <FilterGroup
      key={selectedKey}
      onChange={onChange}
      groupFilter={groups[selectedKey]}
      values={values}
      setFieldValue={setFieldValue}
      getOptionsSelect={getOptionsSelect}
    />
  );
};
