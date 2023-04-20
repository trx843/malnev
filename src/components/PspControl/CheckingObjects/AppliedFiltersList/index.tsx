import React, { FC, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import update from "immutability-helper";

import { StateType } from "../../../../types";

import { FiltersTags, FilterTag } from "../../../FilterTags";
import { IFilterGroup } from "../../../CustomFilter/interfaces";
import { ListFilterBase } from "../../../../interfaces";
import { getValuesFromFilters } from "../../../../utils";
import { setAppliedFilter } from "slices/pspControl/checkingObjects";

export const AppliedFiltersList: FC = memo(() => {
  const dispatch = useDispatch();
  const data = useSelector<
    StateType,
    {
      appliedFilter: ListFilterBase;
      filterGroupList: IFilterGroup[];
    }
  >((state) => ({
    appliedFilter: state.checkingObjects.appliedFilter,
    filterGroupList: state.checkingObjects.filterConfig.filterList,
  }));

  const handleDeleteFilter = (value: FilterTag) => {
    const updatedFilter = update(data.appliedFilter, {
      filter: { $unset: [value.key] },
    });

    dispatch(setAppliedFilter(updatedFilter));
  };

  return (
    <FiltersTags
      onDelete={handleDeleteFilter}
      filterValues={getValuesFromFilters(data.appliedFilter.filter)}
      filterGroupList={data.filterGroupList}
    />
  );
});
