import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CheckingObjectsItem } from "../../components/PspControl/CheckingObjects/classes";
import { ListFilterBase, SelectedNode } from "../../interfaces";
import { zeroGuid } from "../../utils";
import { VerificationScheduleItem } from "../../pages/PspControl/VerificationSchedulePage/classes";
import { IPspcontrolVerificationLevelsResponse } from "../../api/responses/get-pspcontrol-verification-levels.response";
import { IdType, PagedModel, ValueOf } from "../../types";
import { IPspObject } from "../../components/PspControl/PspObject/types";
import {
  ChecksObjectItem,
  OsusItem
} from "../../components/PspControl/PspObject/classes";
import { IGenericFilterConfig } from "../../components/CustomFilter/interfaces";
import { DefaultIsAsc, DefaultSortedFieldValue } from "components/PspControl/CheckingObjects/constants";


export enum DictionariesNames {
  verificationSchedules = "verificationSchedules",
  verificationLevels = "verificationLevels",
  verificationActs = "verificationActs"
}

export interface IVerificationActs {
  id: string;
  label: string;
}

export interface IDictionariesCheckingObjects {
  verificationSchedules: VerificationScheduleItem[];
  verificationLevels: IPspcontrolVerificationLevelsResponse[];
  verificationActs: IVerificationActs[];
}

export interface ICheckingObjectsStore {
  selectedPsps: Array<CheckingObjectsItem>;
  selectedTreeNode: SelectedNode;
  appliedFilter: ListFilterBase;
  pspsHash: Record<IdType, IPspObject>;
  verificationItems: Record<string, ChecksObjectItem[]>;
  osusItems: Record<string, OsusItem[]>;
  dictionaries: IDictionariesCheckingObjects;
  isAddToOrCreateSchedule: boolean;
  filterConfig: IGenericFilterConfig;
  page: PagedModel<CheckingObjectsItem>;
  pending: boolean;
  isCreatePlan: boolean;
  isSiderCollapsed: boolean;
}

const initialState: ICheckingObjectsStore = {
  pending: false,
  page: {
    entities: [],
    pageInfo: {
      totalItems: 1,
      totalPages: 1,
      pageNumber: 1,
      pageSize: 1
    }
  },
  filterConfig: {
    filterList: []
  },
  pspsHash: {},
  selectedPsps: [],
  osusItems: {},
  verificationItems: {},
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
  dictionaries: {
    [DictionariesNames.verificationSchedules]: [],
    [DictionariesNames.verificationLevels]: [],
    [DictionariesNames.verificationActs]: []
  },
  isAddToOrCreateSchedule: false,
  isCreatePlan: false,
  isSiderCollapsed: false,
};

const checkingObjects = createSlice({
  name: "checkingObjects",
  initialState,
  reducers: {
    setCheckingObjectsPending(state, action: PayloadAction<boolean>) {
      state.pending = action.payload;
    },
    setCheckingObjects(
      state,
      action: PayloadAction<PagedModel<CheckingObjectsItem>>
    ) {
      state.page = action.payload;
      state.appliedFilter.pageIndex = action.payload.pageInfo.pageNumber;
      state.pending = false;
    },
    setCustomFilterConfig(state, action: PayloadAction<IGenericFilterConfig>) {
      state.filterConfig = action.payload;
    },
    setSelectedTreeNode(state, action: PayloadAction<SelectedNode>) {
      state.selectedTreeNode = action.payload;
    },
    setSelectedPsps(state, action: PayloadAction<Array<CheckingObjectsItem>>) {
      state.selectedPsps = action.payload;
    },
    setAppliedFilter(state, action: PayloadAction<ListFilterBase>) {
      state.appliedFilter = action.payload;
    },
    setDictionaries(
      state: ICheckingObjectsStore,
      action: PayloadAction<{
        name: DictionariesNames;
        value: ValueOf<IDictionariesCheckingObjects>;
      }>
    ) {
      state.dictionaries = {
        ...state.dictionaries,
        [action.payload.name]: action.payload.value
      };
    },
    setIsAddToOrCreateSchedule(state, action: PayloadAction<boolean>) {
      state.isAddToOrCreateSchedule = action.payload;
    },
    setPspObject(
      state: ICheckingObjectsStore,
      action: PayloadAction<IPspObject>
    ) {
      let { pspsHash } = state;
      pspsHash[action.payload.id] = action.payload;
    },
    setOsusItems(
      state: ICheckingObjectsStore,
      action: PayloadAction<{ id: IdType; items: OsusItem[] }>
    ) {
      let { osusItems } = state;
      osusItems[action.payload.id] = action.payload.items;
    },
    setVerificationItems(
      state: ICheckingObjectsStore,
      action: PayloadAction<{ id: IdType; items: ChecksObjectItem[] }>
    ) {
      let { verificationItems } = state;
      verificationItems[action.payload.id] = action.payload.items;
    },
    setIsCreatePlan(state, action: PayloadAction<boolean>) {
      state.isCreatePlan = action.payload;
    },
    toggleSiderCollapse(state) {
      state.isSiderCollapsed = !state.isSiderCollapsed;
    },
  }
});

export const {
  setCheckingObjectsPending,
  setCheckingObjects,
  setCustomFilterConfig,
  setSelectedTreeNode,
  setSelectedPsps,
  setAppliedFilter,
  setIsAddToOrCreateSchedule,
  setDictionaries,
  setOsusItems,
  setVerificationItems,
  setPspObject,
  setIsCreatePlan,
  toggleSiderCollapse,
} = checkingObjects.actions;

export default checkingObjects.reducer;
