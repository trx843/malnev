import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGenericFilterConfig } from "../components/CustomFilter/interfaces";
import { ListFilterBase, SelectedNode } from "../interfaces";
import { zeroGuid } from "../utils";

export interface ICustomFilterState {
  filterConfig: IGenericFilterConfig;
  filterData: ListFilterBase;
  baseUrl: string;
  selectedTreeNode: SelectedNode;
}

const initialState: ICustomFilterState = {
  filterConfig: {
    filterList: []
  },
  filterData: {
    filter: {
      treeFilter: {
        nodePath: "all",
        isOwn: null,
      },
    },
    sortedField: "",
    isSortAsc: true,
    pageIndex: 0
  },
  baseUrl: "",
  selectedTreeNode: {
    id: zeroGuid,
    nodeId: 0,
    title: "",
    key: "all",
    type: "all",
    owned: null,
    isSiType: false
  }
};

const customFilter = createSlice({
  name: "customFilter",
  initialState,
  reducers: {
    setCustomFilterConfig(state, action: PayloadAction<IGenericFilterConfig>) {
      state.filterConfig = action.payload;
    },
    setCustomFilterData(state, action: PayloadAction<ListFilterBase>) {
      state.filterData = action.payload;
    },
    setBaseUrlCustomFilter(state, action: PayloadAction<string>) {
      state.baseUrl = action.payload;
    },
    setSelectedNodeCustomFilter(state, action: PayloadAction<SelectedNode>) {
      state.selectedTreeNode = action.payload;
    }
  }
});

export const {
  setCustomFilterConfig,
  setBaseUrlCustomFilter,
  setCustomFilterData,
  setSelectedNodeCustomFilter
} = customFilter.actions;

export default customFilter.reducer;
