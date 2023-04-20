import update from "immutability-helper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ListFilterBase, SelectedNode } from "../../interfaces";
import { VerificationItem } from "../../components/VerificationActs/classes";
import { zeroGuid } from "../../utils";
import { Nullable, PagedModel } from "../../types";
import { IGenericFilterConfig } from "../../components/CustomFilter/interfaces";
import {
  deleteVerificationActThunk,
  getVerificationActsPage,
} from "../../thunks/verificationActs";
import {
  DefaultIsAsc,
  DefaultSortedFieldValue,
} from "containers/VerificationActs/constants";

export interface VerificationActsStore {
  selectedTreeNode: SelectedNode;
  appliedFilter: ListFilterBase;
  page: PagedModel<VerificationItem>;
  filterConfig: IGenericFilterConfig;
  pending: boolean;
  verificationAct: Nullable<VerificationItem>;
  isCreatingPlan: boolean;
}

const initialState: VerificationActsStore = {
  pending: false,
  filterConfig: {
    filterList: [],
  },
  page: {
    entities: [],
    pageInfo: {
      totalItems: 0,
      totalPages: 0,
      pageSize: 0,
      pageNumber: 1,
    },
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
      hasNotClassified: false,
    },
    sortedField: DefaultSortedFieldValue,
    isSortAsc: DefaultIsAsc,
    pageIndex: 1,
  },
  verificationAct: null,
  isCreatingPlan: false,
};

const verificationActs = createSlice({
  name: "verificationActs",
  initialState,
  reducers: {
    setVerificationActsPending(state, action: PayloadAction<boolean>) {
      state.pending = action.payload;
    },
    setCustomFilterConfig(state, action: PayloadAction<IGenericFilterConfig>) {
      state.filterConfig = action.payload;
    },
    setSelectedTreeNode(
      state: VerificationActsStore,
      action: PayloadAction<SelectedNode>
    ) {
      state.selectedTreeNode = action.payload;
    },
    setAppliedFilter(
      state: VerificationActsStore,
      action: PayloadAction<ListFilterBase>
    ) {
      state.appliedFilter = action.payload;
    },
    setVerificationPage(
      state: VerificationActsStore,
      action: PayloadAction<PagedModel<VerificationItem>>
    ) {
      state.page = action.payload;
      state.appliedFilter.pageIndex = action.payload.pageInfo.pageNumber;
      state.pending = false;
    },
    setVerificationAct(
      state: VerificationActsStore,
      action: PayloadAction<Nullable<VerificationItem>>
    ) {
      state.verificationAct = action.payload;
    },
    seIisCreatingPlan(
      state: VerificationActsStore,
      action: PayloadAction<boolean>
    ) {
      state.isCreatingPlan = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getVerificationActsPage.pending, (state, action) => {
      state.pending = true;
    });
    builder.addCase(getVerificationActsPage.fulfilled, (state, action) => {
      state.pending = false;
    });
    builder.addCase(getVerificationActsPage.rejected, (state, action) => {
      state.pending = false;
    });
    builder.addCase(deleteVerificationActThunk.fulfilled, (state, action) => {
      const index = state.page.entities.findIndex(
        (item) => item.id === action.payload
      );

      if (index === -1) {
        return;
      }

      state.page.entities = update(state.page.entities, {
        $splice: [[index, 1]],
      });
    });
  },
});

export const {
  setVerificationActsPending,
  setSelectedTreeNode,
  setVerificationPage,
  setCustomFilterConfig,
  setAppliedFilter,
  setVerificationAct,
  seIisCreatingPlan,
} = verificationActs.actions;

export default verificationActs.reducer;
