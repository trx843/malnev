import { createSlice } from "@reduxjs/toolkit"
import { AttemptRowType, MessageType } from "api/responses/importAttemptsHistory";
import { getAttemptHeadTC, getCardDataTC, getMessageTypesListTC } from "thunks/importAttemptsHistory/importAttemptsHistoryCard";
import { StateType } from "types";

const initialState = {
    fileName: "",
    userName: "",
    timeStamp: "",
    rowData: [] as Array<AttemptRowType>,
    modifiedRowData: [] as Array<AttemptRowType>,
    messageTypesTreeData: [] as Array<MessageType>,
    rowNumberId: null as null | number,
    messageTypesId: [] as Array<number>,
    checkedMessageTypeId: [] as Array<string>,
    pagesAmount: 1 as number,
    currentPage: 1 as number,
    isLoading: false,
    isSelectLoading: false,
    errorText: "",
}

const importAttemptsHistoryCardSlice = createSlice({
    name: "importAttemptsHistoryCardSlice",
    initialState,
    reducers: {
        clearState: (state) => {
            state.fileName = "";
            state.userName = "";
            state.timeStamp = "";
            state.rowData = [];
            state.modifiedRowData = [];
            state.messageTypesTreeData = [];
            state.rowNumberId = null;
            state.messageTypesId = [];
            state.checkedMessageTypeId = [];
            state.errorText = "";
        },
        setRowNumberId: (state, { payload }) => { state.rowNumberId = payload },
        setMessageTypesId: (state, { payload }) => { state.messageTypesId = payload },
        setCheckedMessageTypeId: (state, { payload }) => { state.checkedMessageTypeId = payload },
        setCurrentPage: (state, { payload }) => { state.currentPage = payload },
        setModifiedRowData: (state, { payload }) => { state.modifiedRowData = payload },
    },
    extraReducers: builder => {
        builder
            .addCase(getCardDataTC.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCardDataTC.fulfilled, (state, action) => {
                state.rowData = action.payload.entities;
                state.pagesAmount = action.payload.pageInfo.totalPages;
                state.isLoading = false;
            })
            .addCase(getCardDataTC.rejected, (state, action) => {
                if (action.payload) {
                    state.errorText = action.payload;
                }
                state.isLoading = false;
            })
            .addCase(getMessageTypesListTC.pending, (state) => {
                state.isSelectLoading = true;
            })
            .addCase(getMessageTypesListTC.fulfilled, (state, action) => {
                state.messageTypesTreeData = action.payload;
                state.isSelectLoading = false;
            })
            .addCase(getMessageTypesListTC.rejected, (state, action) => {
                if (action.payload) {
                    state.errorText = action.payload;
                }
                state.isSelectLoading = false;
            })
            .addCase(getAttemptHeadTC.fulfilled, (state, action) => {
                state.fileName = action.payload.fileName;
                state.userName = action.payload.userName;
                state.timeStamp = action.payload.timeStamp;
            })
            .addCase(getAttemptHeadTC.rejected, (state, action) => {
                if (action.payload) {
                    state.errorText = action.payload;
                }
            })
    },
})

export type ImportAttemptsHistoryCardStateType = typeof initialState;
export default importAttemptsHistoryCardSlice.reducer;
export const importAttemptsHistoryCardActions = importAttemptsHistoryCardSlice.actions;
export const importAttemptsHistoryCard = (state: StateType): ImportAttemptsHistoryCardStateType => state.importAttemptsHistoryCard;