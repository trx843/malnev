import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGenericFilterConfig } from "../../../components/CustomFilter/interfaces";
import { ListFilterBase, SelectedNode } from "../../../interfaces";
import { zeroGuid } from "../../../utils";
import { IEliminationOfViolationsStore, LoadingsNames } from "./types";

const initialState: IEliminationOfViolationsStore = {
  identifiedViolations: [],
  selectedTreeNode: {
    id: zeroGuid,
    nodeId: 0,
    title: "",
    key: "all",
    type: "all",
    owned: null,
    isSiType: false,
  },
  appliedFilter: {
    filter: {
      treeFilter: {
        nodePath: "all",
        isOwn: null,
      },
    },
    sortedField: "",
    isSortAsc: true,
    pageIndex: 1,
  },
  filterConfig: {
    filterList: [],
  },
  [LoadingsNames.isViolationsLoading]: false,
};

export const eliminationOfViolations = createSlice({
  name: "eliminationOfViolations",
  initialState,
  reducers: {
    setIdentifiedViolations(state, action: PayloadAction<any[]>) {
      state.identifiedViolations = action.payload;
    },
    setSelectedTreeNode: (state, action: PayloadAction<SelectedNode>) => {
      state.selectedTreeNode = action.payload;
    },
    setAppliedFilter: (state, action: PayloadAction<ListFilterBase>) => {
      state.appliedFilter = action.payload;
    },
    setFilterConfig: (state, action: PayloadAction<IGenericFilterConfig>) => {
      state.filterConfig = action.payload;
    },
    setLoading: (
      state,
      action: PayloadAction<{ name: LoadingsNames; value: boolean }>
    ) => {
      state[action.payload.name] = action.payload.value;
    },
  },
});

export const {
  setIdentifiedViolations,
  setSelectedTreeNode,
  setAppliedFilter,
  setFilterConfig,
  setLoading,
} = eliminationOfViolations.actions;

export const eliminationOfViolationsReducer = eliminationOfViolations.reducer;
