import React from "react";
import update from "immutability-helper";
import { useDispatch, useSelector } from "react-redux";
import { FiltersTags, FilterTag } from "../../../../../components/FilterTags";
import { StateType } from "../../../../../types";
import { getValuesFromFilters } from "../../../../../utils";
import { IEliminationOfViolationsStore } from "../../../../../slices/pspControl/eliminationOfViolations/types";
import { setAppliedFilter } from "../../../../../slices/pspControl/eliminationOfViolations";
import { getViolationsThunk } from "../../../../../thunks/pspControl/eliminationOfViolations";
import "./styles.css";

export const AppliedFilterTags: React.FC = () => {
  const dispatch = useDispatch();
  const { appliedFilter, filterConfig } = useSelector<
    StateType,
    IEliminationOfViolationsStore
  >((state) => state.eliminationOfViolations);

  const handleDeleteFilter = (value: FilterTag) => {
    const filter = update(appliedFilter, {
      filter: { $unset: [value.key] },
    });
    dispatch(setAppliedFilter(filter));
    dispatch(getViolationsThunk(filter));
  };

  return (
    <div className="action-plans-applied-filter-tags">
      <FiltersTags
        filterValues={getValuesFromFilters(appliedFilter.filter)}
        filterGroupList={filterConfig.filterList}
        onDelete={handleDeleteFilter}
      />
    </div>
  );
};
