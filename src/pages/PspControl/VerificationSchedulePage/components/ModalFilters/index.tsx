import React from "react";
import { useDispatch, useSelector } from "react-redux";
import update from "immutability-helper";
import { StateType } from "../../../../../types";
import { ModalCustomFilter } from "../../../../../components/ModalCustomFilter";
import { getValuesFromFilters } from "../../../../../utils";
import {
  getVerificationSchedulesFilterDescriptionThunk,
  getVerificationSchedulesFilterValues,
} from "../../../../../thunks/pspControl/verificationSchedule";
import {
  IVerificationScheduleStore,
  setAppliedFilter,
} from "../../../../../slices/pspControl/verificationSchedule";

interface IModalFiltersProps {
  visible: boolean;
  onClose: () => void;
}

export const ModalFilters: React.FC<IModalFiltersProps> = ({
  onClose,
  visible,
}) => {
  const dispatch = useDispatch();

  const { appliedFilter, filterConfig } = useSelector<
    StateType,
    IVerificationScheduleStore
  >((state) => state.verificationSchedule);

  React.useEffect(() => {
    // Запрос на загрузку полей при открытии модального окна
    dispatch(getVerificationSchedulesFilterDescriptionThunk());
  }, []);

  const handleFetchSelect = async (
    name: string,
    values: any,
    controller: string
  ) => {
    const response = await getVerificationSchedulesFilterValues(
      name,
      controller,
      {
        ...appliedFilter,
        sortedField: name,
        filter: { ...appliedFilter.filter, ...values },
      }
    );

    return (
      response?.map((option: string) => ({
        label: option,
        value: option,
      })) || []
    );
  };

  const handleResetFilter = () => {
    const updatedFilter = update(appliedFilter, {
      filter: {
        $set: {
          filterModel: appliedFilter.filter.filterModel ?? {},
          treeFilter: {
            ...appliedFilter.filter.treeFilter,
            nodePath: appliedFilter.filter.treeFilter.nodePath,
          },
        },
      },
    });

    dispatch(setAppliedFilter(updatedFilter));
  };

  const handleSubmitFilter = (values: any) => {
    const updatedFilter = update(appliedFilter, {
      filter: {
        $set: {
          ...values,
          treeFilter: {
            ...appliedFilter.filter.treeFilter,
            nodePath: appliedFilter.filter.treeFilter.nodePath,
          },
        },
      },
    });

    dispatch(setAppliedFilter(updatedFilter));
  };

  return (
    <ModalCustomFilter
      filterConfig={filterConfig}
      filterValues={getValuesFromFilters(appliedFilter.filter)}
      onReset={handleResetFilter}
      onClose={onClose}
      onFetchSelect={handleFetchSelect}
      onSubmit={handleSubmitFilter}
      visible={visible}
    />
  );
};
