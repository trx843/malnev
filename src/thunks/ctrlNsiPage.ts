import { createAsyncThunk } from "@reduxjs/toolkit";
import { ctrlNsiApi } from "api/requests/ctrlNsiPage";
import { ErrorType } from "slices/ctrlNsi";
import { SchemeDataType, SchemeDataValuesType, SchemeType, SchemeWithRowType } from "../api/params/nsi-page.params";
import { AllSchemesResponseType, SchemeDataResponseType, SelectorsResponseType } from "../api/responses/nsi-page.response";
import { GenericResponse, StateType } from "../types";

export const getAllSchemesTC = createAsyncThunk< //ТС в конце названия санки добавлено что бы отделять санки от методов редьюсера в коде
    AllSchemesResponseType,
    undefined,
    { rejectValue: string; state: StateType }
>("ctrlNsi/getAllSchemes", async (_, { rejectWithValue }) => {
    try {
        const response = await ctrlNsiApi.getAllSchemes();
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }

});

export const getSchemeDataTC = createAsyncThunk<
    SchemeDataResponseType,
    SchemeType,
    { rejectValue: string; state: StateType }
>("ctrlNsi/getSchemeData", async (selectedScheme, { rejectWithValue }) => {
    try {
        const response = await ctrlNsiApi.getSchemeData(selectedScheme);
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const getDataSelectorsTC = createAsyncThunk<
    SelectorsResponseType,
    SchemeType,
    { rejectValue: string; state: StateType }
>("ctrlNsi/getDataSelectors", async (selectedScheme, { rejectWithValue }) => {
    try {
        const response = await ctrlNsiApi.getSelectorsForDifferentColumns(selectedScheme);
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const createNewRowInSchemeDataTC = createAsyncThunk<
    GenericResponse<Array<SchemeDataValuesType>>,
    SchemeWithRowType,
    { rejectValue: string; state: StateType }
>("ctrlNsi/addNewRowToSchemeData", async (schemeWithNewRow, { rejectWithValue, dispatch, getState }) => {
    const { selectedScheme } = getState().ctrlNsi;
    try {
        const response = await ctrlNsiApi.addNewRowToSchemeData(schemeWithNewRow);
        if (response.data.success) {
            dispatch(getSchemeDataTC(selectedScheme));
        }
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const updateRowInSchemeDataTC = createAsyncThunk<
    GenericResponse<Array<SchemeDataValuesType>>,
    SchemeWithRowType,
    { rejectValue: string; state: StateType }
>("ctrlNsi/updateRowInSchemeData", async (schemeWithNewRow, { rejectWithValue, dispatch, getState }) => {
    const { selectedScheme } = getState().ctrlNsi;
    try {
        const response = await ctrlNsiApi.updateRowInSchemeData(schemeWithNewRow);
        if (response.data.success) {
            dispatch(getSchemeDataTC(selectedScheme));
        }
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const deleteRowInSchemeDataTC = createAsyncThunk<
    GenericResponse<Array<SchemeDataValuesType>>,
    { rowId: any, scheme: SchemeType },
    { rejectValue: string; state: StateType }
>("ctrlNsi/deleteRowInSchemeData", async ({ rowId, scheme }, { rejectWithValue, dispatch, getState }) => {
    const { selectedScheme } = getState().ctrlNsi;
    try {
        const response = await ctrlNsiApi.deleteRowInSchemeData(rowId, scheme);
        if (response.data.success) {
            dispatch(getSchemeDataTC(selectedScheme));
        }
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});