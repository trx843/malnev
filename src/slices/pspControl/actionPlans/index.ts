import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListFilterBase, SelectedNode } from "../../../interfaces";
import { zeroGuid } from "../../../utils";
import { EventPlanItem } from "../../../pages/PspControl/ActionPlans/classes";
import { PageInfo } from "../../../types";
import { IGenericFilterConfig } from "../../../components/CustomFilter/interfaces";
import { DefaultIsAsc, DefaultSortedFieldValue } from "pages/PspControl/ActionPlans/constant";



export enum LoadingsNames {
  isActionPlansLoading = "isActionPlansLoading",
  isDeletingActionPlan = "isDeletingActionPlan"
}

export interface IActionPlansStore {
  actionPlans: EventPlanItem[];
  selectedTreeNode: SelectedNode;
  appliedFilter: ListFilterBase;
  pageInfo: PageInfo;
  filterConfig: IGenericFilterConfig;
  [LoadingsNames.isActionPlansLoading]: boolean;
  [LoadingsNames.isDeletingActionPlan]: boolean;
}

const initialState: IActionPlansStore = {
  actionPlans: [],
  selectedTreeNode: {
    id: zeroGuid,
    nodeId: 0,
    title: "",
    key: "all",
    type: "all",
    owned: null,
    isSiType: false
  },
  appliedFilter: {
    filter: {
      treeFilter: {
        nodePath: "all",
        isOwn: null
      },
    },
    sortedField: DefaultSortedFieldValue,
    isSortAsc: DefaultIsAsc,
    pageIndex: 1
  },
  pageInfo: {
    pageNumber: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0
  },
  filterConfig: {
    filterList: []
  },
  [LoadingsNames.isActionPlansLoading]: false,
  [LoadingsNames.isDeletingActionPlan]: false
};

export const actionPlans = createSlice({
  name: "actionPlans",
  initialState,
  reducers: {
    setActionPlans: (state, action: PayloadAction<EventPlanItem[]>) => {
      state.actionPlans = action.payload;
    },
    setSelectedTreeNode: (state, action: PayloadAction<SelectedNode>) => {
      state.selectedTreeNode = action.payload;
    },
    setAppliedFilter: (state, action: PayloadAction<ListFilterBase>) => {
      state.appliedFilter = action.payload;
    },
    setPageInfo: (state, action: PayloadAction<PageInfo>) => {
      state.pageInfo = action.payload;
    },
    setFilterConfig: (state, action: PayloadAction<IGenericFilterConfig>) => {
      state.filterConfig = action.payload;
    },
    setLoading: (
      state,
      action: PayloadAction<{ name: LoadingsNames; value: boolean }>
    ) => {
      state[action.payload.name] = action.payload.value;
    }
  }
});

export const {
  setActionPlans,
  setSelectedTreeNode,
  setAppliedFilter,
  setPageInfo,
  setFilterConfig,
  setLoading
} = actionPlans.actions;

export const actionPlansReducer = actionPlans.reducer;
