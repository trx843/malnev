import React from "react";
import { useDispatch, useSelector } from "react-redux";
import update from "immutability-helper";
import { StateType } from "../../../../../types";
import { ModalCustomFilter } from "../../../../../components/ModalCustomFilter";
import { getValuesFromFilters } from "../../../../../utils";
import { IEliminationOfTypicalViolationsStore } from "../../../../../slices/pspControl/eliminationOfTypicalViolations/types";
import { getFilterValues } from "../../../../../actions/customfilter";
import {
  getTypicalViolationsFilterDescriptionThunk,
  getTypicalViolationsThunk,
} from "thunks/pspControl/eliminationOfTypicalViolations";
import { setListFilter } from "slices/pspControl/eliminationOfTypicalViolations";

interface IModalFiltersProps {
  visible: boolean;
  onClose: () => void;
}

export const ModalFilters: React.FC<IModalFiltersProps> = ({
  onClose,
  visible,
}) => {
  const dispatch = useDispatch();

  const { listFilter, filterConfig } = useSelector<
    StateType,
    IEliminationOfTypicalViolationsStore
  >((state) => state.eliminationOfTypicalViolations);

  React.useEffect(() => {
    // Запрос на загрузку полей при открытии модального окна
    dispatch(getTypicalViolationsFilterDescriptionThunk());
  }, []);

  const handleFetchSelect = async (
    name: string,
    values: any,
    controller: string
  ) => {
    const response = await getFilterValues(name, controller, {
      ...listFilter,
      sortedField: name,
      filter: { ...listFilter.filter, ...values },
    });

    return (
      response?.map((option: string) => ({
        label: option,
        value: option,
      })) || []
    );
  };

  const handleResetFilter = () =>
    dispatch(getTypicalViolationsThunk(listFilter));

  const handleSubmitFilter = (values: any) => {
    const updatedFilter = update(listFilter, {
      filter: {
        $set: {
          ...values,
        },
      },
    });

    dispatch(setListFilter(updatedFilter));
    dispatch(getTypicalViolationsThunk(updatedFilter));
  };

  return (
    <ModalCustomFilter
      filterConfig={filterConfig}
      filterValues={getValuesFromFilters(listFilter.filter as any)}
      onReset={handleResetFilter}
      onClose={onClose}
      onFetchSelect={handleFetchSelect}
      onSubmit={handleSubmitFilter}
      visible={visible}
    />
  );
};
