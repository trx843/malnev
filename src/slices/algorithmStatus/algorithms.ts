import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import {
  GetAlgHistoryFilterParams,
  GetAlgHistoryParams,
} from "../../api/params/get-alg-history.params";
import {
  AlgConfigurationCategory,
  AlgTemplatesResponse,
} from "../../api/responses/get-alg-configuration.response";
import { GetAlgHistoryParamsResponse } from "../../api/responses/get-alg-history.response";
import { AlgorithmTreeData } from "../../api/responses/get-algorithm-tree.response";
import { PageInfo } from "../../types";

export enum AlgorithmModalsIds {
  AlgConfiguration = "algConfiguration",
  AlgOperands = "algOperands",
}

export interface AlgorithmsSlice {
  treeData: AlgorithmTreeData | undefined;
  selectedAlgorithmId: string;
  filterParams: GetAlgHistoryParams;
  openedModal: AlgorithmModalsIds | "";

  algorithmHistory: GetAlgHistoryParamsResponse | null;
  pagination: PageInfo;
  configuration: AlgConfigurationCategory[];
  templates: AlgTemplatesResponse[];
}

const dateFormat = "YYYY-MM-DDTHH:mm:ssZ";

const defaultFilters = {
  filter: {
    startTime: moment().startOf("day").format(dateFormat),
    endTime: moment().endOf("day").format(dateFormat),
    status: null,
    recalc: null,
  },
  sortedField: "StartTime",
  isSortAsc: true,
  pageIndex: 1,
};

const initialState: AlgorithmsSlice = {
  treeData: undefined,
  selectedAlgorithmId: "",
  filterParams: defaultFilters,
  openedModal: "",
  algorithmHistory: null,
  pagination: {
    pageNumber: 1,
    pageSize: 0,
    totalItems: 0,
    totalPages: 1,
  },
  configuration: [],
  templates: [],
};

const algorithms = createSlice({
  name: "algorithms",
  initialState,
  reducers: {
    setTreeData(state, action: PayloadAction<AlgorithmTreeData>) {
      state.treeData = action.payload;
    },
    setSelectedAlgorithmId(state, action: PayloadAction<string>) {
      state.selectedAlgorithmId = action.payload;
    },
    setOpenedModalId(state, action: PayloadAction<AlgorithmModalsIds | "">) {
      state.openedModal = action.payload;
    },
    setFilterParams(state, action: PayloadAction<GetAlgHistoryFilterParams>) {
      state.filterParams.filter = action.payload;
    },
    setPageIndex(state, action: PayloadAction<number>) {
      state.filterParams.pageIndex = action.payload;
    },
    setPagination(state, action: PayloadAction<PageInfo>) {
      state.pagination = action.payload;
    },
    setAlgorithmHistory(
      state,
      action: PayloadAction<GetAlgHistoryParamsResponse | null>
    ) {
      state.algorithmHistory = action.payload;
    },
    setConfiguration(state, action: PayloadAction<AlgConfigurationCategory[]>) {
      state.configuration = action.payload;
    },
    setTemplates(state, action: PayloadAction<AlgTemplatesResponse[]>) {
      state.templates = action.payload;
    },
  },
});

export const {
  setTreeData,
  setSelectedAlgorithmId,
  setOpenedModalId,
  setFilterParams,
  setAlgorithmHistory,
  setPageIndex,
  setPagination,
  setConfiguration,
  setTemplates,
} = algorithms.actions;

export default algorithms.reducer;
