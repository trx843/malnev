import { FC, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import update from "immutability-helper";

import { IGenericFilterConfig } from "components/CustomFilter/interfaces";
import { AcquaintanceStore } from "slices/pspControl/acquaintance/types";
import { ListFilterBase, SelectedNode } from "../../../../interfaces";
import { StateType } from "../../../../types";
import { ModalCustomFilter } from "components/ModalCustomFilter";
import { getValuesFromFilters } from "../../../../utils";
import { getFilterValues } from "../../../../actions/customfilter";
import {
  getAcquaintanceFilterDescriptionThunk,
  getAcquaintanceItemsByAppliedFilterThunk
} from "thunks/pspControl/acquaintance";

interface StateProps {
  filterConfig: IGenericFilterConfig;
  acquaintance: AcquaintanceStore;
  selectedTreeNode: SelectedNode;
}

interface ModalFiltersProps {
  visible: boolean;
  onClose: () => void;
}

export const ModalAcquaintanceFilters: FC<ModalFiltersProps> = ({
  onClose,
  visible
}) => {
  const dispatch = useDispatch();
  const data = useSelector<StateType, StateProps>(state => ({
    filterConfig: state.acquaintance.filterConfig,
    acquaintance: state.acquaintance,
    selectedTreeNode: state.acquaintance.selectedTreeNode
  }));
  const fetchFilter = useCallback(async () => {
    await dispatch(getAcquaintanceFilterDescriptionThunk());
  }, [visible]);

  useEffect(() => {
    // Запрос на загрузку полей при открытии модального окна
    fetchFilter();
  }, []);

  const handleFetchSelect = async (
    name: string,
    values: any,
    controller: string
  ) => {
    const response = await getFilterValues(name, controller, {
      ...data.acquaintance.appliedFilter,
      sortedField: name,
      filter: {
        ...values,
        treeFilter: {
          ...data.acquaintance.appliedFilter.filter.treeFilter,
          nodePath: data.selectedTreeNode.key
        }
      }
    });

    return response.map((option: string) => ({
      label: option,
      value: option
    }));
  };

  const handleResetFilter = () => {
    const appliedFilter: ListFilterBase = {
      ...data.acquaintance.appliedFilter,
      filter: {
        filterModel:
          data.acquaintance.appliedFilter.filter.filterModel ?? {},
        treeFilter: {
          ...data.acquaintance.appliedFilter.filter.treeFilter,
          nodePath: data.acquaintance.appliedFilter.filter.treeFilter.nodePath
        },
      }
    };
    dispatch(getAcquaintanceItemsByAppliedFilterThunk(appliedFilter));
  };

  const handleSubmitFilter = (values: any) => {
    const updatedFilter = update(data.acquaintance.appliedFilter, {
      filter: {
        $set: {
          ...values,
          treeFilter: {
            ...data.acquaintance.appliedFilter.filter.treeFilter,
            nodePath: data.acquaintance.appliedFilter.filter.treeFilter.nodePath
          }
        }
      }
    });

    dispatch(getAcquaintanceItemsByAppliedFilterThunk(updatedFilter));
  };

  return (
    <ModalCustomFilter
      filterConfig={data.filterConfig}
      filterValues={getValuesFromFilters(
        data.acquaintance.appliedFilter.filter
      )}
      onReset={handleResetFilter}
      onClose={onClose}
      onFetchSelect={handleFetchSelect}
      onSubmit={handleSubmitFilter}
      visible={visible}
    />
  );
};
