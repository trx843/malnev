import { createAsyncThunk } from "@reduxjs/toolkit";
import { StateType } from "../../../types";
import { importAttemptsHistoryCardApi, ImportLogsFilterType } from "api/requests/importAttemptsHistory/importAttemptsHistoryCard";
import { AttemptHeadType, CardResponseType, MessageType } from "api/responses/importAttemptsHistory";

type ErrorType = { message: string };

export const getCardDataTC = createAsyncThunk<
    CardResponseType,
    {
        page: number,
        importAttemptId: string,
        filters: ImportLogsFilterType,
    },
    { rejectValue: string, state: StateType }
>("importAttemptsHistoryCard/getCardData", async (params, { rejectWithValue }) => {
    try {
        const response = await importAttemptsHistoryCardApi.getCardData(params.page, params.importAttemptId, params.filters);
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const getMessageTypesListTC = createAsyncThunk<
    Array<MessageType>,
    undefined,
    { rejectValue: string, state: StateType }
>("importAttemptsHistoryCard/getMessageTypesList", async (_, { rejectWithValue }) => {
    try {
        const response = await importAttemptsHistoryCardApi.getMessageTypesList();
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const getAttemptHeadTC = createAsyncThunk<
    AttemptHeadType,
    string,
    { rejectValue: string, state: StateType }
>("importAttemptsHistoryCard/getAttemptHead", async (importAttemptId, { rejectWithValue }) => {
    try {
        const response = await importAttemptsHistoryCardApi.getAttemptHead(importAttemptId);
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});