import React from "react";
import update from "immutability-helper";
import { useDispatch, useSelector } from "react-redux";
import { FiltersTags, FilterTag } from "../../../../../components/FilterTags";
import { StateType } from "../../../../../types";
import { getValuesFromFilters } from "../../../../../utils";
import { IEliminationOfTypicalViolationsStore } from "../../../../../slices/pspControl/eliminationOfTypicalViolations/types";
import { setListFilter } from "slices/pspControl/eliminationOfTypicalViolations";
import { getTypicalViolationsThunk } from "thunks/pspControl/eliminationOfTypicalViolations";
import "./styles.css";

export const AppliedFilterTags: React.FC = () => {
  const dispatch = useDispatch();

  const { listFilter, filterConfig } = useSelector<
    StateType,
    IEliminationOfTypicalViolationsStore
  >((state) => state.eliminationOfTypicalViolations);

  const handleDeleteFilter = (value: FilterTag) => {
    const filter = update(listFilter, {
      filter: { $unset: [value.key as any] },
    });

    dispatch(setListFilter(filter));
    dispatch(getTypicalViolationsThunk(filter));
  };

  return (
    <div className="action-plans-applied-filter-tags">
      <FiltersTags
        filterValues={getValuesFromFilters(listFilter.filter as any)}
        filterGroupList={filterConfig.filterList}
        onDelete={handleDeleteFilter}
      />
    </div>
  );
};
