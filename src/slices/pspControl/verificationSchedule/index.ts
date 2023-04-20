import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListFilterBase, SelectedNode } from "../../../interfaces";
import { zeroGuid } from "../../../utils";
import { IGenericFilterConfig } from "../../../components/CustomFilter/interfaces";
import { PageInfo } from "../../../types";
import { IVerificationSchedulesModel } from "./types";

export const DefaultSortedFieldValue = "CreatedOn";
export const DefaultSortedType = false;

export enum LoadingsNames {
  isVerificationScheduleListLoading = "isVerificationScheduleListLoading",
  isDeletingVerificationSchedule = "isDeletingVerificationSchedule",
}

export interface IVerificationScheduleStore {
  verificationScheduleList: IVerificationSchedulesModel[];
  pageInfo: PageInfo;
  selectedTreeNode: SelectedNode;
  appliedFilter: ListFilterBase;
  filterConfig: IGenericFilterConfig;
  isSiderCollapsed: boolean;
  [LoadingsNames.isVerificationScheduleListLoading]: boolean;
  [LoadingsNames.isDeletingVerificationSchedule]: boolean;
}

const initialState: IVerificationScheduleStore = {
  verificationScheduleList: [],
  pageInfo: {
    pageNumber: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
  },
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
    sortedField: DefaultSortedFieldValue,
    isSortAsc: DefaultSortedType,
    pageIndex: 1,
  },
  filterConfig: {
    filterList: [],
  },
  isSiderCollapsed: false,
  [LoadingsNames.isVerificationScheduleListLoading]: false,
  [LoadingsNames.isDeletingVerificationSchedule]: false,
};

export const verificationSchedule = createSlice({
  name: "verificationSchedule",
  initialState,
  reducers: {
    setVerificationScheduleList: (
      state,
      action: PayloadAction<IVerificationSchedulesModel[]>
    ) => {
      state.verificationScheduleList = action.payload;
    },
    setPageInfo: (state, action: PayloadAction<PageInfo>) => {
      state.pageInfo = action.payload;
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
    toggleSiderCollapse: state => {
      state.isSiderCollapsed = !state.isSiderCollapsed;
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
  setVerificationScheduleList,
  setPageInfo,
  setSelectedTreeNode,
  setAppliedFilter,
  setFilterConfig,
  toggleSiderCollapse,
  setLoading,
} = verificationSchedule.actions;

export const verificationScheduleReducer = verificationSchedule.reducer;
