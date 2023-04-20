import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { FilterDocumentType, FilterStatusType, HistoryResponseType, HistoryRowType } from "api/responses/importAttemptsHistory";
import moment from "moment";
import { getDocumentTypesTC, getHistoryTC, getStatusListTC } from "thunks/importAttemptsHistory";
import { StateType } from "types";

const initialState = {
    rowData: [] as Array<HistoryRowType>,
    modifiedRowData: [] as Array<HistoryRowType>,
    documentTypes: [] as Array<FilterDocumentType>,
    statuses: [] as Array<FilterStatusType>,
    startTime: moment().startOf('month').format("YYYY-MM-DD HH:mm:ss"),
    finishTime: moment().endOf('day').format("YYYY-MM-DD HH:mm:ss"),
    documentTypeId: null as null | number,
    statusId: null as null | number,
    pagesAmount: 1 as number,
    currentPage: 1 as number,
    selectedRow: null as null | HistoryRowType,
    isLoading: false,
    isSelectLoading: false,
    errorText: "",
};

const importAttemptsHistorySlice = createSlice({
    name: "importAttemptsHistorySlice",
    initialState,
    reducers: {
        clearState: (state) => {
            state.errorText = ""
            state.modifiedRowData = [];
        },
        setStartTime: (state, { payload }) => { state.startTime = payload },
        setFinishTime: (state, { payload }) => { state.finishTime = payload },
        setDocumentTypeId: (state, { payload }) => { state.documentTypeId = payload },
        setStatusId: (state, { payload }) => { state.statusId = payload },
        setCurrentPage: (state, { payload }) => { state.currentPage = payload },
        setSelectedRow: (state, { payload }) => { state.selectedRow = payload },
        setModifiedRowData: (state, { payload }) => { state.modifiedRowData = payload },
    },
    extraReducers: builder => {
        builder
            .addCase(getHistoryTC.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getHistoryTC.fulfilled, (state, action: PayloadAction<HistoryResponseType>) => {
                state.rowData = action.payload.entities;
                state.currentPage = action.payload.pageInfo.pageNumber;
                state.pagesAmount = action.payload.pageInfo.totalPages;
                state.isLoading = false;
            })
            .addCase(getHistoryTC.rejected, (state, action) => {
                if (action.payload) {
                    state.errorText = action.payload;
                }
                state.isLoading = false;
            })
            .addCase(getDocumentTypesTC.pending, (state) => {
                state.isSelectLoading = true;
            })
            .addCase(getDocumentTypesTC.fulfilled, (state, action) => {
                state.documentTypes = action.payload;
                state.isSelectLoading = false;
            })
            .addCase(getDocumentTypesTC.rejected, (state, action) => {
                if (action.payload) {
                    state.errorText = action.payload;
                }
                state.isSelectLoading = false;
            })
            .addCase(getStatusListTC.pending, (state) => {
                state.isSelectLoading = true;
            })
            .addCase(getStatusListTC.fulfilled, (state, action) => {
                state.statuses = action.payload;
                state.isSelectLoading = false;
            })
            .addCase(getStatusListTC.rejected, (state, action) => {
                if (action.payload) {
                    state.errorText = action.payload;
                }
                state.isSelectLoading = false;
            })
    },
});

export type ImportAttemptsHistoryStateType = typeof initialState;
export default importAttemptsHistorySlice.reducer;
export const importAttemptsHistoryActions = importAttemptsHistorySlice.actions;
export const importAttemptsHistory = (state: StateType): ImportAttemptsHistoryStateType => state.importAttemptsHistory;
