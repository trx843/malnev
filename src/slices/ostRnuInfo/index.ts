import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SqlTree } from "../../classes/SqlTree";
import { Nullable } from "../../types";
import { InfoRequestModel, IOstRnuCountModel } from "./types";
import { getInfoRequest } from "./utils";

export interface IOstRnuInfoStore {
  isOstRnuInfoModalVisible: boolean;
  ostRnuInfo: IOstRnuCountModel[]; // массив данных для таблицы
  infoRequest: Nullable<InfoRequestModel>;
  isOstRnuInfoLoading: boolean;
}

const initialState: IOstRnuInfoStore = {
  isOstRnuInfoModalVisible: false,
  ostRnuInfo: [],
  infoRequest: null,
  isOstRnuInfoLoading: false,
};

export const ostRnuInfo = createSlice({
  name: "ostRnuInfo",
  initialState,
  reducers: {
    toggleOstRnuInfoModalVisibility: (state) => {
      state.isOstRnuInfoModalVisible = !state.isOstRnuInfoModalVisible;
    },
    setOstRnuInfo: (state, action: PayloadAction<IOstRnuCountModel[]>) => {
      state.ostRnuInfo = action.payload;
    },
    setInfoRequest: (state, action: PayloadAction<SqlTree>) => {
      state.infoRequest = getInfoRequest(action.payload);
    },
    setIsOstRnuInfoLoading: (state, action: PayloadAction<boolean>) => {
      state.isOstRnuInfoLoading = action.payload;
    },
  },
});

export const {
  toggleOstRnuInfoModalVisibility,
  setOstRnuInfo,
  setInfoRequest,
  setIsOstRnuInfoLoading,
} = ostRnuInfo.actions;

export const ostRnuInfoReducer = ostRnuInfo.reducer;
