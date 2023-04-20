import { createAsyncThunk } from "@reduxjs/toolkit";
import { HistoryFilterType, importAttemptsHistoryApi } from "api/requests/importAttemptsHistory";
import { FilterDocumentType, FilterStatusType, HistoryResponseType } from "api/responses/importAttemptsHistory";
import { StateType } from "../../types";

type ErrorType = { message: string };

export const getHistoryTC = createAsyncThunk<
    HistoryResponseType,
    {
        page: number,
        filters: HistoryFilterType
    },
    { rejectValue: string, state: StateType }
>("importAttemptsHistory/getHistory", async (params, { rejectWithValue }) => {
    try {
        const response = await importAttemptsHistoryApi.getHistory(params.page, params.filters);
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const getDocumentTypesTC = createAsyncThunk<
    Array<FilterDocumentType>,
    undefined,
    { rejectValue: string, state: StateType }
>("importAttemptsHistory/getDocumentTypes", async (_, { rejectWithValue }) => {
    try {
        const response = await importAttemptsHistoryApi.getDocumentTypes();
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const getStatusListTC = createAsyncThunk<
    Array<FilterStatusType>,
    undefined,
    { rejectValue: string, state: StateType }
>("importAttemptsHistory/getStatusList", async (_, { rejectWithValue }) => {
    try {
        const response = await importAttemptsHistoryApi.getStatusList();
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});