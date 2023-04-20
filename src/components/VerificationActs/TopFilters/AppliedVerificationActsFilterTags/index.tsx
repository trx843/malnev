import React, { FC } from "react";
import update from "immutability-helper";
import { useDispatch, useSelector } from "react-redux";

import { FiltersTags, FilterTag } from "../../../FilterTags";
import { StateType } from "../../../../types";
import { ListFilterBase } from "../../../../interfaces";
import { IFilterGroup } from "../../../CustomFilter/interfaces";
import { getValuesFromFilters } from "../../../../utils";
import { setAppliedFilter } from "slices/verificationActs/verificationActs";

export const AppliedVerificationActsFilterTags: FC = () => {
  const dispatch = useDispatch();
  const data = useSelector<
    StateType,
    {
      appliedFilter: ListFilterBase;
      filterGroupList: IFilterGroup[];
    }
  >((state) => ({
    appliedFilter: state.verificationActs.appliedFilter,
    filterGroupList: state.verificationActs.filterConfig.filterList,
  }));

  const handleDeleteFilter = (value: FilterTag) => {
    const filter = update(data.appliedFilter, {
      filter: { $unset: [value.key] },
    });
    dispatch(setAppliedFilter(filter));
  };

  return (
    <FiltersTags
      filterValues={getValuesFromFilters(data.appliedFilter.filter)}
      filterGroupList={data.filterGroupList}
      onDelete={handleDeleteFilter}
    />
  );
};
