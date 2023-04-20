import React from "react";
import { getFilterValues } from "../../../../../../actions/customfilter";
import { TabsFilter as BasicTabsFilter } from "../../../../../../components/TabsFilter";
import { getFilterDescriptionSchedule } from "api/requests/pspControl/plan-typical-violations";
import {
  IViolationModalFilter,
  TypicalPlanListFilter,
} from "../../../../../../slices/pspControl/actionPlanTypicalViolations/types";
import { IFiltersDescription } from "../../../../../../types";
import { getListFilterBaseParams, mapOptions } from "./utils";

interface IProps {
  listFilter: TypicalPlanListFilter;
  setListFilter: (listFiler) => void;
}

export const EliminationOfTypicalViolationsTabsFilter: React.FC<IProps> = ({
  listFilter,
  setListFilter,
}) => {
  const [filterList, setFilterList] = React.useState<IFiltersDescription[]>([]);
  const [isLoadingFilterList, setIsLoadingFilterList] = React.useState(false);

  React.useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setIsLoadingFilterList(true);
    const filterList = await getFilterDescriptionSchedule();
    setFilterList(filterList);
    setIsLoadingFilterList(false);
  };

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
    setListFilter(filter);
  };

  return (
    <BasicTabsFilter<IViolationModalFilter>
      filterList={filterList}
      isLoading={isLoadingFilterList}
      handleFetchSelectOptions={handleFetchSelectOptions}
      onSubmit={handleSubmitFilter}
    />
  );
};
