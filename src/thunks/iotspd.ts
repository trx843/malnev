import { createAsyncThunk } from "@reduxjs/toolkit";
import { iotspdApi, NewObjectType, ParamType, UpdateObjectType } from "api/requests/iotspd";
import {
    ObjectElementsType,
    ObjectType,
    ResponseDeleteParamType,
    ResponseItemsType,
    ResponseObjectType,
    ResponseParamType,
    SelectItemsType,
} from "api/responses/iotspd";
import { StateType } from "types";
import { apiBase, asciiToUint8Array } from "utils";

type ErrorType = { message: string };

export const getTreeDataTC = createAsyncThunk<
    Array<ObjectType>,
    undefined,
    { rejectValue: string }
>("iotspd/getTreeData", async (_, { rejectWithValue }) => {
    try {
        const response = await iotspdApi.getTreeData();
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const getObjectElementsTC = createAsyncThunk<
    ObjectElementsType,
    string,
    { rejectValue: string }
>("iotspd/getObjectElements", async (tspdTreeKey, { rejectWithValue, dispatch }) => {
    try {
        const response = await iotspdApi.getObjectElements(tspdTreeKey);
        dispatch(getParamsTC(response.data));
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const getObjectItemsTC = createAsyncThunk<
    ResponseItemsType,
    undefined,
    { rejectValue: string }
>("iotspd/getObjectItems", async (_, { rejectWithValue }) => {
    try {
        const response = await iotspdApi.getObjectItems();
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const getParamsTC = createAsyncThunk<
    Array<ParamType>,
    ObjectElementsType,
    { rejectValue: string }
>("iotspd/getParams", async (filters, { rejectWithValue }) => {
    try {
        const response = await iotspdApi.getParams(filters);
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const getParamItemsTC = createAsyncThunk<
    ResponseItemsType,
    undefined,
    { rejectValue: string }
>("iotspd/getParamItems", async (_, { rejectWithValue }) => {
    try {
        const response = await iotspdApi.getParamItems();
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const addParamTC = createAsyncThunk<
    ResponseParamType,
    NewObjectType,
    { rejectValue: string, state: StateType }
>("iotspd/addParam", async (newObject, { rejectWithValue, dispatch, getState }) => {
    try {
        const { codeElems } = getState().iotspd;
        const response = await iotspdApi.addParam(newObject);
        if (response.data.success) {
            dispatch(getTreeDataTC());
            if (codeElems) {
                dispatch(getParamsTC(codeElems));
            };
        }
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const updateParamTC = createAsyncThunk<
    ResponseParamType,
    ParamType,
    { rejectValue: string, state: StateType }
>("iotspd/updateParam", async (param, { rejectWithValue, dispatch, getState }) => {
    try {
        const { selectedParamId, codeElems } = getState().iotspd;
        const response = await iotspdApi.updateParam(param, selectedParamId);
        if (response.data.success) {
            dispatch(getParamsTC(codeElems));
        }
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const deleteParamTC = createAsyncThunk<
    ResponseDeleteParamType,
    undefined,
    { rejectValue: string, state: StateType }
>("iotspd/deleteParam", async (_, { rejectWithValue, dispatch, getState }) => {
    try {
        const { selectedParamId, codeElems } = getState().iotspd;
        const response = await iotspdApi.deleteParam(selectedParamId);
        if (response.data.success) {
            dispatch(getTreeDataTC());
            dispatch(getParamsTC(codeElems));
        }
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const getToNumListTC = createAsyncThunk<
    Array<SelectItemsType>,
    string,
    { rejectValue: string, state: StateType }
>("iotspd/getToNumList", async (toType, { rejectWithValue }) => {
    try {
        const response = await iotspdApi.getToNumList(toType);
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const objectExportTC = createAsyncThunk<
    any,
    ObjectElementsType,//Array<FullParamType>,
    { rejectValue: string, state: StateType }
>("iotspd/getToNumList", async (object, { rejectWithValue }) => {
    const url = `${apiBase}/tspd/export`;
    let fileName: string = "download.xlsx";
    fetch(url, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:
            JSON.stringify(object),//поменял объект под новые требования бэка 18.03
    })
        .then((response) => {
            if (response.ok) {
                let fileNameHeader = response.headers.get("FileName");
                if (fileNameHeader !== null && fileNameHeader !== undefined) {
                    let headerSplit = fileNameHeader.split(";");
                    if (headerSplit.length > 0) {
                        let asciiFile = headerSplit[0];
                        let code = asciiToUint8Array(asciiFile);
                        fileName = new TextDecoder().decode(code);
                    }
                }
                return response.blob();
            }
            return;
        })
        .then((blob: Blob) => {
            const href = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = href;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
        })
        .catch((err) => {
            console.error(err);
        });
});

export const updateObjectTC = createAsyncThunk<
    ResponseObjectType,
    UpdateObjectType,
    { rejectValue: string, state: StateType }
>("iotspd/updateObject", async (object, { rejectWithValue, dispatch }) => {
    try {
        const response = await iotspdApi.updateObject(object);
        if (response.data.success) {
            dispatch(getTreeDataTC());
        }
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const getShortObjectCodeTC = createAsyncThunk<
    string,
    string,
    { rejectValue: string, state: StateType }
>("iotspd/getShortObjectCode", async (tspdTreeKey, { rejectWithValue }) => {
    try {
        const response = await iotspdApi.getShortObjectCode(tspdTreeKey);
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});