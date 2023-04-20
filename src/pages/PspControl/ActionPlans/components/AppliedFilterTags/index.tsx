import React from "react";
import update from "immutability-helper";
import { useDispatch, useSelector } from "react-redux";
import { FiltersTags, FilterTag } from "../../../../../components/FilterTags";
import { StateType } from "../../../../../types";
import { IActionPlansStore, setAppliedFilter } from "../../../../../slices/pspControl/actionPlans";
import "./styles.css";
import { getValuesFromFilters } from "../../../../../utils";

export const AppliedFilterTags: React.FC = () => {
  const dispatch = useDispatch();
  const { appliedFilter, filterConfig } = useSelector<
    StateType,
    IActionPlansStore
  >(state => state.actionPlans);

  const handleDeleteFilter = (value: FilterTag) => {
    const filter = update(appliedFilter, {
      filter: { $unset: [value.key] }
    });
    dispatch(setAppliedFilter(filter));
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
