import {
  createSlice,
  PayloadAction,
  isFulfilled,
  isRejected,
  isPending,
} from "@reduxjs/toolkit";
import update from "immutability-helper";

import { IGenericFilterConfig } from "components/CustomFilter/interfaces";
import { ListFilterBase, SelectedNode } from "../../../interfaces";
import {
  getAcquaintanceFilterDescriptionThunk,
  getAcquaintanceItemsThunk,
  getAcquaintanceItemsBySelectedTreeFilterItemThunk,
  getAcquaintanceItemsByAppliedFilterThunk,
  setAcquaintanceThunk,
} from "thunks/pspControl/acquaintance";
import { zeroGuid } from "../../../utils";
import { AcquaintanceStore } from "./types";



export const DefaultSortedFieldValue: string = "VerificatedOn";
export const DefaultIsAsc: boolean = false;



const initialState: AcquaintanceStore = {
  items: [],
  loading: false,
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
    isSortAsc: DefaultIsAsc,
    pageIndex: 1,
  },
  pageInfo: {
    pageNumber: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
  },
  filterConfig: {
    filterList: [],
  },
};

export const acquaintance = createSlice({
  name: "acquaintance",
  initialState,
  reducers: {
    setCustomFilterConfig(state, action: PayloadAction<IGenericFilterConfig>) {
      state.filterConfig = action.payload;
    },
    setSelectedTreeNode(
      state: AcquaintanceStore,
      action: PayloadAction<SelectedNode>
    ) {
      state.selectedTreeNode = action.payload;
    },
    setAppliedFilter(
      state: AcquaintanceStore,
      action: PayloadAction<ListFilterBase>
    ) {
      state.appliedFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getAcquaintanceItemsThunk.pending,
      (state, { payload }) => {
       state.loading = true;
      }
    );
    builder.addCase(
      getAcquaintanceItemsThunk.fulfilled,
      (state, { payload }) => {
        state.items = payload.page.entities;
        state.pageInfo = payload.page.pageInfo;
       state.loading = false;
      }
    );
    builder.addCase(
      getAcquaintanceItemsThunk.rejected,
      (state, { payload }) => {
       state.loading = false;
      }
    );
    builder.addCase(
      getAcquaintanceFilterDescriptionThunk.fulfilled,
      (state, { payload }) => {
        state.filterConfig = payload;
      }
    );
    builder.addCase(
      getAcquaintanceItemsBySelectedTreeFilterItemThunk.fulfilled,
      (state, { payload }) => {
        state.selectedTreeNode = payload.selectedNode;
      }
    );
    builder.addCase(
      getAcquaintanceItemsByAppliedFilterThunk.pending,
      (state, { payload }) => {
       state.loading = true;
      }
    );
    builder.addCase(
      getAcquaintanceItemsByAppliedFilterThunk.fulfilled,
      (state, { payload }) => {
        state.appliedFilter = payload.filter;
        state.items = payload.page.entities;
        state.pageInfo = payload.page.pageInfo;
        state.loading = false;
      }
    );
    builder.addCase(
      getAcquaintanceItemsByAppliedFilterThunk.rejected,
      (state, { payload }) => {
       state.loading = false;
      }
    );
    builder.addCase(setAcquaintanceThunk.fulfilled, (state, { payload }) => {
      const index = state.items.findIndex(
        (item) => item.verificationActId === payload.verificationActId
      );

      if (index === -1) {
        return;
      }

      state.items = update(state.items, {
        [index]: { acquainted: { $set: "Ознакомлен" } },
      });
    });
  },
});

export const {
  setAppliedFilter,
  setSelectedTreeNode,
  setCustomFilterConfig,
} = acquaintance.actions;

export const acquaintanceReducer = acquaintance.reducer;
