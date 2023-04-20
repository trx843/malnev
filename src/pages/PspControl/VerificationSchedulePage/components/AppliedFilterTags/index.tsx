import React from "react";
import { useDispatch, useSelector } from "react-redux";
import update from "immutability-helper";
import classNames from "classnames/bind";
import { FiltersTags, FilterTag } from "../../../../../components/FilterTags";
import { StateType } from "../../../../../types";
import { getValuesFromFilters } from "../../../../../utils";
import { IVerificationScheduleStore, setAppliedFilter } from "../../../../../slices/pspControl/verificationSchedule";
import styles from "./appliedFilterTags.module.css";

const cx = classNames.bind(styles);

export const AppliedFilterTags: React.FC = () => {
  const dispatch = useDispatch();
  const { appliedFilter, filterConfig } = useSelector<
    StateType,
    IVerificationScheduleStore
  >(state => state.verificationSchedule);

  const handleDeleteFilter = (value: FilterTag) => {
    const filter = update(appliedFilter, {
      filter: { $unset: [value.key] }
    });
    dispatch(setAppliedFilter(filter));
  };

  return (
    <div className={cx("filter-tags")}>
      <FiltersTags
        filterValues={getValuesFromFilters(appliedFilter.filter)}
        filterGroupList={filterConfig.filterList}
        onDelete={handleDeleteFilter}
      />
    </div>
  );
};
