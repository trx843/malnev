import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilterValues } from "../../../../../../../actions/customfilter";
import {
  IVerificationScheduleCardStore,
  setBaseFilter,
} from "../../../../../../../slices/pspControl/verificationScheduleCard";
import { ICheckingObjectsModalFilter } from "../../../../../../../slices/pspControl/verificationScheduleCard/types";
import { getFilterDescriptionSchedule } from "../../../../../../../thunks/pspControl/verificationScheduleCard";
import { StateType } from "../../../../../../../types";
import { TabsFilter as CustomTabsFilter } from "../../../../../../../components/TabsFilter";
import { getListFilterBaseParams, mapOptions } from "./utils";
import { OwnStatuses } from "slices/pspControl/verificationSchedule/constants";

interface IProps {
  resetSelectedItemsOnCurrentPage: () => void;
}

export const TabsFilter: React.FC<IProps> = ({
  resetSelectedItemsOnCurrentPage,
}) => {
  const dispatch = useDispatch();

  const {
    baseFilter,
    isFilterListLoading,
    filterList,
    verificationScheduleCardInfo,
  } = useSelector<StateType, IVerificationScheduleCardStore>(
    (state) => state.verificationScheduleCard
  );

  React.useEffect(() => {
    dispatch(getFilterDescriptionSchedule());
  }, []);

  const getAdjustedOwnType = (type: OwnStatuses | undefined) => {
    if (type === OwnStatuses.own) return true;
    if (type === OwnStatuses.out) return false;
    return null;
  };

  const handleFetchSelectOptions = async (
    name: string,
    values: any,
    controller: string
  ) => {
    const ownType = verificationScheduleCardInfo?.ownType;

    const ownTypeAdjusted = getAdjustedOwnType(ownType);


    const params = getListFilterBaseParams(name, ownTypeAdjusted, values);
    const response: string[] = await getFilterValues(name, controller, params);

    return mapOptions(response);
  };

  const handleSubmitFilter = (values: ICheckingObjectsModalFilter) => {
    const filter = {
      ...baseFilter,
      filter: values,
    };
    resetSelectedItemsOnCurrentPage();
    dispatch(setBaseFilter(filter));
  };

  return (
    <CustomTabsFilter<ICheckingObjectsModalFilter>
      filterList={filterList}
      isLoading={isFilterListLoading}
      handleFetchSelectOptions={handleFetchSelectOptions}
      onSubmit={handleSubmitFilter}
    />
  );
};
