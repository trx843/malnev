import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEliminationTypicalViolationInfoModel, IEliminationTypicalViolationSettingsModel } from "../../../api/requests/eliminationOfTypicalViolations/types";
import { IGenericFilterConfig } from "../../../components/CustomFilter/interfaces";
import { IdType, IListFilter, Nullable, PageInfo } from "../../../types";
import { InitListFilter } from "./constants";

import {
  IEliminationOfTypicalViolationsStore,
  ITypicalViolationForEliminationFilter,
  LoadingsNames,
} from "./types";



const initialState: IEliminationOfTypicalViolationsStore = {
  identifiedTypicalViolations: [],
  listFilter: InitListFilter,
  filterConfig: { filterList: [] },
  settingsPsp: null,
  selectedIdentifiedTypicalViolations: [],
  selectedIdentifiedViolationId: null,
  eliminationTypicalViolationInfo: [],
  pageInfo: {
    pageNumber: 1,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
  },
  [LoadingsNames.isTypicalViolationsLoading]: false,
  [LoadingsNames.isSettingsPspLoading]: false,
  [LoadingsNames.isPendingAction]: false,
};

export const eliminationOfTypicalViolations = createSlice({
  name: "eliminationOfTypicalViolations",
  initialState,
  reducers: {
    setIdentifiedTypicalViolations(state, action: PayloadAction<any[]>) {
      state.identifiedTypicalViolations = action.payload;
    },
    setListFilter: (
      state,
      action: PayloadAction<IListFilter<ITypicalViolationForEliminationFilter>>
    ) => {
      state.listFilter = action.payload;
    },
    setFilterConfig: (state, action: PayloadAction<IGenericFilterConfig>) => {
      state.filterConfig = action.payload;
    },
    setSettingsPsp: (
      state,
      action: PayloadAction<Nullable<IEliminationTypicalViolationSettingsModel>>
    ) => {
      state.settingsPsp = action.payload;
    },
    setSelectedIdentifiedTypicalViolations: (
      state,
      action: PayloadAction<any[]>
    ) => {
      state.selectedIdentifiedTypicalViolations = action.payload;
    },
    setPageInfo: (state, action: PayloadAction<PageInfo>) => {
      state.pageInfo = action.payload;
    },
    setLoading: (
      state,
      action: PayloadAction<{ name: LoadingsNames; value: boolean }>
    ) => {
      state[action.payload.name] = action.payload.value;
    },
    setSelectedIdentifiedViolationId(state, action: PayloadAction<Nullable<IdType>>) {
      state.selectedIdentifiedViolationId = action.payload;
    },
    setEliminationTypicalViolationInfo(state, action: PayloadAction<IEliminationTypicalViolationInfoModel[]>) {
      state.eliminationTypicalViolationInfo = action.payload;
    },
  },
});

export const {
  setIdentifiedTypicalViolations,
  setListFilter,
  setFilterConfig,
  setSettingsPsp,
  setSelectedIdentifiedTypicalViolations,
  setPageInfo,
  setLoading,
  setSelectedIdentifiedViolationId,
  setEliminationTypicalViolationInfo
} = eliminationOfTypicalViolations.actions;

export const eliminationOfTypicalViolationsReducer =
  eliminationOfTypicalViolations.reducer;
