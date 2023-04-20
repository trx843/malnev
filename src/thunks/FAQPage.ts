import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { ApiRoutes } from "../api/api-routes.enum";
import { FAQApi } from "../api/requests/FAQPage";
import { DocTypesResponseType, FileResponseType as FileResponseType, ResponseFAQFilesType } from "../api/responses/faq-page.response";
import { ErrorType, setItemDisabled } from "../slices/FAQ";
import { IdType, StateType } from "../types";
import { apiBase, asciiToUint8Array } from "../utils";

export const getAllFilesTC = createAsyncThunk<
  ResponseFAQFilesType, 
  undefined, 
  {rejectValue: string; state: StateType}
>("FAQ/getAllFilesTC", async (_, {rejectWithValue}) => {
  try {
    const response = await FAQApi.getAllFiles();
    return response.data;
  } catch(e) {
    const error: ErrorType = e;
    return rejectWithValue(
      error.message ? error.message : "unknown error"
    )
  }
});

export const getDocTypesTC = createAsyncThunk<
  Array<DocTypesResponseType>, 
  undefined, 
  {rejectValue: string; state: StateType}
>("FAQ/getDocTypesTC", async (_, {rejectWithValue}) => {
  try {
    const response = await FAQApi.getDocTypes();
    return response.data;
  } catch(e) {
    const error: ErrorType = e;
    return rejectWithValue(
      error.message ? error.message : "unknown error"
    )
  }
});

export const getOneFileTC = createAsyncThunk<void, IdType, {}>("", async (id, thunkApi) => {
  const { dispatch } = thunkApi;
  
  const url = `${apiBase}${ApiRoutes.FAQ}/get-file/${id}`;
  let fileName: string = 'download.xls';
  let error: string = 'Ошибка серверной части';

  dispatch(setItemDisabled(id));

  // Запрос
  let response = await fetch(url, {
    credentials: "include",
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
  });

  // Формирование имени файла
  if(response.ok) {
    let fileNameHeader = response.headers.get("FileName");
    if (fileNameHeader !== null && fileNameHeader !== undefined) {
      let headerSplit = fileNameHeader.split(";");
      if (headerSplit.length > 0) {
        let asciiFile = headerSplit[0];
        let code = asciiToUint8Array(asciiFile);
        fileName = new TextDecoder().decode(code);
      }
    }

    // Выгрузка файла
    let blob = await response.blob();
    const href = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    dispatch(setItemDisabled(id));
  } else {
    let errorHeader = response.headers.get("Error");
    if (errorHeader !== null && errorHeader !== undefined) {
      let headerSplit = errorHeader.split(";");
      if (headerSplit.length > 0) {
        let asciiFile = headerSplit[0];
        let code = asciiToUint8Array(asciiFile);
        error = new TextDecoder().decode(code);
      }
    }

    dispatch(setItemDisabled(id));

    return message.error({
      content: error,
      duration: 4
    });
  }
});

export const addNewFileTC = createAsyncThunk<
  FileResponseType,
  {newFile: any, docType: number},
  {rejectValue: string; state: StateType}
>("FAQ/addNewFileTC", async ({newFile, docType}, {rejectWithValue, dispatch}) => {
  try {
    const response = await FAQApi.addFile(newFile, docType);
    dispatch(getAllFilesTC());
    return response.data;
  } catch(e) {
    const error: ErrorType = e;
    return rejectWithValue(
      error.message ? error.message : "unknown error"
    )
  }
});

export const replaceFileTC = createAsyncThunk<
  FileResponseType,
  {fileId: string | number, newFile: any, docType: number},
  {rejectValue: string; state: StateType}
>("FAQ/replaceFileTC", async ({fileId, newFile, docType}, {rejectWithValue, dispatch}) => {
  try {
    const response = await FAQApi.replaceFile(fileId, newFile, docType);
    dispatch(getAllFilesTC());
    return response.data;
  } catch(e) {
    const error: ErrorType = e;
    return rejectWithValue(
      error.message ? error.message : "unknown error"
    )
  }
});


export const deleteFileTC = createAsyncThunk<
  FileResponseType,
  {fileId: IdType},
  {rejectValue: string; state: StateType}
>("FAQ/deleteFileTC", async ({fileId}, {rejectWithValue, dispatch}) => {
  try {
    const response = await FAQApi.deleteFile(fileId);
    dispatch(getAllFilesTC());
    return response.data;
  } catch(e) {
    const error: ErrorType = e;
    return rejectWithValue(
      error.message ? error.message : "unknown error"
    )
  }
});