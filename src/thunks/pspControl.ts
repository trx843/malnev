import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "axios";
import { Dispatch } from "redux";

import {
  IPspObject,
  IVerificationObject
} from "../components/PspControl/PspObject/types";
import { apiBase, asciiToUint8Array } from "../utils";
import { ApiRoutes } from "../api/api-routes.enum";

import { IdType, StateType } from "../types";
import {
  setOsusItems,
  setPspObject,
  setVerificationItems
} from "../slices/pspControl/checkingObjects";

export const getPspObjectThunk = createAsyncThunk<
  IPspObject,
  { id: string },
  {
    dispatch: Dispatch;
    state: StateType;
  }
>("pspControl/getPspObjectThunk", async (params, thunkApi) => {
  const { dispatch, getState } = thunkApi;
  try {
    const pspsHash = getState().checkingObjects.pspsHash;

    const pspId = params.id.toLocaleLowerCase();
    if (!pspsHash[pspId]) {
      const url = `${apiBase}${ApiRoutes.GetPsp}/${params.id}`;
      const response = await axios.get(url);
      if (response.data) {
        dispatch(setPspObject(response.data));
      }
    }
  } catch (error) {
    return message.error({
      content: error,
      duration: 2
    });
  }
});

export const getPspVerificationObjectThunk = createAsyncThunk<
  IVerificationObject[] | void,
  { id: IdType },
  {
    dispatch: Dispatch;
    state: StateType;
  }
>("pspControl/getPspVerificationObjectThunk", async (params, thunkApi) => {
  const { dispatch } = thunkApi;
  try {
    const pspId = String(params.id).toLocaleLowerCase();
    const url = `${apiBase}${ApiRoutes.GetPsp}/${params.id}/verifications`;
    const response = await axios.get(url);
    dispatch(setVerificationItems({ id: pspId, items: response.data || [] }));
  } catch (error) {
    return message.error({
      content: error,
      duration: 2
    });
  }
});

export const getPspSystemControlObjectThunk = createAsyncThunk<
  IVerificationObject[] | void,
  { id: IdType },
  {
    dispatch: Dispatch;
    state: StateType;
  }
>("pspControl/getPspSystemControlObjectThunk", async (params, thunkApi) => {
  const { dispatch, getState } = thunkApi;
  try {
    const pspId = String(params.id).toLocaleLowerCase();
    const items = getState().checkingObjects.osusItems;
    if (!items[pspId] || items[pspId].length === 0) {
      const url = `${apiBase}${ApiRoutes.GetPsp}/${params.id}/osus`;
      const response = await axios.get(url);
      dispatch(setOsusItems({ id: pspId, items: response.data || [] }));
    }
  } catch (error) {
    return message.error({
      content: error,
      duration: 2
    });
  }
});
