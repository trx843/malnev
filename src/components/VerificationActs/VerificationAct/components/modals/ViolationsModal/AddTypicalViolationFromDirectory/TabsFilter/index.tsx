import React, { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getListFilterBaseParams, mapOptions } from "./utils";
import { IViolationModalFilter } from "../../../../../../../../slices/pspControl/actionPlanTypicalViolations/types";
import { TabsFilter as BasicTabsFilter } from "../../../../../../../TabsFilter";
import { getFilterValues } from "../../../../../../../../actions/customfilter";
import { StateType } from "../../../../../../../../types";
import {
  ModalConfigTypes,
  VerificationActStore
} from "../../../../../../../../slices/verificationActs/verificationAct/types";
import { setListFilter } from "../../../../../../../../slices/verificationActs/verificationAct";
import {
  getFilterDescriptionViolationThunk,
  getFilterViolationScheduleThunk
} from "../../../../../../../../thunks/verificationActs/verificationAct";

export const TabsFilter: FC = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const { modalConfigs } = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );

  const getFilter = useCallback(async () => {
    try {
      await dispatch(
        getFilterDescriptionViolationThunk(
          ModalConfigTypes.IdentifiedViolations
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getFilter();
  }, [getFilter]);

  const handleFetchSelectOptions = async (
    name: string,
    values: any,
    controller: string
  ) => {
    const params = getListFilterBaseParams(name, values);
    const response: string[] = await getFilterValues(name, controller, params);

    return mapOptions(response);
  };

  const handleSubmitFilter = async (values: IViolationModalFilter) => {
    const filter = {
      ...modalConfigs[ModalConfigTypes.IdentifiedViolations].listFilter,
      filter: {
        ...modalConfigs[ModalConfigTypes.IdentifiedViolations].listFilter
          .filter,
        ...values
      }
    };
    await dispatch(
      getFilterViolationScheduleThunk({
        listFilter: filter,
        modalType: ModalConfigTypes.IdentifiedViolations
      })
    );
  };

  return (
    <BasicTabsFilter<IViolationModalFilter>
      filterList={
        modalConfigs[ModalConfigTypes.IdentifiedViolations].filterList
      }
      isLoading={loading}
      handleFetchSelectOptions={handleFetchSelectOptions}
      onSubmit={handleSubmitFilter}
    />
  );
};
