import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilterValues } from "actions/customfilter";
import {
  ModalConfigTypes,
  VerificationActStore,
} from "slices/verificationActs/verificationAct/types";
import { StateType } from "types";
import { getListFilterBaseParams } from "./utils";
import {
  getFilterDescriptionViolationThunk,
  getFilterViolationScheduleThunk,
} from "thunks/verificationActs/verificationAct";
import { mapTabsFilterOptions } from "components/TabsFilter/utils";
import { TabsFilter } from "components/TabsFilter";
import { TypicalViolationForActModalFilter } from "slices/pspControl/actionPlanTypicalViolations/types";

export const TypicalViolationTabsFilter: React.FC = () => {
  const dispatch = useDispatch();

  const { modalConfigs } = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const listFilter =
    modalConfigs[ModalConfigTypes.IdentifiedViolations].listFilter;

  React.useEffect(() => {
    dispatch(
      getFilterDescriptionViolationThunk(ModalConfigTypes.TypicalViolation)
    );
  }, []);

  const handleFetchSelectOptions = async (
    name: string,
    values: TypicalViolationForActModalFilter,
    controller: string
  ) => {
    const params = getListFilterBaseParams(name, values);
    const response: string[] = await getFilterValues(name, controller, params);

    return mapTabsFilterOptions(response);
  };

  const handleSubmitFilter = (values: TypicalViolationForActModalFilter) => {
    const adjustedFilter = {
      ...listFilter,
      filter: {
        ...listFilter.filter,
        ...values,
      },
    };

    dispatch(
      getFilterViolationScheduleThunk({
        listFilter: adjustedFilter,
        modalType: ModalConfigTypes.TypicalViolation,
      })
    );
  };

  return (
    <TabsFilter<TypicalViolationForActModalFilter>
      filterList={modalConfigs[ModalConfigTypes.TypicalViolation].filterList}
      handleFetchSelectOptions={handleFetchSelectOptions}
      onSubmit={handleSubmitFilter}
    />
  );
};
