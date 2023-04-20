import React, { FC, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ModalCustomFilter } from "../../../ModalCustomFilter";
import { StateType } from "../../../../types";
import { IGenericFilterConfig } from "../../../CustomFilter/interfaces";
import { ListFilterBase, SelectedNode } from "../../../../interfaces";
import {
  setAppliedFilter,
  VerificationActsStore,
} from "../../../../slices/verificationActs/verificationActs";
import {
  getFilterValues,
  getVerificationActsFilter,
} from "../../../../thunks/verificationActs";
import { getValuesFromFilters } from "../../../../utils";
import update from "immutability-helper";

interface StateProps {
  filterConfig: IGenericFilterConfig;
  verificationActs: VerificationActsStore;
  selectedTreeNode: SelectedNode;
}

interface ModalVerificationActsFiltersProps {
  visible: boolean;
  onClose: () => void;
}

export const ModalVerificationActsFilters: FC<
  ModalVerificationActsFiltersProps
> = ({ onClose, visible }) => {
  const data = useSelector<StateType, StateProps>((state) => ({
    filterConfig: state.verificationActs.filterConfig,
    verificationActs: state.verificationActs,
    selectedTreeNode: state.verificationActs.selectedTreeNode,
  }));
  const dispatch = useDispatch();

  const fetchFilter = useCallback(async () => {
    await dispatch(getVerificationActsFilter());
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
      ...data.verificationActs.appliedFilter,
      sortedField: name,
      filter: {
        ...values,
        treeFilter: {
          ...data.verificationActs.appliedFilter.filter.treeFilter,
          nodePath: data.selectedTreeNode.key,
        },
      },
    });

    return response.map((option: string) => ({
      label: option,
      value: option,
    }));
  };

  const handleResetFilter = () => {
    const appliedFilter: ListFilterBase = {
      ...data.verificationActs.appliedFilter,
      filter: {
        filterModel:
          data.verificationActs.appliedFilter.filter.filterModel ?? {},
        treeFilter: {
          ...data.verificationActs.appliedFilter.filter.treeFilter,
          nodePath:
            data.verificationActs.appliedFilter.filter.treeFilter.nodePath,
        },
        hasNotClassified: data.verificationActs.appliedFilter.filter.hasNotClassified,
      },
    };
    dispatch(setAppliedFilter(appliedFilter));
  };

  const handleSubmitFilter = (values: any) => {
    const updatedFilter = update(data.verificationActs.appliedFilter, {
      filter: {
        $set: {
          ...values,
          treeFilter: {
            ...data.verificationActs.appliedFilter.filter.treeFilter,
            nodePath:
              data.verificationActs.appliedFilter.filter.treeFilter.nodePath,
          },
        },
      },
    });

    dispatch(setAppliedFilter(updatedFilter));
  };
  return (
    <ModalCustomFilter
      filterConfig={data.filterConfig}
      filterValues={getValuesFromFilters(
        data.verificationActs.appliedFilter.filter
      )}
      onReset={handleResetFilter}
      onClose={onClose}
      onFetchSelect={handleFetchSelect}
      onSubmit={handleSubmitFilter}
      visible={visible}
    />
  );
};
