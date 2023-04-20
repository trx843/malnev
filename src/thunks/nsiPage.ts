import { createAsyncThunk } from "@reduxjs/toolkit";
import { SchemeDataType, SchemeDataValuesType, SchemeType, SchemeWithRowType } from "../api/params/nsi-page.params";
import { nsiApi } from "../api/requests/nsiPage";
import { AllSchemesResponseType, SchemeDataResponseType, SelectorsResponseType } from "../api/responses/nsi-page.response";
import { ErrorType } from "../slices/nsi";
import { GenericResponse, StateType } from "../types";

export const getAllSchemesTC = createAsyncThunk< //ТС в конце названия санки добавлено что бы отделять санки от методов редьюсера в коде
  AllSchemesResponseType,
  undefined,
  { rejectValue: string; state: StateType }
>("nsi/getAllSchemes", async (_, { rejectWithValue }) => {
  try {
    const response = await nsiApi.getAllSchemes();
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
>("nsi/getSchemeData", async (selectedScheme, { rejectWithValue }) => {
  try {
    const response = await nsiApi.getSchemeData(selectedScheme);
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
>("nsi/getDataSelectors", async (selectedScheme, { rejectWithValue }) => {
  try {
    const response = await nsiApi.getSelectorsForDifferentColumns(selectedScheme);
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
>("nsi/addNewRowToSchemeData", async (schemeWithNewRow, { rejectWithValue, dispatch, getState }) => {
  const { selectedScheme } = getState().nsi;
  try {
    const response = await nsiApi.addNewRowToSchemeData(schemeWithNewRow);
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
>("nsi/updateRowInSchemeData", async (schemeWithNewRow, { rejectWithValue, dispatch, getState }) => {
  const { selectedScheme } = getState().nsi;
  try {
    const response = await nsiApi.updateRowInSchemeData(schemeWithNewRow);
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
  GenericResponse<Array<any>>,
  { rowId: any, scheme: SchemeType },
  { rejectValue: string; state: StateType }
>("nsi/deleteRowInSchemeData", async ({ rowId, scheme }, { rejectWithValue, dispatch, getState }) => {
  const { selectedScheme } = getState().nsi;
  try {
    const response = await nsiApi.deleteRowInSchemeData(rowId, scheme);
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