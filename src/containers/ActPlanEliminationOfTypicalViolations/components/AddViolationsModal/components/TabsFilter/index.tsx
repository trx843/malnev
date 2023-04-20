import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilterValues } from "../../../../../../actions/customfilter";
import { TabsFilter as BasicTabsFilter } from "../../../../../../components/TabsFilter";
import { setListFilter } from "../../../../../../slices/pspControl/actionPlanTypicalViolations";
import {
  ActionPlanTypicalViolationsStore,
  IViolationModalFilter,
} from "../../../../../../slices/pspControl/actionPlanTypicalViolations/types";
import { getFilterDescriptionSchedule } from "../../../../../../thunks/pspControl/actionPlans/actionPlanTypicalViolations";
import { StateType } from "../../../../../../types";
import { getListFilterBaseParams, mapOptions } from "./utils";

export const TabsFilter: React.FC = () => {
  const dispatch = useDispatch();

  const { listFilter, filterList, isFilterListLoading } = useSelector<
    StateType,
    ActionPlanTypicalViolationsStore
  >((state) => state.actionPlanTypicalViolations);

  React.useEffect(() => {
    dispatch(getFilterDescriptionSchedule());
  }, []);

  const handleFetchSelectOptions = async (
    name: string,
    values: any,
    controller: string
  ) => {
    const params = getListFilterBaseParams(name, values);
    const response: string[] = await getFilterValues(name, controller, params);

    return mapOptions(response);
  };

  const handleSubmitFilter = (values: IViolationModalFilter) => {
    const filter = {
      ...listFilter,
      filter: {
        ...listFilter.filter,
        ...values,
      },
    };
    // dispatch(setListFilter(filter));
  };

  return (
    <BasicTabsFilter<IViolationModalFilter>
      filterList={filterList}
      isLoading={isFilterListLoading}
      handleFetchSelectOptions={handleFetchSelectOptions}
      onSubmit={handleSubmitFilter}
    />
  );
};
