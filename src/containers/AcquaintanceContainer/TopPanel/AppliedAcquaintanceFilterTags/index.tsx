import { FC } from "react";
import update from "immutability-helper";
import { useDispatch, useSelector } from "react-redux";

import { FiltersTags, FilterTag } from "components/FilterTags";
import { StateType } from "../../../../types";
import { ListFilterBase } from "../../../../interfaces";
import { IFilterGroup } from "components/CustomFilter/interfaces";
import { getValuesFromFilters } from "../../../../utils";
import { getAcquaintanceItemsByAppliedFilterThunk } from "thunks/pspControl/acquaintance";

export const AppliedAcquaintanceFilterTags: FC = () => {
  const dispatch = useDispatch();
  const data = useSelector<
    StateType,
    { appliedFilter: ListFilterBase; filterGroupList: IFilterGroup[] }
  >(state => ({
    appliedFilter: state.acquaintance.appliedFilter,
    filterGroupList: state.acquaintance.filterConfig.filterList
  }));

  const handleDeleteFilter = (value: FilterTag) => {
    const filter = update(data.appliedFilter, {
      filter: { $unset: [value.key] }
    });
    dispatch(getAcquaintanceItemsByAppliedFilterThunk(filter));
  };

  return (
    <FiltersTags
      filterValues={getValuesFromFilters(data.appliedFilter.filter)}
      filterGroupList={data.filterGroupList}
      onDelete={handleDeleteFilter}
    />
  );
};
