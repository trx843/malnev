import { createAsyncThunk } from "@reduxjs/toolkit";
import _ from "lodash";
import { GenericResponse, PagedModel, StateType } from "../../../types";
import { ListFilterBase } from "../../../interfaces";
import {
  getCardEvents,
  getCardEventsFilters,
  getEvents,
  getEventTypes,
  postCtrlEventHandle,
} from "api/requests/pspControl/ctrlEvents";
import {
  CtrlEventHandleTypeEnum,
  CtrlEventsItem,
} from "pages/PspControl/CtrlEventsPage/types";
import { SqlTree } from "classes/SqlTree";
import {
  GetCtrlEventsCardFilterBody,
  GetCtrlEventsCardParams,
} from "api/params/get-ctrlevents-card.params";
import {
  CtrlCardEvents,
  CtrlEventsCardFilterValues,
} from "api/responses/get-ctrlevents-card";

// получить список событий
export const getEventsTC = createAsyncThunk<
  PagedModel<CtrlEventsItem>,
  ListFilterBase,
  { rejectValue: any; state: StateType }
>("pspControl/ctrlevents/getEvents", async (filter, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const response = await getEvents(filter);
    return response;
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const getEventTypesTC = createAsyncThunk<
  Array<SqlTree>,
  undefined,
  { rejectValue: any; state: StateType }
>("pspControl/ctrlevents/getEventTypes", async (_, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const response = await getEventTypes();
    return response;
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const сtrlEventHandleTC = createAsyncThunk<
  GenericResponse<CtrlEventsItem>,
  { event: CtrlEventsItem; handleType: CtrlEventHandleTypeEnum },
  { rejectValue: any; state: StateType }
>(
  "pspControl/ctrlevents/сtrlEventHandle",
  async ({ event, handleType }, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
      const response = await postCtrlEventHandle(event, handleType);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const сtrlCardsEventHandleTC = createAsyncThunk<
  GenericResponse<CtrlEventsItem>,
  { event: CtrlEventsItem; handleType: CtrlEventHandleTypeEnum },
  { rejectValue: any; state: StateType }
>(
  "pspControl/ctrlevents/сtrlCardsEventHandle",
  async ({ event, handleType }, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
      const response = await postCtrlEventHandle(event, handleType);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getCtrlCardEventsFiltersTC = createAsyncThunk<
  CtrlEventsCardFilterValues,
  { userId: string },
  { rejectValue: string; state: StateType }
>("events/getCtrlCardEventsFilters", async ({ userId }, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const response = await getCardEventsFilters(userId);
    return response;
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const getCtrlCardEventsTC = createAsyncThunk<
  CtrlCardEvents,
  { params: GetCtrlEventsCardParams; filter: GetCtrlEventsCardFilterBody },
  { rejectValue: string; state: StateType }
>("events/getCtrlCardEvents", async ({ params, filter }, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const response = await getCardEvents(params, filter);
    return response;
  } catch (e) {
    return rejectWithValue(e);
  }
});
