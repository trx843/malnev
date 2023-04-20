import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PageInfo } from "../../../types";
import { IProgramKsPpIlListModel } from "./types";
import { listFilter, pageInfo } from "./constants";
import {  ListFilterBase } from "interfaces";
import { DefaultIsAsc, DefaultSortedFieldValue } from "pages/PspControl/KsPpILPrograms/constants";

export enum LoadingsNames {
  isKsPpILProgramListLoading = "isKsPpILProgramListLoading",
}

export interface IKsPpILProgramsStore {
  ksPpILProgramList: IProgramKsPpIlListModel[];
  pageInfo: PageInfo;
  listFilter: ListFilterBase;
  [LoadingsNames.isKsPpILProgramListLoading]: boolean;
}

const initialState: IKsPpILProgramsStore = {
  ksPpILProgramList: [],
  pageInfo,
  listFilter: {
    ...listFilter,
    sortedField: DefaultSortedFieldValue,
    isSortAsc : DefaultIsAsc,
  },
  [LoadingsNames.isKsPpILProgramListLoading]: false,
};

export const ksPpILPrograms = createSlice({
  name: "ksPpILPrograms",
  initialState,
  reducers: {
    setKsPpILProgramList: (
      state,
      action: PayloadAction<IProgramKsPpIlListModel[]>
    ) => {
      state.ksPpILProgramList = action.payload;
    },
    setPageInfo: (state, action: PayloadAction<PageInfo>) => {
      state.pageInfo = action.payload;
    },
    setListFilter: (state, action: PayloadAction<ListFilterBase>) => {
      state.listFilter = action.payload;
    },
    setLoading: (
      state,
      action: PayloadAction<{ name: LoadingsNames; value: boolean }>
    ) => {
      state[action.payload.name] = action.payload.value;
    },
  },
});

export const { setKsPpILProgramList, setPageInfo, setListFilter, setLoading } =
  ksPpILPrograms.actions;

export const ksPpILProgramsReducer = ksPpILPrograms.reducer;
