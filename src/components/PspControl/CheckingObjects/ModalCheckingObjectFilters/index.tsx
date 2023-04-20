import React, { FC, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import update from "immutability-helper";

import { ModalCustomFilter } from "../../../ModalCustomFilter";
import { StateType } from "../../../../types";
import { IGenericFilterConfig } from "../../../CustomFilter/interfaces";
import { SelectedNode } from "../../../../interfaces";
import {
  ICheckingObjectsStore,
  setAppliedFilter,
  setCustomFilterConfig,
} from "../../../../slices/pspControl/checkingObjects";
import { getFilter, getFilterValues } from "../../../../actions/customfilter";
import { ApiRoutes } from "../../../../api/api-routes.enum";
import { getValuesFromFilters } from "../../../../utils";

interface StateProps {
  filterConfig: IGenericFilterConfig;
  checkingObjectsStore: ICheckingObjectsStore;
  selectedTreeNode: SelectedNode;
}

interface ModalCheckingObjectFiltersProps {
  visible: boolean;
  onClose: () => void;
  resetSelectedTableData: () => void;
}

export const ModalCheckingObjectFilters: FC<
  ModalCheckingObjectFiltersProps
> = ({ onClose, visible, resetSelectedTableData }) => {
  const data = useSelector<StateType, StateProps>((state) => ({
    filterConfig: state.checkingObjects.filterConfig,
    checkingObjectsStore: state.checkingObjects,
    selectedTreeNode: state.customFilter.selectedTreeNode,
  }));
  const dispatch = useDispatch();

  const fetchFilter = useCallback(async () => {
    try {
      const response = await getFilter(ApiRoutes.CheckingObjects);
      if (response) {
        dispatch(setCustomFilterConfig(response));
      }
    } catch (error) {
      console.log(error);
    }
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
      ...data.checkingObjectsStore.appliedFilter,
      sortedField: name,
      filter: { ...data.checkingObjectsStore.appliedFilter.filter, ...values },
    });

    return (
      response?.map((option: string) => ({
        label: option,
        value: option,
      })) || []
    );
  };

  const handleResetFilter = async () => {
    try {
      const updatedFilter = update(data.checkingObjectsStore.appliedFilter, {
        filter: {
          $set: {
            filterModel:
              data.checkingObjectsStore.appliedFilter.filter.filterModel ?? {},
            treeFilter: {
              ...data.checkingObjectsStore.appliedFilter.filter.treeFilter,
              nodePath:
                data.checkingObjectsStore.appliedFilter.filter.treeFilter
                  .nodePath,
            },
          },
        },
      });

      dispatch(setAppliedFilter(updatedFilter));
      resetSelectedTableData();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmitFilter = async (values: any) => {
    try {
      const updatedFilter = update(data.checkingObjectsStore.appliedFilter, {
        filter: {
          $set: {
            ...values,
            treeFilter: {
              ...data.checkingObjectsStore.appliedFilter.filter.treeFilter,
              nodePath:
                data.checkingObjectsStore.appliedFilter.filter.treeFilter
                  .nodePath,
            },
          },
        },
      });

      dispatch(setAppliedFilter(updatedFilter));
      resetSelectedTableData();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ModalCustomFilter
      filterConfig={data.filterConfig}
      filterValues={getValuesFromFilters(
        data.checkingObjectsStore.appliedFilter.filter
      )}
      onReset={handleResetFilter}
      onClose={onClose}
      onFetchSelect={handleFetchSelect}
      onSubmit={handleSubmitFilter}
      visible={visible}
      loading={data.checkingObjectsStore.pending}
    />
  );
};
