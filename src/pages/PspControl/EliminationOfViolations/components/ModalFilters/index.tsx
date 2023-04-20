import React from "react";
import { useDispatch, useSelector } from "react-redux";
import update from "immutability-helper";
import { StateType } from "../../../../../types";
import { ModalCustomFilter } from "../../../../../components/ModalCustomFilter";
import { getValuesFromFilters } from "../../../../../utils";
import { IEliminationOfViolationsStore } from "../../../../../slices/pspControl/eliminationOfViolations/types";
import {
  getEliminationFilterDescriptionThunk,
  getViolationsThunk,
} from "../../../../../thunks/pspControl/eliminationOfViolations";
import { getFilterValues } from "../../../../../actions/customfilter";
import { setAppliedFilter } from "../../../../../slices/pspControl/eliminationOfViolations";

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
    IEliminationOfViolationsStore
  >((state) => state.eliminationOfViolations);

  React.useEffect(() => {
    // Запрос на загрузку полей при открытии модального окна
    dispatch(getEliminationFilterDescriptionThunk());
  }, []);

  const handleFetchSelect = async (
    name: string,
    values: any,
    controller: string
  ) => {
    const response = await getFilterValues(name, controller, {
      ...appliedFilter,
      sortedField: name,
      filter: { ...appliedFilter.filter, ...values },
    });

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
    dispatch(getViolationsThunk(updatedFilter));
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
    dispatch(getViolationsThunk(updatedFilter));
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
