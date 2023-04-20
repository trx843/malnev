import update from "immutability-helper";
import moment from "moment";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventsTC, getEventTypesTC } from "thunks/pspControl/ctrlEvents";
import { formatDateRange } from "utils";
import {
  CtrlEventsStateType,
  setCurrentEventTypesKeys,
  setDateRange,
  setFilter,
  setPageInfo,
  setSelectedNode,
} from "../../../slices/pspControl/ctrlEvents";
import { OwnedType, StateType, TreeInfoType } from "../../../types";
import { IFormValues } from "./components/Filter/constants";
import { serializeValues } from "./components/Filter/utils";

const usePresenter = () => {
  const dispatch = useDispatch();

  const {
    eventsList,
    pageInfo,
    selectedTreeNode,
    ctrlIsLoading: isLoading,
    appliedFilter,
    eventTypesTree,
    currentEventTypesKeys,
    dateRange,
  } = useSelector<StateType, CtrlEventsStateType>((state) => state.ctrlEvents);

  useEffect(() => {
    dispatch(getEventsTC(appliedFilter));
  }, [appliedFilter]);

  const onSelectTreeNode = (selectedKeys: React.Key[], info: TreeInfoType) => {
    dispatch(setSelectedNode(selectedKeys.length > 0 ? info.node : undefined));
  };

  const handleChangePagination = (page: number) => {
    dispatch(
      setPageInfo({
        ...pageInfo,
        pageNumber: page,
      })
    );
  };

  const handleOwnedFilterChangedCallback = (type: OwnedType) => {
    const updatedFilter = update(appliedFilter, {
      filter: {
        treeFilter: {
          isOwn: { $set: type },
        },
      },
    });
    dispatch(setFilter(updatedFilter));
  };

  const handleSubmitFilterForm = useCallback(
    (values: IFormValues) => {
      dispatch(setDateRange([values.dateRange[0], values.dateRange[1]]));
      dispatch(setCurrentEventTypesKeys(values.eventTypes));
      const serializedValues = serializeValues(values);
      const newFilter = {
        ...appliedFilter,
        filter: {
          ...appliedFilter.filter,
          ...serializedValues,
        },
      };
      dispatch(setFilter(newFilter));
    },
    [appliedFilter]
  );

  //page
  useEffect(() => {
    dispatch(getEventTypesTC());
  }, []);

  return {
    eventsList,
    handleOwnedFilterChangedCallback,
    isLoading,
    pageInfo,
    selectedTreeNode,
    onSelectTreeNode,
    handleChangePagination,
    handleSubmitFilterForm,
    eventTypesTree,
    appliedFilter,
    currentEventTypesKeys,
    dateRange,
  };
};

export default usePresenter;
